const test = require('node:test');
const assert = require('node:assert/strict');
const { computeStreak } = require('../streak');

test('no sessions -> zeroed streak', () => {
  const result = computeStreak([]);
  assert.deepEqual(result, { current: 0, longest: 0, lastActiveDate: null });
});

test('first-ever session today -> current streak of 1', () => {
  const today = '2026-08-22';
  const result = computeStreak([`${today}T10:00:00.000Z`], today);
  assert.equal(result.current, 1);
  assert.equal(result.longest, 1);
  assert.equal(result.lastActiveDate, today);
});

test('same-day, multiple sessions -> still counts as 1 day', () => {
  const today = '2026-08-22';
  const result = computeStreak(
    [`${today}T09:00:00.000Z`, `${today}T18:00:00.000Z`],
    today
  );
  assert.equal(result.current, 1);
  assert.equal(result.longest, 1);
});

test('consecutive days -> streak increments', () => {
  const today = '2026-08-22';
  const result = computeStreak(
    ['2026-08-20T10:00:00.000Z', '2026-08-21T10:00:00.000Z', '2026-08-22T10:00:00.000Z'],
    today
  );
  assert.equal(result.current, 3);
  assert.equal(result.longest, 3);
  assert.equal(result.lastActiveDate, today);
});

test('gap day breaks the current streak but preserves longest', () => {
  const today = '2026-08-22';
  const result = computeStreak(
    [
      '2026-08-10T10:00:00.000Z',
      '2026-08-11T10:00:00.000Z',
      '2026-08-12T10:00:00.000Z',
      '2026-08-20T10:00:00.000Z'
    ],
    today
  );
  assert.equal(result.current, 0);
  assert.equal(result.longest, 3);
  assert.equal(result.lastActiveDate, '2026-08-20');
});

test('last active yesterday still counts as an alive streak', () => {
  const today = '2026-08-22';
  const result = computeStreak(
    ['2026-08-20T10:00:00.000Z', '2026-08-21T10:00:00.000Z'],
    today
  );
  assert.equal(result.current, 2);
  assert.equal(result.longest, 2);
});
