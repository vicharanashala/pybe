import React, { useState } from 'react';
import { ArrowRight, BookOpen, BrainCircuit, Sparkles } from 'lucide-react';

const STORY_PROGRESS_KEY = 'pybe-story-learning-progress';

function readStoryProgress() {
  if (typeof window === 'undefined') {
    return { scores: {}, recentStory: null };
  }

  try {
    const stored = window.localStorage.getItem(STORY_PROGRESS_KEY);
    return stored ? JSON.parse(stored) : { scores: {}, recentStory: null };
  } catch (error) {
    return { scores: {}, recentStory: null };
  }
}

function saveStoryProgress(progress) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORY_PROGRESS_KEY, JSON.stringify(progress));
  window.dispatchEvent(new Event('story-progress-updated'));
}

const BASE_STORY_CATALOG = [
  {
    id: 'conditionals',
    title: 'The Lantern Trail',
    concept: 'Conditionals',
    summary:
      'Mina wandered through a moonlit garden, carrying a small lantern and following a narrow path between tall hedges. At every gate, she paused to read the color of the lock. If the lock was blue, she turned left; if it was red, she turned right. She kept moving carefully, one step after another, until the final gate opened and revealed the light she had been searching for.',
    assignmentQuestions: [
      {
        id: 'c1',
        prompt: 'What did Mina do when she reached each gate?',
        options: [
          { id: 'c1-a', label: 'She followed a rule and made a choice', isCorrect: true, explanation: 'Correct! Mina used a clear rule at each gate, which is similar to making a decision in a program.' },
          { id: 'c1-b', label: 'She ignored the gate and ran past it', isCorrect: false, explanation: 'Not quite. She paused and paid attention to the gate, which is more like following instructions carefully.' },
          { id: 'c1-c', label: 'She waited for someone else to guide her', isCorrect: false, explanation: 'Not quite. Mina made the choice herself based on the rule she knew.' }
        ]
      },
      {
        id: 'c2',
        prompt: 'What best describes the way Mina moved through the garden?',
        options: [
          { id: 'c2-a', label: 'She moved step by step until the goal was reached', isCorrect: true, explanation: 'Correct! Her path was built from repeated steps that eventually led to the goal.' },
          { id: 'c2-b', label: 'She changed direction randomly every time', isCorrect: false, explanation: 'Not quite. Her choices were guided by a pattern, not random movement.' },
          { id: 'c2-c', label: 'She stopped after the first gate', isCorrect: false, explanation: 'Not quite. She kept going through the sequence until she reached the end.' }
        ]
      },
      {
        id: 'c3',
        prompt: 'What did the story teach about making choices?',
        options: [
          { id: 'c3-a', label: 'Choices can be made by following a clear condition', isCorrect: true, explanation: 'Correct! The story shows that choices can be based on a condition or rule.' },
          { id: 'c3-b', label: 'Choices should be made by guessing', isCorrect: false, explanation: 'Not quite. Guessing does not explain the pattern in the story.' },
          { id: 'c3-c', label: 'Choices should be postponed', isCorrect: false, explanation: 'Not quite. The story shows that the choice was made at each step and carried forward.' }
        ]
      },
      {
        id: 'c4',
        prompt: 'Which idea feels most similar to Mina’s journey?',
        options: [
          { id: 'c4-a', label: 'A sequence of actions that repeats until something happens', isCorrect: true, explanation: 'Correct! Mina kept repeating the same kind of action until she reached the final goal.' },
          { id: 'c4-b', label: 'A story that never reaches the end', isCorrect: false, explanation: 'Not quite. The story clearly reaches a final destination and a completed path.' },
          { id: 'c4-c', label: 'A random event with no pattern', isCorrect: false, explanation: 'Not quite. The journey is structured and follows a meaningful pattern.' }
        ]
      }
    ],
    keyFindings: [
      'The story shows a decision point that resembles an if/else condition in Python.',
      'The repeated walk through the gates mirrors a loop that repeats until a goal is reached.',
      'Programming becomes easier when stories help us see rules, repetition, and outcomes.'
    ],
    pythonConcept: 'Conditionals',
    pythonExplanation: 'Python uses if/elif/else statements for decisions.',
    sampleCode: `for gate in ['blue', 'red', 'green']:\n    if gate == 'blue':\n        print('Turn left')\n    else:\n        print('Turn right')`
  },
  {
    id: 'variables',
    title: 'The Name in the Lantern',
    concept: 'Variables',
    summary:
      'Ari found a lantern beside a fountain and noticed that each time he whispered the keeper’s name, the light changed color. He learned that the name could be saved in his memory and used again whenever he needed to call the keeper, and he felt proud that one small piece of information could stay ready for later in his mind.',
    assignmentQuestions: [
      {
        id: 'v1',
        prompt: 'What did Ari learn about the keeper’s name?',
        options: [
          { id: 'v1-a', label: 'It could be remembered and used later', isCorrect: true, explanation: 'Correct! The name was stored in memory and reused later.' },
          { id: 'v1-b', label: 'It disappeared after one use', isCorrect: false, explanation: 'Not quite. The story shows the name stayed available for later use.' },
          { id: 'v1-c', label: 'It only worked at night', isCorrect: false, explanation: 'Not quite. The idea is about saving information, not about time.' }
        ]
      },
      {
        id: 'v2',
        prompt: 'What does the lantern represent in this story?',
        options: [
          { id: 'v2-a', label: 'A place to keep information for later', isCorrect: true, explanation: 'Correct! The lantern acts like a container for stored information.' },
          { id: 'v2-b', label: 'A random object with no use', isCorrect: false, explanation: 'Not quite. It has an important purpose in the story.' },
          { id: 'v2-c', label: 'A map that stays hidden', isCorrect: false, explanation: 'Not quite. The focus is on remembering and reusing information.' }
        ]
      },
      {
        id: 'v3',
        prompt: 'What is the main lesson of the story?',
        options: [
          { id: 'v3-a', label: 'Information can be saved and used again', isCorrect: true, explanation: 'Correct! That is the key idea behind variables.' },
          { id: 'v3-b', label: 'Information should be forgotten quickly', isCorrect: false, explanation: 'Not quite. The story highlights keeping information available.' },
          { id: 'v3-c', label: 'Information only matters once', isCorrect: false, explanation: 'Not quite. The story shows it matters more than once.' }
        ]
      }
    ],
    keyFindings: [
      'The story introduces the idea of storing information for later use.',
      'It shows that a value can be kept in one place and used again when needed.',
      'This is similar to how variables hold data in Python.'
    ],
    pythonConcept: 'Variables',
    pythonExplanation: 'In Python, variables store values so they can be used later in a program.',
    sampleCode: `name = "Ari"\nprint("Hello, " + name)`
  },
  {
    id: 'loops',
    title: 'The Clockmaker’s Path',
    concept: 'Loops',
    summary:
      'A clockmaker placed tiny gears on a table and turned the same handle again and again until every gear clicked into place. He kept repeating the same motion while the morning light grew brighter, and he smiled when he saw the clock begin to tick with steady rhythm and announce that the work was finally done for everyone nearby that day.',
    assignmentQuestions: [
      {
        id: 'l1',
        prompt: 'What did the clockmaker keep doing?',
        options: [
          { id: 'l1-a', label: 'He repeated the same action until the goal was reached', isCorrect: true, explanation: 'Correct! Repeating the same action helped complete the task.' },
          { id: 'l1-b', label: 'He stopped after one turn', isCorrect: false, explanation: 'Not quite. The story shows that he kept going until the clock was ready.' },
          { id: 'l1-c', label: 'He changed the goal each time', isCorrect: false, explanation: 'Not quite. The goal stayed the same throughout the story.' }
        ]
      },
      {
        id: 'l2',
        prompt: 'What is the main idea in the story?',
        options: [
          { id: 'l2-a', label: 'Doing something again and again can finish a task', isCorrect: true, explanation: 'Correct! Repeating the same action leads to completion.' },
          { id: 'l2-b', label: 'Doing it once is enough', isCorrect: false, explanation: 'Not quite. Repetition is the important idea here.' },
          { id: 'l2-c', label: 'Changing plans every time is best', isCorrect: false, explanation: 'Not quite. The story points to steady repetition.' }
        ]
      }
    ],
    keyFindings: [
      'The story shows how repeated actions can build toward a final result.',
      'It highlights the idea of doing something again until a goal is finished.',
      'This connects closely to loops in Python.'
    ],
    pythonConcept: 'Loops',
    pythonExplanation: 'Loops let a program repeat actions multiple times without rewriting the same code.',
    sampleCode: `for step in range(3):\n    print("Turn the handle")`
  },
  {
    id: 'lists',
    title: 'The Market Basket',
    concept: 'Lists',
    summary:
      'Tara visited a market and placed each item she wanted into a basket one by one. She noticed that the basket could hold many things at once, and she could look at them in order whenever she wanted. As she walked home, she realized the basket had become a simple way to keep several things together in one place for later.',
    assignmentQuestions: [
      {
        id: 'm1',
        prompt: 'What did Tara place into the basket?',
        options: [
          { id: 'm1-a', label: 'Several items one by one', isCorrect: true, explanation: 'Correct! Tara collected multiple things in the basket.' },
          { id: 'm1-b', label: 'Only one item', isCorrect: false, explanation: 'Not quite. The basket was meant to hold more than one thing.' },
          { id: 'm1-c', label: 'Nothing at all', isCorrect: false, explanation: 'Not quite. Tara clearly collected items for the basket.' }
        ]
      },
      {
        id: 'm2',
        prompt: 'What does the basket represent?',
        options: [
          { id: 'm2-a', label: 'A group of items stored together', isCorrect: true, explanation: 'Correct! The basket represents a collection of values.' },
          { id: 'm2-b', label: 'A single piece of information', isCorrect: false, explanation: 'Not quite. The basket holds many items at once.' },
          { id: 'm2-c', label: 'A hidden path', isCorrect: false, explanation: 'Not quite. The focus is on grouping items together.' }
        ]
      }
    ],
    keyFindings: [
      'The story shows that many items can be grouped together.',
      'It introduces the idea of keeping things in a collection.',
      'This is similar to lists in Python.'
    ],
    pythonConcept: 'Lists',
    pythonExplanation: 'Lists let you store multiple items in one place and access them in order.',
    sampleCode: `items = ["apple", "bread", "milk"]\nprint(items[0])`
  },
  {
    id: 'functions',
    title: 'The Mapmaker’s Helper',
    concept: 'Functions',
    summary:
      'A mapmaker had a special helper who could draw a path whenever the village needed directions. Instead of drawing the path from scratch each time, the helper followed a known set of steps and completed the job quickly, making the mapmaker’s work easier and saving precious time during busy days for every traveler who came to town at sunrise. Soon, every new map began with the same trusted routine.',
    assignmentQuestions: [
      {
        id: 'f1',
        prompt: 'What did the helper do for the mapmaker?',
        options: [
          { id: 'f1-a', label: 'It completed a repeated task whenever it was needed', isCorrect: true, explanation: 'Correct! The helper performed the same job whenever called upon.' },
          { id: 'f1-b', label: 'It made a new map every time without guidance', isCorrect: false, explanation: 'Not quite. The helper used a known set of steps.' },
          { id: 'f1-c', label: 'It did nothing helpful', isCorrect: false, explanation: 'Not quite. The helper had a clear purpose in the story.' }
        ]
      },
      {
        id: 'f2',
        prompt: 'What is the important lesson here?',
        options: [
          { id: 'f2-a', label: 'A task can be reused by following the same steps', isCorrect: true, explanation: 'Correct! This is the core idea behind functions.' },
          { id: 'f2-b', label: 'Each task should be redrawn from scratch', isCorrect: false, explanation: 'Not quite. The helper avoids doing that by following a set routine.' },
          { id: 'f2-c', label: 'Only people can solve these tasks', isCorrect: false, explanation: 'Not quite. The helper is a symbol for a reusable process.' }
        ]
      }
    ],
    keyFindings: [
      'The story shows that a task can be repeated through a shared process.',
      'It introduces the idea of using the same steps whenever needed.',
      'This is similar to functions in Python.'
    ],
    pythonConcept: 'Functions',
    pythonExplanation: 'Functions let you group a set of instructions into one reusable block of code.',
    sampleCode: `def draw_path():\n    print("Follow the road")\n\ndraw_path()`
  },
  {
    id: 'dictionaries',
    title: 'The Keeper’s Desk',
    concept: 'Dictionaries',
    summary:
      'At the keeper’s desk, every object had a special label that told the caretaker exactly where it belonged. When the keeper needed something, the label helped them find it quickly without searching the whole room, and the careful system made every task feel easier and more organized for the busy morning ahead in the old house that day for everyone.',
    assignmentQuestions: [
      {
        id: 'd1',
        prompt: 'What did the labels help the keeper do?',
        options: [
          { id: 'd1-a', label: 'Find items quickly', isCorrect: true, explanation: 'Correct! The labels gave a clear way to locate things.' },
          { id: 'd1-b', label: 'Hide items from sight', isCorrect: false, explanation: 'Not quite. The labels helped with finding, not hiding.' },
          { id: 'd1-c', label: 'Break the desk apart', isCorrect: false, explanation: 'Not quite. The story is about organization, not destruction.' }
        ]
      },
      {
        id: 'd2',
        prompt: 'What idea does the desk represent?',
        options: [
          { id: 'd2-a', label: 'A way to connect names with values', isCorrect: true, explanation: 'Correct! This is similar to how dictionaries pair keys with values.' },
          { id: 'd2-b', label: 'A single random item', isCorrect: false, explanation: 'Not quite. The desk organizes many pieces of information.' },
          { id: 'd2-c', label: 'A path with no direction', isCorrect: false, explanation: 'Not quite. The labels make the items easy to find.' }
        ]
      }
    ],
    keyFindings: [
      'The story shows that information can be organized using labels.',
      'It introduces the idea of connecting one thing to another.',
      'This is similar to dictionaries in Python.'
    ],
    pythonConcept: 'Dictionaries',
    pythonExplanation: 'Dictionaries store data as key-value pairs, so each item can be found by its label.',
    sampleCode: `student = {"name": "Ava", "age": 12}\nprint(student["name"])`
  },
  {
    id: 'strings',
    title: 'The Whispering River',
    concept: 'Strings',
    summary:
      'A traveler stood by a whispering river and listened as the water carried secret messages from one shore to another. Each message was made of letters that could be read and repeated aloud, and the traveler smiled because every small string of words seemed to carry a hidden meaning waiting to be understood by the listening wind at dusk that evening.',
    assignmentQuestions: [
      {
        id: 's1',
        prompt: 'What was moving through the river?',
        options: [
          { id: 's1-a', label: 'Messages made of letters', isCorrect: true, explanation: 'Correct! The river carried text-like messages.' },
          { id: 's1-b', label: 'Only numbers', isCorrect: false, explanation: 'Not quite. The story focuses on words and letters.' },
          { id: 's1-c', label: 'No message at all', isCorrect: false, explanation: 'Not quite. The river carried something meaningful.' }
        ]
      },
      {
        id: 's2',
        prompt: 'What is the main lesson of the story?',
        options: [
          { id: 's2-a', label: 'Text can be read and used as information', isCorrect: true, explanation: 'Correct! The story is about messages made of letters.' },
          { id: 's2-b', label: 'Only sounds matter', isCorrect: false, explanation: 'Not quite. The messages are made of written characters.' },
          { id: 's2-c', label: 'Numbers are better than words', isCorrect: false, explanation: 'Not quite. The story centers on text rather than numbers.' }
        ]
      }
    ],
    keyFindings: [
      'The story is about communicating through text.',
      'It shows that letters can be combined to form messages.',
      'This is similar to strings in Python.'
    ],
    pythonConcept: 'Strings',
    pythonExplanation: 'Strings are sequences of characters used to represent text in Python.',
    sampleCode: `message = "hello"\nprint(message)`
  },
  {
    id: 'classes',
    title: 'The Toymaker’s Workshop',
    concept: 'Classes and Objects',
    summary:
      'A toymaker built a special kind of toy that always knew how to smile, dance, and wave. Each toy was made from the same design, but each one could still have its own personality and color, and the toymaker loved how one shared plan could create many different little companions for children across the village that winter. The workshop became busy, yet the blueprint kept every creation recognizable and improved.',
    assignmentQuestions: [
      {
        id: 'o1',
        prompt: 'What did the toymaker build?',
        options: [
          { id: 'o1-a', label: 'Toys from the same design', isCorrect: true, explanation: 'Correct! The toys were created from one shared blueprint.' },
          { id: 'o1-b', label: 'Only one toy', isCorrect: false, explanation: 'Not quite. The story describes many toys made from the same idea.' },
          { id: 'o1-c', label: 'A broken machine', isCorrect: false, explanation: 'Not quite. The toys were made carefully and worked well.' }
        ]
      },
      {
        id: 'o2',
        prompt: 'What is the important lesson here?',
        options: [
          { id: 'o2-a', label: 'Many objects can come from one shared blueprint', isCorrect: true, explanation: 'Correct! This is similar to how classes and objects work.' },
          { id: 'o2-b', label: 'Every object must be completely different', isCorrect: false, explanation: 'Not quite. The story shows they can share the same design but still vary.' },
          { id: 'o2-c', label: 'Objects cannot have their own features', isCorrect: false, explanation: 'Not quite. The toys had unique personality and color.' }
        ]
      }
    ],
    keyFindings: [
      'The story shows that many objects can be created from one design.',
      'It highlights the idea of shared structure with individual differences.',
      'This is similar to classes and objects in Python.'
    ],
    pythonConcept: 'Classes and Objects',
    pythonExplanation: 'Classes define a blueprint, and objects are individual instances created from that blueprint.',
    sampleCode: `class Toy:\n    def __init__(self, color):\n        self.color = color\n\nmy_toy = Toy("blue")`
  }
];

