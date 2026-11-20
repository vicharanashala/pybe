const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const {quizQuestions} = require('../../shared/quiz-questions.cjs');

app.get('/api/quiz', (req, res) => {
  res.json(quizQuestions);
});

app.post('/api/submit', (req, res) => {
  const { answers } = req.body;
  
  const results = answers.map(ans => {
    const question = quizQuestions.find(q => q.id === ans.id);
    const isCorrect = question && question.correctAnswer === ans.answer;
    return { id: ans.id, isCorrect, correctAnswer: question?.correctAnswer };
  });

  res.json({ results });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
