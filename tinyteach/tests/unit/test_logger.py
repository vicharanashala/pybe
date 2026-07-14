"""Tests for the structured-logging setup (PROJECT_BLUEPRINT §11).

The acceptance criterion is: each of the three on-disk log files
(app.log, errors.log, ingest.log) MUST receive a record when the
corresponding level is emitted.
"""

from __future__ import annotations

import json
import logging
from pathlib import Path

import pytest
from src.config import constants as C  # noqa: N812  (intentional short alias)
from src.config.settings import Settings
from src.observability.logger import configure_logging


# --- begin: helper ---------------------------------------------------------
def _read_jsonl(path: Path) -> list[dict[str, object]]:
    """Load a JSON-Lines log file into a list of dicts."""
    if not path.exists():
        return []
    out: list[dict[str, object]] = []
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            out.append(json.loads(line))
    return out


# --- end: helper -----------------------------------------------------------


# --- begin: all-three-handlers-attached -----------------------------------
def test_configure_logging_attaches_three_handlers(clean_settings: Settings) -> None:
    """After configure_logging, root has 3 RotatingFileHandlers."""
    configure_logging(clean_settings)

    handlers = logging.getLogger().handlers
    assert len(handlers) == 3, f"expected 3 handlers, got {len(handlers)}"

    # All three filenames should be among them.
    names = {Path(h.baseFilename).name for h in handlers}  # type: ignore[attr-defined]
    assert names == {C.LOG_FILE_APP, C.LOG_FILE_ERRORS, C.LOG_FILE_INGEST}


# --- end: all-three-handlers-attached -------------------------------------


# --- begin: app-log-receives-info -----------------------------------------
def test_app_log_receives_info(clean_settings: Settings) -> None:
    """An INFO record lands in app.log (and ingest.log, by design)."""
    configure_logging(clean_settings)
    logging.getLogger("test.app").info("phase0-smoke", extra={"where": "test_app_log"})

    app_records = _read_jsonl(clean_settings.logs_dir / C.LOG_FILE_APP)
    assert any(r.get("message") == "phase0-smoke" for r in app_records), app_records


# --- end: app-log-receives-info -------------------------------------------


# --- begin: errors-log-receives-error -------------------------------------
def test_errors_log_receives_error(clean_settings: Settings) -> None:
    """An ERROR record lands in errors.log, with traceback attached."""
    configure_logging(clean_settings)
    try:
        raise ValueError("boom")
    except ValueError:
        logging.getLogger("test.errors").exception(
            "something broke",
            extra={"where": "test_errors_log"},
        )

    err_records = _read_jsonl(clean_settings.logs_dir / C.LOG_FILE_ERRORS)
    assert err_records, "errors.log should have at least one record"
    last = err_records[-1]
    assert last["level"] == "ERROR"
    assert last["message"] == "something broke"
    assert "ValueError" in str(last.get("exception_type", ""))
    assert "Traceback" in str(last.get("traceback", ""))


# --- end: errors-log-receives-error ---------------------------------------


# --- begin: ingest-log-receives-info --------------------------------------
def test_ingest_log_receives_info(clean_settings: Settings) -> None:
    """An INFO record lands in ingest.log (it shares INFO with app.log)."""
    configure_logging(clean_settings)
    logging.getLogger("test.ingest").info("ingest-smoke", extra={"where": "test_ingest_log"})

    ingest_records = _read_jsonl(clean_settings.logs_dir / C.LOG_FILE_INGEST)
    assert any(r.get("message") == "ingest-smoke" for r in ingest_records), ingest_records


# --- end: ingest-log-receives-info ----------------------------------------


# --- begin: correlation-id-propagated -------------------------------------
def test_correlation_id_propagates_to_records(clean_settings: Settings) -> None:
    """The active correlation_id appears on every JSON line."""
    from src.observability.correlation import with_correlation_id

    configure_logging(clean_settings)

    with with_correlation_id("deadbeef"):
        logging.getLogger("test.corr").info("corr-smoke")

    records = _read_jsonl(clean_settings.logs_dir / C.LOG_FILE_APP)
    matches = [r for r in records if r.get("message") == "corr-smoke"]
    assert matches, "corr-smoke not found"
    assert matches[-1]["corr_id"] == "deadbeef"


# --- end: correlation-id-propagated ---------------------------------------


# --- begin: idempotency ---------------------------------------------------
def test_configure_logging_is_idempotent(clean_settings: Settings) -> None:
    """Calling configure_logging twice does NOT duplicate handlers."""
    configure_logging(clean_settings)
    configure_logging(clean_settings)
    handlers = logging.getLogger().handlers
    assert len(handlers) == 3, f"expected 3 handlers after re-configure, got {len(handlers)}"


# --- end: idempotency -----------------------------------------------------


# --- begin: parametrised-skip-marker --------------------------------------
@pytest.mark.parametrize("level_name", ["DEBUG", "WARNING"])
def test_log_levels_respect_handlers(clean_settings: Settings, level_name: str) -> None:
    """Records below a handler's level do NOT land in that handler's file."""
    configure_logging(clean_settings)
    logger = logging.getLogger(f"test.level.{level_name}")
    logger.setLevel(getattr(logging, level_name))
    logger.info("below-threshold-should-be-dropped-from-errors")

    err_records = _read_jsonl(clean_settings.logs_dir / C.LOG_FILE_ERRORS)
    assert all(
        r.get("message") != "below-threshold-should-be-dropped-from-errors" for r in err_records
    ), "errors.log should NOT receive INFO records"


# --- end: parametrised-skip-marker ----------------------------------------
