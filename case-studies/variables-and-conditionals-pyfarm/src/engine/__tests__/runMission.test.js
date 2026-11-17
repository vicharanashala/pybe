import { describe, it, expect, vi } from 'vitest';
import { runMission } from '../runMission';
import { getMission } from '../missions';

const ch1 = getMission('ch1-seeds');
const ch2 = getMission('ch2-weather');

/** Stands in for Pyodide: records the Python it was handed, replies with canned data. */
function stubRunner(replies) {
  const seen = [];
  const fn = vi.fn(async (python) => {
    seen.push(python);
    return replies[seen.length - 1] ?? { data: { globals: {}, output: '', error: null, calls: {} }, error: null };
  });
  return { fn, seen };
}

describe('runMission', () => {
  it('runs a single-scenario mission once and returns its verdict', async () => {
    const { fn, seen } = stubRunner([
      { data: { globals: { seeds: '30' }, output: '', error: null, calls: {} }, error: null },
    ]);

    const out = await runMission(ch1, 'seeds = 20\nseeds += 10', fn);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(seen[0]).toContain('seeds += 10');
    expect(out.result.passed).toBe(true);
    expect(out.runtimeError).toBeNull();
  });

  it('runs a two-scenario mission twice, changing only the initial condition', async () => {
    const { fn, seen } = stubRunner([
      { data: { globals: { weather: "'sunny'" }, output: '', error: null, calls: { water_crops: 1 } }, error: null },
      { data: { globals: { weather: "'rain'" }, output: '', error: null, calls: { water_crops: 0 } }, error: null },
    ]);

    const code = 'weather = "sunny"\nif weather == "rain":\n    print("wet")\nelse:\n    water_crops()';
    const out = await runMission(ch2, code, fn);

    expect(fn).toHaveBeenCalledTimes(2);
    // The learner's own logic is byte-identical in both runs; only the weather differs.
    expect(seen[0]).toContain('weather = \\"sunny\\"');
    expect(seen[1]).toContain('weather = \\"rain\\"');
    expect(seen[0]).toContain('water_crops()');
    expect(seen[1]).toContain('water_crops()');
    // Chapter 2's lent resources reach both runs.
    expect(seen[0]).toContain('water = 50');

    expect(out.runs.map((r) => r.scenarioId)).toEqual(['sunny', 'rain']);
    expect(out.result.passed).toBe(true);
  });

  it('surfaces a runtime failure without producing a verdict', async () => {
    const fn = vi.fn(async () => ({ data: null, error: 'The Python runtime is not ready yet.' }));
    const out = await runMission(ch1, 'seeds = 30', fn);

    expect(out.runtimeError).toBe('The Python runtime is not ready yet.');
    expect(out.result).toBeNull();
    expect(out.runs).toBeNull();
  });

  it('stops at the first failing scenario rather than running the rest', async () => {
    const fn = vi.fn(async () => ({ data: null, error: 'timed out' }));
    await runMission(ch2, 'weather = "sunny"', fn);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('defaults missing harness fields so a validator never sees undefined', async () => {
    const fn = vi.fn(async () => ({ data: {}, error: null }));
    const out = await runMission(ch1, 'pass', fn);
    expect(out.runs[0]).toEqual({ scenarioId: 'default', globals: {}, output: '', error: null, calls: {} });
    expect(out.result.passed).toBe(false);
  });
});
