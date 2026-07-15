const express = require('express');
const router = express.Router();
const Concept = require('../models/Concept');
const { protect } = require('../middleware/auth');

// GET /api/concepts
router.get('/', protect, async (req, res) => {
  try {
    const concepts = await Concept.find().sort({ order: 1 });
    res.json(concepts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/concepts/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const concept = await Concept.findById(req.params.id);
    if (!concept) return res.status(404).json({ message: 'Concept not found' });
    res.json(concept);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
