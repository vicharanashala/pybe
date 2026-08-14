import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Play, Loader, Terminal, RotateCcw } from 'lucide-react';

function PythonSandbox({ initialCode = '', onClose }) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);
  const workerRef = useRef(null);

  useEffect(() => {
    // Initialize Web Worker
    workerRef.current = new Worker('/pyodideWorker.js');
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleRun = useCallback(() => {
    setRunning(true);
    setOutput('');
    setError('');

    const runId = Date.now().toString();

    const handleMessage = (e) => {
      const { id, output, error } = e.data;
      if (id === runId) {
        if (error) setError(error);
        if (output) setOutput(output);
        setRunning(false);
        workerRef.current.removeEventListener('message', handleMessage);
      }
    };

    workerRef.current.addEventListener('message', handleMessage);
    workerRef.current.postMessage({ code, id: runId });

  }, [code]);

  const handleReset = () => {
    setCode(initialCode);
    setOutput('');
    setError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      });
    }
  };

  return (
    <div className="python-sandbox-overlay" onClick={onClose}>
      <div className="python-sandbox" onClick={(e) => e.stopPropagation()}>
        <div className="sandbox-header">
          <div className="sandbox-header-left">
            <Terminal size={18} />
            <strong>Python Sandbox</strong>
            <span className="sandbox-badge">Web Worker Isolated</span>
          </div>
          <button className="sandbox-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="sandbox-body">
          <div className="sandbox-editor-section">
            <label className="sandbox-label">Editor</label>
            <textarea
              ref={textareaRef}
              className="sandbox-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>

          <div className="sandbox-output-section">
            <label className="sandbox-label">Output</label>
            <div className="sandbox-output">
              {error && <pre className="sandbox-error">{error}</pre>}
              {output && <pre className="sandbox-stdout">{output}</pre>}
              {!error && !output && !running && (
                <span className="sandbox-placeholder">
                  Click "Run" to execute your code
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="sandbox-controls">
          <button
            className="sandbox-reset-btn"
            onClick={handleReset}
            disabled={running}
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            className="sandbox-run-btn"
            onClick={handleRun}
            disabled={running}
          >
            {running ? (
              <>
                <Loader size={16} className="spin" /> Running...
              </>
            ) : (
              <>
                <Play size={16} /> Run Code
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PythonSandbox;
