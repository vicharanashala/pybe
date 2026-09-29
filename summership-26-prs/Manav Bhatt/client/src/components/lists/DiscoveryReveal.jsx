import React, { useState, useEffect } from 'react';

/**
 * DiscoveryReveal — the cinematic "Aha!" Scene 11.
 * Rows of the story→Python connection table animate in one by one.
 *
 * Props:
 *   onComplete  — called when learner clicks "I'm ready to practice!"
 *   chapterColor
 *   chapterGlow
 */

const CONNECTIONS = [
  { story: '🎒 The backpack itself',        python: 'A Python List',             code: null },
  { story: '📦 Items inside',               python: 'Items in the list',         code: null },
  { story: '🔲 Square bag brackets',        python: 'Square brackets  [  ]',     code: 'backpack = ["Book", "Water", "Torch"]' },
  { story: '🔢 Steps from opening (0, 1, 2)', python: 'Position number [0]',      code: 'backpack[0]  # "Book"' },
  { story: '➕ Add to the end',            python: '.append()',                 code: 'backpack.append("Compass")' },
  { story: '🗑️ Throw away an item',        python: '.remove()',                 code: 'backpack.remove("Map")' },
  { story: '🔄 Swap an item in place',      python: 'bag[1] = new_item',         code: 'backpack[1] = "Flask"' },
  { story: '📏 Count how many are inside',  python: 'len()',                     code: 'len(backpack)  # 5' },
  { story: '🔍 Check if an item is inside', python: '"item" in bag',             code: '"Torch" in backpack  # True' },
  { story: '✂️ Grab a bunch together',      python: 'Slicing  [0 : 3]',          code: 'backpack[0:3]' },
  { story: '🔁 Show every item one by one', python: 'for item in bag:',          code: 'for item in backpack:\n    print(item)' },
  { story: '🔀 Change items without a new bag', python: 'Can be changed anytime', code: null },
];

export default function DiscoveryReveal({ onComplete, chapterColor = '#39d353', chapterGlow = 'rgba(57,211,83,0.3)' }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showFinalReveal, setShowFinalReveal] = useState(false);
  const [phase, setPhase] = useState('intro'); // 'intro' | 'table' | 'final'

  // After intro is dismissed, auto-reveal rows with stagger
  useEffect(() => {
    if (phase !== 'table') return;
    if (visibleCount >= CONNECTIONS.length) {
      const t = setTimeout(() => setShowFinalReveal(true), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisibleCount((c) => c + 1), 260);
    return () => clearTimeout(t);
  }, [phase, visibleCount]);

  if (phase === 'intro') {
    return (
      <div className="discovery-intro">
        <div className="discovery-orb" style={{ background: chapterGlow }} aria-hidden="true" />
        <div className="discovery-pause-icon" aria-hidden="true">⏸️</div>
        <h2 className="discovery-headline">Wait…</h2>
        <h2 className="discovery-headline discovery-headline--accent" style={{ color: chapterColor }}>
          You Just Discovered Something Powerful!
        </h2>
        <p className="discovery-sub">
          Throughout this adventure, your backpack was doing something extraordinary.
          Let's see what you actually discovered.
        </p>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => setPhase('table')}
          style={{ background: `linear-gradient(135deg, ${chapterColor}, rgba(255,255,255,0.25))`, marginTop: '24px' }}
          id="discovery-reveal-btn"
        >
          Show me! →
        </button>
      </div>
    );
  }

  return (
    <div className="discovery-reveal" style={{ '--chapter-color': chapterColor, '--chapter-glow': chapterGlow }}>
      <div className="discovery-orb" style={{ background: chapterGlow }} aria-hidden="true" />

      <h2 className="discovery-reveal__title">
        Your Backpack <span style={{ color: chapterColor }}>= Python List</span>
      </h2>
      <p className="discovery-reveal__sub">Here is everything you discovered — and its Python name:</p>

      {/* Connection table */}
      <div className="discovery-table">
        <div className="discovery-table__header">
          <span>🎒 Backpack Story</span>
          <span>🐍 Python</span>
        </div>
        {CONNECTIONS.map((row, i) => (
          <div
            key={i}
            className={`discovery-table__row${i < visibleCount ? ' visible' : ''}`}
            style={{ transitionDelay: `${i * 40}ms` }}
          >
            <span className="discovery-table__story">{row.story}</span>
            <span className="discovery-table__python" style={{ color: chapterColor }}>
              <code>{row.python}</code>
            </span>
          </div>
        ))}
      </div>

      {/* Skip button for fast navigation */}
      {!showFinalReveal && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setVisibleCount(CONNECTIONS.length);
              setShowFinalReveal(true);
            }}
          >
            Skip Animation →
          </button>
        </div>
      )}

      {/* Final big reveal */}
      {showFinalReveal && (
        <div className="discovery-final-reveal">
          <div className="discovery-final-reveal__badge" style={{ borderColor: `${chapterColor}66` }}>
            <span className="discovery-final-reveal__snake">🐍</span>
            <span className="discovery-final-reveal__word" style={{ color: chapterColor }}>
              PYTHON LIST
            </span>
          </div>
          <div className="code-block" style={{ marginTop: '18px', boxShadow: `0 0 24px ${chapterGlow}` }}>
            <div className="code-block-header">
              <div className="code-dots">
                <div className="code-dot red"/><div className="code-dot yellow"/><div className="code-dot green"/>
              </div>
              <span className="code-lang-label">Python</span>
            </div>
            <pre style={{ margin: 0 }}>{`backpack = ["Book", "Flask", "Torch", "Food", "Compass"]
#            ↑ square brackets = List!
#              each item is separated by a comma

# You can add, remove, change, count, find, slice, and loop through a List.
# This is exactly what you did with the magical backpack!`}</pre>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '28px' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onComplete && onComplete()}
              style={{ background: `linear-gradient(135deg, ${chapterColor}, rgba(255,255,255,0.25))`, boxShadow: `0 0 24px ${chapterColor}44` }}
              id="discovery-practice-btn"
            >
              🧙‍♂️ Explorer's Codebook: Master the Code Piece by Piece →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
