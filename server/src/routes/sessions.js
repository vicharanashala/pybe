const express = require('express');
const store = require('../data/store');
const engine = require('../services/learningEngine');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const sessions = await store.listSessions();
    let result = sessions.slice(0, 100);
    if (req.query.difficulty) result = result.filter(s => s.scenario?.difficulty === req.query.difficulty);
    if (req.query.concept) result = result.filter(s => s.abstractionMap?.some(m => m.pythonConcept.includes(req.query.concept)));
    if (req.query.sort === 'score') result.sort((a, b) => (b.promptScore || 0) - (a.promptScore || 0));
    else if (req.query.sort === 'oldest') result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(result.slice(0, 30));
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
    const classification = engine.classifyInteraction(req.body.reasoning);
    const session = await store.addSession({
      learnerName: req.body.learnerName || 'Guest learner',
      scenario: scenario._id,
      reasoning: req.body.reasoning,
      promptText: req.body.promptText || '',
      abstractionMap,
      generatedCode,
      codeExplanation: engine.explainCode(abstractionMap),
      promptScore: prompt.score,
      promptDimensions: prompt.dimensions,
      promptFeedback: prompt.feedback,
      promptClassification: prompt.classification,
      interactionClassification: classification,
      reflection: req.body.reflection || '',
      misconceptions: engine.detectMisconceptions(req.body.reasoning),
      masterySignals: engine.masterySignals(abstractionMap, prompt.score, classification)
    });
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
