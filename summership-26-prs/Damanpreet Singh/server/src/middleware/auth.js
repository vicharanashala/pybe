const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized – no token provided.', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-for-dev');
    req.user = payload; // { id, email }
    next();
  } catch (err) {
    return next(new AppError('Unauthorized – invalid or expired token.', 401));
  }
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-for-dev');
      req.user = payload;
    } catch (err) {
      // Ignore errors for optional auth
    }
  }
  next();
}

module.exports = { authenticate, optionalAuth };
