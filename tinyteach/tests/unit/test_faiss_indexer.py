"""Tests for the FAISS indexer.

Pure-math tests; no model loading, no disk I/O beyond tmp_path.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pytest
from src.domain.errors import IndexerError
from src.ingestion.indexers.faiss_indexer import FaissIndexer


# --- begin: helpers --------------------------------------------------------
def _rand_unit(n: int, dim: int, seed: int = 0) -> np.ndarray:
    """Return ``n`` L2-normalised vectors of dimension ``dim``."""
    rng = np.random.default_rng(seed)
    v = rng.standard_normal((n, dim)).astype(np.float32)
    v /= np.linalg.norm(v, axis=1, keepdims=True) + 1e-12
    return v


# --- end: helpers ----------------------------------------------------------


# --- begin: empty-index ----------------------------------------------------
def test_empty_index_size_zero() -> None:
    """A fresh indexer has size 0."""
    idx = FaissIndexer(dim=16)
    assert idx.size == 0
    assert idx.dim == 16
    assert idx.name == "faiss"


def test_empty_index_search_returns_empty() -> None:
    """Searching an empty index returns ``[]``."""
    idx = FaissIndexer(dim=16)
    assert idx.search(_rand_unit(1, 16)[0], k=5) == []


# --- end: empty-index ------------------------------------------------------


# --- begin: add-and-search -------------------------------------------------
def test_add_grows_size() -> None:
    """``size`` reflects the number of vectors added."""
    idx = FaissIndexer(dim=8)
    idx.add(_rand_unit(3, 8), np.array([10, 20, 30]))
    assert idx.size == 3


def test_search_returns_topk_in_score_order() -> None:
    """Top-k hits are returned sorted by descending score."""
    dim = 32
    idx = FaissIndexer(dim=dim)
    corpus = _rand_unit(10, dim, seed=1)
    idx.add(corpus, np.arange(10))

    # Query == first corpus vector → id 0 must be the top hit.
    hits = idx.search(corpus[0], k=5)
    assert hits, "expected non-empty hits"
    assert hits[0].id == 0
    # Score desc.
    scores = [h.score for h in hits]
    assert scores == sorted(scores, reverse=True)


def test_search_pads_gracefully_when_k_exceeds_size() -> None:
    """If ``k > size`` we still return ``size`` hits, not crash."""
    idx = FaissIndexer(dim=8)
    idx.add(_rand_unit(3, 8), np.array([0, 1, 2]))
    hits = idx.search(_rand_unit(1, 8)[0], k=100)
    assert len(hits) == 3


# --- end: add-and-search ---------------------------------------------------


# --- begin: validation-errors ---------------------------------------------
def test_add_rejects_wrong_dim() -> None:
    """Mismatched dim raises ``IndexerError``."""
    idx = FaissIndexer(dim=8)
    with pytest.raises(IndexerError):
        idx.add(_rand_unit(2, 16), np.array([0, 1]))


def test_add_rejects_size_mismatch() -> None:
    """Vectors and ids must have the same length."""
    idx = FaissIndexer(dim=8)
    with pytest.raises(IndexerError):
        idx.add(_rand_unit(3, 8), np.array([0, 1]))


# --- end: validation-errors ----------------------------------------------


# --- begin: save-and-load -------------------------------------------------
def test_save_and_load_roundtrip(tmp_path: Path) -> None:
    """save → load → search returns the same hits."""
    idx = FaissIndexer(dim=16)
    corpus = _rand_unit(5, 16, seed=2)
    idx.add(corpus, np.array([100, 101, 102, 103, 104]))

    path = tmp_path / "index.faiss"
    idx.save(path)
    assert path.exists()
    assert (tmp_path / "index.ids.npy").exists()

    reloaded = FaissIndexer.load(path)
    assert reloaded.size == 5
    hits = reloaded.search(corpus[2], k=2)
    assert hits[0].id == 102


def test_load_missing_index_raises(tmp_path: Path) -> None:
    """Loading from a non-existent path raises ``IndexerError``."""
    with pytest.raises(IndexerError):
        FaissIndexer.load(tmp_path / "no_such.faiss")


# --- end: save-and-load ---------------------------------------------------
