"""Typed application settings loaded from environment / .env file.

DIP-justification: this is the seam between the OS environment (an external
boundary that changes without notice) and the rest of the codebase (which
only ever sees a ``Settings`` instance). All downstream modules depend on
this abstraction, never on ``os.environ`` directly.

The class is a single object so dependency-injectable tests can construct
one in-memory without touching the filesystem.
"""

from __future__ import annotations

from pathlib import Path
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

from src.config import constants as C  # noqa: N812  (intentional short alias)


class Settings(BaseSettings):
    """All configuration values for TinyTeach, sourced from env / .env."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
        populate_by_name=True,
    )

    # ---- Embedding --------------------------------------------------------
    embedding_model: str = Field(default="sentence-transformers/all-MiniLM-L6-v2")
    embedding_device: Literal["cpu", "cuda", "mps"] = Field(default="cpu")
    embedding_batch_size: int = Field(default=32, ge=1, le=512)

    # ---- Chunking ---------------------------------------------------------
    chunk_size: int = Field(default=800, ge=64, le=4096)
    chunk_overlap: int = Field(default=120, ge=0, le=1024)

    # ---- Retrieval --------------------------------------------------------
    retrieval_top_k: int = Field(default=8, ge=1, le=50)
    retrieval_min_score: float = Field(default=0.25, ge=C.MIN_SCORE_FLOOR, le=C.MIN_SCORE_CEILING)

    # ---- LLM --------------------------------------------------------------
    llm_provider: Literal["hf_inference", "hf_local", "groq", "ollama", "demo"] = Field(
        default="hf_inference"
    )
    llm_model: str = Field(default="mistralai/Mistral-7B-Instruct-v0.3", min_length=1)
    llm_temperature: float = Field(default=0.3, ge=0.0, le=2.0)
    llm_max_tokens: int = Field(default=1800, ge=64, le=8192)
    llm_api_token: str = Field(default="")

    # Provider-specific credentials and endpoints. Read from env so the
    # same Settings class works regardless of which provider is in use.
    # Aliases: HF_TOKEN / GROQ_API_TOKEN / OLLAMA_HOST can be set in the
    # environment OR via Space secrets.
    huggingface_token: str = Field(default="", validation_alias="HF_TOKEN")
    groq_api_token: str = Field(default="", validation_alias="GROQ_API_TOKEN")
    ollama_host: str = Field(default="http://localhost:11434", validation_alias="OLLAMA_HOST")

    # Free-tier retry budgets (per the §8.1 rate-limit table).
    llm_request_timeout_s: float = Field(default=60.0, ge=0.1, le=300.0)
    llm_max_retries: int = Field(default=3, ge=0, le=10)
    # Lower bound is 0 (not 0.1) so tests can use 0 for instant retry.
    llm_retry_initial_backoff_s: float = Field(default=2.0, ge=0.0, le=60.0)
    llm_retry_max_backoff_s: float = Field(default=60.0, ge=0.0, le=600.0)

    # ---- Prompt -----------------------------------------------------------
    prompt_language: Literal["python", "java", "cpp", "rust", "generic"] = Field(default="python")
    prompt_version: str = Field(default=C.DEFAULT_PROMPT_VERSION)

    # ---- App --------------------------------------------------------------
    app_data_dir: Path = Field(default=Path("./data"))
    app_log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = Field(default="INFO")
    app_log_retention_days: int = Field(default=14, ge=1, le=365)

    # ---- Generation guards ------------------------------------------------
    gen_max_retries: int = Field(default=2, ge=0, le=10)
    gen_deterministic: bool = Field(default=False)

    # --- begin: env-overrides for LLM credentials --------------------------
    # Tokens may live in HF_TOKEN / GROQ_API_TOKEN / OLLAMA_HOST instead of
    # LLM_API_TOKEN. We surface the right one via properties so callers do
    # not need to know which env var is set.
    @property
    def effective_api_token(self) -> str:
        """Return the token relevant to ``llm_provider``.

        Order of precedence per provider:
        - ``hf_inference``: ``llm_api_token`` OR ``huggingface_token``
        - ``groq``: ``groq_api_token`` (falls back to ``llm_api_token``)
        - ``hf_local`` / ``ollama``: empty string (no auth needed locally)
        """
        if self.llm_provider == "hf_inference":
            return self.huggingface_token or self.llm_api_token
        if self.llm_provider == "groq":
            return self.groq_api_token or self.llm_api_token
        return ""

    # --- end: env-overrides -----------------------------------------------

    # --- begin: cross-field validation -------------------------------------
    @field_validator("chunk_overlap")
    @classmethod
    def _overlap_must_be_smaller_than_chunk(cls, v: int, info) -> int:
        chunk_size = info.data.get("chunk_size")
        if chunk_size is not None and v >= chunk_size:
            raise ValueError(
                f"chunk_overlap ({v}) must be strictly less than chunk_size ({chunk_size})."
            )
        return v

    # --- end: cross-field validation --------------------------------------

    # --- begin: derived paths ---------------------------------------------
    @property
    def uploads_dir(self) -> Path:
        return self.app_data_dir / C.DATA_DIR_UPLOADS

    @property
    def indices_dir(self) -> Path:
        return self.app_data_dir / C.DATA_DIR_INDICES

    @property
    def logs_dir(self) -> Path:
        return self.app_data_dir / C.DATA_DIR_LOGS

    @property
    def effective_temperature(self) -> float:
        """When ``gen_deterministic`` is set, force ``temperature=0``."""
        return 0.0 if self.gen_deterministic else self.llm_temperature

    # --- end: derived paths -----------------------------------------------

    # --- begin: directory bootstrap ---------------------------------------
    def ensure_data_dirs(self) -> None:
        """Create uploads / indices / logs subdirectories if missing.

        Idempotent. Safe to call on every app start.
        """
        for sub in (self.uploads_dir, self.indices_dir, self.logs_dir):
            sub.mkdir(parents=True, exist_ok=True)

    # --- end: directory bootstrap -----------------------------------------
