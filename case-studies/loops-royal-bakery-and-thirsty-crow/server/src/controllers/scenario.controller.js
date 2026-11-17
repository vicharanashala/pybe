const scenarioRepository = require('../repositories/scenario.repository');
const { AppError } = require('../middleware/errorHandler');

/**
 * GET /api/scenarios
 * Supports query params: q, difficulty, concept, page, limit
 */
async function getAll(req, res, next) {
  try {
    const { q, difficulty, concept, page, limit } = req.query;
    const result = await scenarioRepository.findAll({ q, difficulty, concept, page, limit });
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/scenarios/:id
 */
async function getById(req, res, next) {
  try {
    const scenario = await scenarioRepository.findById(req.params.id);
    if (!scenario) {
      throw new AppError('Scenario not found.', 404);
    }
    return res.status(200).json({ success: true, data: scenario });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/scenarios
 * Body is pre-validated by Zod middleware.
 */
async function create(req, res, next) {
  try {
    const scenario = await scenarioRepository.create(req.body);
    return res.status(201).json({ success: true, data: scenario });
  } catch (err) {
    return next(err);
  }
}

/**
 * PUT /api/scenarios/:id
 * Body is pre-validated by Zod scenarioUpdateSchema (partial).
 */
async function update(req, res, next) {
  try {
    const existing = await scenarioRepository.findById(req.params.id);
    if (!existing) {
      throw new AppError('Scenario not found.', 404);
    }
    const updated = await scenarioRepository.update(req.params.id, req.body);
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    return next(err);
  }
}

/**
 * DELETE /api/scenarios/:id
 */
async function remove(req, res, next) {
  try {
    const existing = await scenarioRepository.findById(req.params.id);
    if (!existing) {
      throw new AppError('Scenario not found.', 404);
    }
    await scenarioRepository.delete(req.params.id);
    return res.status(200).json({ success: true, message: 'Scenario deleted successfully.' });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/scenarios/generate
 * Generates a scenario using MiniMax AI API and saves it to DB.
 */
async function generateWithAI(req, res, next) {
  try {
    const { topic, difficulty } = req.body;
    if (!topic || typeof topic !== 'string') {
      throw new AppError('Topic string is required to generate a scenario.', 400);
    }
    const { generateScenario } = require('../services/ai.service');
    const generatedData = await generateScenario(topic, difficulty || 'intermediate');
    const scenario = await scenarioRepository.create(generatedData);
    return res.status(201).json({ success: true, data: scenario });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/scenarios/generate-tree
 * Generates a 2D concept tree mind map using MiniMax AI API.
 */
async function generateConceptTree(req, res, next) {
  try {
    const { topic } = req.body;
    const { generateConceptTree } = require('../services/ai.service');
    const treeData = await generateConceptTree(topic || 'Loops');
    return res.status(200).json({ success: true, data: treeData });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/scenarios/generate-concept-map
 * Generates a concept map (nodes + labeled edges + phases) from a case study scenario.
 */
async function generateConceptMap(req, res, next) {
  try {
    const { scenario } = req.body;
    if (!scenario || !scenario.title) {
      throw new AppError('A valid scenario object is required.', 400);
    }
    const { generateConceptMap } = require('../services/ai.service');
    const mapData = await generateConceptMap(scenario);
    return res.status(200).json({ success: true, data: mapData });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/scenarios/explain
 * Generates a beginner-friendly visual explanation (analogy, visual points, pseudo-code).
 */
async function explainConcept(req, res, next) {
  try {
    const { topic, context } = req.body;
    if (!topic) {
      throw new AppError('Topic string is required for explanation.', 400);
    }
    const { explainConcept: serviceExplain } = require('../services/ai.service');
    const data = await serviceExplain(topic, context || '');
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/scenarios/generate-skeleton
 * Generates a structural skeleton chart and actor-action scan from a scenario.
 */
async function generateSkeleton(req, res, next) {
  try {
    const { scenario } = req.body;
    if (!scenario || (!scenario.title && !scenario.scenario && !scenario.description && !scenario.content)) {
      throw new AppError('A valid scenario object with title or content is required.', 400);
    }
    const { generateSkeleton: serviceSkeleton } = require('../services/ai.service');
    const skeletonData = await serviceSkeleton(scenario);
    return res.status(200).json({ success: true, data: skeletonData });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getAll, getById, create, update, remove, generateWithAI, generateConceptTree, generateConceptMap, explainConcept, generateSkeleton };


