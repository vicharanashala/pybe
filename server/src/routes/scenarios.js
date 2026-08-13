const express = require('express');
const store = require('../data/store');

const router = express.Router();

/**
 * GET /api/scenarios - List all scenarios with filters and pagination
 * Query params:
 *   - q: search query
 *   - concept: filter by concept
 *   - difficulty: filter by difficulty (Beginner|Explorer|Builder)
 *   - page: pagination page (default: 1)
 *   - limit: results per page (default: 20)
 */
router.get('/', async (req, res, next) => {
  try {
    const { q, concept, difficulty, page = 1, limit = 20 } = req.query;
    const result = await store.listScenarios(
      { q, concept, difficulty },
      parseInt(page),
      parseInt(limit)
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/scenarios - Create a new scenario
 * Body required:
 *   - title: string (required)
 *   - context: string (required)
 *   - concepts: array of strings (required)
 *   - difficulty: string - Beginner|Explorer|Builder (required)
 *   - objectives: array of strings (required)
 *   - prompt: string (optional)
 */
router.post('/', async (req, res, next) => {
  try {
    const scenario = await store.addScenario(req.body);
    res.status(201).json(scenario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/scenarios/:id - Get a specific scenario
 */
router.get('/:id', async (req, res, next) => {
  try {
    const scenario = await store.getScenario(req.params.id);
    res.json(scenario);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
});

/**
 * PUT /api/scenarios/:id - Update a scenario
 * Body: Partial scenario object with fields to update
 */
router.put('/:id', async (req, res, next) => {
  try {
    const scenario = await store.updateScenario(req.params.id, req.body);
    res.json(scenario);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /api/scenarios/:id - Delete a scenario
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await store.deleteScenario(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
});

module.exports = router;
