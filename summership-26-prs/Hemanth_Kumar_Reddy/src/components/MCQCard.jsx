import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

export default function MCQCard({ question, options, correctIndex, explanations }) {
  const [selectedIdx, setSelectedIdx] = useState(null);

  const handleSelect = (idx) => {
    setSelectedIdx(idx);
    if (idx === correctIndex) {
      soundEngine.playCorrect();
    } else {
      soundEngine.playIncorrect();
    }
  };

  const isSelected = selectedIdx !== null;
  const isCorrect = selectedIdx === correctIndex;

  return (
    <div className="mcq-card-box">
      <div className="mcq-question-title">{question}</div>
      <div className="mcq-grid">
        {options.map((optText, idx) => {
          const badgeLetter = String.fromCharCode(65 + idx); // A, B, C, D
          let extraClass = '';
          if (selectedIdx === idx) {
            extraClass = idx === correctIndex ? 'selected-correct' : 'selected-incorrect';
          }

          return (
            <button
              key={idx}
              className={`mcq-opt-btn ${extraClass}`}
              onClick={() => handleSelect(idx)}
            >
              <span className="mcq-opt-badge">{badgeLetter}</span>
              {optText}
            </button>
          );
        })}
      </div>

      {isSelected && (
        <div
          className={`feedback-msg ${isCorrect ? 'success' : 'error'}`}
          style={{ marginTop: '10px' }}
        >
          {isCorrect ? '✅ ' : '❌ '}
          <strong>{isCorrect ? 'Correct!' : 'Not quite!'}</strong> {explanations[selectedIdx]}
        </div>
      )}
    </div>
  );
}
