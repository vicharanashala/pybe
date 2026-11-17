import React, { useState } from 'react';
import SceneShell from '../components/SceneShell';
import SpeechBubble from '../components/SpeechBubble';
import CodeToMemoryAnimation from '../visualizers/CodeToMemoryAnimation';
import { GADGETS } from '../data/gadgets';

// Only now, after the learner already understands "each gadget gets its own
// named pocket," does real Python syntax appear. Two quick assignments
// (door, then light) so the code -> memory animation reads as a pattern,
// not a one-off trick.
const DEMO_GADGETS = [GADGETS[0], GADGETS[2]]; // travelDoor, smallLight

export default function Scene6Assignment({ onNext, memory, setMemory, onGem }) {
  const [step, setStep] = useState(0);
  const [animDone, setAnimDone] = useState(false);
  const gadget = DEMO_GADGETS[step];
  const code = `${gadget.varName} = "${gadget.name}"`;

  function handleAnimDone() {
    setAnimDone(true);
    setMemory((prev) => ({ ...prev, [gadget.pocketId]: gadget }));
  }

  function next() {
    if (step === DEMO_GADGETS.length - 1) {
      onGem?.();
      onNext();
    } else {
      setStep((s) => s + 1);
      setAnimDone(false);
    }
  }

  return (
    <SceneShell
      chapter="Chapter 6 · Storing a Gadget"
      title="Assignment: giving a pocket its value"
      intro="This is the exact same idea as before — Doraemon just writes it in Python now."
    >
      <SpeechBubble speaker="doraemon" text={`Watch closely: ${code}`} hideButton speed={14} />

      <CodeToMemoryAnimation
        key={gadget.id}
        code={code}
        pocketLabel={gadget.pocketLabel}
        varName={gadget.varName}
        emoji={gadget.emoji}
        onDone={handleAnimDone}
      />

      {animDone && (
        <>
          <p className="dm-caption-static">
            The pocket named <code>{gadget.varName}</code> now holds one thing: <strong>{gadget.name}</strong>. That's what the <code>=</code> sign means — “store this value here.”
          </p>
          <button className="dm-btn dm-cta" onClick={next}>
            {step === DEMO_GADGETS.length - 1 ? 'Ask Doraemon to find it' : 'Store another gadget'} {'→'}
          </button>
        </>
      )}
    </SceneShell>
  );
}
