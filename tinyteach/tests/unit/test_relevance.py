"""Tests for ``src.retrieval.relevance`` (pure logic, no I/O)."""

from __future__ import annotations

from src.ingestion.indexers.base import SearchHit
from src.retrieval.relevance import filter_hits, is_relevant


# --- begin: is_relevant ---------------------------------------------------
def test_is_relevant_at_threshold() -> None:
    """Score == threshold is included (>=, not >)."""
    assert is_relevant(0.25, 0.25) is True


def test_is_relevant_above_threshold() -> None:
    """Score > threshold is included."""
    assert is_relevant(0.5, 0.25) is True


def test_is_relevant_below_threshold() -> None:
    """Score < threshold is excluded."""
    assert is_relevant(0.24, 0.25) is False


def test_is_relevant_with_zero_threshold() -> None:
    """Threshold 0 includes every non-negative score."""
    assert is_relevant(0.0, 0.0) is True
    assert is_relevant(0.001, 0.0) is True


# --- end: is_relevant -----------------------------------------------------


# --- begin: filter_hits ---------------------------------------------------
def test_filter_hits_keeps_only_above_threshold() -> None:
    """``filter_hits`` drops every hit strictly below the threshold."""
    hits = [
        SearchHit(id=0, score=0.9),
        SearchHit(id=1, score=0.2),
        SearchHit(id=2, score=0.5),
        SearchHit(id=3, score=0.1),
    ]
    out = filter_hits(hits, threshold=0.25)
    assert [h.id for h in out] == [0, 2]


def test_filter_hits_preserves_order() -> None:
    """Order of the input list is preserved (FAISS already sorts desc)."""
    hits = [
        SearchHit(id=10, score=0.9),
        SearchHit(id=20, score=0.5),
        SearchHit(id=30, score=0.3),
    ]
    out = filter_hits(hits, threshold=0.25)
    assert [h.id for h in out] == [10, 20, 30]


def test_filter_hits_empty_input() -> None:
    """Empty input -> empty output (no exception)."""
    assert filter_hits([], threshold=0.5) == []


def test_filter_hits_all_below_threshold() -> None:
    """If nothing passes, return [] (this triggers TopicNotInBookError upstream)."""
    hits = [SearchHit(id=0, score=0.1), SearchHit(id=1, score=0.2)]
    assert filter_hits(hits, threshold=0.5) == []


# --- end: filter_hits -----------------------------------------------------
