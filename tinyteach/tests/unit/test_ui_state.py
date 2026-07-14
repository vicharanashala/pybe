"""Tests for ``src.ui.state.AppState``.

Uses an in-memory dict in place of ``st.session_state`` — no
Streamlit imports.
"""

from __future__ import annotations

import pytest
from src.ui.state import AppStage, AppState


@pytest.fixture()
def ss() -> dict[str, object]:
    """Return a fresh session_state dict, with defaults applied."""
    state: dict[str, object] = {}
    AppState.init_session_state(state)
    return state


# --- begin: init ---------------------------------------------------------
def test_init_session_state_is_idempotent(ss: dict[str, object]) -> None:
    """Calling init twice does not overwrite an existing value."""
    AppState.set_topic(ss, "preserved")
    AppState.init_session_state(ss)
    assert AppState.get_topic(ss) == "preserved"


def test_init_applies_all_default_keys(ss: dict[str, object]) -> None:
    """All KEY_* constants have a default after init."""
    assert AppState.get_stage(ss) == AppStage.EMPTY
    assert AppState.get_book_id(ss) is None
    assert AppState.get_book_filename(ss) is None
    assert AppState.get_book_size(ss) == 0
    assert AppState.get_topic(ss) == ""
    assert AppState.get_error(ss) is None
    assert AppState.get_result(ss) is None
    assert AppState.get_llm(ss) == "hf_inference"
    assert AppState.get_language(ss) == "python"


# --- end: init ----------------------------------------------------------


# --- begin: accessors ----------------------------------------------------
def test_setters_round_trip(ss: dict[str, object]) -> None:
    AppState.set_topic(ss, "decorators")
    AppState.set_llm(ss, "groq")
    AppState.set_language(ss, "java")
    assert AppState.get_topic(ss) == "decorators"
    assert AppState.get_llm(ss) == "groq"
    assert AppState.get_language(ss) == "java"


# --- end: accessors ----------------------------------------------------


# --- begin: transitions -------------------------------------------------
def test_begin_ingestion_moves_empty_to_ingesting(ss: dict[str, object]) -> None:
    AppState.begin_ingestion(ss, filename="a.pdf", size_bytes=12)
    assert AppState.get_stage(ss) == AppStage.INGESTING
    assert AppState.get_book_filename(ss) == "a.pdf"
    assert AppState.get_book_size(ss) == 12
    assert AppState.get_book_id(ss) is None


def test_complete_ingestion_moves_ingesting_to_ready(ss: dict[str, object]) -> None:
    AppState.begin_ingestion(ss, filename="a.pdf", size_bytes=12)
    AppState.complete_ingestion(ss, book_id="sha256_xx")
    assert AppState.get_stage(ss) == AppStage.READY
    assert AppState.get_book_id(ss) == "sha256_xx"


def test_query_cycle_round_trip(ss: dict[str, object]) -> None:
    AppState.begin_ingestion(ss, filename="a.pdf", size_bytes=12)
    AppState.complete_ingestion(ss, book_id="sha256_xx")
    AppState.begin_query(ss)
    assert AppState.get_stage(ss) == AppStage.QUERYING
    assert AppState.get_result(ss) is None
    # complete_query takes a result — pass a real-ish object for the test.
    from src.teaching.teaching_service import TeachingResult

    result = TeachingResult(
        status="topic_not_in_book",
        topic="x",
        book_id="sha256_xx",
        case_studies=None,
        roadmap=None,
        message="nope",
    )
    AppState.complete_query(ss, result=result)
    assert AppState.get_stage(ss) == AppStage.RESULTS_READY
    assert AppState.get_result(ss) is result


def test_forbidden_transition_raises(ss: dict[str, object]) -> None:
    """Cannot jump ``EMPTY`` -> ``QUERYING`` (must ingest first OR demo-load).

    Phase 8: ``EMPTY -> RESULTS_READY`` IS now allowed (the demo button
    jumps straight to a result via ``load_demo_result``). The remaining
    bona fide forbidden jump is ``EMPTY -> QUERYING`` (an LLM call needs
    either a real book or a demo result, which both go via the
    QUERYING -> RESULTS_READY pipeline).
    """
    with pytest.raises(ValueError, match="Forbidden stage transition"):
        AppState.set_stage(ss, AppStage.QUERYING)


