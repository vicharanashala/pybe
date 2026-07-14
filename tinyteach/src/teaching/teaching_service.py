"""Top-level teaching service — the single entry point for the UI.

Combines case-study and roadmap generation behind one ``teach()`` call.
Catches ``TopicNotInBookError`` and converts it to a structured
``TeachingResult`` with ``status == "topic_not_in_book"`` so the UI can
render a friendly message (invariant I-9 — never hallucinate).
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Literal

from src.domain.case_study import CaseStudySet
from src.domain.errors import TopicNotInBookError
from src.domain.roadmap import Roadmap
from src.observability.correlation import with_correlation_id
from src.teaching.case_study_service import CaseStudyService
from src.teaching.roadmap_service import RoadmapService

logger = logging.getLogger(__name__)

# Two outcome states for the UI to discriminate on.
TeachingStatus = Literal["ok", "topic_not_in_book"]


# --- begin: result-dto ---------------------------------------------------
@dataclass(frozen=True)
class TeachingResult:
    """What ``TeachingService.teach`` returns to the UI.

    Invariant I-9: ``status == "topic_not_in_book"`` is signalled
    *structurally*, never via an exception. ``case_studies`` and
    ``roadmap`` are ``None`` in that case.
    """

    status: TeachingStatus
    topic: str
    book_id: str
    case_studies: CaseStudySet | None
    roadmap: Roadmap | None
    # Phase 8: the language used to generate this result. Used by the UI
    # to label code fences in the Markdown download.
    language: str = "python"
    # Phase 8: marks pre-computed samples from ``data/golden/`` (shown
    # via the "Try a demo" button). Always ``False`` for live results.
    is_demo: bool = False
    message: str | None = None

    def to_dict(self) -> dict[str, object]:
        out: dict[str, object] = {
            "status": self.status,
            "topic": self.topic,
            "book_id": self.book_id,
            "language": self.language,
            "is_demo": self.is_demo,
        }
        if self.case_studies is not None:
            out["case_studies"] = self.case_studies.to_dict()
        if self.roadmap is not None:
            out["roadmap"] = self.roadmap.to_dict()
        if self.message is not None:
            out["message"] = self.message
        return out


# --- end: result-dto ----------------------------------------------------


# --- begin: teaching-service ---------------------------------------------
class TeachingService:
    """Single-call orchestrator: topic + book_id → (case studies, roadmap)."""

    def __init__(
        self,
        *,
        case_study_service: CaseStudyService,
        roadmap_service: RoadmapService,
    ) -> None:
        self._case_study_service = case_study_service
        self._roadmap_service = roadmap_service

    # --- begin: teach ----------------------------------------------------
    def teach(
        self,
        *,
        topic: str,
        book_id: str,
        language: str = "python",
    ) -> TeachingResult:
        """Generate case studies (and if successful, a roadmap) for ``topic``.

        NEVER raises ``TopicNotInBookError`` — the UI sees a
        ``TeachingResult(status="topic_not_in_book", ...)``. Other
        domain errors (out-of-memory schema failures after retries,
        provider down, etc.) DO propagate.
        """
        with with_correlation_id() as cid:
            logger.info(
                "teach: start",
                extra={
                    "where": "teaching.teaching_service.TeachingService",
                    "topic": topic,
                    "book_id": book_id,
                    "language": language,
                    "corr_id": cid,
                },
            )
            # --- begin: case-studies-stage -----------------------------
            try:
                case_studies = self._case_study_service.generate_for_topic(
                    topic=topic, book_id=book_id
                )
            except TopicNotInBookError:
                logger.info(
                    "teach: topic not in book",
                    extra={
                        "where": "teaching.teaching_service.TeachingService",
                        "topic": topic,
                        "book_id": book_id,
                        "language": language,
                        "corr_id": cid,
                    },
                )
                return TeachingResult(
                    status="topic_not_in_book",
                    topic=topic,
                    book_id=book_id,
                    case_studies=None,
                    roadmap=None,
                    language=language,
                    message=(
                        f"The book does not cover '{topic}'. "
                        "Try another topic from the table of contents."
                    ),
                )
            # --- end: case-studies-stage -------------------------------

            # --- begin: roadmap-stage ----------------------------------
            roadmap = self._roadmap_service.generate_for_topic(
                topic=topic,
                book_id=book_id,
                case_study_set=case_studies,
            )
            # --- end: roadmap-stage ------------------------------------

            logger.info(
                "teach: ok",
                extra={
                    "where": "teaching.teaching_service.TeachingService",
                    "topic": topic,
                    "book_id": book_id,
                    "language": language,
                    "n_studies": len(case_studies.studies),
                    "n_milestones": len(roadmap.milestones),
                    "corr_id": cid,
                },
            )
            return TeachingResult(
                status="ok",
                topic=topic,
                book_id=book_id,
                case_studies=case_studies,
                roadmap=roadmap,
                language=language,
                message=None,
            )

    # --- end: teach ------------------------------------------------------


# --- end: teaching-service ----------------------------------------------
