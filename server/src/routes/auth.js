const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const store = require('../data/store');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'pybe-dev-secret-change-in-production';

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
}

router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const db = await store.readDb();
    if (!db.users) db.users = [];

    const existing = db.users.find((u) => u.email === email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = store.createRecord({
      email,
      password: hashedPassword,
      name,
      role: 'learner'
    });
    db.users.push(user);
    await store.writeDb(db);

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const db = await store.readDb();
    const users = db.users || [];
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const db = await store.readDb();
    const users = db.users || [];
    const user = users.find((u) => u._id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user._id, email: user.email, name: user.name, role: user.role });
  } catch (error) {
    next(error);
  }
});

router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const { name } = req.body;
    const db = await store.readDb();
    const users = db.users || [];
    const user = users.find((u) => u._id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    user.updatedAt = store.now();
    await store.writeDb(db);

    res.json({ id: user._id, email: user.email, name: user.name, role: user.role });
  } catch (error) {
    next(error);
  }
});

module.exports = { router, authenticate, requireRole };
