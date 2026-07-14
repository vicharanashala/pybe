"""Tests for ``VectorStoreRepository``.

We swap in a ``FakeIndexer`` so tests don't depend on FAISS or the
filesystem beyond the chunks.jsonl that the repo itself reads.
"""

from __future__ import annotations

import json
from collections.abc import Iterator
from pathlib import Path

import pytest
from src.config.settings import Settings
from src.domain.chunk import Chunk
from src.domain.errors import IndexMissingError
from src.ingestion.indexers.base import Indexer, SearchHit
from src.ingestion.pipeline import IngestionPipeline
from src.retrieval.vector_store import VectorStoreRepository


# --- begin: fake-indexer ---------------------------------------------------
class FakeIndexer(Indexer):
    """In-memory indexer used only by these tests.

    Pretends to load/save; ``search`` returns a configurable list of hits.
    Tracks the number of ``.load()`` calls so we can assert caching.
    """

    load_calls: list[Path] = []  # class-level counter

    def __init__(self, hits: list[SearchHit] | None = None, dim: int = 4) -> None:
        self._dim = dim
        self._hits = hits or []
        self._size = 5  # arbitrary

    @property
    def name(self) -> str:
        return "fake"

    @property
    def dim(self) -> int:
        return self._dim

    @property
    def size(self) -> int:
        return self._size

    def add(self, vectors, ids) -> None:  # not used in these tests
        return None

    def search(self, query, k: int) -> list[SearchHit]:
        return self._hits[:k]

    def save(self, path: Path) -> None:
        return None

    @classmethod
    def load(cls, path: Path) -> FakeIndexer:
        cls.load_calls.append(path)
        # The "hits" are stashed in a side-channel so tests can vary them.
        return cls(hits=cls._HITS_PAYLOAD.get(path, []))

    # Class-level storage of "what to return for which book path".
    _HITS_PAYLOAD: dict[Path, list[SearchHit]] = {}


# --- end: fake-indexer ----------------------------------------------------


# --- begin: per-test-reset ------------------------------------------------
@pytest.fixture(autouse=True)
def _reset_fake_state() -> Iterator[None]:
    """Clear the fake's class-level state between tests."""
    FakeIndexer.load_calls = []
    FakeIndexer._HITS_PAYLOAD = {}
    yield
    FakeIndexer.load_calls = []
    FakeIndexer._HITS_PAYLOAD = {}


# --- end: per-test-reset --------------------------------------------------


# --- begin: setup ---------------------------------------------------------
def _seed_chunks_file(book_dir: Path, chunks: list[Chunk]) -> None:
    """Write a valid ``chunks.jsonl`` into ``book_dir``."""
    book_dir.mkdir(parents=True, exist_ok=True)
    chunks_path = book_dir / IngestionPipeline.FILENAME_CHUNKS
    with chunks_path.open("w", encoding="utf-8") as f:
        for c in chunks:
            f.write(json.dumps(c.to_dict(), ensure_ascii=False))
            f.write("\n")
    # Touch the index file too so ``exists()`` returns True.
    (book_dir / "index.faiss").write_bytes(b"\x00" * 64)


def _make_settings(tmp_data_dir: Path) -> Settings:
    """Settings pointed at the per-test data dir."""
    s = Settings(app_data_dir=tmp_data_dir)
    s.ensure_data_dirs()
    return s


# --- end: setup -----------------------------------------------------------


# --- begin: existence -----------------------------------------------------
def test_exists_false_when_no_index(tmp_data_dir: Path) -> None:
    """A book with no files on disk does not exist."""
    s = _make_settings(tmp_data_dir)
    repo = VectorStoreRepository(settings=s, indexer_cls=FakeIndexer)
    assert repo.exists("nonexistent_book") is False


def test_exists_true_when_index_and_chunks_present(tmp_data_dir: Path) -> None:
    """Both files present (chunks non-empty) -> exists."""
    s = _make_settings(tmp_data_dir)
    book_id = "sha256_aaaaaaaaaaaaaaaa"
    _seed_chunks_file(
        s.indices_dir / book_id,
        [Chunk(book_id=book_id, text="hi", page_start=1, page_end=1, ordinal=0)],
    )
    repo = VectorStoreRepository(settings=s, indexer_cls=FakeIndexer)
    assert repo.exists(book_id) is True


