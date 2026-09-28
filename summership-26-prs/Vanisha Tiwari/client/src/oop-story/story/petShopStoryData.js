// Complete 17-Scene Story Data for Buddy's Magic Pet Shop (Case Study 1: Encapsulation)
// Adheres strictly to the Mentor's "Story First" pedagogical framework

export const PET_SHOP_EPISODES = [
  // =========================================================================
  // SCENE 1 — JUST MEET BUDDY
  // =========================================================================
  {
    id: 1,
    title: "Welcome to the Magic Pet Shop!",
    subtitle: "Scene 1: Meet Playful Buddy",
    theme: "shop-front",
    stageProps: {
      doorOpen: false,
      messyVars: false,
      bundledObject: false,
      petCard: false,
      stepCodeLine: 0,
      showEncapsulationTitle: false,
      requestFlow: null,
      setterTester: false
    },
    dialogue: [
      {
        speaker: "Luna",
        text: "✨ Look who is here! Welcome to the Magic Pet Shop!",
        sfx: "chime"
      },
      {
        speaker: "Luna",
        text: "This is Buddy. Buddy is a very playful puppy!",
        sfx: "pop"
      },
      {
        speaker: "Buddy",
        text: "Woof! Woof! *Buddy wags his tail and does a happy jump!*",
        sfx: "bark"
      },
      {
        speaker: "Luna",
        text: "Let's step inside and learn all about our furry friend!",
        sfx: "pop"
      }
    ],
    codeSnippet: null,
    takeaway: "🐾 Every adventure begins with curiosity! Let's get to know Buddy!"
  },

  // =========================================================================
  // SCENE 2 — DISCOVER BUDDY'S INFORMATION
  // =========================================================================
  {
    id: 2,
    title: "Buddy's Information",
    subtitle: "Scene 2: Discovering Buddy's Facts",
    theme: "nursery",
    stageProps: {
      doorOpen: true,
      showBuddyFacts: true,
      messyVars: false,
      bundledObject: false,
      petCard: false,
      stepCodeLine: 0,
      showEncapsulationTitle: false,
      requestFlow: null,
      setterTester: false
    },
    dialogue: [
      {
        speaker: "Luna",
        text: "Look closely at Buddy. Buddy has a name: Buddy 🐶!",
        sfx: "pop"
      },
      {
        speaker: "Luna",
        text: "Buddy also has Health ❤️: 100!",
        sfx: "chime"
      },
      {
        speaker: "Luna",
        text: "And Buddy has Happiness 😊: 70!",
        sfx: "pop"
      },
      {
        speaker: "Buddy",
        text: "Yip! When my health is 100 and my happiness is high, I feel super energized!",
        sfx: "bark"
      },
      {
        speaker: "Luna",
        text: "Notice that: Name, Health, and Happiness are different pieces of information about the SAME dog!",
        sfx: "chime"
      }
    ],
    codeSnippet: null,
    takeaway: "🐶 A dog has several pieces of information that all describe the same animal."
  },

  // =========================================================================
  // SCENE 3 — TOO MANY PIECES OF INFORMATION
  // =========================================================================
  {
    id: 3,
    title: "Too Many Loose Variables!",
    subtitle: "Scene 3: The Messy Shop Problem",
    theme: "treat-counter",
    stageProps: {
      doorOpen: true,
      messyVars: true,
      bundledObject: false,
      petCard: false,
      stepCodeLine: 0,
      showEncapsulationTitle: false,
      requestFlow: null,
      setterTester: false
    },
    dialogue: [
      {
        speaker: "Luna",
        text: "If we had to keep Buddy's information in a computer program, what could we do?",
        sfx: "chime"
      },
      {
        speaker: "Luna",
        text: "We could store them in separate loose variables: buddy_name, buddy_health, buddy_happiness.",
        sfx: "pop"
      },
      {
        speaker: "Luna",
        text: "We can keep them separately... But what if our shop has 10 dogs?",
        sfx: "sadWobble"
      },
      {
        speaker: "Buddy",
        text: "Look at the screen! Bella, Max, Rocky, Daisy, Milo... each needs their own name, health, and happiness!",
        sfx: "bark"
      },
      {
        speaker: "Luna",
        text: "With 10 dogs, that's 30 loose variables floating all over the place! It's getting so messy!",
        sfx: "sadWobble"
      }
    ],
    codeSnippet: {
      language: "python",
      title: "Messy Loose Variables",
      code: `# 🐶 Dog 1: Buddy
buddy_name = "Buddy"
buddy_health = 100
buddy_happiness = 70

# 🐕 Dog 2: Bella
bella_name = "Bella"
bella_health = 90
bella_happiness = 85

# 🐩 Dog 3: Max... and 7 more dogs!
# 😱 30+ loose variables scattered everywhere!`,
      highlightLines: [2, 3, 4, 7, 8, 9],
      danger: true,
      explanation: "Keeping every dog's details as loose separate variables quickly becomes messy and unmanageable!"
    },
    takeaway: "⚠️ When related information is kept separately, programs become cluttered and hard to track."
  },

  // =========================================================================
  // SCENE 4 — GIVE THE INFORMATION ONE IDENTITY
  // =========================================================================
  {
    id: 4,
    title: "Give the Information One Identity",
    subtitle: "Scene 4: The Idea of Bundling",
    theme: "treat-counter",
    stageProps: {
      doorOpen: true,
      messyVars: false,
      bundledObject: true,
      petCard: false,
      stepCodeLine: 0,
      showEncapsulationTitle: false,
      requestFlow: null,
      setterTester: false
    },
    dialogue: [
      {
        speaker: "Luna",
        text: "All these pieces of information belong to the same dog.",
        sfx: "chime"
      },
      {
        speaker: "Luna",
        text: "What if we could bring Buddy's related information together into one identity?",
        sfx: "pop"
      }
    ],
    interactiveType: "mcq",
    mcq: {
      question: "What is the cleanest way to organize Buddy's information?",
      options: [
        {
          id: "b",
          text: "📦 Bring Buddy's related information together into one single entity: Buddy!",
          correct: true,
          feedback: "🎉 Exactly! We can think of all these related pieces as ONE thing: Buddy!"
        },
        {
          id: "a",
          text: "📄 Keep every piece of information separate across dozens of loose variables.",
          correct: false,
          feedback: "😅 If we keep them separate, adding more pets will make our code chaotic and hard to manage!"
        }
      ]
    },
    codeSnippet: null,
    takeaway: "💡 We can bundle related pieces of information (name + health + happiness) into one concept: Buddy."
  },

  // =========================================================================
  // SCENE 5 — BUDDY ALSO DOES THINGS
  // =========================================================================
  {
    id: 5,
    title: "Buddy Also Does Things!",
    subtitle: "Scene 5: Information + Actions",
    theme: "play-garden",
    stageProps: {
      doorOpen: true,
      showBehaviorTree: true,
      messyVars: false,
      bundledObject: true,
      petCard: false,
      stepCodeLine: 0,
      showEncapsulationTitle: false,
      requestFlow: null,
      setterTester: false
    },
    dialogue: [
      {
        speaker: "Luna",
        text: "Buddy doesn't just HAVE information. Buddy can also DO things!",
        sfx: "chime"
      },
      {
        speaker: "Buddy",
        text: "That's right! I can 🍎 eat yummy treats, 🎾 play fetch in the yard, and 💚 heal when I rest!",
        sfx: "bark"
      },
      {
        speaker: "Luna",
        text: "Look at Buddy's structure: Buddy has information (name, health, happiness) AND Buddy can do actions (eat, play, heal)!",
        sfx: "pop"
      }
    ],
    interactiveType: "mcq",
    mcq: {
      question: "Wouldn't it be useful if Buddy's information and the things Buddy can do stayed together?",
      options: [
        {
          id: "yes",
          text: "✨ Yes! Keep Buddy's facts and Buddy's actions packaged together!",
          correct: true,
          feedback: "🌟 Brilliant! In real life and in programming, things that belong together should stay together!"
        },
        {
          id: "no",
          text: "❌ No, put his actions in a completely separate file with no connection.",
          correct: false,
          feedback: "🤔 If actions are disconnected from data, it's very easy to make mistakes and lose track of who is acting!"
        }
      ]
    },
    codeSnippet: null,
    takeaway: "🎾 An entity has both information (what it HAS) and actions (what it can DO)."
  },

  // =========================================================================
  // SCENE 6 — REAL-LIFE IDEA: THE PET CARD
  // =========================================================================
  {
    id: 6,
    title: "A Real-Life Pet Record Card",
    subtitle: "Scene 6: Real-World Analogy",
    theme: "code-workshop",
    stageProps: {
      doorOpen: true,
      petCard: true,
      messyVars: false,
      bundledObject: false,
      stepCodeLine: 0,
      showEncapsulationTitle: false,
      requestFlow: null,
      setterTester: false
    },
    dialogue: [
      {
        speaker: "Luna",
        text: "Think about how a real pet shop or veterinary clinic works!",
        sfx: "chime"
      },
      {
        speaker: "Luna",
        text: "A pet shop keeps Buddy's information together in Buddy's own official Pet Card.",
        sfx: "pop"
      },
      {
        speaker: "Buddy",
        text: "Look at my Pet Card! It lists my Name, Health, Happiness, and all the actions I can do!",
        sfx: "bark"
      },
      {
        speaker: "Luna",
        text: "Everything related to Buddy stays together in one neat place. This is our real-life foundation!",
        sfx: "chime"
      }
    ],
    codeSnippet: null,
    takeaway: "📋 In real life, records keep an entity's data and allowed actions organized together in one place."
  },

  // =========================================================================
  // SCENE 7 — PYTHON GIVES US A WAY
  // =========================================================================
  {
    id: 7,
    title: "Python Gives Us a Way: The Blueprint",
    subtitle: "Scene 7: Introducing the Class Blueprint",
    theme: "code-workshop",
    stageProps: {
      doorOpen: true,
      petCard: true,
      blueprintGlow: true,
      messyVars: false,
      bundledObject: false,
      stepCodeLine: 1,
      showEncapsulationTitle: false,
      requestFlow: null,
      setterTester: false
    },
    dialogue: [
      {
        speaker: "Luna",
        text: "Python gives programmers a fantastic way to represent this real-life idea!",
        sfx: "chime"
      },
      {
        speaker: "Luna",
        text: "We can create a blueprint for any pet. In Python, this blueprint is called a 'class'!",
        sfx: "pop"
      },
      {
        speaker: "Buddy",
        text: "A blueprint? Just like an architect's drawing for building lovely dog houses?",
        sfx: "bark"
      },
      {
        speaker: "Luna",
        text: "Exactly, Buddy! We write `class Pet:` to define what every pet has and what every pet can do!",
        sfx: "success"
      }
    ],
    codeSnippet: {
      language: "python",
      title: "Buddy's Pet Blueprint (Class)",
      code: `class Pet:
    # 🐾 This is the blueprint for all pets in our shop!
    pass`,
      highlightLines: [1],
      explanation: "In Python, 'class Pet:' creates a blueprint that bundles related pet data and actions!"
    },
    takeaway: "📐 A 'class' in Python is a blueprint used to create objects that bundle data and actions together."
  },

  // =========================================================================
  // SCENE 8 — BUILD THE CLASS STEP BY STEP
  // =========================================================================
  {
    id: 8,
    title: "Build the Class Step by Step",
    subtitle: "Scene 8: Connecting Story to Code",
    theme: "code-workshop",
    stageProps: {
      doorOpen: true,
      petCard: false,
      messyVars: false,
      bundledObject: false,
      stepCodeLine: 4,
      showEncapsulationTitle: false,
      requestFlow: null,
      setterTester: false
    },
    dialogue: [
      {
        speaker: "Luna",
        text: "Let's build our class step by step. Every line of code matches something we saw in the story!",
        sfx: "chime"
      },
      {
        speaker: "Luna",
        text: "Story: 'Buddy has a name.' → Python: self.name = name!",
        sfx: "pop"
      },
      {
        speaker: "Luna",
        text: "Story: 'Buddy has health.' → Python: self.health = 100!",
        sfx: "pop"
      },
      {
        speaker: "Luna",
        text: "Story: 'Buddy has happiness.' → Python: self.happiness = 70!",
        sfx: "pop"
      },
      {
        speaker: "Buddy",
        text: "Woof! Now creating `buddy = Pet('Buddy')` creates me with all my facts together!",
        sfx: "bark"
      }
    ],
    codeSnippet: {
      language: "python",
      title: "Step-by-Step Pet Class",
      code: `class Pet:
    def __init__(self, name):
        self.name = name          # 🐶 Buddy's name
        self.health = 100         # ❤️ Buddy's health
        self.happiness = 70       # 😊 Buddy's happiness

# Create Buddy from the blueprint:
buddy = Pet("Buddy")`,
      highlightLines: [3, 4, 5, 8],
      explanation: "Notice how every Python line directly represents a fact about Buddy from our story!"
    },
    takeaway: "🔗 Python code directly mirrors the real-world facts: name, health, and happiness inside one Pet object."
  },

  // =========================================================================
  // SCENE 9 — NOW INTRODUCE ENCAPSULATION
  // =========================================================================
  {
    id: 9,
    title: "Introducing Encapsulation!",
    subtitle: "Scene 9: The Core Concept Revealed",
    theme: "code-workshop",
    stageProps: {
      doorOpen: true,
      showEncapsulationTitle: true,
      messyVars: false,
      bundledObject: false,
      petCard: false,
      stepCodeLine: 0,
      requestFlow: null,
      setterTester: false
    },
    dialogue: [
      {
        speaker: "Luna",
        text: "We brought related information and behavior together inside the object.",
        sfx: "chime"
      },
      {
        speaker: "Luna",
        text: "This fundamental idea is called...",
        sfx: "pop"
      },
      {
        speaker: "Luna",
        text: "🔒 ENCAPSULATION!",
        sfx: "fanfare"
      },
      {
        speaker: "Luna",
        text: "Encapsulation means keeping related data and the things that work with that data together, while controlling how important data is changed.",
        sfx: "chime"
      },
      {
        speaker: "Buddy",
        text: "En-cap-su-la-tion! All my information is wrapped in one neat, cozy package!",
        sfx: "bark"
      }
    ],
    codeSnippet: null,
    takeaway: "🔒 ENCAPSULATION bundles related data and actions together inside an object while controlling how data changes."
  },

  // =========================================================================
  // SCENE 10 — WHY CONTROL MATTERS (TAMPER PROBLEM)
  // =========================================================================
  {
    id: 10,
    title: "Why Control Matters: The Tamper Mishap",
    subtitle: "Scene 10: The Danger of Open Data",
    theme: "treat-counter",
    stageProps: {
      doorOpen: true,
      tamperEvent: { text: "buddy.health = -500", danger: true },
      messyVars: false,
      bundledObject: false,
      petCard: false,
      stepCodeLine: 0,
      showEncapsulationTitle: false,
      requestFlow: null,
      setterTester: false
    },
    dialogue: [
      {
        speaker: "Luna",
        text: "Now, let's explore the second crucial part of Encapsulation: CONTROL!",
        sfx: "chime"
      },
      {
        speaker: "Luna",
        text: "Look what happens if outside code directly types: `buddy.health = -500`!",
        sfx: "sadWobble"
      },
      {
        speaker: "Buddy",
        text: "😱 Oof... My tummy feels dizzy! Can a puppy really have MINUS 500 health?!",
        sfx: "sadWobble"
      },
      {
        speaker: "Luna",
        text: "Oops! We don't want anyone changing Buddy's important health value to anything they want!",
        sfx: "pop"
      }
    ],
    interactiveType: "mcq",
    mcq: {
      question: "How should Buddy control how his health changes?",
      options: [
        {
          id: "protect",
          text: "🛡️ Protect health internally so outside code cannot set invalid/negative numbers!",
          correct: true,
          feedback: "🎉 Exactly! Buddy should protect his health and only allow safe, rule-checked updates!"
        },
        {
          id: "open",
          text: "🔓 Leave health open and hope nobody ever makes a typing mistake.",
          correct: false,
          feedback: "😅 Leaving it open is what caused the -500 disaster! We need built-in protection!"
        }
      ]
    },
    codeSnippet: {
      language: "python",
      title: "Direct Access Danger",
      code: `# ❌ Danger! Direct access allows impossible numbers:
buddy.health = -500    # Health is negative?!
buddy.health = 999999  # 10,000 candies at once!`,
      highlightLines: [2, 3],
      danger: true,
      explanation: "Without control, outside code can set impossible or dangerous values!"
    },
    takeaway: "⚠️ Without protection and control, outside code can corrupt an object's internal state."
  },

  // =========================================================================
  // SCENE 11 — INTRODUCE PRIVATE DATA (MEET CAPSULE)
  // =========================================================================
  {
    id: 11,
    title: "Meet Capsule & Private Data (`__health`)",
    subtitle: "Scene 11: Python's Two Magic Underscores",
    theme: "code-workshop",
    stageProps: {
      doorOpen: true,
      capsuleVisible: true,
      messyVars: false,
      bundledObject: false,
      petCard: false,
      stepCodeLine: 0,
      showEncapsulationTitle: false,
      requestFlow: null,
      setterTester: false
    },
    dialogue: [
      {
        speaker: "Capsule",
        text: "BOING! Hello friends! I am Capsule, the protector of important data!",
        sfx: "boing"
      },
      {
        speaker: "Capsule",
        text: "In Python, when we want to make data internal and protected, we prefix it with two underscores: `__`!",
        sfx: "pop"
      },
      {
        speaker: "Luna",
        text: "Writing `self.__health = 100` tells Python that health is internal to Buddy.",
        sfx: "chime"
      },
      {
        speaker: "Luna",
        text: "Python uses a mechanism called 'name mangling' so outside code cannot accidentally overwrite `buddy.__health`!",
        sfx: "pop"
      },
      {
        speaker: "Buddy",
        text: "Yip! The double underscore `__` puts my health safely inside Capsule's protective shield!",
        sfx: "bark"
      }
    ],
    codeSnippet: {
      language: "python",
      title: "Private Data with `__`",
      code: `class Pet:
    def __init__(self, name):
        self.name = name
        self.__health = 100     # 🔒 Private internal attribute!
        self.__happiness = 70   # 🔒 Protected from direct tamper!

buddy = Pet("Buddy")
# buddy.__health = -500 -> Python protects it with name mangling!`,
      highlightLines: [4, 5, 8],
      explanation: "Double underscore `__` marks an attribute as private/internal, shielding it from direct outside tampering!"
    },
    takeaway: "🔒 In Python, starting an attribute name with `__` signifies that it is internal and protected."
  },

  // =========================================================================
  // SCENE 12 — METHODS CONTROL THE CHANGE
  // =========================================================================
  {
    id: 12,
    title: "Methods Control the Change",
    subtitle: "Scene 12: Controlled Action Flow",
    theme: "code-workshop",
    stageProps: {
      doorOpen: true,
      capsuleVisible: true,
      requestFlow: { from: "OUTSIDE", action: "heal(20)", target: "BUDDY", result: "HEALTH +20" },
      messyVars: false,
      bundledObject: false,
      petCard: false,
      stepCodeLine: 0,
      showEncapsulationTitle: false,
      setterTester: false
    },
    dialogue: [
      {
        speaker: "Luna",
        text: "If outside code cannot touch health directly, how do we heal Buddy?",
        sfx: "chime"
      },
      {
        speaker: "Luna",
        text: "Instead of writing `buddy.__health = 120`, we call a method: `buddy.heal(20)`!",
        sfx: "pop"
      },
      {
        speaker: "Capsule",
        text: "Look at the flow: OUTSIDE sends `heal(20)` → Buddy receives the request → Buddy checks the rules → Buddy changes his own health!",
        sfx: "boing"
      },
      {
        speaker: "Buddy",
        text: "I control the change! If someone passes a negative number like `heal(-50)`, my method rejects it!",
        sfx: "bark"
      }
    ],
    codeSnippet: {
      language: "python",
      title: "Controlling Changes with Methods",
      code: `class Pet:
    def __init__(self, name):
        self.name = name
        self.__health = 80

    def heal(self, amount):
        # 🛡️ Buddy controls the change with validation rules:
        if amount > 0:
            self.__health = min(100, self.__health + amount)
            print(f"Healed! Health is now {self.__health}")
        else:
            print("Invalid healing amount! Rejected!")

buddy = Pet("Buddy")
buddy.heal(20)  # ✅ Safe controlled update!`,
      highlightLines: [6, 7, 8, 9, 14],
      explanation: "The object controls how its internal state changes by validating inputs inside its methods."
    },
    takeaway: "🚪 Methods act as safe doorways that validate requests before updating internal private data."
  },

  // =========================================================================
  // SCENE 13 — GETTERS AND SETTERS
  // =========================================================================
  {
    id: 13,
    title: "Getters & Setters: Safe Windows & Gates",
    subtitle: "Scene 13: Reading & Writing with Rules",
    theme: "code-workshop",
    stageProps: {
      doorOpen: true,
      capsuleVisible: true,
      setterTester: true,
      messyVars: false,
      bundledObject: false,
      petCard: false,
      stepCodeLine: 0,
      showEncapsulationTitle: false,
      requestFlow: null
    },
    dialogue: [
      {
        speaker: "Luna",
        text: "Sometimes we want to READ the private value. We use a **getter**: `get_health()`!",
        sfx: "chime"
      },
      {
        speaker: "Capsule",
        text: "A getter lets outside code peek at Buddy's health without risking any changes!",
        sfx: "boing"
      },
      {
        speaker: "Luna",
        text: "Sometimes we want to safely UPDATE the value. We use a **setter**: `set_health(val)`!",
        sfx: "pop"
      },
      {
        speaker: "Capsule",
        text: "Look at the setter test: `set_health(80)` ✅ is accepted! `set_health(500)` ❌ is blocked! `set_health(-20)` ❌ is blocked!",
        sfx: "boing"
      }
    ],
    codeSnippet: {
      language: "python",
      title: "Getter and Setter in Python",
      code: `class Pet:
    def __init__(self, name):
        self.name = name
        self.__health = 100

    # 🔍 Getter: Safely peek at private health
    def get_health(self):
        return self.__health

    # 🛡️ Setter: Gatekeeper with rule validation
    def set_health(self, health):
        if 0 <= health <= 100:
            self.__health = health
        else:
            print("Invalid health! Must be between 0 and 100.")

buddy = Pet("Buddy")
buddy.set_health(80)   # ✅ Valid: Health becomes 80
buddy.set_health(500)  # ❌ Blocked by validation check!`,
      highlightLines: [7, 8, 11, 12, 13, 17, 18],
      explanation: "Getters safely expose data; Setters enforce business rules and validation before modifying state."
    },
    takeaway: "🔍 Getters allow safe viewing, while Setters enforce safety bounds (0 to 100) before changing data."
  },

  // =========================================================================
  // SCENE 14 — INTERACTIVE PET CARE
  // =========================================================================
  {
    id: 14,
    title: "Interactive Pet Care Station",
    subtitle: "Scene 14: Hands-On Methods in Action",
    theme: "play-garden",
    stageProps: {
      doorOpen: true,
      capsuleVisible: true,
      messyVars: false,
      bundledObject: false,
      petCard: false,
      stepCodeLine: 0,
      showEncapsulationTitle: false,
      requestFlow: null,
      setterTester: false
    },
    dialogue: [
      {
        speaker: "Luna",
        text: "Now it's your turn to interact with Buddy using real Python methods!",
        sfx: "chime"
      },
      {
        speaker: "Buddy",
        text: "Try clicking the 🍎 Feed, 🎾 Play, 💚 Heal, and 👀 Check Health buttons below!",
        sfx: "bark"
      },
      {
        speaker: "Capsule",
        text: "Watch how every button executes a Python method that validates the action and protects Buddy!",
        sfx: "boing"
      }
    ],
    interactiveType: "petCare",
    codeSnippet: null,
    takeaway: "🎮 Calling methods like feed(), play(), and heal() safely updates Buddy's internal state according to rules."
  },

  // =========================================================================
  // SCENE 15 — GUIDED CODING CHALLENGE
  // =========================================================================
  {
    id: 15,
    title: "Guided Coding Challenge",
    subtitle: "Scene 15: Build Buddy's Encapsulated Class",
    theme: "code-workshop",
    stageProps: {
      doorOpen: true,
      capsuleVisible: true,
      messyVars: false,
      bundledObject: false,
      petCard: false,
      stepCodeLine: 0,
      showEncapsulationTitle: false,
      requestFlow: null,
      setterTester: false
    },
    dialogue: [
      {
        speaker: "Luna",
        text: "Let's test your Python coding superpowers!",
        sfx: "chime"
      },
      {
        speaker: "Luna",
        text: "Complete the incomplete Pet class below by choosing the correct private attribute name and validation check.",
        sfx: "pop"
      }
    ],
    interactiveType: "codeChallenge",
    challenge: {
      prompt: "Complete the Python Pet class to properly encapsulate Buddy's health:",
      task1: {
        label: "1. What should we use for Buddy's private health attribute inside __init__?",
        options: ["self.health", "self._health", "self.__health", "self.private_health"],
        correct: "self.__health",
        hint: "Remember the two magic underscores `__` for private/internal attributes!"
      },
      task2: {
        label: "2. What validation check should go inside `set_health(self, health)`?",
        options: [
          "if 0 <= health <= 100:",
          "if health == -500:",
          "self.__health = health # No check!"
        ],
        correct: "if 0 <= health <= 100:",
        hint: "A healthy puppy has health between 0 and 100!"
      }
    },
    codeSnippet: null,
    takeaway: "⭐ You wrote encapsulated Python code with private attributes and validation checks!"
  },

  // =========================================================================
  // SCENE 16 — FINAL STORY QUIZ (10 COMPREHENSION QUESTIONS)
  // =========================================================================
  {
    id: 16,
    title: "The Magic Pet Shop Story Quiz",
    subtitle: "Scene 16: Test Your Understanding",
    theme: "play-garden",
    stageProps: {
      doorOpen: true,
      capsuleVisible: true,
      messyVars: false,
      bundledObject: false,
      petCard: false,
      stepCodeLine: 0,
      showEncapsulationTitle: false,
      requestFlow: null,
      setterTester: false
    },
    dialogue: [
      {
        speaker: "Luna",
        text: "Time for our friendly Story Quiz! Let's show how deeply you understand Encapsulation!",
        sfx: "fanfare"
      }
    ],
    interactiveType: "finalQuiz",
    quizQuestions: [
      {
        id: "q1",
        question: "Why did we bring Buddy's name, health, and happiness together into one Pet object?",
        options: [
          { text: "To represent Buddy as a single unified identity instead of scattered loose variables", correct: true },
          { text: "To make the computer run out of memory", correct: false },
          { text: "Because Python forces all variables to be named Buddy", correct: false }
        ],
        explanation: "Grouping related data gives our information a clear identity and avoids messy variable clutter."
      },
      {
        id: "q2",
        question: "What does a Python class like `class Pet:` represent?",
        options: [
          { text: "A blueprint for creating pet objects with data and actions", correct: true },
          { text: "A classroom where puppies do math homework", correct: false },
          { text: "A special variable that can only hold numbers", correct: false }
        ],
        explanation: "A class is a blueprint defining the structure and behavior of objects."
      },
      {
        id: "q3",
        question: "Why shouldn't outside code be allowed to change `buddy.health` freely (like `buddy.health = -500`)?",
        options: [
          { text: "Because direct modification bypasses safety rules and can corrupt the dog's state with impossible values", correct: true },
          { text: "Because negative numbers are not allowed in Python", correct: false },
          { text: "Because puppies don't like math", correct: false }
        ],
        explanation: "Unrestricted direct access allows bugs and invalid values like negative health."
      },
      {
        id: "q4",
        question: "What does prefixing an attribute with two underscores `self.__health` signify in Python?",
        options: [
          { text: "It indicates that the attribute is internal/private and uses name mangling to protect it", correct: true },
          { text: "It deletes the variable from the computer", correct: false },
          { text: "It makes the variable print in bold letters", correct: false }
        ],
        explanation: "Double underscore `__` signals private intent and triggers Python's name mangling."
      },
      {
        id: "q5",
        question: "Why should we use `buddy.heal(20)` instead of directly editing `buddy.__health`?",
        options: [
          { text: "Because the heal() method enforces safety rules (e.g. amount > 0 and max 100) before updating data", correct: true },
          { text: "Because heal() takes less typing", correct: false },
          { text: "Because heal() changes the dog's breed", correct: false }
        ],
        explanation: "Methods give the object control over its own internal state."
      },
      {
        id: "q6",
        question: "What is the primary role of a 'getter' method like `get_health()`?",
        options: [
          { text: "To safely read/view the private value without exposing it to direct modification", correct: true },
          { text: "To increase health by 100 every time it is called", correct: false },
          { text: "To erase the pet's name", correct: false }
        ],
        explanation: "Getters provide controlled read-only access to internal private data."
      },
      {
        id: "q7",
        question: "What is the primary role of a 'setter' method like `set_health(new_health)`?",
        options: [
          { text: "To validate the new value (e.g. 0 to 100) before saving it to the private attribute", correct: true },
          { text: "To change the variable to any random number", correct: false },
          { text: "To lock the computer screen", correct: false }
        ],
        explanation: "Setters act as gatekeepers that enforce validation rules before modifying data."
      },
      {
        id: "q8",
        question: "When you call `buddy.play()`, who controls how Buddy's happiness changes?",
        options: [
          { text: "Buddy's own class method controls the change internally", correct: true },
          { text: "The internet", correct: false },
          { text: "Outside code forces whatever number it wants", correct: false }
        ],
        explanation: "The object itself controls its internal state through its own method definitions."
      },
      {
        id: "q9",
        question: "What does the word **Encapsulation** mean in Python OOP?",
        options: [
          { text: "Bundling related data and methods together inside an object, while controlling how data is accessed and changed", correct: true },
          { text: "Writing code without any functions", correct: false },
          { text: "Converting Python into Javascript", correct: false }
        ],
        explanation: "Encapsulation combines bundling (cohesion) with controlled access (protection)."
      },
      {
        id: "q10",
        question: "In real life and Python, what is the best mental model for an object like Buddy?",
        options: [
          { text: "A self-contained entity that holds its own information and manages its own actions safely", correct: true },
          { text: "A random collection of unrelated text files", correct: false },
          { text: "A single number that never changes", correct: false }
        ],
        explanation: "Objects model real-world entities having state (attributes) and behavior (methods) bundled together."
      }
    ],
    codeSnippet: null,
    takeaway: "🏆 Outstanding! You have mastered the core principles and practice of Encapsulation!"
  },

  // =========================================================================
  // SCENE 17 — FINAL REFLECTION & GRADUATION CEREMONY
  // =========================================================================
  {
    id: 17,
    title: "Grand Celebration & Pet Hero Certificate!",
    subtitle: "Scene 17: Graduation & Reflection",
    theme: "grand-stage",
    stageProps: {
      doorOpen: true,
      capsuleVisible: true,
      hasCape: true,
      showReflection: true,
      messyVars: false,
      bundledObject: false,
      petCard: false,
      stepCodeLine: 0,
      showEncapsulationTitle: true,
      requestFlow: null,
      setterTester: false
    },
    dialogue: [
      {
        speaker: "Luna",
        text: "🎉 Congratulations! Look at Buddy in his superhero cape!",
        sfx: "fanfare"
      },
      {
        speaker: "Luna",
        text: "Before receiving your certificate, let's reflect on the 3 big truths we discovered:",
        sfx: "chime"
      },
      {
        speaker: "Capsule",
        text: "1. Related information stays together! 2. The object controls how its data changes! 3. Python gives us classes, methods, and private variables to represent this!",
        sfx: "boing"
      },
      {
        speaker: "Buddy",
        text: "Woof! Woof! That is why we use ENCAPSULATION! Claim your certificate below!",
        sfx: "bark"
      }
    ],
    interactiveType: "graduation",
    codeSnippet: null,
    takeaway: "🎓 You understand WHY and HOW we use Encapsulation in Python! Keep building safe code!"
  }
];
