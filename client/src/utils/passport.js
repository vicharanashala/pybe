const PASSPORT_KEY = 'pybe_passport';
const PASSPORT_VERSION = 1;

export const PYTHON_CONCEPTS = [
  { id: 'variables', name: 'Variables', icon: '\u2699\ufe0f', description: 'Store and name values', roadmapLevel: 0 },
  { id: 'loops', name: 'Loops', icon: '\u21bb', description: 'Repeat actions automatically', roadmapLevel: 0 },
  { id: 'conditionals', name: 'Conditionals', icon: '\u2192', description: 'Make decisions in code', roadmapLevel: 0 },
  { id: 'functions', name: 'Functions', icon: '\u26a1', description: 'Reusable blocks of logic', roadmapLevel: 1 },
  { id: 'lists', name: 'Lists', icon: '\u2261', description: 'Ordered collections of items', roadmapLevel: 1 },
  { id: 'tuples', name: 'Tuples', icon: '\u25e2', description: 'Immutable ordered sequences', roadmapLevel: 1 },
  { id: 'dictionaries', name: 'Dictionaries', icon: '\u2261', description: 'Key-value data storage', roadmapLevel: 1 },
  { id: 'sets', name: 'Sets', icon: '\u2205', description: 'Unique unordered items', roadmapLevel: 1 },
  { id: 'strings', name: 'Strings', icon: '\u201c\u201d', description: 'Text data manipulation', roadmapLevel: 0 },
  { id: 'files', name: 'Files', icon: '\u{1f4c4}', description: 'Read and write data', roadmapLevel: 2 },
  { id: 'modules', name: 'Modules', icon: '\u25a1', description: 'Organize and import code', roadmapLevel: 2 },
  { id: 'comprehensions', name: 'Comprehensions', icon: '\u2194', description: 'Compact collection creation', roadmapLevel: 2 },
  { id: 'classes', name: 'Classes', icon: '\u25ce', description: 'Object-oriented blueprints', roadmapLevel: 2 },
  { id: 'objects', name: 'Objects', icon: '\u25cf', description: 'Instances of classes', roadmapLevel: 2 },
  { id: 'exceptions', name: 'Exceptions', icon: '\u26a0\ufe0f', description: 'Handle errors gracefully', roadmapLevel: 3 },
  { id: 'io', name: 'Input / Output', icon: '\u2197\ufe0f', description: 'User interaction and output', roadmapLevel: 0 },
  { id: 'recursion', name: 'Recursion', icon: '\u21ba', description: 'Functions calling themselves', roadmapLevel: 3 },
  { id: 'algorithms', name: 'Algorithms', icon: '\u2699\ufe0f', description: 'Step-by-step problem solving', roadmapLevel: 3 },
];

export const BADGES = [
  { id: 'bronze_beginner', name: 'Bronze', title: 'Beginner Explorer', level: 'bronze', icon: '\u{1f949}', roadmapLevel: 0, requirement: { type: 'scenarios_completed', count: 3, conceptLevel: 0 } },
  { id: 'silver_explorer', name: 'Silver', title: 'Explorer', level: 'silver', icon: '\u{1f948}', roadmapLevel: 1, requirement: { type: 'scenarios_completed', count: 8, conceptLevel: 1 } },
  { id: 'gold_builder', name: 'Gold', title: 'Builder', level: 'gold', icon: '\u{1f947}', roadmapLevel: 2, requirement: { type: 'scenarios_completed', count: 15, conceptLevel: 2 } },
  { id: 'diamond_advanced', name: 'Diamond', title: 'Advanced Master', level: 'diamond', icon: '\u{1f48e}', roadmapLevel: 3, requirement: { type: 'scenarios_completed', count: 25, conceptLevel: 3 } },
];

export const MASTERY_THRESHOLD = 3;
export const MASTERY_ACCURACY = 90;

export function getDefaultPassport() {
  return {
    version: PASSPORT_VERSION,
    stamps: {},
    badges: {},
    unlockedAt: null,
    totalXp: 0,
    sessionsCompleted: 0,
    conceptProgress: {},
    savedAt: Date.now(),
  };
}

export function loadPassport() {
  try {
    const raw = localStorage.getItem(PASSPORT_KEY);
    if (!raw) return getDefaultPassport();

    const data = JSON.parse(raw);
    if (!data || data.version !== PASSPORT_VERSION) {
      clearPassport();
      return getDefaultPassport();
    }

    const age = Date.now() - data.savedAt;
    if (age > 30 * 24 * 60 * 60 * 1000) {
      data.savedAt = Date.now();
    }

    return data;
  } catch (e) {
    console.warn('Could not load passport:', e);
    return getDefaultPassport();
  }
}

export function savePassport(passport) {
  try {
    passport.savedAt = Date.now();
    localStorage.setItem(PASSPORT_KEY, JSON.stringify(passport));
  } catch (e) {
    console.warn('Could not save passport:', e);
  }
}

export function clearPassport() {
  try {
    localStorage.removeItem(PASSPORT_KEY);
  } catch (e) {
    console.warn('Could not clear passport:', e);
  }
}

