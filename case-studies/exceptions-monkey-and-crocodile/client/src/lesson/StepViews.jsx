import React, { useState } from 'react';
import { CT_SUBSTEP_LABELS } from './lessonData.js';

// ─── Shared bits ──────────────────────────────────────────────────────────────
function Eyebrow({ text }) {
  return <span className="pb-eyebrow">{text}</span>;
}

function Paragraphs({ paragraphs, box }) {
  const items = (paragraphs || []).map((p, i) => (
    <p key={i} style={i === paragraphs.length - 1 ? { marginBottom: 0 } : undefined}>{p}</p>
  ));
  if (box) return <div className="pb-text">{items}</div>;
  return <>{items}</>;
}

function CTSubticks({ activeIndex }) {
  return (
    <div className="pb-cticks">
      {CT_SUBSTEP_LABELS.map((label, i) => (
        <div
          key={label}
          className={
            'pb-ctick' +
            (i === activeIndex ? ' pb-ctick--live' : i < activeIndex ? ' pb-ctick--done' : '')
          }
        >
          {label}
        </div>
      ))}
    </div>
  );
}

// ─── Story ────────────────────────────────────────────────────────────────────
export function StoryView({ step }) {
  return (
    <>
      <Eyebrow text={step.eyebrow} />
      <h2>{step.title}</h2>
      <Paragraphs paragraphs={step.paragraphs} box />
    </>
  );
}

