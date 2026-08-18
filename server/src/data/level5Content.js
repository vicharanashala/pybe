module.exports = {
  id: 'level-5',
  title: 'Loops',
  description: 'Automate repetitive tasks by running blocks of code multiple times using for and while loops.',
  scenarioQuery: '?concept=loops',
  theory: [
    { title: 'Why Loops?', content: 'Programming is about automating tasks. If you need to print something 100 times, you don\'t write 100 print statements. You use a loop.' },
    { title: 'The `while` loop', content: 'A while loop repeatedly executes a block of code as long as a given condition is True.' },
    { title: 'The `for` loop', content: 'A for loop is used to iterate over a sequence (like a string, list, or a range of numbers).' },
    { title: 'The `range()` function', content: 'Often used with for loops, `range()` generates a sequence of numbers. `range(5)` generates 0, 1, 2, 3, 4.' },
    { title: 'The `break` statement', content: 'Used to exit a loop entirely, even if the loop condition is still true or the sequence isn\'t finished.' },
    { title: 'The `continue` statement', content: 'Used to skip the rest of the current iteration and jump straight to the next iteration of the loop.' },
    { title: 'Nested Loops', content: 'You can place a loop inside another loop. The "inner loop" will be executed one time for each iteration of the "outer loop".' }
  ],
  syntax: `
# While loop
count = 0
while count < 3:
    print(count)
    count += 1

# For loop with range
for i in range(3):
    print("Loop iteration", i)

# Using break
for num in range(10):
    if num == 5:
        break
    print(num)
  `,
  examples: [
    {
      title: 'Iterating through a string',
      code: 'for char in "Python":\n    print(char)',
      explanation: 'Strings are sequences in Python, so you can loop through them character by character.'
    },
    {
      title: 'A simple while loop',
      code: 'fuel = 3\nwhile fuel > 0:\n    print("Driving...")\n    fuel -= 1\nprint("Out of fuel!")',
      explanation: 'The loop continues until fuel hits 0.'
    }
  ],
  guidedPractice: [
    {
      id: 'gp-5-1',
      title: 'Basic For Loop',
      question: 'Write a loop that prints numbers from 0 to 4 using range().',
      concept: 'for loop & range',
      difficulty: 'Beginner',
      expectedApproach: 'Use `for i in range(5):`.',
      solution: 'for i in range(5):\n    print(i)',
      explanation: 'range(5) goes from 0 up to, but not including, 5.'
    },
    {
      id: 'gp-5-2',
      title: 'Infinite Loop Danger',
      question: 'What is missing in this code? `x = 0; while x < 5: print(x)`',
      concept: 'while loop',
      difficulty: 'Beginner',
      expectedApproach: 'Identify that the loop counter is never updated.',
      solution: 'x += 1 # Inside the loop',
      explanation: 'If the condition never becomes False, the loop runs forever and crashes the program.'
    },
    {
      id: 'gp-5-3',
      title: 'Using Break',
      question: 'Stop a loop instantly if the variable `found` is True.',
      concept: 'break statement',
      difficulty: 'Beginner',
      expectedApproach: 'Use an if statement checking `found`, then `break`.',
      solution: 'if found == True:\n    break',
      explanation: '`break` immediately exits the innermost loop enclosing it.'
    },
    {
      id: 'gp-5-4',
      title: 'Using Continue',
      question: 'In a loop checking numbers, skip the number 3 and continue to the next number.',
      concept: 'continue statement',
      difficulty: 'Beginner',
      expectedApproach: 'Use an if statement checking for 3, then `continue`.',
      solution: 'if num == 3:\n    continue',
      explanation: '`continue` ignores the remaining code in the current iteration and jumps to the next.'
    },
    {
      id: 'gp-5-5',
      title: 'Looping a string',
      question: 'Loop through the string "ABC" and print each character.',
      concept: 'for loop on sequences',
      difficulty: 'Beginner',
      expectedApproach: 'Use `for letter in "ABC":`.',
      solution: 'for letter in "ABC":\n    print(letter)',
      explanation: 'A string acts as a list of characters, making it easy to iterate over.'
    }
  ],
  interviewQuestions: [
    {
      question: 'When should you use a `for` loop vs a `while` loop?',
      answer: 'Use a `for` loop when you know in advance how many times you want to iterate (like iterating over a list). Use a `while` loop when you want to loop until a specific condition changes.',
      explanation: 'This shows understanding of control flow choice.'
    },
    {
      question: 'What is the difference between `break` and `continue`?',
      answer: '`break` completely exits the loop. `continue` only skips the rest of the current iteration and proceeds to the next iteration.',
      explanation: 'A very common interview question for beginners.'
    },
    {
      question: 'How do you create an infinite loop intentionally?',
      answer: 'By writing `while True:`. You usually pair this with a `break` condition somewhere inside the loop.',
      explanation: 'This pattern is very common for programs that need to constantly listen for input (like a game loop or a server).'
    },
    {
      question: 'Can you have an `else` clause in a `for` or `while` loop?',
      answer: 'Yes! In Python, loops can have an `else` block. It executes only if the loop completed normally (i.e., it was NOT terminated by a `break` statement).',
      explanation: 'This is a unique and somewhat advanced Python feature.'
    },
    {
      question: 'What does `range(1, 10, 2)` do?',
      answer: 'It generates a sequence starting at 1, stopping before 10, stepping by 2 (so: 1, 3, 5, 7, 9).',
      explanation: 'Understanding the start, stop, and step arguments of range() is crucial.'
    }
  ],
  mcqs: [
    {
      id: 'mcq-5-1',
      question: 'Which loop is best when you don\'t know how many times it needs to run, but you know when it should stop?',
      options: ['for loop', 'while loop', 'do-while loop', 'infinite loop'],
      correctAnswer: 1,
      explanation: 'A while loop evaluates a condition each time, making it perfect for dynamic situations.'
    },
    {
      id: 'mcq-5-2',
      question: 'What does `range(3)` generate?',
      options: ['1, 2, 3', '0, 1, 2', '0, 1, 2, 3', '3, 3, 3'],
      correctAnswer: 1,
      explanation: 'range() starts at 0 by default and stops BEFORE the specified number.'
    },
    {
      id: 'mcq-5-3',
      question: 'Which keyword jumps to the next iteration of a loop without finishing the current one?',
      options: ['break', 'continue', 'pass', 'skip'],
      correctAnswer: 1,
      explanation: '`continue` skips the rest of the code block for that specific iteration.'
    },
    {
      id: 'mcq-5-4',
      question: 'What is wrong with this code?\nx = 5\nwhile x > 0:\n    print(x)',
      options: ['Syntax error', 'x should be 0', 'It causes an infinite loop', 'Nothing is wrong'],
      correctAnswer: 2,
      explanation: 'Because x is never decreased inside the loop, x > 0 will always be True.'
    },
    {
      id: 'mcq-5-5',
      question: 'How do you loop through a string "Cat"?',
      options: ['for x in "Cat":', 'while x in "Cat":', 'for i = 0 to 3:', 'loop "Cat":'],
      correctAnswer: 0,
      explanation: 'Python uses the elegant `for var in sequence:` syntax.'
    }
  ],
  codingQuestions: [
    {
      id: 'coding-5-1',
      problem: 'Write a `for` loop that uses `range(5)` to print the numbers 0 through 4.',
      concept: 'for loop',
      sampleInput: 'None',
      sampleOutput: '0\n1\n2\n3\n4',
      explanation: 'Use the standard for-in-range structure.',
      starterCode: '# Write your loop here\n'
    },
    {
      id: 'coding-5-2',
      problem: 'Create a variable `count = 3`. Write a `while` loop that prints `count` and then decreases it by 1, until it is no longer greater than 0.',
      concept: 'while loop',
      sampleInput: 'None',
      sampleOutput: '3\n2\n1',
      explanation: 'Remember to update the variable inside the loop to avoid an infinite loop.',
      starterCode: 'count = 3\n# Write your while loop here\n'
    }
  ],
  assessment: {
    mcqs: [
      {
        id: 'test-mcq-5-1',
        question: 'What keyword entirely stops and exits a loop?',
        options: ['stop', 'exit', 'break', 'continue'],
        correctAnswer: 2
      },
      {
        id: 'test-mcq-5-2',
        question: 'Which is correct syntax for a while loop?',
        options: ['while x > 5:', 'while (x > 5) {', 'while x > 5 then', 'loop while x > 5:'],
        correctAnswer: 0
      },
      {
        id: 'test-mcq-5-3',
        question: 'What will `range(2, 5)` produce?',
        options: ['2, 3, 4, 5', '2, 3, 4', '0, 1, 2, 3, 4', '1, 2, 3, 4'],
        correctAnswer: 1
      },
      {
        id: 'test-mcq-5-4',
        question: 'Can you put a loop inside another loop?',
        options: ['No', 'Yes, it is called a nested loop', 'Only for loops, not while loops', 'Only up to 2 levels deep'],
        correctAnswer: 1
      },
      {
        id: 'test-mcq-5-5',
        question: 'If a `while` loop\'s condition is False from the start, how many times will its block execute?',
        options: ['Once', 'Twice', 'Zero times', 'It will cause an error'],
        correctAnswer: 2
      }
    ],
    coding: [
      {
        id: 'test-coding-5-1',
        problem: 'Use a for loop and range to print "Hello" exactly 3 times.',
        starterCode: ''
      },
      {
        id: 'test-coding-5-2',
        problem: 'Given `x = 10`, write a while loop that decreases x by 2 and prints it, until x is 4.',
        starterCode: ''
      }
    ]
  }
};
