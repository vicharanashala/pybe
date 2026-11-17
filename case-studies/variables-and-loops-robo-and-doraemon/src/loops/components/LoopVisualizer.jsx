import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { useSharedPyodide } from '../../shared/pyodide/PyodideContext';
import { buildGuardedLoopTracerHarness } from '../data/loopTracerHarness';
import { RANGE_PRESETS } from '../data/content';
import CodeTheater from './CodeTheater';

export default function LoopVisualizer({ onNext }) {
  const { status, runHarness } = useSharedPyodide();
  const [start, setStart] = useState(0);
  const [stop, setStop] = useState(5);
  const [step, setStep] = useState(1);
  const [trace, setTrace] = useState(null);
  const [error, setError] = useState(null);
  const [running, setRunning] = useState(false);

  const code = `for i in range(${start}, ${stop}, ${step}):\n    print("i is", i)\n`;

  function applyPreset(preset) {
    setStart(preset.start);
    setStop(preset.stop);
    setStep(preset.step);
    setTrace(null);
  }

  async function handleRun() {
    setRunning(true);
    setError(null);
    if (step === 0) {
      setError('step cannot be 0 — range() would never move toward stop.');
      setRunning(false);
      return;
    }
    const harness = buildGuardedLoopTracerHarness(code);
    const { data, error: err } = await runHarness(harness);
    if (err) setError(err);
    else setTrace(data.trace);
    setRunning(false);
  }

  const iterationCount = trace ? trace.filter((s) => s.newOutput).length : null;

  return (
    <div className="lp-scene">
      <h2>Take the controls</h2>
      <p className="lp-scene-intro">Change start, stop, and step yourself — then run it and watch iteration count, the loop variable, the timeline, memory, and output all move together.</p>

      <div className="lp-preset-row">
        {RANGE_PRESETS.map((p) => (
          <button key={p.label} className="lp-chip" onClick={() => applyPreset(p)}>{p.label}</button>
        ))}
      </div>

      <div className="lp-range-controls">
        <label>start<input type="number" value={start} onChange={(e) => { setStart(Number(e.target.value)); setTrace(null); }} /></label>
        <label>stop<input type="number" value={stop} onChange={(e) => { setStop(Number(e.target.value)); setTrace(null); }} /></label>
        <label>step<input type="number" value={step} onChange={(e) => { setStep(Number(e.target.value)); setTrace(null); }} /></label>
      </div>

      <div className="lp-code-block"><pre>{code}</pre></div>

      <button className="lp-mini-btn" onClick={handleRun} disabled={status !== 'ready' || running}>
        <Play size={14} /> {running ? 'Running…' : status !== 'ready' ? 'Starting Python…' : 'Run range()'}
      </button>

      {error && <div className="lp-runtime-error"><p>{error}</p></div>}
      {iterationCount !== null && <p className="lp-caption-static">This range produces <strong>{iterationCount}</strong> iteration{iterationCount === 1 ? '' : 's'}.</p>}
      {trace && <CodeTheater trace={trace} code={code} />}
      {trace && <button className="lp-mini-btn lp-cta" onClick={onNext}>Write your own loop →</button>}
    </div>
  );
}
