/**
 * analytics.service.js
 * -----------------------------------------------------------------------
 * Pure function – no HTTP, no database.
 * -----------------------------------------------------------------------
 */

/**
 * Compute dashboard analytics from raw arrays.
 *
 * @param {Array} sessions  – parsed session objects
 * @param {Array} scenarios – parsed scenario objects
 * @returns {{ scenarioCount, sessionCount, averagePromptScore, conceptCounts }}
 */
function computeAnalytics(sessions, scenarios) {
  const scenarioCount = scenarios.length;
  const sessionCount = sessions.length;

  // Average prompt score
  let averagePromptScore = 0;
  if (sessionCount > 0) {
    const total = sessions.reduce((sum, s) => sum + (s.promptScore || 0), 0);
    averagePromptScore = Math.round((total / sessionCount) * 100) / 100;
  }

  // Concept frequency across all scenarios
  const conceptCounts = {};
  for (const scenario of scenarios) {
    const concepts = Array.isArray(scenario.concepts) ? scenario.concepts : [];
    for (const concept of concepts) {
      const key = concept.toLowerCase().trim();
      conceptCounts[key] = (conceptCounts[key] || 0) + 1;
    }
  }

  return {
    scenarioCount,
    sessionCount,
    averagePromptScore,
    conceptCounts,
  };
}

module.exports = { computeAnalytics };
