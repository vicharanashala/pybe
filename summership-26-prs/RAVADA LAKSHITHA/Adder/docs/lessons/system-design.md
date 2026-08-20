# System Design — Story-Based Lesson Module (Adder)

Status: complete and implemented, as of Version 0.6. The sections
below are organized in two parts: first, the final architecture as it
actually exists in the repository today; second, the incremental
history of how it was built, version by version, for anyone tracing a
specific decision back to when it was made. Nothing in this document
describes work that is still pending.

This file was restructured during Version 0.6's documentation
refinement pass to remove duplication that had accumulated from
several rounds of append-only edits — specifically, two separate
interaction diagrams had ended up describing the same system, and
several section headings still said "(planned)" after the thing they
described was actually built. See `version-history.md`, Version 0.6,
for what changed and why. No functional code changed as part of this
refinement.

---

## Part 1 — Final architecture

### Final folder structure

```
client/src/lessons/
  AdderLesson.jsx          Orchestrator: tracks the current screen and
                           which one to render next.
  errors/
    errorCodes.js          Fixed list of error codes.
    errorMessages.js       Description/cause/recovery text per code.
    index.js               createLessonError() factory + re-exports.
  content/
    adderContent.js        Story, questions, discovery, python-step, and
                           summary content, plus validateAdderContent().
  components/
    LessonUI.jsx           Shared pieces used by more than one screen:
                           LessonPrimaryButton, LessonOptionButton,
                           LessonCodeBlock.
  screens/
    StoryScreen.jsx        Screen 1 — the story, scene by scene.
    QuestionsScreen.jsx    Screen 2 — comprehension questions.
    DiscoveryScreen.jsx    Screen 3 — reflection prompts + keyword check.
    PythonScreen.jsx       Screen 4 — explainer + one multiple-choice step.
    SummaryScreen.jsx      Screen 5 — closing message, no local state.
```

`client/src/styles.css` carries two namespaced `.lesson-*` rule blocks
(colors/interactive states, and structural/layout — added in Versions
0.2 and 0.3 respectively), both purely additive to the file that
existed before this contribution. `client/src/main.jsx` carries one
small, additive integration point — see "Impact on existing code"
below.

No `.tsx`, no Tailwind config, no `react-router-dom` — all deliberately
excluded (see `formal-specification.md`, Constraints).

### Component responsibility

| File | Responsibility |
|---|---|
| `AdderLesson.jsx` | Owns exactly one piece of state — `screenName`, which of the five screens is active. Imports content directly from `content/adderContent.js` and renders the matching screen, passing it the relevant content object and an advance callback (`goToNextScreen` for all screens except Summary, `restart` for Summary). Contains no answer-checking, no keyword matching, and no per-screen state — every one of those responsibilities stays inside the screen that owns it. Raises `LessonErrorCodes.ORCHESTRATOR_UNKNOWN_SCREEN` if its own `screenName` state ever falls outside its known screen order — a defensive check for a maintenance mistake, not a learner-reachable state. |
| `errors/errorCodes.js` | Define every error code this module can raise. No logic. |
| `errors/errorMessages.js` | Map each code to a human-readable description, cause, and recovery step. No logic beyond the lookup object itself. |
| `errors/index.js` | The single `createLessonError(code, context)` function every file in this module calls to construct an error. Nothing else in the module calls `new Error(...)` directly. |
| `content/adderContent.js` | Own all of the Adder lesson's authored content, and validate its own shape at load time via `validateAdderContent()`. Has no knowledge of how the content will be rendered. |
| `components/LessonUI.jsx` | Three presentational-only pieces reused by more than one screen: `LessonPrimaryButton` (the advance/continue/restart action, used by all five screens), `LessonOptionButton` (a clickable option with `default`/`selected`/`correct`/`incorrect` states, used by Questions and Python Translation), and `LessonCodeBlock` (displays one or more lines of code with an optional caption, used by Python Translation and Summary). Each validates its required props at render time via `createLessonError()`. No lesson-specific content lives in this file. |
| `screens/StoryScreen.jsx` | Render `adderStory`'s scenes one at a time; own "which scene is currently showing" and "has this scene's interaction been triggered" state. |
| `screens/QuestionsScreen.jsx` | Render `adderQuestions`; own "which question is showing" and "which option is selected" state; require a correct answer before advancing. |
| `screens/DiscoveryScreen.jsx` | Render `adderDiscovery`'s prompts; own "which prompt is showing", the learner's typed reflection text, and a local `matchesKeyword()` helper checking it against `acceptableKeywords`. |
| `screens/PythonScreen.jsx` | Render `adderPythonTranslation`'s explainer, then its one multiple-choice step; own "has the explainer been dismissed" and "which option is selected" state. |
| `screens/SummaryScreen.jsx` | Render `adderSummary` and the finished code via `LessonCodeBlock`; owns no state — a single restart action is its only interaction. |

Every screen guards its own required props at render time via
`createLessonError()`, raising `LessonErrorCodes.SCREEN_CONTENT_MISSING`
if a required content object or callback is missing.

### Architectural explanation, in one paragraph

