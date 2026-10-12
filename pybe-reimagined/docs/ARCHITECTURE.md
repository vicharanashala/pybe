# Pybe — Architecture Notes

> A guided tour of the design decisions that shape Pybe. Useful for new
> contributors, and as a "we tried to live up to this" audit list for the
> reviewer. Updated end of Phase 11.

---

## 1. The 4-layer architecture

```
┌──────────────────────────────────────────────────────────────────┐
│  UI Layer  (React + Tailwind v4 + lucide-react)                  │
│   CaseStudyPlayer · Dashboard · LandingPage · ConceptGraphPage   │
│   Onboarding · FeedbackWidget · TryItEditor · ProgressRing …     │
│   ─── depends only on interfaces declared in domain/adapter ─── │
└──────────────────────────┬───────────────────────────────────────┘
                           │  imports types + interfaces, never concrete adapters
┌──────────────────────────▼───────────────────────────────────────┐
│  Engine Layer  (orchestrators, scorers, decorators, traversers)  │
│   CaseStudyOrchestrator · ScoringEngine · SocraticNudge         │
│   RhizomeTraverser · MetaphorProjector (decorator)              │
└──────────────────────────┬───────────────────────────────────────┘
                           │  uses domain types
┌──────────────────────────▼───────────────────────────────────────┐
│  Domain  (pure types, one per file — INV-A1)                     │
│   CaseStudy · ConceptNode · Learner · PiagetStage · Metaphor     │
│   Construct · LessonRenderer (interface)                         │
└──────────────────────────┬───────────────────────────────────────┘
                           │  adapter contracts
┌──────────────────────────▼───────────────────────────────────────┐
│  Adapters  (every concrete I/O behind an interface)              │
│   PythonRunner (Mock | Pyodide) · VoiceInput (Fake | WebSpeech)  │
│   runner.ts · voice.ts · analytics/tracker.ts singletons         │
└──────────────────────────────────────────────────────────────────┘
```

The arrows are **one-way**. The UI layer never imports `PyodideRunner`,
`SpeechRecognitionAdapter`, or `LocalStorageTracker` directly — it talks
to `getRunner()`, `getVoiceInput()`, `getTracker()` (or reads from a
React context that does so). This is what makes the test seams work
and what makes Phase 7's LLM case-study generator drop in without
touching the UI.

---

## 2. SOLID principles, mapped to files

### S — Single Responsibility (INV-A1)
Each domain file owns one type. Each engine file owns one behavior.

| Type | File |
|---|---|
| `CaseStudy` | `src/domain/CaseStudy.ts` |
| `ConceptNode` | `src/domain/ConceptNode.ts` |
| `Learner` | `src/domain/Learner.ts` |
| `PiagetStage` | `src/domain/PiagetStage.ts` |
| `Metaphor` | `src/domain/Metaphor.ts` |
| `Construct` | `src/domain/Construct.ts` |
| `LessonRenderer` | `src/domain/LessonRenderer.ts` |

UI components are also single-purpose: `Scenario` shows the scenario,
`Reveal` shows the revealed construct, `TryItEditor` runs code. Each
owns its JSX and its event handlers — no cross-pollination.

### O — Open/Closed (INV-A2)
`metaphors.ts` and `cases.ts` use `import.meta.glob`. Drop a new file
into `content/metaphors/` or `content/case_studies/` and it appears at
next page load — **no code change**, no merge, no deploy. The
`architectural.test.ts#no-hardcoded-metaphor-ids` invariant test greps
for `import.meta.glob` and fails the build if a contributor hardcodes
an ID list.

### L — Liskov Substitution (INV-A3)
`MetaphorProjector` is a GoF Decorator that wraps any `LessonRenderer`.
`MockCaseStudyGenerator` and `LLMCaseStudyGenerator` are both
`CaseStudyGenerator`s. The UI talks to the interface; swapping
implementations is a one-line change at the seam.

### I — Interface Segregation (INV-A4)
`LessonRenderer.render(view, metaphorId)` is one method. `PythonRunner`
is `run / cancel`. `VoiceInput` is `start / stop / onResult`. None of
the interfaces is a god-object. If a future "KeyboardInput" needs to
exist, it's a new file — not a method on `VoiceInput`.

### D — Dependency Inversion (INV-A5)
The UI never imports a concrete adapter. The seams are:

| Seam | File | What UI does |
|---|---|---|
| `getRunner()` | `src/adapter/runner.ts` | `import { getRunner } from '../adapter/runner.ts'` |
| `getVoiceInput()` | `src/adapter/voice.ts` | `import { getVoiceInput } from '../adapter/voice.ts'` |
| `getTracker()` | `src/analytics/tracker.ts` | imported by analytics-emitting components only |
| `useLearner()` | `src/state/LearnerContext.tsx` | the entire state-of-the-world contract |
| `useTheme()` | `src/state/ThemeContext.tsx` | the theme contract (resilient — no provider → defaults) |

---

## 3. Gang-of-Four patterns, mapped to files

