"""Recursive-character chunker.

Strategy role (GoF) — concrete ``Chunker`` backed by langchain's
``RecursiveCharacterTextSplitter``. We split per page (so the
``page_start`` / ``page_end`` attribution is exact) and then concatenate
across the book. ``RecursiveCharacterTextSplitter`` keeps semantic
boundaries (paragraphs → sentences → words → chars) which avoids slicing
code mid-token.
"""

from __future__ import annotations

from langchain_text_splitters import RecursiveCharacterTextSplitter

from src.config.settings import Settings
from src.domain.chunk import Chunk
from src.domain.errors import ChunkerError
from src.ingestion.chunkers.base import Chunker, Page


# --- begin: recursive chunker ---------------------------------------------
class RecursiveChunker(Chunker):
    """Concrete ``Chunker`` using recursive character splitting per page."""

    def __init__(self, settings: Settings) -> None:
        """Build the splitter from project config (chunk_size + chunk_overlap).

        ``from_tiktoken_encoder=False`` because we are not measuring in
        tokens; we measure in characters. Embedders later handle token
        budgets themselves.
        """
        self._settings = settings
        self._splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap,
            length_function=len,
            is_separator_regex=False,
        )

    @property
    def name(self) -> str:
        return "recursive"

    # --- begin: chunk -----------------------------------------------------
    def chunk(self, pages: list[Page], *, book_id: str) -> list[Chunk]:
        """Split each page individually, then concatenate across the book.

        Per-page splitting preserves exact ``page_start`` / ``page_end``
        attribution for free, which is what the retrieval result page
        (Phase 6 UI) will display.
        """
        if not pages:
            raise ChunkerError("RecursiveChunker received an empty page list.")

        chunks: list[Chunk] = []
        ordinal = 0
        for page in pages:
            stripped = page.text.strip()
            if not stripped:
                # Skip empty / scanned pages — Chunk's __post_init__ would
                # reject an empty text body.
                continue
            try:
                pieces = self._splitter.split_text(stripped)
            except Exception as exc:
                raise ChunkerError(
                    f"RecursiveCharacterTextSplitter failed on page {page.number} "
                    f"of {book_id}: {exc!r}"
                ) from exc

            for piece in pieces:
                piece = piece.strip()
                if not piece:
                    continue
                chunk = Chunk(
                    book_id=book_id,
                    text=piece,
                    page_start=page.number,
                    page_end=page.number,
                    ordinal=ordinal,
                )
                chunks.append(chunk)
                ordinal += 1

        if not chunks:
            raise ChunkerError(
                f"RecursiveChunker produced no chunks for {book_id}. "
                "The PDF may be all images or empty."
            )
        return chunks

    # --- end: chunk -------------------------------------------------------


# --- end: recursive chunker -----------------------------------------------
