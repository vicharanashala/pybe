const express = require('express');
const store = require('../data/store');

const router = express.Router();

const quizBank = [
  { concept: 'for / while loops', difficulty: 'Beginner', question: 'Which loop type is best when you know exactly how many times to iterate?', options: ['for loop', 'while loop', 'do-while loop', 'recursion'], correct: 0, explanation: 'A for loop is ideal when you know the number of iterations. It iterates over a sequence.' },
  { concept: 'for / while loops', difficulty: 'Explorer', question: 'What keyword exits a loop immediately?', options: ['exit', 'break', 'stop', 'return'], correct: 1, explanation: 'The `break` keyword exits the innermost loop immediately.' },
  { concept: 'for / while loops', difficulty: 'Builder', question: 'What does the following code output?\n\nfor i in range(3):\n    if i == 1:\n        continue\n    print(i)', options: ['0 1 2', '0 2', '1', '0 1'], correct: 1, explanation: 'continue skips iteration 1, so only 0 and 2 are printed.' },
  { concept: 'if / elif / else', difficulty: 'Beginner', question: 'What keyword starts a conditional block in Python?', options: ['when', 'if', 'switch', 'case'], correct: 1, explanation: 'Python uses `if` to start conditional blocks.' },
  { concept: 'if / elif / else', difficulty: 'Explorer', question: 'What is the purpose of `elif`?', options: ['End the program', 'Check another condition after an if', 'Loop again', 'Raise an error'], correct: 1, explanation: '`elif` checks another condition when the previous if/elif was False.' },
  { concept: 'if / elif / else', difficulty: 'Builder', question: 'When does the else block execute?', options: ['Always', 'When all conditions are False', 'When the first condition is True', 'Never'], correct: 1, explanation: 'else executes when none of the preceding if/elif conditions are True.' },
  { concept: 'lists and dictionaries', difficulty: 'Beginner', question: 'How do you access the first element of a list named `items`?', options: ['items[1]', 'items[0]', 'items.first()', 'items(-1)'], correct: 1, explanation: 'Python uses 0-based indexing, so the first element is at index 0.' },
  { concept: 'lists and dictionaries', difficulty: 'Explorer', question: 'What method adds an item to the end of a list?', options: ['add()', 'append()', 'insert()', 'push()'], correct: 1, explanation: 'The `append()` method adds an item to the end of a list.' },
  { concept: 'lists and dictionaries', difficulty: 'Builder', question: 'What is a dictionary comprehension?', options: ['{k: v for k, v in items}', '[k: v for k, v in items]', 'dict(k, v for items)', '{k, v for items}'], correct: 0, explanation: 'Dictionary comprehension uses {key: value for key, value in items} syntax.' },
  { concept: 'variables and arithmetic expressions', difficulty: 'Beginner', question: 'Which operator gives the remainder of division?', options: ['/', '//', '%', '**'], correct: 2, explanation: 'The modulo operator % returns the remainder of division.' },
  { concept: 'variables and arithmetic expressions', difficulty: 'Explorer', question: 'What is the result of 7 // 2?', options: ['3.5', '3', '4', '3.0'], correct: 1, explanation: 'Floor division // returns the whole number part: 7 // 2 = 3.' },
  { concept: 'functions', difficulty: 'Beginner', question: 'What keyword defines a function in Python?', options: ['function', 'func', 'def', 'fn'], correct: 2, explanation: 'Python uses `def` to define functions.' },
  { concept: 'functions', difficulty: 'Explorer', question: 'What does `return` do in a function?', options: ['Prints output', 'Exits the program', 'Sends a value back to the caller', 'Loops again'], correct: 2, explanation: '`return` sends a value back to wherever the function was called.' },
  { concept: 'functions', difficulty: 'Builder', question: 'What is a default parameter?', options: ['A required argument', 'A parameter with a fallback value', 'A global variable', 'A return value'], correct: 1, explanation: 'Default parameters have a fallback value used when the argument is not provided.' },
  { concept: 'comparisons and list comprehensions', difficulty: 'Beginner', question: 'What does == compare?', options: ['Variable names', 'Values for equality', 'Memory addresses', 'Types only'], correct: 1, explanation: 'The == operator checks if two values are equal.' },
  { concept: 'comparisons and list comprehensions', difficulty: 'Explorer', question: 'What does [x*2 for x in [1,2,3]] produce?', options: ['[2, 4, 6]', '[1, 2, 3]', '[1, 4, 9]', '[3, 6, 9]'], correct: 0, explanation: 'Each element is multiplied by 2: 1*2=2, 2*2=4, 3*2=6.' },
  { concept: 'try / except', difficulty: 'Beginner', question: 'What does try/except handle?', options: ['Syntax errors', 'Runtime errors', 'Import errors', 'Style errors'], correct: 1, explanation: 'try/except catches runtime errors (exceptions) during execution.' },
  { concept: 'try / except', difficulty: 'Explorer', question: 'What does `except ValueError` catch?', options: ['All errors', 'Only ValueError exceptions', 'Only TypeError', 'No errors'], correct: 1, explanation: 'Catching a specific exception type only handles that particular error.' },
  { concept: 'accumulator pattern', difficulty: 'Beginner', question: 'What is an accumulator variable?', options: ['A loop counter', 'A variable that builds up a result', 'A function parameter', 'A constant'], correct: 1, explanation: 'An accumulator variable collects or builds up a result during iteration.' },
  { concept: 'accumulator pattern', difficulty: 'Explorer', question: 'How do you initialize an accumulator for a sum?', options: ['total = 1', 'total = 0', 'total = None', 'total = []'], correct: 1, explanation: 'For sums, initialize the accumulator to 0 so it doesn\'t affect the first addition.' },
  { concept: 'break / continue', difficulty: 'Beginner', question: 'What does `continue` do in a loop?', options: ['Exits the loop', 'Skips to the next iteration', 'Pauses execution', 'Restarts the loop'], correct: 1, explanation: 'continue skips the rest of the current iteration and moves to the next one.' },
  { concept: 'enumerate / range', difficulty: 'Beginner', question: 'What does enumerate() return?', options: ['Just values', 'Index-value pairs', 'Just indices', 'A sorted list'], correct: 1, explanation: 'enumerate() yields (index, value) pairs for each element.' },
  { concept: 'enumerate / range', difficulty: 'Explorer', question: 'What does range(2, 6) produce?', options: ['2, 3, 4, 5', '2, 3, 4, 5, 6', '1, 2, 3, 4, 5', '2, 4, 6'], correct: 0, explanation: 'range(start, stop) includes start but excludes stop: 2, 3, 4, 5.' },
  { concept: 'map and comprehensions', difficulty: 'Explorer', question: 'What is a list comprehension?', options: ['A type of loop', 'A concise way to create lists', 'A sorting algorithm', 'A dictionary method'], correct: 1, explanation: 'List comprehensions create new lists by applying an expression to each item.' },
];

