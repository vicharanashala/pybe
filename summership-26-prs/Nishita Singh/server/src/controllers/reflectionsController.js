const store = require('../data/store');

/**
 * POST /api/reflections
 * Stores a learner's reflection for a scenario and marks that scenario's
 * response record as "completed" (a scenario counts as done once its
 * reflection is submitted - this is what gamificationService and
 * progressService key off of).
 */
async function submitReflection(req, res, next) {
  try {
    const { learnerId, scenarioId, whatLearned, doDifferently, clearerConcept, helpfulSkill } = req.body;
    if (!learnerId || !scenarioId) {
      return res.status(400).json({ message: 'learnerId and scenarioId are required' });
    }
    if (!whatLearned?.trim()) {
      return res.status(400).json({ message: 'whatLearned is required' });
    }

    const scenario = await store.getScenario(scenarioId);
    if (!scenario) return res.status(404).json({ message: 'Scenario not found' });

    const reflection = await store.addReflection({
      learnerId,
      scenarioId,
      whatLearned,
      doDifferently: doDifferently || '',
      clearerConcept: clearerConcept || '',
      helpfulSkill: helpfulSkill || ''
    });

    await store.upsertResponse({ learnerId, scenarioId, step: 'completed' });

    res.status(201).json(reflection);
  } catch (error) {
    next(error);
  }
}

module.exports = { submitReflection };
