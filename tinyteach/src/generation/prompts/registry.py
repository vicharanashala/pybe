"""Prompt registry (Factory + Service Locator — GoF).

Auto-discovers language prompts from ``src/generation/prompts/languages/``.
Adding a new language = drop a new ``<lang>.py`` file that subclasses
``BaseLanguagePrompt``; no edit to this file is required (invariant: Phase 8
acceptance criterion).

Resolution rules:
- Missing version → current version (``v1``).
- Unknown language at current version → fall back to ``generic`` at the same
  version (which itself lives as ``generic.py`` in the languages package).
- Unknown version → ``ConfigError`` (a misconfigured deployment, not a
  runtime fallback).

The eager ``from src.generation.prompts.languages import ...`` block at the
top of this module is the canonical way to make auto-discovery stable on
editable installs where ``pkgutil.iter_modules`` might miss unimported
modules — every shipped language is imported once here so it lands in
``sys.modules`` and the iterative scan can find it.
"""

from __future__ import annotations

import importlib
import inspect
import logging
import pkgutil

from src.domain.errors import ConfigError
from src.generation.prompts import languages as _languages_pkg
from src.generation.prompts.base import BaseLanguagePrompt
from src.generation.prompts.languages import (  # noqa: F401 — eager import for auto-discovery
    cpp,
    generic,
    java,
    python,
    rust,
)

logger = logging.getLogger(__name__)

# The currently-supported version. Adding a ``v2`` becomes a sibling
# import + scan; ``resolve`` then chooses based on the version string.
_CURRENT_VERSION = "v1"

# Modules inside the languages package we must NOT register as languages.
# (Sub-modules that aren't language files — currently none, but the filter
# keeps the door open for future shared utilities.)
_NON_LANGUAGE_MODULES = frozenset({"base", "registry", "builder", "few_shots"})


# --- begin: auto-discovery ------------------------------------------------
def _discover_language_table() -> dict[tuple[str, str], type[BaseLanguagePrompt]]:
    """Scan ``languages/`` and return ``(version, language) -> class``.

    For every public module that contains a concrete subclass of
    ``BaseLanguagePrompt``, we instantiate it once to read its
    ``language_name`` and register it under ``(_CURRENT_VERSION, name)``.

    Empty / abstract / non-language modules are silently skipped — a future
    helper module (e.g. ``languages/_shared.py``) won't break the registry.
    """
    table: dict[tuple[str, str], type[BaseLanguagePrompt]] = {}
    for module_info in pkgutil.iter_modules(_languages_pkg.__path__):
        name = module_info.name
        if name.startswith("_") or name in _NON_LANGUAGE_MODULES:
            continue
        full = f"{_languages_pkg.__name__}.{name}"
        module = importlib.import_module(full)
        for _, cls in inspect.getmembers(module, inspect.isclass):
            if cls is BaseLanguagePrompt:
                continue
            if not issubclass(cls, BaseLanguagePrompt):
                continue
            try:
                instance = cls()
            except Exception as exc:  # noqa: BLE001
                logger.warning(
                    "prompt registry: skipping unloadable language module",
                    extra={
                        "where": "generation.prompts.registry",
                        "module": full,
                        "exception_type": exc.__class__.__name__,
                    },
                )
                continue
            lang = instance.language_name
            table[(_CURRENT_VERSION, lang)] = cls
            logger.info(
                "prompt registry: discovered language",
                extra={"where": "generation.prompts.registry", "language": lang},
            )
    return table


# --- end: auto-discovery --------------------------------------------------


# --- begin: registry ------------------------------------------------------
class PromptRegistry:
    """Resolve ``(language, version)`` → ``BaseLanguagePrompt`` instance."""

    # --- begin: registry-table -------------------------------------------
    # Auto-populated at class-definition time by scanning the languages
    # package. To add a new language, drop ``languages/<name>.py`` — no
    # edit to this file is needed.
    _TABLE: dict[tuple[str, str], type[BaseLanguagePrompt]] = _discover_language_table()
    _FALLBACK_LANGUAGE = "generic"
    # --- end: registry-table --------------------------------------------

    @classmethod
    def resolve(cls, language: str, version: str | None = None) -> BaseLanguagePrompt:
        """Return the prompt class for ``(version, language)``.

        Resolution rules:
        - Missing version → current version.
        - Unknown version → ``ConfigError``.
        - Unknown language at current version → fall back to ``generic``.
        """
        v = version or _CURRENT_VERSION
        if v not in cls.known_versions():
            raise ConfigError(f"Unknown prompt version: {v!r}. Known: {cls.known_versions()}")
        cls_ = cls._TABLE.get((v, language))
        if cls_ is not None:
            return cls_()
        # Try the fallback language at the same version.
        if language != cls._FALLBACK_LANGUAGE:
            cls_ = cls._TABLE.get((v, cls._FALLBACK_LANGUAGE))
            if cls_ is not None:
                return cls_()
        raise ConfigError(
            f"No prompt registered for (language={language!r}, version={v!r}). "
            f"Known languages at v={v}: {sorted(lang for ver, lang in cls._TABLE if ver == v)}"
        )

    @classmethod
    def known_versions(cls) -> list[str]:
        """Return the sorted list of registered versions."""
        return sorted({v for v, _ in cls._TABLE})

    @classmethod
    def known_languages(cls, version: str | None = None) -> list[str]:
        """Return the sorted list of registered languages for a version."""
        v = version or _CURRENT_VERSION
        return sorted({lang for ver, lang in cls._TABLE if ver == v})

    @classmethod
    def refresh(cls) -> None:
        """Re-scan the ``languages/`` package and rebuild the table.

        Useful for tests that create a temporary language module at
        runtime. Production code should never need to call this.
        """
        cls._TABLE = _discover_language_table()


# --- end: registry -------------------------------------------------------
