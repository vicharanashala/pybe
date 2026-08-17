export const HELP_SECTIONS = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: "Compass",
    description: "Understand PyBe's scenario-driven approach to learning Python.",
    keywords: ["getting started", "overview", "flow", "pybe", "scenario-driven", "submission", "learning flow"]
  },
  {
    id: "how-scenarios-work",
    title: "How Scenarios Work",
    icon: "BookOpen",
    description: "Learn how real-world reasoning connects to programming concepts before code.",
    keywords: ["scenarios", "reasoning", "programming concept", "python construct", "umbrella", "example"]
  },
  {
    id: "learning-session",
    title: "Understanding a Learning Session",
    icon: "Layout",
    description: "A breakdown of every section on your learning screen.",
    keywords: ["learning session", "scenario", "hints", "objectives", "your reasoning", "ai mentor prompt", "reflection"]
  },
  {
    id: "mentor-output",
    title: "AI Mentor Output",
    icon: "Sparkles",
    description: "How to interpret your prompt maturity score, abstraction mapping, and feedback.",
    keywords: ["mentor output", "prompt maturity", "abstraction mapping", "generated python", "misconception signals", "score"]
  },
  {
    id: "how-to-approach",
    title: "How to Approach a Scenario",
    icon: "CheckSquare",
    description: "An 8-step practical guide to tackle any scenario effectively.",
    keywords: ["approach", "guide", "steps", "strategy", "best practices", "how to solve"]
  },
  {
    id: "example-walkthrough",
    title: "Example: Bag Weight Label",
    icon: "Lightbulb",
    description: "An interactive step-by-step example connecting real-world values to Python variables.",
    keywords: ["example", "bag weight", "walkthrough", "variable", "5 kg", "name", "interactive"]
  }
];

