export const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='60'%3E%3Crect width='200' height='60' fill='%23FDE68A' rx='8'/%3E%3Ctext x='100' y='36' font-family='Georgia' font-size='14' fill='%23451A03' text-anchor='middle'%3EPanchatantra Illustration%3C/text%3E%3C/svg%3E";

export const STORY_BEATS = [
  { beat: "Wife's demand", purpose: "A problem named in advance" },
  { beat: "The crossing", purpose: "A risky operation" },
  { beat: '"I want your heart!"', purpose: "A signal of failure" },
  { beat: "The bluff", purpose: "A response to the signal" },
  { beat: "Return to the tree", purpose: "A guaranteed end point" }
];

export const BEAT_KEYWORDS = {
  "Wife's demand": "class BetrayalError(Exception)",
  "The crossing": "try:",
  '"I want your heart!"': "raise BetrayalError",
  "The bluff": "except BetrayalError:",
  "Return to the tree": "finally:"
};

export const MACRO_STAGE_LABELS = [
  "Story", "Story Questions", "Computational Thinking", "Concept Discovery",
  "Mental Model", "Interactive Coding", "Python Syntax", "Assessment", "The Reveal", "Reflection"
];

export const CT_SUBSTEP_LABELS = [
  "Associative Mapping", "Discovery Questions", "Retrieval Questions"
];

