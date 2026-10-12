/**
 * PythonRunner interface — invariant: ALL Python execution in Pybe goes
 * through this interface. INV-A5 (DIP) — the UI depends on the interface,
 * not on PyodideRunner directly. This is the GoF Adapter pattern.
 *
 * Tests inject a MockRunner; production wires PyodideRunner.
 */
export interface RunResult {
  stdout: string;
  stderr: string;
  ok: boolean;
  ms: number;
  /** Set true when the user clicked Stop (vs. natural completion or timeout). */
  cancelled?: boolean;
  /** Set true when the run exceeded the runner's timeout. */
  timedOut?: boolean;
}

export interface PythonRunner {
  /**
   * Lazily load the runtime. Subsequent calls return the cached promise
   * (no re-download). Throws only on fatal load failure.
   */
  load(): Promise<void>;

  /** Run code. Resolves with a RunResult even on failure (does not throw). */
  run(code: string): Promise<RunResult>;

  /** Interrupt the currently-running execution (no-op if not running). */
  cancel(): void;
}

export class PythonRunnerNotLoadedError extends Error {
  constructor() {
    super('PythonRunner.run() called before load(). Call load() first.');
    this.name = 'PythonRunnerNotLoadedError';
  }
}