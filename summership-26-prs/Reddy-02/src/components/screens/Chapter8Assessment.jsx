import React, { useState } from 'react';
import { sound } from '../../services/soundEngine.js';
import { CONCEPTS_SUMMARY } from '../../data/dasaraLesson.js';

export default function Chapter8Assessment({ chapter, onAssessmentComplete, savedAnswers, onRestart }) {
  const [userAnswers, setUserAnswers] = useState(savedAnswers || {});
  const [submitted, setSubmitted] = useState(false);

  const questions = chapter.questions;
  const passMark = chapter.passMark || 4;

  const handleSelectOption = (qId, optId) => {
    if (submitted) return;
    sound.playClick();
    setUserAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  const totalAnswered = Object.keys(userAnswers).length;
  const allAnswered = totalAnswered === questions.length;

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctId) {
        score++;
      }
    });
    return score;
  };

  const score = calculateScore();
  const passed = score >= passMark;

  const handleSubmit = () => {
    setSubmitted(true);
    if (passed) {
      sound.playCelebration();
    } else {
      sound.playError();
    }
    if (onAssessmentComplete) {
      onAssessmentComplete({ score, passed, userAnswers });
    }
  };

  const handleRetry = () => {
    setUserAnswers({});
    setSubmitted(false);
    sound.playClick();
  };

  return (
    <section className="screen screen-concept" aria-labelledby="chapter8-heading">
      <div className="pybe-single-column">
        <header className="pybe-header-centered">
          <h2 id="chapter8-heading" className="pybe-story-title">
            Test your understanding
          </h2>
          <span className="pybe-progress-label">
            {totalAnswered} OF {questions.length} ANSWERED ({passMark}/5 REQUIRED TO PASS)
          </span>
        </header>

        {/* Questions List */}
        <div className="pybe-quiz-stack">
          {questions.map((q, qIndex) => {
            const selectedOptId = userAnswers[q.id];
            const isCorrect = selectedOptId === q.correctId;

            return (
              <div key={q.id} className="pybe-card pybe-question-card">
                <div className="question-title-row">
                  <span className="question-num-circle">{qIndex + 1}</span>
                  <div className="question-header-details">
                    <span className="concept-pill">{q.concept}</span>
                    <div className="question-prompt-text">
                      {q.text.split('\n\n').map((part, pIdx) => {
                        if (part.includes('try:') || part.includes('event[')) {
                          return (
                            <pre key={pIdx} className="pybe-pre-inline">
                              <code>{part}</code>
                            </pre>
                          );
                        }
                        return <p key={pIdx}>{part}</p>;
                      })}
                    </div>
                  </div>
                </div>

                <div className="pybe-options-list" role="radiogroup">
                  {q.options.map((opt) => {
                    const isSelected = selectedOptId === opt.id;
                    let optClass = '';
                    if (submitted) {
                      if (opt.id === q.correctId) optClass = 'pybe-opt-correct';
                      else if (isSelected && !isCorrect) optClass = 'pybe-opt-wrong';
                    } else if (isSelected) {
                      optClass = 'pybe-opt-selected';
                    }

                    return (
                      <button
                        key={opt.id}
                        role="radio"
                        aria-checked={isSelected}
                        disabled={submitted}
                        className={`pybe-option-row ${optClass}`}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                      >
                        <span className="option-label-text">{opt.text}</span>
                        {submitted && opt.id === q.correctId && <span className="check-icon">✓</span>}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className={`pybe-feedback-box ${isCorrect ? 'feedback-correct' : 'feedback-hint'}`}>
                    <span className="feedback-status-title">
                      {isCorrect ? '✓ Correct' : '❌ Incorrect'}
                    </span>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit & Score Card */}
        <div className="pybe-card pybe-submit-card">
          {!submitted ? (
            <div className="submit-action-row">
              <span className="submit-status-text">
                {allAnswered ? 'All questions answered!' : 'Answer all 5 questions to submit'}
              </span>
              <button
                className="btn btn-primary btn-lg"
                disabled={!allAnswered}
                onClick={handleSubmit}
              >
                Submit Answers &rarr;
              </button>
            </div>
          ) : (
            <div className={`pybe-result-banner ${passed ? 'banner-pass' : 'banner-retry'}`}>
              <span className="result-big-icon">{passed ? '🏆' : '📚'}</span>
              <div className="result-info">
                <h3 className="result-headline">
                  {passed
                    ? `Congratulations! You passed with ${score} / ${questions.length}`
                    : `You scored ${score} / ${questions.length} (Requires ${passMark}/${questions.length} to pass)`}
                </h3>
                <p className="result-subtext">
                  {passed
                    ? 'You have mastered the core concepts of Python exception handling.'
                    : 'Review the explanations above and retry the questions you missed.'}
                </p>
                <div className="result-buttons">
                  <button className="btn btn-secondary" onClick={handleRetry}>
                    Retry Quiz
                  </button>
                  {passed && onRestart && (
                    <button className="btn btn-primary" onClick={onRestart}>
                      Restart Lab
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Exception Cheat Sheet */}
        <div className="pybe-card pybe-cheat-sheet">
          <h3 className="cheat-sheet-title">Exception Reference Summary</h3>
          <div className="cheat-summary-grid">
            {CONCEPTS_SUMMARY.map((item, idx) => (
              <div key={idx} className="cheat-card">
                <code className="cheat-keyword">{item.keyword}</code>
                <p className="cheat-desc">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
