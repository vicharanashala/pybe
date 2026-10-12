# PyKatha — Project Context

This file records the current **final state** of the project plus its implementation history, so any future contributor can pick it up without re-discovering everything. **Keep it updated alongside code changes.**

_Last updated: 12 August 2026 — documentation quality pass for mentor review / PR submission._

---

## Project Objective

PyKatha teaches beginner Python control-flow concepts (`if`, `while`, `for`) through original fables. The learner reads a story, answers reasoning questions, discovers the hidden programming logic inside the tale, practises the concept in Python, and closes with a moral. Tagline: **Think the Story. Discover the Code.**

**The current MVP is feature-complete for the agreed learning workflow.** Future work should extend content, not rebuild the flow.

## Current Implementation State

- **Feature-complete MVP** — the full seven-stage learning flow ships and every stage passes both lint and build.
- **Client-only React SPA.** React 19, `react-router-dom` 7, Vite 8, plain CSS. No backend, no global state library, no AI, no auth, no analytics, no code execution engine.
- **Content is static and hand-authored** — questions, reveal steps, practice items, and morals are pure data; the practice "output" is pre-written story text (not interpreter output).
- **No progress persistence** — refreshing restarts the journey; any stage is reachable by direct URL.

## Complete Workflow (implemented)

```
Landing → Story Selection → Story Reader → Thinking Challenge
→ Challenge Complete → Secret Behind the Story (Hidden Logic)
→ Practice → Moral / Lesson
```

### Routes (declared in `src/App.jsx`)

| Route | Page (`src/pages/`) |
|---|---|
| `/` | `Landing.jsx` |
| `/stories` | `StorySelection.jsx` |
| `/story/:id` | `StoryReader.jsx` |
| `/challenge/:id` | `ThinkingChallenge.jsx` |
| `/reveal/:id` | `SecretBehindStory.jsx` (Hidden Logic) |
| `/practice/:id` | `Practice.jsx` |
| `/moral/:id` | `Moral.jsx` |

## Three Stories and Concepts

| # | Story | Route id | Concept | Code revealed |
|---|---|---|---|---|
| One | Rabbit and the Moon | `rabbit-if` | `if` statement | `if path_visible:\n    cross()` |
| Two | Crow and the Pitcher | `crow-while` | `while` loop | `while water_out_of_reach:\n    drop_pebble()` |
| Three | The Turtle's Journey | `turtle-for` | `for` loop | `for milestone in journey:\n    reach(milestone)` |

Each story folder mirrors this five-module shape:

```
src/stories/<id>/
├── story.js        # title, concept, readingTime, chapter, paragraphs, illustrationType
├── questions.js    # 5 questions (Observation, Pattern, Reasoning, Prediction, +Blank)
├── code.js         # storyMoment → pattern → logic → code (the 4-step reveal)
├── practice.js     # codeTemplate, options[], answer, output, reminder
└── moral.js        # conceptName, conceptLine, storyReflection, realLife, closing
```

## Key Implementation Details

- **Story data** is loaded via **dynamic imports** per `:id` (`import(\`../stories/${id}/story.js\`)`), each guarded by a `cancelled` flag and a `.catch()` that yields the friendly missing-state. Adding a story requires **no page code changes** — only new data files plus three registrations.
- **Story id registrations** (keep in sync): `STORIES` in `StorySelection.jsx`, `STORY_IDS` in `StoryReader.jsx`, `PRACTICE_STORIES` in `Practice.jsx`.
- **Components:** `StoryCard` (selection cards), `StoryIllustration` (reader hero, scene keys `moon`/`crow`/`turtle`), `StoryImage`/`StorybookHero` (Landing hero). All art is inline SVG.
- **Styling:** colocated CSS per page/component; `src/styles/{global,variables,typography}.css` for tokens and type (Inter, Cormorant Garamond, Lora, ui-monospace). Warm storybook palette (paper, ink, forest green, gold, clay orange). Full `prefers-reduced-motion` support and focus-visible styling.

## Completed Features

- Full seven-stage learning flow (above).
- Three complete stories (above).
- Story reader with scroll-based reading-progress bar and prev/next chapter navigation.
- Thinking Challenge with 5 questions per story (Observation, Pattern recognition, Reasoning, Prediction, + one Fill-in-the-Blank), immediate per-question feedback, "No scores. Just thinking."
- Hidden Logic reveal in four escalating steps (story moment → pattern → logic → Python code), with Enter-key advancing.
- Practice page: fill-in-the-blank from selectable option chips, "See What Happens" story output on the correct answer, gentle hint otherwise.
- Moral page: concept name, definition, story reflection, real-life reflection, closing, and re-entry CTAs.
- Graceful **loading** and **missing-story** states on every stage route.
- Responsive layouts with mobile breakpoints on every page; inline SVG favicon in `index.html`.

## Important Decisions (summary — full rationale in `docs/DECISIONS.md`)

