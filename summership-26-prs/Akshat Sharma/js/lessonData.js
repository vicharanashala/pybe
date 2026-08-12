/* =========================================================
   lessonData.js
   Pure content. No logic. No DOM access.
   Pedagogy: teach SEQUENTIAL PROCESSING first, reveal Python
   for loops only after the learner has built the idea
   themselves through the Dada & Fox story.
   ========================================================= */

const ORCHARD = ["Tree 1", "Tree 2", "Tree 3", "Tree 4"];

const MACRO_STAGE_LABELS = [
  "Story",
  "Story Questions",
  "Computational Thinking",
  "Concept Discovery",
  "Mental Model",
  "Python Syntax",
  "Interactive Coding",
  "Assessment"
];

const CT_SUBSTEP_LABELS = [
  "Sequential Action",
  "Sequencing Activity",
  "Discovery Questions",
  "Simulation Activity"
];

const LESSON_STEPS = [

  /* ============ 1. STORY (no Python, no "loop") ============ */
  {
    id: "story",
    type: "story",
    macroIndex: 0,
    eyebrow: "Scene One · The Mango Harvest",
    title: "The Mango Harvest",
    media: [
      { type: "image", src: "assets/images/dada_and_fox.jpg", alt: "Dada and the Fox in the mango orchard" }
    ],
    paragraphs: [
      "The Fox liked walking through the village before sunrise. At that hour, the streets were quiet, the tea stalls were still waking up, and only a few people were already at work.",
      "One morning, it found Dada standing in a mango orchard with a large basket on his back.",
      "The Fox watched as Dada walked to the first tree and picked every ripe mango he could reach. Then he moved to the next tree and did exactly the same thing. Then the next. And then another.",
      "The orchard stretched far across the hillside. After a while, the Fox grew curious.",
      "\"What if the orchard had a thousand trees? Would you still harvest them this way?\" asked the Fox.",
      "Dada laughed. \"Yes. The plan never changes, whether it's four trees or a thousand. I walk to a tree, I pick the mangoes, and I move to the next.\"",
      "\"How do you ensure you don't miss a tree?\" the Fox wondered.",
      "\"By covering them sequentially,\" Dada replied. \"I start at the first, move to the next, and only stop when I reach the very end.\""
    ]
  },

  /* ============ 2. STORY QUESTIONS ============ */
  {
    id: "story-questions",
    type: "question",
    macroIndex: 1,
    eyebrow: "Story Questions",
    title: "Before We Continue...",
    prompt: "Why doesn't Dada change his plan when there are more trees?",
    options: [
      "Because the same single action (picking mangoes) needs to be applied to every single tree",
      "Because Dada is too old to learn a new plan",
      "Because mangoes from different trees taste the same",
      "Because the Fox didn't offer a better plan"
    ],
    correctIndex: 0,
    explanation: "The power of Dada's approach is that one simple, repetitive plan works no matter how large the orchard (the collection) grows."
  },

  /* ============ 3. CT SLOT 0 — SEQUENTIAL ACTION ============ */
  {
    id: "ct-mapping",
    type: "mapping-visual",
    macroIndex: 2,
    ctIndex: 0,
    eyebrow: "Computational Thinking · Sequential Action",
    title: "Watch the Harvest Take Shape",
    paragraphs: [
      "By noon, the basket was full and the two sat beneath a banyan tree.",
      "\"Every tree had mangoes. Yet you didn't treat the orchard as one giant thing,\" said the Fox.",
      "\"Because that would be impossible. I only know how to do one simple job,\" replied Dada. \"Pick the ripe mangoes from a tree.\"",
      "The Fox realized that what seemed like a huge task was really just one small action repeated again and again, each time on the next tree."
    ],
    pairs: [
      { key: "Tree 1", value: "Pick Mangoes" },
      { key: "Tree 2", value: "Pick Mangoes" },
      { key: "Tree 3", value: "Pick Mangoes" },
      { key: "Tree 4", value: "Pick Mangoes" }
    ],
    closingLine: "Every tree gets the exact same action applied to it, one by one."
  },

  /* ============ 4. CT SLOT 1 — SEQUENCING ACTIVITY ============ */
  {
    id: "ct-matching",
    type: "matching-activity",
    macroIndex: 2,
    ctIndex: 1,
    eyebrow: "Computational Thinking · Sequencing Activity",
    title: "Now You Harvest the Orchard",
    instructions:
      "Dada needs to harvest 4 trees. Tap a tree, then tap the action that Dada must perform on it to complete the sequence.",
    provinces: ["Tree 1", "Tree 2", "Tree 3", "Tree 4"],
    taxOptions: ["Harvest Tree 4", "Harvest Tree 1", "Harvest Tree 3", "Harvest Tree 2"],
    correctMap: { "Tree 1": "Harvest Tree 1", "Tree 2": "Harvest Tree 2", "Tree 3": "Harvest Tree 3", "Tree 4": "Harvest Tree 4" },
    successMessage: "The entire orchard has been harvested without needing a new plan!"
  },

  /* ============ 5. CT SLOT 2 — DISCOVERY-BASED QUESTIONS ============ */
  {
    id: "ct-discovery",
    type: "discovery",
    macroIndex: 2,
    ctIndex: 2,
    eyebrow: "Computational Thinking · Discovery Questions",
    title: "The Fox Thinks Out Loud",
    intro:
      "Before we go further, let's reason through a few things the way the Fox would.",
    questions: [
      {
        id: "d1",
        prompt:
          "If the orchard had 100 trees instead of 4, would Dada need to learn a new skill to harvest them?",
        options: [
          "Yes, he would need 100 different skills",
          "No, he just repeats the same 'pick mangoes' skill 100 times"
        ],
        correctIndex: 1,
        followUp:
          "The size of the collection changes, but the action stays the same."
      },
      {
        id: "d2",
        prompt:
          "If a village accountant had to check every page in a ledger, what is the collection and what is the action?",
        options: [
          "Collection: the pages. Action: checking the page.",
          "Collection: the accountant. Action: the ledger."
        ],
        correctIndex: 0,
        followUp:
          "The pages form a sequence, and checking them is the repeated action."
      },
      {
        id: "d3",
        prompt:
          "Could Dada accidentally harvest two trees at the exact same moment?",
        options: [
          "Yes, he has very long arms",
          "No, the action must be done one by one in order"
        ],
        correctIndex: 1,
        followUp:
          "Think about it: sequential processes handle items strictly one after another."
      }
    ]
  },

  /* ============ 6. CT SLOT 3 — SIMULATION ACTIVITY ============ */
  {
    id: "ct-retrieval",
    type: "retrieval-activity",
    macroIndex: 2,
    ctIndex: 3,
    eyebrow: "Computational Thinking · Simulation Activity",
    title: "Step by Step",
    instructions:
      "The Fox wants to see Dada's process in action. The Fox will call out a tree in the orchard. Tap the tree to tell Dada to pick its mangoes.",
    provinceButtons: ["Tree 1", "Tree 2", "Tree 3", "Tree 4"],
    rounds: [
      { askProvince: "Tree 1", correctTax: "Picked!" },
      { askProvince: "Tree 2", correctTax: "Picked!" },
      { askProvince: "Tree 3", correctTax: "Picked!" },
      { askProvince: "Tree 4", correctTax: "Picked!" }
    ],
    completionLine:
      "One small action repeated again and again, each time on the next tree. That's the whole idea."
  },

  /* ============ 7. CONCEPT DISCOVERY — TRANSITION ============ */
  {
    id: "concept-transition",
    type: "story",
    macroIndex: 3,
    eyebrow: "Concept Discovery · A New Thought",
    title: "The Fox Has an Idea",
    media: [
      { type: "image", src: "assets/images/thinking_fox.jpeg", alt: "The Fox thinking deeply" }
    ],
    paragraphs: [
      "The Fox looked back across the orchard. What had seemed like a huge task was really just one small action repeated again and again, each time on the next tree.",
      "'Programmers,' the Fox mused, 'must need to process large collections of things exactly this way — repeating one simple job for every item in a group.' And as it turns out, the Fox was right."
    ]
  },

  /* ============ 8. CONCEPT DISCOVERY — REVEAL THE LOOP ============ */
  {
    id: "concept-reveal",
    type: "reveal",
    macroIndex: 3,
    eyebrow: "Concept Discovery · The Reveal",
    title: "This Has a Name: a For Loop",
    paragraphs: [
      "What you just witnessed — moving through a collection one by one and performing an action — is exactly what Python calls a For Loop. Look closely: this is the very same harvest you directed a moment ago, just written in a new form."
    ],
    mapPairs: [
      { key: "Tree 1", value: "Pick Mangoes" },
      { key: "Tree 2", value: "Pick Mangoes" },
      { key: "Tree 3", value: "Pick Mangoes" }
    ],
    code:
      `orchard = ["Tree 1", "Tree 2", "Tree 3"]

for tree in orchard:
    print("Picking mangoes from", tree)`,
    legendPairs: [
      { story: "The Orchard", python: "List (Collection)" },
      { story: "A Single Tree", python: "Loop Variable (Item)" },
      { story: "Picking Mangoes", python: "Loop Body (Action)" }
    ],
    closingLine: "Same harvest. Same idea. Just a new way of writing it down."
  },

  /* ============ 9. MENTAL MODEL ============ */
  {
    id: "mental-model",
    type: "mental-model",
    macroIndex: 4,
    eyebrow: "Mental Model",
    title: "Picture a Conveyor Belt",
    paragraphs: [
      "Imagine the items in a collection (like trees in an orchard) are placed on a conveyor belt. The For Loop is a machine at the end of the belt.",
      "The belt moves forward, dropping one item into the machine at a time. The machine performs its designated action on that single item. Once finished, the machine waits, and the belt drops the next item in. This continues until the belt is completely empty."
    ],
    visualBoxes: [
      { label: "Item 1", value: "Action Done" },
      { label: "Item 2", value: "Action Done" },
      { label: "Item 3", value: "Action Done" }
    ]
  },

  /* ============ 10. PYTHON SYNTAX — operations motivated by story ============ */
  {
    id: "python-syntax",
    type: "syntax",
    macroIndex: 5,
    eyebrow: "Python Syntax",
    title: "Every Operation Grows From a Story Event",
    paragraphs: [
      "Just like Dada can apply his single action to different collections—be it an orchard of trees, a basket of mangoes, or the Fox's questions—Python's For Loop can iterate over many different types of sequences."
    ],
    codeBlocks: [
      {
        label: "Iterating over a List",
        motivation: "Dada walks through a list of trees.",
        code:
          `trees = ["Tree 1", "Tree 2", "Tree 3"]
for t in trees:
    print(t)`
      },
      {
        label: "Doing Math in a Loop",
        motivation: "Counting the total mangoes collected.",
        code:
          `mangoes_per_tree = [10, 15, 20]
total = 0
for count in mangoes_per_tree:
    total = total + count
print("Total mangoes:", total)`
      },
      {
        label: "Iterating over a String",
        motivation: "The Fox spells out a word letter by letter.",
        code:
          `word = "MANGO"
for letter in word:
    print(letter)`
      }
    ]
  },

  /* ============ 11. INTERACTIVE CODING ============ */
  {
    id: "interactive-coding",
    type: "coding",
    macroIndex: 6,
    eyebrow: "Interactive Coding",
    title: "The Librarian's Task",
    filename: "librarian.py",
    instructions:
      "The Fox wondered if a librarian would solve their problem the same way. We have a list of books on a shelf. Drag the blocks below into the empty slots to write a For Loop that prints each book.",
    draggableBlocks: ["print(book)", "in", "book", "for", "shelf:"],
    dropSlots: ["for", "book", "in", "shelf:", "print(book)"],
    successMessage: "Perfect! The librarian processes the shelf exactly like Dada harvests the orchard.",
    errorMessage: "Make sure your loop is formed as: `for [item] in [collection]:` and then `print([item])`."
  },

  /* ============ 12. ASSESSMENT ============ */
  {
    id: "assessment",
    type: "assessment",
    macroIndex: 7,
    eyebrow: "Assessment",
    title: "Check Your Understanding",
    questions: [
      {
        id: "q1",
        prompt: "What is the purpose of the 'loop variable' in a For Loop (like `tree` in `for tree in orchard:`)?",
        options: [
          "It holds the entire collection all at once",
          "It represents the single, current item being processed in that moment",
          "It tells the loop when to stop",
          "It counts how many items are left"
        ],
        correctIndex: 1,
        explanation: "Just like Dada focuses on one single tree at a time, the loop variable holds only the current item being processed in that cycle of the loop."
      },
      {
        id: "q2",
        prompt: "If you have a For Loop that iterates over a list of 5 items, how many times will the indented action (the loop body) run?",
        options: [
          "1 time",
          "5 times",
          "6 times",
          "It runs forever until told to stop"
        ],
        correctIndex: 1,
        explanation: "The loop repeats the action exactly once for every item in the collection."
      }
    ]
  }
];