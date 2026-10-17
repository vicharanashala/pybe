import React, { useState } from 'react';
import { sound } from '../../services/soundEngine.js';

export default function Chapter2MahishasuraRise({ chapter, onAnswerSelected, selectedAnswer }) {
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

  return (
    <section className="screen screen-challenge" aria-labelledby="chapter2-heading">
      <div className="content-container">
        <header className="screen-header">
          <span className="screen-eyebrow">{chapter.eyebrow}</span>
          <h2 id="chapter2-heading" className="screen-title">{chapter.title}</h2>
        </header>

        {/* Narrative & Allegory Card */}
        <div className="narrative-card">
          <div className="narrative-badge">
            <span className="badge-icon">🐃</span>
            <span>The Allegory: Boon of Invulnerability</span>
          </div>
          <div className="narrative-body">
            {chapter.story.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* The Connection Box */}
        <div className="analogy-banner">
          <span className="analogy-icon">💡</span>
          <div className="analogy-text">
            <strong>The Software Parallels:</strong>
            <p>
              Just like Mahishasura assumed no one could ever defeat him, an unprepared programmer assumes:
              <em> &ldquo;The user will always type a clean number. The data key will always exist. Nothing will ever go wrong.&rdquo;</em>
            </p>
          </div>
        </div>

        {/* Interactive Prediction Challenge */}
        <div className="interactive-challenge-card" role="region" aria-label="Prediction question">
          <h3 className="challenge-question-title">{chapter.scenePrediction.prompt}</h3>

          <div className="options-grid" role="radiogroup">
            {chapter.scenePrediction.options.map((opt) => {
              const isChosen = selected === opt.id;
              const isBest = opt.id === chapter.scenePrediction.bestAnswer;
              let statusClass = '';
              if (selected) {
                if (isChosen && isBest) statusClass = 'option-correct';
                else if (isChosen && !isBest) statusClass = 'option-wrong';
                else if (isBest) statusClass = 'option-revealed-best';
              }

              return (
                <button
                  key={opt.id}
                  role="radio"
                  aria-checked={isChosen}
                  className={`option-btn ${statusClass} ${isChosen ? 'selected' : ''}`}
                  onClick={() => handleSelect(opt.id)}
                >
                  <span className="option-letter">{opt.id.toUpperCase()}</span>
                  <span className="option-text">{opt.text}</span>
                  {selected && isBest && <span className="option-badge">✨ Ideal Answer</span>}
                </button>
              );
            })}
          </div>

          {/* Feedback Display */}
          {selected && (
            <div className={`feedback-card ${selected === chapter.scenePrediction.bestAnswer ? 'feedback-positive' : 'feedback-caution'}`}>
              <div className="feedback-header">
                <strong>
                  {selected === chapter.scenePrediction.bestAnswer ? '🎯 Excellent insight!' : '🔍 Consider this perspective:'}
                </strong>
              </div>
              <p>{chapter.scenePrediction.explanations[selected]}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
