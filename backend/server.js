const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/concepts', require('./routes/concepts'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/discovery', require('./routes/discovery'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/practice', require('./routes/practice'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Connect to MongoDB
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not set. Add your MongoDB Atlas connection string to backend/.env (see .env.example).');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
