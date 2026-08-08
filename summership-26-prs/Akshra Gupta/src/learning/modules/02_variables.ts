import type { Module } from '../types';

export const variablesModule: Module = {
  id: 'variables',
  title: 'Variables & Data Types',
  description: 'Learn how to store data in variables, work with different types like numbers and text, and perform basic operations.',
  difficulty: 'Beginner',
  estimatedMinutes: 15,
  lessons: [
    {
      id: 'storing-data',
      title: 'Variables',
      description: 'Understand how Python stores and reads data in memory using variables.',
      steps: [
        {
          id: 'variables-theory',
          title: 'What is a Variable?',
          type: 'theory',
          content: `In programming, a **variable** is like a labeled container that stores a value. 

In Python, creating a variable is incredibly simple. You just write the variable name, followed by the equals sign \`=\` (the assignment operator), and then the value:

\`\`\`python
username = "CodeWizard"
age = 21
is_active = True
\`\`\`

### Key Python Rules:
1. **No Declaration Keywords**: You don't need keywords like \`let\`, \`var\`, or \`const\`. Python figures out the variable type dynamically.
2. **Naming Rules**: Variable names can contain letters, numbers, and underscores \`_\`, but they **cannot** start with a number. They are also case-sensitive (\`age\` and \`Age\` are different).
3. **Data Types**: 
   - **String (\`str\`)**: Text enclosed in quotes, e.g., \`"Python"\`.
   - **Integer (\`int\`)**: Whole numbers, e.g., \`42\`.
   - **Float (\`float\`)**: Decimal numbers, e.g., \`3.14\`.
   - **Boolean (\`bool\`)**: Either \`True\` or \`False\` (note the capitalization!).`,
          codeSnippet: `x = 5\ny = 10\ntotal = x + y\nprint(total)`
        },
        {
          id: 'variables-quiz',
          title: 'Variable Rules Check',
          type: 'quiz',
          question: 'Which of the following is a valid variable declaration in Python?',
          options: [
            'let score = 90',
            'int score = 90',
            'score = 90',
            'var score = 90'
          ],
          correctOptionIndex: 2,
          explanation: 'Python does not use declaration keywords like let, var, or type prefixes. You simply assign a value to a name: score = 90.'
        },
        {
          id: 'variables-code',
          title: 'Calculate Circle Area',
          type: 'code',
          instructions: `Let's practice calculations. Write code to:
1. Create a variable named **\`pi\`** and set it to **\`3.14\`**.
2. Create a variable named **\`radius\`** and set it to **\`10\`**.
3. Calculate the area of the circle using the formula \`pi * radius * radius\` (or \`pi * (radius ** 2)\`) and store the result in a variable named **\`area\`**.`,
          starterCode: `# 1. Create pi variable
# 2. Create radius variable
# 3. Calculate area
`,
          hints: [
            'Declare pi: pi = 3.14',
            'Declare radius: radius = 10',
            'Multiply them together: area = pi * radius * radius'
          ],
          verificationTests: [
            {
              description: 'Variable "pi" is defined and correct',
              testCode: `assert "pi" in globals(), "You must create a variable named 'pi'"\nassert pi == 3.14, "The variable 'pi' should be set to 3.14"`
            },
            {
              description: 'Variable "radius" is defined and correct',
              testCode: `assert "radius" in globals(), "You must create a variable named 'radius'"\nassert radius == 10, "The variable 'radius' should be set to 10"`
            },
            {
              description: 'Variable "area" is correctly calculated',
              testCode: `assert "area" in globals(), "You must create a variable named 'area'"\nassert area == 314.0, "The variable 'area' should be calculated as 314.0"`
            }
          ]
        }
      ]
    }
  ]
};
