// Load env vars first, before any local module that might read them at
// require-time (e.g. services/submissionCap.js reads LEARNER_SUBMISSION_CAP
// as soon as it's required) — requiring dotenv after those would silently
// leave them reading undefined.
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const scenarioRoutes = require('./routes/scenarios');
const sessionRoutes = require('./routes/sessions');
const analyticsRoutes = require('./routes/analytics');
const roadmapRoutes = require('./routes/roadmap');
const scenarioGeneratorRoutes = require('./routes/scenarioGenerator');
const scenarioGeneratorLearnerRoutes = require('./routes/scenarioGeneratorLearner');

const app = express();
const port = process.env.PORT || 5000;

// Vite auto-increments the port (5173 -> 5174 -> ...) whenever the previous
// dev server is still holding the last one, so a single fixed CLIENT_ORIGIN
// breaks CORS every time that happens. Accept any localhost/127.0.0.1 origin
// (any port) in dev instead — this app has no cookies/session auth, so there's
// nothing cross-origin credentials could leak. CLIENT_ORIGIN, if set, is still
// allowed alongside that.
const localhostOrigin = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/;
app.use(cors({
  origin(origin, callback) {
    if (!origin || localhostOrigin.test(origin) || origin === process.env.CLIENT_ORIGIN) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  }
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true, product: 'PyBe' }));
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/scenario-gen', scenarioGeneratorRoutes);
app.use('/api/scenario-gen-learner', scenarioGeneratorLearnerRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ message: error.message || 'Server error' });
});

app.listen(port, () => console.log(`PyBe API running on http://localhost:${port}`));
