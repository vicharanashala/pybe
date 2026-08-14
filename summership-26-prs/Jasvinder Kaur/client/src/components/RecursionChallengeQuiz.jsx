import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, AlertCircle, BookOpen } from 'lucide-react';
import LearningReport from './LearningReport';

const QUESTIONS = [
  {
    id:           1,
    type:         'concept',
    question:     'What is recursion in programming?',
    options:      [
      'A function that calls itself to solve a smaller sub-problem',
      'A loop that runs a fixed number of times',
      'A variable stored in the computer\'s memory',
      'A Python syntax error caused by deep nesting',
    ],
    correctIndex: 0,
    explanation:  'Recursion is a programming technique where a function calls itself with a progressively simpler version of the original problem until a stopping condition (base case) is reached.',
  },
  {
    id:           2,
    type:         'concept',
    question:     'What is the role of the base case in a recursive function?',
    options:      [
      'It speeds up execution by skipping iterations',
      'It is the stopping condition that prevents infinite recursion',
      'It stores the function\'s return value in memory',
      'It initialises local variables inside the function',
    ],
    correctIndex: 1,
    explanation:  'The base case is the condition that terminates recursion. Without it, the function would call itself indefinitely, eventually causing a RecursionError (stack overflow).',
  },
  {
    id:           3,
    type:         'concept',
    question:     'What happens if a recursive function has no base case?',
    options:      [
      'The program runs faster due to optimisation',
      'It produces incorrect but finite output',
      'Infinite recursion occurs — Python raises RecursionError',
      'The function automatically detects and stops itself',
    ],
    correctIndex: 2,
    explanation:  'Without a base case, each call creates a new stack frame indefinitely. Python enforces a default recursion limit (~1000 calls) and raises a RecursionError when it is exceeded.',
  },
  {
    id:           4,
    type:         'concept',
    question:     'Where are recursive function calls stored during execution?',
    options:      [
      'Hard disk drive (in a temporary file)',
      'GPU memory (for parallel processing)',
      'Browser cookie storage',
      'Call stack (in system RAM)',
    ],
    correctIndex: 3,
    explanation:  'Every function invocation — including recursive ones — creates a stack frame on the call stack. The stack grows with each call and unwinds (shrinks) as each call returns.',
  },
  {
    id:           5,
    type:         'code',
    question:     'What output does this program produce?',
    codeSnippet:  `def count(n):
    if n == 0:
        return
    print(n)
    count(n - 1)

count(3)`,
    options:      [
      '3  2  1',
      '1  2  3',
      'Infinite loop — no output',
      'RecursionError: maximum depth exceeded',
    ],
    correctIndex: 0,
    explanation:  'count(3) prints 3, then calls count(2) which prints 2, then count(1) prints 1, then count(0) triggers the base case and returns. Output: 3 → 2 → 1. The print statement executes before the recursive call, so values appear in descending order.',
  },
];

const LETTERS = ['A', 'B', 'C', 'D'];

