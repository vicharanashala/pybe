const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const scenarioRoutes = require('./routes/scenarios');
const sessionRoutes = require('./routes/sessions');
const analyticsRoutes = require('./routes/analytics');
const roadmapRoutes = require('./routes/roadmap');
const recommendationsRoutes = require('./routes/recommendations');
const aiChatRoutes = require('./routes/aiChat');
const aiReviewRoutes = require('./routes/aiReview');
const aiQuizRoutes = require('./routes/aiQuiz');
const aiPlannerRoutes = require('./routes/aiPlanner');
const aiGraphRoutes = require('./routes/aiGraph');
const aiInsightsRoutes = require('./routes/aiInsights');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const limiter = rateLimit({ windowMs: 60 * 1000, max: 100, message: { message: 'Too many requests' } });

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));
app.use(limiter);

app.get('/api/health', (_req, res) => res.json({ ok: true, product: 'PyBe' }));
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/ai/chat', aiChatRoutes);
app.use('/api/ai/review', aiReviewRoutes);
app.use('/api/ai/quiz', aiQuizRoutes);
app.use('/api/ai/planner', aiPlannerRoutes);
app.use('/api/ai/graph', aiGraphRoutes);
app.use('/api/ai/insights', aiInsightsRoutes);

const path = require('path');
const clientDist = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDist));
app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ message: error.message || 'Server error' });
});

app.listen(port, () => console.log(`PyBe running on http://localhost:${port}`));
