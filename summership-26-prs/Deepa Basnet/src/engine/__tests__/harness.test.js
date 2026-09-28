import { describe, it, expect } from 'vitest';
import {
  buildFarmHarness,
  describeError,
  overrideStringAssignment,
  reprIsString,
  reprToNumber,
  reprToText,
} from '../harness';

describe('overrideStringAssignment', () => {
  it('rewrites a top-level string assignment', () => {
    const code = 'weather = "sunny"\nprint(weather)';
    expect(overrideStringAssignment(code, 'weather', 'rain')).toBe('weather = "rain"\nprint(weather)');
  });

  it('handles single quotes', () => {
    expect(overrideStringAssignment("weather = 'sunny'", 'weather', 'rain')).toBe('weather = "rain"');
  });

  it('keeps a trailing comment', () => {
    const out = overrideStringAssignment('weather = "sunny"  # today', 'weather', 'rain');
    expect(out).toBe('weather = "rain"  # today');
  });

  it('prepends an assignment when the learner deleted the line', () => {
    const code = 'water_crops()';
    expect(overrideStringAssignment(code, 'weather', 'rain')).toBe('weather = "rain"\nwater_crops()');
  });

  it("leaves the learner's own indented logic alone", () => {
    const code = 'weather = "sunny"\nif True:\n    weather = "storm"';
    const out = overrideStringAssignment(code, 'weather', 'rain');
    expect(out).toBe('weather = "rain"\nif True:\n    weather = "storm"');
  });

  it('rewrites only the first matching assignment', () => {
    const code = 'weather = "sunny"\nweather = "cloudy"';
    expect(overrideStringAssignment(code, 'weather', 'rain')).toBe('weather = "rain"\nweather = "cloudy"');
  });

  it('does not touch a similarly named variable', () => {
    const code = 'weather_yesterday = "sunny"\nweather = "sunny"';
    const out = overrideStringAssignment(code, 'weather', 'rain');
    expect(out).toBe('weather_yesterday = "sunny"\nweather = "rain"');
  });

  it('leaves a non-literal assignment alone and prepends instead', () => {
    const code = 'weather = forecast()';
    expect(overrideStringAssignment(code, 'weather', 'rain')).toBe('weather = "rain"\nweather = forecast()');
  });
});

describe('buildFarmHarness', () => {
  it("embeds the learner's code as a Python string literal, not inline source", () => {
    const harness = buildFarmHarness('seeds = 20');
    expect(harness).toContain('"seeds = 20"');
    expect(harness).toContain("'<learner_code>'");
  });

  it('escapes quotes and newlines so the harness stays valid Python', () => {
    const harness = buildFarmHarness('print("hi")\nx = 1');
    expect(harness).toContain('"print(\\"hi\\")\\nx = 1"');
  });

  it('includes setup lines and ends in the JSON-returning call', () => {
    const harness = buildFarmHarness('pass', ['water = 50']);
    expect(harness).toContain('"water = 50"');
    expect(harness.trim().endsWith('__pyfarm_run()')).toBe(true);
  });

  it('always defines the water_crops helper', () => {
    expect(buildFarmHarness('pass')).toContain('def water_crops():');
  });

  it('carries a step ceiling so a runaway loop cannot hang the worker', () => {
    expect(buildFarmHarness('pass')).toContain('__PYFARM_STEP_LIMIT__');
  });
});

describe('describeError', () => {
  it('returns null for no error', () => {
    expect(describeError(null)).toBeNull();
  });

  it('explains indentation specifically, and quotes Python', () => {
    const msg = describeError({ type: 'IndentationError', message: 'expected an indented block', line: 2 });
    expect(msg).toContain('indented');
    expect(msg).toContain('line 2');
    expect(msg).toContain('expected an indented block');
  });

  it('suggests the usual causes of a syntax error', () => {
    const msg = describeError({ type: 'SyntaxError', message: 'invalid syntax', line: 1 });
    expect(msg).toContain('colon');
  });

  it('falls back to naming the error type', () => {
    expect(describeError({ type: 'ZeroDivisionError', message: 'division by zero', line: null }))
      .toContain('ZeroDivisionError');
  });
});

describe('repr helpers', () => {
  it('recognises Python string reprs', () => {
    expect(reprIsString("'30'")).toBe(true);
    expect(reprIsString('"30"')).toBe(true);
    expect(reprIsString('30')).toBe(false);
  });

  it('reads numbers, and refuses non-numbers', () => {
    expect(reprToNumber('30')).toBe(30);
    expect(reprToNumber('30.5')).toBe(30.5);
    expect(reprToNumber("'30'")).toBeNull();
    expect(reprToNumber('True')).toBeNull();
    expect(reprToNumber('None')).toBeNull();
    expect(reprToNumber("['a']")).toBeNull();
  });

  it('unwraps string reprs', () => {
    expect(reprToText("'2010'")).toBe('2010');
    expect(reprToText('30')).toBe('30');
  });
});
