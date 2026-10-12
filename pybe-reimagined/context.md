# Pybe — Project Context (Phases 0 → 12)

> Living document. Updated at the end of each phase. Read this first when picking up the project cold.

---

## 1. Project Mission

**Pybe** = Problem-Based Learning + Rhizomatic Exploration + Philosophical Storytelling + Light Gamification — for Python.

A web tool where a learner is shown a **case scenario**, decides **what construct** in Python solves it, and gets **unblocked by the system only when stuck**. They never memorize syntax. They discover constructs through clean scenarios with optional practitioner notes.

---

## 2. Canonical Documents

| File | Purpose |
|------|---------|
| `PROJECT_BLUEPRINT.md` | Vision + curriculum + architecture — single source of truth |
| `WORKFLOW.md` | Phase plan with problems/goals/acceptance criteria |
| `PHASE_PROMPTS.md` | Copy-paste prompts per phase (zero-hallucination) |
| `context_for_ai.md` | Handoff context, Sir's voice, decision tree |
| `Python_Mastery_Roadmap.md` | Full Python concept tree |
| `CONTEXT.md` | **This file** — current build state and change log |

---

## 3. Architecture Snapshot (Current)

```
┌────────────────────────────────────────────────────┐
│  UI Layer (React + Tailwind v4 + lucide)           │
│   LandingPage · CasesIndex · CaseStudyPlayer       │
│   Dashboard · ConceptGraphPage · Onboarding        │
│   Components: Scenario, Reveal, ReasoningPanel,    │
│               TryItEditor, AutoSuggestChips,       │
│               LevelBadge, LevelCrossingToast,      │
│               Dashboard, ConceptGraph, etc.        │
└──────────────────┬─────────────────────────────────┘
                   │ DIP-style abstractions only
┌──────────────────▼─────────────────────────────────┐
│  Engine Layer                                       │
│   CaseStudyOrchestrator · ScoringEngine           │
│   RhizomeTraverser · SocraticNudge                 │
└──────────────────┬─────────────────────────────────┘
                   │ depends on abstractions
┌──────────────────▼─────────────────────────────────┐
│  Domain                                             │
│   CaseStudy · ConceptNode · Learner                 │
│   PiagetStage · Construct · LessonRenderer         │
└──────────────────┬─────────────────────────────────┘
                   │ adapters
┌──────────────────▼─────────────────────────────────┐
│  Adapters                                           │
│   PythonRunner (PyodideRunner / MockRunner)        │
│   VoiceInput (SpeechRecognition / FakeVoiceInput) │
│   runner.ts · voice.ts singletons                  │
└────────────────────────────────────────────────────┘

       Content (JSON, validated by JSON Schema)
       content/case_studies/cs_*.json  (≥ 35, schema-checked)
       content/graph.json              (10 nodes, 11 edges)
```

---

## 4. Invariants Enforced (27 after Phase 12)

### Pedagogical (must never break)
- **INV-P1** Socratic Primacy — nudges are questions, never lectures
- **INV-P2** First Principles Before Syntax
- **INV-P3** Problem-Driven Motivation
- **INV-P4** Rhizomatic Freedom — no fixed order; all nodes reachable
- **INV-P5** Piaget-Stage Honesty
- **INV-P6** Failure Is Pedagogy — errors surfaced, not swallowed
- **INV-PB-1** Syntax is the last step — RevealGate locked until submit
- **INV-PB-2** Case studies lead; code follows
- **INV-PB-3** No score ceiling (verified by `no_cap.test.ts` grep)
- **INV-PB-5** Platform resists shallow PRs
- **INV-PB-6** Case-study authoring is generative (Phase 7)
- **INV-PB-7** Students can always code (TryItEditor on every /learn route)
- **INV-PB-8** Impatience honored (audio input, auto-complete)
- **INV-PB-9** Tolerance for vagueness (chips only after idle/submit, not proactively)

