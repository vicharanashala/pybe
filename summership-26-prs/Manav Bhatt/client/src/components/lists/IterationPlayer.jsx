import React, { useState } from 'react';
import ItemCard from './ItemCard.jsx';

/**
 * IterationPlayer — learner clicks each item in turn to "show" them at the campfire.
 * Used in Scene 10 (for-loop / iteration).
 *
 * Props:
 *   items       — array of { id, icon, label }
 *   onComplete  — called when all items have been revealed
 *   chapterColor
 */
export default function IterationPlayer({ items = [], onComplete, chapterColor = '#39d353' }) {
  const [nextIdx, setNextIdx] = useState(0);
  const [revealed, setRevealed] = useState([]);
  const [done, setDone] = useState(false);

  function handleClick() {
    if (nextIdx >= items.length) return;
    const item = items[nextIdx];
    setRevealed((prev) => [...prev, item]);
    const newIdx = nextIdx + 1;
    setNextIdx(newIdx);
    if (newIdx >= items.length) setDone(true);
  }

  const currentItem = nextIdx < items.length ? items[nextIdx] : null;

  return (
    <div className="iteration-player" style={{ '--chapter-color': chapterColor }}>
      <div className="story-challenge__question" style={{ marginBottom: '16px' }}>
        <span role="img" aria-hidden="true">🔁</span>
        <p>Click the next item to take it out and show it at the campfire.</p>
      </div>

      {/* Campfire revealed area */}
      <div className="iteration-player__campfire">
        <div className="iteration-player__campfire-label">🔥 Campfire — items shown so far:</div>
        <div className="iteration-player__revealed">
          {revealed.length === 0 ? (
            <div className="iteration-player__empty">Nothing yet…</div>
          ) : (
            revealed.map((item, i) => (
              <div key={item.id} className="iteration-player__revealed-row">
                <span className="iteration-player__step" style={{ color: chapterColor }}>
                  step {i + 1}
                </span>
                <ItemCard item={item} chapterColor={chapterColor} variant="adding" />
                <span className="iteration-player__code" style={{ color: chapterColor }}>
                  <code>item = "{item.label}"</code>
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Click area — shows next item */}
      {!done && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            className="iteration-player__next-btn"
            onClick={handleClick}
            style={{ borderColor: chapterColor, color: chapterColor }}
          >
            <span className="iteration-player__next-icon" role="img" aria-hidden="true">
              {currentItem?.icon}
            </span>
            <span>Show <strong>{currentItem?.label}</strong> →</span>
          </button>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onComplete && onComplete()}
            >
              Skip to next step →
            </button>
          </div>
        </div>
      )}

      {/* Done — reveal Python loop */}
      {done && (
        <>
          <div className="feedback-banner success" style={{ marginTop: '16px' }}>
            <span className="feedback-icon">🔥</span>
            <div className="feedback-text">
              <strong>All items shown!</strong> You just showed every item in your bag from first to last.
            </div>
          </div>
          <div className="scene-observation-card" style={{ borderColor: `${chapterColor}44`, marginTop: '16px' }}>
            <div className="scene-observation-card__icon" role="img" aria-hidden="true">💡</div>
            <div>
              <strong>The Lesson:</strong>
              <p style={{ margin: '4px 0 0', color: 'var(--text-primary)' }}>
                Because all your items are in a line, you can go through them one by one from start to finish without missing a single thing!
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onComplete && onComplete()}
              style={{ background: `linear-gradient(135deg, ${chapterColor}, rgba(255,255,255,0.2))` }}
            >
              Continue →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
