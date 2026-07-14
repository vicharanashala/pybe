"""Groq provider (Concrete Strategy — GoF).

Uses the ``openai`` Python SDK with ``base_url`` pointed at Groq's
OpenAI-compatible endpoint. Requires a free ``GROQ_API_TOKEN`` from
groq.com.
"""

from __future__ import annotations

import logging

from openai import (
    APIConnectionError,
    APITimeoutError,
    AuthenticationError,
    OpenAI,
    RateLimitError,
)

from src.config.settings import Settings
from src.domain.errors import ProviderUnavailableError
from src.generation.providers.base import LLMProvider

logger = logging.getLogger(__name__)


# --- begin: groq-provider -------------------------------------------------
class GroqProvider(LLMProvider):
    """Concrete ``LLMProvider`` for Groq's free OpenAI-compatible API."""

    BASE_URL = "https://api.groq.com/openai/v1"

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        token = settings.effective_api_token
        if not token:
            # ``is_available`` will return False, but we still want a
            # usable client for tests that override ``is_available``.
            self._client: OpenAI | None = None
        else:
            self._client = OpenAI(
                base_url=self.BASE_URL,
                api_key=token,
                timeout=settings.llm_request_timeout_s,
            )

    @property
    def name(self) -> str:
        return "groq"

    def is_available(self) -> bool:
        """True iff a token is configured."""
        return bool(self._settings.effective_api_token)

    # --- begin: generate --------------------------------------------------
    def generate(self, system: str, user: str) -> str:
        if self._client is None:
            raise ProviderUnavailableError(
                "Groq token is not configured (set GROQ_API_TOKEN in env)."
            )
        if not user or not user.strip():
            raise ValueError("GroqProvider.generate: user prompt is empty.")
        try:
            response = self._client.chat.completions.create(
                model=self._settings.llm_model,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
                temperature=self._settings.effective_temperature,
                max_tokens=self._settings.llm_max_tokens,
            )
        except (APITimeoutError, RateLimitError):
            raise  # retryable
        except APIConnectionError as exc:
            raise ProviderUnavailableError(f"Groq unreachable: {exc!r}") from exc
        except AuthenticationError as exc:
            raise ProviderUnavailableError(f"Groq auth failed: {exc!r}") from exc

        try:
            content = response.choices[0].message.content
        except (AttributeError, IndexError, KeyError) as exc:
            raise ProviderUnavailableError(
                f"Groq response missing choices[0].message.content: {exc!r}"
            ) from exc
        if content is None:
            raise ProviderUnavailableError("Groq returned an empty completion.")
        return str(content).strip()

    # --- end: generate ----------------------------------------------------


# --- end: groq-provider ---------------------------------------------------
