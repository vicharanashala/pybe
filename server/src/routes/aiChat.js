const express = require('express');
const store = require('../data/store');
const engine = require('../services/learningEngine');

const router = express.Router();

const conceptExplanations = {
  'for / while loops': 'Loops let you repeat actions. A `for` loop iterates over a collection, while a `while` loop repeats until a condition is false.',
  'if / elif / else': 'Conditionals let your program make decisions. Use `if` for the first check, `elif` for additional checks, and `else` for the default case.',
  'lists and dictionaries': 'Lists store ordered collections with indexing. Dictionaries store key-value pairs for fast lookups by name.',
  'variables and arithmetic expressions': 'Variables store data in named containers. Arithmetic expressions combine values with +, -, *, /, and //.',
  'functions': 'Functions package reusable logic. Define with `def`, pass inputs as parameters, and return results with `return`.',
  'comparisons and list comprehensions': 'Comparisons return True/False. List comprehensions create new lists by filtering or transforming existing ones in one line.',
  'try / except': 'Exception handling catches errors at runtime. Put risky code in `try` and handle failures in `except`.',
  'map and comprehensions': 'Transform data from one form to another. List comprehensions are Python\'s idiomatic way to map values.',
  'accumulator pattern': 'Build a result incrementally. Initialize a variable, loop through data, and update it each iteration.',
  'break / continue': '`break` exits a loop immediately. `continue` skips the rest of the current iteration and moves to the next.',
  'enumerate / range': '`enumerate` gives you index + value pairs. `range` generates sequences of numbers for indexing.',
};

const pythonTips = [
  'Use meaningful variable names like `total_price` instead of `x`.',
  'Python uses 0-based indexing — the first element is at index 0.',
  'f-strings like f"Hello {name}" are the modern way to format strings.',
  'Use `len()` to get the length of a list or string.',
  'Dictionary `.get(key, default)` safely returns a value without raising an error.',
  'List comprehensions [x*2 for x in items] are faster and cleaner than manual loops.',
  'Use `enumerate(items)` instead of manual index tracking in loops.',
  'Python passes by assignment, not by value or reference.',
  'Use `in` to check membership: `if item in my_list`.',
  'The `zip()` function pairs elements from multiple lists together.',
];

