const express = require('express');
const store = require('../data/store');
const { buildMasteryProfile } = require('../services/masteryEngine');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [db, sessions] = await Promise.all([store.readDb(), store.listSessions()]);
    const learner = (req.query.learner || '').trim();
    const scoped = learner
      ? sessions.filter((session) => session.learnerName === learner)
      : sessions;
    res.json(buildMasteryProfile(db.scenarios, scoped));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
