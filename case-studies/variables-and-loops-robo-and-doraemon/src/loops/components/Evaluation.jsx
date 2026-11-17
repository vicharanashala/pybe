import React, { useState } from 'react';
import { Play, CheckCircle2, XCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { useSharedPyodide } from '../../shared/pyodide/PyodideContext';
import { EVALUATION } from '../data/evaluation';

function normalize(str) {
  return String(str ?? '').trim().replace(/\s+/g, ' ');
}

export default function Evaluation({ onComplete }) {
  const [answers, setAnswers] = useState({});
  const [graded, setGraded] = useState(null);

  function setAnswer(id, value) { setAnswers((prev) => ({ ...prev, [id]: value })); }

  function handleSubmit() {
    const results = EVALUATION.map((q) => {
      const a = answers[q.id];
      let correct = false;
      if (q.kind === 'predict-output' || q.kind === 'fill-code' || q.kind === 'trace-count') correct = normalize(a?.text) === normalize(q.expectedAnswer);
      else if (q.kind === 'debug-select') correct = a?.selectedLineIndex === q.correctLineIndex;
      else if (q.kind === 'mcq') correct = a?.selectedIndex === q.correctIndex;
      else if (q.kind === 'memory-prediction') correct = q.variables.every((v) => normalize(a?.values?.[v]) === normalize(q.expected[v]));
      else if (q.kind === 'arrange') correct = JSON.stringify(a?.order) === JSON.stringify(q.correctOrder);
      else if (q.kind === 'code-exec') correct = Boolean(a?.passed);
      return { id: q.id, correct };
    });
    setGraded(results);
  }

  const allAnswered = EVALUATION.every((q) => {
    const a = answers[q.id];
    if (!a) return false;
    if (q.kind === 'predict-output' || q.kind === 'fill-code' || q.kind === 'trace-count') return Boolean(a.text?.trim());
    if (q.kind === 'debug-select') return a.selectedLineIndex !== undefined;
    if (q.kind === 'mcq') return a.selectedIndex !== undefined;
    if (q.kind === 'memory-prediction') return q.variables.every((v) => a.values?.[v]?.trim());
    if (q.kind === 'arrange') return Boolean(a.order);
    if (q.kind === 'code-exec') return a.passed !== undefined;
    return false;
  });

  if (graded) {
    const correctCount = graded.filter((g) => g.correct).length;
    return <ResultsSummary graded={graded} correctCount={correctCount} onComplete={() => onComplete(graded, correctCount)} />;
  }

  return (
    <div className="lp-scene">
      <h2>Check your understanding</h2>
      <p className="lp-scene-intro">Ten questions, mostly not multiple-choice — this checks whether the pattern actually clicked.</p>

      {EVALUATION.map((q, i) => (
        <div key={q.id} className="lp-eval-question">
          <div className="lp-quiz-prompt">
            <span className="lp-quiz-index">{i + 1}</span>
            <div>
              {q.label && <span className="lp-question-label">{q.label}</span>}
              <pre>{q.prompt}</pre>
            </div>
          </div>
          <QuestionInput question={q} answer={answers[q.id]} setAnswer={(v) => setAnswer(q.id, v)} />
        </div>
      ))}

      <button className="lp-mini-btn lp-cta" onClick={handleSubmit} disabled={!allAnswered}>Submit evaluation</button>
    </div>
  );
}

function QuestionInput({ question, answer, setAnswer }) {
  if (question.kind === 'predict-output' || question.kind === 'fill-code' || question.kind === 'trace-count') {
    return <input type="text" className="lp-text-answer" placeholder="Type your answer…" value={answer?.text || ''} onChange={(e) => setAnswer({ text: e.target.value })} />;
  }
  if (question.kind === 'mcq') {
    return (
      <div className="lp-quiz-options">
        {question.options.map((opt, i) => (
          <button key={opt} className={`lp-quiz-option ${answer?.selectedIndex === i ? 'selected' : ''}`} onClick={() => setAnswer({ selectedIndex: i })}>{opt}</button>
        ))}
      </div>
    );
  }
  if (question.kind === 'debug-select') {
    return (
      <div className="lp-code-lines">
        {question.codeLines.map((line, i) => (
          <button key={i} className={`lp-code-line ${answer?.selectedLineIndex === i ? 'selected' : ''}`} onClick={() => setAnswer({ selectedLineIndex: i })}>
            <span className="lp-code-line-number">{i + 1}</span><span>{line || ' '}</span>
          </button>
        ))}
      </div>
    );
  }
  if (question.kind === 'memory-prediction') {
    return (
      <div className="lp-memory-prediction">
        {question.variables.map((v) => (
          <label key={v}>{v}<input type="text" value={answer?.values?.[v] || ''} onChange={(e) => setAnswer({ values: { ...answer?.values, [v]: e.target.value } })} /></label>
        ))}
      </div>
    );
  }
  if (question.kind === 'arrange') return <ArrangeInput question={question} answer={answer} setAnswer={setAnswer} />;
  if (question.kind === 'code-exec') return <CodeExecInput question={question} onResult={(passed, code) => setAnswer({ passed, code })} />;
  return null;
}

function ArrangeInput({ question, answer, setAnswer }) {
  const [order, setOrder] = useState(answer?.order || question.lines.map((_, i) => i));
  function move(pos, dir) {
    const next = [...order];
    const target = pos + dir;
    if (target < 0 || target >= next.length) return;
    [next[pos], next[target]] = [next[target], next[pos]];
    setOrder(next);
    setAnswer({ order: next });
  }
  return (
    <div className="lp-arrange-list">
      {order.map((originalIndex, pos) => (
        <div key={originalIndex} className="lp-arrange-row">
          <code>{question.lines[originalIndex]}</code>
          <div className="lp-arrange-controls">
            <button className="lp-icon-btn" onClick={() => move(pos, -1)} disabled={pos === 0}><ArrowUp size={13} /></button>
            <button className="lp-icon-btn" onClick={() => move(pos, 1)} disabled={pos === order.length - 1}><ArrowDown size={13} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

function CodeExecInput({ question, onResult }) {
  const { status, running, run } = useSharedPyodide();
  const [code, setCode] = useState(question.starterCode);
  const [output, setOutput] = useState(null);
  const [passed, setPassed] = useState(null);

  async function handleRun() {
    const outcome = await run(code);
    const actual = outcome.error ? `Error: ${outcome.error}` : outcome.output.trim();
    const lines = actual.split('\n').map((l) => l.trim());
    const ok = question.expectedLines.every((n) => lines.includes(n));
    setOutput(actual);
    setPassed(ok);
    onResult(ok, code);
  }

  return (
    <div className="lp-code-exec">
      <textarea className="lp-code-editor" value={code} spellCheck={false} onChange={(e) => { setCode(e.target.value); setOutput(null); setPassed(null); }} />
      <button className="lp-chip" onClick={handleRun} disabled={status !== 'ready' || running}>
        <Play size={13} /> {running ? 'Running…' : 'Run'}
      </button>
      {output !== null && (
        <div className={`lp-breakdown-row ${passed ? 'correct' : 'incorrect'}`}>
          <span>{passed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}</span>
          <code>{question.testDescription} → {output.split('\n').join(', ')}</code>
        </div>
      )}
    </div>
  );
}

function ResultsSummary({ graded, correctCount, onComplete }) {
  return (
    <div className="lp-scene">
      <h2>Results</h2>
      <p className="lp-score-headline">{correctCount} / {graded.length} correct</p>
      <div className="lp-breakdown-list">
        {EVALUATION.map((q, i) => (
          <div key={q.id} className={`lp-breakdown-row ${graded[i].correct ? 'correct' : 'incorrect'}`}>
            <span>{graded[i].correct ? <CheckCircle2 size={16} /> : <XCircle size={16} />}</span>
            <div>
              <strong>Question {i + 1}{q.label ? ` — ${q.label}` : ''}</strong>
              <p>{q.prompt.split('\n')[0]}</p>
              {!graded[i].correct && (q.kind === 'predict-output' || q.kind === 'fill-code' || q.kind === 'trace-count') && <p>Correct answer: <strong>{q.expectedAnswer}</strong></p>}
              {!graded[i].correct && q.kind === 'debug-select' && <p>{q.explanation}</p>}
              {!graded[i].correct && q.kind === 'memory-prediction' && <p>{q.explanation}</p>}
              {!graded[i].correct && q.kind === 'mcq' && <p>Correct answer: <strong>{q.options[q.correctIndex]}</strong></p>}
            </div>
          </div>
        ))}
      </div>
      <button className="lp-mini-btn lp-cta" onClick={onComplete}>See your feedback →</button>
    </div>
  );
}
