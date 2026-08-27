const test = require('node:test');
const assert = require('node:assert/strict');
const { computeTotalTimeSpent } = require('../engagement');

test('no sessions -> zero total time', () => {
  const result = computeTotalTimeSpent([]);
  assert.equal(result, 0);
});

test('single session -> returns its duration', () => {
  const result = computeTotalTimeSpent([{ durationSeconds: 120 }]);
  assert.equal(result, 120);
});

test('multiple sessions -> sums durations', () => {
  const result = computeTotalTimeSpent([
    { durationSeconds: 60 },
    { durationSeconds: 90 },
    { durationSeconds: 30 }
  ]);
  assert.equal(result, 180);
});

test('missing durationSeconds on old sessions -> treated as zero', () => {
  const result = computeTotalTimeSpent([
    { durationSeconds: 100 },
    {}, // legacy session with no duration field
    { durationSeconds: 50 }
  ]);
  assert.equal(result, 150);
});

test('negative or garbage values are clamped to zero', () => {
  const result = computeTotalTimeSpent([
    { durationSeconds: -50 },
    { durationSeconds: 'not a number' },
    { durationSeconds: 20 }
  ]);
  assert.equal(result, 20);
});