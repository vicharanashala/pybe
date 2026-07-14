"""Pydantic schemas for LLM output validation.

Why Pydantic (not raw dataclasses) — Phase 5 needs to parse JSON that
*comes from an LLM*. We want strict mode, unknown-field rejection, and
exception-based validation reports.

Each model mirrors the corresponding domain dataclass in
``src.domain``. The ``validator`` module converts a Pydantic instance to
the dataclass; consumers see no Pydantic.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

# Difficulty values accepted by the case-study generator.
DifficultyLiteral = Literal["novice", "intermediate", "advanced"]


# --- begin: shared-config -------------------------------------------------
# ``extra="forbid"``: reject unknown keys — invariant I-6 (strict JSON).
# We do NOT use ``strict=True``: LLMs often send "5" (str) where the
# schema wants 5 (int). Pydantic's default coercion handles that without
# us being too pedantic. The data domain classes (Phase 0) are still
# the strict final guardrail.
_BASE_CONFIG = ConfigDict(extra="forbid", str_strip_whitespace=True)


# --- end: shared-config ---------------------------------------------------


# --- begin: case-study-schema ---------------------------------------------
class CaseStudySchema(BaseModel):
    """One curiosity-driven case study produced by the LLM."""

    model_config = _BASE_CONFIG

    title: str = Field(min_length=1)
    concept: str = Field(min_length=1)
    difficulty: DifficultyLiteral
    scenario: str = Field(min_length=1)
    task: str = Field(min_length=1)
    starter_code: str = Field(min_length=1)
    expected_output: str
    real_world_analogy: str = Field(min_length=1)  # invariant I-3
    fun_fact: str = Field(min_length=1)  # invariant I-4
    hints: list[str] = Field(min_length=1, max_length=3)  # invariant I-3 / I-4 internal
    learning_objective: str = Field(min_length=1)

    @field_validator("difficulty")
    @classmethod
    def _difficulty_is_known(cls, v: str) -> str:
        if v not in ("novice", "intermediate", "advanced"):
            raise ValueError(f"Unknown difficulty: {v!r}")
        return v


class CaseStudySetSchema(BaseModel):
    """Top-level shape of the case-study JSON response."""

    model_config = _BASE_CONFIG

    topic: str = Field(min_length=1)
    case_studies: list[CaseStudySchema] = Field(min_length=1, max_length=12)

    @field_validator("case_studies")
    @classmethod
    def _progressive_difficulty(cls, studies: list[CaseStudySchema]) -> list[CaseStudySchema]:
        """Invariant I-5: novice → intermediate → advanced, no skip, no duplicates."""
        order = {"novice": 0, "intermediate": 1, "advanced": 2}
        for prev, curr in zip(studies, studies[1:], strict=False):
            if order[curr.difficulty] < order[prev.difficulty]:
                raise ValueError(
                    f"Case studies not in ascending difficulty: "
                    f"{prev.difficulty} -> {curr.difficulty}."
                )
        return studies


# --- end: case-study-schema -----------------------------------------------


# --- begin: roadmap-schema ------------------------------------------------
class MilestoneSchema(BaseModel):
    """One roadmap milestone pointing at one case study by index."""

    model_config = _BASE_CONFIG

    name: str = Field(min_length=1)
    description: str = Field(min_length=1)
    case_study_index: int = Field(ge=0)
    success_criteria: list[str] = Field(min_length=1, max_length=3)


class RoadmapSchema(BaseModel):
    """Top-level shape of the roadmap JSON response."""

    model_config = _BASE_CONFIG

    topic: str = Field(min_length=1)
    estimated_hours: int = Field(ge=5, le=40)  # blueprint §12.3, rule 5
    milestones: list[MilestoneSchema] = Field(min_length=1)

    @field_validator("milestones")
    @classmethod
    def _ascending_case_study_index(cls, ms: list[MilestoneSchema]) -> list[MilestoneSchema]:
        """Invariant I-7: milestones reference ascending case_study_index values."""
        for prev, curr in zip(ms, ms[1:], strict=False):
            if curr.case_study_index < prev.case_study_index:
                raise ValueError(
                    f"Roadmap milestones not in ascending case_study_index: "
                    f"{prev.name} (idx={prev.case_study_index}) -> "
                    f"{curr.name} (idx={curr.case_study_index})."
                )
        return ms


# --- end: roadmap-schema -------------------------------------------------
