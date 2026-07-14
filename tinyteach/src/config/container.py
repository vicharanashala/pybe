"""Dependency-injection container (Service Locator).

DIP-justification: high-level services depend on the abstractions exported
here (``get_settings``, ``get_embedder``, ``get_pipeline`` …), never on
the concrete classes. Tests override the accessors to inject fakes. The
container is itself a singleton — its built objects are cached.

``get_*`` accessors are lazy so import-time is cheap; nothing in this
module is constructed until first call.
"""

from __future__ import annotations

from functools import lru_cache

from src.config.settings import Settings
from src.generation.generator import GenerationFacade
from src.generation.prompts.builder import PromptBuilder
from src.generation.prompts.registry import PromptRegistry
from src.generation.providers.base import LLMProvider
from src.generation.providers.factory import LLMProviderFactory
from src.ingestion.chunkers.base import Chunker
from src.ingestion.chunkers.recursive_chunker import RecursiveChunker
from src.ingestion.embedders.base import Embedder
from src.ingestion.embedders.sentence_transformer_embedder import (
    SentenceTransformerEmbedder,
)
from src.ingestion.indexers.base import Indexer
from src.ingestion.indexers.faiss_indexer import FaissIndexer
from src.ingestion.parsers.base import PDFParser
from src.ingestion.parsers.pymupdf_parser import PyMuPDFParser
from src.ingestion.pipeline import IngestionPipeline
from src.retrieval.retriever import Retriever
from src.retrieval.vector_store import VectorStoreRepository
from src.teaching.case_study_service import CaseStudyService
from src.teaching.roadmap_service import RoadmapService
from src.teaching.teaching_service import TeachingService