# --- end: existence -------------------------------------------------------


# --- begin: missing-book-error --------------------------------------------
def test_get_indexer_raises_when_missing(tmp_data_dir: Path) -> None:
    """A missing book raises ``IndexMissingError`` (no fallback)."""
    s = _make_settings(tmp_data_dir)
    repo = VectorStoreRepository(settings=s, indexer_cls=FakeIndexer)
    with pytest.raises(IndexMissingError):
        repo.get_indexer("does_not_exist")


# --- end: missing-book-error ----------------------------------------------


# --- begin: caching -------------------------------------------------------
def test_repeated_get_indexer_loads_only_once(tmp_data_dir: Path) -> None:
    """A cached book is NOT re-loaded on subsequent calls."""
    s = _make_settings(tmp_data_dir)
    book_id = "sha256_bbbbbbbbbbbbbbbb"
    _seed_chunks_file(
        s.indices_dir / book_id,
        [Chunk(book_id=book_id, text="hi", page_start=1, page_end=1, ordinal=0)],
    )
    repo = VectorStoreRepository(settings=s, indexer_cls=FakeIndexer)

    repo.get_indexer(book_id)
    repo.get_indexer(book_id)
    repo.get_indexer(book_id)
    assert len(FakeIndexer.load_calls) == 1


def test_invalidate_drops_cached_index(tmp_data_dir: Path) -> None:
    """``invalidate`` forces the next ``get_indexer`` to re-load."""
    s = _make_settings(tmp_data_dir)
    book_id = "sha256_cccccccccccccccc"
    _seed_chunks_file(
        s.indices_dir / book_id,
        [Chunk(book_id=book_id, text="hi", page_start=1, page_end=1, ordinal=0)],
    )
    repo = VectorStoreRepository(settings=s, indexer_cls=FakeIndexer)
    repo.get_indexer(book_id)
    repo.invalidate(book_id)
    repo.get_indexer(book_id)
    assert len(FakeIndexer.load_calls) == 2


# --- end: caching ---------------------------------------------------------


# --- begin: chunks-roundtrip ----------------------------------------------
def test_get_chunks_returns_parsed_chunks(tmp_data_dir: Path) -> None:
    """Chunks are deserialised from the on-disk JSONL file."""
    s = _make_settings(tmp_data_dir)
    book_id = "sha256_dddddddddddddddd"
    seed = [
        Chunk(book_id=book_id, text="alpha", page_start=1, page_end=1, ordinal=0),
        Chunk(book_id=book_id, text="beta", page_start=2, page_end=2, ordinal=1),
    ]
    _seed_chunks_file(s.indices_dir / book_id, seed)
    repo = VectorStoreRepository(settings=s, indexer_cls=FakeIndexer)
    out = repo.get_chunks(book_id)
    assert [c.text for c in out] == ["alpha", "beta"]
    assert out[1].page_start == 2


# --- end: chunks-roundtrip ------------------------------------------------


# --- begin: lru-eviction --------------------------------------------------
def test_lru_eviction_when_too_many_books_loaded(tmp_data_dir: Path) -> None:
    """Loading the (N+1)th book evicts the least-recently-used one."""
    s = _make_settings(tmp_data_dir)
    for i in range(VectorStoreRepository._MAX_LOADED_BOOKS + 1):
        book_id = f"sha256_e{i:016d}"
        _seed_chunks_file(
            s.indices_dir / book_id,
            [Chunk(book_id=book_id, text="x", page_start=1, page_end=1, ordinal=0)],
        )

    repo = VectorStoreRepository(settings=s, indexer_cls=FakeIndexer)
    # Load the first book; then load enough new ones to push it out.
    repo.get_indexer(f"sha256_e{0:016d}")
    for i in range(1, VectorStoreRepository._MAX_LOADED_BOOKS + 1):
        repo.get_indexer(f"sha256_e{i:016d}")
    # ``e0`` should have been evicted; re-loading it must hit disk again.
    calls_before = len(FakeIndexer.load_calls)
    repo.get_indexer(f"sha256_e{0:016d}")
    assert len(FakeIndexer.load_calls) > calls_before


# --- end: lru-eviction ----------------------------------------------------
