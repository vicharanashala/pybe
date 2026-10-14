const assert = require('node:assert/strict');
const test = require('node:test');
const { ADAPTATION_POLICY, selectNextScenario, updateLearnerBoundary } = require('../services/scenarioAdaptation.service');
const { evaluateOutcome } = require('../services/outcome.service');

const candidates = [
  { id: 'easy', targetStructuredness: 0.1 },
  { id: 'near', targetStructuredness: 0.19 },
  { id: 'stretch', targetStructuredness: 0.31 },
  { id: 'far', targetStructuredness: 0.6 },
];

test('selects a candidate near the learner boundary deterministically', () => {
  const first = selectNextScenario({ learnerBoundary: 0.2, scenarios: candidates });
  const second = selectNextScenario({ learnerBoundary: 0.2, scenarios: candidates });
  assert.equal(first.scenario.id, 'near');
  assert.equal(first.adaptation.relationship, 'near_boundary');
  assert.deepEqual(first, second);
});

test('avoids recent scenarios when alternatives exist', () => {
  const result = selectNextScenario({
    learnerBoundary: 0.2,
    scenarios: candidates,
    history: [{ scenarioId: 'near' }],
  });
  assert.notEqual(result.scenario.id, 'near');
  assert.notEqual(result.scenario.id, 'far');
});

test('does not select a far-above challenge while a suitable candidate exists', () => {
  const result = selectNextScenario({ learnerBoundary: 0.2, scenarios: candidates });
  assert.notEqual(result.scenario.id, 'far');
  assert.ok(result.scenario.targetStructuredness <= 0.2 + ADAPTATION_POLICY.relationshipBand);
});

test('falls back gracefully for sparse catalogs and reports no-valid-scenario clearly', () => {
  const sparse = selectNextScenario({ learnerBoundary: 0.2, scenarios: [{ id: 'only', targetStructuredness: 0.9 }] });
  assert.equal(sparse.scenario.id, 'only');
  assert.equal(sparse.adaptation.relationship, 'above_boundary');
  const none = selectNextScenario({ learnerBoundary: 0.2, scenarios: [{ id: 'bad', targetStructuredness: 2 }] });
  assert.equal(none.scenario, null);
  assert.equal(none.adaptation.decision, 'no_scenario_available');
});

test('success near boundary advances gradually, but easy success does not inflate it', () => {
  const near = updateLearnerBoundary({ currentBoundary: 0.22, scenarioStructuredness: 0.2, outcome: 'success' });
  const easy = updateLearnerBoundary({ currentBoundary: 0.5, scenarioStructuredness: 0.1, outcome: 'success' });
  assert.equal(near.updatedBoundary, 0.25);
  assert.equal(easy.updatedBoundary, 0.5);
});

test('repeated struggles above boundary do not raise it and all updates stay bounded', () => {
  let boundary = 0.5;
  for (let attempt = 0; attempt < 5; attempt++) {
    boundary = updateLearnerBoundary({ currentBoundary: boundary, scenarioStructuredness: 0.8, outcome: 'struggle' }).updatedBoundary;
  }
  assert.equal(boundary, 0.5);
  assert.equal(updateLearnerBoundary({ currentBoundary: 0.01, scenarioStructuredness: 0, outcome: 'struggle' }).updatedBoundary, 0);
  assert.equal(updateLearnerBoundary({ currentBoundary: 0.99, scenarioStructuredness: 1, outcome: 'success' }).updatedBoundary, 1);
});

test('incomplete attempts do not update and invalid outcomes fail safely', () => {
  const result = updateLearnerBoundary({ currentBoundary: 0.4, scenarioStructuredness: 0.5, outcome: 'incomplete' });
  assert.equal(result.updatedBoundary, 0.4);
  assert.throws(() => updateLearnerBoundary({ currentBoundary: 0.4, scenarioStructuredness: 0.5, outcome: 'clicked_submit' }), /Outcome must be/);
});

test('outcome rubric uses observable reasoning evidence and handles missing answers', () => {
  const strong = 'First I define a function and loop through the items because it keeps each step clear. If the list is empty, I return a safe message; otherwise I compare each value, explain why it matches, and then return the result.';
  assert.equal(evaluateOutcome(strong).outcome, 'success');
  assert.equal(evaluateOutcome('   ').outcome, 'incomplete');
  assert.equal(evaluateOutcome('I will use a loop and check each item in the list.').outcome, 'struggle');
});