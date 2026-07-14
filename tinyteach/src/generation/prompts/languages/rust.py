"""Rust language prompt — placeholder, delegates to GenericLanguagePrompt.

Rust-specific system-block tweaks (e.g. borrow checker, ownership,
lifetimes, traits, no null) can be added in a future version of this
file without changing any other layer.

Adding this file is the entire "add a new language" workflow:

    1. Drop ``src/generation/prompts/languages/rust.py`` (this file).
    2. Flip ``PROMPT_LANGUAGE=rust`` in ``.env`` (or via the sidebar).
    3. Re-upload a Rust book. Done.

No edit to ``registry.py`` is required — the registry auto-discovers
this module on next import (see ``registry._discover_language_table``).
"""

from __future__ import annotations

from src.generation.prompts.languages.generic import GenericLanguagePrompt


class RustLanguagePrompt(GenericLanguagePrompt):
    """Identical content to ``GenericLanguagePrompt``; lives here for symmetry."""

    @property
    def language_name(self) -> str:
        return "rust"
