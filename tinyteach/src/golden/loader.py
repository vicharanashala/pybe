"""Golden-sample loader (Adapter — GoF).

Phase 8: loads ``data/golden/<lang>/<topic>.json`` into a
``TeachingResult``. See module-level docstring in ``__init__.py``.
"""

from __future__ import annotations

import json
import logging
from pathlib import Path

from src.domain.case_study import CaseStudy, CaseStudySet, Difficulty
from src.domain.errors import ConfigError
from src.domain.roadmap import Milestone, Roadmap
from src.teaching.teaching_service import TeachingResult

logger = logging.getLogger(__name__)


# --- begin: defaults ------------------------------------------------------
# Default demo topic per language (when the UI doesn't have a user-typed
# one yet). Picked for "the topic most beginners will recognise".
_DEFAULT_DEMO_TOPIC: dict[str, str] = {
    "python": "decorators",
    "java": "inheritance",
    "cpp": "raii",
    "rust": "ownership",
    "generic": "decorators",
}

# All languages ship these three canonical golden topics.
_GOLDEN_TOPICS: tuple[str, ...] = ("decorators", "generators", "comprehensions")

# Per-language canonical topics (used to validate a topic exists for that
# language, and to populate the demo-button topic dropdown if added later).
_GOLDEN_TOPICS_BY_LANGUAGE: dict[str, tuple[str, ...]] = {
    "python": ("decorators", "generators", "comprehensions"),
    "java": ("inheritance", "streams", "generics"),
    "cpp": ("pointers", "raii", "templates"),
    "rust": ("ownership", "lifetimes", "traits"),
    "generic": ("decorators",),
}


def known_languages() -> list[str]:
    """Return the languages that have at least one golden sample."""
    return sorted(_GOLDEN_TOPICS_BY_LANGUAGE.keys())


def known_topics_for(language: str) -> tuple[str, ...]:
    """Return the topics available for ``language``. Empty if none."""
    return _GOLDEN_TOPICS_BY_LANGUAGE.get(language, ())


def default_demo_topic_for(language: str) -> str:
    """The default demo topic for ``language``; 'decorators' as final fallback."""
    return _DEFAULT_DEMO_TOPIC.get(language, _GOLDEN_TOPICS[0])


# --- end: defaults -------------------------------------------------------


# --- begin: path-resolution ---------------------------------------------
def _golden_dir() -> Path:
    """Return the on-disk path of ``data/golden/`` in the project root.

    The golden folder lives in the project root (``data/golden/``) so it
    ships with the repo (the rest of ``data/`` is gitignored). Walk up
    from this module until we find it. Raises ``ConfigError`` if not
    found -- that's a deployment error, not a runtime fallback.
    """
    here = Path(__file__).resolve()
    for parent in (here.parent, *here.parents):
        candidate = parent / "data" / "golden"
        if candidate.is_dir():
            return candidate
    raise ConfigError(
        f"Cannot locate 'data/golden/' relative to {here}. " "Did you delete the golden folder?"
    )


def _golden_file_path(language: str, topic: str) -> Path:
    """Resolve ``data/golden/<language>/<topic>.json``."""
    return _golden_dir() / language / f"{topic}.json"


def list_available() -> dict[str, tuple[str, ...]]:
    """Discover golden files currently on disk, grouped by language.

    Useful for the demo-button UI: it can show "Demo: decorators,
    generators, comprehensions" rather than a hardcoded list.
    """
    out: dict[str, list[str]] = {}
    try:
        root = _golden_dir()
    except ConfigError:
        return {}
    if not root.exists():
        return {}
    for lang_dir in sorted(p for p in root.iterdir() if p.is_dir()):
        topics = sorted(p.stem for p in lang_dir.glob("*.json"))
        if topics:
            out[lang_dir.name] = tuple(topics)
    return out


# --- end: path-resolution -----------------------------------------------


