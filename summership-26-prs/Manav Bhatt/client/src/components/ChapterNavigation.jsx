import React from 'react';

/**
 * ChapterNavigation — sticky bottom bar showing current step info, back, and next.
 *
 * Props:
 *   stepLabel   — e.g. "Part 6 of 13"
 *   stepName    — e.g. "Steps from the Opening"
 *   onBack      — called when user clicks Back (optional)
 *   onNext      — called when user clicks Next (optional)
 *   onHome      — called when user clicks Map
 *   chapterColor
 */
export default function ChapterNavigation({
  stepLabel,
  stepName,
  onBack,
  onNext,
  onHome,
  chapterColor = '#39d353',
}) {
  return (
    <div className="chapter-nav-strip">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={onHome}
          aria-label="Return to adventure map"
          id="nav-home-btn"
        >
          🗺️ Map
        </button>

        {onBack && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={onBack}
            aria-label="Go back one step"
            id="nav-back-btn"
          >
            ← Back
          </button>
        )}
      </div>

      <div className="chapter-nav-info">
        <span className="chapter-nav-step">{stepLabel}</span>
        <span className="chapter-nav-title">{stepName}</span>
      </div>

      {onNext && (
        <button
          className="btn btn-primary btn-sm"
          onClick={onNext}
          aria-label="Go to next scene"
          id="nav-next-btn"
          style={{
            background: `linear-gradient(135deg, ${chapterColor}, rgba(255,255,255,0.2))`,
            padding: '8px 18px',
            fontWeight: 700,
            fontSize: '0.88rem',
            boxShadow: `0 0 16px ${chapterColor}44`,
          }}
        >
          Next →
        </button>
      )}
    </div>
  );
}
