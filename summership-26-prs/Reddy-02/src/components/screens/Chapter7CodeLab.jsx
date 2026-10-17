import React, { useState } from 'react';
import { sound } from '../../services/soundEngine.js';

export default function Chapter7CodeLab({ chapter }) {
  const [selectedExampleIdx, setSelectedExampleIdx] = useState(0);
  const [selectedInputIdx, setSelectedInputIdx] = useState(0);

  const example = chapter.examples[selectedExampleIdx];
  const activeInput = example.inputs[selectedInputIdx] || example.inputs[0];

  const handleSelectExample = (idx) => {
    sound.playClick();
    setSelectedExampleIdx(idx);
    setSelectedInputIdx(0);
  };

  const handleSelectInput = (idx) => {
    sound.playClick();
    setSelectedInputIdx(idx);
  };

  // Replace {INPUT} in code template with current value
  const renderedCode = example.code.replace(/{INPUT}/g, activeInput.value);

  return (
    <section className="screen screen-concept" aria-labelledby="chapter7-heading">
      <div className="content-container">
        <header className="screen-header">
          <span className="screen-eyebrow">{chapter.eyebrow}</span>
          <h2 id="chapter7-heading" className="screen-title">{chapter.title}</h2>
          <p className="screen-lead">
            Test and observe exception patterns in this interactive Python sandbox. Select an example, switch the test inputs, and trace how execution branches.
          </p>
        </header>

        {/* Sandbox Navigation Tabs */}
        <div className="lab-selector-tabs" role="tablist">
          {chapter.examples.map((ex, idx) => (
            <button
              key={ex.id}
              role="tab"
              aria-selected={selectedExampleIdx === idx}
              className={`lab-tab-btn ${selectedExampleIdx === idx ? 'active' : ''}`}
              onClick={() => handleSelectExample(idx)}
            >
              <span className="tab-number">0{idx + 1}</span>
              <span className="tab-title">{ex.title}</span>
            </button>
          ))}
        </div>

        {/* Sandbox Workspace Layout */}
        <div className="lab-workspace">
          {/* Left Column: Code Editor */}
          <div className="lab-editor-column">
            <div className="code-viewer-header">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
              <span className="code-filename">{example.id}.py</span>
              <span className="code-mode-tag">Simulated Sandbox</span>
            </div>
            <pre className="code-pre lab-pre">
              <code>{renderedCode}</code>
            </pre>

            <div className="lab-disclaimer">
              <span>ℹ️ {chapter.labNote}</span>
            </div>
          </div>

          {/* Right Column: Inputs & Simulated Terminal Output */}
          <div className="lab-controls-column">
            <div className="lab-input-picker">
              <h4>Select Test Input:</h4>
              <div className="input-chips-group">
                {example.inputs.map((inp, idx) => (
                  <button
                    key={idx}
                    className={`input-chip ${selectedInputIdx === idx ? 'chip-active' : ''}`}
                    onClick={() => handleSelectInput(idx)}
                  >
                    <code>{inp.label}</code>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Terminal */}
            <div className="terminal-card">
              <div className="terminal-header">
                <span className="terminal-title">Terminal &bull; Python Output</span>
                <span className="terminal-status-ok">● Live</span>
              </div>
              <div className="terminal-body">
                <span className="terminal-prompt">$ python {example.id}.py</span>
                <pre className="terminal-output">{activeInput.output}</pre>
              </div>
            </div>

            {/* Line Path Trace */}
            <div className="trace-path-box">
              <span className="trace-path-title">Lines Executed:</span>
              <div className="trace-path-pills">
                {activeInput.path.map((lineNum, i) => (
                  <span key={i} className="line-pill">
                    L{lineNum}
                    {i < activeInput.path.length - 1 && <span className="pill-arrow">&rarr;</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
