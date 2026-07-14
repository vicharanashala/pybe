"""TinyTeach — Streamlit entry point.

Run with::

    streamlit run app.py

Streamlit re-runs this entire script on every user interaction; all
state is held inside ``st.session_state`` (see ``src/ui/state.py``).
"""

from __future__ import annotations

import contextlib
import logging
from pathlib import Path

import streamlit as st
from src.config.container import (
    get_chunker,
    get_embedder,
    get_parser,
    get_settings,
    make_indexer,
    reset_ingestion_cache,
    reset_llm_cache,
    reset_prompt_cache,
    reset_retrieval_cache,
    reset_settings_cache,
    reset_teaching_cache,
)
from src.config.settings import Settings
from src.domain.book import Book, BookFingerprint
from src.ingestion.pipeline import IngestionPipeline
from src.ui.components import (
    render_demo_button,
    render_empty_state,
    render_error_banner,
    render_indexing_spinner,
    render_model_picker,
    render_querying_spinner,
    render_ready_banner,
    render_restart_hint,
    render_results_page,
    render_topic_input,
    render_upload_card,
)
from src.ui.state import AppStage, AppState
from src.ui.view_models import (
    IndexStatus,
    UploadCardVM,
    teaching_result_to_page,
)
from src.utils.hashing import sha256_file

logger = logging.getLogger(__name__)


# --- begin: page-config --------------------------------------------------
st.set_page_config(
    page_title="TinyTeach",
    page_icon="📚",
    layout="wide",
    initial_sidebar_state="expanded",
)
# --- end: page-config ---------------------------------------------------


# --- begin: logging-bootstrap -------------------------------------------
# Configure structured logging exactly once per process. Idempotent.
if "tinyteach_logging_configured" not in st.session_state:
    from src.observability.logger import configure_logging

    settings_for_logging = Settings(
        app_data_dir=Path("./data").resolve(),
    )
    settings_for_logging.ensure_data_dirs()
    configure_logging(settings_for_logging)
    st.session_state["tinyteach_logging_configured"] = True


# --- end: logging-bootstrap --------------------------------------------


# --- begin: state-bootstrap ---------------------------------------------
session_state = st.session_state
AppState.init_session_state(session_state)
# --- end: state-bootstrap ----------------------------------------------


# --- begin: sidebar ------------------------------------------------------
with st.sidebar:
    st.title("📚 TinyTeach")
    st.caption("Learn a programming language from a PDF.")

    render_model_picker(session_state)

    st.divider()

    st.subheader("Upload")
    uploaded_file = st.file_uploader(
        "Pick a programming-book PDF",
        type=["pdf"],
        help="Up to 50 MB. The book is parsed, chunked, and embedded locally.",
    )

    # --- begin: upload-card-status -----------------------------------
    current_stage = AppState.get_stage(session_state)
    if current_stage == AppStage.EMPTY:
        upload_status: IndexStatus = "empty"
    elif current_stage == AppStage.INGESTING:
        upload_status = "indexing"
    elif current_stage in (AppStage.ERROR,) and not AppState.get_book_id(session_state):
        upload_status = "error"
    else:
        upload_status = "ready"

    card = UploadCardVM(
        filename=AppState.get_book_filename(session_state) or "",
        size_bytes=AppState.get_book_size(session_state),
        book_id=AppState.get_book_id(session_state),
        status=upload_status,
        error_message=AppState.get_error(session_state),
    )
    render_upload_card(card)
    # --- end: upload-card-status ------------------------------------

    st.divider()
    # Phase 8: demo button is always available — works from EMPTY
    # (first-time visitor) and from READY/RESULTS_READY (returning user
    # who wants to compare).
    render_demo_button(session_state)

    st.divider()
    if st.button("Start over", use_container_width=True):
        AppState.reset(session_state)
        # Invalidate cached services so the next ask rebuilds them
        # against the new (empty) state.
        for reset in (
            reset_settings_cache,
            reset_ingestion_cache,
            reset_retrieval_cache,
            reset_prompt_cache,
            reset_llm_cache,
            reset_teaching_cache,
        ):
            with contextlib.suppress(Exception):
                reset()
        st.rerun()

