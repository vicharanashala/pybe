import React, { useEffect, useRef, useState } from 'react';
import MiniChallenge from './MiniChallenge';

// ---------------------------------------------------------------------------
// Case Study — “Robo and the Magic Library” (for loop discovery)
//
// Replaces the old flower-themed case study, which repeated the Robo Garden
// Story’s visuals. This one is deliberately a new setting — a library, not a
// garden — so the learner experiences a fresh scene rather than a rehash.
// It still teaches exactly one idea, purely through discovery: a for loop is
// the right tool when the number of repetitions is already known before the
// work starts. The words “for loop” never appear until the cinematic reveal
// at the very end, and the existing ForLoopNumberLine visualization (untouched)
// takes over immediately afterward.
// ---------------------------------------------------------------------------

const BOOK_COUNT = 10;
const BOOK_COLS = 5;

const INTRO_BEATS = [
  { speaker: 'narration', text: 'After helping the flowers bloom, Robo receives an invitation to the Magic Library.' },
  { speaker: 'narration', text: 'Inside, glowing books drift lazily around enormous wooden shelves, lit by warm floating lanterns.' },
  { speaker: 'librarian', text: '“Welcome, Robo. These magical books are ready to return to the library.”' },
  { speaker: 'librarian', text: '“But before they can go back, every single one must receive a Protection Stamp.”' },
  { speaker: 'librarian', text: 'A magical table shimmers into view — exactly ten glowing books, arranged neatly in two rows.' },
  { speaker: 'robo', text: '“I can already count them.”' },
  { speaker: 'librarian', text: '“Exactly. Every book needs the same magical stamp.”' }
];

const STOP_QUESTION_OPTIONS = [
  { label: 'Robo already knew there were exactly 10 books.', correct: true },
  {
    label: 'Robo waited until someone told him to stop.',
    correct: false,
    hint: 'Nobody needed to tell him anything — Robo already had a number in mind before he stamped a single book.'
  },
  {
    label: 'Robo guessed when he was finished.',
    correct: false,
    hint: 'It wasn’t a guess — Robo could see the exact count sitting on the table from the very start.'
  }
];

const REVEAL_CARDS = [
  { icon: '📚', text: 'Exactly 10 Books' },
  { icon: '🔢', text: 'Known Number of Tasks' },
  { icon: '🔁', text: 'Known Number of Repetitions' }
];

function makeBooks() {
  return Array.from({ length: BOOK_COUNT }, () => ({ stage: 'pending' }));
}

