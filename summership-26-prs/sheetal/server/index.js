import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import progressRoutes from './routes/progressRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/progress', progressRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'Creation Backend' });
});

// Database connection & server start
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/creation_db';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully.');
    app.listen(PORT, () => {
      console.log(`Creation server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.warn('MongoDB connection warning:', err.message);
    app.listen(PORT, () => {
      console.log(`Creation server listening on port ${PORT} (standalone)`);
    });
  });
