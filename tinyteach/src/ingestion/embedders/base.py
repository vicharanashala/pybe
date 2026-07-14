"""Embedder interface (Strategy — GoF).

SRP-justification: the embedder is the only place that turns text into
vectors. Swapping model families (sentence-transformers, OpenAI,
Cohere, …) is a one-class change. Indexer + retrieval stay untouched.
"""

from __future__ import annotations

from abc import ABC, abstractmethod

import numpy as np


class Embedder(ABC):
    """Strategy interface for converting text to L2-normalised vectors."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Model identifier — logged + surfaced in the UI status badge."""

    @property
    @abstractmethod
    def dim(self) -> int:
        """Vector dimensionality. Constant per embedder instance."""

    @abstractmethod
    def embed(self, texts: list[str]) -> np.ndarray:
        """Return a ``(len(texts), dim)`` float32 array.

        All vectors MUST be L2-normalised. The indexer relies on inner
        product == cosine similarity; if vectors aren't unit-length the
        score floor in ``retrieval_min_score`` loses its meaning.
        """
