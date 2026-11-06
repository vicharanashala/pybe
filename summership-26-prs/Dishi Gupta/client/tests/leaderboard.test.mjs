import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { computeBoard, isSuspectRevealed } from '../src/lib/leaderboard.mjs';

const require = createRequire(import.meta.url);
const caseParts = require('../../server/rosewoodManorCase');
const caseEvents = caseParts.flatMap((part) => part.evidenceEvents || []);

const event = (slideIndex, effects, trigger = 'reach') => ({ id: `event-${slideIndex}`, slideId: `slide-${slideIndex}`, slideIndex, trigger, effects });

test('a fresh case is unranked and scoreless', () => {
  const board = computeBoard([], [], 0);
  assert.equal(board.started, false);
  assert.deepEqual(board.active, []);
  assert.deepEqual(board.scores, {});
});

test('suspect names remain hidden until the introduction slide', () => {
  const intro = caseEvents[0];
  const hidden = computeBoard([intro], [intro.slideId], intro.slideIndex, []);
  assert.deepEqual(hidden.active, []);
  assert.deepEqual(hidden.suspects, []);
  assert.equal(isSuspectRevealed('iris', { revealedSuspectIds: [] }), false);
  assert.equal(isSuspectRevealed('iris', { revealedSuspectIds: ['iris'] }), true);
});

test('a clue can reorder the board', () => {
  const board = computeBoard([event(1, [{ suspectId: 'iris', delta: 40, reason: 'Study timing fits Iris.' }])], ['slide-1'], 1);
  assert.equal(board.active[0].name, 'Iris Vale');
  assert.equal(board.active[0].trend, 'up');
});

test('cleared suspects leave active ranking', () => {
  const board = computeBoard([event(1, [{ suspectId: 'mina', delta: -30, cleared: true, reason: 'No witness confirms Mina.' }])], ['slide-1'], 1);
  assert.equal(board.active.some((suspect) => suspect.id === 'mina'), false);
  assert.equal(board.cleared[0].reason, 'No witness confirms Mina.');
});

test('ties use motive strength, then name', () => {
  const motiveTie = computeBoard([event(1, [{ suspectId: 'mina', delta: 10, reason: 'Tie test.' }, { suspectId: 'dev', delta: -4, reason: 'Tie test.' }])], ['slide-1'], 1);
  assert.deepEqual(motiveTie.active.slice(1, 3).map((suspect) => suspect.name), ['Pia Rosewood', 'Mina Rosewood']);
  const nameTie = computeBoard([event(1, [{ suspectId: 'dev', delta: -4, reason: 'Tie test.' }])], ['slide-1'], 1);
  assert.deepEqual(nameTie.active.slice(0, 2).map((suspect) => suspect.name), ['Dev Ashcombe', 'Pia Rosewood']);
});

test('going backward excludes future clue events', () => {
  const events = [event(1, [{ suspectId: 'iris', delta: 30, reason: 'Earlier clue.' }]), event(2, [{ suspectId: 'dev', delta: -30, reason: 'Future clue.' }])];
  const board = computeBoard(events, ['slide-1'], 1);
  assert.equal(board.active.find((suspect) => suspect.id === 'iris').score, 73);
  assert.equal(board.active.find((suspect) => suspect.id === 'dev').score, 72);
});

test('the authored case ends with Iris Vale only', () => {
  const board = computeBoard(caseEvents, caseEvents.map((item) => item.slideId), 109);
  assert.deepEqual(board.active.map((suspect) => suspect.name), ['Iris Vale']);
  assert.equal(board.winner, 'Iris Vale');
  assert.equal(board.active[0].score, 100);
  assert.equal(board.cleared.length, 4);
});

test('the authored arc leads with Dev before Iris rises', () => {
  const earlyEvents = caseEvents.slice(0, 2);
  const early = computeBoard(earlyEvents, earlyEvents.map((item) => item.slideId), earlyEvents.at(-1).slideIndex);
  assert.equal(early.active[0].name, 'Dev Ashcombe');
  assert.equal(early.active[0].score, 82);

  const lateEvents = caseEvents.slice(0, 5);
  const late = computeBoard(lateEvents, lateEvents.map((item) => item.slideId), lateEvents.at(-1).slideIndex);
  assert.equal(late.active[0].name, 'Iris Vale');
  assert.equal(late.active[0].score, 91);
  assert.equal(late.cleared.length, 4);
});

test('going back to the start returns to blank', () => {
  const board = computeBoard(caseEvents, caseEvents.map((item) => item.slideId), 0);
  assert.equal(board.started, false);
  assert.deepEqual(board.active, []);
});