export const HELP_CONTENT = {
  "getting-started": {
    title: "Getting Started with PyBe",
    subtitle: "Scenario-Driven Python Learning for Beginners",
    intro: "PyBe is a scenario-driven Python learning platform designed to help you think like a developer before writing a single line of code. Traditional programming courses jump straight into syntax rules, but PyBe focuses on building your analytical reasoning first.",
    whatIsPybe: [
      "Real-world context first: Every lesson starts with a familiar situation (like spending pocket money or checking the weather) rather than abstract code snippets.",
      "Reasoning over syntax: You describe how to solve problems in plain English, allowing your natural problem-solving ability to lead.",
      "AI Mentor guidance: Your reasoning is mapped into programming abstractions and Python code by an intelligent mentor that evaluates your prompt maturity."
    ],
    learningFlow: [
      { step: 1, label: "Scenario", desc: "Read a real-world situation and goal." },
      { step: 2, label: "Think about the problem", desc: "Analyze what is happening in the situation." },
      { step: 3, label: "Identify important info", desc: "Spot the key numbers, text, or decisions." },
      { step: 4, label: "Explain your reasoning", desc: "Describe your solution in simple plain English." },
      { step: 5, label: "Write AI Mentor prompt", desc: "Ask the AI mentor to guide or explain your logic." },
      { step: 6, label: "Submit", desc: "Click 'Map My Reasoning' to process your input." },
      { step: 7, label: "Receive feedback", desc: "Review prompt maturity, code mapping, and misconception watch." },
      { step: 8, label: "Reflect", desc: "Consolidate your learning by noting what clicked." }
    ],
    afterSubmit: "After submitting your solution, PyBe processes your input through its rule-based AI engine. You receive a Prompt Maturity Score, an Abstraction Mapping breakdown, generated Python code matching your logic, and misconception watch notes to deepen your understanding."
  },

  "how-scenarios-work": {
    title: "How Scenarios Work",
    subtitle: "From Real-World Thinking to Python Code",
    intro: "PyBe does not begin by simply teaching Python syntax rules. Instead, it guides you through a progressive mental model:",
    progressionSteps: [
      { step: "Real-world situation", detail: "A practical day-to-day scenario you already understand." },
      { step: "Reasoning", detail: "The plain-English logic you use to make a decision." },
      { step: "Programming concept", detail: "The underlying computer science idea (e.g. Variable, Condition, List)." },
      { step: "Python construct", detail: "The syntactic building block in Python (e.g. if/else statement)." },
      { step: "Code", detail: "The executable Python snippet." }
    ],
    rainExample: {
      scenario: "It is raining before leaving home.",
      reasoning: "If it is raining, I should carry an umbrella.",
      concept: "Condition (Decision Making)",
      pythonCode: "if raining:\n    print(\"Carry an umbrella\")"
    },
    keyTakeaway: "Notice how the Python code is just a formal way of writing down the thought you already had! You don't need to memorize code syntax blindly; you just need to express your natural logic clearly."
  },

  "learning-session": {
    title: "Understanding a Learning Session",
    subtitle: "A Complete Tour of the Workspace Screen",
    sections: [
      {
        id: "scenario-box",
        title: "1. Scenario",
        icon: "Compass",
        summary: "The scenario gives you a real-world situation that you need to reason about.",
        details: "Read the story context carefully. Pay attention to what information is given and what goal or decision needs to be accomplished."
      },
      {
        id: "hints-chips",
        title: "2. Hints / Objectives",
        icon: "Lightbulb",
        summary: "Hint chips break down the problem into smaller mental stepping stones.",
        progression: "Identify one value → Give the value a name → Connect naming to a variable",
        details: "Hints should guide you toward the core concept without simply giving you the final answer. Try to think about the situation independently before relying on every hint chip!"
      },
      {
        id: "your-reasoning",
        title: "3. Your Reasoning",
        icon: "FileText",
        summary: "This is where you describe how you would solve the situation using your own words.",
        guidelines: [
          "Focus on your thinking, not code formatting.",
          "Do not worry about Python syntax initially.",
          "Explain what information matters in the situation.",
          "Explain what decision or action should happen.",
          "Break the problem into simple, logical steps."
        ],
        example: {
          plainText: "The computer needs to remember the bag's weight. I can give the value a meaningful name so I can refer to it later.",
          codeMap: "weight = 5"
        }
      },
      {
        id: "ai-mentor-prompt",
        title: "4. AI Mentor Prompt",
        icon: "MessageSquare",
        summary: "This is the question or instruction you would give to an AI mentor to help guide your learning.",
        promptComparison: {
          weak: {
            text: "Give me the answer.",
            reason: "Too vague. Does not explain what you understand or what specific guidance you need."
          },
          strong: {
            text: "Explain how my reasoning connects to Python variables and show me a simple example.",
            reason: "Clear goal, specific request, specifies the desired explanation type."
          }
        },
        usefulPromptFactors: [
          "Clear goal: State what you want to accomplish.",
          "Relevant context: Mention the situation or concept.",
          "Specific request: Ask for explanation, comparison, or breakdown.",
          "Desired output: Indicate if you want steps, code examples, or analogies."
        ]
      },
      {
        id: "reflection",
        title: "5. Reflection",
        icon: "Brain",
        summary: "Reflection asks you to think about what you learned from the scenario.",
        examples: [
          "\"I noticed that I was already thinking in terms of conditions before learning the Python syntax.\"",
          "\"I learned that a variable gives a name to a value so it can be used later in the program.\""
        ]
      }
    ]
  },

  "mentor-output": {
    title: "Understanding AI Mentor Output",
    subtitle: "How to Read the Right-Side Feedback Panel",
    components: [
      {
        title: "Prompt Maturity Score",
        icon: "BarChart2",
        scoreExample: 85,
        explanation: "The Prompt Maturity score represents how effectively you communicated your request and reasoning to the AI mentor.",
        importantNote: "Note: A lower score does NOT mean you lack Python skill! It simply means your prompt can be more specific, structured, or clear about your learning intent."
      },
      {
        title: "Abstraction Mapping",
        icon: "Layers",
        explanation: "Abstraction mapping connects your real-world reasoning directly to computer science abstractions.",
        exampleFlow: [
          { label: "Real world", val: "The bag weighs 5 kg." },
          { label: "Abstraction", val: "Store a value and give it a meaningful name." },
          { label: "Python concept", val: "Variable" },
          { label: "Python", val: "weight = 5" }
        ]
      },
      {
        title: "Generated Python",
        icon: "Code2",
        explanation: "This is one possible Python code representation of your plain-English reasoning.",
        purpose: "The generated code is intended to help you bridge the gap between your conceptual thinking and Python syntax. Compare it with your reasoning to see how words translate into code."
      },
      {
        title: "Misconception Signals",
        icon: "AlertCircle",
        explanation: "These signals identify possible misunderstandings or missed nuances in your reasoning so you know exactly what to practice next."
      }
    ]
  },

  "how-to-approach": {
    title: "How to Approach Any Scenario",
    subtitle: "8 Practical Steps for Every Learner",
    steps: [
      { number: 1, title: "Read the scenario carefully", detail: "Understand the context, goal, and constraints of the situation." },
      { number: 2, title: "Ask: 'What information matters?'", detail: "Identify numbers, names, status flags, or items that need to be remembered." },
      { number: 3, title: "Ask: 'What decision, action, or pattern is involved?'", detail: "Check if you are comparing values, repeating an action, or storing items together." },
      { number: 4, title: "Describe your reasoning in plain English", detail: "Write down how a human would solve this step by step without code keywords." },
      { number: 5, title: "Connect to a programming concept", detail: "Identify if this logic resembles a Variable, Condition, Loop, Function, or List." },
      { number: 6, title: "Write a useful AI mentor prompt", detail: "Formulate a clear prompt asking for specific guidance or explanation." },
      { number: 7, title: "Submit and study feedback", detail: "Analyze your Prompt Maturity, Abstraction Mapping, and Misconception Signals." },
      { number: 8, title: "Complete the reflection", detail: "Jot down your key insight to reinforce your long-term memory." }
    ]
  },

  "example-walkthrough": {
    title: "Example: Bag Weight Label",
    subtitle: "Interactive Walkthrough Connecting Values to Variables",
    scenarioText: "A student has one school bag with a weight written on a scale.",
    goal: "Learn why Python variables exist instead of just memorizing syntax rules.",
    steps: [
      {
        stepNum: 1,
        title: "Identify the value",
        realWorld: "The scale reads 5 kg.",
        dataValue: "5",
        desc: "First, notice the piece of information that the computer needs to remember."
      },
      {
        stepNum: 2,
        title: "Give the value a name",
        realWorld: "Instead of calling it 'that number on the scale', we give it a clear label: 'weight'.",
        dataValue: "weight",
        desc: "Giving a value a meaningful name allows us to refer to it later in our thinking."
      },
      {
        stepNum: 3,
        title: "Connect the name to a Python variable",
        realWorld: "We join the name and value using the assignment operator (=).",
        dataValue: "weight = 5",
        desc: "Now the computer stores 5 in memory under the name 'weight'. Python syntax is complete!"
      }
    ],
    flowSummary: "Real-world value (5) → Meaningful name (weight) → Variable (weight = 5)"
  }
};
