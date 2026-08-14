import type { Module } from '../types';

export const controlFlowModule: Module = {
  id: 'control-flow',
  title: 'Control Flow',
  description: 'Control the direction of your code using conditional checks like if, elif, and else statements.',
  difficulty: 'Beginner',
  estimatedMinutes: 20,
  lessons: [
    {
      id: 'conditionals',
      title: 'Conditionals',
      description: 'Make decisions in your code using conditional branching logic.',
      steps: [
        {
          id: 'conditionals-theory',
          title: 'Conditionals & Indentation',
          type: 'theory',
          content: `In programming, we often need to run code only under certain conditions. Python handles this with \`if\`, \`elif\` (else if), and \`else\` statements.

### Indentation is Syntax!
Unlike most languages that use curly braces \`{}\` to group blocks of code, Python uses **indentation** (usually 4 spaces). 

Every line in the block after the \`if\` statement must be indented by the same amount.

\`\`\`python
temperature = 25

if temperature > 30:
    print("It is hot outside!")
elif temperature > 20:
    print("It is nice outside!")  # This will execute
else:
    print("It is cold outside!")
\`\`\`

### Key Syntax Rules:
1. **The Colon (\`:\`)**: Don't forget the colon at the end of your \`if\`, \`elif\`, or \`else\` lines.
2. **Comparison Operators**: 
   - \`==\` (equal to)
   - \`!=\` (not equal to)
   - \`>\` / \`<\` (greater than / less than)
   - \`>=\` / \`<=\` (greater than or equal to / less than or equal to)`,
          codeSnippet: `grade = 85\nif grade >= 90:\n    print("A")\nelif grade >= 80:\n    print("B")\nelse:\n    print("C")`
        },
        {
          id: 'conditionals-quiz',
          title: 'Indentation Concept Check',
          type: 'quiz',
          question: 'What error will Python raise if your if-statement body is not indented?',
          options: [
            'SyntaxError: unexpected token',
            'IndentationError: expected an indented block',
            'ReferenceError: indent is undefined',
            'TypeError: invalid indentation'
          ],
          correctOptionIndex: 1,
          explanation: 'Python is strict about spacing. If you forget to indent code inside a block (like after an if statement), it raises an IndentationError.'
        },
        {
          id: 'conditionals-code',
          title: 'Check Even or Odd',
          type: 'code',
          instructions: `Define a function named **\`is_even\`** that takes a single number as its parameter.

Inside the function:
1. Check if the number is divisible by 2 using the modulo operator \`%\` (e.g., \`number % 2 == 0\`).
2. Return **\`True\`** if the number is even, and **\`False\`** if the number is odd.`,
          starterCode: `def is_even(number):
    # Write your conditional logic here
    pass
`,
          hints: [
            'Use the % operator. If a number is even, number % 2 will be 0.',
            'Remember to indent the lines inside the function, and further indent the lines inside your if/else statements!',
            'Example structures:\nif number % 2 == 0:\n    return True'
          ],
          verificationTests: [
            {
              description: 'Function "is_even" is defined',
              testCode: `assert "is_even" in globals(), "You must define a function named 'is_even'"`
            },
            {
              description: 'is_even(4) returns True',
              testCode: `assert is_even(4) == True, "is_even(4) should return True"`
            },
            {
              description: 'is_even(7) returns False',
              testCode: `assert is_even(7) == False, "is_even(7) should return False"`
            },
            {
              description: 'is_even(0) returns True',
              testCode: `assert is_even(0) == True, "is_even(0) should return True"`
            }
          ]
        }
      ]
    }
  ]
};
