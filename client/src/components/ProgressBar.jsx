import React from 'react';

/**
 * Reusable animated progress bar. `value`/`max` describe raw counts;
 * `percent` can be passed directly instead when the caller already has one.
 */
function ProgressBar({ value = 0, max = 100, percent, label }) {
  const computedPercent = percent ?? (max > 0 ? Math.round((value / max) * 100) : 0);

  return (
    <div className="progress-bar-wrapper">
      {label && (
        <div className="progress-bar-label">
          <span>{label}</span>
          <span>{computedPercent}%</span>
        </div>
      )}
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${Math.min(100, Math.max(0, computedPercent))}%` }} />
      </div>
    </div>
  );
}

export default ProgressBar;
