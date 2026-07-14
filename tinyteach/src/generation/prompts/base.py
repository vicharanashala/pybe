"""Language-prompt abstract base (Template Method — GoF).

Each language subclass fills in four string templates:
- ``case_study_system_block()``: the SYSTEM message for case studies
- ``case_study_user_template()``: the USER template for case studies
- ``roadmap_system_block()``:    the SYSTEM message for roadmaps
- ``roadmap_user_template()``:   the USER template for roadmaps

All templates use ``string.Template`` syntax (``$var`` / ``${var}``).
Substitution happens in ``PromptBuilder.build_*_prompt()``.
"""

from __future__ import annotations

from abc import ABC, abstractmethod


class BaseLanguagePrompt(ABC):
    """Template-Method skeleton for language-specific prompt rendering."""

    @property
    @abstractmethod
    def language_name(self) -> str:
        """Lower-case identifier (``"python"``, ``"java"``, ``"cpp"``, ``"generic"``)."""

    # --- begin: case-study-templates ------------------------------------
    @abstractmethod
    def case_study_system_block(self) -> str:
        """Locked system message for case-study generation.

        Subclasses MUST copy the locked prompt from
        ``PROJECT_BLUEPRINT.md`` §12.1 verbatim — the validator and the
        case-study invariant tests assume that content.
        """

    @abstractmethod
    def case_study_user_template(self) -> str:
        """``string.Template`` for the case-study USER message.

        Variables consumed by ``PromptBuilder``:
        ``topic``, ``language``, ``book_id``, ``top_k``, ``context_chunks``.
        """

    # --- end: case-study-templates --------------------------------------

    # --- begin: roadmap-templates ----------------------------------------
    @abstractmethod
    def roadmap_system_block(self) -> str:
        """Locked system message for roadmap generation (§12.3)."""

    @abstractmethod
    def roadmap_user_template(self) -> str:
        """``string.Template`` for the roadmap USER message.

        Variables: ``topic``, ``language``, ``case_studies_json``.
        """

    # --- end: roadmap-templates -----------------------------------------
