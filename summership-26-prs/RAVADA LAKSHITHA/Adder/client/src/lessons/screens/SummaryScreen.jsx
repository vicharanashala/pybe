import React from 'react';
import { LessonPrimaryButton, LessonCodeBlock } from '../components/LessonUI';
import { createLessonError, LessonErrorCodes } from '../errors';

/**
 * Screen 5 — the lesson's closing message. Recaps the concept name
 * established in Discovery and the finished code built in Python
 * Translation, and offers a restart action.
 *
 * Purpose:
 *   Close the lesson without introducing anything new, confirming what
 *   the learner just built.
 *
 * Inputs (props):
 * @param {Object} summary - The `adderSummary` content object
 *   (`{ lessonId, title, conceptName, restartLabel }`). Required.
 * @param {string} finalCode - The completed code line to recap (e.g.
 *   `adderPythonTranslation.finalCode`). Required.
 * @param {Function} onRestart - Called when the learner chooses to
 *   restart the lesson. Required.
 *
 * Outputs:
 * @returns {JSX.Element} The summary title, concept recap, the
 *   finished code, and a restart button.
 *
 * Possible errors:
 * @throws {Error} `LessonErrorCodes.SCREEN_CONTENT_MISSING` if
 *   `summary`, `finalCode`, or `onRestart` is not provided.
 *
 * Side effects:
 *   Calls the caller-supplied `onRestart` when the restart button is
 *   clicked. Otherwise none. Unchanged by the Phase 8 UI refinement —
 *   same button, same handler, same prop.
 *
 * State owned by this component:
 *   None — this screen has no interaction beyond the single restart
 *   action, so no local state is needed. Still true after Phase 8; no
 *   state was added.
 *
 * Content note (Phase 8): `summary.title`, `summary.conceptName`,
 * `summary.restartLabel`, and `finalCode` are rendered exactly as
 * given — none of their values are altered. One presentational
 * sentence ("You followed the story...") was added around them; it is
 * UI framing text in the same category as this lesson's existing
 * hardcoded screen labels (e.g. Discovery's "Discover the Idea",
 * Python's "Translate your thinking into Python"), not lesson content
 * — it narrates the flow the learner already completed and asserts
 * nothing new about the concept itself.
 */
export function SummaryScreen({ summary, finalCode, onRestart }) {
  if (!summary || !finalCode || typeof onRestart !== 'function') {
    throw createLessonError(LessonErrorCodes.SCREEN_CONTENT_MISSING, {
      screen: 'SummaryScreen',
      missing: !summary ? 'summary' : !finalCode ? 'finalCode' : 'onRestart',
    });
  }

  return (
    <section className="lesson-screen lesson-summary-screen">
      <div className="lesson-summary-card">
        <div className="lesson-summary-badge" aria-hidden="true">
          <span>✓</span>
        </div>

        <span className="lesson-summary-card__eyebrow">Lesson complete</span>
        <h1>{summary.title}</h1>
        <p className="lesson-summary-card__connector">
          You followed the story, discovered the idea, and turned it into real Python:
        </p>
        <span className="lesson-summary-card__concept">{summary.conceptName}</span>

        <div className="lesson-summary-codeblock">
          <LessonCodeBlock code={finalCode} />
        </div>

        <div className="lesson-summary-card__restart">
          <LessonPrimaryButton label={summary.restartLabel} onClick={onRestart} />
        </div>
      </div>
    </section>
  );
}
