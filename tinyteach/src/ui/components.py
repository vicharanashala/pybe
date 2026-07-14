"""Streamlit rendering helpers (View layer — GoF).

Each ``render_*`` function takes view models (from ``view_models.py``)
or a ``st.session_state``-like object and calls ``st.*`` directly.
The components are kept small enough that integration coverage via
``AppTest`` is the primary test surface; the pure logic lives in the
view-model converters.
"""

from __future__ import annotations

from typing import Any

import streamlit as st

from src.golden import loader as golden_loader
from src.ui.state import AppState
from src.ui.view_models import (
    CaseStudyCardVM,
    ResultsPageVM,
    RoadmapVM,
    TopicBannerVM,
    UploadCardVM,
)


# --- begin: helpers ------------------------------------------------------
def _difficulty_emoji(d: str) -> str:
    return {"novice": "🟢", "intermediate": "🟡", "advanced": "🔴"}.get(d, "⚪")


# --- end: helpers -------------------------------------------------------


def render_demo_button(session_state: Any) -> None:
    """Phase 8: render a "Try a demo" button that loads a golden sample.

    The button is always available. When clicked, it loads the default
    golden sample for the currently-selected language and transitions
    the state machine to ``RESULTS_READY``. The result carries
    ``is_demo=True``, which the rest of the UI uses to show a "Demo"
    badge in the banner.

    Falls back to ``generic/decorators`` if no sample exists for the
    current language. If no sample is found at all, the button is
    disabled (with a help text) so the user knows why.
    """
    st.sidebar.subheader("Demo")
    st.sidebar.caption(
        "Skip the upload — see TinyTeach's output on a curated, "
        "pre-computed sample (zero LLM cost)."
    )
    language = AppState.get_language(session_state)
    available_topics = golden_loader.known_topics_for(language)
    if not available_topics:
        # Try generic fallback for the topic set, but only as a UI hint.
        st.sidebar.button(
            "No demo for this language yet",
            disabled=True,
            use_container_width=True,
            help=f"Add a file under data/golden/{language}/ to enable this.",
        )
        return

    default_topic = golden_loader.default_demo_topic_for(language)
    if st.sidebar.button(
        f"Try a demo ({default_topic})",
        type="secondary",
        use_container_width=True,
        help=(
            f"Loads data/golden/{language}/{default_topic}.json — "
            f"3 case studies + roadmap, no LLM call."
        ),
    ):
        try:
            result = golden_loader.load_demo(language, default_topic)
        except Exception as exc:  # noqa: BLE001 — invariant I-18
            st.sidebar.error(f"Demo failed: {exc!r}")
            return
        # Phase 8 helper: jumps EMPTY -> RESULTS_READY (allowed) and
        # stores the result. The result.is_demo=True flag drives the
        # banner badge in the view-model converter.
        AppState.load_demo_result(session_state, result=result)
        st.rerun()


# --- begin: sidebar-renderers -------------------------------------------
def render_model_picker(session_state: Any) -> None:
    """Render the LLM + language picker. Writes back to ``session_state``."""
    st.sidebar.subheader("Model")

    llm_options = (
        "hf_inference (HF router, free)",
        "groq (needs GROQ_API_TOKEN)",
        "hf_local (needs ~4 GB RAM)",
        "ollama (needs OLLAMA_HOST)",
    )
    current_llm = AppState.get_llm(session_state)
    # Map stored value -> label for the radio.
    llm_label_map = {
        "hf_inference": llm_options[0],
        "groq": llm_options[1],
        "hf_local": llm_options[2],
        "ollama": llm_options[3],
    }
    rev_map = {v: k for k, v in llm_label_map.items()}
    new_llm_label = st.sidebar.radio(
        "LLM provider",
        llm_options,
        index=llm_options.index(llm_label_map.get(current_llm, llm_options[0])),
        help=(
            "hf_inference is free and default. "
            "Switching requires a restart of any cached response."
        ),
    )
    new_llm = rev_map[new_llm_label]
    if new_llm != current_llm:
        AppState.set_llm(session_state, new_llm)

    st.sidebar.subheader("Language")
    # Auto-discover languages via the prompt registry — Phase 8: dropping a
    # new ``languages/<name>.py`` module makes it appear here automatically.
    from src.generation.prompts.registry import PromptRegistry

    lang_options = tuple(PromptRegistry.known_languages())
    current_lang = AppState.get_language(session_state)
    # Fall back to the registry's first language if the session state holds
    # an unknown value (e.g. a deprecated language after an upgrade).
    safe_index = lang_options.index(current_lang) if current_lang in lang_options else 0
    new_lang = st.sidebar.selectbox(
        "Prompt language",
        lang_options,
        index=safe_index,
    )
    if new_lang != current_lang:
        AppState.set_language(session_state, new_lang)


