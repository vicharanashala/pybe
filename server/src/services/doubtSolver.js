const syntaxRules = [
  {
    test: (code) => {
      const opens = (code.match(/\(/g) || []).length;
      const closes = (code.match(/\)/g) || []).length;
      return opens !== closes;
    },
    error: 'Mismatched parentheses',
    explanation: 'You have an unequal number of opening "(" and closing ")" parentheses. Every opening parenthesis must have a matching closing one.',
    hint: 'Count your opening and closing parentheses carefully. Each "(" needs exactly one ")".',
    corrected: (code) => code,
    concepts: ['parentheses', 'syntax basics']
  },
  {
    test: (code) => {
      const opens = (code.match(/\[/g) || []).length;
      const closes = (code.match(/\]/g) || []).length;
      return opens !== closes;
    },
    error: 'Mismatched square brackets',
    explanation: 'You have an unequal number of opening "[" and closing "]" brackets. These are used for lists and indexing.',
    hint: 'Check that every "[" has a matching "]". Python lists and index access require balanced brackets.',
    corrected: (code) => code,
    concepts: ['lists', 'indexing']
  },
  {
    test: (code) => {
      const opens = (code.match(/\{/g) || []).length;
      const closes = (code.match(/\}/g) || []).length;
      return opens !== closes;
    },
    error: 'Mismatched curly braces',
    explanation: 'You have an unequal number of opening "{" and closing "}" braces. These are used for dictionaries and sets.',
    hint: 'Check that every "{" has a matching "}". Dictionary definitions need balanced braces.',
    corrected: (code) => code,
    concepts: ['dictionaries', 'sets']
  },
  {
    test: (code) => /def\s+\w+\s*\([^)]*$/.test(code.trim().split('\n').pop()),
    error: 'Unclosed function definition',
    explanation: 'A function definition appears to be missing its closing parenthesis. The parameter list must be enclosed in parentheses.',
    hint: 'After "def function_name(", make sure you close with ")" before the colon ":".',
    corrected: (code) => code,
    concepts: ['functions', 'def syntax']
  },
  {
    test: (code) => {
      const lines = code.split('\n');
      return lines.some((line) => {
        const trimmed = line.trim();
        return /^(if|elif|else|for|while|def|class|try|except|finally|with)\b/.test(trimmed) && !trimmed.endsWith(':') && !trimmed.endsWith('\\\\');
      });
    },
    error: 'Missing colon after compound statement',
    explanation: 'Statements like if, for, while, def, class, try, and with must end with a colon (:). This tells Python that an indented block follows.',
    hint: 'Add a ":" at the end of your if/for/while/def line. For example: "if x > 5:"',
    corrected: (code) => code,
    concepts: ['compound statements', 'colons']
  },
  {
    test: (code) => /['"][^'"]*$/.test(code.trim().split('\n').pop()) && !code.trim().split('\n').pop().includes('#'),
    error: 'Unclosed string literal',
    explanation: 'A string appears to be missing its closing quote. Strings in Python must start and end with the same type of quote.',
    hint: 'Check that every string has both an opening and closing quote (either " or \' or """).',
    corrected: (code) => code,
    concepts: ['strings', 'quotes']
  }
];

const logicalRules = [
  {
    test: (code) => /while\s+True\s*:/.test(code) && !/break/.test(code),
    error: 'Infinite loop detected',
    explanation: 'You have a "while True" loop without a "break" statement. This loop will run forever and never stop on its own.',
    hint: 'Add a "break" statement inside the loop with a condition, or change "while True" to a condition that eventually becomes False.',
    corrected: (code) => code.replace(/while\s+True\s*:/g, 'while condition:  # Replace "condition" with something that becomes False'),
    concepts: ['while loops', 'break', 'loop control']
  },
  {
    test: (code) => {
      const assigns = code.match(/(\w+)\s*=/g) || [];
      const vars = assigns.map((a) => a.replace(/\s*=\s*/, ''));
      const uses = code.match(/\b[a-zA-Z_]\w*\b/g) || [];
      const defs = new Set(['print', 'len', 'range', 'int', 'str', 'float', 'list', 'dict', 'set', 'input', 'type', 'True', 'False', 'None', 'append', 'join', 'split', 'strip', 'lower', 'upper', 'replace', 'sorted', 'sum', 'min', 'max', 'abs', 'round', 'open', 'enumerate', 'zip', 'map', 'filter', 'isinstance', 'hasattr', 'getattr', 'return', 'def', 'if', 'else', 'elif', 'for', 'while', 'in', 'not', 'and', 'or', 'class', 'import', 'from', 'as', 'try', 'except', 'finally', 'raise', 'with', 'yield', 'lambda', 'pass', 'break', 'continue', 'del', 'global', 'nonlocal', 'assert']);
      return vars.some((v) => !defs.has(v) && code.includes(v) && code.indexOf(v) === code.lastIndexOf(v));
    },
    error: 'Possible use of undefined variable',
    explanation: 'You may be using a variable before giving it a value. Python needs to know what a variable holds before you can use it.',
    hint: 'Make sure you assign a value to a variable (like "x = 10") before you try to use it.',
    corrected: (code) => code,
    concepts: ['variables', 'assignment']
  },
  {
    test: (code) => /=[^=]/.test(code) && /==/.test(code) && /=[^=]/.test(code.split('==')[0]),
    error: 'Assignment instead of comparison',
    explanation: 'Inside a condition (like if or while), you probably meant to compare values with "==" not assign them with "=".',
    hint: 'Use "==" (double equals) to compare values. Use "=" (single equals) only for assigning values to variables.',
    corrected: (code) => code,
    concepts: ['comparisons', 'if statements']
  },
  {
    test: (code) => /print\s+[^(]/.test(code),
    error: 'Missing parentheses in print',
    explanation: 'In Python 3, print is a function and needs parentheses: print("hello"), not print "hello".',
    hint: 'Change your print statement to use parentheses. For example: print("Hello World")',
    corrected: (code) => code.replace(/print\s+(['"][^'"]*['"]|\w+)/g, 'print($1)'),
    concepts: ['print function', 'Python 3 syntax']
  },
  {
    test: (code) => {
      const lines = code.split('\n');
      return lines.some((line) => /^\s*def\s+\w+\s*\([^)]*\)\s*:/.test(line)) &&
             lines.some((line) => /^\s{1,3}(return|print|if|for|while)\b/.test(line));
    },
    error: 'Indentation error in function body',
    explanation: 'Python uses indentation to group code into blocks. Function bodies must be indented consistently (usually 4 spaces).',
    hint: 'Make sure all code inside a function is indented by the same amount (4 spaces is standard).',
    corrected: (code) => code,
    concepts: ['indentation', 'function bodies']
  },
  {
    test: (code) => /\bfor\s+(\w+)\s+in\s+(\w+)\s*:/.test(code) && !/range/.test(code) && /\bprint\s*\(\s*\w+\s*\+\s*\d/.test(code),
    error: 'Type mismatch in loop',
    explanation: 'You are trying to add a number to something that might be a string. You may need to convert types using int() or str().',
    hint: 'Use str() to convert a number to text, or int() to convert text to a number.',
    corrected: (code) => code,
    concepts: ['type conversion', 'strings and numbers']
  }
];

const concepts = [
  { keyword: 'for ', name: 'For Loops', description: 'Learn how to iterate over sequences using for loops.' },
  { keyword: 'while ', name: 'While Loops', description: 'Understand conditional repetition with while loops.' },
  { keyword: 'if ', name: 'Conditionals', description: 'Master if/elif/else to make decisions in code.' },
  { keyword: 'def ', name: 'Functions', description: 'Learn to create reusable blocks of code with functions.' },
  { keyword: 'list', name: 'Lists', description: 'Work with ordered collections of items.' },
  { keyword: 'dict', name: 'Dictionaries', description: 'Store and retrieve data using key-value pairs.' },
  { keyword: 'print(', name: 'Output', description: 'Display results and debug with the print function.' },
  { keyword: 'input(', name: 'User Input', description: 'Get information from users with the input function.' },
  { keyword: '=', name: 'Variables', description: 'Store and manage data using variable names.' },
  { keyword: 'class ', name: 'Classes', description: 'Explore object-oriented programming with classes.' },
  { keyword: 'import ', name: 'Modules', description: 'Use external code and libraries through imports.' },
  { keyword: 'try:', name: 'Error Handling', description: 'Handle errors gracefully with try/except blocks.' }
];

function analyzeCode(code, question = '') {
  const errors = [];

  for (const rule of syntaxRules) {
    if (rule.test(code)) {
      errors.push({
        type: 'syntax',
        error: rule.error,
        explanation: rule.explanation,
        hint: rule.hint,
        correctedCode: rule.corrected(code),
        concepts: rule.concepts
      });
      break;
    }
  }

  if (errors.length === 0) {
    for (const rule of logicalRules) {
      if (rule.test(code)) {
        errors.push({
          type: 'logical',
          error: rule.error,
          explanation: rule.explanation,
          hint: rule.hint,
          correctedCode: rule.corrected(code),
          concepts: rule.concepts
        });
        break;
      }
    }
  }

  if (errors.length === 0) {
    const trimmed = code.trim();
    if (!trimmed) {
      errors.push({
        type: 'empty',
        error: 'No code provided',
        explanation: 'The code area is empty. Paste or type some Python code so I can analyze it.',
        hint: 'Write some Python code in the text area above, then click "Explain My Error" again.',
        correctedCode: '',
        concepts: []
      });
    } else {
      errors.push({
        type: 'none',
        error: 'No errors detected',
        explanation: 'Your code looks syntactically correct! No obvious errors were found. If something is not working as expected, try adding a print() statement to check variable values.',
        hint: 'If the code runs but gives wrong results, check your logic: Are you using the right comparison operator? Is your loop terminating? Are your variables defined before use?',
        correctedCode: code,
        concepts: []
      });
    }
  }

  const detectedConcepts = [];
  for (const concept of concepts) {
    if (code.toLowerCase().includes(concept.keyword.toLowerCase())) {
      detectedConcepts.push(concept);
    }
  }

  if (question.trim()) {
    const qLower = question.toLowerCase();
    if (qLower.includes('loop') && !detectedConcepts.find((c) => c.name === 'For Loops')) {
      detectedConcepts.push({ keyword: 'loop', name: 'Loops', description: 'Learn about for and while loops for iteration.' });
    }
    if (qLower.includes('function') && !detectedConcepts.find((c) => c.name === 'Functions')) {
      detectedConcepts.push({ keyword: 'function', name: 'Functions', description: 'Create reusable code blocks with functions.' });
    }
    if (qLower.includes('error') || qLower.includes('wrong')) {
      detectedConcepts.push({ keyword: 'debug', name: 'Debugging', description: 'Learn techniques to find and fix bugs in your code.' });
    }
  }

  const result = errors[0];
  return {
    errorFound: result.error,
    errorType: result.type,
    simpleExplanation: result.explanation,
    whyItHappened: result.type === 'syntax'
      ? 'Syntax errors occur when the code does not follow Python\'s rules. Python cannot understand the code and will stop running.'
      : result.type === 'logical'
        ? 'Logical errors happen when the code runs but does something unintended. Python does not report these, so you need to read the code carefully.'
        : 'Review your code for any issues.',
    hint: result.hint,
    correctedCode: result.correctedCode,
    learnMore: detectedConcepts.slice(0, 4).map((c) => ({ name: c.name, description: c.description })),
    originalCode: code,
    question
  };
}

module.exports = { analyzeCode };
