const express = require('express');
const store = require('../data/store');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { q, concept, difficulty } = req.query;
    const scenarios = await store.listScenarios({ q, concept, difficulty });
    res.json(scenarios);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const scenario = await store.addScenario(req.body);
    res.status(201).json(scenario);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const scenario = await store.getScenario(req.params.id);
    if (!scenario) return res.status(404).json({ message: 'Scenario not found' });
    res.json(scenario);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
