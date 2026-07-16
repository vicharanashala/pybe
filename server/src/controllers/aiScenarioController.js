const scenarioGenerationService = require('../services/scenarioGenerationService');

function sendError(res, error) {
  const status = error.status || 500;
  res.status(status).json({ message: error.message });
}

/**
 * POST /api/ai/scenarios/generate
 * Feature 1: AI Scenario Generator. Body: { concept, difficulty, theme, learnerId }.
 */
async function generateScenario(req, res) {
  try {
    const result = await scenarioGenerationService.generateScenario(req.body);
    res.status(201).json(result);
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * POST /api/ai/scenarios/custom
 * Feature 2: Custom Scenario Prompt. Body: { description, learnerId }.
 */
async function generateCustomScenario(req, res) {
  try {
    const result = await scenarioGenerationService.generateCustomScenario(req.body);
    res.status(201).json(result);
  } catch (error) {
    sendError(res, error);
  }
}

module.exports = { generateScenario, generateCustomScenario };
