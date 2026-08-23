const express = require('express');
const store = require('../data/store');
const { computeStreak } = require('../services/streak');
const { computeTotalTimeSpent } = require('../services/engagement');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const [sessions, db] = await Promise.all([store.listSessions(), store.readDb()]);
    const scenarioCount = db.scenarios.length;
    const conceptCounts = {};
    const misconceptionCounts = {};
    let promptTotal = 0;

    sessions.forEach((session) => {
      promptTotal += session.promptScore || 0;
      session.abstractionMap.forEach((map) => {
        conceptCounts[map.pythonConcept] = (conceptCounts[map.pythonConcept] || 0) + 1;
      });
      session.misconceptions.forEach((item) => {
        misconceptionCounts[item] = (misconceptionCounts[item] || 0) + 1;
      });
    });
    const streak = computeStreak(sessions.map((session) => session.createdAt));
   const totalTimeSpentSeconds = computeTotalTimeSpent(sessions);

    res.json({
      scenarioCount,
      sessionCount: sessions.length,
      averagePromptScore: sessions.length ? Math.round(promptTotal / sessions.length) : 0,
      conceptCounts,
      misconceptionCounts,
      recentSessions: sessions.slice(0, 5),
      streak,
            totalTimeSpentSeconds
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
