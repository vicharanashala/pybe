import React, { useRef } from 'react';
import BlankFill from './BlankFill';
import { isComplete } from '../engine/blanks';

// The code challenge: the editor, the run button, the hint ladder, and the
// verdict. This component decides nothing about correctness — it displays the
// result the mission's validator produced from a real Python run.
//
// Two ways in, one way of being judged. "Fill in the blanks" gives the program's
// shape and asks which snippet belongs in each gap; "Write it yourself" is the
// free editor. Both assemble real Python that runs through the same harness and
// validator, so neither route is graded more leniently than the other.

const INDENT = '    ';

export default function CodeChallenge({
  mission,
  mode,
  onModeChange,
  selections,
  onSelect,
  draft,
  onDraftChange,
  onRun,
  onReset,
  onContinue,
  running,
  status,
  statusDetail,
  result,
  runtimeError,
  output,
  hintsRevealed,
  onRevealHint,
}) {
  const textareaRef = useRef(null);

  // Python is indentation-sensitive, so Tab has to indent rather than move focus.
  // Escape blurs the field, which keeps a keyboard-only path out of the editor.
  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      textareaRef.current?.blur();
      return;
    }
    if (event.key !== 'Tab') return;

    event.preventDefault();
    const el = event.target;
    const { selectionStart: start, selectionEnd: end, value } = el;

    if (event.shiftKey) {
      // Outdent the line the caret sits on.
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      if (value.startsWith(INDENT, lineStart)) {
        onDraftChange(value.slice(0, lineStart) + value.slice(lineStart + INDENT.length));
        requestAnimationFrame(() => {
          el.selectionStart = el.selectionEnd = Math.max(lineStart, start - INDENT.length);
        });
      }
      return;
    }

    onDraftChange(value.slice(0, start) + INDENT + value.slice(end));
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + INDENT.length;
    });
  }

  const nextHintIndex = hintsRevealed;
  const hasMoreHints = nextHintIndex < mission.hints.length;
  const runtimeReady = status === 'ready';
  const blanksMode = mode === 'blanks' && Boolean(mission.blanks);
  // In blanks mode there is nothing meaningful to run until every gap is chosen:
  // an empty slot would fail for a reason that says nothing about understanding.
  const blanksReady = !blanksMode || isComplete(mission.blanks.template, selections);
  const runLabel = running
    ? 'Running your code…'
    : status === 'loading'
      ? 'Starting Python…'
      : 'Run code';

  return (
    <section className="pf-challenge" aria-labelledby="pf-challenge-heading">
      <div className="pf-challenge-head">
        <p className="pf-eyebrow">Mission · {mission.concept}</p>
        <h2 id="pf-challenge-heading">{mission.title}</h2>
        <p className="pf-challenge-objective">{mission.objective}</p>
      </div>

      {mission.blanks && (
        <div className="pf-mode-switch" role="group" aria-label="How you want to write the code">
          <button
            type="button"
            className={`pf-btn pf-btn-chip${blanksMode ? ' is-active' : ''}`}
            aria-pressed={blanksMode}
            onClick={() => onModeChange('blanks')}
          >
            <span aria-hidden="true">🧩</span> Fill in the blanks
          </button>
          <button
            type="button"
            className={`pf-btn pf-btn-chip${blanksMode ? '' : ' is-active'}`}
            aria-pressed={!blanksMode}
            onClick={() => onModeChange('write')}
          >
            <span aria-hidden="true">⌨</span> Write it yourself
          </button>
        </div>
      )}

      {blanksMode ? (
        <BlankFill
          blanks={mission.blanks}
          selections={selections}
          onSelect={onSelect}
          disabled={running}
        />
      ) : (
        <div className="pf-editor-wrap">
          <div className="pf-editor-bar">
            <span className="pf-editor-file">farm.py</span>
            <span className="pf-editor-tip">Tab indents · Shift+Tab outdents · Esc leaves the editor</span>
          </div>
          <label className="pf-sr-only" htmlFor="pf-editor">
            Python code for the mission: {mission.title}
          </label>
          <textarea
            id="pf-editor"
            ref={textareaRef}
            className="pf-editor"
            value={draft}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            rows={9}
            onKeyDown={handleKeyDown}
            onChange={(event) => onDraftChange(event.target.value)}
          />
        </div>
      )}

      <div className="pf-challenge-actions">
        <button
          type="button"
          className="pf-btn pf-btn-primary"
          onClick={onRun}
          disabled={running || !runtimeReady || !blanksReady}
        >
          <span aria-hidden="true">▶</span> {runLabel}
        </button>

        {hasMoreHints ? (
          <button type="button" className="pf-btn pf-btn-ghost" onClick={onRevealHint}>
            <span aria-hidden="true">💡</span> {nextHintIndex === 0 ? 'Need a hint?' : `Another hint (${nextHintIndex}/${mission.hints.length} used)`}
          </button>
        ) : (
          <span className="pf-hints-exhausted">All {mission.hints.length} hints used</span>
        )}

        <button type="button" className="pf-btn pf-btn-ghost" onClick={onReset}>
          {blanksMode ? 'Clear choices' : 'Reset code'}
        </button>
      </div>

      {/* A disabled Run button needs to say why it is disabled. */}
      {!blanksReady && (
        <p className="pf-runtime-note" role="status">
          Choose a snippet for every blank, then run it.
        </p>
      )}

      {status === 'loading' && (
        <p className="pf-runtime-note" role="status">
          Python is starting up in your browser — this happens once and takes a few seconds.
        </p>
      )}
      {status === 'error' && (
        <p className="pf-feedback pf-feedback-error" role="alert">
          <span aria-hidden="true">⚠</span>
          <span>Python could not start. {statusDetail}</span>
        </p>
      )}

      {hintsRevealed > 0 && (
        <ol className="pf-hints">
          {mission.hints.slice(0, hintsRevealed).map((hint, i) => (
            <li key={hint}>
              <span className="pf-hint-index">Hint {i + 1}</span>
              {hint}
            </li>
          ))}
        </ol>
      )}

      {/* Verdicts are announced, and always carry an icon and a word — never
          colour on its own. */}
      <div className="pf-feedback-region" aria-live="polite">
        {runtimeError && (
          <p className="pf-feedback pf-feedback-error">
            <span aria-hidden="true">⚠</span>
            <span>{runtimeError}</span>
          </p>
        )}

        {result && (
          <div className={`pf-feedback ${result.passed ? 'pf-feedback-pass' : 'pf-feedback-fail'}`}>
            <span aria-hidden="true">{result.passed ? '✔' : result.kind === 'error' ? '⚠' : '✖'}</span>
            <div>
              <strong>{result.passed ? 'Mission passed' : result.kind === 'error' ? "Python could not run that" : 'Not yet'}</strong>
              <p>{result.message}</p>
              {result.note && <p className="pf-feedback-note">{result.note}</p>}
            </div>
          </div>
        )}

        {/* Chapter 2 ran the code on two different mornings. Showing both makes it
            clear the pass came from behaviour, not from a lucky guess. */}
        {result?.outcomes && (
          <ul className="pf-outcomes">
            {result.outcomes.map((outcome) => {
              const scenario = mission.scenarios.find((s) => s.id === outcome.scenarioId);
              return (
                <li key={outcome.scenarioId} className="pf-outcome">
                  <span className="pf-outcome-icon" aria-hidden="true">{scenario?.icon}</span>
                  <span className="pf-outcome-label">{scenario?.label}</span>
                  <span className="pf-outcome-result">
                    {outcome.watered ? 'Crops watered' : 'Tank left alone'} · water {outcome.water}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {output && (
          <details className="pf-output">
            <summary>What your code printed</summary>
            <pre>{output}</pre>
          </details>
        )}
      </div>

      {result?.passed && (
        <button type="button" className="pf-btn pf-btn-primary pf-btn-continue" onClick={onContinue}>
          Collect your reward <span aria-hidden="true">→</span>
        </button>
      )}
    </section>
  );
}
