import { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    loadPyodide?: any;
    pyodideInstance?: any;
  }
}

export function usePythonRuntime() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pyodideRef = useRef<any>(null);

  useEffect(() => {
    // Check if already loaded
    if (window.pyodideInstance) {
      pyodideRef.current = window.pyodideInstance;
      setIsReady(true);
      return;
    }

    const loadPyodideScript = async () => {
      setIsLoading(true);
      try {
        // 1. Inject script if not present
        if (!document.getElementById('pyodide-cdn-script')) {
          const script = document.createElement('script');
          script.id = 'pyodide-cdn-script';
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
          script.async = true;
          document.body.appendChild(script);

          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load Python Wasm runtime script.'));
          });
        }

        // Wait for the window.loadPyodide function to be defined, with retries
        const waitForLoadPyodide = async (): Promise<any> => {
          if (window.loadPyodide) return window.loadPyodide;
          return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
              if (window.loadPyodide) {
                clearInterval(interval);
                resolve(window.loadPyodide);
              }
            }, 100);
            
            // Timeout after 10 seconds
            setTimeout(() => {
              clearInterval(interval);
              if (window.loadPyodide) {
                resolve(window.loadPyodide);
              } else {
                reject(new Error('Pyodide global not found after script load.'));
              }
            }, 10000);
          });
        };

        // 2. Initialize loadPyodide
        const loadPy = await waitForLoadPyodide();
        const py = await loadPy({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
        });
        pyodideRef.current = py;
        window.pyodideInstance = py;
        setIsReady(true);
      } catch (err: any) {
        console.error('Pyodide initialization failed:', err);
        setError(err.message || 'Error loading Python runtime.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPyodideScript();
  }, []);

  const runPythonCode = async (code: string): Promise<{ stdout: string; stderr: string; success: boolean }> => {
    if (!pyodideRef.current) {
      return { stdout: '', stderr: 'Python engine is not ready.', success: false };
    }

    try {
      // Set up sys.stdout capture in Pyodide
      const setupCode = `
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`;
      await pyodideRef.current.runPythonAsync(setupCode);

      // Run user code
      await pyodideRef.current.runPythonAsync(code);

      // Extract results
      const stdout = await pyodideRef.current.runPythonAsync('sys.stdout.getvalue()');
      const stderr = await pyodideRef.current.runPythonAsync('sys.stderr.getvalue()');

      return {
        stdout: stdout || '',
        stderr: stderr || '',
        success: !stderr,
      };
    } catch (err: any) {
      // If error occurs, extract python traceback or message
      return {
        stdout: '',
        stderr: err.message || 'Execution error',
        success: false,
      };
    }
  };

  return { isReady, isLoading, error, runPythonCode };
}
