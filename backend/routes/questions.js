const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { protect } = require('../middleware/auth');
const { scoreReasoning } = require('../services/reasoningService');

// GET /api/questions/concept/:conceptId
// Read-only, for any logged-in learner — returns the admin-authored
// questions for one concept, in display order. Consumed by
// PythonPracticeWidget on the frontend, which appends these after the
// built-in static question set for that topic.
//
// `keyPoints` (the answer key for scenario questions) is never sent here —
// scenario answers are checked server-side, same as the Section 1
// discovery step.
router.get('/concept/:conceptId', protect, async (req, res) => {
  try {
    const questions = await Question.find({
      conceptId: req.params.conceptId,
      isActive: true
    }).sort({ order: 1, createdAt: 1 });

    res.json(questions.map(q => ({
      id: q._id,
      type: q.type,
      level: q.level,
      title: q.title,
      scenario: q.scenario,
      description: q.description,
      ...(q.type === 'practice'
        ? { starter: q.starter, hint: q.hint, expectedOutput: q.expectedOutput, acceptableOutputs: q.acceptableOutputs }
        : { hint: q.hint })
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/questions/scenario/:id/check
// Checks a learner's free-text answer to a 'scenario' question using the
// same local semantic-similarity scoring as the Section 1 discovery step
// (unlimited attempts — this is practice, not the gated reasoning step).
// body: { answer }
router.post('/scenario/:id/check', protect, async (req, res) => {
  try {
    const { answer } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question || question.type !== 'scenario') {
      return res.status(404).json({ message: 'Scenario question not found' });
    }

    const { score, passed } = await scoreReasoning(answer, question.keyPoints);
    const feedback = passed
      ? 'Great work — you\'ve got it!'
      : "Not quite — think about the scenario again and try once more.";

    res.json({ passed, score, feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Reasoning check failed', error: err.message });
  }
});

module.exports = router;
