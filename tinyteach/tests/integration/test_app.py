"""Integration test for ``app.py`` using ``streamlit.testing.v1.AppTest``.

We don't upload a real PDF or call a real LLM here — that would be
flaky + expensive. Instead we drive the state machine directly via
``AppState`` and assert the UI re-renders correctly.

The point of this test is to prove that ``app.py`` honours the
state machine (no silent failure paths) and that widgets appear
where they should.
"""

from __future__ import annotations

from pathlib import Path

import pytest
from streamlit.testing.v1 import AppTest

# AppTest boots Streamlit for each invocation; mark as integration
# so the slow marker convention can skip it in ultra-fast runs.
pytestmark = pytest.mark.integration

# AppTest resolves script paths relative to the test file's CWD. Since
# ``app.py`` lives at the project root, we use an absolute path.
APP_PATH = str(Path(__file__).resolve().parents[2] / "app.py")


# --- begin: app-render-tests --------------------------------------------
def test_app_empty_state_shows_title_and_upload_widget(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """On the first run, the empty state renders and the uploader exists."""
    monkeypatch.chdir(tmp_path)  # so data/ is in a clean tmp dir
    at = AppTest.from_file(APP_PATH).run(timeout=60)

    # No exceptions thrown.
    assert not at.exception
    # Title is rendered.
    assert any("TinyTeach" in t.value for t in at.title)
    # The file uploader is present (anywhere in the tree).
    assert at.get("file_uploader")
    # The topic input is rendered.
    assert at.get("text_input")


def test_app_runs_through_stage_routing_without_exception(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """Driving the state directly renders the corresponding branches."""
    from src.ui.state import AppStage, AppState  # noqa: F401

    monkeypatch.chdir(tmp_path)
    at = AppTest.from_file(APP_PATH).run(timeout=30)

    # The empty state is the starting point.
    assert at.session_state["_tt_stage"] == AppStage.EMPTY.value

    # Drive READY by hand; the next run should show the 'Ready' badge.
    AppState.begin_ingestion(at.session_state, filename="sample.pdf", size_bytes=42)
    AppState.complete_ingestion(at.session_state, book_id="sha256_sample1234abcd")
    at.run(timeout=30)

    assert at.session_state["_tt_stage"] == AppStage.READY.value
    # A success/info message about being ready.
    all_messages = list(at.success) + list(at.info)
    assert any("Ready" in (s.value or "") or "indexed" in (s.value or "") for s in all_messages)


def test_app_error_state_shows_error_banner(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """An error in the state is visible (invariant I-18: no silent failure)."""
    from src.ui.state import AppStage, AppState

    monkeypatch.chdir(tmp_path)
    at = AppTest.from_file(APP_PATH).run(timeout=30)

    AppState.mark_error(at.session_state, message="Test failure message")
    at.run(timeout=30)

    assert at.session_state["_tt_stage"] == AppStage.ERROR.value
    # The error widget contains the message.
    assert any("Test failure message" in (e.value or "") for e in at.error)


# --- end: app-render-tests ---------------------------------------------


# --- begin: phase-8-demo-button-tests -----------------------------------
def test_demo_button_present_in_empty_state(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """Phase 8: the 'Try a demo' button is visible on first run (EMPTY state)."""
    monkeypatch.chdir(tmp_path)
    at = AppTest.from_file(APP_PATH).run(timeout=30)
    assert not at.exception
    # The demo button label is "Try a demo (<topic>)" — find it.
    demo_buttons = [b for b in at.button if b.label and "Try a demo" in b.label]
    assert demo_buttons, "Demo button must be visible on first run"


def test_demo_button_jumps_empty_to_results_ready(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """Clicking the Demo button transitions EMPTY -> RESULTS_READY (Phase 8)."""
    from src.ui.state import AppStage, AppState

    monkeypatch.chdir(tmp_path)
    at = AppTest.from_file(APP_PATH).run(timeout=30)
    assert at.session_state["_tt_stage"] == AppStage.EMPTY.value

    # Find and click the demo button.
    demo_buttons = [b for b in at.button if b.label and "Try a demo" in b.label]
    assert demo_buttons, "Demo button must be present"
    demo_buttons[0].click().run(timeout=30)

    # State machine jumped to RESULTS_READY; a result is stored.
    assert at.session_state["_tt_stage"] == AppStage.RESULTS_READY.value
    result = AppState.get_result(at.session_state)
    assert result is not None
    assert result.is_demo is True
    # The banner carries the [Demo] prefix (Phase 8 marker) -- shown via
    # ``st.success``, so look at success/info, not markdown.
    banner_text = " ".join((s.value or "") for s in list(at.success) + list(at.info) if s.value)
    assert "Demo" in banner_text, banner_text


def test_demo_button_downloads_buttons_present(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """After clicking Demo, the JSON + Markdown download buttons appear."""
    monkeypatch.chdir(tmp_path)
    at = AppTest.from_file(APP_PATH).run(timeout=30)
    demo_buttons = [b for b in at.button if b.label and "Try a demo" in b.label]
    demo_buttons[0].click().run(timeout=30)

    # AppTest does not expose ``.download_button`` directly; use ``at.get``
    # (same pattern as the ``file_uploader`` quirk in context.md).
    download_buttons = at.get("download_button")
    labels = [b.label for b in download_buttons if b.label]
    # The results page renders BOTH download buttons (JSON + Markdown).
    assert any("JSON" in lbl for lbl in labels), labels
    assert any("Markdown" in lbl for lbl in labels), labels


# --- end: phase-8-demo-button-tests -------------------------------------


# Note: we deliberately do NOT exercise the file-upload path here.
# AppTest's set_value for a file_uploader is supported, but a real
# ingestion round-trip would require the sentence-transformers model
# and a real PDF — that's covered by the integration test in
# tests/integration/test_ingestion_pipeline.py.
