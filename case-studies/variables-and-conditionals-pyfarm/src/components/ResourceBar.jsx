import React from 'react';

// Maya’s resources remain part of the farm story.
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
            <span aria-hidden="true">💰</span> Coins
          </dt>
          <dd>{farm.coins}</dd>
        </div>
        <div className="pf-stat">
          <dt>
            <span aria-hidden="true">🌱</span> Seeds
          </dt>
          <dd>{farm.seeds}</dd>
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
