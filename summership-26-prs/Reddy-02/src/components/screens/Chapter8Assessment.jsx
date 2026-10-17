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
      <div className="content-container">
        <header className="screen-header">
          <span className="screen-eyebrow">{chapter.eyebrow}</span>
          <h2 id="chapter8-heading" className="screen-title">{chapter.title}</h2>
          <p className="screen-lead">
            Demonstrate your mastery of Python exception handling. Answer all 5 questions below ({passMark}/5 required to pass).
          </p>
        </header>

        {/* Assessment Questions List */}
        <div className="quiz-questions-list">
          {questions.map((q, qIndex) => {
            const selectedOptId = userAnswers[q.id];
            const isCorrect = selectedOptId === q.correctId;

            return (
              <div key={q.id} className="quiz-question-card">
                <div className="question-header-row">
                  <span className="question-num-tag">Question {qIndex + 1} of {questions.length}</span>
                  <span className="question-concept-tag">{q.concept}</span>
                </div>

                <div className="question-prompt-text">
                  {q.text.split('\n\n').map((part, pIdx) => {
                    if (part.includes('try:') || part.includes('event[')) {
                      return (
                        <pre key={pIdx} className="quiz-code-block">
                          <code>{part}</code>
                        </pre>
                      );
                    }
                    return <p key={pIdx}>{part}</p>;
                  })}
                </div>

                <div className="quiz-options-group" role="radiogroup">
                  {q.options.map((opt) => {
                    const isSelected = selectedOptId === opt.id;
                    let optClass = '';
                    if (submitted) {
                      if (opt.id === q.correctId) optClass = 'opt-status-correct';
                      else if (isSelected && !isCorrect) optClass = 'opt-status-wrong';
                    }

                    return (
                      <button
                        key={opt.id}
                        role="radio"
                        aria-checked={isSelected}
                        disabled={submitted}
                        className={`quiz-option-btn ${isSelected ? 'opt-selected' : ''}`}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                      >
                        <span className="opt-letter">{opt.id.toUpperCase()}</span>
                        <span className="opt-label">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className={`quiz-feedback-box ${isCorrect ? 'fb-correct' : 'fb-wrong'}`}>
                    <strong>{isCorrect ? '✅ Correct' : '❌ Incorrect'}</strong>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Score & Actions Panel */}
        <div className="quiz-submission-card">
          {!submitted ? (
            <div className="submit-prompt-row">
              <span className="answered-status">
                {totalAnswered} of {questions.length} questions answered
              </span>
              <button
                className="btn btn-primary btn-lg"
                disabled={!allAnswered}
                onClick={handleSubmit}
              >
                Submit Assessment &rarr;
              </button>
            </div>
          ) : (
            <div className={`results-banner ${passed ? 'banner-pass' : 'banner-retry'}`}>
              <div className="results-content">
                <span className="results-emoji">{passed ? '🏆' : '📚'}</span>
                <div>
                  <h3 className="results-title">
                    {passed
                      ? `Congratulations! You scored ${score} / ${questions.length} (Pass)`
                      : `You scored ${score} / ${questions.length} (Requires ${passMark}/${questions.length} to pass)`}
                  </h3>
                  <p className="results-desc">
                    {passed
                      ? 'You have successfully completed the Dasara Festival Discovery Lab! Review the key concepts reference below.'
                      : 'Review the explanations above and retry the questions you missed.'}
                  </p>
                </div>
              </div>
              <div className="results-actions">
                <button className="btn btn-secondary" onClick={handleRetry}>
                  🔄 Retry Assessment
                </button>
                {passed && onRestart && (
                  <button className="btn btn-primary" onClick={onRestart}>
                    🔄 Replay Lab
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Concept Reference Cheat Sheet */}
        <div className="cheat-sheet-card">
          <h3 className="cheat-sheet-title">📜 Exception Handling Reference Cheat Sheet</h3>
          <div className="cheat-grid">
            {CONCEPTS_SUMMARY.map((item, idx) => (
              <div key={idx} className="cheat-item">
                <div className="cheat-header">
                  <code className="cheat-keyword">{item.keyword}</code>
                </div>
                <p className="cheat-def">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
