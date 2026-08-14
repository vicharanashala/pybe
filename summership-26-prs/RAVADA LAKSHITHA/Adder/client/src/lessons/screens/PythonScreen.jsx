import React, { useState } from 'react';
import { LessonOptionButton, LessonPrimaryButton, LessonCodeBlock } from '../components/LessonUI';
import { createLessonError, LessonErrorCodes } from '../errors';

/**
 * Screen 4 — first shows `pythonTranslation.explainer` (a recap of
 * what Adder needs/does/gives back, reframed as what a function is),
 * then a single multiple-choice step that builds `adder(2, 3)`. Calls
 * `onComplete` once the correct option is selected.
 *
 * Purpose:
 *   Turn the concept discovered in Screen 3 into one real line of
 *   Python, without requiring the learner to type or parse code
 *   themselves — matching the "minimal syntax" constraint.
 *
 * Inputs (props):
 * @param {Object} pythonTranslation - The `adderPythonTranslation`
 *   content object (`{ explainer, introText, step, finalCode }`).
 *   Required.
 * @param {Function} onComplete - Called once, when the learner selects
 *   the correct option for `step`. Required.
 *
 * Outputs:
 * @returns {JSX.Element} Either the explainer (with a continue button)
 *   or the step's prompt, options, feedback, and — once correct — the
 *   revealed code and a continue button.
 *
 * Possible errors:
 * @throws {Error} `LessonErrorCodes.SCREEN_CONTENT_MISSING` if
 *   `pythonTranslation` or `onComplete` is not provided.
 *
 * Side effects:
 *   Calls the caller-supplied `onComplete` exactly once, when the
 *   step is answered correctly. Unchanged by the Phase 7 UI
 *   refinement: `onComplete` is still wired directly to the same
 *   "Continue" button's `onClick`, at the same point in the logic.
 *
 * State owned by this component:
 *   - `explainerSeen` — whether the learner has advanced past the
 *     explainer to the multiple-choice step.
 *   - `selectedOptionId` — which option (if any) the learner has
 *     selected for the step.
 *   Unchanged by the Phase 7 UI refinement — same two state values,
 *   same `stateFor()` logic, same `hasAnsweredCorrectly` condition.
 *   Only the returned JSX structure and CSS classes changed: the code
 *   block is now the visual centerpiece, present (as an empty
 *   placeholder) before an answer is chosen and revealed with a
 *   one-shot highlight animation on a correct answer, rather than a
 *   quiz-style question-then-answer layout. No "Correct!" text is
 *   shown (there never was any — the code reveal itself is the
 *   feedback); the incorrect-answer hint (`step.hint`) is unchanged.
 */
export function PythonScreen({ pythonTranslation, onComplete }) {
  if (!pythonTranslation || typeof onComplete !== 'function') {
    throw createLessonError(LessonErrorCodes.SCREEN_CONTENT_MISSING, {
      screen: 'PythonScreen',
      missing: !pythonTranslation ? 'pythonTranslation' : 'onComplete',
    });
  }

  const [explainerSeen, setExplainerSeen] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const { explainer, introText, step } = pythonTranslation;
  const hasAnsweredCorrectly = selectedOptionId === step.correctOptionId;

  function stateFor(optionId) {
    if (selectedOptionId === null || optionId !== selectedOptionId) return 'default';
    return optionId === step.correctOptionId ? 'correct' : 'incorrect';
  }

  if (!explainerSeen) {
    return (
      <section className="lesson-screen lesson-python-screen">
        <div className="lesson-python-explainer-card">
          <span className="lesson-python-card__eyebrow">From idea to code</span>
          <p>{explainer.recapText}</p>
          <p>{explainer.explanationText}</p>
          <ul className="lesson-explainer-list">
            <li>
              <strong>Needs:</strong> {explainer.inputLabel}
            </li>
            <li>
              <strong>Does:</strong> {explainer.jobLabel}
            </li>
            <li>
              <strong>Gives back:</strong> {explainer.outputLabel}
            </li>
          </ul>
          <p>{explainer.reusabilityText}</p>
          <LessonPrimaryButton label="Continue" onClick={() => setExplainerSeen(true)} />
        </div>
      </section>
    );
  }

  return (
    <section className="lesson-screen lesson-python-screen">
      <div className="lesson-python-card">
        <span className="lesson-python-card__eyebrow">Translate your thinking into Python</span>
        <p className="lesson-python-card__intro">{introText}</p>

        <div
          className={`lesson-python-codeblock${
            hasAnsweredCorrectly ? ' lesson-python-codeblock--revealed' : ''
          }`}
        >
          {hasAnsweredCorrectly ? (
            <LessonCodeBlock code={step.revealedCode} />
          ) : (
            <div className="lesson-python-codeblock__placeholder" aria-hidden="true">
              <span>Your code will appear here</span>
            </div>
          )}
        </div>

        <div className="lesson-python-options">
          <p className="lesson-python-options__label">{step.prompt}</p>
          <div className="lesson-option-list">
            {step.options.map((option) => (
              <LessonOptionButton
                key={option.id}
                label={option.label}
                state={stateFor(option.id)}
                onSelect={() => setSelectedOptionId(option.id)}
              />
            ))}
          </div>
        </div>

        <div className="lesson-python-footer">
          {selectedOptionId && !hasAnsweredCorrectly ? (
            <p className="lesson-feedback">{step.hint}</p>
          ) : null}

          {hasAnsweredCorrectly ? (
            <LessonPrimaryButton label="Continue" onClick={onComplete} />
          ) : null}
        </div>
      </div>
    </section>
  );
}
