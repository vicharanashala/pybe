import React, { useState } from 'react';
import { CONCEPT } from '../data/content';
import RoboLoopStory from './RoboLoopStory';
import ForLoopCaseStudy from './ForLoopCaseStudy';
import ForLoopNumberLine from './ForLoopNumberLine';
import WhileLoopCaseStudy from './WhileLoopCaseStudy';
import WhileLoopFlowchart from './WhileLoopFlowchart';
import MiniChallenge from './MiniChallenge';
import ForVsWhileChoice from './ForVsWhileChoice';

const FOR_LOOP_OPTIONS = [
  { label: '3 times', correct: false, hint: 'Count the values range(2, 9, 2) actually lands on: 2, 4, 6, 8.' },
  { label: '4 times', correct: true },
  { label: '5 times', correct: false, hint: 'That would include 9 or 10 — but stop is always excluded.' },
  { label: 'Forever', correct: false, hint: 'A for loop over range() always has a fixed number of steps — it can’t run forever.' }
];

const WHILE_LOOP_OPTIONS = [
  { label: 'It runs exactly 3 times', correct: false, hint: 'Nothing inside the body changes c, so the condition never gets a chance to become false.' },
  { label: 'It stops immediately', correct: false, hint: 'c starts below the limit, so the condition is true on the very first check — it enters the body.' },
  { label: 'It never stops — an infinite loop', correct: true }
];

// The concept is taught in beats that mirror the full learning loop this module now
// uses everywhere: Story -> Learner Interaction -> Visualization -> Mini Challenge ->
// Reward -> Story Continues. Every beat ends with its own "next" step so it never
// feels like a wall of text — only the very last beat hands control back up to the
// module's main scene flow.
//
// Two discovery-based case studies were added ahead of each existing visualization
// (subStep 2 and subStep 5) so the learner first *feels* why a for loop or while loop
// is the right tool — known repetitions vs. an unknown count checked by a condition —
// before ever seeing the existing Number Line / Flowchart visuals or Python syntax.
// Nothing about the existing visualizations, mini challenges, or their order relative
// to each other was changed; the case studies are purely inserted beats before them.
//
// One further beat (subStep 8, "Robo's Decision" / ForVsWhileChoice) is inserted after
// the While Loop Flowchart's own mini challenge (subStep 7) and before the module moves
// on toward the Playground — a discovery-based "for vs. while" comparison scene the
// learner reaches only once every existing beat above it has run untouched.
export default function RepetitionConcept({ onNext, onCrystal }) {
  const [subStep, setSubStep] = useState(0);
  const go = (n) => () => setSubStep(n);

  if (subStep === 0) return <RoboLoopStory onNext={go(1)} />;

  if (subStep === 2) return <ForLoopCaseStudy onNext={go(3)} />;
  if (subStep === 3) return <ForLoopNumberLine onNext={go(4)} />;
  if (subStep === 4) return (
    <MiniChallenge
      prompt="Before you move on: how many times does the body of for i in range(2, 9, 2): run?"
      options={FOR_LOOP_OPTIONS}
      explanation="Exactly! range(2, 9, 2) produces 2, 4, 6, 8 — four values, four passes through the body. 9 is never reached."
      rewardLabel="Loop Crystal"
      onCorrectFirstTime={() => onCrystal?.('blue')}
      onNext={go(5)}
    />
  );

  if (subStep === 5) return <WhileLoopCaseStudy onNext={go(6)} />;
  if (subStep === 6) return <WhileLoopFlowchart onNext={go(7)} />;
  if (subStep === 7) return (
    <MiniChallenge
      prompt="c starts at 2, the loop checks c < 5, and nothing inside the body ever changes c. What happens?"
      options={WHILE_LOOP_OPTIONS}
      explanation="Right — the condition c < 5 stays true forever because c never moves. That's exactly what an infinite loop looks like: always double-check that something inside the loop pushes the condition toward false."
      rewardLabel="Wizard Scroll"
      onCorrectFirstTime={() => onCrystal?.('blue')}
      onNext={go(8)}
    />
  );

  if (subStep === 8) return <ForVsWhileChoice onNext={onNext} onCrystal={onCrystal} />;

  return (
    <div className="lp-scene">
      <h2>{CONCEPT.heading}</h2>
      <p className="lp-scene-intro">{CONCEPT.intro}</p>

      <div className="lp-concept-grid">
        {CONCEPT.points.map((point, i) => (
          <div key={point.title} className="lp-concept-card" style={{ animationDelay: `${i * 0.12}s` }}>
            <strong>{point.title}</strong>
            <p>{point.body}</p>
          </div>
        ))}
      </div>

      <button className="lp-mini-btn lp-cta" onClick={go(2)}>Try a for loop yourself {'→'}</button>
    </div>
  );
}
