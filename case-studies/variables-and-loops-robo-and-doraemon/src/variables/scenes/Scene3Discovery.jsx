import React, { useState } from 'react';
import SceneShell from '../components/SceneShell';
import SpeechBubble from '../components/SpeechBubble';
import MemoryPocket from '../components/MemoryPocket';
import { GADGETS } from '../data/gadgets';

const LINES = [
  'Wait a minute...',
  'What if every important gadget had its own special memory pocket?',
  'One pocket, just for the door. One pocket, just for the light. Never mixed up again!'
];

// Scene 3 — The Discovery. Time "slows down" and the single chaotic pocket
// splits into several small glowing pockets, one per gadget. Still no
// Python here — only the idea that giving something its own named place
// makes it easy to find again.
export default function Scene3Discovery({ onNext }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [split, setSplit] = useState(false);
  const isLast = lineIndex === LINES.length - 1;

  return (
    <SceneShell chapter="Chapter 3 · A Better Idea" title="Doraemon Freezes">
      <div className="dm-discovery-stage">
        <span className={`dm-discovery-single ${split ? 'hidden' : ''}`} aria-hidden="true">👝</span>
        {split && (
          <div className="dm-discovery-fan">
            {GADGETS.map((g, i) => (
              <div key={g.id} style={{ animationDelay: `${i * 0.1}s` }}>
                <MemoryPocket label={g.pocketLabel} />
              </div>
            ))}
          </div>
        )}
      </div>

      {!split && (
        <SpeechBubble
          speaker="doraemon"
          text={LINES[lineIndex]}
          ctaLabel={isLast ? 'Watch it happen' : 'Continue'}
          onContinue={() => (isLast ? setSplit(true) : setLineIndex((i) => i + 1))}
        />
      )}

      {split && (
        <>
          <p className="dm-caption-static">One giant messy pocket just became five small, calm ones — each one waiting for exactly one gadget.</p>
          <button className="dm-btn dm-cta" onClick={onNext}>Sort the gadgets in {'→'}</button>
        </>
      )}
    </SceneShell>
  );
}
