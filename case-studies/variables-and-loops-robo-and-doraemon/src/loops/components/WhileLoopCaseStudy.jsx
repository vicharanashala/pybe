import React, { useState } from 'react';
import MiniChallenge from './MiniChallenge';

// ---------------------------------------------------------------------------
// Case Study — "The Magic Well" (while loop discovery)
// Sits before the existing While Loop Flowchart Visualization. The learner
// fills a bucket by repeatedly clicking, where each scoop adds a random,
// unpredictable amount — so the number of clicks needed can never be known
// in advance. Only the condition ("is it full yet?") can be checked. The
// reveal names the words "while loop" only at the very end, then the
// existing flowchart (untouched) takes over to show the Python syntax.
// ---------------------------------------------------------------------------

const SCOOP_AMOUNTS = [8, 15, 20, 11];
const FULL_TARGET = 100;

const KNEW_IN_ADVANCE_OPTIONS = [
  {
    label: 'Yes',
    correct: false,
    hint: 'Look again — the amount added by each scoop kept changing. Nobody wrote down a fixed number in advance.'
  },
  { label: 'No', correct: true }
];

export default function WhileLoopCaseStudy({ onNext }) {
  const [phase, setPhase] = useState('well'); // 'well' | 'quiz' | 'reveal'
  const [water, setWater] = useState(0);
  const [scoops, setScoops] = useState(0);
  const [splashKey, setSplashKey] = useState(0);

  const isFull = water >= FULL_TARGET;

  function collectScoop() {
    if (isFull) return;
    const amount = SCOOP_AMOUNTS[Math.floor(Math.random() * SCOOP_AMOUNTS.length)];
    setWater((w) => Math.min(FULL_TARGET, w + amount));
    setScoops((s) => s + 1);
    setSplashKey((k) => k + 1);
  }

  if (phase === 'quiz') {
    return (
      <div className="lp-scene">
        <span className="lp-concept-tag">Case study · While loop</span>
        <MiniChallenge
          prompt="Did Robo know in advance how many scoops the bucket would need?"
          options={KNEW_IN_ADVANCE_OPTIONS}
          explanation="Right — nobody knew ahead of time. Robo only ever checked one thing: ‘Is the bucket full yet?’ As long as the answer was no, he kept scooping."
          rewardLabel="Well Badge"
          onNext={() => setPhase('reveal')}
        />
      </div>
    );
  }

  if (phase === 'reveal') {
    return (
      <div className="lp-scene lp-case-reveal">
        <span className="lp-concept-tag">Case study · While loop</span>
        <h2>Unknown count, checked condition</h2>
        <div className="lp-case-mapping">
          <span className="lp-case-mapping-step">unknown scoops</span>
          <span className="lp-mapping-arrow">{'→'}</span>
          <span className="lp-case-mapping-step">check the condition</span>
          <span className="lp-mapping-arrow">{'→'}</span>
          <span className="lp-case-mapping-step">repeat until false</span>
          <span className="lp-mapping-arrow">{'→'}</span>
          <span className="lp-case-loop-tag lp-case-tag-while">WHILE LOOP</span>
        </div>
        <p className="lp-scene-intro">
          Whenever you don't know the number of repetitions ahead of time, a <strong>while loop</strong> is the
          right tool — it keeps repeating for as long as a condition stays true, and stops the moment it
          doesn't.
        </p>
        <button className="lp-mini-btn lp-cta" onClick={onNext}>See how Python tracks this {'→'}</button>
      </div>
    );
  }

  return (
    <div className="lp-scene lp-case-study lp-case-while">
      <span className="lp-concept-tag">Case study · While loop</span>
      <h2>The Magic Well</h2>
      <p className="lp-scene-intro">
        Robo's bucket is almost empty, and it needs to be full before nightfall. But nobody knows exactly how
        many scoops that will take — some days it's 4, other days it's 10. The only way to know is to keep
        checking.
      </p>

      <div className="lp-case-bucket-wrap">
        <div className="lp-case-bucket">
          <div className="lp-case-bucket-target"><span>FULL</span></div>
          <div className="lp-case-bucket-fill" style={{ height: `${water}%` }}>
            <span key={splashKey} className="lp-case-water-wave" aria-hidden="true" />
          </div>
        </div>
        <div className="lp-case-bucket-readout">
          <span className="lp-nl-current-badge">{Math.round(water)}% full</span>
          <span className="lp-sync-badge">Scoops Collected: {scoops}</span>
        </div>
      </div>

      {!isFull && (
        <div className="lp-playground-actions">
          <button className="lp-mini-btn" onClick={collectScoop}>Collect One Scoop {'💦'}</button>
        </div>
      )}

      {isFull && (
        <>
          <div className="lp-reward-toast lp-reward-inline">
            <span className="lp-reward-icon">{'🎉'}</span>
            <span>The bucket is full!</span>
          </div>
          <p className="lp-caption-static">Did Robo know how many scoops that would take?</p>
          <button className="lp-mini-btn lp-cta" onClick={() => setPhase('quiz')}>Continue {'→'}</button>
        </>
      )}
    </div>
  );
}
