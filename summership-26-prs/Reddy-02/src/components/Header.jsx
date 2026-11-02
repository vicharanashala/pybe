import React from 'react';
import { sound } from '../services/soundEngine.js';

export default function Header({
  chapters,
  currentIndex,
  onSelectChapter,
  sfxEnabled,
  onToggleSfx,
  narrationEnabled,
  onToggleNarration,
  captionsVisible,
  onToggleCaptions,
  completedIndices
}) {
  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        {/* Brand / Logo */}
        <div className="brand" onClick={() => onSelectChapter(0)} role="button" tabIndex={0} aria-label="Go to opening slide">
          <span className="diya-icon" aria-hidden="true">🪔</span>
          <div className="brand-text">
            <span className="brand-title">PyBe Discovery Lab</span>
            <span className="brand-subtitle">Dasara &bull; Exception Handling</span>
          </div>
        </div>

        {/* Chapter Progress Track */}
        <nav className="chapter-nav" aria-label="Module chapters">
          <ol className="chapter-dots">
            {chapters.map((ch, idx) => {
              const isCurrent = idx === currentIndex;
              const isCompleted = completedIndices.has(idx);
              const label = `Chapter ${ch.chapterNum}: ${ch.title}`;
              return (
                <li key={ch.id} className="dot-wrapper">
                  <button
                    className={`chapter-dot ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => {
                      sound.playClick();
                      onSelectChapter(idx);
                    }}
                    title={label}
                    aria-label={label}
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    <span className="dot-number">{ch.chapterNum}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Audio & Accessibility Controls */}
        <div className="controls-group" role="toolbar" aria-label="Audio and accessibility options">
          {/* Narration voice toggle */}
          <button
            className={`btn-icon ${narrationEnabled ? 'active' : ''}`}
            onClick={onToggleNarration}
            title={narrationEnabled ? 'Mute voice narration' : 'Enable voice narration'}
            aria-label={narrationEnabled ? 'Mute voice narration' : 'Enable voice narration'}
            aria-pressed={narrationEnabled}
          >
            <span aria-hidden="true">{narrationEnabled ? '🎙️' : '🔇'}</span>
            <span className="control-label">Voice</span>
          </button>

          {/* Sound FX toggle */}
          <button
            className={`btn-icon ${sfxEnabled ? 'active' : ''}`}
            onClick={onToggleSfx}
            title={sfxEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            aria-label={sfxEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            aria-pressed={sfxEnabled}
          >
            <span aria-hidden="true">{sfxEnabled ? '🔔' : '🔕'}</span>
            <span className="control-label">SFX</span>
          </button>

          {/* Captions / Transcript toggle */}
          <button
            className={`btn-icon ${captionsVisible ? 'active' : ''}`}
            onClick={onToggleCaptions}
            title={captionsVisible ? 'Hide narration subtitles' : 'Show narration subtitles'}
            aria-label={captionsVisible ? 'Hide narration subtitles' : 'Show narration subtitles'}
            aria-pressed={captionsVisible}
          >
            <span aria-hidden="true">💬</span>
            <span className="control-label">CC</span>
          </button>
        </div>
      </div>
    </header>
  );
}
