const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const quizQuestions = [
  {
    id: "q1",
    scenario: "If the machine finds a torn note, what should it do?",
    correctAnswer: "Skip it and continue counting",
    options: ["Halt immediately", "Skip it and continue counting", "Restart counting", "Alert manager"]
  },
  {
    id: "q2",
    scenario: "If the machine finds a fake note, what should it do?",
    correctAnswer: "Stop immediately",
    options: ["Skip it", "Continue counting", "Stop immediately", "Ignore it"]
  }
];

app.get('/api/quiz', (req, res) => {
  res.json(quizQuestions);
});

app.post('/api/submit', (req, res) => {
  const { answers } = req.body;
  let score = 0;
  
  const results = answers.map(ans => {
    const question = quizQuestions.find(q => q.id === ans.id);
    const isCorrect = question && question.correctAnswer === ans.answer;
    if (isCorrect) score++;
    return { id: ans.id, isCorrect, correctAnswer: question?.correctAnswer };
  });

  res.json({ score, total: quizQuestions.length, results });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
