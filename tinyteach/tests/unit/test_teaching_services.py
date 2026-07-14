"""Tests for the teaching services (case-study, roadmap, teaching)."""

from __future__ import annotations

import json
from typing import Any

import pytest
from src.config.settings import Settings
from src.domain.case_study import CaseStudy, CaseStudySet, Difficulty
from src.domain.chunk import Chunk, RetrievedChunk
from src.domain.errors import TopicNotInBookError
from src.domain.roadmap import Roadmap
from src.teaching.case_study_service import CaseStudyService
from src.teaching.roadmap_service import RoadmapService
from src.teaching.teaching_service import TeachingResult, TeachingService


# --- begin: fixtures-and-helpers -----------------------------------------
def _make_chunk(text: str, page: int = 1) -> RetrievedChunk:
    return RetrievedChunk(
        chunk=Chunk(book_id="b1", text=text, page_start=page, page_end=page, ordinal=0),
        score=0.9,
    )


def _good_study_set_json(topic: str = "decorators") -> str:
    return json.dumps(
        {
            "topic": topic,
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
                }
            ],
        }
    )


def _good_roadmap_json() -> str:
    return json.dumps(
        {
            "topic": "decorators",
            "estimated_hours": 8,
            "milestones": [
                {
                    "name": "Grasp the idea",
                    "description": "Read the first case study.",
                    "case_study_index": 0,
                    "success_criteria": ["can write a decorator"],
                }
            ],
        }
    )


class FakeRetriever:
    def __init__(self, retrieved: list[RetrievedChunk] | None = None) -> None:
        # ``None`` -> default; ``[]`` -> explicitly empty. We can't use
        # ``or`` because ``[]`` is falsy and would revert to default.
        if retrieved is None:
            self._retrieved = [_make_chunk("Some content about decorators.")]
        else:
            self._retrieved = list(retrieved)
        self.calls: list[tuple[str, str]] = []

    def retrieve(self, query: str, *, book_id: str) -> list[RetrievedChunk]:
        self.calls.append((query, book_id))
        return list(self._retrieved)


class FakeGenerator:
    def __init__(
        self,
        case_study_response: str | Exception = "",
        roadmap_response: str | Exception = "",
    ) -> None:
        self._cs = case_study_response or _good_study_set_json()
        self._rm = roadmap_response or _good_roadmap_json()
        self.cs_calls: list[dict[str, Any]] = []
        self.rm_calls: list[dict[str, Any]] = []

    def generate_case_studies(self, **kwargs: Any) -> CaseStudySet:
        self.cs_calls.append(kwargs)
        if isinstance(self._cs, Exception):
            raise self._cs
        # Re-import here to avoid module cycles in tooling.
        from src.generation.validator import validate_case_studies

        return validate_case_studies(self._cs, topic=kwargs["topic"], book_id=kwargs["book_id"])

    def generate_roadmap(self, **kwargs: Any) -> Roadmap:
        self.rm_calls.append(kwargs)
        if isinstance(self._rm, Exception):
            raise self._rm
        from src.generation.validator import validate_roadmap

        return validate_roadmap(
            self._rm,
            topic=kwargs["topic"],
            book_id=kwargs["book_id"],
            n_case_studies=len(kwargs["case_study_set"].studies),
        )


@pytest.fixture()
def settings() -> Settings:
    return Settings(retrieval_top_k=4, retrieval_min_score=0.1, gen_max_retries=1)


@pytest.fixture()
def case_study_service(settings: Settings) -> CaseStudyService:
    return CaseStudyService(
        settings=settings,
        retriever=FakeRetriever(),
        generator=FakeGenerator(),  # type: ignore[arg-type]
    )


@pytest.fixture()
def roadmap_service() -> RoadmapService:
    return RoadmapService(generator=FakeGenerator())  # type: ignore[arg-type]


@pytest.fixture()
def teaching_service(
    case_study_service: CaseStudyService, roadmap_service: RoadmapService
) -> TeachingService:
    return TeachingService(
        case_study_service=case_study_service,
        roadmap_service=roadmap_service,
    )


# --- end: fixtures-and-helpers -------------------------------------------


# --- begin: case-study-service -------------------------------------------
def test_case_study_service_happy_path(case_study_service: CaseStudyService) -> None:
    out = case_study_service.generate_for_topic(topic="decorators", book_id="b1")
    assert isinstance(out, CaseStudySet)
    assert out.topic == "decorators"
    assert len(out.studies) == 1


def test_case_study_service_no_retrieval_raises_topic_not_in_book(
    settings: Settings,
) -> None:
    """Empty retrieval → ``TopicNotInBookError`` (I-9)."""
    svc = CaseStudyService(
        settings=settings,
        retriever=FakeRetriever(retrieved=[]),
        generator=FakeGenerator(),  # type: ignore[arg-type]
    )
    with pytest.raises(TopicNotInBookError):
        svc.generate_for_topic(topic="biology", book_id="b1")


def test_case_study_service_passes_top_k_to_generator(
    case_study_service: CaseStudyService,
) -> None:
    case_study_service.generate_for_topic(topic="decorators", book_id="b1")
    # The FakeGenerator recorded the kwargs.
    gen = case_study_service._generator  # type: ignore[attr-defined]
    assert gen.cs_calls[0]["top_k"] == 4  # from the settings fixture


