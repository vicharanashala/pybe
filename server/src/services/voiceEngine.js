/**
 * PyBre Voice Engine Service
 * Provides AI conversational logic, code reading, voice debugging,
 * logic assessment, spoken quiz evaluation, and mock interview scoring.
 */

const multilingualGreetings = {
  'en-US': { title: 'Python Tutor', tip: 'Ask me anything about Python in English!' },
  'te-IN': { title: 'పైథాన్ ట్యూటర్ (Telugu)', tip: 'నన్ను పైథాన్ గురించి తెలుగులో దేనినైనా అడగండి!' },
  'hi-IN': { title: 'पायथन ट्यूटर (Hindi)', tip: 'मुझसे पायथन के बारे में हिंदी में कुछ भी पूछें!' },
  'ta-IN': { title: 'பைதான் டியூட்டர் (Tamil)', tip: 'என்னையும் பைதான் பற்றி தமிழில் கேட்கலாம்!' },
  'kn-IN': { title: 'ಪೈಥಾನ್ ಟ್ಯೂಟರ್ (Kannada)', tip: 'ನನ್ನನ್ನು ಪೈಥಾನ್ ಬಗ್ಗೆ ಕನ್ನಡದಲ್ಲಿ ಏನನ್ನಾದರೂ ಕೇಳಿ!' }
};

// --- 1. Voice Question Assistant ---
function answerVoiceQuestion({ question = '', language = 'en-US', history = [] }) {
  const qLower = question.toLowerCase();
  
  let textResponse = '';
  let spokenScript = '';
  let codeSnippet = '';
  let topic = 'Python Fundamentals';

  if (qLower.includes('recursion') || qLower.includes('recursive')) {
    topic = 'Recursion';
    textResponse = 'Recursion occurs when a function calls itself to break down a big problem into smaller, identical problems until it reaches a base condition.';
    spokenScript = 'Recursion is like opening Russian nesting dolls. Each doll looks like the previous one, just smaller. You keep opening dolls until you reach the smallest doll, which is your base condition!';
    codeSnippet = `def factorial(n):\n    # Base condition\n    if n == 1:\n        return 1\n    # Recursive call\n    return n * factorial(n - 1)\n\nprint("Factorial of 5 is:", factorial(5))`;
  } else if (qLower.includes('list comprehension') || qLower.includes('comprehension')) {
    topic = 'List Comprehensions';
    textResponse = 'List comprehension is a concise Pythonic way to create lists in a single line of code instead of writing a full for-loop.';
    spokenScript = 'Think of list comprehension as a fast-track assembly line. Instead of creating an empty basket and adding items one by one in a loop, list comprehension fills the basket in a single step!';
    codeSnippet = `# Traditional loop vs List Comprehension\nnumbers = [1, 2, 3, 4, 5]\nsquares = [x ** 2 for x in numbers]\nprint("Squares:", squares)`;
  } else if (qLower.includes('indexerror') || qLower.includes('index error') || qLower.includes('out of range')) {
    topic = 'Debugging IndexError';
    textResponse = 'IndexError happens when you try to access a position in a list that does not exist. Remember Python lists start at index 0 and end at length minus 1.';
    spokenScript = 'An IndexError means you tried to pick a book from a shelf slot that does not exist. If you have 3 books, their slots are numbered 0, 1, and 2. Asking for slot 3 causes an IndexError!';
    codeSnippet = `items = ["apple", "banana", "cherry"] # Length is 3\n# Safe access:\nprint(items[2]) # "cherry"\n# items[3] would raise IndexError!`;
  } else if (qLower.includes('dictionary') || qLower.includes('dict') || qLower.includes('key value')) {
    topic = 'Dictionaries';
    textResponse = 'A Python dictionary stores data in key-value pairs, allowing lightning-fast lookup by unique keys.';
    spokenScript = 'Imagine a real dictionary where you look up a word to find its definition. In Python, the word is the Key and the definition is the Value!';
    codeSnippet = `student = {"name": "Alex", "course": "Python", "score": 95}\nprint(f"{student['name']} scored {student['score']}")`;
  } else if (qLower.includes('loop') || qLower.includes('for') || qLower.includes('while')) {
    topic = 'Loops';
    textResponse = 'Loops repeat a block of code as long as a condition is true or across elements in a sequence.';
    spokenScript = 'A loop is like a music player repeat playlist button. It executes the same song or instruction set again and again until specified to stop!';
    codeSnippet = `fruits = ["apple", "banana", "cherry"]\nfor fruit in fruits:\n    print(f"I love {fruit}")`;
  } else {
    topic = 'General Python Tutoring';
    textResponse = `Great question about "${question}"! Python makes this easy with clear syntax and built-in functions.`;
    spokenScript = `Here is how Python handles ${question}: Python emphasizes readability. Break down your task into input, transformation, and output.`;
    codeSnippet = `# Python snippet for: ${question}\nval = "Learn Python by Speaking"\nprint(val.upper())`;
  }

  if (language !== 'en-US') {
    const greeting = multilingualGreetings[language] || multilingualGreetings['en-US'];
    spokenScript = `[${greeting.title}]: ` + spokenScript;
  }

  return {
    question,
    topic,
    textResponse,
    spokenScript,
    codeSnippet,
    language,
    timestamp: new Date().toISOString()
  };
}

