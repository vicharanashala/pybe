const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const contentPath = path.join(__dirname, '..', 'data', 'content.json');

// GET /api/topics list all topics with level counts
router.get('/', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
    const topics = data.map((t) => ({
      topicId: t.topicId,
      topicName: t.topicName,
      levelCount: t.levels?.length || 0,
    }));
    res.json(topics);
  } catch (err) {
    console.error('Error reading content.json:', err);
    res.status(500).json({ message: 'Failed to load topics' });
  }
});

// GET /api/topics/:topicId get full topic data including all levels + case studies
router.get('/:topicId', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
    const topic = data.find((t) => t.topicId === req.params.topicId);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });
    res.json(topic);
  } catch (err) {
    console.error('Error reading content.json:', err);
    res.status(500).json({ message: 'Failed to load topic' });
  }
});

module.exports = router;
