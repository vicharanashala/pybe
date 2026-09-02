const express = require('express');
const store = require('../data/store');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const bookmarks = await store.listBookmarks();
    res.json(bookmarks);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { scenarioId } = req.body;
    if (!scenarioId) {
      return res.status(400).json({ error: 'scenarioId is required' });
    }
    const bookmark = await store.addBookmark(scenarioId);
    res.status(201).json(bookmark);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await store.removeBookmark(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
router.patch('/:id', async (req, res, next) => {
  try {
    const { note } = req.body;
    const updated = await store.updateBookmarkNote(req.params.id, note ?? '');
    if (!updated) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});