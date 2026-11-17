# PyFarm

A story-driven Python learning module for PyBe. Maya inherits a small farm; the
learner keeps it running by writing real Python. The code runs for real, and the
farm changes because of what it did.

**MVP scope: Chapter 1 (variables) and Chapter 2 (if / else).** Chapters 3
onward, animals, market, economy, upgrades and achievements are deliberately not
built.

## Run it

```bash
npm install
npm run dev
```

Then open the printed URL. The Python runtime downloads from a CDN on first use
(a few seconds, once per visit), so the first run needs a network connection.

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm test` | Unit tests for the engine (94 tests, Vitest) |
| `npm run verify:python` | Runs both chapters end to end against a **real local Python** (29 checks, including every blank combination) |

`verify:python` needs `python` on PATH — set `PYFARM_PYTHON` to point at a
different interpreter. It is kept out of `npm test` so the unit tests run
anywhere.

## How code execution and validation work

This is the part worth reading before changing anything.

Python runs through **Pyodide** (CPython compiled to WebAssembly) inside a module
Web Worker, reusing the pattern already established in the PyBe repository rather
than adding a second execution mechanism. No new runtime, no server round-trip,
nothing the learner writes leaves their browser.

**Nothing is validated by looking for text in the learner's source.** Each run is
wrapped in a harness (`src/engine/harness.js`) that executes their code, then
reports back the real values left in memory, the real captured stdout, and which
farm helpers were really called. A mission's `validate()` reads that.

- **Chapter 1** passes when the executed program leaves `seeds` holding the
  number `30`. `seeds = seeds + 10`, `seeds += 10`, `seeds = 20 + 10`, going via
  another variable — all pass. `"20" + "10"` gets told it joined text instead of
  adding numbers.
- **Chapter 2** runs the learner's code **twice — once with `weather = "sunny"`,
  once with `weather = "rain"`** — and passes only when the crops get watered on
  the dry morning and the tank is left alone on the wet one. Watering
  unconditionally passes the first and fails the second; an inverted condition
  fails both in opposite directions. Only real branching satisfies both, which is
  something no string match could establish. The UI shows the learner both
  mornings, so the verdict is visible rather than asserted.

Source text is consulted in exactly two places, both marked in
`src/engine/missions.js`, and only ever to pick a more helpful message — never to
decide pass or fail.

Every verdict — pass **and** fail — carries a farm patch, so the scene always
shows what the last run actually did. Choose `seeds = 10` and the sack really
drops to 10 next to the explanation; the farm never keeps a better result than
the code just produced.

### Two ways in, one way of being judged

The code stage offers a mode switch:

- **Fill in the blanks** (the default) gives the program's shape — including its
  indentation — and asks which snippet belongs in each gap. Chapter 1 has one
  blank, Chapter 2 has three: the test, and the body of each branch.
- **Write it yourself** is the free editor.

The scaffold is not a softer grader. What the pickers assemble is real Python
that goes through the same harness and the same validator, so a wrongly filled
blank fails because the program misbehaved. Switching to the editor carries the
assembled code over as a starting point, unless the draft has already been
edited.

`npm run verify:python` runs **every combination the pickers can produce** — 5
for Chapter 1, all 36 for Chapter 2 — and asserts the exact set that passes. That
catches both a distractor slipping through and a logically-correct combination
being wrongly rejected. Chapter 2 has five correct answers: test for rain and
water in the `else`, or test for sun and water in the `if`, either by calling
`water_crops()` or by spending from the tank directly.

The distractors are chosen to teach. Picking `weather = "rain"` as the condition
produces Python's own `invalid syntax. Maybe you meant '==' or ':=' instead of
'='?`, which is exactly what the preceding explanation warned about; `water == 50`
is true on both mornings, so the learner sees a decision that never decides.

Two safeguards keep a mistake from hanging the tab: the harness counts executed
lines and stops itself past 20,000, and the JS side terminates and re-spawns the
worker after 15 seconds.

## Layout

```
src/
├── PyFarm.jsx              module root: chapter select, XP, progress, persistence
├── pyfarm.css              all styling, every class `pf-` prefixed
├── main.jsx                standalone entry point
│
├── shared/pyodide/         Python execution
│   ├── pyodideWorker.js      loads Pyodide, runs code off the main thread
│   ├── usePyodide.js         status/run/runJSON, with timeout + worker respawn
│   └── PyodideContext.jsx    loads the runtime once, shared by both chapters
│
├── engine/                 pure logic — no React, no DOM, fully unit-tested
│   ├── harness.js            builds the Python; scenario rewriting; error wording
│   ├── missions.js           mission data + validate() per mission + hints + blanks
│   ├── blanks.js             template parsing and assembly for fill-in-the-blanks
│   ├── farmState.js          initial state, reducer, unlock rules, persistence
│   └── runMission.js         runs a mission's scenarios and returns the verdict
│
├── data/chapters.js        story beats, dialogue, concept reveals
│
├── components/
│   ├── FarmScene.jsx         the farm, as original SVG; renders state only
│   ├── Maya.jsx              original SVG character, five moods
│   ├── ResourceBar.jsx       header: XP, coins, level
│   ├── StoryPanel.jsx        the six story screens
│   ├── CodeChallenge.jsx     mode switch, editor, run, hint ladder, verdict
│   ├── BlankFill.jsx         the fill-in-the-blanks pickers
│   └── PyCode.jsx            small read-only Python colouriser
│
└── chapters/ChapterRunner.jsx   one runner drives every chapter
```

**Adding Chapter 3** means: one entry in `data/chapters.js`, one in
`engine/missions.js` (with an optional `blanks` block), one in `CHAPTER_ORDER` in
`engine/farmState.js`. No component changes. A mission with no `blanks` block
simply shows the editor with no mode switch.

Each chapter walks seven screens — story, problem, think, concept, Python,
code, reward — which between them cover the twelve story beats. The think screen
comes *before* the concept is named, so the learner reasons their way to the idea
instead of being handed a definition.

## Dependencies

React, Vite, and Vitest. That is all. Pyodide is loaded from a CDN at runtime, so
it is not an npm dependency. No icon library, no CSS framework, no editor
library — the editor is a `textarea` (Tab indents, Shift+Tab outdents, Escape
leaves the field), matching the approach used elsewhere in PyBe.

`vite.config.js` sets `worker.format: 'es'`, which is **required**: Vite's default
IIFE worker output cannot represent the worker's external ES `import` of
`pyodide.mjs` and fails silently.

## Accessibility

Semantic buttons throughout, a visible focus ring on everything focusable,
keyboard-only paths in and out of the editor, `aria-live` on verdicts and XP, a
text description of the farm scene for screen readers, and pass/fail always
carrying an icon and a word so nothing depends on colour alone. The blank pickers
are real radio inputs in a labelled `fieldset`, so arrow-key movement within a
group works natively, and a chosen option is marked by its radio and a thicker
border as well as by colour. A disabled Run button always says why. Text contrast
was measured against WCAG AA across every screen and all 248 rendered elements
pass. All motion is decoration over information that is already legible, and is
disabled under `prefers-reduced-motion`.

## Progress

XP and completed missions persist in `localStorage` (guarded — private browsing
makes it throw), so a refresh does not cost the learner what they finished. Farm
resources deliberately start fresh each visit; only progress is restored.
Re-running a solved mission does not award its XP twice. "Reset my progress"
clears it.

Chapter 1 → 50 XP → unlocks Chapter 2 → 75 XP → 125 XP total.

## Notes and limitations

- The first run of a session waits on the Pyodide download. The story and
  concept screens stay fully usable while it loads, and a blocked CDN reports a
  readable reason rather than a runtime that never becomes ready.
- Chapter 2 rewrites the learner's own top-level `weather = "..."` line to drive
  each scenario. A learner who tracks the weather in a differently-named variable
  will see both mornings behave identically and gets told their code never asks a
  question — correct feedback, arrived at behaviourally.
- Under React StrictMode in dev, effects mount twice and the Python runtime
  therefore loads twice. Production builds mount once.