function generateResponse(message, sessions, conceptMastery) {
  const lower = message.toLowerCase();

  if (/hi|hello|hey|help|start/.test(lower)) {
    return {
      reply: "Hello! I'm your PyBe AI Mentor. I can help you understand Python concepts, explain your reasoning patterns, or give you practice tips. What would you like to learn about?",
      suggestions: ['Explain loops', 'How do functions work?', 'Help with my reasoning']
    };
  }

  if (/loop|repeat|iterate|for|while/.test(lower)) {
    return {
      reply: "Loops are one of the most powerful Python concepts! A `for` loop iterates over items: `for item in items:`. A `while` loop repeats until a condition is false: `while condition:`. You can use `break` to exit early and `continue` to skip an iteration. Which type of loop are you working with?",
      suggestions: ['Show me a for loop example', 'When should I use while?', 'How do nested loops work?']
    };
  }

  if (/function|def|return|parameter|argument/.test(lower)) {
    return {
      reply: "Functions package reusable logic. Define one with `def my_function(input):`, do work inside, and `return` a result. Functions help you avoid repeating code and make programs easier to test. Think of them as named recipes.",
      suggestions: ['Show a function example', 'What are parameters vs arguments?', 'How do I return multiple values?']
    };
  }

  if (/if|else|elif|condition|decide/.test(lower)) {
    return {
      reply: "Conditionals let your program make decisions. The basic structure is:\n\nif condition:\n    do_something\nelif other_condition:\n    do_other\nelse:\n    default_action\n\nThe condition must evaluate to True or False.",
      suggestions: ['Show conditional examples', 'How do comparisons work?', 'What is truthy/falsy?']
    };
  }

  if (/list|array|collection|group/.test(lower)) {
    return {
      reply: "Python lists store ordered collections: `items = [1, 2, 3]`. Access by index: `items[0]`. Lists are mutable — you can add, remove, and change elements. For key-value pairs, use dictionaries: `data = {'name': 'value'}`.",
      suggestions: ['How do I add to a list?', 'List vs dictionary', 'What are list comprehensions?']
    };
  }

  if (/variable|store|assign|name/.test(lower)) {
    return {
      reply: "Variables store data in named containers. In Python: `name = 'PyBe'`, `count = 42`, `prices = [10, 20, 30]`. Python is dynamically typed — you don't need to declare the type. The variable name should describe what it holds.",
      suggestions: ['Naming conventions', 'Mutable vs immutable', 'How scope works']
    };
  }

  if (/error|try|except|debug|wrong/.test(lower)) {
    return {
      reply: "Python handles errors with try/except blocks:\n\ntry:\n    risky_code()\nexcept ValueError as e:\n    handle_error(e)\n\nThis prevents your program from crashing. Always catch specific exceptions and provide helpful error messages.",
      suggestions: ['Common Python errors', 'How to debug code', 'When to use try/except']
    };
  }

  if (/reasoning|think|approach|solve/.test(lower)) {
    const weakest = conceptMastery
      ? Object.entries(conceptMastery).sort((a, b) => a[1].avgPromptScore - b[1].avgPromptScore)[0]
      : null;
    const tip = pythonTips[Math.floor(Math.random() * pythonTips.length)];
    let response = "Good reasoning is the foundation of programming. Start by identifying: (1) what inputs you have, (2) what output you need, and (3) the steps in between. Map each step to a Python concept.";
    if (weakest) {
      response += `\n\nBased on your progress, you might benefit from practicing "${weakest[0]}" more. Your average score is ${weakest[1].avgPromptScore}.`;
    }
    response += `\n\nQuick tip: ${tip}`;
    return { reply: response, suggestions: ['Explain my last session', 'Show weak concepts', 'Give me a practice tip'] };
  }

  if (/concept|master|learn|practic/.test(lower)) {
    if (conceptMastery && Object.keys(conceptMastery).length > 0) {
      const mastered = Object.entries(conceptMastery).filter(([, s]) => s.level === 'mastered');
      const developing = Object.entries(conceptMastery).filter(([, s]) => s.level === 'developing');
      const needsWork = Object.entries(conceptMastery).filter(([, s]) => s.level === 'needs_work');
      let response = "Here's your concept breakdown:\n\n";
      if (mastered.length) response += `Mastered: ${mastered.map(([c]) => c).join(', ')}\n`;
      if (developing.length) response += `Developing: ${developing.map(([c]) => c).join(', ')}\n`;
      if (needsWork.length) response += `Needs work: ${needsWork.map(([c]) => c).join(', ')}\n`;
      response += "\nFocus your practice on the concepts that need work.";
      return { reply: response, suggestions: ['Help with weak concepts', 'Show study plan', 'Quiz me'] };
    }
    return { reply: "You haven't completed any sessions yet. Start with a Beginner scenario to begin building your concept mastery!", suggestions: ['Start a scenario', 'How does PyBe work?', 'Show me the roadmap'] };
  }

  if (/session|history|progress|score/.test(lower)) {
    if (sessions.length > 0) {
      const avg = Math.round(sessions.reduce((s, sess) => s + (sess.promptScore || 0), 0) / sessions.length);
      const best = Math.max(...sessions.map(s => s.promptScore || 0));
      return {
        reply: `You've completed ${sessions.length} session${sessions.length !== 1 ? 's' : ''}. Your average score is ${avg} and your best score is ${best}. ${avg >= 80 ? "Great work — you're performing well!" : "Keep practicing to improve your scores."}`,
        suggestions: ['Show my weak areas', 'Recommend next scenario', 'Give me feedback']
      };
    }
    return { reply: "You haven't completed any sessions yet. Pick a scenario and start reasoning through it!", suggestions: ['Start a scenario', 'How does the AI work?', 'Show the roadmap'] };
  }

  const tip = pythonTips[Math.floor(Math.random() * pythonTips.length)];
  return {
    reply: `That's a great question! Here's a Python tip to help you: ${tip}\n\nIf you have a specific question about a concept or scenario, try asking about loops, functions, conditionals, lists, variables, or error handling.`,
    suggestions: ['Explain loops', 'How do functions work?', 'Show my progress']
  };
}

router.post('/', async (req, res, next) => {
  try {
    const { message, sessionId } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

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

    const response = generateResponse(message, sessions, conceptMastery);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;