const STORY_VARIANTS = {
  Conditionals: [
    { id: 'conditionals-weather-station', title: 'The Weather Station Signal', summary: 'Every morning, Jo checked the small weather station beside the school garden. If the flag pointed east, she opened the greenhouse windows; if it pointed west, she closed them before the rain arrived. When the flag stood still, she asked the caretaker for help. By matching each observation with an action, Jo protected the plants and learned that clear rules can guide decisions.' },
    { id: 'conditionals-bakery-orders', title: 'The Bakery Order Bell', summary: 'At the bakery, Sam watched the order bell beside the counter. If it rang once, he packed a loaf; if it rang twice, he added a pastry; otherwise, he waited for another signal. Customers received the right items because Sam checked the bell before acting. The simple routine helped him make careful choices, showing how conditions connect information to different outcomes.' },
    { id: 'conditionals-bridge-lights', title: 'The Bridge of Colored Lights', summary: 'Lena guided travelers across an old bridge by reading three colored lights. Green meant continue, yellow meant slow down, and red meant stop at the gate. She never guessed which instruction to follow because each light supplied a clear rule. As evening fell, every traveler crossed safely. Lena realized that programs can inspect a situation and choose an action that matches it.' },
    { id: 'conditionals-library-card', title: 'The Library Card Check', summary: 'Before lending a rare book, the librarian checked each visitor’s card. If the card was current, she recorded the loan; if it had expired, she asked the visitor to renew it. A missing card meant the book stayed on the shelf. The librarian’s careful process kept the collection safe and showed how programs can respond differently when their input changes.' }
  ],
  Variables: [
    { id: 'variables-garden-labels', title: 'The Garden Labels', summary: 'Nia planted three rows of herbs and wrote each plant’s name on a wooden label. Later, she recorded the number of leaves beside the name, replacing the number whenever a new count was ready. Because each label kept useful information nearby, she could check the garden without starting over. Nia discovered that a stored value can change while its name remains familiar.' },
    { id: 'variables-train-tickets', title: 'The Train Ticket Counter', summary: 'At the station, Omar kept the next ticket number on a small chalkboard. Each time a traveler arrived, he read the number, handed over the ticket, and updated the board for the next person. The board held one changing piece of information that the counter reused all afternoon. Omar saw how a name can point to a value that changes over time.' },
    { id: 'variables-recipe-notebook', title: 'The Recipe Notebook', summary: 'Maya prepared soup for a crowded shelter and wrote the current amount of water in her recipe notebook. When more guests arrived, she changed that number and used it while measuring the other ingredients. The notebook prevented her from forgetting the latest amount. She learned that a labeled place for information makes changing details easier to remember and reuse.' },
    { id: 'variables-kite-festival', title: 'The Kite Festival Score', summary: 'During the kite festival, Ravi kept each team’s score on a card with the team name at the top. After every successful flight, he updated the matching score instead of writing a new card. The names stayed the same while the numbers changed. By the final round, everyone could read the latest totals and understand how stored values support an ongoing task.' }
  ],
  Loops: [
    { id: 'loops-lighthouse', title: 'The Lighthouse Sweep', summary: 'Each night, a lighthouse keeper walked the same circle around the lantern room, checking one window after another. He repeated the inspection while any window remained dirty, then stopped when every pane shone clearly. The routine saved him from forgetting a window and made the lighthouse dependable. His work showed how repetition can continue until a condition says the job is complete.' },
    { id: 'loops-bus-route', title: 'The Morning Bus Route', summary: 'A bus driver followed the same route through town, stopping at every marked station to welcome passengers. She repeated the stop, check, and departure pattern until the final station appeared. The route was familiar, but each passenger made the trip important. By treating each station as another step in one repeated process, she reached the destination without rewriting her plan.' },
    { id: 'loops-orchard', title: 'The Orchard Count', summary: 'In the orchard, Mateo counted apples from one tree at a time and added each result to his notebook. He continued through every row until no trees remained. The same counting action made the large harvest manageable and gave him a reliable total. Mateo realized that a loop can apply one set of instructions repeatedly across many items in a collection.' },
    { id: 'loops-puzzle-box', title: 'The Puzzle Box Wheels', summary: 'A puzzle box had four wheels, and Priya tested one position on each wheel in sequence. She repeated the careful turn and check until the hidden mark appeared. Randomly twisting everything would have been confusing, but the repeated routine kept her focused. When the box opened, Priya understood how loops turn many similar small actions into steady progress.' }
  ],
  Lists: [
    { id: 'lists-packing-list', title: 'The Expedition Packing List', summary: 'Before an expedition, Elias wrote every needed item in order: water, rope, map, and compass. He crossed items off as they entered his backpack and added sunscreen when the forecast changed. The list kept many related values together while preserving their order. Elias could inspect, update, and use one collection instead of carrying separate notes for every item.' },
    { id: 'lists-music-playlist', title: 'The Rooftop Playlist', summary: 'For a rooftop concert, Sora arranged songs in a playlist that matched the evening’s mood. She added an opening tune, moved one song later, and removed a track that no longer fit. The playlist held many pieces of information in a meaningful order. Sora learned that a collection can be changed while still giving each item a clear place.' },
    { id: 'lists-class-roster', title: 'The Class Roster', summary: 'Mr. Chen kept a class roster with every learner’s name in arrival order. When a new learner joined, he added the name to the collection, then checked the list during attendance. One place held all the names, making them easy to visit one by one. The roster showed how lists organize related values so a program can process them together.' },
    { id: 'lists-photo-album', title: 'The Traveling Photo Album', summary: 'A traveling photo album collected memories from every family that borrowed it. Each family placed a picture at the next open position and wrote a short caption beneath it. Readers could move through the pages from beginning to end and add new memories later. The album made a growing sequence of related items easy to store, inspect, and share.' }
  ],
  Dictionaries: [
    { id: 'dictionaries-museum-cases', title: 'The Museum Case Labels', summary: 'At the museum, each display case had a label such as “ancient coins” or “sea maps.” When a visitor asked about a collection, the guide used its label to find the matching description immediately. The labels connected names to useful information, so searching stayed quick even as the museum grew. The system reminded her of key-value pairs.' },
    { id: 'dictionaries-pet-shelter', title: 'The Shelter Records', summary: 'At the animal shelter, Diego recorded each pet’s name with its age, favorite food, and kennel number. When a volunteer asked about Luna, Diego looked up Luna’s record and found the needed details together. Names served as reliable keys to organized values. The record system helped the busy shelter answer questions without searching every paper.' },
    { id: 'dictionaries-town-map', title: 'The Town Map Directory', summary: 'A town map included a directory where each place name pointed to an address and a short description. Visitors could look up “bakery” or “clinic” and receive the matching details without scanning the entire map. The directory grew as new businesses opened. Its labeled connections showed how dictionaries make related information easy to retrieve.' },
    { id: 'dictionaries-inventory-cabinet', title: 'The Inventory Cabinet', summary: 'In the repair shop, Mei tracked supplies by giving every item a clear name. “Copper wire” pointed to a quantity, while “small screws” pointed to another. When a customer needed a part, Mei checked its name and found the current amount quickly. The cabinet stayed organized because each key led directly to its useful value.' }
  ],
  Functions: [
    { id: 'functions-garden-sprinkler', title: 'The Garden Sprinkler Routine', summary: 'A community garden used a sprinkler routine that checked the soil, watered each bed, and turned itself off. The gardener could start that routine whenever the plants needed care, without explaining every step again. On hot days, she called it twice for different sections. The reusable routine made a complicated job consistent, clear, and easier to maintain.' },
    { id: 'functions-sandwich-counter', title: 'The Sandwich Counter', summary: 'At the sandwich counter, Luis followed a trusted order: choose bread, add fillings, wrap the meal, and write the customer’s name. He used the same process for every order while changing the ingredients when customers requested them. A named routine kept the work organized and repeatable. Luis served more people because he could reuse the process instead of rebuilding it.' },
    { id: 'functions-compass-maker', title: 'The Compass Maker’s Routine', summary: 'A compass maker taught an apprentice a routine for testing every new compass. The apprentice checked the needle, compared directions, and marked the result. Whenever another compass arrived, he followed the same named set of steps. The routine made testing reliable and easy to explain. It also allowed the workshop to improve one process and benefit every future compass.' },
    { id: 'functions-school-bell', title: 'The School Bell Schedule', summary: 'The school caretaker created a bell routine with steps for checking the clock, sounding the bell, and recording the time. He used it at the start and end of each class, trusting the same instructions throughout the day. When the schedule changed, he updated the routine once. Every later bell followed the improved process without repeated rewriting.' }
  ],
  Strings: [
    { id: 'strings-postcard', title: 'The Postcard Workshop', summary: 'At a postcard workshop, Ana arranged letters into short messages for travelers. She joined words, changed a greeting when the recipient’s name was known, and read the final sentence aloud before printing it. The messages were made from characters that could be stored and edited. Ana learned that text becomes more useful when a program can handle it as information.' },
    { id: 'strings-radio-announcer', title: 'The Radio Announcer’s Notes', summary: 'Before each broadcast, Malik prepared a short line of text announcing the weather and the next song. He combined the station name with changing details, then displayed the complete message for listeners. Because words and characters could be joined, replaced, and read again, his notes adapted quickly. Malik saw how strings help programs communicate clear information.' },
    { id: 'strings-password-card', title: 'The Password Card', summary: 'At a science club, Elena made a card with a secret word for each team. She copied the letters carefully, checked whether the word matched the team’s entry, and replaced it when the club created a new challenge. The card contained text that could be compared and updated. Elena discovered that strings can carry small but important messages.' },
    { id: 'strings-sign-painter', title: 'The Sign Painter’s Message', summary: 'A sign painter prepared a welcome message by arranging individual letters across a wooden board. She measured the text, corrected a misspelled word, and painted the final version for the town entrance. The message was built from characters that could be counted and changed. Her work showed how strings let programs store, inspect, and transform written language.' }
  ],
  'Classes and Objects': [
    { id: 'classes-bakery-molds', title: 'The Bakery Molds', summary: 'A baker designed one cookie mold shaped like a star, then used it to create many cookies. Each cookie shared the same shape but could have a different color, topping, or name. The mold captured the common design while each cookie became its own object. The baker saw how one blueprint can produce many related things with individual details.' },
    { id: 'classes-garden-robots', title: 'The Garden Robots', summary: 'A gardener built a robot design that could move, check soil, and report dry plants. She created several robots from that design, giving each one a different name and garden area. Their shared abilities came from the blueprint, while their individual locations made them useful in different places. The garden showed how classes describe objects with common behavior.' },
    { id: 'classes-travel-journals', title: 'The Travel Journals', summary: 'A publisher created a journal design with pages for a traveler’s name, destination, and daily notes. Each printed journal followed the same structure, yet every owner filled it with different experiences. The design made the journals familiar, while their details made them personal. The publisher understood that a class can define shared structure for many unique objects.' },
    { id: 'classes-clock-collection', title: 'The Clock Collection', summary: 'A clockmaker built a clock design with hands, a face, and a way to display the time. He produced several clocks from the same plan, then gave each one a different color and alarm setting. Their shared structure made repairs easier, while their settings kept them distinct. The collection illustrated how objects can share a class without being identical.' }
  ]
};

