"""Relevance scoring helpers.

SRP-justification: similarity-to-decision logic lives in one place so the
threshold semantics are testable in isolation. The retriever pulls the
threshold from settings; the actual >= comparison lives here.
"""

from __future__ import annotations

from src.ingestion.indexers.base import SearchHit


# --- begin: threshold filter ----------------------------------------------
def is_relevant(score: float, threshold: float) -> bool:
    """Return ``True`` iff ``score`` meets or exceeds ``threshold``.

    The threshold is inclusive (``>=``). An empty result after filtering
    is the cue the retriever uses to raise ``TopicNotInBookError``
    (invariant I-9).
    """
    return float(score) >= float(threshold)


def filter_hits(hits: list[SearchHit], threshold: float) -> list[SearchHit]:
    """Return only hits with ``score >= threshold`` (in original order).

    Order is preserved so the retriever's output is stably sorted by
    score when the indexer returned pre-sorted hits (IndexFlatIP does).
    """
    return [h for h in hits if is_relevant(h.score, threshold)]


# --- end: threshold filter ------------------------------------------------
