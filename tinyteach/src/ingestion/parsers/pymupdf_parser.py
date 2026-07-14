"""PyMuPDF (fitz) parser adapter.

Adapter role (GoF) — wraps PyMuPDF's iterator-based API behind the
project's ``PDFParser`` Strategy interface.

Failure policy: every PyMuPDF call is guarded. We raise ``ParserError``
from ``src.domain.errors`` so the rest of the pipeline can do a single
``except ParserError`` (invariant I-18: failure is loud).
"""

from __future__ import annotations

import contextlib
from pathlib import Path

import pymupdf  # PyMuPDF >= 1.24

from src.domain.errors import ParserError
from src.ingestion.parsers.base import Page, PDFParser


# --- begin: pymupdf adapter ------------------------------------------------
class PyMuPDFParser(PDFParser):
    """Concrete ``PDFParser`` backed by PyMuPDF."""

    @property
    def name(self) -> str:
        return "pymupdf"

    # --- begin: parse -----------------------------------------------------
    def parse(self, path: Path) -> list[Page]:
        """Open ``path`` and yield one ``Page`` per document page.

        We open the document lazily inside a ``with`` block so partial
        reads on a corrupt PDF do not leak file handles.
        """
        if not path.exists():
            raise ParserError(f"PDF not found at {path}.")
        if path.stat().st_size == 0:
            raise ParserError(f"PDF at {path} is empty (0 bytes).")

        try:
            doc = pymupdf.open(path)
        except Exception as exc:  # pymupdf raises a wide variety of types
            raise ParserError(f"PyMuPDF could not open {path}: {exc!r}") from exc

        try:
            pages: list[Page] = []
            for index in range(doc.page_count):
                try:
                    raw = doc.load_page(index).get_text("text")
                except Exception as exc:
                    raise ParserError(
                        f"PyMuPDF could not read page {index + 1} of {path}: {exc!r}"
                    ) from exc
                pages.append(Page(number=index + 1, text=raw or ""))
            return pages
        finally:
            # Always close, even on partial failure. Closing a corrupt
            # doc can itself raise; we silently absorb that.
            with contextlib.suppress(Exception):
                doc.close()

    # --- end: parse -------------------------------------------------------


# --- end: pymupdf adapter -------------------------------------------------
