const express = require('express');
const store = require('../data/store');
const { traceScenarioCode, getCuratedScenarioCode } = require('../services/tracerEngine');

const router = express.Router();

// POST /api/tracer/trace
// Accepts: { scenarioId?: string, code?: string }
// Returns: Notional machine execution steps, memory states, checkpoints, stdout, and misconceptions
router.post('/trace', async (req, res) => {
  try {
    const { scenarioId, code } = req.body;
    let scenario = null;
    if (scenarioId) {
      scenario = await store.getScenario(scenarioId);
    }
    const traceResult = traceScenarioCode(scenario, code);
    return res.json(traceResult);
  } catch (error) {
    console.error('Error generating execution trace:', error);
    return res.status(500).json({ error: 'Failed to generate execution trace' });
  }
});

// GET /api/tracer/default-code/:scenarioId
router.get('/default-code/:scenarioId', async (req, res) => {
  try {
    const scenario = await store.getScenario(req.params.scenarioId);
    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }
    const defaultCode = getCuratedScenarioCode(scenario);
    return res.json({ scenarioId: req.params.scenarioId, defaultCode });
  } catch (error) {
    console.error('Error retrieving default code:', error);
    return res.status(500).json({ error: 'Failed to retrieve code' });
  }
});

// POST /api/tracer/predict
// Validates learner's Socratic prediction answer
router.post('/predict', (req, res) => {
  const { checkpoint, selectedIndex } = req.body;
  if (!checkpoint || selectedIndex === undefined) {
    return res.status(400).json({ error: 'Missing checkpoint or selectedIndex' });
  }

  const isCorrect = selectedIndex === checkpoint.correctIndex;
  return res.json({
    isCorrect,
    selectedOption: checkpoint.options[selectedIndex],
    correctOption: checkpoint.options[checkpoint.correctIndex],
    explanation: checkpoint.explanation,
    pedagogicalFeedback: isCorrect
      ? '🎉 Excellent mental model! You accurately predicted the Notional Machine state before execution.'
      : '💡 Notice how the Notional Machine calculates the state. Take a look at the memory variables above.'
  });
});

module.exports = router;
