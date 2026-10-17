import React, { useState } from 'react';
import { sound } from '../../services/soundEngine.js';

export default function Chapter4TryExcept({ chapter }) {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [focusedLine, setFocusedLine] = useState(null);

  const variant = chapter.editableExample.variants[selectedVariant];
  const isInvalid = variant.input === '"nine"' || variant.input === '""';

  return (
    <section className="screen screen-concept" aria-labelledby="chapter4-heading">
      <div className="content-container">
        <header className="screen-header">
          <span className="screen-eyebrow">{chapter.eyebrow}</span>
          <h2 id="chapter4-heading" className="screen-title">{chapter.title}</h2>
          <p className="screen-lead">
            Goddess Durga prepared weapons for every form of the challenge. In Python, you prepare for runtime exceptions using <code>try</code> and <code>except</code>.
          </p>
        </header>

        {/* Interactive Code Stepper & Explanation */}
        <div className="code-lab-stepper">
          <div className="stepper-left">
            <div className="code-viewer-header">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
              <span className="code-filename">handled_countdown.py</span>
            </div>

            <div className="code-lines-interactive" role="list" aria-label="Interactive code lines">
              {chapter.codeLines.map((line) => {
                const isHovered = focusedLine === line.lineNum;
                // If variant is valid, line 3 runs and line 4-5 are skipped
                let currentStatus = line.status;
                if (!isInvalid) {
                  if (line.lineNum === 2) currentStatus = 'normal';
                  if (line.lineNum === 3) currentStatus = 'handled';
                  if (line.lineNum === 4 || line.lineNum === 5) currentStatus = 'skipped';
                }

                return (
                  <div
                    key={line.lineNum}
                    className={`code-line-item line-status-${currentStatus} ${isHovered ? 'line-focused' : ''}`}
                    onClick={() => {
                      sound.playClick();
                      setFocusedLine(line.lineNum);
                    }}
                    onMouseEnter={() => setFocusedLine(line.lineNum)}
                    role="listitem"
                    tabIndex={0}
                  >
                    <span className="line-no">{line.lineNum}</span>
                    <pre className="line-code">
                      {line.lineNum === 2
                        ? `    days = int(${variant.input})`
                        : line.code}
                    </pre>
                    <span className={`status-pill pill-${currentStatus}`}>
                      {currentStatus === 'raises' && '💥 Raises'}
                      {currentStatus === 'handled' && '▶ Runs'}
                      {currentStatus === 'skipped' && '⏭ Skipped'}
                      {currentStatus === 'normal' && 'Attempt'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Line Explanation Drawer */}
            <div className="line-explainer-card">
              <span className="explainer-icon">🔍</span>
              <div className="explainer-content">
                <strong>
                  {focusedLine
                    ? `Line ${focusedLine} Breakdown:`
                    : 'Click or hover any line above to inspect how Python evaluates it.'}
                </strong>
                <p>
                  {focusedLine
                    ? chapter.codeLines.find((l) => l.lineNum === focusedLine)?.explain
                    : 'A try block tells Python: "Attempt this, but catch any error in except."'}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Variant Tester */}
          <div className="stepper-right">
            <div className="input-experimenter-card">
              <h3>🧪 Interactive Input Tester</h3>
              <p className="experimenter-lead">{chapter.editableExample.prompt}</p>

              <div className="variant-buttons" role="radiogroup" aria-label="Input options">
                {chapter.editableExample.variants.map((v, idx) => (
                  <button
                    key={idx}
                    role="radio"
                    aria-checked={selectedVariant === idx}
                    className={`variant-btn ${selectedVariant === idx ? 'variant-active' : ''}`}
                    onClick={() => {
                      sound.playClick();
                      setSelectedVariant(idx);
                    }}
                  >
                    <span className="variant-label">input = {v.input}</span>
                    <span className="variant-tag">{v.input === '"9"' || v.input === '"0"' ? 'Valid Integer' : 'Raises ValueError'}</span>
                  </button>
                ))}
              </div>

              {/* Console Output Simulation */}
              <div className="terminal-card">
                <div className="terminal-header">
                  <span className="terminal-title">Terminal Console Output</span>
                  <span className="terminal-badge">{isInvalid ? 'Caught by except' : 'Successful try execution'}</span>
                </div>
                <div className="terminal-body">
                  <span className="terminal-prompt">&gt;&gt;&gt; python handled_countdown.py</span>
                  <pre className="terminal-output">{variant.expectedOutput}</pre>
                </div>
              </div>

              {/* Execution Path Diagram */}
              <div className="path-diagram">
                <strong>Execution Order:</strong>
                <div className="path-badges">
                  {isInvalid ? (
                    <>
                      <span className="badge-step">Line 1 (try)</span> &rarr;
                      <span className="badge-step badge-err">Line 2 (int({variant.input}))</span> &rarr;
                      <span className="badge-step badge-handled">Line 4 (except ValueError)</span> &rarr;
                      <span className="badge-step badge-handled">Line 5 (print message)</span>
                    </>
                  ) : (
                    <>
                      <span className="badge-step">Line 1 (try)</span> &rarr;
                      <span className="badge-step badge-handled">Line 2 (int({variant.input}))</span> &rarr;
                      <span className="badge-step badge-handled">Line 3 (print({variant.expectedOutput}))</span> &rarr;
                      <span className="badge-step badge-skip">Lines 4-5 (Skipped)</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
