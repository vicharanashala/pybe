"""LLM-output validator.

Pipeline:
1. ``strip_markdown_fences`` + ``extract_json_object`` (utils/strip_fences)
2. Pydantic schema validation (``src/generation/schemas``)
3. Convert Pydantic → domain dataclass (returns frozen dataclass)
4. Special-case: ``TOPIC_NOT_IN_BOOK`` → raise ``TopicNotInBookError``
   (so the teaching service can map it to the UI's friendly message)
"""

from __future__ import annotations

import json
import logging

from pydantic import ValidationError

from src.domain.case_study import CaseStudy, CaseStudySet, Difficulty
from src.domain.errors import GenerationSchemaError, TopicNotInBookError
from src.domain.roadmap import Milestone, Roadmap
from src.generation.schemas import CaseStudySetSchema, RoadmapSchema
from src.utils.strip_fences import extract_json_object

logger = logging.getLogger(__name__)


# --- begin: sentinel-handling --------------------------------------------
TOPIC_NOT_IN_BOOK = "TOPIC_NOT_IN_BOOK"


def _maybe_sentinel(text: str) -> bool:
    """True iff the LLM replied with exactly the topic-out-of-scope token."""
    if not text:
        return False
    cleaned = text.strip().strip("\"'`").strip()
    return cleaned == TOPIC_NOT_IN_BOOK


# --- end: sentinel-handling ----------------------------------------------


# --- begin: case-study-validator ------------------------------------------
def validate_case_studies(raw: str, *, topic: str, book_id: str) -> CaseStudySet:
    """Parse ``raw`` LLM output into a frozen ``CaseStudySet``.

    Raises
    ------
    TopicNotInBookError
        If the LLM replied with ``TOPIC_NOT_IN_BOOK`` (invariant I-9).
    GenerationSchemaError
        If the JSON is missing fields, has extra fields, or violates
        any invariant. The error message includes the first 200 chars of
        the raw input for the caller to log.
    """
    if _maybe_sentinel(raw):
        raise TopicNotInBookError(
            f"LLM reports topic {topic!r} is not covered by book {book_id!r}."
        )

    try:
        parsed = extract_json_object(raw)
    except ValueError as exc:
        raise GenerationSchemaError(f"Could not parse case-study JSON: {exc}") from exc

    try:
        schema = CaseStudySetSchema.model_validate(parsed)
    except ValidationError as exc:
        raise GenerationSchemaError(
            f"Case-study schema validation failed: {exc}. " f"Raw (first 200): {raw[:200]!r}"
        ) from exc

    # --- begin: pydantic -> domain -------------------------------------
    studies = [
        CaseStudy(
            title=s.title,
            concept=s.concept,
            difficulty=Difficulty(s.difficulty),
            scenario=s.scenario,
            task=s.task,
            starter_code=s.starter_code,
            expected_output=s.expected_output,
            real_world_analogy=s.real_world_analogy,
            fun_fact=s.fun_fact,
            hints=list(s.hints),
            learning_objective=s.learning_objective,
        )
        for s in schema.case_studies
    ]
    # --- end: pydantic -> domain ---------------------------------------

    return CaseStudySet(topic=schema.topic, book_id=book_id, studies=studies)


# --- end: case-study-validator ------------------------------------------


# --- begin: roadmap-validator --------------------------------------------
def validate_roadmap(raw: str, *, topic: str, book_id: str, n_case_studies: int) -> Roadmap:
    """Parse ``raw`` LLM output into a frozen ``Roadmap``.

    Adds the additional check that every ``case_study_index`` in the
    roadmap points at a real index in the case-study set (i.e. is in
    ``[0, n_case_studies)``).
    """
    if _maybe_sentinel(raw):
        raise TopicNotInBookError(f"LLM reports topic {topic!r} has insufficient case studies.")

    try:
        parsed = extract_json_object(raw)
    except ValueError as exc:
        raise GenerationSchemaError(f"Could not parse roadmap JSON: {exc}") from exc

    try:
        schema = RoadmapSchema.model_validate(parsed)
    except ValidationError as exc:
        raise GenerationSchemaError(
            f"Roadmap schema validation failed: {exc}. " f"Raw (first 200): {raw[:200]!r}"
        ) from exc

    # --- begin: index-range-check --------------------------------------
    for m in schema.milestones:
        if m.case_study_index >= n_case_studies:
            raise GenerationSchemaError(
                f"Milestone {m.name!r} references case_study_index="
                f"{m.case_study_index} but only {n_case_studies} case studies exist."
            )
    # --- end: index-range-check ----------------------------------------

    # --- begin: pydantic -> domain -------------------------------------
    milestones = [
        Milestone(
            name=m.name,
            description=m.description,
            case_study_index=m.case_study_index,
            success_criteria=list(m.success_criteria),
        )
        for m in schema.milestones
    ]
    # --- end: pydantic -> domain ---------------------------------------

    return Roadmap(
        topic=schema.topic,
        estimated_hours=schema.estimated_hours,
        milestones=milestones,
        book_id=book_id,
    )


# --- end: roadmap-validator --------------------------------------------


# --- begin: serialization-helper -----------------------------------------
def case_study_set_to_json(case_studies: CaseStudySet) -> str:
    """Serialise a ``CaseStudySet`` to JSON for the roadmap prompt.

    We use ``pydantic``'s validation as a guard: the payload must
    already match the schema the LLM will be asked to fill in. This
    guarantees a round-trip shape.
    """
    payload = {
        "topic": case_studies.topic,
        "case_studies": [
            {
                "title": s.title,
                "concept": s.concept,
                "difficulty": s.difficulty.value,
                "scenario": s.scenario,
                "task": s.task,
                "starter_code": s.starter_code,
                "expected_output": s.expected_output,
                "real_world_analogy": s.real_world_analogy,
                "fun_fact": s.fun_fact,
                "hints": list(s.hints),
                "learning_objective": s.learning_objective,
            }
            for s in case_studies.studies
        ],
    }
    CaseStudySetSchema.model_validate(payload)  # guard
    return json.dumps(payload, ensure_ascii=False, indent=2)


# --- end: serialization-helper -------------------------------------------
