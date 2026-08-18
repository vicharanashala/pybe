module.exports = {
  id: 'level-3',
  title: 'Operators & Expressions',
  description: 'Perform calculations, compare values, and build complex logic using operators.',
  scenarioQuery: '?concept=arithmetic',
  theory: [
    { title: 'Operators', content: 'Operators are special symbols used to perform operations on variables and values.' },
    { title: 'Arithmetic Operators', content: 'Used for common math: + (addition), - (subtraction), * (multiplication), / (division), // (floor division), % (modulus), ** (exponentiation).' },
    { title: 'Assignment Operators', content: 'Used to assign values to variables: = (assign), += (add and assign), -=, *=, /=, etc.' },
    { title: 'Comparison Operators', content: 'Used to compare two values, returning a boolean: == (equal), != (not equal), > (greater), < (less), >=, <=.' },
    { title: 'Logical Operators', content: 'Combine conditional statements: and (returns True if both are true), or (returns True if one is true), not (reverses the result).' },
    { title: 'Membership Operators', content: 'Test if a sequence is presented in an object: in, not in.' },
    { title: 'Identity Operators', content: 'Compare the memory location of two objects: is, is not.' },
    { title: 'Expressions', content: 'A combination of values, variables, and operators that evaluate to a single value.' },
    { title: 'Operator Precedence', content: 'Rules determining the order in which operators are evaluated (e.g., multiplication before addition). Use parentheses () to force order.' }
  ],
  syntax: `
# Arithmetic
x = 10 + 5
y = x * 2

# Comparison
is_equal = (x == y)

# Logical
result = (x > 10) and (y < 50)

# Assignment
x += 5 # Equivalent to x = x + 5
  `,
  examples: [
    {
      title: 'Calculating total price',
      code: 'price = 100\ntax = 0.1 * price\ntotal = price + tax\nprint(total)',
      explanation: 'Expressions calculate the tax and then sum it up for the total.'
    },
    {
      title: 'Using Logical Operators',
      code: 'age = 20\nhas_ticket = True\ncan_enter = (age >= 18) and has_ticket\nprint(can_enter)',
      explanation: 'The logical "and" ensures both conditions are met to evaluate to True.'
    }
  ],
  guidedPractice: [
    {
      id: 'gp-3-1',
      title: 'Modulo Operator',
      question: 'How do you find the remainder of 10 divided by 3?',
      concept: 'Arithmetic',
      difficulty: 'Beginner',
      expectedApproach: 'Use the modulus operator (%).',
      solution: 'remainder = 10 % 3',
      explanation: 'The % operator returns the remainder of a division.'
    },
    {
      id: 'gp-3-2',
      title: 'Floor Division',
      question: 'How do you divide 10 by 3 but only get the whole integer part (3)?',
      concept: 'Arithmetic',
      difficulty: 'Beginner',
      expectedApproach: 'Use the floor division operator (//).',
      solution: 'result = 10 // 3',
      explanation: '// performs division and rounds down to the nearest integer.'
    },
    {
      id: 'gp-3-3',
      title: 'Compound Assignment',
      question: 'How do you cleanly add 5 to the existing variable `score`?',
      concept: 'Assignment',
      difficulty: 'Beginner',
      expectedApproach: 'Use the += operator.',
      solution: 'score += 5',
      explanation: 'This is a shorthand for score = score + 5.'
    },
    {
      id: 'gp-3-4',
      title: 'Checking Equality',
      question: 'Write an expression to check if `a` is equal to `b`.',
      concept: 'Comparison',
      difficulty: 'Beginner',
      expectedApproach: 'Use the double equals (==).',
      solution: 'a == b',
      explanation: 'Single = assigns a value, double == compares values.'
    },
    {
      id: 'gp-3-5',
      title: 'Membership Test',
      question: 'Check if the string "apple" is in the string "apple pie".',
      concept: 'Membership',
      difficulty: 'Beginner',
      expectedApproach: 'Use the `in` operator.',
      solution: '"apple" in "apple pie"',
      explanation: 'The `in` operator returns True if the left operand is found in the right sequence.'
    }
  ],
  interviewQuestions: [
    {
      question: 'What is the difference between == and is?',
      answer: '== checks for value equality (if the values are the same), while `is` checks for object identity (if they point to the exact same object in memory).',
      explanation: 'This tests knowledge of Python memory management.'
    },
    {
      question: 'What is operator precedence?',
      answer: 'It determines the order in which operators are evaluated in an expression. For example, multiplication happens before addition.',
      explanation: 'Always use parentheses to make complex mathematical expressions clear.'
    },
    {
      question: 'How does the `or` operator short-circuit?',
      answer: 'If the first condition in an `or` statement is True, Python does not evaluate the second condition, because the overall result is already guaranteed to be True.',
      explanation: 'Short-circuiting improves performance and prevents errors (like division by zero if placed in the second condition).'
    },
    {
      question: 'What does the // operator do?',
      answer: 'It performs floor division, which divides two numbers and rounds the result down to the nearest integer.',
      explanation: 'Useful when you need integer results without decimal remainders.'
    },
    {
      question: 'Can you use arithmetic operators on strings?',
      answer: 'Yes! + concatenates (joins) two strings, and * repeats a string a given number of times.',
      explanation: 'Operator overloading allows Python operators to work differently depending on the data types.'
    }
  ],
  mcqs: [
    {
      id: 'mcq-3-1',
      question: 'What does 10 % 3 evaluate to?',
      options: ['3', '1', '3.33', '0'],
      correctAnswer: 1,
      explanation: '10 divided by 3 is 9, with a remainder of 1.'
    },
    {
      id: 'mcq-3-2',
      question: 'Which operator checks if two values are equal?',
      options: ['=', '==', '===', '!='],
      correctAnswer: 1,
      explanation: '== checks for equality in Python.'
    },
    {
      id: 'mcq-3-3',
      question: 'What is the output of True and False?',
      options: ['True', 'False', 'None', 'Error'],
      correctAnswer: 1,
      explanation: 'For `and` to return True, BOTH sides must be True.'
    },
    {
      id: 'mcq-3-4',
      question: 'Which has higher precedence in Python?',
      options: ['Addition (+)', 'Multiplication (*)', 'They are equal', 'Subtraction (-)'],
      correctAnswer: 1,
      explanation: 'Standard mathematical order of operations (PEMDAS/BODMAS) applies.'
    },
    {
      id: 'mcq-3-5',
      question: 'What will "a" in "banana" evaluate to?',
      options: ['True', 'False', '1', 'Error'],
      correctAnswer: 0,
      explanation: 'The letter "a" is present in the string "banana".'
    }
  ],
  codingQuestions: [
    {
      id: 'coding-3-1',
      problem: 'Write an expression to calculate the area of a rectangle with `length = 10` and `width = 5`. Print the result.',
      concept: 'Arithmetic',
      sampleInput: 'None',
      sampleOutput: '50',
      explanation: 'Area is length multiplied by width.',
      starterCode: 'length = 10\nwidth = 5\n# Calculate and print area\n'
    },
    {
      id: 'coding-3-2',
      problem: 'Check if `age` (set to 25) is greater than or equal to 18 AND less than 30. Print the boolean result.',
      concept: 'Logical & Comparison',
      sampleInput: 'None',
      sampleOutput: 'True',
      explanation: 'Combine comparison operators with the logical `and`.',
      starterCode: 'age = 25\n# Print the result of the condition\n'
    }
  ],
  assessment: {
    mcqs: [
      {
        id: 'test-mcq-3-1',
        question: 'Which operator is used to calculate the remainder of division?',
        options: ['/', '//', '%', '*'],
        correctAnswer: 2
      },
      {
        id: 'test-mcq-3-2',
        question: 'What is the result of 2 ** 3?',
        options: ['5', '6', '8', '9'],
        correctAnswer: 2
      },
      {
        id: 'test-mcq-3-3',
        question: 'What does the != operator mean?',
        options: ['Equal to', 'Not equal to', 'Greater than', 'Assign value'],
        correctAnswer: 1
      },
      {
        id: 'test-mcq-3-4',
        question: 'If x = True and y = False, what is x or y?',
        options: ['True', 'False', 'None', 'Error'],
        correctAnswer: 0
      },
      {
        id: 'test-mcq-3-5',
        question: 'What does the `is` operator check?',
        options: ['Value equality', 'Object identity (memory location)', 'Type identity', 'Mathematical equivalence'],
        correctAnswer: 1
      }
    ],
    coding: [
      {
        id: 'test-coding-3-1',
        problem: 'Create a variable `total` that adds 15 and 30, then divides the result by 5. Print `total`.',
        starterCode: ''
      },
      {
        id: 'test-coding-3-2',
        problem: 'Check if the word "cat" is NOT in the string "The dog barks". Print the result.',
        starterCode: ''
      }
    ]
  }
};