export default function ForLoopCaseStudy({ onNext }) {
  const [phase, setPhase] = useState('intro'); // 'intro' | 'library' | 'quiz' | 'reveal'
  const [beat, setBeat] = useState(0);
  const [books, setBooks] = useState(makeBooks);
  const [stampedCount, setStampedCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [revealStep, setRevealStep] = useState(0);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  function after(ms, fn) { timers.current.push(setTimeout(fn, ms)); }

  // Cinematic reveal — one card at a time, then the final badge.
  useEffect(() => {
    if (phase !== 'reveal') return;
    REVEAL_CARDS.forEach((_, i) => after((i + 1) * 850, () => setRevealStep(i + 1)));
    after((REVEAL_CARDS.length + 1) * 850, () => setRevealStep(REVEAL_CARDS.length + 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function stampNextBook() {
    if (busy) return;
    const idx = books.findIndex((b) => b.stage === 'pending');
    if (idx === -1) return;
    setBusy(true);
    setBooks((prev) => prev.map((b, i) => (i === idx ? { stage: 'stamping' } : b)));
    after(420, () => {
      setBooks((prev) => prev.map((b, i) => (i === idx ? { stage: 'sealed' } : b)));
      setStampedCount((c) => c + 1);
      setBusy(false);
    });
  }

  const allStamped = stampedCount === BOOK_COUNT;
  const nextIndex = books.findIndex((b) => b.stage === 'pending');
  const roboRow = nextIndex === -1 ? Math.floor((BOOK_COUNT - 1) / BOOK_COLS) : Math.floor(nextIndex / BOOK_COLS);
  const roboCol = nextIndex === -1 ? (BOOK_COUNT - 1) % BOOK_COLS : nextIndex % BOOK_COLS;

  // -------------------------------------------------------------- intro ---
  if (phase === 'intro') {
    const line = INTRO_BEATS[beat];
    const isLast = beat === INTRO_BEATS.length - 1;
    return (
      <div className="lp-scene lp-library-scene-wrap">
        <span className="lp-concept-tag">Case study · For loop</span>
        <h2>📚 Robo and the Magic Library</h2>

        <div className="lp-library-scene">
          <div className="lp-library-runes" aria-hidden="true">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="lp-library-rune" style={{ left: `${(i * 23) % 100}%`, animationDelay: `${i * 0.7}s` }}>
                {['✦', '📖', '✨', '🕯️'][i % 4]}
              </span>
            ))}
          </div>
          <div className="lp-library-shelves" aria-hidden="true" />
          <div className="lp-library-portrait-row">
            {line.speaker === 'librarian' && <span className="lp-library-portrait">🧙‍♀️</span>}
            {line.speaker === 'robo' && <span className="lp-library-portrait lp-library-portrait-robo">🤖</span>}
          </div>
        </div>

        <div className="lp-robo-caption lp-library-caption">
          {line.speaker !== 'narration' && (
            <span className={`lp-speaker-tag ${line.speaker === 'librarian' ? 'lp-tag-librarian' : 'lp-tag-robo'}`}>
              {line.speaker === 'librarian' ? 'Head Librarian' : 'Robo'}
            </span>
          )}
          <p>{line.text}</p>
        </div>

        <button
          className="lp-mini-btn lp-cta"
          onClick={() => (isLast ? setPhase('library') : setBeat((b) => b + 1))}
        >
          {isLast ? 'Begin stamping the books →' : 'Continue →'}
        </button>
      </div>
    );
  }

  // ------------------------------------------------------------- quiz ----
  if (phase === 'quiz') {
    return (
      <div className="lp-scene">
        <span className="lp-concept-tag">Case study · For loop</span>
        <MiniChallenge
          prompt="How did Robo know when the work would finish?"
          options={STOP_QUESTION_OPTIONS}
          explanation="Exactly — Robo could see all ten books on the table before he stamped a single one. He already knew the number of repetitions before he ever started."
          rewardLabel="Discovery Badge"
          onNext={() => setPhase('reveal')}
        />
      </div>
    );
  }

  // ------------------------------------------------------------ reveal ---
  if (phase === 'reveal') {
    const showTransition = revealStep > REVEAL_CARDS.length;
    return (
      <div className="lp-scene lp-case-reveal">
        <span className="lp-concept-tag">Case study · For loop</span>
        <h2>Known count, known repetitions</h2>

        <div className="lp-reveal-cards">
          {REVEAL_CARDS.map((card, i) => (
            <div key={card.text} className={`lp-reveal-card ${i < revealStep ? 'in' : ''}`}>
              <span className="lp-reveal-card-icon">{card.icon}</span>
              <span className="lp-reveal-card-text">{card.text}</span>
            </div>
          ))}
          {revealStep > REVEAL_CARDS.length && (
            <div className="lp-reveal-final in">
              <span className="lp-case-loop-tag lp-case-tag-for">✨ FOR LOOP ✨</span>
            </div>
          )}
        </div>

        {showTransition && (
          <div className="lp-library-transition">
            <p className="lp-scene-intro">
              Whenever you already know how many times something needs to happen, a <strong>for loop</strong> is
              the perfect tool — it repeats a fixed number of times, decided before the loop even starts.
            </p>
            <p className="lp-caption-static">Great! Now let’s see how Python performs these known repetitions internally.</p>
            <button className="lp-mini-btn lp-cta" onClick={onNext}>See how Python visualizes this →</button>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------------- library ---
  return (
    <div className="lp-scene lp-library-scene-wrap">
      <span className="lp-concept-tag">Case study · For loop</span>
      <h2>The Stamping Table</h2>
      <p className="lp-scene-intro">
        Ten glowing books rest on the table, each one identical. Robo lifts the magical stamp — every book
        needs the exact same Protection Stamp before it can return to its shelf.
      </p>

      <div className="lp-library-table">
        <div className="lp-robo-marker" style={{ left: `${(roboCol + 0.5) * (100 / BOOK_COLS)}%`, top: `${roboRow === 0 ? 6 : 56}%` }}>
          {'🤖'}
        </div>
        <div className="lp-book-grid">
          {books.map((book, i) => (
            <div key={i} className={`lp-book ${book.stage}`}>
              {book.stage === 'stamping' && <span className="lp-book-stamp-mark">🔖</span>}
              {book.stage === 'stamping' && <span className="lp-book-sparkle">✨</span>}
              <span className="lp-book-icon">📖</span>
              {book.stage === 'sealed' && <span className="lp-book-seal-glow" />}
            </div>
          ))}
        </div>
      </div>

      <div className="lp-nl-stats-row">
        <span className="lp-sync-badge">Books Completed</span>
        <span className="lp-nl-current-badge">{stampedCount} / {BOOK_COUNT}</span>
      </div>

      <div className="lp-shelf-progress" aria-hidden={stampedCount === 0}>
        {books.slice(0, stampedCount).map((_, i) => (
          <span key={i} className="lp-shelf-chip">📗</span>
        ))}
        {stampedCount === 0 && <span className="lp-nl-iteration-empty">completed shelf · empty for now</span>}
      </div>

      {!allStamped && (
        <div className="lp-playground-actions">
          <button className="lp-mini-btn" onClick={stampNextBook} disabled={busy}>✨ Stamp Next Book</button>
        </div>
      )}

      {allStamped && (
        <>
          <div className="lp-reward-toast lp-reward-inline">
            <span className="lp-reward-icon">📚</span>
            <span>All ten books are protected and shelved!</span>
          </div>
          <p className="lp-caption-static">How did Robo know exactly when the work would finish?</p>
          <button className="lp-mini-btn lp-cta" onClick={() => setPhase('quiz')}>Continue →</button>
        </>
      )}
    </div>
  );
}