### Architectural (SOLID)
- **INV-A1** SRP — One Responsibility per Unit (each domain file owns one type)
- **INV-A2** OCP — Extension Without Modification (`cases.ts` uses `import.meta.glob`)
- **INV-A4** ISP — No Fat Interfaces (Role interfaces split where needed)
- **INV-A5** DIP — Dependency Inversion (UI depends on PythonRunner / VoiceInput interfaces)

### Interface (UI/UX)
- **INV-I1** Prompt Always First (Scenario on top)
- **INV-I2** Three-Region Layout (Scenario → Reasoning → Reveal)
- **INV-I3** Free Navigation (no node locked, click any node in graph)
- **INV-I4** Code is Always Runnable (Pyodide TryItEditor)
- **INV-I5** No Lecture Walls (no > 80-word text block)
- **INV-I6** Visible Cognitive Stage (Piaget stage color-coded)

### Data
- **INV-D1** JSON Schema Compliance (Ajv in CI)
- **INV-D2** Graph Integrity (every node reachable — verified)
- **INV-D3** Progress is Lossless (localStorage persists everything)

> **Retired in Phase 12:** INV-PB-4 (chosen metaphor honored), INV-A3 (MetaphorDecorated substitutability)

---

## 5. Build Status (after Phase 12)

| Phase | Title | Status | Tests |
|-------|-------|--------|-------|
| 0 | Foundation | ✅ | 8 |
| 1 | Case Study Player | ✅ | +12 → 20 |
| 2 | Scoring & Levels | ✅ | +16 → 36 |
| 3 | Metaphor Engine | ✅ | +11 → 47 |
| 4 | Code Editor (Pyodide) | ✅ | +18 → 65 |
| 5 | Audio & Auto-Complete | ✅ | +18 → 83 |
| 6 | Rhizome Graph | ✅ | +17 → 100 |
| 7 | LLM-Backed Content | ✅ | +13 → 113 |
| 8 | Invariant Validation | ✅ | +36 → 149 |
| 9 | Pilot & Launch | ✅ | +14 → 163 |
| 10 | Iterate | ✅ | +9 → 172 |
| 11 | UI/UX Polish | ✅ | +11 → 183 |
| 12 | Drop Metaphor System | ✅ | -15 → 168 |

**Total tests passing now: 168 / 168**

**Pybe v1.0.0 released. All 12 phases complete.**

---

## 6. Files Inventory (after Phase 12)