const VARIANT_QUESTION_DATA = {
  'conditionals-weather-station': [
    ['What did Jo check before opening or closing the greenhouse windows?', 'The direction of the weather station flag', 'The number of plants in each row', 'The time written on the garden gate'],
    ['What did Jo do when the flag pointed west?', 'She closed the windows before the rain', 'She opened every window wider', 'She left the garden immediately'],
    ['What idea does Jo’s routine demonstrate?', 'An observation can select a matching action', 'Every situation should receive the same action', 'A program should ignore changing information']
  ],
  'conditionals-bakery-orders': [
    ['What did Sam use to decide what to pack?', 'The number of times the order bell rang', 'The color of the bakery walls', 'The number of customers outside'],
    ['What did Sam do when the bell rang twice?', 'He added a pastry to the loaf', 'He closed the bakery for the day', 'He waited without checking the order'],
    ['Why did customers receive the right items?', 'Sam matched each signal with a different action', 'Sam packed the same item for everyone', 'Sam let customers choose without an order']
  ],
  'conditionals-bridge-lights': [
    ['What did Lena read to guide travelers?', 'The colored lights on the bridge', 'The names of nearby villages', 'The number of stones on the road'],
    ['What did a red light tell travelers to do?', 'Stop at the gate', 'Continue quickly', 'Turn around before reaching the bridge'],
    ['What lesson does the bridge show?', 'Different inputs can lead to different instructions', 'Rules are unnecessary when a path is familiar', 'Every light should cause the same response']
  ],
  'conditionals-library-card': [
    ['What did the librarian check before lending a rare book?', 'Whether the visitor’s card was current', 'Whether the visitor carried a bag', 'Whether the book had a blue cover'],
    ['What happened when a card had expired?', 'The visitor was asked to renew it', 'The book was given away immediately', 'The librarian ignored the card'],
    ['How did the card check protect the collection?', 'It connected each card condition to a careful action', 'It made every visitor borrow the same book', 'It removed the need to record loans']
  ],
  'variables-garden-labels': [
    ['What information did Nia write beside each plant name?', 'The number of leaves', 'The color of the garden fence', 'The names of passing birds'],
    ['What changed while the plant name stayed familiar?', 'The stored leaf count', 'The shape of the wooden label', 'The number of garden rows'],
    ['What does Nia’s label system represent?', 'A named value that can be updated and reused', 'A message that disappears after one reading', 'A collection that cannot change']
  ],
  'variables-train-tickets': [
    ['What did Omar keep on the chalkboard?', 'The next ticket number', 'The weather forecast', 'The names of every train conductor'],
    ['What did Omar do after handing over a ticket?', 'He updated the number for the next traveler', 'He erased the station sign', 'He changed the traveler’s destination'],
    ['What programming idea appears in the chalkboard?', 'A name can point to a changing value', 'A value can only be used once', 'Information should never be updated']
  ],
  'variables-recipe-notebook': [
    ['What amount did Maya record in her notebook?', 'The current amount of water for the soup', 'The number of tables in the shelter', 'The names of every guest'],
    ['Why did Maya change the number in the notebook?', 'More guests arrived and the recipe needed more water', 'The notebook had run out of pages', 'She wanted to forget the recipe'],
    ['What does the notebook help Maya do?', 'Remember and reuse an updated value', 'Store only information that never changes', 'Replace every ingredient with a new name']
  ],
  'variables-kite-festival': [
    ['What did Ravi write on each team’s card?', 'The team name and its score', 'The weather and the festival address', 'The color of every kite in town'],
    ['What happened after a team made a successful flight?', 'Ravi updated that team’s score', 'Ravi threw away the team’s card', 'Ravi changed the team’s name'],
    ['What stayed the same while the scores changed?', 'The team names', 'The number of festival rounds', 'The shape of every kite']
  ],
  'loops-lighthouse': [
    ['What did the lighthouse keeper check repeatedly?', 'Each window around the lantern room', 'A different lighthouse in every town', 'Only the door at the entrance'],
    ['When did the keeper stop inspecting?', 'When every window was clean', 'After checking one window once', 'When the morning market opened'],
    ['What does the lighthouse routine represent?', 'Repeating steps until a completion condition is met', 'Changing the task after every step', 'Avoiding repeated actions entirely']
  ],
  'loops-bus-route': [
    ['What did the bus driver repeat at every station?', 'Stopping, checking, and departing', 'Painting a new route map', 'Changing the destination'],
    ['When did the repeated route end?', 'When the final station appeared', 'After the first passenger boarded', 'When the driver forgot the route'],
    ['Why was the familiar route useful?', 'One process handled many stations in order', 'Every station required a completely new plan', 'The driver skipped stations to save time']
  ],
  'loops-orchard': [
    ['What did Mateo count one tree at a time?', 'Apples', 'Garden tools', 'Travelers on the road'],
    ['What did Mateo do after each tree?', 'Added the result to his notebook', 'Changed the orchard’s rows', 'Stopped counting for the day'],
    ['What does Mateo’s harvest show?', 'One action can be applied repeatedly to many items', 'A large collection cannot be processed', 'Counting should happen only once']
  ],
  'loops-puzzle-box': [
    ['What did Priya test in sequence?', 'The positions on four puzzle wheels', 'Different boxes in the workshop', 'The names of hidden marks'],
    ['What ended Priya’s repeated turning and checking?', 'The hidden mark appeared and the box opened', 'The wheels disappeared', 'The box was thrown away'],
    ['Why did Priya avoid twisting randomly?', 'A steady repeated routine kept her progress organized', 'Random actions always open puzzle boxes faster', 'The box had no wheels to inspect']
  ],
  'lists-packing-list': [
    ['What did Elias arrange in order?', 'Water, rope, map, and compass', 'Only the expedition’s dates', 'Different names for one backpack'],
    ['What did Elias do when the forecast changed?', 'Added sunscreen to the collection', 'Removed the map permanently', 'Replaced every item with water'],
    ['What does the packing list represent?', 'Many related values kept together in order', 'A single value that cannot be changed', 'A label connected to one description']
  ],
  'lists-music-playlist': [
    ['What did Sora arrange in her playlist?', 'Songs in an order that matched the evening', 'Names of concert guests only', 'Different instruments in a storage room'],
    ['What changes did Sora make to the playlist?', 'She added, moved, and removed songs', 'She painted the rooftop and closed the concert', 'She changed every song into a person'],
    ['What does the playlist demonstrate?', 'A collection can be updated while keeping item order', 'A collection must always remain unchanged', 'Songs cannot be grouped together']
  ],
  'lists-class-roster': [
    ['What did Mr. Chen keep in arrival order?', 'The learners’ names', 'The classroom furniture', 'The school bell times'],
    ['How did Mr. Chen use the roster?', 'He checked the names during attendance', 'He used it to play music at lunch', 'He replaced every name with a number'],
    ['Why was one roster useful?', 'A program can visit related names one by one', 'The roster stored only one learner', 'The names could never be updated']
  ],
  'lists-photo-album': [
    ['What did each family add to the traveling album?', 'A picture and a caption', 'A new album cover only', 'A list of unrelated addresses'],
    ['Where did each new picture go?', 'The next open position', 'A random place outside the album', 'The same page as every earlier picture'],
    ['What does the album show?', 'A growing sequence can store and share related items', 'Pictures cannot be kept in order', 'A collection should contain only one item']
  ],
  'dictionaries-museum-cases': [
    ['What did each museum case have?', 'A label connected to a collection description', 'A ticket number with no meaning', 'A secret passage to another museum'],
    ['How did the guide find information quickly?', 'She used the collection’s label', 'She searched every case from the beginning', 'She asked visitors to rewrite the descriptions'],
    ['What programming idea do the labels represent?', 'Names connected to useful values', 'A list with no order or labels', 'A value that cannot be found again']
  ],
  'dictionaries-pet-shelter': [
    ['What details did Diego record for each pet?', 'Age, favorite food, and kennel number', 'Only the shelter’s opening time', 'The color of every building nearby'],
    ['How did Diego find Luna’s details?', 'He looked up Luna’s name', 'He searched every paper without a name', 'He asked Luna to rewrite the record'],
    ['What role did each pet’s name play?', 'It acted as a key to organized information', 'It removed all details from the record', 'It changed every pet into the same animal']
  ],
  'dictionaries-town-map': [
    ['What did a place name point to in the town directory?', 'An address and a short description', 'A different town with no information', 'A list of unrelated songs'],
    ['How could visitors find the clinic?', 'They looked up the place name', 'They counted every building by hand', 'They waited for the map to change color'],
    ['What does the directory demonstrate?', 'A labeled key can retrieve matching information', 'Labels make information impossible to find', 'Every place must share one address']
  ],
  'dictionaries-inventory-cabinet': [
    ['What did “copper wire” point to?', 'The current quantity of copper wire', 'The repair shop’s closing time', 'The name of a customer’s pet'],
    ['Why could Mei find supplies quickly?', 'Each item name led directly to its amount', 'Every supply was stored without a name', 'She memorized every part and ignored records'],
    ['What does the cabinet represent?', 'Key-value pairs used to organize information', 'A sequence where every item has the same value', 'A collection that cannot be searched']
  ],
  'functions-garden-sprinkler': [
    ['What steps belonged to the sprinkler routine?', 'Checking soil, watering beds, and turning off', 'Planting a new garden every morning', 'Measuring the gardener’s height'],
    ['When could the gardener start the routine?', 'Whenever the plants needed care', 'Only once before the garden existed', 'Only after removing every plant'],
    ['Why was the routine useful?', 'A named process could be reused consistently', 'It required rewriting every step each time', 'It worked only when no plants were dry']
  ],
  'functions-sandwich-counter': [
    ['What was Luis’s trusted sandwich order?', 'Choose bread, add fillings, wrap, and write a name', 'Close the counter and wash the windows', 'Count customers without preparing food'],
    ['What could change between orders?', 'The ingredients', 'The purpose of the counter', 'The number of steps in the routine'],
    ['What does Luis’s process demonstrate?', 'One reusable routine can accept different details', 'Every order must be built from unrelated steps', 'Reusable processes make work slower']
  ],
  'functions-compass-maker': [
    ['What did the apprentice do for every new compass?', 'Checked the needle, compared directions, and marked the result', 'Painted a new workshop wall', 'Changed the compass into a clock'],
    ['What made the testing routine reliable?', 'The apprentice followed the same named steps', 'He guessed a different test each time', 'He tested only the first compass'],
    ['What could the workshop improve once?', 'The shared testing process', 'Every compass’s name separately', 'The directions on every map by hand']
  ],
  'functions-school-bell': [
    ['What did the school bell routine include?', 'Checking the clock, sounding the bell, and recording time', 'Painting classrooms and serving lunch', 'Moving students to a new school'],
    ['What happened when the schedule changed?', 'The caretaker updated the routine once', 'He discarded every bell', 'He rewrote unrelated lessons'],
    ['Why was the routine valuable?', 'Later bells followed the improved process', 'Each bell required a brand-new plan', 'The caretaker no longer needed to check time']
  ],
  'strings-postcard': [
    ['What did Ana arrange into messages?', 'Letters and words', 'Numbers from a ticket machine', 'Pictures without any text'],
    ['What could Ana change before printing?', 'The greeting and final sentence', 'The postcard workshop’s location', 'The number of travelers in town'],
    ['What does Ana’s work show?', 'Text can be stored, edited, and read as information', 'Letters cannot be combined into messages', 'A message must stay unchanged forever']
  ],
  'strings-radio-announcer': [
    ['What did Malik prepare before each broadcast?', 'A line announcing weather and the next song', 'A map of every radio tower', 'A list containing only numbers'],
    ['How did Malik build the complete message?', 'He combined the station name with changing details', 'He removed every word from the announcement', 'He used one message without reading it'],
    ['Why were the notes adaptable?', 'Words and characters could be joined and replaced', 'The weather never changed', 'The station name was not part of the message']
  ],
  'strings-password-card': [
    ['What did Elena write for each science team?', 'A secret word', 'A different team uniform', 'A number of chairs'],
    ['What did Elena check about a team’s entry?', 'Whether its letters matched the secret word', 'Whether the team arrived first', 'Whether the card was made of wood'],
    ['What does the card demonstrate?', 'Text can be compared and updated', 'Words disappear after one comparison', 'A string can hold only numbers']
  ],
  'strings-sign-painter': [
    ['What did the sign painter arrange across the board?', 'Individual letters forming a welcome message', 'Only paint colors with no words', 'The names of every town resident'],
    ['What did she correct before painting?', 'A misspelled word', 'The town entrance location', 'The number of wooden boards'],
    ['What can programs do with strings like her message?', 'Store, inspect, and transform text', 'Use them only as pictures', 'Prevent every word from changing']
  ],
  'classes-bakery-molds': [
    ['What did the baker use to create many star cookies?', 'One shared cookie mold', 'A different blueprint for every crumb', 'A list of customer addresses'],
    ['How could the cookies still differ?', 'Their colors, toppings, or names could change', 'Their shared shape disappeared', 'They were made without any design'],
    ['What does the mold represent?', 'A blueprint for creating related objects', 'A single cookie that cannot be copied', 'A recipe containing no structure']
  ],
  'classes-garden-robots': [
    ['What abilities did the robot design provide?', 'Moving, checking soil, and reporting dry plants', 'Baking bread and painting signs', 'Changing the garden into a classroom'],
    ['How were the garden robots different?', 'They had different names and garden areas', 'They had no shared abilities', 'They all worked in exactly the same place'],
    ['What does the garden demonstrate?', 'One class can describe objects with shared behavior', 'Objects cannot have individual details', 'A blueprint is useful for only one object']
  ],
  'classes-travel-journals': [
    ['What fields did the journal design include?', 'A traveler’s name, destination, and daily notes', 'Only the publisher’s business address', 'A list of unrelated recipes'],
    ['What made each journal personal?', 'Its owner filled it with different experiences', 'Every journal had a different page structure', 'The design was removed before printing'],
    ['What does the journal design represent?', 'Shared structure for many unique objects', 'A single value that cannot be copied', 'A story with no reusable pattern']
  ],
  'classes-clock-collection': [
    ['What did every clock design include?', 'Hands, a face, and a way to display time', 'A different workshop for every clock', 'Only a colored case with no behavior'],
    ['How did the clockmaker make the clocks distinct?', 'He gave them different colors and alarm settings', 'He removed their shared structure', 'He used a separate design for every hand'],
    ['What does the collection illustrate?', 'Objects can share a class without being identical', 'A class can create only one object', 'Shared designs prevent individual settings']
  ]
};

