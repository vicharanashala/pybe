const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Concept = require('../models/Concept');
const { protect } = require('../middleware/auth');

// POST /api/progress/update
router.post('/update', protect, async (req, res) => {
  try {
    const { conceptId, discoveryCompleted, codingCompleted, blanksCompleted } = req.body;
    const userId = req.user._id;

    let progress = await Progress.findOne({ userId, conceptId });

    if (!progress) {
      progress = new Progress({ userId, conceptId });
    }

    if (discoveryCompleted !== undefined) progress.discoveryCompleted = discoveryCompleted;
    if (codingCompleted !== undefined) progress.codingCompleted = codingCompleted;
    if (blanksCompleted !== undefined) progress.blanksCompleted = blanksCompleted;

    await progress.save();

    // If concept just completed and user is in guided mode, determine next concept
    let nextConcept = null;
    if (progress.completed && req.user.learningMode === 'guided') {
      const current = await Concept.findById(conceptId);
      if (current) {
        nextConcept = await Concept.findOne({ order: current.order + 1 });
      }
    }

    res.json({ progress, nextConcept });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/progress/user/:userId
router.get('/user/:userId', protect, async (req, res) => {
  try {
    // Users can only get their own progress
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const progressList = await Progress.find({ userId: req.params.userId })
      .populate('conceptId', 'title order difficulty icon slug');

    res.json(progressList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
