"""Project-wide constants and magic numbers.

SRP-justification: every literal that could vary across deployments, every
default path, and every well-known format string lives here. Other modules
import from this file rather than embedding literals — so a config change
happens in exactly one place.
"""

# --- filesystem layout -----------------------------------------------------
# Subdirectories created under APP_DATA_DIR on first launch.
DATA_DIR_UPLOADS = "uploads"
DATA_DIR_INDICES = "indices"
DATA_DIR_LOGS = "logs"

# --- logging ---------------------------------------------------------------
# Per-handler rotation policy (bytes, backups). Values from PROJECT_BLUEPRINT §11.
LOG_FILE_APP_BYTES = 2 * 1024 * 1024
LOG_FILE_APP_BACKUPS = 5

LOG_FILE_ERRORS_BYTES = 2 * 1024 * 1024
LOG_FILE_ERRORS_BACKUPS = 10

LOG_FILE_INGEST_BYTES = 2 * 1024 * 1024
LOG_FILE_INGEST_BACKUPS = 5

LOG_FILE_APP = "app.log"
LOG_FILE_ERRORS = "errors.log"
LOG_FILE_INGEST = "ingest.log"

# --- correlation ids -------------------------------------------------------
# 8-char hex is enough entropy for a single-user app; CI runs use a longer
# id injected by the caller.
CORRELATION_ID_LENGTH = 8

# --- generation ------------------------------------------------------------
# Topic-out-of-scope sentinel returned by the LLM when the Book Context
# cannot teach the requested topic. The validator keys off this exact string
# (PROJECT_BLUEPRINT invariant I-9).
TOPIC_NOT_IN_BOOK = "TOPIC_NOT_IN_BOOK"

# --- prompt versioning -----------------------------------------------------
DEFAULT_PROMPT_VERSION = "v1"
# SUPPORTED_LANGUAGES is documentation only — the prompt registry auto-
# discovers by scanning ``src.generation.prompts.languages``. To add a
# new language, drop a new file there; this tuple is updated to match.
SUPPORTED_LANGUAGES = ("python", "java", "cpp", "rust", "generic")
SUPPORTED_LLM_PROVIDERS = ("hf_inference", "hf_local", "groq", "ollama", "demo")

# --- retrieval defaults ----------------------------------------------------
# Floor for "this chunk is actually about the topic". Anything below is
# thrown out before reaching the prompt (invariant I-1: groundedness).
MIN_SCORE_FLOOR = 0.0
MIN_SCORE_CEILING = 1.0

# --- ingest limits ---------------------------------------------------------
# Hard safety bounds; exceeding raises IngestionError. Phase 1 reads these.
MAX_PDF_BYTES = 50 * 1024 * 1024  # 50 MB hard cap
MAX_CHUNKS_PER_BOOK = 20_000  # a 500-page book produces < 5 K
