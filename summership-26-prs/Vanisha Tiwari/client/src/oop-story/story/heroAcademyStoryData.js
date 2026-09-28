// Complete 12-Episode Educational Cartoon Story for Hero Academy — The Power Family (Inheritance in Python OOP)

export const HERO_ACADEMY_EPISODES = [
  {
    id: 1,
    title: "Welcome to Hero Academy!",
    subtitle: "Episode 1: The Gates of Power",
    theme: "academy-gates",
    characters: {
      nova: { visible: true, action: "waving" },
      zippy: { visible: true, action: "waving" },
      ember: { visible: true, action: "floating" },
      shieldy: { visible: true, action: "flexing" },
      heroBadge: { visible: false }
    },
    dialogue: [
      {
        speaker: "Professor Nova",
        text: "⚡ Welcome to Hero Academy! I'm Professor Nova!",
        sfx: "powerUp"
      },
      {
        speaker: "Professor Nova",
        text: "This is where the universe's most amazing superheroes come to train and power up their abilities with Python OOP!",
        sfx: "chime"
      },
      {
        speaker: "Professor Nova",
        text: "Today, we have three eager new recruits joining our training academy. Let's open the blast doors and meet them!",
        sfx: "whoosh"
      }
    ],
    codeSnippet: null,
    takeaway: "🌟 Every great superhero team starts with strong foundations! Step inside Hero Academy!"
  },
  {
    id: 2,
    title: "Meet the Recruits!",
    subtitle: "Episode 2: Zippy, Ember & Shieldy",
    theme: "training-arena",
    characters: {
      nova: { visible: true, action: "talking" },
      zippy: { visible: true, action: "waving" },
      ember: { visible: true, action: "floating" },
      shieldy: { visible: true, action: "flexing" },
      heroBadge: { visible: false }
    },
    dialogue: [
      {
        speaker: "Professor Nova",
        text: "Meet our three heroic recruits!",
        sfx: "pop"
      },
      {
        speaker: "Zippy",
        text: "⚡ ZOOM! I'm Zippy! I can dash around the entire planet before you can blink!",
        sfx: "whoosh"
      },
      {
        speaker: "Ember",
        text: "🔥 Greetings! I'm Ember! I command magical flaming embers and glowing fire blasts!",
        sfx: "flame"
      },
      {
        speaker: "Shieldy",
        text: "🛡️ And I am Shieldy! No meteor or laser can break through my heavy energy shield!",
        sfx: "shield"
      },
      {
        speaker: "Professor Nova",
        text: "All three heroes are fantastic! Now it's time to build their Python code classes so they can join missions!",
        sfx: "chime"
      }
    ],
    codeSnippet: null,
    takeaway: "🦸 Every superhero is unique, but creating them in code requires smart design!"
  },
  {
    id: 3,
    title: "What Do Superheroes Have in Common?",
    subtitle: "Episode 3: Finding Shared Features",
    theme: "blueprint-deck",
    characters: {
      nova: { visible: true, action: "typing" },
      zippy: { visible: true, action: "idle" },
      ember: { visible: true, action: "idle" },
      shieldy: { visible: true, action: "idle" },
      heroBadge: { visible: false }
    },
    dialogue: [
      {
        speaker: "Professor Nova",
        text: "Let's inspect our three heroes on the Academy hologram board.",
        sfx: "pop"
      },
      {
        speaker: "Professor Nova",
        text: "Notice anything interesting? Even though they have different powers, they all share basic hero features!",
        sfx: "chime"
      },
      {
        speaker: "Zippy",
        text: "⚡ We all have a `name` so people know who saved the day!",
        sfx: "whoosh"
      },
      {
        speaker: "Shieldy",
        text: "🛡️ We all have `health` (HP) to keep going during tough battles!",
        sfx: "shield"
      },
      {
        speaker: "Ember",
        text: "🔥 And we all know how to `fight()` and `move()` across the city!",
        sfx: "flame"
      }
    ],
    codeSnippet: {
      language: "python",
      title: "Shared Superhero Traits",
      code: `# Every superhero needs these basic variables and actions:
name = "Hero Name"      # 🏷️ Identity
health = 100            # ❤️ Energy points
def fight(self):        # ⚔️ Universal hero action
    print("Fighting for justice!")`,
      highlightLines: [2, 3, 4],
      explanation: "All superheroes share common traits like name, health, and fighting actions!"
    },
    takeaway: "🔍 Before coding multiple objects, always identify the common features they share!"
  },
  {
    id: 4,
    title: "Oh No! The Repeated-Code Problem!",
    subtitle: "Episode 4: The Frustration of Copy-Paste",
    theme: "blueprint-deck",
    characters: {
      nova: { visible: true, action: "frustrated" },
      zippy: { visible: true, action: "shocked" },
      ember: { visible: true, action: "idle" },
      shieldy: { visible: true, action: "idle" },
      heroBadge: { visible: false }
    },
    dialogue: [
      {
        speaker: "Professor Nova",
        text: "Uh oh! Look at what happens when I try to write each hero class separately in Python!",
        sfx: "sadWobble"
      },
      {
        speaker: "Professor Nova",
        text: "I wrote `name = name` and `health = 100` inside SpeedHero. Then I wrote it AGAIN in FireHero, and AGAIN in ShieldHero!",
        sfx: "sadWobble"
      },
      {
        speaker: "Professor Nova",
        text: "Aaargh! Why am I typing the exact same code three times?! If we have 100 heroes, I'll be copy-pasting all day!",
        sfx: "sadWobble"
      },
      {
        speaker: "Zippy",
        text: "⚡ There has to be a faster way! We can't repeat ourselves like this!",
        sfx: "whoosh"
      }
    ],
    codeSnippet: {
      language: "python",
      title: "❌ The Bad Approach: Repeating Code 3 Times!",
      code: `# ❌ SpeedHero repeats name, health, fight
class SpeedHero:
    def __init__(self, name):
        self.name = name
        self.health = 100
    def fight(self):
        print("Fighting for justice!")

# ❌ FireHero repeats the exact same lines!
class FireHero:
    def __init__(self, name):
        self.name = name
        self.health = 100
    def fight(self):
        print("Fighting for justice!")`,
      highlightLines: [3, 4, 5, 10, 11, 12],
      danger: true,
      explanation: "Copy-pasting identical code into every class wastes time and creates hard-to-maintain programs!"
    },
    takeaway: "⚠️ In programming, repeating code is a big problem. There must be a better way to share code!"
  },
  {
    id: 5,
    title: "Story Choice: Help Professor Nova!",
    subtitle: "Episode 5: Finding the Smart Solution",
    theme: "blueprint-deck",
    characters: {
      nova: { visible: true, action: "thinking" },
      zippy: { visible: true, action: "idle" },
      ember: { visible: true, action: "idle" },
      shieldy: { visible: true, action: "idle" },
      heroBadge: { visible: false }
    },
    dialogue: [
      {
        speaker: "Professor Nova",
        text: "Help us solve this dilemma! How can we give all superheroes their shared features without typing the same code 100 times?",
        sfx: "chime"
      }
    ],
    interactiveType: "mcq",
    mcq: {
      question: "How should Professor Nova structure the superhero code to avoid repeating herself?",
      options: [
        {
          id: "a",
          text: "🦸 Create one common Hero class with shared features, and let specialized heroes inherit from it!",
          correct: true,
          feedback: "🎉 Bingo! That's the golden concept of INHERITANCE in Python OOP!"
        },
        {
          id: "b",
          text: "📋 Keep copy-pasting the same code into 100 different files and hope nothing breaks.",
          correct: false,
          feedback: "😅 If you change one thing later, you'd have to edit 100 files! That's too risky!"
        },
        {
          id: "c",
          text: "🚫 Cancel superhero training and delete all hero classes.",
          correct: false,
          feedback: "😢 But our city needs Zippy, Ember, and Shieldy! We just need smart code!"
        }
      ]
    },
    codeSnippet: null,
    takeaway: "💡 Instead of repeating common code, create one parent class and share it with Inheritance!"
  },
  {
    id: 6,
    title: "The Big Discovery: What is Inheritance?",
    subtitle: "Episode 6: The Power Family",
    theme: "blueprint-deck",
    characters: {
      nova: { visible: true, action: "eureka" },
      zippy: { visible: true, action: "celebrating" },
      ember: { visible: true, action: "celebrating" },
      shieldy: { visible: true, action: "celebrating" },
      heroBadge: { visible: true, streamActive: true, highlightFeature: "all" }
    },
    dialogue: [
      {
        speaker: "Professor Nova",
        text: "💡 EUREKA! That's brilliant! In Python OOP, this superpower is called **INHERITANCE**!",
        sfx: "powerUp"
      },
      {
        speaker: "Professor Nova",
        text: "Look above us! We create ONE master `Hero` class containing `name`, `health`, and `fight()`.",
        sfx: "chime"
      },
      {
        speaker: "Professor Nova",
        text: "Watch the golden energy streams flow down! `Zippy`, `Ember`, and `Shieldy` automatically inherit everything from `Hero`!",
        sfx: "success"
      },
      {
        speaker: "Zippy",
        text: "⚡ Woohoo! I got `name`, `health`, and `fight()` for free without writing them again!",
        sfx: "whoosh"
      }
    ],
    codeSnippet: null,
    takeaway: "🧬 INHERITANCE allows a child class to automatically adopt methods and attributes from a parent class!"
  },
  {
    id: 7,
    title: "Parent Class vs. Child Class",
    subtitle: "Episode 7: Understanding the Relationship",
    theme: "blueprint-deck",
    characters: {
      nova: { visible: true, action: "talking" },
      zippy: { visible: true, action: "idle" },
      ember: { visible: true, action: "idle" },
      shieldy: { visible: true, action: "idle" },
      heroBadge: { visible: true, streamActive: true, highlightFeature: "fight" }
    },
    dialogue: [
      {
        speaker: "Professor Nova",
        text: "Let's learn the two most important words in Inheritance: **Parent Class** and **Child Class**!",
        sfx: "pop"
      },
      {
        speaker: "Professor Nova",
        text: "👑 **Parent Class (Base Class)**: The common master class (`Hero`) that holds shared traits and passes them down.",
        sfx: "chime"
      },
      {
        speaker: "Professor Nova",
        text: "👶 **Child Class (Derived Class)**: The specialized classes (`SpeedHero`, `FireHero`, `ShieldHero`) that inherit from the parent!",
        sfx: "powerUp"
      }
    ],
    interactiveType: "mcq",
    mcq: {
      question: "In our Hero Academy example, what role does the master 'Hero' class play?",
      options: [
        {
          id: "a",
          text: "👑 Parent Class (Base Class) that provides common features to all heroes",
          correct: true,
          feedback: "🌟 Exactly! Hero is the parent class at the top of our inheritance tree!"
        },
        {
          id: "b",
          text: "👶 Child Class that only exists inside Zippy",
          correct: false,
          feedback: "Zippy is the child class that inherits from Hero!"
        },
        {
          id: "c",
          text: "📦 An empty folder with no code",
          correct: false,
          feedback: "Hero contains the real shared code like name, health, and fight()!"
        }
      ]
    },
    codeSnippet: null,
    takeaway: "👑 The class that shares its features is the PARENT class. The class that inherits them is the CHILD class!"
  },
  {
    id: 8,
    title: "Writing Python Inheritance Code",
    subtitle: "Episode 8: The Parent in Parentheses `(Hero)`",
    theme: "power-lab",
    characters: {
      nova: { visible: true, action: "typing" },
      zippy: { visible: true, action: "waving" },
      ember: { visible: true, action: "idle" },
      shieldy: { visible: true, action: "idle" },
      heroBadge: { visible: true, streamActive: false, highlightFeature: null }
    },
    dialogue: [
      {
        speaker: "Professor Nova",
        text: "Look at the magic story scroll to see how clean and simple Python inheritance syntax is!",
        sfx: "pop"
      },
      {
        speaker: "Professor Nova",
        text: "To tell Python that `SpeedHero` inherits from `Hero`, we put `(Hero)` right after the class name!",
        sfx: "chime"
      },
      {
        speaker: "Zippy",
        text: "⚡ Just by typing `class SpeedHero(Hero):`, I can call `zippy.fight()` and Python knows what to do!",
        sfx: "whoosh"
      }
    ],
    codeSnippet: {
      language: "python",
      title: "Clean Python Inheritance Code",
      code: `# 1. 🦸 Parent Class (Base Class)
class Hero:
    def __init__(self, name):
        self.name = name
        self.health = 100

    def fight(self):
        print(f"{self.name} is fighting for justice!")

# 2. ⚡ Child Class inherits from Hero using (Hero)
class SpeedHero(Hero):
    pass  # Automatically gets name, health, and fight()!

zippy = SpeedHero("Zippy")
zippy.fight()  # Output: "Zippy is fighting for justice!"`,
      highlightLines: [9, 10, 13],
      explanation: "Writing (Hero) connects SpeedHero to the Hero parent class, unlocking all parent features!"
    },
    takeaway: "🐍 In Python, putting `(ParentClass)` after a class name inherits all its variables and methods!"
  },
  {
    id: 9,
    title: "Interactive Hero Mission: Testing Inherited Powers!",
    subtitle: "Episode 9: Hands-On Mission Dispatcher",
    theme: "training-arena",
    characters: {
      nova: { visible: true, action: "talking" },
      zippy: { visible: true, action: "idle" },
      ember: { visible: true, action: "idle" },
      shieldy: { visible: true, action: "idle" },
      heroBadge: { visible: true, streamActive: true, highlightFeature: "fight" }
    },
    dialogue: [
      {
        speaker: "Professor Nova",
        text: "Time for a live training simulation! Let's dispatch our heroes to test their abilities!",
        sfx: "powerUp"
      },
      {
        speaker: "Professor Nova",
        text: "Select any hero below and test their **Inherited `fight()`** action vs their **Unique Superpower**!",
        sfx: "chime"
      }
    ],
    interactiveType: "heroMission",
    codeSnippet: null,
    takeaway: "🎮 Calling an inherited method routes execution up to the parent class without rewriting code!"
  },
  {
    id: 10,
    title: "Adding Unique Powers to Child Classes",
    subtitle: "Episode 10: Specialization",
    theme: "power-lab",
    characters: {
      nova: { visible: true, action: "talking" },
      zippy: { visible: true, action: "running" },
      ember: { visible: true, action: "fire-blast" },
      shieldy: { visible: true, action: "shield-block" },
      heroBadge: { visible: true, streamActive: true, highlightFeature: null }
    },
    dialogue: [
      {
        speaker: "Professor Nova",
        text: "Inheritance doesn't mean all child heroes are clones! Child classes can add their own unique methods!",
        sfx: "pop"
      },
      {
        speaker: "Zippy",
        text: "⚡ `SpeedHero` adds `run_fast()`!",
        sfx: "whoosh"
      },
      {
        speaker: "Ember",
        text: "🔥 `FireHero` adds `use_fire()`!",
        sfx: "flame"
      },
      {
        speaker: "Shieldy",
        text: "🛡️ `ShieldHero` adds `block_attack()`!",
        sfx: "shield"
      },
      {
        speaker: "Professor Nova",
        text: "Each hero keeps all the shared parent traits AND gains their own specialized superpowers!",
        sfx: "success"
      }
    ],
    codeSnippet: {
      language: "python",
      title: "Adding Unique Methods to Child Classes",
      code: `# ⚡ SpeedHero adds run_fast()
class SpeedHero(Hero):
    def run_fast(self):
        print(f"{self.name} zooms past at light speed! ⚡")

# 🔥 FireHero adds use_fire()
class FireHero(Hero):
    def use_fire(self):
        print(f"{self.name} unleashes a blazing fire blast! 🔥")

# 🛡️ ShieldHero adds block_attack()
class ShieldHero(Hero):
    def block_attack(self):
        print(f"{self.name} raises an unbreakable energy shield! 🛡️")`,
      highlightLines: [2, 3, 7, 8, 12, 13],
      explanation: "Child classes inherit parent features and define new methods unique to themselves!"
    },
    takeaway: "⭐ Inheritance gives you shared basics from the parent + specialized unique abilities in the child!"
  },
  {
    id: 11,
    title: "Guided Hero Coding Challenge!",
    subtitle: "Episode 11: Constructing Child Classes",
    theme: "power-lab",
    characters: {
      nova: { visible: true, action: "talking" },
      zippy: { visible: true, action: "celebrating" },
      ember: { visible: true, action: "idle" },
      shieldy: { visible: true, action: "idle" },
      heroBadge: { visible: true, streamActive: false, highlightFeature: null }
    },
    dialogue: [
      {
        speaker: "Professor Nova",
        text: "It's your turn at the Hero Academy coding console! Help us assemble the Python code for our heroes!",
        sfx: "powerUp"
      }
    ],
    interactiveType: "codeChallenge",
    challenge: {
      prompt: "Complete the Python code to make SpeedHero inherit from Hero and define its run_fast superpower:",
      task1: {
        label: "1. How do we make SpeedHero inherit from the Hero parent class?",
        options: ["class SpeedHero(Hero):", "class SpeedHero < Hero:", "class SpeedHero inherits Hero:"],
        correct: "class SpeedHero(Hero):",
        hint: "Remember to put the parent class name inside parentheses `(Hero)`!"
      },
      task2: {
        label: "2. How should we define Zippy's unique running method?",
        options: [
          "def run_fast(self):",
          "def Hero(self):",
          "self.run_fast = 'speed'"
        ],
        correct: "def run_fast(self):",
        hint: "Use the `def` keyword followed by the method name and `(self)`!"
      }
    },
    codeSnippet: null,
    takeaway: "🧩 You're writing real Python inheritance code to empower superheroes!"
  },
  {
    id: 12,
    title: "Final Story Quiz & Superhero Graduation!",
    subtitle: "Episode 12: Hero Academy Diploma",
    theme: "grand-hall",
    characters: {
      nova: { visible: true, action: "celebrating" },
      zippy: { visible: true, action: "celebrating" },
      ember: { visible: true, action: "celebrating" },
      shieldy: { visible: true, action: "celebrating" },
      heroBadge: { visible: true, streamActive: true, highlightFeature: "all" }
    },
    dialogue: [
      {
        speaker: "Professor Nova",
        text: "🎉 Congratulations on reaching the grand finale! Let's test your inheritance superpowers with our final quiz, then build your very own superhero!",
        sfx: "fanfare"
      }
    ],
    interactiveType: "heroQuizAndLab",
    quizQuestions: [
      {
        id: "q1",
        question: "Why do we use Inheritance in Python Object-Oriented Programming?",
        options: [
          { text: "To share common variables and methods without repeating code in every class", correct: true },
          { text: "To delete all classes from the computer", correct: false },
          { text: "To make code run backward", correct: false }
        ],
        explanation: "Inheritance prevents code duplication and keeps code clean and reusable!"
      },
      {
        id: "q2",
        question: "In `class FireHero(Hero):`, which class is the child class?",
        options: [
          { text: "FireHero (the specialized class inheriting from Hero)", correct: true },
          { text: "Hero (the parent class)", correct: false },
          { text: "Python itself", correct: false }
        ],
        explanation: "FireHero is the child class that receives all features from parent Hero!"
      },
      {
        id: "q3",
        question: "Can a child class have its own special methods in addition to what it inherits?",
        options: [
          { text: "Yes! Child classes keep inherited traits and can define unique superpowers", correct: true },
          { text: "No, child classes are never allowed to add new methods", correct: false },
          { text: "Only if the computer is turned off", correct: false }
        ],
        explanation: "Child classes inherit common basics and add their own specialized methods like use_fire()!"
      }
    ],
    codeSnippet: null,
    takeaway: "🎓 You are an official Hero Academy Master of Inheritance! Congratulations!"
  }
];
