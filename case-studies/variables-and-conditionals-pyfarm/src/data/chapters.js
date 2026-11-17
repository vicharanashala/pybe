// Story content for the MVP's two chapters, kept as data so the runner stays a
// single generic flow. Each chapter walks the same seven screens, which between
// them cover the twelve story beats: scene and dialogue, the problem, a think
// moment, the concept reveal, the Python explanation, the code challenge with its
// farm reaction, and the reward that unlocks what comes next.
//
// Writing guideline for anyone adding a chapter: short lines. A screen is meant
// to be read at a glance and moved past, never scrolled through.

export const CHAPTERS = [
  {
    id: 1,
    title: 'The New Farm',
    concept: 'Variables',
    missionId: 'ch1-seeds',
    tagline: 'Maya inherits a farm, and more things to remember than she can hold in her head.',

    // Beats 1 and 2 — the scene, and Maya in it.
    scene: {
      mayaMood: 'normal',
      heading: 'Maya arrives',
      lines: [
        'The gate is stiff and the path is overgrown, but it is hers now — her grandfather left her the whole small farm.',
        'A farmhouse. One crop field. A water tank. A handful of coins. Three trees at the edge.',
      ],
      note: {
        from: "Pinned to the farmhouse door, in her grandfather's handwriting",
        text: 'A good farmer keeps track of everything.',
      },
      mayaLine: 'Right. Let me see exactly what I have.',
    },

    // Beat 3 — the problem, made concrete.
    problem: {
      mayaMood: 'worried',
      heading: 'Four things to keep track of',
      body: 'Maya counts what the farm holds. By the time she reaches the water tank, she has already forgotten the seed count.',
      tally: [
        { icon: '💰', label: 'Coins', value: 100 },
        { icon: '🌱', label: 'Seeds', value: 20 },
        { icon: '💧', label: 'Water', value: 50 },
        { icon: '🌾', label: 'Crops', value: 'dry' },
      ],
      mayaLine: 'I cannot remember everything. I need a way to store information.',
    },

    // Beat 4 — the learner decides before being told the answer.
    think: {
      mayaMood: 'thinking',
      heading: 'What should Maya do?',
      prompt: 'She has four amounts to keep straight, and they change every day.',
      options: [
        {
          id: 'remember',
          label: 'Keep it all in her head',
          correct: false,
          response: 'By evening she has lost the seed count again. A farm changes daily — memory alone will not hold it.',
        },
        {
          id: 'label',
          label: 'Give every amount a name, and write the value next to it',
          correct: true,
          response: 'Exactly. A name, and a value stored under it. Maya can look it up later, and change it when it changes.',
        },
        {
          id: 'coins',
          label: 'Track only the coins, since money matters most',
          correct: false,
          response: 'Then the seeds run out unnoticed and nothing gets planted. She needs all four.',
        },
      ],
    },

    // Beat 5 — name the thing the learner just invented.
    reveal: {
      mayaMood: 'happy',
      conceptLabel: 'Variables',
      heading: 'A name with a value stored under it',
      body: 'Python calls that a variable. You choose the name, you give it a value, and the value stays there until you change it.',
      code: 'coins = 100\nseeds = 20\nwater = 50',
      caption: 'Maya’s whole farm, written down. Three names, three values.',
    },

    // Beat 6 — how it actually works.
    explain: {
      mayaMood: 'happy',
      heading: 'How a variable works',
      points: [
        { code: 'seeds = 20', text: 'The name goes on the left, the value on the right. The = stores the value under the name.' },
        { code: 'print(seeds)', text: 'Use the name anywhere you want the value. Python looks it up for you.' },
        { code: 'seeds = 25', text: 'Store a new value and the old one is replaced. The name stays the same.' },
        { code: 'seeds = seeds + 5', text: 'You can build the new value out of the old one. Python works out the right-hand side first, then stores the answer.' },
      ],
      mayaLine: 'So the box keeps its label, and I just change what is inside it.',
    },

    // Beats 10, 11 and 12.
    complete: {
      mayaMood: 'celebrating',
      heading: 'Mission Complete',
      mayaLine: 'Thirty seeds, written down where I can find them. Grandfather was right.',
      unlockText: 'A change in the weather is coming. Chapter 2 is open.',
    },
  },

  {
    id: 2,
    title: 'The Weather Problem',
    concept: 'if / else conditions',
    missionId: 'ch2-weather',
    tagline: 'The crops need water. The sky might already be providing it.',

    scene: {
      mayaMood: 'normal',
      heading: 'Morning on the farm',
      lines: [
        'Maya steps outside before sunrise and looks up, the way her grandfather always did.',
        'The crops need watering today. The tank holds 50 — enough, but not endless.',
      ],
      mayaLine: 'First things first. What is the sky doing?',
    },

    problem: {
      mayaMood: 'worried',
      heading: 'Watering in the rain wastes water',
      body: 'If Maya waters the crops while it is raining, the tank drains for nothing — the rain would have done it for free. If she skips watering on a dry day, the crops suffer.',
      tally: [
        { icon: '💧', label: 'Water tank', value: 50 },
        { icon: '🌾', label: 'Crops', value: 'thirsty' },
        { icon: '☀️', label: 'Today', value: 'sunny' },
      ],
      mayaLine: 'How can I make the farm choose what to do based on the weather?',
    },

    think: {
      mayaMood: 'thinking',
      heading: 'It is pouring rain and the crops are thirsty',
      prompt: 'Maya is standing at the tank with the tap in her hand.',
      options: [
        {
          id: 'always',
          label: 'Water them anyway — thirsty crops need water',
          correct: false,
          response: 'The rain was already watering them. Maya has drained the tank for nothing, and by the dry week she has none left.',
        },
        {
          id: 'depends',
          label: 'Check the weather first, then decide',
          correct: true,
          response: 'That is it. Rain today means the tank stays shut. No rain means she waters. One rule, two different mornings.',
        },
        {
          id: 'never',
          label: 'Never water — leave it all to the rain',
          correct: false,
          response: 'Then the first dry spell kills the field. She cannot rely on the sky every day.',
        },
      ],
    },

    reveal: {
      mayaMood: 'happy',
      conceptLabel: 'if / else',
      heading: 'Ask a question, then take one of two paths',
      body: 'Python can check a condition and run different code depending on the answer. That is what if and else are for.',
      code: 'if weather == "rain":\n    print("No need to water")\nelse:\n    water_crops()',
      caption: 'One rule that handles every morning, rainy or not.',
    },

    explain: {
      mayaMood: 'happy',
      heading: 'Reading an if / else',
      points: [
        { code: 'if weather == "rain":', text: 'if asks a yes-or-no question. Use == to compare two values; a single = would store instead of compare.' },
        { code: '    print("No need to water")', text: 'The indented lines under if run only when the answer is yes. Indentation is how Python knows which lines belong to the branch.' },
        { code: 'else:', text: 'else covers every other case — here, any morning that is not raining.' },
        { code: '    water_crops()', text: 'The indented lines under else run only when the if question was no. Exactly one of the two branches runs, never both.' },
      ],
      mayaLine: 'So the farm asks the question every morning, and only one answer happens.',
      warning: 'Indentation matters in Python. Four spaces before the lines inside a branch — miss them and Python stops with an IndentationError.',
    },

    complete: {
      mayaMood: 'celebrating',
      heading: 'Mission Complete',
      mayaLine: 'Now the farm decides for itself. I just have to look up once.',
      unlockText: 'That is the MVP — variables and decisions. More chapters are on the way.',
    },
  },
];

export function getChapter(id) {
  return CHAPTERS.find((c) => c.id === id) ?? null;
}
