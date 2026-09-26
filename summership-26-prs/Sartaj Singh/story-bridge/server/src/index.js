const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const storyRoutes = require('./routes/stories');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true, product: 'Story Bridge' }));
app.use('/api/stories', storyRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ message: error.message || 'Server error' });
});

app.listen(port, () => console.log(`Story Bridge API running on http://localhost:${port}`));
