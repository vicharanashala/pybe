const tutorService = require('../services/tutorService');

function sendError(res, error) {
  const status = error.status || 500;
  res.status(status).json({ message: error.message });
}

/**
 * POST /api/ai/tutor/chat
 * Body: { learnerId, scenarioId?, message }.
 */
async function chat(req, res) {
  try {
    const result = await tutorService.chat(req.body);
    res.json(result);
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * GET /api/ai/tutor/history?learnerId=...&scenarioId=...
 */
async function getHistory(req, res) {
  try {
    const messages = await tutorService.getHistory({
      learnerId: req.query.learnerId,
      scenarioId: req.query.scenarioId
    });
    res.json({ messages });
  } catch (error) {
    sendError(res, error);
  }
}

module.exports = { chat, getHistory };