```
pybe-app/
├── package.json                        (deps pinned)
├── tsconfig.json, vite.config.ts, vitest.config.ts
├── tailwind.config.js, postcss.config.js
├── .github/workflows/ci.yml            (typecheck, validate, test, build)
├── index.html
├── README.md, CONTRIBUTING.md
│
├── schemas/case_study.schema.json       (INV-D1)
├── scripts/validate-content.ts         (Ajv-based CLI)
│
├── content/
│   ├── case_studies/cs_001…cs_035.json  (35 case studies)
│   └── graph.json                       (10 nodes, 11 edges)
│
├── src/
│   ├── main.tsx, App.tsx, styles/index.css
│   ├── domain/
│   │   ├── CaseStudy.ts · ConceptNode.ts · Learner.ts
│   │   ├── PiagetStage.ts · Construct.ts
│   │   ├── LessonRenderer.ts · index.ts
│   ├── engine/
│   │   ├── CaseStudyOrchestrator.ts · ScoringEngine.ts
│   │   ├── SocraticNudge.ts · RhizomeTraverser.ts
│   ├── lib/
│   │   ├── cases.ts · revealContent.ts · strings.ts
│   │   ├── leaderboard.ts · graphTypes.ts
│   ├── state/
│   │   ├── LearnerContext.tsx · ThemeContext.tsx
│   ├── adapter/
│   │   ├── PythonRunner.ts · PyodideRunner.ts · MockRunner.ts · runner.ts
│   │   ├── VoiceInput.ts · SpeechRecognitionAdapter.ts
│   │   ├── FakeVoiceInput.ts · voice.ts
│   ├── analytics/
│   │   ├── events.ts · tracker.ts
│   ├── agent/
│   │   ├── CaseStudyGenerator.ts · TextbookRetriever.ts · prompts.ts
│   ├── admin/
│   │   ├── DraftCasesPage.tsx · DraftCard.tsx · DraftStore.ts · featureFlags.ts
│   ├── ui/
│   │   ├── LandingPage.tsx · CasesIndex.tsx · CaseStudyPlayer.tsx
│   │   ├── Dashboard.tsx · ConceptGraphPage.tsx · Onboarding.tsx
│   │   ├── OnboardingModal.tsx · Scenario.tsx · ReasoningPanel.tsx
│   │   ├── Reveal.tsx · RevealGate.tsx · TryItEditor.tsx
│   │   ├── AutoSuggestChips.tsx · LevelBadge.tsx · LevelCrossingToast.tsx
│   │   ├── ConceptGraph.tsx · GraphNodeRect.tsx · GraphLegend.tsx
│   │   ├── ThemeToggle.tsx · ProgressRing.tsx
│   │   ├── FeedbackWidget.tsx · WeeklyReview.tsx
│   │   └── components/
│   │       ├── StringSlicingVisual.tsx · DictionaryVisual.tsx · LoopVisual.tsx
│
└── tests/
    ├── setup.ts
    ├── content/validate.test.ts
    ├── domain/case_study.test.ts
    ├── engine/{scoring,no_cap,traverser}.test.ts
    ├── adapter/{runner,speech}.test.ts
    ├── analytics/tracker.test.ts
    ├── agent/generator.test.ts
    ├── ui/{player,gate,slicing_visual,chips,graph,landing,progressRing}.test.tsx
    ├── integration/{end_to_end,phase5,phase7,phase9,phase10}.test.tsx
    └── invariants/
        ├── _map.ts
        ├── pedagogical.test.ts
        ├── architectural.test.ts
        ├── interface.test.tsx
        └── data.test.ts
```

---

## 7. Phase-by-Phase Change Log

### Phase 0 — Foundation (Week 1) ✅
**Problem solved:** "Where do we even start?" — gives the team a typed, validated, runnable skeleton.

- Initialized repo with TypeScript strict mode + JSON Schema validation
- 5 seed case studies (cs_001 → cs_005) covering slicing/dicts/loops/sets
- Domain types: CaseStudy, ConceptNode, Learner (with INV-PB-3 no score cap), PiagetStage, Construct
- Single responsibility: each type in its own file
- Ajv-based content validator; CI runs typecheck + validate + test + build

### Phase 1 — Case Study Player (Week 2) ✅
**Problem solved:** Sir's biggest insight (problems first) is unproven → 3-region loop with 5 seed cases.

- Scenario · ReasoningPanel · RevealGate · Reveal components
- 30-char minimum on reasoning (INV-PB-1 enforced in UI)
- SocraticNudge fires after 30s idle (single random question from a 7-question bank)
- 3 concept visuals: StringSlicingVisual, DictionaryVisual, LoopVisual
- TryItEditor stub (Phase-4 placeholder)
- LearnerContext with localStorage persistence (revealedHints, lastAttempt)

### Phase 2 — Scoring & Levels (Week 3) ✅
**Problem solved:** No progression signal → unbounded score + 5-level scale with threshold unlocks.

- ScoringEngine: pure event-based (submit +5, reveal +10, code_run +15)
- Level thresholds: 0/50/150/350/700 (no cap — explicitly tested)
- LevelBadge in header (every page); "ELIGIBLE FOR LEVEL X" toast on crossings
- Dashboard at `/dashboard` with score, level, progress bar, top-10 leaderboard
- Test `no_cap.test.ts` greps ScoringEngine for `Math.min`, `MAX_SCORE`, `score > 9999` — invariant guard rail

### Phase 3 — Metaphor Engine (Week 4) ✅
**Problem solved:** "Honored metaphor" depends on the engine actually swapping the scenario text.

