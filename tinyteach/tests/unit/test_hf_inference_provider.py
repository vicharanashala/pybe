"""Tests for ``HFInferenceProvider``.

We never hit the network — the ``openai.OpenAI`` client is patched via
``pytest-mock`` and we feed it canned responses.
"""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest
from openai import APITimeoutError, RateLimitError
from src.config.settings import Settings
from src.domain.errors import ProviderUnavailableError
from src.generation.providers.hf_inference import HFInferenceProvider

from tests.unit.providers_test_helpers import (
    make_authentication_error,
    make_chat_response,
    make_connection_error,
    make_rate_limit_error,
    make_timeout_error,
)


# --- begin: helpers --------------------------------------------------------
@pytest.fixture()
def patched_openai_client(monkeypatch: pytest.MonkeyPatch) -> MagicMock:
    """Patch the OpenAI client so no network call happens."""
    fake_client = MagicMock()
    fake_constructor = MagicMock(return_value=fake_client)
    monkeypatch.setattr("src.generation.providers.hf_inference.OpenAI", fake_constructor)
    return fake_client


# --- end: helpers ----------------------------------------------------------


# --- begin: is_available --------------------------------------------------
def test_is_available_always_true_for_router() -> None:
    """The HF router is reachable from the free tier; the decorator
    handles 429s, so is_available is always True."""
    s = Settings(llm_provider="hf_inference")
    p = HFInferenceProvider(s)
    assert p.is_available() is True


def test_name_is_hf_inference() -> None:
    s = Settings(llm_provider="hf_inference")
    assert HFInferenceProvider(s).name == "hf_inference"


# --- end: is_available ---------------------------------------------------


# --- begin: happy-path ---------------------------------------------------
def test_generate_returns_assistant_text(patched_openai_client: MagicMock) -> None:
    """A normal completion returns the assistant content, stripped."""
    patched_openai_client.chat.completions.create.return_value = make_chat_response(
        "  hello there  "
    )
    p = HFInferenceProvider(Settings(llm_provider="hf_inference"))
    out = p.generate("you are a tutor", "explain decorators")
    assert out == "hello there"
    patched_openai_client.chat.completions.create.assert_called_once()
    kwargs = patched_openai_client.chat.completions.create.call_args.kwargs
    assert kwargs["messages"][0]["role"] == "system"
    assert kwargs["messages"][1]["role"] == "user"


# --- end: happy-path -----------------------------------------------------


# --- begin: error-mapping -------------------------------------------------
def test_generate_maps_auth_failure_to_unavailable(
    patched_openai_client: MagicMock,
) -> None:
    """``AuthenticationError`` -> ``ProviderUnavailableError`` (non-retryable)."""
    patched_openai_client.chat.completions.create.side_effect = make_authentication_error()
    p = HFInferenceProvider(Settings(llm_provider="hf_inference"))
    with pytest.raises(ProviderUnavailableError):
        p.generate("s", "u")


def test_generate_maps_connection_failure_to_unavailable(
    patched_openai_client: MagicMock,
) -> None:
    """``APIConnectionError`` -> ``ProviderUnavailableError``."""
    patched_openai_client.chat.completions.create.side_effect = make_connection_error()
    p = HFInferenceProvider(Settings(llm_provider="hf_inference"))
    with pytest.raises(ProviderUnavailableError):
        p.generate("s", "u")


def test_generate_propagates_retryable_exceptions(
    patched_openai_client: MagicMock,
) -> None:
    """``RateLimitError`` and ``APITimeoutError`` MUST bubble up unchanged so
    ``@with_retry_and_backoff`` can decide whether to retry."""
    patched_openai_client.chat.completions.create.side_effect = make_rate_limit_error()
    p = HFInferenceProvider(Settings(llm_provider="hf_inference"))
    with pytest.raises(RateLimitError):  # bubbles up so @with_retry can decide
        p.generate("s", "u")

    patched_openai_client.chat.completions.create.side_effect = make_timeout_error()
    with pytest.raises(APITimeoutError):
        p.generate("s", "u")


def test_generate_maps_empty_choices_to_unavailable(
    patched_openai_client: MagicMock,
) -> None:
    """A response with ``choices == []`` is a malformed payload → unavailable."""
    response = MagicMock()
    response.choices = []
    patched_openai_client.chat.completions.create.return_value = response
    p = HFInferenceProvider(Settings(llm_provider="hf_inference"))
    with pytest.raises(ProviderUnavailableError):
        p.generate("s", "u")


# --- end: error-mapping ---------------------------------------------------


# --- begin: input-validation ----------------------------------------------
def test_generate_rejects_empty_user_prompt(
    patched_openai_client: MagicMock,
) -> None:
    """Empty user prompts raise ``ValueError`` (programmer bug)."""
    p = HFInferenceProvider(Settings(llm_provider="hf_inference"))
    with pytest.raises(ValueError):
        p.generate("s", "")
    with pytest.raises(ValueError):
        p.generate("s", "   ")


# --- end: input-validation -----------------------------------------------


# --- begin: client-construction -------------------------------------------
def test_client_uses_router_url_and_anonymous_token_when_no_hf_token(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """No HF_TOKEN → use 'anonymous' so the SDK doesn't crash on empty key."""
    fake_constructor = MagicMock()
    monkeypatch.setattr("src.generation.providers.hf_inference.OpenAI", fake_constructor)
    HFInferenceProvider(Settings(llm_provider="hf_inference", huggingface_token=""))
    kwargs = fake_constructor.call_args.kwargs
    assert kwargs["base_url"] == "https://router.huggingface.co/v1"
    assert kwargs["api_key"] == "anonymous"


def test_client_uses_hf_token_when_provided(monkeypatch: pytest.MonkeyPatch) -> None:
    fake_constructor = MagicMock()
    monkeypatch.setattr("src.generation.providers.hf_inference.OpenAI", fake_constructor)
    HFInferenceProvider(Settings(llm_provider="hf_inference", huggingface_token="hf_secret_xyz"))
    kwargs = fake_constructor.call_args.kwargs
    assert kwargs["api_key"] == "hf_secret_xyz"


# --- end: client-construction --------------------------------------------
