export const EVALUATION = [
  {
    id: 'q1',
    kind: 'predict-output',
    prompt: 'for i in range(3):\n    print(i * 2)\n\nWhat is the LAST number printed?',
    expectedAnswer: '4'
  },
  {
    id: 'q2',
    kind: 'debug-select',
    label: 'Find the Bug',
    prompt: 'This is supposed to print 1 through 5, but 5 never appears. Click the buggy line.',
    codeLines: ['for i in range(1, 5):', '    print(i)'],
    correctLineIndex: 0,
    explanation: 'range(1, 5) produces 1, 2, 3, 4 — the stop value is never included. It needed to be range(1, 6).'
  },
  {
    id: 'q3',
    kind: 'fill-code',
    prompt: 'Complete the loop so it counts down from 3 to 1:\nfor i in range(3, 0, ____):',
    expectedAnswer: '-1'
  },
  {
    id: 'q4',
    kind: 'arrange',
    prompt: 'Put these lines in the order that makes a working countdown-to-bloom program.',
    lines: ['print("BLOOM!")', 'count = 3', 'while count > 0:', '    print(count)', '    count = count - 1'],
    correctOrder: [1, 2, 3, 4, 0]
  },
  {
    id: 'q5',
    kind: 'trace-count',
    prompt: 'for i in range(2, 9, 3):\n    print(i)\n\nHow many times does this loop body run?',
    expectedAnswer: '3'
  },
  {
    id: 'q6',
    kind: 'memory-prediction',
    prompt: 'total = 0\nfor n in [4, 4, 4]:\n    total = total + n\n\nPredict the FINAL value of total.',
    variables: ['total'],
    expected: { total: '12' },
    explanation: 'The loop runs three times, each time adding 4: 0 → 4 → 8 → 12.'
  },
  {
    id: 'q7',
    kind: 'debug-select',
    label: 'Find the Infinite Loop',
    prompt: 'This loop never stops. Click the line responsible.',
    codeLines: ['i = 0', 'while i < 5:', '    print(i)', '    i = i'],
    correctLineIndex: 3,
    explanation: 'i = i leaves i unchanged forever, so i < 5 stays true forever. It needed to be i = i + 1.'
  },
  {
    id: 'q8',
    kind: 'fill-code',
    label: 'Fix the Wrong Loop',
    prompt: 'This should print 0 through 4, but it prints 1 through 5. Complete the corrected line:\nfor i in range(____, 5):',
    expectedAnswer: '0'
  },
  {
    id: 'q9',
    kind: 'code-exec',
    prompt: 'Write a program that prints the square of every number from 1 to 5 (one per line): 1, 4, 9, 16, 25.',
    starterCode: '# your loop here\n',
    testDescription: 'Running your program',
    expectedLines: ['1', '4', '9', '16', '25']
  },
  {
    id: 'q10',
    kind: 'mcq',
    prompt: "Which loop is the better choice when you don't know in advance how many times you'll need to repeat?",
    options: ['A for loop', 'A while loop', 'range()', 'print()'],
    correctIndex: 1
  }
];
