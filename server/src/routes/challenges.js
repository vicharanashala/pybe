const express = require('express');
const router = express.Router();
const { challenges } = require('../data/challenges');
const store = require('../data/store');

router.get('/', (_req, res) => {
  const publicChallenges = challenges.map(({ day, title, difficulty, problem, exampleInput, exampleOutput, hint, concepts }) => ({
    day, title, difficulty, problem, exampleInput, exampleOutput, hint, concepts
  }));
  res.json(publicChallenges);
});

router.get('/progress', async (_req, res, next) => {
  try {
    const progress = await store.getChallengeProgress();
    res.json(progress);
  } catch (error) {
    next(error);
  }
});

router.post('/:day/complete', async (req, res, next) => {
  try {
    const day = parseInt(req.params.day, 10);
    if (isNaN(day) || day < 1 || day > 30) {
      return res.status(400).json({ message: 'Invalid day number. Must be between 1 and 30.' });
    }
    const progress = await store.completeChallenge(day);
    res.json(progress);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
