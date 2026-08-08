import React from 'react';

export default function Page3_IterableConcept() {
  return (
    <div className="slide-body">
      <h2 className="story-title">The Warehouse Stores Everything</h2>
      <p className="story-text">
        The warehouse keeps everything safe inside.<br />
        It never opens boxes. It simply <strong>stores</strong> them.
      </p>

      <div className="reveal-box">💡 This is called an <u>Iterable</u></div>

      <div className="diagram-container" style={{ borderColor: 'var(--border-iterable)', padding: '24px 36px', background: 'rgba(0,0,0,0.3)', borderRadius: '14px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '6px' }}>🏠 Warehouse</div>
        <div style={{ fontSize: '1.4rem', color: 'var(--duo-gold)', fontWeight: 800 }}>↓</div>
        <div style={{ fontSize: '1.15rem' }}>Stores Collection in RAM</div>
        <div style={{ fontSize: '1.4rem', color: 'var(--duo-gold)', fontWeight: 800 }}>↓</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--duo-blue)' }}>Iterable</div>
      </div>
    </div>
  );
}
