/**
 * Centralized error code registry for the story-based lesson module.
 *
 * Every error raised anywhere inside `client/src/lessons/` should use one
 * of these codes rather than a free-form message string. This gives the
 * module three things a scattered set of ad-hoc `throw new Error(...)`
 * calls would not:
 *
 *   1. Consistency  — the same kind of failure is always reported the
 *      same way, no matter which file triggers it.
 *   2. Reusability  — a future lesson (added after this one) reuses these
 *      codes instead of inventing its own error vocabulary.
 *   3. Traceability — `docs/lessons/error-catalogue.md` documents each
 *      code's description, likely cause, and recovery step in one place,
 *      generated to match exactly what's defined here.
 *
 * SCOPE NOTE: this file intentionally contains only the codes that are
 * actually thrown by code that exists today (Version 0.1 — content
 * validation). Codes for later concerns (e.g. a screen failing to
 * render, a learner interaction hitting an unexpected state) will be
 * added in the version that first introduces the code that can throw
 * them. See `docs/lessons/version-history.md` for what each version
 * added.
 */
export const LessonErrorCodes = Object.freeze({
  /**
   * A required top-level content section — `story`, `questions`,
   * `discovery`, `pythonTranslation`, or `summary` — is missing entirely
   * from the lesson's content file.
   */
  CONTENT_SECTION_MISSING: 'LESSON_CONTENT_SECTION_MISSING',

  /**
   * A content section exists but does not match the shape a lesson
   * screen expects — e.g. a story scene with no `lines`, a question
   * with a `correctOptionId` that doesn't match any of its own options.
   */
  CONTENT_SHAPE_INVALID: 'LESSON_CONTENT_SHAPE_INVALID',

  /**
   * Added in Version 0.2. A shared presentational component
   * (`LessonPrimaryButton`, `LessonOptionButton`, `LessonCodeBlock` —
   * see `components/LessonUI.jsx`) was rendered without a required
   * prop, e.g. no `label`, no `onClick`/`onSelect`, or no `code`.
   */
  COMPONENT_PROP_MISSING: 'LESSON_COMPONENT_PROP_MISSING',

  /**
   * Added in Version 0.3. A screen component (`screens/*.jsx`) was
   * rendered without a content object or callback it requires — e.g.
   * `StoryScreen` rendered without a `story` prop, or without an
   * `onComplete` function. Distinct from `CONTENT_SHAPE_INVALID`: that
   * code covers the content file itself being malformed; this one
   * covers a screen being wired up incorrectly by whatever renders it.
   */
  SCREEN_CONTENT_MISSING: 'LESSON_SCREEN_CONTENT_MISSING',

  /**
   * Added in Version 0.4. The lesson orchestrator (`AdderLesson.jsx`)
   * has an internal `screenName` value that does not match any known
   * screen. This should be unreachable in normal use — `screenName`
   * only ever changes to a value drawn from the orchestrator's own
   * fixed screen order — but is guarded explicitly so a future
   * maintenance mistake (e.g. adding a screen to the order without
   * adding its render case) fails loudly instead of rendering nothing.
   */
  ORCHESTRATOR_UNKNOWN_SCREEN: 'LESSON_ORCHESTRATOR_UNKNOWN_SCREEN',
});
