import express from 'express';
import { UserProgress } from '../models/UserProgress.js';

const router = express.Router();

// GET user progress
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    let progress = await UserProgress.findOne({ user_id: userId });

    if (!progress) {
      progress = await UserProgress.create({
        user_id: userId,
        current_chapter: 1,
        saved_scrolls: [''],
      });
    }

    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT save user progress
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { current_chapter, saved_scrolls } = req.body;

    const updated = await UserProgress.findOneAndUpdate(
      { user_id: userId },
      { current_chapter, saved_scrolls },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