export function updatePassportFromSession(passport, session, quizScore) {
  const scenario = session.scenario;
  const concepts = scenario?.concepts || [];
  const xpEarned = session.earnedXp || 0;

  passport.totalXp += xpEarned;
  passport.sessionsCompleted++;

  for (const concept of concepts) {
    if (!passport.stamps[concept]) {
      passport.stamps[concept] = {
        status: 'unlocked',
        unlockedAt: Date.now(),
        sessionCount: 1,
        bestAccuracy: quizScore || 0,
      };
    } else {
      passport.stamps[concept].sessionCount++;
      if (quizScore !== undefined && quizScore > passport.stamps[concept].bestAccuracy) {
        passport.stamps[concept].bestAccuracy = quizScore;
      }
      if (passport.stamps[concept].status !== 'mastered') {
        passport.stamps[concept].unlockedAt = Date.now();
      }
    }

    if (!passport.conceptProgress[concept]) {
      passport.conceptProgress[concept] = 0;
    }
    passport.conceptProgress[concept]++;

    if (passport.stamps[concept].sessionCount >= MASTERY_THRESHOLD || passport.stamps[concept].bestAccuracy >= MASTERY_ACCURACY) {
      if (passport.stamps[concept].status !== 'mastered') {
        passport.stamps[concept].status = 'mastered';
        passport.stamps[concept].masteredAt = Date.now();
      }
    }
  }

  const newBadge = checkBadgeUnlock(passport);
  passport.lastBadgeUnlocked = newBadge;

  return passport;
}

export function checkBadgeUnlock(passport) {
  for (const badge of BADGES) {
    if (passport.badges[badge.id]) continue;

    const conceptCount = Object.keys(passport.stamps).filter(concept => {
      const conceptInfo = PYTHON_CONCEPTS.find(c => c.id === concept);
      return conceptInfo && conceptInfo.roadmapLevel === badge.roadmapLevel;
    }).length;

    const completedSessions = passport.sessionsCompleted || 0;
    const requirement = badge.requirement;

    let unlocked = false;
    if (requirement.type === 'scenarios_completed') {
      unlocked = completedSessions >= requirement.count;
    }

    if (unlocked) {
      passport.badges[badge.id] = {
        earnedAt: Date.now(),
        xpAtUnlock: passport.totalXp,
        conceptCount: conceptCount,
      };
      return badge;
    }
  }
  return null;
}

export function getStampStatus(passport, conceptId) {
  if (!passport.stamps[conceptId]) return 'locked';
  return passport.stamps[conceptId].status || 'unlocked';
}

export function getBadgeStatus(passport, badgeId) {
  return passport.badges[badgeId] ? 'earned' : 'locked';
}

export function getPassportCompletion(passport) {
  const total = PYTHON_CONCEPTS.length;
  const unlocked = Object.keys(passport.stamps).length;
  return {
    collected: unlocked,
    total: total,
    percentage: Math.round((unlocked / total) * 100),
  };
}

export function getNextBadge(passport) {
  for (const badge of BADGES) {
    if (!passport.badges[badge.id]) {
      const conceptCount = Object.keys(passport.stamps).filter(concept => {
        const conceptInfo = PYTHON_CONCEPTS.find(c => c.id === concept);
        return conceptInfo && conceptInfo.roadmapLevel === badge.roadmapLevel;
      }).length;
      return { badge, conceptCount };
    }
  }
  return null;
}

export function getNextStamp(passport) {
  for (const concept of PYTHON_CONCEPTS) {
    if (!passport.stamps[concept.id]) {
      return concept;
    }
  }
  return null;
}

export function hasNewUnlock(passport) {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;

  for (const concept of PYTHON_CONCEPTS) {
    const stamp = passport.stamps[concept.id];
    if (stamp && stamp.unlockedAt && stamp.unlockedAt > oneHourAgo && !stamp.seen) {
      return true;
    }
  }
  return false;
}

export function markStampSeen(passport, conceptId) {
  if (passport.stamps[conceptId]) {
    passport.stamps[conceptId].seen = true;
  }
}

export function updateStampAccuracy(passport, conceptAccuracies) {
  if (!passport) return passport;
  for (const [concept, accuracy] of Object.entries(conceptAccuracies || {})) {
    if (!concept) continue;
    if (passport.stamps?.[concept]) {
      if (accuracy > passport.stamps[concept].bestAccuracy) {
        passport.stamps[concept].bestAccuracy = accuracy;
      }
      if (accuracy >= MASTERY_ACCURACY && passport.stamps[concept].status !== 'mastered') {
        passport.stamps[concept].status = 'mastered';
        passport.stamps[concept].masteredAt = Date.now();
      }
    }
  }
  return passport;
}

export function getRecentUnlocks(passport, limit = 5) {
  const unlocks = [];
  const now = Date.now();
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

  for (const concept of PYTHON_CONCEPTS) {
    const stamp = passport.stamps[concept.id];
    if (stamp && stamp.unlockedAt && stamp.unlockedAt > oneWeekAgo) {
      unlocks.push({ type: 'stamp', concept, stamp });
    }
  }

  for (const badge of BADGES) {
    const earned = passport.badges[badge.id];
    if (earned && earned.earnedAt && earned.earnedAt > oneWeekAgo) {
      unlocks.push({ type: 'badge', badge, earned });
    }
  }

  unlocks.sort((a, b) => ((b.stamp?.unlockedAt || b.earned?.earnedAt) || 0) - ((a.stamp?.unlockedAt || a.earned?.earnedAt) || 0));
  return unlocks.slice(0, limit);
}