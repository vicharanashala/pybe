import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTypewriter } from './useTypewriter';
import MemoryOrbs from './MemoryOrbs';

// ---------------------------------------------------------------------------
// "Robo and the Never-Ending Garden"
// A cinematic, mostly-interactive opening story for the Loops module.
// The learner waters flowers by hand, feels the repetition become tiring,
// watches a brand new batch of flowers appear out of nowhere, then watches
// a wizard do the same job with one spell — discovering the word "loop"
// only after they've felt why it's needed.
// ---------------------------------------------------------------------------

const MOODS = ['😊', '😊', '😐', '😩', '🥵', '😭'];
const MOOD_LINES = [
  'Five thirsty flowers. Robo picks up the watering can.',
  '"One done... four to go."',
  '"Still more?"',
  '"Again?! My circuits are getting tired..."',
  '"Almost there... just keep repeating the same motion..."',
  '"There has to be a better way..."'
];

const BATCH = [0, 1, 2, 3, 4];

// Ordered beats for the pre-water and post-water narrative stretches.
// Each maps to the beat that "Continue" advances to.
const NEXT_BEAT = {
  dawn: 'greet',
  greet: 'heat1',
  heat1: 'heat2',
  heat2: 'heat3',
  wizardIntro: 'wizardQ1',
  wizardQ1: 'roboA1',
  roboA1: 'wizardQ2',
  wizardQ2: 'roboThink',
  roboThink: 'wizardReady',
  revealLine1: 'revealLine2',
  revealLine2: 'revealLine3'
};

const WIZARD_BEATS = new Set([
  'wizardIntro', 'wizardQ1', 'roboA1', 'wizardQ2', 'roboThink', 'wizardReady',
  'casting', 'revealLine1', 'revealLine2', 'revealLine3', 'revealWord'
]);

const TWIST_ONWARD = new Set([
  'twist', ...WIZARD_BEATS, 'mapping', 'reward'
]);

function makeHappyPots() {
  return BATCH.map(() => ({ stage: 'happy' }));
}
function makeHiddenPots() {
  return BATCH.map(() => ({ stage: 'hidden' }));
}

