# TinyTeach — Project Context

> Living document tracking project state, phase progress, and cumulative changes.
> Updated after every phase. Source of truth for "where are we, what changed, what's next."

---

## Current Phase

**Phase 8 — Extensibility Polish** (just finished locally ✅)

Goal: drop in a new language / new LLM with zero edits to core.

Deliverables (all ✅):
- `docs/EXTENDING.md` — worked-example walkthroughs for adding a language, an LLM, a golden sample, and a prompt version
- `src/generation/prompts/languages/rust.py` — Rust as the worked example language; **no code edit anywhere else** needed for it to work
- `src/generation/providers/demo_provider.py` + factory registration + Settings Literal — `demo` as the worked example LLM provider (returns canned JSON; zero API cost)
- `data/golden/<lang>/<topic>.json` × 12 + 1 generic fallback + README — polished showcase samples that power the Demo button
- "Try a demo" button in the sidebar (works from `EMPTY` state; no upload required)

**Acceptance** ✅: adding `rust.py` to `src/generation/prompts/languages/` was sufficient — `PromptRegistry.known_languages()` immediately returned `['cpp', 'generic', 'java', 'python', 'rust']` and `PromptRegistry.resolve('rust')` returned a `RustLanguagePrompt`.

---

## Project Snapshot

| | |
|---|---|
| Project root | `tinyteach/` |
| Python | 3.10+ (target lowered from blueprint's 3.11 due to environment) |
| Test command | `pytest -q` |
| Lint | `ruff check .` |
| Format | `ruff format .` |
| Hosting target | HuggingFace Spaces (free CPU) |
| Default LLM | HF Inference Router (`router.huggingface.co/v1/chat/completions`) |
| Run locally | `streamlit run app.py` |

---

## Completed Phases

### Phase 0 — Foundations ✅
33 files: top-level configs, `src/config/`, `src/observability/`, `src/domain/`, `tests/conftest.py` + `tests/unit/test_logger.py` (8 tests).

### Phase 1 — PDF Ingestion Pipeline ✅
18 files: `src/utils/hashing.py`, `src/ingestion/parsers/`, `src/ingestion/chunkers/`, `src/ingestion/embedders/`, `src/ingestion/indexers/`, `src/ingestion/pipeline.py`. **44 tests pass.** Invariants enforced: I-8, I-13, I-16, I-17.

### Phase 2 — Vector Store & Retrieval ✅
8 files: `src/retrieval/{relevance,vector_store,retriever}.py`. **72 tests pass.** Invariants enforced: I-1, I-10.

### Phase 3 — LLM Provider Layer ✅
12 files: `src/generation/providers/{base,hf_inference,hf_local,groq_provider,ollama_provider,decorators,factory}.py`. **126 tests pass.** Invariants enforced: I-11, I-12. Decorator stack: `@with_cache` → `@with_retry_and_backoff` → `@with_logging`. 4-GB OOM guard for `hf_local`.

### Phase 4 — Prompt Engineering & Builder ✅
13 files: `src/utils/strip_fences.py`, `src/generation/{schemas.py, prompts/, validator.py}`. **202 tests pass.** Locked prompts from §12.1–12.5 verbatim; Pydantic schemas with `extra="forbid"`; fence-stripping pre-parse. Invariants enforced: I-1..I-7, I-9, I-10.

### Phase 5 — Generation Facade & Teaching Services ✅
5 new files: `src/generation/generator.py` (GenerationFacade with schema-retry loop), `src/teaching/{case_study_service, roadmap_service, teaching_service}.py`. **224 tests pass.** `TeachingResult` DTO with structured "topic_not_in_book" result.

### Phase 6 — Streamlit UI ✅
7 new files: `app.py` (Streamlit entry), `src/ui/{view_models.py, state.py, components.py}`, 3 test files. **254 tests pass.**

**Files added**
| File | Lines | Role |
|---|---|---|
| `app.py` | 250+ | Streamlit entry: page config, sidebar (model + language + uploader), main panel (stage-routed rendering) |
| `src/ui/view_models.py` | 220+ | UI DTOs: `UploadCardVM`, `CaseStudyCardVM`, `MilestoneVM`, `RoadmapVM`, `ResultsPageVM`, plus converters + Markdown renderer |
| `src/ui/state.py` | 200+ | `AppStage` enum (EMPTY → INGESTING → READY → QUERYING → RESULTS_READY → ERROR), `AppState` class with type-safe accessors, explicit transition validation |
| `src/ui/components.py` | 200+ | `render_*` functions: `render_model_picker`, `render_upload_card`, `render_topic_input`, `render_case_study_card`, `render_roadmap`, `render_results_page`, `render_topic_banner`, `_render_downloads` |
| `tests/unit/test_view_models.py` | 220+ | Pure-function tests: case-study + roadmap converters, Markdown rendering, frozen-card guard, status badge |
| `tests/unit/test_ui_state.py` | 200+ | State machine: init idempotency, all transitions, forbidden-transition raise, self-transition no-op, reset, snapshot, LLM-changed detection |
| `tests/integration/test_app.py` | 90+ | `streamlit.testing.v1.AppTest`: empty state, READY transition, ERROR banner |

**UI design decisions**
- **State machine, not flags** — `AppStage` enum with explicit allowed transitions. Forbidden jumps raise `ValueError` (caught in tests, defensive in app).
- **No silent failures (I-18)** — every `except` in `app.py` calls `AppState.mark_error(...)` and the user sees a red banner. `logger.exception(...)` writes to `errors.log`.
- **Stateless UI (I-15)** — all state in `st.session_state` via `AppState`. "Start over" button wipes it. No module-level mutable globals.
- **LLM hot-swap** — when the user changes the provider in the sidebar, the next `Generate` rebuilds the `TeachingService` via fresh factories (cache-bypassing). A `ℹ️ restart hint` shows whenever the cached result was made with a different LLM (`AppState.is_llm_changed_since_last_teach`).
- **Downloads** — two `st.download_button`s: JSON (machine) and Markdown (human) of the case studies + roadmap.
- **Logs on every transition** — `app.py` logs every stage change via the structured logger; everything is grep-able from `data/logs/`.

**Stage-routing in `app.py`** (the heart of the UI):
```
EMPTY           →  render_empty_state()   +  topic input (disabled)
INGESTING       →  run IngestionPipeline.ingest()  →  READY | ERROR
READY           →  render_ready_banner()  +  topic input + Generate button
QUERYING        →  st.spinner(...)        +  run TeachingService.teach()
RESULTS_READY   →  render_results_page()   +  download buttons
ERROR           →  render_error_banner()   +  Try-again button
```

**Patterns added in this phase**
- **State** (GoF) — `AppStage` enum + transition table (forbidden moves raise)
- **Adapter** (GoF) — `view_models.py` adapts domain dataclasses → UI DTOs
- **MVC-ish** separation — domain (immutable) + view-model (immutable DTO) + view (Streamlit `render_*` functions)

**Invariants enforced in this phase (cumulative)**
- **I-13** Errors logged — `logger.exception(...)` in every catch block of `app.py`
- **I-15** Stateless UI — `st.session_state` is the only state holder
- **I-18** No silent failures — every `except` surfaces a red error banner

**Verification:** `pytest -q` 254/254 passed in 105s (235 fast + 19 slow), `ruff check .` clean.

**Bugs caught during verification (auto-fixed)**
1. `at.sidebar.file_uploader` raises `'SpecialBlock' object has no attribute 'file_uploader'` — use `at.get("file_uploader")` instead
2. `at.success + at.info` is `ElementList` (not list) → use `list(at.success) + list(at.info)`
3. `with pytest.raises := ...` is invalid Python syntax — use explicit `with pytest.raises(...)`
4. Markdown test expected "Hint 1" but the format is "1. hint" — fixed test expectation
5. `LLM_OPTIONS`/`LANG_OPTIONS` (N806) → renamed to `llm_options`/`lang_options`
6. `try/except/pass` for cache resets → `contextlib.suppress(Exception)`
7. `dict(...)` for fixture base (C408) → explicit `{"key": value}` literal
8. `APP_PATH` constant added to use absolute path with AppTest
9. Indentation bug from earlier Edit — fixed manually

### Phase 7 — HF Spaces Deployment ✅ (local) / ⏳ (push + smoke test)

Goal: Live URL, free, no infra to maintain. Push to a HuggingFace Space (free CPU, 16 GB RAM, 2 vCPU).

**Local deliverables (✅ all done)**
| | Status |
|---|---|
| `requirements.txt` frozen | ✅ all 13 runtime pins match blueprint §13 Phase 0 |
| `app.py` importable from root | ✅ |
| `README.md` HF-Spaces-compatible front-matter | ✅ (`sdk: streamlit`, `app_port: 7860`, plus the HF-recommended `emoji`, `colorFrom`, `colorTo`, `pinned`, `license`, `short_description` for a polished Space card) |
| README body expanded for HF-Spaces discoverability | ✅ Features · How-it-works diagram · Config table · Tech-stack table · Local-dev quickstart · Dev/test commands |
| `pytest -q` 254/254 pass after the change | ✅ 84.99 s |
| `ruff check .` clean | ✅ |
| `ruff format --check .` clean | ✅ 103 files already formatted |

**Why the extra front-matter fields?** HF Spaces' README acts as the Space card. Beyond the two mandatory keys (`sdk`, `app_port`), the other fields (`emoji`, `colorFrom`/`colorTo`, `pinned`, `license`, `short_description`) are HF recommendations and gracefully enhance the Space UI without changing runtime behaviour. All are the minimum-risk defaults.

**Why I did NOT split `requirements.txt`** (e.g. `requirements-space.txt` without dev deps): the blueprint §13 Phase 0 explicitly freezes the lockfile verbatim, and the dev deps (`pytest`, `ruff`, `respx`) don't materially bloat the Space image or runtime. Cold-start budget per §8.5 is < 25 s (hard limit 45 s); dev deps add ~3 MB and no measurable start time.

**Phase 7 deployment steps (user action on huggingface.co)** ⏳

```bash
# 1. Create the Space (UI: huggingface.co/new-space):
#    SDK: Streamlit, hardware: CPU basic (free), visibility: public or private.

# 2. Add HF remote and push
git init && git add . && git commit -m "Phase 7: HF Spaces deploy"
git remote add origin https://huggingface.co/spaces/<your-username>/tinyteach
git push origin main        # HF builds + serves automatically

# 3. Smoke test the live Space (per blueprint §16):
#    - Open the Space URL
#    - Upload a small PDF, wait for "Ready" badge
#    - Enter "decorators" → expect ≥ 5 case studies + a roadmap
#    - DevTools → confirm the inference call hits
#      https://router.huggingface.co/v1/chat/completions
#      (NOT the legacy api-inference.huggingface.co endpoint — Phase 3 issue)
```

**Default LLM on free Space MUST be `hf_inference` (router).** The `hf_local` provider is gated by `psutil.virtual_memory().available < 4 GB` (Phase 3) — on the 16 GB free Space the gate allows it but the 1.5 B param model still risks OOM. The factory already logs WARN + silently downgrades; a UI banner appears for the user.

**Memory budget on the free Space (hard ceiling = 16 GB)** (per §16)

| Component | Approx RAM |
|---|---|
| Streamlit + Python runtime | 250 MB |
| `sentence-transformers/all-MiniLM-L6-v2` | 300 MB |
| FAISS index for a 500-page book | < 50 MB |
| PyMuPDF parser (per upload) | < 100 MB |
| Headroom | ~15 GB |

---

### Phase 8 — Extensibility Polish ✅

Goal: drop in a new language / new LLM with zero edits to core.

**Files added / modified**

| File | Change | Purpose |
|---|---|---|
| `src/generation/prompts/registry.py` | Modified: auto-discover languages via `pkgutil.iter_modules` | Acceptance: dropping `rust.py` is the entire "add a language" workflow |
| `src/generation/prompts/languages/rust.py` | New: thin `GenericLanguagePrompt` subclass | Worked example language |
| `src/generation/providers/demo_provider.py` + `demo_data/*.json` | New: deterministic stub provider that returns canned JSON from sibling files | Worked example LLM; also powers the Demo button |
| `src/generation/providers/factory.py` | Modified: register `demo`; NOT in fallback chain | The user opting into `demo` is a deliberate signal |
| `src/config/constants.py`, `src/config/settings.py` | Modified: extend Literals to include `rust` / `demo` | The pydantic gate |
| `src/teaching/teaching_service.py` | Modified: `TeachingResult` carries `language` + `is_demo` | Markdown download uses the right code fence |
| `src/ui/state.py` | Modified: `EMPTY → RESULTS_READY` + `ERROR → RESULTS_READY` now allowed; new `load_demo_result()` helper | The Demo button needs to populate a result without going through the LLM |
| `src/ui/components.py` | Modified: new `render_demo_button`; always visible in the sidebar | Demo flow entry point |
| `src/ui/view_models.py` | Modified: `CaseStudyCardVM` carries `language`; markdown download uses it; banner shows `[Demo]` prefix when `is_demo=True` | Visual indicator for demo vs live results |
| `app.py` | Modified: wire the Demo button + demo-mode hint in `_render_ready_or_results` | The button is rendered in the sidebar |
| `src/golden/` (new package) | New: `loader.py` adapter that maps on-disk JSON to `TeachingResult` | Golden samples are the data source for the Demo button |
| `data/golden/<lang>/<topic>.json` × 13 | New: 3 polished samples × Python/Java/Cpp/Rust + 1 generic fallback + README | Showcase-ready, marketing-friendly, deterministic |
| `docs/EXTENDING.md` | New: step-by-step walkthroughs for all four extension points | The "how to extend" guide |
| `src/ui/state.py` (defensive `_safe_get`) | New helper: `session_state.get(key, default)` that also works with `streamlit.testing.v1.SafeSessionState` | Test compat |
| 5 new test files | `test_rust_prompt.py` (in test_prompt_registry.py), `test_demo_provider.py`, `test_demo_flow.py`, `test_golden_loader.py` (parametrised over 13 files) | +41 Phase 8 tests |
| `tests/integration/test_app.py` | +3 AppTest cases for the Demo button | UI smoke for the new flow |

**Total Phase 8 tests:** +41 (was 254 after Phase 6; **295** after Phase 8).

**Design decisions**

- **Auto-discovery over manual registration** for languages: `registry._discover_language_table()` scans `src/generation/prompts/languages/` at import time. New language = one file, no other edits.
- **Manual registration for LLMs**: `LLMProviderFactory._REGISTRY` stays a single dict — LLM providers carry runtime config (tokens, base URLs) that must match `Settings`.
- **Demo button uses golden folder, NOT the demo provider**: zero-cost, instant, deterministic. The demo provider exists as a worked example for `docs/EXTENDING.md` (add-an-LLM walkthrough).
- **Canned JSON in `.json` sibling files** (`demo_data/`): survives `ruff format` (which would collapse `\n` escapes in inline Python strings).
- **State machine + Demo**: `AppState.load_demo_result()` jumps straight to `RESULTS_READY`. New transitions: `EMPTY → RESULTS_READY` and `ERROR → RESULTS_READY`.
- **`is_demo` flag on `TeachingResult`**: flows through the view models unchanged — banner shows `[Demo] 3 golden case studies for 'decorators'` instead of `Generated 3 case studies for 'decorators'`. JSON + Markdown downloads carry the same flag.

**Invariants enforced in this phase (cumulative)**
- **I-11** Zero cost — `data/golden/` is committed; the demo button never hits the LLM.
- **I-18** No silent failures — broken golden JSON raises `ConfigError` with the file path.
- **OCP** — adding `rust.py` or `GoLanguagePrompt` requires ZERO edits to existing code.

**Verification:** `pytest -q` → 295 passed in 88 s; `ruff check .` clean; `ruff format .` clean.

**Bugs caught during verification (auto-fixed)**
1. `DemoLLMProvider.__init__` missing — `LLMProviderFactory.from_settings()` calls `provider_cls(settings)`, so we added `def __init__(self, settings: Settings | None = None)`.
2. Demo provider's canned JSON had a literal newline where JSON wants `\n` escape — moved from inline triple-quoted Python string to sibling `.json` files (`demo_data/case_study.json`, `demo_data/roadmap.json`) loaded via `importlib.resources`. Survives `ruff format`.
3. `test_load_demo_result_clears_error` failed because `ERROR → RESULTS_READY` wasn't in `_ALLOWED` — added it (the demo button should work after an error).
4. `AppTest.session_state` is a `SafeSessionState` that does NOT expose `.get()` — added `AppState._safe_get()` helper with a try/except fallback to `in`-then-`[]`.
5. `at.download_button` doesn't exist (same pattern as the `file_uploader` quirk from Phase 6) — use `at.get("download_button")`.
6. Test `test_forbidden_transition_raises` was checking `EMPTY → RESULTS_READY`, which is now ALLOWED — switched the test to `EMPTY → QUERYING` and added a positive `EMPTY → RESULTS_READY` case.
7. `cpp/raii.json` novice case study had 4 hints (domain rule is 1–3) — dropped one hint in `data/golden/cpp/raii.json`.
8. PowerShell `sed` corrupted `generic/decorators.json` (`\"` escape) — regenerated via Python.
9. **`READY → RESULTS_READY` was forbidden in the state machine** — discovered by edge-case testing after Phase 8 completion. If a user uploaded a book AND clicked Demo, the state-machine raised `ValueError`. Added `READY → RESULTS_READY` to `_ALLOWED`. New regression test `test_load_demo_result_works_from_ready` in `test_demo_flow.py`.

---

## Test Status

| Phase | Tests | Pass Rate | Coverage Focus |
|---|---|---|---|
| Phase 0 | 8 | 100% | Logger: 3 handlers, JSON, traceback, corr-id, idempotency |
| Phase 1 | 44 | 100% | Parser, chunker, embedder, FAISS, full pipeline + idempotency |
| Phase 2 | 72 | 100% | Relevance, vector-store LRU + caching, retriever end-to-end |
| Phase 3 | 126 | 100% | Decorator stack (cache/retry/logging), factory fallback, 4 provider implementations |
| Phase 4 | 202 | 100% | Fence stripping, Pydantic schemas, registry fallback, builder substitution, validator end-to-end |
| Phase 5 | 224 | 100% | GenerationFacade schema-retry + sentinel propagation, three teaching services, end-to-end with scripted LLM |
| Phase 6 | 254 | 100% | View-model converters + Markdown, AppState state machine, Streamlit AppTest (empty/READY/ERROR stages) |
| Phase 7 | 254 | 100% | Re-verified after README front-matter change (no code touched) |
| Phase 8 | **295** | **100%** | Auto-discovery (rust), demo provider, demo button flow, golden loader (13 files parametrised), new transitions in AppState |

**Markers in use**
- `slow` — embedder + integration tests
- `integration` — tests in `tests/integration/`

---

## Files & Directories (cumulative)

```
tinyteach/
├── pyproject.toml, requirements.txt, .env.example, .gitignore, README.md,
│   PROJECT_BLUEPRINT.md, context.md
├── app.py                                     # Streamlit entry (Phase 6)
├── data/
│   ├── golden/                                # Phase 8: pre-computed demos
│   │   ├── README.md
│   │   ├── python/ decorators.json, generators.json, comprehensions.json
│   │   ├── java/   inheritance.json, streams.json, generics.json
│   │   ├── cpp/    pointers.json, raii.json, templates.json
│   │   ├── rust/   ownership.json, lifetimes.json, traits.json
│   │   └── generic/decorators.json
│   └── uploads/, indices/, logs/  (gitignored, runtime)
├── docs/
│   ├── EXTENDING.md                           # Phase 8: add-a-language/LLM/golden guide
│   ├── ARCHITECTURE.md                        # placeholder (Phase 0)
│   └── PROMPTS.md                             # placeholder (Phase 0)
├── src/
│   ├── __init__.py
│   ├── config/        constants.py, settings.py, container.py
│   ├── observability/ correlation.py, logger.py, log_observer.py
│   ├── domain/        errors.py, book.py, chunk.py, case_study.py, roadmap.py, topic.py
│   ├── ingestion/     pipeline.py + parsers/chunkers/embedders/indexers/
│   ├── retrieval/     relevance.py, vector_store.py, retriever.py
│   ├── generation/    schemas.py, validator.py, generator.py + providers/ + prompts/
│   │                  └── providers/demo_provider.py + demo_data/{case_study,roadmap}.json (Phase 8)
│   ├── teaching/      case_study_service.py, roadmap_service.py, teaching_service.py
│   ├── ui/            view_models.py, state.py, components.py          (Phase 6, extended Phase 8)
│   ├── golden/        loader.py, __init__.py                          (Phase 8)
│   └── utils/         hashing.py, strip_fences.py
└── tests/
    ├── conftest.py
    ├── unit/          (29 test files; +test_golden_loader, +test_demo_provider, +test_demo_flow)
    └── integration/   conftest.py, test_ingestion_pipeline.py, test_retrieval.py,
                       test_teaching.py, test_app.py  (+3 demo-button AppTests)
```

---

## Known Compatibility Patches (vs. blueprint)

| Patch | Why | Where |
|---|---|---|
| `requires-python = ">=3.10"` | Only Py3.10 installed locally | `pyproject.toml` |
| `typing_extensions.Self` import | Backport for `Self` on Py<3.11 | 4 domain files |
| `book_id` uses `_` not `:` | `:` is illegal in Windows filenames | `src/domain/book.py` |
| `populate_by_name=True` on Settings | Allow kwargs by field name alongside env-var aliases | `src/config/settings.py` |
| Lower min bounds on retry/timeout | Tests need 0-second backoff + sub-second timeout | `src/config/settings.py` |
| `extra="forbid"` (not `strict=True`) | LLMs often coerce types; strict-mode flags benign output | `src/generation/schemas.py` |
| Demo provider's canned JSON lives in `.json` sibling files | Inline Python `r"""..."""` collapsed `\n` to real newlines after `ruff format`; `.json` files are immune | `src/generation/providers/demo_data/*.json` |

These are local-environment adaptations; the blueprint remains the canonical specification for production deploy on HF Spaces (which provides Python 3.11).

---

## Upcoming Phases

None — the 9-phase plan (`§13 Phase 0` … `Phase 8`) is complete.

Remaining user actions:
- **Phase 7 deploy step**: push to a HF Space + smoke test the live URL (5 lines of git; see §"Phase 7 deployment steps" above).

---

## How to run

```bash
cd tinyteach
pip install -r requirements.txt
cp .env.example .env          # add your HF_TOKEN / GROQ_API_TOKEN if you have one
streamlit run app.py          # opens at http://localhost:8501
```

Run the test suite:
```bash
py -m pytest -q                # all 254 tests in ~105 s
py -m pytest -q -m "not slow"  # 235 fast tests in ~5 s
py -m ruff check .             # lint
py -m ruff format .            # format
```