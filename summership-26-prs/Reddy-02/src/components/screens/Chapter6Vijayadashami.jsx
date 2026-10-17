import React, { useState } from 'react';
import { sound } from '../../services/soundEngine.js';

export default function Chapter6Vijayadashami({ chapter, onChallengeSolved }) {
  const [answers, setAnswers] = useState({
    b1: '',
    b2: '',
    b3: '',
    b4: '',
  });
  const [checked, setChecked] = useState(false);
  const [activeTab, setActiveTab] = useState('validKey');

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
      <div className="content-container">
        <header className="screen-header">
          <span className="screen-eyebrow">{chapter.eyebrow}</span>
          <h2 id="chapter6-heading" className="screen-title">{chapter.title}</h2>
          <p className="screen-lead">
            Vijayadashami brings together all the threads of preparation and vigilance. In Python, the four-part exception structure provides complete control over every runtime outcome.
          </p>
        </header>

        {/* Story & Regional Note */}
        <div className="story-snippet-card">
          <p>{chapter.story}</p>
          <div className="regional-tag">
            <span>🌍 {chapter.regionalNote}</span>
          </div>
        </div>

        {/* Fill in the Blanks Code Challenge */}
        <div className="fill-blanks-container">
          <div className="challenge-banner">
            <h3>{chapter.finalCodeChallenge.title}</h3>
            <p>{chapter.finalCodeChallenge.description}</p>
          </div>

          <div className="code-editor-simulation">
            <div className="code-viewer-header">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
              <span className="code-filename">festival_registration.py</span>
            </div>

            <div className="code-body-blanks">
              <pre className="pre-code-line">festival_days = &#123;</pre>
              <pre className="pre-code-line">    &quot;vijayadashami&quot;: 10,</pre>
              <pre className="pre-code-line">    &quot;navami&quot;: 9,</pre>
              <pre className="pre-code-line">    &quot;ashtami&quot;: 8</pre>
              <pre className="pre-code-line">&#125;</pre>
              <pre className="pre-code-line">day_input = &quot;vijayadashami&quot;</pre>
              <pre className="pre-code-line"></pre>

              {/* Blank 1: try */}
              <div className="blank-line">
                <input
                  type="text"
                  className={`blank-input ${checked ? (isB1Correct ? 'blank-ok' : 'blank-fail') : ''}`}
                  value={answers.b1}
                  onChange={(e) => handleChange('b1', e.target.value)}
                  placeholder="[blank 1]"
                  aria-label="Blank 1: Keyword that begins the block"
                />
                <span className="blank-code">:</span>
                <span className="blank-hint">Hint: {blanks[0].hint}</span>
              </div>

              <pre className="pre-code-line">    day_num = festival_days[day_input]</pre>

              {/* Blank 2: else */}
              <div className="blank-line indent-1">
                <input
                  type="text"
                  className={`blank-input ${checked ? (isB2Correct ? 'blank-ok' : 'blank-fail') : ''}`}
                  value={answers.b2}
                  onChange={(e) => handleChange('b2', e.target.value)}
                  placeholder="[blank 2]"
                  aria-label="Blank 2: Keyword that runs when try succeeds"
                />
                <span className="blank-code">:</span>
                <span className="blank-hint">Hint: {blanks[1].hint}</span>
              </div>

              <pre className="pre-code-line indent-2">    print(f&quot;Registered for day &#123;day_num&#125;.&quot;)</pre>

              {/* Blank 3: except */}
              <div className="blank-line">
                <input
                  type="text"
                  className={`blank-input ${checked ? (isB3Correct ? 'blank-ok' : 'blank-fail') : ''}`}
                  value={answers.b3}
                  onChange={(e) => handleChange('b3', e.target.value)}
                  placeholder="[blank 3]"
                  aria-label="Blank 3: Keyword that catches exception"
                />
                <span className="blank-code"> KeyError:</span>
                <span className="blank-hint">Hint: {blanks[2].hint}</span>
              </div>

              <pre className="pre-code-line indent-1">    print(f&quot;Unknown festival day: &#123;day_input&#125;&quot;)</pre>

              {/* Blank 4: finally */}
              <div className="blank-line">
                <input
                  type="text"
                  className={`blank-input ${checked ? (isB4Correct ? 'blank-ok' : 'blank-fail') : ''}`}
                  value={answers.b4}
                  onChange={(e) => handleChange('b4', e.target.value)}
                  placeholder="[blank 4]"
                  aria-label="Blank 4: Keyword that always runs"
                />
                <span className="blank-code">:</span>
                <span className="blank-hint">Hint: {blanks[3].hint}</span>
              </div>

              <pre className="pre-code-line indent-1">    print(&quot;Registration desk closed for this request.&quot;)</pre>
            </div>

            <div className="blanks-actions">
              <button className="btn btn-primary" onClick={handleCheck}>
                Verify Structure
              </button>
              <button className="btn btn-secondary" onClick={handleFillAll}>
                Reveal Complete Pattern
              </button>
              {checked && allCorrect && (
                <span className="success-badge">✨ All 4 keywords correctly placed!</span>
              )}
            </div>
          </div>
        </div>

        {/* Dual Path Visualizer */}
        <div className="dual-path-card">
          <h4>Execution Outcomes Comparison</h4>
          <div className="path-toggle-row">
            <button
              className={`tab-btn ${activeTab === 'validKey' ? 'active' : ''}`}
              onClick={() => {
                sound.playClick();
                setActiveTab('validKey');
              }}
            >
              When day_input exists (&quot;vijayadashami&quot;)
            </button>
            <button
              className={`tab-btn ${activeTab === 'invalidKey' ? 'active' : ''}`}
              onClick={() => {
                sound.playClick();
                setActiveTab('invalidKey');
              }}
            >
              When day_input is missing (&quot;diwali&quot;)
            </button>
          </div>

          <div className="path-detail-content">
            <div className="path-sequence">
              <strong>Order of execution:</strong>
              {chapter.finalCodeChallenge.executionPaths[activeTab].path.map((step, idx) => (
                <span key={idx} className="badge-step badge-handled">
                  {step} {idx < chapter.finalCodeChallenge.executionPaths[activeTab].path.length - 1 ? '→' : ''}
                </span>
              ))}
            </div>
            <div className="terminal-card small">
              <pre className="terminal-output">
                {chapter.finalCodeChallenge.executionPaths[activeTab].output}
              </pre>
            </div>
          </div>
        </div>

        {/* 4 Keywords Reference Grid */}
        <div className="keywords-grid">
          {chapter.conceptSummary.items.map((it) => (
            <div key={it.keyword} className="keyword-item">
              <code className="keyword-name">{it.keyword}</code>
              <p className="keyword-role">{it.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
