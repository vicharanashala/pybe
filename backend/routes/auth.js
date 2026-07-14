const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const LoginLog = require('../models/LoginLog');
const { protect } = require('../middleware/auth');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register
// Public self-registration always creates a regular learner account —
// admin accounts are provisioned separately (see seed/seedAdmin.js), never
// through this open endpoint.
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Please provide name, email, and password' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashed, role: 'user' });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      onboardingComplete: user.onboardingComplete,
      token: generateToken(user._id)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
// Shared login for both learners and admins — the same credentials form
// works for everyone, the response's `role` is what the frontend uses to
// send admins to the admin dashboard instead of the learner dashboard.
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });

    // Best-effort login log — never let a logging failure block sign-in.
    try {
      await LoginLog.create({
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ipAddress: req.ip || req.headers['x-forwarded-for'] || '',
        userAgent: req.headers['user-agent'] || ''
      });
    } catch (logErr) {
      console.error('Login log failed:', logErr.message);
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      theme: user.theme,
      learningGoal: user.learningGoal,
      pythonLevel: user.pythonLevel,
      learningMode: user.learningMode,
      onboardingComplete: user.onboardingComplete,
      token: generateToken(user._id)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/profile
router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});

// PUT /api/auth/onboarding
// Now captures which real-world theme (sports / daily-life / philosophy /
// food / environmental) the learner wants their scenarios told through, plus why
// they're learning Python at all, instead of a professional-background pick.
router.put('/onboarding', protect, async (req, res) => {
  try {
    const { theme, learningGoal, pythonLevel, learningMode } = req.body;

    const VALID_THEMES = ['sports', 'daily-life', 'philosophy', 'food', 'environmental'];
    if (!VALID_THEMES.includes(theme)) {
      return res.status(400).json({ message: 'Please choose a valid theme' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { theme, learningGoal: learningGoal || '', pythonLevel, learningMode, onboardingComplete: true },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/auth/theme
// A lightweight, standalone way to switch the real-world theme AFTER
// onboarding — deliberately separate from PUT /onboarding so switching
// themes never touches learningGoal/pythonLevel/learningMode or
// onboardingComplete. Progress (Progress.js) is keyed only by
// userId + conceptId, with no theme field anywhere on it, so changing
// theme here can never affect anything the learner has already completed.
router.patch('/theme', protect, async (req, res) => {
  try {
    const { theme } = req.body;

    const VALID_THEMES = ['sports', 'daily-life', 'philosophy', 'food', 'environmental'];
    if (!VALID_THEMES.includes(theme)) {
      return res.status(400).json({ message: 'Please choose a valid theme' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { theme },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
