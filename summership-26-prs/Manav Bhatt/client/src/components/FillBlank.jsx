import React, { useState } from 'react';

/**
 * FillBlank — fill-in-the-blank activity with option buttons and instant feedback.
 *
 * Props:
 *   items          — array of { id, instruction, template, options, answer, hint }
 *   chapterColor
 *   chapterColorDim
 *   onComplete     — called when all items are answered
 */
export default function FillBlank({ items, chapterColor, chapterColorDim, onComplete }) {
  const [current, setCurrent]   = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [correct, setCorrect]   = useState(null); // true | false
  const [allResults, setAllResults] = useState([]); // track results per item

  const item = items[current];

  function handleSelect(option) {
    if (revealed) return;
    setSelected(option);
    setRevealed(true);
    setShowHint(false);
    const isCorrect = option === item.answer;
    setCorrect(isCorrect);
    setAllResults((prev) => [...prev, isCorrect]);
  }

  function handleNext() {
    if (current < items.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setRevealed(false);
      setCorrect(null);
      setShowHint(false);
    } else {
      onComplete && onComplete(allResults.filter(Boolean).length, items.length);
    }
  }

  // Render the code template replacing _____ with the selected answer or blank display
  function renderTemplate() {
    const [before, after] = item.template.split('_____');
    return (
      <span>
        {before}
        <span
          className="fill-blank-gap"
          style={{
            color: revealed
              ? correct ? 'var(--success)' : 'var(--error)'
              : chapterColor,
            borderColor: revealed
              ? correct ? 'var(--success)' : 'var(--error)'
              : chapterColor
          }}
        >
          {selected || '?????'}
        </span>
        {after}
      </span>
    );
  }

  return (
    <div
      className="activity-card"
      style={{ '--chapter-color': chapterColor, '--chapter-color-dim': chapterColorDim }}
    >
      <div className="activity-label">
        ✏️ Fill in the Blank — {current + 1} of {items.length}
      </div>

      <h3 className="activity-title">Complete the Code</h3>
      <p className="activity-instruction">{item.instruction}</p>

      {/* Code display */}
      <div className="fill-blank-display" aria-live="polite">
        {renderTemplate()}
      </div>

      {/* Options */}
      <div className="fill-options">
        {item.options.map((opt) => {
          let cls = 'fill-option';
          if (revealed) {
            if (opt === item.answer) cls += ' correct';
            else if (opt === selected) cls += ' incorrect';
          } else if (opt === selected) {
            cls += ' selected';
          }
          return (
            <button
              key={opt}
              className={cls}
              onClick={() => handleSelect(opt)}
              disabled={revealed}
              aria-pressed={selected === opt}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {revealed && (
        <div className={`feedback-banner ${correct ? 'success' : 'error'}`}>
          <span className="feedback-icon">{correct ? '🎉' : '💡'}</span>
          <div className="feedback-text">
            <strong>{correct ? 'Correct!' : 'Not quite.'}</strong>
            {!correct && (
              <span>The correct answer is <code>{item.answer}</code>. {item.hint}</span>
            )}
            {correct && item.hint && <span>{item.hint}</span>}
          </div>
        </div>
      )}

      {/* Hint (before answering) */}
      {!revealed && showHint && (
        <div className="feedback-banner hint">
          <span className="feedback-icon">💡</span>
          <div className="feedback-text">
            <strong>Hint:</strong> {item.hint}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="challenge-actions" style={{ marginTop: '20px' }}>
        {!revealed && !showHint && (
          <button className="btn btn-ghost btn-sm" onClick={() => setShowHint(true)}>
            💡 Show Hint
          </button>
        )}
        {revealed && (
          <button
            className="btn btn-primary"
            onClick={handleNext}
            style={{ background: `linear-gradient(135deg, ${chapterColor}, rgba(255,255,255,0.3))` }}
          >
            {current < items.length - 1 ? 'Next Blank →' : '✓ All Done!'}
          </button>
        )}
      </div>
    </div>
  );
}
