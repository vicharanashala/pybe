"""Tests for ``Retriever``.

We mock the ``Embedder`` (so no model loads) and the
``VectorStoreRepository`` (so no on-disk FAISS). The retriever itself
is exercised for real.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pytest
from src.config.settings import Settings
from src.domain.chunk import Chunk
from src.domain.errors import IndexMissingError, TopicNotInBookError
from src.ingestion.embedders.base import Embedder
from src.ingestion.indexers.base import Indexer, SearchHit
from src.retrieval.retriever import Retriever, assert_topic_in_book
from src.retrieval.vector_store import VectorStoreRepository


# --- begin: fakes ---------------------------------------------------------
class FakeEmbedder(Embedder):
    """Returns deterministic unit vectors derived from the input length."""

    def __init__(self, dim: int = 4) -> None:
        self._dim = dim

    @property
    def name(self) -> str:
        return "fake"

    @property
    def dim(self) -> int:
        return self._dim

    def embed(self, texts: list[str]) -> np.ndarray:
        # Encode each text as a unit vector whose components depend on
        # ``len(text) % dim`` — so different texts produce different vectors
        # but the same text always produces the same one.
        out = np.zeros((len(texts), self._dim), dtype=np.float32)
        for i, t in enumerate(texts):
            seed = len(t) % self._dim
            out[i, seed] = 1.0
            out[i, (seed + 1) % self._dim] = 0.5
            out[i] /= np.linalg.norm(out[i]) + 1e-12
        return out


class FakeIndexer(Indexer):
    """Always returns the hits it was constructed with."""

    def __init__(self, hits: list[SearchHit], dim: int = 4) -> None:
        self._hits = hits
        self._dim = dim

    @property
    def name(self) -> str:
        return "fake"

    @property
    def dim(self) -> int:
        return self._dim

    @property
    def size(self) -> int:
        return len(self._hits)

    def add(self, vectors, ids) -> None:
        return None

    def search(self, query, k: int) -> list[SearchHit]:
        return [h for h in self._hits if 0 <= h.id < self.size][:k]

    def save(self, path: Path) -> None:
        return None

    @classmethod
    def load(cls, path: Path) -> FakeIndexer:
        # Pull the pre-seeded hits from the class-level map.
        return cls(hits=cls._PAYLOAD.get(path, []))  # type: ignore[arg-type]

    _PAYLOAD: dict[Path, list[SearchHit]] = {}


class FakeVectorStore(VectorStoreRepository):
    """A VectorStoreRepository that never touches disk.

    Pre-seed with chunks + an indexer; ``exists()`` always returns True.
    """

    def __init__(
        self,
        chunks_by_book: dict[str, list[Chunk]],
        indexer_by_book: dict[str, Indexer],
    ) -> None:
        # Bypass parent's __init__ entirely — we have no Settings/FAISS.
        self._chunks_by_book = chunks_by_book
        self._indexer_by_book = indexer_by_book

    def exists(self, book_id: str) -> bool:
        return book_id in self._indexer_by_book

    def get_indexer(self, book_id: str) -> Indexer:
        idx = self._indexer_by_book.get(book_id)
        if idx is None:
            raise IndexMissingError(f"No index for {book_id!r}")
        return idx

    def get_chunks(self, book_id: str) -> list[Chunk]:
        return list(self._chunks_by_book.get(book_id, []))


# --- end: fakes -----------------------------------------------------------


# --- begin: setup ---------------------------------------------------------
def _make_settings(min_score: float = 0.25, top_k: int = 3) -> Settings:
    """Settings with explicit threshold + top_k for predictable tests."""
    return Settings(retrieval_top_k=top_k, retrieval_min_score=min_score)


# --- end: setup -----------------------------------------------------------


# --- begin: happy-path ----------------------------------------------------
def test_retrieve_returns_chunks_mapped_by_id(tmp_data_dir: Path) -> None:
    """Each hit's ``id`` indexes into the chunk list."""
    book_id = "sha256_a1a1a1a1a1a1a1a1"
    chunks = [
        Chunk(book_id=book_id, text="decorators", page_start=2, page_end=2, ordinal=0),
        Chunk(book_id=book_id, text="generators", page_start=3, page_end=3, ordinal=1),
        Chunk(book_id=book_id, text="recursion", page_start=4, page_end=4, ordinal=2),
    ]
    indexer = FakeIndexer(
        hits=[
            SearchHit(id=0, score=0.9),
            SearchHit(id=1, score=0.4),
            SearchHit(id=2, score=0.3),
        ]
    )
    store = FakeVectorStore(chunks_by_book={book_id: chunks}, indexer_by_book={book_id: indexer})
    retriever = Retriever(settings=_make_settings(), embedder=FakeEmbedder(), vector_store=store)

    out = retriever.retrieve("decorators", book_id=book_id)

    assert [r.chunk.text for r in out] == ["decorators", "generators", "recursion"]
    assert [r.score for r in out] == [0.9, 0.4, 0.3]


