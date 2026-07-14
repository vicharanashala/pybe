"""Prompt builder (Builder — GoF).

Assembles the final ``(system, user)`` pair for each LLM call from:
- the locked system block (per language)
- the user template (per language, with placeholders)
- the few-shot anchor (always prepended to the user message)
- the runtime values: topic, language, book_id, top_k, context_chunks

Strings use ``string.Template`` syntax (``$var`` / ``${var}``); the
builder substitutes them with ``safe_substitute`` so a missing key is
left as-is rather than raising — that makes template editing safer
during development.
"""

from __future__ import annotations

from string import Template

from src.generation.prompts.base import BaseLanguagePrompt
from src.generation.prompts.few_shots import FEW_SHOT_CASE_STUDY


# --- begin: prompt-builder ------------------------------------------------
class PromptBuilder:
    """Renders ``(system, user)`` pairs for case-study and roadmap calls."""

    def __init__(self, language_prompt: BaseLanguagePrompt) -> None:
        self._prompt = language_prompt

    @property
    def language_prompt(self) -> BaseLanguagePrompt:
        return self._prompt

    # --- begin: case-study-prompt -----------------------------------------
    def build_case_study_prompt(
        self,
        *,
        topic: str,
        book_id: str,
        top_k: int,
        context_chunks: list[str],
    ) -> tuple[str, str]:
        """Return ``(system, user)`` for a case-study generation call.

        ``context_chunks`` are joined with a blank line. The few-shot
        anchor is always prepended to the user message so the LLM sees
        a single concrete example of the expected shape.
        """
        system = self._prompt.case_study_system_block()
        user_template = self._prompt.case_study_user_template()
        chunks_text = "\n\n".join(context_chunks)
        user_body = Template(user_template).safe_substitute(
            topic=topic,
            language=self._prompt.language_name,
            book_id=book_id,
            top_k=str(top_k),
            context_chunks=chunks_text,
        )
        # The few-shot anchor goes FIRST so the model can pattern-match
        # the JSON shape, then the actual request follows.
        user = f"{FEW_SHOT_CASE_STUDY}\n\n{user_body}"
        return system, user

    # --- end: case-study-prompt -------------------------------------------

    # --- begin: roadmap-prompt --------------------------------------------
    def build_roadmap_prompt(
        self,
        *,
        topic: str,
        case_studies_json: str,
    ) -> tuple[str, str]:
        """Return ``(system, user)`` for a roadmap generation call."""
        system = self._prompt.roadmap_system_block()
        user_template = self._prompt.roadmap_user_template()
        user = Template(user_template).safe_substitute(
            topic=topic,
            language=self._prompt.language_name,
            case_studies_json=case_studies_json,
        )
        return system, user

    # --- end: roadmap-prompt ----------------------------------------------


# --- end: prompt-builder -------------------------------------------------
