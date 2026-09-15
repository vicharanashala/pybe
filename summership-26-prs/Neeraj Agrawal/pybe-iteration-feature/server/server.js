const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const quizQuestions = [
  {
    id: 1,
    universe: 'hogwarts',
    scenario: "Hermione is practicing a spell in the Gryffindor Common Room. She creates a spell variable `power_level = 50`. Inside her Room of Requirement function, she wants to modify this exact variable.",
    code: `power_level = 50\n\ndef room_of_requirement():\n    ____ power_level\n    power_level += 20\n\nroom_of_requirement()`,
    correctAnswer: "global",
    options: ["global", "nonlocal", "local", "enclosing"]
  },
  {
    id: 2,
    universe: 'avengers',
    scenario: "Tony Stark is upgrading his suit. He has an outer function `jarvis()` with a variable `shield = 100`. Inside it, an inner function `mark_50()` needs to modify `shield`.",
    code: `def jarvis():\n    shield = 100\n    def mark_50():\n        ____ shield\n        shield -= 10\n    mark_50()\n\njarvis()`,
    correctAnswer: "nonlocal",
    options: ["global", "nonlocal", "local", "enclosing"]
  },
  {
    id: 3,
    universe: 'hogwarts',
    scenario: "Dumbledore has declared a rule for all of Hogwarts: `magic_allowed = True`. Professor Snape is in the dungeons and wants to change this rule temporarily for his class.",
    code: `magic_allowed = True\n\ndef potions_class():\n    ____ magic_allowed\n    magic_allowed = False\n\npotions_class()`,
    correctAnswer: "global",
    options: ["global", "nonlocal", "local", "enclosing"]
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
