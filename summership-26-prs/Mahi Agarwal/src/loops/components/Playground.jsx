import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { useSharedPyodide } from '../../shared/pyodide/PyodideContext';
import { buildGuardedLoopTracerHarness } from '../data/loopTracerHarness';
import { PLAYGROUND_TEMPLATES } from '../data/content';
import CodeTheater from './CodeTheater';

export default function Playground({ onNext }) {
  const { status, runHarness } = useSharedPyodide();
  const [templateName, setTemplateName] = useState('Count the Days');
  const [code, setCode] = useState(PLAYGROUND_TEMPLATES['Count the Days'].code);
  const [trace, setTrace] = useState(null);
  const [error, setError] = useState(null);
  const [running, setRunning] = useState(false);

  function selectTemplate(name) {
    setTemplateName(name);
    setCode(PLAYGROUND_TEMPLATES[name].code);
    setTrace(null);
    setError(null);
  }

  async function handleRun() {
    setRunning(true);
    setError(null);
    setTrace(null);
    const harness = buildGuardedLoopTracerHarness(code);
    const { data, error: err } = await runHarness(harness);
    if (err) setError(err);
    else setTrace(data.trace);
    setRunning(false);
  }

  return (
    <div className="lp-scene">
      <h2>Real coding playground</h2>
      <p className="lp-scene-intro">Write a loop, run it for real, and watch every iteration, not just the final output.</p>

      <div className="lp-template-row">
        {Object.keys(PLAYGROUND_TEMPLATES).map((name) => (
          <button key={name} className={`lp-chip ${templateName === name ? 'active' : ''}`} onClick={() => selectTemplate(name)}>{name}</button>
        ))}
      </div>

      <textarea className="lp-code-editor" value={code} spellCheck={false} onChange={(e) => { setCode(e.target.value); setTrace(null); }} />

      <button className="lp-mini-btn" onClick={handleRun} disabled={status !== 'ready' || running}>
        <Play size={14} /> {running ? 'Running…' : status !== 'ready' ? 'Starting Python…' : 'Run it'}
      </button>

      {error && <div className="lp-runtime-error"><p>{error}</p></div>}
      {trace && <CodeTheater trace={trace} code={code} />}
      {trace && <button className="lp-mini-btn lp-cta" onClick={onNext}>Ready to be tested →</button>}
    </div>
  );
}
