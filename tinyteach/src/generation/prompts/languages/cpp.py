"""C++ language prompt — placeholder, delegates to GenericLanguagePrompt.

C++-specific system-block tweaks (e.g. RAII, header conventions) can be
added here in a future version.
"""

from __future__ import annotations

from src.generation.prompts.languages.generic import GenericLanguagePrompt


class CppLanguagePrompt(GenericLanguagePrompt):
    """Identical content to ``GenericLanguagePrompt``; lives here for symmetry."""

    @property
    def language_name(self) -> str:
        return "cpp"
