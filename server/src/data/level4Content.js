module.exports = {
  id: 'level-4',
  title: 'Conditional Statements',
  description: 'Learn how to make decisions in your code using if, elif, and else statements.',
  scenarioQuery: '?concept=conditionals',
  theory: [
    { title: 'Decision Making', content: 'In real life, we make decisions based on conditions (e.g., if it rains, take an umbrella). Programming uses conditional statements to do the same.' },
    { title: 'The if statement', content: 'An `if` statement runs a block of code ONLY if a specified condition evaluates to True.' },
    { title: 'The else statement', content: 'An `else` statement catches anything which isn\'t caught by the preceding conditions.' },
    { title: 'The elif statement', content: 'Short for "else if". It allows you to check multiple conditions sequentially.' },
    { title: 'Indentation', content: 'Python relies on indentation (whitespace at the beginning of a line) to define scope in the code. Code inside an `if` block must be indented.' },
    { title: 'Nested Conditions', content: 'You can have `if` statements inside `if` statements. This is called nesting.' },
    { title: 'Logical Conditions', content: 'You can combine conditions using `and`, `or`, and `not` within your `if` statements to evaluate multiple things at once.' }
  ],
  syntax: `
temperature = 25

if temperature > 30:
    print("It is a hot day.")
elif temperature > 20:
    print("It is a nice day.")
else:
    print("It is cold.")
  `,
  examples: [
    {
      title: 'Basic if/else',
      code: 'age = 18\nif age >= 18:\n    print("Eligible to vote")\nelse:\n    print("Not eligible")',
      explanation: 'Checks if age is 18 or older. If so, prints eligible. Otherwise, prints not eligible.'
    },
    {
      title: 'Multiple Conditions',
      code: 'score = 85\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelse:\n    print("C")',
      explanation: 'Checks conditions one by one. The first True condition executes its block, and skips the rest.'
    }
  ],
  guidedPractice: [
    {
      id: 'gp-4-1',
      title: 'Simple if',
      question: 'Write an `if` statement that prints "Positive" if `x` is greater than 0.',
      concept: 'if statement',
      difficulty: 'Beginner',
      expectedApproach: 'Use `if x > 0:` followed by an indented print statement.',
      solution: 'if x > 0:\n    print("Positive")',
      explanation: 'Don\'t forget the colon at the end of the `if` line and the indentation on the next line.'
    },
    {
      id: 'gp-4-2',
      title: 'Adding else',
      question: 'Extend the previous code: print "Non-positive" if `x` is not greater than 0.',
      concept: 'else statement',
      difficulty: 'Beginner',
      expectedApproach: 'Add an `else:` block aligned with the `if`.',
      solution: 'if x > 0:\n    print("Positive")\nelse:\n    print("Non-positive")',
      explanation: 'The `else` block executes when the `if` condition is False.'
    },
    {
      id: 'gp-4-3',
      title: 'Checking exact values',
      question: 'If `status` equals "Active", print "Welcome".',
      concept: 'Equality condition',
      difficulty: 'Beginner',
      expectedApproach: 'Use the `==` operator inside the `if` statement.',
      solution: 'if status == "Active":\n    print("Welcome")',
      explanation: 'Remember to use `==` for comparison, not `=` (which is for assignment).'
    },
    {
      id: 'gp-4-4',
      title: 'Using elif',
      question: 'Write code that prints "Zero" if `x == 0`, otherwise if `x > 0` prints "Positive".',
      concept: 'elif statement',
      difficulty: 'Beginner',
      expectedApproach: 'Start with `if x == 0:`, then use `elif x > 0:`.',
      solution: 'if x == 0:\n    print("Zero")\nelif x > 0:\n    print("Positive")',
      explanation: '`elif` allows you to check a new condition if the first one failed.'
    },
    {
      id: 'gp-4-5',
      title: 'Logical combined condition',
      question: 'Print "Valid" if `age` is greater than 10 AND less than 20.',
      concept: 'Logical conditions',
      difficulty: 'Beginner',
      expectedApproach: 'Combine two comparisons with the `and` operator.',
      solution: 'if age > 10 and age < 20:\n    print("Valid")',
      explanation: 'Both sides of the `and` must be True for the block to execute.'
    }
  ],
  interviewQuestions: [
    {
      question: 'What happens if you forget to indent code inside an if statement?',
      answer: 'Python will raise an IndentationError and the program will crash.',
      explanation: 'Unlike other languages that use curly braces {}, Python strictly enforces indentation to define code blocks.'
    },
    {
      question: 'Can you have an `else` statement without an `if`?',
      answer: 'No, an `else` statement must be preceded by an `if` (or `elif`) statement in the same block.',
      explanation: 'The `else` acts as a default fallback for the preceding condition.'
    },
    {
      question: 'What is the difference between multiple `if` statements and `if-elif` blocks?',
      answer: 'Multiple `if` statements evaluate independently (all of them might execute if all conditions are true). An `if-elif` block evaluates sequentially, and stops evaluating as soon as it finds the FIRST true condition.',
      explanation: 'Crucial for logic flow. Use elif when conditions are mutually exclusive.'
    },
    {
      question: 'How do you write an empty `if` block without getting an error?',
      answer: 'You can use the `pass` keyword. `if condition: pass`',
      explanation: '`pass` is a null operation; nothing happens when it executes, but it satisfies the requirement for an indented block.'
    },
    {
      question: 'What is a ternary operator in Python?',
      answer: 'It is a one-line conditional expression. Syntax: `x = value_if_true if condition else value_if_false`.',
      explanation: 'Ternary operators make code more concise for simple variable assignments based on a condition.'
    }
  ],
  mcqs: [
    {
      id: 'mcq-4-1',
      question: 'Which keyword is used to check alternative conditions if the initial condition is False?',
      options: ['else if', 'elseif', 'elif', 'then'],
      correctAnswer: 2,
      explanation: 'Python uses `elif` as shorthand for else-if.'
    },
    {
      id: 'mcq-4-2',
      question: 'What is required at the end of an `if` condition line?',
      options: ['Semicolon (;)', 'Colon (:)', 'Period (.)', 'Nothing'],
      correctAnswer: 1,
      explanation: 'Python requires a colon (:) to start an indented code block.'
    },
    {
      id: 'mcq-4-3',
      question: 'If x = 10, which block executes?\nif x > 5: print("A")\nelif x == 10: print("B")',
      options: ['Only A', 'Only B', 'Both A and B', 'Neither'],
      correctAnswer: 0,
      explanation: 'The first condition (x > 5) is True, so it executes and skips the elif block entirely.'
    },
    {
      id: 'mcq-4-4',
      question: 'How does Python identify that a block of code belongs to an if statement?',
      options: ['Curly braces {}', 'Parentheses ()', 'Indentation', 'The end keyword'],
      correctAnswer: 2,
      explanation: 'Python relies purely on consistent indentation.'
    },
    {
      id: 'mcq-4-5',
      question: 'Which operator is used to reverse a boolean condition?',
      options: ['!', 'not', 'invert', 'reverse'],
      correctAnswer: 1,
      explanation: 'Python uses the English word `not`. Example: `if not True:`'
    }
  ],
  codingQuestions: [
    {
      id: 'coding-4-1',
      problem: 'Write a program that checks if `temperature` is greater than 30. If so, print "Hot", otherwise print "Normal".',
      concept: 'if-else',
      sampleInput: 'temperature = 35',
      sampleOutput: 'Hot',
      explanation: 'Use an if-else block.',
      starterCode: 'temperature = 35\n# Write your if-else logic here\n'
    },
    {
      id: 'coding-4-2',
      problem: 'Check the variable `role`. If it is "admin", print "Full Access". If it is "user", print "Limited Access". Otherwise, print "No Access".',
      concept: 'if-elif-else',
      sampleInput: 'role = "guest"',
      sampleOutput: 'No Access',
      explanation: 'You need three branches: if, elif, and else.',
      starterCode: 'role = "guest"\n# Write your logic here\n'
    }
  ],
  assessment: {
    mcqs: [
      {
        id: 'test-mcq-4-1',
        question: 'What character ends an `if` statement line in Python?',
        options: [';', ':', '.', '{'],
        correctAnswer: 1
      },
      {
        id: 'test-mcq-4-2',
        question: 'Which of the following is correct Python syntax?',
        options: [
          'if x > 5 { print("Yes") }',
          'if (x > 5) then print("Yes")',
          'if x > 5:\n    print("Yes")',
          'if x > 5 print("Yes")'
        ],
        correctAnswer: 2
      },
      {
        id: 'test-mcq-4-3',
        question: 'What is the purpose of the `elif` statement?',
        options: ['To end an if block', 'To provide a default action', 'To check a new condition if the previous was False', 'To loop through conditions'],
        correctAnswer: 2
      },
      {
        id: 'test-mcq-4-4',
        question: 'Can you have multiple `elif` statements after a single `if`?',
        options: ['Yes', 'No', 'Only two', 'Only if there is no else'],
        correctAnswer: 0
      },
      {
        id: 'test-mcq-4-5',
        question: 'What keyword can you use to execute no operation inside an if block (to avoid an IndentationError)?',
        options: ['break', 'continue', 'pass', 'null'],
        correctAnswer: 2
      }
    ],
    coding: [
      {
        id: 'test-coding-4-1',
        problem: 'Create a variable `marks` equal to 75. If marks are 50 or above, print "Pass", else print "Fail".',
        starterCode: ''
      },
      {
        id: 'test-coding-4-2',
        problem: 'Create an if-elif block for `weather = "rain"`. If "sun", print "Hat". If "rain", print "Umbrella".',
        starterCode: ''
      }
    ]
  }
};
