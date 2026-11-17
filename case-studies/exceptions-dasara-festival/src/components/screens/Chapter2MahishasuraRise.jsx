import React, { useState } from 'react';
import { sound } from '../../services/soundEngine.js';

export default function Chapter2MahishasuraRise({ chapter, onAnswerSelected, selectedAnswer, onContinue }) {
  const [selected, setSelected] = useState(selectedAnswer || null);

  const handleSelect = (id) => {
    setSelected(id);
    if (id === chapter.scenePrediction.bestAnswer) {
      sound.playSuccess();
    } else {
      sound.playError();
    }
    if (onAnswerSelected) onAnswerSelected(id);
  };

  const isBest = selected === chapter.scenePrediction.bestAnswer;

  return (
    <section className="screen screen-challenge" aria-labelledby="chapter2-heading">
      <div className="pybe-single-column">
        {/* Screen Header */}
        <header className="pybe-header-centered">
          <span className="pybe-brand-pill">Story Chapter 1 &bull; Registration Desk</span>
          <h2 id="chapter2-heading" className="pybe-story-title">
            Think it through
          </h2>
          <span className="pybe-progress-label">
            {selected ? '1 OF 1 ANSWERED' : '0 OF 1 ANSWERED'}
          </span>
        </header>

        {/* Story Context Card: Continuing directly from Chapter 1 */}
        <div className="pybe-story-context-card">
          <div className="story-context-header">
            <span className="story-context-tag">🎟️ The Scene at the Entrance</span>
            <span className="story-context-badge">Navratri &bull; Day 1</span>
          </div>

          <p className="story-context-text">
            A visitor arrives at the festival registration counter, eager to book passes for all nine days of the Navratri festival leading up to Vijayadashami.
          </p>

          {/* Interactive Kiosk Terminal Preview */}
          <div className="kiosk-terminal-preview" role="region" aria-label="Registration Desk Terminal Display">
            <div className="terminal-header-bar">
              <div className="terminal-dots" aria-hidden="true">
                <span className="terminal-dot td-red"></span>
                <span className="terminal-dot td-yellow"></span>
                <span className="terminal-dot td-green"></span>
              </div>
              <span className="terminal-title">Registration Desk Terminal</span>
            </div>
            <div className="terminal-body">
              <div className="terminal-line prompt-line">
                <span className="terminal-prompt">&gt;</span>
                <span className="terminal-msg">How many festival days will you attend?</span>
              </div>
              <div className="terminal-line input-line">
                <span className="terminal-prompt">&gt;</span>
                <span className="terminal-label">Visitor Input:</span>
                <code className="terminal-input-val">&quot;nine&quot;</code>
                <span className="terminal-blinking-cursor" aria-hidden="true"></span>
              </div>
            </div>
          </div>

          <p className="story-context-sub">
            The registration system is asking for a number, but in a rush, the visitor typed the English word <code>&quot;nine&quot;</code> instead of the numeric digit <code>9</code>.
          </p>
        </div>

        {/* Question Card */}
        <div className="pybe-card pybe-question-card">
          <div className="question-title-row">
            <span className="question-num-circle">1</span>
            <h3 className="question-text">{chapter.scenePrediction.prompt}</h3>
          </div>

          <div className="pybe-options-list" role="radiogroup" aria-label="Options for program behavior">
            {chapter.scenePrediction.options.map((opt) => {
              const isChosen = selected === opt.id;
              const isOptionBest = opt.id === chapter.scenePrediction.bestAnswer;
              let statusClass = '';
              if (selected) {
                if (isChosen && isOptionBest) statusClass = 'pybe-opt-correct';
                else if (isChosen && !isOptionBest) statusClass = 'pybe-opt-wrong';
                else if (isOptionBest) statusClass = 'pybe-opt-reveal';
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
                  {selected && isChosen && isOptionBest && <span className="check-icon">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Feedback Box */}
          {selected && (
            <div className={`pybe-feedback-box ${isBest ? 'feedback-correct' : 'feedback-hint'}`}>
              <span className="feedback-status-title">
                {isBest ? '✓ Correct' : '💡 Notice:'}
              </span>
              <p>{chapter.scenePrediction.explanations[selected]}</p>
            </div>
          )}
        </div>

        {/* Discovery & Narrative Transition Card (PyBe style) */}
        {selected && (
          <div className="pybe-discovery-reveal fade-in">
            <h3 className="reveal-heading">Here&rsquo;s what you just figured out.</h3>
            <p className="reveal-subtext">
              Programs crash when they assume user input will always be valid. We need a safety shield to catch surprises gracefully.
            </p>

            {/* Visual Process Flow */}
            <div className="reveal-cards-row">
              <div className="reveal-card">
                <span className="reveal-icon">✍️</span>
                <span className="reveal-tag">VISITOR INPUT</span>
                <strong className="reveal-val">&quot;nine&quot; (Text)</strong>
              </div>

              <span className="reveal-arrow" aria-hidden="true">&rarr;</span>

              <div className="reveal-card">
                <span className="reveal-icon">🎯</span>
                <span className="reveal-tag">SYSTEM EXPECTS</span>
                <strong className="reveal-val">9 (Number)</strong>
              </div>

              <span className="reveal-arrow" aria-hidden="true">&rarr;</span>

              <div className="reveal-card transition-alert-card">
                <span className="reveal-icon">⚠️</span>
                <span className="reveal-tag">SYSTEM STATUS</span>
                <strong className="reveal-val val-alert">Unexpected Input</strong>
              </div>
            </div>

            {/* Seamless Story Transition to Page 3 */}
            <div className="transition-narrative-card">
              <div className="transition-badge">
                <span>⚡ Next in the Story</span>
              </div>
              <p className="transition-narrative-text">
                The visitor has entered the word <strong>&quot;nine&quot;</strong> instead of the number <strong>9</strong>. Our registration system is expecting a number, but it has received text. So, something unexpected happens! Let&rsquo;s find out how Python identifies this problem and what kind of error it produces.
              </p>
            </div>

            <div className="reveal-action-center" style={{ marginTop: '8px' }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  sound.playSuccess();
                  if (onContinue) onContinue();
                }}
              >
                See what error Python produces &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