const VARIANT_PYTHON_MAPPINGS = {
  'conditionals-weather-station': {
    pythonExplanation: 'Jo checks the flag direction and chooses the greenhouse action with if/elif/else.',
    sampleCode: `flag = "east"\nif flag == "east":\n    action = "Open the greenhouse windows"\nelif flag == "west":\n    action = "Close the greenhouse windows"\nelse:\n    action = "Ask the caretaker"\nprint(action)`
  },
  'conditionals-bakery-orders': {
    pythonExplanation: 'Sam uses the bell count as a condition to decide which bakery items belong in the order.',
    sampleCode: `bell_rings = 2\nif bell_rings == 1:\n    order = ["loaf"]\nelif bell_rings == 2:\n    order = ["loaf", "pastry"]\nelse:\n    order = []\nprint(order)`
  },
  'conditionals-bridge-lights': {
    pythonExplanation: 'Lena turns each bridge light into a safe instruction by checking its color.',
    sampleCode: `light = "red"\nif light == "green":\n    instruction = "Continue"\nelif light == "yellow":\n    instruction = "Slow down"\nelse:\n    instruction = "Stop at the gate"\nprint(instruction)`
  },
  'conditionals-library-card': {
    pythonExplanation: 'The librarian checks a card’s status before deciding whether to record or deny a book loan.',
    sampleCode: `card_status = "expired"\nif card_status == "current":\n    action = "Record the loan"\nelif card_status == "expired":\n    action = "Ask the visitor to renew"\nelse:\n    action = "Keep the book on the shelf"\nprint(action)`
  },
  'variables-garden-labels': {
    pythonExplanation: 'Nia stores each plant’s changing leaf count in a variable while the plant name stays available.',
    sampleCode: `plant_name = "Basil"\nleaf_count = 6\nleaf_count = 9\nprint(plant_name, leaf_count)`
  },
  'variables-train-tickets': {
    pythonExplanation: 'Omar keeps the next ticket number in a variable and updates it after each traveler is served.',
    sampleCode: `next_ticket = 101\nprint(next_ticket)\nnext_ticket = next_ticket + 1\nprint(next_ticket)`
  },
  'variables-recipe-notebook': {
    pythonExplanation: 'Maya stores the soup’s water amount in a variable so she can update and reuse it when guests arrive.',
    sampleCode: `water_cups = 8\nnew_guests = 4\nwater_cups = water_cups + new_guests\nprint(water_cups)`
  },
  'variables-kite-festival': {
    pythonExplanation: 'Ravi gives each team a named score variable and updates the value after a successful flight.',
    sampleCode: `ravi_team_score = 2\nravi_team_score = ravi_team_score + 1\nprint(ravi_team_score)`
  },
  'loops-lighthouse': {
    pythonExplanation: 'The keeper repeats a window check for every window, just as a for loop repeats one action across a collection.',
    sampleCode: `windows = ["north", "east", "south"]\nfor window in windows:\n    print("Check", window, "window")`
  },
  'loops-bus-route': {
    pythonExplanation: 'The bus driver repeats the same stop routine for each station until the route is complete.',
    sampleCode: `stations = ["Market", "Library", "Harbor"]\nfor station in stations:\n    print("Stop at", station)\n    print("Check and depart")`
  },
  'loops-orchard': {
    pythonExplanation: 'Mateo applies the same counting action to every tree and builds one harvest total.',
    sampleCode: `apples_per_tree = [8, 6, 9]\ntotal_apples = 0\nfor apples in apples_per_tree:\n    total_apples = total_apples + apples\nprint(total_apples)`
  },
  'loops-puzzle-box': {
    pythonExplanation: 'Priya repeats a turn-and-check action for each puzzle wheel until the hidden mark appears.',
    sampleCode: `wheels = [1, 2, 3, 4]\nfor wheel in wheels:\n    print("Turn and check wheel", wheel)`
  },
  'lists-packing-list': {
    pythonExplanation: 'Elias stores expedition items in one ordered list that he can inspect, update, and process.',
    sampleCode: `packing_list = ["water", "rope", "map", "compass"]\npacking_list.append("sunscreen")\nprint(packing_list)`
  },
  'lists-music-playlist': {
    pythonExplanation: 'Sora represents the concert playlist as an ordered list that can accept, move, and remove songs.',
    sampleCode: `playlist = ["Opening song", "Sunset song"]\nplaylist.append("Finale")\nplaylist.remove("Sunset song")\nprint(playlist)`
  },
  'lists-class-roster': {
    pythonExplanation: 'Mr. Chen keeps learner names in a list so attendance can visit each name in order.',
    sampleCode: `roster = ["Ava", "Chen", "Lina"]\nfor learner in roster:\n    print("Present?", learner)`
  },
  'lists-photo-album': {
    pythonExplanation: 'The traveling album is an ordered list that grows as families add pictures and captions.',
    sampleCode: `album = [("Mia", "Beach day")]\nalbum.append(("Noah", "Mountain walk"))\nprint(album)`
  },
  'dictionaries-museum-cases': {
    pythonExplanation: 'The guide uses each museum label as a dictionary key to retrieve its matching description.',
    sampleCode: `case_descriptions = {\n    "ancient coins": "Coins from the first kingdom",\n    "sea maps": "Maps used by early sailors"\n}\nprint(case_descriptions["sea maps"])`
  },
  'dictionaries-pet-shelter': {
    pythonExplanation: 'Diego uses a pet’s name as a key that opens its age, food, and kennel details.',
    sampleCode: `pets = {\n    "Luna": {"age": 3, "food": "fish", "kennel": 4}\n}\nprint(pets["Luna"]["kennel"])`
  },
  'dictionaries-town-map': {
    pythonExplanation: 'The town directory maps a place name to its address and description for quick lookup.',
    sampleCode: `directory = {\n    "bakery": {"address": "5 Main Street", "description": "Fresh bread"},\n    "clinic": {"address": "9 Oak Road", "description": "Health care"}\n}\nprint(directory["clinic"]["address"])`
  },
  'dictionaries-inventory-cabinet': {
    pythonExplanation: 'Mei stores each supply name as a dictionary key and reads the current quantity from its value.',
    sampleCode: `inventory = {"copper wire": 12, "small screws": 40}\ninventory["copper wire"] -= 1\nprint(inventory["copper wire"])`
  },
  'functions-garden-sprinkler': {
    pythonExplanation: 'The sprinkler routine groups the garden-care steps into a function that can be called whenever needed.',
    sampleCode: `def water_bed(bed_name):\n    print("Check soil in", bed_name)\n    print("Water", bed_name)\n    print("Turn sprinkler off")\n\nwater_bed("herb bed")`
  },
  'functions-sandwich-counter': {
    pythonExplanation: 'Luis turns the sandwich steps into a reusable function while allowing each order to use different ingredients.',
    sampleCode: `def make_sandwich(bread, filling):\n    return f"{bread} with {filling}, wrapped"\n\norder = make_sandwich("rye bread", "cheese")\nprint(order)`
  },
  'functions-compass-maker': {
    pythonExplanation: 'The apprentice packages the compass test into one function so every new compass follows the same routine.',
    sampleCode: `def test_compass(compass_name):\n    print("Check needle for", compass_name)\n    print("Compare directions")\n    return "tested"\n\nprint(test_compass("Compass A"))`
  },
  'functions-school-bell': {
    pythonExplanation: 'The caretaker reuses one bell function for every class, updating the schedule without rewriting the steps.',
    sampleCode: `def ring_bell(class_name, time):\n    print(time, "Ring bell for", class_name)\n    print("Record time")\n\nring_bell("Science", "10:00")`
  },
  'strings-postcard': {
    pythonExplanation: 'Ana joins a traveler’s name with a greeting to create a complete postcard message as text.',
    sampleCode: `traveler = "Ana"\ngreeting = "Safe travels, " + traveler + "!"\nprint(greeting)`
  },
  'strings-radio-announcer': {
    pythonExplanation: 'Malik combines fixed station text with changing weather and song details to build the broadcast string.',
    sampleCode: `station = "River Radio"\nweather = "clear"\nsong = "Morning Light"\nmessage = station + ": " + weather + ", then " + song\nprint(message)`
  },
  'strings-password-card': {
    pythonExplanation: 'Elena stores each team’s secret word as text and compares it with the word entered by the team.',
    sampleCode: `secret_word = "comet"\nentry = "comet"\nprint(secret_word == entry)`
  },
  'strings-sign-painter': {
    pythonExplanation: 'The sign painter stores the welcome message as a string so it can be checked and corrected before painting.',
    sampleCode: `message = "Welcome to Brookside"\nmessage = message.replace("Brookside", "Riverside")\nprint(message)`
  },
  'classes-bakery-molds': {
    pythonExplanation: 'The cookie mold becomes a class, while each decorated cookie is an object with its own topping and name.',
    sampleCode: `class Cookie:\n    def __init__(self, topping):\n        self.shape = "star"\n        self.topping = topping\n\ncookie = Cookie("sprinkles")\nprint(cookie.shape, cookie.topping)`
  },
  'classes-garden-robots': {
    pythonExplanation: 'A robot class shares garden behavior, while each robot object keeps its own name and assigned area.',
    sampleCode: `class GardenRobot:\n    def __init__(self, name, area):\n        self.name = name\n        self.area = area\n\nrobot = GardenRobot("R1", "herb bed")\nprint(robot.name, robot.area)`
  },
  'classes-travel-journals': {
    pythonExplanation: 'A journal class provides shared fields, while each journal object stores one traveler’s personal details.',
    sampleCode: `class Journal:\n    def __init__(self, traveler, destination):\n        self.traveler = traveler\n        self.destination = destination\n\njournal = Journal("Maya", "Lisbon")\nprint(journal.traveler, journal.destination)`
  },
  'classes-clock-collection': {
    pythonExplanation: 'A clock class defines shared time behavior, while each clock object can have its own color and alarm.',
    sampleCode: `class Clock:\n    def __init__(self, color, alarm):\n        self.color = color\n        self.alarm = alarm\n\nclock = Clock("blue", "07:00")\nprint(clock.color, clock.alarm)`
  }
};

