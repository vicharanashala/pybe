import { describe, it, expect } from 'vitest';
import type { PythonRunner, RunResult } from '../../src/adapter/PythonRunner.ts';
import { MockRunner } from '../../src/adapter/MockRunner.ts';

/**
 * The PythonRunner interface is the contract that TryItEditor depends on.
 * Tests pin down the contract via the MockRunner so that production
 * implementations (PyodideRunner) are guaranteed to satisfy it.
 */
describe('PythonRunner contract (via MockRunner)', () => {
  it('implements the three required methods', () => {
    const r: PythonRunner = new MockRunner();
    expect(typeof r.load).toBe('function');
    expect(typeof r.run).toBe('function');
    expect(typeof r.cancel).toBe('function');
  });

  it('load() resolves with no side effects', async () => {
    const r = new MockRunner();
    await r.load();
    expect(r.loadCount).toBe(1);
  });

  it('run() returns a RunResult with the four mandatory fields', async () => {
    const r = new MockRunner();
    r.next = { stdout: 'out', stderr: 'err', ok: true, ms: 12 };
    const result: RunResult = await r.run('print(2+2)');
    expect(result.stdout).toBe('out');
    expect(result.stderr).toBe('err');
    expect(result.ok).toBe(true);
    expect(typeof result.ms).toBe('number');
  });

  it('run() falls back to echo if no script or next is queued', async () => {
    const r = new MockRunner();
    const result = await r.run('hello');
    expect(result.stdout).toBe('echo: hello');
    expect(result.ok).toBe(true);
  });

  it('run() returns failure shape on script error without throwing', async () => {
    const r = new MockRunner();
    r.script = [{ code: 'oops', stderr: 'Traceback...\nNameError', ok: false }];
    const result = await r.run('oops');
    expect(result.ok).toBe(false);
    expect(result.stderr).toContain('NameError');
  });

  it('run() throws when script.throwWith is set (simulates loader crash)', async () => {
    const r = new MockRunner();
    r.script = [{ code: 'x', throwWith: new Error('network down') }];
    await expect(r.run('x')).rejects.toThrow('network down');
  });

  it('cancel() does not throw and counts as one cancel call', () => {
    const r = new MockRunner();
    r.cancel();
    r.cancel();
    expect(r.cancelCount).toBe(2);
  });

  it('records lastRunCode on each call (for assertions in integration tests)', async () => {
    const r = new MockRunner();
    await r.run('print(1)');
    await r.run('print(2)');
    expect(r.lastRunCode).toBe('print(2)');
    expect(r.callCount).toBe(2);
  });

  it('script queue drains FIFO', async () => {
    const r = new MockRunner();
    r.script = [
      { code: 'a', stdout: 'first' },
      { code: 'b', stdout: 'second' },
      { code: 'c', stdout: 'third' },
    ];
    expect((await r.run('a')).stdout).toBe('first');
    expect((await r.run('b')).stdout).toBe('second');
    expect((await r.run('c')).stdout).toBe('third');
  });
});