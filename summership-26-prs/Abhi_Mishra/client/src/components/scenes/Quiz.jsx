import { useState } from 'react';
import { shuffle } from '../../lib/shuffle';

export function Quiz({ questions, onAnswer, onDone }) {
  const [items] = useState(() => shuffle(questions).map((q) => ({ ...q, options: shuffle(q.options) })));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState('');
  const question = items[index];
  const last = index === items.length - 1;

  const select = (option) => {
    if (picked) return;
    setPicked(option);
    onAnswer?.(option === question.answer, question.topic);
  };
  const next = () => { if (last) onDone(); else { setIndex(index + 1); setPicked(''); } };

  return (
    <section className="quiz-scene scene-in">
      <div className="quiz-intro">
        <span className="eyebrow">THE LAST QUESTION / {index + 1} OF {items.length}</span>
        <h1>Can you keep the story clear?</h1>
        <p>Trust the business question, then choose the visual language that answers it.</p>
      </div>
      <div className="quiz-card">
        <div className="quiz-progress"><i style={{ width: `${((index + 1) / items.length) * 100}%` }} /></div>
        <h2>{question.q}</h2>
        <div className="answer-grid">
          {question.options.map((option) => (
            <button
              key={option}
              className={picked === option ? (option === question.answer ? 'answer correct' : 'answer wrong') : 'answer'}
              onClick={() => select(option)}
            >
              {option}<span>{picked === option ? (option === question.answer ? '✓' : '×') : '↗'}</span>
            </button>
          ))}
        </div>
        {picked && (
          <div className="quiz-feedback">
            <div>
              <b>{picked === question.answer ? 'Exactly.' : `The clearer answer is ${question.answer}.`}</b>
              {question.tip && <p className="quiz-tip">{question.tip}</p>}
            </div>
            <button className="secondary" onClick={next}>{last ? 'See my mastery' : 'Next question →'}</button>
          </div>
        )}
      </div>
    </section>
  );
}
