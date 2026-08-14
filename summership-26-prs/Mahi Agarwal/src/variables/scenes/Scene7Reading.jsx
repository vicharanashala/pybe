import React, { useEffect, useState } from 'react';
import SceneShell from '../components/SceneShell';
import SpeechBubble from '../components/SpeechBubble';
import MemoryPocket from '../components/MemoryPocket';
import { GADGETS } from '../data/gadgets';

const DOOR = GADGETS[0];

// Scene 7 — Reading Variables. Nobita asks a question; the pocket answers
// on its own instead of anyone searching. Only after the learner has
// watched that happen does print(travelDoor) get named as what's going on.
export default function Scene7Reading({ onNext, memory }) {
  const [phase, setPhase] = useState('ask'); // ask -> opening -> revealed
  const stored = memory.travel;

  useEffect(() => {
    if (phase === 'opening') {
      const t = setTimeout(() => setPhase('revealed'), 700);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <SceneShell chapter="Chapter 7 · Where Is It?" title="Reading a memory pocket">
      <SpeechBubble speaker="nobita" text="Doraemon, where is the Anywhere Door?" hideButton />

      <MemoryPocket
        label={DOOR.pocketLabel}
        varName={DOOR.varName}
        emoji={phase !== 'ask' ? (stored?.emoji || DOOR.emoji) : null}
        glow={phase !== 'ask'}
      />

      {phase === 'ask' && (
        <button className="dm-btn dm-cta" onClick={() => setPhase('opening')}>Let the pocket answer {'→'}</button>
      )}

      {phase === 'revealed' && (
        <>
          <SpeechBubble speaker="doraemon" text="No searching needed — I just asked the travelDoor pocket!" hideButton />
          <pre className="dm-code-block">{`print(${DOOR.varName})`}</pre>
          <div className="dm-console">
            <div className="dm-console-line"><span className="dm-console-prompt">{'>>>'}</span> print({DOOR.varName})</div>
            <div className="dm-console-line">{stored?.name || DOOR.name}</div>
          </div>
          <p className="dm-caption-static">Reading a variable never changes what's inside it — it just tells you what's there.</p>
          <button className="dm-btn dm-cta" onClick={onNext}>What if the gadget changes? {'→'}</button>
        </>
      )}
    </SceneShell>
  );
}
