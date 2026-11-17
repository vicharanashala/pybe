import type { TopicId, ActivityConfig, ConceptGuide } from './curriculum';

export interface TopicActivityData {
  activity: ActivityConfig;
  conceptGuide: ConceptGuide;
}

export const topicActivities: Record<TopicId, TopicActivityData> = {
  variables: {
    activity: {
      title: 'Label the Clay Pots',
      goal: 'Give each pot a name so Mira can find her acorns.',
      instructions: 'Drag the name labels onto the correct pots. Each pot needs exactly one label.',
      hint: 'Think about what each pot holds — the label should match the contents.',
      completionMessage: 'Now Mira can find any acorn stash by name! That is exactly what a variable does — it gives a value a name.',
      pythonConnection: 'In Python, a variable is a name that points to a value: tribute = "Saffron"',
      type: 'drag-labels',
      items: [
        { id: 'winter', label: 'winter' },
        { id: 'spring', label: 'spring' },
        { id: 'summer', label: 'summer' },
      ],
      targets: [
        { id: 'pot1', label: 'Stash of frozen acorns', correctItemId: 'winter' },
        { id: 'pot2', label: 'Stash of fresh acorns', correctItemId: 'spring' },
        { id: 'pot3', label: 'Stash of dried acorns', correctItemId: 'summer' },
      ],
    },
    conceptGuide: {
      whatIsIt: 'A variable is a named container that stores a value. You give it a name and Python remembers the value for you.',
      whyUseIt: 'Without names, you would have to remember every value by its position. Variables let you label data so both you and the computer can find it quickly.',
      realLifeExamples: ['A jar labeled "sugar" so you know what is inside', 'A classroom seat with a student\'s name on it'],
      pythonExamples: ['name = "Mira"', 'count = 5', 'season = "winter"'],
      howItWorks: {
        activity: 'You labeled clay pots so Mira could find her acorns by name.',
        idea: 'A variable is the same idea — give a value a name, then use the name to find it.',
        python: 'Write a name, use =, then write the value.',
        example: 'treasure = "gold"\nprint(treasure)',
      },
    },
  },

  arithmetic: {
    activity: {
      title: 'Count the Market Coins',
      goal: 'Help Priya calculate the correct total of coins.',
      instructions: 'Click the coins in each group, then select the correct total from the options.',
      hint: 'Add the numbers one at a time: first group + second group = total.',
      completionMessage: 'You calculated the market total! Arithmetic operators (+, -, *, /) combine numbers to produce results.',
      pythonConnection: 'In Python: total = coins + jewels — the + operator adds two numbers.',
      type: 'click-order',
      items: [
        { id: 'c1', label: '12 copper coins' },
        { id: 'c2', label: '8 silver coins' },
      ],
      targets: [
        { id: 'ans1', label: '18', correctItemId: '' },
        { id: 'ans2', label: '20', correctItemId: 'correct' },
        { id: 'ans3', label: '24', correctItemId: '' },
      ],
    },
    conceptGuide: {
      whatIsIt: 'Arithmetic operators (+, -, *, /) combine numbers to calculate totals, differences, products, and quotients.',
      whyUseIt: 'Programmers need to calculate things constantly — prices, scores, distances. Arithmetic is the foundation of every calculation.',
      realLifeExamples: ['Adding up items in a shopping bill', 'Splitting a restaurant bill between friends'],
      pythonExamples: ['total = 12 + 8', 'change = 50 - price', 'area = length * width'],
      howItWorks: {
        activity: 'You added Priya\'s coins to find the market total.',
        idea: 'Arithmetic in Python works just like arithmetic on paper, but faster and with no mistakes.',
        python: 'Use +, -, *, / between numbers.',
        example: 'total = 12 + 8\nprint(total)  # 20',
      },
    },
  },

  comparison: {
    activity: {
      title: 'The Royal Scale',
      goal: 'Help Birbal decide if each petition meets the royal standard.',
      instructions: 'For each pair of values, click the correct comparison: greater, less, or equal.',
      hint: 'Read the values carefully. Ask: is the first value bigger, smaller, or the same?',
      completionMessage: 'You compared values like Birbal! Comparison operators return True or False — there is no middle ground.',
      pythonConnection: 'In Python: result = grain >= required — comparison returns True or False.',
      type: 'gate-check',
      items: [
        { id: 'g1', label: 'grain=15, required=10', isAllowed: true },
        { id: 'g2', label: 'grain=7, required=10', isAllowed: false },
        { id: 'g3', label: 'grain=10, required=10', isAllowed: true },
      ],
      targets: [
        { id: 'gt', label: '> (greater)', correctItemId: '' },
        { id: 'lt', label: '< (less)', correctItemId: '' },
        { id: 'eq', label: '>= (greater or equal)', correctItemId: '' },
      ],
    },
    conceptGuide: {
      whatIsIt: 'Comparison operators (==, !=, <, >, <=, >=) test the relationship between two values and produce True or False.',
      whyUseIt: 'Every decision in a program starts with a comparison. Is the password correct? Is the score high enough? You need comparisons to make choices.',
      realLifeExamples: ['Checking if you are tall enough for a ride', 'Comparing exam scores to find the winner'],
      pythonExamples: ['is_enough = grain >= 10', 'same = name == "Birbal"', 'passed = score > 50'],
      howItWorks: {
        activity: 'You decided which petitions met the royal standard.',
        idea: 'Comparing two values always produces True or False — a Boolean.',
        python: 'Place ==, !=, <, >, <=, >= between two values.',
        example: 'print(15 >= 10)  # True\nprint(7 > 10)   # False',
      },
    },
  },

  strings: {
    activity: {
      title: 'Inscribe the Sacred Mantra',
      goal: 'Help Kavi write the mantra by placing each character in order.',
      instructions: 'Click the characters in the correct order to build the sacred text.',
      hint: 'Read the mantra carefully — every character matters, including spaces.',
      completionMessage: 'The mantra is complete! A single wrong character changes the meaning. Strings must be exact.',
      pythonConnection: 'In Python: message = "Welcome" — text between quotes is a string.',
      type: 'click-order',
      items: [
        { id: 's1', label: 'W' },
        { id: 's2', label: 'e' },
        { id: 's3', label: 'l' },
        { id: 's4', label: 'c' },
        { id: 's5', label: 'o' },
        { id: 's6', label: 'm' },
        { id: 's7', label: 'e' },
      ],
      targets: [
        { id: 'slot1', label: 'Position 1', correctItemId: 's1' },
        { id: 'slot2', label: 'Position 2', correctItemId: 's2' },
        { id: 'slot3', label: 'Position 3', correctItemId: 's3' },
        { id: 'slot4', label: 'Position 4', correctItemId: 's4' },
        { id: 'slot5', label: 'Position 5', correctItemId: 's5' },
        { id: 'slot6', label: 'Position 6', correctItemId: 's6' },
        { id: 'slot7', label: 'Position 7', correctItemId: 's7' },
      ],
    },
    conceptGuide: {
      whatIsIt: 'A string is a sequence of characters enclosed in quotes. It represents text that a program can store, combine, and transform.',
      whyUseIt: 'Every message, name, and piece of text in a program is a string. Without strings, computers could not display words or process input.',
      realLifeExamples: ['A welcome message on a website', 'Your name stored in a contact list'],
      pythonExamples: ['greeting = "Namaste"', 'full = first + " " + last', 'shout = message.upper()'],
      howItWorks: {
        activity: 'You placed each character in order to build the sacred mantra.',
        idea: 'A string is just characters in order — Python keeps them in the exact sequence you write.',
        python: 'Write text between quotes.',
        example: 'mantra = "Welcome"\nprint(mantra)',
      },
    },
  },

  lists: {
    activity: {
      title: 'Arrange the Market Baskets',
      goal: 'Help Zara arrange cargo baskets in the correct arrival order.',
      instructions: 'Drag each basket to its correct position in the caravan list.',
      hint: 'The first basket to arrive goes in position 0. Order matters!',
      completionMessage: 'The baskets are in perfect order! Lists keep items in the order you put them — position 0 is first.',
      pythonConnection: 'In Python: caravan = ["silk", "spice", "tea"] — items are ordered by position.',
      type: 'arrange-order',
      items: [
        { id: 'b1', label: 'silk' },
        { id: 'b2', label: 'spice' },
        { id: 'b3', label: 'tea' },
      ],
      targets: [
        { id: 'pos0', label: 'Position 0 (first)', correctItemId: 'b1' },
        { id: 'pos1', label: 'Position 1 (second)', correctItemId: 'b2' },
        { id: 'pos2', label: 'Position 2 (third)', correctItemId: 'b3' },
      ],
    },
    conceptGuide: {
      whatIsIt: 'A list is an ordered collection of items. Each item has a position number starting from 0, and you can add, remove, or change items.',
      whyUseIt: 'Real data comes in sequences — tasks, names, scores. Lists let you store and process items in order.',
      realLifeExamples: ['A shopping list with items in priority order', 'A to-do list where order matters'],
      pythonExamples: ['caravan = ["silk", "spice", "tea"]', 'caravan.append("gems")', 'print(caravan[0])'],
      howItWorks: {
        activity: 'You arranged Zara\'s baskets so each one is in the right position.',
        idea: 'A list works the same way — items go in positions 0, 1, 2, ... and you can find any item by its position.',
        python: 'Write items in square brackets, separated by commas.',
        example: 'caravan = ["silk", "spice", "tea"]\nprint(caravan[0])  # silk',
      },
    },
  },

  tuples: {
    activity: {
      title: 'Arrange the Temple Lamps',
      goal: 'Place each lamp in its sacred position, then lock them in place.',
      instructions: 'Drag lamps to their positions. Once locked, they cannot be moved.',
      hint: 'Think of coordinates — each lamp has a fixed position that must not change.',
      completionMessage: 'The lamps are locked! Tuples are like lists that cannot be changed — once set, they stay fixed.',
      pythonConnection: 'In Python: coordinates = (28.6, 77.2) — parentheses create an immutable tuple.',
      type: 'arrange-order',
      items: [
        { id: 'l1', label: '28.6 (latitude)' },
        { id: 'l2', label: '77.2 (longitude)' },
        { id: 'l3', label: '200 (elevation)' },
      ],
      targets: [
        { id: 'tp0', label: 'Position 0 (fixed)', correctItemId: 'l1' },
        { id: 'tp1', label: 'Position 1 (fixed)', correctItemId: 'l2' },
        { id: 'tp2', label: 'Position 2 (fixed)', correctItemId: 'l3' },
      ],
    },
    conceptGuide: {
      whatIsIt: 'A tuple is an ordered, immutable collection. Once created, you cannot add, remove, or change its items.',
      whyUseIt: 'Some data must never change — map coordinates, dates, configurations. Tuples protect data from accidental modification.',
      realLifeExamples: ['A fixed map coordinate that must not change', 'A date of birth that stays the same'],
      pythonExamples: ['point = (10, 20)', 'color = (255, 128, 0)', 'print(point[0])'],
      howItWorks: {
        activity: 'You locked temple lamps in place so they cannot be moved.',
        idea: 'A tuple is the same — once you set the values, Python prevents any changes.',
        python: 'Use parentheses instead of square brackets.',
        example: 'coords = (28.6, 77.2)\nprint(coords[0])  # 28.6',
      },
    },
  },

  sets: {
    activity: {
      title: 'Collect the Sacred Flowers',
      goal: 'Help Arjun collect unique flower names — duplicates disappear automatically.',
      instructions: 'Click each flower to add it to the collection. Watch duplicates vanish.',
      hint: 'A set only keeps unique items — if you add the same flower twice, one copy disappears.',
      completionMessage: 'Only unique flowers remain! Sets automatically remove duplicates — that is their power.',
      pythonConnection: 'In Python: flowers = {"rose", "lily", "rose"} — the set keeps only one "rose".',
      type: 'match-pairs',
      items: [
        { id: 'f1', label: 'rose' },
        { id: 'f2', label: 'lily' },
        { id: 'f3', label: 'marigold' },
        { id: 'f4', label: 'jasmine' },
      ],
      targets: [
        { id: 'u1', label: 'Unique: rose', correctItemId: 'f1' },
        { id: 'u2', label: 'Unique: lily', correctItemId: 'f2' },
        { id: 'u3', label: 'Unique: marigold', correctItemId: 'f3' },
        { id: 'u4', label: 'Unique: jasmine', correctItemId: 'f4' },
      ],
      matchPairs: [
        { left: 'rose', right: 'Kept (unique)' },
        { left: 'lily', right: 'Kept (unique)' },
        { left: 'rose (duplicate)', right: 'Removed' },
        { left: 'marigold', right: 'Kept (unique)' },
      ],
    },
    conceptGuide: {
      whatIsIt: 'A set is an unordered collection of unique values. Duplicates are automatically removed when inserted.',
      whyUseIt: 'When you need to check if something exists or remove duplicates, sets are the fastest tool.',
      realLifeExamples: ['Removing duplicate names from a registration list', 'Checking if a username is already taken'],
      pythonExamples: ['guests = {"Asha", "Ravi"}', 'guests.add("Asha")  # no duplicate', 'print(len(guests))'],
      howItWorks: {
        activity: 'You collected flowers and saw duplicates disappear automatically.',
        idea: 'Sets only store unique values — adding a duplicate has no effect.',
        python: 'Use curly braces to create a set.',
        example: 'flowers = {"rose", "lily", "rose"}\nprint(flowers)  # {"rose", "lily"}',
      },
    },
  },

  dictionaries: {
    activity: {
      title: 'Match the Seal to the Chest',
      goal: 'Help Birbal match each merchant seal to the correct treasure chest.',
      instructions: 'Drag each copper seal onto the chest it belongs to.',
      hint: 'Each seal has a unique name — it maps to exactly one chest.',
      completionMessage: 'Every seal finds its chest instantly! A dictionary maps unique keys to values for direct lookup.',
      pythonConnection: 'In Python: vault["Golconda"] = "Star Emerald" — the key maps to the value.',
      type: 'drag-labels',
      items: [
        { id: 'persia', label: 'Persia seal' },
        { id: 'calicut', label: 'Calicut seal' },
        { id: 'golconda', label: 'Golconda seal' },
      ],
      targets: [
        { id: 'chest1', label: 'Chest with Gold Coins', correctItemId: 'persia' },
        { id: 'chest2', label: 'Chest with Black Pepper', correctItemId: 'calicut' },
        { id: 'chest3', label: 'Chest with Star Emerald', correctItemId: 'golconda' },
      ],
    },
    conceptGuide: {
      whatIsIt: 'A dictionary maps unique keys to values. You use the key to look up the value instantly, like a real dictionary maps words to definitions.',
      whyUseIt: 'Searching one by one is slow. Dictionaries give you instant access — one key, one lookup, one result.',
      realLifeExamples: ['A phone book maps names to numbers', 'A dictionary maps words to definitions'],
      pythonExamples: ['vault = {"Golconda": "Star Emerald"}', 'item = vault["Golconda"]', 'vault["Kashmir"] = "Saffron"'],
      howItWorks: {
        activity: 'You matched merchant seals to treasure chests — each seal is a unique key.',
        idea: 'A dictionary stores key-value pairs. The key is the seal, the value is the treasure.',
        python: 'Use curly braces with key: value pairs.',
        example: 'vault = {"Golconda": "Star Emerald"}\nprint(vault["Golconda"])',
      },
    },
  },

  conditionals: {
    activity: {
      title: 'The Temple Gate',
      goal: 'Help the guard decide who enters based on their invitation.',
      instructions: 'For each traveler, check their invitation and click Allow or Block.',
      hint: 'Only travelers with a valid invitation pass through. Check the condition carefully.',
      completionMessage: 'You guarded the gate with conditions! If/else chooses actions based on whether something is True or False.',
      pythonConnection: 'In Python: if has_invitation: allow() else: block()',
      type: 'gate-check',
      items: [
        { id: 't1', label: 'Traveler with golden pass', isAllowed: true },
        { id: 't2', label: 'Traveler with no pass', isAllowed: false },
        { id: 't3', label: 'Traveler with expired pass', isAllowed: false },
        { id: 't4', label: 'Traveler with silver pass', isAllowed: true },
      ],
      targets: [
        { id: 'allow', label: 'Allow Entry', correctItemId: '' },
        { id: 'block', label: 'Block Entry', correctItemId: '' },
      ],
    },
    conceptGuide: {
      whatIsIt: 'Conditionals (if/elif/else) let a program choose different actions based on whether a condition is True or False.',
      whyUseIt: 'Programs must make decisions — accept or reject, show or hide, continue or stop. Conditionals are how programs think.',
      realLifeExamples: ['A traffic light decides go or stop based on color', 'A bouncer checks age before allowing entry'],
      pythonExamples: ['if score >= 50: print("Pass")', 'if logged_in: show_dashboard()', 'else: show_login()'],
      howItWorks: {
        activity: 'You decided who enters the temple gate based on their invitation.',
        idea: 'An if statement checks a condition — if True, it runs one block; if False, it runs another.',
        python: 'Write if, then a condition, then a colon.',
        example: 'if has_invitation:\n    print("Welcome!")\nelse:\n    print("Sorry, no entry.")',
      },
    },
  },

  loops: {
    activity: {
      title: 'Ring the Temple Bell',
      goal: 'Ring the bell exactly 10 times to complete the ceremony.',
      instructions: 'Click the bell to ring it. Watch the counter — stop at exactly 10.',
      hint: 'A for loop runs a specific number of times. Count carefully!',
      completionMessage: 'The ceremony is complete! A for loop repeats an action for each item in a sequence — no more, no less.',
      pythonConnection: 'In Python: for i in range(10): ring_bell() — repeats 10 times.',
      type: 'repeat-click',
      items: [{ id: 'bell', label: 'Temple Bell' }],
      targets: [],
      repeatTarget: 10,
      repeatAction: 'Ring!',
    },
    conceptGuide: {
      whatIsIt: 'A for loop repeats an action for each item in a sequence. It runs a known number of times.',
      whyUseIt: 'Repeating tasks manually is slow and error-prone. Loops do the repetition for you, perfectly every time.',
      realLifeExamples: ['Roll call in a classroom — one student at a time', 'Processing each order in a queue'],
      pythonExamples: ['for lamp in lamps: light(lamp)', 'for i in range(10): print(i)', 'for name in names: greet(name)'],
      howItWorks: {
        activity: 'You rang the bell 10 times — a loop does exactly that.',
        idea: 'A for loop picks each item from a collection and runs the same action on it.',
        python: 'Use for, a variable name, in, then a collection.',
        example: 'for lamp in ["red", "blue", "green"]:\n    light(lamp)',
      },
    },
  },

  'while-loops': {
    activity: {
      title: 'Fill the Water Clock',
      goal: 'Drop stones into the well until the water reaches the target level.',
      instructions: 'Click to drop stones. Watch the water level rise. Stop when it reaches the top.',
      hint: 'A while loop keeps going until a condition becomes False. Watch the water level!',
      completionMessage: 'The water reached the top! A while loop repeats until its condition becomes False.',
      pythonConnection: 'In Python: while water < target: add_stone() — keeps going until water is high enough.',
      type: 'repeat-click',
      items: [{ id: 'stone', label: 'Stone' }],
      targets: [],
      repeatTarget: 8,
      repeatAction: 'Drop stone!',
    },
    conceptGuide: {
      whatIsIt: 'A while loop repeats as long as its condition is True. It stops the moment the condition becomes False.',
      whyUseIt: 'Sometimes you do not know how many times to repeat — you just know when to stop. While loops handle this perfectly.',
      realLifeExamples: ['Keep stirring until the soup thickens', 'Keep adding water until the glass is full'],
      pythonExamples: ['while water < target: fill()', 'while attempts < 3: retry()', 'while not done: work()'],
      howItWorks: {
        activity: 'You dropped stones until the water reached the top — that is a while loop.',
        idea: 'The loop checks the condition before each repetition. True? Keep going. False? Stop.',
        python: 'Write while, then a condition, then a colon.',
        example: 'water = 0\ntarget = 8\nwhile water < target:\n    water += 1',
      },
    },
  },

  functions: {
    activity: {
      title: 'The Royal Messenger',
      goal: 'Create one messenger route that works for every village.',
      instructions: 'Drag the message template and village names to build the reusable route.',
      hint: 'A function is like a recipe — write it once, use it many times with different ingredients.',
      completionMessage: 'One route serves all villages! A function packages reusable actions — change the input, get a different result.',
      pythonConnection: 'In Python: def greet(name): return f"Hello, {name}!" — define once, call many times.',
      type: 'drag-labels',
      items: [
        { id: 'template', label: 'greet(village)' },
        { id: 'v1', label: 'Village: Delhi' },
        { id: 'v2', label: 'Village: Agra' },
      ],
      targets: [
        { id: 'func', label: 'Function definition', correctItemId: 'template' },
        { id: 'call1', label: 'First call: greet("Delhi")', correctItemId: 'v1' },
        { id: 'call2', label: 'Second call: greet("Agra")', correctItemId: 'v2' },
      ],
    },
    conceptGuide: {
      whatIsIt: 'A function is a named block of code that performs a specific task. You define it once and call it whenever needed.',
      whyUseIt: 'Writing the same code repeatedly wastes time and causes errors. Functions let you write once and reuse forever.',
      realLifeExamples: ['A recipe that you follow each time you cook the same dish', 'A template letter where you change only the name'],
      pythonExamples: ['def greet(name): return f"Hello {name}"', 'greet("Delhi")', 'greet("Agra")'],
      howItWorks: {
        activity: 'You created one messenger route that delivers to any village.',
        idea: 'A function is that route — define the steps once, then call it with different inputs.',
        python: 'Use def, a name, parameters in parentheses, then a colon.',
        example: 'def greet(name):\n    return f"Hello, {name}!"\nprint(greet("Delhi"))',
      },
    },
  },

  indexing: {
    activity: {
      title: 'Find the Third Scroll',
      goal: 'Help Suki locate the correct scroll on the library shelf.',
      instructions: 'Click the scroll at the correct position. Remember — Python starts counting at 0!',
      hint: 'The first scroll is at position 0. The third scroll is at position 2.',
      completionMessage: 'You found the scroll! In Python, indexing starts at 0 — so position 2 is the third item.',
      pythonConnection: 'In Python: scroll = shelf[2] — index 2 gives you the third item.',
      type: 'click-order',
      items: [
        { id: 'sc1', label: 'Scroll A' },
        { id: 'sc2', label: 'Scroll B' },
        { id: 'sc3', label: 'Scroll C' },
      ],
      targets: [
        { id: 'idx0', label: 'Index 0', correctItemId: 'sc1' },
        { id: 'idx1', label: 'Index 1', correctItemId: 'sc2' },
        { id: 'idx2', label: 'Index 2 (third)', correctItemId: 'sc3' },
      ],
    },
    conceptGuide: {
      whatIsIt: 'Indexing selects a single item from a collection by its position number. Python starts counting from 0.',
      whyUseIt: 'You often need just one item from a list — the first result, the middle entry, the last record. Indexing gets you there directly.',
      realLifeExamples: ['Finding the third item on a shelf', 'Getting the first name from a list'],
      pythonExamples: ['first = items[0]', 'third = items[2]', 'last = items[-1]'],
      howItWorks: {
        activity: 'You found the third scroll at position 2 — Python starts counting at 0.',
        idea: 'Index 0 is the first item, index 1 is the second, index 2 is the third.',
        python: 'Use square brackets with the position number.',
        example: 'shelf = ["A", "B", "C"]\nprint(shelf[2])  # C',
      },
    },
  },

  searching: {
    activity: {
      title: 'Find the Lost Bell',
      goal: 'Help Nadia search the warehouse for the missing elephant bell.',
      instructions: 'Click each crate one at a time. Is the bell inside? Keep searching until you find it.',
      hint: 'Search means asking: "Is the target here?" at each position.',
      completionMessage: 'You found the bell! Searching checks each item until the target is found or all items are checked.',
      pythonConnection: 'In Python: found = "bell" in warehouse — searches and returns True or False.',
      type: 'click-order',
      items: [
        { id: 'crate1', label: 'Crate 1: silk' },
        { id: 'crate2', label: 'Crate 2: spice' },
        { id: 'crate3', label: 'Crate 3: bell' },
      ],
      targets: [
        { id: 's1', label: 'Search here', correctItemId: 'crate1' },
        { id: 's2', label: 'Next crate', correctItemId: 'crate2' },
        { id: 's3', label: 'Found it!', correctItemId: 'crate3' },
      ],
    },
    conceptGuide: {
      whatIsIt: 'Searching checks whether a target value exists in a collection. It returns True if found, False if not.',
      whyUseIt: 'You need to find things constantly — a name in a list, a file in a folder, a word in a document. Searching is fundamental.',
      realLifeExamples: ['Looking for a specific book on a shelf', 'Checking if your name is on a list'],
      pythonExamples: ['found = "bell" in warehouse', 'if name in students: print("Found!")', 'index = items.index(target)'],
      howItWorks: {
        activity: 'You searched each crate one by one until you found the bell.',
        idea: 'The "in" operator checks each item — it returns True if the target exists.',
        python: 'Use "in" to check membership.',
        example: 'warehouse = ["silk", "spice", "bell"]\nprint("bell" in warehouse)  # True',
      },
    },
  },

  filtering: {
    activity: {
      title: 'Separate the Mangoes',
      goal: 'Help Lata separate ripe mangoes from raw ones.',
      instructions: 'Click each mango. Ripe goes to offering plate, raw goes back to basket.',
      hint: 'Filtering keeps only items that meet a condition — ripe mangoes pass the test.',
      completionMessage: 'Only ripe mangoes remain! Filtering creates a new collection with items that pass a condition.',
      pythonConnection: 'In Python: ripe = [m for m in mangoes if m.is_ripe] — keeps only ripe ones.',
      type: 'match-pairs',
      items: [
        { id: 'm1', label: 'Mango: ripe' },
        { id: 'm2', label: 'Mango: raw' },
        { id: 'm3', label: 'Mango: ripe' },
        { id: 'm4', label: 'Mango: raw' },
      ],
      targets: [
        { id: 'keep', label: 'Offering plate (keep)', correctItemId: 'm1' },
        { id: 'back', label: 'Basket (remove)', correctItemId: 'm2' },
        { id: 'keep2', label: 'Offering plate (keep)', correctItemId: 'm3' },
        { id: 'back2', label: 'Basket (remove)', correctItemId: 'm4' },
      ],
      matchPairs: [
        { left: 'Mango: ripe', right: 'Keep' },
        { left: 'Mango: raw', right: 'Remove' },
        { left: 'Mango: ripe', right: 'Keep' },
        { left: 'Mango: raw', right: 'Remove' },
      ],
    },
    conceptGuide: {
      whatIsIt: 'Filtering creates a new collection containing only items that meet a specific condition.',
      whyUseIt: 'Real data has noise. Filtering lets you extract only the relevant items — approved requests, passing scores, available products.',
      realLifeExamples: ['Showing only messages marked as unread', 'Displaying only products in stock'],
      pythonExamples: ['safe = [p for p in pots if p.clean]', 'passed = [s for s in scores if s >= 50]', 'available = [p for p in products if p.stock > 0]'],
      howItWorks: {
        activity: 'You separated ripe mangoes from raw ones — keeping only what passes the test.',
        idea: 'Filtering checks each item against a condition. True? Keep it. False? Skip it.',
        python: 'Use a list comprehension with an if condition.',
        example: 'mangoes = ["ripe", "raw", "ripe", "raw"]\nripe = [m for m in mangoes if m == "ripe"]',
      },
    },
  },

  counting: {
    activity: {
      title: 'Count the Coconuts',
      goal: 'Help Vikram count every coconut that enters the cart.',
      instructions: 'Click each coconut as it arrives. Your count must match the actual number.',
      hint: 'Counting adds 1 for each occurrence. Keep a running total.',
      completionMessage: 'Perfect count! Counting measures how many times something occurs — essential for statistics.',
      pythonConnection: 'In Python: count = items.count("coconut") — counts occurrences automatically.',
      type: 'repeat-click',
      items: [{ id: 'coconut', label: 'Coconut' }],
      targets: [],
      repeatTarget: 7,
      repeatAction: 'Count +1',
    },
    conceptGuide: {
      whatIsIt: 'Counting measures the total number of items or how many times a specific value occurs in a collection.',
      whyUseIt: 'You need counts everywhere — how many students passed, how many orders are pending, how many errors occurred.',
      realLifeExamples: ['Counting votes in an election', 'Tracking how many customers visited today'],
      pythonExamples: ['total = len(items)', 'freq = items.count("apple")', 'from collections import Counter'],
      howItWorks: {
        activity: 'You counted each coconut as it entered the cart.',
        idea: 'Counting adds 1 for each match. len() counts all items, .count() counts specific ones.',
        python: 'Use len() for total count, .count() for specific values.',
        example: 'items = ["apple", "banana", "apple"]\nprint(items.count("apple"))  # 2',
      },
    },
  },

  validation: {
    activity: {
      title: 'Check the Travel Passes',
      goal: 'Help Suraj verify that every traveler has a valid pass.',
      instructions: 'For each traveler, check their pass. Valid passes have a non-empty name. Allow or block.',
      hint: 'An empty or whitespace-only name is not valid. Strip and check.',
      completionMessage: 'Only valid travelers entered! Validation checks data before accepting it — protecting your program from bad input.',
      pythonConnection: 'In Python: is_valid = name.strip() != "" — checks if a name is not empty.',
      type: 'gate-check',
      items: [
        { id: 'v1', label: 'Pass: "Ravi"', isAllowed: true },
        { id: 'v2', label: 'Pass: "" (empty)', isAllowed: false },
        { id: 'v3', label: 'Pass: "   " (spaces)', isAllowed: false },
        { id: 'v4', label: 'Pass: "Asha"', isAllowed: true },
      ],
      targets: [
        { id: 'va', label: 'Valid — Allow', correctItemId: '' },
        { id: 'vi', label: 'Invalid — Block', correctItemId: '' },
      ],
    },
    conceptGuide: {
      whatIsIt: 'Validation checks that data meets specific rules before a program uses it. Invalid data is rejected or corrected.',
      whyUseIt: 'Bad data causes crashes and wrong results. Validation is the guard that keeps your program safe.',
      realLifeExamples: ['A form that requires an email address before submission', 'A login that checks password length'],
      pythonExamples: ['if name.strip() != "": process(name)', 'if age >= 0 and age <= 150: valid = True', 'if "@" in email: valid = True'],
      howItWorks: {
        activity: 'You checked each traveler\'s pass — valid passes were allowed through.',
        idea: 'Validation tests data against rules. If the data passes, proceed. If not, reject it.',
        python: 'Write conditions that check the data.',
        example: 'name = input("Name: ")\nif name.strip():\n    print("Welcome!")\nelse:\n    print("Invalid name.")',
      },
    },
  },

  formatting: {
    activity: {
      title: 'Decorate the Invitation',
      goal: 'Help Farah create perfect invitations by placing name and date in the right spots.',
      instructions: 'Drag the name and date values into the invitation template slots.',
      hint: 'The template has placeholders — {guest} and {date} — fill them with the correct values.',
      completionMessage: 'The invitation is perfect! Formatting combines text and values into a readable message.',
      pythonConnection: 'In Python: letter = f"Welcome, {guest}" — f-strings insert values into text.',
      type: 'drag-labels',
      items: [
        { id: 'guest', label: '"Ravi"' },
        { id: 'date', label: '"Monday"' },
      ],
      targets: [
        { id: 'slot1', label: '"Welcome, {guest}"', correctItemId: 'guest' },
        { id: 'slot2', label: '"on {date}"', correctItemId: 'date' },
      ],
    },
    conceptGuide: {
      whatIsIt: 'Formatting combines text and variable values into a readable string. f-strings make it clean and easy.',
      whyUseIt: 'Raw data looks ugly. Formatting makes output human-readable — names in messages, dates in reports, prices in receipts.',
      realLifeExamples: ['A receipt with item names and prices', 'A letter with the recipient\'s name'],
      pythonExamples: ['f"Hello, {name}"', 'f"Total: {total} coins"', 'f"Date: {day}/{month}/{year}"'],
      howItWorks: {
        activity: 'You placed names and dates into the invitation template.',
        idea: 'f-strings let you put variables directly inside text using curly braces.',
        python: 'Put f before the quote and {variable} where the value goes.',
        example: 'guest = "Ravi"\nletter = f"Welcome, {guest}!"\nprint(letter)',
      },
    },
  },

  mutation: {
    activity: {
      title: 'Shift the Mosaic Tiles',
      goal: 'Help Vikram change specific tiles in the mosaic without breaking the pattern.',
      instructions: 'Drag the correct color onto the tile that needs to change.',
      hint: 'Mutation changes one specific item in a list — be careful not to change the wrong one!',
      completionMessage: 'The mosaic is repaired! Mutation updates a specific item in a mutable collection.',
      pythonConnection: 'In Python: tiles[0] = "red" — changes only the first tile.',
      type: 'drag-labels',
      items: [
        { id: 'red', label: 'Red tile' },
        { id: 'blue', label: 'Blue tile' },
      ],
      targets: [
        { id: 't0', label: 'Tile 0 (cracked → replace)', correctItemId: 'red' },
        { id: 't1', label: 'Tile 1 (intact → keep)', correctItemId: 'blue' },
      ],
    },
    conceptGuide: {
      whatIsIt: 'Mutation changes an existing item in a mutable collection (like a list) without creating a new collection.',
      whyUseIt: 'Sometimes you need to update data in place — fix a typo, change a price, correct a score. Mutation modifies existing data directly.',
      realLifeExamples: ['Correcting a wrong entry in a spreadsheet', 'Updating a product price in a catalogue'],
      pythonExamples: ['prices[0] = 12', 'scores[2] += 5', 'names[1] = "Asha"'],
      howItWorks: {
        activity: 'You replaced a cracked tile with a new color — changing one item in place.',
        idea: 'Mutation targets a specific position and replaces its value.',
        python: 'Use square brackets with the index and = to assign a new value.',
        example: 'tiles = ["red", "blue", "green"]\ntiles[0] = "gold"\nprint(tiles)  # ["gold", "blue", "green"]',
      },
    },
  },

  modules: {
    activity: {
      title: 'The Royal Craftsmen',
      goal: 'Match each craftsman to the tool they specialize in.',
      instructions: 'Drag the tool to the craftsman who uses it. Each expert has a specific skill.',
      hint: 'A module is like a craftsman — import it to use its specific expertise.',
      completionMessage: 'Every craftsman has their tool! Modules organize specialized tools you can import and use.',
      pythonConnection: 'In Python: import math — brings in specialized math tools.',
      type: 'match-pairs',
      items: [
        { id: 'm1', label: 'math (numbers)' },
        { id: 'm2', label: 'random (random values)' },
        { id: 'm3', label: 'os (file system)' },
      ],
      targets: [
        { id: 'c1', label: 'Calculate square root', correctItemId: 'm1' },
        { id: 'c2', label: 'Pick a random winner', correctItemId: 'm2' },
        { id: 'c3', label: 'List files in folder', correctItemId: 'm3' },
      ],
      matchPairs: [
        { left: 'math', right: 'Calculate square root' },
        { left: 'random', right: 'Pick a random winner' },
        { left: 'os', right: 'List files in folder' },
      ],
    },
    conceptGuide: {
      whatIsIt: 'A module is a file containing reusable code — functions, classes, and variables — that you can import into your program.',
      whyUseIt: 'Writing everything from scratch wastes time. Modules give you tested, reliable tools from Python\'s standard library.',
      realLifeExamples: ['Borrowing a specialized tool from a workshop instead of making one', 'Using a calculator app instead of computing by hand'],
      pythonExamples: ['import math', 'import random', 'from datetime import date'],
      howItWorks: {
        activity: 'You matched craftsmen to their specialized tools — each module has a specific purpose.',
        idea: 'Import a module to gain access to its functions and capabilities.',
        python: 'Use import to bring in a module, then use its name as a prefix.',
        example: 'import math\nresult = math.sqrt(81)\nprint(result)  # 9.0',
      },
    },
  },

  sorting: {
    activity: {
      title: 'Rank the Race Results',
      goal: 'Help Lion the Umpire arrange competitors from slowest to fastest.',
      instructions: 'Drag each competitor to their correct position in the ranking.',
      hint: 'Sorting arranges items into deliberate order — smallest to largest or vice versa.',
      completionMessage: 'The ranking is fair! Sorting arranges values into a specific order.',
      pythonConnection: 'In Python: ranking = sorted(scores) — creates a new sorted list.',
      type: 'arrange-order',
      items: [
        { id: 'h1', label: 'Score: 3' },
        { id: 'h2', label: 'Score: 1' },
        { id: 'h3', label: 'Score: 2' },
      ],
      targets: [
        { id: 'rank0', label: '1st place (lowest)', correctItemId: 'h2' },
        { id: 'rank1', label: '2nd place', correctItemId: 'h3' },
        { id: 'rank2', label: '3rd place (highest)', correctItemId: 'h1' },
      ],
    },
    conceptGuide: {
      whatIsIt: 'Sorting rearranges items in a collection into a specific order — ascending, descending, or by a custom rule.',
      whyUseIt: 'Unordered data is hard to interpret. Sorting reveals rankings, trends, and patterns.',
      realLifeExamples: ['Ranking students by exam score', 'Sorting products by price from low to high'],
      pythonExamples: ['sorted([3, 1, 2])  # [1, 2, 3]', 'names.sort()', 'items.sort(key=len)'],
      howItWorks: {
        activity: 'You arranged competitors from slowest to fastest — that is sorting.',
        idea: 'sorted() takes a collection and returns a new one in order.',
        python: 'Use sorted() for a new list, or .sort() to change the original.',
        example: 'scores = [3, 1, 2]\nranked = sorted(scores)\nprint(ranked)  # [1, 2, 3]',
      },
    },
  },
};
