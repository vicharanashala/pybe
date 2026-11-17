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

import { useEffect, useState } from 'react';

export function usePyodide() {
  const [pyodide, setPyodide] = useState(_pyodideInstance);
  const [loading, setLoading] = useState(!_pyodideInstance);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (_pyodideInstance) {
      setPyodide(_pyodideInstance);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getPyodide()
      .then((instance) => {
        if (!cancelled) {
          setPyodide(instance);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Could not load Pyodide');
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { pyodide, loading, error };
}
