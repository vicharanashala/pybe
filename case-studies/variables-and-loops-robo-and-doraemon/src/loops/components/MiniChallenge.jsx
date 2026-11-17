import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

// A short "predict before you proceed" beat: Story -> Interaction -> Visualization ->
// Mini Challenge -> Reward -> Story Continues. Deliberately tiny (one question, one
// screen) so it never feels like a quiz — just a quick "did that click?" checkpoint.
export default function MiniChallenge({ prompt, options, explanation, rewardLabel = 'Loop Crystal', onNext, onCorrectFirstTime }) {
  const [picked, setPicked] = useState(null);
  const [everCorrect, setEverCorrect] = useState(false);

  function choose(opt) {
    if (picked?.correct) return; // locked in once right
    setPicked(opt);
    if (opt.correct && !everCorrect) {
      setEverCorrect(true);
      onCorrectFirstTime?.();
    }
  }

  return (
    <div className="lp-mini-challenge">
      <span className="lp-concept-tag">Quick check</span>
      <p className="lp-mini-challenge-prompt">{prompt}</p>

      <div className="lp-mini-challenge-options">
        {options.map((opt) => {
          const isPicked = picked === opt;
          const showState = isPicked ? (opt.correct ? 'correct' : 'wrong') : '';
          return (
            <button
              key={opt.label}
              className={`lp-mini-challenge-opt ${showState}`}
              onClick={() => choose(opt)}
              disabled={picked?.correct}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {picked && (
        <p className={`lp-mini-challenge-feedback ${picked.correct ? 'correct' : 'wrong'}`}>
          {picked.correct ? explanation : (picked.hint || 'Not quite — look again at what changes each pass, then try another option.')}
        </p>
      )}

      {everCorrect && (
        <div className="lp-reward-toast lp-reward-inline">
          <Sparkles size={16} className="lp-reward-icon" />
          <span>{rewardLabel} earned!</span>
        </div>
      )}

      {picked?.correct && (
        <button className="lp-mini-btn lp-cta" onClick={onNext}>Continue {'→'}</button>
      )}
    </div>
  );
}
