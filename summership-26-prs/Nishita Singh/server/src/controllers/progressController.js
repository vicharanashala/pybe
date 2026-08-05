const store = require('../data/store');
const { buildProgress } = require('../services/progressService');

/**
 * GET /api/progress?learnerId=...
 * Returns the learner's full derived progress snapshot.
 */
async function getProgress(req, res, next) {
  try {
    const { learnerId } = req.query;
    if (!learnerId) return res.status(400).json({ message: 'learnerId query parameter is required' });
    const progress = await buildProgress(learnerId);
    res.json(progress);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/progress
 * Lightweight step marker update, used before a learner has typed enough
 * into the workspace to save a full response (e.g. moving from "reading
 * the scenario" to "answering guided questions" to "workspace"). Returns
 * the refreshed progress snapshot so the client can update in one round
 * trip.
 */
async function updateProgress(req, res, next) {
  try {
    const { learnerId, scenarioId, step } = req.body;
    if (!learnerId || !scenarioId || !step) {
      return res.status(400).json({ message: 'learnerId, scenarioId, and step are required' });
    }
    const scenario = await store.getScenario(scenarioId);
    if (!scenario) return res.status(404).json({ message: 'Scenario not found' });

    await store.upsertProgressMarker({ learnerId, scenarioId, step });
    const progress = await buildProgress(learnerId);
    res.json(progress);
  } catch (error) {
    next(error);
  }
}

module.exports = { getProgress, updateProgress };
