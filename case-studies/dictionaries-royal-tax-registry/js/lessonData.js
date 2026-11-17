/* =========================================================
   lessonData.js
   Pure content. No logic. No DOM access.
   Pedagogy: teach ASSOCIATIVE MAPPING first, reveal Python
   dictionaries only after the learner has built the idea
   themselves through the Akbar & Birbal story.
   ========================================================= */

/* ---------------------------------------------------------
   THE SHARED DATASET
   --------------------------------------------------------- */
const REGISTRY = {
  Punjab: 1200,
  Bengal: 900,
  Delhi: 1500,
  Kashmir: 700
};

const NEW_PROVINCE = { name: "Awadh", tax: 600 };

/* ---------------------------------------------------------
   MACRO STAGE LABELS (progress bar — unchanged)
   --------------------------------------------------------- */
const MACRO_STAGE_LABELS = [
  "Story",
  "Story Questions",
  "Computational Thinking",
  "Concept Discovery",
  "Mental Model",
  "Python Syntax",
  "Interactive Coding",
  "Assessment",
  "Reflection"
];

/* ---------------------------------------------------------
   CT SUB-STEP LABELS
   Slot 1 relabeled from "Matching Activity" to "Registry
   Lookup" to match the new lookup-based interaction.
   --------------------------------------------------------- */
const CT_SUBSTEP_LABELS = [
  "Associative Mapping",
  "Registry Lookup",
  "Discovery Questions",
  "Retrieval Activity"
];

/* ---------------------------------------------------------
   LESSON STEPS
   --------------------------------------------------------- */
