# Version History — Story-Based Lesson Module (Adder)

Each version corresponds to one commit in the implementation roadmap.
Every version builds on the previous one; nothing here is rewritten
after landing, only extended.

## Version 0.1 — Content + centralized error handling

**What was added**
- `client/src/lessons/errors/errorCodes.js` — the fixed set of error
  codes this module can raise (currently two: a missing content
  section, and an invalid content shape).
- `client/src/lessons/errors/errorMessages.js` — description, possible
  cause, and recovery text for each code.
- `client/src/lessons/errors/index.js` — `createLessonError()`, the
  single factory function for constructing a lesson error.
- `client/src/lessons/content/adderContent.js` — the Adder lesson's
  full content (story, comprehension questions, discovery prompts,
  Python-translation step, summary), plus `validateAdderContent()`,
  which checks the content's shape and throws a centralized error if
  anything required is missing or inconsistent.

**What changed**
- Nothing existing was modified. No file outside the new
  `client/src/lessons/` directory was touched.

**Why it changed**
- This is the first commit in the roadmap specifically because content
  and error-handling have no dependency on React rendering — they can
  be fully verified by running the file directly, with zero risk to
  the existing PyBe client.

**Current limitations**
- No lesson content is reachable from the running application yet —
  there is no UI that imports `adderContent.js`.
- `validateAdderContent()` checks structural shape only (required
  fields present, `correctOptionId` values pointing at a real option).
  It does not check prose quality, spelling, or pedagogical accuracy —
  those remain a human review responsibility.
- Only two error codes exist, both specific to content validation.
  Codes for rendering or learner-interaction failures will be added in
  the version that first introduces the code that can throw them (see
  planned versions below).

**How to run**
From the repository root:
```
cd client/src/lessons/content
node --experimental-vm-modules adderContent.js
```
(Or, once bundled into the Vite build in a later version, simply run
the existing `npm run dev --prefix client` — validation runs
automatically on import.) A successful run prints nothing and exits
cleanly, since `validateAdderContent()` only throws on failure.

**Expected output**
- Success: the module loads with no output and no thrown error.
- Failure (e.g. content edited into a broken shape): a thrown `Error`
  whose `.code` is one of `LessonErrorCodes`, whose message includes a
  human-readable description, and whose `.context` names the specific
  section/field/id that failed. Verified manually during this version
  by deliberately breaking a `correctOptionId` and confirming the
  expected code, message, and context were produced.

---

## Version 0.2 — Shared presentational components + stylesheet additions

**What was added**
- `client/src/lessons/components/LessonUI.jsx` — three shared
  presentational components used by more than one lesson screen:
  `LessonPrimaryButton`, `LessonOptionButton` (with `default`,
  `selected`, `correct`, and `incorrect` visual states), and
  `LessonCodeBlock` (accepts a single code line or an array of lines,
  plus an optional caption).
- A new error code, `LessonErrorCodes.COMPONENT_PROP_MISSING`, added to
  `errors/errorCodes.js` and `errors/errorMessages.js` — see
  `docs/lessons/error-catalogue.md` for the full entry.

**What changed**
- `client/src/styles.css` — new rules appended for `.lesson-primary-
  button`, `.lesson-option-button` (and its three state modifiers), and
  `.lesson-code-block`. Confirmed via `diff` against the pre-Version-0.2
  file that every changed line is a pure addition — zero existing rules
  were modified or removed.
- `errors/errorCodes.js` and `errors/errorMessages.js` — extended with
  one new code, matching the "add a code in the version that first
  needs it" rule from Version 0.1.

**Why it changed**
- These three components are the only UI reused by more than one
  screen (`LessonPrimaryButton` by all five; `LessonOptionButton` by
  Questions and Python Translation; `LessonCodeBlock` by Python
  Translation and Summary) — see `docs/lessons/system-design.md` for the
  reasoning on why nothing else was promoted to this shared file.
- Each component validates its required props and raises a centralized
  error if one is missing, rather than rendering silently broken
  markup — the first rendering-layer use of the error module
  established in Version 0.1.