# --- end: sidebar -------------------------------------------------------


# --- begin: file-upload-handler -----------------------------------------
if uploaded_file is not None and (
    uploaded_file.name != AppState.get_book_filename(session_state)
    or uploaded_file.size != AppState.get_book_size(session_state)
):
    # Persist the uploaded file under a stable name inside data/uploads/
    # so the IngestionPipeline can hand the path to PyMuPDF.
    settings = get_settings()
    settings.ensure_data_dirs()
    target = settings.uploads_dir / uploaded_file.name
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open("wb") as fh:
        fh.write(uploaded_file.getbuffer())

    # Move state to INGESTING. The actual ingestion runs in the
    # INGESTING branch below so the spinner renders.
    AppState.begin_ingestion(
        session_state, filename=uploaded_file.name, size_bytes=uploaded_file.size
    )
    # Snapshot a "currently ingesting" path so the INGESTING branch
    # can find the file across re-runs.
    session_state["_tt_pending_path"] = str(target)
    st.rerun()
# --- end: file-upload-handler ------------------------------------------


# --- begin: stage-routing ------------------------------------------------
stage = AppState.get_stage(session_state)


def _render_empty() -> None:
    render_empty_state()
    st.divider()
    render_topic_input(session_state)


def _render_ingesting() -> None:
    """Ingest the pending upload. Errors move to ERROR state (no silent failure)."""
    pending_path_str = session_state.get("_tt_pending_path")
    if not pending_path_str:
        AppState.mark_error(session_state, message="Ingestion target path is missing.")
        st.rerun()
        return

    pending_path = Path(pending_path_str)
    card = UploadCardVM(
        filename=AppState.get_book_filename(session_state) or "",
        size_bytes=AppState.get_book_size(session_state),
        book_id=None,
        status="indexing",
    )
    render_upload_card(card)
    render_indexing_spinner(card)

    # Use a fresh, per-call Settings + per-call pipeline so we don't
    # race with the cached singletons.
    settings = Settings()
    pipeline = IngestionPipeline(
        settings=settings,
        parser=get_parser(),
        chunker=get_chunker(),
        embedder=get_embedder(),
        indexer_factory=make_indexer,
    )
    fingerprint = BookFingerprint(
        filename=pending_path.name,
        size_bytes=pending_path.stat().st_size,
        sha256=sha256_file(pending_path),
    )
    book = Book(fingerprint=fingerprint, path=pending_path)

    try:
        result = pipeline.ingest(book)
    except Exception as exc:  # noqa: BLE001 — invariant I-18: never silent
        logger.exception(
            "ingestion failed",
            extra={"where": "app._render_ingesting", "book_id": book.book_id},
        )
        AppState.mark_error(
            session_state,
            message=f"Ingestion failed: {exc!r}. See data/logs/errors.log for details.",
        )
        session_state.pop("_tt_pending_path", None)
        st.rerun()
        return

    AppState.complete_ingestion(session_state, book_id=result.book_id)
    session_state.pop("_tt_pending_path", None)
    st.success(f"Indexed `{pending_path.name}` as `{result.book_id}`.")
    logger.info(
        "ingestion complete",
        extra={
            "where": "app._render_ingesting",
            "book_id": result.book_id,
            "chunk_count": result.chunk_count,
        },
    )
    st.rerun()


