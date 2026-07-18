const express = require('express');
const store = require('../data/store');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const [sessions, db] = await Promise.all([store.listSessions(), store.readDb()]);
    const scenarios = db.scenarios;
    const perConceptStats = {};

    sessions.forEach((session) => {
      session.abstractionMap.forEach((map) => {
        if (!perConceptStats[map.pythonConcept]) perConceptStats[map.pythonConcept] = { sessions: 0, totalScore: 0 };
        perConceptStats[map.pythonConcept].sessions += 1;
        perConceptStats[map.pythonConcept].totalScore += session.promptScore || 0;
      });
    });

    const conceptAverages = {};
    Object.entries(perConceptStats).forEach(([concept, stats]) => {
      conceptAverages[concept] = stats.sessions > 0 ? Math.round(stats.totalScore / stats.sessions) : 0;
    });

    const weakConcepts = Object.entries(conceptAverages)
      .filter(([, avg]) => avg < 70)
      .sort((a, b) => a[1] - b[1]);

    const recommendations = [];

    weakConcepts.forEach(([concept]) => {
      const conceptWord = concept.split(' ')[0];
      const match = scenarios.find(
        (sc) => sc.concepts.some((c) => c.toLowerCase().includes(conceptWord)) && !sessions.some((s) => s.scenario?._id === sc._id)
      );
      if (match) {
        recommendations.push({
          type: 'weak_concept',
          reason: `Focus on "${concept}" — your average score is ${conceptAverages[concept]}`,
          scenario: match
        });
      }
    });

    if (recommendations.length === 0) {
      const nextDifficulty = getNextDifficulty(sessions, scenarios);
      const nextScenarios = scenarios
        .filter((sc) => sc.difficulty === nextDifficulty && !sessions.some((s) => s.scenario?._id === sc._id))
        .slice(0, 2);
      nextScenarios.forEach((sc) => {
        recommendations.push({
          type: 'next_level',
          reason: `Try a ${nextDifficulty} scenario to challenge yourself`,
          scenario: sc
        });
      });
    }

    res.json(recommendations.slice(0, 3));
  } catch (error) {
    next(error);
  }
});

function getNextDifficulty(sessions, scenarios) {
  const attempted = scenarios.filter((sc) => sessions.some((s) => s.scenario?._id === sc._id));
  if (attempted.length === 0) return 'Beginner';
  const avgScore = sessions.reduce((sum, s) => sum + (s.promptScore || 0), 0) / sessions.length;
  if (avgScore >= 85) return 'Builder';
  if (avgScore >= 70) return 'Explorer';
  return 'Beginner';
}

module.exports = router;
