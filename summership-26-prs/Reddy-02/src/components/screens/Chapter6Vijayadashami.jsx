import React, { useState } from 'react';
import { sound } from '../../services/soundEngine.js';

export default function Chapter6Vijayadashami({ chapter, onChallengeSolved, onContinue }) {
  const [answers, setAnswers] = useState({
    b1: '',
    b2: '',
    b3: '',
    b4: '',
  });
  const [checked, setChecked] = useState(false);

  const blanks = chapter.finalCodeChallenge.blanks;

  const handleChange = (id, val) => {
    setAnswers((prev) => ({ ...prev, [id]: val.toLowerCase().trim() }));
    setChecked(false);
  };

  const isB1Correct = answers.b1 === 'try';
  const isB2Correct = answers.b2 === 'else';
  const isB3Correct = answers.b3 === 'except';
  const isB4Correct = answers.b4 === 'finally';
  const allCorrect = isB1Correct && isB2Correct && isB3Correct && isB4Correct;

  const handleCheck = () => {
    setChecked(true);
    if (allCorrect) {
      sound.playSuccess();
      if (onChallengeSolved) onChallengeSolved(true);
    } else {
      sound.playError();
    }
  };

  const handleFillAll = () => {
    setAnswers({ b1: 'try', b2: 'else', b3: 'except', b4: 'finally' });
    setChecked(true);
    sound.playSuccess();
    if (onChallengeSolved) onChallengeSolved(true);
  };

  return (
    <section className="screen screen-concept" aria-labelledby="chapter6-heading">
      <div className="pybe-single-column">
        <header className="pybe-header-centered">
          <h2 id="chapter6-heading" className="pybe-story-title">
            The Complete 4-Part Structure
          </h2>
          <p className="pybe-lead">
            Python gives you complete control over every possible outcome: success, failure, and cleanup.
          </p>
        </header>

        {/* 4 Cards Overview (PyBe style) */}
        <div className="pybe-roles-grid">
          <div className="role-mini-card">
            <span className="mini-keyword">try</span>
            <span className="mini-role">Attempt risky code</span>
          </div>
          <div className="role-mini-card">
            <span className="mini-keyword">except</span>
            <span className="mini-role">Run on failure</span>
          </div>
          <div className="role-mini-card">
            <span className="mini-keyword">else</span>
            <span className="mini-role">Run on success</span>
          </div>
          <div className="role-mini-card">
            <span className="mini-keyword">finally</span>
            <span className="mini-role">Always run (cleanup)</span>
          </div>
        </div>

        {/* Fill in the Blanks Editor */}
        <div className="pybe-card pybe-blanks-card">
          <h3 className="blanks-title">Write the code: Complete the registration desk</h3>
          <p className="blanks-lead">Fill in the 4 blanks to assemble the pipeline:</p>

          <div className="pybe-editor-box">
            <pre className="blank-code-line">festival_days = &#123; &quot;vijayadashami&quot;: 10, &quot;navami&quot;: 9 &#125;</pre>
            <pre className="blank-code-line">day_input = &quot;vijayadashami&quot;</pre>
            <pre className="blank-code-line"></pre>

            {/* Blank 1: try */}
            <div className="editor-input-row">
              <input
                type="text"
                className={`pybe-blank-field ${checked ? (isB1Correct ? 'field-ok' : 'field-fail') : ''}`}
                value={answers.b1}
                onChange={(e) => handleChange('b1', e.target.value)}
                placeholder="blank 1"
                aria-label="Blank 1: Keyword that begins the block"
              />
              <span className="field-colon">:</span>
              <span className="field-hint">Hint: {blanks[0].hint}</span>
            </div>

            <pre className="blank-code-line">    day_num = festival_days[day_input]</pre>

            {/* Blank 2: else */}
            <div className="editor-input-row">
              <input
                type="text"
                className={`pybe-blank-field ${checked ? (isB2Correct ? 'field-ok' : 'field-fail') : ''}`}
                value={answers.b2}
                onChange={(e) => handleChange('b2', e.target.value)}
                placeholder="blank 2"
                aria-label="Blank 2: Runs when try succeeds"
              />
              <span className="field-colon">:</span>
              <span className="field-hint">Hint: {blanks[1].hint}</span>
            </div>

            <pre className="blank-code-line">        print(f"Registered for day &#123;day_num&#125;.")</pre>

            {/* Blank 3: except */}
            <div className="editor-input-row">
              <input
                type="text"
                className={`pybe-blank-field ${checked ? (isB3Correct ? 'field-ok' : 'field-fail') : ''}`}
                value={answers.b3}
                onChange={(e) => handleChange('b3', e.target.value)}
                placeholder="blank 3"
                aria-label="Blank 3: Catches KeyError"
              />
              <span className="field-colon"> KeyError:</span>
              <span className="field-hint">Hint: {blanks[2].hint}</span>
            </div>

            <pre className="blank-code-line">    print(f"Unknown day: &#123;day_input&#125;")</pre>

            {/* Blank 4: finally */}
            <div className="editor-input-row">
              <input
                type="text"
                className={`pybe-blank-field ${checked ? (isB4Correct ? 'field-ok' : 'field-fail') : ''}`}
                value={answers.b4}
                onChange={(e) => handleChange('b4', e.target.value)}
                placeholder="blank 4"
                aria-label="Blank 4: Always runs"
              />
              <span className="field-colon">:</span>
              <span className="field-hint">Hint: {blanks[3].hint}</span>
            </div>

            <pre className="blank-code-line">    print("Registration desk closed.")</pre>
          </div>

          <div className="blanks-actions">
            <button className="btn btn-primary" onClick={handleCheck}>
              Check Code
            </button>
            <button className="btn btn-secondary" onClick={handleFillAll}>
              Fill Answers
            </button>
          </div>

          {checked && (
            <div className={`pybe-feedback-box ${allCorrect ? 'feedback-correct' : 'feedback-hint'}`}>
              <span className="feedback-status-title">
                {allCorrect ? '✓ Excellent work!' : '💡 Check the blanks:'}
              </span>
              <p>
                {allCorrect
                  ? 'All 4 keywords placed correctly. Notice how else only runs on success, while finally always runs.'
                  : 'Make sure you type: try, else, except, and finally.'}
              </p>
            </div>
          )}

          {checked && allCorrect && (
            <div className="reveal-action-center" style={{ marginTop: '16px' }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  sound.playSuccess();
                  if (onContinue) onContinue();
                }}
              >
                Try it in the interactive lab &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
