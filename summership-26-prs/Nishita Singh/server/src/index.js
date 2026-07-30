const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const scenarioRoutes = require('./routes/scenarios');
const sessionRoutes = require('./routes/sessions');
const analyticsRoutes = require('./routes/analytics');
const roadmapRoutes = require('./routes/roadmap');
const responseRoutes = require('./routes/responses');
const reflectionRoutes = require('./routes/reflections');
const progressRoutes = require('./routes/progress');
const dashboardRoutes = require('./routes/dashboard');
const aiRoutes = require('./routes/ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true, product: 'PyBe' }));
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/reflections', reflectionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ message: error.message || 'Server error' });
});

app.listen(port, () => console.log(`PyBe API running on http://localhost:${port}`));
