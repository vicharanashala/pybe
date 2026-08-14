import React, { useEffect } from 'react';
import SceneShell from '../components/SceneShell';
import SpeechBubble from '../components/SpeechBubble';
import MemoryInspector from '../visualizers/MemoryInspector';
import { GADGETS } from '../data/gadgets';

// Scene 9 — The Memory Room. Every pocket the story has touched (plus a
// couple of everyday examples that aren't gadgets at all) floats together
// as one live view — the moment the learner sees computer memory as a
// whole, not one box at a time.
export default function Scene9MemoryRoom({ onNext, memory, setMemory }) {
  useEffect(() => {
    // By this point in the story every gadget has quietly found its pocket,
    // the same way travelDoor and smallLight did on screen in Chapter 6.
    setMemory((prev) => {
      const next = { ...prev };
      GADGETS.forEach((g) => { if (!next[g.pocketId]) next[g.pocketId] = g; });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const entries = GADGETS.map((g) => {
    const stored = memory[g.pocketId] || g;
    return { id: g.pocketId, label: g.pocketLabel, varName: g.varName, emoji: stored.emoji };
  });

  const extras = [
    { id: 'coins', label: 'Coin Pocket', varName: 'coins = 25', emoji: '🪙' },
    { id: 'robotName', label: 'Name Tag', varName: 'robotName = "Doraemon"', emoji: '🏷️' }
  ];

  return (
    <SceneShell
      chapter="Chapter 9 · The Memory Room"
      title="Every pocket, all at once"
      intro="This is what a computer's memory really looks like — lots of named pockets, each holding exactly one current value."
    >
      <MemoryInspector entries={[...entries, ...extras]} />
      <SpeechBubble
        speaker="doraemon"
        text="A pocket can hold a gadget, a number, or a name — it doesn't matter what's inside. It always holds exactly one thing at a time."
        ctaLabel="One more thing before we're done"
        onContinue={onNext}
      />
    </SceneShell>
  );
}