1. **Story-first learning** instead of syntax-first learning.
2. **One concept per story** — clean story→code mapping; no cognitive overload.
3. **Story hidden during questions** — forces recall and reasoning, not search.
4. **Reasoning-based questions** — observation/pattern/prediction mirror the skills of reading code.
5. **Pattern and logic revealed before syntax** — the code is a translation of the learner's own conclusion.
6. **Selectable option chips** for blank-filling (challenge and practice) — concept choice without typo friction.
7. **Short, focused learning journey** — one sitting, low stakes, deterministic, reviewable.
8. **Three concepts for the MVP** — a minimal complete set (`if`/`while`/`for`).
9. **No AI mentor in v1** — content is hand-authored and deterministic, reviewable, cheap, testable.
10. **No database / progress persistence in v1** — no accounts, no surveillance; trivially hostable.

## Documentation Structure

| File | Purpose |
|---|---|
| `README.md` | Project introduction: problem, philosophy, flow, stack, run/build, limitations, future scope |
| `docs/PRODUCT.md` | Product requirements/intent: problem, approach, target learner, principles, MVP scope, non-goals |
| `docs/ARCHITECTURE.md` | Technical architecture: routing, pages, story data model, dynamic loading, CSS, state |
| `docs/LEARNING_FLOW.md` | The exact journey + **the discovery pipeline** (core methodology) |
| `docs/CASE_STUDIES.md` | Per-story walkthroughs: scenario → observation → pattern → logic → code → practice |
| `docs/STORY_AUTHORING.md` | How to author the next story (field reference, question rules, checklist) |
| `docs/DEVELOPMENT.md` | Commands, workflows, verification, 10-step contribution process |
| `docs/DECISIONS.md` | 10 decisions with Decision/Context/Reason/Trade-off/Current status |
| `context.md` | This handoff file |

## Validation Status

- `npm run lint` — **passes** (ESLint flat config, zero errors).
- `npm run build` — **passes** (Vite production build succeeds; story data is code-split into per-story chunks).
- Stale-reference audit: no `PyThink`, `InteractiveDemo`, `NeuralBackground`, `think-demo`, `demoSteps`, `TODO`, or `FIXME` leftovers remain anywhere in source or docs (the only match was the audit note itself in earlier versions of this file).
- Content consistency audit (final pass): for each story, story rule == challenge question == reveal == practice answer == moral —
  - Rabbit: `path_visible` gates the crossing (challenge q1/q4, reveal `if path_visible: cross()`, practice `path_visible`, moral "wait for your silver path").
  - Crow: `water_out_of_reach` drives the repetition (challenge q4/q5, reveal `while water_out_of_reach: drop_pebble()`, practice `water_out_of_reach`, moral "keep going while the water is out of reach").
  - Turtle: `journey` is the iterable set (challenge q2/q4, reveal `for milestone in journey: reach(milestone)`, practice iterates `journey`, moral "milestone by milestone").
- Prior audit findings retained for the record: removed stale scaffold dirs (`components/Button|CodeReveal|Layout|ProgressBar|QuestionCard`, empty `assets/*` `.gitkeep` placeholders); re-aligned `styles/variables.css` to the warm palette; corrected Rabbit practice to `path_visible`; added inline SVG favicon.

## Remaining Known Limitations

- Only `if`, `while`, `for` are covered (three-story MVP).
- Practice is a single fill-in-the-blank per story; the code is **not actually executed** — output is pre-written story text.
- **No progress persistence** — refreshing restarts the journey; any stage is reachable by direct URL (by design).
- All content is static and hand-written (by design, no AI).
- Production hosting requires SPA fallback (all routes rewritten to `index.html`).

## Next Possible Work (post-MVP ideas, none started)

- New stories for more concepts (`if-else`, `elif`, `for` with `range`, lists, functions).
- Multiple practice problems per story (page already renders "Problem X of N"; only one problem defined per story today).
- Lightweight account-free progress tracker between stages.
- Optional audio narration / text-to-speech.
- Localisation / translation.

## Finalization / PR Status

- **Status:** Ready for mentor review and pull request.
- Branch in the parent repository: `feature/pykatha-prototype` (this project folder is registered as a submission under the summer programme's PRs directory).
- Suggested commit scope: the final source, `README.md`, `docs/`, and `context.md`.
- Before PR: confirm with the mentor whether `dist/` should be included (it is git-ignored by default) and re-run `npm run lint` / `npm run build` on a clean `npm install`.

---

## Handoff Rules for Future Contributors

- After any **meaningful implementation change** (new story, new feature, content correction), update this file: the implementation state, stories/concepts table, validation status, and limitations.
- Documentation and source must always match reality — if you change behaviour, update the docs that describe it (especially `LEARNING_FLOW.md`, `ARCHITECTURE.md`, and any affected `CASE_STUDIES.md`).
- Never claim features that do not exist in the docs (no code execution, no persistence, no AI, no auth).