function chooseDifficulty({
  profile = {},
  promptScore = 0,
  misconceptions = [],
  strategy = {}
}) {
  // Repeated or current misconceptions
  // should keep the learner at foundation level.
  if (
    strategy.mode === 'REMEDIATE' ||
    misconceptions.length > 0
  ) {
    return {
      level: 'FOUNDATION',
      reason:
        'The learner needs stronger understanding of the current concept before increasing difficulty.'
    };
  }

  // Strong and consistent performance
  // allows the mentor to increase difficulty.
  if (
    strategy.mode === 'CHALLENGE' &&
    promptScore >= 80 &&
    (profile.averagePromptScore || 0) >= 70
  ) {
    return {
      level: 'ADVANCED',
      reason:
        'The learner is consistently demonstrating strong performance.'
    };
  }

  // Moderate performance
  // gets an application-level question.
  if (
    promptScore >= 60 ||
    (profile.averagePromptScore || 0) >= 60
  ) {
    return {
      level: 'INTERMEDIATE',
      reason:
        'The learner has enough understanding to apply the concept in a new situation.'
    };
  }

  // Default
  return {
    level: 'FOUNDATION',
    reason:
      'Build the core concept before increasing complexity.'
  };
}

module.exports = {
  chooseDifficulty
};