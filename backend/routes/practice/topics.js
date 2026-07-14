const express = require('express');
const PracticeProblem = require('../../models/PracticeProblem');
const PracticeProgress = require('../../models/PracticeProgress');
const { TOPIC_ORDER, TOPIC_DESCRIPTIONS } = require('../../constants/practiceTopics');

const router = express.Router();

// GET /api/practice/topics?userId=xxx
// Returns every topic with its problem count and (if userId given) how many
// of that topic's problems the user has solved, so the Topics page can show
// progress like "6/10 solved" while still letting the user jump anywhere.
router.get('/', async (req, res, next) => {
  try {
    const { userId } = req.query;

    const counts = await PracticeProblem.aggregate([
      { $group: { _id: '$topic', total: { $sum: 1 } } },
    ]);
    const countByTopic = Object.fromEntries(counts.map((c) => [c._id, c.total]));

    let solvedByTopic = {};
    if (userId) {
      const solvedSlugs = await PracticeProgress.find({ userId, status: 'solved' }).select('problemSlug');
      const slugs = solvedSlugs.map((s) => s.problemSlug);
      if (slugs.length) {
        const solvedProblems = await PracticeProblem.find({ slug: { $in: slugs } }).select('topic');
        for (const p of solvedProblems) {
          solvedByTopic[p.topic] = (solvedByTopic[p.topic] || 0) + 1;
        }
      }
    }

    const topics = TOPIC_ORDER.filter((t) => countByTopic[t]).map((t, i) => ({
      topic: t,
      description: TOPIC_DESCRIPTIONS[t] || '',
      order: i + 1,
      total: countByTopic[t] || 0,
      solved: solvedByTopic[t] || 0,
    }));

    res.json({ topics });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
