"""Tests for ``HFLocalProvider``."""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest
from src.config.settings import Settings
from src.domain.errors import ProviderUnavailableError
from src.generation.providers.hf_local import _MIN_FREE_RAM_BYTES, HFLocalProvider


# --- begin: is_available --------------------------------------------------
def test_is_available_true_when_memory_above_threshold(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """When ``psutil.virtual_memory().available`` is above the floor, we are available."""
    fake_mem = MagicMock(available=_MIN_FREE_RAM_BYTES + 1)
    monkeypatch.setattr("psutil.virtual_memory", lambda: fake_mem)
    p = HFLocalProvider(Settings(llm_provider="hf_local"))
    assert p.is_available() is True


def test_is_available_false_when_memory_below_threshold(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Below the 4 GB floor, ``is_available()`` returns False (OOM guard)."""
    fake_mem = MagicMock(available=_MIN_FREE_RAM_BYTES - 1)
    monkeypatch.setattr("psutil.virtual_memory", lambda: fake_mem)
    p = HFLocalProvider(Settings(llm_provider="hf_local"))
    assert p.is_available() is False


def test_name_is_hf_local() -> None:
    assert HFLocalProvider(Settings(llm_provider="hf_local")).name == "hf_local"


# --- end: is_available ---------------------------------------------------


# --- begin: lazy-load-failure ---------------------------------------------
def test_missing_transformers_raises_unavailable(monkeypatch: pytest.MonkeyPatch) -> None:
    """If ``transformers`` is not installed, ``generate`` fails cleanly."""
    fake_mem = MagicMock(available=_MIN_FREE_RAM_BYTES + 1)
    monkeypatch.setattr("psutil.virtual_memory", lambda: fake_mem)
    # Simulate the import failing.
    monkeypatch.setattr("builtins.__import__", _raise_import_error)
    p = HFLocalProvider(Settings(llm_provider="hf_local"))
    with pytest.raises(ProviderUnavailableError):
        p.generate("s", "u")


def _raise_import_error(name, *args, **kwargs):
    """Used by the ``__import__`` patch above."""
    if name.startswith("transformers"):
        raise ImportError("simulated: transformers not installed")
    return __import__(name, *args, **kwargs)


# --- end: lazy-load-failure ----------------------------------------------


# --- begin: generate-happy-path -------------------------------------------
def test_generate_returns_pipeline_output(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """End-to-end happy path with a mocked transformers pipeline."""
    fake_mem = MagicMock(available=_MIN_FREE_RAM_BYTES + 1)
    monkeypatch.setattr("psutil.virtual_memory", lambda: fake_mem)

    # Patch the lazy import + pipeline() factory so no transformers load.
    fake_pipeline_fn = MagicMock(
        return_value=lambda prompt, **kwargs: [{"generated_text": "  answer text  "}]
    )
    fake_module = MagicMock(pipeline=fake_pipeline_fn)
    monkeypatch.setitem(__import__("sys").modules, "transformers", fake_module)

    p = HFLocalProvider(Settings(llm_provider="hf_local"))
    out = p.generate("sys prompt", "user question")
    assert out == "answer text"


def test_generate_wraps_unexpected_pipeline_error(monkeypatch: pytest.MonkeyPatch) -> None:
    """A pipeline that raises -> ``EmbedderError`` (retryable)."""
    from src.domain.errors import EmbedderError

    fake_mem = MagicMock(available=_MIN_FREE_RAM_BYTES + 1)
    monkeypatch.setattr("psutil.virtual_memory", lambda: fake_mem)

    def _bad_pipeline(prompt, **kwargs):
        raise RuntimeError("boom")

    fake_pipeline_fn = MagicMock(return_value=_bad_pipeline)
    fake_module = MagicMock(pipeline=fake_pipeline_fn)
    monkeypatch.setitem(__import__("sys").modules, "transformers", fake_module)

    p = HFLocalProvider(Settings(llm_provider="hf_local"))
    with pytest.raises(EmbedderError):
        p.generate("s", "u")


# --- end: generate-happy-path --------------------------------------------


# --- begin: empty-input ---------------------------------------------------
def test_generate_rejects_empty_user() -> None:
    p = HFLocalProvider(Settings(llm_provider="hf_local"))
    with pytest.raises(ValueError):
        p.generate("s", "")


# --- end: empty-input ---------------------------------------------------
