"""Case-study service: glue between retrieval and generation.

Wraps the retriever + ``GenerationFacade`` in a single ``generate_for_topic``
call. Propagates a correlation id so the entire retrieval → generation
chain shares one log trail.
"""

from __future__ import annotations

import logging

from src.config.settings import Settings
from src.domain.case_study import CaseStudySet
from src.generation.generator import GenerationFacade
from src.observability.correlation import with_correlation_id
from src.retrieval.retriever import Retriever

logger = logging.getLogger(__name__)


# --- begin: case-study-service -------------------------------------------
class CaseStudyService:
    """Retrieve chunks for ``topic`` then generate the case-study set."""

    def __init__(
        self,
        *,
        settings: Settings,
        retriever: Retriever,
        generator: GenerationFacade,
    ) -> None:
        self._settings = settings
        self._retriever = retriever
        self._generator = generator

    # --- begin: generate_for_topic --------------------------------------
    def generate_for_topic(self, *, topic: str, book_id: str) -> CaseStudySet:
        """Retrieve top-k chunks for ``topic``, then call the LLM.

        Raises ``TopicNotInBookError`` from the retriever when the topic
        is not covered by the book (invariant I-9).
        """
        with with_correlation_id() as cid:
            logger.info(
                "case study service: start",
                extra={
                    "where": "teaching.case_study_service.CaseStudyService",
                    "topic": topic,
                    "book_id": book_id,
                    "corr_id": cid,
                },
            )
            # --- begin: retrieval ---------------------------------------
            retrieved = self._retriever.retrieve(topic, book_id=book_id)
            if not retrieved:
                # The retriever returns [] when the topic is not grounded.
                # We surface that as TopicNotInBookError so the
                # teaching service can map it to the UI's "topic not
                # covered" banner (invariant I-9).
                from src.retrieval.retriever import assert_topic_in_book

                assert_topic_in_book(retrieved, topic=topic)
                # Unreachable: assert_topic_in_book raises when empty.
                raise RuntimeError("assert_topic_in_book did not raise")  # pragma: no cover
            chunks = [rc.chunk.text for rc in retrieved]
            # --- end: retrieval -----------------------------------------

            # --- begin: generation --------------------------------------
            case_studies = self._generator.generate_case_studies(
                topic=topic,
                book_id=book_id,
                top_k=self._settings.retrieval_top_k,
                context_chunks=chunks,
            )
            # --- end: generation ----------------------------------------

            logger.info(
                "case study service: ok",
                extra={
                    "where": "teaching.case_study_service.CaseStudyService",
                    "topic": topic,
                    "book_id": book_id,
                    "n_studies": len(case_studies.studies),
                    "corr_id": cid,
                },
            )
            return case_studies

    # --- end: generate_for_topic ----------------------------------------


# --- end: case-study-service --------------------------------------------
