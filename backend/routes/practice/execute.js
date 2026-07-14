const express = require('express');
const PracticeProblem = require('../../models/PracticeProblem');
const PracticeProgress = require('../../models/PracticeProgress');
const { evaluateSubmission } = require('../../services/pythonRunner');

const router = express.Router();

const MAX_CODE_LENGTH = 20000;

// POST /api/practice/execute
// body: { slug, code, mode: 'run' | 'submit', userId }
// - 'run' just evaluates against the visible test cases, no persistence.
// - 'submit' evaluates the same tests and, if a userId is supplied, records
//   solved/attempted status plus the last code so the person can come back
//   and redo a topic later without losing their place.
router.post('/', async (req, res, next) => {
  try {
    const { slug, code, mode, userId } = req.body || {};

    if (!slug || typeof code !== 'string') {
      return res.status(400).json({ error: 'slug and code are required' });
    }
    if (code.length > MAX_CODE_LENGTH) {
      return res.status(400).json({ error: 'Code is too long.' });
    }
    if (!['run', 'submit'].includes(mode)) {
      return res.status(400).json({ error: "mode must be 'run' or 'submit'" });
    }

    const problem = await PracticeProblem.findOne({ slug });
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    const evaluation = await evaluateSubmission(problem, code);

    if (mode === 'submit' && userId) {
      await PracticeProgress.findOneAndUpdate(
        { userId, problemSlug: slug },
        {
          userId,
          problemSlug: slug,
          status: evaluation.allPassed ? 'solved' : 'attempted',
          lastCode: code,
        },
        { upsert: true, setDefaultsOnInsert: true }
      );
    }

    res.json({
      mode,
      slug,
      compileError: evaluation.compileError,
      allPassed: evaluation.allPassed,
      results: evaluation.testResults,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
