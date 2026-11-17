import { useState } from 'react';
import { PlotCanvas } from '../ui/PlotCanvas';
import { CodeReveal } from '../ui/CodeReveal';
import { MAX_MISTAKES } from '../../data/story';
import { shuffle } from '../../lib/shuffle';
import presenterImage from '../../images/presenter.webp';

// Remounted for every question (see key= in App.jsx), so state resets by itself.
export function PlotChallenge({ plot, plots, dataset, position, total, mistakesLeft, onCorrect, onWrong, onBreak }) {
  const [selected, setSelected] = useState('');
  const [tried, setTried] = useState([]);
  const [codeOpen, setCodeOpen] = useState(false);
  const [options] = useState(() => shuffle(plots));   // option order is independent of question order

  const chosen = plots.find((p) => p.id === selected);
  const isCorrect = selected === plot.id;
  const isWrong = Boolean(selected) && !isCorrect;
  const broken = isWrong && mistakesLeft === 0;

  const choose = (id) => {
    if (isCorrect || broken || tried.includes(id)) return;
    setSelected(id);
    if (id !== plot.id) { setTried([...tried, id]); onWrong(); }
  };

  return (
    <section className="plot-scene scene-in">
      <div className="challenge-copy">
        <div>
          <span className="eyebrow">VISUAL QUESTION {position} / {total}</span>
          <h1>{plot.question}</h1>
        </div>
        <div>
          <p>Choose the clearest lens for this investor question.</p>
          {MAX_MISTAKES > 1 && <small className="patience">Investor patience {'●'.repeat(mistakesLeft)}{'○'.repeat(MAX_MISTAKES - mistakesLeft)}</small>}
        </div>
      </div>

      <div className="plot-stage">
        <PlotCanvas plot={plot} chosen={chosen} dataset={dataset} />
        <aside className="pitch-presenter" aria-label="NovaTech investor presentation">
          {isCorrect && <div className="pitch-bubble" aria-live="polite"><span className="eyebrow">NOVATECH INVESTOR PITCH</span><p>{plot.pitch}</p></div>}
          {isWrong && <div className="pitch-bubble bad" aria-live="polite"><span className="eyebrow">INVESTOR</span><p>Hmm. I am not sure what I am supposed to take away from this chart.</p></div>}
          <img src={presenterImage} alt="NovaTech employee presenting to investors" />
        </aside>
      </div>

      <div className="plot-options">
        {options.map((option) => {
          const picked = selected === option.id;
          const state = picked ? (isCorrect ? 'Right lens' : 'Not this one') : tried.includes(option.id) ? 'Tried' : 'select';
          return (
            <button
              key={option.id}
              className={`plot-option${picked ? ` chosen${isCorrect ? '' : ' bad'}` : ''}`}
              disabled={(isCorrect && !picked) || (broken && !picked) || tried.includes(option.id)}
              onClick={() => choose(option.id)}
            >
              <span>{option.icon}</span>{option.label}<small>{state}</small>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className={isCorrect ? 'feedback good' : 'feedback'} aria-live="polite">
          {isCorrect ? (
            <>
              <strong>✓ That is the signal.</strong>
              <p>{plot.why}</p>
              <CodeReveal plot={plot} visible={codeOpen} onToggle={() => setCodeOpen(!codeOpen)} onContinue={onCorrect} isLast={position === total} />
            </>
          ) : (
            <>
              <strong>Not quite yet.</strong>
              <p>{chosen.label} is built for {chosen.bestFor}. {chosen.weakness}</p>
              {broken
                ? <button className="secondary" onClick={() => onBreak(selected)}>The investors stand up <span>→</span></button>
                : <p className="muted">Investor patience left: {mistakesLeft}. Pick another chart.</p>}
            </>
          )}
        </div>
      )}
    </section>
  );
}
