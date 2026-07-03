const QUESTION_BANK = {
  'for / while loops': [
    {
      q: 'What Python construct repeats actions?',
      a: 'A for or while loop',
      opts: ['A for or while loop', 'An if statement', 'A variable assignment', 'A function definition'],
      exp: 'Loops repeat a block of code multiple times — the natural tool when the same action must happen for many items.',
      concept: 'Loops'
    },
    {
      q: 'Which correctly iterates over a list in Python?',
      a: 'for item in my_list:',
      opts: ['for item in my_list:', 'if item in my_list:', 'while item in my_list:', 'def item in my_list:'],
      exp: 'The for loop is the standard Python way to iterate over each element in a sequence.',
      concept: 'Loops'
    },
    {
      q: 'When should you choose a while loop over a for loop?',
      a: "When you don't know the number of iterations",
      opts: ['When you know exactly how many times', "When you don't know the number of iterations", 'When storing a value', 'When comparing two values'],
      exp: 'while loops are for situations where you cannot predict how many repetitions are needed.',
      concept: 'Loops'
    },
    {
      q: 'What causes an infinite loop?',
      a: 'A condition that never becomes false',
      opts: ['A loop with a list', 'A condition that never becomes false', 'A function with a return', 'An if-else block'],
      exp: 'If the condition in a while loop always evaluates to true, the loop never stops.',
      concept: 'Loops'
    },
    {
      q: 'How do you exit a for loop early in Python?',
      a: 'break statement',
      opts: ['break statement', 'exit() function', 'stop keyword', 'return statement'],
      exp: 'break immediately exits the nearest enclosing loop, stopping further iterations.',
      concept: 'Loops'
    },
    {
      q: 'What does the continue statement do in a loop?',
      a: 'Skips to the next iteration',
      opts: ['Skips to the next iteration', 'Exits the loop completely', 'Pauses the loop', 'Restarts the loop'],
      exp: 'continue skips the rest of the current iteration and moves to the next one.',
      concept: 'Loops'
    },
    {
      q: 'What is the range(5) function produce in Python?',
      a: 'A sequence of numbers 0 to 4',
      opts: ['A sequence of numbers 0 to 4', 'A sequence of numbers 1 to 5', 'The number 5', 'A random sequence'],
      exp: 'range(5) generates numbers starting at 0 and stopping before 5: 0, 1, 2, 3, 4.',
      concept: 'Loops'
    }
  ],
  'if / elif / else': [
    {
      q: 'What does an if statement do in Python?',
      a: 'Executes code only when its condition is true',
      opts: ['Executes code only when its condition is true', 'Repeats code multiple times', 'Stores a value in memory', 'Defines a function'],
      exp: 'if is a conditional statement — it runs its block only when the boolean condition passes.',
      concept: 'Conditionals'
    },
    {
      q: 'What is the purpose of the else clause?',
      a: 'Runs when the if condition is false',
      opts: ['Runs before the if check', 'Runs when the if condition is false', 'Defines a loop', 'Stores a variable'],
      exp: 'else provides a fallback path when the if condition fails — a clean way to handle the negative case.',
      concept: 'Conditionals'
    },
    {
      q: 'When should you use elif instead of multiple if statements?',
      a: 'When only one of several conditions should apply',
      opts: ['When all conditions are independent', 'When only one of several conditions should apply', 'When you need a loop', 'When storing multiple values'],
      exp: 'elif chains stop at the first true condition, unlike separate ifs which all evaluate independently.',
      concept: 'Conditionals'
    },
    {
      q: 'What happens if none of the if/elif conditions are true?',
      a: 'The else block runs (if present)',
      opts: ['The program crashes', 'The else block runs (if present)', 'Python ignores the entire statement', 'The first if runs again'],
      exp: 'else acts as a catch-all when none of the conditions match — preventing silent failures.',
      concept: 'Conditionals'
    },
    {
      q: 'What does elif mean in Python?',
      a: '"else if" — checks another condition',
      opts: ['"else if" — checks another condition', '"except" — catches errors', '"end" — terminates the block', '"also" — runs additional code'],
      exp: 'elif is short for "else if" — it checks another condition when the previous if/elif was false.',
      concept: 'Conditionals'
    }
  ],
  'lists and dictionaries': [
    {
      q: 'What is a Python list?',
      a: 'An ordered collection of items',
      opts: ['A single value', 'An ordered collection of items', 'A type of loop', 'A conditional check'],
      exp: 'Lists are Python\'s way of storing multiple values in a single variable, in a specific order.',
      concept: 'Lists'
    },
    {
      q: 'How do you access the first element of a list?',
      a: 'my_list[0]',
      opts: ['my_list[0]', 'my_list[1]', 'my_list.first', 'my_list(0)'],
      exp: 'Python uses zero-based indexing — the first item is at position 0, not 1.',
      concept: 'Lists'
    },
    {
      q: 'What is a dictionary used for?',
      a: 'Storing key-value pairs',
      opts: ['Repeating actions', 'Storing key-value pairs', 'Making decisions', 'Creating loops'],
      exp: 'Dictionaries map unique keys to values, enabling fast lookups by name rather than position.',
      concept: 'Dictionaries'
    },
    {
      q: 'What does dict["name"] return?',
      a: 'The value associated with key "name"',
      opts: ['The key "name" itself', 'The value associated with key "name"', 'A boolean', 'An error always'],
      exp: 'Square bracket notation retrieves the value for that key — fast and direct.',
      concept: 'Dictionaries'
    },
    {
      q: 'How do you add an item to a Python list?',
      a: 'my_list.append(item)',
      opts: ['my_list.append(item)', 'my_list.add(item)', 'my_list + item', 'my_list.insertEnd(item)'],
      exp: 'append() adds an item to the end of a list — the most common way to grow a list.',
      concept: 'Lists'
    },
    {
      q: 'What does len(my_list) return?',
      a: 'The number of items in the list',
      opts: ['The number of items in the list', 'The last item', 'A sorted list', 'The list type'],
      exp: 'len() returns the count of items — works on any collection in Python.',
      concept: 'Lists'
    }
  ],
  'variables and arithmetic expressions': [
    {
      q: 'What is a variable in Python?',
      a: 'A named container for a value',
      opts: ['A loop construct', 'A named container for a value', 'A type of function', 'A data type'],
      exp: 'Variables give names to values — this is how you store and reuse data in a program.',
      concept: 'Variables'
    },
    {
      q: 'What does x = 5 + 3 assign to x?',
      a: 'The value 8',
      opts: ['The value 8', 'The text "5 + 3"', 'Nothing — it causes an error', 'A boolean'],
      exp: 'The right side is fully evaluated first (5 + 3 = 8), then that result is stored in x.',
      concept: 'Variables'
    },
    {
      q: 'Which is a valid Python variable name?',
      a: 'student_name',
      opts: ['student-name', '2nd_place', 'student_name', 'class'],
      exp: 'Variable names can contain letters, numbers (not first), and underscores — dashes and starting with numbers are invalid.',
      concept: 'Variables'
    },
    {
      q: 'What is the result of 17 // 5 in Python?',
      a: '3 (integer division)',
      opts: ['3.4', '3 (integer division)', '4', '2'],
      exp: '// is integer division — it divides and discards the decimal part, giving 3.',
      concept: 'Variables'
    },
    {
      q: 'What does the % operator do in Python?',
      a: 'Returns the remainder after division',
      opts: ['Returns the remainder after division', 'Divides two numbers', 'Multiplies two numbers', 'Checks equality'],
      exp: '% (modulo) returns what is left over after division — useful for checking even/odd.',
      concept: 'Variables'
    }
  ],
  'functions': [
    {
      q: 'What does a function do in Python?',
      a: 'Encapsulates reusable logic',
      opts: ['Stores a single value', 'Encapsulates reusable logic', 'Makes decisions', 'Creates loops'],
      exp: 'Functions let you write logic once and call it many times with different inputs.',
      concept: 'Functions'
    },
    {
      q: 'Which keyword defines a function?',
      a: 'def',
      opts: ['def', 'func', 'function', 'define'],
      exp: 'def is the keyword that tells Python you are defining a function.',
      concept: 'Functions'
    },
    {
      q: 'What is the purpose of return in a function?',
      a: 'Sends a value back to the caller',
      opts: ['Repeats the function', 'Sends a value back to the caller', 'Stops the program', 'Stores a global variable'],
      exp: 'return passes a result from inside a function back to the code that called it.',
      concept: 'Functions'
    },
    {
      q: 'What happens if a function has no return statement?',
      a: 'It returns None by default',
      opts: ['It causes an error', 'It returns None by default', 'It returns 0', 'It returns an empty string'],
      exp: 'Functions without an explicit return statement return None, which represents the absence of a value.',
      concept: 'Functions'
    },
    {
      q: 'Can a function call itself in Python?',
      a: 'Yes, this is called recursion',
      opts: ['Yes, this is called recursion', 'No, Python prohibits this', 'Only with special syntax', 'Only in version 3.10+'],
      exp: 'Yes! A function calling itself is recursion — useful for problems that can be broken into smaller versions of themselves.',
      concept: 'Functions'
    }
  ],
  'comparisons and list comprehensions': [
    {
      q: 'What does the expression x > 10 evaluate to?',
      a: 'True or False',
      opts: ['True or False', 'A number', 'A string', 'A list'],
      exp: 'Comparison operators always return a boolean — True or False.',
      concept: 'Comparisons'
    },
    {
      q: 'What is a list comprehension in Python?',
      a: 'A compact way to build a list',
      opts: ['A type of dictionary', 'A compact way to build a list', 'A function call', 'A loop that never ends'],
      exp: 'List comprehensions let you create lists in a single expressive line using brackets.',
      concept: 'List Comprehensions'
    },
    {
      q: 'What does [x for x in range(5)] produce?',
      a: 'A list [0, 1, 2, 3, 4]',
      opts: ['A list [0, 1, 2, 3, 4]', 'A generator object', 'The number 5', 'An error'],
      exp: 'This comprehension loops through range(5) and collects each value, creating [0, 1, 2, 3, 4].',
      concept: 'List Comprehensions'
    },
    {
      q: 'What is the difference between == and is?',
      a: '== compares values, is compares identity',
      opts: ['== compares values, is compares identity', 'They are interchangeable', 'is is faster than ==', '== only works with numbers'],
      exp: '== checks if values are equal. is checks if they are the exact same object in memory.',
      concept: 'Comparisons'
    }
  ],
  'statements and variables': [
    {
      q: 'What is a Python statement?',
      a: 'A complete instruction Python executes',
      opts: ['A type of loop', 'A complete instruction Python executes', 'A variable name', 'A data type'],
      exp: 'Statements are the fundamental units of execution in Python — each one tells Python to do something.',
      concept: 'Statements'
    },
    {
      q: 'Which is a valid Python statement?',
      a: 'print("Hello")',
      opts: ['print(Hello)', 'print("Hello")', 'print Hello', 'print[Hello]'],
      exp: 'print() is a function call — a complete statement that prints output to the console.',
      concept: 'Statements'
    },
    {
      q: 'Can you write multiple statements on one line?',
      a: 'Yes, using semicolons',
      opts: ['Yes, using semicolons', 'No, never', 'Only comments', 'Only in interactive mode'],
      exp: 'Python allows multiple statements on one line separated by semicolons, though this is generally avoided for readability.',
      concept: 'Statements'
    }
  ],
  'strings': [
    {
      q: 'What is a string in Python?',
      a: 'A sequence of characters in quotes',
      opts: ['A number', 'A sequence of characters in quotes', 'A type of loop', 'A condition'],
      exp: 'Strings represent text — sequences of characters wrapped in quotes.',
      concept: 'Strings'
    },
    {
      q: 'How do you get the length of a string?',
      a: 'len(text)',
      opts: ['text.length()', 'len(text)', 'text.size()', 'text.len()'],
      exp: 'len() is Python\'s built-in function for getting the length of any collection, including strings.',
      concept: 'Strings'
    },
    {
      q: 'What does "hello".upper() return?',
      a: '"HELLO"',
      opts: ['"hello"', '"HELLO"', 'Error', '4'],
      exp: 'upper() is a string method that returns a new string with all characters converted to uppercase.',
      concept: 'Strings'
    },
    {
      q: 'Can you concatenate strings with + in Python?',
      a: 'Yes, it joins them together',
      opts: ['Yes, it joins them together', 'No, use concat()', 'Only with integers', 'Only with list()'],
      exp: 'The + operator joins strings end-to-end: "Hello" + "World" produces "HelloWorld".',
      concept: 'Strings'
    }
  ]
};

