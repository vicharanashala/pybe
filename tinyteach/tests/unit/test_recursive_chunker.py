"""Tests for ``RecursiveChunker``."""

from __future__ import annotations

import pytest
from src.config.settings import Settings
from src.domain.errors import ChunkerError
from src.ingestion.chunkers.recursive_chunker import RecursiveChunker
from src.ingestion.parsers.base import Page


# --- begin: chunker-needs-settings ----------------------------------------
def _make_chunker(chunk_size: int = 200, chunk_overlap: int = 50) -> RecursiveChunker:
    """Build a chunker with explicit settings (test isolation)."""
    s = Settings(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    return RecursiveChunker(s)


# --- end: chunker-needs-settings ------------------------------------------


# --- begin: happy-path -----------------------------------------------------
def test_chunk_assigns_strictly_increasing_ordinals() -> None:
    """Every chunk's ``ordinal`` is unique and 0-indexed."""
    pages = [
        Page(number=1, text="Python is a programming language. " * 30),
        Page(number=2, text="Decorators wrap functions. " * 30),
    ]
    chunks = _make_chunker().chunk(pages, book_id="b1")
    assert len(chunks) >= 2
    ordinals = [c.ordinal for c in chunks]
    assert ordinals == sorted(ordinals)
    assert ordinals[0] == 0
    assert len(set(ordinals)) == len(ordinals)  # unique


def test_chunk_preserves_page_numbers() -> None:
    """``page_start`` / ``page_end`` reflect the page the chunk came from."""
    pages = [Page(number=3, text="Hello world. " * 40)]
    chunks = _make_chunker().chunk(pages, book_id="b1")
    for chunk in chunks:
        assert chunk.page_start == 3
        assert chunk.page_end == 3
        assert chunk.book_id == "b1"


def test_chunk_skips_empty_pages() -> None:
    """A page with only whitespace produces zero chunks (no error)."""
    pages = [
        Page(number=1, text="Real content here. " * 40),
        Page(number=2, text="   \n\n   "),  # whitespace only
        Page(number=3, text="More real content. " * 40),
    ]
    chunks = _make_chunker().chunk(pages, book_id="b1")
    page_numbers = sorted({c.page_start for c in chunks})
    assert page_numbers == [1, 3]


# --- end: happy-path -------------------------------------------------------


# --- begin: error-paths ----------------------------------------------------
def test_chunk_empty_page_list_raises() -> None:
    """No pages at all is a hard error (the book is empty)."""
    with pytest.raises(ChunkerError):
        _make_chunker().chunk([], book_id="empty")


def test_chunk_all_pages_empty_raises() -> None:
    """Every page is whitespace → no chunks can be produced → ``ChunkerError``."""
    pages = [Page(number=1, text="   \n"), Page(number=2, text="\t\t")]
    with pytest.raises(ChunkerError):
        _make_chunker().chunk(pages, book_id="blank")


# --- end: error-paths ------------------------------------------------------