| Pattern | Where it lives | Why we picked it |
|---|---|---|
| **Decorator** | `src/decorator/MetaphorProjector.ts` (wraps `LessonRenderer`) | Layering metaphor flavor onto a base case study without modifying the base. INV-PB-4 ("chosen metaphor honored") demands this. |
| **Iterator** | `src/engine/RhizomeTraverser.ts` (`iteratePathways()`) | Rhizomatic navigation — yield each next pathway lazily; never materialise the full graph. |
| **Adapter** | `src/adapter/PyodideRunner.ts` (adapts Pyodide → `PythonRunner`); `src/adapter/SpeechRecognitionAdapter.ts` (adapts Web Speech → `VoiceInput`) | Concrete browser APIs have ugly shapes; the adapter normalises them to a clean interface. Tests use a clean `MockRunner` and `FakeVoiceInput` instead. |
| **Composite** | `src/agent/CaseStudyGenerator.ts` (`CompositeCaseStudyGenerator` wraps LLM with Mock fallback) | Failure semantics: if the LLM is down, fall back transparently. |
| **Strategy** | `src/analytics/tracker.ts` (3 implementations of `AnalyticsTracker`); `src/agent/CaseStudyGenerator.ts` (3 generator strategies) | The right strategy is picked at boot (or via env vars) without the consumer knowing. |
| **Singleton (with test seam)** | `src/adapter/runner.ts`, `src/adapter/voice.ts`, `src/analytics/tracker.ts` | Module-level singletons with `setXForTesting()` so tests can inject mocks. |
| **Factory** | `src/agent/CaseStudyGenerator.ts#createGeneratorFromEnv()` | Build the right generator based on env vars. |
| **Façade (light)** | `src/engine/CaseStudyOrchestrator.ts` | One entry point for the UI to "load + render a case study" — hides the multi-step wiring. |

### Pattern that's *not* in the codebase (deliberate)

- **Observer pattern**, classical. We use **React's built-in re-render
  model** (LearnerContext is the single source of truth; consumers
  re-render when it changes). A classical `Observer.attach()` would
  duplicate that for no win and add memory-leak surface area.
- **Memento / Command.** The state is a single `Learner` object
  serialised to `localStorage`. There is no undo/redo yet; if a v2
  feature needs it, we'll add it then.

---

## 4. "Grokking System Design" ideas already in the codebase

> _Source: "Grokking the System Design Interview" by Design Gurus._
> This is the list of techniques we apply today, with the file
> reference. Items marked "v2" are roadmap.

| Technique | Where it's used | Notes |
|---|---|---|
| **CDN + lazy load** | Pyodide loaded at runtime from `cdn.jsdelivr.net/pyodide/v0.26.4/full/` | 6 MB off the critical path. Browser cache warms after first run. |
| **Single source of truth** | `LearnerContext` | All reads/writes go through one React context. `localStorage` is the persistence layer. |
| **Cache-aside** | `LocalStorageTracker` (analytics) | Events are buffered in `localStorage` first, then forwarded to Plausible when the tracker is composited. |
| **Defensive parsing** | AJV over every JSON file (`scripts/validate-content.ts`) | INV-D1: nothing reaches runtime that doesn't validate. |
| **Rate-limit (client side)** | `SocraticNudge` fires at most once per 30 s idle window | INV-PB-9: don't be annoying. |
| **Idempotency** | `FeedbackWidget` closes itself after a single submit (auto-close 1.5 s) | A double-click does not double-submit. |
| **Health checks (v2)** | `WeeklyReview` page shows Pyodide success/failure ratio | Pre-emptive alerting for runner regressions. |
| **Backpressure (client side)** | `TryItEditor` cancels long-running code via `setInterruptBuffer` | Without it, a runaway `while True: pass` freezes the tab. |
| **Circuit breaker (v2)** | `CompositeCaseStudyGenerator` | The Mock fallback is a circuit breaker for the LLM endpoint. |
| **Bulkhead (v2)** | Distinct singleton seams for runner / voice / tracker | One adapter's failure does not bring down the others. |
| **Pagination / virtualisation (v2)** | `ConceptGraph` uses `d3-force` with a fixed tick count; no scroll-virtualisation today. | Add when node count > 200. |
| **Schema versioning** | `pybe:state:v1`, `pybe:analytics:v1`, `pybe:theme:v1` | Migration path is documented per key. |
| **Feature flags** | `src/admin/featureFlags.ts` (9 flags; v2 are hard-coded OFF) | INV-PB-5: contributor cannot flip a v2 flag from the source code. |
| **Observability** | 8 named analytics events + `/weekly-review` aggregation | Per-event property whitelist; no PII. |
| **Sticky sessions (v2)** | Today: localStorage only. v1.1.0: server-side persistence; sticky session by anonymous UUID. | Roadmap. |
| **Idempotent keys for writes (v2)** | Roadmap. The LLM-generator uses a draft-id in `LocalDraftStore`; the same id can be re-issued safely. | |

---

## 5. Read this before adding a feature

1. Read `Pybe_Master_Blueprint.md` §6.3 (the invariants).
2. Read `tests/invariants/_map.ts` (the registry).
3. Read `docs/InvariantTests.md` (the human map).
4. Open the relevant file in `src/`. Note the layer it lives in.
5. Write the invariant test **first**, then the feature.
6. Update `_map.ts` and this file.

If a feature would violate any invariant, **do not** ship it —
escalate to Sir.

---

**Document version:** 1 (Phase 11)
**Last updated:** end of Phase 11 UI/UX polish pass.