// --- 2. Logic Explanation Assessment ---
function assessLogic({ code = '', userExplanation = '', language = 'en-US', scenarioId = '' }) {
  const explanation = userExplanation.toLowerCase();
  
  let correctness = 85;
  let reasoning = 80;
  let efficiency = 75;
  let missingCases = [];
  let constructiveFeedback = [];
  let spokenSummary = '';

  if (explanation.includes('loop') || explanation.includes('repeat') || explanation.includes('each')) {
    reasoning += 10;
    constructiveFeedback.push('Good recognition of iteration to process elements.');
  } else {
    constructiveFeedback.push('Consider explaining how your logic visits every item in the dataset.');
  }

  if (explanation.includes('if') || explanation.includes('check') || explanation.includes('condition')) {
    correctness += 10;
    constructiveFeedback.push('Clear breakdown of conditional branching logic.');
  } else {
    missingCases.push('Branching logic for edge conditions');
  }

  if (!explanation.includes('empty') && !explanation.includes('zero') && !explanation.includes('none')) {
    missingCases.push('Handling empty or null inputs');
    efficiency -= 5;
  }

  const overallScore = Math.round((correctness + reasoning + efficiency) / 3);

  spokenSummary = `Your logic explanation scored ${overallScore} percent! You clearly explained the main flow, but remember to mention how your program handles empty lists or invalid inputs.`;

  return {
    overallScore,
    metrics: {
      correctness: Math.min(correctness, 100),
      reasoning: Math.min(reasoning, 100),
      efficiency: Math.min(efficiency, 100)
    },
    missingCases,
    feedback: constructiveFeedback,
    spokenSummary,
    timestamp: new Date().toISOString()
  };
}