def test_retrieve_filters_out_low_score_hits(tmp_data_dir: Path) -> None:
    """Hits below the configured threshold are dropped."""
    book_id = "sha256_b2b2b2b2b2b2b2b2"
    chunks = [
        Chunk(book_id=book_id, text="relevant", page_start=1, page_end=1, ordinal=0),
        Chunk(book_id=book_id, text="irrelevant", page_start=2, page_end=2, ordinal=1),
    ]
    indexer = FakeIndexer(
        hits=[
            SearchHit(id=0, score=0.8),
            SearchHit(id=1, score=0.1),  # below 0.25 default
        ]
    )
    store = FakeVectorStore(chunks_by_book={book_id: chunks}, indexer_by_book={book_id: indexer})
    retriever = Retriever(
        settings=_make_settings(min_score=0.25),
        embedder=FakeEmbedder(),
        vector_store=store,
    )
    out = retriever.retrieve("anything", book_id=book_id)
    assert [r.chunk.text for r in out] == ["relevant"]


def test_retrieve_respects_top_k(tmp_data_dir: Path) -> None:
    """``top_k`` caps the number of returned chunks."""
    book_id = "sha256_c3c3c3c3c3c3c3c3"
    chunks = [
        Chunk(book_id=book_id, text=f"chunk_{i}", page_start=i, page_end=i, ordinal=i)
        for i in range(5)
    ]
    indexer = FakeIndexer(hits=[SearchHit(id=i, score=1.0 - 0.1 * i) for i in range(5)])
    store = FakeVectorStore(chunks_by_book={book_id: chunks}, indexer_by_book={book_id: indexer})
    retriever = Retriever(
        settings=_make_settings(top_k=2),
        embedder=FakeEmbedder(),
        vector_store=store,
    )
    out = retriever.retrieve("anything", book_id=book_id, top_k=2)
    assert len(out) == 2


# --- end: happy-path ------------------------------------------------------


# --- begin: error-paths ---------------------------------------------------
def test_retrieve_empty_query_raises(tmp_data_dir: Path) -> None:
    """An empty query string is a programmer bug -> fail loud."""
    store = FakeVectorStore(chunks_by_book={}, indexer_by_book={})
    retriever = Retriever(settings=_make_settings(), embedder=FakeEmbedder(), vector_store=store)
    with pytest.raises(ValueError):
        retriever.retrieve("", book_id="any")


def test_retrieve_missing_book_raises_index_missing(tmp_data_dir: Path) -> None:
    """A book_id with no index raises ``IndexMissingError``."""
    store = FakeVectorStore(chunks_by_book={}, indexer_by_book={})
    retriever = Retriever(settings=_make_settings(), embedder=FakeEmbedder(), vector_store=store)
    with pytest.raises(IndexMissingError):
        retriever.retrieve("anything", book_id="no_such_book")


def test_assert_topic_in_book_raises_when_empty() -> None:
    """``assert_topic_in_book`` maps empty retrieval to ``TopicNotInBookError``."""
    with pytest.raises(TopicNotInBookError):
        assert_topic_in_book([], topic="biology")


def test_assert_topic_in_book_passes_when_non_empty() -> None:
    """A non-empty retrieval is a no-op."""
    chunks = [Chunk(book_id="b", text="x", page_start=1, page_end=1, ordinal=0)]
    from src.domain.chunk import RetrievedChunk

    assert_topic_in_book([RetrievedChunk(chunk=chunks[0], score=0.9)], topic="x")  # no raise


# --- end: error-paths -----------------------------------------------------


# --- begin: defensive-id-out-of-range -------------------------------------
def test_retrieve_skips_out_of_range_hit_ids(tmp_data_dir: Path) -> None:
    """A corrupt index returning an id > len(chunks) is logged and skipped."""
    book_id = "sha256_d4d4d4d4d4d4d4d4"
    chunks = [
        Chunk(book_id=book_id, text="only", page_start=1, page_end=1, ordinal=0),
    ]
    indexer = FakeIndexer(
        hits=[
            SearchHit(id=0, score=0.9),
            SearchHit(id=99, score=0.8),  # bogus id
        ]
    )
    store = FakeVectorStore(chunks_by_book={book_id: chunks}, indexer_by_book={book_id: indexer})
    retriever = Retriever(
        settings=_make_settings(),
        embedder=FakeEmbedder(),
        vector_store=store,
    )
    out = retriever.retrieve("x", book_id=book_id)
    assert [r.chunk.text for r in out] == ["only"]


# --- end: defensive-id-out-of-range ---------------------------------------
