import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

export default function Page2_CarryChallenge() {
  const [ans, setAns] = useState(null);

  const handleChoice = (choice) => {
    setAns(choice);
    if (choice === 'yes') {
      soundEngine.playIncorrect();
    } else {
      soundEngine.playCorrect();
    }
  };

  return (
    <div className="slide-body">
      <h2 className="story-title">The Massive Treasure Warehouse</h2>
      <p className="story-text">Inside the warehouse are thousands of heavy, gold-trimmed treasure boxes!</p>

      <div className="treasure-vault-box">
        <div className="vault-header">📦 1,000,000 TREASURE BOXES IN STORAGE 📦</div>
        <div className="vault-chest-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="chest-card" title="Treasure Chest">
              📦
            </div>
          ))}
        </div>
        <div
          id="treasure-stack"
          style={{
            fontSize: '2.4rem',
            transition: 'transform 0.5s ease',
            marginTop: '6px',
            transform: ans === 'yes' ? 'rotate(80deg) translateY(35px)' : 'none'
          }}
        >
          🚶 Hero Adventurer
        </div>
      </div>

      <p className="story-text" style={{ fontWeight: 800, color: 'var(--duo-gold)' }}>
        Can you carry every treasure box outside at once?
      </p>

      <div className="quiz-options">
        <button
          className={`duo-btn ${ans === 'yes' ? 'incorrect' : ''}`}
          onClick={() => handleChoice('yes')}
        >
          YES
        </button>
        <button
          className={`duo-btn btn-green ${ans === 'no' ? 'correct' : ''}`}
          onClick={() => handleChoice('no')}
        >
          NO
        </button>
      </div>

      {ans && (
        <div className={`feedback-msg ${ans === 'no' ? 'success' : 'error'}`}>
          {ans === 'no'
            ? "✅ Exactly right! You can only open one box at a time!"
            : "😂 That's impossible! You dropped all the treasure boxes!"}
        </div>
      )}
    </div>
  );
}
