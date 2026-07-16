const recommendationService = require('../services/recommendationService');
const adaptiveDifficultyService = require('../services/adaptiveDifficultyService');
const learningPathService = require('../services/learningPathService');
const masteryPredictionService = require('../services/masteryPredictionService');

function sendError(res, error) {
  const status = error.status || 500;
  res.status(status).json({ message: error.message });
}

function requireLearnerId(req, res) {
  if (!req.query.learnerId) {
    res.status(400).json({ message: 'learnerId query parameter is required' });
    return null;
  }
  return req.query.learnerId;
}

/** GET /api/ai/recommendation?learnerId=... (Feature 3) */
async function getRecommendation(req, res) {
  try {
    const learnerId = requireLearnerId(req, res);
    if (!learnerId) return;
    res.json(await recommendationService.recommendNext(learnerId));
  } catch (error) {
    sendError(res, error);
  }
}

/** GET /api/ai/adaptive-difficulty?learnerId=... (Feature 5) */
async function getAdaptiveDifficulty(req, res) {
  try {
    const learnerId = requireLearnerId(req, res);
    if (!learnerId) return;
    res.json(await adaptiveDifficultyService.suggestDifficulty(learnerId));
  } catch (error) {
    sendError(res, error);
  }
}

/** GET /api/ai/learning-path?learnerId=... (Feature 6) */
async function getLearningPath(req, res) {
  try {
    const learnerId = requireLearnerId(req, res);
    if (!learnerId) return;
    res.json(await learningPathService.buildLearningPath(learnerId));
  } catch (error) {
    sendError(res, error);
  }
}

/** GET /api/ai/mastery?learnerId=... (Feature 10) */
async function getMastery(req, res) {
  try {
    const learnerId = requireLearnerId(req, res);
    if (!learnerId) return;
    res.json(await masteryPredictionService.predictMastery(learnerId));
  } catch (error) {
    sendError(res, error);
  }
}

module.exports = { getRecommendation, getAdaptiveDifficulty, getLearningPath, getMastery };
