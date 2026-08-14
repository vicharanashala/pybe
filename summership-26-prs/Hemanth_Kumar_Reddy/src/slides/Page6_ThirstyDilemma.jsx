import React from 'react';

export default function Page6_ThirstyDilemma() {
  return (
    <div className="slide-body">
      <h2 className="story-title">The Explorer Becomes Thirsty!</h2>
      <p className="story-text">The Wizard shows two options to quench your thirst:</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%', maxWidth: '650px' }}>
        <div className="diagram-container">
          <div style={{ fontWeight: 900, color: 'var(--duo-red)' }}>Option A</div>
          <div style={{ fontSize: '1.8rem', letterSpacing: '2px' }}>🥤🥤🥤🥤🥤🥤🥤🥤🥤</div>
          <small style={{ color: 'var(--text-muted)', marginTop: '6px' }}>Carry 9 heavy juice cups</small>
        </div>

        <div className="diagram-container">
          <div style={{ fontWeight: 900, color: 'var(--duo-green)' }}>Option B</div>
          <div style={{ fontSize: '3.5rem' }}>🚰</div>
          <small style={{ color: 'var(--text-muted)', marginTop: '6px' }}>Fresh Magic Tap</small>
        </div>
      </div>

      <p className="story-text" style={{ fontWeight: 800, color: 'var(--duo-gold)' }}>Which is smarter?</p>
    </div>
  );
}
