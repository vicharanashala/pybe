"""Tests for ``src.ui.view_models`` — pure-function tests of the DTOs
and converters. NO Streamlit imports anywhere in this file.
"""

from __future__ import annotations

import dataclasses

import pytest
from src.domain.case_study import CaseStudy, CaseStudySet, Difficulty
from src.domain.roadmap import Milestone, Roadmap
from src.teaching.teaching_service import TeachingResult
from src.ui.view_models import (
    CaseStudyCardVM,
    RoadmapVM,
    UploadCardVM,
    case_study_set_to_cards,
    case_study_to_card,
    case_study_to_markdown,
    milestone_to_vm,
    roadmap_to_markdown,
    roadmap_to_vm,
    teaching_result_to_page,
)


# --- begin: case-study-converters ---------------------------------------
def _make_study(**overrides: object) -> CaseStudy:
    base: dict[str, object] = {
        "title": "The Loom",
        "concept": "decorators",
        "difficulty": Difficulty.INTERMEDIATE,
        "scenario": "A saree is bordered last.",
        "task": "Write a decorator.",
        "starter_code": "def greet():\n    pass",
        "expected_output": "== greet ==",
        "real_world_analogy": "Zari border is woven last.",
        "fun_fact": "PEP 318 debate lasted 4 months.",
        "hints": ["A decorator returns a function.", "Use an inner function."],
        "learning_objective": "Understand higher-order functions.",
    }
    base.update(overrides)  # type: ignore[arg-type]
    return CaseStudy(**base)  # type: ignore[arg-type]


def test_case_study_to_card_maps_all_fields() -> None:
    s = _make_study()
    card = case_study_to_card(s, ordinal=1, total=3)
    assert isinstance(card, CaseStudyCardVM)
    assert card.title == "The Loom"
    assert card.difficulty == "intermediate"
    assert card.ordinal == 1
    assert card.total == 3
    assert card.hints == [
        "A decorator returns a function.",
        "Use an inner function.",
    ]
    # Frozen — can't mutate.
    with pytest.raises(dataclasses.FrozenInstanceError):
        card.title = "mutated"  # type: ignore[misc]


def test_case_study_set_to_cards_assigns_ordinals() -> None:
    css = CaseStudySet(
        topic="x",
        book_id="b1",
        studies=[_make_study(), _make_study(), _make_study()],
    )
    cards = case_study_set_to_cards(css)
    assert [c.ordinal for c in cards] == [1, 2, 3]
    assert all(c.total == 3 for c in cards)


def test_case_study_to_card_header() -> None:
    s = _make_study(title="Foo")
    card = case_study_to_card(s, ordinal=2, total=5)
    assert card.header() == "Case study 2 of 5 — Foo"


# --- end: case-study-converters ----------------------------------------


# --- begin: upload-card-vm ---------------------------------------------
def test_upload_card_vm_size_human_bytes() -> None:
    card = UploadCardVM(filename="x.pdf", size_bytes=512, book_id=None, status="empty")
    assert "512.0 B" in card.size_human


def test_upload_card_vm_size_human_megabytes() -> None:
    card = UploadCardVM(filename="x.pdf", size_bytes=2 * 1024 * 1024, book_id=None, status="empty")
    assert "MB" in card.size_human


def test_upload_card_vm_status_badge() -> None:
    for status, expected in (
        ("empty", "Empty"),
        ("indexing", "Indexing"),
        ("ready", "Ready"),
        ("error", "Error"),
    ):
        card = UploadCardVM(
            filename="x",
            size_bytes=0,
            book_id=None,
            status=status,  # type: ignore[arg-type]
        )
        assert expected in card.status_badge


# --- end: upload-card-vm ----------------------------------------------


# --- begin: roadmap-converters -----------------------------------------
def test_milestone_to_vm() -> None:
    m = Milestone(
        name="Grasp it",
        description="Read the first case study.",
        case_study_index=0,
        success_criteria=["can write a decorator"],
    )
    vm = milestone_to_vm(1, m)
    assert vm.index == 1
    assert vm.name == "Grasp it"
    assert vm.case_study_index == 0


def test_roadmap_to_vm_preserves_order() -> None:
    rm = Roadmap(
        topic="decorators",
        estimated_hours=10,
        milestones=[
            Milestone(name="a", description="d", case_study_index=0, success_criteria=["x"]),
            Milestone(name="b", description="d", case_study_index=1, success_criteria=["x"]),
        ],
    )
    vm = roadmap_to_vm(rm)
    assert isinstance(vm, RoadmapVM)
    assert [m.name for m in vm.milestones] == ["a", "b"]


# --- end: roadmap-converters ------------------------------------------


# --- begin: markdown-rendering -----------------------------------------
def test_case_study_to_markdown_includes_required_sections() -> None:
    s = _make_study(title="Foo")
    card = case_study_to_card(s, ordinal=1, total=1)
    md = case_study_to_markdown(card)
    assert "### Foo" in md
    assert "Scenario" in md
    assert "Starter code" in md
    assert "Real-world analogy" in md
    assert "Fun fact" in md
    assert "1. A decorator returns a function." in md
    assert "2. Use an inner function." in md
    assert "Expected output" in md
    assert "Learning objective" in md


def test_roadmap_to_markdown_lists_milestones() -> None:
    rm = Roadmap(
        topic="decorators",
        estimated_hours=8,
        milestones=[
            Milestone(name="Alpha", description="d", case_study_index=0, success_criteria=["c"]),
        ],
    )
    md = roadmap_to_markdown(roadmap_to_vm(rm))
    assert "## Roadmap — decorators" in md
    assert "**Alpha**" in md
    assert "8 hours" in md


# --- end: markdown-rendering ------------------------------------------


# --- begin: teaching-result-to-page ------------------------------------
def test_teaching_result_to_page_ok() -> None:
    css = CaseStudySet(
        topic="decorators",
        book_id="b1",
        studies=[_make_study()],
    )
    rm = Roadmap(
        topic="decorators",
        estimated_hours=6,
        milestones=[
            Milestone(name="m1", description="d", case_study_index=0, success_criteria=["c"])
        ],
    )
    result = TeachingResult(
        status="ok",
        topic="decorators",
        book_id="b1",
        case_studies=css,
        roadmap=rm,
    )
    page = teaching_result_to_page(result)
    assert page.banner.headline.startswith("Generated")
    assert len(page.case_studies) == 1
    assert page.roadmap is not None
    assert page.raw_json
    assert page.raw_markdown
    assert '"topic": "decorators"' in page.raw_json


def test_teaching_result_to_page_topic_not_in_book() -> None:
    result = TeachingResult(
        status="topic_not_in_book",
        topic="biology",
        book_id="b1",
        case_studies=None,
        roadmap=None,
        message="The book does not cover 'biology'.",
    )
    page = teaching_result_to_page(result)
    assert "not in book" in page.banner.headline.lower()
    assert page.case_studies == []
    assert page.roadmap is None
    # The Markdown export still contains a friendly message.
    assert "biology" in page.raw_markdown


# --- end: teaching-result-to-page --------------------------------------
