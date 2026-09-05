const store = require('../data/store');
const { buildProgress } = require('./progressService');
const { MASTERY_CATEGORIES } = require('./ai/conceptVocabulary');

const BANDS = ['Beginner', 'Developing', 'Proficient', 'Mastered'];

/**
 * Converts a 0-100 confidence score into one of the four requested bands.
 */
function bandFor(score) {
  if (score >= 85) return 'Mastered';
  if (score >= 65) return 'Proficient';
  if (score >= 35) return 'Developing';
  return 'Beginner';
}

function recommendationFor(band, category) {
  switch (band) {
    case 'Mastered':
      return `Try a Builder-level ${category} scenario to keep sharpening this skill.`;
    case 'Proficient':
      return `You're close - a couple more ${category} scenarios should get you to mastery.`;
    case 'Developing':
      return `Revisit ${category} with a hint or two if needed; you're building real understanding.`;
    default:
      return `Start with a Beginner ${category} scenario and lean on the guided questions.`;
  }
}

/**
 * Feature 10: Concept Mastery Prediction. Confidence per category blends
 * three real signals: how much of the category has been completed, average
 * feedback score on it, and how many hints were needed along the way
 * (fewer hints -> higher confidence).
 */
async function predictMastery(learnerId) {
  const [progress, responses] = await Promise.all([
    buildProgress(learnerId),
    store.listResponses(learnerId)
  ]);

  const scenariosById = new Map();
  await Promise.all(responses.map(async (response) => {
    if (!scenariosById.has(response.scenarioId)) {
      scenariosById.set(response.scenarioId, await store.getScenario(response.scenarioId));
    }
  }));

  return Object.entries(MASTERY_CATEGORIES).map(([category, tags]) => {
    const categoryResponses = responses.filter((response) => {
      const scenario = scenariosById.get(response.scenarioId);
      return scenario?.concepts?.some((tag) => tags.includes(tag.toLowerCase()))
        && typeof response.feedback?.overallScore === 'number';
    });

    const stats = tags.reduce((acc, tag) => {
      const tagStats = progress.conceptProgress[tag];
      if (!tagStats) return acc;
      return { total: acc.total + tagStats.total, completed: acc.completed + tagStats.completed };
    }, { total: 0, completed: 0 });

    if (!categoryResponses.length) {
      return { category, confidence: 0, band: 'Beginner', scenariosAttempted: 0, recommendation: recommendationFor('Beginner', category) };
    }

    const averageScore = categoryResponses.reduce((sum, response) => sum + response.feedback.overallScore, 0) / categoryResponses.length;
    const completionRate = stats.total ? stats.completed / stats.total : 0;
    const averageHints = categoryResponses.reduce((sum, response) => sum + (response.hintsUsed || 0), 0) / categoryResponses.length;
    const hintPenalty = Math.min(20, averageHints * 7);

    const confidence = Math.max(0, Math.min(100, Math.round(
      (averageScore * 0.6) + (completionRate * 100 * 0.3) + (10 - hintPenalty * 0.3)
    )));
    const band = bandFor(confidence);

    return {
      category,
      confidence,
      band,
      scenariosAttempted: categoryResponses.length,
      recommendation: recommendationFor(band, category)
    };
  });
}

module.exports = { predictMastery, BANDS };
