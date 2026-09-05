const { buildProgress } = require('./progressService');
const { LEARNING_PATH_TIERS, MASTERY_CATEGORIES } = require('./ai/conceptVocabulary');

function categoryStatus(category, conceptProgress) {
  const tags = MASTERY_CATEGORIES[category] || [];
  const stats = tags.reduce((acc, tag) => {
    const tagStats = conceptProgress[tag];
    if (!tagStats) return acc;
    return { total: acc.total + tagStats.total, completed: acc.completed + tagStats.completed };
  }, { total: 0, completed: 0 });

  if (stats.total === 0) return { status: 'future', ...stats };
  if (stats.completed >= stats.total) return { status: 'completed', ...stats };
  if (stats.completed > 0) return { status: 'current', ...stats };
  return { status: 'not-started', ...stats };
}

/**
 * Rough completion pace: scenarios completed per day the learner has been
 * active, used to turn "N scenarios remaining" into an estimated date
 * rather than a raw count.
 */
function estimateCompletionDate(remainingScenarios, completedScenarioCount, hasActivity) {
  if (!remainingScenarios) return null;
  if (!hasActivity || completedScenarioCount === 0) {
    const days = remainingScenarios * 2;
    return new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
  }
  const pacePerDay = 0.5; // conservative default pace once the learner is active
  const daysRemaining = Math.ceil(remainingScenarios / pacePerDay);
  return new Date(Date.now() + daysRemaining * 86400000).toISOString().slice(0, 10);
}

/**
 * Feature 6: Personalized Learning Path. Walks the fixed concept
 * dependency graph (services/ai/conceptVocabulary.js) and annotates each
 * tier with the learner's real progress.
 */
async function buildLearningPath(learnerId) {
  const progress = await buildProgress(learnerId);

  const tiers = LEARNING_PATH_TIERS.map((tier) => ({
    tier: tier.tier,
    concept: tier.concept,
    dependsOn: tier.dependsOn,
    ...categoryStatus(tier.concept, progress.conceptProgress)
  }));

  const currentTier = tiers.find((tier) => tier.status === 'current')
    || tiers.find((tier) => tier.status === 'not-started');
  const nextIncompleteIndex = tiers.findIndex((tier) => tier.status !== 'completed');
  const recommendedNext = nextIncompleteIndex >= 0 ? tiers[nextIncompleteIndex] : null;

  const remainingScenarios = tiers.reduce((sum, tier) => sum + Math.max(0, tier.total - tier.completed), 0);
  const totalCompleted = tiers.reduce((sum, tier) => sum + tier.completed, 0);

  return {
    tiers,
    completedConcepts: tiers.filter((tier) => tier.status === 'completed').map((tier) => tier.concept),
    currentConcept: currentTier?.concept || recommendedNext?.concept || tiers[0].concept,
    recommendedNextConcept: recommendedNext?.concept || null,
    futureConcepts: tiers.filter((tier) => tier.status === 'future').map((tier) => tier.concept),
    estimatedCompletionDate: estimateCompletionDate(remainingScenarios, totalCompleted, progress.streak?.current > 0)
  };
}

module.exports = { buildLearningPath };
