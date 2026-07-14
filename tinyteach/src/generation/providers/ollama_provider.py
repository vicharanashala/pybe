"""Ollama provider (Concrete Strategy — GoF).

Calls the local Ollama server at ``OLLAMA_HOST`` (default
``http://localhost:11434``) via the ``/api/generate`` endpoint. We use
plain ``httpx`` rather than the OpenAI SDK because Ollama's own API
format is simpler and avoids a misleading ``openai`` client.
"""

from __future__ import annotations

import logging

import httpx

from src.config.settings import Settings
from src.domain.errors import (
    GenerationTimeoutError,
    ProviderUnavailableError,
)
from src.generation.providers.base import LLMProvider

logger = logging.getLogger(__name__)


# --- begin: ollama-provider -----------------------------------------------
class OllamaProvider(LLMProvider):
    """Concrete ``LLMProvider`` for a locally-running Ollama server."""

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._base_url = settings.ollama_host.rstrip("/")
        # We don't open a persistent client — the server may come and go.
        # ``is_available`` does a lightweight HEAD/GET probe each time.

    @property
    def name(self) -> str:
        return "ollama"

    def is_available(self) -> bool:
        """True iff the Ollama server is reachable on its root path."""
        try:
            with httpx.Client(timeout=2.0) as client:
                resp = client.get(self._base_url + "/")
                return resp.status_code < 500
        except (httpx.HTTPError, OSError):
            return False

    # --- begin: generate --------------------------------------------------
    def generate(self, system: str, user: str) -> str:
        if not user or not user.strip():
            raise ValueError("OllamaProvider.generate: user prompt is empty.")
        prompt = f"{system}\n\n{user}"
        payload = {
            "model": self._settings.llm_model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": self._settings.effective_temperature,
                "num_predict": self._settings.llm_max_tokens,
            },
        }
        try:
            with httpx.Client(timeout=self._settings.llm_request_timeout_s) as client:
                resp = client.post(self._base_url + "/api/generate", json=payload)
        except httpx.TimeoutException as exc:
            raise GenerationTimeoutError(
                f"Ollama timed out after {self._settings.llm_request_timeout_s}s"
            ) from exc
        except httpx.HTTPError as exc:
            raise ProviderUnavailableError(f"Ollama unreachable: {exc!r}") from exc

        if resp.status_code == 404:
            raise ProviderUnavailableError(
                f"Model {self._settings.llm_model!r} not found on Ollama. "
                "Run `ollama pull <model>` first."
            )
        if resp.status_code >= 500:
            raise ProviderUnavailableError(f"Ollama returned {resp.status_code}: {resp.text[:200]}")
        if resp.status_code >= 400:
            # 4xx = client-side bug; not retryable in a useful way.
            raise ProviderUnavailableError(
                f"Ollama rejected request ({resp.status_code}): {resp.text[:200]}"
            )

        try:
            data = resp.json()
            return str(data["response"]).strip()
        except (ValueError, KeyError) as exc:
            raise ProviderUnavailableError(
                f"Ollama response missing 'response' field: {exc!r}"
            ) from exc

    # --- end: generate ----------------------------------------------------


# --- end: ollama-provider -------------------------------------------------