- The stylesheet is namespaced under `.lesson-` specifically because
  `styles.css` already has an unrelated `.primary` and `.code-block`
  class belonging to the existing AI Mentor UI; reusing those names
  would have caused a real collision.

**Current limitations**
- These components are still not imported by anything reachable from
  the running application — no screen exists yet to use them.
- Prop validation is intentionally shallow (presence/type checks, not
  full runtime type-checking) — matching the "no TypeScript" constraint
  from the Formal Specification.

**How to run**
A syntax/bundle check was performed with `esbuild` against
`components/LessonUI.jsx` in isolation (confirming JSX and the
relative `../errors` import both resolve correctly); full behavioral
verification will happen once a screen component renders these in
Version 0.3.

**Expected output**
- `esbuild --bundle` on `LessonUI.jsx` completes with no errors.
- `diff` of `styles.css` before/after shows only added lines (`>`),
  zero removed or changed lines (`<`).

---

## Version 0.3 — Screen components

**What was added**
- `client/src/lessons/screens/StoryScreen.jsx` — renders `adderStory`
  scene by scene; owns which scene is showing and whether the current
  scene's optional interaction has been triggered.
- `client/src/lessons/screens/QuestionsScreen.jsx` — renders
  `adderQuestions`; owns which question is showing and which option is
  selected; requires a correct answer before advancing.
- `client/src/lessons/screens/DiscoveryScreen.jsx` — renders
  `adderDiscovery`'s prompts; owns which prompt is showing and the
  learner's typed reflection; contains a local `matchesKeyword()`
  helper (case-insensitive substring check), not promoted to a shared
  `utils/` file since it has exactly one caller.
- `client/src/lessons/screens/PythonScreen.jsx` — renders
  `adderPythonTranslation`'s explainer, then its one multiple-choice
  step; owns whether the explainer has been dismissed and which option
  is selected.
- `client/src/lessons/screens/SummaryScreen.jsx` — renders
  `adderSummary` and the finished code; owns no state.
- A new error code, `LessonErrorCodes.SCREEN_CONTENT_MISSING`, added to
  `errors/errorCodes.js` and `errors/errorMessages.js` — see
  `docs/lessons/error-catalogue.md`.

**What changed**
- `client/src/styles.css` — a second namespaced `.lesson-*` block
  appended, covering screen-level layout (`.lesson-screen`,
  `.lesson-option-list`, `.lesson-reflection-input`, `.lesson-feedback`,
  `.lesson-discovery-answer`, `.lesson-explainer-list`,
  `.lesson-story-result`). Confirmed via `diff` that every changed
  line is a pure addition.
- `errors/errorCodes.js` and `errors/errorMessages.js` — extended with
  one new code, matching the established pattern.

**Why it changed**
- Each screen owns only the state specific to itself (matching the
  "each screen responsible only for its own state" requirement) — no
  state is shared between screens, and no orchestration logic lives in
  any screen file; that's deliberately left for `AdderLesson.jsx` in
  Version 0.4.
- `DiscoveryScreen`'s keyword-matching logic stayed inline rather than
  becoming a `utils/` file, per "do not introduce unnecessary
  abstractions" — it has exactly one caller today.
- Every screen validates its own required props at render time via the
  same centralized error pattern established in Version 0.2, extended
  to a new code (`SCREEN_CONTENT_MISSING`) since a screen missing its
  content prop is a distinct failure from a shared component missing
  one of its own.

**Current limitations**
- None of the five screens are reachable from the running application
  yet — there is still no orchestrator (`AdderLesson.jsx`, planned for
  Version 0.4) deciding which screen to show, and no wiring into
  `main.jsx` (planned for Version 0.5).
- `DiscoveryScreen`'s keyword check is intentionally simple
  (case-insensitive substring match) — it will occasionally accept a
  reflection that happens to contain a keyword without genuinely
  demonstrating understanding, or reject a correct answer phrased
  without any listed keyword. This tradeoff was made deliberately (see
  Formal Specification, Constraints) rather than introducing a
  semantic-matching utility for one lesson's three prompts.
- Prop validation on each screen checks presence/type only, not full
  content shape (that remains `validateAdderContent()`'s job from
  Version 0.1).

