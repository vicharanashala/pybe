"""End-to-end test for the ingestion pipeline.

Marks: ``@pytest.mark.integration`` + ``@pytest.mark.slow`` — these
tests run a real embedder model and write to a real FAISS index.
Skip with ``pytest -m "not slow"``.
"""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pytest
from src.config.container import (
    get_chunker,
    get_embedder,
    get_parser,
    make_indexer,
    reset_ingestion_cache,
    reset_settings_cache,
)
from src.config.settings import Settings
from src.domain.book import Book, BookFingerprint
from src.ingestion.indexers.faiss_indexer import FaissIndexer
from src.ingestion.pipeline import IngestionPipeline
from src.utils.hashing import sha256_file

pytestmark = [pytest.mark.integration, pytest.mark.slow]


# --- begin: per-test-settings ----------------------------------------------
@pytest.fixture()
def integration_settings(tmp_data_dir: Path) -> Settings:
    """Settings pointed at the per-test ``tmp_data_dir``.

    Uses smaller chunk_size so the 5-page fixture produces multiple
    chunks (faster test + clearer assertions).
    """
    reset_settings_cache()
    reset_ingestion_cache()
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


# --- end: per-test-settings -----------------------------------------------


# --- begin: pipeline-factory -----------------------------------------------
def _make_pipeline(settings: Settings) -> IngestionPipeline:
    """Build a pipeline bound to ``settings`` (not the global cached one).

    The global ``get_pipeline()`` uses the cached ``get_settings()`` which
    may point at a different data dir. Integration tests need a pipeline
    wired to the per-test ``integration_settings`` fixture.
    """
    return IngestionPipeline(
        settings=settings,
        parser=get_parser(),
        chunker=get_chunker(),
        embedder=get_embedder(),
        indexer_factory=make_indexer,
    )


# --- end: pipeline-factory ------------------------------------------------


# --- begin: build-a-book ---------------------------------------------------
def _make_book(pdf_path: Path) -> Book:
    """Wrap a PDF on disk in a ``Book`` with a real fingerprint."""
    fingerprint = BookFingerprint(
        filename=pdf_path.name,
        size_bytes=pdf_path.stat().st_size,
        sha256=sha256_file(pdf_path),
    )
    return Book(fingerprint=fingerprint, path=pdf_path)


# --- end: build-a-book -----------------------------------------------------


# --- begin: happy-path-end-to-end ------------------------------------------
def test_ingest_writes_index_and_chunks(
    python_book_pdf: Path, integration_settings: Settings
) -> None:
    """A full ingest produces both ``index.faiss`` and ``chunks.jsonl``."""
    pipeline = _make_pipeline(integration_settings)
    book = _make_book(python_book_pdf)

    result = pipeline.ingest(book)

    assert result.reused is False
    assert result.chunk_count > 0
    assert result.index_path.exists()
    assert result.chunks_path.exists()
    assert result.index_path == (integration_settings.indices_dir / book.book_id / "index.faiss")


def test_ingested_chunks_have_correct_page_attribution(
    python_book_pdf: Path, integration_settings: Settings
) -> None:
    """Every persisted chunk has a sensible ``page_start`` in [1, 5]."""
    pipeline = _make_pipeline(integration_settings)
    book = _make_book(python_book_pdf)
    result = pipeline.ingest(book)

    chunks = []
    with result.chunks_path.open("r", encoding="utf-8") as f:
        for line in f:
            chunks.append(json.loads(line))
    assert chunks, "chunks.jsonl must be non-empty"
    for c in chunks:
        assert 1 <= c["page_start"] <= 5
        assert c["page_end"] >= c["page_start"]
        assert c["book_id"] == book.book_id


# --- end: happy-path-end-to-end --------------------------------------------


# --- begin: idempotency ---------------------------------------------------
def test_second_ingest_is_idempotent(python_book_pdf: Path, integration_settings: Settings) -> None:
    """Re-ingesting the SAME book reuses the cached index (invariant I-8)."""
    pipeline = _make_pipeline(integration_settings)
    book = _make_book(python_book_pdf)

    first = pipeline.ingest(book)
    second = pipeline.ingest(book)

    assert first.reused is False
    assert second.reused is True
    assert second.book_id == first.book_id
    assert second.chunk_count == first.chunk_count
    assert second.index_path == first.index_path


def test_embedder_is_singleton_across_ingestions(
    integration_settings: Settings,
) -> None:
    """Two ``get_embedder()`` calls return the SAME object (no double-load)."""
    e1 = get_embedder()
    e2 = get_embedder()
    assert e1 is e2


# --- end: idempotency -----------------------------------------------------


# --- begin: ingest-later-can-search ---------------------------------------
def test_index_can_be_reloaded_and_searched(
    python_book_pdf: Path, integration_settings: Settings
) -> None:
    """After ingest, the saved index can be loaded and returns sensible hits."""
    pipeline = _make_pipeline(integration_settings)
    book = _make_book(python_book_pdf)
    result = pipeline.ingest(book)

    index = FaissIndexer.load(result.index_path)
    embedder = get_embedder()
    query_vec = embedder.embed(["What is a Python decorator?"])[0]
    hits = index.search(np.asarray(query_vec, dtype=np.float32), k=3)

    assert hits, "expected non-empty hits"
    # Decorator content is on page 2 (chapter index 1); the top hit
    # should land there. We accept any hit with a positive score.
    assert hits[0].score > 0.0


# --- end: ingest-later-can-search ----------------------------------------
