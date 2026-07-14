const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Concept = require('../models/Concept');
const Progress = require('../models/Progress');
const Feedback = require('../models/Feedback');
const LoginLog = require('../models/LoginLog');
const Question = require('../models/Question');
const { protect, adminOnly } = require('../middleware/auth');

// Every route below is admin-only.
router.use(protect, adminOnly);

// ────────────────────────────────────────────────────────────────────────
// 1. QUESTIONS — add/edit/delete coding + scenario-based questions for any
//    module (concept). Anything created here is immediately servable to
//    learners via GET /api/questions/concept/:conceptId.
// ────────────────────────────────────────────────────────────────────────

// GET /api/admin/questions?conceptId=...
router.get('/questions', async (req, res) => {
  try {
    const filter = {};
    if (req.query.conceptId) filter.conceptId = req.query.conceptId;

    const questions = await Question.find(filter)
      .populate('conceptId', 'title slug order icon')
      .sort({ conceptId: 1, order: 1, createdAt: 1 });

    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/questions
router.post('/questions', async (req, res) => {
  try {
    const {
      conceptId, type, level, title, scenario, description,
      starter, hint, expectedOutput, acceptableOutputs, keyPoints, order
    } = req.body;

    const qType = type || 'practice';

    if (!conceptId || !title || !description) {
      return res.status(400).json({ message: 'conceptId, title, and description are required' });
    }
    if (qType === 'practice' && !expectedOutput) {
      return res.status(400).json({ message: 'expectedOutput is required for a practice question' });
    }
    if (qType === 'scenario' && (!scenario || !Array.isArray(keyPoints) || keyPoints.filter(Boolean).length === 0)) {
      return res.status(400).json({ message: 'scenario and at least one key point are required for a scenario question' });
    }

    const concept = await Concept.findById(conceptId);
    if (!concept) return res.status(404).json({ message: 'Concept not found' });

    const question = await Question.create({
      conceptId,
      type: qType,
      level: level || 'easy',
      title,
      scenario: scenario || '',
      description,
      starter: qType === 'practice' ? (starter || '# write your code here\n') : '',
      hint: hint || '',
      expectedOutput: qType === 'practice' ? expectedOutput : '',
      acceptableOutputs: Array.isArray(acceptableOutputs) ? acceptableOutputs : [],
      keyPoints: qType === 'scenario' && Array.isArray(keyPoints) ? keyPoints.filter(Boolean) : [],
      order: Number.isFinite(order) ? order : 0,
      createdBy: req.user._id
    });

    res.status(201).json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/questions/:id
router.put('/questions/:id', async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates._id;
    delete updates.createdBy;

    const qType = updates.type;
    if (qType === 'practice' && updates.expectedOutput === '') {
      return res.status(400).json({ message: 'expectedOutput is required for a practice question' });
    }
    if (qType === 'scenario' && (!updates.scenario || !Array.isArray(updates.keyPoints) || updates.keyPoints.filter(Boolean).length === 0)) {
      return res.status(400).json({ message: 'scenario and at least one key point are required for a scenario question' });
    }

    const question = await Question.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true, context: 'query' });
    if (!question) return res.status(404).json({ message: 'Question not found' });

    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admin/questions/:id
router.delete('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json({ message: 'Question deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ────────────────────────────────────────────────────────────────────────
// 2. VISUAL ANALYTICS — per-concept completion, per-user progress, and an
//    activity/engagement time series (logins + completions per day).
// ────────────────────────────────────────────────────────────────────────

// GET /api/admin/analytics/summary
router.get('/analytics/summary', async (req, res) => {
  try {
    const [totalUsers, totalConcepts, allProgress] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Concept.countDocuments(),
      Progress.find()
    ]);

    const completedCount = allProgress.filter(p => p.completed).length;
    const inProgressCount = allProgress.filter(p => !p.completed && (p.discoveryCompleted || p.codingCompleted)).length;

    const since7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [active7, active30] = await Promise.all([
      LoginLog.distinct('userId', { loginAt: { $gte: since7 } }),
      LoginLog.distinct('userId', { loginAt: { $gte: since30 } })
    ]);

    res.json({
      totalUsers,
      totalConcepts,
      totalCompletions: completedCount,
      inProgressCount,
      activeUsersLast7Days: active7.length,
      activeUsersLast30Days: active30.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/analytics/concepts — per-module completion + avg speed
router.get('/analytics/concepts', async (req, res) => {
  try {
    const [concepts, allProgress] = await Promise.all([
      Concept.find().sort({ order: 1 }),
      Progress.find()
    ]);

    const data = concepts.map(c => {
      const rows = allProgress.filter(p => p.conceptId.toString() === c._id.toString());
      const started = rows.length;
      const completed = rows.filter(p => p.completed);
      const times = completed
        .filter(p => p.createdAt && p.completedAt)
        .map(p => (new Date(p.completedAt) - new Date(p.createdAt)) / 60000); // minutes
      const avgMinutes = times.length ? times.reduce((a, b) => a + b, 0) / times.length : null;

      return {
        conceptId: c._id,
        title: c.title,
        order: c.order,
        icon: c.icon,
        difficulty: c.difficulty,
        learnersStarted: started,
        learnersCompleted: completed.length,
        completionRate: started ? Math.round((completed.length / started) * 100) : 0,
        avgTimeToCompleteMinutes: avgMinutes !== null ? Math.round(avgMinutes) : null
      };
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/analytics/users — per-learner progress + activity
router.get('/analytics/users', async (req, res) => {
  try {
    const [users, totalConcepts, allProgress, lastLogins] = await Promise.all([
      User.find({ role: 'user' }).select('-password'),
      Concept.countDocuments(),
      Progress.find(),
      LoginLog.aggregate([
        { $sort: { loginAt: -1 } },
        { $group: { _id: '$userId', lastLoginAt: { $first: '$loginAt' }, loginCount: { $sum: 1 } } }
      ])
    ]);

    const loginByUser = new Map(lastLogins.map(l => [l._id.toString(), l]));

    const data = users.map(u => {
      const rows = allProgress.filter(p => p.userId.toString() === u._id.toString());
      const completed = rows.filter(p => p.completed).length;
      const login = loginByUser.get(u._id.toString());
      const times = rows
        .filter(p => p.completed && p.createdAt && p.completedAt)
        .map(p => (new Date(p.completedAt) - new Date(p.createdAt)) / 60000);
      const avgMinutes = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;

      return {
        userId: u._id,
        name: u.name,
        email: u.email,
        theme: u.theme,
        pythonLevel: u.pythonLevel,
        learningMode: u.learningMode,
        conceptsCompleted: completed,
        totalConcepts,
        completionRate: totalConcepts ? Math.round((completed / totalConcepts) * 100) : 0,
        avgTimeToCompleteMinutes: avgMinutes,
        loginCount: login?.loginCount || 0,
        lastLoginAt: login?.lastLoginAt || null
      };
    });

    data.sort((a, b) => b.conceptsCompleted - a.conceptsCompleted);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/analytics/activity?days=30 — daily logins + completions,
// for an over-time engagement chart.
router.get('/analytics/activity', async (req, res) => {
  try {
    const days = Math.min(Math.max(Number(req.query.days) || 30, 1), 180);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    since.setHours(0, 0, 0, 0);

    const [logins, completions] = await Promise.all([
      LoginLog.find({ loginAt: { $gte: since } }),
      Progress.find({ completed: true, completedAt: { $gte: since } })
    ]);

    const dayKey = (d) => new Date(d).toISOString().slice(0, 10);
    const buckets = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setDate(d.getDate() + i);
      buckets[dayKey(d)] = { date: dayKey(d), logins: 0, uniqueLogins: new Set(), completions: 0 };
    }

    logins.forEach(l => {
      const key = dayKey(l.loginAt);
      if (buckets[key]) {
        buckets[key].logins += 1;
        buckets[key].uniqueLogins.add(l.userId.toString());
      }
    });
    completions.forEach(p => {
      const key = dayKey(p.completedAt);
      if (buckets[key]) buckets[key].completions += 1;
    });

    const series = Object.values(buckets).map(b => ({
      date: b.date,
      logins: b.logins,
      activeUsers: b.uniqueLogins.size,
      completions: b.completions
    }));

    res.json(series);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ────────────────────────────────────────────────────────────────────────
// 3. USER LOGIN LOGS
// ────────────────────────────────────────────────────────────────────────

// GET /api/admin/logs?limit=200
router.get('/logs', async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 200, 1), 1000);
    const logs = await LoginLog.find().sort({ loginAt: -1 }).limit(limit);
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ────────────────────────────────────────────────────────────────────────
// 4. FEEDBACK ANALYSIS
// ────────────────────────────────────────────────────────────────────────

// GET /api/admin/feedback — every feedback entry, who submitted it and on
// which module, newest first.
router.get('/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('userId', 'name email')
      .populate('conceptId', 'title slug icon')
      .sort({ createdAt: -1 });

    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/feedback/summary — per-module helpful vs not-helpful
// counts, to spot which lessons are landing and which need work.
router.get('/feedback/summary', async (req, res) => {
  try {
    const [concepts, feedback] = await Promise.all([
      Concept.find().sort({ order: 1 }),
      Feedback.find()
    ]);

    const data = concepts.map(c => {
      const rows = feedback.filter(f => f.conceptId.toString() === c._id.toString());
      const helpful = rows.filter(f => f.helpful).length;
      const notHelpful = rows.length - helpful;
      return {
        conceptId: c._id,
        title: c.title,
        order: c.order,
        totalResponses: rows.length,
        helpful,
        notHelpful,
        helpfulRate: rows.length ? Math.round((helpful / rows.length) * 100) : null
      };
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
