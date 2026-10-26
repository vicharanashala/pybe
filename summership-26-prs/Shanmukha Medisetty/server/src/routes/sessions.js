const express = require('express');
const store = require('../data/store');
const engine = require('../services/learningEngine');
const { evaluateCode } = require('../services/codeEvaluator');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const sessions = await store.listSessions();
    res.json(sessions.slice(0, 30));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const scenario = await store.getScenario(req.body.scenarioId);
    if (!scenario) return res.status(404).json({ message: 'Scenario not found' });

    const abstractionMap = engine.mapReasoning(req.body.reasoning);
    const generatedCode = engine.generateCode(scenario, abstractionMap);
    const prompt = engine.evaluatePrompt(req.body.promptText);
    const learnerCode = typeof req.body.learnerCode === 'string' ? req.body.learnerCode.slice(0, 5000) : '';
    const session = await store.addSession({
      learnerName: req.body.learnerName || 'Guest learner',
      scenario: scenario._id,
      reasoning: req.body.reasoning,
      promptText: req.body.promptText || '',
      abstractionMap,
      generatedCode,
      learnerCode,
      codeReview: evaluateCode(scenario, learnerCode),
      codeExplanation: engine.explainCode(abstractionMap),
      promptScore: prompt.score,
      promptFeedback: prompt.feedback,
      tracerMetrics: req.body.tracerMetrics || null,
      reflection: req.body.reflection || '',
      misconceptions: engine.detectMisconceptions(req.body.reasoning),
      masterySignals: engine.masterySignals(abstractionMap, prompt.score)
    });
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