const CONCEPT_KEYWORDS = {
  'for / while loops': ['loop', 'iterate', 'repeat', 'for', 'while', 'cycle'],
  'if / elif / else': ['if', 'else', 'elif', 'condition', 'branch', 'decision'],
  'lists and dictionaries': ['list', 'dictionary', 'dict', 'array', 'collection', 'key', 'value'],
  'variables and arithmetic expressions': ['variable', 'assign', 'add', 'subtract', 'multiply', 'divide', 'compute'],
  'functions': ['function', 'def', 'return', 'call', 'parameter', 'argument'],
  'comparisons and list comprehensions': ['compare', 'list comprehension', '==', '>', '<', 'filter'],
  'statements and variables': ['statement', 'instruction', 'execute', 'line'],
  'strings': ['string', 'text', 'character', 'quote', 'concatenate']
};

export function findConceptKey(concept) {
  if (!concept) return null;
  const lower = concept.toLowerCase();
  for (const [key, keywords] of Object.entries(CONCEPT_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return key;
    }
  }
  return null;
}

export function getAllConceptKeys() {
  return Object.keys(QUESTION_BANK);
}

export function getQuestionsForConcept(conceptKey) {
  return QUESTION_BANK[conceptKey] || QUESTION_BANK['variables and arithmetic expressions'];
}

