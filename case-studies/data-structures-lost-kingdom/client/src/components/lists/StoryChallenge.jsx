import React, { useState } from 'react';

/**
 * StoryChallenge — 3-choice illustrated decision card for story moments.
 *
 * Props:
 *   question      — string: the story question
 *   choices       — array of { id, icon, label, correct: bool, feedback: string }
 *   revealCode    — code string shown after correct answer (e.g. 'backpack.append("Compass")')
 *   revealLabel   — label for the code reveal (e.g. "In Python, this is called append()")
 *   onComplete    — called after learner answers (correct: bool)
 *   chapterColor
 *   chapterGlow
 */
export default function StoryChallenge({
  question,
  choices = [],
  revealCode,
  revealLabel,
  insight,
  onChoiceSelected,
  onComplete,
  chapterColor = '#39d353',
  chapterGlow  = 'rgba(57,211,83,0.3)',
}) {
  const [chosen, setChosen]   = useState(null);
  const [revealed, setRevealed] = useState(false);

  function handleChoose(choice) {
    if (revealed) return;
    setChosen(choice);
    setRevealed(true);
    if (onChoiceSelected) onChoiceSelected(choice);
  }

  const isCorrect = chosen?.correct;

  return (
    <div className="story-challenge" style={{ '--chapter-color': chapterColor }}>
      {/* Question */}
      <div className="story-challenge__question">
        <span className="story-challenge__icon" role="img" aria-hidden="true">🤔</span>
        <p>{question}</p>
      </div>

      {/* Choice buttons */}
      <div className="story-challenge__choices">
        {choices.map((choice) => {
          let cls = 'story-choice-btn';
          if (revealed) {
            if (choice.correct)          cls += ' story-choice-btn--correct';
            else if (choice.id === chosen?.id) cls += ' story-choice-btn--incorrect';
            else                          cls += ' story-choice-btn--dimmed';
          }
          return (
            <button
              key={choice.id}
              className={cls}
              onClick={() => handleChoose(choice)}
              disabled={revealed}
              style={{ '--card-accent': chapterColor }}
              aria-pressed={chosen?.id === choice.id}
            >
              <span className="story-choice-btn__icon" role="img" aria-hidden="true">
                {choice.icon}
              </span>
              <span className="story-choice-btn__label">{choice.label}</span>
              {revealed && choice.correct && (
                <span className="story-choice-btn__badge">✓</span>
              )}
              {revealed && choice.id === chosen?.id && !choice.correct && (
                <span className="story-choice-btn__badge story-choice-btn__badge--wrong">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {revealed && (
        <div className={`feedback-banner ${isCorrect ? 'success' : 'error'}`} style={{ marginTop: '16px' }}>
          <span className="feedback-icon">{isCorrect ? '🎉' : '💡'}</span>
          <div className="feedback-text">
            <strong>{isCorrect ? 'Exactly right!' : 'Not quite — but here is the answer!'}</strong>
            <span> {chosen.feedback}</span>
          </div>
        </div>
      )}

      {/* Python reveal */}
      {revealed && revealCode && (
        <div className="story-challenge__reveal" style={{ borderColor: `${chapterColor}44` }}>
          <div className="story-challenge__reveal-label">
            <span className="story-challenge__reveal-snake">🐍</span>
            {revealLabel}
          </div>
          <div className="code-block" style={{ marginTop: '10px' }}>
            <div className="code-block-header">
              <div className="code-dots">
                <div className="code-dot red" /><div className="code-dot yellow" /><div className="code-dot green" />
              </div>
              <span className="code-lang-label">Python</span>
            </div>
            <pre style={{ margin: 0 }}>{revealCode}</pre>
          </div>
        </div>
      )}

      {/* Conceptual Insight */}
      {revealed && insight && !revealCode && (
        <div className="scene-observation-card" style={{ borderColor: `${chapterColor}44`, marginTop: '16px' }}>
          <div className="scene-observation-card__icon" role="img" aria-hidden="true">💡</div>
          <div>
            <strong>Core Intuition:</strong>
            <p style={{ margin: '4px 0 0', color: 'var(--text-primary)' }}>{insight}</p>
          </div>
        </div>
      )}

      {/* Continue button */}
      {revealed && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => onComplete && onComplete(isCorrect)}
            style={{ background: `linear-gradient(135deg, ${chapterColor}, rgba(255,255,255,0.2))` }}
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}
