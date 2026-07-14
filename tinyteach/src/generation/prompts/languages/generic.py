"""Generic language prompt — used as the registry fallback.

Same locked system messages as the Python prompt (the rules are
language-agnostic). The only difference is that ``starter_code`` is
allowed in any language — the LLM is free to pick.
"""

from __future__ import annotations

from src.generation.prompts.base import BaseLanguagePrompt
from src.generation.prompts.languages.python import (
    _CASE_STUDY_SYSTEM,
    _ROADMAP_SYSTEM,
    _ROADMAP_USER_TEMPLATE,
)
from src.generation.prompts.languages.python import (
    _CASE_STUDY_USER_TEMPLATE as _PYTHON_USER_TEMPLATE,
)


# --- begin: generic-class -------------------------------------------------
class GenericLanguagePrompt(BaseLanguagePrompt):
    """Used when ``settings.prompt_language`` is unknown (or 'generic')."""

    @property
    def language_name(self) -> str:
        return "generic"

    def case_study_system_block(self) -> str:
        return _CASE_STUDY_SYSTEM

    def case_study_user_template(self) -> str:
        # Identical to the Python template — only the language variable
        # we pass in at substitution time differs.
        return _PYTHON_USER_TEMPLATE

    def roadmap_system_block(self) -> str:
        return _ROADMAP_SYSTEM

    def roadmap_user_template(self) -> str:
        return _ROADMAP_USER_TEMPLATE


# --- end: generic-class --------------------------------------------------
