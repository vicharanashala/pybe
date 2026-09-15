const express = require('express');
const store = require('../data/store');
const { evaluateCode } = require('../services/codeEvaluator');

const router = express.Router();

// Live feedback while the learner drafts code, before committing a session.
// Static analysis only — learner code is never executed.
router.post('/', async (req, res, next) => {
  try {
    const scenario = await store.getScenario(req.body.scenarioId);
    if (!scenario) return res.status(404).json({ message: 'Scenario not found' });
    if (typeof req.body.code !== 'string' || req.body.code.length > 5000) {
      return res.status(400).json({ message: 'code must be a string of at most 5000 characters' });
    }
    res.json(evaluateCode(scenario, req.body.code));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
