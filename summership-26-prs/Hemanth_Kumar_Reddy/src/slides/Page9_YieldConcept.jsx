import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

export default function Page9_YieldConcept() {
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlayer = (play) => {
    setIsPlaying(play);
    soundEngine.playPageTurn();
  };

  return (
    <div className="slide-body">
      <h2 className="story-title">Pause Your Adventure</h2>
      <p className="story-text">Imagine watching a movie: ▶️ ➔ ⏸ ➔ ▶️</p>

      <div className="player-box" style={{ background: 'rgba(0,0,0,0.5)', padding: '18px 24px', borderRadius: '16px', border: '2px solid var(--duo-purple)' }}>
        <div id="movie-screen" className="player-screen" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--duo-gold)', marginBottom: '12px' }}>
          {isPlaying ? '▶️ Movie Playing... (01:15:21)' : '⏸ Movie Paused (01:15:20)'}
        </div>

        <div className="player-btns" style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '10px' }}>
          <button className="icon-btn" onClick={() => togglePlayer(false)}>⏸ Pause (Yield)</button>
          <button className="icon-btn" onClick={() => togglePlayer(true)}>▶️ Play (Resume)</button>
        </div>

        <div id="yield-explain-text" style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          {isPlaying ? '▶️ Resumed right where it paused!' : '💡 yield paused execution and saved your exact frame state!'}
        </div>
      </div>

      <div className="reveal-box">
        💡 That's exactly what <u>yield</u> does!<br />
        <span style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--text-main)' }}>
          It pauses and resumes execution seamlessly!
        </span>
      </div>
    </div>
  );
}
