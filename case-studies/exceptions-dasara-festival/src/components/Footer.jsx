import React from 'react';
import { sound } from '../services/soundEngine.js';

export default function Footer({
  currentIndex,
  totalChapters,
  chapterTitle,
  onPrev,
  onNext,
  canGoNext,
  isComplete
}) {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-inner">
        {/* Navigation back */}
        <button
          className="btn btn-secondary btn-nav"
          onClick={() => {
            sound.playClick();
            onPrev();
          }}
          disabled={currentIndex === 0}
          aria-label="Previous chapter"
        >
          <span aria-hidden="true">&larr;</span> Back
          <span className="kbd-shortcut" aria-hidden="true">[&larr;]</span>
        </button>

        {/* Current status display */}
        <div className="chapter-indicator" aria-live="polite">
          <span className="indicator-step">
            Chapter {currentIndex + 1} of {totalChapters}
          </span>
          <span className="indicator-title">&bull; {chapterTitle}</span>
        </div>

        {/* Navigation forward */}
        <button
          className="btn btn-primary btn-nav"
          onClick={() => {
            sound.playClick();
            onNext();
          }}
          disabled={!canGoNext || currentIndex === totalChapters - 1}
          aria-label={currentIndex === totalChapters - 1 ? 'Finished' : 'Next chapter'}
        >
          {currentIndex === totalChapters - 1 ? 'Celebration' : 'Continue'}
          <span aria-hidden="true">&rarr;</span>
          <span className="kbd-shortcut" aria-hidden="true">[&rarr;]</span>
        </button>
      </div>
    </footer>
  );
}
