import React from 'react';

// The header: what Maya owns and what the learner has earned, always visible.
// XP changes are announced politely so the reward is not conveyed by movement alone.
export default function ResourceBar({ farm, onBack, backLabel }) {
  return (
    <header className="pf-header">
      <div className="pf-brand">
        <span className="pf-brand-mark" aria-hidden="true">🌾</span>
        <span className="pf-brand-name">PyFarm</span>
      </div>

      <dl className="pf-stats">
        <div className="pf-stat">
          <dt>
            <span aria-hidden="true">⭐</span> XP
          </dt>
          <dd aria-live="polite">{farm.xp}</dd>
        </div>
        <div className="pf-stat">
          <dt>
            <span aria-hidden="true">💰</span> Coins
          </dt>
          <dd>{farm.coins}</dd>
        </div>
        <div className="pf-stat">
          <dt>
            <span aria-hidden="true">🏅</span> Level
          </dt>
          <dd>{farm.level}</dd>
        </div>
      </dl>

      {onBack && (
        <button type="button" className="pf-btn pf-btn-ghost pf-header-back" onClick={onBack}>
          {backLabel ?? 'Back'}
        </button>
      )}
    </header>
  );
}
