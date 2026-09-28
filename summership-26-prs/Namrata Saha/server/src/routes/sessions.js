const express = require('express');
const store = require('../data/store');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const sessions = await store.listSessions();
    res.json(sessions.slice(0, 100));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { storyId, event, xp = 0, firstTry = false, passed = false, learnerName = 'Guest learner' } = req.body;
    if (!storyId || !event) {
      return res.status(400).json({ message: 'storyId and event are required' });
    }
    const session = await store.addSession({
      storyId,
      event,
      xp,
      firstTry,
      passed,
      learnerName
    });
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
