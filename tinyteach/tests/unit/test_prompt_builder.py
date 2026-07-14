"""Tests for ``PromptBuilder``."""

from __future__ import annotations

import pytest
from src.generation.prompts.builder import PromptBuilder
from src.generation.prompts.languages.generic import GenericLanguagePrompt
from src.generation.prompts.languages.python import PythonLanguagePrompt


# --- begin: setup --------------------------------------------------------
@pytest.fixture()
def python_builder() -> PromptBuilder:
    return PromptBuilder(PythonLanguagePrompt())


@pytest.fixture()
def generic_builder() -> PromptBuilder:
    return PromptBuilder(GenericLanguagePrompt())


# --- end: setup ---------------------------------------------------------


# --- begin: case-study-prompt --------------------------------------------
def test_case_study_system_includes_locked_rules(python_builder: PromptBuilder) -> None:
    """Sanity-check that the locked content from §12.1 is still present."""
    system, _user = python_builder.build_case_study_prompt(
        topic="decorators",
        book_id="b1",
        top_k=8,
        context_chunks=["page 1", "page 2"],
    )
    assert "TOPIC_NOT_IN_BOOK" in system
    assert "real_world_analogy" in system
    assert "fun_fact" in system


def test_case_study_user_template_substitutes(python_builder: PromptBuilder) -> None:
    """All ``string.Template`` variables in the USER message get filled in."""
    _, user = python_builder.build_case_study_prompt(
        topic="decorators",
        book_id="b1",
        top_k=8,
        context_chunks=["CHUNK_A", "CHUNK_B"],
    )
    assert "decorators" in user
    assert "b1" in user
    assert "CHUNK_A" in user
    assert "CHUNK_B" in user
    assert "top-K=8" in user


def test_case_study_user_starts_with_few_shot_anchor(
    python_builder: PromptBuilder,
) -> None:
    """The few-shot anchor must be prepended to the USER message."""
    _, user = python_builder.build_case_study_prompt(
        topic="x",
        book_id="b1",
        top_k=4,
        context_chunks=["c"],
    )
    few_shot_marker = "Example of a pass-grade case study"
    assert user.startswith(few_shot_marker)


def test_case_study_prompt_empty_chunks(python_builder: PromptBuilder) -> None:
    """No chunks is allowed; ``context_chunks`` joins to an empty string."""
    _, user = python_builder.build_case_study_prompt(
        topic="x", book_id="b1", top_k=4, context_chunks=[]
    )
    assert "BEGIN BOOK CONTEXT" in user
    assert "END BOOK CONTEXT" in user


# --- end: case-study-prompt ---------------------------------------------


# --- begin: roadmap-prompt ----------------------------------------------
def test_roadmap_prompt_substitutes(generic_builder: PromptBuilder) -> None:
    """Roadmap templates substitute ``topic`` and ``case_studies_json``."""
    system, user = generic_builder.build_roadmap_prompt(
        topic="decorators",
        case_studies_json='[{"title": "x"}]',
    )
    assert "decorators" in user
    assert '[{"title": "x"}]' in user
    # Generic and python share the same system message, so this works
    # for both.
    assert "STRICT JSON" in system


def test_roadmap_system_includes_locked_rules(python_builder: PromptBuilder) -> None:
    system, _ = python_builder.build_roadmap_prompt(topic="x", case_studies_json="[]")
    assert "TOPIC_NOT_IN_BOOK" in system
    assert "STRICT JSON" in system


# --- end: roadmap-prompt -----------------------------------------------


# --- begin: language-affects-content -----------------------------------
def test_python_and_generic_share_core_content() -> None:
    """The two should produce identical system blocks (only language_name differs)."""
    pb = PromptBuilder(PythonLanguagePrompt())
    gb = PromptBuilder(GenericLanguagePrompt())
    sys_pb, _ = pb.build_case_study_prompt(topic="x", book_id="b1", top_k=4, context_chunks=[])
    sys_gb, _ = gb.build_case_study_prompt(topic="x", book_id="b1", top_k=4, context_chunks=[])
    # Same locked content; only the language placeholder differs inside
    # the user template (substituted from ``language_name``).
    assert sys_pb == sys_gb


# --- end: language-affects-content -------------------------------------
