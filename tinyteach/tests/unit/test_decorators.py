"""Tests for the provider decorator stack (cache + retry + logging).

We mock ``generate`` on a stub provider so no real LLM is ever called.
"""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from src.config.settings import Settings
from src.domain.errors import ProviderUnavailableError
from src.generation.providers.base import LLMProvider
from src.generation.providers.decorators import (
    apply_default_decorators,
    with_cache,
    with_logging,
    with_retry_and_backoff,
)

from tests.unit.providers_test_helpers import make_rate_limit_error


# --- begin: fake-provider -------------------------------------------------
class StubProvider(LLMProvider):
    """A provider whose behaviour we control per-test via class attrs."""

    @property
    def name(self) -> str:
        return "stub"

    def is_available(self) -> bool:
        return True

    def generate(self, system: str, user: str) -> str:
        raise NotImplementedError("tests must override StubProvider.generate")


# --- end: fake-provider ---------------------------------------------------


# --- begin: per-test-reset ------------------------------------------------
@pytest.fixture(autouse=True)
def _reset_stub() -> Iterator[None]:
    """Clear class-level fakes between tests."""
    StubProvider.generate = lambda self, system, user: NotImplementedError  # type: ignore[assignment,method-assign]
    yield
    StubProvider.generate = lambda self, system, user: NotImplementedError  # type: ignore[assignment,method-assign]


# --- end: per-test-reset --------------------------------------------------


# --- begin: caching -------------------------------------------------------
def test_with_cache_short_circuits_identical_calls() -> None:
    """Second call with the same (system, user) does NOT invoke the underlying generate."""
    calls: list[tuple[str, str]] = []

    class Counting(StubProvider):
        def generate(self, system: str, user: str) -> str:
            calls.append((system, user))
            return f"answer-for-{user}"

    Counting.generate = Counting.generate.__get__(Counting)  # bind
    counted = Counting.__new__(Counting)
    decorated = with_cache(max_entries=10)(counted)

    decorated.generate("sys", "u1")
    decorated.generate("sys", "u1")
    decorated.generate("sys", "u1")
    assert len(calls) == 1


def test_with_cache_different_calls_miss() -> None:
    """A different (system, user) key produces a fresh underlying call."""

    class Counting(StubProvider):
        def generate(self, system: str, user: str) -> str:
            return f"ans-{user}"

    counted = Counting.__new__(Counting)
    decorated = with_cache(max_entries=10)(counted)
    assert decorated.generate("sys", "u1") == "ans-u1"
    assert decorated.generate("sys", "u2") == "ans-u2"
    assert decorated.generate("other", "u1") == "ans-u1"


def test_with_cache_evicts_oldest_when_full() -> None:
    """LRU evicts oldest entries past ``max_entries``."""
    calls: list[str] = []

    class Counter(StubProvider):
        def generate(self, system: str, user: str) -> str:
            calls.append(user)
            return user

    counter = Counter.__new__(Counter)
    decorated = with_cache(max_entries=2)(counter)
    decorated.generate("s", "u1")
    decorated.generate("s", "u2")
    decorated.generate("s", "u3")  # evicts u1
    decorated.generate("s", "u1")  # cache miss; calls.append('u1')
    assert calls == ["u1", "u2", "u3", "u1"]


def test_with_cache_clear_drops_entries() -> None:
    """``_clear_cache()`` empties the cache (used by tests)."""

    class Counter(StubProvider):
        def generate(self, system: str, user: str) -> str:
            return "x"

    counter = Counter.__new__(Counter)
    decorated = with_cache(max_entries=10)(counter)
    decorated._clear_cache()
    assert decorated.generate("s", "u1") == "x"


# --- end: caching ---------------------------------------------------------


