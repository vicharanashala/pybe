import { useRef, useState, useCallback } from "react";

declare global {
  interface Window {
    loadPyodide?: (config?: { indexURL: string }) => Promise<any>;
  }
}

const PYODIDE_VERSION = "0.26.2";
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodideLoadPromise: Promise<any> | null = null;

function loadPyodideScript(): Promise<void> {
  if (window.loadPyodide) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${PYODIDE_CDN}pyodide.js"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.src = `${PYODIDE_CDN}pyodide.js`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Pyodide from CDN"));
    document.head.appendChild(script);
  });
}

async function getPyodide() {
  if (!pyodideLoadPromise) {
    pyodideLoadPromise = (async () => {
      await loadPyodideScript();
      return window.loadPyodide!({ indexURL: PYODIDE_CDN });
    })();
  }
  return pyodideLoadPromise;
}

export interface RunResult {
  output: string;
  error: string | null;
}

export function usePythonRunner() {
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const pyodideRef = useRef<any>(null);

  const ensureReady = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setIsLoading(true);
    try {
      const pyodide = await getPyodide();
      pyodideRef.current = pyodide;
      setIsReady(true);
      return pyodide;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const run = useCallback(
    async (code: string): Promise<RunResult> => {
      const pyodide = await ensureReady();
      let output = "";

      pyodide.setStdout({
        batched: (msg: string) => {
          output += msg + "\n";
        },
      });
      pyodide.setStderr({
        batched: (msg: string) => {
          output += msg + "\n";
        },
      });

      try {
        await pyodide.runPythonAsync(code);
        return { output: output.trimEnd(), error: null };
      } catch (err: any) {
        return { output: output.trimEnd(), error: err?.message ?? String(err) };
      }
    },
    [ensureReady]
  );

  return { run, isLoading, isReady };
}