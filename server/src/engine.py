"""
pyBE Scenario Engine
====================

Loads, indexes, and serves philosophical Python learning scenarios.

Each scenario lives in its own directory under the scenarios root:

    scenarios/<scenario-id>/
    ├── scenario.json            # Core metadata and four-pillar content
    ├── case-study.md            # Narrative case study (rendered to HTML)
    ├── hints.json               # Progressive hints
    ├── expected-constructs.json # Optional Python constructs to assess
    ├── scoring-rubric.json      # Evaluation rubric
    ├── reflection-prompts.json  # Post-exercise reflection questions
    └── solution/                # One or more reference solution files
        ├── solution.py
        └── ...
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any, Optional

import markdown


# ---------------------------------------------------------------------------
# Custom exceptions
# ---------------------------------------------------------------------------

class ScenarioNotFoundError(Exception):
    """Raised when a requested scenario ID does not exist."""

    def __init__(self, scenario_id: str) -> None:
        self.scenario_id = scenario_id
        super().__init__(f"Scenario '{scenario_id}' not found")


class ScenarioLoadError(Exception):
    """Raised when a scenario's data files are corrupt or unreadable."""

    def __init__(self, scenario_id: str, reason: str) -> None:
        self.scenario_id = scenario_id
        self.reason = reason
        super().__init__(f"Failed to load scenario '{scenario_id}': {reason}")


# ---------------------------------------------------------------------------
# Helper utilities
# ---------------------------------------------------------------------------

def _read_json(path: Path) -> Any:
    """Read and parse a JSON file, returning its content."""
    with open(path, "r", encoding="utf-8-sig") as fh:
        return json.load(fh)


def _read_text(path: Path) -> str:
    """Read a text file and return its content as a string."""
    with open(path, "r", encoding="utf-8-sig", errors="replace") as fh:
        return fh.read()


def _render_markdown(md_text: str) -> str:
    """Convert Markdown text to HTML with common extensions."""
    return markdown.markdown(
        md_text,
        extensions=["fenced_code", "tables", "codehilite", "toc"],
    )


# ---------------------------------------------------------------------------
# Metadata keys surfaced in the listing endpoint
# ---------------------------------------------------------------------------

_LISTING_KEYS = (
    "id",
    "title",
    "domain",
    "difficultyLevel",
    "jonasanType",
    "pythonConcept",
    "briefDescription",
)


# ---------------------------------------------------------------------------
# ScenarioEngine
# ---------------------------------------------------------------------------

