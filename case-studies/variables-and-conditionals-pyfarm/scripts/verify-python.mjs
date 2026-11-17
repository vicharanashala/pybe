// End-to-end check of the farm's execution pipeline against a REAL Python
// interpreter: build the harness, execute it, feed the result to the mission's
// validator, and assert the verdict.
//
// This is deliberately separate from `npm test`. The unit tests must run
// anywhere; this one needs a local `python` on PATH, which CI may not have.
// Pyodide is CPython compiled to WebAssembly, so a local CPython 3.12+ is a
// faithful stand-in for the harness semantics verified here.
//
//   npm run verify:python
//
// What this catches that the unit tests cannot: whether the generated Python is
// valid and behaves as intended — the step ceiling actually stopping a runaway
// loop, stdout really being captured, `repr()` shapes matching what the
// validators expect, and error types arriving with the names they branch on.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { buildFarmHarness, overrideStringAssignment } from '../src/engine/harness.js';
import { assembleBlanks } from '../src/engine/blanks.js';
import { getMission } from '../src/engine/missions.js';

const PYTHON = process.env.PYFARM_PYTHON || 'python';
const workDir = mkdtempSync(join(tmpdir(), 'pyfarm-verify-'));

let passed = 0;
const failures = [];

function executeHarness(harness) {
  // The harness's last expression is the JSON result, which Pyodide returns to
  // the caller. A plain interpreter discards it, so print it instead.
  const script = harness.replace(/__pyfarm_run\(\)$/, 'print(__pyfarm_run())');
  const file = join(workDir, `run-${Math.random().toString(36).slice(2)}.py`);
  writeFileSync(file, script, 'utf8');
  const stdout = execFileSync(PYTHON, [file], { encoding: 'utf8', timeout: 60000 });
  return JSON.parse(stdout);
}

/** Runs a mission end-to-end exactly as runMission does, but through real Python. */
function runMissionForReal(mission, code) {
  const runs = mission.scenarios.map((scenario) => {
    const scoped = scenario.override
      ? overrideStringAssignment(code, scenario.override.name, scenario.override.value)
      : code;
    const data = executeHarness(buildFarmHarness(scoped, mission.setup));
    return { scenarioId: scenario.id, ...data };
  });
  return { runs, result: mission.validate(runs, code) };
}

function check(name, missionId, code, expect) {
  const mission = getMission(missionId);
  try {
    const { runs, result } = runMissionForReal(mission, code);

    if (result.passed !== expect.passed) {
      failures.push(`${name}\n    expected passed=${expect.passed}, got ${result.passed}\n    message: ${result.message}`);
      return;
    }
    if (expect.messageIncludes && !result.message.includes(expect.messageIncludes)) {
      failures.push(`${name}\n    expected message to include "${expect.messageIncludes}"\n    got: ${result.message}`);
      return;
    }
    if (expect.errorType && runs.every((r) => r.error?.type !== expect.errorType)) {
      failures.push(`${name}\n    expected a ${expect.errorType} from Python, got ${JSON.stringify(runs.map((r) => r.error))}`);
      return;
    }
    if (expect.farm) {
      for (const [key, value] of Object.entries(expect.farm)) {
        if (result.farm?.[key] !== value) {
          failures.push(`${name}\n    expected farm.${key}=${value}, got ${result.farm?.[key]}`);
          return;
        }
      }
    }
    if (expect.outcomes) {
      const actual = JSON.stringify(result.outcomes?.map((o) => [o.scenarioId, o.watered]));
      const wanted = JSON.stringify(expect.outcomes);
      if (actual !== wanted) {
        failures.push(`${name}\n    expected outcomes ${wanted}, got ${actual}`);
        return;
      }
    }
    passed += 1;
    process.stdout.write(`  ok   ${name}\n`);
  } catch (error) {
    failures.push(`${name}\n    threw: ${error.message}`);
  }
}

console.log('\nChapter 1 — Variables (real Python)\n');

check('canonical: seeds = seeds + 10', 'ch1-seeds', 'seeds = 20\nseeds = seeds + 10', {
  passed: true,
  farm: { seeds: 30 },
});

