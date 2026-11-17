import React, { useMemo, useState } from 'react';
import SceneShell from '../components/SceneShell';
import SpeechBubble from '../components/SpeechBubble';
import { GADGETS, JUNK_GADGETS } from '../data/gadgets';

// Scene 2 — Searching Again. The learner must find the same handful of
// gadgets over and over, inside a pile that only grows. No naming, no
// Python — just repeated manual search, on purpose, until it stops being
// fun. That discomfort is the whole point: it's what makes Scene 3's idea
// feel necessary instead of arbitrary.
function shuffledGrid(target, round) {
  const decoyCount = 9 + round * 3;
  const decoys = [];
  for (let i = 0; i < decoyCount; i += 1) decoys.push(JUNK_GADGETS[(i + round * 3) % JUNK_GADGETS.length]);
  const items = [
    { id: target.id, emoji: target.emoji, isTarget: true },
    ...decoys.map((emoji, i) => ({ id: `decoy-${round}-${i}`, emoji, isTarget: false }))
  ];
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

export default function Scene2Searching({ onNext }) {
  const [round, setRound] = useState(0);
  const [wrongId, setWrongId] = useState(null);
  const [foundId, setFoundId] = useState(null);
  const [phase, setPhase] = useState('search'); // search | done
  const target = GADGETS[round];
  const grid = useMemo(() => shuffledGrid(target, round), [round]);

  function handleClick(item) {
    if (foundId) return;
    if (item.isTarget) {
      setFoundId(item.id);
      setTimeout(() => {
        if (round === GADGETS.length - 1) {
          setPhase('done');
        } else {
          setRound((r) => r + 1);
          setFoundId(null);
        }
      }, 550);
    } else {
      setWrongId(item.id);
      setTimeout(() => setWrongId(null), 350);
    }
  }

  if (phase === 'done') {
    return (
      <SceneShell chapter="Chapter 2 · Lost in the Pocket" title="Found... eventually.">
        <SpeechBubble
          speaker="doraemon"
          text="Whew! Five gadgets, and I had to search through the whole pile every single time. There must be a better way..."
          ctaLabel="What if there was?"
          onContinue={onNext}
        />
      </SceneShell>
    );
  }

  return (
    <SceneShell chapter="Chapter 2 · Lost in the Pocket" title="Searching Again...">
      <SpeechBubble speaker="nobita" text={`Now I need the ${target.name}!`} hideButton />
      <div className="dm-frustration-meter" aria-hidden="true">
        {GADGETS.map((g, i) => <span key={g.id} className={`dm-frustration-dot ${i <= round ? 'filled' : ''}`} />)}
      </div>
      <div className="dm-search-grid">
        {grid.map((item) => (
          <button
            key={item.id}
            className={`dm-search-item ${wrongId === item.id ? 'wrong' : ''} ${foundId === item.id ? 'correct' : ''}`}
            onClick={() => handleClick(item)}
          >
            {item.emoji}
          </button>
        ))}
      </div>
      <p className="dm-caption-static">Round {round + 1} of {GADGETS.length} — find the {target.name} {target.emoji} in the pile.</p>
    </SceneShell>
  );
}
