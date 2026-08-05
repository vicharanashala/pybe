const store = require('../data/store');
const { DIFFICULTIES } = require('./ai/conceptVocabulary');

const STRONG_THRESHOLD = 80;
const STRUGGLING_THRESHOLD = 50;
const RECENT_WINDOW = 5;

/**
 * Feature 5: Adaptive Difficulty. A small, fully deterministic algorithm
 * (no AI call needed - this is a scoring decision, not a creative one) that
 * looks at the learner's most recent submitted responses' feedback scores
 * and proposes the next difficulty tier, moving at most one step at a time
 * so difficulty never jumps too far.
 */
async function suggestDifficulty(learnerId) {
  const responses = await store.listResponses(learnerId);
  const scored = responses
    .filter((response) => typeof response.feedback?.overallScore === 'number')
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

  const recent = scored.slice(0, RECENT_WINDOW);

  if (!recent.length) {
    return {
      currentDifficulty: DIFFICULTIES[0],
      suggestedDifficulty: DIFFICULTIES[0],
      trend: 'new-learner',
      reason: "You haven't submitted any scenarios yet - starting at Beginner is the right call."
    };
  }

  const scenariosById = new Map();
  await Promise.all(recent.map(async (response) => {
    if (!scenariosById.has(response.scenarioId)) {
      scenariosById.set(response.scenarioId, await store.getScenario(response.scenarioId));
    }
  }));

  const currentDifficulty = scenariosById.get(recent[0].scenarioId)?.difficulty || DIFFICULTIES[0];
  const averageScore = Math.round(recent.reduce((sum, response) => sum + response.feedback.overallScore, 0) / recent.length);
  const currentIndex = DIFFICULTIES.indexOf(currentDifficulty);

  let suggestedIndex = currentIndex;
  let trend = 'steady';
  let reason = `Your recent average feedback score is ${averageScore}, so staying at ${currentDifficulty} keeps a good challenge.`;

  if (averageScore >= STRONG_THRESHOLD && currentIndex < DIFFICULTIES.length - 1) {
    suggestedIndex = currentIndex + 1;
    trend = 'increasing';
    reason = `Your recent average feedback score is ${averageScore} - strong enough to step up to ${DIFFICULTIES[suggestedIndex]}.`;
  } else if (averageScore < STRUGGLING_THRESHOLD && currentIndex > 0) {
    suggestedIndex = currentIndex - 1;
    trend = 'decreasing';
    reason = `Your recent average feedback score is ${averageScore} - a ${DIFFICULTIES[suggestedIndex]} scenario next will help rebuild confidence before trying ${currentDifficulty} again.`;
  }

  return {
    currentDifficulty,
    suggestedDifficulty: DIFFICULTIES[suggestedIndex],
    averageScore,
    trend,
    reason
  };
}

module.exports = { suggestDifficulty };
