// Mastery Progression Engine
//
// Pedagogical grounding:
// - Bloom's "Learning for Mastery" (1968): learners advance only after crossing an
//   explicit mastery threshold, instead of moving on with gaps.
// - Piaget's stage theory: the three PyBe difficulties are treated as cognitive
//   stages that build on each other rather than arbitrary labels.
// - Vygotsky's Zone of Proximal Development: the recommender surfaces scenarios
//   that stretch the learner's weakest concepts while staying within reach.
//
// Everything below is deterministic and local, consistent with the PyBe V0
// constraint of rule-based logic with no external AI calls.

const MASTERY_THRESHOLD = Number(process.env.MASTERY_THRESHOLD) || 70;
const MIN_SESSIONS_TO_ADVANCE = 3;
const COVERAGE_TO_ADVANCE = 0.5;

const LEVELS = [
  {
    level: 'Beginner',
    stage: 'Concrete Foundations',
    piaget: 'Concrete operations: reasoning anchored to tangible, single-step situations.'
  },
  {
    level: 'Explorer',
    stage: 'Relational Thinking',
    piaget: 'Transitional stage: coordinating repetition, comparison, and grouping.'
  },
  {
    level: 'Builder',
    stage: 'Formal Abstraction',
    piaget: 'Formal operations: designing reusable, general procedures from rules.'
  }
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Mastery per curriculum concept (the tags on scenarios, e.g. "loops").
// Signals per concept, drawn from every session touching a scenario with that tag:
//   exposure      – repeated engagement (max 40)
//   prompt quality – avg prompt maturity score (max 40)
//   abstraction depth – avg reasoning patterns recognized per session (max 15)
//   reflection    – bonus for reflective practice (max 5)
//   misconceptions – penalty for flagged reasoning gaps (up to -20)
function computeConceptMastery(sessions) {
  const perConcept = {};

  sessions.forEach((session) => {
    const concepts = session.scenario?.concepts || [];
    concepts.forEach((concept) => {
      if (!perConcept[concept]) {
        perConcept[concept] = { count: 0, promptTotal: 0, mapTotal: 0, reflections: 0, misconceptions: 0 };
      }
      const entry = perConcept[concept];
      entry.count += 1;
      entry.promptTotal += session.promptScore || 0;
      entry.mapTotal += (session.abstractionMap || []).length;
      if ((session.reflection || '').trim().length > 0) entry.reflections += 1;
      entry.misconceptions += (session.misconceptions || []).length;
    });
  });

  return Object.entries(perConcept).map(([concept, entry]) => {
    const exposure = Math.min(entry.count, 4) * 10;
    const promptQuality = (entry.promptTotal / entry.count) * 0.4;
    const abstractionDepth = Math.min(entry.mapTotal / entry.count, 3) * 5;
    const reflectionBonus = entry.reflections > 0 ? 5 : 0;
    const misconceptionPenalty = Math.min(entry.misconceptions * 5, 20);
    const mastery = clamp(Math.round(exposure + promptQuality + abstractionDepth + reflectionBonus - misconceptionPenalty), 0, 100);
    return {
      concept,
      mastery,
      sessions: entry.count,
      status: mastery >= MASTERY_THRESHOLD ? 'Mastered' : mastery >= MASTERY_THRESHOLD / 2 ? 'Developing' : 'Emerging'
    };
  }).sort((a, b) => b.mastery - a.mastery);
}

// Level progression: a level's concept pool is every tag used by its scenarios.
// The next stage unlocks once the learner has (a) completed enough sessions at the
// current stage and (b) mastered at least half of its concept pool — Bloom's
// threshold applied at the stage boundary.
function computeLevelProgress(scenarios, sessions, conceptMastery) {
  const masteryByConcept = Object.fromEntries(conceptMastery.map((item) => [item.concept, item.mastery]));

  const levels = LEVELS.map((meta) => {
    const levelScenarios = scenarios.filter((scenario) => scenario.difficulty === meta.level);
    const conceptPool = [...new Set(levelScenarios.flatMap((scenario) => scenario.concepts || []))];
    const mastered = conceptPool.filter((concept) => (masteryByConcept[concept] || 0) >= MASTERY_THRESHOLD);
    const sessionsCompleted = sessions.filter((session) => session.scenario?.difficulty === meta.level).length;
    return {
      ...meta,
      conceptPool,
      masteredConcepts: mastered,
      coverage: conceptPool.length ? Math.round((mastered.length / conceptPool.length) * 100) : 0,
      sessionsCompleted,
      unlocked: false
    };
  });

  levels.forEach((level, index) => {
    if (index === 0) {
      level.unlocked = true;
      return;
    }
    const previous = levels[index - 1];
    level.unlocked = previous.unlocked &&
      previous.sessionsCompleted >= MIN_SESSIONS_TO_ADVANCE &&
      previous.coverage >= COVERAGE_TO_ADVANCE * 100;
  });

  return levels;
}

// ZPD recommender: among unattempted scenarios in unlocked levels, prefer the ones
// whose concepts have the largest gap below the mastery threshold — the scenarios
// that stretch the learner most while remaining reachable.
function recommendScenarios(scenarios, sessions, conceptMastery, levels) {
  const masteryByConcept = Object.fromEntries(conceptMastery.map((item) => [item.concept, item.mastery]));
  const unlockedLevels = new Set(levels.filter((level) => level.unlocked).map((level) => level.level));
  const attempted = new Set(sessions.map((session) => session.scenario?._id).filter(Boolean));

  return scenarios
    .filter((scenario) => unlockedLevels.has(scenario.difficulty) && !attempted.has(scenario._id))
    .map((scenario) => {
      const gaps = (scenario.concepts || []).map((concept) => ({
        concept,
        gap: Math.max(0, MASTERY_THRESHOLD - (masteryByConcept[concept] || 0))
      }));
      const growthPotential = gaps.reduce((total, item) => total + item.gap, 0);
      const weakest = gaps.sort((a, b) => b.gap - a.gap)[0];
      return {
        scenarioId: scenario._id,
        title: scenario.title,
        difficulty: scenario.difficulty,
        concepts: scenario.concepts,
        growthPotential,
        reason: weakest && weakest.gap > 0
          ? `Builds ${weakest.concept} (current mastery ${masteryByConcept[weakest.concept] || 0}/100)`
          : 'Reinforces concepts you already handle well'
      };
    })
    .sort((a, b) => b.growthPotential - a.growthPotential ||
      (scenarios.find((s) => s._id === b.scenarioId)?.effectivenessScore || 0) -
      (scenarios.find((s) => s._id === a.scenarioId)?.effectivenessScore || 0))
    .slice(0, 3);
}

function buildMasteryProfile(scenarios, sessions) {
  const conceptMastery = computeConceptMastery(sessions);
  const levels = computeLevelProgress(scenarios, sessions, conceptMastery);
  const recommendations = recommendScenarios(scenarios, sessions, conceptMastery, levels);
  return {
    threshold: MASTERY_THRESHOLD,
    minSessionsToAdvance: MIN_SESSIONS_TO_ADVANCE,
    totalSessions: sessions.length,
    concepts: conceptMastery,
    levels,
    recommendations
  };
}

module.exports = { buildMasteryProfile, computeConceptMastery, computeLevelProgress, recommendScenarios };
