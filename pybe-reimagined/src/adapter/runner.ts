/**
 * Module-level runner singleton with a test seam.
 *
 * Production code calls `getRunner()` and never imports `PyodideRunner`
 * directly. Tests use `setRunnerForTesting()` to swap in `MockRunner`.
 *
 * INV-A5 (DIP): UI code depends only on the PythonRunner interface.
 */

import type { PythonRunner } from './PythonRunner.ts';
import { PyodideRunner } from './PyodideRunner.ts';

let runner: PythonRunner = new PyodideRunner();

export function getRunner(): PythonRunner {
  return runner;
}

/**
 * Replace the runner. Tests-only. Production code should never call this.
 */
export function setRunnerForTesting(r: PythonRunner | null): void {
  runner = r ?? new PyodideRunner();
}