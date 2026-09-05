const { buildDashboard } = require('../services/progressService');

/**
 * GET /api/dashboard?learnerId=...
 * Returns everything the Dashboard page needs in one call: progress,
 * gamification, recent activity, and continue-learning suggestions.
 */
async function getDashboard(req, res, next) {
  try {
    const { learnerId } = req.query;
    if (!learnerId) return res.status(400).json({ message: 'learnerId query parameter is required' });
    const dashboard = await buildDashboard(learnerId);
    res.json(dashboard);
  } catch (error) {
    next(error);
  }
}

module.exports = { getDashboard };
