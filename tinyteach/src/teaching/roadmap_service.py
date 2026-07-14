"""Roadmap service: wraps ``GenerationFacade.generate_roadmap`` with logging."""

from __future__ import annotations

import logging

from src.domain.case_study import CaseStudySet
from src.domain.roadmap import Roadmap
from src.generation.generator import GenerationFacade
from src.observability.correlation import with_correlation_id

logger = logging.getLogger(__name__)


# --- begin: roadmap-service -----------------------------------------------
class RoadmapService:
    """Generate a roadmap from a previously-produced case-study set."""

    def __init__(self, *, generator: GenerationFacade) -> None:
        self._generator = generator

    # --- begin: generate_for_topic ---------------------------------------
    def generate_for_topic(
        self,
        *,
        topic: str,
        book_id: str,
        case_study_set: CaseStudySet,
    ) -> Roadmap:
        """Ask the LLM to sequence ``case_study_set`` into a roadmap."""
        with with_correlation_id() as cid:
            logger.info(
                "roadmap service: start",
                extra={
                    "where": "teaching.roadmap_service.RoadmapService",
                    "topic": topic,
                    "book_id": book_id,
                    "n_studies": len(case_study_set.studies),
                    "corr_id": cid,
                },
            )
            roadmap = self._generator.generate_roadmap(
                topic=topic,
                book_id=book_id,
                case_study_set=case_study_set,
            )
            logger.info(
                "roadmap service: ok",
                extra={
                    "where": "teaching.roadmap_service.RoadmapService",
                    "topic": topic,
                    "book_id": book_id,
                    "n_milestones": len(roadmap.milestones),
                    "corr_id": cid,
                },
            )
            return roadmap

    # --- end: generate_for_topic ----------------------------------------


# --- end: roadmap-service -------------------------------------------------
