import React, { useState } from 'react';
import { sound } from '../../services/soundEngine.js';

export default function Chapter5RamaJourney({ chapter, onAnswerSelected, selectedAnswer, onContinue }) {
  const [selected, setSelected] = useState(selectedAnswer || null);
  const [activeStrategy, setActiveStrategy] = useState(0);

  const handleSelect = (id) => {
    setSelected(id);
    if (id === chapter.codeProblem.correctId) {
      sound.playSuccess();
    } else {
      sound.playError();
    }
    if (onAnswerSelected) onAnswerSelected(id);
  };

  const isCorrect = selected === chapter.codeProblem.correctId;
  const strategy = chapter.recoveryChallenge.options[activeStrategy];

  return (
    <section className="screen screen-concept" aria-labelledby="chapter5-heading">
      <div className="pybe-single-column">
        <header className="pybe-header-centered">
          <h2 id="chapter5-heading" className="pybe-story-title">
            What is a KeyError?
          </h2>
          <p className="pybe-lead">
            What happens when a program searches a dictionary for a key that was never stored?
          </p>
        </header>

        {/* Code Card */}
        <div className="pybe-card pybe-code-card">
          <div className="code-header-bar">
            <span className="code-filename">mission_data.py</span>
          </div>
          <pre className="pybe-pre">
            <code>{chapter.codeProblem.code}</code>
          </pre>
        </div>

        {/* Question Card */}
        <div className="pybe-card pybe-question-card">
          <div className="question-title-row">
            <span className="question-num-circle">?</span>
            <h3 className="question-text">{chapter.codeProblem.question}</h3>
          </div>

          <div className="pybe-options-list" role="radiogroup">
            {chapter.codeProblem.options.map((opt) => {
              const isChosen = selected === opt.id;
              const isOptionCorrect = opt.id === chapter.codeProblem.correctId;
              let statusClass = '';
              if (selected) {
                if (isChosen && isOptionCorrect) statusClass = 'pybe-opt-correct';
                else if (isChosen && !isOptionCorrect) statusClass = 'pybe-opt-wrong';
                else if (isOptionCorrect) statusClass = 'pybe-opt-reveal';
              }

              return (
                <button
                  key={opt.id}
                  role="radio"
                  aria-checked={isChosen}
                  className={`pybe-option-row ${statusClass}`}
                  onClick={() => handleSelect(opt.id)}
                >
                  <span className="option-label-text">{opt.text}</span>
                  {selected && isChosen && isOptionCorrect && <span className="check-icon">✓</span>}
                </button>
              );
            })}
          </div>

          {selected && (
            <div className={`pybe-feedback-box ${isCorrect ? 'feedback-correct' : 'feedback-hint'}`}>
              <span className="feedback-status-title">
                {isCorrect ? '✓ Correct' : '💡 Explanation:'}
              </span>
              <p>{chapter.codeProblem.explanations[selected]}</p>
            </div>
          )}
        </div>

        {/* 3 Recovery Patterns (PyBe clean tabs) */}
        {selected && (
          <div className="pybe-card pybe-recovery-card fade-in">
            <h3 className="recovery-heading">3 Ways to Safely Handle Missing Keys</h3>
            <p className="recovery-lead">Click a tab to compare safe access patterns:</p>

            <div className="pybe-pill-tabs">
              {chapter.recoveryChallenge.options.map((strat, idx) => (
                <button
                  key={strat.id}
                  className={`pybe-pill-tab ${activeStrategy === idx ? 'tab-active' : ''}`}
                  onClick={() => {
                    sound.playClick();
                    setActiveStrategy(idx);
                  }}
                >
                  {strat.label}
                </button>
              ))}
            </div>

            {strategy && (
              <div className="strategy-detail-box">
                <pre className="strategy-code">{strategy.code}</pre>
                <p className="strategy-explanation">{strategy.explain}</p>
              </div>
            )}

            <div className="reveal-action-center" style={{ marginTop: '16px' }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  sound.playSuccess();
                  if (onContinue) onContinue();
                }}
              >
                Next: The Complete 4-Part Structure &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