export default function RecursionChallengeQuiz({ onAddXp, onNextLesson }) {
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [selected,   setSelected]     = useState(null);
  const [submitted,  setSubmitted]    = useState(false);
  const [score,      setScore]        = useState(0);
  const [completed,  setCompleted]    = useState(false);
  const [showReport, setShowReport]   = useState(false);

  const q        = QUESTIONS[currentIdx];
  const total    = QUESTIONS.length;
  const pct      = Math.round((score / total) * 100);
  const passed   = pct >= 50;

  const handleSelect = (e, idx) => {
    e.stopPropagation();
    if (submitted) return;
    setSelected(idx);
  };

  const handleSubmit = (e) => {
    e.stopPropagation();
    if (selected === null || submitted) return;
    setSubmitted(true);
    if (selected === q.correctIndex) {
      setScore(s => s + 1);
      if (onAddXp) onAddXp(20);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (currentIdx < total - 1) {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRetry = (e) => {
    e?.stopPropagation();
    setCurrentIdx(0);
    setSelected(null);
    setSubmitted(false);
    setScore(0);
    setCompleted(false);
    setShowReport(false);
  };

  /* ── Learning Report overlay ─────────────────────────────────────── */
  if (showReport) {
    return (
      <LearningReport
        score={score}
        total={total}
        onRetry={() => { handleRetry(); }}
        onClose={() => { if (passed && onNextLesson) onNextLesson(); else setShowReport(false); }}
      />
    );
  }

  /* ── Post-quiz result screen ─────────────────────────────────────── */
  if (completed) {
    return (
      <div
        className="quiz-result-panel"
        onClick={e => e.stopPropagation()}
      >
        <div className="qr-icon">
          {passed
            ? <Trophy className="w-10 h-10 text-amber-400" />
            : <AlertCircle className="w-10 h-10 text-red-400" />}
        </div>

        <div className="qr-headline">
          {passed ? '🎉 Assessment Passed' : 'Assessment Incomplete'}
        </div>

        <div className="qr-score-row">
          <div className="qr-score-chip">
            Score <strong>{score}/{total}</strong>
          </div>
          <div
            className="qr-pct-chip"
            style={{ color: passed ? '#34D399' : '#F87171' }}
          >
            {pct}%
          </div>
        </div>

        <p className="qr-verdict-text">
          {passed
            ? 'You have demonstrated a solid understanding of Python recursion fundamentals.'
            : 'Score below 50%. Review the lesson material and retry the assessment.'}
        </p>

        <div className="qr-actions">
          {!passed && (
            <button className="qr-btn-secondary" onClick={handleRetry}>
              <RotateCcw className="w-4 h-4" />
              Retry Quiz
            </button>
          )}
          <button className="qr-btn-primary" onClick={() => setShowReport(true)}>
            <BookOpen className="w-4 h-4" />
            View Learning Report
          </button>
        </div>
      </div>
    );
  }

  /* ── Active question view ────────────────────────────────────────── */
  return (
    <div
      className="quiz-chamber"
      onClick={e => e.stopPropagation()}
    >
      {/* Header */}
      <div className="quiz-header">
        <div className="flex items-center gap-2.5">
          <div className="quiz-icon-wrap">
            <Trophy className="w-4.5 h-4.5 text-amber-300" />
          </div>
          <div>
            <h3 className="quiz-heading">Recursion Assessment</h3>
            <p className="quiz-subheading">Conceptual Evaluation · PyBe Module 1</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="quiz-score-badge">Score: {score}/{total}</span>
          <span className="quiz-progress-badge">Q{currentIdx + 1}/{total}</span>
        </div>
      </div>

      {/* Progress track */}
      <div className="quiz-progress-track">
        <div
          className="quiz-progress-fill"
          style={{ width: `${((currentIdx + (submitted ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      {/* Question card */}
      <div className="quiz-question-card">
        {q.type === 'code' && (
          <div className="quiz-question-type-badge">
            <BookOpen className="w-3 h-3" />
            Code Tracing Question
          </div>
        )}
        <p className="quiz-question-text">{q.question}</p>

        {/* Code snippet for code-type questions */}
        {q.codeSnippet && (
          <pre className="quiz-code-block">{q.codeSnippet}</pre>
        )}
      </div>

      {/* Options */}
      <div className="quiz-options-grid">
        {q.options.map((opt, idx) => {
          let cls = 'quiz-option';
          if (submitted) {
            if (idx === q.correctIndex)            cls += ' quiz-option--correct';
            else if (idx === selected)             cls += ' quiz-option--wrong';
            else                                   cls += ' quiz-option--dim';
          } else if (selected === idx) {
            cls += ' quiz-option--selected';
          }
          return (
            <button
              key={idx}
              className={cls}
              onClick={e => handleSelect(e, idx)}
              disabled={submitted}
            >
              <span className="quiz-option-letter">{LETTERS[idx]}</span>
              <span className="quiz-option-text">{opt}</span>
              {submitted && idx === q.correctIndex && <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 ml-auto" />}
              {submitted && idx === selected && idx !== q.correctIndex && <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-auto" />}
            </button>
          );
        })}
      </div>

      {/* Per-question feedback + explanation */}
      {submitted && (
        <div className={`quiz-feedback ${selected === q.correctIndex ? 'quiz-feedback--correct' : 'quiz-feedback--wrong'}`}>
          <p className="quiz-feedback-result">
            {selected === q.correctIndex ? '✓ Correct' : `✗ Incorrect · Correct answer: "${q.options[q.correctIndex]}"`}
          </p>
          <p className="quiz-feedback-explanation">{q.explanation}</p>
        </div>
      )}

      {/* Submit / Next */}
      <div className="quiz-action-row">
        {!submitted ? (
          <button
            className="quiz-submit-btn"
            onClick={handleSubmit}
            disabled={selected === null}
          >
            Submit Answer
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button className="quiz-next-btn" onClick={handleNext}>
            {currentIdx < total - 1 ? 'Next Question' : 'View Results'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
