const store = require('../data/store');
const { buildGamificationSummary } = require('./gamificationService');

function toScenariosById(scenarios) {
  return new Map(scenarios.map((scenario) => [scenario._id, scenario]));
}

function computeDifficultyMastery(scenarios, completedScenarioIds) {
  const byDifficulty = {};
  scenarios.forEach((scenario) => {
    const key = scenario.difficulty || 'Unspecified';
    if (!byDifficulty[key]) byDifficulty[key] = { total: 0, completed: 0 };
    byDifficulty[key].total += 1;
    if (completedScenarioIds.includes(scenario._id)) byDifficulty[key].completed += 1;
  });
  return byDifficulty;
}

function computeConceptProgress(scenarios, completedScenarioIds) {
  const byConcept = {};
  scenarios.forEach((scenario) => {
    scenario.concepts?.forEach((concept) => {
      if (!byConcept[concept]) byConcept[concept] = { total: 0, completed: 0 };
      byConcept[concept].total += 1;
      if (completedScenarioIds.includes(scenario._id)) byConcept[concept].completed += 1;
    });
  });
  return byConcept;
}

function computeAverageFeedbackScore(responses) {
  const scored = responses.filter((response) => typeof response.feedback?.overallScore === 'number');
  if (!scored.length) return 0;
  const total = scored.reduce((sum, response) => sum + response.feedback.overallScore, 0);
  return Math.round(total / scored.length);
}

function computeTotalHintsUsed(responses) {
  return responses.reduce((total, response) => total + (response.hintsUsed || 0), 0);
}

/**
 * The learner's current step per scenario, for the "continue where you left
 * off" experience. Priority: a reflection means "completed"; otherwise a
 * response's own `step` field; otherwise a lightweight progress marker
 * (used before the learner has typed enough to save a full response); a
 * scenario with none of these has not been started.
 */
function buildStepByScenario(responses, reflections, markers) {
  const stepByScenario = {};
  markers.forEach((marker) => { stepByScenario[marker.scenarioId] = marker.step; });
  responses.forEach((response) => { stepByScenario[response.scenarioId] = response.step; });
  reflections.forEach((reflection) => { stepByScenario[reflection.scenarioId] = 'completed'; });
  return stepByScenario;
}

function buildRecentActivity(responses, reflections, scenariosById) {
  const activity = [
    ...responses
      .filter((response) => response.step === 'submitted' || response.step === 'completed')
      .map((response) => ({
        type: 'response',
        scenarioId: response.scenarioId,
        scenarioTitle: scenariosById.get(response.scenarioId)?.title || 'Unknown scenario',
        timestamp: response.updatedAt || response.createdAt,
        summary: 'Submitted reasoning'
      })),
    ...reflections.map((reflection) => ({
      type: 'reflection',
      scenarioId: reflection.scenarioId,
      scenarioTitle: scenariosById.get(reflection.scenarioId)?.title || 'Unknown scenario',
      timestamp: reflection.createdAt,
      summary: 'Completed scenario with a reflection'
    }))
  ];
  return activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
}

function buildContinueLearning(stepByScenario, completedScenarioIds, scenariosById) {
  return Object.entries(stepByScenario)
    .filter(([scenarioId, step]) => step !== 'completed' && !completedScenarioIds.includes(scenarioId))
    .map(([scenarioId, step]) => {
      const scenario = scenariosById.get(scenarioId);
      return scenario ? { scenarioId, step, title: scenario.title, difficulty: scenario.difficulty } : null;
    })
    .filter(Boolean)
    .slice(0, 5);
}

async function buildProgress(learnerId) {
  const [db, responses, reflections, markers] = await Promise.all([
    store.readDb(),
    store.listResponses(learnerId),
    store.listReflections(learnerId),
    store.listProgressMarkers(learnerId)
  ]);
  const scenariosById = toScenariosById(db.scenarios);
  const gamification = buildGamificationSummary(responses, reflections, scenariosById);
  const stepByScenario = buildStepByScenario(responses, reflections, markers);

  return {
    learnerId,
    completedScenarios: gamification.completedScenarioIds,
    completedConcepts: Object.keys(gamification.conceptCompletionCounts),
    difficultyMastery: computeDifficultyMastery(db.scenarios, gamification.completedScenarioIds),
    conceptProgress: computeConceptProgress(db.scenarios, gamification.completedScenarioIds),
    reflectionCount: reflections.length,
    averageFeedbackScore: computeAverageFeedbackScore(responses),
    hintsUsed: computeTotalHintsUsed(responses),
    xp: gamification.xp,
    level: gamification.level,
    xpIntoLevel: gamification.xpIntoLevel,
    xpForNextLevel: gamification.xpForNextLevel,
    progressToNextLevel: gamification.progressToNextLevel,
    streak: gamification.streak,
    badges: gamification.badges,
    stepByScenario,
    totalScenarios: db.scenarios.length
  };
}

async function buildDashboard(learnerId) {
  const [db, responses, reflections, markers, progress] = await Promise.all([
    store.readDb(),
    store.listResponses(learnerId),
    store.listReflections(learnerId),
    store.listProgressMarkers(learnerId),
    buildProgress(learnerId)
  ]);
  const scenariosById = toScenariosById(db.scenarios);

  return {
    ...progress,
    recentActivity: buildRecentActivity(responses, reflections, scenariosById),
    continueLearning: buildContinueLearning(progress.stepByScenario, progress.completedScenarios, scenariosById),
    completedScenarioDetails: progress.completedScenarios
      .map((scenarioId) => scenariosById.get(scenarioId))
      .filter(Boolean)
      .map((scenario) => ({ _id: scenario._id, title: scenario.title, difficulty: scenario.difficulty, concepts: scenario.concepts }))
  };
}

module.exports = { buildProgress, buildDashboard };
