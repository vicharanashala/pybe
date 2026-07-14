"""HF Inference Router provider (Concrete Strategy — GoF).

Hits ``https://router.huggingface.co/v1/chat/completions`` via the
``openai`` Python SDK with a custom ``base_url``. This is the
OpenAI-compatible endpoint exposed by the modern HuggingFace Inference
API — the legacy ``api-inference.huggingface.co/models/...`` URL is
deprecated and is NOT used here.

Free tier: anonymous (no token) works for low-traffic. Higher rate
limits require ``HF_TOKEN``. The ``@with_retry`` decorator handles 429s
by backing off per the §8.1 rate-limit table.
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
from src.domain.errors import (
    ProviderUnavailableError,
)
from src.generation.providers.base import LLMProvider

logger = logging.getLogger(__name__)


# --- begin: hf-inference-provider -----------------------------------------
class HFInferenceProvider(LLMProvider):
    """Concrete ``LLMProvider`` using HF's OpenAI-compatible router endpoint."""

    # --- begin: endpoint -------------------------------------------------
    # OpenAI-compatible chat-completions endpoint on the HF router.
    BASE_URL = "https://router.huggingface.co/v1"
    # --- end: endpoint ---------------------------------------------------

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        token = settings.effective_api_token
        # The OpenAI SDK accepts an empty string for the anonymous tier;
        # for HF this still works on the free, rate-limited tier.
        self._client = OpenAI(
            base_url=self.BASE_URL,
            api_key=token or "anonymous",
            timeout=settings.llm_request_timeout_s,
        )

    @property
    def name(self) -> str:
        return "hf_inference"

    def is_available(self) -> bool:
        """HF router is always considered available — ``@with_retry`` will
        back off if the free tier is throttled. (Network reachability is
        checked at the first call, not at boot, to keep the UI snappy.)
        """
        return True

    # --- begin: generate --------------------------------------------------
    def generate(self, system: str, user: str) -> str:
        """Call the chat-completions endpoint and return the assistant text."""
        if not user or not user.strip():
            raise ValueError("HFInferenceProvider.generate: user prompt is empty.")
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
            # Retryable: let ``@with_retry`` decide.
            raise
        except APIConnectionError as exc:
            raise ProviderUnavailableError(f"HF Inference router is unreachable: {exc!r}") from exc
        except AuthenticationError as exc:
            raise ProviderUnavailableError(
                f"HF Inference auth failed (check HF_TOKEN): {exc!r}"
            ) from exc
        except Exception:  # openai raises many subclassed types
            # Treat any unrecognised error as retryable so the decorator
            # can decide. The exception type is preserved for logging.
            logger.warning(
                "hf_inference: unexpected error, will retry",
                extra={"where": "generation.providers.hf_inference"},
            )
            raise

        # --- begin: extract-content --------------------------------------
        try:
            content = response.choices[0].message.content
        except (AttributeError, IndexError, KeyError) as exc:
            raise ProviderUnavailableError(
                f"HF Inference response missing choices[0].message.content: {exc!r}"
            ) from exc
        if content is None:
            raise ProviderUnavailableError("HF Inference returned an empty completion.")
        return str(content).strip()
        # --- end: extract-content ----------------------------------------


# --- end: hf-inference-provider -------------------------------------------


# --- begin: error-helpers -------------------------------------------------
def _classify_exception(exc: BaseException) -> tuple[str, bool]:
    """Map an openai exception to (category, retryable)."""
    if isinstance(exc, APITimeoutError):
        return "timeout", True
    if isinstance(exc, RateLimitError):
        return "rate_limited", True
    if isinstance(exc, APIConnectionError):
        return "connection", False
    if isinstance(exc, AuthenticationError):
        return "auth", False
    return "unknown", True


# --- end: error-helpers ---------------------------------------------------
