const store = require('../data/store');
const { buildProgress } = require('./progressService');
const { suggestDifficulty } = require('./adaptiveDifficultyService');
const scenarioGenerationService = require('./scenarioGenerationService');
const aiProviderFactory = require('./ai/aiProviderFactory');
const promptTemplates = require('./ai/promptTemplates');
const aiCache = require('./ai/aiCache');
const { MASTERY_CATEGORIES, LEARNING_PATH_TIERS, THEMES } = require('./ai/conceptVocabulary');

/**
 * Groups the learner's scored responses by mastery category and returns
 * categories whose average feedback score is below a "weak" threshold -
 * these get reinforced before new concepts are introduced.
 */
async function findWeakCategories(learnerId) {
  const responses = await store.listResponses(learnerId);
  const scored = responses.filter((response) => typeof response.feedback?.overallScore === 'number');
  if (!scored.length) return [];

  const scenariosById = new Map();
  await Promise.all(scored.map(async (response) => {
    if (!scenariosById.has(response.scenarioId)) {
      scenariosById.set(response.scenarioId, await store.getScenario(response.scenarioId));
    }
  }));

  const totals = {};
  scored.forEach((response) => {
    const scenario = scenariosById.get(response.scenarioId);
    scenario?.concepts?.forEach((tag) => {
      const category = Object.entries(MASTERY_CATEGORIES).find(([, tags]) => tags.includes(tag.toLowerCase()))?.[0];
      if (!category) return;
      if (!totals[category]) totals[category] = { sum: 0, count: 0 };
      totals[category].sum += response.feedback.overallScore;
      totals[category].count += 1;
    });
  });

  return Object.entries(totals)
    .filter(([, stats]) => stats.sum / stats.count < 60)
    .map(([category]) => category);
}

/**
 * Picks the next mastery category to focus on, walking the dependency
 * tiers in order and stopping at the first one that still has incomplete
 * scenarios.
 */
function nextCategoryFromTiers(conceptProgress) {
  for (const tier of LEARNING_PATH_TIERS) {
    const tags = MASTERY_CATEGORIES[tier.concept] || [];
    const hasIncomplete = tags.some((tag) => {
      const stats = conceptProgress[tag];
      return stats && stats.completed < stats.total;
    });
    const hasAnyData = tags.some((tag) => conceptProgress[tag]);
    if (hasIncomplete || !hasAnyData) return tier.concept;
  }
  return LEARNING_PATH_TIERS[0].concept;
}

async function findExistingCandidate({ category, difficulty, completedScenarioIds }) {
  const tags = MASTERY_CATEGORIES[category] || [];
  const db = await store.readDb();
  return db.scenarios.find((scenario) => (
    scenario.difficulty === difficulty
    && !completedScenarioIds.includes(scenario._id)
    && scenario.concepts?.some((tag) => tags.includes(tag.toLowerCase()))
  )) || null;
}

/**
 * Feature 3: Personalized Scenario Recommendation. Combines completed
 * concepts, weak concepts, difficulty progression (Feature 5), hint usage,
 * feedback history, and streak into one "what's next" recommendation. If
 * no existing scenario fits, a new one is generated on the fly (Feature 1
 * plumbing), so the learner genuinely never runs out.
 */
async function recommendNext(learnerId) {
  const [progress, difficultySuggestion, weakCategories] = await Promise.all([
    buildProgress(learnerId),
    suggestDifficulty(learnerId),
    findWeakCategories(learnerId)
  ]);

  const category = weakCategories[0] || nextCategoryFromTiers(progress.conceptProgress);
  const difficulty = difficultySuggestion.suggestedDifficulty;

  const { enrichScenarioSummary } = require('./scenarioEnrichment');
  const candidate = await findExistingCandidate({ category, difficulty, completedScenarioIds: progress.completedScenarios });
  let generated = false;

  const { scenario: enrichedScenario } = candidate
    ? { scenario: enrichScenarioSummary(candidate) }
    : await scenarioGenerationService.generateScenario({
      concept: category,
      difficulty,
      theme: THEMES[Math.floor(Math.random() * THEMES.length)],
      learnerId
    }).then((result) => { generated = true; return result; });

  const { value: rationale } = await aiCache.withCache(
    'recommendation-rationale',
    { learnerId, category, difficulty, weak: weakCategories.join(',') },
    10 * 60 * 1000,
    async () => {
      const promptRequest = promptTemplates.recommendationRationalePrompt({
        concept: category, difficulty, weakConcepts: weakCategories
      });
      const aiResponse = await aiProviderFactory.complete(promptRequest);
      return aiResponse.text;
    }
  );

  return {
    scenario: enrichedScenario,
    wasGenerated: generated,
    recommendedCategory: category,
    recommendedDifficulty: difficulty,
    weakCategories,
    streak: progress.streak,
    hintsUsed: progress.hintsUsed,
    rationale
  };
}

module.exports = { recommendNext, findWeakCategories };