# --- begin: retry ---------------------------------------------------------
def test_with_retry_retries_on_rate_limit_then_succeeds(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """First call raises RateLimitError, second succeeds. Decorator hides the failure."""
    attempts = {"n": 0}

    class Flaky(StubProvider):
        def generate(self, system: str, user: str) -> str:
            attempts["n"] += 1
            if attempts["n"] < 2:
                raise make_rate_limit_error("free tier throttled")
            return "ok"

    flaky = Flaky.__new__(Flaky)
    # Drop backoff to make the test snappy.
    s = Settings(
        llm_max_retries=3, llm_retry_initial_backoff_s=0.001, llm_retry_max_backoff_s=0.001
    )
    decorated = with_retry_and_backoff(s)(flaky)

    assert decorated.generate("s", "u") == "ok"
    assert attempts["n"] == 2


def test_with_retry_exhausts_and_wraps_unavailable(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """``RateLimitError`` past the retry budget is mapped to ``ProviderUnavailableError``."""

    class Always(StubProvider):
        def generate(self, system: str, user: str) -> str:
            raise make_rate_limit_error("forever throttled")

    always = Always.__new__(Always)
    s = Settings(
        llm_max_retries=1, llm_retry_initial_backoff_s=0.001, llm_retry_max_backoff_s=0.001
    )
    decorated = with_retry_and_backoff(s)(always)
    with pytest.raises(ProviderUnavailableError):
        decorated.generate("s", "u")


def test_with_retry_does_not_retry_provider_unavailable() -> None:
    """``ProviderUnavailableError`` is a non-retryable domain error."""
    attempts = {"n": 0}

    class Boom(StubProvider):
        def generate(self, system: str, user: str) -> str:
            attempts["n"] += 1
            raise ProviderUnavailableError("auth bad")

    boom = Boom.__new__(Boom)
    s = Settings(
        llm_max_retries=3, llm_retry_initial_backoff_s=0.001, llm_retry_max_backoff_s=0.001
    )
    decorated = with_retry_and_backoff(s)(boom)
    with pytest.raises(ProviderUnavailableError):
        decorated.generate("s", "u")
    assert attempts["n"] == 1


# --- end: retry -----------------------------------------------------------


# --- begin: logging -------------------------------------------------------
def test_with_logging_records_call(caplog: pytest.LogCaptureFixture) -> None:
    """``with_logging`` emits 'llm generate start' and 'llm generate ok'."""
    import logging

    caplog.set_level(logging.INFO, logger="src.generation.providers.decorators")

    class Plain(StubProvider):
        def generate(self, system: str, user: str) -> str:
            return "done"

    plain = Plain.__new__(Plain)
    decorated = with_logging()(plain)
    assert decorated.generate("s", "u") == "done"
    messages = [r.message for r in caplog.records]
    assert any("llm generate start" in m for m in messages)
    assert any("llm generate ok" in m for m in messages)


def test_with_logging_records_failure(caplog: pytest.LogCaptureFixture) -> None:
    """A failing call logs a WARNING with the exception type."""
    import logging

    caplog.set_level(logging.INFO, logger="src.generation.providers.decorators")

    class Boom(StubProvider):
        def generate(self, system: str, user: str) -> str:
            raise ProviderUnavailableError("down")

    boom = Boom.__new__(Boom)
    decorated = with_logging()(boom)
    with pytest.raises(ProviderUnavailableError):
        decorated.generate("s", "u")
    messages = [r.message for r in caplog.records]
    assert any("llm generate failed" in m for m in messages)


# --- end: logging ---------------------------------------------------------


# --- begin: stacking ------------------------------------------------------
def test_apply_default_decorators_returns_a_working_provider() -> None:
    """The full stack (cache → retry → logging) doesn't break basic behaviour."""

    class Plain(StubProvider):
        def generate(self, system: str, user: str) -> str:
            return f"ans-{user}"

    plain = Plain.__new__(Plain)
    s = Settings(llm_retry_initial_backoff_s=0.001, llm_retry_max_backoff_s=0.001)
    decorated = apply_default_decorators(plain, s)

    assert decorated.generate("s", "u1") == "ans-u1"
    assert decorated.generate("s", "u1") == "ans-u1"  # cache hit, no log noise


# --- end: stacking --------------------------------------------------------
