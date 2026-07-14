"""App state machine (State pattern — GoF).

Pure-Python helper around ``st.session_state``. The state machine's
transitions are what make the UI re-runs idempotent (invariant I-15):
Streamlit may re-run the entire script on any widget interaction, but
the state survives because it lives in ``session_state``.

All public methods take an explicit ``session_state`` argument so the
class is unit-testable WITHOUT importing Streamlit.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from enum import Enum
from typing import Any

from src.teaching.teaching_service import TeachingResult

logger = logging.getLogger(__name__)


# --- begin: stage-enum ---------------------------------------------------
class AppStage(str, Enum):
    """The lifecycle of a single user session.

    Transitions are explicit (see ``AppState.transition_to``); the UI
    uses ``get_stage()`` to decide what to render.
    """

    EMPTY = "empty"
    INGESTING = "ingesting"
    READY = "ready"
    QUERYING = "querying"
    RESULTS_READY = "results_ready"
    ERROR = "error"


# Allowed transitions — anything else raises ``ValueError``.
# Phase 8: ``* -> RESULTS_READY`` is allowed from every non-QUERYING
# state so the always-available "Try a demo" button can replace the
# current view with a pre-computed result. QUERYING is the only
# exception -- we don't want to clobber an in-flight LLM call.
_ALLOWED: dict[AppStage, set[AppStage]] = {
    AppStage.EMPTY: {AppStage.INGESTING, AppStage.RESULTS_READY, AppStage.ERROR},
    AppStage.INGESTING: {AppStage.READY, AppStage.ERROR},
    AppStage.READY: {AppStage.QUERYING, AppStage.RESULTS_READY, AppStage.ERROR},
    AppStage.QUERYING: {AppStage.RESULTS_READY, AppStage.ERROR},
    AppStage.RESULTS_READY: {AppStage.READY, AppStage.QUERYING, AppStage.ERROR},
    AppStage.ERROR: {AppStage.EMPTY, AppStage.READY, AppStage.RESULTS_READY},
}


# --- end: stage-enum ----------------------------------------------------


# --- begin: snapshot -----------------------------------------------------
@dataclass
class StateSnapshot:
    """Pure-Python snapshot of the user's session — easy to log + test."""

    stage: AppStage
    book_id: str | None
    book_filename: str | None
    book_size_bytes: int
    last_topic: str | None
    last_error: str | None
    has_result: bool
    selected_llm: str
    selected_language: str


# --- end: snapshot ------------------------------------------------------


# --- begin: app-state ---------------------------------------------------
# Keys we own inside ``st.session_state``. Centralised so we can wipe
# them on a "reset" without nuking Streamlit's internal keys.
KEY_STAGE = "_tt_stage"
KEY_BOOK_ID = "_tt_book_id"
KEY_BOOK_FILENAME = "_tt_book_filename"
KEY_BOOK_SIZE = "_tt_book_size"
KEY_TOPIC = "_tt_topic"
KEY_ERROR = "_tt_error"
KEY_RESULT = "_tt_result"
KEY_LLM = "_tt_llm"
KEY_LANG = "_tt_lang"

_ALL_OWNED_KEYS = frozenset(
    {
        KEY_STAGE,
        KEY_BOOK_ID,
        KEY_BOOK_FILENAME,
        KEY_BOOK_SIZE,
        KEY_TOPIC,
        KEY_ERROR,
        KEY_RESULT,
        KEY_LLM,
        KEY_LANG,
    }
)

# Defaults applied on first run. Read by ``init_session_state``.
_DEFAULT_LLM = "hf_inference"
_DEFAULT_LANGUAGE = "python"