def _render_ready_or_results() -> None:
    """The user has a book. Show topic input + (if available) results.

    Phase 8: also handles the "demo" path — when the current result has
    ``is_demo=True``, the user has no book, so the topic input is hidden
    and a "Demo mode" hint is shown instead.
    """
    result = AppState.get_result(session_state)
    is_demo_mode = result is not None and getattr(result, "is_demo", False)

    if not is_demo_mode:
        card = UploadCardVM(
            filename=AppState.get_book_filename(session_state) or "",
            size_bytes=AppState.get_book_size(session_state),
            book_id=AppState.get_book_id(session_state),
            status="ready",
        )
        render_ready_banner(card)
        render_restart_hint(session_state)
        topic, generate_clicked = render_topic_input(session_state)
        AppState.set_topic(session_state, topic)
        if generate_clicked and topic:
            AppState.begin_query(session_state)
            session_state["_tt_pending_topic"] = topic
            st.rerun()
            return
    else:
        # Demo mode: show a small hint, no topic input.
        st.info(
            "📚 You're viewing a **demo** — pre-computed case studies from "
            "`data/golden/`. To generate live results, upload your own PDF "
            "in the sidebar, or click **Try a demo (… )** to see another sample."
        )

    # Show last results, if any.
    if result is not None:
        page = teaching_result_to_page(result)
        render_results_page(page)


def _render_querying() -> None:
    """Run the LLM. The spinner from ``render_querying_spinner`` shows
    on the same rerun that drives the work.
    """
    topic = session_state.get("_tt_pending_topic") or AppState.get_topic(session_state)
    book_id = AppState.get_book_id(session_state)
    render_querying_spinner(session_state)
    if not topic or not book_id:
        AppState.mark_error(
            session_state,
            message="Missing topic or book_id while querying the LLM.",
        )
        st.rerun()
        return

    # Hot-update: rebuild the teaching service if the LLM changed since
    # the last teach (the cached service holds the old LLM).
    try:
        from src.config.container import (
            make_case_study_service,
            make_prompt_builder,
            make_roadmap_service,
        )

        # Always build a fresh facade + teaching service so the LLM
        # setting is honoured NOW (cache miss via factory rebuild).
        css = make_case_study_service()
        rms = make_roadmap_service()
        from src.teaching.teaching_service import TeachingService

        teaching = TeachingService(case_study_service=css, roadmap_service=rms)
        # Force the prompt builder to pick up the new language.
        _ = make_prompt_builder()
    except Exception as exc:  # noqa: BLE001
        logger.exception(
            "could not build teaching service",
            extra={"where": "app._render_querying"},
        )
        AppState.mark_error(
            session_state,
            message=f"Could not build the teaching pipeline: {exc!r}.",
        )
        st.rerun()
        return

    try:
        result = teaching.teach(topic=topic, book_id=book_id)
    except Exception as exc:  # noqa: BLE001 — invariant I-18
        logger.exception(
            "teach() failed",
            extra={"where": "app._render_querying", "topic": topic, "book_id": book_id},
        )
        AppState.mark_error(
            session_state,
            message=f"Generation failed: {exc!r}. See data/logs/errors.log for details.",
        )
        session_state.pop("_tt_pending_topic", None)
        st.rerun()
        return

    AppState.complete_query(session_state, result=result)
    AppState.mark_llm_at_query(session_state)
    session_state.pop("_tt_pending_topic", None)
    logger.info(
        "teach complete",
        extra={
            "where": "app._render_querying",
            "topic": topic,
            "book_id": book_id,
            "status": result.status,
        },
    )
    st.rerun()


def _render_error() -> None:
    msg = AppState.get_error(session_state) or "Something went wrong."
    render_error_banner(msg)
    if st.button("Try again"):
        AppState.reset(session_state)
        st.rerun()


if stage == AppStage.EMPTY:
    _render_empty()
elif stage == AppStage.INGESTING:
    _render_ingesting()
elif stage == AppStage.READY:
    _render_ready_or_results()
elif stage == AppStage.QUERYING:
    _render_querying()
elif stage == AppStage.RESULTS_READY:
    _render_ready_or_results()
elif stage == AppStage.ERROR:
    _render_error()
else:  # pragma: no cover — exhaustive enum
    render_error_banner(f"Unknown stage: {stage}")
# --- end: stage-routing -------------------------------------------------