**How to run**
No screen is wired into the app yet, so verification was performed via
an isolated test harness (see "Testing Performed" below) rather than
`npm run dev`. That remains true until Version 0.5.

**Expected output**
See "Testing Performed" — all listed checks pass.

**Testing Performed**

Each screen was mounted in isolation using React 18 (`react-dom/client`)
inside a jsdom environment (not a browser), with real DOM events
(`click`, `input`) dispatched to simulate learner interaction — not a
static render check. 30 assertions were run; all 30 passed as of this
version.

*StoryScreen* (6 checks): renders the first scene's text; advances to
the next scene on continue; the scene with an interaction shows its
prompt and withholds the continue button until the interaction is
triggered; triggering the interaction reveals its result; `onComplete`
fires exactly once, after the final scene.

*QuestionsScreen* (4 checks): an incorrect selection shows the
incorrect-answer explanation and does not allow advancing; a correct
selection shows the correct-answer explanation; `onComplete` fires
after the final question is answered correctly.

*DiscoveryScreen* (3 checks): a reflection with no matching keyword
does not reveal the answer; a reflection containing an acceptable
keyword does reveal it; `onComplete` fires after the final prompt is
answered and continued past.

*PythonScreen* (6 checks): the explainer shows before the step; the
step's prompt shows after continuing past the explainer; an incorrect
option shows the hint; the code block is confirmed absent (via
`querySelector`, not a text match — the correct answer's label is
itself the code text, so a plain text check would have been a false
negative) before a correct answer and present after one; `onComplete`
fires after continuing past the revealed code.

*SummaryScreen* (3 checks): renders the title and the final code;
`onRestart` fires when the restart button is clicked.

*Error guard clauses* (8 checks): each of the five screens was mounted
without its required content prop, and each screen requiring a
callback was mounted without it (`StoryScreen`, `SummaryScreen` x2 for
`onRestart`/`finalCode`) — every case threw an `Error` with
`.code === 'LESSON_SCREEN_CONTENT_MISSING'`, confirming the centralized
error path works end-to-end from an actual React render, not just by
inspection.

One test-writing mistake was caught and corrected during this process:
an early assertion checked for the revealed code as plain text, which
produced a false failure because the correct multiple-choice option's
label is itself the code text (`adder(2, 3)`), so it was already
present in the rendered option list before being answered. The
assertion was corrected to check for the presence of the
`.lesson-code-block` element specifically, which is the actual signal
of interest — noted here since it affects how future screens' tests
should be written wherever an option's label matches revealed content.

---

## Version 0.4 — Lesson orchestrator

**What was added**
- `client/src/lessons/AdderLesson.jsx` — the lesson orchestrator. Owns
  exactly one piece of state (`screenName`), imports content directly
  from `content/adderContent.js`, and renders whichever screen is
  currently active, passing it the content and callback it needs.
  Contains `goToNextScreen()` and `restart()`, and no other logic.
- A new error code, `LessonErrorCodes.ORCHESTRATOR_UNKNOWN_SCREEN`,
  added to `errors/errorCodes.js` and `errors/errorMessages.js` — see
  `docs/lessons/error-catalogue.md`.
- A component interaction diagram in `docs/lessons/system-design.md`
  showing how `main.jsx`, `AdderLesson.jsx`, the five screens,
  `LessonUI.jsx`, `adderContent.js`, and the centralized error module
  all connect.

**What changed**
- `errors/errorCodes.js` and `errors/errorMessages.js` — extended with
  one new code, matching the established pattern.

**Why it changed**
- `AdderLesson.jsx` contains no screen-specific business logic by
  design — no answer-checking, no keyword matching, no per-screen
  state — matching the explicit requirement for this version. Every
  one of those responsibilities was already implemented inside the
  screens themselves in Version 0.3; this file only sequences them.
- The file was kept deliberately small (a fixed screen-order array, two
  short functions, and a switch statement) rather than introducing a
  generic "screen registry" or reducer pattern, since a plain switch
  over five known values is the more readable choice for exactly five
  screens and would only become worth generalizing with a second
  lesson to justify it.
