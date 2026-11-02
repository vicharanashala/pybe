import React from 'react';

export default function Captions({ text, isSpeaking, onClose }) {
  if (!text) return null;

  return (
    <div className="captions-container" role="region" aria-label="Narration captions">
      <div className="captions-card">
        <div className="captions-status">
          <span className={`pulse-dot ${isSpeaking ? 'active' : ''}`} aria-hidden="true"></span>
          <span className="captions-label">{isSpeaking ? 'Narration speaking' : 'Narration transcript'}</span>
          <button
            className="btn-caption-close"
            onClick={onClose}
            aria-label="Hide captions"
            title="Hide captions"
          >
            &times;
          </button>
        </div>
        <p className="captions-text">{text}</p>
      </div>
    </div>
  );
}