class ScenarioEngine:
    """Loads scenarios from disk and provides query / retrieval methods.

    Parameters
    ----------
    scenarios_dir : str | Path
        Absolute or relative path to the directory that contains scenario
        sub-directories.
    """

    def __init__(self, scenarios_dir: str | Path) -> None:
        self.scenarios_dir = Path(scenarios_dir).resolve()
        # Mapping of scenario-id → parsed scenario.json content
        self._index: dict[str, dict[str, Any]] = {}

    # ------------------------------------------------------------------
    # Loading
    # ------------------------------------------------------------------

    def load_all(self) -> int:
        """Walk the scenarios directory and index every valid scenario.

        Returns
        -------
        int
            The number of scenarios successfully loaded.
        """
        self._index.clear()

        if not self.scenarios_dir.is_dir():
            return 0

        for entry in sorted(self.scenarios_dir.iterdir()):
            if not entry.is_dir():
                continue

            scenario_file = entry / "scenario.json"
            if not scenario_file.is_file():
                continue

            try:
                data = _read_json(scenario_file)
                # Ensure the id field matches the directory name
                data.setdefault("id", entry.name)
                self._index[entry.name] = data
            except (json.JSONDecodeError, OSError) as exc:
                # Log but don't crash other scenarios may be fine
                print(f"[engine] WARNING: skipping '{entry.name}': {exc}")

        return len(self._index)

    # ------------------------------------------------------------------
    # Listing
    # ------------------------------------------------------------------

    def list_scenarios(
        self,
        domain: Optional[str] = None,
        level: Optional[str] = None,
        jonasan_type: Optional[str] = None,
    ) -> list[dict[str, Any]]:
        """Return metadata summaries, optionally filtered.

        Parameters
        ----------
        domain : str, optional
            Filter by philosophical domain (case-insensitive).
        level : str, optional
            Filter by difficulty level (case-insensitive).
        jonasan_type : str, optional
            Filter by Jōnasan archetype / type (case-insensitive).

        Returns
        -------
        list[dict]
            A list of scenario summary dicts containing only listing keys.
        """
        results: list[dict[str, Any]] = []

        for scenario in self._index.values():
            if domain and scenario.get("domain", "").lower() != domain.lower():
                continue
            if level:
                scenario_level = scenario.get("difficultyLevel")
                if scenario_level is None or str(scenario_level).lower() != level.lower():
                    continue
            if jonasan_type and scenario.get("jonasanType", "").lower() != jonasan_type.lower():
                continue

            summary = {k: scenario.get(k) for k in _LISTING_KEYS}
            results.append(summary)

        return results

    # ------------------------------------------------------------------
    # Full scenario detail
    # ------------------------------------------------------------------

    def get_scenario(self, scenario_id: str) -> dict[str, Any]:
        """Return full scenario detail, including rendered case-study HTML.

        Raises
        ------
        ScenarioNotFoundError
            If *scenario_id* does not exist in the index.
        """
        if scenario_id not in self._index:
            raise ScenarioNotFoundError(scenario_id)

        data = dict(self._index[scenario_id])  # shallow copy
        scenario_dir = self.scenarios_dir / scenario_id

        # --- Case study (Markdown → HTML) ---
        case_study_path = scenario_dir / "case-study.md"
        if case_study_path.is_file():
            md_text = _read_text(case_study_path)
            data["caseStudy"] = {
                "markdown": md_text,
                "html": _render_markdown(md_text),
            }
        else:
            data["caseStudy"] = None

        # --- Expected constructs (optional) ---
        constructs_path = scenario_dir / "expected-constructs.json"
        if constructs_path.is_file():
            try:
                data["expectedConstructs"] = _read_json(constructs_path)
            except (json.JSONDecodeError, OSError):
                data["expectedConstructs"] = None
        else:
            data["expectedConstructs"] = None

        return data

    # ------------------------------------------------------------------
    # Hints (progressive reveal)
    # ------------------------------------------------------------------

    def get_hints(
        self,
        scenario_id: str,
        reveal_count: Optional[int] = None,
    ) -> list[dict[str, Any]]:
        """Return hints for a scenario, optionally limited to the first N.

        Parameters
        ----------
        scenario_id : str
            The scenario identifier.
        reveal_count : int, optional
            If provided, only the first *reveal_count* hints are returned.

        Raises
        ------
        ScenarioNotFoundError
            If *scenario_id* does not exist.
        """
        self._ensure_exists(scenario_id)

        hints_path = self.scenarios_dir / scenario_id / "hints.json"
        if not hints_path.is_file():
            return []

        try:
            hints = _read_json(hints_path)
        except (json.JSONDecodeError, OSError):
            return []

        if not isinstance(hints, list):
            # Tolerate {"hints": [...]} wrapper
            hints = hints.get("hints", []) if isinstance(hints, dict) else []

        if reveal_count is not None and reveal_count >= 0:
            hints = hints[:reveal_count]

        return hints

    # ------------------------------------------------------------------
    # Solutions
    # ------------------------------------------------------------------

    def get_solutions(self, scenario_id: str) -> list[dict[str, str]]:
        """Return all solution files (filename + content) for a scenario.

        Raises
        ------
        ScenarioNotFoundError
            If *scenario_id* does not exist.
        """
        self._ensure_exists(scenario_id)

        solution_dir = self.scenarios_dir / scenario_id / "solution"
        if not solution_dir.is_dir():
            return []

        solutions: list[dict[str, str]] = []
        for fpath in sorted(solution_dir.iterdir()):
            if fpath.is_file():
                try:
                    content = _read_text(fpath)
                    solutions.append({
                        "filename": fpath.name,
                        "content": content,
                    })
                except OSError:
                    continue

        return solutions

    # ------------------------------------------------------------------
    # Reflection prompts
    # ------------------------------------------------------------------

    def get_reflection(self, scenario_id: str) -> Any:
        """Return reflection prompts for a scenario.

        Raises
        ------
        ScenarioNotFoundError
            If *scenario_id* does not exist.
        """
        self._ensure_exists(scenario_id)
        return self._load_optional_json(scenario_id, "reflection-prompts.json")

    # ------------------------------------------------------------------
    # Scoring rubric
    # ------------------------------------------------------------------

    def get_rubric(self, scenario_id: str) -> Any:
        """Return the scoring rubric for a scenario.

        Raises
        ------
        ScenarioNotFoundError
            If *scenario_id* does not exist.
        """
        self._ensure_exists(scenario_id)
        return self._load_optional_json(scenario_id, "scoring-rubric.json")

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _ensure_exists(self, scenario_id: str) -> None:
        """Raise `ScenarioNotFoundError` if the id is not indexed."""
        if scenario_id not in self._index:
            raise ScenarioNotFoundError(scenario_id)

    def _load_optional_json(self, scenario_id: str, filename: str) -> Any:
        """Load a JSON sidecar file, returning *None* if missing/corrupt."""
        path = self.scenarios_dir / scenario_id / filename
        if not path.is_file():
            return None
        try:
            return _read_json(path)
        except (json.JSONDecodeError, OSError):
            return None