function createVariantQuestions(storyId, concept) {
  return VARIANT_QUESTION_DATA[storyId].map(([prompt, correct, firstIncorrect, secondIncorrect], index) => ({
    id: `${storyId}-q${index + 1}`,
    prompt,
    options: [
      { id: `${storyId}-q${index + 1}-a`, label: correct, isCorrect: true, explanation: `Correct! This detail connects the story to ${concept}.` },
      { id: `${storyId}-q${index + 1}-b`, label: firstIncorrect, isCorrect: false, explanation: 'Not quite. That detail is not what happened in this story.' },
      { id: `${storyId}-q${index + 1}-c`, label: secondIncorrect, isCorrect: false, explanation: 'Not quite. Look back at the character’s actions and the story outcome.' }
    ]
  }));
}

const STORY_CATALOG = BASE_STORY_CATALOG.flatMap((story) => {
  const variants = STORY_VARIANTS[story.concept] || [];
  return [story, ...variants.map((variant) => ({
    ...story,
    ...variant,
    ...VARIANT_PYTHON_MAPPINGS[variant.id],
    summary: `${variant.summary} This made the idea easier to remember.`,
    assignmentQuestions: createVariantQuestions(variant.id, story.pythonConcept)
  }))];
});

function StoryLearningFlow() {
  const [step, setStep] = useState('intro');
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPythonMapping, setShowPythonMapping] = useState(false);
  const [feedback, setFeedback] = useState([]);

  const currentQuestion = selectedStory?.assignmentQuestions?.[currentQuestionIndex];

  function resetFlow() {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSubmitted(false);
    setShowPythonMapping(false);
    setFeedback([]);
  }

  function handleStorySelect(story) {
    resetFlow();
    setSelectedStory(story);
    setStep('story');

    const progress = readStoryProgress();
    progress.recentStory = {
      id: story.id,
      title: story.title,
      concept: story.concept,
      viewedAt: new Date().toISOString()
    };
    saveStoryProgress(progress);
  }

  function handleAnswerSelect(questionId, optionId) {
    setAnswers((previous) => ({ ...previous, [questionId]: optionId }));
  }

  function handleNextQuestion(event) {
    event.preventDefault();

    if (!selectedStory) {
      return;
    }

    if (currentQuestionIndex < selectedStory.assignmentQuestions.length - 1) {
      setCurrentQuestionIndex((value) => value + 1);
      return;
    }

    const result = selectedStory.assignmentQuestions.map((question) => {
      const selectedOptionId = answers[question.id];
      const selectedOption = question.options.find((option) => option.id === selectedOptionId);
      return {
        questionId: question.id,
        prompt: question.prompt,
        selectedOption,
        isCorrect: Boolean(selectedOption?.isCorrect)
      };
    });

    const correctAnswers = result.filter((item) => item.isCorrect).length;
    const score = Math.round((correctAnswers / result.length) * 100);
    const progress = readStoryProgress();
    progress.scores[selectedStory.id] = {
      id: selectedStory.id,
      title: selectedStory.title,
      concept: selectedStory.concept,
      score,
      correctAnswers,
      totalQuestions: result.length,
      completedAt: new Date().toISOString()
    };
    saveStoryProgress(progress);

    setFeedback(result);
    setSubmitted(true);
    setStep('results');
  }

  return (
    <section className="story-flow-shell">
      <div className="story-flow-card">
        <div className="story-flow-header">
          <span className="story-flow-tag">Interactive Python Story Lab</span>
          <h2>Learn by following a story from start to insight</h2>
          <p>
            Each step helps the learner connect a simple narrative to a Python idea in a natural way.
          </p>
        </div>

        {step === 'intro' && (
          <div className="story-step">
            <div className="story-spotlight">
              <BookOpen size={24} />
              <div>
                <h3>Ready to begin?</h3>
                <p>Pick a beginner story and follow it from the opening scene to the Python explanation.</p>
              </div>
            </div>
            <button type="button" className="primary story-button" onClick={() => setStep('menu')}>
              <Sparkles size={16} /> Choose a story
            </button>
          </div>
        )}

        {step === 'menu' && (
          <div className="story-step">
            <h3>Choose a story</h3>
            <p className="story-text">
              Each story introduces a beginner-friendly Python concept in a simple, memorable way.
            </p>
            <div className="story-menu-grid">
              {STORY_CATALOG.map((story) => (
                <button
                  key={story.id}
                  type="button"
                  className="story-card"
                  onClick={() => handleStorySelect(story)}
                >
                  <strong>{story.title}</strong>
                  <span>{story.concept}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'story' && selectedStory && (
          <div className="story-step">
            <div className="story-step-actions">
              <button type="button" className="secondary story-button" onClick={() => setStep('menu')}>
                Back to stories
              </button>
            </div>
            <h3>{selectedStory.title}</h3>
            <p className="story-text">{selectedStory.summary}</p>
            <button type="button" className="primary story-button" onClick={() => setStep('assignment')}>
              Next <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 'assignment' && selectedStory && (
          <div className="story-step">
            <div className="story-step-actions">
              <button type="button" className="secondary story-button" onClick={() => setStep('menu')}>
                Back to stories
              </button>
            </div>
            <h3>Assignment</h3>
            <p className="story-text">
              Read each question carefully and choose the answer that fits the story best. After you finish the last question, you will move to the key findings and the Python explanation.
            </p>
            <form className="story-form" onSubmit={handleNextQuestion}>
              <div className="assignment-progress">
                Question {currentQuestionIndex + 1} of {selectedStory.assignmentQuestions.length}
              </div>
              <h4>{currentQuestion.prompt}</h4>
              <div className="mcq-options">
                {currentQuestion.options.map((option) => (
                  <label key={option.id} className={`mcq-option ${answers[currentQuestion.id] === option.id ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={option.id}
                      checked={answers[currentQuestion.id] === option.id}
                      onChange={() => handleAnswerSelect(currentQuestion.id, option.id)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              <button type="submit" className="primary story-button">
                {currentQuestionIndex < selectedStory.assignmentQuestions.length - 1 ? 'Next question' : 'Finish assignment'}
              </button>
            </form>
          </div>
        )}

        {step === 'results' && selectedStory && (
          <div className="story-step">
            <div className="story-step-actions">
              <button type="button" className="secondary story-button" onClick={() => setStep('menu')}>
                Back to stories
              </button>
            </div>
            <h3>Key findings</h3>
            <ul className="story-bullets">
              {selectedStory.keyFindings.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="story-insight-card">
              {feedback.length > 0 && (
                <>
                  <div className="story-insight-title">
                    <BrainCircuit size={18} />
                    <strong>Answers</strong>
                  </div>
                  <div className="feedback-stack">
                    {feedback.map((item) => (
                      <div key={item.questionId} className={`feedback-box ${item.isCorrect ? 'correct' : 'incorrect'}`}>
                        <strong>{item.isCorrect ? 'Correct answer' : 'Needs a second look'}</strong>
                        <p>{item.prompt}</p>
                        <p><strong>Your choice:</strong> {item.selectedOption?.label || 'No answer selected'}</p>
                        {!item.isCorrect && <p><strong>Reasoning:</strong> {item.selectedOption?.explanation}</p>}
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="story-insight-title">
                <BrainCircuit size={18} />
                <strong>How Python maps this concept</strong>
              </div>
              <p className="story-text">
                <strong>{selectedStory.pythonConcept}</strong> — {selectedStory.pythonExplanation}
              </p>
              <button
                type="button"
                className="secondary story-button"
                onClick={() => setShowPythonMapping((value) => !value)}
              >
                {showPythonMapping ? 'Hide explanation' : 'Show Python concept'}
              </button>

              {showPythonMapping && (
                <div className="python-explanation">
                  <p>{selectedStory.pythonExplanation}</p>
                  <pre>{selectedStory.sampleCode}</pre>
                </div>
              )}
            </div>

            {submitted ? (
              <p className="story-submission">
                Your answer has been recorded. The story now connects to the Python idea of {selectedStory.pythonConcept.toLowerCase()}.
              </p>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

export default StoryLearningFlow;
