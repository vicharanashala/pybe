import { useState } from 'react';
import { Ghost, CheckCircle2, XCircle, Zap } from 'lucide-react';

export default function BetaalRiddle({ riddle, rewardXp, onSuccess, disabled, defaultSelected = null, defaultAnswered = false, defaultFailed = false }) {
  const [selected, setSelected] = useState(defaultSelected);
  const [locked, setLocked] = useState(defaultAnswered);
  const [failed, setFailed] = useState(defaultFailed);

  function choose(index) {
    if (locked || disabled) return;
    setSelected(index);
    if (index === riddle.correctIndex) {
      setLocked(true);
      if (onSuccess) onSuccess(!failed);
    } else {
      setFailed(true);
    }
  }

  function retry() {
    setSelected(null);
    setLocked(false);
    setFailed(false);
  }

  const answered = locked;

  return (
    <section className="riddle" aria-label="Betaal's riddle">
      <div className="riddle-head">
        <div className="betaal-avatar" aria-hidden="true">
          <Ghost size={40} />
        </div>
        <div className="betaal-speech">
          <h3>Betaal asks…</h3>
          <p className="riddle-question">{riddle.question}</p>
        </div>
      </div>

      <div className="riddle-options" role="group" aria-label="Answer choices">
        {riddle.options.map((option, index) => {
          const isCorrect = index === riddle.correctIndex;
          const isChosen = selected === index;
          let className = 'riddle-option';
          if (answered && isCorrect) className += ' correct';
          else if (answered && isChosen && !isCorrect) className += ' wrong';

          return (
            <button
              key={option}
              type="button"
              className={className}
              onClick={() => choose(index)}
              disabled={answered || disabled}
              aria-pressed={isChosen}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span>{option}</span>
              {answered && isCorrect && <CheckCircle2 size={18} aria-hidden="true" />}
              {answered && isChosen && !isCorrect && <XCircle size={18} aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {!answered && failed && (
        <div className="result-banner result-fail" role="status">
          <strong>Betaal shakes his head.</strong>
          <p>{riddle.explanation} Think again and pick another choice - there is no penalty for trying.</p>
          <button type="button" className="btn btn-ghost" onClick={retry}>
            Try again
          </button>
        </div>
      )}

      {answered && (
        <div className="result-banner result-pass" role="status">
          <div className="result-icon"><Zap size={22} aria-hidden="true" /></div>
          <div>
            <strong>{failed ? 'Betaal smiles - you got it after thinking!' : 'Betaal is impressed - you solved it on the first try!'}</strong>
            <p>{riddle.explanation}</p>
            {!failed && <p className="xp-note">+{rewardXp} XP for a first-try answer.</p>}
          </div>
        </div>
      )}
    </section>
  );
}
