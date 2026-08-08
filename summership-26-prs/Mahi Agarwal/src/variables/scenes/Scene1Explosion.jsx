import React, { useMemo, useState } from 'react';
import SceneShell from '../components/SceneShell';
import SpeechBubble from '../components/SpeechBubble';
import { JUNK_GADGETS } from '../data/gadgets';

const LINES = [
  { speaker: 'nobita', text: 'Doraemon! Quick! I need the Anywhere Door!' },
  { speaker: 'doraemon', text: 'Leave it to me, Nobita! It is somewhere in my pocket...' }
];

// Scene 1 — Morning at Doraemon's House. No Python, no variables: just the
// problem. Doraemon confidently opens his pocket and everything explodes
// out in a hilarious mess, so the learner *feels* the chaos before anyone
// ever proposes a fix for it.
export default function Scene1Explosion({ onNext }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [boomed, setBoomed] = useState(false);

  const pieces = useMemo(() => JUNK_GADGETS.slice(0, 16).map((emoji, i) => {
    const angle = (i / 16) * Math.PI * 2 + Math.random() * 0.4;
    const dist = 90 + Math.random() * 70;
    return {
      emoji,
      dx: `${Math.cos(angle) * dist}px`,
      dy: `${Math.sin(angle) * dist}px`,
      rot: `${(Math.random() - 0.5) * 200}deg`,
      delay: `${Math.random() * 0.25}s`
    };
  }), []);

  const isLast = lineIndex === LINES.length - 1;

  return (
    <SceneShell chapter="Chapter 1 · Morning Chaos" title="A Perfectly Normal Morning">
      <div className="dm-explosion-stage">
        <span className="dm-explosion-origin" aria-hidden="true">{boomed ? '💥' : '👝'}</span>
        {boomed && pieces.map((p, i) => (
          <span
            key={i}
            className="dm-explosion-piece"
            style={{ '--dx': p.dx, '--dy': p.dy, '--rot': p.rot, animationDelay: p.delay }}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      {!boomed && (
        <SpeechBubble
          speaker={LINES[lineIndex].speaker}
          text={LINES[lineIndex].text}
          ctaLabel={isLast ? 'Open the pocket' : 'Continue'}
          onContinue={() => (isLast ? setBoomed(true) : setLineIndex((i) => i + 1))}
        />
      )}

      {boomed && (
        <>
          <p className="dm-caption-static">Every single gadget Doraemon owns just spilled out onto the floor. Somewhere in that pile is the Anywhere Door.</p>
          <button className="dm-btn dm-cta" onClick={onNext}>Help find it {'→'}</button>
        </>
      )}
    </SceneShell>
  );
}