def test_case_study_service_propagates_correlation_id(
    case_study_service: CaseStudyService,
) -> None:
    """While the service runs, a correlation id is active in the ContextVar.

    Verified by checking from inside the (Fake)Generator — the service
    runs inside a ``with_correlation_id()`` block, so when the generator
    is invoked, the corr-id is set.
    """
    from src.observability.correlation import get_correlation_id

    captured: dict[str, str] = {}

    # We call the original via the saved reference (NOT via the class
    # attribute, which has been replaced with the spy — that would
    # recurse forever).
    original_generate = case_study_service._generator.generate_case_studies  # type: ignore[attr-defined]

    def spy(**kwargs: Any) -> Any:  # noqa: ANN401
        captured["cid"] = get_correlation_id()
        return original_generate(**kwargs)

    case_study_service._generator.generate_case_studies = spy  # type: ignore[attr-defined,method-assign]
    try:
        case_study_service.generate_for_topic(topic="decorators", book_id="b1")
    finally:
        case_study_service._generator.generate_case_studies = original_generate  # type: ignore[attr-defined,method-assign]

    assert captured.get("cid"), "correlation id should have been set when generator was called"
    assert len(captured["cid"]) > 0


# --- end: case-study-service --------------------------------------------


# --- begin: roadmap-service ----------------------------------------------
def test_roadmap_service_happy_path(roadmap_service: RoadmapService) -> None:
    css = CaseStudySet(
        topic="decorators",
        book_id="b1",
        studies=[
            CaseStudy(
                title="t",
                concept="c",
                difficulty=Difficulty.NOVICE,
                scenario="s",
                task="k",
                starter_code="def f(): pass",  # non-empty so the schema guard passes
                expected_output="",
                real_world_analogy="a",
                fun_fact="f",
                hints=["h"],
                learning_objective="l",
            )
        ],
    )
    out = roadmap_service.generate_for_topic(topic="decorators", book_id="b1", case_study_set=css)
    assert isinstance(out, Roadmap)


# --- end: roadmap-service -----------------------------------------------


# --- begin: teaching-service --------------------------------------------
def test_teaching_service_happy_path_returns_teaching_result(
    teaching_service: TeachingService,
) -> None:
    out = teaching_service.teach(topic="decorators", book_id="b1")
    assert isinstance(out, TeachingResult)
    assert out.status == "ok"
    assert out.case_studies is not None and len(out.case_studies.studies) >= 1
    assert out.roadmap is not None
    assert out.message is None


def test_teaching_service_topic_not_in_book_returns_structured(
    settings: Settings,
) -> None:
    """``TopicNotInBookError`` is mapped to a structured result (I-9)."""
    css = CaseStudyService(
        settings=settings,
        retriever=FakeRetriever(retrieved=[]),
        generator=FakeGenerator(),  # type: ignore[arg-type]
    )
    rms = RoadmapService(generator=FakeGenerator())  # type: ignore[arg-type]
    ts = TeachingService(case_study_service=css, roadmap_service=rms)

    out = ts.teach(topic="biology", book_id="b1")
    assert out.status == "topic_not_in_book"
    assert out.case_studies is None
    assert out.roadmap is None
    assert "biology" in (out.message or "")


def test_teaching_service_propagates_other_errors(settings: Settings) -> None:
    """A non-I-9 error (e.g. provider down) DOES propagate."""
    css = CaseStudyService(
        settings=settings,
        retriever=FakeRetriever(),
        generator=FakeGenerator(
            case_study_response=Exception("down"),  # type: ignore[arg-type]
        ),
    )
    rms = RoadmapService(generator=FakeGenerator())  # type: ignore[arg-type]
    ts = TeachingService(case_study_service=css, roadmap_service=rms)

    with pytest.raises(Exception, match="down"):
        ts.teach(topic="x", book_id="b1")


def test_teaching_result_to_dict_serialises_neatly(
    teaching_service: TeachingService,
) -> None:
    out = teaching_service.teach(topic="decorators", book_id="b1")
    d = out.to_dict()
    assert d["status"] == "ok"
    assert d["topic"] == "decorators"
    assert d["book_id"] == "b1"
    assert "case_studies" in d and "roadmap" in d
    # Round-trip via JSON to confirm everything is serialisable.
    json.dumps(d)


def test_teaching_result_to_dict_for_not_in_book(
    settings: Settings,
) -> None:
    css = CaseStudyService(
        settings=settings,
        retriever=FakeRetriever(retrieved=[]),
        generator=FakeGenerator(),  # type: ignore[arg-type]
    )
    rms = RoadmapService(generator=FakeGenerator())  # type: ignore[arg-type]
    ts = TeachingService(case_study_service=css, roadmap_service=rms)

    out = ts.teach(topic="biology", book_id="b1")
    d = out.to_dict()
    assert d["status"] == "topic_not_in_book"
    assert "case_studies" not in d
    assert "roadmap" not in d
    assert "biology" in d["message"]


# --- end: teaching-service --------------------------------------------
