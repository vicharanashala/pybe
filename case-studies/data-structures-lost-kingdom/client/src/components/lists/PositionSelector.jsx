import React, { useState } from 'react';
import ItemCard from './ItemCard.jsx';

/**
 * PositionSelector — items in a row with clear, friendly position numbers.
 * Used in Scene 6 (Steps from the Opening).
 *
 * Designed so the user is NEVER stuck:
 * - Natural position (1st, 2nd) and steps from opening ([0], [1]) are clearly displayed.
 * - Clear question asking for the highlighted item.
 * - Always provides a Next/Continue button to keep learning flowing.
 */
export default function PositionSelector({
  items = [],
  targetIndex = 1,
  onComplete,
  chapterColor = '#39d353',
}) {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong'

  const naturalLabels = ['1st item', '2nd item', '3rd item', '4th item', '5th item', '6th item'];
  const targetItem = items[targetIndex] || items[0];

  function handleSelectIndex(idx) {
    setSelected(idx);
    if (idx === targetIndex) {
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
  }

  const isAnswered = selected !== null;

  return (
    <div className="position-selector" style={{ '--chapter-color': chapterColor }}>
      {/* Explanation banner */}
      <div className="position-selector__note" style={{ borderColor: `${chapterColor}44` }}>
        <span role="img" aria-hidden="true">📏</span>
        <div>
          <strong>Counting from the opening of the bag:</strong>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
            The 1st item sits right at the opening — that is <strong>0 steps in</strong>.
            The 2nd item is <strong>1 step in</strong>, the 3rd is <strong>2 steps in</strong>, and so on.
          </p>
        </div>
      </div>

      {/* Goal callout */}
      <div style={{
        margin: '16px 0',
        padding: '12px 18px',
        borderRadius: '10px',
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${chapterColor}55`,
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{ fontSize: '1.4rem' }}>{targetItem?.icon}</span>
        <div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Mission
          </span>
          <p style={{ margin: '2px 0 0', fontWeight: 600, color: 'var(--text-primary)' }}>
            The guardian asks: <em>"How many steps from the opening is the {targetItem?.label}?"</em>
          </p>
        </div>
      </div>

      {/* Item slots with dual labels */}
      <div className="position-selector__row" style={{ marginTop: '16px' }}>
        {items.map((item, i) => {
          const isTarget = i === targetIndex;
          const isChosen = selected === i;
          let btnClass = 'position-slot__index-btn';
          if (isChosen && feedback === 'correct') btnClass += ' correct';
          else if (isChosen && feedback === 'wrong') btnClass += ' wrong';
          else if (selected !== null && isTarget) btnClass += ' correct';

          return (
            <div key={item.id} className="position-slot">
              <div className="position-slot__label position-slot__label--natural">
                {naturalLabels[i] || `${i + 1}th`}
              </div>

              <button
                className={btnClass}
                onClick={() => handleSelectIndex(i)}
                style={{
                  borderColor: isTarget && isAnswered ? chapterColor : undefined,
                  color: isTarget && isAnswered ? chapterColor : undefined,
                }}
                aria-label={`Position ${i}`}
                title={`Click to select position ${i}`}
              >
                [{i}]
              </button>

              <ItemCard
                item={item}
                chapterColor={chapterColor}
                variant={isTarget ? 'highlighted' : 'default'}
              />
            </div>
          );
        })}
      </div>

      {/* Feedback banners */}
      {feedback === 'wrong' && (
        <div className="feedback-banner error" style={{ marginTop: '16px' }}>
          <span className="feedback-icon">💡</span>
          <div className="feedback-text">
            <strong>Look closely:</strong> Position [{selected}] is the {items[selected]?.label}.
            The <em>{targetItem?.label}</em> is at position <strong>[{targetIndex}]</strong> ({targetIndex} step in from the opening).
          </div>
        </div>
      )}

      {feedback === 'correct' && (
        <div className="feedback-banner success" style={{ marginTop: '16px' }}>
          <span className="feedback-icon">🎉</span>
          <div className="feedback-text">
            <strong>Spot on!</strong> The <em>{targetItem?.label}</em> is at position <strong>[{targetIndex}]</strong> ({targetIndex} step in from the opening).
          </div>
        </div>
      )}

      {/* Observation Card */}
      {isAnswered && (
        <div className="scene-observation-card" style={{ borderColor: `${chapterColor}44`, marginTop: '16px' }}>
          <div className="scene-observation-card__icon" role="img" aria-hidden="true">💡</div>
          <div>
            <strong>The Key Lesson:</strong>
            <p style={{ margin: '4px 0 0', color: 'var(--text-primary)' }}>
              When items are lined up, we count how many steps in they are from the opening.
              Since the first item sits directly at the opening, it is <strong>0 steps in</strong>!
            </p>
          </div>
        </div>
      )}

      {/* Next/Continue button — ALWAYS rendered once answered or available as primary step action */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => onComplete && onComplete()}
          id="position-selector-continue-btn"
          style={{ background: `linear-gradient(135deg, ${chapterColor}, rgba(255,255,255,0.2))` }}
        >
          {isAnswered ? 'Continue →' : 'I Understand, Continue →'}
        </button>
      </div>
    </div>
  );
}
