const express = require('express');
const PracticeProgress = require('../../models/PracticeProgress');

const router = express.Router();

// PUT /api/practice/progress/draft
// body: { userId, slug, code }
// Lightweight autosave so a person's in-progress code for a problem survives
// a page refresh or a trip to another topic, without marking it solved.
router.put('/draft', async (req, res, next) => {
  try {
    const { userId, slug, code } = req.body || {};
    if (!userId || !slug || typeof code !== 'string') {
      return res.status(400).json({ error: 'userId, slug and code are required' });
    }
    await PracticeProgress.findOneAndUpdate(
      { userId, problemSlug: slug },
      { $set: { lastCode: code }, $setOnInsert: { status: 'attempted' } },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// GET /api/practice/progress/summary?userId=xxx
router.get('/summary', async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.json({ solved: 0, attempted: 0 });
    const [solved, attempted] = await Promise.all([
      PracticeProgress.countDocuments({ userId, status: 'solved' }),
      PracticeProgress.countDocuments({ userId }),
    ]);
    res.json({ solved, attempted });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
