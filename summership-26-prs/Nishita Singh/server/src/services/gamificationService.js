/**
 * All gamification numbers here are computed from real stored events
 * (responses and reflections), never stored as an independent mutable
 * counter - that keeps XP/level/badges/streak always consistent with what
 * the learner actually did, with no separate value that could drift out of
 * sync.
 */

const XP_RULES = {
  reasoningSubmitted: 10,
  reflectionSubmitted: 15,
  scenarioCompleted: 25,
  noHintUsed: 10,
  firstAttemptSuccess: 15
};

const XP_PER_LEVEL = 100;

const BADGE_DEFINITIONS = [
  {
    id: 'first-scenario',
    name: 'First Scenario',
    description: 'Complete your first scenario.',
    isUnlocked: (stats) => stats.completedScenarioIds.length >= 1
  },
  {
    id: 'variables-master',
    name: 'Variables Master',
    description: 'Complete 3 scenarios that use variables.',
    isUnlocked: (stats) => (stats.conceptCompletionCounts.variables || 0) >= 3
  },
  {
    id: 'loops-master',
    name: 'Loops Master',
    description: 'Complete 3 scenarios that use loops.',
    isUnlocked: (stats) => Object.entries(stats.conceptCompletionCounts)
      .filter(([concept]) => /loop/i.test(concept))
      .reduce((total, [, count]) => total + count, 0) >= 3
  },
  {
    id: 'critical-thinker',
    name: 'Critical Thinker',
    description: 'Submit 5 reflections.',
    isUnlocked: (stats) => stats.reflectionCount >= 5
  },
  {
    id: 'python-explorer',
    name: 'Python Explorer',
    description: 'Complete scenarios spanning 5 different concepts.',
    isUnlocked: (stats) => Object.keys(stats.conceptCompletionCounts).length >= 5
  }
];

function computeXp(responses, reflections) {
  let xp = 0;
  const submittedResponses = responses.filter((response) => response.step === 'submitted' || response.step === 'completed');

  submittedResponses.forEach((response) => {
    xp += XP_RULES.reasoningSubmitted;
    if (!response.hintsUsed) xp += XP_RULES.noHintUsed;
    if (response.feedback?.overallScore >= 80 && response.attemptNumber === 1) xp += XP_RULES.firstAttemptSuccess;
  });

  reflections.forEach(() => {
    xp += XP_RULES.reflectionSubmitted + XP_RULES.scenarioCompleted;
  });

  return xp;
}

function computeLevel(xp) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = xp % XP_PER_LEVEL;
  return {
    level,
    xpIntoLevel,
    xpForNextLevel: XP_PER_LEVEL,
    progressToNextLevel: Math.round((xpIntoLevel / XP_PER_LEVEL) * 100)
  };
}

function toDateKey(isoString) {
  return isoString.slice(0, 10);
}

/**
 * Streak = number of consecutive calendar days (ending today or yesterday,
 * so a learner does not lose their streak just for not having opened the
 * app yet today) in which the learner submitted a response or a reflection.
 */
function computeStreak(responses, reflections) {
  const dateKeys = new Set([
    ...responses.map((response) => toDateKey(response.updatedAt || response.createdAt)),
    ...reflections.map((reflection) => toDateKey(reflection.createdAt))
  ]);

  if (dateKeys.size === 0) return { current: 0, longest: 0 };

  const sortedDates = [...dateKeys].sort().reverse();
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  const yesterdayKey = new Date(today.getTime() - 86400000).toISOString().slice(0, 10);

  let current = 0;
  if (sortedDates[0] === todayKey || sortedDates[0] === yesterdayKey) {
    let cursor = new Date(sortedDates[0]);
    for (const dateKey of sortedDates) {
      const cursorKey = cursor.toISOString().slice(0, 10);
      if (dateKey === cursorKey) {
        current += 1;
        cursor = new Date(cursor.getTime() - 86400000);
      } else {
        break;
      }
    }
  }

  // Longest streak across all history, for display alongside the current one.
  const ascending = [...dateKeys].sort();
  let longest = 1;
  let running = 1;
  for (let i = 1; i < ascending.length; i += 1) {
    const previous = new Date(ascending[i - 1]);
    const diffDays = Math.round((new Date(ascending[i]) - previous) / 86400000);
    running = diffDays === 1 ? running + 1 : 1;
    longest = Math.max(longest, running);
  }

  return { current, longest: Math.max(longest, current) };
}

/**
 * Builds the concept -> completed-count map and the list of completed
 * scenario ids from reflections (a scenario counts as "completed" once its
 * reflection has been submitted, matching the guided flow's final step).
 */
function computeCompletionStats(reflections, scenariosById) {
  const completedScenarioIds = [...new Set(reflections.map((reflection) => reflection.scenarioId))];
  const conceptCompletionCounts = {};

  completedScenarioIds.forEach((scenarioId) => {
    const scenario = scenariosById.get(scenarioId);
    scenario?.concepts?.forEach((concept) => {
      conceptCompletionCounts[concept] = (conceptCompletionCounts[concept] || 0) + 1;
    });
  });

  return { completedScenarioIds, conceptCompletionCounts };
}

function computeBadges(stats) {
  return BADGE_DEFINITIONS.map((badge) => ({
    id: badge.id,
    name: badge.name,
    description: badge.description,
    unlocked: badge.isUnlocked(stats)
  }));
}

/**
 * The single entry point: given all of one learner's responses and
 * reflections plus a scenariosById lookup, returns every gamification value
 * used by the dashboard.
 */
function buildGamificationSummary(responses, reflections, scenariosById) {
  const completionStats = computeCompletionStats(reflections, scenariosById);
  const xp = computeXp(responses, reflections);
  const levelInfo = computeLevel(xp);
  const streak = computeStreak(responses, reflections);
  const badges = computeBadges({ ...completionStats, reflectionCount: reflections.length });

  return {
    xp,
    ...levelInfo,
    streak,
    badges,
    completedScenarioIds: completionStats.completedScenarioIds,
    conceptCompletionCounts: completionStats.conceptCompletionCounts
  };
}

module.exports = { buildGamificationSummary, XP_RULES, XP_PER_LEVEL, BADGE_DEFINITIONS };
