import React, { useState } from 'react';

const TYPE_LABEL = {
  map: 'Find it in the story',
  code: 'Read the Python',
  transfer: 'Somewhere new'
};

const TYPE_NOTE = {
  map: 'Locate the construct inside the tale you just read.',
  code: 'Match the rule to the code that expresses it.',
  transfer: 'A situation this story never mentioned. Does the idea travel?'
};

// Real-world stories are accounts, not tales; only the map note names the genre.
const REAL_TYPE_NOTE = {
  ...TYPE_NOTE,
  map: 'Locate the construct inside what you just read.'
};

export default function Quiz({ story, onSubmit, result, onRetry, onFinish }) {
  const notes = story.collection === 'real-world' ? REAL_TYPE_NOTE : TYPE_NOTE;
  const [answers, setAnswers] = useState({});
  const [sending, setSending] = useState(false);

  const answered = Object.keys(answers).length;
  const complete = answered === story.quiz.length;

  async function submit() {
    if (!complete || sending) return;
    setSending(true);
    try {
      await onSubmit(answers);
    } finally {
      setSending(false);
    }
  }

  function retry() {
    setAnswers({});
    onRetry();
  }

  const graded = result
    ? Object.fromEntries(result.results.map((item) => [item.questionId, item]))
    : null;

  return (
    <div className="sb-quiz">
      <header className="sb-quiz-head">
        <p className="sb-eyebrow">Three questions</p>
        <h2 className="sb-display sb-display-sm">{story.title}</h2>
        {!result && (
          <p className="sb-lede">
            One asks where the idea lives in the story. One asks you to read it in Python. The last
            one leaves the story behind entirely.
          </p>
        )}
      </header>

      <ol className="sb-questions">
        {story.quiz.map((question, qIndex) => {
          const mark = graded?.[question.id];
          return (
            <li key={question.id} className="sb-question">
              <p className="sb-q-type">
                <span className="sb-q-num">{qIndex + 1}</span>
                {TYPE_LABEL[question.type] || 'Question'}
                <span className="sb-q-note">{notes[question.type]}</span>
              </p>
              <p className="sb-q-text">{question.question}</p>

              <ul className="sb-options">
                {question.options.map((option) => {
                  const chosen = answers[question.id] === option.index;
                  let state = '';
                  if (mark) {
                    if (option.index === mark.correctIndex) state = ' is-correct';
                    else if (chosen) state = ' is-wrong';
                    else state = ' is-dim';
                  } else if (chosen) {
                    state = ' is-chosen';
                  }

                  // Code font only on the code question. On the others, a prose option that
                  // happened to mention len() was the only one set in code, which marked it out.
                  const isCode =
                    question.type === 'code' &&
                    (option.text.includes('\n') || /[:()\[\]"=<>]/.test(option.text));

                  return (
                    <li key={option.index}>
                      <button
                        className={`sb-option${state}`}
                        disabled={Boolean(result)}
                        onClick={() =>
                          setAnswers((current) => ({ ...current, [question.id]: option.index }))
                        }
                      >
                        {isCode ? <code>{option.text}</code> : <span>{option.text}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {mark && (
                <p className={mark.isCorrect ? 'sb-verdict is-correct' : 'sb-verdict is-wrong'}>
                  {mark.isCorrect ? mark.why : mark.why || 'Not that one.'}
                  {!mark.isCorrect && mark.correctWhy && (
                    <span className="sb-verdict-fix">{mark.correctWhy}</span>
                  )}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {!result && (
        <div className="sb-advance">
          <button className="sb-next" onClick={submit} disabled={!complete || sending}>
            {sending ? 'Checking…' : complete ? 'Check my answers' : `${answered} of ${story.quiz.length} answered`}
          </button>
        </div>
      )}

      {result && (
        <div className="sb-result">
          <p className="sb-result-score">
            <strong>
              {result.score}/{result.total}
            </strong>
            <span>
              {result.score === result.total
                ? 'All three. The idea travelled.'
                : result.transferred
                  ? 'You carried it to a new situation, which is the one that counts most.'
                  : 'Worth another read — the last question is the one to watch.'}
            </span>
          </p>
          <div className="sb-result-actions">
            <button className="sb-ghost" onClick={retry}>
              Try again
            </button>
            <button className="sb-next" onClick={onFinish}>
              Back to the stories
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
