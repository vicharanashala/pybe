// Runs actual Python (via WebAssembly) off the main thread. Module worker + pyodide.mjs
// import, matching the current Pyodide release's documented worker pattern (verified
// against the live npm registry: dist-tag "latest" = v314.0.2, and against Vite's worker
// bundling behavior — see ../../../vite.config.js for why `worker.format: 'es'` matters).
//
// This is a shared copy used by every module EXCEPT Recursion, which intentionally keeps
// its own local copy (client/src/recursion/workers/pyodideWorker.js) untouched, per the
// instruction to leave that module exactly as it is.
import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v314.0.2/full/pyodide.mjs';

let pyodideReadyPromise = null;

async function initPyodide() {
  self.postMessage({ kind: 'loading' });
  try {
    const pyodide = await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v314.0.2/full/' });
    self.postMessage({ kind: 'ready' });
    return pyodide;
  } catch (error) {
    self.postMessage({ kind: 'init-error', error: `${error.name}: ${error.message}` });
    throw error;
  }
}

pyodideReadyPromise = initPyodide();

self.onmessage = async (event) => {
  const { id, code } = event.data;

  let pyodide;
  try {
    pyodide = await pyodideReadyPromise;
  } catch {
    self.postMessage({ id, kind: 'error', error: 'Python runtime failed to start — see init-error above.' });
    return;
  }

  try {
    pyodide.setStdout({ batched: (msg) => self.postMessage({ id, kind: 'stdout', msg }) });
    pyodide.setStderr({ batched: (msg) => self.postMessage({ id, kind: 'stderr', msg }) });
    await pyodide.loadPackagesFromImports(code);
    const returnValue = await pyodide.runPythonAsync(code);
    const serialized = returnValue === undefined || returnValue === null ? null : String(returnValue);
    self.postMessage({ id, kind: 'done', returnValue: serialized });
  } catch (error) {
    self.postMessage({ id, kind: 'error', error: error.message || String(error) });
  }
};
