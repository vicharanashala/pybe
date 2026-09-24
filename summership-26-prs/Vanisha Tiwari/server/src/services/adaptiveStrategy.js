function chooseStrategy(profile, misconceptions = []) {
  const repeated =
    profile.repeatedMisconceptions || [];

  // Learner repeatedly makes the same mistake
  if (
    repeated.length > 0 ||
    misconceptions.length > 0
  ) {
    return {
      mode: 'REMEDIATE',
      reason:
        'Focus on correcting a misconception before introducing more complexity.'
    };
  }

  // Learner consistently writes strong prompts
  if (
    profile.averagePromptScore >= 80
  ) {
    return {
      mode: 'CHALLENGE',
      reason:
        'The learner is demonstrating strong prompt quality and can handle a deeper question.'
    };
  }

  // No meaningful history yet
  if (
    profile.sessionsAnalyzed === 0
  ) {
    return {
      mode: 'EXPLAIN',
      reason:
        'Introduce the concept clearly before increasing difficulty.'
    };
  }

  return {
    mode: 'ENCOURAGE',
    reason:
      'Reinforce the learner’s progress and ask a slightly deeper question.'
  };
}

module.exports = {
  chooseStrategy
};