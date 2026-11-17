const express = require('express');
const store = require('../data/store');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { q, concept, difficulty, storyId } = req.query;
    const scenarios = await store.listScenarios({ q, concept, difficulty, storyId });
    res.json(scenarios);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const body = req.body || {};
    const errors = [];
    if (typeof body.title !== 'string' || !body.title.trim()) errors.push('title is required');
    if (typeof body.context !== 'string' || !body.context.trim()) errors.push('context is required');
    if (typeof body.prompt !== 'string' || !body.prompt.trim()) errors.push('prompt is required');
    if (!Array.isArray(body.concepts)) errors.push('concepts must be an array');
    if (!Array.isArray(body.objectives)) errors.push('objectives must be an array');
    if (errors.length) return res.status(400).json({ message: 'Invalid scenario', errors });

    const scenario = await store.addScenario(body);
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
