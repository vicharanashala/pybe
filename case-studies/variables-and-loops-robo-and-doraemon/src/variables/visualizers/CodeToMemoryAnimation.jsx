import React, { useEffect, useState } from 'react';
import MemoryPocket from '../components/MemoryPocket';

// ---------------------------------------------------------------------------
// SIGNATURE VISUALIZATION — Code -> Memory.
// A line of Python code (e.g. travelDoor = "Anywhere Door") appears, then a
// trail of particles carries its value down into a glowing memory pocket.
// This is reused by Scene 6 (first assignment) and Scene 8 (reassignment),
// and is meant to become the one visual the learner instantly associates
// with "assignment" for the rest of the module.
// ---------------------------------------------------------------------------
export default function CodeToMemoryAnimation({ code, pocketLabel, varName, emoji, autoPlay = true, onDone }) {
  const [stage, setStage] = useState('code'); // code -> flowing -> landed
  const [playKey, setPlayKey] = useState(0);

  useEffect(() => {
    if (!autoPlay) return undefined;
    setStage('code');
    const t1 = setTimeout(() => setStage('flowing'), 600);
    const t2 = setTimeout(() => { setStage('landed'); onDone?.(); }, 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, playKey]);

  return (
    <div className="dm-flow-wrap">
      <pre className="dm-code-block">{code}</pre>
      <div className="dm-flow-track" aria-hidden="true">
        {stage === 'flowing' && [...Array(6)].map((_, i) => (
          <span key={i} className="dm-flow-particle" style={{ animationDelay: `${i * 0.08}s` }}>{'✦'}</span>
        ))}
      </div>
      <MemoryPocket
        label={pocketLabel}
        varName={stage === 'landed' ? varName : null}
        emoji={stage === 'landed' ? emoji : null}
        glow={stage === 'flowing' || stage === 'landed'}
      />
      {!autoPlay && (
        <button className="dm-btn" onClick={() => setPlayKey((k) => k + 1)}>Replay {'↻'}</button>
      )}
    </div>
  );
}
