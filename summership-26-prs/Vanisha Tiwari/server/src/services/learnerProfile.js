function buildLearnerProfile(sessions = []) {
  const concepts = {};
  const misconceptions = {};
  let totalPromptScore = 0;
  let promptScoreCount = 0;

  for (const session of sessions) {
    // Track concepts
    const sessionConcepts =
      session.abstractionMap || [];

    for (const item of sessionConcepts) {
      const concept =
        item.pythonConcept;

      if (!concept) continue;

      concepts[concept] =
        (concepts[concept] || 0) + 1;
    }

    // Track misconceptions
    for (const mistake of session.misconceptions || []) {
      misconceptions[mistake] =
        (misconceptions[mistake] || 0) + 1;
    }

    // Track prompt quality
    if (
      typeof session.promptScore === 'number'
    ) {
      totalPromptScore +=
        session.promptScore;

      promptScoreCount++;
    }
  }

  const averagePromptScore =
    promptScoreCount
      ? Math.round(
          totalPromptScore /
            promptScoreCount
        )
      : 0;

  const repeatedMisconceptions =
    Object.entries(misconceptions)
      .filter(
        ([, count]) => count >= 2
      )
      .map(
        ([mistake, count]) => ({
          mistake,
          occurrences: count
        })
      );

  return {
    sessionsAnalyzed: sessions.length,

    concepts,

    misconceptions,

    repeatedMisconceptions,

    averagePromptScore
  };
}

module.exports = {
  buildLearnerProfile
};