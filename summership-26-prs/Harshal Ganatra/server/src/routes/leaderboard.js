const express = require('express');
const store = require('../data/store');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const users = await store.listUsers();
    res.json(users.slice(0, 10));
  } catch (error) {
    next(error);
  }
});

router.post('/reward', async (req, res, next) => {
  try {
    const { learnerName, moduleConcept, tier } = req.body;
    if (!learnerName || !moduleConcept || !tier) {
      return res.status(400).json({ error: 'Missing parameters' });
    }
    
    let xpReward = 0;
    if (tier === 'rookie') xpReward = 10;
    else if (tier === 'intermediate') xpReward = 20;
    else if (tier === 'programmer') xpReward = 50;
    
    const user = await store.addXP(learnerName, xpReward, moduleConcept, tier);
    
    res.json({ success: true, user, xpRewarded: xpReward });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
