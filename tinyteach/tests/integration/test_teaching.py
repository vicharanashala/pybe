"""End-to-end test: ingest a PDF, then teach() with a scripted LLM.

We use the real ``IngestionPipeline`` and ``Retriever`` (so the
sentence-transformers model loads — mark ``slow``) but script the LLM
so the test is deterministic and free.
"""

from __future__ import annotations

import json
from pathlib import Path

import pytest
from src.config.container import (
    get_chunker,
    get_embedder,
    get_parser,
    make_indexer,
    reset_ingestion_cache,
    reset_retrieval_cache,
    reset_settings_cache,
    reset_teaching_cache,
)
from src.config.settings import Settings
from src.domain.book import Book, BookFingerprint
from src.generation.generator import GenerationFacade
from src.generation.prompts.builder import PromptBuilder
from src.generation.prompts.languages.python import PythonLanguagePrompt
from src.generation.providers.base import LLMProvider
from src.ingestion.pipeline import IngestionPipeline
from src.teaching.case_study_service import CaseStudyService
from src.teaching.roadmap_service import RoadmapService
from src.teaching.teaching_service import TeachingResult, TeachingService
from src.utils.hashing import sha256_file

pytestmark = [pytest.mark.integration, pytest.mark.slow]


# --- begin: scripted-llm -------------------------------------------------
class ScriptedLLM(LLMProvider):
    """Returns pre-baked JSON for any prompt.

    The first ``generate`` call returns the case-study JSON; the second
    returns the roadmap JSON. ``generate`` is called only when ``teach``
    needs an LLM (i.e. only when the topic IS in the book).
    """

    def __init__(self) -> None:
        self.calls: list[tuple[str, str]] = []
        self._scenarios: list[str] = []

    def set_scenarios(self, scenarios: list[str]) -> None:
        self._scenarios = list(scenarios)

    @property
    def name(self) -> str:
        return "scripted"

    def is_available(self) -> bool:
        return True

    def generate(self, system: str, user: str) -> str:
        self.calls.append((system, user))
        if not self._scenarios:
            return "TOPIC_NOT_IN_BOOK"
        return self._scenarios.pop(0)


def _good_study_set_json() -> str:
    return json.dumps(
        {
            "topic": "decorators",
            "case_studies": [
                {
                    "title": "The Saree Border",
                    "concept": "decorators",
                    "difficulty": "novice",
                    "scenario": "A saree gets a zari border woven onto it without unweaving.",
                    "task": "Write a @border decorator.",
                    "starter_code": "def greet(n):\n    print(n)",
                    "expected_output": "====\nhi\n====",
                    "real_world_analogy": "Zari border is woven last.",
                    "fun_fact": "@ was decided after 4 months of debate.",
                    "hints": ["A decorator returns a function."],
                    "learning_objective": "Understand higher-order functions.",
                },
                {
                    "title": "The Vending Machine Cache",
                    "concept": "stacking decorators",
                    "difficulty": "intermediate",
                    "scenario": "Layered wrappers add caching then authorisation.",
                    "task": "Stack @cache and @authenticate.",
                    "starter_code": "@cache\n@authenticate\ndef api():\n    pass",
                    "expected_output": "(auth + cache)",
                    "real_world_analogy": "Sarees get a lining added before the border.",
                    "fun_fact": "Stacking is bottom-up: bottom-most runs first.",
                    "hints": ["The closest decorator to the function runs first."],
                    "learning_objective": "Reason about decorator order.",
                },
            ],
        }
    )


def _good_roadmap_json() -> str:
    return json.dumps(
        {
            "topic": "decorators",
            "estimated_hours": 12,
            "milestones": [
                {
                    "name": "Grasp the idea",
                    "description": "Read the first case study.",
                    "case_study_index": 0,
                    "success_criteria": ["can write a decorator"],
                },
                {
                    "name": "Stack two",
                    "description": "Read the second case study.",
                    "case_study_index": 1,
                    "success_criteria": ["understand order"],
                },
            ],
        }
    )


# --- end: scripted-llm ---------------------------------------------------


# --- begin: per-test-settings + services ---------------------------------
@pytest.fixture()
def integration_settings(tmp_data_dir: Path) -> Settings:
    reset_settings_cache()
    reset_ingestion_cache()
    reset_retrieval_cache()
    reset_teaching_cache()
    s = Settings(
        app_data_dir=tmp_data_dir,
        chunk_size=400,
        chunk_overlap=80,
        retrieval_top_k=4,
        retrieval_min_score=0.1,
        gen_max_retries=1,
    )
    s.ensure_data_dirs()
    yield s
    reset_settings_cache()
    reset_ingestion_cache()
    reset_retrieval_cache()
    reset_teaching_cache()