check('alternative: seeds += 10', 'ch1-seeds', 'seeds = 20\nseeds += 10', { passed: true });

check('alternative: via another variable', 'ch1-seeds', 'seeds = 20\ndelivery = 10\nseeds = seeds + delivery', {
  passed: true,
});

check('alternative: arithmetic that also lands on 30', 'ch1-seeds', 'seeds = 20\nseeds = seeds + 5 + 5', {
  passed: true,
});

check('hardcoded 30 passes but is nudged', 'ch1-seeds', 'seeds = 30', { passed: true });

check('not updated', 'ch1-seeds', 'seeds = 20', { passed: false, messageIncludes: 'still reads 20' });

check('wrong result', 'ch1-seeds', 'seeds = 20\nseeds = seeds * 10', { passed: false, messageIncludes: '200' });

check('text concatenation', 'ch1-seeds', 'seeds = "20"\nseeds = seeds + "10"', {
  passed: false,
  messageIncludes: 'joined',
});

check('number stored as text', 'ch1-seeds', 'seeds = "30"', { passed: false, messageIncludes: 'quote marks' });

check('variable missing entirely', 'ch1-seeds', 'harvest = 5', { passed: false, messageIncludes: 'no seeds variable' });

check('syntax error', 'ch1-seeds', 'seeds = 20\nseeds = seeds +', {
  passed: false,
  errorType: 'SyntaxError',
});

check('undefined name', 'ch1-seeds', 'seeds = sedes + 10', { passed: false, errorType: 'NameError' });

check('mixing a number and text', 'ch1-seeds', 'seeds = 20\nseeds = seeds + "10"', {
  passed: false,
  errorType: 'TypeError',
});

check('runaway loop is stopped, not left to hang', 'ch1-seeds', 'seeds = 20\nwhile True:\n    seeds = seeds', {
  passed: false,
  errorType: 'StepLimit',
});

check("learner's print() output is captured, not lost", 'ch1-seeds', 'seeds = 20\nseeds += 10\nprint("Seeds:", seeds)', {
  passed: true,
});

console.log('\nChapter 2 — if / else (real Python, run once per morning)\n');

check(
  'canonical if/else',
  'ch2-weather',
  'weather = "sunny"\nif weather == "rain":\n    print("No need to water")\nelse:\n    water_crops()',
  { passed: true, outcomes: [['sunny', true], ['rain', false]], farm: { crops: 'watered', water: 40 } }
);

check(
  'inverted condition using !=',
  'ch2-weather',
  'weather = "sunny"\nif weather != "rain":\n    water_crops()\nelse:\n    print("Rain will do it")',
  { passed: true, outcomes: [['sunny', true], ['rain', false]] }
);

check(
  'spending from the water variable instead of the helper',
  'ch2-weather',
  'weather = "sunny"\nif weather == "rain":\n    print("No need")\nelse:\n    water = water - 10',
  { passed: true, outcomes: [['sunny', true], ['rain', false]] }
);

check(
  'a learner who deleted the weather line still gets both mornings',
  'ch2-weather',
  'if weather == "rain":\n    print("No need to water")\nelse:\n    water_crops()',
  { passed: true, outcomes: [['sunny', true], ['rain', false]] }
);

check(
  'a learner who hardcoded weather = "rain" is still tested on both',
  'ch2-weather',
  'weather = "rain"\nif weather == "rain":\n    print("No need to water")\nelse:\n    water_crops()',
  { passed: true, outcomes: [['sunny', true], ['rain', false]] }
);

check('waters unconditionally', 'ch2-weather', 'weather = "sunny"\nwater_crops()', {
  passed: false,
  messageIncludes: 'never asks a question',
  outcomes: [['sunny', true], ['rain', true]],
});

check(
  'branch written, but watering left outside it',
  'ch2-weather',
  'weather = "sunny"\nif weather == "rain":\n    print("wet")\nwater_crops()',
  { passed: false, messageIncludes: 'inside a branch', outcomes: [['sunny', true], ['rain', true]] }
);

check(
  'branches the wrong way round',
  'ch2-weather',
  'weather = "sunny"\nif weather == "rain":\n    water_crops()\nelse:\n    print("Dry today")',
  { passed: false, messageIncludes: 'wrong way round', outcomes: [['sunny', false], ['rain', true]] }
);