export function buildSessionAwareQuestions(session) {
  const questions = [];
  const abstractionMap = session.abstractionMap || [];
  const code = session.generatedCode || '';
  const concept = abstractionMap[0]?.pythonConcept || 'variables';
  const pattern = abstractionMap[0]?.pattern || '';
  const codeLines = code.split('\n').filter(l => l.trim());

  if (abstractionMap.length > 0) {
    questions.push({
      q: `What Python concept did your reasoning primarily use in this scenario?`,
      a: concept,
      opts: generateDistractors(concept, 'concept'),
      exp: `${concept} was identified from your reasoning about "${pattern}". ${abstractionMap[0]?.explanation || 'This is a fundamental Python building block.'}`,
      concept: concept,
      isSessionAware: true
    });
  }

  if (codeLines.length > 0) {
    const firstCodeLine = codeLines.find(l => l.includes('=') || l.includes('def ') || l.includes('for ') || l.includes('if '));
    if (firstCodeLine) {
      const varMatch = firstCodeLine.match(/(\w+)\s*=/);
      if (varMatch) {
        questions.push({
          q: `Which variable in your generated code stores the key value?`,
          a: varMatch[1],
          opts: generateDistractors(varMatch[1], 'variable'),
          exp: `"${varMatch[1]}" is assigned in your code: "${firstCodeLine.trim()}". Variables store values for reuse.`,
          concept: concept,
          isSessionAware: true
        });
      }
    }
  }

  if (session.promptFeedback && session.promptFeedback.length > 0) {
    const feedback = session.promptFeedback[0];
    const feedbackShort = feedback.substring(0, 40);
    questions.push({
      q: `What feedback was given about your AI prompt?`,
      a: feedbackShort,
      opts: generateDistractors(feedbackShort, 'feedback'),
      exp: `Your prompt was evaluated and received this feedback: "${feedback}"`,
      concept: concept,
      isSessionAware: true
    });
  }

  if (session.misconceptions && session.misconceptions.length > 0) {
    const misconception = session.misconceptions[0];
    questions.push({
      q: `What misconception was flagged in your reasoning?`,
      a: misconception,
      opts: generateDistractors(misconception, 'misconception'),
      exp: `This misconception: "${misconception}" was detected. Understanding this will help you write better reasoning.`,
      concept: concept,
      isSessionAware: true
    });
  }

  if (codeLines.length > 1) {
    const printLine = codeLines.find(l => l.includes('print'));
    if (printLine) {
      const varInPrint = printLine.match(/print\s*\(\s*(\w+)/);
      if (varInPrint) {
        questions.push({
          q: `What variable was used in the print output?`,
          a: varInPrint[1],
          opts: generateDistractors(varInPrint[1], 'variable'),
          exp: `The print statement outputs: "${printLine.trim()}". Using a variable in print displays its stored value.`,
          concept: concept,
          isSessionAware: true
        });
      }
    }
  }

  if (pattern) {
    questions.push({
      q: `Which thinking pattern describes your approach?`,
      a: pattern,
      opts: generateDistractors(pattern, 'pattern'),
      exp: `Your reasoning followed the "${pattern}" pattern, which maps to ${concept} in Python.`,
      concept: concept,
      isSessionAware: true
    });
  }

  return questions;
}

function generateDistractors(correct, type) {
  const allConcepts = ['variables', 'loops', 'conditionals', 'functions', 'lists', 'dictionaries', 'strings', 'comparisons'];
  const allPatterns = ['Repetition', 'Decision making', 'Collection handling', 'Computation', 'Reusable procedure', 'Selection and filtering', 'Sequential thinking'];
  const allMisconceptions = [
    'Assuming loops can only count numbers',
    'Using the wrong comparison operator',
    'Forgetting to initialize variables',
    'Confusing = and ==',
    'Not accounting for edge cases'
  ];

  let distractors = [];
  switch (type) {
    case 'concept':
      distractors = allConcepts.filter(c => c.toLowerCase() !== correct.toLowerCase());
      break;
    case 'variable':
      distractors = ['x', 'temp', 'value', 'data', 'item', 'result'].filter(v => v !== correct);
      break;
    case 'pattern':
      distractors = allPatterns.filter(p => p !== correct);
      break;
    case 'misconception':
      distractors = allMisconceptions.filter(m => m !== correct);
      break;
    case 'feedback':
      distractors = [
        'Strong context and clear structure',
        'Needs more specific examples',
        'Consider adding step-by-step breakdown',
        'Good use of Python terminology'
      ];
      break;
    default:
      distractors = ['Option A', 'Option B', 'Option C'];
  }

  const shuffled = shuffleArray(distractors);
  return [correct, ...shuffled.slice(0, 3)];
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}