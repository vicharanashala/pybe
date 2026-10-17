import React, { useState } from 'react';
import { sound } from '../../services/soundEngine.js';

export default function Chapter3NineDayBattle({ chapter, onAnswerSelected, selectedAnswer }) {
  const [selected, setSelected] = useState(selectedAnswer || null);
  const [activeStep, setActiveStep] = useState(null);

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
    <section className="screen screen-concept" aria-labelledby="chapter3-heading">
      <div className="content-container">
        <header className="screen-header">
          <span className="screen-eyebrow">{chapter.eyebrow}</span>
          <h2 id="chapter3-heading" className="screen-title">{chapter.title}</h2>
        </header>

        {/* Narrative Context */}
        <div className="story-snippet-card">
          <p>{chapter.story}</p>
        </div>

        {/* Code Problem Display */}
        <div className="code-challenge-layout">
          <div className="code-viewer-panel">
            <div className="code-viewer-header">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
              <span className="code-filename">festival_countdown.py</span>
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
                <strong>{selected === chapter.codeProblem.correctId ? '✅ Correct!' : '💡 Let\'s break this down:'}</strong>
                <p>{chapter.codeProblem.explanations[selected]}</p>
              </div>
            )}
          </div>
        </div>

        {/* Execution Trace Table */}
        <div className="trace-card">
          <h4 className="trace-title">Execution Trace — Why did execution stop?</h4>
          <p className="trace-subtitle">Hover or tap each line to see Python's step-by-step runtime state:</p>
          <div className="trace-rows">
            {chapter.codeProblem.exceptionTrace.map((row) => (
              <div
                key={row.line}
                className={`trace-row status-${row.status} ${activeStep === row.line ? 'row-focused' : ''}`}
                onMouseEnter={() => {
                  sound.playClick();
                  setActiveStep(row.line);
                }}
                onClick={() => {
                  sound.playClick();
                  setActiveStep(row.line);
                }}
              >
                <span className="trace-linenum">Line {row.line}</span>
                <code className="trace-code">{row.code}</code>
                <span className={`trace-badge badge-${row.status}`}>
                  {row.status === 'ok' ? '✓ OK' : row.status === 'raises' ? '💥 Raises ValueError' : '⏭️ Skipped'}
                </span>
                <span className="trace-note">{row.note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Concept Box: What is an Exception? */}
        <div className="concept-callout">
          <h4>💡 {chapter.conceptIntro.title}</h4>
          {chapter.conceptIntro.body.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
