const assert = require('node:assert/strict');
const test = require('node:test');
const { analyzeStructuredness } = require('../services/structuredness.service');

test('a precise task scores as highly structured', () => {
  const result = analyzeStructuredness({
    narrative: 'A user enters a number. Determine whether it is even or odd.',
    goal: 'Return even if divisible by 2; otherwise return odd.',
    constraints: ['Use a single conditional check.'],
    possibleSolutions: ['Check number modulo 2'],
    context: 'A beginner task with one correct approach.',
  });

  assert.ok(result.structuredness < 0.35);
  assert.ok(result.dimensions.goalClarity > 0.7);
  assert.ok(result.dimensions.ambiguity < 0.5);
});

test('an open-ended task scores higher and has greater ambiguity', () => {
  const result = analyzeStructuredness({
    narrative: 'The college wants to improve the student experience in a broader, meaningful way.',
    goal: 'Help make the college better.',
    constraints: ['Consider many factors and trade-offs.'],
    possibleSolutions: ['Improve teaching', 'Improve campus life', 'Improve support', 'Improve communication'],
    context: 'Stakeholders have different priorities.',
  });

  assert.ok(result.dimensions.ambiguity > 0.5);
  assert.ok(result.dimensions.goalClarity < 0.6);
  assert.ok(result.structuredness > 0.45);
});

test('multiple valid approaches increase solution-space score', () => {
  const result = analyzeStructuredness({
    narrative: 'Design a system to help students collaborate more effectively.',
    goal: 'Create a plan that improves group work and cooperation.',
    constraints: ['Balance fairness, time, and engagement.'],
    possibleSolutions: ['Peer review', 'Mentoring', 'Discussion structures', 'Team checkpoints'],
    context: 'There are multiple valid design options.',
  });

  assert.ok(result.dimensions.solutionSpace > 0.6);
  assert.ok(result.structuredness > 0.5);
});

test('competing constraints increase their dimension and overall score', () => {
  const result = analyzeStructuredness({
    narrative: 'Plan a delivery route for a logistics service.',
    goal: 'Minimize cost while maximizing reliability and speed.',
    constraints: ['Lower cost', 'Higher reliability', 'Faster delivery times'],
    possibleSolutions: ['Use local hubs', 'Use fewer vehicles', 'Add backup routes', 'Use priority logistics'],
  });

  assert.ok(result.dimensions.competingConstraints > 0.5);
  assert.ok(result.structuredness > 0.45);
});

test('results are deterministic, bounded, and include every dimension', () => {
  const input = {
    narrative: 'Design a better campus experience.',
    goal: 'Improve student life.',
    constraints: ['Consider budget and wellbeing.'],
    possibleSolutions: ['Change schedules', 'Improve spaces', 'Support advising'],
  };
  const first = analyzeStructuredness(input);
  const second = analyzeStructuredness(input);

  assert.deepEqual(first, second);
  assert.ok(first.structuredness >= 0 && first.structuredness <= 1);
  assert.deepEqual(Object.keys(first.dimensions), [
    'goalClarity',
    'ambiguity',
    'solutionSpace',
    'competingConstraints',
  ]);
});

test('empty and invalid scenario inputs fail clearly', () => {
  assert.throws(() => analyzeStructuredness({}), /at least one scenario field/);
  assert.throws(() => analyzeStructuredness(null), /scenario object/);
  assert.throws(() => analyzeStructuredness([]), /scenario object/);
});