"""LLM-provider interface (Strategy — GoF).

SRP-justification: the orchestrator (Phase 5) knows only this ABC. Every
implementation (HF router, HF local, Groq, Ollama) lives in its own file
and is wired by ``factory.py``. Swapping the LLM is a config change,
never a code change (invariant I-12).
"""

from __future__ import annotations

from abc import ABC, abstractmethod


class LLMProvider(ABC):
    """Strategy interface for one LLM backend."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Short provider identifier — logged in ``app.log``."""

    @abstractmethod
    def is_available(self) -> bool:
        """Return ``True`` iff this provider can service a call RIGHT NOW.

        Examples of returning ``False``:
        - HF Local when ``psutil`` reports < 4 GB free RAM.
        - Groq when ``groq_api_token`` is empty.
        - Ollama when the local server is unreachable.

        The factory (Phase 3) uses this to skip an unavailable primary
        and try the next provider in the fallback chain.
        """

    @abstractmethod
    def generate(self, system: str, user: str) -> str:
        """Produce one assistant turn for the given ``system`` + ``user``.

        Contract:
        - Returns the raw assistant text (no chat markup).
        - Raises ``ProviderUnavailableError`` if the backend is down.
        - Raises ``GenerationTimeoutError`` on slow / hanging responses.
        - Any other backend error bubbles up; the ``@with_retry`` decorator
          decides whether to retry it.
        """