- `ORCHESTRATOR_UNKNOWN_SCREEN` exists to guard the one piece of new
  state this version introduces (`screenName`), consistent with
  extending centralized error handling to each new piece of logic as
  it's added.
- No `onExit` prop was added in this version, even though the eventual
  `main.jsx` wiring will likely want one — adding it now would be an
  unused prop with nothing calling it yet; it belongs in Version 0.5,
  the version that actually has somewhere for it to exit to.

**Current limitations**
- `AdderLesson.jsx` is still not reachable from the running
  application — it works completely on its own (verified below) but
  nothing in `main.jsx` renders it yet. That's Version 0.5.
- `ORCHESTRATOR_UNKNOWN_SCREEN` cannot be triggered through any prop or
  interaction available from outside the component as written — see
  the Error Catalogue for why this is stated as an honest limitation
  of what could be tested, rather than left unverified silently.

**How to run**
Still not wired into `npm run dev --prefix client` — verified via an
isolated test harness (see "Testing Performed" below), same approach
as Version 0.3.

**Expected output**
See "Testing Performed" — all listed checks pass.

**Testing Performed**

`AdderLesson` was mounted on its own (no props) using React 18 in a
jsdom environment, and driven through the *entire* lesson — story
through summary through restart — using real DOM click and input
events, the same technique used for the individual screens in Version
0.3, but this time exercising the orchestrator's sequencing rather than
any single screen in isolation. 6 assertions were run; all 6 passed:

1. The lesson starts on the story screen (real Adder story text present).
2. Advancing through all four story scenes (including triggering the
   one scene with an interaction) lands on the questions screen, with
   real question content from `adderContent.js` visible — confirming
   `AdderLesson` passed the correct content object, not a stub.
3. Answering all five comprehension questions correctly advances to the
   discovery screen, again with real prompt content visible.
4. Typing a matching keyword for each of the three discovery prompts
   and continuing advances to the Python screen, with the real
   explainer text visible.
5. Continuing past the explainer and selecting the correct
   multiple-choice option advances to the summary screen, which shows
   the real final code (`adder(2, 3)`) — confirming `finalCode` was
   correctly threaded from `adderPythonTranslation` through to
   `SummaryScreen`.
6. Clicking the restart button returns to the first story scene,
   confirming `restart()` resets `screenName` correctly.

`ORCHESTRATOR_UNKNOWN_SCREEN` was **not** exercised by this test suite
— see "Current limitations" above and the Error Catalogue for why: it
guards a state that cannot be reached through any prop or interaction
this component exposes. It was verified by code inspection instead:
confirming the `default` case in the switch statement is the only path
that can produce this error, and that every value `screenName` can
actually take (from `SCREEN_ORDER`, `goToNextScreen`, and `restart`)
has a corresponding `case`.

---

## Version 0.5 — Wiring into main.jsx

**What was added**
- One new import in `client/src/main.jsx`:
  `import { AdderLesson } from './lessons/AdderLesson';`
- One new state variable: `const [showLesson, setShowLesson] = useState(false);`
- One new early-return branch, directly after the existing `loading`
  early-return, rendering `<AdderLesson />` (with a "Back to PyBe"
  button above it) when `showLesson` is true.
- One new button in the sidebar, directly after the existing `brand`
  block, setting `showLesson` to true.

**What changed**
- `client/src/main.jsx` only. No other file was modified in this
  version — not `styles.css`, not `AdderLesson.jsx`, not any file
  under `client/src/lessons/`.

**Why it changed**
- This is the one place in the whole implementation that has to touch
  an existing file, so it was deliberately isolated to its own version
  (per the roadmap) and kept to the smallest possible diff: 4 additive
  edits, 0 removed lines, 0 renamed or reformatted lines. Confirmed via
  `diff` against the pre-Version-0.5 file — see "Testing Performed"
  below.
- The entry button and the "Back to PyBe" exit button both reuse the
  existing `.primary` CSS class already defined for the "Map My
  Reasoning" button, rather than introducing a new class — avoiding
  any need to touch `styles.css` this version.
