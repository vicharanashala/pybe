function buildLearnerHistory(
  sessions = [],
  currentScenarioId,
  currentConcepts = [],
  currentMisconceptions = []
) {
  const history = sessions
    .filter((session) => {
      const scenarioId =
        typeof session.scenario === 'object'
          ? session.scenario._id
          : session.scenario;

      return scenarioId !== currentScenarioId;
    })
    .map((session) => {
      const concepts =
        session.abstractionMap?.map(
          (item) => item.pythonConcept
        ) || [];

      const misconceptions =
        session.misconceptions || [];

      const conceptMatch = concepts.some(
        (concept) =>
          currentConcepts.includes(concept)
      );

      const misconceptionMatch =
        misconceptions.some((misconception) =>
          currentMisconceptions.includes(
            misconception
          )
        );

      let relevanceScore = 0;

      if (conceptMatch) {
        relevanceScore += 2;
      }

      if (misconceptionMatch) {
        relevanceScore += 3;
      }

      return {
        relevanceScore,

        scenario:
          typeof session.scenario === 'object'
            ? session.scenario.title
            : 'Previous scenario',

        concepts,

        promptScore:
          session.promptScore || 0,

        misconceptions,

        reasoning:
          session.reasoning || ''
      };
    });

  return history
  .filter(
    (session) => session.relevanceScore > 0
  )
  .sort(
    (a, b) =>
      b.relevanceScore -
      a.relevanceScore
  )
  .slice(0, 5)
  .map(
    ({
      relevanceScore,
      ...session
    }) => session
  );
}

module.exports = {
  buildLearnerHistory
};