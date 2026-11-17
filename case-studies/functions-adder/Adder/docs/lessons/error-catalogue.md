# Error Catalogue — Story-Based Lesson Module (Adder)

Every error this module can raise goes through one factory function,
`createLessonError(code, context)`, defined in
`client/src/lessons/errors/index.js`. No file in `client/src/lessons/`
should construct an error any other way. This document is generated to
match `errorCodes.js` and `errorMessages.js` exactly — if a code is
added to those files, a row must be added here in the same commit.

As of Version 0.1, both codes below relate to content validation, since
that's the only part of the module implemented so far. Codes for
rendering or learner-interaction failures will be added here in the
version that first introduces the code that can throw them.

| Code | Description | Possible cause | Recovery |
|---|---|---|---|
| `LESSON_CONTENT_SECTION_MISSING` | A required top-level content section (`story`, `questions`, `discovery`, `pythonTranslation`, or `summary`) is missing entirely from the content file. | A content file (e.g. `adderContent.js`) was edited and a top-level export was accidentally removed, renamed, or left undefined. | Check the section named in the error's `context.section` and restore its export. `validateAdderContent()` reports exactly which section was missing. |
| `LESSON_CONTENT_SHAPE_INVALID` | A content section exists but is missing a field a lesson screen relies on, or has an internally inconsistent value (e.g. a `correctOptionId` that doesn't match any of its own options). | A scene, question, discovery prompt, or translation step was edited and a required field was left out, misspelled, or pointed at an id that no longer exists. | Check the error's `context` for the specific section and field name, then compare against the shape documented in `docs/lessons/formal-specification.md`. |
| `LESSON_COMPONENT_PROP_MISSING` *(added Version 0.2)* | A shared lesson UI component (`LessonPrimaryButton`, `LessonOptionButton`, or `LessonCodeBlock`) was rendered without a prop it requires to function. | A screen component rendered one of these without passing a required prop — most often because the value it was reading from lesson content or local state was itself undefined. | Check `context.component` and `context.missing` to see exactly which component and prop were involved, then trace back to where that value should have come from in the calling screen. |
| `LESSON_SCREEN_CONTENT_MISSING` *(added Version 0.3)* | A screen component (`StoryScreen`, `QuestionsScreen`, `DiscoveryScreen`, `PythonScreen`, or `SummaryScreen`) was rendered without a content object or callback it requires. | Whatever renders a screen (a future lesson orchestrator, or a manual test) did not pass the required content prop or the required callback prop. Distinct from `LESSON_CONTENT_SHAPE_INVALID`, which covers the content file itself being malformed. | Check `context.screen` and `context.missing` to see exactly which screen and prop were involved, then check the code that renders that screen. |
| `LESSON_ORCHESTRATOR_UNKNOWN_SCREEN` *(added Version 0.4)* | The lesson orchestrator's internal screen-tracking state (`AdderLesson.jsx`'s `screenName`) does not match any screen it knows how to render. | Almost certainly a maintenance mistake in `AdderLesson.jsx` itself — e.g. its screen order list was edited without updating the render logic to match. Not reachable through normal learner interaction. | Check `context.screenName` for the unrecognized value, then check `AdderLesson.jsx`'s screen order and render logic for a mismatch. |

## How to read a thrown error

Every error produced by `createLessonError()` has three properties
beyond the standard `Error.message`:

```
error.code     — one of the two values above, e.g. 'LESSON_CONTENT_SECTION_MISSING'
error.context  — an object naming exactly what failed, e.g.
                  { section: 'questions', field: 'correctOptionId', questionId: 'who-is-adder' }
error.message  — "[CODE] description", e.g.
                  "[LESSON_CONTENT_SHAPE_INVALID] A content section exists but is missing a field..."
```

This was verified directly during Version 0.1 development: deliberately
breaking `adderQuestions`'s `correctOptionId` for the `who-is-adder`
question and loading the module produced exactly this error:

```
code:    LESSON_CONTENT_SHAPE_INVALID
context: { section: 'questions', field: 'correctOptionId', questionId: 'who-is-adder' }
```

**Version 0.2 addition:** `LESSON_COMPONENT_PROP_MISSING` was verified
by inspection of `components/LessonUI.jsx`'s guard clauses (each of
the three components throws it when a required prop is absent or of
the wrong type) and confirmed to compile correctly via an isolated
`esbuild` bundle check; end-to-end verification of the thrown error
inside an actual render will happen once a screen component exists to
trigger it, in Version 0.3.

**Version 0.3 addition:** `LESSON_SCREEN_CONTENT_MISSING` was verified
end-to-end with a real render, closing the loop noted above. All five
screens were mounted in a jsdom test harness without their required
props (each content prop missing, and each callback prop missing in
turn — 8 cases total) and confirmed to throw with exactly this code.
See `docs/lessons/version-history.md`, Version 0.3, "Testing
Performed" for the full test list.

**Version 0.4 addition:** `LESSON_ORCHESTRATOR_UNKNOWN_SCREEN` was
verified by code inspection only, not by execution — unlike every
other code in this catalogue, it guards an invariant (`screenName`
staying within `AdderLesson.jsx`'s own fixed `SCREEN_ORDER`) that
cannot be violated through any prop or interaction available from
outside the component as currently written. Forcing it to fire would
require deliberately breaking the orchestrator's own code, which is
exactly the class of mistake it exists to catch during future
maintenance, not during normal use. This is stated plainly here rather
than left implicit, matching how `LESSON_COMPONENT_PROP_MISSING` was
also honestly marked "verified by inspection" before Version 0.3 gave
it a real execution path.

## Adding a new code in a future version

1. Add the code to `errorCodes.js`, with a doc comment explaining what
   it represents.
2. Add its description/possibleCause/recovery to `errorMessages.js`.
3. Add a row to the table above, in the same commit.
4. Use `createLessonError(YourNewCode, context)` at the point of
   failure — never construct the error inline with `new Error(...)`.
