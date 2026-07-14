"""HF Local provider — runs a transformers pipeline in-process.

Strategy role (GoF) — concrete ``LLMProvider`` that uses
``transformers.pipeline("text-generation", ...)``. The pipeline is
loaded lazily, once, and reused.

OOM guard: ``is_available()`` returns ``False`` whenever free RAM is
below ``4 * 2**30 bytes`` (~4 GB). Per PROJECT_BLUEPRINT §16, loading
a 1.5 B+ model in the free 16 GB HF Space risks out-of-memory; the
factory will gracefully downgrade us to ``hf_inference``.
"""

from __future__ import annotations

import logging
import threading

import psutil

from src.config.settings import Settings
from src.domain.errors import EmbedderError, ProviderUnavailableError
from src.generation.providers.base import LLMProvider

logger = logging.getLogger(__name__)

# Minimum free RAM (bytes) below which ``hf_local`` refuses to load.
_MIN_FREE_RAM_BYTES = 4 * (1024**3)


# --- begin: hf-local-provider ---------------------------------------------
class HFLocalProvider(LLMProvider):
    """Concrete ``LLMProvider`` that runs a local transformers pipeline."""

    # --- begin: thread-safe lazy-load ------------------------------------
    # The transformers pipeline is heavy (~1-2 GB for a 1.5 B model, plus
    # ~80 MB model weights). It MUST be loaded once per process. Double-
    # checked locking makes that safe even under concurrent first calls.
    _pipeline = None
    _pipeline_lock = threading.Lock()
    # --- end: thread-safe lazy-load --------------------------------------

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._model_id = settings.llm_model

    @property
    def name(self) -> str:
        return "hf_local"

    # --- begin: is_available ----------------------------------------------
    def is_available(self) -> bool:
        """False iff free RAM is below ``_MIN_FREE_RAM_BYTES``."""
        available = psutil.virtual_memory().available
        if available < _MIN_FREE_RAM_BYTES:
            logger.warning(
                "hf_local OOM guard triggered; not available",
                extra={
                    "where": "generation.providers.hf_local",
                    "available_bytes": available,
                    "min_bytes": _MIN_FREE_RAM_BYTES,
                },
            )
            return False
        return True

    # --- end: is_available ------------------------------------------------

    # --- begin: lazy-pipeline-loader --------------------------------------
    def _load_pipeline(self) -> object:
        """Lazy, thread-safe load of the ``text-generation`` pipeline."""
        if self._pipeline is not None:
            return self._pipeline
        with self._pipeline_lock:
            if self._pipeline is None:  # double-checked
                # Import transformers lazily so the module is OPTIONAL.
                # If a user has no transformers, hf_local falls off the
                # fallback list and the factory moves to the next provider.
                try:
                    from transformers import pipeline  # type: ignore[import-not-found]
                except ImportError as exc:
                    raise ProviderUnavailableError(
                        "hf_local requires `transformers`; pip install transformers"
                    ) from exc
                try:
                    self._pipeline = pipeline(  # type: ignore[attr-defined]
                        "text-generation",
                        model=self._model_id,
                        device=self._settings.embedding_device,
                    )
                except Exception as exc:
                    raise ProviderUnavailableError(
                        f"Could not load model {self._model_id!r} locally: {exc!r}"
                    ) from exc
        return self._pipeline

    # --- end: lazy-pipeline-loader ----------------------------------------

    # --- begin: generate --------------------------------------------------
    def generate(self, system: str, user: str) -> str:
        """Run the pipeline with a system + user prompt concatenated.

        Different chat templates expect different formats; we use the
        conservative ``System: ...\nUser: ...\nAssistant:`` pattern that
        most instruct-tuned models understand.
        """
        if not user or not user.strip():
            raise ValueError("HFLocalProvider.generate: user prompt is empty.")
        pipe = self._load_pipeline()
        prompt = f"System: {system}\nUser: {user}\nAssistant:"
        try:
            outputs = pipe(  # type: ignore[call-arg]
                prompt,
                max_new_tokens=self._settings.llm_max_tokens,
                temperature=self._settings.effective_temperature,
                do_sample=self._settings.effective_temperature > 0.0,
                return_full_text=False,
            )
        except Exception as exc:
            # transformers exceptions are heterogeneous — wrap as retryable.
            raise EmbedderError(f"hf_local generate failed: {exc!r}") from exc

        if not outputs or "generated_text" not in outputs[0]:
            raise ProviderUnavailableError("hf_local pipeline returned an unexpected output shape.")
        return str(outputs[0]["generated_text"]).strip()

    # --- end: generate ----------------------------------------------------


# --- end: hf-local-provider -----------------------------------------------


# --- begin: error-helpers -------------------------------------------------
def _is_oom_error(exc: BaseException) -> bool:
    """Heuristic: did we OOM at generation time?"""
    msg = str(exc).lower()
    return "out of memory" in msg or "cuda out of memory" in msg or isinstance(exc, MemoryError)


# --- end: error-helpers ---------------------------------------------------
