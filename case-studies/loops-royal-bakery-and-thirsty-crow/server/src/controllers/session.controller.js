const sessionRepository = require('../repositories/session.repository');
const scenarioRepository = require('../repositories/scenario.repository');
const learningService = require('../services/learning.service');
const { AppError } = require('../middleware/errorHandler');
const xss = require('xss');
const prisma = require('../prisma');

/**
 * GET /api/sessions
 * Supports cursor pagination: ?cursor=cuid123&limit=20
 * Returns all active sessions with their parent scenario joined.
 */
async function getAll(req, res, next) {
  try {
    const { cursor, limit } = req.query;
    const result = await sessionRepository.findAll(/* includeScenario */ true, { cursor, limit });
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/sessions
 * Body is pre-validated by Zod middleware.
 * Orchestrates the learning pipeline before persisting.
 */
async function create(req, res, next) {
  try {
    // Sanitize user inputs to prevent XSS injection
    const scenarioId = xss(req.body.scenarioId);
    const reasoning = xss(req.body.reasoning);
    const promptText = xss(req.body.promptText);
    const reflection = xss(req.body.reflection);
    const learnerName = xss(req.body.learnerName);
    const userId = req.user ? req.user.id : null; // If auth middleware is attached

    // 1. Verify scenario exists
    const scenario = await scenarioRepository.findById(scenarioId);
    if (!scenario) {
      throw new AppError('Scenario not found.', 404);
    }

    // 2. Run the learning pipeline (pure business logic)
    const abstractionMap = learningService.generateAbstractionMap(reasoning, scenario);
    const { code: generatedCode, explanation: codeExplanation } =
      learningService.generateCode(abstractionMap, scenario);
    const promptScore = learningService.scorePrompt(promptText, reasoning);
    const promptFeedback = learningService.generatePromptFeedback(promptText, promptScore);
    const misconceptions = learningService.detectMisconceptions(reasoning, scenario);
    const masterySignals = learningService.deriveMasterySignals(reasoning, promptScore, reflection);

    // 3. Persist the enriched session
    const session = await sessionRepository.create({
      scenarioId,
      learnerName,
      reasoning,
      promptText,
      reflection,
      abstractionMap,
      generatedCode,
      codeExplanation,
      promptScore,
      promptFeedback,
      misconceptions,
      masterySignals,
      userId,
    });

    // 4. Update AnalyticsTotal asynchronously
    // In production, this might be done via message queue
    prisma.$transaction(async (tx) => {
      // Upsert global stats
      const stats = await tx.analyticsTotal.upsert({
        where: { id: 'global' },
        update: {
          sessionCount: { increment: 1 },
        },
        create: {
          id: 'global',
          sessionCount: 1,
          scenarioCount: await tx.scenario.count({ where: { deletedAt: null } }),
        },
      });

      // Update average score and concept counts
      const allSessions = await tx.session.findMany({ where: { deletedAt: null }, select: { promptScore: true } });
      const avgScore = allSessions.reduce((acc, s) => acc + s.promptScore, 0) / Math.max(1, allSessions.length);
      
      let conceptCounts = {};
      try {
        conceptCounts = typeof stats.conceptCounts === 'string' ? JSON.parse(stats.conceptCounts) : (stats.conceptCounts || {});
      } catch (e) {}

      const scenarioConcepts = scenario.concepts || [];
      scenarioConcepts.forEach(c => {
        const key = c.toLowerCase().trim();
        conceptCounts[key] = (conceptCounts[key] || 0) + 1;
      });

      await tx.analyticsTotal.update({
        where: { id: 'global' },
        data: {
          averagePromptScore: Math.round(avgScore * 100) / 100,
          conceptCounts: JSON.stringify(conceptCounts),
        }
      });
    }).catch(e => console.error("Failed to update analytics:", e));

    return res.status(201).json({ success: true, data: session });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getAll, create };
