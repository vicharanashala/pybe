import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

export default function Page4_WhoOpensTreasure() {
  const [ans, setAns] = useState(null);

  const handleChoice = (choice) => {
    setAns(choice);
    if (choice === 'explorer') {
      soundEngine.playCorrect();
    } else {
      soundEngine.playIncorrect();
    }
  };

  return (
    <div className="slide-body">
      <h2 className="story-title">Wizard Asks:</h2>
      <div className="wizard-box">
        <div className="wizard-avatar">🧙</div>
        <div className="wizard-speech">
          "Great job! Now... Who actually moves around and opens the treasure boxes?"
        </div>
      </div>

      <div className="quiz-options">
        <button
          className={`duo-btn ${ans === 'warehouse' ? 'incorrect' : ''}`}
          onClick={() => handleChoice('warehouse')}
        >
          🏠 Warehouse
        </button>
        <button
          className={`duo-btn btn-green ${ans === 'explorer' ? 'correct' : ''}`}
          onClick={() => handleChoice('explorer')}
        >
          🚶 Explorer
        </button>
      </div>

      {ans && (
        <div className={`feedback-msg ${ans === 'explorer' ? 'success' : 'error'}`}>
          {ans === 'explorer'
            ? '✅ Explorer! The Hero moves step-by-step to open boxes!'
            : '❌ The Warehouse stays still! The Explorer does the opening!'}
        </div>
      )}
    </div>
  );
}
