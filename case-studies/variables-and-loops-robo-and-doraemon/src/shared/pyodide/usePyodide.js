import { useCallback, useEffect, useRef, useState } from 'react';

function supportsModuleWorkers() {
  let supported = false;
  try {
    new Worker('data:text/javascript,', { get type() { supported = true; return 'module'; } }).terminate();
  } catch {
    // ignore — `supported` above already tells us what we need
  }
  return supported;
}

export function usePyodide() {
  const workerRef = useRef(null);
  const runIdRef = useRef(0);
  const [status, setStatus] = useState('loading');
  const [errorDetail, setErrorDetail] = useState(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (typeof Worker === 'undefined' || !supportsModuleWorkers()) {
      setStatus('error');
      setErrorDetail('This browser does not support module Web Workers, which the Python runtime needs. Try a recent version of Chrome, Edge, Firefox, or Safari.');
      return undefined;
    }
    let worker;
    try {
      worker = new Worker(new URL('./pyodideWorker.js', import.meta.url), { type: 'module' });
    } catch (error) {
      setStatus('error');
      setErrorDetail(`Could not create the Python worker: ${error.message}`);
      return undefined;
    }
    workerRef.current = worker;
    worker.onmessage = (event) => {
      const { kind, error } = event.data;
      if (kind === 'ready') setStatus('ready');
      if (kind === 'loading') setStatus('loading');
      if (kind === 'init-error') { setStatus('error'); setErrorDetail(error || 'Unknown error while starting the Python runtime.'); }
    };
    worker.onerror = (event) => {
      setStatus('error');
      setErrorDetail(event.message || 'The Python worker crashed while loading (often a blocked CDN request — check network/ad-blocker/browser extensions).');
    };
    return () => worker.terminate();
  }, []);

  const run = useCallback((code) => {
    return new Promise((resolve) => {
      const worker = workerRef.current;
      if (!worker) return resolve({ output: '', error: 'Python runtime not ready yet.', returnValue: null });
      const id = ++runIdRef.current;
      let output = '';
      let runError = null;
      let returnValue = null;
      setRunning(true);

      function handleMessage(event) {
        const msg = event.data;
        if (msg.id !== id) return;
        if (msg.kind === 'stdout' || msg.kind === 'stderr') output += `${msg.msg}\n`;
        else if (msg.kind === 'error') { runError = msg.error; finish(); }
        else if (msg.kind === 'done') { returnValue = msg.returnValue; finish(); }
      }
      function finish() {
        worker.removeEventListener('message', handleMessage);
        setRunning(false);
        resolve({ output, error: runError, returnValue });
      }
      worker.addEventListener('message', handleMessage);
      worker.postMessage({ id, code });
    });
  }, []);

  // Runs code wrapped in a harness and parses the JSON it returns as its final
  // expression — used by any per-module tracer (recursion's call-stack tracer keeps its
  // own copy of this pattern; Variables' memory-state tracer uses this shared one).
  const runHarness = useCallback(async (harnessCode) => {
    const result = await run(harnessCode);
    if (result.error) return { data: null, error: result.error };
    try {
      const parsed = JSON.parse(result.returnValue);
      if (parsed.error) return { data: null, error: parsed.error };
      return { data: parsed, error: null };
    } catch {
      return { data: null, error: 'Could not read the execution trace — check your code runs without errors.' };
    }
  }, [run]);

  return { status, running, run, runHarness, errorDetail };
}
