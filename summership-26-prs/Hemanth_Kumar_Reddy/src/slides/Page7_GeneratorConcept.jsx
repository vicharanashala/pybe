import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

export default function Page7_GeneratorConcept() {
  const [drops, setDrops] = useState(0);

  const handleTap = () => {
    setDrops((prev) => prev + 1);
    soundEngine.playWaterDrop();
  };

  return (
    <div className="slide-body">
      <h2 className="story-title">The Water Tap Gives Water Only When Opened</h2>

      <div className="tap-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <div
          className="tap-icon"
          onClick={handleTap}
          title="Click to pour fresh water!"
          style={{ fontSize: '4rem', cursor: 'pointer', filter: 'drop-shadow(0 0 10px var(--duo-blue))' }}
        >
          🚰
        </div>
        <div id="water-count" style={{ fontWeight: 800, color: 'var(--duo-gold)', fontSize: '1.2rem' }}>
          Water Created: {drops} drops 💧
        </div>
      </div>

      <div className="reveal-box">
        💡 This is a <u>Generator</u>!<br />
        <span style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--text-main)' }}>
          It creates something only when needed.
        </span>
      </div>
    </div>
  );
}