# --- begin: settings accessor ---------------------------------------------
# ``lru_cache`` gives us one ``Settings`` instance per process. Tests that
# need a clean instance pass ``cache_clear()`` in a fixture.
@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return the process-wide ``Settings`` instance (lazy, cached)."""
    return Settings()


def reset_settings_cache() -> None:
    """Drop the cached ``Settings`` — used by tests after mutating the env."""
    get_settings.cache_clear()


# --- end: settings accessor -----------------------------------------------


# --- begin: ingest-stage singletons (Phase 1) -----------------------------
@lru_cache(maxsize=1)
def get_parser() -> PDFParser:
    """Concrete ``PDFParser`` for the project — PyMuPDF.

    Cached: parsing strategies are stateless, so one instance is enough.
    """
    return PyMuPDFParser()


@lru_cache(maxsize=1)
def get_chunker() -> Chunker:
    """Concrete ``Chunker`` for the project — RecursiveCharacterTextSplitter."""
    return RecursiveChunker(get_settings())


@lru_cache(maxsize=1)
def get_embedder() -> Embedder:
    """Concrete ``Embedder`` for the project — sentence-transformers.

    The model is ~80-300 MB and takes 1-2 s to load on first call; the
    SentenceTransformerEmbedder handles that internally and we cache
    the wrapping object here.
    """
    return SentenceTransformerEmbedder(get_settings())


# --- end: ingest-stage singletons (Phase 1) ------------------------------


# --- begin: factories ------------------------------------------------------
def make_indexer(dim: int) -> Indexer:
    """Factory for an empty ``Indexer`` of the given ``dim``.

    Not cached (each call produces a fresh index) — the pipeline
    constructs one per ingestion.
    """
    return FaissIndexer(dim=dim)


# --- end: factories --------------------------------------------------------


# --- begin: pipeline singleton (Phase 1) ----------------------------------
@lru_cache(maxsize=1)
def get_pipeline() -> IngestionPipeline:
    """Build the default ``IngestionPipeline`` from the singletons above."""
    return IngestionPipeline(
        settings=get_settings(),
        parser=get_parser(),
        chunker=get_chunker(),
        embedder=get_embedder(),
        indexer_factory=make_indexer,
    )


def reset_ingestion_cache() -> None:
    """Drop the cached parser / chunker / embedder / pipeline.

    Tests that mutate ``Settings`` (e.g. ``embedding_model``) call this
    so the next access picks up the change.
    """
    get_parser.cache_clear()
    get_chunker.cache_clear()
    get_embedder.cache_clear()
    get_pipeline.cache_clear()


# --- end: pipeline singleton (Phase 1) ------------------------------------


# --- begin: retrieval singletons (Phase 2) --------------------------------
@lru_cache(maxsize=1)
def get_vector_store() -> VectorStoreRepository:
    """Process-wide ``VectorStoreRepository``.

    A single repo instance handles LRU-book caching for ALL books
    (not one repo per book_id), so the cache budget is shared globally.
    """
    return VectorStoreRepository(
        settings=get_settings(),
        indexer_cls=FaissIndexer,
    )


@lru_cache(maxsize=1)
def get_retriever() -> Retriever:
    """Process-wide ``Retriever`` wired to the embedder + vector_store."""
    return Retriever(
        settings=get_settings(),
        embedder=get_embedder(),
        vector_store=get_vector_store(),
    )


def reset_retrieval_cache() -> None:
    """Drop the cached vector_store and retriever.

    Tests that mutate the embedder / vector_store classes call this
    so the next access re-builds with the change.
    """
    get_vector_store.cache_clear()
    get_retriever.cache_clear()


# --- end: retrieval singletons (Phase 2) ----------------------------------


# --- begin: llm-provider-singleton (Phase 3) -------------------------------
@lru_cache(maxsize=1)
def get_llm_provider() -> LLMProvider:
    """Process-wide ``LLMProvider`` (decorated with cache + retry + logging).

    Built via the factory, which honours ``settings.llm_provider`` and
    falls back to the next-available provider if the chosen one is down.
    """
    return LLMProviderFactory.from_settings(get_settings())


def reset_llm_cache() -> None:
    """Drop the cached LLM provider (and the in-memory response cache)."""
    get_llm_provider.cache_clear()


# --- end: llm-provider-singleton (Phase 3) --------------------------------


# --- begin: prompt-singletons (Phase 4) -----------------------------------
def make_prompt_builder() -> PromptBuilder:
    """Build a ``PromptBuilder`` for the configured language + version.

    Not cached — every call resolves the registry fresh so a config
    change in the next test picks up the new value.
    """
    settings = get_settings()
    prompt = PromptRegistry.resolve(settings.prompt_language, settings.prompt_version)
    return PromptBuilder(prompt)


@lru_cache(maxsize=1)
def get_prompt_registry() -> PromptRegistry:
    """Process-wide ``PromptRegistry`` (used for diagnostics only)."""
    return PromptRegistry()


def reset_prompt_cache() -> None:
    """Drop the cached registry (currently no-op — builders are uncached)."""
    get_prompt_registry.cache_clear()


# --- end: prompt-singletons (Phase 4) ------------------------------------


# --- begin: generation-facade (Phase 5) -----------------------------------
def make_generation_facade() -> GenerationFacade:
    """Build a ``GenerationFacade`` with current settings + LLM + prompt builder."""
    return GenerationFacade(
        settings=get_settings(),
        llm=get_llm_provider(),
        prompt_builder=make_prompt_builder(),
    )


# --- end: generation-facade (Phase 5) ------------------------------------


# --- begin: teaching-services (Phase 5) -----------------------------------
def make_case_study_service() -> CaseStudyService:
    """Build a ``CaseStudyService`` (retriever + facade)."""
    return CaseStudyService(
        settings=get_settings(),
        retriever=get_retriever(),
        generator=make_generation_facade(),
    )


def make_roadmap_service() -> RoadmapService:
    """Build a ``RoadmapService`` (facade only)."""
    return RoadmapService(generator=make_generation_facade())


@lru_cache(maxsize=1)
def get_teaching_service() -> TeachingService:
    """Process-wide ``TeachingService``. The single entry point for the UI."""
    return TeachingService(
        case_study_service=make_case_study_service(),
        roadmap_service=make_roadmap_service(),
    )


def reset_teaching_cache() -> None:
    """Drop the cached teaching service (also resets the LLM prompt cache)."""
    get_teaching_service.cache_clear()
    reset_llm_cache()


# --- end: teaching-services (Phase 5) ------------------------------------


# --- begin: future slots --------------------------------------------------
# Phase 6 will add: UI components.
# Keeping this module as the single wiring point enforces the rule that
# nothing else in src/ reaches for ``Settings()`` directly.
# --- end: future slots ----------------------------------------------------
