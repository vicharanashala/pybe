"""LLM-provider factory (Factory — GoF).

Resolves ``settings.llm_provider`` to a real ``LLMProvider`` instance
and falls back through a priority chain if the configured provider is
not currently available (e.g. hf_local OOM-guarded, Groq token missing).

Priority chain (for the configured provider): exactly what ``settings``
says. If that one reports ``is_available() == False``, we try the rest
of the providers in a deterministic order — never silently substitute a
different model family than what the user chose.
"""

from __future__ import annotations

import logging

from src.config.settings import Settings
from src.domain.errors import ProviderUnavailableError
from src.generation.providers.base import LLMProvider
from src.generation.providers.decorators import apply_default_decorators
from src.generation.providers.demo_provider import DemoLLMProvider
from src.generation.providers.groq_provider import GroqProvider
from src.generation.providers.hf_inference import HFInferenceProvider
from src.generation.providers.hf_local import HFLocalProvider
from src.generation.providers.ollama_provider import OllamaProvider

logger = logging.getLogger(__name__)


# --- begin: factory -------------------------------------------------------
class LLMProviderFactory:
    """Builds the project's default ``LLMProvider`` instance."""

    # --- begin: provider-registry ----------------------------------------
    # Maps the Literal value in Settings to the concrete class.
    # Phase 8: ``demo`` is a worked-example provider that returns
    # canned JSON -- see ``demo_provider.py`` and ``docs/EXTENDING.md``.
    _REGISTRY: dict[str, type[LLMProvider]] = {
        "hf_inference": HFInferenceProvider,
        "hf_local": HFLocalProvider,
        "groq": GroqProvider,
        "ollama": OllamaProvider,
        "demo": DemoLLMProvider,
    }

    # Fallback chain when the configured provider is unavailable.
    # Order matters: cheapest free default first. ``demo`` is NOT in
    # the fallback chain -- it's never substituted silently because the
    # user opting into it is a deliberate signal.
    _FALLBACK_ORDER: tuple[str, ...] = ("hf_inference", "groq", "ollama", "hf_local")
    # --- end: provider-registry ------------------------------------------

    @classmethod
    def from_settings(cls, settings: Settings) -> LLMProvider:
        """Resolve the configured provider, falling back if needed.

        The returned provider is wrapped in the project's default
        decorator stack (cache → retry → logging) so callers don't need
        to think about it. ``reset_llm_cache()`` invalidates the cache.

        Raises ``ProviderUnavailableError`` if every provider is down.
        """
        configured = settings.llm_provider
        provider_cls = cls._REGISTRY.get(configured)
        if provider_cls is None:
            raise ProviderUnavailableError(
                f"Unknown LLM provider: {configured!r}. " f"Choose one of {list(cls._REGISTRY)}."
            )

        # --- begin: try-configured-first ---------------------------------
        try:
            configured_provider = provider_cls(settings)
        except Exception as exc:
            # Construction itself failed (e.g. transformers missing) —
            # log and try the chain.
            logger.warning(
                "configured LLM provider failed to construct",
                extra={
                    "where": "generation.providers.factory",
                    "provider": configured,
                    "exception_type": exc.__class__.__name__,
                },
            )
            configured_provider = None

        if configured_provider is not None and configured_provider.is_available():
            logger.info(
                "llm provider selected",
                extra={
                    "where": "generation.providers.factory",
                    "llm_provider": configured,
                },
            )
            return apply_default_decorators(configured_provider, settings)

        # --- begin: fallback-chain ---------------------------------------
        if configured_provider is not None and not configured_provider.is_available():
            logger.info(
                "configured LLM provider unavailable; falling back",
                extra={
                    "where": "generation.providers.factory",
                    "provider": configured,
                },
            )
        for candidate_name in cls._FALLBACK_ORDER:
            if candidate_name == configured:
                continue  # already tried
            candidate_cls = cls._REGISTRY.get(candidate_name)
            if candidate_cls is None:
                continue
            try:
                candidate = candidate_cls(settings)
            except Exception:
                continue
            if candidate.is_available():
                logger.info(
                    "llm fallback selected",
                    extra={
                        "where": "generation.providers.factory",
                        "llm_provider": candidate_name,
                    },
                )
                return apply_default_decorators(candidate, settings)

        raise ProviderUnavailableError(
            f"No LLM provider is currently available. "
            f"Configured: {settings.llm_provider!r}; tried fallbacks: "
            f"{[p for p in cls._FALLBACK_ORDER if p != configured]}"
        )
        # --- end: fallback-chain ----------------------------------------


# --- end: factory ---------------------------------------------------------
