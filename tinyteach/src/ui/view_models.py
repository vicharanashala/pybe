"""UI-facing DTOs (Adapter — GoF).

The view models in this module are the **only** types the UI layer is
allowed to depend on. They are derived from the domain dataclasses via
the pure converters below — never mutated, never constructed in
component code. Components call ``render_*`` functions that take a
view model; tests of the converters stay in pure-Python land.

This module is also the seam where the project's brand of "curiosity-driven
case study" becomes the on-screen shape (cards, milestones, badges).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal

from src.domain.case_study import CaseStudy, CaseStudySet, Difficulty
from src.domain.roadmap import Milestone, Roadmap
from src.teaching.teaching_service import TeachingResult

# --- begin: index-status ---------------------------------------------------
IndexStatus = Literal["empty", "indexing", "ready", "error"]


# --- begin: upload-card-vm -----------------------------------------------
@dataclass(frozen=True)
class UploadCardVM:
    """One row in the sidebar showing the uploaded PDF's status."""

    filename: str
    size_bytes: int
    book_id: str | None
    status: IndexStatus
    error_message: str | None = None

    @property
    def size_human(self) -> str:
        n = float(self.size_bytes)
        for unit in ("B", "KB", "MB", "GB"):
            if n < 1024.0:
                return f"{n:.1f} {unit}"
            n /= 1024.0
        return f"{n:.1f} TB"

    @property
    def status_badge(self) -> str:
        return {
            "empty": "⚪ Empty",
            "indexing": "🟡 Indexing…",
            "ready": "🟢 Ready",
            "error": "🔴 Error",
        }[self.status]


# --- end: upload-card-vm ------------------------------------------------


# --- begin: case-study-card-vm -----------------------------------------
@dataclass(frozen=True)
class CaseStudyCardVM:
    """The shape of one curiosity-driven case study as the user sees it."""

    title: str
    difficulty: str  # "novice" | "intermediate" | "advanced"
    concept: str
    scenario: str
    task: str
    starter_code: str
    expected_output: str
    real_world_analogy: str
    fun_fact: str
    hints: list[str]
    learning_objective: str
    # 1-indexed ordinal for the UI ("Case study 1 of 5").
    ordinal: int = 0
    total: int = 0
    # Phase 8: the language this study was generated for. Used to label
    # the starter-code markdown fence correctly (was hardcoded "python"
    # before, which was wrong for Rust/Cpp/Java users).
    language: str = "python"

    def header(self) -> str:
        return f"Case study {self.ordinal} of {self.total} — {self.title}"


# --- end: case-study-card-vm --------------------------------------------


# --- begin: milestone-vm ------------------------------------------------
@dataclass(frozen=True)
class MilestoneVM:
    """One roadmap milestone as the UI shows it."""

    index: int
    name: str
    description: str
    case_study_index: int
    success_criteria: list[str]


# --- end: milestone-vm -------------------------------------------------


# --- begin: roadmap-vm --------------------------------------------------
@dataclass(frozen=True)
class RoadmapVM:
    """The whole roadmap for the result panel."""

    topic: str
    estimated_hours: int
    milestones: list[MilestoneVM] = field(default_factory=list)


# --- end: roadmap-vm ----------------------------------------------------


# --- begin: topic-banner-vm ---------------------------------------------
@dataclass(frozen=True)
class TopicBannerVM:
    """A single banner at the top of the results panel."""

    headline: str
    body: str


# --- end: topic-banner-vm ----------------------------------------------


# --- begin: results-page-vm --------------------------------------------
@dataclass(frozen=True)
class ResultsPageVM:
    """The whole "results" panel — banner + cards + roadmap."""

    banner: TopicBannerVM
    case_studies: list[CaseStudyCardVM]
    roadmap: RoadmapVM | None
    raw_json: str
    raw_markdown: str


# --- end: results-page-vm -----------------------------------------------


# --- begin: converters --------------------------------------------------
def case_study_to_card(
    study: CaseStudy,
    *,
    ordinal: int,
    total: int,
    language: str = "python",
) -> CaseStudyCardVM:
    """Convert one domain ``CaseStudy`` into a UI view model."""
    return CaseStudyCardVM(
        title=study.title,
        difficulty=study.difficulty.value,
        concept=study.concept,
        scenario=study.scenario,
        task=study.task,
        starter_code=study.starter_code,
        expected_output=study.expected_output,
        real_world_analogy=study.real_world_analogy,
        fun_fact=study.fun_fact,
        hints=list(study.hints),
        learning_objective=study.learning_objective,
        ordinal=ordinal,
        total=total,
        language=language,
    )


def case_study_set_to_cards(
    case_studies: CaseStudySet,
    *,
    language: str = "python",
) -> list[CaseStudyCardVM]:
    """Convert every study into a card; ordinals are 1-indexed."""
    n = len(case_studies.studies)
    return [
        case_study_to_card(s, ordinal=i + 1, total=n, language=language)
        for i, s in enumerate(case_studies.studies)
    ]


def milestone_to_vm(idx: int, m: Milestone) -> MilestoneVM:
    """One milestone into a UI view model."""
    return MilestoneVM(
        index=idx,
        name=m.name,
        description=m.description,
        case_study_index=m.case_study_index,
        success_criteria=list(m.success_criteria),
    )


def roadmap_to_vm(roadmap: Roadmap) -> RoadmapVM:
    """Convert a domain ``Roadmap`` into a UI view model."""
    return RoadmapVM(
        topic=roadmap.topic,
        estimated_hours=roadmap.estimated_hours,
        milestones=[milestone_to_vm(i + 1, m) for i, m in enumerate(roadmap.milestones)],
    )