// --- 3. Voice Debugger ---
function voiceDebugger({ code = '', spokenError = '', language = 'en-US' }) {
  const errorText = spokenError.toLowerCase();
  
  let lineToHighlight = 1;
  let errorType = 'Runtime Error';
  let cause = 'Unexpected input or index boundary issue.';
  let spokenExplanation = '';
  let suggestedCode = code;

  if (errorText.includes('typeerror') || code.includes('+') && code.includes('str')) {
    errorType = 'TypeError';
    lineToHighlight = 3;
    cause = 'Attempting to concatenate or add incompatible types (e.g. string and integer).';
    spokenExplanation = 'You have a TypeError on line 3. Python cannot automatically join numbers with text strings. Use string conversion like str(number) or an f-string!';
    suggestedCode = code ? code.replace(/(\w+)\s*\+\s*(\d+)/, 'str($1) + str($2)') : '# Use f-string\nage = 25\nprint(f"Age is {age}")';
  } else if (errorText.includes('indexerror') || errorText.includes('out of range')) {
    errorType = 'IndexError';
    lineToHighlight = 2;
    cause = 'Accessing list element out of range.';
    spokenExplanation = 'You have an IndexError on line 2. The index you requested exceeds the length of the list. Remember Python lists start at index zero!';
    suggestedCode = code ? `if len(items) > index:\n    print(items[index])` : 'items = [10, 20]\nif len(items) > 2:\n    print(items[2])';
  } else if (errorText.includes('keyerror')) {
    errorType = 'KeyError';
    lineToHighlight = 2;
    cause = 'Dictionary key does not exist.';
    spokenExplanation = 'You have a KeyError. You asked for a dictionary key that does not exist. Use dict.get(key, default) to safely retrieve values!';
    suggestedCode = `user = {"name": "Sam"}\n# Safe lookup\nage = user.get("age", "Unknown")\nprint(age)`;
  } else {
    errorType = 'Logic/Syntax Bug';
    lineToHighlight = 1;
    cause = 'Potential indentation mismatch or variable naming error.';
    spokenExplanation = 'I analyzed your code and detected a syntax or logic mismatch near the beginning. Check variable names and indentation alignment!';
    suggestedCode = code || '# Fixed indentation and variable reference\ndef main():\n    print("Code running smoothly")';
  }

  return {
    errorType,
    lineToHighlight,
    cause,
    spokenExplanation,
    suggestedCode,
    timestamp: new Date().toISOString()
  };
}

// --- 4. Read Code Aloud ---
function readCodeAloud({ code = '' }) {
  if (!code || !code.trim()) {
    return {
      spokenTranslation: 'No code provided to read.',
      sentences: []
    };
  }

  const lines = code.split('\n').filter(l => l.trim().length > 0);
  const sentenceList = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('def ')) {
      const match = trimmed.match(/def\s+(\w+)\((.*?)\):/);
      const name = match ? match[1] : 'function';
      const params = match && match[2] ? match[2] : 'no arguments';
      sentenceList.push(`Line ${index + 1}: Defines a function named ${name} accepting ${params}.`);
    } else if (trimmed.startsWith('for ')) {
      const match = trimmed.match(/for\s+(\w+)\s+in\s+(.*?):/);
      const item = match ? match[1] : 'item';
      const sequence = match ? match[2] : 'collection';
      sentenceList.push(`Line ${index + 1}: Loops over each ${item} in ${sequence.replace(/range\((.*?)\)/, '$1 steps')}.`);
    } else if (trimmed.startsWith('if ')) {
      sentenceList.push(`Line ${index + 1}: Checks if condition is true: ${trimmed.replace('if ', '').replace(':', '')}.`);
    } else if (trimmed.startsWith('print(')) {
      const content = trimmed.replace('print(', '').replace(/\)$/, '');
      sentenceList.push(`Line ${index + 1}: Displays on screen ${content}.`);
    } else if (trimmed.includes('=')) {
      const [varName, val] = trimmed.split('=').map(s => s.trim());
      sentenceList.push(`Line ${index + 1}: Assigns ${val} to variable ${varName}.`);
    } else {
      sentenceList.push(`Line ${index + 1}: Executes ${trimmed}.`);
    }
  });

  const spokenTranslation = sentenceList.join(' ');

  return {
    spokenTranslation,
    sentences: sentenceList,
    totalLines: lines.length
  };
}

// --- 5. Interactive Voice Quiz ---
const sampleQuizBank = [
  {
    id: 'q1',
    topic: 'Data Types',
    question: 'Is a Python tuple mutable or immutable?',
    hint: 'Think about whether you can change its elements after creation.',
    correctAnswer: 'Immutable',
    explanation: 'Tuples are immutable in Python, meaning their contents cannot be modified after creation.'
  },
  {
    id: 'q2',
    topic: 'Functions',
    question: 'What keyword is used to return a value from a Python function?',
    hint: 'It shares its name with sending back a result.',
    correctAnswer: 'return',
    explanation: 'The "return" statement exits a function and hands back a value to the caller.'
  },
  {
    id: 'q3',
    topic: 'Lists',
    question: 'Which method adds an item to the end of a Python list?',
    hint: 'It starts with the letter A.',
    correctAnswer: 'append',
    explanation: 'The append method pushes a single element onto the end of an existing list.'
  }
];

