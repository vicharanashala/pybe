const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const storyRoutes = require('./routes/stories');
const sessionRoutes = require('./routes/sessions');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true, product: 'PyBe - Py-Betaal Tales' }));
app.use('/api/stories', storyRoutes);
app.use('/api/sessions', sessionRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ message: error.message || 'Server error' });
});

app.listen(port, () => console.log(`Py-Betaal Tales API running on http://localhost:${port}`));
