/**
 * MockRunner — test double. Returns deterministic results; tracks runs
 * for assertions. INV-A5 verified: tests depend only on PythonRunner.
 */
import type { PythonRunner, RunResult } from './PythonRunner.ts';

export interface MockRunnerScript {
  code: string;
  stdout?: string;
  stderr?: string;
  ok?: boolean;
  delayMs?: number;
  /** If set, throw this error from the run() promise (simulates a thrown error). */
  throwWith?: Error;
}

export class MockRunner implements PythonRunner {
  /** When set, run() returns this result regardless of input. */
  public next: RunResult | null = null;
  /** When set, run() reads from a script and returns scripted output. */
  public script: MockRunnerScript[] = [];
  /** Last code argument passed to run(). */
  public lastRunCode: string | null = null;
  /** Count of run() calls. */
  public callCount: number = 0;
  /** Count of load() calls. */
  public loadCount: number = 0;
  /** Count of cancel() calls. */
  public cancelCount: number = 0;
  /** Always-loaded flag. If true, load() is a no-op. */
  public alreadyLoaded: boolean = true;

  async load(): Promise<void> {
    this.loadCount += 1;
    return Promise.resolve();
  }

  async run(code: string): Promise<RunResult> {
    this.lastRunCode = code;
    this.callCount += 1;

    if (this.next) {
      const r = this.next;
      this.next = null;
      return r;
    }

    if (this.script.length > 0) {
      const entry = this.script.shift()!;
      if (entry.throwWith) throw entry.throwWith;
      if (entry.delayMs) await new Promise((r) => setTimeout(r, entry.delayMs));
      return {
        stdout: entry.stdout ?? '',
        stderr: entry.stderr ?? '',
        ok: entry.ok ?? true,
        ms: entry.delayMs ?? 0,
      };
    }

    // Default: echo.
    return { stdout: `echo: ${code}`, stderr: '', ok: true, ms: 0 };
  }

  cancel(): void {
    this.cancelCount += 1;
  }
}