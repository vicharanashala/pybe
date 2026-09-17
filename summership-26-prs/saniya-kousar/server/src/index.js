const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Import routes
const scenarioRoutes = require('./routes/scenarios');
const sessionRoutes = require('./routes/sessions');
const analyticsRoutes = require('./routes/analytics');
const roadmapRoutes = require('./routes/roadmap');
const nlpRoutes = require('./routes/nlp');
const learningPathRoutes = require('./routes/learningPath'); // ✅ Make sure this exists
const pythonRoutes = require('./routes/python');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ 
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check
app.get('/api/health', (_req, res) => res.json({ 
  ok: true, 
  product: 'PyBe',
  version: '1.0.0'
}));

// API Routes - ALL MUST BE REGISTERED
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/nlp', nlpRoutes);
app.use('/api/learning-path', learningPathRoutes); // ✅ This must be here!
app.use('/api/python', pythonRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    availableRoutes: [
      '/api/health',
      '/api/scenarios',
      '/api/sessions',
      '/api/analytics',
      '/api/roadmap',
      '/api/nlp',
      '/api/learning-path', // ✅ Should show here
      '/api/python'
    ]
  });
});

// Error handling middleware
app.use((error, _req, res, _next) => {
  console.error('Error:', error);
  res.status(error.status || 500).json({ 
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

app.listen(port, () => {
  console.log(`🚀 PyBe API running on http://localhost:${port}`);
  console.log(`📚 Available endpoints:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - GET  /api/scenarios`);
  console.log(`   - POST /api/sessions`);
  console.log(`   - GET  /api/analytics`);
  console.log(`   - GET  /api/roadmap`);
  console.log(`   - POST /api/nlp/convert-reasoning`);
  console.log(`   - POST /api/nlp/validate-code`);
  console.log(`   - POST /api/nlp/extract-concepts`);
  console.log(`   - POST /api/nlp/generate-code`);
  console.log(`   - GET  /api/learning-path`); // ✅ Should show here
  console.log(`   - POST /api/python/execute`);
  console.log(`   - POST /api/python/validate`);
});