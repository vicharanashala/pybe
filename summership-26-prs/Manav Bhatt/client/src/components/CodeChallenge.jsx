import React, { useState } from 'react';

/**
 * CodeChallenge — mini coding textarea with pattern-matching answer check.
 *
 * Props:
 *   challenge — { prompt, starterCode, patterns, hint, successMessage }
 *   chapterColor
 *   chapterColorDim
 *   onComplete — called when the answer passes all patterns
 */
export default function CodeChallenge({ challenge, chapterColor, chapterColorDim, onComplete }) {
  const [code, setCode]         = useState(challenge.starterCode || '');
  const [result, setResult]     = useState(null); // null | 'pass' | 'fail'
  const [failMsg, setFailMsg]   = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hintStep, setHintStep] = useState(0);

  function checkCode() {
    // Run through every pattern. The first one that fails gives the user a hint.
    for (const p of challenge.patterns) {
      if (!p.regex.test(code)) {
        setResult('fail');
        setFailMsg(p.error);
        return;
      }
    }
    // All patterns passed!
    setResult('pass');
    setFailMsg('');
  }

  function handleKeyDown(e) {
    // Allow Tab key to indent inside the textarea
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const newCode =
        code.substring(0, selectionStart) + '    ' + code.substring(selectionEnd);
      setCode(newCode);
      // Restore cursor position after React re-render
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 4;
      });
    }
  }

  function handleReset() {
    setCode(challenge.starterCode || '');
    setResult(null);
    setFailMsg('');
    setShowHint(false);
    setHintStep(0);
  }

  return (
    <div
      className="activity-card"
      style={{ '--chapter-color': chapterColor, '--chapter-color-dim': chapterColorDim }}
    >
      <div className="activity-label">
        💻 Coding Challenge
      </div>

      <h3 className="activity-title">Write Some Python!</h3>

      {/* Challenge prompt */}
      <div className="challenge-prompt">
        {challenge.prompt}
      </div>

      {/* Code editor */}
      <div className="code-editor-wrap">
        <div className="code-editor-header">
          <span className="code-editor-title">🐍 Python</span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleReset}
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            ↺ Reset
          </button>
        </div>
        <textarea
          id="code-challenge-editor"
          className="code-editor"
          value={code}
          onChange={(e) => { setCode(e.target.value); setResult(null); setFailMsg(''); }}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          aria-label="Python code editor"
        />
      </div>

      {/* Result feedback */}
      {result === 'pass' && (
        <div className="feedback-banner success">
          <span className="feedback-icon">🎉</span>
          <div className="feedback-text">
            <strong>Excellent!</strong>
            <span> {challenge.successMessage}</span>
          </div>
        </div>
      )}
      {result === 'fail' && (
        <div className="feedback-banner error">
          <span className="feedback-icon">🔍</span>
          <div className="feedback-text">
            <strong>Almost there!</strong>
            <span> {failMsg}</span>
          </div>
        </div>
      )}

      {/* Hint */}
      {showHint && (
        <div className="feedback-banner hint">
          <span className="feedback-icon">💡</span>
          <div className="feedback-text">
            <strong>Hint:</strong> {challenge.hint}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="challenge-actions" style={{ marginTop: '16px' }}>
        <button
          className="btn btn-primary"
          onClick={checkCode}
          disabled={result === 'pass'}
          style={{
            background: result !== 'pass'
              ? `linear-gradient(135deg, ${chapterColor}, rgba(255,255,255,0.3))`
              : undefined
          }}
          id="check-code-btn"
        >
          {result === 'pass' ? '✓ Passed!' : '▶ Check My Code'}
        </button>

        {!showHint && result !== 'pass' && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowHint(true)}
          >
            💡 Hint
          </button>
        )}

        {result === 'pass' && (
          <button
            className="btn btn-gold"
            onClick={onComplete}
          >
            🏆 Complete Chapter!
          </button>
        )}
      </div>
    </div>
  );
}