# --- end: sidebar-renderers ---------------------------------------------


# --- begin: main-renderers ----------------------------------------------
def render_empty_state() -> None:
    """Show the 'upload a PDF to begin' banner."""
    st.title("TinyTeach — Learn a programming language from a PDF")
    st.markdown(
        """
        **Turn any computer-language PDF into a personal tutor.** TinyTeach
        ingests your book, and for any topic you ask, generates:

        - **5–8 curiosity-driven case studies** with real-world analogies,
          fun facts, hints, and a working code skeleton
        - A **roadmap** of milestones to master the topic end-to-end

        👈 Upload a PDF in the sidebar to get started.
        """
    )


def render_upload_card(card: UploadCardVM) -> None:
    """One row in the sidebar showing what's uploaded + its index status."""
    if card.status == "empty":
        st.sidebar.info("No book uploaded yet.")
        return
    st.sidebar.markdown("**Uploaded book**")
    st.sidebar.markdown(f"`{card.filename}` · {card.size_human}")
    st.sidebar.markdown(f"Status: **{card.status_badge}**")
    if card.error_message:
        st.sidebar.error(card.error_message)


def render_indexing_spinner(card: UploadCardVM) -> None:
    """Spinner while ingestion runs (called inside INGESTING state)."""
    st.info(f"Indexing `{card.filename}`… this can take up to a minute.")
    st.progress(0.5, text="Reading pages → chunking → embedding → saving index")


def render_ready_banner(card: UploadCardVM) -> None:
    """Book is indexed. Show a 'Ready' badge + the ID."""
    st.success(f"Ready — `{card.filename}` indexed as `{card.book_id}`.")
    st.caption(
        "Enter a topic below and TinyTeach will generate case studies "
        "and a roadmap grounded in the book's content."
    )


def render_error_banner(message: str) -> None:
    """One big red error panel."""
    st.error(f"⚠️ {message}")


# --- end: main-renderers -----------------------------------------------


# --- begin: query-input-renderer ----------------------------------------
def render_topic_input(session_state: Any) -> tuple[str, bool]:
    """Render the topic input + Generate button.

    Returns ``(topic, generate_clicked)``. The caller decides what to
    do when ``generate_clicked`` is True.
    """
    st.subheader("Ask the book a topic")
    default_topic = AppState.get_topic(session_state) or "decorators"
    topic = st.text_input(
        "Topic",
        value=default_topic,
        help="A topic the book covers — e.g. 'decorators', 'recursion'.",
        label_visibility="collapsed",
    )
    generate = st.button(
        "Generate case studies + roadmap",
        type="primary",
        use_container_width=True,
    )
    return topic.strip(), generate


# --- end: query-input-renderer ------------------------------------------


