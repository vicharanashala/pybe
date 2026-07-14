"""Tests for ``src.golden.loader`` — Phase 8 demo sample loader.

Covers every on-disk golden file plus the loader's helpers:
- ``list_available()`` discovers what's on disk
- ``known_languages()`` / ``known_topics_for()`` reflect the catalog
- ``load_demo(lang, topic)`` parses + validates every shipped file
- ``load_demo_default(lang)`` returns the default topic
- Malformed files raise ``ConfigError`` (not silent garbage)
- Generic fallback works when a (lang, topic) has no sample
"""

from __future__ import annotations

import json
from pathlib import Path

import pytest
from src.domain.errors import ConfigError
from src.golden import loader


# --- begin: discovery ---------------------------------------------------
def test_list_available_finds_every_shipped_sample() -> None:
    """13 shipped files (3 per language + 1 generic fallback)."""
    catalog = loader.list_available()
    assert set(catalog.keys()) == {"python", "java", "cpp", "rust", "generic"}
    for lang in ("python", "java", "cpp", "rust"):
        assert len(catalog[lang]) == 3, f"{lang} should have 3 topics; got {catalog[lang]}"
    assert catalog["generic"] == ("decorators",)


def test_known_languages_is_sorted() -> None:
    langs = loader.known_languages()
    assert langs == sorted(langs)


def test_known_topics_for_known_language() -> None:
    assert "decorators" in loader.known_topics_for("python")
    assert "ownership" in loader.known_topics_for("rust")
    assert "inheritance" in loader.known_topics_for("java")


def test_known_topics_for_unknown_language_is_empty() -> None:
    assert loader.known_topics_for("klingon") == ()


# --- end: discovery -----------------------------------------------------


# --- begin: parse-every-shipped-file ------------------------------------
@pytest.mark.parametrize(
    ("language", "topic"),
    [
        ("python", "decorators"),
        ("python", "generators"),
        ("python", "comprehensions"),
        ("java", "inheritance"),
        ("java", "streams"),
        ("java", "generics"),
        ("cpp", "pointers"),
        ("cpp", "raii"),
        ("cpp", "templates"),
        ("rust", "ownership"),
        ("rust", "lifetimes"),
        ("rust", "traits"),
        ("generic", "decorators"),
    ],
)
def test_load_every_shipped_sample(language: str, topic: str) -> None:
    """Each shipped file must load + pass domain validation."""
    r = loader.load_demo(language, topic)
    assert r.status == "ok"
    assert r.is_demo is True
    assert r.case_studies is not None
    assert len(r.case_studies.studies) >= 1
    assert r.roadmap is not None
    assert len(r.roadmap.milestones) >= 1
    # Progressive difficulty (I-5) — the CaseStudySet enforces it in __post_init__.
    prev_rank = -1
    for s in r.case_studies.studies:
        assert s.difficulty.rank >= prev_rank, (s.title, prev_rank, s.difficulty.rank)
        prev_rank = s.difficulty.rank
    # Topological ordering (I-7)
    prev_idx = -1
    for m in r.roadmap.milestones:
        assert m.case_study_index >= prev_idx, (m.name, prev_idx, m.case_study_index)
        prev_idx = m.case_study_index
    # Every case study must satisfy invariants I-3/I-4 (real_world_analogy + fun_fact)
    for s in r.case_studies.studies:
        assert s.real_world_analogy.strip()
        assert s.fun_fact.strip()
        assert s.learning_objective.strip()
        assert 1 <= len(s.hints) <= 3
    # estimated_hours must be in [5, 40] (Roadmap.__post_init__)
    assert 5 <= r.roadmap.estimated_hours <= 40


# --- end: parse-every-shipped-file -------------------------------------


# --- begin: default-topic-helper ---------------------------------------
def test_default_demo_topic_for_known_language() -> None:
    assert loader.default_demo_topic_for("python") == "decorators"
    assert loader.default_demo_topic_for("rust") == "ownership"
    assert loader.default_demo_topic_for("java") == "inheritance"
    assert loader.default_demo_topic_for("cpp") == "raii"


def test_default_demo_topic_for_unknown_language_falls_back() -> None:
    """Unknown -> first known language's first topic."""
    assert loader.default_demo_topic_for("klingon") == "decorators"


# --- end: default-topic-helper -----------------------------------------


# --- begin: missing-file ------------------------------------------------
def test_load_demo_missing_raises_config_error() -> None:
    """Asking for a (lang, topic) that doesn't exist raises ConfigError."""
    with pytest.raises(ConfigError, match="No golden sample"):
        loader.load_demo("python", "rust_macros")


# --- end: missing-file -------------------------------------------------


# --- begin: malformed-file ---------------------------------------------
def test_load_demo_malformed_json_raises_config_error(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """A non-JSON file in the golden folder raises ConfigError, not silent garbage."""
    # Repoint the loader at a tmp dir with a broken file.
    bad_dir = tmp_path / "golden"
    (bad_dir / "python").mkdir(parents=True)
    (bad_dir / "python" / "broken.json").write_text("this is not json", encoding="utf-8")
    monkeypatch.setattr(loader, "_golden_dir", lambda: bad_dir)
    with pytest.raises(ConfigError, match="not valid JSON"):
        loader.load_demo("python", "broken")


def test_load_demo_missing_required_key_raises_config_error(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """A JSON file missing a required key raises ConfigError."""
    bad_dir = tmp_path / "golden"
    (bad_dir / "python").mkdir(parents=True)
    (bad_dir / "python" / "broken.json").write_text(
        json.dumps({"topic": "x"}),
        encoding="utf-8",  # missing book_id, case_studies, roadmap
    )
    monkeypatch.setattr(loader, "_golden_dir", lambda: bad_dir)
    with pytest.raises(ConfigError, match="missing required key"):
        loader.load_demo("python", "broken")


# --- end: malformed-file -----------------------------------------------
