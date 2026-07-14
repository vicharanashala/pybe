"""PDF-parser interface (Strategy — GoF).

SRP-justification: the ``IngestionPipeline`` knows about a generic
``PDFParser`` and never about a concrete library. Adding a new parser
(pdfplumber, unstructured, …) is a one-class change with no effect on
downstream code.

Together with ``PyMuPDFParser`` this folder realises the Adapter role
of the GoF catalogue: a common interface over different PDF libraries.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from pathlib import Path


# --- begin: page value object ---------------------------------------------
@dataclass(frozen=True)
class Page:
    """One page of a parsed PDF.

    ``number`` is 1-indexed (matches what a human reader sees).
    ``text`` is the raw extracted text — cleaning/normalisation is the
    chunker's job, NOT the parser's. This keeps each Strategy single-
    purpose.
    """

    number: int
    text: str


# --- end: page value object -----------------------------------------------


# --- begin: parser abstract -----------------------------------------------
class PDFParser(ABC):
    """Strategy interface for converting a PDF file into ``list[Page]``."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Library identifier — logged in the ingestion audit trail."""

    @abstractmethod
    def parse(self, path: Path) -> list[Page]:
        """Parse ``path`` and return one ``Page`` per PDF page.

        Contract:
        - Returns pages in document order.
        - Empty text for a page is allowed (scanned PDFs) — the chunker
          filters them out.
        - Raises ``ParserError`` on failure (corrupt, encrypted, missing).
        """


# --- end: parser abstract -------------------------------------------------