# --- begin: card-renderer ----------------------------------------------
def render_case_study_card(card: CaseStudyCardVM) -> None:
    """One case study, with the collapsibles mandated by the blueprint."""
    with st.container(border=True):
        st.markdown(f"### {card.header()}")
        st.caption(
            f"{_difficulty_emoji(card.difficulty)} **{card.difficulty.title()}** · "
            f"**Concept:** {card.concept}"
        )
        st.markdown(f"**Scenario**  \n{card.scenario}")
        st.markdown(f"**Task**  \n{card.task}")

        with st.expander("Show starter code"):
            st.code(card.starter_code, language="python")

        with st.expander("Show real-world analogy"):
            st.markdown(card.real_world_analogy)

        with st.expander("Show fun fact"):
            st.info(card.fun_fact)

        with st.expander("Show hints"):
            for i, hint in enumerate(card.hints, 1):
                st.markdown(f"**Hint {i}:** {hint}")

        with st.expander("Show expected output"):
            st.code(card.expected_output, language="text")

        st.caption(f"🎯 {card.learning_objective}")


# --- end: card-renderer ------------------------------------------------


# --- begin: roadmap-renderer --------------------------------------------
def render_roadmap(roadmap: RoadmapVM) -> None:
    """Render the roadmap as an ordered list of milestones."""
    st.subheader("Learning roadmap")
    st.caption(
        f"Estimated time: **{roadmap.estimated_hours} hours** · "
        f"{len(roadmap.milestones)} milestones"
    )
    for m in roadmap.milestones:
        with st.container(border=True):
            st.markdown(f"**{m.index}. {m.name}**")
            st.markdown(m.description)
            if m.success_criteria:
                st.markdown("**You'll know you're done when you can:**")
                for c in m.success_criteria:
                    st.markdown(f"- {c}")
            st.caption(f"⤷ Drives Case study #{m.case_study_index + 1}")


# --- end: roadmap-renderer ---------------------------------------------


# --- begin: results-renderer -------------------------------------------
def render_results_page(page: ResultsPageVM) -> None:
    """The whole 'after teach()' panel: banner + cards + roadmap + downloads."""
    render_topic_banner(page.banner)
    if page.roadmap is not None:
        render_roadmap(page.roadmap)
    if page.case_studies:
        st.subheader(f"Case studies ({len(page.case_studies)})")
        for card in page.case_studies:
            render_case_study_card(card)
    _render_downloads(page)


def render_topic_banner(banner: TopicBannerVM) -> None:
    if "not in book" in banner.headline.lower():
        st.warning(f"**{banner.headline}**\n\n{banner.body}")
    else:
        st.success(f"**{banner.headline}**\n\n{banner.body}")


def _render_downloads(page: ResultsPageVM) -> None:
    """Two download buttons — JSON (machine) and Markdown (human)."""
    if not (page.raw_json or page.raw_markdown):
        return
    st.divider()
    st.subheader("Download")
    cols = st.columns(2)
    with cols[0]:
        st.download_button(
            "Download as JSON",
            data=page.raw_json,
            file_name="tinyteach_case_studies.json",
            mime="application/json",
            use_container_width=True,
        )
    with cols[1]:
        st.download_button(
            "Download as Markdown",
            data=page.raw_markdown,
            file_name="tinyteach_case_studies.md",
            mime="text/markdown",
            use_container_width=True,
        )


# --- end: results-renderer ---------------------------------------------


# --- begin: orchestrator-helpers ----------------------------------------
def render_querying_spinner(session_state: Any) -> None:
    """Spinner during QUERYING — gives the user feedback that work is happening."""
    topic = AppState.get_topic(session_state) or "your topic"
    with st.spinner(f"Generating case studies and roadmap for '{topic}'…"):
        st.info(
            "This calls the LLM (free tier). It typically takes 15-60 s "
            "depending on provider and topic length."
        )


def render_restart_hint(session_state: Any) -> None:
    """If the LLM changed since the last teach(), show a restart prompt."""
    if AppState.is_llm_changed_since_last_teach(session_state):
        st.info("ℹ️ You changed the LLM provider. " "Click **Generate** again to use the new one.")


# --- end: orchestrator-helpers ------------------------------------------
