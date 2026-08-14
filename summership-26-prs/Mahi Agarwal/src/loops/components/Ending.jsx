import React, { useEffect, useState } from 'react';
import { STORY } from '../data/content';
import TimeMachine from './TimeMachine';

export default function Ending({ earnedCrystals, onBackToHub, onRestart }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 600),
      setTimeout(() => setStage(2), 1600),
      setTimeout(() => setStage(3), 2600)
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="lp-scene lp-ending">
      <div className="lp-portal-wrap">
        <div className={`lp-portal ${stage >= 1 ? 'opening' : ''}`} />
        <div className={`lp-calendar ${stage >= 2 ? 'flipped' : ''}`}>
          <span>{stage >= 2 ? 'GARDEN: FULLY BLOOMED' : 'GARDEN: 5/10 WATERED'}</span>
        </div>
      </div>

      {stage >= 3 && (
        <>
          <h2>The garden blooms — for good</h2>
          <p className="lp-scene-intro">Robo never has to water ten flowers by hand again. One instruction, repeated automatically, takes care of every flower, every morning — and the very same idea keeps the whole garden running, bed after bed, without anyone getting tired.</p>
          <div className="lp-moral-card"><p>{STORY.moral}</p></div>
          <p className="lp-scene-intro">
            Every stage, every fixed sprinkler, every iteration you didn't give up on — that's what got you here.
            Robo's magic spell is complete.
          </p>
          <TimeMachine earned={earnedCrystals} repairPct={100} />
          <p className="lp-scene-intro" style={{ marginTop: 8 }}>
            "Life also works like loops. Repeating mistakes keeps us stuck, but improving every iteration helps us grow."
          </p>
          <div className="lp-reflection-actions">
            <button className="lp-mini-btn lp-cta" onClick={onBackToHub}>Return to the Learning Hub</button>
            <button className="lp-chip" onClick={onRestart}>Relive the story again</button>
          </div>
        </>
      )}
    </div>
  );
}
