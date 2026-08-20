import React, { useState } from 'react';
import { Play, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { useSharedPyodide } from '../../shared/pyodide/PyodideContext';
import { buildGuardedLoopTracerHarness } from '../data/loopTracerHarness';
import { MISSION } from '../data/spaceRescue';
import MemoryOrbs from './MemoryOrbs';

export default function SpaceRescueMission({ onNext, onCrystal, onStageProgress }) {
  const { status, runHarness } = useSharedPyodide();
  const [stageIndex, setStageIndex] = useState(0);
  const [accumulatedCode, setAccumulatedCode] = useState('');
  const [draft, setDraft] = useState(MISSION.stages[0].placeholder);
  const [result, setResult] = useState(null);
  const [hintShown, setHintShown] = useState(false);
  const [anyHintUsedEver, setAnyHintUsedEver] = useState(false);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  const stage = MISSION.stages[stageIndex];

  async function handleRunCheck() {
    setRunning(true);
    const fullCode = `${accumulatedCode}\n${draft}`;
    const harness = buildGuardedLoopTracerHarness(fullCode);
    const { data, error } = await runHarness(harness);
    if (error) {
      setResult({ passed: false, message: `Robo's magic spell reports an error: ${error}`, globals: {}, output: '' });
      setRunning(false);
      return;
    }
    const lastGlobals = data.trace.length ? data.trace[data.trace.length - 1].globals : {};
    const output = data.trace.map((s) => s.newOutput).join('');
    const outcome = stage.validate(lastGlobals, output, draft);
    setResult({ ...outcome, globals: lastGlobals, output, fullCode });
    if (outcome.passed) {
      // Every completed stage grows the magic spell a little more.
      onStageProgress(stageIndex + 1, MISSION.stages.length);
      if (stageIndex === 0) onCrystal('blue');
    }
    setRunning(false);
  }

  function handleNextStage() {
    setAccumulatedCode(result.fullCode);
    setResult(null);
    if (hintShown) setAnyHintUsedEver(true);
    setHintShown(false);
    if (stageIndex + 1 < MISSION.stages.length) {
      setStageIndex(stageIndex + 1);
      setDraft(MISSION.stages[stageIndex + 1].placeholder);
    } else {
      if (!anyHintUsedEver && !hintShown) onCrystal('purple');
      onCrystal('emerald');
      setFinished(true);
    }
  }

  if (finished) {
    return (
      <div className="lp-scene lp-mission-complete">
        <CheckCircle2 size={36} className="lp-complete-icon" />
        <h2>Garden rescue complete</h2>
        <p className="lp-scene-intro">{MISSION.closing}</p>
        <div className="lp-code-block"><pre>{accumulatedCode.trim()}</pre></div>
        <button className="lp-mini-btn lp-cta" onClick={onNext}>See what you actually just did →</button>
      </div>
    );
  }

  return (
    <div className="lp-scene">
      <div className="lp-mission-progress">
        {MISSION.stages.map((s, i) => (
          <div key={s.id} className={`lp-mission-dot ${i < stageIndex ? 'done' : i === stageIndex ? 'active' : ''}`}>{i + 1}</div>
        ))}
      </div>

      <span className="lp-concept-tag">{stage.concept}</span>
      <h2>{stage.title}</h2>
      <p className="lp-scene-intro">{stage.story}</p>
      <div className="lp-note-card"><strong>Your task</strong><p>{stage.task}</p></div>

      {accumulatedCode && (
        <details className="lp-existing-code">
          <summary>Robo's garden code so far ({stageIndex} stage{stageIndex === 1 ? '' : 's'} locked in)</summary>
          <pre>{accumulatedCode.trim()}</pre>
        </details>
      )}

      <textarea className="lp-code-editor" value={draft} spellCheck={false} onChange={(e) => { setDraft(e.target.value); setResult(null); }} />

      <div className="lp-playground-actions">
        <button className="lp-mini-btn" onClick={handleRunCheck} disabled={status !== 'ready' || running}>
          <Play size={14} /> {running ? 'Checking…' : status !== 'ready' ? 'Starting Python…' : 'Run & check'}
        </button>
        <button className="lp-chip" onClick={() => setHintShown((h) => !h)}>{hintShown ? 'Hide hint' : 'Show hint'}</button>
      </div>

      {hintShown && <p className="lp-hint-text">💡 {stage.hint}</p>}

      {result && (
        <>
          <div className={`lp-quiz-result ${result.passed ? 'pass' : 'fail'}`}>
            {result.passed ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
            <p>{result.message}</p>
          </div>
          {Object.keys(result.globals).length > 0 && <MemoryOrbs globals={result.globals} />}
          {result.passed && (
            <button className="lp-mini-btn lp-cta" onClick={handleNextStage}>
              {stageIndex + 1 < MISSION.stages.length ? 'Lock it in — next stage' : 'Lock it in — complete the mission'} <ChevronRight size={14} />
            </button>
          )}
        </>
      )}
    </div>
  );
}
