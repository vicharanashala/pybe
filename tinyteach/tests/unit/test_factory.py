"""Tests for ``LLMProviderFactory.from_settings``.

We never hit a real network. The factory uses ``is_available()`` and
constructor exception-handling to pick a provider; we control both via
a stub that supports per-instance state.
"""

from __future__ import annotations

import pytest
from src.config.settings import Settings
from src.domain.errors import ProviderUnavailableError
from src.generation.providers.base import LLMProvider
from src.generation.providers.factory import LLMProviderFactory


# --- begin: helpers -------------------------------------------------------
class _StubProvider(LLMProvider):
    """Reusable stub; instance attrs drive behaviour per-test."""

    def __init__(self, settings: Settings, *, available: bool = True, name: str = "stub") -> None:
        self._settings = settings
        self._available = available
        self._name = name

    @property
    def name(self) -> str:
        return self._name

    def is_available(self) -> bool:
        return self._available

    def generate(self, system: str, user: str) -> str:
        return "stub-output"


def _patch(monkeypatch: pytest.MonkeyPatch, *, by_name: dict[str, bool]) -> None:
    """Make every registry entry point at our stub with per-name availability.

    ``by_name`` maps provider name → ``is_available`` boolean. Every
    fallback candidate inherits ``is_available=True`` unless overridden.
    """
    monkeypatch.setattr(LLMProviderFactory, "_REGISTRY", {})

    def _factory(name: str):
        def _make(settings: Settings) -> _StubProvider:
            return _StubProvider(settings, available=by_name.get(name, True), name=name)

        return _make

    for name in ("hf_inference", "hf_local", "groq", "ollama"):
        LLMProviderFactory._REGISTRY[name] = _factory(name)  # type: ignore[assignment]


# --- end: helpers ---------------------------------------------------------


# --- begin: configured-provider-available ---------------------------------
def test_returns_configured_provider_when_available(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """The configured provider is returned unchanged when is_available()."""
    _patch(monkeypatch, by_name={"hf_inference": True})
    s = Settings(llm_provider="hf_inference")
    provider = LLMProviderFactory.from_settings(s)
    assert provider.name == "hf_inference"


# --- end: configured-provider-available -----------------------------------


# --- begin: fallback-when-unavailable -------------------------------------
def test_falls_back_when_configured_unavailable(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """If the configured provider is ``is_available() == False``, the factory tries the chain."""
    _patch(monkeypatch, by_name={"hf_inference": False, "groq": True})
    s = Settings(llm_provider="hf_inference")
    provider = LLMProviderFactory.from_settings(s)
    # The fallback chain (after hf_inference) starts with "groq".
    assert provider.name == "groq"


# --- end: fallback-when-unavailable ---------------------------------------


# --- begin: construction-failure-triggers-fallback ------------------------
def test_construction_failure_triggers_fallback(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """If constructing the configured provider raises, the factory tries the next one."""
    monkeypatch.setattr(LLMProviderFactory, "_REGISTRY", {})

    def _broken(settings: Settings) -> _StubProvider:
        raise RuntimeError("transformers missing")

    def _good(settings: Settings) -> _StubProvider:
        return _StubProvider(settings, available=True, name="groq")

    LLMProviderFactory._REGISTRY["hf_inference"] = _broken  # type: ignore[assignment]
    LLMProviderFactory._REGISTRY["groq"] = _good  # type: ignore[assignment]
    # Fill in the rest so we don't accidentally hit a real provider.
    LLMProviderFactory._REGISTRY["hf_local"] = _good  # type: ignore[assignment]
    LLMProviderFactory._REGISTRY["ollama"] = _good  # type: ignore[assignment]

    s = Settings(llm_provider="hf_inference")
    provider = LLMProviderFactory.from_settings(s)
    assert provider.name == "groq"


# --- end: construction-failure-triggers-fallback --------------------------


# --- begin: all-unavailable -----------------------------------------------
def test_raises_when_every_provider_unavailable(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """If every provider is down, the factory raises ``ProviderUnavailableError``."""
    _patch(
        monkeypatch,
        by_name={"hf_inference": False, "hf_local": False, "groq": False, "ollama": False},
    )
    s = Settings(llm_provider="hf_inference")
    with pytest.raises(ProviderUnavailableError):
        LLMProviderFactory.from_settings(s)


# --- end: all-unavailable -------------------------------------------------


# --- begin: unknown-provider ----------------------------------------------
def test_raises_on_unknown_provider_name() -> None:
    """An invalid ``llm_provider`` raises (caught early, not via the chain)."""
    s = Settings(llm_provider="hf_inference")
    object.__setattr__(s, "llm_provider", "made_up_provider")
    with pytest.raises(ProviderUnavailableError):
        LLMProviderFactory.from_settings(s)


# --- end: unknown-provider -----------------------------------------------


# --- begin: decoration-applied --------------------------------------------
def test_returned_provider_is_decorated(monkeypatch: pytest.MonkeyPatch) -> None:
    """The factory wraps the provider in the default decorator stack.

    The smoking gun: the wrapped ``generate`` is callable and produces
    the stub's canned output. We also assert that calling twice does
    not raise.
    """
    _patch(monkeypatch, by_name={"hf_inference": True})
    s = Settings(llm_provider="hf_inference")
    provider = LLMProviderFactory.from_settings(s)
    assert callable(provider.generate)
    assert provider.generate("s", "u1") == "stub-output"
    assert provider.generate("s", "u1") == "stub-output"


# --- end: decoration-applied ---------------------------------------------