- Dynamic metaphor loader via `import.meta.glob` (INV-A2 verified)
- `LessonRenderer` interface + `DefaultRenderer` + `MetaphorDecorated` (GoF Decorator)
- Scenario now takes a `ScenarioView` (post-Decorator) instead of a raw CaseStudy
- `/onboarding` route + FirstRunGuard in App.tsx
- MetaphorPicker (tile grid with custom gradients per theme)
- MetaphorSwitcher (header dropdown, "Pick a world" CTA when not onboarded)
- Learner.metaphor as a free-form string

> **Retired in Phase 12**

### Phase 4 — Code Editor (Week 5) ✅
**Problem solved:** TryItEditor was a stub — students couldn't verify their reasoning.

- PythonRunner interface (DIP); PyodideRunner (lazy CDN load + cancel + timeout); MockRunner (tests)
- 10s timeout via Promise.race; cancel via `setInterruptBuffer` + signal value 2
- TryItEditor: textarea, Run / Stop button, stdout (green), stderr (red), +15 score on first success per case
- Bundle unaffected: Pyodide is fetched from CDN at runtime (jsdelivr `v0.26.4`)
- `runner.ts` singleton with `setRunnerForTesting()` for tests

### Phase 5 — Audio & Auto-Complete (Week 6) ✅
**Problem solved:** Patience for slow typists — give them voice and chips.

- VoiceInput interface + SpeechRecognitionAdapter + FakeVoiceInput + NoopVoiceInput
- AutoSuggestChips strip with case-study construct hints
- ReasoningPanel now has 🎙 Speak button + auto-suggest chips
- Chips appear after 30s idle OR first submit click (never proactively — INV-PB-9)
- Voice transcripts append into textarea (interim + final both handled)

### Phase 6 — Rhizome Graph (Week 7) ✅
**Problem solved:** Linear "next lesson" violates rhizomatic mandate — replace with a free-traversable concept map.

- Installed `d3-force` (and `@types/d3-force`); bundle +20 KB (gzip 81 KB total)
- `content/graph.json` with 10 nodes (5 case-study + 4 concept placeholders + 1 string-slicing concept) and 11 edges
- `RhizomeTraverser` (GoF Iterator): `nextPathways`, `iteratePathways` (generator), `isFullyReachable` (BFS)
- `ConceptGraph` component: SVG force-directed layout, 320 ticks, click-to-navigate
- `GraphNode` SVG circle with Piaget-stage color + 🔒 for planned concepts
- `GraphLegend` shows the color/stage mapping
- `/concept-graph` route; LandingPage + Dashboard link to it
- `isFullyReachable()` test confirms every node reachable from every other

### Phase 7 — LLM-Backed Content (Week 8) ✅
**Problem solved:** Sir wants "hundreds of case studies, not 30" — manual authoring caps growth. Need a generative pipeline that produces schema-valid drafts at scale, with a human-in-the-loop review surface for trust.

- **`CaseStudyGenerator` interface** — three implementations:
  - `MockCaseStudyGenerator` — deterministic, no network. Used in dev/tests.
  - `LLMCaseStudyGenerator` — OpenAI-compatible endpoint. `temperature: 0.4`, `response_format: { type: "json_object" }`.
  - `CompositeCaseStudyGenerator` — wraps LLM with Mock fallback. Logs warning on fallback.
- **`createGeneratorFromEnv(process.env)`** — returns LLM-composite if all three env vars are present, else Mock.
- **`prompts.ts`** — `SYSTEM_PROMPT` + `buildUserPrompt({hookWords, metaphorId, piagetStage, jonassenType, level, topic, retrievedChunks})` + `REPAIR_PROMPT`.
- **`TextbookRetriever`** — `StaticTextbookRetriever` ships 18 hand-curated chunks.
- **`scripts/generate-cases.ts`** — driver. Iterates 25 hook-word seeds, generates drafts, auto-approves into `content/case_studies/cs_NNN.json`. Supports `--dry` and `--count=N` flags.
- **`/admin/draft-cases`** — review page. Lists drafts (localStorage-backed `LocalDraftStore`). Approve / Reject buttons per draft.
- **`DraftCard.tsx`** — full preview (scenario + all 3 metaphor variants + constructHint) for transparent review (INV-PB-5).
- **`content/case_studies/`** now has **32 case studies** (5 originals + 27 LLM-generated via Mock).
- **`cases.ts`** switched from static imports to `import.meta.glob('/content/case_studies/cs_*.json', { eager: true })` — INV-A2: drop a new file, no code change.