export const LESSON_STEPS = [

  /* ===== 0. STORY ===== */
  {
    id: "story",
    type: "story",
    macroIndex: 0,
    eyebrow: "A Panchatantra Fable",
    title: "The Monkey and the Crocodile",
    paragraphs: [
      "On the banks of the mighty Ganges lived Raktamukha the Monkey, clever and kind-hearted, who feasted on sweet jamuns each day. One afternoon, Karalamukha the Crocodile surfaced beneath the tree. The monkey shared his fruit, and an unlikely friendship began.",
      "But the crocodile made a mistake, he told his wife about his friend. Jealous and hungry for something new, she demanded: \"Bring me his heart! I will not eat another bite until I taste the heart of your monkey friend.\" A threat was named, a potential problem existed now, even though nothing had gone wrong yet.",
      "Torn between love and loyalty, Karalamukha devised a plan. He invited the monkey onto his back to visit a fabled island of sweeter fruits. The monkey climbed on, a risky crossing had begun.",
      "Mid-river, the crocodile stopped. He sank, dragging the monkey down. \"My wife wants your heart,\" he confessed. The betrayal was announced, a signal was sent.",
      "But the monkey did not panic. \"We keep our hearts on trees! Mine hangs on the Jamun tree, we must go back!\" The crocodile, fooled by the lie, turned back. The monkey responded to the signal with a clever handler.",
      "Back at the tree, the monkey leaped to safety. Both characters had returned to where it all began, the Jamun tree. The tree was always the destination. It always would be."
    ]
  },

  /* ===== 1. STORY QUESTIONS ===== */
  {
    id: "story-questions",
    type: "question",
    macroIndex: 1,
    eyebrow: "Story Questions",
    title: "Before We Continue...",
    prompt: "The wife made a demand before anything went wrong. What did her demand introduce into the story?",
    options: [
      "A reason for the monkey to leave the tree",
      "A potential problem that could disrupt everything",
      "A new friendship between the wife and monkey",
      "A solution to the crocodile's loneliness"
    ],
    correctIndex: 1,
    wrongExplanations: [
      "The monkey had many reasons to leave the tree, the promise of sweeter fruit, for example. The wife's demand wasn't about giving a reason; it was about creating a risk that hadn't existed before. Think about what a threat introduces into a story.",
      null,
      "The wife wasn't looking for friendship, she wanted the monkey's heart. Her demand introduced danger, not warmth. What does a threatening demand create in the story?",
      "The crocodile's loneliness wasn't the problem here. The wife's demand creates a new problem rather than solving one. Think about what kind of thing a demand like this brings into the story."
    ],
    explanation: "Exactly, a threat was named in advance. Nothing had broken yet, but a potential problem existed. The wife's demand created the possibility of something going wrong before anything actually happened."
  },

  /* ===== 2. CT: ASSOCIATIVE MAPPING ===== */
  {
    id: "ct-mapping",
    type: "mapping-visual",
    macroIndex: 2,
    ctIndex: 0,
    eyebrow: "Computational Thinking · Associative Mapping",
    title: "Story Beats → Their Purpose",
    paragraphs: [
      "Every moment in the story serves a specific role. Each story beat connects to exactly one purpose, just like how a province connects to one tax amount. Watch each beat find its match:"
    ],
    pairs: STORY_BEATS.map(b => ({ key: b.beat, value: b.purpose })),
    closingLine: "Each story moment has its own distinct purpose. This shape, one thing pointing to another, is the foundation of how we'll structure our code."
  },

  /* ===== 3. CT: DISCOVERY QUESTIONS ===== */
  {
    id: "ct-discovery",
    type: "discovery",
    macroIndex: 2,
    ctIndex: 1,
    eyebrow: "Computational Thinking · Discovery Questions",
    title: "Think It Through",
    intro: "Before we write any code, let's reason through what exception handling means, the way a clever monkey would.",
    questions: [
      {
        id: "d1",
        prompt: "The crocodile could have let the monkey drown in silence. But he spoke, he sent a signal. Why does sending a signal matter?",
        options: [
          "Because the monkey needed to know what went wrong so he could respond",
          "Because the crocodile wanted to feel better about his choice"
        ],
        correctIndex: 0,
        wrongExplanations: [
          null,
          "A signal isn't about the sender's feelings, it's about communication. Without the crocodile's confession, the monkey drowns without ever knowing why. When something goes wrong in silence, nobody knows what happened or how to respond."
        ],
        followUp: "Exactly. A silent failure gives no information about what went wrong. But a signal, like the crocodile's confession, tells the listener exactly what the problem is, so they know how to respond."
      },
      {
        id: "d2",
        prompt: "The monkey's bluff was a specific lie to handle the crocodile's specific betrayal. Could the same lie have handled a different type of betrayal?",
        options: [
          "Yes, one response can handle any problem",
          "No, each type of problem needs a specific response"
        ],
        correctIndex: 1,
        wrongExplanations: [
          "Would the monkey's bluff about the Jamun tree fool a tiger? No, a tiger doesn't care about fruit. What works for one kind of problem won't work for another. Each problem needs its own specific response.",
          null
        ],
        followUp: "Right. You respond to a betrayal with a betrayal-specific bluff. A snake attack needs a snake-specific response. Each kind of problem needs its own solution, just like a monkey needs a different trick for a crocodile than for a tiger."
      },
      {
        id: "d3",
        prompt: "The Jamun tree was always the destination, no matter what happened during the crossing. What does this guarantee represent?",
        options: [
          "That the tree was lucky to have fruit",
          "That some destination is reached NO MATTER WHAT, whether the crossing went well or badly"
        ],
        correctIndex: 1,
        wrongExplanations: [
          "Luck has nothing to do with it. The story explicitly says both characters always end up at the tree, whether the crossing succeeded or the crocodile tried betrayal. That's a guarantee, not chance. The tree is the one thing that always happens, no matter what.",
          null
        ],
        followUp: "Yes! The tree is the guarantee. Whether the crossing succeeds or the crocodile tries to betray, both characters end up at the tree. It's the one thing that always happens, regardless of what went wrong."
      }
    ]
  },

  /* ===== 4. CT: RETRIEVAL ACTIVITY ===== */
  {
    id: "ct-retrieval",
    type: "retrieval-activity",
    macroIndex: 2,
    ctIndex: 2,
    eyebrow: "Computational Thinking · Retrieval Activity",
    title: "Quick Recall",
    instructions: "I'll name a story moment. Tap the matching purpose as fast as you can.",
    leftButtons: STORY_BEATS.map(b => b.beat),
    rightChoices: STORY_BEATS.map(b => b.purpose),
    rounds: [
      { ask: "Wife's demand", correct: "A problem named in advance", wrongDirection: "The wife's demand happens before any action, it's about setting up a rule or expectation in advance." },
      { ask: '"I want your heart!"', correct: "A signal of failure", wrongDirection: "The crocodile says this to announce his betrayal, it's the moment the problem is revealed." },
      { ask: "Return to the tree", correct: "A guaranteed end point", wrongDirection: "The return happens regardless of what went wrong, both characters always end up at the tree." }
    ],
    completionLine: "Every time, you found the right purpose by going straight to the story moment it matches."
  },

  /* ===== 6. CONCEPT TRANSITION ===== */
  {
    id: "concept-transition",
    type: "story",
    macroIndex: 3,
    eyebrow: "Concept Discovery · A New Thought",
    title: "The Same Shape",
    paragraphs: [
      "The Panchatantra storytellers wove five moments into one story. Programmers, it turns out, need exactly the same five-part pattern when writing code that handles problems.",
      "A problem must be named before it happens. A risky operation must be marked. If something goes wrong, a signal must be sent. That signal needs a specific response. And some things must happen NO MATTER WHAT, like returning to the Jamun tree.",
      "Programmers have names for each of these five pieces. Let's see what they are."
    ]
  },

  /* ===== 7. MENTAL MODEL ===== */
  {
    id: "mental-model",
    type: "mental-model",
    macroIndex: 4,
    eyebrow: "Mental Model",
    title: "Exception as a Signal",
    paragraphs: [
      "A story has slots, each moment fills one. The wife names the problem before it exists, that's the Exception class, defined in advance. The monkey climbs onto the crocodile's back, not knowing what will happen, that's the try block, marking the risky operation. Mid-river the crocodile confesses, \"I want your heart!\", that's the raise statement, the signal that something went wrong. The monkey's bluff is a specific answer to that specific betrayal, that's the except block. And no matter what, success or betrayal, both characters end up at the Jamun tree, that's the finally block, the guarantee."
    ],
    visualBoxes: [
      { label: "class BetrayalError(Exception)", value: "The wife names the problem" },
      { label: "try:", value: "The monkey begins the crossing" },
      { label: "raise BetrayalError", value: "\"I want your heart!\" \u2014 the signal" },
      { label: "except BetrayalError:", value: "The monkey\u2019s bluff responds" },
      { label: "finally:", value: "Both return to the Jamun tree" }
    ]
  },

  /* ===== 8. INTERACTIVE CODING ===== */
  {
    id: "interactive-coding",
    type: "coding",
    macroIndex: 5,
    eyebrow: "Interactive Coding",
    title: "Arrange the Story \u2192 Watch it Become Code",
    filename: "crocodile_river.py",
    instructions: "Drag the story cards into the correct order, then watch each one transform into Python code.",
    storyEvents: [
      { id: "s1", story: "Wife\u2019s demand names the problem before it happens", code: "class BetrayalError(Exception):\n    pass", lineFrom: 1, lineTo: 2 },
      { id: "s2", story: "The monkey begins the risky crossing of the river", code: "try:\n    cross_river()", lineFrom: 4, lineTo: 5 },
      { id: "s3", story: "The crocodile announces the betrayal as a signal", code: "except BetrayalError:", lineFrom: 6, lineTo: 6 },
      { id: "s4", story: "The monkey responds with a clever bluff to escape", code: "    print(\"My heart is on the Jamun tree!\")", lineFrom: 7, lineTo: 7 },
      { id: "s5", story: "Both characters return to the tree no matter what", code: "finally:\n    print(\"Back to safety.\")", lineFrom: 9, lineTo: 10 }
    ],
    completeCode: `class BetrayalError(Exception):
    pass

try:
    cross_river()
except BetrayalError:
    print("My heart is on the Jamun tree!")
finally:
    print("Back to safety.")`,
    expectedOutput: "My heart is on the Jamun tree!\nBack to safety.",
    successMessage: "Perfect! You've arranged all five story moments and watched them transform into Python code."
  },

  /* ===== 9. PYTHON SYNTAX ===== */
  {
    id: "python-syntax",
    type: "syntax",
    macroIndex: 6,
    eyebrow: "Python Syntax",
    title: "Every Operation Has a Story",
    paragraphs: [
      "Each thing you can do with exceptions in Python was first a moment in the story. The code below shows the full pattern."
    ],
    codeBlocks: [
      {
        label: "1. Define a custom Exception",
        motivation: "The wife names her demand before any action is taken.",
        code: `class BetrayalError(Exception):
    pass`
      },
      {
        label: "2. Mark the risky operation",
        motivation: "The monkey climbs onto the crocodile's back, the crossing begins.",
        code: `try:
    cross_river()`
      },
      {
        label: "3. Raise the exception (send the signal)",
        motivation: "\"My wife wants your heart!\", the betrayal is announced.",
        code: `raise BetrayalError("Wife wants your heart!")`
      },
      {
        label: "4. Catch and handle the exception",
        motivation: "The monkey's bluff, a specific response to a specific problem.",
        code: `except BetrayalError:
    print("My heart is on the Jamun tree!")`
      },
      {
        label: "5. The finally guarantee",
        motivation: "Both characters return to the Jamun tree, no matter what.",
        code: `finally:
    print("Back to safety.")`
      }
    ]
  },

  /* ===== 10. ASSESSMENT ===== */
  {
    id: "assessment",
    type: "assessment",
    macroIndex: 7,
    eyebrow: "Assessment",
    title: "Check Your Understanding",
    questions: [
      {
        id: "q1",
        prompt: "What does the raise statement do?",
        options: [
          "It stops the program immediately with no message",
          "It sends a signal, like the crocodile announcing the betrayal, so a handler can respond",
          "It defines a new type of problem",
          "It guarantees code runs no matter what"
        ],
        correctIndex: 1,
        explanation: "raise sends an exception signal. Without it, the program would fail silently, but the signal tells the handler exactly what went wrong."
      },
      {
        id: "q2",
        prompt: "Which part of the story does the finally block correspond to?",
        options: [
          "The wife's demand, naming a problem in advance",
          "The crossing, the risky operation",
          "The return to the Jamun tree, code that always runs",
          "The bluff, responding to the signal"
        ],
        correctIndex: 2,
        explanation: "finally is the Jamun tree, no matter what happens in try or except, the finally block always executes. It's the guarantee."
      },
      {
        id: "q3",
        prompt: "Why do we define custom Exception classes (like BetrayalError) instead of just using a generic Exception?",
        options: [
          "Because Python requires custom exceptions for try blocks",
          "Because different types of problems need different handlers, just like different betrayals would need different bluffs",
          "Because the class name makes the code run faster",
          "Because exceptions must always be custom-defined"
        ],
        correctIndex: 1,
        explanation: "Custom exception types let you catch specific problems with specific handlers, just as the monkey's bluff was a specific response to a specific betrayal."
      }
    ]
  },

  /* ===== 11. CONCEPT REVEAL ===== */
  {
    id: "concept-reveal",
    type: "reveal",
    macroIndex: 8,
    eyebrow: "The Reveal",
    title: "Exception Handling in Python",
    paragraphs: [
      "The five moments of the story together form Python's complete exception handling structure. This is the same pattern you just matched by hand, now written in code."
    ],
    mapPairs: Object.entries(BEAT_KEYWORDS).map(([beat, keyword]) => ({ key: beat, value: keyword })),
    code: `class BetrayalError(Exception):
    pass

try:
    cross_river()
except BetrayalError:
    print("My heart is on the Jamun tree!")
finally:
    print("Back to safety.")`,
    legendPairs: [
      { story: "A problem named in advance", python: "class...Exception" },
      { story: "A risky operation", python: "try:" },
      { story: "A signal sent", python: "raise" },
      { story: "A handler responds", python: "except" },
      { story: "A guarantee", python: "finally:" }
    ],
    closingLine: "Same story. Same pattern. Now written in Python."
  },

  /* ===== 12. REFLECTION ===== */
  {
    id: "reflection",
    type: "reflection",
    macroIndex: 9,
    eyebrow: "Reflection",
    title: "Think Back Over the Journey",
    paragraphs: [
      "You never started with 'try' or 'except.' You started with a monkey and a crocodile, a friendship, a betrayal, and a clever bluff. The Python keywords showed up only after the story had already built the shape in your mind.",
      "That shape, name the problem, mark the risk, signal the failure, handle it, guarantee cleanup, is exception handling."
    ],
    prompts: [
      "What other situations in life follow this pattern: name a risk, try something, handle problems, and always clean up?",
      "Now that you've felt the shape from the story side, how does exception handling feel different from just 'remembering the keywords'?"
    ]
  }
];
