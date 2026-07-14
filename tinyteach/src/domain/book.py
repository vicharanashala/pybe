"""Book & BookFingerprint value objects.

SRP-justification: a Book is purely a record of what was uploaded. It
does not know how to be parsed, embedded, or stored — those are the
responsibilities of the ingestion pipeline. The fingerprint makes
ingestion idempotent (invariant I-8).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path

try:
    from typing import Self
except ImportError:  # Python <3.11
    from typing_extensions import Self


# --- begin: fingerprint ---------------------------------------------------
@dataclass(frozen=True)
class BookFingerprint:
    """Stable identity of an uploaded book, independent of filename.

    Two uploads with the same (size, sha256) are the SAME book —
    Phase 1 uses this to skip re-embedding (invariant I-8).
    """

    filename: str
    size_bytes: int
    sha256: str

    @property
    def book_id(self) -> str:
        """Short id used for on-disk paths: ``sha256_<first 16 hex>``.

        Underscore instead of colon so the id is a legal filename on
        Windows (``<>:"/\\|?*`` are forbidden in NTFS).
        """
        return f"sha256_{self.sha256[:16]}"

    def __str__(self) -> str:
        return self.book_id


# --- end: fingerprint -----------------------------------------------------


# --- begin: book ----------------------------------------------------------
@dataclass(frozen=True)
class Book:
    """A reference to a PDF that has been uploaded (but not yet ingested)."""

    fingerprint: BookFingerprint
    path: Path
    uploaded_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    @property
    def book_id(self) -> str:
        return self.fingerprint.book_id

    def to_dict(self) -> dict[str, str | int]:
        return {
            "filename": self.fingerprint.filename,
            "size_bytes": self.fingerprint.size_bytes,
            "sha256": self.fingerprint.sha256,
            "book_id": self.book_id,
            "path": str(self.path),
            "uploaded_at": self.uploaded_at.isoformat(timespec="milliseconds"),
        }

    @classmethod
    def from_dict(cls, data: dict[str, str | int]) -> Self:
        return cls(
            fingerprint=BookFingerprint(
                filename=str(data["filename"]),
                size_bytes=int(data["size_bytes"]),
                sha256=str(data["sha256"]),
            ),
            path=Path(str(data["path"])),
            uploaded_at=datetime.fromisoformat(str(data["uploaded_at"])),
        )


# --- end: book ------------------------------------------------------------
