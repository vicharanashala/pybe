const store = require('../data/store');
const feedbackEngine = require('../services/feedbackEngine');

/**
 * POST /api/responses
 * Upserts the learner's workspace for one scenario (My Reasoning, My
 * Computational Thinking). When `step` is "submitted", this is also the
 * moment official feedback is generated and stored on the record, so it
 * never needs to be recomputed inconsistently later.
 */
async function submitResponse(req, res, next) {
  try {
    const { learnerId, scenarioId, reasoning, computationalThinking, hintsUsed, step } = req.body;
    if (!learnerId || !scenarioId) {
      return res.status(400).json({ message: 'learnerId and scenarioId are required' });
    }

    const scenario = await store.getScenario(scenarioId);
    if (!scenario) return res.status(404).json({ message: 'Scenario not found' });

    const existing = await store.getResponse(learnerId, scenarioId);
    const payload = {
      learnerId,
      scenarioId,
      reasoning: reasoning ?? existing?.reasoning ?? '',
      computationalThinking: computationalThinking ?? existing?.computationalThinking ?? '',
      hintsUsed: typeof hintsUsed === 'number' ? hintsUsed : (existing?.hintsUsed || 0),
      step: step || existing?.step || 'workspace'
    };

    if (payload.step === 'submitted') {
      payload.attemptNumber = (existing?.attemptNumber || 0) + 1;
      payload.feedback = feedbackEngine.generateFeedback(scenario, payload);
    }

    const response = await store.upsertResponse(payload);
    res.status(existing ? 200 : 201).json(response);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/responses/:scenarioId?learnerId=...
 * Returns the learner's saved workspace for a scenario, if any, so the UI
 * can resume exactly where they left off.
 */
async function getResponseForScenario(req, res, next) {
  try {
    const { learnerId } = req.query;
    if (!learnerId) return res.status(400).json({ message: 'learnerId query parameter is required' });
    const response = await store.getResponse(learnerId, req.params.scenarioId);
    res.json(response);
  } catch (error) {
    next(error);
  }
}

module.exports = { submitResponse, getResponseForScenario };
