const ADAPTATION_POLICY = Object.freeze({
  defaultBoundary: 0.22,
  relationshipBand: 0.08,
  successStep: 0.03,
  struggleStep: 0.02,
  recentHistoryLimit: 3,
});

const clamp = (value) => Math.min(Math.max(value, 0), 1);

function getTargetStructuredness(scenario) {
  const value = scenario?.targetStructuredness ?? scenario?.structuredness?.baselineScore;
  return Number.isFinite(value) && value >= 0 && value <= 1 ? value : null;
}

function classifyRelationship(target, boundary, band = ADAPTATION_POLICY.relationshipBand) {
  if (target < boundary - band) return 'below_boundary';
  if (target > boundary + band) return 'above_boundary';
  return 'near_boundary';
}

function selectNextScenario({ learnerBoundary, scenarios, history = [], currentScenarioId = null }) {
  const boundary = Number.isFinite(learnerBoundary) ? clamp(learnerBoundary) : ADAPTATION_POLICY.defaultBoundary;
  const recentIds = new Set(history.slice(-ADAPTATION_POLICY.recentHistoryLimit).map((event) => event.scenarioId));
  const valid = (Array.isArray(scenarios) ? scenarios : [])
    .map((scenario) => ({ scenario, target: getTargetStructuredness(scenario) }))
    .filter(({ scenario, target }) => scenario?.id && target !== null);

  if (valid.length === 0) {
    return { scenario: null, adaptation: {
      learnerBoundary: boundary,
      targetStructuredness: null,
      relationship: 'unavailable',
      reason: 'No available scenario has a valid structuredness estimate.',
      decision: 'no_scenario_available',
    } };
  }

  const nonRecent = valid.filter(({ scenario }) => scenario.id !== currentScenarioId && !recentIds.has(scenario.id));
  const notCurrent = valid.filter(({ scenario }) => scenario.id !== currentScenarioId);
  const candidates = nonRecent.length > 0 ? nonRecent : notCurrent.length > 0 ? notCurrent : valid;
  const selected = candidates.sort((left, right) => {
    const leftStretch = classifyRelationship(left.target, boundary) === 'above_boundary' ? 1 : 0;
    const rightStretch = classifyRelationship(right.target, boundary) === 'above_boundary' ? 1 : 0;
    return leftStretch - rightStretch ||
      Math.abs(left.target - boundary) - Math.abs(right.target - boundary) ||
      String(left.scenario.id).localeCompare(String(right.scenario.id));
  })[0];
  const relationship = classifyRelationship(selected.target, boundary);
  const repeated = selected.scenario.id === currentScenarioId || recentIds.has(selected.scenario.id);

  return { scenario: selected.scenario, adaptation: {
    learnerBoundary: Number(boundary.toFixed(3)),
    targetStructuredness: Number(selected.target.toFixed(3)),
    relationship,
    reason: repeated
      ? 'All suitable scenarios were recently attempted, so the closest available challenge is repeated.'
      : relationship === 'above_boundary'
        ? 'Selected the closest available scenario above the learner boundary as a manageable stretch.'
        : 'Selected the available scenario closest to the learner boundary without unnecessary repetition.',
    decision: repeated ? 'repeat_fallback' : 'selected_nearest_appropriate',
  } };
}

function updateLearnerBoundary({ currentBoundary, scenarioStructuredness, outcome, policy = ADAPTATION_POLICY }) {
  const boundary = Number.isFinite(currentBoundary) ? clamp(currentBoundary) : policy.defaultBoundary;
  const scenarioScore = Number.isFinite(scenarioStructuredness) ? clamp(scenarioStructuredness) : null;
  if (!['success', 'struggle', 'incomplete'].includes(outcome)) {
    throw new TypeError('Outcome must be success, struggle, or incomplete.');
  }
  if (outcome === 'incomplete' || scenarioScore === null) {
    return { previousBoundary: boundary, updatedBoundary: boundary, change: 0, reason: 'No progression for incomplete outcome or missing scenario score.' };
  }
  if (outcome === 'success') {
    const isNearBoundary = scenarioScore >= boundary - policy.relationshipBand;
    const updatedBoundary = isNearBoundary
      ? clamp(Math.min(boundary + policy.successStep, scenarioScore + policy.relationshipBand))
      : boundary;
    return {
      previousBoundary: boundary,
      updatedBoundary,
      change: Number((updatedBoundary - boundary).toFixed(3)),
      reason: updatedBoundary > boundary
        ? 'Successful attempt nudged the challenge boundary upward by one configured step.'
        : 'The learner succeeded on a challenge below the near-boundary band; no upward change was needed.',
    };
  }
  const updatedBoundary = scenarioScore > boundary ? boundary : clamp(Math.max(scenarioScore, boundary - policy.struggleStep));
  return {
    previousBoundary: boundary,
    updatedBoundary,
    change: Number((updatedBoundary - boundary).toFixed(3)),
    reason: scenarioScore > boundary
      ? 'Struggle above the current boundary does not raise it.'
      : 'Struggle at or below the boundary nudged it down by at most one configured step.',
  };
}

module.exports = { ADAPTATION_POLICY, classifyRelationship, getTargetStructuredness, selectNextScenario, updateLearnerBoundary };