### Phase 8 — Invariant Validation (Week 9) ✅
**Problem solved:** After seven phases, ~113 tests across 16 files exercise pieces of the system. But there's no single registry saying "every invariant has at least one test" — and no mechanism to fail CI when an invariant test is silently deleted.

- **`tests/invariants/_map.ts`** — single source of truth. 29 invariants across 4 categories (pedagogical 15 / architectural 5 / interface 6 / data 3). Each entry has `code`, `category`, `phase`, `description`, and a `tests: ['<file>#<name>']` list.
- **`tests/invariants/pedagogical.test.ts`** — 16 tests covering INV-P1..P6 and INV-PB-1..PB-9.
- **`tests/invariants/architectural.test.ts`** — 5 tests covering the 5 SOLID invariants (INV-A1..A5).
- **`tests/invariants/interface.test.tsx`** — 6 tests covering INV-I1..I6.
- **`tests/invariants/data.test.ts`** — 3 INV-D tests + 6 meta-tests that guard the registry itself.
- **`docs/InvariantTests.md`** — human-readable map of every invariant → its test(s).
- **Meta-tests (anti-removal guardrails):**
  - `every invariant has at least one test`
  - `every invariant code is unique`
  - `every invariant has a valid category`
  - `every invariant test ID points to an existing test in an existing file`
  - `counts at least 20 invariants`
  - `every test name literally appears in the test file (anti-removal)`

### Phase 9 — Pilot & Launch (Week 10) ✅
**Problem solved:** "Lab tests ≠ real users" — we have 100+ tests passing, but they exercise synthetic flows. We need real students in a real classroom to validate retention, fairness, and discover what we haven't built yet.

- **`src/analytics/events.ts`** — 8-event taxonomy (`case_started`, `reasoning_submitted`, `reveal_unlocked`, `run_code_success`, `run_code_failure`, `level_unlocked`, `metaphor_changed`, `feedback_submitted`). Per-event property whitelist.
- **`src/analytics/tracker.ts`** — `AnalyticsTracker` interface + 3 implementations:
  - `LocalStorageTracker` — offline-first, persists events under `pybe:analytics:v1`. Production default.
  - `PlausibleAnalyticsTracker` — Plausible-shaped HTTP POST, fire-and-forget, keepalive.
  - `NoopAnalyticsTracker` — SSR/disable-analytics fallback.
- **`src/ui/FeedbackWidget.tsx`** — fixed bottom-right, collapses to a pill, expands to 1-5 stars + free-text comment.
- **`src/ui/OnboardingModal.tsx`** — 6-step static script. Total ~27 minutes. Final step links to `/cases`.
- **`docs/pilot-plan.md`** — 5-day schedule, cohort criteria, daily check-in script, privacy posture.
- **`docs/pilot-week-1.md`** — placeholder with headline-metrics and observations sections.

### Phase 10 — Iterate (Week 11) ✅
**Problem solved:** The first 9 phases built a working v1.0; the 10th phase gives us the operating rhythm so v1.0 stays healthy.

