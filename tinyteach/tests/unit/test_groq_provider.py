"""Tests for ``GroqProvider``."""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest
from openai import RateLimitError
from src.config.settings import Settings
from src.domain.errors import ProviderUnavailableError
from src.generation.providers.groq_provider import GroqProvider

from tests.unit.providers_test_helpers import (
    make_authentication_error,
    make_chat_response,
    make_connection_error,
    make_rate_limit_error,
)


# --- begin: helpers --------------------------------------------------------
@pytest.fixture()
def patched_openai_client(monkeypatch: pytest.MonkeyPatch) -> MagicMock:
    fake_client = MagicMock()
    fake_constructor = MagicMock(return_value=fake_client)
    monkeypatch.setattr("src.generation.providers.groq_provider.OpenAI", fake_constructor)
    return fake_client


# --- end: helpers ----------------------------------------------------------


# --- begin: availability --------------------------------------------------
def test_is_available_true_when_groq_token_set() -> None:
    p = GroqProvider(Settings(llm_provider="groq", groq_api_token="gsk_xyz"))
    assert p.is_available() is True


def test_is_available_false_when_no_token() -> None:
    p = GroqProvider(Settings(llm_provider="groq", groq_api_token=""))
    assert p.is_available() is False


def test_name_is_groq() -> None:
    assert GroqProvider(Settings(llm_provider="groq", groq_api_token="x")).name == "groq"


# --- end: availability ---------------------------------------------------


# --- begin: generate-no-token --------------------------------------------
def test_generate_without_token_raises_unavailable() -> None:
    """No token → cannot even build the client; raise early."""
    p = GroqProvider(Settings(llm_provider="groq", groq_api_token=""))
    with pytest.raises(ProviderUnavailableError):
        p.generate("s", "u")


# --- end: generate-no-token ---------------------------------------------


# --- begin: happy-path ---------------------------------------------------
def test_generate_returns_assistant_text(patched_openai_client: MagicMock) -> None:
    patched_openai_client.chat.completions.create.return_value = make_chat_response("groq says hi")
    p = GroqProvider(Settings(llm_provider="groq", groq_api_token="gsk_xyz"))
    assert p.generate("s", "u") == "groq says hi"
    kwargs = patched_openai_client.chat.completions.create.call_args.kwargs
    assert kwargs["messages"][0]["role"] == "system"


# --- end: happy-path -----------------------------------------------------


# --- begin: error-mapping -------------------------------------------------
def test_rate_limit_bubbles_up(patched_openai_client: MagicMock) -> None:
    patched_openai_client.chat.completions.create.side_effect = make_rate_limit_error()
    p = GroqProvider(Settings(llm_provider="groq", groq_api_token="gsk_xyz"))
    with pytest.raises(RateLimitError):  # bubbles up so @with_retry can decide
        p.generate("s", "u")


def test_connection_error_maps_to_unavailable(patched_openai_client: MagicMock) -> None:
    patched_openai_client.chat.completions.create.side_effect = make_connection_error()
    p = GroqProvider(Settings(llm_provider="groq", groq_api_token="gsk_xyz"))
    with pytest.raises(ProviderUnavailableError):
        p.generate("s", "u")


def test_auth_error_maps_to_unavailable(patched_openai_client: MagicMock) -> None:
    patched_openai_client.chat.completions.create.side_effect = make_authentication_error()
    p = GroqProvider(Settings(llm_provider="groq", groq_api_token="gsk_xyz"))
    with pytest.raises(ProviderUnavailableError):
        p.generate("s", "u")


# --- end: error-mapping ---------------------------------------------------


# --- begin: input-validation ----------------------------------------------
def test_generate_rejects_empty_user(patched_openai_client: MagicMock) -> None:
    p = GroqProvider(Settings(llm_provider="groq", groq_api_token="gsk_xyz"))
    with pytest.raises(ValueError):
        p.generate("s", "")


# --- end: input-validation -----------------------------------------------


# --- begin: client-construction -------------------------------------------
def test_client_uses_groq_url_and_token(monkeypatch: pytest.MonkeyPatch) -> None:
    fake_constructor = MagicMock()
    monkeypatch.setattr("src.generation.providers.groq_provider.OpenAI", fake_constructor)
    GroqProvider(Settings(llm_provider="groq", groq_api_token="gsk_xyz"))
    kwargs = fake_constructor.call_args.kwargs
    assert kwargs["base_url"] == "https://api.groq.com/openai/v1"
    assert kwargs["api_key"] == "gsk_xyz"


# --- end: client-construction --------------------------------------------
