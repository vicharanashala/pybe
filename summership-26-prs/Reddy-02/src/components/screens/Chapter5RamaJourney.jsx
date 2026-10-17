import React, { useState } from 'react';
import { sound } from '../../services/soundEngine.js';

export default function Chapter5RamaJourney({ chapter, onAnswerSelected, selectedAnswer }) {
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

  return (
    <section className="screen screen-concept" aria-labelledby="chapter5-heading">
      <div className="content-container">
        <header className="screen-header">
          <span className="screen-eyebrow">{chapter.eyebrow}</span>
          <h2 id="chapter5-heading" className="screen-title">{chapter.title}</h2>
          <p className="screen-lead">
            In the Ramayana tradition, the journey to Lanka required dependable coordination. When asking a dictionary for a key that has not been recorded, Python raises a <code>KeyError</code>.
          </p>
        </header>

        {/* Narrative Box */}
        <div className="story-snippet-card">
          <p>{chapter.story}</p>
        </div>

        {/* Code Challenge Grid */}
        <div className="code-challenge-layout">
          <div className="code-viewer-panel">
            <div className="code-viewer-header">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
              <span className="code-filename">mission_data.py</span>
            </div>
            <pre className="code-pre">
              <code>{chapter.codeProblem.code}</code>
            </pre>
          </div>

          <div className="quiz-column">
            <h3 className="challenge-prompt">{chapter.codeProblem.question}</h3>
            <div className="options-list">
              {chapter.codeProblem.options.map((opt) => {
                const isChosen = selected === opt.id;
                const isCorrect = opt.id === chapter.codeProblem.correctId;
                let statusClass = '';
                if (selected) {
                  if (isChosen && isCorrect) statusClass = 'option-correct';
                  else if (isChosen && !isCorrect) statusClass = 'option-wrong';
                  else if (isCorrect) statusClass = 'option-revealed-best';
                }

                return (
                  <button
                    key={opt.id}
                    className={`option-btn ${statusClass} ${isChosen ? 'selected' : ''}`}
                    onClick={() => handleSelect(opt.id)}
                  >
                    <span className="option-letter">{opt.id.toUpperCase()}</span>
                    <span className="option-text">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {selected && (
              <div className={`feedback-card ${selected === chapter.codeProblem.correctId ? 'feedback-positive' : 'feedback-caution'}`}>
                <strong>{selected === chapter.codeProblem.correctId ? '✅ Spot on!' : '💡 Notice the bracket notation:'}</strong>
                <p>{chapter.codeProblem.explanations[selected]}</p>
              </div>
            )}
          </div>
        </div>

        {/* 3 Recovery Strategies Comparison Card */}
        <div className="recovery-strategies-card">
          <div className="card-header-row">
            <span className="icon-star">🛡️</span>
            <div>
              <h3>How to Recover Gracefully from Missing Keys</h3>
              <p>Explore the 3 idiomatic Python patterns for handling potentially missing keys:</p>
            </div>
          </div>

          <div className="strategy-tabs">
            {chapter.recoveryChallenge.options.map((strat, idx) => (
              <button
                key={strat.id}
                className={`strategy-tab-btn ${activeStrategy === idx ? 'active' : ''}`}
                onClick={() => {
                  sound.playClick();
                  setActiveStrategy(idx);
                }}
              >
                <span>{strat.label}</span>
                {strat.correct ? <span className="valid-pill">Recommended</span> : <span className="invalid-pill">Anti-pattern</span>}
              </button>
            ))}
          </div>

          <div className="strategy-detail-box">
            <div className="strategy-code-container">
              <pre className="code-pre">
                <code>{chapter.recoveryChallenge.options[activeStrategy].code}</code>
              </pre>
            </div>
            <div className="strategy-explanation">
              <strong>Why this works:</strong>
              <p>{chapter.recoveryChallenge.options[activeStrategy].explain}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
