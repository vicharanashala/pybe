const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('CRITICAL ERROR: JWT_SECRET environment variable is missing in production!');
  process.exit(1);
}
const SAFE_JWT_SECRET = JWT_SECRET || 'pybe-super-secret-key-fallback';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Authentication token missing' });

  jwt.verify(token, SAFE_JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: 'Authentication token invalid or expired' });
    req.user = user;
    next();
  });
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ message: `Forbidden: ${role} access required` });
    }
  };
}

const requireAdmin = requireRole('ADMIN');

module.exports = { authenticateToken, requireRole, requireAdmin, JWT_SECRET: SAFE_JWT_SECRET };
