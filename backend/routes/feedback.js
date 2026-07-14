const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { protect } = require('../middleware/auth');

// POST /api/feedback
router.post('/', protect, async (req, res) => {
  try {
    const { conceptId, helpful, comment } = req.body;
    const userId = req.user._id;

    // Upsert: one feedback per user per concept
    const feedback = await Feedback.findOneAndUpdate(
      { userId, conceptId },
      { helpful, comment: comment || '' },
      { upsert: true, new: true }
    );

    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
