import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

export default function Page5_IteratorConcept() {
  const [step, setStep] = useState(0);

  const handleNextStep = () => {
    soundEngine.playPageTurn();
    setStep((prev) => (prev + 1) % 4);
  };

  const boxes = [
    { title: 'Box 1', icon: '📦', item: 'Gold 🪙' },
    { title: 'Box 2', icon: '📦', item: 'Gem 💎' },
    { title: 'Box 3', icon: '📦', item: 'Crown 👑' },
  ];

  return (
    <div className="slide-body">
      <h2 className="story-title">The Explorer Opens One by One</h2>
      <p className="story-text">
        The Explorer steps from <strong>Box 1</strong> ➔ <strong>Box 2</strong> ➔ <strong>Box 3</strong>.
      </p>

      <div className="reveal-box">💡 Explorer = <u>Iterator</u> (Remembers exact state)</div>

      <div
        className="diagram-container"
        style={{
          borderColor: 'var(--border-iterator)',
          padding: '24px 36px',
          background: 'rgba(0,0,0,0.35)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '760px'
        }}
      >
        <div id="explorer-track" className="iterator-track">
          {boxes.map((b, idx) => {
            const isCurrent = step === idx;
            const isVisited = step > idx;

            return (
              <React.Fragment key={idx}>
                <div className={`item-node ${isCurrent ? 'current' : ''} ${isVisited ? 'visited' : ''}`}>
                  <div style={{ position: 'relative' }}>
                    <span>{isVisited ? '✨' : b.icon}</span>
                    {isCurrent && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-26px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '1.8rem',
                          animation: 'float-gentle 1.5s infinite ease-in-out'
                        }}
                      >
                        🚶
                      </span>
                    )}
                  </div>
                  <small>{b.title}</small>
                  {isCurrent && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--duo-gold)', fontWeight: 900, marginTop: '2px' }}>
                      next() ➔ {b.item}
                    </span>
                  )}
                  {isVisited && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--duo-green)', fontWeight: 800 }}>
                      Opened ✅
                    </span>
                  )}
                </div>
                {idx < boxes.length - 1 && <div className="arrow-connector">➔</div>}
              </React.Fragment>
            );
          })}
        </div>

        <div id="explorer-status" style={{ fontWeight: 800, fontSize: '1.2rem', marginTop: '16px' }}>
          {step < 3 ? (
            <>
              Iterator Position: <span style={{ color: 'var(--duo-gold)' }}>Treasure Box #{step + 1}</span> 🚩 ("I stopped here!")
            </>
          ) : (
            <span style={{ color: 'var(--duo-red)' }}>
              🛑 Stream Exhausted! Calling next() now raises <code>StopIteration</code>!
            </span>
          )}
        </div>

        <button className="icon-btn" style={{ marginTop: '16px', padding: '10px 22px', fontSize: '1rem' }} onClick={handleNextStep}>
          🚶 {step < 3 ? `next(explorer) ➔ Open Box ${step + 1}` : '🔄 Reset Iterator'}
        </button>
      </div>
    </div>
  );
}
