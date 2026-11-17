// ─── Pyodide singleton loads once per browser session ───────────────────────
let _pyodideInstance = null;
let _loadPromise = null;

function getPyodide() {
  if (_pyodideInstance) return Promise.resolve(_pyodideInstance);
  if (_loadPromise) return _loadPromise;

  _loadPromise = (async () => {
    if (!window.loadPyodide) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load Pyodide from CDN.'));
        document.head.appendChild(script);
      });
    }
    _pyodideInstance = await window.loadPyodide();
    return _pyodideInstance;
  })();

  return _loadPromise;
}

import { useState, useEffect } from 'react';

/**
 * usePyodide lazy-loads Pyodide and returns { pyodide, loading, error }.
 * The singleton ensures Pyodide is only downloaded once per session.
 */
export function usePyodide() {
  const [pyodide, setPyodide] = useState(_pyodideInstance);
  const [loading, setLoading] = useState(!_pyodideInstance);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (_pyodideInstance) { setPyodide(_pyodideInstance); setLoading(false); return; }
    setLoading(true);
    getPyodide()
      .then((p) => { setPyodide(p); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  return { pyodide, loading, error };
}

/**
 * runPython executes code in Pyodide, captures stdout.
 * Injects stubs so fictional PyBe APIs (get_coin_inserted, ask_for_pin) work.
 * Returns { output, error }.
 */
export async function runPython(pyodide, code) {
  try {
    pyodide.runPython(`import sys, io as _io\n_pybe_buf = _io.StringIO()\nsys.stdout = _pybe_buf`);

    const stubs = `
_coins = [5, 10, 2, 3]
_coin_idx = 0
def get_coin_inserted():
    global _coin_idx
    val = _coins[_coin_idx % len(_coins)]
    _coin_idx += 1
    return val

correct_pin = 1234
_pins = [9999, 0000, 1234, 1234]
_pin_idx = 0
def ask_for_pin():
    global _pin_idx
    val = _pins[_pin_idx % len(_pins)]
    _pin_idx += 1
    return val
`;
    await pyodide.runPythonAsync(stubs + '\n' + code);

    const output = pyodide.runPython(`sys.stdout = sys.__stdout__\n_pybe_buf.getvalue()`);
    return { output: output || '(no output)', error: null };
  } catch (err) {
    try { pyodide.runPython('import sys; sys.stdout = sys.__stdout__'); } catch (_) {}
    return { output: null, error: err.message };
  }
}
