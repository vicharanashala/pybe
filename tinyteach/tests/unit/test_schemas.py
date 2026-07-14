"""Tests for ``src.generation.schemas``."""

from __future__ import annotations

import pytest
from pydantic import ValidationError
from src.generation.schemas import (
    CaseStudySchema,
    CaseStudySetSchema,
    MilestoneSchema,
    RoadmapSchema,
)


def _valid_study() -> dict[str, object]:
    return {
        "title": "t",
        "concept": "c",
        "difficulty": "novice",
        "scenario": "s",
        "task": "k",
        "starter_code": "print('x')",
        "expected_output": "x",
        "real_world_analogy": "a",
        "fun_fact": "f",
        "hints": ["h1"],
        "learning_objective": "l",
    }


# --- begin: happy-path ---------------------------------------------------
def test_case_study_schema_accepts_valid_payload() -> None:
    s = CaseStudySchema.model_validate(_valid_study())
    assert s.title == "t"


def test_case_study_set_schema_accepts_ordered_set() -> None:
    payload = {
        "topic": "decorators",
        "case_studies": [
            {**_valid_study(), "difficulty": "novice"},
            {**_valid_study(), "difficulty": "intermediate"},
            {**_valid_study(), "difficulty": "advanced"},
        ],
    }
    s = CaseStudySetSchema.model_validate(payload)
    assert len(s.case_studies) == 3


# --- end: happy-path -----------------------------------------------------


# --- begin: rejection-paths ----------------------------------------------
def test_case_study_rejects_unknown_field() -> None:
    bad = {**_valid_study(), "secret_field": 1}
    with pytest.raises(ValidationError):
        CaseStudySchema.model_validate(bad)


def test_case_study_rejects_empty_title() -> None:
    bad = {**_valid_study(), "title": ""}
    with pytest.raises(ValidationError):
        CaseStudySchema.model_validate(bad)


def test_case_study_rejects_no_real_world_analogy() -> None:
    """Invariant I-3: missing the analogy must fail."""
    bad = {**_valid_study()}
    bad.pop("real_world_analogy")  # type: ignore[arg-type]
    with pytest.raises(ValidationError):
        CaseStudySchema.model_validate(bad)


def test_case_study_rejects_no_fun_fact() -> None:
    """Invariant I-4: missing fun_fact must fail."""
    bad = {**_valid_study()}
    bad.pop("fun_fact")  # type: ignore[arg-type]
    with pytest.raises(ValidationError):
        CaseStudySchema.model_validate(bad)


def test_case_study_rejects_difficulty_outside_set() -> None:
    bad = {**_valid_study(), "difficulty": "wizard"}
    with pytest.raises(ValidationError):
        CaseStudySchema.model_validate(bad)


def test_case_study_rejects_too_many_hints() -> None:
    bad = {**_valid_study(), "hints": ["a", "b", "c", "d"]}
    with pytest.raises(ValidationError):
        CaseStudySchema.model_validate(bad)


def test_case_study_set_rejects_unsorted_difficulty() -> None:
    """Invariant I-5: difficulty must be novice → intermediate → advanced."""
    payload = {
        "topic": "decorators",
        "case_studies": [
            {**_valid_study(), "difficulty": "advanced"},
            {**_valid_study(), "difficulty": "novice"},  # out of order
        ],
    }
    with pytest.raises(ValidationError):
        CaseStudySetSchema.model_validate(payload)


# --- end: rejection-paths ------------------------------------------------


# --- begin: roadmap-schema -----------------------------------------------
def _valid_milestone(idx: int = 0) -> dict[str, object]:
    return {
        "name": f"m{idx}",
        "description": "d",
        "case_study_index": idx,
        "success_criteria": ["criterion"],
    }


def test_roadmap_schema_accepts_ordered_milestones() -> None:
    payload = {
        "topic": "decorators",
        "estimated_hours": 10,
        "milestones": [_valid_milestone(0), _valid_milestone(1), _valid_milestone(2)],
    }
    s = RoadmapSchema.model_validate(payload)
    assert s.estimated_hours == 10


def test_roadmap_schema_rejects_hours_outside_5_to_40() -> None:
    bad = {
        "topic": "x",
        "estimated_hours": 100,
        "milestones": [_valid_milestone()],
    }
    with pytest.raises(ValidationError):
        RoadmapSchema.model_validate(bad)


def test_roadmap_schema_rejects_descending_milestones() -> None:
    """Invariant I-7: milestones' case_study_index must ascend."""
    payload = {
        "topic": "x",
        "estimated_hours": 10,
        "milestones": [_valid_milestone(2), _valid_milestone(1)],
    }
    with pytest.raises(ValidationError):
        RoadmapSchema.model_validate(payload)


def test_roadmap_schema_rejects_unknown_fields() -> None:
    bad = {
        "topic": "x",
        "estimated_hours": 10,
        "milestones": [_valid_milestone()],
        "extra": "nope",
    }
    with pytest.raises(ValidationError):
        RoadmapSchema.model_validate(bad)


def test_milestone_schema_rejects_negative_index() -> None:
    bad = _valid_milestone(0)
    bad["case_study_index"] = -1
    with pytest.raises(ValidationError):
        MilestoneSchema.model_validate(bad)


# --- end: roadmap-schema ------------------------------------------------
