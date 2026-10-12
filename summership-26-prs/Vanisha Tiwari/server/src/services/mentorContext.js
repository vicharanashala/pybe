function buildMentorContext({
  scenario,
  reasoning,
  abstractionMap,
  generatedCode,
  promptScore,
  promptFeedback,
  reflection,
  misconceptions,
  masterySignals
}) {
  return {
    scenario: {
      id: scenario._id,
      title: scenario.title,
      difficulty: scenario.difficulty,
      concepts: scenario.concepts,
      context: scenario.context,
      objectives: scenario.objectives
    },

    learnerReasoning: reasoning,

    abstractionMap,

    generatedCode,

    promptEvaluation: {
      score: promptScore,
      feedback: promptFeedback
    },

    reflection: reflection || '',

    misconceptions: misconceptions || [],

    masterySignals: masterySignals || []
  };
}

module.exports = {
  buildMentorContext
};