# Formal Specification — Story-Based Lesson Module (Adder)

Status: complete and implemented, as of Version 0.6. Every section
below describes the lesson as it actually exists in the repository
today — reachable from PyBe's client via the sidebar (see Version 0.5
in `version-history.md`) — not a plan for future work. The
"Implementation status" subsections near the end of this document
record how that completeness was reached, version by version, for
anyone tracing the history; they are a historical log, not an
indication that anything described above them is still pending.

## Objective

Add one story-based learning module — "Adder" — to PyBe's client, as a
second, independent way to deliver a Python concept alongside the
existing scenario/AI-Mentor flow. This module teaches the concept of a
**function** without introducing programming syntax until the learner
has already understood the idea in plain language.

## Educational goal

A learner should finish this lesson able to say, in their own words,
that a function is something that:
1. needs specific input before it can do its job,
2. always does the same one job,
3. gives back a result, and
4. can be called again, any number of times, with new input.

The lesson deliberately does not attempt to teach Python syntax beyond
recognizing a single function call (`adder(2, 3)`) — matching the
project's "story-based, minimal syntax" requirement.

## Inputs

- No inputs from outside the module at load time — all lesson content
  is authored data (see `client/src/lessons/content/adderContent.js`).
- At runtime (once the rendering layer exists), the only learner input
  is: clicking to advance through story scenes, selecting multiple-choice
  answers to comprehension questions, typing short reflection text for
  the Discovery screen, and selecting a multiple-choice answer for the
  Python-translation step.

## Outputs

- Visual: the story, in four scenes; five comprehension questions with
  correct/incorrect feedback; three discovery prompts with revealed
  answers; one Python-translation step revealing `adder(2, 3)`; a closing
  summary screen.
- No data is persisted or sent to any server — this module has no
  backend component and does not touch PyBe's existing Express API.

## Learner flow

```
Story (4 scenes)
   -> Questions (5 comprehension questions)
      -> Discovery (3 reflection prompts)
         -> Python Translation (1 multiple-choice step)
            -> Summary (closing message, restart option)
```

Each stage must be completed before the next becomes available — this
matches the original module's design and is unchanged here.

## Assumptions

- The learner has already spent time in the existing PyBe scenario UI
  or is a first-time visitor; this module does not assume any prior
  interaction with the AI Mentor.
- The learner is comfortable with plain English story text and
  multiple-choice interaction; no typing is strictly required except the
  optional Discovery reflection text.
- Only one lesson (Adder) exists in this implementation. Anything that
  would only make sense with more than one lesson (a lesson picker, a
  shared registry, routing between lessons) is explicitly out of scope
  — see `docs/lessons/version-history.md` for what's deferred and why.

## Constraints

- No TypeScript — content and components are plain JavaScript, matching
  the existing PyBe client (`client/src/main.jsx`).
- No Tailwind — any new styling extends the existing
  `client/src/styles.css` conventions.
- No routing library — the lesson is reached via a local UI toggle in
  the existing `App` component, not a URL route (see
  `docs/lessons/system-design.md`).
- No new content beyond what's listed above — the "simulation" screen
  from the original Adder build (watching the function call animate) is
  deferred to a future PR, since the educational point is already made
  by the time the learner completes the Python Translation step.
- All errors raised by this module must go through the centralized
  error factory (`client/src/lessons/errors/index.js`) — see
  `docs/lessons/error-catalogue.md`.

## Implementation status (Version 0.1)

- ✅ Content (`adderContent.js`) — complete for all five screens' data.
- ✅ Centralized error handling (`errors/`) — complete for content
  validation; more codes will be added as later versions introduce
  rendering and interaction.
- ⬜ Presentation components — not yet implemented.
- ⬜ Screen components — not yet implemented.
- ⬜ Lesson orchestrator (`AdderLesson.jsx`) — not yet implemented.
- ⬜ Wiring into `main.jsx` — not yet implemented.

## Implementation status (Version 0.2)

- ✅ Presentation components (`components/LessonUI.jsx`) — complete:
  `LessonPrimaryButton`, `LessonOptionButton`, `LessonCodeBlock`, each
  with centralized prop validation.
- ✅ Stylesheet additions (`client/src/styles.css`) — namespaced
  `.lesson-*` rules appended, confirmed additive only via `diff`.
- ⬜ Screen components — not yet implemented.
- ⬜ Lesson orchestrator (`AdderLesson.jsx`) — not yet implemented.
- ⬜ Wiring into `main.jsx` — not yet implemented.

## Implementation status (Version 0.3)

- ✅ Screen components (`screens/StoryScreen.jsx` through
  `screens/SummaryScreen.jsx`) — complete, each independently rendered
  and interaction-tested (see `docs/lessons/version-history.md`,
  Version 0.3, "Testing Performed").
- ✅ Second stylesheet block for screen-level layout — confirmed
  additive only via `diff`.
- ✅ Centralized error handling extended to the rendering layer
  (`SCREEN_CONTENT_MISSING`).
- ⬜ Lesson orchestrator (`AdderLesson.jsx`) — not yet implemented; the
  five screens above are still not reachable from the running
  application until it exists.
- ⬜ Wiring into `main.jsx` — not yet implemented.

## Implementation status (Version 0.4)

- ✅ Lesson orchestrator (`AdderLesson.jsx`) — complete: sequences all
  five screens in order, restart works, verified end-to-end (see
  `docs/lessons/version-history.md`, Version 0.4, "Testing Performed").
- ✅ Centralized error handling extended to the orchestration layer
  (`ORCHESTRATOR_UNKNOWN_SCREEN`).
- ⬜ Wiring into `main.jsx` — not yet implemented; `AdderLesson.jsx`
  works completely on its own but is still not reachable from the
  running PyBe application until Version 0.5.

## Implementation status (Version 0.5)

- ✅ Wiring into `client/src/main.jsx` — complete. The lesson is now
  reachable from the running application via a sidebar button, and
  exitable via a "Back to PyBe" button. Verified with a real
  production `vite build` and a live backend — see
  `docs/lessons/version-history.md`, Version 0.5, "Testing Performed".
- This closes every item in the original roadmap's file-producing work
  (Version 0.6, the only version remaining, only updates prose
  documentation — no new code).

## Implementation status (Version 0.6)

- ✅ Documentation and release preparation — complete. This document,
  `system-design.md`, `version-history.md`, and `error-catalogue.md`
  reviewed for cross-reference and terminology consistency (zero
  issues found in the four internal documents; three broken references
  found and fixed in the top-level `docs/*.md` files — see
  `docs/lessons/version-history.md`, Version 0.6, "Testing Performed").
- ✅ Top-level PR documents (`docs/essential-docs.md`,
  `docs/product-document.md`, `docs/design-principles.md`) rescoped to
  accurately describe this contribution as one lesson, not the full
  three-lesson framework originally described.
- This is the final planned version. Every item from the original
  roadmap (see `docs/lessons/README.md`) is implemented and documented.
