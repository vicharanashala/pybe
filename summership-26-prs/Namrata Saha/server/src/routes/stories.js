const express = require('express');
const store = require('../data/store');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const stories = await store.listStories();
    res.json(stories);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const story = await store.getStory(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    res.json(story);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
