"""Tests for ``GenerationFacade``."""

from __future__ import annotations

import json

import pytest
from src.config.settings import Settings
from src.domain.errors import (
    GenerationSchemaError,
    ProviderUnavailableError,
    TopicNotInBookError,
)
from src.generation.generator import GenerationFacade
from src.generation.prompts.builder import PromptBuilder
from src.generation.prompts.languages.python import PythonLanguagePrompt
from src.generation.providers.base import LLMProvider


# --- begin: fakes ---------------------------------------------------------
class FakeLLM(LLMProvider):
    """Yields scripted responses in order; raises on exhaustion."""

    def __init__(self, scripts: list[str | Exception]) -> None:
        self._scripts = list(scripts)
        self.calls: list[tuple[str, str]] = []

    @property
    def name(self) -> str:
        return "fake"

    def is_available(self) -> bool:
        return True

    def generate(self, system: str, user: str) -> str:
        self.calls.append((system, user))
        if not self._scripts:
            raise RuntimeError("FakeLLM ran out of scripted responses.")
        nxt = self._scripts.pop(0)
        if isinstance(nxt, Exception):
            raise nxt
        return nxt


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
                }
            ],
        }
    )


def _bad_no_analogy() -> str:
    bad = json.loads(_good_study_set_json())
    bad["case_studies"][0].pop("real_world_analogy")
    return json.dumps(bad)


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


@pytest.fixture()
def facade() -> GenerationFacade:
    s = Settings(gen_max_retries=2)
    builder = PromptBuilder(PythonLanguagePrompt())
    llm = FakeLLM([_good_study_set_json()])  # default: succeed first try
    return GenerationFacade(settings=s, llm=llm, prompt_builder=builder)


# --- end: fakes -----------------------------------------------------------


# --- begin: happy-path ---------------------------------------------------
def test_generate_case_studies_returns_case_study_set(facade: GenerationFacade) -> None:
    out = facade.generate_case_studies(
        topic="decorators", book_id="b1", top_k=4, context_chunks=["chunk-1"]
    )
    assert out.topic == "decorators"
    assert len(out.studies) == 1


def test_generate_case_studies_calls_llm_with_system_and_user(
    facade: GenerationFacade,
) -> None:
    facade.generate_case_studies(topic="decorators", book_id="b1", top_k=4, context_chunks=["X"])
    # The LLM got one call, with our system + user.
    assert len(facade._llm.calls) == 1  # type: ignore[attr-defined]
    sys_msg, user_msg = facade._llm.calls[0]  # type: ignore[attr-defined]
    assert "TinyTeach" in sys_msg
    assert "decorators" in user_msg
    assert "b1" in user_msg


# --- end: happy-path -----------------------------------------------------


# --- begin: schema-retry -------------------------------------------------
def test_schema_retry_succeeds_on_second_attempt() -> None:
    """First call bad, second good → facade returns the good set."""
    s = Settings(gen_max_retries=2)
    builder = PromptBuilder(PythonLanguagePrompt())
    llm = FakeLLM([_bad_no_analogy(), _good_study_set_json()])
    facade = GenerationFacade(settings=s, llm=llm, prompt_builder=builder)

    out = facade.generate_case_studies(
        topic="decorators", book_id="b1", top_k=4, context_chunks=["X"]
    )
    assert out.topic == "decorators"
    # Two LLM calls happened.
    assert len(llm.calls) == 2
    # The SECOND user message contains a "previous attempt failed" hint.
    _, user2 = llm.calls[1]
    assert "previous response failed" in user2.lower()


def test_schema_retry_exhausted_raises() -> None:
    """All attempts bad → ``GenerationSchemaError`` after retries are used up."""
    s = Settings(gen_max_retries=1)  # two attempts total
    builder = PromptBuilder(PythonLanguagePrompt())
    llm = FakeLLM([_bad_no_analogy(), _bad_no_analogy()])
    facade = GenerationFacade(settings=s, llm=llm, prompt_builder=builder)

    with pytest.raises(GenerationSchemaError) as exc:
        facade.generate_case_studies(
            topic="decorators", book_id="b1", top_k=4, context_chunks=["X"]
        )
    assert "exhausted" in str(exc.value).lower()


def test_schema_retry_zero_attempts_still_runs_once() -> None:
    """``gen_max_retries=0`` means one attempt total, not zero."""
    s = Settings(gen_max_retries=0)
    builder = PromptBuilder(PythonLanguagePrompt())
    llm = FakeLLM([_good_study_set_json()])
    facade = GenerationFacade(settings=s, llm=llm, prompt_builder=builder)
    out = facade.generate_case_studies(
        topic="decorators", book_id="b1", top_k=4, context_chunks=["X"]
    )
    assert out.topic == "decorators"


# --- end: schema-retry --------------------------------------------------


# --- begin: sentinel-and-error-propagation -------------------------------
def test_topic_not_in_book_bubbles_up() -> None:
    """``TopicNotInBookError`` is NEVER retried (I-9) — propagates immediately."""
    s = Settings(gen_max_retries=2)
    builder = PromptBuilder(PythonLanguagePrompt())
    llm = FakeLLM(["TOPIC_NOT_IN_BOOK"])
    facade = GenerationFacade(settings=s, llm=llm, prompt_builder=builder)
    with pytest.raises(TopicNotInBookError):
        facade.generate_case_studies(topic="biology", book_id="b1", top_k=4, context_chunks=[])
    # Only one LLM call — no retry on the sentinel.
    assert len(llm.calls) == 1


def test_provider_unavailable_bubbles_up() -> None:
    """A transport-level failure (already retried by decorator) propagates."""
    s = Settings(gen_max_retries=1)
    builder = PromptBuilder(PythonLanguagePrompt())
    llm = FakeLLM([ProviderUnavailableError("down")])
    facade = GenerationFacade(settings=s, llm=llm, prompt_builder=builder)
    with pytest.raises(ProviderUnavailableError):
        facade.generate_case_studies(topic="x", book_id="b1", top_k=4, context_chunks=[])


# --- end: sentinel-and-error-propagation --------------------------------


# --- begin: roadmap-generation -------------------------------------------
def test_generate_roadmap_happy_path() -> None:
    s = Settings(gen_max_retries=1)
    builder = PromptBuilder(PythonLanguagePrompt())
    llm = FakeLLM([_good_roadmap_json()])
    facade = GenerationFacade(settings=s, llm=llm, prompt_builder=builder)
    from src.domain.case_study import CaseStudy, CaseStudySet, Difficulty

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
    out = facade.generate_roadmap(topic="decorators", book_id="b1", case_study_set=css)
    assert out.estimated_hours == 8
    assert len(out.milestones) == 1


def test_generate_roadmap_out_of_range_index_raises() -> None:
    s = Settings(gen_max_retries=0)
    builder = PromptBuilder(PythonLanguagePrompt())
    # The roadmap references case_study_index=99, but n_case_studies=1.
    bad = json.loads(_good_roadmap_json())
    bad["milestones"][0]["case_study_index"] = 99
    llm = FakeLLM([json.dumps(bad)])
    facade = GenerationFacade(settings=s, llm=llm, prompt_builder=builder)
    from src.domain.case_study import CaseStudy, CaseStudySet, Difficulty

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
    with pytest.raises(GenerationSchemaError):
        facade.generate_roadmap(topic="decorators", book_id="b1", case_study_set=css)


# --- end: roadmap-generation --------------------------------------------
