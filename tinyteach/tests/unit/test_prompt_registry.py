"""Tests for ``PromptRegistry``."""

from __future__ import annotations

import pytest
from src.domain.errors import ConfigError
from src.generation.prompts.languages.cpp import CppLanguagePrompt
from src.generation.prompts.languages.generic import GenericLanguagePrompt
from src.generation.prompts.languages.java import JavaLanguagePrompt
from src.generation.prompts.languages.python import PythonLanguagePrompt
from src.generation.prompts.registry import PromptRegistry


# --- begin: known-languages ----------------------------------------------
def test_resolve_python() -> None:
    assert isinstance(PromptRegistry.resolve("python"), PythonLanguagePrompt)


def test_resolve_java() -> None:
    assert isinstance(PromptRegistry.resolve("java"), JavaLanguagePrompt)


def test_resolve_cpp() -> None:
    assert isinstance(PromptRegistry.resolve("cpp"), CppLanguagePrompt)


def test_resolve_generic() -> None:
    assert isinstance(PromptRegistry.resolve("generic"), GenericLanguagePrompt)


# --- end: known-languages -----------------------------------------------


# --- begin: fallback -----------------------------------------------------
def test_unknown_language_falls_back_to_generic() -> None:
    """Unknown language -> generic (the always-available fallback)."""
    p = PromptRegistry.resolve("klingon")
    assert isinstance(p, GenericLanguagePrompt)


def test_rust_is_auto_discovered() -> None:
    """Phase 8: dropping rust.py + no code edit anywhere else makes it resolvable."""
    p = PromptRegistry.resolve("rust")
    assert p.language_name == "rust"
    assert type(p).__name__ == "RustLanguagePrompt"
    assert "rust" in PromptRegistry.known_languages()


# --- end: fallback ------------------------------------------------------


# --- begin: unknown-version ---------------------------------------------
def test_unknown_version_raises_config_error() -> None:
    with pytest.raises(ConfigError):
        PromptRegistry.resolve("python", version="v999")


# --- end: unknown-version ----------------------------------------------


# --- begin: introspection ----------------------------------------------
def test_known_languages_returns_sorted_list() -> None:
    langs = PromptRegistry.known_languages()
    assert "python" in langs
    assert "generic" in langs
    assert langs == sorted(langs)


def test_known_versions_is_non_empty() -> None:
    assert PromptRegistry.known_versions()


# --- end: introspection -----------------------------------------------
