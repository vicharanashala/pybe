import { useState, useEffect, useRef, useCallback } from 'react';
import { handleOrionMisfire } from './interceptorEngine';

/**
 * Custom React hook to dynamically load Pyodide v0.25.0 from CDN,
 * store the instance in a useRef, intercept Python stdout/stderr,
 * and manage consoleOutput state with Orion misfire error interceptor.
 */
export function usePyodide() {
  const pyodideRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [consoleOutput, setConsoleOutput] = useState([
    { type: 'system', text: 'Scrying Pool online. Initializing Pyodide WASM Engine (v0.25.0)...' }
  ]);

  useEffect(() => {
    let isMounted = true;

    async function initPyodide() {
      try {
        if (!window.loadPyodide) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/pyodide@0.25.0/pyodide.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Pyodide v0.25.0 from CDN'));
            document.head.appendChild(script);
          });
        }

        const pyodide = await window.loadPyodide({
          indexURL: 'https://unpkg.com/pyodide@0.25.0/',
        });

        if (isMounted) {
          pyodideRef.current = pyodide;
          setIsLoading(false);
          setConsoleOutput((prev) => [
            ...prev,
            { type: 'system', text: '✨ Pyodide WASM Engine v0.25.0 ready.' }
          ]);
        }
      } catch (err) {
        if (isMounted) {
          setIsLoading(false);
          setConsoleOutput((prev) => [
            ...prev,
            { type: 'error', text: `Failed to load Pyodide engine: ${err.message}` }
          ]);
        }
      }
    }

    initPyodide();

    return () => {
      isMounted = false;
    };
  }, []);

  const clearOutput = useCallback(() => {
    setConsoleOutput([]);
  }, []);

  const runPython = useCallback(async (codeString) => {
    if (!pyodideRef.current) {
      setConsoleOutput((prev) => [
        ...prev,
        { type: 'error', text: 'Pyodide engine is still loading. Please wait a moment...' }
      ]);
      return { success: false, output: null };
    }

    const timestamp = new Date().toLocaleTimeString();
    setConsoleOutput((prev) => [
      ...prev,
      { type: 'cast', text: `[${timestamp}] Casting spell into Pyodide...` }
    ]);

    try {
      const stdoutLogs = [];

      // Intercept Python stdout stream
      pyodideRef.current.setStdout({
        batched: (text) => {
          stdoutLogs.push(text);
          setConsoleOutput((prev) => [
            ...prev,
            { type: 'stdout', text }
          ]);
        },
      });

      // Intercept Python stderr stream
      pyodideRef.current.setStderr({
        batched: (text) => { },
      });

      const rawResult = await pyodideRef.current.runPythonAsync(codeString);

      let resultText = stdoutLogs.join('\n').trim();
      if (!resultText && rawResult !== undefined && rawResult !== null) {
        resultText = String(rawResult);
        setConsoleOutput((prev) => [
          ...prev,
          { type: 'stdout', text: resultText }
        ]);
      }

      return {
        success: true,
        output: resultText || '(Spell executed cleanly)',
      };
    } catch (err) {
      const rawError = err.message || String(err);
      const misfire = handleOrionMisfire(rawError, codeString);

      setConsoleOutput((prev) => [
        ...prev,
        { type: 'orion', text: misfire.message },
        { type: 'error', text: `Raw Traceback: ${rawError.split('\n').filter(Boolean).pop() || rawError}` }
      ]);

      return {
        success: false,
        error: misfire.message,
      };
    }
  }, []);

  return {
    runPython,
    consoleOutput,
    isLoading,
    clearOutput,
  };
}
