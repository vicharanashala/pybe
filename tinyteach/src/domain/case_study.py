"""CaseStudy & CaseStudySet value objects.

SRP-justification: a CaseStudy is the LLM's output, frozen into a value
object. It has no idea HOW it was produced (prompt, LLM, retries) — it
is purely a record of what to show the user. The Pydantic mirror for
LLM parsing lives in ``src/generation/schemas.py`` (Phase 4).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum

try:
    from typing import Self
except ImportError:  # Python <3.11
    from typing_extensions import Self


class Difficulty(str, Enum):
    """Three ascending tiers; must be sorted by ordinal."""

    NOVICE = "novice"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

    @property
    def rank(self) -> int:
        order = {Difficulty.NOVICE: 0, Difficulty.INTERMEDIATE: 1, Difficulty.ADVANCED: 2}
        return order[self]


@dataclass(frozen=True)
class CaseStudy:
    """One curiosity-driven case study.

    All fields are required (invariant I-2/I-3/I-4): a missing
    ``real_world_analogy`` or ``fun_fact`` means the validator should
    reject the response (Phase 4). We enforce the type-level constraint
    here; the runtime check happens in the validator.
    """

    title: str
    concept: str
    difficulty: Difficulty
    scenario: str
    task: str
    starter_code: str
    expected_output: str
    real_world_analogy: str
    fun_fact: str
    hints: list[str]
    learning_objective: str

    def __post_init__(self) -> None:
        if not 1 <= len(self.hints) <= 3:
            raise ValueError(
                f"CaseStudy '{self.title}' must have 1-3 hints; got {len(self.hints)}."
            )
        for required in (
            "title",
            "concept",
            "scenario",
            "task",
            "real_world_analogy",
            "fun_fact",
            "learning_objective",
        ):
            if not getattr(self, required).strip():
                raise ValueError(f"CaseStudy field '{required}' is empty.")

    def to_dict(self) -> dict[str, str | list[str]]:
        return {
            "title": self.title,
            "concept": self.concept,
            "difficulty": self.difficulty.value,
            "scenario": self.scenario,
            "task": self.task,
            "starter_code": self.starter_code,
            "expected_output": self.expected_output,
            "real_world_analogy": self.real_world_analogy,
            "fun_fact": self.fun_fact,
            "hints": list(self.hints),
            "learning_objective": self.learning_objective,
        }

    @classmethod
    def from_dict(cls, data: dict[str, str | list[str]]) -> Self:
        return cls(
            title=str(data["title"]),
            concept=str(data["concept"]),
            difficulty=Difficulty(str(data["difficulty"])),
            scenario=str(data["scenario"]),
            task=str(data["task"]),
            starter_code=str(data["starter_code"]),
            expected_output=str(data["expected_output"]),
            real_world_analogy=str(data["real_world_analogy"]),
            fun_fact=str(data["fun_fact"]),
            hints=list(data["hints"]),  # type: ignore[arg-type]
            learning_objective=str(data["learning_objective"]),
        )


@dataclass(frozen=True)
class CaseStudySet:
    """An ordered, difficulty-monotonic set of case studies for one topic."""

    topic: str
    book_id: str
    studies: list[CaseStudy] = field(default_factory=list)

    def __post_init__(self) -> None:
        # Invariant I-5: progressive difficulty, no skipping.
        if not self.studies:
            raise ValueError("CaseStudySet must contain at least one study.")
        for prev, curr in zip(self.studies, self.studies[1:], strict=False):
            if curr.difficulty.rank < prev.difficulty.rank:
                raise ValueError(
                    f"CaseStudySet for '{self.topic}' is not sorted by ascending "
                    f"difficulty: {prev.difficulty.value} -> {curr.difficulty.value}."
                )

    def to_dict(self) -> dict[str, str | list[dict[str, str | list[str]]]]:
        return {
            "topic": self.topic,
            "book_id": self.book_id,
            "case_studies": [s.to_dict() for s in self.studies],
        }
