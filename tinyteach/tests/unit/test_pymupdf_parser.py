"""Tests for the PyMuPDF parser adapter.

We generate a real 5-page PDF on the fly so the test exercises the
real PyMuPDF round-trip (no mocks).
"""

from __future__ import annotations

from pathlib import Path

import pymupdf
import pytest
from src.domain.errors import ParserError
from src.ingestion.parsers.pymupdf_parser import PyMuPDFParser


# --- begin: pdf fixture ----------------------------------------------------
@pytest.fixture()
def five_page_pdf(tmp_path: Path) -> Path:
    """Generate a 5-page PDF where each page contains a recognisable phrase."""
    path = tmp_path / "tiny_book.pdf"
    doc = pymupdf.open()
    try:
        for i in range(1, 6):
            page = doc.new_page()
            page.insert_text(
                (72, 72),
                f"Page {i}: python decorators wrap functions cleanly.",
                fontsize=11,
            )
        doc.save(str(path))
    finally:
        doc.close()
    return path


# --- end: pdf fixture ------------------------------------------------------


# --- begin: happy-path -----------------------------------------------------
def test_parse_returns_one_page_per_pdf_page(five_page_pdf: Path) -> None:
    """A 5-page PDF yields exactly 5 ``Page`` objects."""
    parser = PyMuPDFParser()
    pages = parser.parse(five_page_pdf)
    assert len(pages) == 5


def test_parse_preserves_page_numbers(five_page_pdf: Path) -> None:
    """Page numbers are 1-indexed and contiguous."""
    pages = PyMuPDFParser().parse(five_page_pdf)
    assert [p.number for p in pages] == [1, 2, 3, 4, 5]


def test_parse_extracts_recognisable_text(five_page_pdf: Path) -> None:
    """Each page contains the marker string we inserted."""
    pages = PyMuPDFParser().parse(five_page_pdf)
    for page in pages:
        assert "python decorators" in page.text.lower()


def test_parser_name_is_pymupdf() -> None:
    """The ``name`` property is the library identifier for logging."""
    assert PyMuPDFParser().name == "pymupdf"


# --- end: happy-path -------------------------------------------------------


# --- begin: error-paths ----------------------------------------------------
def test_parse_missing_file_raises(tmp_path: Path) -> None:
    """A non-existent path raises ``ParserError``."""
    with pytest.raises(ParserError):
        PyMuPDFParser().parse(tmp_path / "no_such.pdf")


def test_parse_empty_file_raises(tmp_path: Path) -> None:
    """A 0-byte file raises ``ParserError``."""
    p = tmp_path / "empty.pdf"
    p.write_bytes(b"")
    with pytest.raises(ParserError):
        PyMuPDFParser().parse(p)


# --- end: error-paths ------------------------------------------------------
