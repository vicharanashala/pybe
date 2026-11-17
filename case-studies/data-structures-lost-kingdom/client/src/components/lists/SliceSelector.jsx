import React, { useState } from 'react';
import ItemCard from './ItemCard.jsx';

/**
 * SliceSelector — visual range selector for Scene 9 (slicing).
 * Learner clicks start/end positions to select a slice of the backpack.
 *
 * Props:
 *   items           — array of { id, icon, label }
 *   targetStart     — correct start index
 *   targetEnd       — correct end index (exclusive)
 *   friendRequest   — description of what the friend needs (string)
 *   onComplete      — called when correct slice selected
 *   chapterColor
 */
export default function SliceSelector({
  items = [],
  targetStart = 0,
  targetEnd = 3,
  friendRequest,
  onComplete,
  chapterColor = '#39d353',
}) {
  const [phase, setPhase] = useState('select'); // 'select' | 'revealed'
  const [start, setStart] = useState(null);
  const [end, setEnd]     = useState(null);
  const [step, setStep]   = useState('start'); // 'start' | 'end'
  const [feedback, setFeedback] = useState(null);

  function handleItemClick(idx) {
    if (phase !== 'select') return;
    if (step === 'start') {
      setStart(idx);
      setEnd(null);
      setStep('end');
      setFeedback(null);
    } else {
      // end must be > start
      if (idx <= start) {
        setFeedback('End must come after the start!');
        return;
      }
      setEnd(idx + 1); // exclusive
      setFeedback(null);
    }
  }

  function handleCheck() {
    if (start === targetStart && end === targetEnd) {
      setPhase('revealed');
    } else {
      setFeedback(`Not quite! Try selecting from position ${targetStart} to ${targetEnd - 1}.`);
      setStart(null);
      setEnd(null);
      setStep('start');
    }
  }

  function isInRange(idx) {
    if (start === null || end === null) return false;
    return idx >= start && idx < end;
  }

  return (
    <div className="slice-selector" style={{ '--chapter-color': chapterColor }}>
      {/* Instruction */}
      <div className="story-challenge__question" style={{ marginBottom: '16px' }}>
        <span role="img" aria-hidden="true">✂️</span>
        <p>{friendRequest}</p>
      </div>

      {phase === 'select' && (
        <p className="slice-selector__hint" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>
          {step === 'start'
            ? '👆 Click the FIRST item to include in the slice'
            : `👆 Now click the LAST item to include (started at position ${start})`}
        </p>
      )}

      {/* Item row — clickable */}
      <div className="position-selector__row" style={{ marginBottom: '16px' }}>
        {items.map((item, i) => {
          const inRange = isInRange(i);
          const isStart = i === start;
          const variant = phase === 'revealed'
            ? (i >= targetStart && i < targetEnd ? 'highlighted' : 'dimmed')
            : inRange ? 'highlighted'
            : isStart && step === 'end' ? 'selected'
            : 'default';

          return (
            <div key={item.id} className="position-slot">
              <div className="position-slot__label position-slot__label--natural" style={{ color: chapterColor }}>
                [{i}]
              </div>
              <ItemCard
                item={item}
                chapterColor={chapterColor}
                variant={variant}
                onClick={phase === 'select' ? () => handleItemClick(i) : undefined}
              />
            </div>
          );
        })}
      </div>

      {/* Range indicator */}
      {start !== null && end !== null && phase === 'select' && (
        <div className="slice-selector__range" style={{ borderColor: `${chapterColor}55` }}>
          Selected: <code style={{ color: chapterColor }}>backpack[{start}:{end}]</code>
          <button
            className="btn btn-primary"
            onClick={handleCheck}
            style={{ marginLeft: '12px', background: `linear-gradient(135deg, ${chapterColor}, rgba(255,255,255,0.2))` }}
          >
            ✓ Check
          </button>
        </div>
      )}

      {feedback && (
        <div className="feedback-banner error" style={{ marginTop: '10px' }}>
          <span className="feedback-icon">💡</span>
          <div className="feedback-text">{feedback}</div>
        </div>
      )}

      {phase === 'select' && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onComplete && onComplete()}
          >
            Skip to next step →
          </button>
        </div>
      )}

      {/* Revealed state */}
      {phase === 'revealed' && (
        <>
          <div className="feedback-banner success" style={{ marginTop: '12px' }}>
            <span className="feedback-icon">✂️</span>
            <div className="feedback-text">
              <strong>Perfect slice!</strong> Your friend gets: {items.slice(targetStart, targetEnd).map(i => i.label).join(', ')}.
            </div>
          </div>
          <div className="scene-observation-card" style={{ borderColor: `${chapterColor}44`, marginTop: '16px' }}>
            <div className="scene-observation-card__icon" role="img" aria-hidden="true">💡</div>
            <div>
              <strong>The Lesson:</strong>
              <p style={{ margin: '4px 0 0', color: 'var(--text-primary)' }}>
                Because your items are lined up in order, you can easily grab a whole bunch together from start to finish in one simple move!
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
