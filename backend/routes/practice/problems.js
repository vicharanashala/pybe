const express = require('express');
const PracticeProblem = require('../../models/PracticeProblem');
const PracticeProgress = require('../../models/PracticeProgress');

const router = express.Router();

// GET /api/practice/problems/topic/:topic?userId=xxx
router.get('/topic/:topic', async (req, res, next) => {
  try {
    const { topic } = req.params;
    const { userId } = req.query;

    const problems = await PracticeProblem.find({ topic })
      .sort({ order: 1 })
      .select('slug title order difficulty topic');

    let solvedSet = new Set();
    let attemptedSet = new Set();
    if (userId) {
      const progress = await PracticeProgress.find({
        userId,
        problemSlug: { $in: problems.map((p) => p.slug) },
      });
      solvedSet = new Set(progress.filter((p) => p.status === 'solved').map((p) => p.problemSlug));
      attemptedSet = new Set(progress.map((p) => p.problemSlug));
    }

    res.json({
      topic,
      problems: problems.map((p) => ({
        slug: p.slug,
        title: p.title,
        order: p.order,
        difficulty: p.difficulty,
        status: solvedSet.has(p.slug) ? 'solved' : attemptedSet.has(p.slug) ? 'attempted' : 'unsolved',
      })),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/practice/problems/:slug?userId=xxx
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { userId } = req.query;

    const problem = await PracticeProblem.findOne({ slug });
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    // neighbors within the same topic, so the frontend can offer prev/next nav
    const siblings = await PracticeProblem.find({ topic: problem.topic })
      .sort({ order: 1 })
      .select('slug order');
    const idx = siblings.findIndex((s) => s.slug === slug);
    const prev = idx > 0 ? siblings[idx - 1].slug : null;
    const next_ = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1].slug : null;

    let savedCode = null;
    let status = 'unsolved';
    if (userId) {
      const prog = await PracticeProgress.findOne({ userId, problemSlug: slug });
      if (prog) {
        savedCode = prog.lastCode || null;
        status = prog.status;
      }
    }

    res.json({
      slug: problem.slug,
      topic: problem.topic,
      title: problem.title,
      order: problem.order,
      totalInTopic: siblings.length,
      difficulty: problem.difficulty,
      description: problem.description,
      hint: problem.hint,
      functionName: problem.functionName,
      paramNames: problem.paramNames,
      starterCode: problem.starterCode,
      samples: problem.tests.map((t, i) => ({
        idx: i,
        input: t.displayInput,
        expected: t.expected,
      })),
      prev,
      next: next_,
      savedCode,
      status,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
