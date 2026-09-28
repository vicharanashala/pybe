import { describe, it, expect } from 'vitest';
import { getMission, getMissionForChapter } from '../missions';

const ch1 = getMission('ch1-seeds');
const ch2 = getMission('ch2-weather');

/** One run's worth of harness output. */
function run(scenarioId, { globals = {}, output = '', error = null, calls = {} } = {}) {
  return { scenarioId, globals, output, error, calls: { water_crops: 0, ...calls } };
}

describe('mission lookup', () => {
  it('finds missions by id and by chapter', () => {
    expect(getMissionForChapter(1).id).toBe('ch1-seeds');
    expect(getMissionForChapter(2).id).toBe('ch2-weather');
    expect(getMission('nope')).toBeNull();
  });

  it('gives Chapter 1 fifty XP and Chapter 2 seventy-five, totalling 125', () => {
    expect(ch1.xp).toBe(50);
    expect(ch2.xp).toBe(75);
    expect(ch1.xp + ch2.xp).toBe(125);
  });

  it('ships the three-step hint ladder the spec calls for', () => {
    expect(ch1.hints).toHaveLength(3);
    expect(ch2.hints).toHaveLength(3);
    // Hints must not hand over a finished answer.
    expect(ch2.hints.join(' ')).not.toContain('water_crops()');
  });

  it('starts Chapter 1 at 20 seeds and Chapter 2 at sunny', () => {
    expect(ch1.starterCode).toContain('seeds = 20');
    expect(ch2.starterCode).toContain('weather = "sunny"');
  });
});

describe('Chapter 1 — variables', () => {
  it('passes the canonical solution', () => {
    const v = ch1.validate([run('default', { globals: { seeds: '30' } })], 'seeds = 20\nseeds = seeds + 10');
    expect(v.passed).toBe(true);
    expect(v.farm).toEqual({ seeds: 30 });
    expect(v.note).toBeNull();
  });

  it('passes the += form', () => {
    const v = ch1.validate([run('default', { globals: { seeds: '30' } })], 'seeds = 20\nseeds += 10');
    expect(v.passed).toBe(true);
    expect(v.note).toBeNull();
  });

  it('passes an alternative solution that goes via another variable', () => {
    const code = 'seeds = 20\ndelivery = 10\nseeds = seeds + delivery';
    const v = ch1.validate([run('default', { globals: { seeds: '30', delivery: '10' } })], code);
    expect(v.passed).toBe(true);
  });

  it('accepts a hardcoded 30 on the value, but nudges toward the reusable form', () => {
    const v = ch1.validate([run('default', { globals: { seeds: '30' } })], 'seeds = 30');
    expect(v.passed).toBe(true);
    expect(v.note).toContain('seeds = seeds + 10');
  });

  it('fails when the seed count was never updated', () => {
    const v = ch1.validate([run('default', { globals: { seeds: '20' } })], 'seeds = 20');
    expect(v.passed).toBe(false);
    expect(v.message).toContain('still reads 20');
  });

  it('fails a wrong arithmetic result and reports the real value', () => {
    const v = ch1.validate([run('default', { globals: { seeds: '200' } })], 'seeds = 20 * 10');
    expect(v.passed).toBe(false);
    expect(v.message).toContain('200');
  });

  it('explains string concatenation rather than just failing it', () => {
    const v = ch1.validate([run('default', { globals: { seeds: "'2010'" } })], 'seeds = "20"\nseeds = seeds + "10"');
    expect(v.passed).toBe(false);
    expect(v.message).toContain('joined');
  });

  it('flags a numeric answer stored as text', () => {
    const v = ch1.validate([run('default', { globals: { seeds: "'30'" } })], 'seeds = "30"');
    expect(v.passed).toBe(false);
    expect(v.message).toContain('quote marks');
  });

  it('fails when the variable no longer exists', () => {
    const v = ch1.validate([run('default', { globals: {} })], 'print("hello")');
    expect(v.passed).toBe(false);
    expect(v.message).toContain('no seeds variable');
  });

  it('reports a syntax error as a syntax error, not a wrong answer', () => {
    const v = ch1.validate(
      [run('default', { error: { type: 'SyntaxError', message: 'invalid syntax', line: 2 } })],
      'seeds = 20\nseeds = seeds +'
    );
    expect(v.passed).toBe(false);
    expect(v.kind).toBe('error');
    expect(v.message).toContain('line 2');
  });
});