- **On `onExit`:** the roadmap's Version 0.5 plan anticipated
  `AdderLesson` accepting an `onExit` callback. That was deliberately
  **not** added. Passing `onExit={() => setShowLesson(false)}` into
  `AdderLesson` would only be "actively used" if `AdderLesson.jsx`
  itself rendered something that calls it — and modifying
  `AdderLesson.jsx` would violate this version's "modify only
  main.jsx" constraint. Instead, the exit control lives entirely
  outside `AdderLesson` — the "Back to PyBe" button is rendered by
  `main.jsx`, wrapping `<AdderLesson />`, and toggles `showLesson`
  directly. `AdderLesson.jsx` remains exactly as it was in Version 0.4,
  unaware that it can be exited. `onExit` stays deferred; if a future
  version wants the exit control to live inside the lesson itself
  (e.g. on every screen, not just above it), that version will modify
  `AdderLesson.jsx` and can add `onExit` at that point, actively used.

**Current limitations**
- The "Back to PyBe" button is only shown once, above whichever screen
  is active — a learner mid-lesson must use it to leave; there's no
  per-screen exit control (see the `onExit` note above for why, and
  where that would be addressed).
- The entry and exit buttons are unstyled beyond the existing
  `.primary` class — no lesson-specific button placement/spacing was
  added, since that would require touching `styles.css`, out of scope
  for this version's "modify only main.jsx" constraint.

**How to run**
```
npm run installAll   # from the repo root, if not already done
npm run seed          # from the repo root, if not already done
npm run dev           # from the repo root — starts server + client together
```
Then open the client in a browser: the sidebar now shows a "Try:
Story-based lesson (beta)" button above the search box. Clicking it
replaces the workspace with the Adder lesson; "Back to PyBe" returns
to the mentor UI exactly as it was.

**Expected output**
- Default view (no interaction): identical to the pre-Version-0.5 app —
  same scenario list, same search/filter behavior, same AI Mentor form.
- After clicking "Try: Story-based lesson (beta)": the full five-screen
  Adder lesson renders, exactly as verified in Version 0.4.
- After clicking "Back to PyBe": the mentor UI reappears, with its
  state (selected scenario, filters, in-progress form text) intact,
  since `showLesson` is the only thing that changed — the rest of
  `App`'s state was never touched or reset.

**Testing Performed**

1. **Diff verification.** `diff` was run between the pre-Version-0.5
   `main.jsx` and the patched version. Result: exactly 4 additive
   hunks, 0 removed lines, 0 changed lines — confirmed the diff is
   purely additive with no reformatting of unrelated code. Line-ending
   convention (CRLF, matching the original file) was confirmed
   preserved on every added line.
