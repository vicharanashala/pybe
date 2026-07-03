const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const scenarioRoutes = require('./routes/scenarios');
const sessionRoutes = require('./routes/sessions');
const analyticsRoutes = require('./routes/analytics');
const roadmapRoutes = require('./routes/roadmap');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

const safe = (fn) => (req, res) => {
  Promise.resolve(fn(req, res)).catch((err) => {
    console.error('[Route Error]', err.message || err);
    res.status(500).json({ message: 'Server safe fallback' });
  });
};

app.get('/api/health', (_req, res) => res.json({ ok: true, product: 'PyBe' }));
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/roadmap', roadmapRoutes);

app.use((error, _req, res, _next) => {
  console.error('[App Error]', error.message || error);
  res.status(error.status || 500).json({ message: error.message || 'Server error' });
});

process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err.message || err);
  console.error('[FATAL] Stack:', err.stack);
});

process.on('unhandledRejection', (err) => {
  console.error('[FATAL] Unhandled Promise Rejection:', err?.message || err);
  console.error('[FATAL] Stack:', err?.stack);
});

const server = app.listen(port, () => {
  console.log(`[PyBe API] Running on http://localhost:${port}`);
});

server.on('error', (err) => {
  console.error('[FATAL] Server listen error:', err.message || err);
});

process.on('SIGTERM', () => {
  console.log('[PyBe API] Shutting down gracefully...');
  server.close(() => {
    console.log('[PyBe API] Closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[PyBe API] Interrupted. Closing...');
  server.close(() => {
    console.log('[PyBe API] Closed.');
    process.exit(0);
  });
});