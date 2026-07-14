"""Custom exception hierarchy for TinyTeach.

SRP-justification: callers can write one ``except TinyTeachError`` and
still discriminate by subclass. The hierarchy mirrors PROJECT_BLUEPRINT
§11 exactly. Every other module raises one of these — never a bare
``Exception`` — so invariant I-18 ("failure is loud") is enforceable by
type.
"""

from __future__ import annotations


# --- begin: root -----------------------------------------------------------
class TinyTeachError(Exception):
    """Base class for every domain-level error in TinyTeach.

    A single root lets callers do ``except TinyTeachError`` at the UI
    boundary while still preserving the subclass for log diagnostics.
    """


# --- end: root -------------------------------------------------------------


# --- begin: ingestion ------------------------------------------------------
class IngestionError(TinyTeachError):
    """The PDF ingestion pipeline failed irrecoverably."""


class ParserError(IngestionError):
    """PDF parser could not read the file (corrupt, encrypted, etc.)."""


class ChunkerError(IngestionError):
    """Text splitter failed or produced no chunks from a non-empty book."""


class EmbedderError(IngestionError):
    """Embedding model failed to embed the chunks."""


class IndexerError(IngestionError):
    """FAISS index could not be saved or loaded."""


# --- end: ingestion --------------------------------------------------------


# --- begin: retrieval ------------------------------------------------------
class RetrievalError(TinyTeachError):
    """Retrieval failed for a reason other than the topic being absent."""


class IndexMissingError(RetrievalError):
    """No index exists for the requested book_id."""


class TopicNotInBookError(RetrievalError):
    """The topic could not be grounded in the book's content.

    Maps to PROJECT_BLUEPRINT invariant I-9 and the
    ``TOPIC_NOT_IN_BOOK`` sentinel.
    """


# --- end: retrieval --------------------------------------------------------


# --- begin: generation -----------------------------------------------------
class GenerationError(TinyTeachError):
    """The LLM failed to produce a usable output."""


class ProviderUnavailableError(GenerationError):
    """The chosen LLM provider is not reachable / not configured."""


class GenerationSchemaError(GenerationError):
    """The LLM output did not match the JSON schema (after retries)."""


class GenerationTimeoutError(GenerationError):
    """The LLM call exceeded the time budget."""


# --- end: generation -------------------------------------------------------


# --- begin: config ---------------------------------------------------------
class ConfigError(TinyTeachError):
    """Configuration is missing, contradictory, or otherwise unusable."""


# --- end: config -----------------------------------------------------------
