import React from 'react';

export default function Page1_Entrance() {
  return (
    <div className="slide-body" style={{ justifyContent: 'center', gap: '20px' }}>
      <h1 className="story-title" style={{ fontSize: '2.2rem', marginBottom: '4px' }}>
        🏰 Welcome to the Treasure Kingdom
      </h1>

      <div className="wizard-box" style={{ margin: '0 auto', width: '100%' }}>
        <div className="wizard-avatar">🧙‍♂️</div>
        <div className="wizard-speech">
          "Welcome, Explorer!<br />
          Deep inside this kingdom is a magical treasure.<br />
          But to find it, you'll solve small adventures.<br />
          Ready?"
        </div>
      </div>

      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--duo-gold)', marginBottom: '12px' }}>
          ☁️ Treasure Kingdom ☁️
        </div>
        <div style={{ fontSize: '2.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '28px', marginBottom: '12px' }}>
          <span>🌲</span>
          <span>🛣️</span>
          <span>🌲</span>
        </div>
        <div style={{ fontSize: '2.4rem', fontWeight: 800, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <span>🚶</span>{' '}
          <span style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-main)', textShadow: '0 0 12px rgba(255,255,255,0.5)' }}>
            Hero
          </span>
        </div>
      </div>
    </div>
  );
}
