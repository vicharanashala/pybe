// ─────────────────────────────────────────────────────────────────────────────
// The Lost Kingdom of Python — Chapter Content
// Written in simple, everyday English — NO computer science jargon!
// Story first, everyday intuition first, Python comes at the end.
// ─────────────────────────────────────────────────────────────────────────────

export const chapters = [
  {
    id: 'chapter1',
    title: "The Packing Problem",
    subtitle: "How to keep things in order",
    color: '#39d353',
    colorDim: 'rgba(57, 211, 83, 0.12)',
    colorGlow: 'rgba(57, 211, 83, 0.3)',
    emoji: '🎒',
    xp: 200,
    order: 1,

    // ── Initial backpack items ────────────────────────────────────────────────
    initialBackpack: [
      { id: 'book',   icon: '📖', label: 'Book' },
      { id: 'water',  icon: '💧', label: 'Water Bottle' },
      { id: 'map',    icon: '🗺️', label: 'Map' },
      { id: 'torch',  icon: '🔦', label: 'Torch' },
      { id: 'food',   icon: '🍎', label: 'Food' },
    ],

    // ── Story & Mastery Scenes (Plain English) ───────────────────────────────
    scenes: [
      { id: 'welcome',       label: 'Setting Off' },
      { id: 'the_pain',      label: 'Too Many Pockets' },
      { id: 'meet_backpack', label: 'One Single Bag' },
      { id: 'add_item',      label: 'Putting Things at the End' },
      { id: 'remove_item',   label: 'Throwing Away Ruined Stuff' },
      { id: 'indexing',      label: 'Steps from the Opening' },
      { id: 'mutability',    label: 'Swapping an Item' },
      { id: 'length',        label: 'Counting Your Items' },
      { id: 'membership',    label: 'Is It in the Bag?' },
      { id: 'slicing',       label: 'Grabbing a Bunch' },
      { id: 'iteration',     label: 'Looking at Everything' },
      { id: 'discovery',     label: '✨ The Big Reveal' },
      { id: 'code_mastery',  label: '🧙‍♂️ Code Mastery' },
      { id: 'practice',      label: 'Try It Yourself' },
    ],

    // ── Scene 2: The Mess of Loose Items (Plain English) ──────────────────────
    painScene: {
      situation: 'You stop at the camp shop. You pick up 10 things: rope, torch, compass, snacks, blanket, matches, whistle, flask, map, and bandages.',
      question: 'Imagine you have no bag, so you stuff everything into 10 separate pockets all over your jacket. What happens when you need to find something quickly?',
      choices: [
        {
          id: 'mess',
          icon: '😵‍💫',
          label: 'It is a huge mess — you have to pat down and search every pocket one by one',
          correct: true,
          feedback: 'Exactly! You check pocket 1, pocket 2, pocket 3... "Did I drop the matches? Which pocket was it in?" It wastes time and creates confusion!'
        },
        {
          id: 'easy',
          icon: '🤷',
          label: 'It is super easy to remember 10 different pockets all day long',
          correct: false,
          feedback: 'Think about being tired and in the dark! Remembering 10 or 20 separate pockets quickly gets overwhelming.'
        },
        {
          id: 'one',
          icon: '✋',
          label: 'You should only ever carry one item on a trip',
          correct: false,
          feedback: 'On a long trip you need lots of items! We just need a smarter way to hold them.'
        },
      ],
      insight: 'The Lesson: Carrying items scattered across separate pockets is exhausting. It is much easier to put everything into ONE bag, lined up in a neat row!',
    },

    // ── Story Challenge data (Simple English — no code yet!) ──────────────────
    storyScenes: {
      add_item: {
        situation: 'You find a shiny Compass on the trail! You want to put it in your bag.',
        question: 'Where should the Compass go so you do not mess up the items already inside?',
        newItem: { id: 'compass', icon: '🧭', label: 'Compass' },
        choices: [
          {
            id: 'end',
            icon: '📌',
            label: 'Place it at the END of the row',
            correct: true,
            feedback: 'Spot on! Adding it to the end is clean and easy. Everything already inside stays right where it was.'
          },
          {
            id: 'front',
            icon: '⬆️',
            label: 'Shove it to the very front',
            correct: false,
            feedback: 'Shoving it in front pushes every other item back into a new spot! Putting it at the end is much simpler.'
          },
          {
            id: 'full',
            icon: '🚫',
            label: 'Leave it behind because bags cannot grow',
            correct: false,
            feedback: 'A good bag has plenty of room. It can stretch to hold more items whenever you need!'
          },
        ],
        insight: 'The Lesson: When you add something new, placing it at the end keeps your existing items in neat order.',
      },

      remove_item: {
        situation: 'Oh no! While crossing a stream, your Map falls into the water and gets completely ruined.',
        question: 'What should you do with the ruined Map?',
        removingItemId: 'map',
        choices: [
          {
            id: 'remove',
            icon: '🗑️',
            label: 'Take it out and throw it away',
            correct: true,
            feedback: 'Yes! You throw away the ruined map. The remaining items slide together so there is no empty gap.'
          },
          {
            id: 'keep',
            icon: '📦',
            label: 'Keep carrying wet, heavy paper for no reason',
            correct: false,
            feedback: 'Wet paper is useless dead weight! Throwing it away keeps your bag light and clean.'
          },
          {
            id: 'move',
            icon: '🔄',
            label: 'Move it around to a different spot',
            correct: false,
            feedback: 'Moving ruined paper to another spot still keeps useless trash in your bag!'
          },
        ],
        insight: 'The Lesson: When you remove something from the bag, the rest of your items stay in order and the bag shrinks.',
      },

      membership: {
        situation: 'The sun goes down and the woods turn pitch black. You need your Torch — but is it inside your bag?',
        question: 'How do you check if you packed the Torch?',
        choices: [
          {
            id: 'check',
            icon: '👀',
            label: 'Look straight inside: "Is Torch in here?"',
            correct: true,
            feedback: 'Yes! Because all your items are in one bag, you can see if the Torch is inside in one quick check.'
          },
          {
            id: 'dump',
            icon: '🎒',
            label: 'Dump all your supplies onto the muddy ground in the dark',
            correct: false,
            feedback: 'Dumping everything in the mud in the dark is a bad idea! You might lose other items.'
          },
          {
            id: 'guess',
            icon: '🤷',
            label: 'Guess and hope you brought it',
            correct: false,
            feedback: 'Never guess in the dark when you can just check your bag!'
          },
        ],
        insight: 'The Lesson: Having all items in one bag makes it easy to check if something is inside in a single step.',
      },
    },

    // ── Swapping an Item (Simple English) ──────────────────────────────────────
    mutabilityScene: {
      situation: 'Your Water Bottle has a leak! Another camper trades you a sturdy Flask.',
      question: 'Which item should take the place of the leaking Water Bottle in slot 1?',
      replacingItemId: 'water',
      replacingIndex: 1,
      options: [
        { id: 'flask',  icon: '🧴', label: 'Flask',     correct: true,  feedback: 'Perfect! The Flask slides right into the spot where the leaking bottle was.' },
        { id: 'apple',  icon: '🍏', label: 'Apple',     correct: false, feedback: 'An apple is great to eat, but you need something to hold water!' },
        { id: 'book2',  icon: '📚', label: 'Extra Book', correct: false, feedback: 'You already have a book. You need a flask for your drinking water.' },
      ],
      insight: 'The Lesson: Your bag is still the SAME bag. You do not need to buy a brand new bag just to swap one item inside it!',
    },

    // ── Counting Items (Simple English) ───────────────────────────────────────
    lengthScene: {
      situation: 'Before you cross a rope bridge, the bridge keeper stops you: "How many items are in your bag?"',
      question: 'How many items are in your bag right now?',
      insight: 'The Lesson: Because everything is lined up in one bag, you can count the total in one go.',
    },

    // ── Sharing a Bunch (Simple English) ──────────────────────────────────────
    slicingScene: {
      situation: 'A fellow scout asks to borrow the first 3 items from your bag.',
      question: 'Pick the items from the start up to the 3rd item to hand them over:',
      targetStart: 0,
      targetEnd: 3,
      friendRequest: 'Pick the first 3 items from the start to hand them over.',
      insight: 'The Lesson: Because your items are lined up in order, you can easily grab a whole bunch together from start to finish.',
    },

    // ── Concept Bridges for each level (Piece-by-Piece Code Mastery) ─────────
    conceptBridges: {
      the_pain: {
        conceptName: 'One Bag vs 10 Pockets',
        pythonTerm: 'supplies = ["Torch", "Map"]',
        englishExplanation: 'In everyday life, stuffing 10 items into 10 separate pockets means searching 10 different places. Python solves this by giving us a single container called a List that holds all items together in one neat, ordered place.',
        parts: [
          { code: 'supplies', label: '1. Bag Name', explanation: 'A friendly label identifying your collection of items.' },
          { code: '=', label: '2. Packed With', explanation: 'Tells Python: "this collection is packed with the following items".' },
          { code: '[  ]', label: '3. Bag Brackets', explanation: 'The walls of the bag! In Python, square brackets define a List.' },
          { code: '"Torch", "Map"', label: '4. Items & Commas', explanation: 'Each item is in quotes, separated by commas so Python keeps them in order.' },
        ],
        mcq: {
          question: 'What do square brackets [ ] mean in Python?',
          options: [
            { id: 'a', text: 'They create a List — one neat container holding items in order', correct: true, feedback: 'Spot on! Square brackets [ ] are the walls of your list holding everything together.' },
            { id: 'b', text: 'They delete all your items', correct: false, feedback: 'Square brackets hold items, they never delete!' },
            { id: 'c', text: 'They are only used for math formulas', correct: false, feedback: 'Square brackets [ ] define Python lists!' },
          ],
        },
        fillBlank: {
          instruction: 'Complete the Python list holding your supplies:',
          template: 'supplies = ____"Torch", "Map"____',
          options: ['[ and ]', '{ and }', '( and )'],
          answer: '[ and ]',
        },
        codeSnippet: 'supplies = ["Torch", "Map"]',
        codeExplanation: '🎉 You mastered how a Python list is built piece by piece! Square brackets [ ] hold your items together in one clean line.',
      },

      meet_backpack: {
        conceptName: 'The Ordered List',
        pythonTerm: 'backpack = ["Book", "Water", "Map"]',
        englishExplanation: 'When you pack your backpack, your items stay in a neat row. In Python, whenever you put items inside square brackets separated by commas, Python creates a List. The order you pack them is the exact order Python remembers!',
        parts: [
          { code: 'backpack', label: '1. The List Name', explanation: 'The label identifying our list.' },
          { code: '=', label: '2. Stores', explanation: 'Stores the list on the right into the backpack on the left.' },
          { code: '[ ... ]', label: '3. Square Brackets', explanation: 'Tells Python: "everything inside belongs to this one list".' },
          { code: ' , ', label: '4. Commas', explanation: 'Commas separate each item so Python knows where one ends and the next begins.' },
        ],
        mcq: {
          question: 'How does Python separate different items inside a list?',
          options: [
            { id: 'a', text: 'With commas (,)', correct: true, feedback: 'Spot on! Each item in a Python list is separated by a comma.' },
            { id: 'b', text: 'With exclamation marks (!)', correct: false, feedback: 'Python uses commas (,) to separate items.' },
            { id: 'c', text: 'With question marks (?)', correct: false, feedback: 'Commas are the standard separator in Python lists.' },
          ],
        },
        fillBlank: {
          instruction: 'Complete the list with commas between the items:',
          template: 'backpack = ["Book"____ "Water"____ "Map"]',
          options: [', and ,', '. and .', '; and ;'],
          answer: ', and ,',
        },
        codeSnippet: 'backpack = ["Book", "Water", "Map"]',
        codeExplanation: '🎉 Fantastic! You mastered how commas keep each item in line inside a Python list!',
      },

      add_item: {
        conceptName: 'Adding to the End',
        pythonTerm: 'backpack.append("Compass")',
        englishExplanation: 'When you found the compass on the trail, you slipped it into the end of your backpack. In Python, lists have a special action called .append(). "Append" is just an English word that means "attach to the very end".',
        parts: [
          { code: 'backpack', label: '1. The Bag', explanation: 'The name of your list holding all your items.' },
          { code: '.', label: '2. The Dot', explanation: 'Tells Python: "perform an action on this bag".' },
          { code: 'append', label: '3. The Action', explanation: 'An everyday English word meaning "attach to the very end".' },
          { code: '("Compass")', label: '4. The Item', explanation: 'Inside parentheses, you write the exact item you want to add.' },
        ],
        mcq: {
          question: 'What does the .append part of the code do?',
          options: [
            { id: 'a', text: 'Attaches the item to the very end of your list', correct: true, feedback: 'Yes! .append() always puts the new item at the very end.' },
            { id: 'b', text: 'Replaces the first item', correct: false, feedback: '.append() never replaces anything; it attaches to the end.' },
            { id: 'c', text: 'Deletes the item', correct: false, feedback: '.append() adds things, it never deletes!' },
          ],
        },
        fillBlank: {
          instruction: 'Complete the code to add "Compass" to the end of the backpack:',
          template: 'backpack._____("Compass")',
          options: ['append', 'add', 'push'],
          answer: 'append',
        },
        codeSnippet: 'backpack.append("Compass")',
        codeExplanation: '🎉 Brilliant! You mastered .append() piece by piece! Dot connects the bag to the action, and append attaches to the end.',
      },

      remove_item: {
        conceptName: 'Removing Ruined Stuff',
        pythonTerm: 'backpack.remove("Map")',
        englishExplanation: 'When the map got soaked in the stream, you took it out of your backpack. In Python, when you want to take an item out of a list by its name, you use .remove(). Python searches the list, finds that exact item, and tosses it out.',
        parts: [
          { code: 'backpack', label: '1. The Bag', explanation: 'The list we are cleaning up.' },
          { code: '.', label: '2. The Dot', explanation: 'Connects the bag to the action.' },
          { code: 'remove', label: '3. The Action', explanation: 'An English word meaning "find and take out".' },
          { code: '("Map")', label: '4. The Target', explanation: 'The exact item you want to throw away.' },
        ],
        mcq: {
          question: 'What happens when you run backpack.remove("Map")?',
          options: [
            { id: 'a', text: 'Python finds "Map" in your list and removes it', correct: true, feedback: 'Exactly! .remove("Map") cleanly takes the map out of the backpack.' },
            { id: 'b', text: 'It empties out the entire backpack', correct: false, feedback: 'It only removes the specific item named inside the parentheses.' },
            { id: 'c', text: 'It duplicates the map', correct: false, feedback: '.remove() deletes the item.' },
          ],
        },
        fillBlank: {
          instruction: 'Complete the code to discard the soaked map:',
          template: 'backpack._____("Map")',
          options: ['remove', 'delete', 'discard'],
          answer: 'remove',
        },
        codeSnippet: 'backpack.remove("Map")',
        codeExplanation: '🎉 Awesome! You mastered .remove() piece by piece! Your list stays tidy and up to date.',
      },

      indexing: {
        conceptName: 'Distance from the Opening',
        pythonTerm: 'first_item = backpack[0]',
        englishExplanation: 'At the forest gate, the guardian asked for items by counting steps from the opening. The 1st item sits right at the opening — that is 0 steps in! In Python, list positions are called "indexes", and Python always starts counting from 0. So backpack[0] is the very first item!',
        parts: [
          { code: 'backpack', label: '1. The Bag', explanation: 'The list holding our items.' },
          { code: '[  ]', label: '2. Slot Brackets', explanation: 'Square brackets attached to a list name mean: "look at this exact spot".' },
          { code: '0', label: '3. Steps In', explanation: '0 steps from the opening! This retrieves the very first item.' },
        ],
        mcq: {
          question: 'Why does backpack[0] give you the very first item?',
          options: [
            { id: 'a', text: 'Because the 1st item is at the opening — 0 steps into the bag!', correct: true, feedback: 'Spot on! Since Python counts distance from the opening, 0 is always the first item.' },
            { id: 'b', text: 'Because 0 means nothing exists', correct: false, feedback: 'In lists, 0 is the position of the first item!' },
            { id: 'c', text: 'Because Python forgot number 1', correct: false, feedback: 'Number 1 is 1 step in (the second item)!' },
          ],
        },
        fillBlank: {
          instruction: 'Complete the code to grab the very first item (0 steps in):',
          template: 'first_item = backpack[_____]',
          options: ['0', '1', 'first'],
          answer: '0',
        },
        codeSnippet: 'first_item = backpack[0]',
        codeExplanation: '🎉 Outstanding! You mastered zero-based indexing! You can look up any item using [0], [1], [2]...',
      },

      mutability: {
        conceptName: 'Swapping an Item in Place',
        pythonTerm: 'backpack[1] = "Flask"',
        englishExplanation: 'When your water bottle leaked, you did not throw away the whole backpack and buy a new one. You simply swapped the bottle at position 1 with a flask. In Python, you write backpack[1] = "Flask" to replace whatever was in that spot.',
        parts: [
          { code: 'backpack[1]', label: '1. The Spot', explanation: 'Position 1 (1 step in from opening, which is the 2nd item).' },
          { code: '=', label: '2. Replace With', explanation: 'The equals sign replaces the old item with the new one.' },
          { code: '"Flask"', label: '3. The New Item', explanation: 'The new supply sliding into that spot.' },
        ],
        mcq: {
          question: 'What does backpack[1] = "Flask" do?',
          options: [
            { id: 'a', text: 'Replaces whatever was at spot 1 with "Flask" in place', correct: true, feedback: 'Correct! You point directly to spot 1 and assign the new item.' },
            { id: 'b', text: 'Deletes the whole backpack', correct: false, feedback: 'That would lose your bag! This only swaps spot 1.' },
            { id: 'c', text: 'Creates a second backpack', correct: false, feedback: 'It updates your existing backpack in place.' },
          ],
        },
        fillBlank: {
          instruction: 'Complete the code to put "Flask" into spot 1:',
          template: 'backpack[1] = _____',
          options: ['"Flask"', 'replace("Flask")', '(Flask)'],
          answer: '"Flask"',
        },
        codeSnippet: 'backpack[1] = "Flask"',
        codeExplanation: '🎉 Incredible! You mastered updating list items in place! The list stays the same, and the item at spot 1 is swapped.',
      },

      length: {
        conceptName: 'Counting Your Items',
        pythonTerm: 'item_count = len(backpack)',
        englishExplanation: 'The bridge troll asked for the total count of items in your bag. In Python, you do not have to count by hand. Python has a built-in helper called len(), short for "length". len(backpack) counts every item and gives you the exact number.',
        parts: [
          { code: 'len', label: '1. The Counter', explanation: 'Short for the English word "length" (how many items are inside).' },
          { code: '(  )', label: '2. Enclosure', explanation: 'Parentheses wrap around what you want Python to count.' },
          { code: 'backpack', label: '3. What to Count', explanation: 'The list whose items you want measured.' },
        ],
        mcq: {
          question: 'What does len stand for in Python?',
          options: [
            { id: 'a', text: 'Length — it counts how many items are in the list', correct: true, feedback: 'Exactly! len() gives you the total number of items.' },
            { id: 'b', text: 'Lens — for zooming into text', correct: false, feedback: 'len is short for length!' },
            { id: 'c', text: 'Line — draws a line', correct: false, feedback: 'len() measures how many items are inside.' },
          ],
        },
        fillBlank: {
          instruction: 'Complete the code to get the length of the backpack:',
          template: 'item_count = _____(backpack)',
          options: ['len', 'count', 'size'],
          answer: 'len',
        },
        codeSnippet: 'item_count = len(backpack)',
        codeExplanation: '🎉 Great job! You mastered len() piece by piece! You can count any list in Python with len(list_name).',
      },

      membership: {
        conceptName: 'Is It in the Bag?',
        pythonTerm: 'has_torch = "Torch" in backpack',
        englishExplanation: 'When darkness fell, you needed to know if you had your torch. In Python, you can check if an item exists inside a list using the simple English word "in". Python looks inside the list and replies with either True or False.',
        parts: [
          { code: '"Torch"', label: '1. Search Item', explanation: 'The supply you need to find.' },
          { code: 'in', label: '2. English Question', explanation: 'The Python keyword asking: "is this item inside...?"' },
          { code: 'backpack', label: '3. Where to Search', explanation: 'The list being searched.' },
        ],
        mcq: {
          question: 'What does "Torch" in backpack evaluate to if the torch is inside?',
          options: [
            { id: 'a', text: 'True', correct: true, feedback: 'Yes! "Torch" in backpack evaluates to True because it is inside.' },
            { id: 'b', text: 'False', correct: false, feedback: 'If the torch is in your backpack, it returns True!' },
            { id: 'c', text: '"Torch"', correct: false, feedback: 'It returns a yes/no answer: True or False.' },
          ],
        },
        fillBlank: {
          instruction: 'Complete the code to check if "Torch" is in the backpack:',
          template: 'has_torch = "Torch" _____ backpack',
          options: ['in', 'inside', 'has'],
          answer: 'in',
        },
        codeSnippet: 'has_torch = "Torch" in backpack',
        codeExplanation: '🎉 Fantastic! You mastered the "in" keyword piece by piece! Python answers with True or False.',
      },

      slicing: {
        conceptName: 'Grabbing a Bunch',
        pythonTerm: 'friend_share = backpack[0 : 3]',
        englishExplanation: 'When a friend needed supplies, you grabbed a continuous bunch from position 0 up to position 3. In Python, taking a sub-portion of a list is called "slicing". You write backpack[0:3]. Python starts at index 0 and stops right before index 3.',
        parts: [
          { code: 'backpack', label: '1. The Bag', explanation: 'The list you are taking items from.' },
          { code: '[  ]', label: '2. Range Brackets', explanation: 'Square brackets specify the slice.' },
          { code: '0', label: '3. Start Position', explanation: 'Where the slice begins (inclusive).' },
          { code: ':', label: '4. The Colon', explanation: 'Colon means "through to".' },
          { code: '3', label: '5. Stop Position', explanation: 'Where the slice stops (takes up to spot 2, stops before 3).' },
        ],
        mcq: {
          question: 'What does the colon : inside [0:2] mean?',
          options: [
            { id: 'a', text: 'It marks the range from the start position through to the stop position', correct: true, feedback: 'Spot on! In Python slicing, start:end takes items from start up to end.' },
            { id: 'b', text: 'It divides numbers', correct: false, feedback: 'Inside square brackets, : means a slice range!' },
            { id: 'c', text: 'It pauses the computer', correct: false, feedback: ': specifies the slice boundaries.' },
          ],
        },
        fillBlank: {
          instruction: 'Complete the slice to take items from position 0 up to 3:',
          template: 'friend_share = backpack[0 : _____]',
          options: ['3', 'end', 'all'],
          answer: '3',
        },
        codeSnippet: 'friend_share = backpack[0:3]',
        codeExplanation: '🎉 Amazing! You mastered list slicing piece by piece! [0:3] grabs positions 0, 1, and 2.',
      },

      iteration: {
        conceptName: 'Looking at Everything',
        pythonTerm: "for item in backpack:\n    print(item)",
        englishExplanation: 'Around the campfire, you took out each item one by one and showed it to everyone. In Python, doing something with each item in a list from first to last is called a "for loop". You write: for item in backpack: print(item).',
        parts: [
          { code: 'for', label: '1. For Each...', explanation: 'Tells Python to repeat an action for every item.' },
          { code: 'item', label: '2. Current Supply', explanation: 'A temporary name for the supply you are currently holding.' },
          { code: 'in backpack', label: '3. In This Bag', explanation: 'The list Python will step through.' },
          { code: ':', label: '4. Do This:', explanation: 'The colon means "here is what to do with each item:".' },
          { code: 'print(item)', label: '5. Action', explanation: 'Shows each item one by one.' },
        ],
        mcq: {
          question: 'What does for item in backpack: do in Python?',
          options: [
            { id: 'a', text: 'It visits every item in the list one by one, in order', correct: true, feedback: 'Exactly! A for loop steps through every element in the list from start to finish.' },
            { id: 'b', text: 'It deletes the entire list', correct: false, feedback: 'A loop visits items; it does not delete them.' },
            { id: 'c', text: 'It only looks at the very first item', correct: false, feedback: 'It visits ALL items in the list, one by one!' },
          ],
        },
        fillBlank: {
          instruction: 'Complete the Python loop to look at each item:',
          template: '_____ item in backpack:',
          options: ['for', 'each', 'loop'],
          answer: 'for',
        },
        codeSnippet: 'for item in backpack:\n    print(item)',
        codeExplanation: '🎉 Spectacular! You mastered the for loop piece by piece! It visits every item from start to finish.',
      },
    },

    // ── Practice: Matching pairs (After the Big Reveal) ──────────────────────
    matching: [
      { story: 'The bag holding items in a row',  python: 'list  [ ... ]' },
      { story: 'Add an item to the end',          python: '.append()' },
      { story: 'Remove an item',                  python: '.remove()' },
      { story: 'Steps from the opening',          python: '[0], [1], [2]...' },
      { story: 'Swap an item in place',           python: 'bag[1] = "Flask"' },
      { story: 'Count how many items are inside', python: 'len()' },
      { story: 'Check if an item is inside',      python: '"Torch" in bag' },
    ],

    // ── Practice: Fill in the Blank ──────────────────────────────────────────
    fillBlanks: [
      {
        id: 'fb1',
        instruction: 'Create the bag with three items using square brackets [ ]:',
        template: 'backpack = _____',
        options: [
          '["Book", "Water", "Torch"]',
          '("Book", "Water", "Torch")',
          '{"Book", "Water", "Torch"}',
          '"Book", "Water", "Torch"'
        ],
        answer: '["Book", "Water", "Torch"]',
        hint: 'In Python, a List uses square brackets [ ] with items separated by commas.',
      },
      {
        id: 'fb2',
        instruction: 'Add "Compass" to the end of the bag:',
        template: 'backpack._____("Compass")',
        options: ['append', 'add', 'push', 'insert'],
        answer: 'append',
        hint: '.append() puts an item at the very end of the list.',
      },
      {
        id: 'fb3',
        instruction: 'Get the first item (0 steps from the opening):',
        template: 'first_item = backpack[_____]',
        options: ['0', '1', 'first', '-1'],
        answer: '0',
        hint: 'The first item is right at the start: 0 steps in.',
      },
      {
        id: 'fb4',
        instruction: 'Swap the item at spot 1 with "Flask":',
        template: 'backpack[1] = _____',
        options: ['"Flask"', '"Water"', 'Flask', '1'],
        answer: '"Flask"',
        hint: 'backpack[1] = "Flask" puts the Flask directly into spot 1.',
      },
      {
        id: 'fb5',
        instruction: 'Count how many items are in the bag:',
        template: 'total = _____(backpack)',
        options: ['len', 'count', 'size', 'length'],
        answer: 'len',
        hint: 'len() counts how many items are inside.',
      },
    ],

    // ── Practice: Predict the Output ─────────────────────────────────────────
    quiz: [
      {
        id: 'q1',
        question: 'supplies = ["Map", "Water", "Torch"]\nprint(supplies[0])',
        options: ['"Map"', '"Water"', '"Torch"', 'Error'],
        correct: 0,
        explanation: 'Position 0 is the very first item at the start: "Map".'
      },
      {
        id: 'q2',
        question: 'supplies = ["Map", "Water"]\nsupplies.append("Food")\nprint(len(supplies))',
        options: ['3', '2', '1', '"Food"'],
        correct: 0,
        explanation: 'We started with 2 items, added 1 to the end, so len() gives 3.'
      },
      {
        id: 'q3',
        question: 'print("Compass" in ["Map", "Torch", "Water"])',
        options: ['False', 'True', 'Error', '"Compass"'],
        correct: 0,
        explanation: '"Compass" is not inside that list, so Python answers False.'
      },
      {
        id: 'q4',
        question: 'items = ["A", "B", "C", "D"]\nprint(items[0:2])',
        options: ['["A", "B"]', '["A", "B", "C"]', '["B", "C"]', 'Error'],
        correct: 0,
        explanation: 'items[0:2] grabs from spot 0 up to spot 2: ["A", "B"].'
      },
    ],

    // ── Practice: Code Challenge ─────────────────────────────────────────────
    challenge: {
      prompt: 'Your backpack starts with ["Map", "Water"]. Add "Torch" to the end. Change "Map" (spot 0) to "Compass". Then print the second item (spot 1).',
      starterCode:
`backpack = ["Map", "Water"]

# Add "Torch" to the end


# Change "Map" (spot 0) to "Compass"


# Print the second item (spot 1)
print()`,
      patterns: [
        { regex: /\.append\s*\(\s*["']Torch["']\s*\)/, error: 'Use .append("Torch") to add Torch to the end' },
        { regex: /backpack\s*\[\s*0\s*\]\s*=\s*["']Compass["']/, error: 'Use backpack[0] = "Compass" to change the first item' },
        { regex: /print\s*\(\s*backpack\s*\[\s*1\s*\]\s*\)/, error: 'Use print(backpack[1]) to print the second item' }
      ],
      hint: 'Step 1: backpack.append("Torch")  Step 2: backpack[0] = "Compass"  Step 3: print(backpack[1])',
      successMessage: '🎒 Great job! You added, swapped, and looked up items with ease!'
    },

    // ── Final Challenge ──────────────────────────────────────────────────────
    finalChallenge: {
      prompt: `Your backpack has: ["Map", "Water", "Food"]

Do these 4 tasks:
1. Add "Torch" to the end
2. Remove "Food" (ruined)
3. Print the second item (spot 1)
4. Flip the bag order for the way home`,
      starterCode:
`backpack = ["Map", "Water", "Food"]

# 1. Add "Torch" to the end


# 2. Remove "Food"


# 3. Print the second item


# 4. Flip the order for the way home


print("Final backpack:", backpack)`,
      patterns: [
        { regex: /\.append\s*\(\s*["']Torch["']\s*\)/, error: 'Task 1: Use backpack.append("Torch")' },
        { regex: /\.remove\s*\(\s*["']Food["']\s*\)/, error: 'Task 2: Use backpack.remove("Food")' },
        { regex: /print\s*\(\s*backpack\s*\[\s*1\s*\]\s*\)/, error: 'Task 3: Use print(backpack[1])' },
        { regex: /\.reverse\s*\(\s*\)/, error: 'Task 4: Use backpack.reverse()' },
      ],
      hint: 'append("Torch") -> remove("Food") -> print(backpack[1]) -> backpack.reverse()',
      successMessage: '🏆 CHAMPION! You solved the packing problem and mastered Python Lists!'
    },
  },
];

export function getChapter(id) {
  return chapters.find((c) => c.id === id) || null;
}

export function getNextChapterId(currentId) {
  return null;
}
