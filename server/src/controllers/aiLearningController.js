const hintGenerationService = require('../services/hintGenerationService');
const explanationService = require('../services/explanationService');
const codeReviewService = require('../services/codeReviewService');

function sendError(res, error) {
  const status = error.status || 500;
  res.status(status).json({ message: error.message });
}

/**
 * POST /api/ai/hints
 * Feature 8. Body: { learnerId, scenarioId, level }.
 */
async function generateHint(req, res) {
  try {
    const result = await hintGenerationService.generateHint(req.body);
    res.json(result);
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * POST /api/ai/explain
 * Feature 7. Body: { concept, mode, scenarioId? }.
 */
async function explain(req, res) {
  try {
    const result = await explanationService.explain(req.body);
    res.json(result);
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * POST /api/ai/code-review
 * Feature 9. Body: { learnerId, scenarioId?, code }.
 */
async function reviewCode(req, res) {
  try {
    const result = await codeReviewService.reviewCode(req.body);
    res.json(result);
  } catch (error) {
    sendError(res, error);
  }
}

module.exports = { generateHint, explain, reviewCode };
