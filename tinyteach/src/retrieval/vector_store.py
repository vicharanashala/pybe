"""Per-book vector store repository.

Repository role (GoF) — hides FAISS persistence behind ``VectorStoreRepository``.
Singleton-per-book (GoF): one ``get_indexer(book_id)`` returns a cached
instance until the process restarts or the cache is invalidated.

The repository is the ONLY place that knows where FAISS files live on
disk; the retriever talks to it abstractly.
"""

from __future__ import annotations

import json
import logging
from collections import OrderedDict

from src.config.settings import Settings
from src.domain.chunk import Chunk
from src.domain.errors import IndexMissingError
from src.ingestion.indexers.base import Indexer
from src.ingestion.pipeline import IngestionPipeline

logger = logging.getLogger(__name__)


# --- begin: vector-store-repository ----------------------------------------
class VectorStoreRepository:
    """Cache + load chunks-and-index for one ``book_id`` at a time.

    ``book_id`` is the natural cache key from ``BookFingerprint`` (Phase 1).
    A small LRU keeps memory bounded for users with many books.
    """

    # --- begin: lru-bound -------------------------------------------------
    # Hard cap on simultaneously-loaded books. ~50 MB per mid-sized book
    # → 4 books ≈ 200 MB, comfortably inside the free HF Space 16 GB RAM.
    _MAX_LOADED_BOOKS = 4
    # --- end: lru-bound ---------------------------------------------------

    def __init__(
        self,
        *,
        settings: Settings,
        indexer_cls: type[Indexer],
    ) -> None:
        # ``indexer_cls`` is the concrete class with a ``load(path)`` class
        # method. Keeping it injected (rather than hard-coded to FAISS)
        # lets tests substitute a fake Indexer.
        self._settings = settings
        self._indexer_cls = indexer_cls
        # OrderedDict gives O(1) get + O(1) move-to-end for LRU behaviour.
        self._indexers: OrderedDict[str, Indexer] = OrderedDict()
        # Chunks are tiny (text + metadata), no LRU needed — key-by-book_id.
        self._chunks: dict[str, list[Chunk]] = {}

    # --- begin: cache helpers ---------------------------------------------
    def _evict_oldest(self) -> None:
        """Drop the least-recently-used book to make room for a new one."""
        oldest_book_id, _oldest_indexer = self._indexers.popitem(last=False)
        self._chunks.pop(oldest_book_id, None)
        logger.info(
            "vector-store LRU eviction",
            extra={
                "where": "retrieval.vector_store.VectorStoreRepository",
                "book_id": oldest_book_id,
            },
        )

    # --- end: cache helpers -----------------------------------------------

    # --- begin: existence --------------------------------------------------
    def exists(self, book_id: str) -> bool:
        """Return ``True`` iff an index + chunks file exist for ``book_id``."""
        book_dir = self._settings.indices_dir / book_id
        index_path = book_dir / "index.faiss"
        chunks_path = book_dir / IngestionPipeline.FILENAME_CHUNKS
        return index_path.exists() and chunks_path.exists() and chunks_path.stat().st_size > 0

    # --- end: existence ---------------------------------------------------

    # --- begin: get_indexer_for_book ---------------------------------------
    def get_indexer(self, book_id: str) -> Indexer:
        """Return a (cached) ``Indexer`` for ``book_id``, loading if needed.

        Raises ``IndexMissingError`` when no on-disk index exists for the
        book — the caller should map this to a UI-friendly message.
        """
        if book_id in self._indexers:
            # Move to the back so the LRU marks this book as "fresh".
            self._indexers.move_to_end(book_id)
            return self._indexers[book_id]

        if not self.exists(book_id):
            raise IndexMissingError(
                f"No index on disk for book_id={book_id!r}. "
                "Did you forget to run the ingestion pipeline?"
            )

        book_dir = self._settings.indices_dir / book_id
        index_path = book_dir / "index.faiss"
        try:
            indexer = self._indexer_cls.load(index_path)  # type: ignore[attr-defined]
        except AttributeError as exc:
            # The injected class doesn't have a ``load`` classmethod — a
            # programming error in wiring, not a runtime data problem.
            raise IndexMissingError(
                f"Indexer class {self._indexer_cls.__name__} does not support .load(path)."
            ) from exc

        if len(self._indexers) >= self._MAX_LOADED_BOOKS:
            self._evict_oldest()
        self._indexers[book_id] = indexer
        logger.info(
            "vector-store loaded indexer",
            extra={
                "where": "retrieval.vector_store.VectorStoreRepository",
                "book_id": book_id,
            },
        )
        return indexer

    # --- end: get_indexer_for_book ----------------------------------------

    # --- begin: get_chunks_for_book ----------------------------------------
    def get_chunks(self, book_id: str) -> list[Chunk]:
        """Return the on-disk ``list[Chunk]`` for ``book_id``.

        Chunks are deterministic per ingestion, so caching by book_id is
        safe. Raises ``IndexMissingError`` if the chunks file is absent.
        """
        cached = self._chunks.get(book_id)
        if cached is not None:
            return cached

        if not self.exists(book_id):
            raise IndexMissingError(f"No chunks on disk for book_id={book_id!r}.")

        chunks_path = self._settings.indices_dir / book_id / IngestionPipeline.FILENAME_CHUNKS
        chunks: list[Chunk] = []
        with chunks_path.open("r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                chunks.append(Chunk.from_dict(json.loads(line)))
        self._chunks[book_id] = chunks
        return chunks

    # --- end: get_chunks_for_book -----------------------------------------

    # --- begin: cache-management ------------------------------------------
    def invalidate(self, book_id: str) -> None:
        """Drop cached index + chunks for a book (e.g. after re-ingest)."""
        self._indexers.pop(book_id, None)
        self._chunks.pop(book_id, None)

    def clear(self) -> None:
        """Drop ALL cached entries."""
        self._indexers.clear()
        self._chunks.clear()

    # --- end: cache-management --------------------------------------------


# --- end: vector-store-repository -----------------------------------------