# --- begin: loader -------------------------------------------------------
def load_demo(language: str, topic: str) -> TeachingResult:
    """Load ``data/golden/<language>/<topic>.json`` as a ``TeachingResult``.

    Args:
        language: e.g. ``"python"``, ``"rust"``. Falls back to
            ``"generic"`` if the requested language has no golden files
            but the topic does exist under ``generic``.
        topic: e.g. ``"decorators"``. The golden folder ships one file
            per (language, topic) pair.

    Returns:
        A ``TeachingResult(status="ok", ..., is_demo=True)``.

    Raises:
        ConfigError: when no golden file exists for ``(language, topic)``,
            even after the ``generic`` fallback.
    """
    # Try the requested language first, then generic.
    for try_lang in (language, "generic") if language != "generic" else (language,):
        path = _golden_file_path(try_lang, topic)
        if path.is_file():
            data = _read_json(path)
            result = _parse_result(
                data, override_language=language if try_lang == "generic" else None
            )
            logger.info(
                "golden sample loaded",
                extra={
                    "where": "golden.loader",
                    "language": try_lang,
                    "topic": topic,
                    "path": str(path),
                },
            )
            return result

    raise ConfigError(
        f"No golden sample for (language={language!r}, topic={topic!r}). "
        f"Known languages: {known_languages()}. "
        f"For each language: {dict(_GOLDEN_TOPICS_BY_LANGUAGE)}"
    )


def load_demo_default(language: str) -> TeachingResult:
    """Convenience: load the default golden sample for ``language``."""
    return load_demo(language, default_demo_topic_for(language))


# --- end: loader ---------------------------------------------------------


# --- begin: parsing ------------------------------------------------------
def _read_json(path: Path) -> dict[str, object]:
    """Read + JSON-parse a file."""
    with path.open(encoding="utf-8") as fh:
        raw = fh.read()
    try:
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        raise ConfigError(f"Golden file {path} is not valid JSON: {exc}") from exc


def _parse_result(
    data: dict[str, object],
    *,
    override_language: str | None = None,
) -> TeachingResult:
    """Map the JSON shape back into our runtime DTOs.

    Validates the shape -- raises ``ConfigError`` if a required field
    is missing (better than letting the UI render an empty card).
    """
    try:
        topic = str(data["topic"])
        book_id = str(data["book_id"])
        language = override_language or str(data.get("language", "python"))
        studies_raw = data["case_studies"]
        roadmap_raw = data["roadmap"]
    except KeyError as exc:
        raise ConfigError(
            f"Golden file is missing required key {exc!s}. "
            "Required: topic, book_id, language, case_studies, roadmap."
        ) from exc

    if not isinstance(studies_raw, list):
        raise ConfigError("Golden file: 'case_studies' must be a list.")
    if not isinstance(roadmap_raw, dict):
        raise ConfigError("Golden file: 'roadmap' must be an object.")

    studies = [_parse_study(s) for s in studies_raw]
    case_study_set = CaseStudySet(topic=topic, book_id=book_id, studies=studies)
    roadmap = _parse_roadmap(roadmap_raw)

    return TeachingResult(
        status="ok",
        topic=topic,
        book_id=book_id,
        case_studies=case_study_set,
        roadmap=roadmap,
        language=language,
        is_demo=True,
    )


def _parse_study(data: object) -> CaseStudy:
    """One JSON object -> CaseStudy."""
    if not isinstance(data, dict):
        raise ConfigError(f"Golden case study must be an object; got {type(data).__name__}.")
    try:
        return CaseStudy(
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
    except (KeyError, ValueError) as exc:
        raise ConfigError(f"Golden case study is malformed: {exc}") from exc


def _parse_roadmap(data: dict[str, object]) -> Roadmap:
    """One JSON object -> Roadmap."""
    if not isinstance(data, dict):
        raise ConfigError("Golden roadmap must be an object.")
    try:
        topic = str(data["topic"])
        estimated_hours = int(data["estimated_hours"])
        milestones_raw = data["milestones"]
        book_id = str(data.get("book_id", ""))
        milestones = [_parse_milestone(m) for m in milestones_raw]
    except (KeyError, TypeError, ValueError) as exc:
        raise ConfigError(f"Golden roadmap is malformed: {exc}") from exc
    return Roadmap(
        topic=topic,
        estimated_hours=estimated_hours,
        milestones=milestones,
        book_id=book_id,
    )


def _parse_milestone(data: object) -> Milestone:
    """One JSON object -> Milestone."""
    if not isinstance(data, dict):
        raise ConfigError("Milestone must be an object.")
    try:
        return Milestone(
            name=str(data["name"]),
            description=str(data["description"]),
            case_study_index=int(data["case_study_index"]),
            success_criteria=list(data["success_criteria"]),  # type: ignore[arg-type]
        )
    except (KeyError, ValueError) as exc:
        raise ConfigError(f"Golden milestone is malformed: {exc}") from exc


# --- end: parsing -------------------------------------------------------
