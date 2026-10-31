import React, { useState } from 'react';
import { sound } from '../../services/soundEngine.js';

export default function Chapter3NineDayBattle({ chapter, onAnswerSelected, selectedAnswer, onContinue }) {
  const [selected, setSelected] = useState(selectedAnswer || null);
  const [activeStep, setActiveStep] = useState(null);

  const handleSelect = (id) => {
    setSelected(id);
    if (id === chapter.codeProblem.correctId) {
      sound.playSuccess();
    } else {
      sound.playError();
    }
    if (onAnswerSelected) onAnswerSelected(id);
  };

  const isCorrect = selected === chapter.codeProblem.correctId;

  return (
    <section className="screen screen-concept" aria-labelledby="chapter3-heading">
      <div className="pybe-single-column">
        {/* Screen Header */}
        <header className="pybe-header-centered">
          <span className="pybe-brand-pill">Story Chapter 2 &bull; Inside the Python Code</span>
          <h2 id="chapter3-heading" className="pybe-story-title">
            What is a ValueError?
          </h2>
          <p className="pybe-lead">
            The registration desk needs a number to book festival days. Let&rsquo;s see what happens inside Python.
          </p>
        </header>

        {/* Story Context Banner: Continuing directly from Chapter 2 */}
        <div className="pybe-story-context-card">
          <div className="story-context-header">
            <span className="story-context-tag">🖥️ At the Registration Counter</span>
            <span className="story-context-status">Processing: days_input = &quot;nine&quot;</span>
          </div>
          <p className="story-context-text">
            The registration computer stored the visitor&rsquo;s input as <code>days_input = &quot;nine&quot;</code>. To calculate bookings and print a confirmation badge, the program must convert this text into an integer number using Python&rsquo;s <code>int()</code> function.
          </p>
        </div>

        {/* Code Block Card */}
        <div className="pybe-card pybe-code-card">
          <div className="code-header-bar">
            <span className="code-filename">registration_desk.py</span>
            <span className="code-badge">Python 3.x</span>
          </div>
          <pre className="pybe-pre">
            <code>{chapter.codeProblem.code}</code>
          </pre>
        </div>

        {/* Question Card */}
        <div className="pybe-card pybe-question-card">
          <div className="question-title-row">
            <span className="question-num-circle">?</span>
            <h3 className="question-text">{chapter.codeProblem.question}</h3>
          </div>

          <div className="pybe-options-list" role="radiogroup" aria-label="Question options">
            {chapter.codeProblem.options.map((opt) => {
              const isChosen = selected === opt.id;
              const isOptionCorrect = opt.id === chapter.codeProblem.correctId;
              let statusClass = '';
              if (selected) {
                if (isChosen && isOptionCorrect) statusClass = 'pybe-opt-correct';
                else if (isChosen && !isOptionCorrect) statusClass = 'pybe-opt-wrong';
                else if (isOptionCorrect) statusClass = 'pybe-opt-reveal';
              }

              return (
                <button
                  key={opt.id}
                  role="radio"
                  aria-checked={isChosen}
                  className={`pybe-option-row ${statusClass}`}
                  onClick={() => handleSelect(opt.id)}
                >
                  <span className="option-label-text">{opt.text}</span>
                  {selected && isChosen && isOptionCorrect && <span className="check-icon">✓</span>}
                </button>
              );
            })}
          </div>

          {selected && (
            <div className={`pybe-feedback-box ${isCorrect ? 'feedback-correct' : 'feedback-hint'}`}>
              <span className="feedback-status-title">
                {isCorrect ? '✓ Correct' : '💡 Explanation:'}
              </span>
              <p>{chapter.codeProblem.explanations[selected]}</p>
            </div>
          )}
        </div>

        {/* Trace Table & Interactive Concept Breakdown */}
        {selected && (
          <>
            {/* Step-by-Step Execution Trace */}
            <div className="pybe-card pybe-trace-card fade-in">
              <h3 className="trace-heading">Step-by-step execution</h3>
              <p className="trace-subtext">Click each line below to inspect why execution halted at Line 2:</p>

              <div className="pybe-trace-list" role="list">
                {chapter.codeProblem.exceptionTrace.map((row) => (
                  <div
                    key={row.line}
                    role="listitem"
                    className={`pybe-trace-row status-${row.status} ${activeStep === row.line ? 'row-active' : ''}`}
                    onClick={() => {
                      sound.playClick();
                      setActiveStep(row.line);
                    }}
                  >
                    <span className="trace-step-tag">Line {row.line}</span>
                    <code className="trace-code-text">{row.code}</code>
                    <span className={`trace-pill pill-${row.status}`}>
                      {row.status === 'ok' && '✓ Normal'}
                      {row.status === 'raises' && '💥 ValueError'}
                      {row.status === 'skipped' && '⏭ Skipped'}
                    </span>
                    <span className="trace-note-text">{row.note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* In-depth Concept Breakdown: Why ValueError happened */}
            <div className="pybe-concept-breakdown fade-in">
              <h3 className="concept-breakdown-title">
                Understanding Why the ValueError Occurred
              </h3>

              {/* Side-by-Side Comparison */}
              <div className="compare-mini-box">
                <div className="compare-chip chip-ok">
                  <span>int(&quot;9&quot;)</span>
                  <span>&rarr;</span>
                  <span>9 (Valid digit string)</span>
                </div>
                <div className="compare-chip chip-err">
                  <span>int(&quot;nine&quot;)</span>
                  <span>&rarr;</span>
                  <span>💥 ValueError (Alphabetic word)</span>
                </div>
              </div>

              {/* 4 Key Takeaways */}
              <div className="concept-breakdown-grid">
                <div className="breakdown-item">
                  <div className="breakdown-header">
                    <span>1. Why use <code>int()</code>?</span>
                  </div>
                  <p className="breakdown-desc">
                    In Python, raw user inputs always arrive as text strings (<code>str</code>). To calculate days or perform arithmetic, programs must convert numeric text into integers using <code>int()</code>.
                  </p>
                </div>

                <div className="breakdown-item">
                  <div className="breakdown-header">
                    <span>2. Why <code>&quot;9&quot;</code> works vs <code>&quot;nine&quot;</code></span>
                  </div>
                  <p className="breakdown-desc">
                    <code>int(&quot;9&quot;)</code> succeeds because <code>&quot;9&quot;</code> consists of base-10 digits. But <code>&quot;nine&quot;</code> is an English word—Python cannot guess human language meanings.
                  </p>
                </div>

                <div className="breakdown-item">
                  <div className="breakdown-header">
                    <span>3. What is a <code>ValueError</code>?</span>
                  </div>
                  <p className="breakdown-desc">
                    Python raises a <code>ValueError</code> when a function receives an argument of the correct data type (here a <code>str</code>), but its actual value cannot be converted.
                  </p>
                </div>

                <div className="breakdown-item">
                  <div className="breakdown-header">
                    <span>4. Why <code>print()</code> never ran</span>
                  </div>
                  <p className="breakdown-desc">
                    When an unhandled exception occurs, Python halts program execution immediately on that line. Subsequent statements in the block are completely skipped.
                  </p>
                </div>
              </div>

              <div className="reveal-action-center" style={{ marginTop: '8px' }}>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    sound.playSuccess();
                    if (onContinue) onContinue();
                  }}
                >
                  See how to catch this error with try &amp; except &rarr;
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
