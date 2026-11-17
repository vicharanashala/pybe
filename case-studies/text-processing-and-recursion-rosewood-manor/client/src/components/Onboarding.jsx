import React, { useState } from 'react';
import { CandleRule, MagnifierBrand } from './Motifs';
import { manorAsset } from '../lib/assets';

// Three short scene-setting screens (under 30 seconds end to end), then the
// learner walks straight into Part 0 of Rosewood Manor. No syllabus dump,
// no tutorial — just weather, premise, and a door opening.

const SCREENS = [
  {
    key: 'hook',
    kicker: '11:47 p.m. · the storm rolls in',
    lines: ['Every case has a beginning.', 'Yours starts tonight.'],
    note: 'A car you did not send is waiting outside. The address it carries is one the county maps forgot: Rosewood Manor.'
  },
  {
    key: 'framing',
    kicker: 'the detective\'s terms',
    lines: ['A murder was committed in the dark.', 'You will be the one who drags it into the light.'],
    note: 'Not with hunches — with method. Order out of messy testimony. Patterns out of alibis. The same discipline, it turns out, that runs every line of Python you will ever write.'
  },
  {
    key: 'invitation',
    kicker: 'the manor gate',
    lines: ['Let\'s solve this case together.'],
    note: 'Five suspects. One locked study. A single night to set in order. The detective is holding the door — she does not like to wait.'
  }
];

export default function Onboarding({ onFinish, caseSolved = false }) {
  const [index, setIndex] = useState(0);
  const screen = SCREENS[index];
  const isLast = index === SCREENS.length - 1;

  function advance() {
    if (isLast) onFinish();
    else setIndex((current) => current + 1);
  }

  function onKey(event) {
    if (event.key === 'Enter' || event.key === 'ArrowRight') advance();
  }

  return (
    <div className="onboarding" role="dialog" aria-label="Welcome to PyBe" onKeyDown={onKey} tabIndex={-1}>
      <div className="onboard-card" key={screen.key}>
        <img className="onboard-manor" src={manorAsset} alt="Rosewood Manor" width="448" height="252" loading="eager" />
        <div className="onboard-brand">
          <MagnifierBrand size={40} />
          <span>PyBe</span>
        </div>
        <p className="onboard-kicker">{screen.kicker}</p>
        <h1 className="onboard-title">
          {screen.lines.map((line) => <span key={line}>{line}</span>)}
        </h1>
        <CandleRule />
        <p className="onboard-note">{screen.note}</p>

        <div className="onboard-footer">
          <div className="onboard-steps" aria-hidden="true">
            {SCREENS.map((s, i) => (
              <span key={s.key} className={i === index ? 'step-dot lit' : 'step-dot'} />
            ))}
          </div>
          <button type="button" className="forward-arrow" onClick={advance} autoFocus>
            {caseSolved && index === 0 ? 'Play again' : isLast ? 'Enter the manor' : 'Continue'}
            <svg width="30" height="14" viewBox="0 0 34 14" fill="none" aria-hidden="true">
              <path d="M1 7h29M24 1l7 6-7 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <button
        type="button"
        className="skip-link"
        onClick={onFinish}
      >
        Skip ahead →
      </button>
    </div>
  );
}