const LESSON_STEPS = [

  /* ============ 1. STORY ============ */
  {
    id: "story",
    type: "story",
    macroIndex: 0,
    eyebrow: "Chapter One · The Royal Tax Registry",
    title: "Akbar and Birbal's Royal Tax Registry",
    media: [
      { src: "assets/images/akbar.png", alt: "Emperor Akbar" },
      { src: "assets/images/birbal.png", alt: "Minister Birbal" }
    ],
    paragraphs: [
      "Emperor Akbar's empire stretched across many provinces, and each province owed a different amount of annual tax to the royal treasury. He turned to his wisest minister, Birbal, and said: 'Keep me a registry, so that whenever I ask, you can tell me instantly what any province owes.'",
      "Birbal began with Punjab, which owed 1200 gold mudras every year. Then Bengal, which owed 900. Then Delhi, a smaller but wealthier province, which owed 1500. And Kashmir, in the mountains, which owed 700.",
      "'Punjab, Bengal, Delhi, Kashmir,' Birbal murmured, writing each name beside its number. 'Each province, one amount. Simple enough — as long as I remember which name goes with which number.'",
      "Akbar smiled. 'That,' he said, 'is exactly the registry I need. Now let us make sure you never forget which is which.'"
    ]
  },

  /* ============ 2. STORY QUESTIONS ============ */
  {
    id: "story-questions",
    type: "question",
    macroIndex: 1,
    eyebrow: "Story Questions",
    title: "Before We Continue...",
    prompt: "Why did Akbar want Birbal to record a separate tax amount for each individual province?",
    options: [
      "Because every province owes a completely different, specific amount, and Akbar needs to know exactly which amount belongs to which province",
      "Because the treasury only had four coins to count",
      "Because Birbal enjoyed writing long lists",
      "Because provinces take turns paying tax each year"
    ],
    correctIndex: 0,
    explanation: "Right — each province has its own specific tax amount, so the registry needs to keep each name firmly paired with its own number."
  },

  /* ============ 3. CT SLOT 0 — ASSOCIATIVE MAPPING (animated) ============ */
  {
    id: "ct-mapping",
    type: "mapping-visual",
    macroIndex: 2,
    ctIndex: 0,
    eyebrow: "Computational Thinking · Associative Mapping",
    title: "Watch the Registry Take Shape",
    paragraphs: [
      "Forget the scroll for a moment. Picture Birbal simply pointing from a province straight to its tax amount. Each province points to exactly one amount — nothing more, nothing less.",
      "This 'points-to' relationship is called an association. Watch each province find its amount:"
    ],
    pairs: [
      { key: "Punjab", value: 1200 },
      { key: "Bengal", value: 900 },
      { key: "Delhi", value: 1500 },
      { key: "Kashmir", value: 700 }
    ],
    closingLine: "Every arrow starts at a province and ends at exactly one amount. That single, direct link is the whole idea."
  },

  /* ============ 4. CT SLOT 1 — REGISTRY LOOKUP ACTIVITY ============
     Replaces the old memory-based matching activity. The registry
     stays fully visible at all times — the learner is never asked
     to recall a value from memory, only to find it by name. */
  {
    id: "ct-lookup",
    type: "lookup-activity",
    macroIndex: 2,
    ctIndex: 1,
    eyebrow: "Computational Thinking · Registry Lookup",
    title: "Use the Registry to Answer Akbar",
    instructions:
      "The Royal Tax Registry stays open right in front of you. When Akbar asks about a province, look at the registry below and tap the correct amount. Nothing to memorize — just find it.",
    registry: [
      { key: "Punjab", value: 1200 },
      { key: "Bengal", value: 900 },
      { key: "Delhi", value: 1500 },
      { key: "Kashmir", value: 700 }
    ],
    rounds: [
      { askProvince: "Bengal", options: [900, 1200, 1500, 700], correctTax: 900 },
      { askProvince: "Kashmir", options: [700, 900, 1200, 1500], correctTax: 700 },
      { askProvince: "Delhi", options: [1500, 900, 700, 1200], correctTax: 1500 }
    ],
    completionLine:
      "Notice you never had to remember a single number — the registry was right there, and you simply looked up the province's name."
  },

  /* ============ 5. CT SLOT 2 — DISCOVERY-BASED QUESTIONS ============ */
  {
    id: "ct-discovery",
    type: "discovery",
    macroIndex: 2,
    ctIndex: 2,
    eyebrow: "Computational Thinking · Discovery Questions",
    title: "Birbal Thinks Out Loud",
    intro:
      "Before we go further, let's reason through a few things the way Birbal would.",
    questions: [
      {
        id: "d1",
        prompt:
          "Akbar suddenly asks: \"What does Bengal owe me?\" What's the fastest way for Birbal to answer?",
        options: [
          "Scan every tax amount, checking each one to see if it matches something",
          "Go straight to the entry labeled \"Bengal\""
        ],
        correctIndex: 1,
        followUp:
          "Exactly. You already know the name you're looking for — so you go straight to it, rather than hunting through amounts you don't need yet."
      },
      {
        id: "d2",
        prompt:
          "Could Punjab and some other province ever end up owing the exact same tax amount, by coincidence?",
        options: [
          "Yes — two different provinces can happen to owe the same amount",
          "No — every amount in the registry must be different"
        ],
        correctIndex: 0,
        followUp:
          "Right. Amounts can repeat freely. It's the province names that need to stay distinct enough to search by."
      },
      {
        id: "d3",
        prompt:
          "Could Bengal officially owe two different tax amounts at once — say, 900 written in one line and 1100 written in another?",
        options: [
          "Yes, that would be fine",
          "No — that would cause real confusion"
        ],
        correctIndex: 1,
        followUp:
          "Think about it: if a tax collector saw two different numbers next to \"Bengal,\" which one should they trust? A name should point to one clear answer, not two conflicting ones."
      }
    ]
  },

  /* ============ 6. CT SLOT 3 — RETRIEVAL ACTIVITY ============ */
  {
    id: "ct-retrieval",
    type: "retrieval-activity",
    macroIndex: 2,
    ctIndex: 3,
    eyebrow: "Computational Thinking · Retrieval Activity",
    title: "Akbar Wants Answers — Fast",
    instructions:
      "Akbar is in an impatient mood today. He'll call out a province. Tap the matching province below to retrieve its tax instantly — no searching from the top.",
    provinceButtons: ["Punjab", "Bengal", "Delhi", "Kashmir"],
    rounds: [
      { askProvince: "Bengal", correctTax: 900 },
      { askProvince: "Kashmir", correctTax: 700 },
      { askProvince: "Delhi", correctTax: 1500 }
    ],
    completionLine:
      "Every time, you found the answer the same way: by going straight to the province's name. That's the whole idea — we find information using the name, not by searching amount by amount."
  },

  /* ============ 7. CONCEPT DISCOVERY — TRANSITION ============ */
  {
    id: "concept-transition",
    type: "story",
    macroIndex: 3,
    eyebrow: "Concept Discovery · A New Thought",
    title: "Birbal Has an Idea",
    paragraphs: [
      "That evening, Birbal sat with his scroll and smiled to himself. 'This works beautifully on parchment,' he thought. 'A name, pointing directly to its amount. No searching, no confusion.'",
      "'Programmers,' he mused, 'must need to store information exactly this way — one name, pointing straight to one value.' And as it turns out, Birbal was right."
    ]
  },

  /* ============ 8. CONCEPT DISCOVERY — REVEAL THE DICTIONARY ============ */
  {
    id: "concept-reveal",
    type: "reveal",
    macroIndex: 3,
    eyebrow: "Concept Discovery · The Reveal",
    title: "This Has a Name: a Dictionary",
    paragraphs: [
      "What you just built — provinces pointing directly to their tax amounts — is exactly what Python calls a dictionary. Look closely: this is the very same registry you've been using all along, just written in a new form."
    ],
    mapPairs: [
      { key: "Punjab", value: 1200 },
      { key: "Bengal", value: 900 },
      { key: "Delhi", value: 1500 },
      { key: "Kashmir", value: 700 }
    ],
    code:
`registry = {
    "Punjab": 1200,
    "Bengal": 900,
    "Delhi": 1500,
    "Kashmir": 700
}`,
    legendPairs: [
      { story: "Province", python: "Key" },
      { story: "Tax Amount", python: "Value" },
      { story: "Royal Tax Registry", python: "Dictionary" }
    ],
    closingLine: "Same registry. Same idea. Just a new way of writing it down."
  },

  /* ============ 9. MENTAL MODEL ============ */
  {
    id: "mental-model",
    type: "mental-model",
    macroIndex: 4,
    eyebrow: "Mental Model",
    title: "Picture Birbal's Wall of Pigeonholes",
    paragraphs: [
      "Imagine Birbal's chamber has a wall of small labeled boxes, like pigeonholes in an old post office. One box says \"Punjab\", another \"Bengal\", another \"Delhi\", another \"Kashmir\". Inside each box sits a single slip of paper with that province's tax amount.",
      "To find Delhi's tax, you don't open every box from left to right. You walk straight to the box labeled \"Delhi\" and read what's inside. A Python dictionary behaves exactly the same way: go directly to the key, and the value is already there."
    ],
    visualBoxes: [
      { label: "Punjab", value: "1200" },
      { label: "Bengal", value: "900" },
      { label: "Delhi", value: "1500" },
      { label: "Kashmir", value: "700" }
    ]
  },

  /* ============ 10. PYTHON SYNTAX — synchronized operations demo ============
     Left panel: Birbal's ledger. Right panel: the Python dictionary.
     Both start fully populated and identical. Three story-driven
     operations (add / update / delete) then play automatically,
     one at a time, animating both panels in sync. No explanatory
     text — the story, code, and animation carry the idea. */
  {
    id: "python-syntax",
    type: "syntax",
    macroIndex: 5,
    eyebrow: "Python Syntax",
    title: "Two Forms of the Same Registry",
    ledgerTitle: "📖 Royal Tax Registry",
    variableName: "royal_tax_registry",
    initialEntries: [
      { key: "Punjab", value: 1200 },
      { key: "Delhi", value: 1500 },
      { key: "Bengal", value: 900 },
      { key: "Kashmir", value: 700 }
    ],
    operations: [
      {
        type: "add",
        story:
          'Akbar says: "Rajasthan has become part of the empire. Add it to the Royal Tax Registry with an annual tax of 1000 gold coins."',
        line: 'royal_tax_registry["Rajasthan"] = 1000',
        key: "Rajasthan",
        value: 1000
      },
      {
        type: "update",
        story:
          'Akbar says: "Bengal had an excellent harvest. Increase its annual tax to 1300 gold coins."',
        line: 'royal_tax_registry["Bengal"] = 1300',
        key: "Bengal",
        oldValue: 900,
        newValue: 1300
      },
      {
        type: "delete",
        story: 'Akbar says: "Remove Kashmir from this year\'s tax registry."',
        line: 'del royal_tax_registry["Kashmir"]',
        key: "Kashmir"
      }
    ]
  },
  /* ============ 11. INTERACTIVE CODING ============ */
  {
    id: "interactive-coding",
    type: "coding",
    macroIndex: 6,
    eyebrow: "Interactive Coding",
    title: "Awadh Joins the Empire",
    filename: "royal_registry.py",
    instructions:
      "A messenger arrives: Awadh has joined the empire, owing 600 gold mudras. Add Awadh to the registry below, then print Bengal's tax to prove the rest of the registry still works perfectly.",
    starterCode:
`registry = {
    "Punjab": 1200,
    "Bengal": 900,
    "Delhi": 1500,
    "Kashmir": 700
}

# 1. Add Awadh with a tax of 600 below

# 2. Then print Bengal's tax
`,
    hint: "Add with registry[\"Awadh\"] = 600, then look up with print(registry[\"Bengal\"]).",
    validation: {
      patterns: [
        /registry\s*\[\s*["']Awadh["']\s*\]\s*=\s*600/,
        /print\s*\(\s*registry\s*\[\s*["']Bengal["']\s*\]\s*\)/
      ],
      patternsRequireAny: false,
      mustContain: "print",
      expectedOutput: "900"
    },
    successMessage: "Awadh is officially added, and Bengal's tax still comes back correctly: 900 gold mudras.",
    errorMessage: "Not quite yet. Make sure you add registry[\"Awadh\"] = 600, and print(registry[\"Bengal\"])."
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
        prompt: "How does Birbal (or Python) find Delhi's tax amount?",
        options: [
          "By checking every amount in order until one seems right",
          "By going directly to the entry labeled \"Delhi\"",
          "By asking each province to guess its own tax",
          "By sorting all provinces alphabetically first"
        ],
        correctIndex: 1,
        explanation: "You go straight to the key you already know — that's the entire point of associative mapping."
      },
      {
        id: "q2",
        prompt: "Why can't Bengal have two different official tax amounts in the registry at the same time?",
        options: [
          "Because it would waste ink",
          "Because a name should point to one clear answer, not two conflicting ones",
          "Because Python only allows four entries",
          "Because provinces alphabetically before \"D\" can't repeat"
        ],
        correctIndex: 1,
        explanation: "Exactly what Birbal realized — one name pointing to two different values creates confusion about which one is true."
      }
    ]
  },

  /* ============ 13. REFLECTION ============ */
  {
    id: "reflection",
    type: "reflection",
    macroIndex: 8,
    eyebrow: "Reflection",
    title: "Think Back Over the Journey",
    paragraphs: [
      "You never started with curly braces or the word \"dictionary.\" You started by watching provinces point to their tax amounts, practiced looking things up by name, reasoned through what would cause confusion, and answered Akbar instantly — and only then did Python's dictionary show up, already familiar."
    ],
    prompts: [
      "Where else in everyday life have you seen a name point directly to one value, the way provinces point to their tax amounts?",
      "Now that you've felt the difference between 'searching' and 'going straight to the name,' how does that change what a Python dictionary feels like to you?"
    ]
  }
];