# --- end: converters ----------------------------------------------------


# --- begin: markdown-renderer ------------------------------------------
def _difficulty_emoji(d: str) -> str:
    return {"novice": "🟢", "intermediate": "🟡", "advanced": "🔴"}.get(d, "⚪")


def case_study_to_markdown(card: CaseStudyCardVM) -> str:
    """Render a card as Markdown for the download / export button.

    The starter-code fence language matches the case study's language
    (``card.language``) so a Rust study renders as ```` ```rust ```` not
    ```` ```python ````.
    """
    fence_lang = card.language or "python"
    return (
        f"### {card.title}\n\n"
        f"**Difficulty:** {_difficulty_emoji(card.difficulty)} {card.difficulty}  \n"
        f"**Concept:** {card.concept}  \n\n"
        f"#### Scenario\n\n{card.scenario}\n\n"
        f"#### Task\n\n{card.task}\n\n"
        f"#### Starter code\n\n```{fence_lang}\n{card.starter_code}\n```\n\n"
        f"#### Real-world analogy\n\n{card.real_world_analogy}\n\n"
        f"#### Fun fact\n\n{card.fun_fact}\n\n"
        f"#### Hints\n\n" + "\n".join(f"{i + 1}. {h}" for i, h in enumerate(card.hints)) + "\n\n"
        f"#### Expected output\n\n```\n{card.expected_output}\n```\n\n"
        f"#### Learning objective\n\n{card.learning_objective}\n"
    )


def roadmap_to_markdown(roadmap: RoadmapVM) -> str:
    """Render a roadmap as Markdown."""
    lines = [
        f"## Roadmap — {roadmap.topic}",
        "",
        f"**Estimated time:** {roadmap.estimated_hours} hours",
        "",
        "### Milestones",
        "",
    ]
    for m in roadmap.milestones:
        lines.append(f"{m.index}. **{m.name}**  ")
        lines.append(f"   {m.description}  ")
        lines.append(f"   Case study index: {m.case_study_index}  ")
        if m.success_criteria:
            lines.append("   Success criteria:")
            for c in m.success_criteria:
                lines.append(f"     - {c}")
        lines.append("")
    return "\n".join(lines)


def teaching_result_to_page(result: TeachingResult) -> ResultsPageVM:
    """Bundle a ``TeachingResult`` into the view model for the results panel.

    Handles both ``status == "ok"`` and ``status == "topic_not_in_book"``.
    """
    if result.status == "topic_not_in_book":
        banner = TopicBannerVM(
            headline="Topic not in book",
            body=result.message or "The book does not cover that topic.",
        )
        return ResultsPageVM(
            banner=banner,
            case_studies=[],
            roadmap=None,
            raw_json="",
            raw_markdown=f"# {banner.headline}\n\n{banner.body}\n",
        )

    # status == "ok"
    assert result.case_studies is not None
    cards = case_study_set_to_cards(result.case_studies, language=result.language)
    roadmap_vm = roadmap_to_vm(result.roadmap) if result.roadmap is not None else None
    md_parts = [
        f"# TinyTeach — {result.topic}\n\n",
        f"**Book:** `{result.book_id}`  \n",
        f"**Language:** `{result.language}`  \n",
    ]
    if result.is_demo:
        md_parts.append("**Source:** bundled golden sample (no LLM call)  \n")
    md_parts.append("\n")
    md_parts.extend(case_study_to_markdown(c) + "\n---\n" for c in cards)
    if roadmap_vm is not None:
        md_parts.append(roadmap_to_markdown(roadmap_vm))
    headline = f"Generated {len(cards)} case studies for '{result.topic}'"
    if result.is_demo:
        headline = f"[Demo] {len(cards)} golden case studies for '{result.topic}'"
    body_lines = [
        f"Roadmap: {len(roadmap_vm.milestones) if roadmap_vm else 0} milestones, "
        f"~{roadmap_vm.estimated_hours if roadmap_vm else 0}h.",
        f"Book: `{result.book_id}`",
        f"Language: `{result.language}`",
    ]
    if result.is_demo:
        body_lines.append("Source: bundled golden sample (zero LLM cost).")
    banner = TopicBannerVM(
        headline=headline,
        body="\n\n".join(body_lines),
    )
    # Use the to_dict() for clean JSON, with book_id for traceability.
    json_dict = {
        "topic": result.topic,
        "book_id": result.book_id,
        "language": result.language,
        "is_demo": result.is_demo,
        "case_studies": result.case_studies.to_dict()["case_studies"],
    }
    if result.roadmap is not None:
        json_dict["roadmap"] = result.roadmap.to_dict()
    import json as _json

    return ResultsPageVM(
        banner=banner,
        case_studies=cards,
        roadmap=roadmap_vm,
        raw_json=_json.dumps(json_dict, ensure_ascii=False, indent=2),
        raw_markdown="".join(md_parts),
    )


# --- end: markdown-renderer --------------------------------------------


# --- begin: import-shim-for-tests --------------------------------------
# Import Difficulty at module-level so the converters above are
# fully testable without a separate import.
__all__ = [
    "CaseStudyCardVM",
    "Difficulty",
    "IndexStatus",
    "MilestoneVM",
    "ResultsPageVM",
    "RoadmapVM",
    "TopicBannerVM",
    "UploadCardVM",
    "case_study_set_to_cards",
    "case_study_to_card",
    "case_study_to_markdown",
    "milestone_to_vm",
    "roadmap_to_markdown",
    "roadmap_to_vm",
    "teaching_result_to_page",
]

# --- end: import-shim-for-tests ---------------------------------------
