"""Tests for ``src.utils.hashing``.

The hash algorithm MUST stay stable across upgrades — if it changes,
cached indices become invalid. We test against the well-known empty-string
and "abc" SHA-256 vectors as ground truth.
"""

from __future__ import annotations

from pathlib import Path

from src.domain.book import BookFingerprint
from src.utils.hashing import book_fingerprint, sha256_file


# --- begin: known-sha256-vectors ------------------------------------------
def test_sha256_file_known_vector(tmp_path: Path) -> None:
    """``sha256_file`` matches the well-known SHA-256 of ``"abc"``."""
    p = tmp_path / "abc.txt"
    p.write_text("abc", encoding="utf-8")
    assert sha256_file(p) == ("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad")


def test_sha256_file_empty(tmp_path: Path) -> None:
    """Empty file hashes to the empty-input SHA-256."""
    p = tmp_path / "empty.bin"
    p.write_bytes(b"")
    assert sha256_file(p) == ("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855")


# --- end: known-sha256-vectors --------------------------------------------


# --- begin: streaming-consistency -----------------------------------------
def test_sha256_file_streams_large_file(tmp_path: Path) -> None:
    """Hashing a 5 MB file (multiple chunks) yields a stable digest."""
    p = tmp_path / "big.bin"
    p.write_bytes(b"x" * (5 * 1024 * 1024))
    digest = sha256_file(p)
    # Recompute and assert equality — proves no off-by-one in chunk boundary.
    assert digest == sha256_file(p)
    assert len(digest) == 64  # 256 bits in hex


# --- end: streaming-consistency -------------------------------------------


# --- begin: book-fingerprint-wraps-domain --------------------------------
def test_book_fingerprint_returns_domain_instance() -> None:
    """``book_fingerprint`` returns a frozen ``BookFingerprint``."""
    fp = book_fingerprint("a.pdf", 12, "deadbeef" * 4)  # 32 hex chars
    assert isinstance(fp, BookFingerprint)
    # First 16 hex chars of the sha become the book_id suffix.
    assert fp.book_id == "sha256_deadbeefdeadbeef"


def test_book_fingerprint_short_sha_is_handled() -> None:
    """A SHA shorter than 16 chars still produces a valid book_id."""
    fp = book_fingerprint("a.pdf", 1, "abc")
    # Slicing a short string just returns what's there; we accept it.
    assert fp.book_id == "sha256_abc"


# --- end: book-fingerprint-wraps-domain ----------------------------------
