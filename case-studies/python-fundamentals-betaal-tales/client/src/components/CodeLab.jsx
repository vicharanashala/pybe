import {cancelPython} from '../../../../../library/learning/python-client.mjs';
import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Lightbulb, Play, RotateCcw, Shuffle, TerminalSquare } from 'lucide-react';
import { checkResult } from '../lib/progress';

export default function CodeLab({
  title,
  instruction,
  starterCode,
  hint,
  check,
  onSuccess,
  onRegenerate
}) {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [passed, setPassed] = useState(false);
  const runIdRef = useRef(0);
  useEffect(()=>()=>{runIdRef.current+=1;cancelPython();},[]);

  async function run() {
    if (passed || status==='running') return;
    if (!code.trim()) {
      setStatus('fail');
      setMessage('Write some Python first, then press Run.');
      setOutput('');
      return;
    }
    const id = ++runIdRef.current;
    setStatus('running');
    setOutput('');
    setMessage('');
    try {
      const result = await checkResult(code, check);
      if (id !== runIdRef.current) return;
      setOutput(result.output || '');
      setStatus(result.passed ? 'pass' : 'fail');
      setMessage(result.message || '');
      if (result.passed && !passed) {
        setPassed(true);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      if (id !== runIdRef.current) return;
      setStatus('fail');
      setMessage(String((error && error.message) || error));
    }
  }

  function reset() {
    runIdRef.current += 1;
    setOutput('');
    setMessage('');
    setPassed(false);
    setStatus('idle');
    setShowHint(false);
    if (onRegenerate) {
      onRegenerate();
    } else {
      setCode(starterCode);
    }
  }

  const cannotRun = passed || status==='running';

  return (
    <section className="codelab" aria-label={title}>
      <header className="codelab-header">
        <TerminalSquare size={20} aria-hidden="true" />
        <div>
          <h3>{title}</h3>
        </div>
        {passed && (
          <span className="chip chip-pass">
            <CheckCircle2 size={14} aria-hidden="true" /> Complete
          </span>
        )}
      </header>

      <p className="codelab-instruction">{instruction}</p>



      <div className="codelab-editor">
        <textarea
          className="code-input"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          disabled={status==='running'}
          onKeyDown={(event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
              event.preventDefault();
              run();
            }
          }}
          spellCheck="false"
          aria-label="Python code editor"
          rows={Math.max(6, code.split('\n').length)}
          wrap="off"
        />
      </div>

      <div className="codelab-actions">
        <button type="button" className="btn btn-primary" onClick={run} disabled={cannotRun}>
          <Play size={16} aria-hidden="true" />
          {status === 'running' ? 'Running…' : 'Run code'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={reset} disabled={status==='running'}>
          <RotateCcw size={16} aria-hidden="true" /> Reset
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setShowHint((current) => !current)}
          aria-expanded={showHint}
        >
          <Lightbulb size={16} aria-hidden="true" /> Hint
        </button>
        {onRegenerate && (
          <button type="button" className="btn btn-ghost" onClick={reset} disabled={status==='running'}>
            <Shuffle size={16} aria-hidden="true" /> Try another
          </button>
        )}
        <span className="codelab-shortcut">Tip: press Ctrl + Enter to run</span>
      </div>

      {showHint && <div className="hint">💡 {hint}</div>}

      <div className="codelab-output" aria-live="polite">
        <div className="codelab-output-label">Output</div>
        <pre className={status === 'fail' ? 'output error' : 'output'}>{output || '…'}</pre>
      </div>

      {status === 'pass' && (
        <div className="result-banner result-pass" role="status">
          <CheckCircle2 size={22} aria-hidden="true" />
          <div>
            <strong>Well done, learner!</strong>
            <p>{message}</p>
          </div>
        </div>
      )}
      {status === 'fail' && (
        <div className="result-banner result-fail" role="status">
          <strong>Not quite yet.</strong>
          <p>{message}</p>
        </div>
      )}
    </section>
  );
}