check(
  'never waters at all',
  'ch2-weather',
  'weather = "sunny"\nif weather == "rain":\n    print("wet")\nelse:\n    print("dry")',
  { passed: false, messageIncludes: 'Nothing was watered' }
);

check(
  'comparing against the wrong word fails the sunny morning',
  'ch2-weather',
  'weather = "sunny"\nif weather == "raining":\n    print("wet")\nelse:\n    water_crops()',
  { passed: false, outcomes: [['sunny', true], ['rain', true]] }
);

check(
  'missing indentation reports IndentationError',
  'ch2-weather',
  'weather = "sunny"\nif weather == "rain":\nprint("No need to water")\nelse:\n    water_crops()',
  { passed: false, errorType: 'IndentationError' }
);

check(
  'a single = instead of == is reported as a syntax error',
  'ch2-weather',
  'weather = "sunny"\nif weather = "rain":\n    print("wet")\nelse:\n    water_crops()',
  { passed: false, errorType: 'SyntaxError' }
);

// ---------------------------------------------------------------------------
// Fill-in-the-blanks mode must not be a second, more forgiving grader. Every
// combination the pickers can produce is assembled, executed for real, and
// judged by the same validator. The assertion is on the exact SET that passes:
// that catches a distractor combination slipping through, and equally a
// logically-correct combination being wrongly rejected.

function combinations(slots) {
  return slots.reduce(
    (acc, slot) => acc.flatMap((partial) => slot.options.map((option) => ({ ...partial, [slot.id]: option }))),
    [{}]
  );
}

function sweepBlanks(missionId, expectedPassing) {
  const mission = getMission(missionId);
  const { template, slots } = mission.blanks;
  const combos = combinations(slots);
  const passing = [];

  for (const selections of combos) {
    const code = assembleBlanks(template, selections);
    try {
      const { result } = runMissionForReal(mission, code);
      if (result.passed) passing.push(slots.map((s) => selections[s.id]).join(' | '));
    } catch (error) {
      failures.push(`${missionId} blanks ${JSON.stringify(selections)}\n    threw: ${error.message}`);
      return;
    }
  }

  const actual = [...passing].sort();
  const wanted = [...expectedPassing].sort();
  const name = `${missionId}: ${combos.length} blank combinations, exactly ${wanted.length} pass`;

  if (JSON.stringify(actual) !== JSON.stringify(wanted)) {
    const extra = actual.filter((a) => !wanted.includes(a));
    const missing = wanted.filter((w) => !actual.includes(w));
    failures.push(
      `${name}\n` +
        (extra.length ? `    passed but should not: ${extra.join(' ;; ')}\n` : '') +
        (missing.length ? `    should have passed: ${missing.join(' ;; ')}\n` : '')
    );
    return;
  }
  passed += 1;
  process.stdout.write(`  ok   ${name}\n`);
  passing.forEach((p) => process.stdout.write(`         passes: ${p}\n`));
}

console.log('\nFill in the blanks — every combination, run for real\n');

// Only the two answers that actually leave 30 seeds behind. `30` is accepted on
// its value and separately nudged toward the reusable form by the validator.
sweepBlanks('ch1-seeds', ['seeds + 10', '30']);

// Five logically-equivalent right answers: test for rain and water in the else,
// or test for sun and water in the if — by helper or by spending from the tank.
sweepBlanks('ch2-weather', [
  'weather == "rain" | print("No need to water") | water_crops()',
  'weather == "sunny" | water_crops() | print("No need to water")',
  'weather == "sunny" | water_crops() | print("Raining")',
  'weather == "sunny" | water = water - 10 | print("No need to water")',
  'weather == "sunny" | water = water - 10 | print("Raining")',
]);

rmSync(workDir, { recursive: true, force: true });

console.log('');
if (failures.length) {
  console.error(`${failures.length} failed, ${passed} passed\n`);
  failures.forEach((f) => console.error(`  FAIL ${f}\n`));
  process.exit(1);
}
console.log(`All ${passed} real-Python checks passed.\n`);
