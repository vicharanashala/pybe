"""Chunk & RetrievedChunk value objects.

SRP-justification: a Chunk is the smallest retrievable unit. It carries
only what is needed to display, locate, and re-rank it — no parser /
embedder / indexer concerns leak in here.
"""

from __future__ import annotations

from dataclasses import dataclass, field

try:
    from typing import Self
except ImportError:  # Python <3.11
    from typing_extensions import Self


@dataclass(frozen=True)
class Chunk:
    """A span of text drawn from one book page-range."""

    book_id: str
    text: str
    page_start: int
    page_end: int
    ordinal: int  # position within the book (0-indexed)
    chunk_id: str = field(default="")  # filled in after construction

    def __post_init__(self) -> None:
        # Defensive: never let an empty chunk leak downstream. The splitter
        # (Phase 1) is responsible for filtering, but we belt-and-braces.
        if not self.text or not self.text.strip():
            raise ValueError(f"Chunk {self.ordinal} has empty text.")
        if self.page_end < self.page_start:
            raise ValueError(
                f"Chunk {self.ordinal}: page_end ({self.page_end}) < page_start ({self.page_start})."
            )

    @property
    def id(self) -> str:
        """Stable identifier used inside the FAISS index."""
        if self.chunk_id:
            return self.chunk_id
        return f"{self.book_id}::c{self.ordinal:06d}"

    def to_dict(self) -> dict[str, str | int]:
        return {
            "book_id": self.book_id,
            "text": self.text,
            "page_start": self.page_start,
            "page_end": self.page_end,
            "ordinal": self.ordinal,
            "chunk_id": self.id,
        }

    @classmethod
    def from_dict(cls, data: dict[str, str | int]) -> Self:
        return cls(
            book_id=str(data["book_id"]),
            text=str(data["text"]),
            page_start=int(data["page_start"]),
            page_end=int(data["page_end"]),
            ordinal=int(data["ordinal"]),
            chunk_id=str(data.get("chunk_id", "")),
        )


@dataclass(frozen=True)
class RetrievedChunk:
    """A Chunk returned by retrieval, with its similarity score.

    ``score`` is cosine similarity in [0, 1]. The retriever (Phase 2)
    drops chunks below ``retrieval_min_score`` before this type is ever
    handed to a caller.
    """

    chunk: Chunk
    score: float

    def __post_init__(self) -> None:
        if not 0.0 <= self.score <= 1.0:
            raise ValueError(f"RetrievedChunk score must be in [0, 1]; got {self.score}.")

    def to_dict(self) -> dict[str, str | int | float]:
        return {"chunk": self.chunk.to_dict(), "score": self.score}
