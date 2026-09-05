import React, { useState } from 'react';
import { CheckCircle2, CircleHelp, XCircle } from 'lucide-react';

function Quiz({ questions, storyTitle, onComplete }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);

  const question = questions[questionIndex];
  const hasSelectedAnswer = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question.correctAnswer;
  const isLastQuestion = questionIndex === questions.length - 1;

  function handleNext() {
    if (!hasSelectedAnswer) {
      return;
    }

    const nextScore = score + (isCorrect ? 1 : 0);
    if (isLastQuestion) {
      onComplete({ correct: nextScore, total: questions.length });
      return;
    }

    setScore(nextScore);
    setQuestionIndex((currentIndex) => currentIndex + 1);
    setSelectedAnswer(null);
  }

  return (
    <section className="lj-panel" aria-labelledby="lj-quiz-title">
      <div className="lj-section-heading">
        <div className="lj-icon-badge"><CircleHelp size={22} /></div>
        <div>
          <p className="lj-eyebrow">Think it through</p>
          <h2 id="lj-quiz-title">{storyTitle}</h2>
        </div>
      </div>
      <div className="lj-quiz-progress">
        <span>Question {questionIndex + 1} of {questions.length}</span>
        <span>{Math.round(((questionIndex + 1) / questions.length) * 100)}%</span>
      </div>
      <div className="lj-progress-bar" aria-hidden="true">
        <span style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} />
      </div>
      <h3 className="lj-question">{question.question}</h3>
      <div className="lj-options">
        {question.options.map((option) => {
          const selected = selectedAnswer === option;
          const optionCorrect = hasSelectedAnswer && option === question.correctAnswer;
          const optionIncorrect = selected && hasSelectedAnswer && !isCorrect;
          return (
            <button
              key={option}
              type="button"
              className={`lj-option${selected ? ' is-selected' : ''}${optionCorrect ? ' is-correct' : ''}${optionIncorrect ? ' is-incorrect' : ''}`}
              onClick={() => setSelectedAnswer(option)}
              aria-pressed={selected}
            >
              <span className="lj-option-marker">
                {optionCorrect ? <CheckCircle2 size={18} /> : optionIncorrect ? <XCircle size={18} /> : <span />}
              </span>
              {option}
            </button>
          );
        })}
      </div>
      {hasSelectedAnswer && (
        <p className={`lj-answer-feedback ${isCorrect ? 'is-correct' : 'is-incorrect'}`} role="status">
          {isCorrect ? 'That matches the story.' : `The story says: ${question.correctAnswer}.`}
        </p>
      )}
      <button type="button" className="lj-button lj-button-primary" onClick={handleNext} disabled={!hasSelectedAnswer}>
        {isLastQuestion ? 'See the Python connection' : 'Next question'}
      </button>
    </section>
  );
}

export default Quiz;
