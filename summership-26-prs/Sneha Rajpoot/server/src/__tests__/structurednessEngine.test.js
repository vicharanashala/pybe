const assert = require('node:assert/strict');
const test = require('node:test');
const { StructurednessEngine } = require('../services/structurednessEngine');

const engine = new StructurednessEngine();

test('returns four explicit bounded dimensions and a baseline score', () => {
  const result = engine.analyze({
    narrative: 'Plan a delivery route during a storm.',
    goal: 'Balance speed and safety.',
    constraints: ['Reduce cost', 'Increase reliability'],
    possibleSolutions: ['Local hubs', 'Backup routes'],
  });

  assert.ok(result.baselineScore >= 0 && result.baselineScore <= 1);
  assert.deepEqual(Object.keys(result.dimensions), ['ambiguity', 'solutionSpace', 'goalClarity', 'competingConstraints']);
  for (const value of Object.values(result.dimensions)) assert.ok(value >= 0 && value <= 1);
  assert.ok(result.confidence >= 0 && result.confidence <= 1);
  assert.ok(Array.isArray(result.reasoning));
});

test('produces reproducible scores for the same scenario', () => {
  const scenario = { narrative: 'Find a book.', goal: 'Return whether the title exists.', constraints: ['Exact match only.'], possibleSolutions: ['Loop and compare.'] };
  assert.deepEqual(engine.analyze(scenario), engine.analyze(scenario));
});

test('rejects invalid and empty scenario input', () => {
  assert.throws(() => engine.analyze(null), /scenario object/);
  assert.throws(() => engine.analyze({}), /at least one scenario field/);
});