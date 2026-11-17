import React, { useState } from 'react';

/**
 * QuizCard — Multiple-choice quiz component with instant feedback.
 *
 * Props:
 *   questions      — array of { id, question, options, correct, explanation }
 *   chapterColor
 *   chapterColorDim
 *   onComplete     — called with (correctCount, total) when all questions done
 */
export default function QuizCard({ questions, chapterColor, chapterColorDim, onComplete }) {
  const [current, setCurrent]   = useState(0);
  const [chosen, setChosen]     = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore]       = useState(0);

  const q = questions[current];
  const letters = ['A', 'B', 'C', 'D'];

  function handleChoose(idx) {
    if (revealed) return;
    setChosen(idx);
    setRevealed(true);
    if (idx === q.correct) setScore((s) => s + 1);
  }

  function handleNext() {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setChosen(null);
      setRevealed(false);
    } else {
      const finalScore = chosen === q.correct ? score + 1 : score;
      onComplete && onComplete(finalScore, questions.length);
    }
  }

  const isCorrect = chosen === q.correct;

  return (
    <div
      className="activity-card"
      style={{ '--chapter-color': chapterColor, '--chapter-color-dim': chapterColorDim }}
    >
      <div className="activity-label">
        🧠 Multiple Choice — Question {current + 1} of {questions.length}
      </div>

      {/* Score row */}
      <div className="quiz-score-bar">
        <div className="quiz-score-dots">
          {questions.map((_, i) => {
            let cls = 'quiz-score-dot';
            if (i < current) cls += revealed && i === current - 1 ? '' : ' correct';
            return <div key={i} className={cls} />;
          })}
        </div>
        <span className="quiz-score-text">{score}/{questions.length} correct</span>
      </div>

      {/* Question */}
      <div className="quiz-counter">Question {current + 1}</div>
      <div className="quiz-question" aria-live="polite">{q.question}</div>

      {/* Options */}
      <div className="quiz-options">
        {q.options.map((opt, idx) => {
          let cls = 'quiz-option';
          if (revealed) {
            if (idx === q.correct) cls += ' correct';
            else if (idx === chosen) cls += ' incorrect';
          }
          return (
            <button
              key={idx}
              className={cls}
              onClick={() => handleChoose(idx)}
              disabled={revealed}
              aria-pressed={chosen === idx}
              id={`quiz-opt-${idx}`}
            >
              <span className="quiz-option-letter">{letters[idx]}</span>
              <span className="quiz-option-text">{opt}</span>
              {revealed && idx === q.correct && (
                <span style={{ marginLeft: 'auto', fontSize: '1rem' }}>✓</span>
              )}
              {revealed && idx === chosen && idx !== q.correct && (
                <span style={{ marginLeft: 'auto', fontSize: '1rem' }}>✗</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {revealed && (
        <div className={`feedback-banner ${isCorrect ? 'success' : 'error'}`}>
          <span className="feedback-icon">{isCorrect ? '🎉' : '💡'}</span>
          <div className="feedback-text">
            <strong>{isCorrect ? 'Correct!' : 'Not quite!'}</strong>
            <span> {q.explanation}</span>
          </div>
        </div>
      )}

      {/* Next */}
      {revealed && (
        <div className="challenge-actions" style={{ marginTop: '20px' }}>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            style={{ background: `linear-gradient(135deg, ${chapterColor}, rgba(255,255,255,0.3))` }}
          >
            {current < questions.length - 1 ? 'Next Question →' : '🏁 Finish Quiz'}
          </button>
        </div>
      )}
    </div>
  );
}