class AppState:
    """State machine + persistence for a TinyTeach session."""

    # --- begin: safe-get-helper -----------------------------------------
    @staticmethod
    def _safe_get(session_state: Any, key: str, default: object = None) -> object:
        """``session_state.get(key, default)`` that also works with ``SafeSessionState``.

        ``streamlit.testing.v1.AppTest.session_state`` is a
        ``SafeSessionState`` that does NOT expose ``.get()`` (its
        ``__getattribute__`` raises ``AttributeError`` for unknown
        attributes). Real production code runs with a regular dict, so
        plain ``session_state.get(...)`` is fine -- but tests need a
        fallback. This helper does both.
        """
        try:
            return session_state.get(key, default)  # type: ignore[attr-defined]
        except AttributeError:
            if key in session_state:
                return session_state[key]
            return default

    # --- end: safe-get-helper -------------------------------------------

    # --- begin: bootstrap ----------------------------------------------
    @staticmethod
    def init_session_state(session_state: Any) -> None:
        """Apply default values to ``session_state`` on the first run.

        Idempotent: only fills in keys that are missing.
        """
        if KEY_STAGE not in session_state:
            session_state[KEY_STAGE] = AppStage.EMPTY
        if KEY_BOOK_ID not in session_state:
            session_state[KEY_BOOK_ID] = None
        if KEY_BOOK_FILENAME not in session_state:
            session_state[KEY_BOOK_FILENAME] = None
        if KEY_BOOK_SIZE not in session_state:
            session_state[KEY_BOOK_SIZE] = 0
        if KEY_TOPIC not in session_state:
            session_state[KEY_TOPIC] = ""
        if KEY_ERROR not in session_state:
            session_state[KEY_ERROR] = None
        if KEY_RESULT not in session_state:
            session_state[KEY_RESULT] = None
        if KEY_LLM not in session_state:
            session_state[KEY_LLM] = _DEFAULT_LLM
        if KEY_LANG not in session_state:
            session_state[KEY_LANG] = _DEFAULT_LANGUAGE

    # --- end: bootstrap ------------------------------------------------

    # --- begin: accessors ----------------------------------------------
    @staticmethod
    def get_stage(session_state: Any) -> AppStage:
        return AppStage(session_state[KEY_STAGE])

    @staticmethod
    def set_stage(session_state: Any, stage: AppStage) -> None:
        """Move to ``stage`` — raises ``ValueError`` for forbidden jumps."""
        current = AppState.get_stage(session_state)
        if stage == current:
            return
        if stage not in _ALLOWED[current]:
            raise ValueError(f"Forbidden stage transition: {current.value} -> {stage.value}")
        logger.info(
            "app_state.transition",
            extra={
                "where": "ui.state.AppState",
                "from": current.value,
                "to": stage.value,
            },
        )
        session_state[KEY_STAGE] = stage

    @staticmethod
    def get_book_id(session_state: Any) -> str | None:
        return AppState._safe_get(session_state, KEY_BOOK_ID)

    @staticmethod
    def get_book_filename(session_state: Any) -> str | None:
        return AppState._safe_get(session_state, KEY_BOOK_FILENAME)

    @staticmethod
    def get_book_size(session_state: Any) -> int:
        return int(AppState._safe_get(session_state, KEY_BOOK_SIZE, 0))

    @staticmethod
    def get_topic(session_state: Any) -> str:
        return str(AppState._safe_get(session_state, KEY_TOPIC, ""))

    @staticmethod
    def set_topic(session_state: Any, topic: str) -> None:
        session_state[KEY_TOPIC] = topic

    @staticmethod
    def get_result(session_state: Any) -> TeachingResult | None:
        return AppState._safe_get(session_state, KEY_RESULT)

    @staticmethod
    def get_error(session_state: Any) -> str | None:
        return AppState._safe_get(session_state, KEY_ERROR)

    @staticmethod
    def get_llm(session_state: Any) -> str:
        return str(AppState._safe_get(session_state, KEY_LLM, _DEFAULT_LLM))

    @staticmethod
    def set_llm(session_state: Any, value: str) -> None:
        session_state[KEY_LLM] = value

    @staticmethod
    def get_language(session_state: Any) -> str:
        return str(AppState._safe_get(session_state, KEY_LANG, _DEFAULT_LANGUAGE))

    @staticmethod
    def set_language(session_state: Any, value: str) -> None:
        session_state[KEY_LANG] = value

    # --- end: accessors -----------------------------------------------

    # --- begin: transitions -------------------------------------------
    @staticmethod
    def begin_ingestion(session_state: Any, *, filename: str, size_bytes: int) -> None:
        """Move EMPTY -> INGESTING and remember the file metadata."""
        AppState.set_stage(session_state, AppStage.INGESTING)
        session_state[KEY_BOOK_FILENAME] = filename
        session_state[KEY_BOOK_SIZE] = size_bytes
        session_state[KEY_BOOK_ID] = None
        session_state[KEY_RESULT] = None
        session_state[KEY_ERROR] = None

    @staticmethod
    def complete_ingestion(session_state: Any, *, book_id: str) -> None:
        """Move INGESTING -> READY and remember the book_id."""
        AppState.set_stage(session_state, AppStage.READY)
        session_state[KEY_BOOK_ID] = book_id

    @staticmethod
    def begin_query(session_state: Any) -> None:
        """Move READY/RESULTS_READY -> QUERYING; clear the previous result."""
        AppState.set_stage(session_state, AppStage.QUERYING)
        session_state[KEY_RESULT] = None
        session_state[KEY_ERROR] = None

    @staticmethod
    def complete_query(session_state: Any, *, result: TeachingResult) -> None:
        """Move QUERYING -> RESULTS_READY and store the result."""
        AppState.set_stage(session_state, AppStage.RESULTS_READY)
        session_state[KEY_RESULT] = result

    @staticmethod
    def load_demo_result(session_state: Any, *, result: TeachingResult) -> None:
        """Phase 8: load a pre-computed demo result without going through the LLM.

        Allowed from EMPTY (first-time visitor clicks "Try a demo") and
        from RESULTS_READY / READY (returning user wants to refresh).
        The result carries ``is_demo=True`` so the UI shows the badge.
        """
        current = AppState.get_stage(session_state)
        if current == AppStage.QUERYING:
            # Defensive: don't clobber an in-flight query.
            raise ValueError("Cannot load a demo result while QUERYING. Finish or cancel first.")
        if current != AppStage.RESULTS_READY:
            AppState.set_stage(session_state, AppStage.RESULTS_READY)
        session_state[KEY_RESULT] = result
        session_state[KEY_ERROR] = None

    @staticmethod
    def mark_error(session_state: Any, *, message: str) -> None:
        """Move any state -> ERROR with a message. The user can reset."""
        # ERROR is reachable from anywhere except itself (re-set allowed via reset()).
        current = AppState.get_stage(session_state)
        if current != AppStage.ERROR:
            AppState.set_stage(session_state, AppStage.ERROR)
        session_state[KEY_ERROR] = message

    @staticmethod
    def reset(session_state: Any) -> None:
        """Wipe EVERYTHING and return to ``EMPTY``. The user clicks a
        'Start over' button to call this.
        """
        for k in _ALL_OWNED_KEYS:
            session_state.pop(k, None)
        AppState.init_session_state(session_state)

    # --- end: transitions ---------------------------------------------

    # --- begin: introspection ----------------------------------------
    @staticmethod
    def snapshot(session_state: Any) -> StateSnapshot:
        """Return a pure-Python snapshot for logging + tests."""
        return StateSnapshot(
            stage=AppState.get_stage(session_state),
            book_id=AppState.get_book_id(session_state),
            book_filename=AppState.get_book_filename(session_state),
            book_size_bytes=AppState.get_book_size(session_state),
            last_topic=AppState.get_topic(session_state) or None,
            last_error=AppState.get_error(session_state),
            has_result=AppState.get_result(session_state) is not None,
            selected_llm=AppState.get_llm(session_state),
            selected_language=AppState.get_language(session_state),
        )

    @staticmethod
    def is_llm_changed_since_last_teach(session_state: Any) -> bool:
        """Return True if the user picked a different LLM after the last teach().

        Used to surface a 'restart required' hint in the UI per the
        blueprint acceptance criteria.
        """
        result = AppState.get_result(session_state)
        if result is None:
            return False
        # The cached result carries no LLM info; we compare against the
        # ``_tt_llm_at_query`` marker (set when complete_query runs).
        marker = AppState._safe_get(session_state, "_tt_llm_at_query")
        return bool(marker and marker != AppState.get_llm(session_state))

    @staticmethod
    def mark_llm_at_query(session_state: Any) -> None:
        """Snapshot the LLM chosen at query time so we can detect a later change."""
        session_state["_tt_llm_at_query"] = AppState.get_llm(session_state)


# --- end: app-state -----------------------------------------------------
