import React from 'react';

/**
 * ProgressBar — a styled progress strip used in both the hero and cards.
 *
 * Props:
 *   value  — 0–100
 *   label  — text shown below the bar
 *   color  — CSS colour string (defaults to green)
 */
export default function ProgressBar({ value = 0, label = '', color = 'var(--green)' }) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className="card-progress">
      <div className="card-progress-bar">
        <div
          className="card-progress-fill"
          style={{
            width: `${clamped}%`,
            background: `linear-gradient(90deg, ${color}, rgba(255,255,255,0.5))`
          }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        />
      </div>
      {label && <div className="card-progress-label">{label}</div>}
    </div>
  );
}
