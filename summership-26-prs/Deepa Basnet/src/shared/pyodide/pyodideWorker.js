// Runs real Python (CPython compiled to WebAssembly) off the main thread, so a
// learner's slow or runaway program never freezes the farm UI.
//
// Ported from the Pyodide-in-a-module-worker pattern already established in the
// PyBe repository (summership-26-prs/Mahi Agarwal/src/shared/pyodide/) rather
// than inventing a second execution mechanism. The module-worker + pyodide.mjs
// import combination is Pyodide's own documented worker setup, and it depends on
// vite.config.js setting `worker.format: 'es'`.
import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.mjs';

const INDEX_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';

async function initPyodide() {
  self.postMessage({ kind: 'loading' });
  try {
    const pyodide = await loadPyodide({ indexURL: INDEX_URL });
    self.postMessage({ kind: 'ready' });
    return pyodide;
  } catch (error) {
    self.postMessage({ kind: 'init-error', error: `${error.name}: ${error.message}` });
    throw error;
  }
}

const pyodideReadyPromise = initPyodide();

self.onmessage = async (event) => {
  const { id, code } = event.data;

  let pyodide;
  try {
    pyodide = await pyodideReadyPromise;
  } catch {
    self.postMessage({ id, kind: 'error', error: 'The Python runtime failed to start.' });
    return;
  }

  try {
    // The farm harness captures the learner's own stdout itself and hands it back
    // inside its JSON result. Anything that reaches these hooks is therefore output
    // from the harness rather than the learner, so it is only forwarded for debugging.
    pyodide.setStdout({ batched: (msg) => self.postMessage({ id, kind: 'stdout', msg }) });
    pyodide.setStderr({ batched: (msg) => self.postMessage({ id, kind: 'stderr', msg }) });
    const returnValue = await pyodide.runPythonAsync(code);
    const serialized = returnValue === undefined || returnValue === null ? null : String(returnValue);
    self.postMessage({ id, kind: 'done', returnValue: serialized });
  } catch (error) {
    // A harness-level failure (not the learner's SyntaxError — the harness catches
    // that and reports it as data). This means the harness itself broke.
    self.postMessage({ id, kind: 'error', error: error.message || String(error) });
  }
};
