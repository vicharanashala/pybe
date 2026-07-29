# Changelog

All notable changes to **Pybe** are documented here. The format is
based on [Keep a Changelog](https://keepachangelog.com/), and this
project adheres to [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2026-07-05 — **Initial v1 release**

The first production-ready release. **Every Phase 0–10 acceptance criterion is green; 163/163 tests pass.**

### Added

- **Phase 0 — Foundation.** TypeScript-strict repo, Vite + React 18 + Tailwind v4. 5 seed case studies (cs_001..cs_005), 3 metaphor themes, JSON-Schema validation pipeline, CI on GitHub Actions.
- **Phase 1 — Case Study Player.** Three-region Scenario → Reasoning → Reveal loop, 30-char reasoning gate, Socratic-nudge questions after 30s idle, three concept visuals (StringSlicing, Dictionary, Loop).
- **Phase 2 — Scoring & Levels.** Unbounded score (verified by `no_cap.test.ts` invariant guard), 5-level scale (0/50/150/350/700), level-crossing toasts, local dashboard with leaderboard.
- **Phase 3 — Metaphor Engine.** Dynamic `import.meta.glob` metaphor loader, GoF Decorator (`MetaphorDecorated` over `LessonRenderer`), `/onboarding` flow, header switcher dropdown, first-run guard.
- **Phase 4 — Code Editor (Pyodide).** Lazy-loaded Python in the browser, 10s timeout, cancel via `setInterruptBuffer`, +15 score on first successful run, real stdout/stderr rendering.
- **Phase 5 — Audio & Auto-Complete.** Web Speech API voice input (Chrome/Edge), auto-suggest chips after 30s idle or first submit, Safari graceful-degradation.
- **Phase 6 — Rhizome Graph.** Force-directed concept graph at `/concept-graph` (d3-force), 10 nodes / 11 edges, GoF Iterator (`RhizomeTraverser`), Piaget-stage color-coding, click-to-navigate.
- **Phase 7 — LLM-Backed Content.** `CaseStudyGenerator` interface (Mock + LLM + Composite-with-fallback), `/admin/draft-cases` review surface, hook-word seed list of 25, `npm run generate-cases` driver, 32 case studies total on disk.
- **Phase 8 — Invariant Validation.** `_map.ts` registry of 29 invariants, 4 category files, 6 meta-tests (anti-removal guardrail), `docs/InvariantTests.md`.
- **Phase 9 — Pilot & Launch.** 8-event analytics taxonomy, `LocalStorageTracker` + `PlausibleAnalyticsTracker`, `FeedbackWidget` on every case-study page, `OnboardingModal` 6-step script, `docs/pilot-plan.md` + `docs/pilot-week-1.md` placeholder.
- **Phase 10 — Iterate.** Weekly review template, `docs/ROADMAP.md`, feature-flag mechanism for stretch features (`/weekly-review` page), CHANGELOG (this file).

### Invariants (29 total)

See `docs/InvariantTests.md` for the canonical list. The Phase-8 meta-tests guarantee that removing any invariant test fails CI.

### Test count

163 / 163 passing, 0 typecheck errors, 0 content errors, build clean.

### Known limitations (carried into v2)

- Voice input is browser-only and unauthenticated.
- The LLM-backed generator runs against the Mock generator unless all three `PYBE_LLM_*` env vars are set.
- Analytics is local-first; cross-device sync requires Phase 11 (server-side persistence).
- No accessibility audit yet (Phase 11).

---

## [0.9.0] — 2026-07-01 — Pilot-prep release

- All Phase 0–9 work complete.
- `docs/pilot-plan.md` + `docs/pilot-week-1.md` placeholder.
- Internal: 149/149 tests, build clean.

## [0.5.0] — 2026-06-15 — LLM-enabled release

- Phase 7 merged: 32 case studies; LLM + Mock generator with env-var fallback.
- `npm run generate-cases` shipped.
- 113/113 tests.

## [0.3.0] — 2026-06-01 — Code-execution release

- Phase 4 merged: in-browser Python via Pyodide.
- 65/65 tests.

## [0.1.0] — 2026-05-15 — Internal pre-pilot

- Phase 0–3 complete: Foundation, Player, Scoring, Metaphor Engine.
- 47/47 tests.

## [0.0.1] — 2026-05-01 — Repo bootstrap

- Empty Vite + TypeScript + Tailwind v4 project.
- 5 seed case studies, 3 metaphor files.
- 8 tests.
