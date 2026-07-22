const express = require('express');
const router = express.Router();
const { analyzeCode } = require('../services/doubtSolver');
const store = require('../data/store');

router.post('/', async (req, res, next) => {
  try {
    const { code, question } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ message: 'Code is required. Please paste some Python code to analyze.' });
    }
    const analysis = analyzeCode(code, question || '');
    const saved = await store.addDoubt({
      code: code.trim(),
      question: (question || '').trim(),
      analysis
    });
    res.json(saved);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (_req, res, next) => {
  try {
    const doubts = await store.listDoubts();
    res.json(doubts);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await store.deleteDoubt(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
