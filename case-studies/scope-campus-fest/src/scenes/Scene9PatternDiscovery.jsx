import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

export default function Scene9PatternDiscovery({ onNext, onGem }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [gemAwarded, setGemAwarded] = useState(false);

  const choices = [
    { id: 1, text: "Information exists at different levels.", correct: true, feedback: "Excellent! You noticed that information is structured in levels." },
    { id: 2, text: "Anyone can access everything.", correct: false, feedback: "Not quite. Kabir in the Main Hall couldn't access Priya's competition data in Lab 101." },
    { id: 3, text: "Information disappears when someone leaves.", correct: false, feedback: "No. The variables/board remain, but access depends on your location." }
  ];

  function handleChoice(option) {
    setSelectedOption(option.id);
    if (option.correct && !gemAwarded) {
      onGem();
      setGemAwarded(true);
    }
  }

  return (
    <div className="scene-container" style={{ background: '#030712', minHeight: '80%' }}>
      <div className="scene-header">
        <h2 className="scene-title">The Pattern Discovery</h2>
        <p className="scene-subtitle">Let's pause the story and analyze the data</p>
      </div>

      <div className="discovery-summary">
        <div style={{ textAlign: 'center', marginBottom: '0.75rem', fontWeight: 700, color: 'var(--neon-purple)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
          INVESTIGATION FINDINGS
        </div>
        <div className="discovery-row">
          <span className="discovery-label">Main Hall (Surrounding Area)</span>
          <span className="discovery-value" style={{ color: 'var(--neon-indigo)' }}>timeline, current_event</span>
        </div>
        <div className="discovery-row">
          <span className="discovery-label">Lab 101 (Inner Room Area)</span>
          <span className="discovery-value" style={{ color: 'var(--neon-teal)' }}>question, time_remaining, submissions</span>
        </div>
        <div className="discovery-row">
          <span className="discovery-label">Priya (Inside Lab 101) accessing Main Hall</span>
          <span className="discovery-value" style={{ color: 'var(--neon-emerald)' }}>SUCCESS ✓ (Looks outward)</span>
        </div>
        <div className="discovery-row">
          <span className="discovery-label">Kabir (In Main Hall) accessing Lab 101</span>
          <span className="discovery-value" style={{ color: 'var(--neon-rose)' }}>FAILED ✕ (Cannot see inward)</span>
        </div>
      </div>

      <div className="challenge-card-body" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <p className="challenge-question">What pattern have you noticed from these findings?</p>

        <div className="choices-grid">
          {choices.map(c => (
            <button
              key={c.id}
              onClick={() => handleChoice(c)}
              className={`choice-card ${selectedOption === c.id ? (c.correct ? 'correct' : 'incorrect') : ''}`}
              disabled={selectedOption === 1}
            >
              <span className="choice-text">{c.text}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedOption && (
        <div className={`feedback-alert ${selectedOption === 1 ? 'correct' : 'incorrect'}`}>
          {selectedOption === 1 ? <Check size={18} /> : <X size={18} />}
          <span>{choices.find(c => c.id === selectedOption).feedback}</span>
        </div>
      )}

      {selectedOption === 1 && (
        <div className="scene-intro-card" style={{ maxWidth: '600px', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'var(--glass-border-glow)' }}>
          <p style={{ fontSize: '1.05rem', fontWeight: 500 }}>
            "When you're inside a smaller area, you can look outward for information. But the outside cannot automatically look inward."
          </p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <button
          className="cta-btn-primary"
          onClick={onNext}
          disabled={selectedOption !== 1}
        >
          Transform to Code →
        </button>
      </div>
    </div>
  );
}