2. **Real production build.** The full official `pybe` client
   (unmodified `package.json`/config, real `npm install`) was built
   with `vite build` after copying in the patched `main.jsx`,
   `styles.css` (from Version 0.3), and the complete
   `client/src/lessons/` tree (Versions 0.1–0.4). The build succeeded
   with no errors: 1582 modules transformed (vs. 1571 in an unmodified
   baseline build performed for comparison — the +11 is exactly the
   lesson module's file count).
3. **Bundle content check.** The built production JS bundle was
   inspected directly (`grep`) and confirmed to contain both existing
   mentor-UI strings ("Map My Reasoning", "Learner Analytics") and new
   lesson strings ("Try: Story-based lesson", "Back to PyBe", "Adder",
   "Riya") together in the same shipped file — direct evidence the two
   features coexist in one build, not evidence from two separate
   builds compared only in isolation.
4. **Real backend verification.** The actual Express server (unmodified
   `server/` — not touched by this or any prior version) was installed,
   seeded (`npm run seed` — "Seeded 30 PyBe scenarios"), and started.
   `/api/scenarios`, `/api/analytics`, and `/api/roadmap` were queried
   directly with `curl` and confirmed to return real, correctly-shaped
   data — confirming the backend this UI depends on is unaffected by
   this change (expected, since no server file was touched by any
   version of this implementation, but verified directly rather than
   assumed).

**Confirmation that existing PyBe functionality still works after
integration:** the production build of the patched client is
byte-for-byte the same application as before for every existing code
path — `diff` confirms no existing line was altered, the module count
delta exactly matches the added lesson files, and the backend (proven
live via `curl`) is completely untouched. The only new user-visible
change to the existing UI is the presence of one additional button in
the sidebar; every other element, interaction, and API call in the
original mentor UI is unchanged.

---

## Version 0.6 — Documentation and release preparation

**What was added**
- `docs/lessons/README.md` — the documentation entry point: a summary
  of the lesson, a table of contents linking to all four other
  documents in this folder, the source folder structure, run
  instructions, and an explicit "what this PR deliberately does not
  include" section.
- `docs/lessons/release-checklist.md` — the final pre-submission
  checklist, consolidating every verification performed across
  Versions 0.1–0.6 into one place.

**What changed**
- `docs/essential-docs.md`, `docs/product-document.md`,
  `docs/design-principles.md` — the original PR's top-level documents,
  revised to accurately scope this contribution. Unlike every prior
  version in this history, these three files are **not** covered by
  the append-only rule that governs `formal-specification.md`,
  `system-design.md`, `version-history.md`, and `error-catalogue.md` —
  that rule exists to preserve *this implementation's own* version
  history; these three files predate this implementation and describe
  the PR as a whole, so bringing them in line with what actually
  shipped is this version's explicit purpose, not an exception to it.
- Three broken cross-references were found and fixed during this
  version's review pass (see "Testing Performed").

**Why it changed**
- Before this version, `essential-docs.md` and `product-document.md`
  described three lessons (Thirsty Crow, Crane and Fish, Adder) and a
  fully-realized six-stage framework — but only Adder, as a
  five-screen implementation, was ever built in this contribution. Per
  the maintainer-perspective analysis performed before implementation
  began (see the "smallest mergeable implementation" decision that
  shaped this entire roadmap), a PR whose documentation claims more
  than its code delivers is the single biggest risk to acceptance —
  larger than any individual technical choice. This version closes
  that gap directly: every top-level document now states plainly what
  is and isn't part of this PR, rather than leaving a reviewer to
  discover the mismatch themselves.
- No new functionality was added in this version, per the explicit
  instruction it was scoped under — every change here is
  documentation-only.

**Current limitations**
- None functional — this version touches no code.
- The revised top-level docs still reference the two external
  prototype lessons (Thirsty Crow, Crane and Fish) as context, since
  removing them entirely would lose the evidence that the underlying
  philosophy generalizes — the fix was to clearly label them as
  external and not-in-this-PR, not to remove them.

**How to run**
No code to run for this version. `docs/lessons/README.md` itself
documents how to run the actual feature (Version 0.5's instructions,
restated there for discoverability).

**Expected output**
See "Testing Performed" — all checks pass, and the release checklist
in `docs/lessons/release-checklist.md` is complete.

**Testing Performed**

1. **Terminology consistency check**, run programmatically across all
   four internal documents (`formal-specification.md`,
   `system-design.md`, `version-history.md`, `error-catalogue.md`):
   confirmed "learner" is used exclusively (no "user"/"student"
   mixed in), "screen" is used exclusively (zero occurrences of
   "page"), and "lesson orchestrator"/"orchestrator" naming is
   consistent. No inconsistencies found requiring a fix.
2. **Cross-reference verification**, run twice — once manually via
   `grep` across all `docs/lessons/*.md` references from source code
   comments, and once programmatically (a small Python script
   resolving every Markdown `[text](link)` reference in every `.md`
   file under `docs/` against the real filesystem). The programmatic
   pass caught real problems:
   - Two references to this module's own README pointed at
     `client/src/lessons/README.md` before its actual location
     (`docs/lessons/README.md`) was finalized — both fixed.
   - One pre-existing bug in the *original* `essential-docs.md`
     (predating this implementation): it referenced
     `02_Product_Document.md` and `03_Design_Principles.md`, filenames
     that don't match the real files (`product-document.md`,
     `design-principles.md`, no numeric prefixes) — fixed as part of
     this version's revision of that file.
   - Two further stray references inside `product-document.md`
     pointing at `client/src/lessons/` paths that should have read
     `docs/lessons/` — fixed.
   - Final programmatic pass after all fixes: 0 broken links across
     every `.md` file in `docs/`.
