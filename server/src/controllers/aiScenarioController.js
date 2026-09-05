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

/**
 * POST /api/ai/scenarios/generate-options
 * Enhancement Proposal #11: generates three distinct scenario drafts
 * instead of persisting one immediately. Body: { concept, difficulty, theme, learnerId }.
 * Nothing is saved to the scenario library until /scenarios/select is called.
 */
async function generateScenarioOptions(req, res) {
  try {
    const result = await scenarioGenerationService.generateScenarioOptions(req.body);
    res.json(result);
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * POST /api/ai/scenarios/custom-options
 * Same as above but for the free-text custom prompt flow. Body: { description, learnerId }.
 */
async function generateCustomScenarioOptions(req, res) {
  try {
    const result = await scenarioGenerationService.generateCustomScenarioOptions(req.body);
    res.json(result);
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * POST /api/ai/scenarios/select
 * Persists whichever draft the learner picked from /generate-options or
 * /custom-options. Body: { draft, learnerId }.
 */
async function selectScenario(req, res) {
  try {
    const result = await scenarioGenerationService.selectGeneratedScenario(req.body);
    res.status(201).json(result);
  } catch (error) {
    sendError(res, error);
  }
}

module.exports = {
  generateScenario,
  generateCustomScenario,
  generateScenarioOptions,
  generateCustomScenarioOptions,
  selectScenario
};
