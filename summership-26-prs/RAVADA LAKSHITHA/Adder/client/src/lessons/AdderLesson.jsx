import React, { useState } from 'react';
import { StoryScreen } from './screens/StoryScreen';
import { QuestionsScreen } from './screens/QuestionsScreen';
import { DiscoveryScreen } from './screens/DiscoveryScreen';
import { PythonScreen } from './screens/PythonScreen';
import { SummaryScreen } from './screens/SummaryScreen';
import {
  adderStory,
  adderQuestions,
  adderDiscovery,
  adderPythonTranslation,
  adderSummary,
} from './content/adderContent';
import { createLessonError, LessonErrorCodes } from './errors';

/**
 * The fixed sequence of screens that make up the Adder lesson. This is
 * the one place that defines lesson order — no screen knows what comes
 * before or after it.
 */
const SCREEN_ORDER = ['story', 'questions', 'discovery', 'python', 'summary'];

/**
 * Orchestrates the Adder lesson: tracks which of the five screens is
 * currently active and renders it with the content and callbacks it
 * needs. This component intentionally contains no screen-specific
 * business logic (no answer-checking, no keyword matching, no
 * per-screen state) — that all lives inside the screens themselves
 * (see `docs/lessons/system-design.md` for the full responsibility
 * breakdown). Its only job is sequencing.
 *
 * Purpose:
 *   Decide which screen is active, and wire each screen to the content
 *   it needs (from `content/adderContent.js`) and the callback it
 *   should call to advance.
 *
 * Inputs (props):
 *   None. This component is self-contained — it imports its own
 *   content and owns its own screen-sequencing state. (A prop for
 *   exiting back to the host application, if wanted, will be added in
 *   Version 0.5, the version that first has somewhere for it to exit
 *   to — adding it now would be an unused prop with nothing calling
 *   it.)
 *
 * Outputs:
 * @returns {JSX.Element} Whichever screen component matches the
 *   current `screenName` state.
 *
 * Possible errors:
 * @throws {Error} `LessonErrorCodes.ORCHESTRATOR_UNKNOWN_SCREEN` if
 *   `screenName` somehow holds a value outside `SCREEN_ORDER` — see the
 *   note on that code in `errors/errorCodes.js`. Not reachable through
 *   normal use of this component as written.
 *
 * Side effects:
 *   None beyond its own state updates.
 *
 * State owned by this component:
 *   - `screenName` — which screen is currently active. The only piece
 *     of state in this file; every other piece of lesson state belongs
 *     to whichever screen owns it.
 */
export function AdderLesson() {
  const [screenName, setScreenName] = useState(SCREEN_ORDER[0]);

  /**
   * Advances to the next screen in `SCREEN_ORDER`. Passed as the
   * `onComplete` callback to every screen except the last.
   *
   * Purpose: move the lesson forward by exactly one screen.
   * Inputs: none (reads the current `screenName` from closure).
   * Outputs: none — updates state.
   * Possible errors: none directly; see `ORCHESTRATOR_UNKNOWN_SCREEN`
   *   on the component itself for the invariant this relies on.
   * Side effects: calls `setScreenName`.
   */
  function goToNextScreen() {
    const currentIndex = SCREEN_ORDER.indexOf(screenName);
    setScreenName(SCREEN_ORDER[currentIndex + 1]);
  }

  /**
   * Returns to the first screen. Passed as the `onRestart` callback to
   * the Summary screen.
   *
   * Purpose: let the learner replay the lesson from the beginning.
   * Inputs: none. Outputs: none — updates state.
   * Possible errors: none. Side effects: calls `setScreenName`.
   */
  function restart() {
    setScreenName(SCREEN_ORDER[0]);
  }

  switch (screenName) {
    case 'story':
      return <StoryScreen story={adderStory} onComplete={goToNextScreen} />;
    case 'questions':
      return <QuestionsScreen questions={adderQuestions} onComplete={goToNextScreen} />;
    case 'discovery':
      return <DiscoveryScreen discovery={adderDiscovery} onComplete={goToNextScreen} />;
    case 'python':
      return (
        <PythonScreen pythonTranslation={adderPythonTranslation} onComplete={goToNextScreen} />
      );
    case 'summary':
      return (
        <SummaryScreen
          summary={adderSummary}
          finalCode={adderPythonTranslation.finalCode}
          onRestart={restart}
        />
      );
    default:
      throw createLessonError(LessonErrorCodes.ORCHESTRATOR_UNKNOWN_SCREEN, { screenName });
  }
}