// ─── Question ─────────────────────────────────────────────────────────────────
export function QuestionView({ step, saved, onAnswer }) {
  const feedback = saved !== undefined;
  const isCorrect = saved === step.correctIndex;

  return (
    <>
      <Eyebrow text={step.eyebrow} />
      <h2>{step.title}</h2>
      <div className="pb-qblock">
        <h3>{step.prompt}</h3>
        <div className="pb-opts">
          {step.options.map((optionText, index) => (
            <button
              key={index}
              type="button"
              className={
                'pb-opt' +
                (feedback && index === step.correctIndex ? ' pb-opt--ok' : '') +
                (feedback && saved === index && !isCorrect ? ' pb-opt--bad' : '')
              }
              disabled={feedback}
              onClick={() => onAnswer(index)}
            >
              {optionText}
            </button>
          ))}
        </div>
        {feedback && (
          <div>
            <div className={'pb-badge ' + (isCorrect ? 'pb-badge--ok' : 'pb-badge--bad')}>
              {isCorrect ? '✓ Correct' : '✗ Not quite'}
            </div>
            <p>{isCorrect ? step.explanation : (step.wrongExplanations && step.wrongExplanations[saved]) || 'Not quite. Think about what the wife\'s demand actually created in the story.'}</p>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Mapping Visual ───────────────────────────────────────────────────────────
export function MappingVisualView({ step }) {
  return (
    <>
      <Eyebrow text={step.eyebrow} />
      <CTSubticks activeIndex={step.ctIndex} />
      <h2>{step.title}</h2>
      <Paragraphs paragraphs={step.paragraphs} />
      <div className="pb-mini pb-map">
        {step.pairs.map((pair, i) => (
          <div key={i} className="pb-mrow" style={{ animationDelay: (i * 0.25) + 's' }}>
            <span className="pb-mkey">{pair.key}</span>
            <span className="pb-marrow">→</span>
            <span className="pb-mval">{pair.value}</span>
          </div>
        ))}
      </div>
      {step.closingLine && (
        <p style={{ fontStyle: 'italic', marginTop: '12px' }}>{step.closingLine}</p>
      )}
    </>
  );
}

// ─── Discovery ────────────────────────────────────────────────────────────────
export function DiscoveryView({ step, saved, onAnswer }) {
  const answers = saved || {};

  return (
    <>
      <Eyebrow text={step.eyebrow} />
      <CTSubticks activeIndex={step.ctIndex} />
      <h2>{step.title}</h2>
      {step.intro && <p>{step.intro}</p>}
      {step.questions.map((q) => {
        const previousAnswer = answers[q.id];
        return (
          <div key={q.id} className="pb-mini pb-dblock">
            <h3>{q.prompt}</h3>
            <div className="pb-opts">
              {q.options.map((optionText, index) => (
                <button
                  key={index}
                  type="button"
                  className={
                    'pb-opt' +
                    (previousAnswer !== undefined && index === q.correctIndex ? ' pb-opt--ok' : '') +
                    (previousAnswer !== undefined && previousAnswer === index && index !== q.correctIndex ? ' pb-opt--bad' : '')
                  }
                  disabled={previousAnswer !== undefined}
                  onClick={() => onAnswer(q.id, index)}
                >
                  {optionText}
                </button>
              ))}
            </div>
            {previousAnswer !== undefined && (
              <p className="pb-dfollow" style={{ display: 'block' }}>
                {previousAnswer === q.correctIndex
                  ? q.followUp
                  : (q.wrongExplanations && q.wrongExplanations[previousAnswer]) || 'Not quite. Think about how this moment fits into the story\'s sequence.'}
              </p>
            )}
          </div>
        );
      })}
    </>
  );
}

// ─── Retrieval Activity ───────────────────────────────────────────────────────
export function RetrievalView({ step, saved, onProgress }) {
  const progress = saved || { roundIndex: 0 };
  const roundIndex = progress.roundIndex || 0;
  const done = roundIndex >= step.rounds.length;
  const [lastCorrect, setLastCorrect] = useState(null);
  const [wrongFlash, setWrongFlash] = useState(null);
  const [direction, setDirection] = useState(null);

  const round = done ? null : step.rounds[roundIndex];

  const pick = (choice, index) => {
    if (choice === round.correct) {
      setLastCorrect(round.correct);
      setDirection(null);
      setTimeout(() => { setLastCorrect(null); onProgress(roundIndex + 1); }, 850);
    } else {
      setWrongFlash(index);
      setDirection(round.wrongDirection || 'Not quite. Think about what this story moment represents.');
      setTimeout(() => setWrongFlash(null), 500);
    }
  };

  return (
    <>
      <Eyebrow text={step.eyebrow} />
      <CTSubticks activeIndex={step.ctIndex} />
      <h2>{step.title}</h2>
      <p>{step.instructions}</p>
      <div className="pb-mini pb-rprompt">
        {done
          ? <h3>All rounds complete!</h3>
          : <h3>Story beat: "{round.ask}" → which purpose?</h3>}
      </div>
      {!done && (
        <div className="pb-rbtns">
          {step.rightChoices.map((choice, index) => (
            <button
              key={index}
              type="button"
              className={'pb-opt' + (wrongFlash === index ? ' pb-opt--bad' : '')}
              disabled={lastCorrect !== null}
              onClick={() => pick(choice, index)}
            >
              {choice}
            </button>
          ))}
        </div>
      )}
      {done && (
        <div>
          <div className="pb-badge pb-badge--ok">✓ Retrieval Complete</div>
          <p>{step.completionLine}</p>
        </div>
      )}
      {lastCorrect !== null && !done && (
        <div>
          <div className="pb-badge pb-badge--ok">✓ {lastCorrect}</div>
        </div>
      )}
      {direction && !lastCorrect && (
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.6' }}>
          {direction}
        </p>
      )}
    </>
  );
}

// ─── Reveal ───────────────────────────────────────────────────────────────────
export function RevealView({ step }) {
  return (
    <>
      <Eyebrow text={step.eyebrow} />
      <h2>{step.title}</h2>
      <Paragraphs paragraphs={step.paragraphs} />
      <div className="pb-mini pb-map">
        {step.mapPairs.map((pair, i) => (
          <div key={i} className="pb-mrow">
            <span className="pb-mkey">{pair.key}</span>
            <span className="pb-marrow">→</span>
            <span className="pb-mval">{pair.value}</span>
          </div>
        ))}
      </div>
      <pre>{step.code}</pre>
      <div className="pb-mini pb-legend">
        {step.legendPairs.map((pair, i) => (
          <div key={i} className="pb-lrow">
            <span className="pb-lstory">{pair.story}</span>
            <span className="pb-larrow">→</span>
            <span className="pb-lpython">{pair.python}</span>
          </div>
        ))}
      </div>
      {step.closingLine && (
        <p style={{ fontStyle: 'italic', marginTop: '12px' }}>{step.closingLine}</p>
      )}
    </>
  );
}

// ─── Mental Model ─────────────────────────────────────────────────────────────
export function MentalModelView({ step }) {
  return (
    <>
      <Eyebrow text={step.eyebrow} />
      <h2>{step.title}</h2>
      <Paragraphs paragraphs={step.paragraphs} />
      {step.visualBoxes && (
        <div className="pb-mini pb-mm-grid">
          {step.visualBoxes.map((box, i) => (
            <div key={i} className={'pb-mm-box pb-mm-box--s' + (i + 1)}>
              <div className="pb-mm-box__head">
                <div className="pb-mm-label">{box.label}</div>
              </div>
              <div className="pb-mm-val">{box.value}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Python Syntax ────────────────────────────────────────────────────────────
export function SyntaxView({ step }) {
  return (
    <>
      <Eyebrow text={step.eyebrow} />
      <h2>{step.title}</h2>
      <Paragraphs paragraphs={step.paragraphs} />
      {(step.codeBlocks || []).map((block, i) => (
        <div key={i}>
          <p className="pb-syn-label">{block.label}</p>
          {block.motivation && <p className="pb-motiv">🐒 {block.motivation}</p>}
          <pre>{block.code}</pre>
        </div>
      ))}
    </>
  );
}

// ─── Assessment ───────────────────────────────────────────────────────────────
export function AssessmentView({ step, saved, onAnswer }) {
  const answers = saved || {};
  return (
    <>
      <Eyebrow text={step.eyebrow} />
      <h2>{step.title}</h2>
      {step.questions.map((question, i) => {
        const previousAnswer = answers[question.id];
        return (
          <div key={question.id} className="pb-qblock" style={{ marginBottom: '24px' }}>
            <h3>{i + 1}. {question.prompt}</h3>
            <div className="pb-opts">
              {question.options.map((optionText, index) => (
                <button
                  key={index}
                  type="button"
                  className={
                    'pb-opt' +
                    (previousAnswer !== undefined && index === question.correctIndex ? ' pb-opt--ok' : '') +
                    (previousAnswer !== undefined && previousAnswer === index && index !== question.correctIndex ? ' pb-opt--bad' : '')
                  }
                  disabled={previousAnswer !== undefined}
                  onClick={() => onAnswer(question.id, index)}
                >
                  {optionText}
                </button>
              ))}
            </div>
            {previousAnswer !== undefined && (
              <div>
                <div className={'pb-badge ' + (previousAnswer === question.correctIndex ? 'pb-badge--ok' : 'pb-badge--bad')}>
                  {previousAnswer === question.correctIndex ? '✓ Correct' : '✗ Not quite'}
                </div>
                <p>{question.explanation}</p>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

// ─── Reflection ───────────────────────────────────────────────────────────────
export function ReflectionView({ step, saved, onChange }) {
  const values = saved || {};
  return (
    <>
      <Eyebrow text={step.eyebrow} />
      <h2>{step.title}</h2>
      <Paragraphs paragraphs={step.paragraphs} />
      {step.prompts.map((promptText, i) => (
        <div key={i} className="pb-mini" style={{ marginBottom: '12px' }}>
          <h3>{promptText}</h3>
          <textarea
            className="pb-reflect"
            placeholder="Write your thoughts here..."
            value={values[i] || ''}
            onChange={(e) => onChange(i, e.target.value)}
          />
        </div>
      ))}
    </>
  );
}
