import React, { useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import SceneShell from '../components/SceneShell';
import { GADGETS } from '../data/gadgets';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Scene 5 — Choosing Good Names. For each pocket, the learner picks the
// name that would actually help Doraemon find the right gadget later, out
// of a mix of good and deliberately unhelpful options. No explanation up
// front — just quick feedback that makes the "why" obvious.
export default function Scene5Naming({ onNext }) {
  const options = useMemo(
    () => GADGETS.map((g) => ({ gadget: g, choices: shuffle([g.varName, ...g.badNames]) })),
    []
  );
  const [picked, setPicked] = useState({});

  function choose(gadgetId, choice, correct) {
    if (picked[gadgetId]?.correct) return;
    setPicked((prev) => ({ ...prev, [gadgetId]: { choice, correct } }));
  }

  const allCorrect = GADGETS.every((g) => picked[g.id]?.correct);

  return (
    <SceneShell
      chapter="Chapter 5 · Naming the Pockets"
      title="Help Doraemon name each pocket"
      intro="A pocket called “thing” could hold anything. Pick the name that actually tells you what's inside."
    >
      <div style={{ display: 'grid', gap: 12, width: '100%' }}>
        {options.map(({ gadget, choices }) => {
          const state = picked[gadget.id];
          return (
            <div key={gadget.id} className="dm-naming-row">
              <div className="dm-naming-row-head">
                <span style={{ fontSize: '1.3rem' }}>{gadget.emoji}</span>
                <span>{gadget.pocketLabel} stores the {gadget.name}</span>
              </div>
              <div className="dm-naming-options">
                {choices.map((choice) => {
                  const isCorrectChoice = choice === gadget.varName;
                  const isPicked = state?.choice === choice;
                  const cls = isPicked ? (isCorrectChoice ? 'correct' : 'wrong') : '';
                  return (
                    <button
                      key={choice}
                      className={`dm-naming-opt ${cls}`}
                      onClick={() => choose(gadget.id, choice, isCorrectChoice)}
                      disabled={state?.correct}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
              {state && !state.correct && (
                <p className="dm-caption-static">“{state.choice}” could mean anything. Try the name that says exactly what's stored.</p>
              )}
              {state?.correct && (
                <p className="dm-caption-static" style={{ color: 'var(--dm-success)', fontWeight: 700 }}>
                  <Check size={14} style={{ verticalAlign: '-2px' }} /> Perfect — “{gadget.varName}” tells you exactly what's inside.
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button className="dm-btn dm-cta" onClick={onNext} disabled={!allCorrect}>
        {allCorrect ? 'Store the first gadget' : `Name all ${GADGETS.length} pockets`} {'→'}
      </button>
    </SceneShell>
  );
}
