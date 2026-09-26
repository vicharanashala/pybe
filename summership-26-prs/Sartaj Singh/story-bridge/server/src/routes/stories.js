const express = require('express');
const {
  listStories,
  getStory,
  gradeAttempt,
  summariseProgress,
  summariseMisconceptions
} = require('../data/storyStore');

const router = express.Router();

// ?collection=real-world for the Real World tab; absent means folk.
router.get('/', async (req, res, next) => {
  try {
    res.json(await listStories(req.query.collection));
  } catch (error) {
    next(error);
  }
});

router.get('/progress', async (req, res, next) => {
  try {
    res.json(await summariseProgress(req.query.collection));
  } catch (error) {
    next(error);
  }
});

// Teacher-facing, never fetched by the learner UI. Must stay above `/:storyId`, or
// "misconceptions" is taken for a story id.
router.get('/misconceptions', async (_req, res, next) => {
  try {
    res.json(await summariseMisconceptions());
  } catch (error) {
    next(error);
  }
});

router.get('/:storyId', async (req, res, next) => {
  try {
    const story = await getStory(req.params.storyId);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    res.json(story);
  } catch (error) {
    next(error);
  }
});

router.post('/:storyId/attempt', async (req, res, next) => {
  try {
    const attempt = await gradeAttempt(req.params.storyId, req.body);
    if (!attempt) return res.status(404).json({ message: 'Story not found' });
    res.status(201).json(attempt);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