def _build_teaching_service(integration_settings: Settings) -> TeachingService:
    """Build a TeachingService with a scripted LLM but real retriever.

    Bypasses the ``get_*`` container accessors so we can inject the
    scripted LLM and a per-test vector store.
    """
    from src.ingestion.indexers.faiss_indexer import FaissIndexer
    from src.retrieval.retriever import Retriever
    from src.retrieval.vector_store import VectorStoreRepository

    pipeline = IngestionPipeline(
        settings=integration_settings,
        parser=get_parser(),
        chunker=get_chunker(),
        embedder=get_embedder(),
        indexer_factory=make_indexer,
    )
    vector_store = VectorStoreRepository(settings=integration_settings, indexer_cls=FaissIndexer)
    retriever = Retriever(
        settings=integration_settings,
        embedder=get_embedder(),
        vector_store=vector_store,
    )

    scripted = ScriptedLLM()
    builder = PromptBuilder(PythonLanguagePrompt())
    generator = GenerationFacade(
        settings=integration_settings, llm=scripted, prompt_builder=builder
    )
    css = CaseStudyService(
        settings=integration_settings,
        retriever=retriever,
        generator=generator,
    )
    rms = RoadmapService(generator=generator)
    return TeachingService(case_study_service=css, roadmap_service=rms), pipeline, scripted


def _make_book(pdf_path: Path) -> Book:
    return Book(
        fingerprint=BookFingerprint(
            filename=pdf_path.name,
            size_bytes=pdf_path.stat().st_size,
            sha256=sha256_file(pdf_path),
        ),
        path=pdf_path,
    )


# --- end: per-test-settings + services -----------------------------------


# --- begin: happy-path-end-to-end ---------------------------------------
def test_teach_end_to_end(
    python_book_pdf: Path,
    integration_settings: Settings,
) -> None:
    """Ingest a Python PDF then teach() the 'decorators' topic."""
    ts, pipeline, scripted = _build_teaching_service(integration_settings)
    book = _make_book(python_book_pdf)

    # Step 1: ingest.
    pipeline.ingest(book)

    # Step 2: script the LLM to return valid case-studies + roadmap.
    scripted.set_scenarios([_good_study_set_json(), _good_roadmap_json()])

    # Step 3: teach.
    result = ts.teach(topic="decorators", book_id=book.book_id)

    assert isinstance(result, TeachingResult)
    assert result.status == "ok"
    assert result.case_studies is not None
    assert result.roadmap is not None
    assert result.case_studies.topic == "decorators"
    assert len(result.case_studies.studies) >= 2
    assert len(result.roadmap.milestones) >= 2
    # The scripted LLM was called exactly twice.
    assert len(scripted.calls) == 2


# --- end: happy-path-end-to-end -----------------------------------------


# --- begin: topic-not-in-book -------------------------------------------
def test_teach_topic_not_in_book_from_retriever_returns_structured(
    python_book_pdf: Path,
    integration_settings: Settings,
) -> None:
    """Retrieval-side path: an out-of-domain topic ('biology of sunflowers')
    produces a not-in-book result WITHOUT calling the LLM (efficient
    short-circuit at the retriever).
    """
    ts, pipeline, scripted = _build_teaching_service(integration_settings)
    book = _make_book(python_book_pdf)
    pipeline.ingest(book)
    # No scripted scenario — retriever will return empty.

    result = ts.teach(topic="biology of sunflowers", book_id=book.book_id)

    assert result.status == "topic_not_in_book"
    assert result.case_studies is None
    assert result.roadmap is None
    # No LLM call — the retriever's empty result short-circuits.
    assert len(scripted.calls) == 0


def test_teach_topic_not_in_book_from_llm_returns_structured(
    python_book_pdf: Path,
    integration_settings: Settings,
) -> None:
    """LLM-side path: retriever returns chunks but the LLM signals
    ``TOPIC_NOT_IN_BOOK``. The teaching service must still surface a
    structured result and call the LLM exactly once (no retry on the
    sentinel — invariant I-9).

    We use a topic with high overlap to Python content (so the retriever
    returns at least one chunk) but script the LLM to refuse.
    """
    ts, pipeline, scripted = _build_teaching_service(integration_settings)
    book = _make_book(python_book_pdf)
    pipeline.ingest(book)
    scripted.set_scenarios(["TOPIC_NOT_IN_BOOK"])

    # Use a topic the book DOES cover so retrieval returns something.
    result = ts.teach(topic="decorators", book_id=book.book_id)

    assert result.status == "topic_not_in_book"
    assert result.case_studies is None
    assert result.roadmap is None
    # Exactly one call — the sentinel is never retried.
    assert len(scripted.calls) == 1
    # The very first call returned TOPIC_NOT_IN_BOOK.
    _, user_msg = scripted.calls[0]
    assert "decorators" in user_msg


# --- end: topic-not-in-book ---------------------------------------------
