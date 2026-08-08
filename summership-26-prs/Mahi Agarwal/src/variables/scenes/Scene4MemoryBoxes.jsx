import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import SceneShell from '../components/SceneShell';
import GadgetChip from '../components/GadgetChip';
import MemoryPocket from '../components/MemoryPocket';
import RewardToast from '../components/RewardToast';
import { GADGETS } from '../data/gadgets';

// Scene 4 — Interactive Memory Boxes. The learner physically sorts each
// gadget into the pocket it belongs in. Supports both drag & drop and a
// tap-to-select / tap-a-pocket fallback for touch devices.
export default function Scene4MemoryBoxes({ onNext, onGem }) {
  const [placed, setPlaced] = useState({}); // gadgetId -> pocketId
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);

  const allPlaced = GADGETS.every((g) => placed[g.id]);
  const correctCount = GADGETS.filter((g) => placed[g.id] === g.pocketId).length;

  function place(gadgetId, pocketId) {
    setPlaced((prev) => ({ ...prev, [gadgetId]: pocketId }));
    setSelected(null);
  }

  function handleDrop(e, pocketId) {
    e.preventDefault();
    const gadgetId = e.dataTransfer.getData('text/plain');
    if (gadgetId) place(gadgetId, pocketId);
  }

  function checkAnswers() {
    setChecked(true);
    if (correctCount === GADGETS.length) onGem?.();
  }

  const unplaced = GADGETS.filter((g) => !placed[g.id]);

  return (
    <SceneShell
      chapter="Chapter 4 · Sorting the Pockets"
      title="Put every gadget where it belongs"
      intro="Drag each gadget into its matching pocket — or tap a gadget, then tap a pocket."
    >
      {!checked && unplaced.length > 0 && (
        <div className="dm-tray">
          {unplaced.map((g) => (
            <GadgetChip
              key={g.id}
              emoji={g.emoji}
              label={g.name}
              draggable
              selected={selected === g.id}
              onDragStart={(e) => e.dataTransfer.setData('text/plain', g.id)}
              onClick={() => setSelected((prev) => (prev === g.id ? null : g.id))}
            />
          ))}
        </div>
      )}

      <div className="dm-pocket-grid">
        {GADGETS.map((pocketOwner) => {
          const gadgetHere = GADGETS.find((g) => placed[g.id] === pocketOwner.pocketId);
          const isCorrect = gadgetHere && gadgetHere.pocketId === pocketOwner.pocketId;
          return (
            <MemoryPocket
              key={pocketOwner.pocketId}
              label={pocketOwner.pocketLabel}
              emoji={gadgetHere?.emoji}
              glow={!!gadgetHere && (!checked || isCorrect)}
              interactive={!checked}
              onDragOver={() => {}}
              onDrop={(e) => handleDrop(e, pocketOwner.pocketId)}
              onClick={!checked ? () => selected && place(selected, pocketOwner.pocketId) : undefined}
            />
          );
        })}
      </div>

      {checked && (
        <p className="dm-caption-static">
          {correctCount === GADGETS.length
            ? 'Every gadget found its own pocket — nothing to search through anymore!'
            : `${correctCount} of ${GADGETS.length} correct. Wrong pockets are highlighted — try again!`}
        </p>
      )}

      {checked && correctCount === GADGETS.length && <RewardToast label="Memory Gem earned!" />}

      {!checked ? (
        <button className="dm-btn dm-cta" onClick={checkAnswers} disabled={!allPlaced}>
          {allPlaced ? 'Check my sorting' : `Place all ${GADGETS.length} gadgets`} {'→'}
        </button>
      ) : correctCount === GADGETS.length ? (
        <button className="dm-btn dm-cta" onClick={onNext}><Sparkles size={16} /> Give the pockets good names</button>
      ) : (
        <button className="dm-btn" onClick={() => { setChecked(false); setPlaced({}); }}>Try again</button>
      )}
    </SceneShell>
  );
}
