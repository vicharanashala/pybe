"""Tests for the Phase 8 demo-button flow in the UI.

Covers:
- ``AppState.load_demo_result`` clears the error, sets the stage to
  RESULTS_READY (allowed from EMPTY), stores the result.
- ``load_demo_result`` defends against an in-flight QUERYING (raises).
- The state machine now permits EMPTY -> RESULTS_READY (regression).
- AppTest smoke: rendering with the demo sidebar button does not raise.
"""

from __future__ import annotations

from typing import Any

import pytest
from src.domain.case_study import CaseStudy, CaseStudySet, Difficulty
from src.domain.roadmap import Milestone, Roadmap
from src.teaching.teaching_service import TeachingResult
from src.ui.state import AppStage, AppState


# --- begin: helpers -----------------------------------------------------
def _make_demo_result() -> TeachingResult:
    """Build a minimal but valid TeachingResult for state tests."""
    cs = CaseStudy(
        title="t",
        concept="c",
        difficulty=Difficulty.NOVICE,
        scenario="s",
        task="k",
        starter_code="",
        expected_output="",
        real_world_analogy="a",
        fun_fact="f",
        hints=["h"],
        learning_objective="o",
    )
    css = CaseStudySet(topic="t", book_id="b", studies=[cs])
    rm = Milestone(name="m", description="d", case_study_index=0, success_criteria=["c"])
    rd = Roadmap(topic="t", estimated_hours=10, milestones=[rm], book_id="b")
    return TeachingResult(
        status="ok",
        topic="t",
        book_id="b",
        case_studies=css,
        roadmap=rd,
        language="python",
        is_demo=True,
    )


@pytest.fixture
def ss() -> dict[str, object]:
    state: dict[str, object] = {}
    AppState.init_session_state(state)  # type: ignore[arg-type]
    return state


# --- end: helpers ------------------------------------------------------


# --- begin: load_demo_result ------------------------------------------
def test_load_demo_result_from_empty_moves_to_results_ready(ss: Any) -> None:
    """EMPTY -> RESULTS_READY via load_demo_result is allowed."""
    assert AppState.get_stage(ss) == AppStage.EMPTY
    AppState.load_demo_result(ss, result=_make_demo_result())
    assert AppState.get_stage(ss) == AppStage.RESULTS_READY
    assert AppState.get_result(ss) is not None
    assert AppState.get_result(ss).is_demo is True


def test_load_demo_result_clears_error(ss: Any) -> None:
    """Loading a demo over an error state clears the error banner."""
    AppState.mark_error(ss, message="something failed")
    AppState.load_demo_result(ss, result=_make_demo_result())
    assert AppState.get_error(ss) is None


def test_load_demo_result_refuses_during_querying(ss: Any) -> None:
    """Defensive: cannot clobber an in-flight QUERYING with a demo."""
    AppState.begin_ingestion(ss, filename="a.pdf", size_bytes=12)
    AppState.complete_ingestion(ss, book_id="b1")
    AppState.begin_query(ss)
    assert AppState.get_stage(ss) == AppStage.QUERYING
    with pytest.raises(ValueError, match="Cannot load a demo result while QUERYING"):
        AppState.load_demo_result(ss, result=_make_demo_result())


def test_load_demo_result_works_from_ready(ss: Any) -> None:
    """Regression: demo button must work AFTER a book is indexed.

    Previously ``READY -> RESULTS_READY`` was forbidden in the state
    machine, so the "Try a demo" button failed when a book was already
    uploaded. The Phase 8 design says the demo button is always
    available — fix the transition and assert it here.
    """
    AppState.begin_ingestion(ss, filename="t.pdf", size_bytes=12)
    AppState.complete_ingestion(ss, book_id="b1")
    assert AppState.get_stage(ss) == AppStage.READY
    AppState.load_demo_result(ss, result=_make_demo_result())
    assert AppState.get_stage(ss) == AppStage.RESULTS_READY


def test_load_demo_result_replaces_existing_result(ss: Any) -> None:
    """From RESULTS_READY, loading another demo replaces the result cleanly."""
    AppState.load_demo_result(ss, result=_make_demo_result())
    first = AppState.get_result(ss)
    AppState.load_demo_result(ss, result=_make_demo_result())
    assert AppState.get_result(ss) is not first


# --- end: load_demo_result --------------------------------------------


# --- begin: state-machine-regression ----------------------------------
def test_empty_to_results_ready_is_now_allowed(ss: Any) -> None:
    """Phase 8 acceptance: the demo button can move EMPTY -> RESULTS_READY."""
    AppState.set_stage(ss, AppStage.RESULTS_READY)
    assert AppState.get_stage(ss) == AppStage.RESULTS_READY


def test_empty_to_querying_still_forbidden(ss: Any) -> None:
    """Defensive regression: empty cannot jump straight to QUERYING."""
    with pytest.raises(ValueError, match="Forbidden stage transition"):
        AppState.set_stage(ss, AppStage.QUERYING)


# --- end: state-machine-regression ------------------------------------


# --- begin: language-picker-uses-registry -----------------------------
def test_language_picker_includes_newly_discovered_languages() -> None:
    """The prompt registry's known_languages() is what the sidebar reads."""
    from src.generation.prompts.registry import PromptRegistry

    langs = PromptRegistry.known_languages()
    # Phase 8 acceptance: rust is auto-discovered.
    assert "rust" in langs


# --- end: language-picker-uses-registry -------------------------------
