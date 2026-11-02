import React, { useState } from 'react';
import { sound } from '../../services/soundEngine.js';

export default function Chapter4TryExcept({ chapter, onContinue }) {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [focusedLine, setFocusedLine] = useState(null);

  const variant = chapter.editableExample.variants[selectedVariant];
  const isInvalid = variant.input === '"nine"' || variant.input === '""';

  return (
    <section className="screen screen-concept" aria-labelledby="chapter4-heading">
      <div className="pybe-single-column">
        <header className="pybe-header-centered">
          <h2 id="chapter4-heading" className="pybe-story-title">
            What are try and except?
          </h2>
          <p className="pybe-lead">
            Python combines the risky task and the safety shield into a <code>try / except</code> block.
          </p>
        </header>

        {/* Concept Explanation Card (PyBe style) */}
        <div className="pybe-card pybe-explain-card">
          <div className="explain-role-row">
            <strong className="role-keyword">try:</strong>
            <span className="role-desc">Attempt the task that might fail (e.g. converting user input).</span>
          </div>
          <div className="explain-role-row">
            <strong className="role-keyword">except:</strong>
            <span className="role-desc">If that specific error happens, jump here and handle it smoothly.</span>
          </div>
        </div>

        {/* Interactive Code Stepper */}
        <div className="pybe-card pybe-stepper-card">
          <div className="code-header-bar">
            <span className="code-filename">handled_countdown.py</span>
            <span className="code-badge">Click lines to inspect</span>
          </div>

          <div className="pybe-code-lines" role="list">
            {chapter.codeLines.map((line) => {
              const isHovered = focusedLine === line.lineNum;
              let currentStatus = line.status;
              if (!isInvalid) {
                if (line.lineNum === 2) currentStatus = 'normal';
                if (line.lineNum === 3) currentStatus = 'handled';
                if (line.lineNum === 4 || line.lineNum === 5) currentStatus = 'skipped';
              }

              return (
                <div
                  key={line.lineNum}
                  className={`pybe-line-row line-status-${currentStatus} ${isHovered ? 'line-active' : ''}`}
                  onClick={() => {
                    sound.playClick();
                    setFocusedLine(line.lineNum);
                  }}
                  role="listitem"
                >
                  <span className="line-num">{line.lineNum}</span>
                  <pre className="line-code">
                    {line.lineNum === 2
                      ? `    days = int(${variant.input})`
                      : line.code}
                  </pre>
                  <span className={`line-status-tag tag-${currentStatus}`}>
                    {currentStatus === 'raises' && '💥 Raises'}
                    {currentStatus === 'handled' && '▶ Runs'}
                    {currentStatus === 'skipped' && '⏭ Skipped'}
                    {currentStatus === 'normal' && '✓ Normal'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Line Explainer Box */}
          <div className="pybe-line-detail">
            <strong>
              {focusedLine
                ? `Line ${focusedLine} Breakdown:`
                : 'Click any line above to inspect Python\'s execution step:'}
            </strong>
            <p>
              {focusedLine
                ? chapter.codeLines.find((l) => l.lineNum === focusedLine)?.explain
                : 'When Line 2 raises a ValueError, Python immediately skips Line 3 and runs the except block.'}
            </p>
          </div>
        </div>

        {/* Input Tester Chips */}
        <div className="pybe-card pybe-tester-card">
          <h3 className="tester-heading">Try different inputs:</h3>
          <div className="chips-row" role="radiogroup">
            {chapter.editableExample.variants.map((v, idx) => (
              <button
                key={idx}
                role="radio"
                aria-checked={selectedVariant === idx}
                className={`pybe-chip-btn ${selectedVariant === idx ? 'chip-active' : ''}`}
                onClick={() => {
                  sound.playClick();
                  setSelectedVariant(idx);
                  setFocusedLine(null);
                }}
              >
                <code>{v.input}</code>
                <span className="chip-label">
                  {v.input === '"9"' || v.input === '"0"' ? 'Valid' : 'Invalid'}
                </span>
              </button>
            ))}
          </div>

          <div className="pybe-terminal-box">
            <span className="terminal-label">Terminal Output:</span>
            <pre className="terminal-text">{variant.expectedOutput}</pre>
          </div>

          <div className="reveal-action-center" style={{ marginTop: '14px' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                sound.playSuccess();
                if (onContinue) onContinue();
              }}
            >
              Next: What about missing data? &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
