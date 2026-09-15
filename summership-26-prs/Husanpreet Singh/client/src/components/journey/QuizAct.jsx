import React, { useRef, useState } from 'react';
import { useHasEntered, useSectionLabel } from './scrollUtils';

/* =========================================================
   Act IV — the Captain's evaluation.
   Covers both forks the journey has taught: the two-way
   if / else and the ordered if / elif / else ladder.
   ========================================================= */

const QUESTIONS = [
  {
    q: 'The soldier lands on Skull Cay and the answer to “is Jack here?” is Yes. Which block runs?',
    opts: [
      { text: 'The if block', correct: true },
      { text: 'The else block', correct: false },
      { text: 'Both blocks, in order', correct: false },
    ],
    feedback: 'Aye. The if body runs only when its condition is True — and then the else is jumped over entirely.',
  },
  {
    q: 'The island is empty. What happens to the else block?',
    opts: [
      { text: 'The program stops with an error', correct: false },
      { text: 'The if block runs anyway', correct: false },
      { text: 'The else block runs instead', correct: true },
    ],
    feedback: 'Right. else is the guaranteed fallback — with if / else exactly one of the two always runs.',
  },
  {
    q: 'Can an else sit on its own, with no if above it?',
    opts: [
      { text: "Yes — else doesn't need anything", correct: false },
      { text: 'No — else always belongs to an if above it', correct: true },
    ],
    feedback: "Correct. An alternative needs something to be an alternative to. A lone else is a SyntaxError.",
  },
  {
    q: 'The chest is buried on island 3 of 7. When the ladder reaches island 3 and it comes back True, what happens to islands 4–7?',
    opts: [
      { text: 'They are checked too, just in case', correct: false },
      { text: 'They are never checked — Python leaves the ladder', correct: true },
      { text: 'Only island 4 is checked', correct: false },
    ],
    feedback: 'Exactly. The first True wins and Python jumps past every remaining elif and the else with it.',
  },
  {
    q: 'The Commander searches all seven islands and every single condition comes back False. What runs?',
    opts: [
      { text: 'Nothing at all', correct: false },
      { text: 'The last elif block', correct: false },
      { text: 'The else block at the bottom', correct: true },
    ],
    feedback: 'Aye — that is the only time else speaks: when nothing above it was True.',
  },
  {
    q: 'What is the real difference between seven separate if statements and one if / elif chain?',
    opts: [
      { text: 'Nothing — they behave identically', correct: false },
      { text: 'Seven ifs are all tested and can all run; an elif chain tests until the first True and runs only that one', correct: true },
      { text: 'elif is just faster to type', correct: false },
    ],
    feedback:
      'That is the heart of it. Separate ifs are seven independent decisions; an elif ladder is one decision with seven possible answers.',
  },
];

export default function QuizAct({ onActive }) {
  const ref = useRef(null);
  const seen = useHasEntered(ref);
  useSectionLabel(ref, 'Act IV · Captain’s Evaluation', onActive);

  const [current, setCurrent] = useState(0);
  const [picked, setPicked] = useState(null);
  const [checked, setChecked] = useState(false);
  const [firstTry, setFirstTry] = useState(true);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[current];
  const isRight = picked !== null && q && q.opts[picked].correct;

  const submit = () => {
    if (picked === null) return;
    setChecked(true);
    if (q.opts[picked].correct && firstTry) setScore((s) => s + 1);
  };

  const next = () => {
    setChecked(false);
    setPicked(null);
    setFirstTry(true);
    if (current + 1 < QUESTIONS.length) setCurrent(current + 1);
    else setDone(true);
  };

  const retry = () => {
    setChecked(false);
    setPicked(null);
    setFirstTry(false);
  };

  const restart = () => {
    setCurrent(0);
    setPicked(null);
    setChecked(false);
    setFirstTry(true);
    setScore(0);
    setDone(false);
  };

  return (
    <section className={`jr-quiz ${seen ? 'is-in' : ''}`} ref={ref}>
      <div className="jr-quiz-inner">
        <div className="jr-act-eyebrow">Captain’s Evaluation</div>
        <h2 className="jr-quiz-title">{done ? 'Assessment Complete' : 'Knowledge Check'}</h2>

        {done ? (
          <div className="jr-quiz-card jr-quiz-done">
            <div className="jr-quiz-anchor">⚓</div>
            <div className="jr-quiz-score">
              {score} / {QUESTIONS.length} <span>first-try</span>
            </div>
            <p>
              You can read a two-way fork and an ordered ladder — which is most of what conditional
              logic ever asks of you. Scroll back up and hit either <b>re-run</b> button to watch
              the same code take the road it didn't take.
            </p>
            <button className="jr-btn jr-btn-ghost" onClick={restart} type="button">
              ↺ Take it again
            </button>
          </div>
        ) : (
          <div className="jr-quiz-card">
            <div className="jr-quiz-progress">
              {QUESTIONS.map((_, i) => (
                <i key={i} className={i < current ? 'is-done' : i === current ? 'is-now' : ''} />
              ))}
              <span>
                Question {current + 1} of {QUESTIONS.length}
              </span>
            </div>

            <h3 className="jr-quiz-q">{q.q}</h3>

            <div className="jr-quiz-opts">
              {q.opts.map((o, i) => {
                let cls = 'jr-opt';
                if (picked === i) cls += ' is-picked';
                if (checked && picked === i) cls += o.correct ? ' is-right' : ' is-wrong';
                if (checked && o.correct && picked !== i) cls += ' is-answer';
                return (
                  <button
                    key={i}
                    type="button"
                    className={cls}
                    disabled={checked}
                    onClick={() => !checked && setPicked(i)}
                  >
                    <span className="jr-opt-key">{'ABCD'[i]}</span>
                    {o.text}
                  </button>
                );
              })}
            </div>

            {!checked ? (
              <button className="jr-btn" onClick={submit} disabled={picked === null} type="button">
                Submit Answer
              </button>
            ) : (
              <div className="jr-quiz-fb">
                <div className={`jr-fb ${isRight ? 'is-right' : 'is-wrong'}`}>
                  {isRight ? '✅ ' : '❌ '}
                  {isRight ? q.feedback : 'Not quite — read the ladder again, top to bottom.'}
                </div>
                {isRight ? (
                  <button className="jr-btn" onClick={next} type="button">
                    {current + 1 === QUESTIONS.length ? 'Finish' : 'Next Question ➔'}
                  </button>
                ) : (
                  <button className="jr-btn jr-btn-ghost" onClick={retry} type="button">
                    Try Again
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
