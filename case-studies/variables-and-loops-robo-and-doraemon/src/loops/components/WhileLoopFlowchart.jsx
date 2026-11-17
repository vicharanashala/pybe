import React, { useState } from 'react';
import MemoryOrbs from './MemoryOrbs';

const THRESHOLD = 5;

function formatC(c) {
  return Number.isInteger(c) ? String(c) : c.toFixed(1);
}

export default function WhileLoopFlowchart({ onNext }) {
  const [start, setStart] = useState(2);
  const [updateMode, setUpdateMode] = useState('increment');
  const [c, setC] = useState(2);
  const [completed, setCompleted] = useState(0);
  const [stage, setStage] = useState('test'); // 'test' | 'body' | 'done'
  const [lastResult, setLastResult] = useState(null); // true | false | null
  const [pulseKey, setPulseKey] = useState(0);

  const conditionTrue = c < THRESHOLD;

  function resetRun(nextStart = start) {
    setC(nextStart);
    setCompleted(0);
    setStage('test');
    setLastResult(null);
    setPulseKey((k) => k + 1);
  }

  function handleStartChange(value) {
    setStart(value);
    resetRun(value);
  }

  function handleUpdateModeChange(mode) {
    setUpdateMode(mode);
    resetRun(start);
  }

  function handleNextStep() {
    setPulseKey((k) => k + 1);
    if (stage === 'test') {
      const result = c < THRESHOLD;
      setLastResult(result);
      setStage(result ? 'body' : 'done');
      return;
    }
    if (stage === 'body') {
      setC((prev) => (updateMode === 'increment' ? Math.round((prev + 1) * 10) / 10 : prev));
      setCompleted((n) => n + 1);
      setStage('test');
      setLastResult(null);
    }
  }

  const subtitle = stage === 'done'
    ? `${formatC(c)} < ${THRESHOLD} is false; exit the loop.`
    : stage === 'body'
      ? `${formatC(c)} < ${THRESHOLD} is true; running the body.`
      : lastResult === null
        ? `Test the condition: is ${formatC(c)} < ${THRESHOLD}?`
        : `${formatC(c)} < ${THRESHOLD} is ${lastResult}; ${lastResult ? 'enter the body.' : 'exit the loop.'}`;

  const showInfiniteWarning = updateMode === 'unchanged' && completed > 6 && stage !== 'done';

  return (
    <div className="lp-flowchart-wrap">
      <span className="lp-concept-tag">while loop</span>
      <div className="lp-code-block"><pre>{`c = ${start}\nwhile c < ${THRESHOLD}:\n    print(c)\n    ${updateMode === 'increment' ? 'c = c + 1' : '# (nothing updates c)'}`}</pre></div>

      <div className="lp-flowchart-card">
        <div className="lp-flowchart-counter">Counter {formatC(c)}</div>

        <svg viewBox="0 0 480 300" className="lp-flowchart-svg">
          <text x="240" y="18" textAnchor="middle" className="lp-fc-label">Entry</text>
          <line x1="240" y1="24" x2="240" y2="68" className="lp-fc-arrow" markerEnd="url(#fc-arrowhead)" />

          <polygon
            key={`diamond-${pulseKey}`}
            points="240,70 312,120 240,170 168,120"
            className={`lp-fc-diamond ${stage === 'test' || stage === 'body' ? 'active' : ''} lp-fc-pulse`}
          />
          <text x="240" y="115" textAnchor="middle" className="lp-fc-diamond-text">{formatC(c)} &lt; {THRESHOLD}</text>
          <text x="240" y="130" textAnchor="middle" className={`lp-fc-diamond-sub ${lastResult === true ? 'true' : lastResult === false ? 'false' : ''}`}>{lastResult === null ? '?' : String(lastResult)}</text>

          {/* True path down to loop body */}
          <line x1="240" y1="170" x2="240" y2="204" className={`lp-fc-arrow ${stage === 'body' ? 'active' : ''}`} markerEnd="url(#fc-arrowhead)" />
          <text x="256" y="192" className="lp-fc-branch-label true">True</text>
          <rect x="170" y="206" width="140" height="52" rx="10" className={`lp-fc-box ${stage === 'body' ? 'active lp-fc-pulse' : ''}`} />
          <text x="240" y="228" textAnchor="middle" className="lp-fc-box-text">Loop body</text>
          <text x="240" y="246" textAnchor="middle" className="lp-fc-box-sub">{updateMode === 'increment' ? 'c ← c + 1' : 'c unchanged'}</text>

          {/* False path to after-loop */}
          <line x1="312" y1="120" x2="378" y2="120" className={`lp-fc-arrow ${stage === 'done' ? 'active' : ''}`} markerEnd="url(#fc-arrowhead)" />
          <text x="345" y="110" className="lp-fc-branch-label false">False</text>
          <rect x="380" y="98" width="90" height="44" rx="10" className={`lp-fc-box ${stage === 'done' ? 'active' : ''}`} />
          <text x="425" y="125" textAnchor="middle" className="lp-fc-box-text">After loop</text>

          {/* Loop-back dashed path */}
          <path d="M170 232 C88 232 88 120 166 120" className={`lp-fc-loopback ${stage === 'test' && completed > 0 ? 'active' : ''}`} markerEnd="url(#fc-arrowhead-dim)" fill="none" />

          <defs>
            <marker id="fc-arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" className="lp-fc-arrowhead" />
            </marker>
            <marker id="fc-arrowhead-dim" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" className="lp-fc-arrowhead-dim" />
            </marker>
          </defs>
        </svg>

        <div className="lp-flowchart-completed">Completed: {completed}</div>
      </div>

      <MemoryOrbs globals={{ c: formatC(c) }} emptyLabel="Nothing in memory yet." />

      {showInfiniteWarning && (
        <div className="lp-runtime-error lp-infinite-warning">
          <span className="lp-infinite-icon">{'♾️'}</span>
          <p>This will never stop on its own {'—'} c never changes! This is exactly what programmers call an <strong>infinite loop</strong>. In real code, always make sure something inside the loop eventually makes the condition false.</p>
        </div>
      )}

      <div className="lp-flowchart-controls">
        <p className="lp-flowchart-title">Test the condition</p>
        <p className="lp-caption-static">{subtitle}</p>

        <div className="lp-range-controls">
          <label>Start (initial c)<input type="range" min="0" max="6" step="0.5" value={start} onChange={(e) => handleStartChange(Number(e.target.value))} /><span className="lp-nl-value">{formatC(start)}</span></label>
        </div>

        <div className="lp-toggle-row">
          <span className="lp-toggle-label">Update:</span>
          <div className="lp-toggle">
            <button className={updateMode === 'increment' ? 'active' : ''} onClick={() => handleUpdateModeChange('increment')}>Increment (c {'←'} c + 1)</button>
            <button className={updateMode === 'unchanged' ? 'active' : ''} onClick={() => handleUpdateModeChange('unchanged')}>Unchanged</button>
          </div>
        </div>

        <div className="lp-playground-actions">
          <button className="lp-chip" onClick={() => resetRun(start)}>Restart</button>
          <button className="lp-mini-btn" onClick={handleNextStep} disabled={stage === 'done'}>{stage === 'done' ? 'Loop finished' : 'Next step'}</button>
        </div>
      </div>

      <button className="lp-mini-btn lp-cta" onClick={onNext}>See it done seven different ways {'→'}</button>
    </div>
  );
}
