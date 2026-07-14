"""Tests for the language-prompt classes."""

from __future__ import annotations

from src.generation.prompts.languages.cpp import CppLanguagePrompt
from src.generation.prompts.languages.generic import GenericLanguagePrompt
from src.generation.prompts.languages.java import JavaLanguagePrompt
from src.generation.prompts.languages.python import PythonLanguagePrompt


# --- begin: language-name -----------------------------------------------
def test_python_name() -> None:
    assert PythonLanguagePrompt().language_name == "python"


def test_java_name() -> None:
    assert JavaLanguagePrompt().language_name == "java"


def test_cpp_name() -> None:
    assert CppLanguagePrompt().language_name == "cpp"


def test_generic_name() -> None:
    assert GenericLanguagePrompt().language_name == "generic"


# --- end: language-name ------------------------------------------------


# --- begin: locked-content --------------------------------------------
def test_python_system_contains_top_not_in_book_token() -> None:
    p = PythonLanguagePrompt()
    assert "TOPIC_NOT_IN_BOOK" in p.case_study_system_block()


def test_python_system_contains_real_world_analogy_rule() -> None:
    """Invariant I-3 — the system prompt must enforce the rule."""
    p = PythonLanguagePrompt()
    assert "real_world_analogy" in p.case_study_system_block()


def test_python_system_contains_fun_fact_rule() -> None:
    """Invariant I-4."""
    p = PythonLanguagePrompt()
    assert "fun_fact" in p.case_study_system_block()


def test_python_system_contains_progressive_difficulty_rule() -> None:
    """Invariant I-5."""
    p = PythonLanguagePrompt()
    assert "novice" in p.case_study_system_block().lower()
    assert "intermediate" in p.case_study_system_block().lower()
    assert "advanced" in p.case_study_system_block().lower()


def test_python_system_contains_no_fence_rule() -> None:
    """Per blueprint §12.1 patch — explicit no-fences rule."""
    p = PythonLanguagePrompt()
    assert "```" in p.case_study_system_block()


def test_python_user_template_has_required_placeholders() -> None:
    p = PythonLanguagePrompt()
    tpl = p.case_study_user_template()
    for var in ("$topic", "$language", "$book_id", "$top_k", "$context_chunks"):
        assert var in tpl, f"missing placeholder {var}"


def test_roadmap_system_includes_sentinel() -> None:
    p = PythonLanguagePrompt()
    assert "TOPIC_NOT_IN_BOOK" in p.roadmap_system_block()


def test_roadmap_user_template_has_required_placeholders() -> None:
    p = PythonLanguagePrompt()
    tpl = p.roadmap_user_template()
    assert "$topic" in tpl
    assert "$case_studies_json" in tpl


# --- end: locked-content ---------------------------------------------


# --- begin: java-and-cpp-delegate -------------------------------------
def test_java_delegates_to_generic_content() -> None:
    j = JavaLanguagePrompt()
    g = GenericLanguagePrompt()
    assert j.case_study_system_block() == g.case_study_system_block()


def test_cpp_delegates_to_generic_content() -> None:
    c = CppLanguagePrompt()
    g = GenericLanguagePrompt()
    assert c.case_study_system_block() == g.case_study_system_block()


# --- end: java-and-cpp-delegate --------------------------------------
