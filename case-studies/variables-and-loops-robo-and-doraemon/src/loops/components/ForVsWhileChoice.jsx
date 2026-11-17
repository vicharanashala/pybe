import React, { useEffect, useState } from 'react';
import { Sparkles, Check, X } from 'lucide-react';
import { useTypewriter } from './useTypewriter';

// ---------------------------------------------------------------------------
// "Robo's Decision" — the capstone discovery scene for the Loops module.
// Sits AFTER the existing While Loop Flowchart (and its follow-up mini
// challenge) and BEFORE the learner moves on toward the Playground. It does
// not touch the Robo Garden Story, the Magic Library / Magic Well case
// studies, the Number Line, the Flowchart, or either existing mini
// challenge — it is a purely additive scene that helps the learner answer,
// through play rather than theory, "when do I use a for loop vs. a while
// loop?"
//
// Flow: Robo Thinks -> Interactive Sort -> Feedback -> Final Discovery ->
// Robo Conclusion -> Transition into Python code (then hands control back
// to the module via onNext).
// ---------------------------------------------------------------------------

const SITUATIONS = [
  { id: 's1', emoji: '📚', text: 'Stamp 20 books', answer: 'for', explanation: 'Exactly 20 → we already know the count.' },
  { id: 's2', emoji: '🪣', text: 'Fill a bucket until it is full', answer: 'while', explanation: 'We don\u2019t know how many trips are needed.' },
  { id: 's3', emoji: '🎈', text: 'Blow balloons until you run out', answer: 'while', explanation: 'It stops on a condition, not a fixed count.' },
  { id: 's4', emoji: '🧹', text: 'Clean exactly 12 desks', answer: 'for', explanation: 'Exactly 12 → the number is set before starting.' },
  { id: 's5', emoji: '🔦', text: 'Search until you find the lost key', answer: 'while', explanation: 'We keep going only until the condition is met.' }
];

const INTRO_LINES = [
  'I\u2019ve learned two different kinds of repetition.',
  'But how do I know which one to use?',
  'Let\u2019s see if I can sort these out...'
];

const CONCLUSION_LINES = [
  'So that\u2019s the difference!',
  'If I already know how many times I\u2019ll repeat something...',
  'I\u2019ll use a FOR loop.',
  'If I only know the condition...',
  'I\u2019ll use a WHILE loop.'
];

function RoboDialogue({ lines, index, onAdvance, onDone, ctaLabel = 'Continue' }) {
  const { shown, done } = useTypewriter(lines[index], 18);
  const isLast = index === lines.length - 1;
  return (
    <div className="lp-robo-caption">
      <span className="lp-speaker-tag lp-tag-robo">Robo</span>
      <p>{shown}{!done && <span className="lp-cursor">|</span>}</p>
      {done && (
        <button
          className="lp-mini-btn lp-cta"
          onClick={isLast ? onDone : onAdvance}
        >
          {isLast ? ctaLabel : 'Continue'} {'→'}
        </button>
      )}
    </div>
  );
}

