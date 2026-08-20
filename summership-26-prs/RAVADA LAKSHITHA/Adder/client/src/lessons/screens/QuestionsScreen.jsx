import React, { useState } from 'react';
import { LessonOptionButton, LessonPrimaryButton } from '../components/LessonUI';
import { createLessonError, LessonErrorCodes } from '../errors';

/**
 * Screen 2 — renders `questions.questions` one at a time. The learner
 * must select the correct option before advancing; an incorrect
 * selection shows feedback and lets them try again on the same
 * question.
 *
 * Purpose:
 *   Confirm the learner understood the story before any code is
 *   introduced.
 *
 * Inputs (props):
 * @param {Object} questions - The `adderQuestions` content object
 *   (`{ lessonId, questions: [...] }`). Required.
 * @param {Function} onComplete - Called once, after the learner
 *   answers the final question correctly and advances. Required.
 *
 * Outputs:
 * @returns {JSX.Element} The current question, its options, feedback
 *   once one is selected, and a continue button once answered
 *   correctly.
 *
 * Possible errors:
 * @throws {Error} `LessonErrorCodes.SCREEN_CONTENT_MISSING` if
 *   `questions` or `onComplete` is not provided.
 *
 * Side effects:
 *   Calls the caller-supplied `onComplete` exactly once, after the
 *   final question is answered correctly.
 *
 * State owned by this component:
 *   - `questionIndex` — which question is currently showing.
 *   - `selectedOptionId` — which option (if any) the learner has
 *     selected for the current question.
 *   Unchanged by the Phase 5 UI refinement — same two state values,
 *   same `handleContinue`/`stateFor` logic, same conditions for
 *   showing feedback and the continue button. Only the returned JSX
 *   structure and CSS classes changed: the prompt now renders as a
 *   heading inside a card, and feedback renders inside a styled card
 *   (with the same ✓/✕ treatment `LessonOptionButton` already uses)
 *   instead of a plain paragraph.
 */
export function QuestionsScreen({ questions, onComplete }) {
  if (!questions || typeof onComplete !== 'function') {
    throw createLessonError(LessonErrorCodes.SCREEN_CONTENT_MISSING, {
      screen: 'QuestionsScreen',
      missing: !questions ? 'questions' : 'onComplete',
    });
  }

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const question = questions.questions[questionIndex];
  const isLastQuestion = questionIndex === questions.questions.length - 1;
  const hasAnsweredCorrectly = selectedOptionId === question.correctOptionId;

  function handleContinue() {
    if (isLastQuestion) {
      onComplete();
      return;
    }
    setQuestionIndex(questionIndex + 1);
    setSelectedOptionId(null);
  }

  function stateFor(optionId) {
    if (selectedOptionId === null || optionId !== selectedOptionId) return 'default';
    return optionId === question.correctOptionId ? 'correct' : 'incorrect';
  }

  return (
    <section className="lesson-screen lesson-questions-screen">
      <div className="lesson-question-card">
        <h2>{question.prompt}</h2>
        <div className="lesson-option-list">
          {question.options.map((option) => (
            <LessonOptionButton
              key={option.id}
              label={option.label}
              state={stateFor(option.id)}
              onSelect={() => setSelectedOptionId(option.id)}
            />
          ))}
        </div>
      </div>

      {/* Always rendered, regardless of whether feedback or the
          continue button currently have anything to show — this is
          what keeps the page from jumping when they appear. Purely a
          layout container; the two conditions below are unchanged. */}
      <div className="lesson-question-footer">
        {selectedOptionId ? (
          <div
            className={`lesson-feedback-card${
              hasAnsweredCorrectly ? ' lesson-feedback-card--correct' : ' lesson-feedback-card--incorrect'
            }`}
          >
            <span className="lesson-feedback-card__icon" aria-hidden="true">
              {hasAnsweredCorrectly ? '✓' : '✕'}
            </span>
            <p>{hasAnsweredCorrectly ? question.explanationCorrect : question.explanationIncorrect}</p>
          </div>
        ) : null}

        {hasAnsweredCorrectly ? (
          <LessonPrimaryButton
            label={isLastQuestion ? 'Continue' : 'Next question'}
            onClick={handleContinue}
          />
        ) : null}
      </div>
    </section>
  );
}
