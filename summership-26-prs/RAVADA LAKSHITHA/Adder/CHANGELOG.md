# CHANGELOG — Story-Based Lesson Module (Adder)

Final state. Every file in this package, grouped by type, with why it
exists or changed. Full narrative detail (testing performed,
alternatives considered) is in `docs/lessons/version-history.md` —
this file is the condensed, file-by-file index into that history.

## New files — lesson source code

| File | Reason |
|---|---|
| `client/src/lessons/errors/errorCodes.js` | Fixed registry of every error code the module can raise. |
| `client/src/lessons/errors/errorMessages.js` | Description, likely cause, and recovery step for each code. |
| `client/src/lessons/errors/index.js` | `createLessonError()` — the single factory every file in the module uses to construct an error. |
| `client/src/lessons/content/adderContent.js` | The Adder lesson's authored content (story, questions, discovery prompts, Python step, summary), including the four real story-scene image paths, plus `validateAdderContent()`. |
| `client/src/lessons/components/LessonUI.jsx` | Shared presentational pieces used by more than one screen: `LessonPrimaryButton`, `LessonOptionButton`, `LessonCodeBlock`, `LessonIllustration`. |
| `client/src/lessons/screens/StoryScreen.jsx` | Screen 1 — the story, scene by scene, including the real illustration for each scene via `LessonIllustration`. |
| `client/src/lessons/screens/QuestionsScreen.jsx` | Screen 2 — the five comprehension questions. |
| `client/src/lessons/screens/DiscoveryScreen.jsx` | Screen 3 — the three reflection prompts, styled as a reflection page rather than a quiz. |
| `client/src/lessons/screens/PythonScreen.jsx` | Screen 4 — the code-reveal translation step, with the code block as the visual centerpiece. |
| `client/src/lessons/screens/SummaryScreen.jsx` | Screen 5 — the completion/celebration screen. |
| `client/src/lessons/AdderLesson.jsx` | The orchestrator — owns which screen is active and wires each to its content and callbacks. |

## New files — real image assets

| File | Source | Reason |
|---|---|---|
| `client/public/assets/story/adder/scene-1.png` | Your uploaded `image_1.png` | Scene 1 — Riya crying at her desk. |
| `client/public/assets/story/adder/scene-2.png` | Your uploaded `image_3.png` | Scene 2 — Adder appearing beside Riya. |
| `client/public/assets/story/adder/scene-3.png` | Your uploaded `image_2.png` | Scene 3 — Riya showing the number slips 2 and 3 to Adder. |
| `client/public/assets/story/adder/scene-4.png` | Your uploaded `image_4.png` | Scene 4 — Riya and Adder celebrating; notebook reads "SUCCESS!". |

Each was copied (not moved) from your upload, byte-verified identical
by file size, and each scene's mapping was confirmed by direct visual
inspection of the actual image content — not assumed from filenames.

## New files — documentation

| File | Reason |
|---|---|
| `docs/lessons/README.md` | Documentation entry point and table of contents. |
| `docs/lessons/formal-specification.md` | Objective, educational goal, inputs/outputs, learner flow, constraints. |
| `docs/lessons/system-design.md` | Folder structure, per-file responsibility, component interaction diagram. |
| `docs/lessons/version-history.md` | The complete incremental build log, version by version, with testing performed at each step. |
| `docs/lessons/error-catalogue.md` | Every centralized error code with description, cause, recovery. |
| `docs/lessons/release-checklist.md` | Pre-submission checklist consolidating every verification performed. |

## Modified files — existing PyBe source

| File | Type of change | Reason |
|---|---|---|
| `client/src/main.jsx` | Additive — new import, one `showLesson` state variable, one early-return branch, one sidebar button, and the branch's fragment (`<>`) replaced with `<main className="lesson-page">` (2 lines) | Makes the lesson reachable from the existing app, and gives the lesson branch a proper page-level container to center against. Every existing line in this file is unchanged; nothing was removed or reformatted. |
| `client/src/styles.css` | Additive only — several `.lesson-*` rule blocks appended across the project, including one `.lesson-page` block for page-level centering/padding | Visual styling for every lesson screen, and the fix for a bug found during manual visual review (the lesson rendered pinned to the top-left of the viewport with no centering). Every existing rule in this file is unchanged. |

## Modified files — existing PyBe documentation

| File | Type of change | Reason |
|---|---|---|
| `docs/essential-docs.md` | Full rewrite | The original described three lessons as if all were part of this contribution. Rewritten to scope this PR accurately to the one lesson actually implemented (Adder), with the other two lessons referenced only as external context. |
| `docs/product-document.md` | Full rewrite | Added an explicit "Status of this contribution" section distinguishing the five-screen implementation actually delivered from the original six-stage target design. |
| `docs/design-principles.md` | Full rewrite | Reconciled the stated design principles with what Adder's actual code does, screen by screen. |

## Not modified

No file under `server/` was touched at any point. No other file under
`client/` or `docs/` besides the ones listed above was changed.

## Summary of major milestones, in order

1. **Versions 0.1–0.6** — incremental build: content and centralized
   error handling, shared UI components, the five screens, the
   orchestrator, wiring into `main.jsx`, then documentation and
   release preparation. See `docs/lessons/version-history.md` for the
   full detail on each.
2. **Post-audit documentation refinement** — an independent review
   caught and fixed duplicate/stale sections in `system-design.md` and
   a stale status line in `formal-specification.md`.
3. **React-import bug fix** — a runtime `ReferenceError: React is not
   defined` was diagnosed to seven `.jsx` files missing an explicit
   `import React from 'react'` (this project's build has no
   `vite.config.js` registering the automatic JSX runtime, so every
   JSX file needs this explicitly, matching the existing `main.jsx`
   convention). Fixed with a one-line addition per file.
4. **UI refinement, Phase 3 through Phase 8** — a screen-by-screen
   visual pass (shared components, Story, Questions, Discovery,
   Python, Summary), each phase explained, implemented, and verified
   before moving to the next, preserving all existing state, logic,
   and the orchestrator throughout.
5. **Manual visual review** — real browser screenshots (not just
   automated text-based tests) caught a page-centering bug invisible
   to jsdom-based testing; fixed as its own small, explicit,
   `main.jsx`-only change.
6. **Real image integration** — the four actual story illustrations
   you provided were verified by direct visual inspection, mapped to
   the correct scenes, copied into the project, and wired into
   `adderContent.js`.
7. **Phase 9 (responsive polish)** — inspected at five widths
   (360px/390px/640px/768px/1440px); found already solid from the
   incremental per-phase responsive work done in Phases 3–8, so no
   additional changes were made.
