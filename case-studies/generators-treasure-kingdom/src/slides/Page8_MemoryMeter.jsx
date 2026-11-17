import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

export default function Page8_MemoryMeter() {
  const [ans, setAns] = useState(null);

  const handleChoice = (choice) => {
    setAns(choice);
    if (choice === 'tap') {
      soundEngine.playCorrect();
    } else {
      soundEngine.playIncorrect();
    }
  };

  return (
    <div className="slide-body">
      <h2 className="story-title">Memory Space Comparison</h2>

      <div className="memory-meter-box">
        <div className="meter-row">
          <div className="meter-label">🥤 Cups</div>
          <div className="meter-track"><div className="meter-fill-red" /></div>
          <span style={{ color: 'var(--duo-red)', fontSize: '0.9rem' }}>High RAM (95%)</span>
        </div>
        <div className="meter-row">
          <div className="meter-label">🚰 Tap</div>
          <div className="meter-track"><div className="meter-fill-green" /></div>
          <span style={{ color: 'var(--duo-green)', fontSize: '0.9rem' }}>Low RAM (15%)</span>
        </div>
      </div>

      <p className="story-text" style={{ fontWeight: 800, color: 'var(--duo-gold)', marginTop: '6px' }}>
        Which saves more space?
      </p>

      <div className="quiz-options">
        <button className={`duo-btn ${ans === 'bottles' ? 'incorrect' : ''}`} onClick={() => handleChoice('bottles')}>
          🥤 8 Cups
        </button>
        <button className={`duo-btn btn-green ${ans === 'tap' ? 'correct' : ''}`} onClick={() => handleChoice('tap')}>
          🚰 Magic Tap
        </button>
      </div>

      {ans && (
        <div className={`feedback-msg ${ans === 'tap' ? 'success' : 'error'}`}>
          {ans === 'tap'
            ? '✅ Magic Tap! Needs almost NO memory space in RAM!'
            : '❌ Pre-filled cups waste huge space in RAM memory!'}
        </div>
      )}
    </div>
  );
}
