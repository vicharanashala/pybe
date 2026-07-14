"""PDF ingestion pipeline (Facade + Chain of Responsibility — GoF).

Facade role: callers see one ``ingest(book)`` method. The four stages
(parse → chunk → embed → index) and their errors stay hidden.

Chain of Responsibility role: each stage hands its output to the next.
We materialise that with a list of stage callables so adding a stage
(e.g. a redaction pass) is one entry in the chain, not a refactor.

Idempotency (invariant I-8): if the index directory for ``book.book_id``
already contains a complete index, we return ``IngestionResult(reused=True)``
WITHOUT re-embedding. The fingerprint path is the canonical cache key.
"""

from __future__ import annotations

import json
import logging
from collections.abc import Callable
from dataclasses import dataclass
from pathlib import Path

import numpy as np

from src.config import constants as C  # noqa: N812  (intentional short alias)
from src.config.settings import Settings
from src.domain.book import Book
from src.domain.chunk import Chunk
from src.domain.errors import EmbedderError, IndexerError, IngestionError
from src.ingestion.chunkers.base import Chunker
from src.ingestion.embedders.base import Embedder
from src.ingestion.indexers.base import Indexer
from src.ingestion.parsers.base import PDFParser

logger = logging.getLogger(__name__)


# --- begin: result dataclass ----------------------------------------------
@dataclass(frozen=True)
class IngestionResult:
    """What ``IngestionPipeline.ingest`` hands back to the caller."""

    book_id: str
    chunk_count: int
    index_path: Path
    chunks_path: Path
    reused: bool  # True iff we skipped re-embedding (invariant I-8)


# --- end: result dataclass ------------------------------------------------


