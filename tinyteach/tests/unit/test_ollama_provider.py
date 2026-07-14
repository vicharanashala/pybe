"""Tests for ``OllamaProvider``.

We use ``respx`` to mock the HTTP calls to ``localhost:11434`` so no
real Ollama server is needed.
"""

from __future__ import annotations

import httpx
import pytest
import respx
from src.config.settings import Settings
from src.domain.errors import (
    GenerationTimeoutError,
    ProviderUnavailableError,
)
from src.generation.providers.ollama_provider import OllamaProvider


# --- begin: helpers --------------------------------------------------------
def _settings(host: str = "http://localhost:11434") -> Settings:
    return Settings(llm_provider="ollama", ollama_host=host)


# --- end: helpers ----------------------------------------------------------


# --- begin: name ---------------------------------------------------------
def test_name_is_ollama() -> None:
    assert OllamaProvider(_settings()).name == "ollama"


# --- end: name -----------------------------------------------------------


# --- begin: is_available -------------------------------------------------
@pytest.mark.respx(base_url="http://localhost:11434")
def test_is_available_true_when_root_2xx(respx_mock: respx.MockRouter) -> None:
    respx_mock.get("/").respond(200)
    assert OllamaProvider(_settings()).is_available() is True


@pytest.mark.respx(base_url="http://localhost:11434")
def test_is_available_false_on_connection_error(respx_mock: respx.MockRouter) -> None:
    respx_mock.get("/").mock(side_effect=httpx.ConnectError("refused"))
    assert OllamaProvider(_settings()).is_available() is False


@pytest.mark.respx(base_url="http://localhost:11434")
def test_is_available_false_on_5xx(respx_mock: respx.MockRouter) -> None:
    respx_mock.get("/").respond(503)
    assert OllamaProvider(_settings()).is_available() is False


# --- end: is_available ---------------------------------------------------


# --- begin: generate-happy-path -------------------------------------------
@pytest.mark.respx(base_url="http://localhost:11434")
def test_generate_returns_response_field(respx_mock: respx.MockRouter) -> None:
    respx_mock.post("/api/generate").respond(
        200, json={"response": "  hello from ollama  ", "done": True}
    )
    p = OllamaProvider(_settings())
    out = p.generate("sys", "user")
    assert out == "hello from ollama"
    body = respx_mock.calls.last.request.content.decode("utf-8")
    assert "model" in body
    assert "sys" in body and "user" in body


# --- end: generate-happy-path --------------------------------------------


# --- begin: error-paths --------------------------------------------------
@pytest.mark.respx(base_url="http://localhost:11434")
def test_generate_404_model_not_found(respx_mock: respx.MockRouter) -> None:
    respx_mock.post("/api/generate").respond(404, json={"error": "no model"})
    p = OllamaProvider(_settings())
    with pytest.raises(ProviderUnavailableError):
        p.generate("s", "u")


@pytest.mark.respx(base_url="http://localhost:11434")
def test_generate_500_server_error(respx_mock: respx.MockRouter) -> None:
    respx_mock.post("/api/generate").respond(500, text="boom")
    p = OllamaProvider(_settings())
    with pytest.raises(ProviderUnavailableError):
        p.generate("s", "u")


@pytest.mark.respx(base_url="http://localhost:11434")
def test_generate_400_client_error(respx_mock: respx.MockRouter) -> None:
    respx_mock.post("/api/generate").respond(400, text="bad request")
    p = OllamaProvider(_settings())
    with pytest.raises(ProviderUnavailableError):
        p.generate("s", "u")


@pytest.mark.respx(base_url="http://localhost:11434")
def test_generate_timeout_maps_to_domain_error(respx_mock: respx.MockRouter) -> None:
    respx_mock.post("/api/generate").mock(side_effect=httpx.TimeoutException("too slow"))
    p = OllamaProvider(Settings(llm_provider="ollama", llm_request_timeout_s=0.1))
    with pytest.raises(GenerationTimeoutError):
        p.generate("s", "u")


@pytest.mark.respx(base_url="http://localhost:11434")
def test_generate_missing_response_field(respx_mock: respx.MockRouter) -> None:
    respx_mock.post("/api/generate").respond(200, json={"unrelated": "data"})
    p = OllamaProvider(_settings())
    with pytest.raises(ProviderUnavailableError):
        p.generate("s", "u")


# --- end: error-paths ----------------------------------------------------


# --- begin: empty-input ---------------------------------------------------
def test_generate_rejects_empty_user() -> None:
    p = OllamaProvider(_settings())
    with pytest.raises(ValueError):
        p.generate("s", "")


# --- end: empty-input ---------------------------------------------------