This module is intentionally a *flat* React tree with no routing, no
global state library, and no framework abstraction layer: one
orchestrator component picks which of five plain screen components to
show, each screen owns only its own local state, and everything they
render is built from a small set of shared presentational pieces plus
one content file. There is no "lesson engine" or "framework" being
built here — that abstraction is deliberately deferred until (and
unless) a second lesson is approved, at which point the parts that
would actually be shared across lessons (screen sequencing, per-screen
state patterns) become clear from having two real examples instead of
one hypothetical one.

### Component Interaction Diagram

This is the single authoritative diagram for how these files connect —
it reflects the real, wired-up system as it exists in the repository
today, including the `main.jsx -> AdderLesson.jsx` edge added in
Version 0.5.

```
                        client/src/main.jsx
                      (existing file — modified
                       in Version 0.5; see below)
                                 |
                                 |  renders <AdderLesson />
                                 v
                      client/src/lessons/AdderLesson.jsx
                      -----------------------------------
                      owns: screenName (the only lesson-
                            sequencing state that exists)
                                 |
        +------------------+----+----+------------------+
        |                  |         |                  |
        v                  v         v                  v
  content/            screens/*.jsx  errors/          (renders
  adderContent.js    (whichever      index.js          exactly
  ------------------  screen is       ---------         one screen
  read-only content   currently      createLessonError  at a time)
  for all 5 screens   active)         (used if
                          |            screenName is
                          |            unrecognized)
                          v
                  components/LessonUI.jsx
                  ------------------------
                  LessonPrimaryButton
                  LessonOptionButton
                  LessonCodeBlock
                  (each also uses errors/index.js
                   for its own prop validation)
```

**Reading the diagram:** `main.jsx` is the only existing file that
renders `AdderLesson.jsx`. `AdderLesson.jsx` reads content once from
`content/adderContent.js` and decides which single screen to render; it
never renders more than one screen at a time, and never touches
`components/LessonUI.jsx` directly. Each screen reads its own slice of
content (passed down as a prop, not imported by the screen itself),
renders using the shared pieces in `components/LessonUI.jsx`, and calls
back up to `AdderLesson.jsx` (via `onComplete`/`onRestart`) when the
learner finishes it — screens never call each other directly, and never
know what screen comes next. Every error anywhere in this tree — in
content validation, a shared component's prop check, a screen's prop
check, or the orchestrator's own screen-name check — is constructed
through the single `createLessonError()` function in `errors/index.js`,
which is why that file sits centrally in the diagram rather than only
under one branch.

**Data flow, specifically:**
1. `adderContent.js` is imported once, at module load, by
   `AdderLesson.jsx` and by itself (for `validateAdderContent()`, which
   runs immediately on import — if the content is malformed, the error
   surfaces here, before any component ever tries to render it).
2. `AdderLesson.jsx` holds the "current screen" state and passes the
   relevant slice of content down to whichever screen is active, along
   with a callback to advance to the next screen.
3. No content ever flows back up into `adderContent.js` — it is
   read-only from every consumer's perspective. Learner answers and
   progress live only in each screen's local component state and are
   not persisted anywhere (see Constraints in `formal-specification.md`).

### Impact on existing code

The only two files that existed before this contribution and were
modified by it:

- **`client/src/main.jsx`** (Version 0.5) — one new import, one new
  boolean state (`showLesson`), one new early-return branch rendering
  `<AdderLesson />` with a "Back to PyBe" button, and one new sidebar
  button. No existing function, state variable, JSX block, or API call
  was removed, renamed, or restructured. Full enumeration and `diff`
  verification in `version-history.md`, Version 0.5.
- **`client/src/styles.css`** (Versions 0.2 and 0.3) — two appended,
  namespaced `.lesson-*` rule blocks. Confirmed via `diff` both times
  that every changed line was an addition, never a modification of an
  existing rule.

No server-side file (`server/`) was touched by any version of this
contribution.

---

## Part 2 — Incremental build history

This part is a historical record of how Part 1's final architecture
was reached, preserved from the append-only documentation maintained
during Versions 0.1–0.5. It is useful for understanding *why* a
particular file looks the way it does, or for reviewing one version's
diff in isolation — not for understanding the current system, which
Part 1 already fully describes.

### Folder structure, by version

**Version 0.1** added `errors/` (`errorCodes.js`, `errorMessages.js`,
`index.js`) and `content/adderContent.js` — the only two pieces with no
dependency on React rendering, and so the safest possible starting
point.

**Version 0.2** added `components/LessonUI.jsx` and the first
`.lesson-*` stylesheet block (colors and interactive states).

**Version 0.3** added `screens/` (all five screen files) and the second
`.lesson-*` stylesheet block (structural/layout rules).

**Version 0.4** added `AdderLesson.jsx` directly under `lessons/` —
no new folder, since there was exactly one orchestrator and nothing to
group it with.

**Version 0.5** added no new files under `client/src/lessons/` at all;
its only change was wiring `main.jsx` to render `AdderLesson.jsx` (see
"Impact on existing code" in Part 1).

### Component responsibility, by version

What was added in each version, and why, is described in full in
`version-history.md` under that version's own entry (Versions 0.1
through 0.4 each list exactly the files added in that version, in
their "What was added" section). Part 1's "Component responsibility"
table above is the current, consolidated version of that same
information — this section exists only to point to where the
version-by-version reasoning lives, rather than repeating it here a
second time.
