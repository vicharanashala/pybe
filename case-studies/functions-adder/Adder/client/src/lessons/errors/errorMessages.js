import { LessonErrorCodes } from './errorCodes';

/**
 * Human-readable detail for every code exported from `errorCodes.js`,
 * keyed by code. Kept as a single flat lookup object — not a class
 * hierarchy — because a plain object is sufficient for one lesson's
 * error surface today and needs no extra tooling to read or extend as
 * more codes are added in later versions.
 *
 * Each entry documents exactly what the module's error handling is
 * meant to capture:
 *   - description   : what the error means, in plain language.
 *   - possibleCause : why it would realistically happen during
 *                     development (this module has no untrusted input
 *                     at runtime yet — every current cause is "the
 *                     content file was edited into a broken shape").
 *   - recovery      : the concrete next step a developer should take.
 *
 * This object has no behavior of its own — it is read by
 * `createLessonError()` in `./index.js` to build a complete error
 * message, and by `docs/lessons/error-catalogue.md` as the source of
 * truth for the human-facing documentation table.
 */
export const LessonErrorMessages = {
  [LessonErrorCodes.CONTENT_SECTION_MISSING]: {
    description:
      'A required section of the lesson content is missing.',
    possibleCause:
      "A content file (e.g. adderContent.js) was edited and a " +
      'top-level export — story, questions, discovery, ' +
      'pythonTranslation, or summary — was accidentally removed, ' +
      'renamed, or left undefined.',
    recovery:
      "Check the content file for the section named in the error's " +
      'context and restore its export. `validateAdderContent()` ' +
      "reports exactly which section was missing in the error's " +
      '`context.section` field.',
  },
  [LessonErrorCodes.CONTENT_SHAPE_INVALID]: {
    description:
      'A content section exists but is missing a field a lesson ' +
      'screen relies on, or has an internally inconsistent value ' +
      "(e.g. a `correctOptionId` that doesn't match any option).",
    possibleCause:
      'A scene, question, discovery prompt, or translation step was ' +
      'edited and a required field was left out, misspelled, or ' +
      'pointed at an id that no longer exists.',
    recovery:
      "Check the error's `context` for the specific section and " +
      'field name, then compare the content against the shape ' +
      'documented in `docs/lessons/formal-specification.md`.',
  },
  // Added in Version 0.2, alongside components/LessonUI.jsx.
  [LessonErrorCodes.COMPONENT_PROP_MISSING]: {
    description:
      'A shared lesson UI component was rendered without a prop it ' +
      'requires to function.',
    possibleCause:
      'A screen component (added in a later version) rendered ' +
      '`LessonPrimaryButton`, `LessonOptionButton`, or ' +
      '`LessonCodeBlock` without passing a required prop — most often ' +
      'because the value it was reading from lesson content or local ' +
      'state was itself undefined.',
    recovery:
      "Check the error's `context.component` and `context.missing` to " +
      'see exactly which component and prop were involved, then trace ' +
      'back to where that value should have come from in the calling ' +
      'screen.',
  },
  // Added in Version 0.3, alongside screens/*.jsx.
  [LessonErrorCodes.SCREEN_CONTENT_MISSING]: {
    description:
      'A screen component was rendered without a content object or ' +
      'callback it requires to function.',
    possibleCause:
      'Whatever renders a screen (a future lesson orchestrator, or a ' +
      'manual test harness) did not pass the required content prop ' +
      '(e.g. `story`, `questions`, `discovery`, `pythonTranslation`, ' +
      '`summary`) or the required callback prop (e.g. `onComplete`, ' +
      '`onRestart`).',
    recovery:
      "Check the error's `context.screen` and `context.missing` to " +
      'see exactly which screen and which prop were involved, then ' +
      'check the code that renders that screen.',
  },
  // Added in Version 0.4, alongside AdderLesson.jsx.
  [LessonErrorCodes.ORCHESTRATOR_UNKNOWN_SCREEN]: {
    description:
      "The lesson orchestrator's internal screen-tracking state does " +
      'not match any screen it knows how to render.',
    possibleCause:
      "Almost certainly a maintenance mistake in AdderLesson.jsx's own " +
      'code — e.g. its screen order list was edited without updating ' +
      "the render logic to match, rather than anything the learner did.",
    recovery:
      "Check the error's `context.screenName` for the unrecognized " +
      "value, then check AdderLesson.jsx's screen order and render " +
      'logic for a mismatch.',
  },
};
