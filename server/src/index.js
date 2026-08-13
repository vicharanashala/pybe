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

// Middleware
app.use(cors({ 
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true 
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan('dev'));

// Request logging middleware
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ 
    ok: true, 
    product: 'PyBe',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/roadmap', roadmapRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((error, _req, res, _next) => {
  console.error('[ERROR]', error.message);
  console.error(error.stack);
  
  const status = error.status || 500;
  const message = error.message || 'Internal server error';
  
  res.status(status).json({ 
    error: message,
    status,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(port, () => {
  console.log(`
╔════════════════════════════════════╗
║  PyBe API v2.0.0 - Running         ║
║  http://localhost:${port}              ║
║  Endpoints: /api/scenarios         ║
║             /api/sessions          ║
║             /api/analytics         ║
║             /api/roadmap           ║
╚════════════════════════════════════╝
  `);
});