export default function RoboLoopStory({ onNext }) {
  const [beat, setBeat] = useState('dawn');
  const [pots, setPots] = useState(makeHappyPots);
  const [pots2, setPots2] = useState(makeHiddenPots);
  const [held, setHeld] = useState(false);
  const [wateredCount, setWateredCount] = useState(0);
  const [spellIndex, setSpellIndex] = useState(0);
  const [twistPopped, setTwistPopped] = useState(false);
  const [mapRevealed, setMapRevealed] = useState(0);
  const [mapCodeShown, setMapCodeShown] = useState(false);
  const timers = useRef([]);
  const castStarted = useRef(false);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  function after(ms, fn) { timers.current.push(setTimeout(fn, ms)); }

  // Sun cools the garden into dryness the moment "heat1" begins.
  useEffect(() => {
    if (beat === 'heat1') {
      BATCH.forEach((_, i) => {
        after(i * 240, () => setPots((prev) => prev.map((p, idx) => (idx === i ? { stage: 'wilting' } : p))));
        after(i * 240 + 850, () => setPots((prev) => prev.map((p, idx) => (idx === i ? { stage: 'dry' } : p))));
      });
    }
    if (beat === 'twist') {
      BATCH.forEach((_, i) => {
        after(i * 230, () => setPots2((prev) => prev.map((p, idx) => (idx === i ? { stage: 'dry' } : p))));
      });
      after(BATCH.length * 230 + 500, () => setTwistPopped(true));
    }
    if (beat === 'mapping') {
      BATCH.forEach((_, i) => after(i * 420 + 300, () => setMapRevealed(i + 1)));
      after(BATCH.length * 420 + 900, () => setMapCodeShown(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beat]);

  function waterPot(setter, idx, onSettled) {
    setter((prev) => prev.map((p, i) => (i === idx ? { stage: 'pouring' } : p)));
    after(260, () => setter((prev) => prev.map((p, i) => (i === idx ? { stage: 'growing' } : p))));
    after(760, () => {
      setter((prev) => prev.map((p, i) => (i === idx ? { stage: 'bloomed' } : p)));
      onSettled?.();
    });
  }

  function handleBucketDown() {
    if (beat !== 'water') return;
    setHeld(true);
  }

  function handlePlantTarget(idx) {
    if (beat !== 'water' || !held) return;
    if (pots[idx].stage !== 'dry') return;
    setHeld(false);
    waterPot(setPots, idx, () => {
      setWateredCount((c) => {
        const next = c + 1;
        if (next >= 5) after(700, () => setBeat('tired'));
        return next;
      });
    });
  }

  function castSpell() {
    if (castStarted.current) return;
    castStarted.current = true;
    BATCH.forEach((_, i) => {
      after(i * 460, () => {
        setSpellIndex(i + 1);
        waterPot(setPots2, i, () => {
          if (i === BATCH.length - 1) after(700, () => setBeat('revealLine1'));
        });
      });
    });
  }

  useEffect(() => {
    if (beat === 'casting') castSpell();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beat]);

  function advance() {
    const next = NEXT_BEAT[beat];
    if (next) setBeat(next);
  }

  // -------------------- dialogue text + speaker per beat --------------------
  function dialogueFor(b) {
    switch (b) {
      case 'dawn': return { speaker: 'narration', text: 'Sunlight spills over the garden as the night fades away. Butterflies drift between the flowers.' };
      case 'greet': return { speaker: 'robo', text: '"Good morning, little flowers!"' };
      case 'heat1': return { speaker: 'narration', text: 'But today the sun climbs higher — and hotter — than Robo has ever felt it.' };
      case 'heat2': return { speaker: 'flowers', text: '"...I’m thirsty..."' };
      case 'heat3': return { speaker: 'flowers', text: '"Please help us, Robo..."' };
      case 'worried': return { speaker: 'robo', text: 'Robo’s eyes go wide. "Oh no! Hang on, everyone — I’m coming!"' };
      case 'water': return { speaker: 'robo', text: MOOD_LINES[Math.min(wateredCount, MOOD_LINES.length - 1)] };
      case 'tired': return { speaker: 'robo', text: '"Phew... all five are happy again."' };
      case 'twist': return twistPopped
        ? { speaker: 'robo', text: '"...Seriously?"' }
        : { speaker: 'narration', text: 'Something rustles behind Robo...' };
      case 'wizardIntro': return { speaker: 'narration', text: 'The air shimmers. Sparkles swirl into a glowing circle — and a friendly wizard steps out of the light!' };
      case 'wizardQ1': return { speaker: 'wizard', text: '"Why are you repeating the same work, little Robo?"' };
      case 'roboA1': return { speaker: 'robo', text: '"Every flower needs water."' };
      case 'wizardQ2': return { speaker: 'wizard', text: '"Does every flower need different work — or is it the exact same thing, five times over?"' };
      case 'roboThink': return { speaker: 'robo', text: 'Robo pauses. "...No. It’s the same thing. Every single time."' };
      case 'wizardReady': return { speaker: 'wizard', text: '"Then watch closely — I’ll do it all in one motion."' };
      case 'casting': return { speaker: 'wizard', text: 'One spell. Every flower. Watch what happens...' };
      case 'revealLine1': return { speaker: 'wizard', text: 'When the same task must be repeated many times...' };
      case 'revealLine2': return { speaker: 'wizard', text: '...we don’t repeat the work.' };
      case 'revealLine3': return { speaker: 'wizard', text: 'We repeat the instruction.' };
      default: return { speaker: 'narration', text: '' };
    }
  }

  const dialogue = dialogueFor(beat);
  const { shown, done } = useTypewriter(dialogue.text, 16);

  // -------------------- visuals --------------------
  const showTwistBatch = TWIST_ONWARD.has(beat);
  const activePots = showTwistBatch ? [...pots, ...pots2] : pots;
  const showWizard = WIZARD_BEATS.has(beat);

  const mood =
    beat === 'water' ? MOODS[Math.min(wateredCount, MOODS.length - 1)] :
    beat === 'dawn' || beat === 'greet' ? '😊' :
    beat === 'heat1' || beat === 'heat2' || beat === 'heat3' || beat === 'worried' ? '😟' :
    beat === 'tired' ? '😊' :
    beat === 'twist' ? '😲' :
    beat === 'roboThink' ? '🤔' :
    beat === 'casting' ? '😲' :
    beat === 'revealLine1' || beat === 'revealLine2' || beat === 'revealLine3' || beat === 'revealWord' ? '🤩' :
    beat === 'reward' ? '🥳' : '🙂';

  const firstDryIndex = pots.findIndex((p) => p.stage === 'dry');
  const robotLeftPct = beat === 'water'
    ? (firstDryIndex === -1 ? 82 : Math.max(4, firstDryIndex * 18 - 4))
    : 8;

  const skyPhase =
    beat === 'dawn' ? 'dawn' :
    ['heat1', 'heat2', 'heat3', 'worried', 'water', 'tired', 'twist'].includes(beat) ? 'hot' :
    beat === 'reward' ? 'bright' :
    WIZARD_BEATS.has(beat) ? 'magic' : 'day';

  // Loop-sync panel content (only during hands-on beats).
  const showSync = beat === 'water' || beat === 'casting';
  const loopVar = beat === 'casting' ? spellIndex : wateredCount;

  function goldenSeed() { setBeat('reward'); }

  // -------------------- render --------------------
  if (beat === 'mapping') return <MappingScene revealed={mapRevealed} showCode={mapCodeShown} onNext={goldenSeed} />;
  if (beat === 'reward') return <RewardScene onNext={onNext} />;

  return (
    <div className="lp-robo-story">
      <span className="lp-concept-tag">Robo and the Never-Ending Garden</span>

      <div className="lp-garden-stage">
        <div className={`lp-garden lp-garden-sky lp-sky-${skyPhase}`}>
          <div className={`lp-sun ${skyPhase === 'hot' ? 'lp-sun-hot' : ''}`} />
          <span className="lp-cloud lp-cloud-a" />
          <span className="lp-cloud lp-cloud-b" />
          <span className="lp-bird lp-bird-a">{'🐦'}</span>
          <span className="lp-bird lp-bird-b">{'🐦'}</span>
          <span className="lp-butterfly lp-butterfly-a">{'🦋'}</span>
          <span className="lp-butterfly lp-butterfly-b">{'🦋'}</span>
          {[...Array(4)].map((_, i) => (
            <span key={i} className={`lp-leaf lp-leaf-${i}`} aria-hidden="true">{'🍃'}</span>
          ))}

          <div className={`lp-garden-row ${activePots.length > 5 ? 'dense' : ''}`}>
            {activePots.map((pot, i) => (
              <Pot key={i} pot={pot} targetable={beat === 'water' && held} onTarget={() => handlePlantTarget(i)} />
            ))}
          </div>
          <div className="lp-grass" />

          <div className="lp-robot" style={{ left: `${robotLeftPct}%` }}>
            <span className="lp-robot-mood">{mood}</span>
            <svg viewBox="0 0 60 60" className="lp-robot-svg">
              <rect x="10" y="18" width="40" height="30" rx="8" className="lp-robot-body" />
              <circle cx="22" cy="32" r="4" className="lp-robot-eye" />
              <circle cx="38" cy="32" r="4" className="lp-robot-eye" />
              <rect x="20" y="42" width="20" height="5" rx="2" className="lp-robot-mouth" />
              <rect x="26" y="6" width="8" height="12" rx="3" className="lp-robot-antenna" />
              <circle cx="30" cy="5" r="4" className="lp-robot-antenna-tip" />
              <rect x="0" y="26" width="12" height="6" rx="3" className="lp-robot-arm" />
              <rect x="48" y="26" width="12" height="6" rx="3" className="lp-robot-arm" />
            </svg>
          </div>

          {beat === 'water' && (
            <button
              type="button"
              className={`lp-bucket ${held ? 'held' : ''}`}
              onClick={handleBucketDown}
              draggable
              onDragStart={handleBucketDown}
              aria-label="Pick up the watering bucket"
            >
              {'🪣'}
            </button>
          )}

          {showWizard && (
            <div className="lp-wizard lp-wizard-in">
              <span className="lp-wizard-magic-circle" />
              {[...Array(6)].map((_, i) => <span key={i} className="lp-wizard-particle" style={{ animationDelay: `${i * 0.18}s` }} />)}
              <svg viewBox="0 0 60 70" className="lp-wizard-svg">
                <path d="M30 4 L46 30 L14 30 Z" className="lp-wizard-hat" />
                <circle cx="30" cy="38" r="10" className="lp-wizard-head" />
                <path d="M12 66 L20 40 L40 40 L48 66 Z" className="lp-wizard-robe" />
                <line x1="46" y1="46" x2="58" y2="34" className={`lp-wizard-wand ${beat === 'casting' ? 'casting' : ''}`} />
                <circle cx="58" cy="34" r="3" className="lp-wizard-wand-tip" />
              </svg>
              <span className="lp-wizard-sparkle">{'✨'}</span>
            </div>
          )}

          {beat === 'revealWord' && (
            <div className="lp-word-reveal">
              <span>{'✨'} LOOP {'✨'}</span>
            </div>
          )}
        </div>

        {showSync && (
          <aside className="lp-loop-sync-panel">
            <div className="lp-panel-label">Live in Python</div>
            <pre className="lp-code-block lp-code-mini">
              {beat === 'casting'
                ? 'for plant in garden:\n    water(plant)'
                : 'water(garden[' + Math.max(loopVar - 1, 0) + '])  # repeated by hand'}
            </pre>
            <div className="lp-sync-row">
              <span className="lp-sync-badge">iteration {Math.min(loopVar, 5)} / 5</span>
            </div>
            <MemoryOrbs globals={loopVar > 0 ? { plant: Math.min(loopVar - 1, 4), watered: Math.min(loopVar, 5) } : {}} emptyLabel="Nothing watered yet." />
            <div className="lp-mini-timeline">
              {BATCH.map((_, i) => (
                <span key={i} className={`lp-mini-tick ${i < loopVar ? 'done' : ''} ${i === loopVar - 1 ? 'current' : ''}`} />
              ))}
            </div>
          </aside>
        )}
      </div>

      <div className="lp-robo-caption">
        {dialogue.speaker !== 'narration' && (
          <span className={`lp-speaker-tag lp-tag-${dialogue.speaker}`}>
            {dialogue.speaker === 'robo' ? 'Robo' : dialogue.speaker === 'wizard' ? 'Wizard' : 'The Flowers'}
          </span>
        )}
        <p>{shown}{!done && <span className="lp-cursor">|</span>}</p>
      </div>

      {beat === 'water' && (
        <p className="lp-caption-static">{held ? 'Now click a dry plant to pour — or drag the bucket onto it.' : 'Click the bucket to pick it up.'}</p>
      )}

      {done && NEXT_BEAT[beat] && (
        <button className="lp-mini-btn lp-cta" onClick={advance}>Continue</button>
      )}

      {beat === 'heat3' && done && (
        <button className="lp-mini-btn lp-cta" onClick={() => setBeat('worried')}>Continue</button>
      )}

      {beat === 'worried' && done && (
        <button className="lp-mini-btn lp-cta" onClick={() => setBeat('water')}>Help water the garden {'💧'}</button>
      )}

      {beat === 'tired' && done && (
        <button className="lp-mini-btn lp-cta" onClick={() => setBeat('twist')}>Continue</button>
      )}

      {beat === 'twist' && twistPopped && done && (
        <button className="lp-mini-btn lp-cta" onClick={() => setBeat('wizardIntro')}>Continue</button>
      )}

      {beat === 'wizardReady' && done && (
        <button className="lp-mini-btn lp-cta" onClick={() => setBeat('casting')}>Watch the spell {'✨'}</button>
      )}

      {beat === 'revealLine3' && done && (
        <button className="lp-mini-btn lp-cta" onClick={() => setBeat('revealWord')}>Continue</button>
      )}

      {beat === 'revealWord' && (
        <button className="lp-mini-btn lp-cta" onClick={() => setBeat('mapping')}>See the pattern {'✨'}</button>
      )}
    </div>
  );
}

function Pot({ pot, targetable, onTarget }) {
  function handleDrop(e) {
    e.preventDefault();
    onTarget();
  }
  return (
    <div
      className={`lp-pot ${pot.stage} ${targetable && pot.stage === 'dry' ? 'targetable' : ''}`}
      onClick={onTarget}
      onDragOver={(e) => targetable && e.preventDefault()}
      onDrop={handleDrop}
      role="button"
      tabIndex={-1}
    >
      {pot.stage === 'pouring' && <span className="lp-water-splash">{'💧'}</span>}
      <svg viewBox="0 0 40 46" className="lp-pot-svg">
        <ellipse cx="20" cy="18" rx="14" ry="14" className="lp-pot-leaves" />
        <path d="M8 26 L32 26 L28 44 L12 44 Z" className="lp-pot-body" />
      </svg>
      {pot.stage === 'happy' && <span className="lp-pot-flower">{'🌼'}</span>}
      {pot.stage === 'bloomed' && <span className="lp-pot-sparkle">{'✨'}</span>}
      {pot.stage === 'bloomed' && <span className="lp-pot-flower">{'🌸'}</span>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scene 9 — the magic path morphs into a loop: Plant N <-> Iteration N.
// ---------------------------------------------------------------------------
function MappingScene({ revealed, showCode, onNext }) {
  return (
    <div className="lp-robo-story">
      <span className="lp-concept-tag">Robo and the Never-Ending Garden</span>
      <div className="lp-scene">
        <h2>Same motion, one instruction</h2>
        <p className="lp-scene-intro">Watch the spell again — but this time, notice what each watering really was.</p>
      </div>

      <div className="lp-mapping-grid">
        {BATCH.map((_, i) => (
          <div key={i} className={`lp-mapping-row ${i < revealed ? 'in' : ''}`}>
            <span className="lp-mapping-plant">{'🌼'} Plant {i + 1}</span>
            <span className="lp-mapping-arrow">{'↔'}</span>
            <span className="lp-mapping-iter">Iteration {i + 1}</span>
          </div>
        ))}
      </div>

      {showCode && (
        <div className="lp-mapping-code">
          <pre className="lp-code-block">{'for plant in garden:\n    water(plant)'}</pre>
          <p className="lp-caption-static">Each lap through the loop is one iteration — and one watered plant. Five plants, five iterations, one instruction written once.</p>
          <button className="lp-mini-btn lp-cta" onClick={onNext}>Claim your reward {'🏆'}</button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Final beat — confetti, colorful garden, Golden Sunflower Seed.
// ---------------------------------------------------------------------------
function RewardScene({ onNext }) {
  const confetti = useMemo(() => [...Array(28)].map((_, i) => ({
    id: i,
    left: (i * 37) % 100,
    delay: (i % 10) * 0.18,
    emoji: ['🎉', '✨', '🌟', '🌸'][i % 4]
  })), []);

  return (
    <div className="lp-robo-story">
      <span className="lp-concept-tag">Robo and the Never-Ending Garden</span>

      <div className="lp-garden lp-garden-sky lp-sky-bright lp-reward-garden">
        <div className="lp-confetti-layer" aria-hidden="true">
          {confetti.map((c) => (
            <span key={c.id} className="lp-confetti-piece" style={{ left: `${c.left}%`, animationDelay: `${c.delay}s` }}>{c.emoji}</span>
          ))}
        </div>
        <div className="lp-garden-row">
          {[...BATCH, ...BATCH].slice(0, 8).map((_, i) => (
            <span key={i} className="lp-pot bloomed">
              <svg viewBox="0 0 40 46" className="lp-pot-svg">
                <ellipse cx="20" cy="18" rx="14" ry="14" className="lp-pot-leaves" />
                <path d="M8 26 L32 26 L28 44 L12 44 Z" className="lp-pot-body" />
              </svg>
              <span className="lp-pot-flower">{'🌸'}</span>
            </span>
          ))}
        </div>
        <div className="lp-grass" />
        <div className="lp-reward-toast lp-reward-toast-final">
          <span className="lp-reward-icon">{'🏆'}</span>
          <span>Golden Sunflower Seed unlocked!</span>
        </div>
      </div>

      <div className="lp-robo-caption">
        <span className="lp-speaker-tag lp-tag-robo">Robo</span>
        <p>"We did it! Every flower is blooming — and I know exactly why."</p>
      </div>

      <button className="lp-mini-btn lp-cta" onClick={onNext}>See how Python writes that spell {'→'}</button>
    </div>
  );
}