describe('Chapter 2 — if / else', () => {
  const correct = 'weather = "sunny"\nif weather == "rain":\n    print("No need to water")\nelse:\n    water_crops()';

  it('passes when watering happens in the sun and not in the rain', () => {
    const v = ch2.validate(
      [
        run('sunny', { globals: { weather: "'sunny'", water: '50' }, calls: { water_crops: 1 } }),
        run('rain', { globals: { weather: "'rain'", water: '50' }, output: 'No need to water\n' }),
      ],
      correct
    );
    expect(v.passed).toBe(true);
    expect(v.farm).toEqual({ crops: 'watered', water: 40 });
    expect(v.outcomes).toEqual([
      { scenarioId: 'sunny', watered: true, water: 40 },
      { scenarioId: 'rain', watered: false, water: 50 },
    ]);
  });

  it('accepts spending from the water variable instead of calling the helper', () => {
    const code = 'weather = "sunny"\nif weather == "rain":\n    pass\nelse:\n    water = water - 10';
    const v = ch2.validate(
      [
        run('sunny', { globals: { weather: "'sunny'", water: '40' } }),
        run('rain', { globals: { weather: "'rain'", water: '50' } }),
      ],
      code
    );
    expect(v.passed).toBe(true);
  });

  it('accepts the condition written the other way round (not rain -> water)', () => {
    const code = 'weather = "sunny"\nif weather != "rain":\n    water_crops()\nelse:\n    print("rain")';
    const v = ch2.validate(
      [
        run('sunny', { globals: { weather: "'sunny'" }, calls: { water_crops: 1 } }),
        run('rain', { globals: { weather: "'rain'" } }),
      ],
      code
    );
    expect(v.passed).toBe(true);
  });

  it('fails watering with no decision at all, and points at if', () => {
    const code = 'weather = "sunny"\nwater_crops()';
    const v = ch2.validate(
      [
        run('sunny', { globals: { weather: "'sunny'" }, calls: { water_crops: 1 } }),
        run('rain', { globals: { weather: "'rain'" }, calls: { water_crops: 1 } }),
      ],
      code
    );
    expect(v.passed).toBe(false);
    expect(v.message).toContain('BOTH mornings');
    expect(v.message).toContain('never asks a question');
  });

  it('tells a learner who did write a branch that the watering sits outside it', () => {
    const code = 'weather = "sunny"\nif weather == "rain":\n    print("wet")\nwater_crops()';
    const v = ch2.validate(
      [
        run('sunny', { globals: { weather: "'sunny'" }, calls: { water_crops: 1 } }),
        run('rain', { globals: { weather: "'rain'" }, calls: { water_crops: 1 } }),
      ],
      code
    );
    expect(v.passed).toBe(false);
    expect(v.message).toContain('inside a branch');
    expect(v.message).toContain('indentation');
  });

  it('catches an inverted condition', () => {
    const code = 'weather = "sunny"\nif weather == "rain":\n    water_crops()\nelse:\n    print("dry")';
    const v = ch2.validate(
      [
        run('sunny', { globals: { weather: "'sunny'" } }),
        run('rain', { globals: { weather: "'rain'" }, calls: { water_crops: 1 } }),
      ],
      code
    );
    expect(v.passed).toBe(false);
    expect(v.message).toContain('wrong way round');
  });

  it('catches a condition that never waters at all', () => {
    const code = 'weather = "sunny"\nif weather == "rain":\n    print("wet")\nelse:\n    print("dry")';
    const v = ch2.validate(
      [run('sunny', { globals: { weather: "'sunny'" } }), run('rain', { globals: { weather: "'rain'" } })],
      code
    );
    expect(v.passed).toBe(false);
    expect(v.message).toContain('Nothing was watered');
  });

  it('reports an indentation error from either run as an error', () => {
    const v = ch2.validate(
      [
        run('sunny', { error: { type: 'IndentationError', message: 'expected an indented block', line: 3 } }),
        run('rain', { error: { type: 'IndentationError', message: 'expected an indented block', line: 3 } }),
      ],
      'weather = "sunny"\nif weather == "rain":\nprint("wet")'
    );
    expect(v.passed).toBe(false);
    expect(v.kind).toBe('error');
    expect(v.message).toContain('indented');
  });
});

// A wrong answer must move the farm too, or the scene contradicts the verdict:
// "seeds ended up as 10" beside a sack still reading 30 from an earlier pass.
describe('every verdict reports a farm state', () => {
  const ch1Cases = [
    ['syntax error', [run('default', { error: { type: 'SyntaxError', message: 'invalid syntax', line: 1 } })], 20],
    ['variable gone', [run('default', { globals: {} })], 20],
    ['not updated', [run('default', { globals: { seeds: '20' } })], 20],
    ['text result', [run('default', { globals: { seeds: "'2010'" } })], 20],
    ['wrong number shows the real count', [run('default', { globals: { seeds: '10' } })], 10],
    ['wrong number, too high', [run('default', { globals: { seeds: '200' } })], 200],
    ['correct', [run('default', { globals: { seeds: '30' } })], 30],
  ];

  it.each(ch1Cases)('Chapter 1 — %s leaves seeds at %i', (_label, runs, seeds) => {
    const verdict = ch1.validate(runs, 'seeds = 20');
    expect(verdict.farm).toBeDefined();
    expect(verdict.farm.seeds).toBe(seeds);
  });

  it('Chapter 1 never reports a negative seed count', () => {
    const verdict = ch1.validate([run('default', { globals: { seeds: '-5' } })], 'seeds = -5');
    expect(verdict.farm.seeds).toBe(0);
  });

  it('Chapter 2 resets the tank when the code errors', () => {
    const err = { type: 'IndentationError', message: 'expected an indented block', line: 3 };
    const verdict = ch2.validate([run('sunny', { error: err }), run('rain', { error: err })], 'x');
    expect(verdict.farm).toEqual({ water: 50, crops: 'dry' });
  });

  it('Chapter 2 shows the drained tank when the code waters unconditionally', () => {
    const verdict = ch2.validate(
      [
        run('sunny', { globals: { water: '50' }, calls: { water_crops: 1 } }),
        run('rain', { globals: { water: '50' }, calls: { water_crops: 1 } }),
      ],
      'water_crops()'
    );
    expect(verdict.passed).toBe(false);
    expect(verdict.farm).toEqual({ water: 40, crops: 'watered' });
  });

  it('Chapter 2 shows dry crops when the branches are inverted', () => {
    const verdict = ch2.validate(
      [
        run('sunny', { globals: { water: '50' } }),
        run('rain', { globals: { water: '50' }, calls: { water_crops: 1 } }),
      ],
      'if weather == "rain":\n    water_crops()\nelse:\n    pass'
    );
    expect(verdict.farm).toEqual({ water: 50, crops: 'dry' });
  });
});
