/**
 * PyodideRunner — GoF Adapter over Pyodide.
 *
 * INV-A5: ALL Pyodide access goes through this file. UI depends on the
 * PythonRunner interface, not on Pyodide directly.
 *
 * INV-PB-7: code execution is available on every /learn route.
 * INV-I4: code is always runnable. Errors surfaced (INV-P6).
 *
 * Lazy-loads Pyodide from the official CDN on first `load()`. The Pyodide
 * runtime (~6 MB) never enters the JS bundle — it is fetched at runtime.
 * Therefore the landing-page bundle is unaffected (PyodideRunner is only
 * imported from TryItEditor, which is only on /learn/*).
 *
 * Cancellation is implemented via `pyodide.setInterruptBuffer` so a
 * 1-minute `while True: pass` loop can be killed from the UI.
 */

import type { PythonRunner, RunResult } from './PythonRunner.ts';

/* Pyodide's public types — declared as `unknown` shape so we don't
 * pull in their TS definitions (they aren't shipped with the CDN bundle). */
interface PyodideLike {
  runPythonAsync(code: string): Promise<unknown>;
  setStdout(opts: { batched: (s: string) => void }): void;
  setStderr(opts: { batched: (s: string) => void }): void;
  setInterruptBuffer(buf: Int32Array): void;
}

interface PyodideGlobal {
  loadPyodide: (opts: { indexURL: string }) => Promise<PyodideLike>;
}

declare global {
  interface Window {
    loadPyodide?: PyodideGlobal['loadPyodide'];
  }
}

const PYODIDE_VERSION = '0.26.4';
const PYODIDE_INDEX = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
const PYODIDE_LOADER = `${PYODIDE_INDEX}pyodide.js`;
const DEFAULT_TIMEOUT_MS = 10_000;
const INTERRUPT_SIGNAL = 2;

export class PyodideRunner implements PythonRunner {
  private loadPromise: Promise<PyodideLike> | null = null;
  private pyodide: PyodideLike | null = null;
  private interruptBuffer: Int32Array | null = null;
  private running: boolean = false;
  private lastLoadTimeMs: number | null = null;

  /**
   * Lazy-load Pyodide. Idempotent. INV-PB-7 lazy-load requirement.
   */
  async load(): Promise<void> {
    if (this.pyodide) return;
    if (!this.loadPromise) {
      this.loadPromise = this.doLoad();
    }
    await this.loadPromise;
  }

  private async doLoad(): Promise<PyodideLike> {
    const t0 = performance.now();
    if (typeof window === 'undefined') {
      throw new Error('PyodideRunner can only run in a browser context');
    }
    // Inject the Pyodide loader script once.
    await this.injectLoaderScript();
    if (!window.loadPyodide) {
      throw new Error('pyodide.js did not register window.loadPyodide');
    }
    const pyodide = await window.loadPyodide({ indexURL: PYODIDE_INDEX });
    this.pyodide = pyodide;
    this.lastLoadTimeMs = Math.round(performance.now() - t0);
    return pyodide;
  }

  private injectLoaderScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // If already injected, resolve immediately.
      if (document.querySelector(`script[data-pyodide-loader="true"]`)) {
        // Wait until window.loadPyodide is available, or already is.
        if (window.loadPyodide) {
          resolve();
          return;
        }
        const interval = window.setInterval(() => {
          if (window.loadPyodide) {
            window.clearInterval(interval);
            resolve();
          }
        }, 50);
        // Cap the wait at 60 seconds.
        window.setTimeout(() => {
          window.clearInterval(interval);
          reject(new Error('Pyodide loader script load timeout'));
        }, 60_000);
        return;
      }
      const script = document.createElement('script');
      script.src = PYODIDE_LOADER;
      script.async = true;
      script.dataset['pyodideLoader'] = 'true';
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error(`Failed to load Pyodide from ${PYODIDE_LOADER}`));
      document.head.appendChild(script);
    });
  }

  /** Test/inspection only — milliseconds spent on the initial load. */
  getLoadTime(): number | null {
    return this.lastLoadTimeMs;
  }

  async run(code: string): Promise<RunResult> {
    await this.load();
    if (!this.pyodide) {
      throw new Error('PyodideRunner.load() did not initialize the runtime');
    }

    let stdout = '';
    let stderr = '';
    this.pyodide.setStdout({
      batched: (s: string) => {
        stdout += s + '\n';
      },
    });
    this.pyodide.setStderr({
      batched: (s: string) => {
        stderr += s + '\n';
      },
    });

    // Wire the interrupt buffer so cancel() can raise KeyboardInterrupt.
    this.interruptBuffer = new Int32Array(1);
    this.pyodide.setInterruptBuffer(this.interruptBuffer);

    const t0 = performance.now();
    this.running = true;
    let timedOut = false;
    let cancelled = false;
    try {
      await Promise.race([
        this.pyodide.runPythonAsync(code),
        new Promise<never>((_, reject) =>
          window.setTimeout(() => {
            timedOut = true;
            this.cancel();
            reject(new Error(`Execution timed out after ${DEFAULT_TIMEOUT_MS} ms`));
          }, DEFAULT_TIMEOUT_MS),
        ),
      ]);
      return { stdout, stderr, ok: true, ms: Math.round(performance.now() - t0) };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      // Detect user-initiated cancel (a KeyboardInterrupt surfaces in the
      // traceback). Heuristic: if the user pressed Stop, our cancel() ran
      // and the runtime raised. We tag the result as cancelled.
      if (this.interruptBuffer?.[0] === INTERRUPT_SIGNAL && !timedOut) {
        cancelled = true;
      }
      return {
        stdout,
        stderr: stderr + (stderr.endsWith('\n') ? '' : '\n') + message,
        ok: false,
        ms: Math.round(performance.now() - t0),
        cancelled,
        timedOut,
      };
    } finally {
      this.running = false;
    }
  }

  cancel(): void {
    if (this.interruptBuffer && this.running) {
      this.interruptBuffer[0] = INTERRUPT_SIGNAL;
    }
  }

  /** True if a run is currently in progress. */
  isRunning(): boolean {
    return this.running;
  }
}