def test_empty_to_results_ready_is_allowed(ss: dict[str, object]) -> None:
    """Phase 8: demo button can jump ``EMPTY -> RESULTS_READY`` directly."""
    # No exception expected -- the new demo transition.
    AppState.set_stage(ss, AppStage.RESULTS_READY)
    assert AppState.get_stage(ss) == AppStage.RESULTS_READY


def test_self_transition_is_noop(ss: dict[str, object]) -> None:
    """``EMPTY`` -> ``EMPTY`` does NOT raise."""
    AppState.set_stage(ss, AppStage.EMPTY)  # no exception


def test_repeated_query_resets_result(ss: dict[str, object]) -> None:
    """Starting a new query clears the previous result."""
    from src.teaching.teaching_service import TeachingResult

    AppState.begin_ingestion(ss, filename="a.pdf", size_bytes=12)
    AppState.complete_ingestion(ss, book_id="sha256_xx")
    AppState.begin_query(ss)
    r1 = TeachingResult(
        status="ok",
        topic="x",
        book_id="sha256_xx",
        case_studies=None,
        roadmap=None,
    )
    AppState.complete_query(ss, result=r1)
    AppState.begin_query(ss)
    assert AppState.get_result(ss) is None


# --- end: transitions --------------------------------------------------


# --- begin: errors -------------------------------------------------------
def test_mark_error_from_any_state(ss: dict[str, object]) -> None:
    AppState.begin_ingestion(ss, filename="a.pdf", size_bytes=12)
    AppState.mark_error(ss, message="boom")
    assert AppState.get_stage(ss) == AppStage.ERROR
    assert AppState.get_error(ss) == "boom"


def test_mark_error_overwrites_previous_message(ss: dict[str, object]) -> None:
    AppState.mark_error(ss, message="first")
    AppState.mark_error(ss, message="second")
    assert AppState.get_error(ss) == "second"


# --- end: errors --------------------------------------------------------


# --- begin: reset --------------------------------------------------------
def test_reset_returns_to_empty_with_defaults(ss: dict[str, object]) -> None:
    AppState.begin_ingestion(ss, filename="a.pdf", size_bytes=12)
    AppState.complete_ingestion(ss, book_id="sha256_xx")
    AppState.begin_query(ss)
    AppState.set_topic(ss, "decorators")
    AppState.set_llm(ss, "groq")
    AppState.reset(ss)
    assert AppState.get_stage(ss) == AppStage.EMPTY
    assert AppState.get_book_id(ss) is None
    assert AppState.get_topic(ss) == ""
    assert AppState.get_llm(ss) == "hf_inference"


# --- end: reset ---------------------------------------------------------


# --- begin: snapshot -----------------------------------------------------
def test_snapshot_captures_state(ss: dict[str, object]) -> None:
    AppState.begin_ingestion(ss, filename="a.pdf", size_bytes=12)
    AppState.complete_ingestion(ss, book_id="sha256_xx")
    snap = AppState.snapshot(ss)
    assert snap.stage == AppStage.READY
    assert snap.book_id == "sha256_xx"
    assert snap.book_filename == "a.pdf"
    assert snap.book_size_bytes == 12
    assert snap.has_result is False
    assert snap.selected_llm == "hf_inference"
    assert snap.selected_language == "python"


# --- end: snapshot -----------------------------------------------------


# --- begin: llm-changed-detection ----------------------------------------
def test_llm_changed_detection_initial_false(ss: dict[str, object]) -> None:
    assert AppState.is_llm_changed_since_last_teach(ss) is False


def test_llm_changed_after_user_picks_new_one(ss: dict[str, object]) -> None:
    from src.teaching.teaching_service import TeachingResult

    AppState.begin_ingestion(ss, filename="a.pdf", size_bytes=12)
    AppState.complete_ingestion(ss, book_id="sha256_xx")
    AppState.begin_query(ss)
    AppState.complete_query(
        ss,
        result=TeachingResult(
            status="ok",
            topic="x",
            book_id="sha256_xx",
            case_studies=None,
            roadmap=None,
        ),
    )
    AppState.mark_llm_at_query(ss)
    assert AppState.is_llm_changed_since_last_teach(ss) is False
    # User picks a different provider in the sidebar.
    AppState.set_llm(ss, "groq")
    assert AppState.is_llm_changed_since_last_teach(ss) is True


# --- end: llm-changed-detection -----------------------------------------
