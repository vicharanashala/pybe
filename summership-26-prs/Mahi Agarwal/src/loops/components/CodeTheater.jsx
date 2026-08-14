import React, { useEffect, useMemo, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import MemoryOrbs from './MemoryOrbs';
import ExecutionTimeline from './ExecutionTimeline';

export default function CodeTheater({ trace, code }) {
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);

  useEffect(() => { setStepIndex(-1); setPlaying(false); }, [trace]);

  useEffect(() => {
    if (!playing || !trace) return undefined;
    if (stepIndex >= trace.length - 1) { setPlaying(false); return undefined; }
    const timer = setTimeout(() => setStepIndex((i) => i + 1), 750);
    return () => clearTimeout(timer);
  }, [playing, stepIndex, trace]);

  const currentStep = trace && stepIndex >= 0 ? trace[stepIndex] : null;
  const currentLine = currentStep?.afterLine ?? null;
  const memoryState = currentStep?.globals ?? {};
  const output = useMemo(() => {
    if (!trace || stepIndex < 0) return '';
    return trace.slice(0, stepIndex + 1).map((s) => s.newOutput).join('');
  }, [trace, stepIndex]);
  const atEnd = trace && stepIndex >= trace.length - 1;

  if (!trace) return null;
  const codeLines = code.split('\n');

  return (
    <div className="lp-theater">
      <div className="lp-theater-main">
        <div className="lp-theater-code">
          <div className="lp-panel-label">Execution</div>
          <pre className="lp-code-display">
            {codeLines.map((line, i) => (
              <div key={i} className={`lp-code-line-display ${currentLine === i + 1 ? 'active' : ''}`}>
                {currentLine === i + 1 && <span className="lp-pointer">▸</span>}
                {line || ' '}
              </div>
            ))}
          </pre>
          {currentStep?.visitCount > 1 && <span className="lp-visit-badge">Pass #{currentStep.visitCount} through this line</span>}
        </div>

        <div className="lp-theater-side">
          <MemoryOrbs globals={memoryState} />
          <div className="lp-console-panel">
            <div className="lp-panel-label">Console output</div>
            <pre className="lp-console">{output || 'No output yet.'}</pre>
          </div>
        </div>
      </div>

      <ExecutionTimeline trace={trace} stepIndex={stepIndex} />

      <div className="lp-timeline">
        {trace.map((step, i) => (
          <button
            key={i}
            className={`lp-timeline-dot ${i === stepIndex ? 'active' : i < stepIndex ? 'past' : ''}`}
            onClick={() => setStepIndex(i)}
            title={`Line ${step.afterLine}`}
          />
        ))}
      </div>

      <div className="lp-theater-controls">
        <button className="lp-icon-btn" onClick={() => { setStepIndex(-1); setPlaying(false); }} title="Reset"><RotateCcw size={16} /></button>
        <button className="lp-icon-btn" onClick={() => setStepIndex((i) => Math.max(-1, i - 1))} disabled={stepIndex <= -1} title="Step back"><SkipBack size={16} /></button>
        <button className="lp-mini-btn" onClick={() => setPlaying((p) => !p)} disabled={atEnd && !playing}>
          {playing ? <Pause size={14} /> : <Play size={14} />} {playing ? 'Pause' : atEnd ? 'Finished' : 'Play'}
        </button>
        <button className="lp-icon-btn" onClick={() => setStepIndex((i) => Math.min(trace.length - 1, i + 1))} disabled={atEnd} title="Step forward"><SkipForward size={16} /></button>
        <span className="lp-step-counter">step {stepIndex + 1} / {trace.length}</span>
      </div>
    </div>
  );
}
