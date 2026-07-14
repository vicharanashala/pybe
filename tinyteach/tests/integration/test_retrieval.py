"""End-to-end test: ingest a PDF, then retrieve from it.

Marks: ``@pytest.mark.integration`` + ``@pytest.mark.slow`` — these
tests run a real embedder model + real FAISS index.
Skip with ``pytest -m "not slow"``.
"""

from __future__ import annotations

from pathlib import Path

import pytest
from src.config.container import (
    get_chunker,
    get_embedder,
    get_parser,
    make_indexer,
    reset_ingestion_cache,
    reset_retrieval_cache,
    reset_settings_cache,
)
from src.config.settings import Settings
from src.domain.book import Book, BookFingerprint
from src.domain.errors import IndexMissingError, TopicNotInBookError
from src.ingestion.indexers.faiss_indexer import FaissIndexer
from src.ingestion.pipeline import IngestionPipeline
from src.retrieval.retriever import Retriever, assert_topic_in_book
from src.retrieval.vector_store import VectorStoreRepository
from src.utils.hashing import sha256_file

pytestmark = [pytest.mark.integration, pytest.mark.slow]


# --- begin: per-test-settings ----------------------------------------------
@pytest.fixture()
def integration_settings(tmp_data_dir: Path) -> Settings:
    """Settings pointed at the per-test data dir + small chunks for speed."""
    reset_settings_cache()
    reset_ingestion_cache()
    reset_retrieval_cache()
    s = Settings(
        app_data_dir=tmp_data_dir,
        chunk_size=400,
        chunk_overlap=80,
        retrieval_top_k=4,
        retrieval_min_score=0.1,
    )
    s.ensure_data_dirs()
    yield s
    reset_settings_cache()
    reset_ingestion_cache()
    reset_retrieval_cache()


# --- end: per-test-settings -----------------------------------------------


# --- begin: pipeline + retriever builders ---------------------------------
def _make_pipeline(settings: Settings) -> IngestionPipeline:
    return IngestionPipeline(
        settings=settings,
        parser=get_parser(),
        chunker=get_chunker(),
        embedder=get_embedder(),
        indexer_factory=make_indexer,
    )


def _make_retriever(settings: Settings) -> Retriever:
    """Build a retriever bound to ``settings`` + a per-test vector store.

    The global ``get_vector_store()`` uses the cached ``get_settings()``
    which may point elsewhere — we always pass a fresh repo here.
    """
    repo = VectorStoreRepository(
        settings=settings,
        indexer_cls=FaissIndexer,
    )
    return Retriever(settings=settings, embedder=get_embedder(), vector_store=repo)


def _make_book(pdf_path: Path) -> Book:
    fingerprint = BookFingerprint(
        filename=pdf_path.name,
        size_bytes=pdf_path.stat().st_size,
        sha256=sha256_file(pdf_path),
    )
    return Book(fingerprint=fingerprint, path=pdf_path)


# --- end: pipeline + retriever builders -----------------------------------


# --- begin: happy-path ----------------------------------------------------
def test_retrieve_finds_decorator_chunks(
    python_book_pdf: Path, integration_settings: Settings
) -> None:
    """A query about decorators returns chunks from the Decorators chapter."""
    pipeline = _make_pipeline(integration_settings)
    book = _make_book(python_book_pdf)
    pipeline.ingest(book)

    retriever = _make_retriever(integration_settings)
    results = retriever.retrieve("Python decorators", book_id=book.book_id)

    assert results, "expected non-empty retrieval"
    # At least one result should mention "decorator" — that's the topic.
    texts = [r.chunk.text.lower() for r in results]
    assert any("decorator" in t for t in texts), texts


def test_retrieve_returns_chunks_with_scores(
    python_book_pdf: Path, integration_settings: Settings
) -> None:
    """Every result carries a similarity score in [0, 1]."""
    pipeline = _make_pipeline(integration_settings)
    book = _make_book(python_book_pdf)
    pipeline.ingest(book)

    retriever = _make_retriever(integration_settings)
    results = retriever.retrieve("recursion in Python", book_id=book.book_id)

    assert results
    for r in results:
        assert 0.0 <= r.score <= 1.0


# --- end: happy-path ------------------------------------------------------


# --- begin: out-of-scope-topic --------------------------------------------
def test_retrieve_biology_query_returns_empty(
    python_book_pdf: Path, integration_settings: Settings
) -> None:
    """A biology query on a Python book returns [] (no chunks above threshold)."""
    pipeline = _make_pipeline(integration_settings)
    book = _make_book(python_book_pdf)
    pipeline.ingest(book)

    retriever = _make_retriever(integration_settings)
    results = retriever.retrieve(
        "biology of sunflowers and golden ratio in phyllotaxis",
        book_id=book.book_id,
    )
    # Even with low threshold (0.1) this should be empty — nothing in the
    # 5-page Python book is about biology.
    assert results == []


def test_assert_topic_in_book_raises_for_uncovered_topic(
    python_book_pdf: Path, integration_settings: Settings
) -> None:
    """Empty retrieval -> ``TopicNotInBookError`` at the orchestration seam."""
    pipeline = _make_pipeline(integration_settings)
    book = _make_book(python_book_pdf)
    pipeline.ingest(book)

    retriever = _make_retriever(integration_settings)
    results = retriever.retrieve("photosynthesis in chloroplasts", book_id=book.book_id)
    with pytest.raises(TopicNotInBookError):
        assert_topic_in_book(results, topic="photosynthesis in chloroplasts")


# --- end: out-of-scope-topic ----------------------------------------------


# --- begin: missing-book --------------------------------------------------
def test_retrieve_missing_book_raises_index_missing(
    integration_settings: Settings,
) -> None:
    """A book_id with no on-disk index raises ``IndexMissingError``."""
    retriever = _make_retriever(integration_settings)
    with pytest.raises(IndexMissingError):
        retriever.retrieve("anything", book_id="sha256_doesnotexist1234")


# --- end: missing-book ----------------------------------------------------
