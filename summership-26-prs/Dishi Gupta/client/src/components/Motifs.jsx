import React from 'react';

// The manor's visual vocabulary: a small set of hand-drawn SVG motifs that
// recur across the interface — wax seals for sealed parts, keyholes for
// rooms not yet entered, the house magnifier for the brand, and a candle
// rule used as a divider. Deliberately not generic UI iconography.

export function MagnifierBrand({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="17" cy="16" r="10" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="17" cy="16" r="6.2" stroke="currentColor" strokeWidth="1" opacity=".55" />
      <line x1="24.5" y1="23.5" x2="33" y2="32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M12 12c1-2 3-3.4 5.4-3.4" stroke="var(--candle)" strokeWidth="1.6" strokeLinecap="round" opacity=".9" />
    </svg>
  );
}

export function WaxSeal({ state = 'upcoming', label, size = 26 }) {
  // state: 'sealed' | 'current' | 'upcoming'
  const sealColor = state === 'sealed' ? 'var(--wax)' : 'none';
  const ringColor = state === 'upcoming' ? 'var(--edge-strong)' : 'transparent';
  return (
    <span className={`seal seal-${state}`} title={label} aria-label={label}>
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
        {state !== 'upcoming' ? (
          <>
            <path
              d="M14 2.4l2.5 2.1 3.2-.7 1.3 3 3.2.9-.2 3.2 2.4 2.1-1.8 2.7.7 3.2-3 1.3-.9 3.2-3.2-.2-2.2 2.4-2.7-1.8-3.2.7-1.3-3-3.2-.9.2-3.2L2.4 14l1.8-2.7-.7-3.2 3-1.3.9-3.2 3.2.2z"
              fill={sealColor}
              stroke={state === 'current' ? 'var(--brass-bright)' : 'var(--wax-dark)'}
              strokeWidth="1.2"
            />
            {state === 'current' ? (
              <path d="M14 8.5v7" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" />
            ) : (
              <path d="M11 14l2.2 2.2L17.5 11" stroke="var(--parchment)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            )}
          </>
        ) : (
          <>
            <circle cx="14" cy="14" r="9.4" stroke={ringColor} strokeWidth="1.6" strokeDasharray="2.6 3.4" />
            <circle cx="14" cy="14" r="3" fill="var(--edge-strong)" opacity=".7" />
          </>
        )}
      </svg>
    </span>
  );
}

export function KeyholeMark({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="7.4" r="3.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.4 10.2L6.8 16h6.4l-1.6-5.8" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function CandleRule() {
  return (
    <div className="candle-rule" aria-hidden="true">
      <span className="flame" />
      <span className="line" />
    </div>
  );
}

export function PinDot() {
  return <span className="pin-dot" aria-hidden="true" />;
}
