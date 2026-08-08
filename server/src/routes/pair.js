const express = require('express');
const router = express.Router();
const pairEngine = require('../services/pairProgrammerEngine');

// 1. Live Code Watcher Endpoint
router.post('/watch', (req, res) => {
  try {
    const { code, previousCode, editCount, timeSpentMs } = req.body;
    const result = pairEngine.analyzeLiveCode({ code, previousCode, editCount, timeSpentMs });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Socratic Hint Generator Endpoint
router.post('/hint', (req, res) => {
  try {
    const { code, hintLevel, scenarioTitle } = req.body;
    const result = pairEngine.getSocraticHint({ code, hintLevel, scenarioTitle });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. Explain-First Error Engine Endpoint
router.post('/explain-error', (req, res) => {
  try {
    const { code, errorText } = req.body;
    const result = pairEngine.explainErrorFirst({ code, errorText });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
