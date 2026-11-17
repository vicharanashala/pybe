import { useState, useEffect, useCallback } from 'react';
import type { RunResult, TestResult, CodingTest } from './types';

const PYODIDE_CDN_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js';
const PYODIDE_INDEX_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/';

// Global singletons to prevent multiple loadings
let pyodideInstance: any = null;
let pyodideLoadingPromise: Promise<any> | null = null;

function loadPyodideScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).loadPyodide) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = PYODIDE_CDN_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Python environment script from CDN'));
    document.head.appendChild(script);
  });
}

async function getPyodide(): Promise<any> {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoadingPromise) return pyodideLoadingPromise;

  pyodideLoadingPromise = (async () => {
    await loadPyodideScript();
    const py = await (window as any).loadPyodide({
      indexURL: PYODIDE_INDEX_URL,
    });
    pyodideInstance = py;
    return py;
  })();

  return pyodideLoadingPromise;
}

export function usePython() {
  const [isLoading, setIsLoading] = useState<boolean>(!pyodideInstance);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (pyodideInstance) {
      setIsLoading(false);
      return;
    }

    getPyodide()
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        setLoadError(err.message || 'Failed to initialize Python environment');
        setIsLoading(false);
      });
  }, []);

  const runPython = useCallback(async (code: string): Promise<RunResult> => {
    try {
      const py = await getPyodide();

      // Set up stdout/stderr redirect inside Python
      await py.runPythonAsync(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);

      // Execute code
      await py.runPythonAsync(code);

      // Extract outputs
      const stdout = py.runPython(`sys.stdout.getvalue()`);
      const stderr = py.runPython(`sys.stderr.getvalue()`);

      return {
        stdout: stdout + (stderr ? '\n' + stderr : ''),
        error: null,
        success: true,
      };
    } catch (err: any) {
      // Even if there is an error, try to extract whatever stdout was printed before the error
      let stdout = '';
      try {
        const py = await getPyodide();
        stdout = py.runPython(`sys.stdout.getvalue()`);
      } catch (_) {}

      // Clean up error message
      let errMsg = err.message || String(err);
      if (errMsg.includes('PythonError:')) {
        const parts = errMsg.split('PythonError:');
        errMsg = parts[parts.length - 1].trim();
      }

      return {
        stdout,
        error: errMsg,
        success: false,
      };
    }
  }, []);

  const verifyCode = useCallback(
    async (code: string, tests: CodingTest[]): Promise<{ success: boolean; results: TestResult[] }> => {
      // 1. Run main user code first to populate globals/functions
      const runRes = await runPython(code);
      if (runRes.error && !runRes.success) {
        return {
          success: false,
          results: tests.map((t) => ({
            description: t.description,
            passed: false,
            error: runRes.error,
          })),
        };
      }

      const results: TestResult[] = [];
      let allPassed = true;
      const py = await getPyodide();

      for (const test of tests) {
        if (test.expectedStdout !== undefined) {
          const match = runRes.stdout.trim() === test.expectedStdout.trim();
          if (!match) allPassed = false;
          results.push({
            description: test.description,
            passed: match,
            error: match
              ? null
              : `Expected output: "${test.expectedStdout.trim()}", got: "${runRes.stdout.trim()}"`,
          });
        } else if (test.testCode) {
          try {
            await py.runPythonAsync(test.testCode);
            results.push({
              description: test.description,
              passed: true,
              error: null,
            });
          } catch (err: any) {
            allPassed = false;
            let errMsg = err.message || String(err);
            if (errMsg.includes('AssertionError:')) {
              const parts = errMsg.split('AssertionError:');
              errMsg = parts[parts.length - 1].trim();
            } else if (errMsg.includes('PythonError:')) {
              const parts = errMsg.split('PythonError:');
              errMsg = parts[parts.length - 1].trim();
            }
            results.push({
              description: test.description,
              passed: false,
              error: errMsg,
            });
          }
        }
      }

      return {
        success: allPassed,
        results,
      };
    },
    [runPython]
  );

  return {
    isLoading,
    loadError,
    runPython,
    verifyCode,
  };
}
export default usePython;
