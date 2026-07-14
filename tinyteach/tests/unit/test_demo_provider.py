"""Tests for ``DemoLLMProvider`` — Phase 8 worked-example provider."""

from __future__ import annotations

import json

from src.config.settings import Settings
from src.generation.providers.demo_provider import DemoLLMProvider


# --- begin: name-and-availability --------------------------------------
def test_name_is_demo() -> None:
    p = DemoLLMProvider()
    assert p.name == "demo"


def test_is_available_is_always_true() -> None:
    """The demo provider is always available -- that's its whole point."""
    assert DemoLLMProvider().is_available() is True


# --- end: name-and-availability ---------------------------------------


# --- begin: case-study-response ----------------------------------------
def test_generate_for_case_study_returns_valid_json() -> None:
    """The canned case-study response is valid JSON with the expected schema."""
    p = DemoLLMProvider()
    out = p.generate(system="s", user="u")
    parsed = json.loads(out)
    assert "case_studies" in parsed
    assert isinstance(parsed["case_studies"], list)
    assert len(parsed["case_studies"]) >= 1
    study = parsed["case_studies"][0]
    for field in (
        "title",
        "concept",
        "difficulty",
        "scenario",
        "task",
        "starter_code",
        "expected_output",
        "real_world_analogy",
        "fun_fact",
        "hints",
        "learning_objective",
    ):
        assert field in study, f"missing field {field!r}"


# --- end: case-study-response ------------------------------------------


# --- begin: roadmap-response -------------------------------------------
def test_generate_for_roadmap_returns_valid_json() -> None:
    """The canned roadmap response is valid JSON with the expected schema."""
    p = DemoLLMProvider()
    # The builder substitutes ``case_studies_json`` only in the roadmap
    # user template; presence in the user string is the discriminator.
    out = p.generate(system="s", user="u with case_studies_json marker")
    parsed = json.loads(out)
    assert "milestones" in parsed
    assert isinstance(parsed["milestones"], list)
    assert len(parsed["milestones"]) >= 1
    m = parsed["milestones"][0]
    for field in ("name", "description", "case_study_index", "success_criteria"):
        assert field in m, f"missing field {field!r}"


# --- end: roadmap-response ---------------------------------------------


# --- begin: factory-registration ---------------------------------------
def test_demo_provider_is_in_factory_registry() -> None:
    """Factory registration is a single dict entry in factory.py."""
    from src.generation.providers.demo_provider import DemoLLMProvider
    from src.generation.providers.factory import LLMProviderFactory

    assert LLMProviderFactory._REGISTRY.get("demo") is DemoLLMProvider


def test_demo_provider_is_selectable_from_settings() -> None:
    """`Settings(llm_provider='demo')` produces a DemoLLMProvider."""
    from src.generation.providers.factory import LLMProviderFactory

    s = Settings(llm_provider="demo")
    provider = LLMProviderFactory.from_settings(s)
    assert provider.name == "demo"


def test_settings_accepts_demo_in_literal() -> None:
    """`demo` is in the pydantic Literal — Settings(llm_provider='demo') compiles."""
    s = Settings(llm_provider="demo")
    assert s.llm_provider == "demo"


# --- end: factory-registration ----------------------------------------
