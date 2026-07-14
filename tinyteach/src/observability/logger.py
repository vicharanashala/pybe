"""Structured logging setup.

SRP-justification: this module owns ONE thing — translating Python
``LogRecord`` objects into the three on-disk JSON files described in
PROJECT_BLUEPRINT §11. Other modules just call ``logging.getLogger(__name__)``
and propagate; this module is the only place that attaches handlers.

Idempotency guarantee: ``configure_logging`` is safe to call repeatedly
(handlers are not duplicated). Tests rely on this.
"""

from __future__ import annotations

import json
import logging
import logging.handlers
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from src.config import constants as C  # noqa: N812  (intentional short alias)
from src.config.settings import Settings
from src.observability.correlation import get_correlation_id


# --- begin: json formatter -------------------------------------------------
class JsonFormatter(logging.Formatter):
    """Emit one JSON object per record.

    Always includes the fields specified by PROJECT_BLUEPRINT §11:
    ``ts``, ``level``, ``corr_id``. Any keyword args passed via
    ``logger.info(..., extra={...})`` are merged in. Optional fields
    (``book_id``, ``topic``, ``exception_type``, ``traceback``) appear
    when populated.
    """

    # Optional fields that we surface explicitly when present.
    _PASSTHROUGH_FIELDS = (
        "book_id",
        "topic",
        "llm_provider",
        "model",
        "where",
        "exception_type",
        "traceback",
    )

    def format(self, record: logging.LogRecord) -> str:
        # --- begin: build base payload --------------------------------
        payload: dict[str, Any] = {
            "ts": datetime.fromtimestamp(record.created, tz=timezone.utc).isoformat(
                timespec="milliseconds"
            ),
            "level": record.levelname,
            "corr_id": getattr(record, "corr_id", "") or get_correlation_id(),
            "logger": record.name,
            "message": record.getMessage(),
        }
        # --- end: build base payload ----------------------------------

        # --- begin: pass-through extras -------------------------------
        for field in self._PASSTHROUGH_FIELDS:
            value = getattr(record, field, None)
            if value not in (None, ""):
                payload[field] = value
        # --- end: pass-through extras ---------------------------------

        # --- begin: exception traceback -------------------------------
        if record.exc_info:
            payload["exception_type"] = record.exc_info[0].__name__ if record.exc_info[0] else ""
            payload["traceback"] = self.formatException(record.exc_info)
        # --- end: exception traceback ---------------------------------

        return json.dumps(payload, ensure_ascii=False, default=str)


# --- end: json formatter ---------------------------------------------------


# --- begin: correlation-id filter -----------------------------------------
class CorrelationIdFilter(logging.Filter):
    """Inject the current correlation id onto every ``LogRecord``.

    This lets the JsonFormatter pull the value without having to import the
    ContextVar itself (which would create a coupling layer we don't want).
    """

    def filter(self, record: logging.LogRecord) -> bool:
        record.corr_id = get_correlation_id()
        return True


# --- end: correlation-id filter ------------------------------------------


# --- begin: handler factory ------------------------------------------------
def _make_rotating_handler(
    *,
    path: Path,
    level: int,
    max_bytes: int,
    backup_count: int,
) -> logging.handlers.RotatingFileHandler:
    """Build one RotatingFileHandler with the project's JSON formatter."""
    handler = logging.handlers.RotatingFileHandler(
        filename=path,
        maxBytes=max_bytes,
        backupCount=backup_count,
        encoding="utf-8",
    )
    handler.setLevel(level)
    handler.setFormatter(JsonFormatter())
    handler.addFilter(CorrelationIdFilter())
    return handler


# --- end: handler factory --------------------------------------------------


# --- begin: configure_logging ---------------------------------------------
_CONFIGURED = False


def configure_logging(settings: Settings) -> None:
    """Attach the three structured-log handlers to the root logger.

    Idempotent: repeated calls do NOT stack handlers. The root logger's
    level comes from ``settings.app_log_level``. Per-handler minimum
    levels are hard-coded (see PROJECT_BLUEPRINT §11).
    """
    global _CONFIGURED
    root = logging.getLogger()

    # Clear any handlers that may already be attached (Streamlit adds one
    # by default; tests re-configure frequently).
    for handler in list(root.handlers):
        root.removeHandler(handler)

    # Propagate DEBUG/INFO/… from anywhere in the app at this floor.
    root.setLevel(getattr(logging, settings.app_log_level.upper(), logging.INFO))

    settings.ensure_data_dirs()
    logs_dir = settings.logs_dir

    handlers = [
        _make_rotating_handler(
            path=logs_dir / C.LOG_FILE_APP,
            level=logging.INFO,
            max_bytes=C.LOG_FILE_APP_BYTES,
            backup_count=C.LOG_FILE_APP_BACKUPS,
        ),
        _make_rotating_handler(
            path=logs_dir / C.LOG_FILE_ERRORS,
            level=logging.ERROR,
            max_bytes=C.LOG_FILE_ERRORS_BYTES,
            backup_count=C.LOG_FILE_ERRORS_BACKUPS,
        ),
        _make_rotating_handler(
            path=logs_dir / C.LOG_FILE_INGEST,
            level=logging.INFO,
            max_bytes=C.LOG_FILE_INGEST_BYTES,
            backup_count=C.LOG_FILE_INGEST_BACKUPS,
        ),
    ]
    for handler in handlers:
        root.addHandler(handler)

    _CONFIGURED = True
    root.info(
        "logging configured",
        extra={"where": "observability.logger.configure_logging"},
    )


def is_configured() -> bool:
    """Whether ``configure_logging`` has been called on this process."""
    return _CONFIGURED


# --- end: configure_logging -----------------------------------------------
