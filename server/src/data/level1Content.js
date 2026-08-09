module.exports = {
  id: 'level-1',
  title: 'Introduction to Python',
  description: 'Learn the fundamentals of Python, what it is, and how to write your first program.',
  scenarioQuery: '?difficulty=Beginner',
  theory: [
    { title: 'What is Python?', content: 'Python is a high-level, interpreted programming language known for its simplicity and readability.' },
    { title: 'Why Python?', content: 'It has a massive ecosystem, is great for beginners, and is used everywhere from web development to AI.' },
    { title: 'Key Features', content: 'Readable syntax, dynamically typed, interpreted, large standard library.' },
    { title: 'Common Use Cases', content: 'Data Science, Machine Learning, Web Backend, Scripting, Automation.' },
    { title: 'Python Interpreter', content: 'Python code is executed line by line by a program called the Python Interpreter.' },
    { title: 'First Python Program', content: 'Traditionally, the first program is printing "Hello, World!" to the screen.' },
    { title: 'print()', content: 'The print() function outputs text or variables to the console.' },
    { title: 'Comments', content: 'Comments start with # and are ignored by the interpreter. They help explain code.' },
    { title: 'Basic Syntax', content: 'Python relies on indentation (spaces) rather than brackets to define blocks of code.' }
  ],
  syntax: `
# This is a comment
print("Hello, Python!")

name = "Student"
age = 20

print(name)
print(age)
  `,
  examples: [
    {
      title: 'Printing text',
      code: 'print("Welcome to PyBe!")',
      explanation: 'This sends the text inside the quotes to the output.'
    },
    {
      title: 'Basic Variables',
      code: 'score = 100\\nprint(score)',
      explanation: 'Variables store data. Here we store 100 in the variable "score".'
    }
  ],
  guidedPractice: [
    {
      id: 'gp-1',
      title: 'Your First Output',
      question: 'How do you output the word "Success" in Python?',
      concept: 'Output',
      difficulty: 'Beginner',
      expectedApproach: 'Use the print function with a string.',
      solution: 'print("Success")',
      explanation: 'print() is a built-in function that writes the given string to the standard output.'
    },
    {
      id: 'gp-2',
      title: 'Storing a Name',
      question: 'How do you store the name "Alice" in a variable called user_name?',
      concept: 'Variables',
      difficulty: 'Beginner',
      expectedApproach: 'Use the assignment operator (=).',
      solution: 'user_name = "Alice"',
      explanation: 'Variables are created the moment you first assign a value to them using =.'
    },
    {
      id: 'gp-3',
      title: 'Adding a Comment',
      question: 'Write a single-line comment saying "Configuration here".',
      concept: 'Comments',
      difficulty: 'Beginner',
      expectedApproach: 'Start the line with a hash symbol (#).',
      solution: '# Configuration here',
      explanation: 'Any text following a # on a single line is treated as a comment and ignored by Python.'
    },
    {
      id: 'gp-4',
      title: 'Multiple Prints',
      question: 'How do you print "One" and then print "Two" on the next line?',
      concept: 'Output',
      difficulty: 'Beginner',
      expectedApproach: 'Call the print function twice on separate lines.',
      solution: 'print("One")\\nprint("Two")',
      explanation: 'Each print() call automatically adds a newline at the end.'
    },
    {
      id: 'gp-5',
      title: 'Fixing the Syntax',
      question: 'What is wrong with this code? Print("Hello")',
      concept: 'Syntax',
      difficulty: 'Beginner',
      expectedApproach: 'Recognize that Python is case-sensitive.',
      solution: 'print("Hello")',
      explanation: 'The built-in function is lowercase print(), not Print().'
    }
  ],
  interviewQuestions: [
    {
      question: 'Is Python a compiled or interpreted language?',
      answer: 'Python is generally considered an interpreted language, although it compiles source code to bytecode behind the scenes before interpreting it.',
      explanation: 'Understanding the execution model is a common beginner interview question.'
    },
    {
      question: 'What does dynamically typed mean?',
      answer: 'It means you don\'t have to declare the type of a variable when you create one. The type is determined at runtime.',
      explanation: 'Unlike C or Java, Python determines types automatically based on the assigned value.'
    },
    {
      question: 'How does Python define code blocks?',
      answer: 'Python uses indentation (whitespace) to define code blocks, instead of curly braces {} used in many other languages.',
      explanation: 'Consistent indentation is mandatory in Python and makes the code very readable.'
    },
    {
      question: 'What is the purpose of comments?',
      answer: 'Comments are used to explain code, make it more readable, and prevent execution of specific lines during testing.',
      explanation: 'Good code is self-documenting, but comments clarify intent.'
    },
    {
      question: 'What is PEP 8?',
      answer: 'PEP 8 is the official style guide for Python code, providing conventions for writing readable and consistent code.',
      explanation: 'Interviewers often ask this to check if you follow standard community practices.'
    }
  ],
  mcqs: [
    {
      id: 'mcq-1',
      question: 'Which of the following is the correct extension for a Python file?',
      options: ['.pt', '.pyt', '.py', '.python'],
      correctAnswer: 2,
      explanation: 'Python files always use the .py extension.'
    },
    {
      id: 'mcq-2',
      question: 'How do you output "Hello World" in Python?',
      options: ['echo "Hello World"', 'System.out.println("Hello World")', 'print("Hello World")', 'console.log("Hello World")'],
      correctAnswer: 2,
      explanation: 'print() is the built-in function for output in Python.'
    },
    {
      id: 'mcq-3',
      question: 'Which character is used to create a comment in Python?',
      options: ['//', '#', '<!--', '/*'],
      correctAnswer: 1,
      explanation: 'The hash (#) symbol is used for single-line comments in Python.'
    },
    {
      id: 'mcq-4',
      question: 'Python is a _____ typed language.',
      options: ['statically', 'dynamically', 'strongly', 'weakly'],
      correctAnswer: 1,
      explanation: 'Python determines types at runtime, making it dynamically typed.'
    },
    {
      id: 'mcq-5',
      question: 'Which of the following is a valid variable name in Python?',
      options: ['1_name', 'my-name', 'user_name', 'class'],
      correctAnswer: 2,
      explanation: 'Variables cannot start with a number, cannot contain hyphens, and cannot be reserved keywords (like class).'
    }
  ],
  codingQuestions: [
    {
      id: 'coding-1',
      problem: 'Write a program that prints exactly: Python is awesome!',
      concept: 'Output',
      sampleInput: 'None',
      sampleOutput: 'Python is awesome!',
      explanation: 'You just need to use the print function with the exact string.',
      starterCode: '# Write your code below\n'
    },
    {
      id: 'coding-2',
      problem: 'Create a variable named `greeting`, assign the value "Welcome" to it, and print the variable.',
      concept: 'Variables',
      sampleInput: 'None',
      sampleOutput: 'Welcome',
      explanation: 'Combine variable assignment with the print function.',
      starterCode: '# Create the variable\n\n# Print the variable\n'
    }
  ],
  assessment: {
    mcqs: [
      {
        id: 'test-mcq-1',
        question: 'What is the output of: print(5)',
        options: ['"5"', '5', 'An error', 'Nothing'],
        correctAnswer: 1
      },
      {
        id: 'test-mcq-2',
        question: 'Which of these is NOT a reason to use Python?',
        options: ['Readability', 'Large ecosystem', 'Complex syntax', 'Great for beginners'],
        correctAnswer: 2
      },
      {
        id: 'test-mcq-3',
        question: 'How do you add a comment in Python?',
        options: ['// Comment', '/* Comment */', '# Comment', '-- Comment'],
        correctAnswer: 2
      },
      {
        id: 'test-mcq-4',
        question: 'What is used to define blocks of code in Python?',
        options: ['Curly braces {}', 'Parentheses ()', 'Indentation', 'Square brackets []'],
        correctAnswer: 2
      },
      {
        id: 'test-mcq-5',
        question: 'Which is correct syntax to output text?',
        options: ['print("Hi")', 'print "Hi"', 'echo "Hi"', 'printf("Hi")'],
        correctAnswer: 0
      }
    ],
    coding: [
      {
        id: 'test-coding-1',
        problem: 'Print the string: "Level 1 Complete"',
        starterCode: ''
      },
      {
        id: 'test-coding-2',
        problem: 'Create a variable `points` equal to 100, and print it.',
        starterCode: ''
      }
    ]
  }
};
