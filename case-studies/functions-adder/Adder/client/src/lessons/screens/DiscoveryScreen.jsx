import React, { useState } from 'react';
import { LessonPrimaryButton } from '../components/LessonUI';
import { createLessonError, LessonErrorCodes } from '../errors';

/**
 * Checks whether the learner's typed reflection contains any of a
 * prompt's acceptable keywords. Case-insensitive substring match —
 * not a semantic-matching utility, since one lesson's three reflection
 * prompts don't justify one (see docs/lessons/formal-specification.md,
 * Constraints). Local to this file because it has exactly one caller;
 * promoting it to a shared `utils/` file is deferred until a second
 * lesson would actually reuse it. Unchanged by the Phase 6 UI
 * refinement.
 *
 * @param {string} reflection - The learner's typed text.
 * @param {string[]} acceptableKeywords - Keywords/phrases to look for.
 * @returns {boolean} True if the (trimmed, lower-cased) reflection
 *   contains at least one keyword; false for empty input or no match.
 */
function matchesKeyword(reflection, acceptableKeywords) {
  const normalized = reflection.trim().toLowerCase();
  if (!normalized) return false;
  return acceptableKeywords.some((keyword) => normalized.includes(keyword.toLowerCase()));
}

/**
 * Screen 3 — renders `discovery.prompts` one at a time. The learner
 * types a short reflection; once it contains an acceptable keyword,
 * the answer and its connection back to the story are revealed and
 * they can continue.
 *
 * Purpose:
 *   Surface, in the learner's own words, what Adder always needs, what
 *   he always gives back, and that he can be called again — the
 *   pedagogical hinge between the story and the code that follows.
 *
 * Inputs (props):
 * @param {Object} discovery - The `adderDiscovery` content object
 *   (`{ lessonId, leadIn, prompts: [...] }`). Required.
 * @param {Function} onComplete - Called once, after the learner
 *   advances past the final prompt. Required.
 *
 * Outputs:
 * @returns {JSX.Element} The current prompt, a reflection input (before
 *   a match) or the revealed answer and a continue button (after).
 *
 * Possible errors:
 * @throws {Error} `LessonErrorCodes.SCREEN_CONTENT_MISSING` if
 *   `discovery` or `onComplete` is not provided.
 *
 * Side effects:
 *   Calls the caller-supplied `onComplete` exactly once, after the
 *   final prompt is answered and the learner continues.
 *
 * State owned by this component:
 *   - `promptIndex` — which prompt is currently showing.
 *   - `reflection` — the learner's current typed text.
 *   - `revealed` — whether the current prompt's answer has been
 *     revealed (i.e. a keyword match has occurred).
 *   Unchanged by the Phase 6 UI refinement — same three state values,
 *   same `handleCheck`/`handleContinue` logic, same condition for
 *   switching between the input view and the revealed view. Only the
 *   returned JSX structure and CSS classes changed: this screen is now
 *   deliberately styled as a reflection page, not a quiz — a single
 *   calm card, `discovery.leadIn` finally rendered as supportive
 *   framing text (previously present in content but unused by this
 *   screen), and a larger reflection text area — rather than reusing
 *   the Questions screen's card-with-multiple-choice-options look.
 */
export function DiscoveryScreen({ discovery, onComplete }) {
  if (!discovery || typeof onComplete !== 'function') {
    throw createLessonError(LessonErrorCodes.SCREEN_CONTENT_MISSING, {
      screen: 'DiscoveryScreen',
      missing: !discovery ? 'discovery' : 'onComplete',
    });
  }

  const [promptIndex, setPromptIndex] = useState(0);
  const [reflection, setReflection] = useState('');
  const [revealed, setRevealed] = useState(false);

  const prompt = discovery.prompts[promptIndex];
  const isLastPrompt = promptIndex === discovery.prompts.length - 1;

  function handleCheck() {
    if (matchesKeyword(reflection, prompt.acceptableKeywords)) {
      setRevealed(true);
    }
  }

  function handleContinue() {
    if (isLastPrompt) {
      onComplete();
      return;
    }
    setPromptIndex(promptIndex + 1);
    setReflection('');
    setRevealed(false);
  }

  return (
    <section className="lesson-screen lesson-discovery-screen">
      <div className="lesson-reflection-card">
        <span className="lesson-reflection-card__eyebrow">Discover the Idea</span>
        <h2>{prompt.question}</h2>
        {discovery.leadIn ? <p className="lesson-reflection-card__lead">{discovery.leadIn}</p> : null}

        {!revealed ? (
          <>
            <textarea
              className="lesson-reflection-input"
              value={reflection}
              onChange={(event) => setReflection(event.target.value)}
              placeholder={prompt.hint}
            />
            <LessonPrimaryButton label="Check" onClick={handleCheck} />
          </>
        ) : (
          <div className="lesson-reflection-reveal">
            <p className="lesson-feedback">{prompt.connectionText}</p>
            <p className="lesson-discovery-answer">{prompt.revealedAnswer}</p>
            <LessonPrimaryButton
              label={isLastPrompt ? 'Continue' : 'Next'}
              onClick={handleContinue}
            />
          </div>
        )}
      </div>
    </section>
  );
}