# --- begin: pipeline ------------------------------------------------------
class IngestionPipeline:
    """Orchestrate parse → chunk → embed → index, idempotently.

    Strategies are injected at construction so tests can swap any of
    the four stages (parser / chunker / embedder / indexer) with fakes.
    """

    # --- begin: filenames -------------------------------------------------
    FILENAME_CHUNKS = "chunks.jsonl"
    # --- end: filenames ---------------------------------------------------

    def __init__(
        self,
        *,
        settings: Settings,
        parser: PDFParser,
        chunker: Chunker,
        embedder: Embedder,
        indexer_factory: Callable[[int], Indexer],
    ) -> None:
        self._settings = settings
        self._parser = parser
        self._chunker = chunker
        self._embedder = embedder
        self._indexer_factory = indexer_factory

    # --- begin: idempotency check -----------------------------------------
    def _is_cached(self, book: Book) -> tuple[bool, Path, Path]:
        """Return (cached?, index_path, chunks_path) for ``book``.

        Cache hit ⇔ index file AND chunks file both exist AND chunks
        file is non-empty.
        """
        book_dir = self._settings.indices_dir / book.book_id
        index_path = book_dir / "index.faiss"
        chunks_path = book_dir / self.FILENAME_CHUNKS
        if not (index_path.exists() and chunks_path.exists()):
            return False, index_path, chunks_path
        # ``stat().st_size > 0`` is a fast proxy for "non-empty".
        if chunks_path.stat().st_size == 0:
            return False, index_path, chunks_path
        return True, index_path, chunks_path

    # --- end: idempotency check -------------------------------------------

    # --- begin: ingest -----------------------------------------------------
    def ingest(self, book: Book) -> IngestionResult:
        """Run the full pipeline for ``book``, or return the cached result.

        Raises ``IngestionError`` (or one of its subclasses) on failure.
        """
        # --- begin: idempotency short-circuit ----------------------------
        cached, index_path, chunks_path = self._is_cached(book)
        if cached:
            chunk_count = sum(1 for _ in chunks_path.open("r", encoding="utf-8"))
            logger.info(
                "ingestion cache hit; reusing existing index",
                extra={
                    "where": "ingestion.pipeline.IngestionPipeline.ingest",
                    "book_id": book.book_id,
                },
            )
            return IngestionResult(
                book_id=book.book_id,
                chunk_count=chunk_count,
                index_path=index_path,
                chunks_path=chunks_path,
                reused=True,
            )
        # --- end: idempotency short-circuit ------------------------------

        # --- begin: stage 1 — parse --------------------------------------
        logger.info(
            "ingestion stage: parse",
            extra={
                "where": "ingestion.pipeline.stage",
                "book_id": book.book_id,
                "stage": "parse",
                "parser": self._parser.name,
            },
        )
        pages = self._parser.parse(book.path)
        if not pages:
            raise IngestionError(
                f"Parser {self._parser.name} returned zero pages for {book.book_id}."
            )
        # --- end: stage 1 — parse ----------------------------------------

        # --- begin: stage 2 — chunk --------------------------------------
        logger.info(
            "ingestion stage: chunk",
            extra={
                "where": "ingestion.pipeline.stage",
                "book_id": book.book_id,
                "stage": "chunk",
                "chunker": self._chunker.name,
                "pages": len(pages),
            },
        )
        chunks = self._chunker.chunk(pages, book_id=book.book_id)
        if len(chunks) > C.MAX_CHUNKS_PER_BOOK:
            raise IngestionError(
                f"Book produced {len(chunks)} chunks; cap is {C.MAX_CHUNKS_PER_BOOK}."
            )
        # --- end: stage 2 — chunk ----------------------------------------

        # --- begin: stage 3 — embed --------------------------------------
        logger.info(
            "ingestion stage: embed",
            extra={
                "where": "ingestion.pipeline.stage",
                "book_id": book.book_id,
                "stage": "embed",
                "embedder": self._embedder.name,
                "chunks": len(chunks),
            },
        )
        try:
            vectors = self._embedder.embed([c.text for c in chunks])
        except EmbedderError:
            raise  # already a domain error — propagate unchanged
        if vectors.shape[0] != len(chunks):
            raise IngestionError(
                f"Embedder returned {vectors.shape[0]} vectors for {len(chunks)} chunks."
            )
        # --- end: stage 3 — embed ----------------------------------------

        # --- begin: stage 4 — index --------------------------------------
        logger.info(
            "ingestion stage: index",
            extra={
                "where": "ingestion.pipeline.stage",
                "book_id": book.book_id,
                "stage": "index",
                "indexer": self._indexer_factory(self._embedder.dim).name,
                "vectors": int(vectors.shape[0]),
                "dim": int(vectors.shape[1]),
            },
        )
        indexer = self._indexer_factory(self._embedder.dim)
        ids = np.arange(len(chunks), dtype=np.int64)
        try:
            indexer.add(vectors, ids)
            indexer.save(index_path)
        except IndexerError:
            raise  # already a domain error — propagate unchanged
        # --- end: stage 4 — index ----------------------------------------

        # --- begin: persist chunks ---------------------------------------
        self._write_chunks(chunks, chunks_path)
        # --- end: persist chunks -----------------------------------------

        logger.info(
            "ingestion complete",
            extra={
                "where": "ingestion.pipeline.IngestionPipeline.ingest",
                "book_id": book.book_id,
                "chunk_count": len(chunks),
            },
        )
        return IngestionResult(
            book_id=book.book_id,
            chunk_count=len(chunks),
            index_path=index_path,
            chunks_path=chunks_path,
            reused=False,
        )

    # --- end: ingest -------------------------------------------------------

    # --- begin: chunks persistence ----------------------------------------
    def _write_chunks(self, chunks: list[Chunk], path: Path) -> None:
        """Serialise ``chunks`` to JSONL at ``path``. Atomic via tmp-file rename.

        The mapping ``index[i]`` ↔ line ``i`` is preserved by writing
        chunks in the same order they were added to the index.
        """
        path.parent.mkdir(parents=True, exist_ok=True)
        tmp = path.with_suffix(path.suffix + ".tmp")
        try:
            with tmp.open("w", encoding="utf-8") as f:
                for chunk in chunks:
                    f.write(json.dumps(chunk.to_dict(), ensure_ascii=False))
                    f.write("\n")
            tmp.replace(path)
        except Exception as exc:
            raise IngestionError(f"Could not write chunks to {path}: {exc!r}") from exc

    # --- end: chunks persistence -----------------------------------------


# --- end: pipeline --------------------------------------------------------
