module.exports = {
  id: 'level-2',
  title: 'Variables & Data Types',
  description: 'Understand how Python stores and manipulates different types of data like numbers and text.',
  scenarioQuery: '?concept=variables',
  theory: [
    { title: 'Variables', content: 'Variables act as containers for storing data values. In Python, you do not need to declare a variable before assigning a value to it.' },
    { title: 'Variable Naming Rules', content: 'Names must start with a letter or underscore, cannot contain spaces, and cannot be reserved keywords. They are case-sensitive.' },
    { title: 'Integers (int)', content: 'Whole numbers, positive or negative, without decimals (e.g., 5, -10, 1000).' },
    { title: 'Floating point numbers (float)', content: 'Numbers containing one or more decimals (e.g., 3.14, -0.001).' },
    { title: 'Strings (str)', content: 'Text data enclosed in single or double quotes (e.g., "Hello", \'World\').' },
    { title: 'Booleans (bool)', content: 'Represents one of two values: True or False.' },
    { title: 'The type() Function', content: 'You can check the data type of a variable using the built-in type() function.' },
    { title: 'Type Conversion', content: 'You can convert between types using functions like int(), float(), and str().' },
    { title: 'Mutable vs Immutable', content: 'Immutable objects (like int, str, float, bool) cannot be changed after they are created. If you assign a new value, a new object is created.' }
  ],
  syntax: `
# Variable Assignment
age = 25          # int
price = 19.99     # float
name = "Alice"    # str
is_student = True # bool

# Type checking
print(type(age))  # <class 'int'>

# Type conversion
price_int = int(price)
print(price_int)  # 19
  `,
  examples: [
    {
      title: 'Valid and Invalid Variable Names',
      code: 'user_name = "John"\n# 1user = "Invalid" (Starts with a number)',
      explanation: 'Follow naming conventions to avoid syntax errors.'
    },
    {
      title: 'Converting a string to an integer',
      code: 'age_str = "30"\nage_int = int(age_str)\nprint(type(age_int))',
      explanation: 'Sometimes data comes as a string (like from an input) and needs to be converted to a number for math.'
    }
  ],
  guidedPractice: [
    {
      id: 'gp-2-1',
      title: 'Assigning a Boolean',
      question: 'How do you create a variable `is_active` and set it to true?',
      concept: 'bool',
      difficulty: 'Beginner',
      expectedApproach: 'Assign the Python keyword True to the variable.',
      solution: 'is_active = True',
      explanation: 'In Python, boolean values are True and False (capitalized).'
    },
    {
      id: 'gp-2-2',
      title: 'Checking Types',
      question: 'How do you print the type of the variable `price`?',
      concept: 'type()',
      difficulty: 'Beginner',
      expectedApproach: 'Wrap the variable in type() and then print().',
      solution: 'print(type(price))',
      explanation: 'type() returns the class of the variable, which is then printed to the console.'
    },
    {
      id: 'gp-2-3',
      title: 'String Conversion',
      question: 'Convert the integer variable `count` to a string.',
      concept: 'Type conversion',
      difficulty: 'Beginner',
      expectedApproach: 'Use the str() function.',
      solution: 'count_str = str(count)',
      explanation: 'str() takes an object and returns its string representation.'
    },
    {
      id: 'gp-2-4',
      title: 'Float Assignment',
      question: 'Assign the value of Pi (3.14159) to a variable called `pi`.',
      concept: 'float',
      difficulty: 'Beginner',
      expectedApproach: 'Simply use the = operator with the decimal number.',
      solution: 'pi = 3.14159',
      explanation: 'Python automatically infers this is a float because of the decimal point.'
    },
    {
      id: 'gp-2-5',
      title: 'Naming Variables',
      question: 'Why is `my-variable = 10` invalid in Python?',
      concept: 'Naming rules',
      difficulty: 'Beginner',
      expectedApproach: 'Identify the invalid character.',
      solution: '# Hyphens are not allowed',
      explanation: 'Hyphens are treated as the subtraction operator. Use underscores (my_variable) instead.'
    }
  ],
  interviewQuestions: [
    {
      question: 'What is the difference between mutable and immutable data types?',
      answer: 'Mutable types can be changed after creation (like lists), while immutable types (like int, float, string, bool) cannot be altered. Reassigning an immutable variable creates a new object in memory.',
      explanation: 'This is a fundamental concept for understanding how memory works in Python.'
    },
    {
      question: 'How does Python handle memory for small integers?',
      answer: 'Python caches small integers (typically from -5 to 256) so they point to the same object in memory to optimize performance.',
      explanation: 'An advanced detail that shows deep knowledge of the Python interpreter.'
    },
    {
      question: 'Can a variable change its type in Python?',
      answer: 'Yes, because Python is dynamically typed. A variable can hold an integer, and later be reassigned to hold a string.',
      explanation: 'Dynamic typing provides flexibility but requires developers to be careful about unexpected type changes.'
    },
    {
      question: 'What happens when you run `int("hello")`?',
      answer: 'It raises a ValueError because the string "hello" cannot be parsed as a base-10 integer.',
      explanation: 'Type casting only works if the string contains a valid representation of the target type.'
    },
    {
      question: 'What is the boolean evaluation of an empty string ""?',
      answer: 'An empty string evaluates to False. Non-empty strings evaluate to True.',
      explanation: 'This concept (truthy and falsy values) is crucial for writing clean conditional statements.'
    }
  ],
  mcqs: [
    {
      id: 'mcq-2-1',
      question: 'Which of the following is an invalid variable name?',
      options: ['user_age', '_name', '1st_place', 'is_valid'],
      correctAnswer: 2,
      explanation: 'Variable names cannot start with a number.'
    },
    {
      id: 'mcq-2-2',
      question: 'What data type is the value 3.0?',
      options: ['int', 'float', 'str', 'bool'],
      correctAnswer: 1,
      explanation: 'The presence of a decimal point makes it a float, even if the fractional part is zero.'
    },
    {
      id: 'mcq-2-3',
      question: 'What is the output of type("100")?',
      options: ['<class \'int\'>', '<class \'str\'>', '<class \'float\'>', 'Error'],
      correctAnswer: 1,
      explanation: 'Because 100 is enclosed in quotes, it is treated as a string.'
    },
    {
      id: 'mcq-2-4',
      question: 'Which of these is an immutable data type?',
      options: ['List', 'Dictionary', 'Set', 'String'],
      correctAnswer: 3,
      explanation: 'Strings in Python are immutable; you cannot change a character in place.'
    },
    {
      id: 'mcq-2-5',
      question: 'What is the boolean value of False in Python?',
      options: ['false', 'False', '0', 'None'],
      correctAnswer: 1,
      explanation: 'Boolean keywords in Python are capitalized (True, False).'
    }
  ],
  codingQuestions: [
    {
      id: 'coding-2-1',
      problem: 'Create a variable `price` set to 50. Convert it to a float and store it in `price_float`. Print `price_float`.',
      concept: 'Type conversion',
      sampleInput: 'None',
      sampleOutput: '50.0',
      explanation: 'Use the float() function to convert the integer.',
      starterCode: '# Set price\n\n# Convert to float\n\n# Print result\n'
    },
    {
      id: 'coding-2-2',
      problem: 'Check the type of the value True and print it to the console.',
      concept: 'type()',
      sampleInput: 'None',
      sampleOutput: '<class \'bool\'>',
      explanation: 'Use print() and type() together.',
      starterCode: '# Write your code below\n'
    }
  ],
  assessment: {
    mcqs: [
      {
        id: 'test-mcq-2-1',
        question: 'Which of these will convert a string "5" to an integer?',
        options: ['str(5)', 'int("5")', 'float("5")', 'number("5")'],
        correctAnswer: 1
      },
      {
        id: 'test-mcq-2-2',
        question: 'What type is True in Python?',
        options: ['boolean', 'bool', 'TrueType', 'int'],
        correctAnswer: 1
      },
      {
        id: 'test-mcq-2-3',
        question: 'Which variable name is valid?',
        options: ['my variable', 'class', 'my_variable', '2nd_var'],
        correctAnswer: 2
      },
      {
        id: 'test-mcq-2-4',
        question: 'What is the output of print(type(4.5))?',
        options: ['<class \'int\'>', '<class \'float\'>', '<class \'str\'>', '<class \'decimal\'>'],
        correctAnswer: 1
      },
      {
        id: 'test-mcq-2-5',
        question: 'Are strings mutable in Python?',
        options: ['Yes, fully', 'No, they are immutable', 'Only if they contain numbers', 'Yes, using the mutate() method'],
        correctAnswer: 1
      }
    ],
    coding: [
      {
        id: 'test-coding-2-1',
        problem: 'Create an integer variable `x` with value 10, a float `y` with value 3.5, and a string `z` with value "Python".',
        starterCode: ''
      },
      {
        id: 'test-coding-2-2',
        problem: 'Convert the variable x (from above) to a string and print its type.',
        starterCode: ''
      }
    ]
  }
};
