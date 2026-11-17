import { useCallback, useEffect, useRef, useState } from 'react';

// Some browsers still cannot construct `new Worker(url, { type: 'module' })`.
// Probing the getter tells us before we try, so the UI can say something useful
// instead of showing a runtime that never becomes ready.
function supportsModuleWorkers() {
  let supported = false;
  try {
    new Worker('data:text/javascript,', { get type() { supported = true; return 'module'; } }).terminate();
  } catch {
    // ignore — `supported` above already tells us what we need
  }
  return supported;
}

// A learner's mistake can genuinely hang: `while True:` with no exit. The Python
// harness carries its own step ceiling, but a hang inside Pyodide's own machinery
// would sit below that, so the JS side keeps a hard wall-clock stop as well and
// replaces the worker afterwards (a terminated worker cannot be reused).
const RUN_TIMEOUT_MS = 15000;

export function usePyodide() {
  const workerRef = useRef(null);
  const runIdRef = useRef(0);
  const [status, setStatus] = useState('loading');
  const [errorDetail, setErrorDetail] = useState(null);
  const [running, setRunning] = useState(false);

  const spawnWorker = useCallback(() => {
    let worker;
    try {
      worker = new Worker(new URL('./pyodideWorker.js', import.meta.url), { type: 'module' });
    } catch (error) {
      setStatus('error');
      setErrorDetail(`Could not create the Python worker: ${error.message}`);
      return null;
    }
    worker.onmessage = (event) => {
      const { kind, error } = event.data;
      if (kind === 'ready') setStatus('ready');
      if (kind === 'loading') setStatus('loading');
      if (kind === 'init-error') {
        setStatus('error');
        setErrorDetail(error || 'Unknown error while starting the Python runtime.');
      }
    };
    worker.onerror = (event) => {
      setStatus('error');
      setErrorDetail(
        event.message ||
          'The Python worker crashed while loading. This is usually a blocked CDN request — check your network, ad-blocker, or browser extensions.'
      );
    };
    workerRef.current = worker;
    return worker;
  }, []);

  useEffect(() => {
    if (typeof Worker === 'undefined' || !supportsModuleWorkers()) {
      setStatus('error');
      setErrorDetail(
        'This browser does not support module Web Workers, which the Python runtime needs. Try a recent version of Chrome, Edge, Firefox, or Safari.'
      );
      return undefined;
    }
    const worker = spawnWorker();
    return () => worker?.terminate();
  }, [spawnWorker]);

  const run = useCallback((code) => {
    return new Promise((resolve) => {
      const worker = workerRef.current;
      if (!worker) {
        resolve({ output: '', error: 'The Python runtime is not ready yet.', returnValue: null });
        return;
      }
      const id = ++runIdRef.current;
      let output = '';
      let runError = null;
      let returnValue = null;
      let settled = false;
      setRunning(true);

      const timer = setTimeout(() => {
        worker.terminate();
        setStatus('loading');
        spawnWorker();
        finish('Your code was still running after 15 seconds, so the farm stopped it. Check for a loop that never ends.');
      }, RUN_TIMEOUT_MS);

      function finish(forcedError) {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        worker.removeEventListener('message', handleMessage);
        setRunning(false);
        resolve({ output, error: forcedError ?? runError, returnValue });
      }

      function handleMessage(event) {
        const msg = event.data;
        if (msg.id !== id) return;
        if (msg.kind === 'stdout' || msg.kind === 'stderr') output += `${msg.msg}\n`;
        else if (msg.kind === 'error') { runError = msg.error; finish(); }
        else if (msg.kind === 'done') { returnValue = msg.returnValue; finish(); }
      }

      worker.addEventListener('message', handleMessage);
      worker.postMessage({ id, code });
    });
  }, [spawnWorker]);

  // Every farm harness ends in a `json.dumps(...)` expression, so its result comes
  // back as the run's return value. This unwraps that one convention in a single
  // place; callers get parsed data or a readable reason why they did not.
  const runJSON = useCallback(async (harnessCode) => {
    const result = await run(harnessCode);
    if (result.error) return { data: null, error: result.error };
    try {
      return { data: JSON.parse(result.returnValue), error: null };
    } catch {
      return { data: null, error: 'The farm could not read the result of that run. Please try again.' };
    }
  }, [run]);

  return { status, running, run, runJSON, errorDetail };
}
