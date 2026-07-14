"""Sentence-Transformers embedder (Concrete Strategy — GoF).

Singleton-justification (GoF): the sentence-transformers model is
~80-300 MB and takes 1-2 s to load. We load it once and reuse the
process-wide instance via ``get_embedder()`` in ``src.config.container``.
"""

from __future__ import annotations

import threading

import numpy as np
from sentence_transformers import SentenceTransformer

from src.config.settings import Settings
from src.domain.errors import EmbedderError
from src.ingestion.embedders.base import Embedder


# --- begin: sentence-transformer embedder ---------------------------------
class SentenceTransformerEmbedder(Embedder):
    """Concrete ``Embedder`` backed by a sentence-transformers model."""

    # --- begin: model handle / state -------------------------------------
    # ``_model`` is set lazily on first ``embed()`` call. ``_lock`` makes
    # first-load thread-safe so concurrent ingestions don't double-load.
    _model: SentenceTransformer | None = None
    _lock = threading.Lock()
    # --- end: model handle / state ---------------------------------------

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._name = settings.embedding_model
        self._device = settings.embedding_device
        self._batch_size = settings.embedding_batch_size
        self._dim = self._probe_dim()

    # --- begin: dim probe -------------------------------------------------
    def _probe_dim(self) -> int:
        """Compute the model dimensionality by embedding a stub string.

        Loading a real model is unavoidable to learn the dim; we use a
        single-token stub so the cost is minimal.
        """
        return int(self._load_model().get_sentence_embedding_dimension())

    # --- end: dim probe ---------------------------------------------------

    # --- begin: lazy load -------------------------------------------------
    def _load_model(self) -> SentenceTransformer:
        """Load the model once, thread-safe; reuse thereafter (Singleton)."""
        if self._model is None:
            with self._lock:
                if self._model is None:  # double-checked
                    try:
                        self._model = SentenceTransformer(self._name, device=self._device)
                    except Exception as exc:
                        raise EmbedderError(
                            f"Could not load sentence-transformers model "
                            f"'{self._name}' on device '{self._device}': {exc!r}"
                        ) from exc
        return self._model

    # --- end: lazy load ---------------------------------------------------

    @property
    def name(self) -> str:
        return self._name

    @property
    def dim(self) -> int:
        return self._dim

    # --- begin: embed -----------------------------------------------------
    def embed(self, texts: list[str]) -> np.ndarray:
        """Embed ``texts`` in batches; return a L2-normalised float32 array.

        ``convert_to_numpy=True`` + ``normalize_embeddings=True`` match
        what FAISS ``IndexFlatIP`` expects for cosine similarity.
        """
        if not texts:
            raise EmbedderError("SentenceTransformerEmbedder.embed called with empty list.")
        model = self._load_model()
        try:
            vectors = model.encode(
                list(texts),
                batch_size=self._batch_size,
                convert_to_numpy=True,
                normalize_embeddings=True,
                show_progress_bar=False,
            )
        except Exception as exc:
            raise EmbedderError(
                f"sentence-transformers encode failed for {len(texts)} text(s): {exc!r}"
            ) from exc
        return np.asarray(vectors, dtype=np.float32)

    # --- end: embed -------------------------------------------------------


# --- end: sentence-transformer embedder ----------------------------------
