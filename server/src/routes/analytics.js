const express = require('express');
const store = require('../data/store');

const router = express.Router();

/**
 * GET /api/analytics/export - Export all sessions data
 * Query params:
 *   - format: 'json' (default) or 'csv'
 * Place this BEFORE generic /analytics/:id route to avoid conflicts
 */
router.get('/export', async (req, res, next) => {
  try {
    const { format = 'json' } = req.query;
    const data = await store.exportSessions(format);
    
    if (format === 'csv') {
      const { headers, rows } = data;
      const csv = [
        headers.join(','),
        ...rows.map(row => 
          row.map(cell => 
            typeof cell === 'string' && cell.includes(',') 
              ? `"${cell}"` 
              : cell
          ).join(',')
        )
      ].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="sessions-export.csv"');
      res.send(csv);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="sessions-export.json"');
      res.json(data);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/analytics/learners - List all learners with stats
 */
router.get('/learners', async (_req, res, next) => {
  try {
    const learners = await store.listLearners();
    res.json({ learners, count: learners.length });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/analytics/learners/:name - Get specific learner profile
 */
router.get('/learners/:name', async (req, res, next) => {
  try {
    const learner = await store.getLearnerProfile(req.params.name);
    res.json(learner);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
});

/**
 * GET /api/analytics - Get overall analytics dashboard
 * Place this AFTER specific routes to avoid catching /learners and /export
 */
router.get('/', async (_req, res, next) => {
  try {
    const result = await store.listSessions({}, 1, 1000);
    const sessions = result.data;
    const db = await store.readDb();
    
    const scenarioCount = db.scenarios.length;
    const conceptCounts = {};
    const misconceptionCounts = {};
    let promptTotal = 0;
    let conceptMastery = {};

    sessions.forEach((session) => {
      promptTotal += session.promptScore || 0;
      
      if (session.abstractionMap && Array.isArray(session.abstractionMap)) {
        session.abstractionMap.forEach((map) => {
          conceptCounts[map.pythonConcept] = (conceptCounts[map.pythonConcept] || 0) + 1;
          conceptMastery[map.pythonConcept] = (conceptMastery[map.pythonConcept] || 0) + 1;
        });
      }
      
      if (session.misconceptions && Array.isArray(session.misconceptions)) {
        session.misconceptions.forEach((item) => {
          misconceptionCounts[item] = (misconceptionCounts[item] || 0) + 1;
        });
      }
    });

    // Calculate learner stats
    const learners = await store.listLearners();
    const topLearners = learners.slice(0, 5);
    
    res.json({
      overview: {
        scenarioCount,
        sessionCount: sessions.length,
        learnerCount: learners.length,
        averagePromptScore: sessions.length ? Math.round(promptTotal / sessions.length) : 0
      },
      conceptCounts,
      conceptMastery,
      misconceptionCounts,
      topLearners,
      recentSessions: sessions.slice(0, 5)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
