const prisma = require('../prisma');

/**
 * GET /api/analytics
 * Fetches pre-aggregated data from AnalyticsTotal instead of pulling all records.
 */
async function getAnalytics(req, res, next) {
  try {
    let analytics = await prisma.analyticsTotal.findUnique({
      where: { id: 'global' }
    });

    if (!analytics) {
      analytics = {
        scenarioCount: 0,
        sessionCount: 0,
        averagePromptScore: 0,
        conceptCounts: {}
      };
    } else {
      try {
        analytics.conceptCounts = JSON.parse(analytics.conceptCounts);
      } catch (e) {
        analytics.conceptCounts = {};
      }
    }

    return res.status(200).json({ success: true, data: analytics });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getAnalytics };
