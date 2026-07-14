"""Topic → chunks retrieval (Facade — GoF).

Facade role: the rest of the codebase (teaching service, UI) talks to
one method — ``retrieve(query, book_id)`` — and never touches the
embedder / vector store / indexer directly. Swapping any of them is a
container-wiring change.

Threshold semantics live in ``relevance.py``. ``TopicNotInBookError`` is
raised when zero hits pass the threshold — this is the invariant I-9
gate (no hallucinated content for unsupported topics).
"""

from __future__ import annotations

import logging

import numpy as np

from src.config.settings import Settings
from src.domain.chunk import RetrievedChunk
from src.domain.errors import IndexMissingError, TopicNotInBookError
from src.ingestion.embedders.base import Embedder
from src.ingestion.indexers.base import Indexer
from src.retrieval.relevance import filter_hits
from src.retrieval.vector_store import VectorStoreRepository

logger = logging.getLogger(__name__)


# --- begin: retriever ------------------------------------------------------
class Retriever:
    """One-call orchestrator: query → embed → search → filter → map → return."""

    def __init__(
        self,
        *,
        settings: Settings,
        embedder: Embedder,
        vector_store: VectorStoreRepository,
    ) -> None:
        self._settings = settings
        self._embedder = embedder
        self._vector_store = vector_store

    # --- begin: retrieve ---------------------------------------------------
    def retrieve(
        self,
        query: str,
        *,
        book_id: str,
        top_k: int | None = None,
    ) -> list[RetrievedChunk]:
        """Return the most relevant chunks for ``query`` in ``book_id``.

        Returns ``[]`` if no hits pass the score threshold. The teaching
        service (Phase 5) maps an empty result to ``TopicNotInBookError``
        at the orchestration boundary so this method stays focused on the
        retrieval contract.
        """
        if not query or not query.strip():
            raise ValueError("Retriever.retrieve: query must be non-empty.")

        effective_k = top_k if top_k is not None else self._settings.retrieval_top_k
        if effective_k <= 0:
            return []

        # --- begin: embed query -----------------------------------------
        # Embedder returns (1, dim) — we take row 0.
        query_vector = self._embedder.embed([query])[0]
        # --- end: embed query -------------------------------------------

        # --- begin: search ------------------------------------------------
        try:
            indexer: Indexer = self._vector_store.get_indexer(book_id)
        except IndexMissingError:
            # No index on disk for this book. Let the caller (teaching
            # service) turn this into a UI-friendly message.
            raise

        hits = indexer.search(np.asarray(query_vector, dtype=np.float32), k=effective_k)
        # --- end: search --------------------------------------------------

        # --- begin: threshold filter -------------------------------------
        relevant = filter_hits(hits, threshold=self._settings.retrieval_min_score)
        # --- end: threshold filter --------------------------------------

        # --- begin: map hits -> chunks -----------------------------------
        # Positional mapping: indexer row i ↔ chunks[i].
        chunks = self._vector_store.get_chunks(book_id)
        out: list[RetrievedChunk] = []
        for hit in relevant:
            if 0 <= hit.id < len(chunks):
                out.append(RetrievedChunk(chunk=chunks[hit.id], score=hit.score))
            else:
                # Defensive: a corrupt indexer could return out-of-range
                # ids. Log and skip rather than raise (avoids taking down
                # the whole response on one bad row).
                logger.warning(
                    "retriever: hit id out of range; skipping",
                    extra={
                        "where": "retrieval.retriever.Retriever",
                        "book_id": book_id,
                    },
                )
        # --- end: map hits -> chunks -------------------------------------

        logger.info(
            "retrieval complete",
            extra={
                "where": "retrieval.retriever.Retriever",
                "book_id": book_id,
                "topic": query,
            },
        )
        return out

    # --- end: retrieve -----------------------------------------------------


# --- end: retriever --------------------------------------------------------


# --- begin: helper-for-orchestration ---------------------------------------
def assert_topic_in_book(retrieved: list[RetrievedChunk], *, topic: str) -> None:
    """Raise ``TopicNotInBookError`` if ``retrieved`` is empty.

    This is the single mapping point from "no hits" to the
    blueprint-defined ``TOPIC_NOT_IN_BOOK`` behaviour. Kept here (not in
    the retriever) so the retriever's contract stays "empty list = no
    matches" while the teaching service raises the domain error.
    """
    if not retrieved:
        raise TopicNotInBookError(
            f"Topic {topic!r} is not covered by the book (no chunks "
            f"passed the retrieval threshold)."
        )


# --- end: helper-for-orchestration -----------------------------------------
