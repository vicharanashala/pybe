"""Chunker interface (Strategy — GoF).

SRP-justification: the chunker is the only place that knows how to turn
a stream of pages into fixed-size windows. Swapping the splitter
(recursive, sentence-aware, fixed-size, semantic) is a one-class change
with no effect on the parser, embedder, or pipeline.
"""

from __future__ import annotations

from abc import ABC, abstractmethod

from src.domain.chunk import Chunk
from src.ingestion.parsers.base import Page


class Chunker(ABC):
    """Strategy interface for splitting pages into ``Chunk`` records."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Algorithm identifier — logged in the ingestion audit trail."""

    @abstractmethod
    def chunk(self, pages: list[Page], *, book_id: str) -> list[Chunk]:
        """Return ordered chunks spanning ``pages``.

        Contract:
        - Chunks are returned in document order (page-then-position).
        - Every chunk's ``page_start`` <= ``page_end``.
        - Empty pages are skipped (they would fail ``Chunk.__post_init__``).
        - Raises ``ChunkerError`` on irrecoverable failure.
        """