3. **Error-catalogue-to-source consistency check**: every error code
   defined in `errorCodes.js` (5 total) confirmed to have exactly one
   matching row in `error-catalogue.md`, and vice versa — no code
   undocumented, no documented code missing from source.
4. **Source-path reference check**: every `client/src/lessons/...` file
   path mentioned across all four internal documents confirmed, by
   direct comparison against `find client/src/lessons -type f`, to
   refer to a file that actually exists at that path.

**Post-audit documentation refinement.** An independent review (from a
first-time-reviewer perspective, not the author's) was performed after
the above and found one Major issue: `system-design.md` had
accumulated two separate interaction/data-flow diagrams describing the
same real system — an older pair headed "(planned)", left over from
before `AdderLesson.jsx` existed, and a newer "as built" diagram — with
no marker indicating the older pair was superseded, unlike sibling
sections that did carry such a marker. A few section headings also
still read "not yet implemented" for work that was, by that point,
fully implemented. Three Minor findings were also noted: a stale
"Version 0.1" status line at the top of `formal-specification.md`; an
unused `LessonErrorMessages` re-export from `errors/index.js`; and
dynamically-constructed CSS modifier class names
(`` `lesson-option-button--${state}` ``) that a literal `grep` for the
class name wouldn't find, even though they're used correctly at
runtime.

All four were addressed as a documentation-only refinement, within
this version, not a new one — no functional code changed (confirmed by
re-running the full `vite build` verification from Version 0.5: still
1582 modules, identical output):

- `system-design.md` was restructured into two clearly labeled parts —
  "Part 1 — Final architecture" (a single authoritative interaction
  diagram and current-state description) and "Part 2 — Incremental
  build history" (a condensed pointer back to each version's own entry
  in this document, rather than a second full copy of the same
  information). The stale "(planned)"/"not yet implemented" section
  headings and the duplicate diagram were removed rather than merely
  re-labeled, since keeping them alongside a correct version added
  length without adding information.
- `formal-specification.md`'s opening status line was rewritten to
  describe the complete, implemented lesson, with a note that the
  "Implementation status" subsections further down are a historical
  log, not a current-state indicator.
- `errors/index.js`'s `LessonErrorMessages` re-export was kept (not
  removed) with a one-line comment explaining it has no current
  consumer but is retained for a plausible future one (e.g. a
  developer-facing error overlay), and should be removed if none
  appears by the time a second lesson is added.
- The dynamically-constructed CSS class name issue was left as
  documentation only (noting, in this entry, that a literal grep for
  `.lesson-option-button--correct` etc. won't find its usage in
  `components/LessonUI.jsx`, since it's assembled from
  `` `lesson-option-button--${state}` `` at render time) — this is a
  discoverability note for future reviewers, not something the code
  itself needed to change.

A second link-resolution and error-catalogue-sync pass was run after
these edits: 0 broken links, 5/5 error codes still matched between
`errorCodes.js` and `error-catalogue.md`.

---

## Summary across all versions

| Version | Focus | New files | Files modified |
|---|---|---|---|
| 0.1 | Content + centralized error handling | 4 | 0 |
| 0.2 | Shared presentational components | 1 | 2 (errors) + 1 (styles.css, appended) |
| 0.3 | Screen components | 5 | 2 (errors) + 1 (styles.css, appended) |
| 0.4 | Lesson orchestrator | 1 | 2 (errors) |
| 0.5 | Wiring into main.jsx | 0 | 1 (main.jsx, additive-only) |
| 0.6 | Documentation and release prep | 2 | 3 (top-level docs, rescoped) |

11 source files, 0 existing files broken, 1 existing file
(`main.jsx`) modified with a 4-hunk additive diff, 5 centralized error
codes, 36 automated test assertions across two isolated test harnesses
(30 for individual screens, 6 for the full orchestrated flow), plus a
real production build and a real live backend verification.

