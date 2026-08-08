import React from 'react';

export default function Page10_SuperComparison() {
  return (
    <div className="slide-body">
      <h2 className="story-title">Super Concept Comparison</h2>
      <p className="story-text">Master the 3 pillars of Python Memory Architecture:</p>

      <div className="super-cards">
        <div className="super-card card-blue">
          <div style={{ fontSize: '2.4rem' }}>🏠 Stores</div>
          <div style={{ fontSize: '1.4rem', color: 'var(--duo-gold)' }}>↓</div>
          <div style={{ fontWeight: 900, fontSize: '1.3rem', color: 'var(--duo-blue)' }}>Iterable</div>
          <small style={{ color: 'var(--text-muted)' }}>Holds items in RAM memory (e.g. list, tuple, dict)</small>
        </div>

        <div className="super-card card-green">
          <div style={{ fontSize: '2.4rem' }}>🚶 Moves</div>
          <div style={{ fontSize: '1.4rem', color: 'var(--duo-gold)' }}>↓</div>
          <div style={{ fontWeight: 900, fontSize: '1.3rem', color: 'var(--duo-green)' }}>Iterator</div>
          <small style={{ color: 'var(--text-muted)' }}>Stream cursor created by iter(), steps via next()</small>
        </div>

        <div className="super-card card-orange">
          <div style={{ fontSize: '2.4rem' }}>🚰 Creates</div>
          <div style={{ fontSize: '1.4rem', color: 'var(--duo-gold)' }}>↓</div>
          <div style={{ fontWeight: 900, fontSize: '1.3rem', color: 'var(--duo-gold)' }}>Generator</div>
          <small style={{ color: 'var(--text-muted)' }}>Generates items dynamically on-demand using yield</small>
        </div>
      </div>
    </div>
  );
}
