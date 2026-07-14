"""Java language prompt — placeholder, delegates to GenericLanguagePrompt.

Java-specific system-block tweaks can be added later (e.g., explicit
mention of javac, JDK 21 LTS) without changing any other layer.
"""

from __future__ import annotations

from src.generation.prompts.languages.generic import GenericLanguagePrompt


class JavaLanguagePrompt(GenericLanguagePrompt):
    """Identical content to ``GenericLanguagePrompt``; lives here for symmetry."""

    @property
    def language_name(self) -> str:
        return "java"
