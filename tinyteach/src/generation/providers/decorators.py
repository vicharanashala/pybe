"""Decorator stack for ``LLMProvider`` (Concrete Decorator — GoF).

Three decorators are stacked in this order (outermost first):

    @with_cache(...)     # short-circuit identical (system, user) calls
      @with_retry_and_backoff(...)  # handle 429 / timeout / connection
        @with_logging(...)  # log call duration, model, outcome
          <concrete provider>

Why this order: the cache lives at the front so a cached response is
never retried (no point). The retry lives in the middle so the logging
decorator sees the FINAL outcome (after all retries). The logging
decorator is innermost — closest to the wire call — so it can measure
true latency without counting retry backoff.
"""

from __future__ import annotations

import functools
import hashlib
import logging
import threading
import time
from collections import OrderedDict
from collections.abc import Callable
from typing import TypeVar

from openai import APITimeoutError, RateLimitError
from tenacity import (
    Retrying,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from src.config.settings import Settings
from src.domain.errors import (
    ProviderUnavailableError,
)
from src.generation.providers.base import LLMProvider

logger = logging.getLogger(__name__)

# A decorator that preserves the wrapped object's type.
T = TypeVar("T", bound=LLMProvider)


# --- begin: with-cache ----------------------------------------------------
def _cache_key(system: str, user: str) -> str:
    """Stable key for (system, user). Truncates to keep log lines short."""
    h = hashlib.sha256()
    h.update(system.encode("utf-8"))
    h.update(b"\x00")
    h.update(user.encode("utf-8"))
    return h.hexdigest()[:32]


def with_cache(max_entries: int = 128) -> Callable[[T], T]:
    """Return a decorator that caches ``generate(system, user)`` outputs.

    Thread-safe LRU; bounded by ``max_entries``. A ``Settings.gen_*``
    change invalidates by clearing the cache via ``reset_caches()``.
    """

    def decorator(provider: T) -> T:
        cache: OrderedDict[str, str] = OrderedDict()
        lock = threading.Lock()

        original_generate = provider.generate

        @functools.wraps(original_generate)
        def wrapped(system: str, user: str) -> str:
            key = _cache_key(system, user)
            with lock:
                if key in cache:
                    cache.move_to_end(key)
                    logger.info(
                        "llm cache hit",
                        extra={"where": "generation.providers.decorators"},
                    )
                    return cache[key]
            # Outside the lock so two cold misses don't serialise.
            value = original_generate(system, user)
            with lock:
                cache[key] = value
                cache.move_to_end(key)
                while len(cache) > max_entries:
                    cache.popitem(last=False)
            return value

        provider.generate = wrapped  # type: ignore[method-assign]
        # Expose a reset hook for tests.
        provider._clear_cache = lambda: cache.clear()  # type: ignore[attr-defined]
        return provider

    return decorator


# --- end: with-cache ------------------------------------------------------


# --- begin: with-retry ----------------------------------------------------
def with_retry_and_backoff(settings: Settings) -> Callable[[T], T]:
    """Return a decorator that retries on transient failures with backoff.

    Retried exceptions:
    - ``RateLimitError`` (openai 429)
    - ``APITimeoutError``
    - ``httpx.TimeoutException``
    - ``ConnectionError`` / ``OSError``

    NOT retried:
    - ``ProviderUnavailableError`` (auth failed, model missing) — fail loud.
    - ``GenerationTimeoutError`` (the user already waited once).
    - Any other ``GenerationError`` subclass.
    """

    def decorator(provider: T) -> T:
        original_generate = provider.generate

        @functools.wraps(original_generate)
        def wrapped(system: str, user: str) -> str:
            # We build a tenacity Retrying per-call so ``max_retries``
            # and backoff knobs stay dynamic (the user may change them).
            retrying = Retrying(
                stop=stop_after_attempt(max(1, settings.llm_max_retries + 1)),
                wait=wait_exponential(
                    multiplier=settings.llm_retry_initial_backoff_s,
                    max=settings.llm_retry_max_backoff_s,
                ),
                retry=retry_if_exception_type(
                    (RateLimitError, APITimeoutError, TimeoutError, ConnectionError, OSError)
                ),
                reraise=True,
            )
            try:
                for attempt in retrying:
                    with attempt:
                        return original_generate(system, user)
            except (RateLimitError, APITimeoutError) as exc:
                # Final retryable failure — surface as a domain error.
                raise ProviderUnavailableError(
                    f"{provider.name} exhausted {settings.llm_max_retries} retries: {exc!r}"
                ) from exc
            except (TimeoutError, ConnectionError, OSError) as exc:
                raise ProviderUnavailableError(
                    f"{provider.name} network exhausted retries: {exc!r}"
                ) from exc

        provider.generate = wrapped  # type: ignore[method-assign]
        return provider

    return decorator


# --- end: with-retry ------------------------------------------------------


# --- begin: with-logging --------------------------------------------------
def with_logging() -> Callable[[T], T]:
    """Return a decorator that logs every ``generate`` call's duration + outcome."""

    def decorator(provider: T) -> T:
        original_generate = provider.generate

        @functools.wraps(original_generate)
        def wrapped(system: str, user: str) -> str:
            started = time.perf_counter()
            logger.info(
                "llm generate start",
                extra={
                    "where": "generation.providers.decorators",
                    "llm_provider": provider.name,
                    "model": _model_hint(provider),
                },
            )
            try:
                value = original_generate(system, user)
            except Exception as exc:
                elapsed = (time.perf_counter() - started) * 1000.0
                logger.warning(
                    "llm generate failed",
                    extra={
                        "where": "generation.providers.decorators",
                        "llm_provider": provider.name,
                        "elapsed_ms": elapsed,
                        "exception_type": exc.__class__.__name__,
                    },
                )
                raise
            elapsed = (time.perf_counter() - started) * 1000.0
            logger.info(
                "llm generate ok",
                extra={
                    "where": "generation.providers.decorators",
                    "llm_provider": provider.name,
                    "elapsed_ms": elapsed,
                },
            )
            return value

        provider.generate = wrapped  # type: ignore[method-assign]
        return provider

    return decorator


def _model_hint(provider: T) -> str:
    """Pull a model name off the provider if available (for logging)."""
    settings = getattr(provider, "_settings", None)
    return getattr(settings, "llm_model", "")


# --- end: with-logging ---------------------------------------------------


# --- begin: stack-helper --------------------------------------------------
def apply_default_decorators(provider: T, settings: Settings) -> T:
    """Apply the project's default decorator stack to ``provider``.

    Order (outermost first):
        with_cache → with_retry_and_backoff → with_logging → provider
    """
    provider = with_logging()(provider)
    provider = with_retry_and_backoff(settings)(provider)
    provider = with_cache()(provider)
    return provider


# --- end: stack-helper ----------------------------------------------------
