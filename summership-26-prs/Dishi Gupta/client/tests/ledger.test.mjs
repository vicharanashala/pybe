import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeLedger, CANONICAL_CONCEPTS } from '../src/lib/ledger.js';

const mockScenarios = [
  { _id: 'rosewood-part-0', order: 0, partLabel: 'The Case Opens', concepts: ['reading', 'logic'] },
  { _id: 'rosewood-part-1', order: 1, partLabel: 'The Messy Notes', concepts: ['strings', 'parsing'] },
  { _id: 'rosewood-part-2', order: 2, partLabel: 'What Happened When', concepts: ['datetime', 'sorting'] },
  { _id: 'rosewood-part-3', order: 3, partLabel: "Stories That Don't Match", concepts: ['sets', 'comparison'] },
  { _id: 'rosewood-part-4', order: 4, partLabel: 'Narrowing It Down', concepts: ['recursion', 'backtracking'] },
  { _id: 'rosewood-part-5', order: 5, partLabel: 'The Reveal', concepts: ['reflection', 'recursion'] }
];

test('nothing completed gives an empty ledger', () => {
  assert.deepEqual(computeLedger([], mockScenarios), []);
  assert.deepEqual(computeLedger(null, mockScenarios), []);
  assert.deepEqual(computeLedger(undefined, mockScenarios), []);
  assert.deepEqual(computeLedger([], []), []);
});

test('one file gives one entry with correct title, concept, explanation, and time', () => {
  const result = computeLedger(['rosewood-part-0'], mockScenarios, {
    timestamps: { 'rosewood-part-0': '2026-10-18T10:00:00.000Z' }
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'rosewood-part-0');
  assert.equal(result[0].title, 'The Case Opens');
  assert.equal(result[0].conceptName, 'Lists & logic tracking');
  assert.equal(typeof result[0].explanation, 'string');
  assert.ok(result[0].explanation.split(/\s+/).length <= 15, 'explanation must be <= 15 words');
  assert.ok(result[0].formattedTime.length > 0);
});

test('two files give two entries in story order even if passed out of order', () => {
  const result = computeLedger(['rosewood-part-1', 'rosewood-part-0'], mockScenarios);
  assert.equal(result.length, 2);
  assert.equal(result[0].id, 'rosewood-part-0');
  assert.equal(result[0].title, 'The Case Opens');
  assert.equal(result[1].id, 'rosewood-part-1');
  assert.equal(result[1].title, 'The Messy Notes');
});

test('calling it twice or passing duplicates does not duplicate entries', () => {
  const opts = { timestamps: { 'rosewood-part-0': '2026-10-18T10:00:00.000Z' } };
  const first = computeLedger(['rosewood-part-0', 'rosewood-part-0'], mockScenarios, opts);
  const second = computeLedger(['rosewood-part-0'], mockScenarios, opts);
  assert.equal(first.length, 1);
  assert.equal(second.length, 1);
  assert.deepEqual(first, second);
});


test('unknown or stale ids are safely ignored', () => {
  const result = computeLedger(
    ['stale-legacy-id', 'rosewood-part-1', 'another-unknown-id', null, 42],
    mockScenarios
  );
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'rosewood-part-1');
  assert.equal(result[0].conceptName, 'String parsing');
});

test('all canonical explanations are concise (max 15 words)', () => {
  for (const [key, data] of Object.entries(CANONICAL_CONCEPTS)) {
    const wordCount = data.explanation.trim().split(/\s+/).length;
    assert.ok(
      wordCount <= 15,
      `Concept explanation for ${key} has ${wordCount} words, exceeding limit of 15`
    );
  }
});
