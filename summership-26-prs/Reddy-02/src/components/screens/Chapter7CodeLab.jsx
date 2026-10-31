import React, { useState } from 'react';
import { sound } from '../../services/soundEngine.js';

export default function Chapter7CodeLab({ chapter, onContinue }) {
  const [selectedExampleIdx, setSelectedExampleIdx] = useState(0);
  const [selectedInputIdx, setSelectedInputIdx] = useState(0);
  const [testedSet, setTestedSet] = useState(new Set([0]));

  const example = chapter.examples[selectedExampleIdx];
  const activeInput = example.inputs[selectedInputIdx] || example.inputs[0];

  const handleSelectExample = (idx) => {
    sound.playClick();
    setSelectedExampleIdx(idx);
    setSelectedInputIdx(0);
    setTestedSet(new Set([0]));
  };

  const handleSelectInput = (idx) => {
    sound.playClick();
    setSelectedInputIdx(idx);
    setTestedSet((prev) => new Set([...prev, idx]));
  };

  const renderedCode = example.code.replace(/{INPUT}/g, activeInput.value);

  return (
    <section className="screen screen-concept" aria-labelledby="chapter7-heading">
      <div className="pybe-single-column">
        <header className="pybe-header-centered">
          <h2 id="chapter7-heading" className="pybe-story-title">
            Try it yourself
          </h2>
          <p className="pybe-lead">
            Select a scenario and click different input values to see how Python responds.
          </p>
        </header>

        {/* 3 Step Tabs */}
        <div className="pybe-pill-tabs">
          {chapter.examples.map((ex, idx) => (
            <button
              key={ex.id}
              className={`pybe-pill-tab ${selectedExampleIdx === idx ? 'tab-active' : ''}`}
              onClick={() => handleSelectExample(idx)}
            >
              Step {idx + 1}: {ex.title.split('—')[0]}
            </button>
          ))}
        </div>

        {/* Interactive Sandbox Card */}
        <div className="pybe-card pybe-sandbox-card">
          <div className="sandbox-top-bar">
            <span className="sandbox-title">{example.title}</span>
            <span className="sandbox-badge">
              Inputs Tested: {testedSet.size} / {example.inputs.length}
            </span>
          </div>

          <pre className="pybe-pre">
            <code>{renderedCode}</code>
          </pre>

          {/* Test Input Chips */}
          <div className="sandbox-controls">
            <span className="controls-label">Click a test input to run:</span>
            <div className="chips-row">
              {example.inputs.map((inp, idx) => (
                <button
                  key={idx}
                  className={`pybe-chip-btn ${selectedInputIdx === idx ? 'chip-active' : ''}`}
                  onClick={() => handleSelectInput(idx)}
                >
                  <code>{inp.label}</code>
                </button>
              ))}
            </div>
          </div>

          {/* Execution Trace Pills */}
          <div className="sandbox-trace-strip">
            <span className="strip-title">Execution Path:</span>
            <div className="strip-pills">
              {activeInput.path.map((lineNum, i) => (
                <span key={i} className="pybe-line-pill">
                  Line {lineNum}
                  {i < activeInput.path.length - 1 && <span className="pill-arrow">&rarr;</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Terminal Console */}
          <div className="pybe-terminal-box">
            <span className="terminal-label">Simulated Output:</span>
            <pre className="terminal-text">{activeInput.output}</pre>
          </div>
        </div>

        {/* In-Card Continue Action */}
        <div className="pybe-btn-container">
          <button
            className="pybe-primary-btn"
            onClick={() => {
              sound.playClick();
              if (onContinue) onContinue();
            }}
          >
            Continue to Final Assessment &rarr;
          </button>
        </div>
      </div>
    </section>
  );
}
