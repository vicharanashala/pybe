"""Indexer interface (Strategy + Repository — GoF).

SRP-justification: the ``IngestionPipeline`` and the ``Retriever`` (Phase 2)
speak only to the abstract ``Indexer``. Swapping FAISS for ChromaDB /
Weaviate / pgvector is a one-class change.

Repository role (GoF): persistence (save/load) is hidden behind the same
interface that exposes add/search. Tests can use an in-memory substitute
without touching disk.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from pathlib import Path

import numpy as np


# --- begin: search result --------------------------------------------------
class SearchHit:
    """One row of ``Indexer.search`` output — ID + score.

    Score is inner-product similarity, which for L2-normalised vectors
    is identical to cosine similarity in [0, 1].
    """

    __slots__ = ("id", "score")

    def __init__(self, id: int, score: float) -> None:
        self.id = id
        self.score = float(score)

    def __repr__(self) -> str:
        return f"SearchHit(id={self.id}, score={self.score:.4f})"

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, SearchHit):
            return NotImplemented
        return self.id == other.id and self.score == other.score


# --- end: search result ----------------------------------------------------


class Indexer(ABC):
    """Strategy interface for vector indexing + similarity search."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Backend identifier — logged in the ingestion audit trail."""

    @property
    @abstractmethod
    def dim(self) -> int:
        """Vector dimensionality this indexer was built for."""

    @property
    @abstractmethod
    def size(self) -> int:
        """Number of vectors currently in the index."""

    @abstractmethod
    def add(self, vectors: np.ndarray, ids: np.ndarray) -> None:
        """Insert ``vectors`` (n, dim) under the integer ``ids`` (n,).

        IDs MUST be unique per index. The contract: ``len(vectors) == len(ids)``.
        """

    @abstractmethod
    def search(self, query: np.ndarray, k: int) -> list[SearchHit]:
        """Return the top-``k`` hits for ``query`` (dim,) sorted desc by score.

        Contract: returns a list of length ``min(k, size)``.
        """

    @abstractmethod
    def save(self, path: Path) -> None:
        """Persist the index to ``path``. Idempotent — overwrites."""

    @classmethod
    @abstractmethod
    def load(cls, path: Path) -> Indexer:
        """Restore a previously-saved index from ``path``."""
