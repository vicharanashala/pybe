"""Shared pytest fixtures.

SRP-justification: every test file in the project should be able to ask
for ``tmp_data_dir`` and ``clean_settings`` without re-implementing the
boilerplate. Centralising the fixtures keeps the test surface consistent
and prevents accidental coupling of one test to another's environment.
"""

from __future__ import annotations

from collections.abc import Iterator
from pathlib import Path

import pytest
from src.config.container import reset_settings_cache
from src.config.settings import Settings


# --- begin: tmp_data_dir --------------------------------------------------
@pytest.fixture()
def tmp_data_dir(tmp_path: Path) -> Path:
    """A per-test data directory containing uploads / indices / logs.

    Built on top of pytest's built-in ``tmp_path`` so it is automatically
    cleaned up after the test.
    """
    for sub in ("uploads", "indices", "logs"):
        (tmp_path / sub).mkdir(parents=True, exist_ok=True)
    return tmp_path


# --- end: tmp_data_dir ----------------------------------------------------


# --- begin: clean_settings ------------------------------------------------
@pytest.fixture()
def clean_settings(tmp_data_dir: Path, monkeypatch: pytest.MonkeyPatch) -> Settings:
    """A ``Settings`` instance pointed at the test data dir, with no env leakage.

    Clears the process-wide cache so subsequent calls to
    ``get_settings()`` re-read the (mutated) env. Also unsets every
    TinyTeach env var so a developer's local ``.env`` cannot leak into
    a unit test.
    """
    # Drop the cached instance so we get a fresh one bound to our env.
    reset_settings_cache()

    # Neutralise any env keys a developer might have set.
    for key in (
        "EMBEDDING_MODEL",
        "EMBEDDING_DEVICE",
        "EMBEDDING_BATCH_SIZE",
        "CHUNK_SIZE",
        "CHUNK_OVERLAP",
        "RETRIEVAL_TOP_K",
        "RETRIEVAL_MIN_SCORE",
        "LLM_PROVIDER",
        "LLM_MODEL",
        "LLM_TEMPERATURE",
        "LLM_MAX_TOKENS",
        "LLM_API_TOKEN",
        "PROMPT_LANGUAGE",
        "PROMPT_VERSION",
        "APP_DATA_DIR",
        "APP_LOG_LEVEL",
        "APP_LOG_RETENTION_DAYS",
        "GEN_MAX_RETRIES",
        "GEN_DETERMINISTIC",
    ):
        monkeypatch.delenv(key, raising=False)

    monkeypatch.setenv("APP_DATA_DIR", str(tmp_data_dir))
    monkeypatch.setenv("APP_LOG_LEVEL", "INFO")
    monkeypatch.setenv("PROMPT_LANGUAGE", "python")
    monkeypatch.setenv("LLM_PROVIDER", "hf_inference")

    settings = Settings()
    settings.ensure_data_dirs()
    yield settings

    reset_settings_cache()


# --- end: clean_settings --------------------------------------------------


# --- begin: autouse reset -------------------------------------------------
@pytest.fixture(autouse=True)
def _reset_caches_between_tests() -> Iterator[None]:
    """Drop the lru_caches between tests so env mutations take effect."""
    reset_settings_cache()
    yield
    reset_settings_cache()


# --- end: autouse reset ---------------------------------------------------
