import React, { useEffect, useState } from 'react';
import SceneShell from '../components/SceneShell';
import SpeechBubble from '../components/SpeechBubble';
import MemoryPocket from '../components/MemoryPocket';
import { GADGETS, TIME_MACHINE } from '../data/gadgets';

const DOOR = GADGETS[0];

// Scene 8 — Updating Variables. The Travel Pocket currently holds the
// Anywhere Door. Doraemon needs to store the Time Machine there instead.
// The old gadget visibly fades away before the new one arrives — making it
// unmistakable that a variable replaces its value, it never keeps both.
export default function Scene8Updating({ onNext, memory, setMemory, onGem }) {
  const [phase, setPhase] = useState('before'); // before -> fading -> landed
  const current = memory.travel || DOOR;

  useEffect(() => {
    if (phase === 'fading') {
      const t = setTimeout(() => {
        setMemory((prev) => ({ ...prev, travel: TIME_MACHINE }));
        setPhase('landed');
        onGem?.();
      }, 650);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return (
    <SceneShell chapter="Chapter 8 · Swapping Gadgets" title="One pocket, one value at a time">
      <SpeechBubble
        speaker="doraemon"
        text={phase === 'before'
          ? `The Travel Pocket already holds the ${current.name}. But right now, Nobita needs the Time Machine instead!`
          : 'Watch — the old gadget has to leave before the new one can arrive.'}
        hideButton
      />

      <div className="dm-swap-stage">
        {phase !== 'landed' ? (
          <div className={phase === 'fading' ? 'dm-swap-old' : ''}>
            <MemoryPocket label={DOOR.pocketLabel} varName={DOOR.varName} emoji={current.emoji} glow />
          </div>
        ) : (
          <MemoryPocket label={DOOR.pocketLabel} varName={DOOR.varName} emoji={TIME_MACHINE.emoji} glow />
        )}
      </div>

      {phase === 'before' && (
        <button className="dm-btn dm-cta" onClick={() => setPhase('fading')}>Swap it in {'→'}</button>
      )}

      {phase === 'landed' && (
        <>
          <pre className="dm-code-block">{`${DOOR.varName} = "${TIME_MACHINE.name}"`}</pre>
          <p className="dm-caption-static">
            <strong>Variables replace values — they don't keep both.</strong> The moment <code>{DOOR.varName}</code> was reassigned, the Anywhere Door was gone from this pocket, and only the Time Machine remained.
          </p>
          <button className="dm-btn dm-cta" onClick={onNext}>See every memory pocket at once {'→'}</button>
        </>
      )}
    </SceneShell>
  );
}
