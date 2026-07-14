# Extending TinyTeach

> How to add a new programming language, a new LLM provider, or a new
> golden sample — without editing TinyTeach's core.

TinyTeach is built around three extension points:

| Extension point | Where to add | What gets touched |
|---|---|---|
| **New programming language** | `src/generation/prompts/languages/<lang>.py` | Nothing else — the registry auto-discovers it. |
| **New LLM provider** | `src/generation/providers/<name>.py` + one dict entry in `factory.py` | Two files: the provider class + a factory registration. |
| **New golden sample** | `data/golden/<lang>/<topic>.json` + one entry in `loader.py` | Two files: the JSON + a topic-list entry. |

All three follow the same shape: add a file, register it in one obvious place, write a test. Below: a worked example for each.

---

## Table of Contents

1. [Adding a new language — `Go`](#1-adding-a-new-language--go)
2. [Adding a new LLM — `DemoLLMProvider` (Phase 8 worked example)](#2-adding-a-new-llm--demollmprovider-phase-8-worked-example)
3. [Adding a new golden sample — `Go/goroutines.json`](#3-adding-a-new-golden-sample--gogoroutinesjson)
4. [Adding a new prompt version (`v2`)] (#4-adding-a-new-prompt-version-v2)
5. [Testing extensions](#5-testing-extensions)
6. [Design principles at play](#6-design-principles-at-play)

---

## 1. Adding a new language — `Go`

> **Time to do:** ~5 min for a generic placeholder, ~30 min for a tuned prompt.
> **Files touched:** 1 (`src/generation/prompts/languages/go.py`).

### Step 1.1 — create the file

```bash
touch src/generation/prompts/languages/go.py
```

### Step 1.2 — paste this starter

```python
"""Go language prompt — placeholder, delegates to GenericLanguagePrompt.

Adding this file is the entire "add a new language" workflow:

    1. Drop ``src/generation/prompts/languages/go.py`` (this file).
    2. Flip ``PROMPT_LANGUAGE=go`` in ``.env`` (or via the sidebar).
    3. Re-upload a Go book. Done.

No edit to ``registry.py`` is required — the registry auto-discovers
this module on next import (see ``registry._discover_language_table``).
"""

from __future__ import annotations

from src.generation.prompts.languages.generic import GenericLanguagePrompt


class GoLanguagePrompt(GenericLanguagePrompt):
    """Identical content to ``GenericLanguagePrompt``; lives here for symmetry."""

    @property
    def language_name(self) -> str:
        return "go"
```

### Step 1.3 — flip the knob

Two ways to use `go`:
- In the Streamlit sidebar, pick "go" from the "Prompt language" dropdown.
- In `.env`: `PROMPT_LANGUAGE=go`.

### Step 1.4 — verify it works

```python
>>> from src.generation.prompts.registry import PromptRegistry
>>> p = PromptRegistry.resolve("go")
>>> p.language_name
'go'
>>> "go" in PromptRegistry.known_languages()
True
```

The expected-output language tag in the Markdown download is now
` ```go ` instead of ` ```python ` automatically (see `view_models.case_study_to_markdown`).

### Step 1.5 — (optional) tighten the prompt

For a generic placeholder, the LLM still produces Go snippets correctly.
For a *better* prompt, override `case_study_system_block()` with
Go-specific guidance:

```python
class GoLanguagePrompt(BaseLanguagePrompt):  # not GenericLanguagePrompt
    @property
    def language_name(self) -> str:
        return "go"

    def case_study_system_block(self) -> str:
        # Re-use the locked system block from §12.1, plus Go-flavored lines.
        return _CASE_STUDY_SYSTEM + (
            "\n11. Always use idiomatic Go: error returns (not exceptions),\n"
            "    goroutines launched with `go f()`, channels for communication,\n"
            "    and `defer` for cleanup.\n"
        )

    def case_study_user_template(self) -> str:
        return _CASE_STUDY_USER_TEMPLATE

    def roadmap_system_block(self) -> str:
        return _ROADMAP_SYSTEM

    def roadmap_user_template(self) -> str:
        return _ROADMAP_USER_TEMPLATE
```

Import the locked `_CASE_STUDY_SYSTEM`, `_ROADMAP_SYSTEM`, etc. from `languages.python` —
the locked content lives there once, never copy-paste it.

### Why this works (architecturally)

The `PromptRegistry` scans `src/generation/prompts/languages/` at import
time via `pkgutil.iter_modules`, finds every concrete subclass of
`BaseLanguagePrompt`, and reads `language_name` to register it. There is
**no central list to update** — adding a file is the entire workflow.

---

## 2. Adding a new LLM — `DemoLLMProvider` (Phase 8 worked example)

> **Time to do:** ~10 min.
> **Files touched:** 2 (provider + factory registration).

### Step 2.1 — create the provider file

```bash
touch src/generation/providers/demo_provider.py
```

### Step 2.2 — paste the implementation

```python
"""Demo LLM provider (Concrete Strategy — GoF)."""

from __future__ import annotations

from src.config.settings import Settings
from src.generation.providers.base import LLMProvider


class DemoLLMProvider(LLMProvider):
    """Always returns a hardcoded JSON string; no network call."""

    def __init__(self, settings: Settings | None = None) -> None:
        self._settings = settings

    @property
    def name(self) -> str:
        return "demo"

    def is_available(self) -> bool:
        return True

    def generate(self, system: str, user: str) -> str:
        # Canned response — see Phase 8 source for the full JSON.
        return '{"topic": "demo", "case_studies": [...]}'
```

The decorator stack (`@with_cache`, `@with_retry_and_backoff`,
`@with_logging`) wraps your provider automatically — implemented in
`LLMProviderFactory.from_settings()` via `apply_default_decorators()`.

### Step 2.3 — register in the factory

Edit `src/generation/providers/factory.py`:

```python
# --- imports ---
from src.generation.providers.demo_provider import DemoLLMProvider

# --- in the class body ---
class LLMProviderFactory:
    _REGISTRY: dict[str, type[LLMProvider]] = {
        "hf_inference": HFInferenceProvider,
        "hf_local": HFLocalProvider,
        "groq": GroqProvider,
        "ollama": OllamaProvider,
        "demo": DemoLLMProvider,   # <-- add this line
    }

    # ``demo`` is intentionally NOT in the fallback chain -- it's never
    # silently substituted because the user opting into it is deliberate.
```

### Step 2.4 — extend the pydantic Literal in `Settings`

Edit `src/config/settings.py`:

```python
llm_provider: Literal["hf_inference", "hf_local", "groq", "ollama", "demo"] = Field(
    default="hf_inference"
)
```

Now `Settings(llm_provider="demo")` is valid; `LLM_PROVIDER=demo` in `.env` works; and the sidebar radio can include it.

### Step 2.5 — verify

```python
>>> from src.config.settings import Settings
>>> from src.generation.providers.factory import LLMProviderFactory
>>> p = LLMProviderFactory.from_settings(Settings(llm_provider="demo"))
>>> p.name
'demo'
>>> p.generate("s", "u")
'{"topic": "demo", "case_studies": [...]}'
```

### Why this works (architecturally)

The factory's `_REGISTRY` is a single dict; the constructor signature
must accept `Settings` (or accept it optionally); the provider must
implement `name`, `is_available`, `generate`. Three methods, two dict
entries, one Literal — and the new LLM is fully wired.

---

## 3. Adding a new golden sample — `Go/goroutines.json`

> **Time to do:** ~15 min (writing the JSON), more for a polished sample.
> **Files touched:** 2 (the JSON file + one entry in the loader).

### Step 3.1 — write the JSON

Save `data/golden/go/goroutines.json` with this shape (a complete
`TeachingResult`):

```json
{
  "topic": "goroutines",
  "book_id": "demo_go_goroutines",
  "language": "go",
  "is_demo": true,
  "case_studies": [
    {
      "title": "...",
      "concept": "Goroutines",
      "difficulty": "novice",
      "scenario": "...",
      "task": "...",
      "starter_code": "package main\n\nfunc main() {\n    go func(){ println(\"hi\") }()\n}",
      "expected_output": "hi\n",
      "real_world_analogy": "...",
      "fun_fact": "...",
      "hints": ["...", "..."],
      "learning_objective": "..."
    }
  ],
  "roadmap": {
    "topic": "goroutines",
    "book_id": "demo_go_goroutines",
    "estimated_hours": 8,
    "milestones": [
      {
        "name": "...",
        "description": "...",
        "case_study_index": 0,
        "success_criteria": ["...", "..."]
      }
    ]
  }
}
```

### Step 3.2 — register the topic

Edit `src/golden/loader.py`, in the `_GOLDEN_TOPICS_BY_LANGUAGE` dict:

```python
_GOLDEN_TOPICS_BY_LANGUAGE: dict[str, tuple[str, ...]] = {
    "python": ("decorators", "generators", "comprehensions"),
    "java":   ("inheritance", "streams", "generics"),
    "cpp":    ("pointers", "raii", "templates"),
    "rust":   ("ownership", "lifetimes", "traits"),
    "go":     ("goroutines",),  # <-- add this line
    "generic": ("decorators",),
}
```

If you want this topic to be the default shown on the Demo button, also
update `_DEFAULT_DEMO_TOPIC`:

```python
_DEFAULT_DEMO_TOPIC: dict[str, str] = {
    "python": "decorators",
    "java": "inheritance",
    "cpp": "raii",
    "rust": "ownership",
    "go": "goroutines",  # <-- and here
    "generic": "decorators",
}
```

### Step 3.3 — verify

```python
>>> from src.golden import loader
>>> loader.load_demo("go", "goroutines").topic
'goroutines'
```

The Demo button in the sidebar now shows "Try a demo (goroutines)" when
"go" is the selected language.

### Quality bar for golden samples

Each sample should be polished enough to drop into a marketing demo:

- **Three case studies**, novice → intermediate → advanced, each focused on **one** concept.
- **Starter code** must compile/run (this is what users will copy-paste).
- **Real-world analogy** from history, biology, art, or daily life — *not* another programming concept.
- **Fun-fact** verifiable; ideally with a name, a date, or a number.
- **Hints**: 1-3, gentle → specific; never the final answer.

See `data/golden/README.md` for the schema and `tests/unit/test_golden_loader.py`
for the parametrised test that validates every file.

---

## 4. Adding a new prompt version (`v2`)

> **When to do this:** you want to change the *locked* prompt text in
> `languages/python.py` (or any language). Old versions stay forever
> for reproducibility.

### Step 4.1 — copy the file under a new name

```bash
cp src/generation/prompts/languages/python.py src/generation/prompts/languages/python_v2.py
```

### Step 4.2 — edit the new file

Adjust the system block. **The blueprint says prompts are LOCKED** —
adding a new version is the supported escape hatch for genuine
improvements. Don't be shy, but don't churn them either.

### Step 4.3 — register

In `src/generation/prompts/registry.py`:

```python
_CURRENT_VERSION = "v1"
_SECONDARY_VERSION = "v2"

_TABLE: dict[tuple[str, str], type[BaseLanguagePrompt]] = (
    _discover_language_table()
    | {
        (_SECONDARY_VERSION, "python"): PythonV2LanguagePrompt,
        # ... other v2 overrides ...
    }
)
```

Or, if you prefer, refactor `_discover_language_table` to accept a
version suffix per file (e.g. `python_v2.py` auto-registers as
`v2/python`).

### Step 4.4 — flip the knob

`.env`: `PROMPT_VERSION=v2`.

The registry falls back: unknown version → `ConfigError`; unknown
language at the current version → `generic`.

---

## 5. Testing extensions

Every extension has a test counterpart. The pattern is the same for all three:

### Language tests

```python
def test_go_is_auto_discovered() -> None:
    p = PromptRegistry.resolve("go")
    assert p.language_name == "go"
```

### LLM provider tests

```python
def test_demo_provider_is_selectable_from_settings() -> None:
    from src.generation.providers.factory import LLMProviderFactory
    provider = LLMProviderFactory.from_settings(Settings(llm_provider="demo"))
    assert provider.name == "demo"

def test_demo_provider_generates_valid_json() -> None:
    import json
    from src.generation.providers.demo_provider import DemoLLMProvider
    out = DemoLLMProvider().generate("s", "u")
    parsed = json.loads(out)
    assert "case_studies" in parsed
```

### Golden sample tests

```python
def test_go_goroutines_golden_loads() -> None:
    from src.golden import loader
    r = loader.load_demo("go", "goroutines")
    assert r.status == "ok"
    assert r.is_demo is True
    assert len(r.case_studies.studies) >= 1
```

The full smoke test lives in `tests/integration/test_phase8_extensions.py`
(it loads every golden file end-to-end via `TeachingService`).

---

## 6. Design principles at play

| Extension | GoF pattern | SOLID principle | Why |
|---|---|---|---|
| New language | Template Method (GoF) | OCP — open for extension | Each language overrides `case_study_system_block()` etc., reuses the locked prompt skeleton. |
| New LLM | Strategy (GoF) | OCP + LSP | Drop in any `LLMProvider` subclass with a `generate(system, user) -> str` method; the factory + decorator stack don't change. |
| New golden sample | Adapter (GoF) | SRP | The loader adapts on-disk JSON to the runtime DTOs; the rest of the app sees a `TeachingResult`, not a file. |
| New prompt version | Service Locator (GoF) | OCP | Old versions live alongside new; no caller has to change. |

**Why the registration is centralised, not file-based:**

- The **language registry** *is* file-based (auto-discovery via `pkgutil.iter_modules`).
  Adding a language touches 1 file.
- The **LLM factory** uses a single dict because LLM providers have
  runtime configuration (tokens, base URLs) that must match the
  `Settings` class. Adding an LLM touches 2 files.
- The **golden loader** uses a single dict because new topics need to
  be discoverable by the UI. Adding a sample touches 2 files.

This matches the Liskov substitution principle: every registered
implementations is drop-in interchangeable with no caller change.

---

## See also

- [`PROJECT_BLUEPRINT.md`](../PROJECT_BLUEPRINT.md) — full spec, invariants, phase plan
- [`context.md`](../context.md) — current state, what's done, compatibility patches
- `data/golden/README.md` — schema + folder layout for golden samples
- `src/golden/loader.py` — minimal JSON-to-`TeachingResult` adapter (~150 lines)
- `src/generation/providers/demo_provider.py` — the worked-example LLM
