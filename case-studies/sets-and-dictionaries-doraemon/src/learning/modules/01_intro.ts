import type { Module } from '../types';

export const introModule: Module = {
  id: 'intro',
  title: 'Introduction to Python',
  description: 'Discover why Python is the world\'s most popular language and write your very first lines of code.',
  difficulty: 'Beginner',
  estimatedMinutes: 10,
  lessons: [
    {
      id: 'what-is-python',
      title: 'Getting Started',
      description: 'Understand the core concepts of Python and run your first print statement.',
      steps: [
        {
          id: 'intro-theory',
          title: 'The Python Philosophy',
          type: 'theory',
          content: `Python is a high-level, interactive, and interpreted language designed with one main goal in mind: **readability**. 

Unlike other languages that use brackets \`{}\` or semicolons \`;\`, Python uses **indentation** (whitespace) to structure code and plain English keywords.

### The Power of \`print()\`
In Python, displaying information to the screen is incredibly simple. We use the built-in \`print()\` function:

\`\`\`python
print("Welcome to Python!")
\`\`\`

Here, \`print\` is the name of the function, and the text inside the parentheses is the **argument** (a string of text) that we want to display.`,
          codeSnippet: `print("Welcome to Python!")`
        },
        {
          id: 'intro-quiz',
          title: 'Test Your Knowledge',
          type: 'quiz',
          question: 'Which of the following functions is used to output text in Python?',
          options: [
            'log("Hello")',
            'print("Hello")',
            'echo "Hello"',
            'System.out.print("Hello")'
          ],
          correctOptionIndex: 1,
          explanation: 'In Python, print() is the built-in function used to write text or values to the standard output.'
        },
        {
          id: 'intro-code',
          title: 'Say Hello to PyBe',
          type: 'code',
          instructions: `Now it's your turn. Write a program that outputs the message **"Hello, PyBe!"** to the console. 

Ensure the casing and punctuation are exact!`,
          starterCode: `# Write your code below to print "Hello, PyBe!"
`,
          hints: [
            'Use the print() function with a string argument: print("...")',
            'Ensure "Hello, PyBe!" has a capital H, capital P, capital B, and ends with an exclamation mark.'
          ],
          verificationTests: [
            {
              description: 'Check stdout output',
              expectedStdout: 'Hello, PyBe!'
            }
          ]
        }
      ]
    }
  ]
};
