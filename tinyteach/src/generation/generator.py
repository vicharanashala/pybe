"""Generation facade (Facade — GoF).

Centralises prompt-build → LLM-call → validate, including the
schema-failure retry loop mandated by the blueprint §13 Phase 5
(deliverable 1 + 2).

The LLM is wrapped in the project's default decorator stack (cache +
retry + logging) at the container layer. The schema retry handled here
is orthogonal: that decorator retries on transport errors (429,
timeouts); THIS facade retries on **content** errors (the LLM replied,
but the reply did not parse or did not match the schema).
"""

from __future__ import annotations

import logging
from typing import Any

from src.config.settings import Settings
from src.domain.case_study import CaseStudySet
from src.domain.errors import (
    GenerationSchemaError,
    ProviderUnavailableError,
    TopicNotInBookError,
)
from src.domain.roadmap import Roadmap
from src.generation.prompts.builder import PromptBuilder
from src.generation.providers.base import LLMProvider
from src.generation.validator import (
    case_study_set_to_json,
    validate_case_studies,
    validate_roadmap,
)

logger = logging.getLogger(__name__)


# --- begin: feedback-formatting -------------------------------------------
_RETRY_PROMPT_TAIL = """

---

Your previous response failed schema validation. Errors reported:
{errors}

Re-emit a single JSON object matching the schema exactly. No prose, no markdown fences, no trailing commas, no comments. Just the JSON.
"""


def _cap(text: str, *, max_chars: int = 600) -> str:
    """Truncate ``text`` to ``max_chars`` with a marker if cut."""
    if len(text) <= max_chars:
        return text
    return text[:max_chars] + "\n… (truncated)"


# --- end: feedback-formatting --------------------------------------------


# --- begin: generation-facade --------------------------------------------
class GenerationFacade:
    """Orchestrate prompt → LLM → validate, with a schema-failure retry loop."""

    def __init__(
        self,
        *,
        settings: Settings,
        llm: LLMProvider,
        prompt_builder: PromptBuilder,
    ) -> None:
        self._settings = settings
        self._llm = llm
        self._builder = prompt_builder

    # --- begin: generate-case-studies -----------------------------------
    def generate_case_studies(
        self,
        *,
        topic: str,
        book_id: str,
        top_k: int,
        context_chunks: list[str],
    ) -> CaseStudySet:
        """Build prompt → call LLM → validate; retry on schema failure.

        Raises ``TopicNotInBookError`` if the LLM signals the topic is
        not covered (I-9). Raises ``GenerationSchemaError`` after
        ``settings.gen_max_retries`` failed attempts.
        """
        system, user_base = self._builder.build_case_study_prompt(
            topic=topic,
            book_id=book_id,
            top_k=top_k,
            context_chunks=context_chunks,
        )
        return self._call_with_schema_retry(
            system=system,
            user_base=user_base,
            parse=lambda raw: validate_case_studies(raw, topic=topic, book_id=book_id),
            op_name="case_studies",
        )

    # --- end: generate-case-studies -----------------------------------

    # --- begin: generate-roadmap ---------------------------------------
    def generate_roadmap(
        self,
        *,
        topic: str,
        book_id: str,
        case_study_set: CaseStudySet,
    ) -> Roadmap:
        """Build roadmap prompt from a previously-generated case-study set."""
        case_studies_json = case_study_set_to_json(case_study_set)
        system, user_base = self._builder.build_roadmap_prompt(
            topic=topic,
            case_studies_json=case_studies_json,
        )
        return self._call_with_schema_retry(
            system=system,
            user_base=user_base,
            parse=lambda raw: validate_roadmap(
                raw,
                topic=topic,
                book_id=book_id,
                n_case_studies=len(case_study_set.studies),
            ),
            op_name="roadmap",
        )

    # --- end: generate-roadmap -----------------------------------------

    # --- begin: schema-retry-loop --------------------------------------
    def _call_with_schema_retry(
        self,
        *,
        system: str,
        user_base: str,
        parse: Any,
        op_name: str,
    ) -> Any:
        """Generic retry loop: try → parse → on schema-error, append feedback."""
        max_attempts = max(1, self._settings.gen_max_retries + 1)
        last_exc: GenerationSchemaError | None = None

        for attempt in range(1, max_attempts + 1):
            # --- begin: build-user-message -----------------------------
            if last_exc is None:
                user = user_base
            else:
                feedback = _cap(str(last_exc))
                user = user_base + _RETRY_PROMPT_TAIL.format(errors=feedback)
            # --- end: build-user-message -------------------------------

            logger.info(
                "llm call attempt",
                extra={
                    "where": "generation.generator.GenerationFacade",
                    "op": op_name,
                    "attempt": attempt,
                    "max_attempts": max_attempts,
                },
            )
            try:
                raw = self._llm.generate(system, user)
            except TopicNotInBookError:
                # I-9 sentinel — never retry; surface immediately.
                raise
            except ProviderUnavailableError:
                # Retry decorator already handled transport retries.
                # If we still land here, propagate to the caller.
                raise

            # --- begin: parse-and-handle-errors ------------------------
            try:
                result = parse(raw)
            except TopicNotInBookError:
                raise  # I-9 — no retry
            except GenerationSchemaError as exc:
                last_exc = exc
                logger.warning(
                    "schema validation failed; will retry",
                    extra={
                        "where": "generation.generator.GenerationFacade",
                        "op": op_name,
                        "attempt": attempt,
                        "max_attempts": max_attempts,
                    },
                )
                continue
            # --- end: parse-and-handle-errors ------------------------

            if attempt > 1:
                logger.info(
                    "schema recovered after retry",
                    extra={
                        "where": "generation.generator.GenerationFacade",
                        "op": op_name,
                        "attempt": attempt,
                    },
                )
            return result

        # Exhausted all attempts.
        raise GenerationSchemaError(
            f"GenerationFacade.{op_name}: exhausted {max_attempts} attempts. "
            f"Last error: {last_exc}"
        )

    # --- end: schema-retry-loop ----------------------------------------


# --- end: generation-facade ------------------------------------------------


# --- begin: helpers-for-the-services-layer ---------------------------------
def teaching_result_to_status_dict(
    case_studies: CaseStudySet, roadmap: Roadmap | None
) -> dict[str, Any]:
    """Convert a (case_studies, roadmap) pair to a JSON-serialisable dict.

    Used by the teaching service (and ultimately the UI). ``roadmap`` is
    ``None`` when the topic is not in the book.
    """
    payload: dict[str, Any] = {"case_studies": case_studies.to_dict()}
    if roadmap is not None:
        payload["roadmap"] = roadmap.to_dict()
    return payload


# --- end: helpers-for-the-services-layer -----------------------------------
