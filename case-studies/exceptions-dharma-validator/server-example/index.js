import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Optional local endpoint retained for older clients; no model transport exists.
app.post('/api/ask', (req, res) => {
  const { question, lessonTitle, storyTitle, conceptExplainer } = req.body;
  if (!question || typeof question !== 'string') return res.status(400).json({ error: 'A question is required.' });
  return res.json({ answer: `Local guide for ${lessonTitle || 'Python exceptions'}: ${conceptExplainer || 'Trace the unexpected event, its handler, and the next step.'} Revisit ${storyTitle || 'the authored story'} to connect the steps.`, source: 'authored-lesson' });
});

app.listen(PORT, () => {
  console.log(`Doubt-clearing backend running on http://localhost:${PORT}`);
});