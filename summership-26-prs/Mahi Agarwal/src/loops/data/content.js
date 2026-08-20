export const STORY = {
  title: '🌼 Robo and the Magic Loop',
  subtitle: 'Discover how one magical spell can help Robo water every flower—and learn Python loops along the way!',
  moral: 'Repeating mistakes keeps you stuck. Learning from every repetition helps you grow.'
};

export const CONCEPT = {
  heading: 'The tool Python gives you for repetition',
  intro: "Robo just watered five flowers by hand, one at a time — and across the rest of the garden, watering cans, flower beds, and sprinklers all need that exact same kind of help. Both problems have the same shape: do something, again and again. Python has one tool built for exactly that shape — it's called a loop. There are two kinds, and the difference between them comes down to one question: do you know how many times you need to repeat, or not?",
  points: [
    {
      title: 'A for loop — repeat a known number of times',
      body: 'Use a for loop whenever you already know what you’re repeating over — five watering cans, four flower beds, a countdown from 10. It runs its body once for every item in a sequence, like a list or a range() of numbers.'
    },
    {
      title: 'A while loop — repeat until a condition changes',
      body: 'Use a while loop when you don’t know the count in advance — only the condition that eventually stops you. It keeps repeating as long as its condition stays true, and stops the instant it becomes false.'
    },
    {
      title: 'The loop variable',
      body: 'Every pass through a for loop, one name updates automatically to the next item — can, flower bed, or number. That’s how the body tells one pass apart from the next without you managing it by hand.'
    }
  ],
  pythonIntro: 'Here’s the shape of each one. Run both below and watch exactly what happens, line by line.',
  example: {
    code: 'for day in range(1, 6):\n    print("Day", day)',
    caption: 'range(1, 6) produces 1, 2, 3, 4, 5 — five values, so the body runs five times. day automatically becomes each one in turn.'
  },
  whileExample: {
    code: 'count = 5\nwhile count > 0:\n    print(count)\n    count = count - 1\nprint("All watered!")',
    caption: 'There’s no fixed number of repeats written anywhere — just a condition, count > 0. Python reruns the body and rechecks the condition until it finally turns false.'
  }
};

// range(start, stop, step) presets the interactive visualizer offers.
export const RANGE_PRESETS = [
  { label: 'range(5)', start: 0, stop: 5, step: 1 },
  { label: 'range(1, 6)', start: 1, stop: 6, step: 1 },
  { label: 'range(0, 10, 2)', start: 0, stop: 10, step: 2 },
  { label: 'range(10, 0, -2)', start: 10, stop: 0, step: -2 }
];

export const PLAYGROUND_TEMPLATES = {
  'Count the Days': { code: 'for day in range(1, 8):\n    print("Day", day, "of the loop")\n' },
  'Countdown': { code: 'count = 5\nwhile count > 0:\n    print(count)\n    count = count - 1\nprint("All watered!")\n' },
  'Skip Every Other': { code: 'for hour in range(0, 24, 2):\n    print("Checking hour", hour)\n' },
  Blank: { code: '# write your own loop here\n' }
};
