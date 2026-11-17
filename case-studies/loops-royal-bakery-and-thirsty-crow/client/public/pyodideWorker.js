// pyodideWorker.js
const PYODIDE_VERSION = '0.27.7';

importScripts(`https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`);

let pyodideInstance = null;
let pyodideLoading = null;

async function loadPyodideRuntime() {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoading) return pyodideLoading;

  pyodideLoading = new Promise(async (resolve, reject) => {
    try {
      const pyodide = await loadPyodide({
        indexURL: `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`,
      });
      pyodideInstance = pyodide;
      resolve(pyodide);
    } catch (err) {
      pyodideLoading = null;
      reject(err);
    }
  });

  return pyodideLoading;
}

self.onmessage = async (event) => {
  const { code, id } = event.data;

  try {
    const pyodide = await loadPyodideRuntime();

    // Clean up namespace from previous runs
    pyodide.runPython(`
import sys as _sys
_keep = set(dir()) | {'_sys', '_keep'}
for _name in list(dir()):
    if _name not in _keep and not _name.startswith('_'):
        try:
            delattr(_sys.modules['__main__'], _name)
        except:
            pass
del _keep, _name
    `);

    // Redirect stdout/stderr to capture print() output
    pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
    `);

    let error = null;
    try {
      await pyodide.runPythonAsync(code);
    } catch (pyErr) {
      const stderrOutput = pyodide.runPython('sys.stderr.getvalue()');
      error = stderrOutput || pyErr.message;
    }

    const stdoutOutput = pyodide.runPython('sys.stdout.getvalue()');
    const output = stdoutOutput || (error ? '' : '(No output)');

    // Reset stdout/stderr
    pyodide.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
    `);

    self.postMessage({ id, output, error });
  } catch (err) {
    self.postMessage({ id, error: err.message || 'Worker initialization failed' });
  }
};
