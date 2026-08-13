const express = require('express');
const store = require('../data/store');
const engine = require('../services/learningEngine');

const router = express.Router();

/**
 * GET /api/sessions - List all sessions with filters and pagination
 * Query params:
 *   - learnerName: filter by learner name
 *   - scenarioId: filter by scenario
 *   - concept: filter by Python concept
 *   - page: pagination page (default: 1)
 *   - limit: results per page (default: 20)
 */
router.get('/', async (req, res, next) => {
  try {
    const { learnerName, scenarioId, concept, page = 1, limit = 20 } = req.query;
    const result = await store.listSessions(
      { learnerName, scenarioId, concept },
      parseInt(page),
      parseInt(limit)
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/sessions - Create a new learning session
 * Body required:
 *   - learnerName: string (optional, defaults to 'Guest learner')
 *   - scenarioId: string (required)
 *   - reasoning: string (required)
 *   - promptText: string (optional)
 *   - reflection: string (optional)
 */
router.post('/', async (req, res, next) => {
  try {
    const { scenarioId, reasoning, learnerName, promptText, reflection } = req.body;
    
    // Validate required fields
    if (!scenarioId || typeof scenarioId !== 'string') {
      return res.status(400).json({ error: 'scenarioId is required and must be a string' });
    }
    if (!reasoning || typeof reasoning !== 'string' || reasoning.trim().length === 0) {
      return res.status(400).json({ error: 'reasoning is required and cannot be empty' });
    }

    // Get scenario
    const scenario = await store.getScenario(scenarioId);

    // Process reasoning through learning engine
    const abstractionMap = engine.mapReasoning(reasoning);
    const generatedCode = engine.generateCode(scenario, abstractionMap);
    const promptEval = engine.evaluatePrompt(promptText);
    const misconceptions = engine.detectMisconceptions(reasoning);
    const masterySignals = engine.masterySignals(abstractionMap, promptEval.score);

    // Create session record
    const session = await store.addSession({
      learnerName: learnerName || 'Guest learner',
      scenario: scenario._id,
      reasoning,
      promptText: promptText || '',
      abstractionMap,
      generatedCode,
      codeExplanation: engine.explainCode(abstractionMap),
      promptScore: promptEval.score,
      promptFeedback: promptEval.feedback,
      reflection: reflection || '',
      misconceptions,
      masterySignals
    });
    
    res.status(201).json(session);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/sessions/:id - Get a specific session
 */
router.get('/:id', async (req, res, next) => {
  try {
    const session = await store.getSession(req.params.id);
    res.json(session);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
});

/**
 * PUT /api/sessions/:id - Update a session (e.g., add reflection)
 * Body: Partial session object with fields to update
 */
router.put('/:id', async (req, res, next) => {
  try {
    const session = await store.updateSession(req.params.id, req.body);
    res.json(session);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /api/sessions/:id - Delete a session
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await store.deleteSession(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
});

module.exports = router;
