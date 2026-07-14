"""Demo LLM provider (Concrete Strategy — GoF).

Phase-8 worked example: an LLMProvider that returns a hardcoded, valid
JSON response without making any network call. It is registered as
``"demo"`` in ``LLMProviderFactory._REGISTRY`` so users can
``export LLM_PROVIDER=demo`` (or pick it from the sidebar) to try
TinyTeach end-to-end with zero API cost.

The canned responses live in sibling JSON files
(``demo_data/case_study.json``, ``demo_data/roadmap.json``) rather than
inline strings -- this keeps the JSON out of Python source so that
``ruff format`` cannot accidentally collapse ``\\n`` escape sequences
into real newlines (which would make the canned response fail
``json.loads`` parsing).

What it returns:

- For ``TOPIC_NOT_IN_BOOK``-style outputs (``generate_case_studies``,
  ``generate_roadmap``): a minimal valid JSON envelope with 1 synthetic
  study and 1 milestone. The validator is happy; the UI shows something;
  the user can iterate without waiting on a real LLM.

- The provider is intentionally SIMPLE. Real customisations belong in a
  user's own subclass (see ``docs/EXTENDING.md``).

Why it exists:

- Cuts the cold-path tail-latency of the demo button to zero.
- Serves as the canonical "how to add a new LLM" walkthrough.
- Validates the provider contract end-to-end without a network.
"""

from __future__ import annotations

import json
import logging
from importlib import resources
from pathlib import Path

from src.config.settings import Settings
from src.generation.providers.base import LLMProvider

logger = logging.getLogger(__name__)


# --- begin: canned-response-loader --------------------------------------
def _load_canned(filename: str) -> str:
    """Load a canned JSON response from ``demo_data/`` and return it as a string.

    Using ``importlib.resources`` keeps the test working when the package
    is zipped or installed editable. The returned string IS valid JSON --
    the loader reads raw bytes from a ``.json`` file that Python does NOT
    touch, so ``\\n`` escape sequences survive untouched.
    """
    raw = (
        resources.files("src.generation.providers.demo_data")
        .joinpath(filename)
        .read_text(encoding="utf-8")
    )
    # Sanity-check: the loaded string MUST be valid JSON. If it isn't,
    # the .json file on disk is corrupted -- fail loud.
    try:
        json.loads(raw)
    except json.JSONDecodeError as exc:
        raise RuntimeError(
            f"Canned response {filename} is not valid JSON: {exc}. "
            "Did ruff format introduce a real newline?"
        ) from exc
    return raw


# --- end: canned-response-loader ----------------------------------------


# --- begin: demo-provider -------------------------------------------------
class DemoLLMProvider(LLMProvider):
    """LLMProvider that returns a hardcoded response.

    Useful for:

    - CI tests that need a deterministic LLM (already covered by ``LLMProvider``
      fakes in ``tests/unit/providers_test_helpers.py`` -- this provider is the
      production-facing equivalent).
    - "Show me what TinyTeach does" flows on the live HF Space without burning
      rate limit.
    - A worked example for ``docs/EXTENDING.md``.
    """

    def __init__(self, settings: Settings | None = None) -> None:
        # ``settings`` is accepted for interface compatibility with
        # ``LLMProviderFactory.from_settings``; the demo provider does
        # not use any of them. Marked optional so existing test fakes
        # that pass no args still work.
        self._settings = settings
        # Load the canned responses once at construction time -- cheap
        # and lets us fail loudly at import if a .json file is broken.
        self._case_study_response = _load_canned("case_study.json")
        self._roadmap_response = _load_canned("roadmap.json")

    @property
    def name(self) -> str:
        return "demo"

    def is_available(self) -> bool:
        """The demo provider is always available -- that's the point."""
        return True

    def generate(self, system: str, user: str) -> str:
        """Return one of two canned JSON strings based on the call signature.

        Heuristic: prompt-builder sets ``case_studies_json`` in the user
        template when building a ROADMAP prompt. We use that as the
        discriminator. Falls back to the case-study response otherwise.
        """
        # ``Builder.build_roadmap_prompt`` substitutes ``case_studies_json``
        # into the user template, so its presence is a reliable marker.
        is_roadmap = "case_studies_json" in (user or "")
        canned = self._roadmap_response if is_roadmap else self._case_study_response
        logger.info(
            "demo provider: returning canned response",
            extra={
                "where": "generation.providers.demo",
                "is_roadmap": is_roadmap,
                "response_bytes": len(canned),
            },
        )
        return canned


# --- end: demo-provider ---------------------------------------------------


# A factory hook lets settings expose the demo provider without
# constructing it eagerly at import time.
def build_demo_provider(settings: Settings) -> DemoLLMProvider:
    """Build a ``DemoLLMProvider`` -- settings are ignored by design."""
    return DemoLLMProvider(settings)


# Silence "imported but unused" for the side-effect of pre-loading paths.
_ = Path