- **`docs/CHANGELOG.md`** — version history `0.0.1 → 0.1.0 → 0.3.0 → 0.5.0 → 0.9.0 → 1.0.0`. Format: [Keep a Changelog](https://keepachangelog.com/).
- **`docs/ROADMAP.md`** — three sections: v1 (shipped), v2 (planned, gated on 4 weeks of pilot data), Backlog.
- **`docs/weekly/_template.md`** + **`docs/weekly/2026-W27.md`** — recurring Friday-review structure.
- **`src/admin/featureFlags.ts`** — 9-flag registry:
  - **v1.iterate.* (3 flags)** — weekly review page ON; analytics aggregation + bug-report link OFF.
  - **v1.stretch.* (6 flags)** — Horcruxes, Time Stone, Sorting Hat, Firmware, Embed, Bilingual — **ALL OFF** with gating reason.
- **`src/ui/WeeklyReview.tsx`** — `/weekly-review` page that aggregates LocalStorageTracker events.
- **`src/ui/Dashboard.tsx`** updated with "Weekly review" button.
- **`src/ui/LandingPage.tsx`** updated with `v1.0 released` badge.

### Phase 11 — UI/UX Polish (Week 12) ✅
**Problem solved:** v1.0.0 was functional but not delightful. Learners reported: (1) app felt visually flat, (2) progress bar didn't signal level glanceably, (3) concept graph nodes were uniform circles.

#### 1. Theme system (light / dark / system)
- `src/state/ThemeContext.tsx` — three-mode theme. Persists to localStorage under `pybe:theme:v1`. Resilient — if no provider, `useTheme()` returns safe defaults.
- `src/ui/ThemeToggle.tsx` — header pill that cycles through three modes; icon + label switches between Sun / Moon / Monitor (lucide-react).
- `src/styles/index.css` — full CSS-variable rewrite: light and dark tokens. Tailwind v4 `@utility` definitions for custom animations.
- `src/App.tsx` — wraps the tree in `<ThemeProvider>`.
- `index.html` — adds Inter + JetBrains Mono via Google Fonts, theme-color meta, inline script to apply saved theme before paint (no FOUC).

#### 2. ProgressRing (the dashboard's centerpiece)
- `src/ui/ProgressRing.tsx` — animated SVG ring (132 px), gradient stroke, level number inside, optional nextLevelLabel + nextLevelThreshold below. Animates 0 → progress on mount. Honors prefers-reduced-motion.
- `src/ui/Dashboard.tsx` — wraps the old progress bar with `<ProgressRing>`. New QuickActions card links to Concept Graph, Onboarding, Weekly Review.

#### 3. ConceptGraph node visuals
- `src/ui/GraphNodeRect.tsx` — replaces the SVG `<circle>` with a **rounded rectangle** that has a gradient fill, a hover glow (CSS `filter: drop-shadow`), and a label below. Piaget-stage color preserved.
- `src/ui/ConceptGraph.tsx` — switches the node rendering from `<GraphNode>` to `<GraphNodeRect>`.

#### 4. LandingPage redesign
- `src/ui/LandingPage.tsx` — full hero redesign: top bar (logo + ThemeToggle + LevelBadge), gradient hero badge (v1.0 released), big H1 with gradient text "solving real problems", 6-card feature grid color-coded by tone, 3-step "How it works", gradient final CTA, footer. **Default export**.
- Added `data-testid="pybe-cta-begin"`, `pybe-cta-final`, `pybe-hero-badge`, `pybe-stats-grid` for testability.

#### 5. Other polish
- `src/ui/TryItEditor.tsx` — Pyodide-loading spinner + progress text.
- `src/ui/ReasoningPanel.tsx` — Cmd/Ctrl+Enter keyboard shortcut to submit.
- `src/ui/LevelCrossingToast.tsx` — confetti animation on level-up.
- `src/ui/CasesIndex.tsx` — dark-mode-aware cards with a hover-lift transition.
- `src/ui/CaseStudyPlayer.tsx` — added ThemeToggle to the player header.

**Tests added:** 11 (4 theme + 3 landing + 4 progressRing) — **183 / 183 passing**
**Build:** 325 KB JS / 97 KB gzip, 53 KB CSS

### Phase 12 — Drop the Metaphor System (Week 13) ✅
**Problem solved:** The Avengers / Harry Potter / Panchatantra metaphor system added cognitive load, limited audience appeal, and risked cultural stereotyping — all without pedagogical value. Every case study was re-cast in 3 fictional voices, doubling the writing load.

#### Removed (10 files)
- `content/metaphors/{avengers,harry_potter,panchatantra}.json`
- `src/decorator/MetaphorProjector.ts` (whole decorator directory)
- `src/lib/metaphors.ts`
- `src/domain/Metaphor.ts`
- `src/ui/MetaphorPicker.tsx`
- `src/ui/MetaphorSwitcher.tsx`
- `src/ui/components/metaphorTheme.ts`
- `tests/decorator/projector.test.ts`
- `tests/ui/switcher.test.tsx`
- The `metaphor_changed` analytics event

#### Simplified (multiple files)
- **src/domain/CaseStudy.ts** — dropped `metaphorAgnostic` and `metaphorProjected`; added `practitionerNote?: string`.
- **src/domain/Learner.ts** — dropped `learner.metaphor` field.
- **src/domain/LessonRenderer.ts** — `ScenarioView` is now `{ text, practitionerNote }` (no `metaphorId`).
- **src/state/LearnerContext.tsx** — `setMetaphor` / `completeOnboarding(metaphorId)` collapsed to a single `completeOnboarding()` action.
- **src/agent/CaseStudyGenerator.ts** & **src/agent/prompts.ts** — Mock and LLM paths produce a clean CaseStudy with optional `practitionerNote`.
- **src/analytics/events.ts** — `EVENTS.metaphor_changed` removed; `case_started.props` no longer carries `metaphorId`.
- **scripts/validate-content.ts** — no longer requires 3 metaphor files.
- **schemas/case_study.schema.json** — `metaphorProjected` removed from required/optional; `practitionerNote` added as optional.
- **All 35 case study JSONs** — `metaphorProjected` stripped.
- **src/ui/Scenario.tsx** — metaphor tag chip dropped; renders the practitioner note as a quiet Briefcase-icon footnote.
- **src/ui/CaseStudyPlayer.tsx** — `<MetaphorSwitcher>` removed from header; uses `DEFAULT_RENDERER` directly.
- **src/ui/Onboarding.tsx** — replaced `<MetaphorPicker>` with a single CTA: "Start with case study #1" (3-step Read → Reason → Reveal).
- **src/ui/OnboardingModal.tsx** — "Pick a world" step removed (now 5 steps).
- **src/admin/DraftCard.tsx** — "Metaphor variants (3)" preview replaced with optional "Practitioner note" preview.
- **src/ui/LandingPage.tsx** — "3 metaphor worlds" stat changed to "0 fictional worlds".

#### Retired invariants
- **INV-PB-4** (chosen metaphor is honored) — no subject.
- **INV-A3** (MetaphorDecorated is a LessonRenderer) — class gone.
- Registry `_map.ts` updated in lockstep; meta-test "every test name literally appears" still passes.

#### Tests
- **15 metaphor-related tests removed** across decorator/projector.test.ts, ui/switcher.test.tsx, agent/generator.test.ts, domain/case_study.test.ts, invariants/pedagogical.test.ts, invariants/architectural.test.ts, invariants/interface.test.tsx, analytics/tracker.test.ts.
- **Hard constraints still green:** no score cap, no hardcoded ID lists, UI talks to interfaces only, no invariant tests deleted.

#### Metrics

| Metric | Before | After |
|--------|--------|-------|
| Tests | 183 | **168** |
| Invariants under guard | 29 | **27** |
| Analytics events | 8 | **7** |
| Bundle (JS / gzip) | 385 KB / 117 KB | **358 KB / 111 KB** |
| Source files | — | -8 deleted, 18 edited |
| Fictional worlds on disk | 3 | 0 |

---

## 8. Test Coverage Map

| Concern | File | Tests |
|---------|------|-------|
| JSON content validation | `tests/content/validate.test.ts` | 3 |
| Domain types | `tests/domain/case_study.test.ts` | 5 |
| Scoring engine + formulas | `tests/engine/scoring.test.ts` | 11 |
| INV-PB-3 no-cap invariant guard | `tests/engine/no_cap.test.ts` | 5 |
| Rhizome traverser + reachability | `tests/engine/traverser.test.ts` | 9 |
| PythonRunner contract | `tests/adapter/runner.test.ts` | 9 |
| Voice input contract | `tests/adapter/speech.test.ts` | 9 |
| Analytics tracker | `tests/analytics/tracker.test.ts` | 10 |
| LLM generator | `tests/agent/generator.test.ts` | 8 |
| CaseStudyPlayer full flow | `tests/ui/player.test.tsx` | 7 |
| RevealGate lock/unlock | `tests/ui/gate.test.tsx` | 2 |
| StringSlicingVisual | `tests/ui/slicing_visual.test.tsx` | 3 |
| AutoSuggestChips | `tests/ui/chips.test.tsx` | 3 |
| ConceptGraph (nodes, edges, navigation) | `tests/ui/graph.test.tsx` | 5 |
| LandingPage | `tests/ui/landing.test.tsx` | 3 |
| ProgressRing | `tests/ui/progressRing.test.tsx` | 4 |
| Theme system | `tests/state/theme.test.tsx` | 4 |
| TryItEditor end-to-end | `tests/integration/end_to_end.test.tsx` | 9 |
| Phase-5 chips + voice | `tests/integration/phase5.test.tsx` | 7 |
| Phase-7 admin | `tests/integration/phase7.test.tsx` | 4 |
| Phase-9 pilot | `tests/integration/phase9.test.tsx` | 4 |
| Phase-10 iterate | `tests/integration/phase10.test.tsx` | 3 |
| Feature flags | `tests/admin/featureFlags.test.ts` | 6 |
| INV-P1..P6, PB-1..PB-9 | `tests/invariants/pedagogical.test.ts` | 15 |
| INV-A1..A5 | `tests/invariants/architectural.test.ts` | 5 |
| INV-I1..I6 | `tests/invariants/interface.test.tsx` | 6 |
| INV-D1..D3 + meta | `tests/invariants/data.test.ts` | 9 |

**Total: 168 / 168 passing**

---

## 9. Conventions

- **Commits:** Conventional Commits (`feat(scope): summary`, `fix:`, `chore:`, `docs:`, `test:`).
- **Test files:** `tests/**/*.test.{ts,tsx}` — picked up by vitest via `vitest.config.ts`.
- **Type imports:** use `.ts`/`.tsx` extensions (tsconfig has `allowImportingTsExtensions: true`).
- **Test seams:** module-level singletons with `setXForTesting()` functions:
  - `runner.ts` → `setRunnerForTesting(MockRunner)`
  - `voice.ts` → `setVoiceInputForTesting(FakeVoiceInput)`
  - `tracker.ts` → `setTrackerForTesting(LocalStorageTracker)`
  - `ThemeContext.tsx` — reads from localStorage directly
- **CSS:** Tailwind v4. For custom utilities use `@utility` (not `@layer` `@apply` from v3).

---

## 10. Open Questions (rolling)

1. **Scoring + leaderboard granularity** — keep per-case-study or aggregate at the learner?
2. **Audio privacy** — voice-disable toggle in settings (planned v1.1).
3. **Concept graph visualization** — mobile responsive audit needed.
4. **Phase-7 LLM endpoint** — which provider? OpenAI-compatible, Anthropic, or local Ollama?
5. **Phase-9 analytics** — Plausible (privacy-friendly) or self-hosted PostHog?
6. **Weekly iteration cadence** — every Friday review? Or bi-weekly?
7. **Stretch-feature scoring** — Horcruxes / Time Stone / Sorting Hat unlocked at what score?
8. **Bug triaging** — how do pilot participants report bugs? (Issue form? Email? Slack?)
9. **Curriculum stagnation** — when do we add Levels beyond 5? Does the curriculum itself grow?

---

**Document version:** 13 (after Phase 12)
**Last updated:** end of Phase 12 build cycle.