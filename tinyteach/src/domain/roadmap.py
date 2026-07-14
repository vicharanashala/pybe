"""Roadmap & Milestone value objects.

SRP-justification: a Roadmap is a sequence of pointers INTO an already-
generated ``CaseStudySet`` (invariant I-7). It never carries content of
its own; the UI joins it with the set when rendering.
"""

from __future__ import annotations

from dataclasses import dataclass, field

try:
    from typing import Self
except ImportError:  # Python <3.11
    from typing_extensions import Self


@dataclass(frozen=True)
class Milestone:
    """One checkpoint in a learning roadmap."""

    name: str
    description: str
    case_study_index: int
    success_criteria: list[str]

    def __post_init__(self) -> None:
        if self.case_study_index < 0:
            raise ValueError(
                f"Milestone '{self.name}': case_study_index must be >= 0; got {self.case_study_index}."
            )
        if not 1 <= len(self.success_criteria) <= 3:
            raise ValueError(
                f"Milestone '{self.name}' must have 1-3 success_criteria; "
                f"got {len(self.success_criteria)}."
            )

    def to_dict(self) -> dict[str, str | int | list[str]]:
        return {
            "name": self.name,
            "description": self.description,
            "case_study_index": self.case_study_index,
            "success_criteria": list(self.success_criteria),
        }

    @classmethod
    def from_dict(cls, data: dict[str, str | int | list[str]]) -> Self:
        return cls(
            name=str(data["name"]),
            description=str(data["description"]),
            case_study_index=int(data["case_study_index"]),
            success_criteria=list(data["success_criteria"]),  # type: ignore[arg-type]
        )


@dataclass(frozen=True)
class Roadmap:
    """An ordered roadmap through a topic, pointing at existing case studies."""

    topic: str
    estimated_hours: int
    milestones: list[Milestone] = field(default_factory=list)
    book_id: str = ""

    def __post_init__(self) -> None:
        if not 5 <= self.estimated_hours <= 40:
            raise ValueError(
                f"Roadmap estimated_hours must be in [5, 40]; got {self.estimated_hours}."
            )
        if not self.milestones:
            raise ValueError("Roadmap must contain at least one milestone.")
        # Invariant I-7: milestones are strictly ordered; indices may repeat
        # (the same case study can appear in two adjacent milestones) but
        # never decrease.
        for prev, curr in zip(self.milestones, self.milestones[1:], strict=False):
            if curr.case_study_index < prev.case_study_index:
                raise ValueError(
                    f"Roadmap milestones not in ascending order: "
                    f"{prev.name} (idx={prev.case_study_index}) -> "
                    f"{curr.name} (idx={curr.case_study_index})."
                )

    def to_dict(self) -> dict[str, str | int | list[dict[str, str | int | list[str]]]]:
        return {
            "topic": self.topic,
            "estimated_hours": self.estimated_hours,
            "book_id": self.book_id,
            "milestones": [m.to_dict() for m in self.milestones],
        }
