"""Correlation-id propagation.

SRP-justification: this module's only job is to generate, expose, and
scope a single correlation id per request so that every log line emitted
during that request can be tied back to the originating user action.
"""

from __future__ import annotations

import secrets
from collections.abc import Iterator
from contextlib import contextmanager
from contextvars import ContextVar

from src.config import constants as C  # noqa: N812  (intentional short alias)

# --- begin: context-var binding -------------------------------------------
# A ``ContextVar`` is the stdlib primitive for "per-task" state. Streamlit
# re-runs in a fresh async context, so the variable naturally resets
# between requests — which is exactly what we want.
_correlation_id_var: ContextVar[str] = ContextVar("tinyteach_correlation_id", default="")


def get_correlation_id() -> str:
    """Return the current correlation id (empty string if none set)."""
    return _correlation_id_var.get()


def set_correlation_id(value: str) -> None:
    """Overwrite the current correlation id. Use only in tests / middleware."""
    _correlation_id_var.set(value)


@contextmanager
def with_correlation_id(value: str | None = None) -> Iterator[str]:
    """Context manager that sets a correlation id for its scope.

    If ``value`` is None, a fresh ``secrets.token_hex`` of length
    ``constants.CORRELATION_ID_LENGTH`` is generated. Yields the active id
    so callers can include it in user-facing messages if needed.
    """
    cid = value or secrets.token_hex(C.CORRELATION_ID_LENGTH // 2 or 1)
    token = _correlation_id_var.set(cid)
    try:
        yield cid
    finally:
        _correlation_id_var.reset(token)


# --- end: context-var binding ---------------------------------------------
