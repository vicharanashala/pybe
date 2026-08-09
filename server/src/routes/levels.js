const express = require('express');
const store = require('../data/store');
const { authenticateToken } = require('../middleware/auth');
const level1Content = require('../data/level1Content');
const level2Content = require('../data/level2Content');
const level3Content = require('../data/level3Content');
const level4Content = require('../data/level4Content');
const level5Content = require('../data/level5Content');

const router = express.Router();

const levels = {
  'level-1': level1Content,
  'level-2': level2Content,
  'level-3': level3Content,
  'level-4': level4Content,
  'level-5': level5Content
};

// Helper to check if a level is unlocked
const isLevelUnlocked = (levelId, progressList) => {
  if (levelId === 'level-1') return true;
  const levelNum = parseInt(levelId.split('-')[1]);
  if (isNaN(levelNum)) return false;

  const previousLevelId = `level-${levelNum - 1}`;
  const previousProgress = progressList.find(p => p.levelId === previousLevelId);
  return previousProgress && previousProgress.passed === true;
};

// Get progress for logged-in user
router.get('/progress', authenticateToken, async (req, res) => {
  try {
    const progress = await store.getUserProgress(req.user.id);
    res.json(progress);
  } catch (error) {
    console.error('Progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get level content
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const levelId = req.params.id;
    const level = levels[levelId];
    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }

    // Check progression rules
    const progress = await store.getUserProgress(req.user.id);
    if (!isLevelUnlocked(levelId, progress)) {
      return res.status(403).json({ message: 'Level is locked. Complete the previous level first.' });
    }

    // Strip correct answers from assessment before sending to client
    const safeLevel = JSON.parse(JSON.stringify(level));
    safeLevel.mcqs = safeLevel.mcqs.map(q => {
      delete q.correctAnswer;
      return q;
    });
    safeLevel.assessment.mcqs = safeLevel.assessment.mcqs.map(q => {
      delete q.correctAnswer;
      return q;
    });

    res.json(safeLevel);
  } catch (error) {
    console.error('Level fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit final assessment
router.post('/:id/submit', authenticateToken, async (req, res) => {
  try {
    const levelId = req.params.id;
    const level = levels[levelId];
    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }

    // Also strictly prevent submission on locked levels
    const progressList = await store.getUserProgress(req.user.id);
    if (!isLevelUnlocked(levelId, progressList)) {
      return res.status(403).json({ message: 'Level is locked.' });
    }

    const { mcqAnswers, codingAnswers } = req.body;
    let correctCount = 0;
    let totalQuestions = level.assessment.mcqs.length;

    // Grade MCQs
    level.assessment.mcqs.forEach((q) => {
      if (mcqAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    let xpAwarded = 0;
    const previousProgress = progressList.find(p => p.levelId === levelId);

    // MVP - Auto pass coding, grade based purely on MCQs to ensure >70% works reliably.
    const score = (correctCount / totalQuestions) * 100;
    const passed = score >= 70;

    const progressData = {
      score,
      passed,
      attempts: previousProgress ? (previousProgress.attempts || 0) + 1 : 1,
    };

    // If passed and hasn't passed before, award 100 XP
    if (passed && (!previousProgress || !previousProgress.passed)) {
      xpAwarded = 100;
      const usersDb = await store.readDb();
      const user = usersDb.users?.find(u => u._id === req.user.id) || usersDb.users?.find(u => u.id === req.user.id);
      if (user) {
        await store.updateUser(user._id || user.id, { xp: (user.xp || 0) + xpAwarded });
      }
    }

    const updatedProgress = await store.updateProgress(req.user.id, levelId, progressData);

    res.json({
      score,
      passed,
      xpAwarded,
      progress: updatedProgress,
      feedback: passed ? 'Congratulations! You unlocked the next level.' : 'Review the theory and try again.'
    });
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
