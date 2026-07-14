"""Hashing utilities.

SRP-justification: hashing bytes / files lives in one place so that the
``BookFingerprint`` invariant (I-8: idempotent ingestion) is computed the
same way everywhere. Tests assert the exact algorithm to catch silent
dependency upgrades.
"""

from __future__ import annotations

import hashlib
from pathlib import Path

from src.domain.book import BookFingerprint

# --- begin: chunk size for streaming hashes --------------------------------
# 1 MiB strikes a balance between syscall overhead and memory pressure.
# Big PDFs (50 MB cap from ``constants.MAX_PDF_BYTES``) hash in ~50 reads.
_HASH_CHUNK_BYTES = 1024 * 1024
# --- end: chunk size for streaming hashes ----------------------------------


# --- begin: sha256_file ---------------------------------------------------
def sha256_file(path: Path) -> str:
    """Return the lowercase hex SHA-256 digest of the file at ``path``.

    Streams the file in ``_HASH_CHUNK_BYTES`` chunks so memory usage
    stays flat regardless of file size (invariant I-17: bounded memory).
    """
    hasher = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(_HASH_CHUNK_BYTES), b""):
            hasher.update(chunk)
    return hasher.hexdigest()


# --- end: sha256_file -----------------------------------------------------


# --- begin: book_fingerprint ----------------------------------------------
def book_fingerprint(filename: str, size_bytes: int, sha256: str) -> BookFingerprint:
    """Wrap a (filename, size, sha256) triple into the domain object.

    Centralised so the ``Book`` constructor and the ingestion pipeline
    cannot disagree about what a fingerprint IS.
    """
    return BookFingerprint(filename=filename, size_bytes=size_bytes, sha256=sha256)


# --- end: book_fingerprint ------------------------------------------------