function pickQuiz(sessions, conceptMastery, difficulty) {
  const weakConcepts = conceptMastery
    ? Object.entries(conceptMastery).filter(([, s]) => s.level !== 'mastered').map(([c]) => c)
    : [];

  let pool = quizBank;
  if (difficulty) pool = pool.filter(q => q.difficulty === difficulty);
  if (weakConcepts.length > 0) {
    const weakPool = pool.filter(q => weakConcepts.some(c => q.concept.includes(c.split(' ')[0])));
    if (weakPool.length > 0) pool = weakPool;
  }

  if (pool.length === 0) pool = quizBank;

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(5, shuffled.length));
}

router.get('/', async (_req, res, next) => {
  try {
    const sessions = await store.listSessions();
    const db = await store.readDb();

    const perConceptStats = {};
    sessions.forEach(session => {
      (session.abstractionMap || []).forEach(m => {
        if (!perConceptStats[m.pythonConcept]) perConceptStats[m.pythonConcept] = { sessions: 0, totalScore: 0 };
        perConceptStats[m.pythonConcept].sessions += 1;
        perConceptStats[m.pythonConcept].totalScore += session.promptScore || 0;
      });
    });
    const conceptMastery = {};
    Object.entries(perConceptStats).forEach(([concept, stats]) => {
      const avg = stats.sessions > 0 ? Math.round(stats.totalScore / stats.sessions) : 0;
      conceptMastery[concept] = { sessions: stats.sessions, avgPromptScore: avg, level: avg >= 75 ? 'mastered' : avg >= 50 ? 'developing' : 'needs_work' };
    });

    const quiz = pickQuiz(sessions, conceptMastery, _req.query.difficulty);
    const questions = quiz.map((q, i) => ({
      id: i,
      concept: q.concept,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options
    }));

    res.json({ questions, totalQuestions: questions.length });
  } catch (error) {
    next(error);
  }
});

router.post('/check', async (req, res, next) => {
  try {
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers)) return res.status(400).json({ error: 'Answers array required' });

    let correct = 0;
    const results = answers.map(a => {
      const q = quizBank.find((_, i) => i === a.questionId);
      if (!q) return { correct: false };
      const isCorrect = q.correct === a.selected;
      if (isCorrect) correct++;
      return { correct: isCorrect, explanation: q.explanation, correctAnswer: q.options[q.correct] };
    });

    const total = answers.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    res.json({ correct, total, percentage, results });
  } catch (error) {
    next(error);
  }
});

module.exports = router;