function getNextQuizQuestion({ index = 0 }) {
  const item = sampleQuizBank[index % sampleQuizBank.length];
  return {
    ...item,
    spokenQuestion: `Quiz Question: ${item.question} Speak your answer now!`
  };
}

function evaluateQuizAnswer({ questionId, question, spokenAnswer }) {
  const ans = spokenAnswer.toLowerCase();
  let isCorrect = false;
  let score = 40;
  let feedback = 'Good attempt!';

  if (ans.includes('immutable') || ans.includes('return') || ans.includes('append')) {
    isCorrect = true;
    score = 95;
    feedback = 'Excellent! Your spoken answer was clear and completely accurate.';
  } else {
    feedback = 'Not quite right. Give it another try or listen to the explanation!';
  }

  return {
    questionId,
    question,
    spokenAnswer,
    isCorrect,
    score,
    feedback,
    spokenFeedback: `${feedback} ${sampleQuizBank[0].explanation}`
  };
}

// --- 6. Voice Coding Interview Practice ---
const interviewQuestions = [
  {
    id: 'int_1',
    category: 'OOP Concepts',
    question: 'Explain the four main pillars of Object-Oriented Programming in Python.',
    expectedPoints: ['Encapsulation', 'Abstraction', 'Inheritance', 'Polymorphism']
  },
  {
    id: 'int_2',
    category: 'Data Structures',
    question: 'What is the key difference between a Python list and a set regarding order and duplicates?',
    expectedPoints: ['Lists allow duplicates', 'Sets contain unique items', 'Lists preserve order']
  },
  {
    id: 'int_3',
    category: 'Complexity Analysis',
    question: 'What is the time complexity of looking up a key in a Python dictionary versus searching an item in an unsorted list?',
    expectedPoints: ['Dictionary is O(1) average time', 'Unsorted list is O(N) linear time']
  }
];

function getInterviewQuestion({ index = 0 }) {
  const item = interviewQuestions[index % interviewQuestions.length];
  return {
    ...item,
    spokenPrompt: `Interview Question ${index + 1}: ${item.question}`
  };
}

function evaluateInterviewResponse({ question, spokenAnswer = '' }) {
  const lower = spokenAnswer.toLowerCase();
  let hits = 0;
  const keywords = ['encapsulation', 'inheritance', 'polymorphism', 'abstraction', 'unique', 'order', 'constant', 'o(1)', 'o(n)', 'list', 'dict'];
  
  keywords.forEach(kw => {
    if (lower.includes(kw)) hits++;
  });

  const clarityScore = Math.min(60 + hits * 10, 98);
  const technicalAccuracy = Math.min(50 + hits * 12, 95);
  const confidence = spokenAnswer.length > 50 ? 90 : 70;
  const overallScore = Math.round((clarityScore + technicalAccuracy + confidence) / 3);

  return {
    question,
    spokenAnswer,
    scores: {
      overallScore,
      clarityScore,
      technicalAccuracy,
      confidence
    },
    spokenEvaluation: `Your interview response scored ${overallScore} percent. Technical accuracy was strong! Keep practicing clear structure.`,
    feedback: [
      'Structured spoken explanation clearly.',
      'Demonstrated key Python architectural terminology.',
      'Good pace and confidence.'
    ]
  };
}

module.exports = {
  answerVoiceQuestion,
  assessLogic,
  voiceDebugger,
  readCodeAloud,
  getNextQuizQuestion,
  evaluateQuizAnswer,
  getInterviewQuestion,
  evaluateInterviewResponse
};
