import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';

const PAIRS = [
  { leftId: 'warehouse', leftText: '🏠 Warehouse', rightId: 'iterable', rightText: 'Iterable' },
  { leftId: 'explorer', leftText: '🚶 Explorer', rightId: 'iterator', rightText: 'Iterator' },
  { leftId: 'tap', leftText: '🚰 Water Tap', rightId: 'generator', rightText: 'Generator' }
];

export default function Page11_BossMatchingGame() {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matched, setMatched] = useState([]);
  const [wrongShakeLeft, setWrongShakeLeft] = useState(null);
  const [wrongShakeRight, setWrongShakeRight] = useState(null);
  const [shuffledRight, setShuffledRight] = useState([]);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Fisher-Yates shuffle right items
    const rightList = PAIRS.map((p) => ({ id: p.rightId, text: p.rightText }));
    for (let i = rightList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rightList[i], rightList[j]] = [rightList[j], rightList[i]];
    }
    setShuffledRight(rightList);
  }, []);

  const handleSelectLeft = (id) => {
    if (matched.includes(id)) return;
    soundEngine.playPageTurn();
    setSelectedLeft(id);
  };

  const handleSelectRight = (rightId) => {
    if (!selectedLeft) {
      setFeedback('Select an item on the left first!');
      return;
    }

    const pair = PAIRS.find((p) => p.leftId === selectedLeft);
    if (pair && pair.rightId === rightId) {
      soundEngine.playCorrect();
      setMatched((prev) => [...prev, selectedLeft]);
      setSelectedLeft(null);

      if (matched.length + 1 === PAIRS.length) {
        setFeedback('🏆 VICTORY! All concept pairs correctly matched!');
      } else {
        setFeedback('✅ Correct Match!');
      }
    } else {
      soundEngine.playIncorrect();
      setWrongShakeLeft(selectedLeft);
      setWrongShakeRight(rightId);
      setFeedback('❌ Not a match! Try again!');

      setTimeout(() => {
        setWrongShakeLeft(null);
        setWrongShakeRight(null);
      }, 400);
    }
  };

  return (
    <div className="slide-body">
      <h2 className="story-title">⚔️ Boss Challenge: Match the Concepts!</h2>
      <p className="story-text">Tap a concept on the left, then tap its matching Python term on the right!</p>

      <div className="matching-game-wrapper">
        {/* Left Column */}
        <div className="match-column">
          {PAIRS.map((item) => {
            const isMatched = matched.includes(item.leftId);
            const isSelected = selectedLeft === item.leftId;
            const isShake = wrongShakeLeft === item.leftId;

            return (
              <div
                key={item.leftId}
                className={`match-card match-left ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''} ${isShake ? 'wrong-shake' : ''}`}
                onClick={() => handleSelectLeft(item.leftId)}
              >
                <span>{item.leftText}</span>
                {isMatched && <span>✅</span>}
              </div>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="match-column">
          {shuffledRight.map((item) => {
            const isMatched = PAIRS.some((p) => p.rightId === item.id && matched.includes(p.leftId));
            const isShake = wrongShakeRight === item.id;

            return (
              <div
                key={item.id}
                className={`match-card match-right ${isMatched ? 'matched' : ''} ${isShake ? 'wrong-shake' : ''}`}
                onClick={() => handleSelectRight(item.id)}
              >
                <span>{item.text}</span>
                {isMatched && <span>✅</span>}
              </div>
            );
          })}
        </div>
      </div>

      {feedback && (
        <div className={`feedback-msg ${feedback.includes('VICTORY') || feedback.includes('Correct') ? 'success' : 'error'}`} style={{ marginTop: '12px' }}>
          {feedback}
        </div>
      )}
    </div>
  );
}
