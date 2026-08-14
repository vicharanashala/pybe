require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { globalErrorHandler } = require('./middleware/errorHandler');
const { authenticate, optionalAuth } = require('./middleware/auth');
const prisma = require('./prisma');
const logger = require('./lib/logger');

// Route modules
const authRoutes = require('./routes/auth.routes');
const scenarioRoutes = require('./routes/scenario.routes');
const sessionRoutes = require('./routes/session.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const roadmapRoutes = require('./routes/roadmap.routes');

// ---------------------------------------------------------------------------
// Env validation – fail fast on missing critical vars
// ---------------------------------------------------------------------------

const REQUIRED_ENV = ['DATABASE_URL'];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
  logger.error(`FATAL: Missing required environment variables: ${missing.join(', ')}`);
  logger.error('Ensure your server/.env file exists and contains DATABASE_URL.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// App setup
// ---------------------------------------------------------------------------

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

app.use(helmet()); // Secure HTTP headers

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  process.env.CLIENT_ORIGIN
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS policy'));
      }
    },
    credentials: true,
  }),
);
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' })); // Prevent oversized payloads (DoS vector)

// ---------------------------------------------------------------------------
// Rate Limiting (AI Session endpoint)
// ---------------------------------------------------------------------------
const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 AI requests per windowMs
  message: { success: false, error: 'Too many requests. Please try again in a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ---------------------------------------------------------------------------
// Global JWT Auth for mutating routes (excluding /api/auth)
// ---------------------------------------------------------------------------
app.use('/api', (req, res, next) => {
  if (req.method === 'GET' || req.path.startsWith('/auth') || req.path.startsWith('/sessions') || req.path.startsWith('/scenarios')) {
    // Optionally parse user for GET requests, /sessions, or AI scenario/tree/explain generators if token is present
    return optionalAuth(req, res, next);
  }
  // Require valid JWT for administrative POST, PUT, DELETE operations
  return authenticate(req, res, next);
});

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.use('/api/auth', authRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/sessions', aiRateLimiter, sessionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/roadmap', roadmapRoutes);

// ---------------------------------------------------------------------------
// 404 catch-all
// ---------------------------------------------------------------------------

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found.' });
});

// ---------------------------------------------------------------------------
// Global error handler (must be last)
// ---------------------------------------------------------------------------

app.use(globalErrorHandler);

// ---------------------------------------------------------------------------
// Start server + graceful shutdown
// ---------------------------------------------------------------------------

const server = app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info(`MEMENTO_MODE = ${process.env.MEMENTO_MODE || 'LOCAL_HEURISTIC'}`);
  logger.info(`CORS origin = ${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}`);
});

// Graceful shutdown – close Prisma connection + HTTP server on SIGTERM/SIGINT
async function gracefulShutdown(signal) {
  logger.info(`\n${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('Prisma disconnected. Process exiting.');
    process.exit(0);
  });
  // Force exit after 10s if connections hang
  setTimeout(() => {
    logger.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;