export default function ForVsWhileChoice({ onNext, onCrystal }) {
  const [phase, setPhase] = useState('intro'); // intro | sort | feedback | discovery | conclusion | transition
  const [lineIndex, setLineIndex] = useState(0);
  const [placements, setPlacements] = useState({});
  const [selected, setSelected] = useState(null);
  const [dissolved, setDissolved] = useState(false);

  const allPlaced = SITUATIONS.every((s) => placements[s.id]);
  const correctCount = SITUATIONS.filter((s) => placements[s.id] === s.answer).length;

  useEffect(() => {
    if (phase === 'transition') {
      const t = setTimeout(() => setDissolved(true), 550);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Dialogue line index is shared between the intro and conclusion beats
  // (each has its own line array) — reset it whenever a fresh dialogue beat starts.
  useEffect(() => {
    if (phase === 'intro' || phase === 'conclusion') setLineIndex(0);
  }, [phase]);

  function place(id, column) {
    setPlacements((prev) => ({ ...prev, [id]: column }));
    setSelected(null);
  }

  function handleDragStart(e, id) {
    e.dataTransfer.setData('text/plain', id);
  }

  function handleDrop(e, column) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) place(id, column);
  }

  function handleCardClick(id) {
    setSelected((prev) => (prev === id ? null : id));
  }

  function handleColumnClick(column) {
    if (selected) place(selected, column);
  }

  function checkAnswers() {
    if (correctCount === SITUATIONS.length) onCrystal?.('blue');
    setPhase('feedback');
  }

  // -------------------- Step 1: Robo Thinks --------------------
  if (phase === 'intro') {
    return (
      <div className="lp-scene lp-fw-scene">
        <span className="lp-concept-tag">Robo’s Decision</span>
        <h2>For Loop or While Loop?</h2>
        <div className="lp-fw-doors">
          <div className="lp-fw-door lp-fw-door-for">
            <span className="lp-fw-door-icon">{'📚'}</span>
            <span className="lp-fw-door-label">Magic Library</span>
          </div>
          <div className="lp-fw-robo" aria-hidden="true">{'🤖'}</div>
          <div className="lp-fw-door lp-fw-door-while">
            <span className="lp-fw-door-icon">{'🪣'}</span>
            <span className="lp-fw-door-label">Magic Well</span>
          </div>
        </div>
        <RoboDialogue
          lines={INTRO_LINES}
          index={lineIndex}
          onAdvance={() => setLineIndex((i) => i + 1)}
          onDone={() => setPhase('sort')}
          ctaLabel="Start sorting"
        />
      </div>
    );
  }

  // -------------------- Step 2: Interactive Choice --------------------
  if (phase === 'sort') {
    const unplaced = SITUATIONS.filter((s) => !placements[s.id]);
    return (
      <div className="lp-scene lp-fw-scene">
        <span className="lp-concept-tag">Robo’s Decision</span>
        <h2>Sort each situation</h2>
        <p className="lp-scene-intro">Drag each card into the loop it belongs to — or tap a card, then tap a column.</p>

        {unplaced.length > 0 && (
          <div className="lp-fw-tray">
            {unplaced.map((s) => (
              <div
                key={s.id}
                className={`lp-fw-card ${selected === s.id ? 'selected' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, s.id)}
                onClick={() => handleCardClick(s.id)}
                role="button"
                tabIndex={0}
              >
                <span className="lp-fw-card-emoji">{s.emoji}</span>
                <span className="lp-fw-card-text">{s.text}</span>
              </div>
            ))}
          </div>
        )}

        <div className="lp-fw-columns">
          <div
            className="lp-fw-column lp-fw-column-for"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 'for')}
            onClick={() => handleColumnClick('for')}
          >
            <span className="lp-fw-column-title">FOR LOOP</span>
            <div className="lp-fw-column-stack">
              {SITUATIONS.filter((s) => placements[s.id] === 'for').map((s) => (
                <div key={s.id} className="lp-fw-card lp-fw-card-placed">
                  <span className="lp-fw-card-emoji">{s.emoji}</span>
                  <span className="lp-fw-card-text">{s.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div
            className="lp-fw-column lp-fw-column-while"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 'while')}
            onClick={() => handleColumnClick('while')}
          >
            <span className="lp-fw-column-title">WHILE LOOP</span>
            <div className="lp-fw-column-stack">
              {SITUATIONS.filter((s) => placements[s.id] === 'while').map((s) => (
                <div key={s.id} className="lp-fw-card lp-fw-card-placed">
                  <span className="lp-fw-card-emoji">{s.emoji}</span>
                  <span className="lp-fw-card-text">{s.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button className="lp-mini-btn lp-cta" onClick={checkAnswers} disabled={!allPlaced}>
          {allPlaced ? 'Check my answers' : `Place all 5 (${SITUATIONS.length - unplaced.length}/${SITUATIONS.length})`} {'→'}
        </button>
      </div>
    );
  }

  // -------------------- Step 3: Feedback --------------------
  if (phase === 'feedback') {
    return (
      <div className="lp-scene lp-fw-scene">
        <span className="lp-concept-tag">Robo’s Decision</span>
        <h2>{correctCount === SITUATIONS.length ? 'Perfect sort!' : 'Here\u2019s how they line up'}</h2>

        <div className="lp-fw-columns lp-fw-columns-feedback">
          <div className="lp-fw-column lp-fw-column-for">
            <span className="lp-fw-column-title">FOR LOOP</span>
            <div className="lp-fw-column-stack">
              {SITUATIONS.filter((s) => s.answer === 'for').map((s, i) => (
                <div key={s.id} className="lp-fw-feedback-card" style={{ animationDelay: `${i * 0.12}s` }}>
                  <div className="lp-fw-card lp-fw-card-placed">
                    <span className="lp-fw-card-emoji">{s.emoji}</span>
                    <span className="lp-fw-card-text">{s.text}</span>
                    {placements[s.id] === s.answer
                      ? <Check size={16} className="lp-fw-badge lp-fw-badge-correct" />
                      : <X size={16} className="lp-fw-badge lp-fw-badge-wrong" />}
                  </div>
                  <p className="lp-fw-feedback-line">{s.explanation}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lp-fw-column lp-fw-column-while">
            <span className="lp-fw-column-title">WHILE LOOP</span>
            <div className="lp-fw-column-stack">
              {SITUATIONS.filter((s) => s.answer === 'while').map((s, i) => (
                <div key={s.id} className="lp-fw-feedback-card" style={{ animationDelay: `${i * 0.12}s` }}>
                  <div className="lp-fw-card lp-fw-card-placed">
                    <span className="lp-fw-card-emoji">{s.emoji}</span>
                    <span className="lp-fw-card-text">{s.text}</span>
                    {placements[s.id] === s.answer
                      ? <Check size={16} className="lp-fw-badge lp-fw-badge-correct" />
                      : <X size={16} className="lp-fw-badge lp-fw-badge-wrong" />}
                  </div>
                  <p className="lp-fw-feedback-line">{s.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {correctCount === SITUATIONS.length && (
          <div className="lp-reward-toast lp-reward-inline">
            <Sparkles size={16} className="lp-reward-icon" />
            <span>Loop Crystal earned!</span>
          </div>
        )}

        <button className="lp-mini-btn lp-cta" onClick={() => setPhase('discovery')}>See the big picture {'→'}</button>
      </div>
    );
  }

  // -------------------- Step 4: Final Discovery --------------------
  if (phase === 'discovery') {
    return (
      <div className="lp-scene lp-fw-scene">
        <span className="lp-concept-tag">Robo’s Decision</span>
        <h2>The rule of thumb</h2>
        <div className="lp-fw-discovery-grid">
          <div className="lp-fw-discovery-card lp-fw-discovery-for">
            <span className="lp-fw-discovery-title">FOR LOOP</span>
            <p className="lp-fw-discovery-rule"><Check size={16} /> Number of repetitions is known before starting.</p>
            <ul className="lp-fw-discovery-list">
              <li>10 books</li>
              <li>5 flowers</li>
              <li>20 students</li>
            </ul>
          </div>
          <div className="lp-fw-discovery-card lp-fw-discovery-while">
            <span className="lp-fw-discovery-title">WHILE LOOP</span>
            <p className="lp-fw-discovery-rule"><Check size={16} /> Repetitions depend on a condition.</p>
            <ul className="lp-fw-discovery-list">
              <li>Until bucket is full</li>
              <li>Until battery is charged</li>
              <li>Until key is found</li>
            </ul>
          </div>
        </div>
        <button className="lp-mini-btn lp-cta" onClick={() => setPhase('conclusion')}>Continue {'→'}</button>
      </div>
    );
  }

  // -------------------- Step 5: Robo Conclusion --------------------
  if (phase === 'conclusion') {
    return (
      <div className="lp-scene lp-fw-scene">
        <span className="lp-concept-tag">Robo’s Decision</span>
        <h2>Robo smiles</h2>
        <div className="lp-fw-robo lp-fw-robo-happy" aria-hidden="true">{'🤖'}</div>
        <RoboDialogue
          lines={CONCLUSION_LINES}
          index={lineIndex}
          onAdvance={() => setLineIndex((i) => i + 1)}
          onDone={() => setPhase('transition')}
          ctaLabel="Show me in Python"
        />
      </div>
    );
  }

  // -------------------- Step 6: Transition --------------------
  return (
    <div className="lp-scene lp-fw-scene">
      <span className="lp-concept-tag">Robo’s Decision</span>
      <h2>From idea to code</h2>
      <div className={`lp-fw-dissolve-wrap ${dissolved ? 'dissolved' : ''}`}>
        <div className="lp-fw-dissolve-cards">
          <div className="lp-fw-discovery-card lp-fw-discovery-for lp-fw-mini">
            <span className="lp-fw-discovery-title">FOR LOOP</span>
          </div>
          <div className="lp-fw-discovery-card lp-fw-discovery-while lp-fw-mini">
            <span className="lp-fw-discovery-title">WHILE LOOP</span>
          </div>
        </div>
        <div className="lp-fw-dissolve-code">
          <pre className="lp-code-block lp-code-mini">{'for i in range(20):\n    stamp(book[i])'}</pre>
          <pre className="lp-code-block lp-code-mini">{'while not bucket_full():\n    scoop()'}</pre>
        </div>
      </div>
      <p className="lp-caption-static">Now let’s write these loops in Python.</p>
      <button className="lp-mini-btn lp-cta" onClick={onNext}>Enter the Playground {'→'}</button>
    </div>
  );
}
