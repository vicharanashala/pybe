"""Tests for ``src.generation.validator``."""

from __future__ import annotations

import json

import pytest
from src.domain.case_study import Difficulty
from src.domain.errors import GenerationSchemaError, TopicNotInBookError
from src.domain.roadmap import Roadmap
from src.generation.validator import (
    TOPIC_NOT_IN_BOOK,
    case_study_set_to_json,
    validate_case_studies,
    validate_roadmap,
)


# --- begin: payload-builders ---------------------------------------------
def _study(difficulty: str = "novice") -> dict[str, str]:
    return {
        "title": "The Loom",
        "concept": "decorators",
        "difficulty": difficulty,
        "scenario": "In Varanasi, weavers wrap a border around cloth without unraveling it.",
        "task": "Write a `@border` decorator.",
        "starter_code": "def greet(name):\n    print(name)",
        "expected_output": "====\nhi\n====",
        "real_world_analogy": "A saree's zari border is woven last.",
        "fun_fact": "PEP 318 settled on @ after a four-month debate.",
        "hints": ["A decorator returns a function."],
        "learning_objective": "Understand higher-order functions.",
    }


def _study_set_json() -> str:
    return json.dumps(
        {
            "topic": "decorators",
            "case_studies": [
                _study("novice"),
                _study("intermediate"),
                _study("advanced"),
            ],
        }
    )


# --- end: payload-builders -----------------------------------------------


# --- begin: case-study-validation ----------------------------------------
def test_validate_clean_json() -> None:
    out = validate_case_studies(_study_set_json(), topic="decorators", book_id="b1")
    assert out.topic == "decorators"
    assert len(out.studies) == 3
    assert out.studies[0].difficulty == Difficulty.NOVICE


def test_validate_fenced_json() -> None:
    """Even when wrapped in ```json ... ```, the validator succeeds."""
    raw = "```json\n" + _study_set_json() + "\n```"
    out = validate_case_studies(raw, topic="decorators", book_id="b1")
    assert len(out.studies) == 3


def test_validate_prose_prefixed_json() -> None:
    """An LLM that adds 'Sure! Here is the case study:' before the JSON."""
    raw = "Sure! Here is the case study:\n" + _study_set_json()
    out = validate_case_studies(raw, topic="decorators", book_id="b1")
    assert len(out.studies) == 3


def test_validate_topic_not_in_book_sentinel() -> None:
    """``TOPIC_NOT_IN_BOOK`` maps to ``TopicNotInBookError`` (invariant I-9)."""
    with pytest.raises(TopicNotInBookError):
        validate_case_studies(TOPIC_NOT_IN_BOOK, topic="biology", book_id="b1")
    # Also handle a quoted variant the LLM might emit.
    with pytest.raises(TopicNotInBookError):
        validate_case_studies('"TOPIC_NOT_IN_BOOK"', topic="biology", book_id="b1")


def test_validate_missing_real_world_analogy() -> None:
    """Invariant I-3 → ``GenerationSchemaError``."""
    bad = json.loads(_study_set_json())
    bad["case_studies"][0].pop("real_world_analogy")
    with pytest.raises(GenerationSchemaError):
        validate_case_studies(json.dumps(bad), topic="x", book_id="b1")


def test_validate_missing_fun_fact() -> None:
    """Invariant I-4 → ``GenerationSchemaError``."""
    bad = json.loads(_study_set_json())
    bad["case_studies"][0].pop("fun_fact")
    with pytest.raises(GenerationSchemaError):
        validate_case_studies(json.dumps(bad), topic="x", book_id="b1")


def test_validate_unknown_field_rejected() -> None:
    """Invariant I-6: extra fields are rejected."""
    bad = json.loads(_study_set_json())
    bad["case_studies"][0]["mystery_field"] = "x"
    with pytest.raises(GenerationSchemaError):
        validate_case_studies(json.dumps(bad), topic="x", book_id="b1")


def test_validate_unsorted_difficulty_rejected() -> None:
    """Invariant I-5: difficulty must ascend."""
    bad = json.loads(_study_set_json())
    bad["case_studies"][0]["difficulty"] = "advanced"
    bad["case_studies"][2]["difficulty"] = "novice"
    with pytest.raises(GenerationSchemaError):
        validate_case_studies(json.dumps(bad), topic="x", book_id="b1")


def test_validate_unparseable_json() -> None:
    """Total garbage → ``GenerationSchemaError`` (not a hard crash)."""
    with pytest.raises(GenerationSchemaError):
        validate_case_studies("this is not json at all", topic="x", book_id="b1")


def test_validate_empty_string() -> None:
    with pytest.raises(GenerationSchemaError):
        validate_case_studies("", topic="x", book_id="b1")


# --- end: case-study-validation ------------------------------------------


# --- begin: roadmap-validation -------------------------------------------
def _roadmap_json() -> str:
    return json.dumps(
        {
            "topic": "decorators",
            "estimated_hours": 8,
            "milestones": [
                {
                    "name": "Grasp the idea",
                    "description": "Read the first case study.",
                    "case_study_index": 0,
                    "success_criteria": ["can write a decorator"],
                },
                {
                    "name": "Apply it",
                    "description": "Read the second.",
                    "case_study_index": 1,
                    "success_criteria": ["can use functools.wraps"],
                },
            ],
        }
    )


def test_validate_roadmap_clean() -> None:
    out = validate_roadmap(_roadmap_json(), topic="decorators", book_id="b1", n_case_studies=3)
    assert isinstance(out, Roadmap)
    assert out.estimated_hours == 8
    assert len(out.milestones) == 2


def test_validate_roadmap_out_of_range_index() -> None:
    """Milestone pointing at a non-existent case study → error."""
    bad = json.loads(_roadmap_json())
    bad["milestones"][0]["case_study_index"] = 99
    with pytest.raises(GenerationSchemaError):
        validate_roadmap(json.dumps(bad), topic="x", book_id="b1", n_case_studies=3)


def test_validate_roadmap_topic_not_in_book() -> None:
    with pytest.raises(TopicNotInBookError):
        validate_roadmap(TOPIC_NOT_IN_BOOK, topic="x", book_id="b1", n_case_studies=3)


# --- end: roadmap-validation --------------------------------------------


# --- begin: round-trip ---------------------------------------------------
def test_case_study_set_to_json_round_trips() -> None:
    """``case_study_set_to_json`` → ``validate_case_studies`` returns equal set."""
    original = validate_case_studies(_study_set_json(), topic="decorators", book_id="b1")
    serialised = case_study_set_to_json(original)
    rebuilt = validate_case_studies(serialised, topic="decorators", book_id="b1")
    assert rebuilt.to_dict() == original.to_dict()


# --- end: round-trip -----------------------------------------------------
