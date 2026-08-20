import React, { createContext, useContext, useState } from 'react';

const ChapterContext = createContext();

export const chapterData = {
  1: {
    stageId: 1,
    title: 'Stage 1: The Tedious Workbench',
    subtitle: 'Chapter 1 • The Tinkerer and the Scroll of Life',
    icon: '🏺',
    dialogue: "Long ago, deep in the Whispering Woods, I sat at this workbench molding foxes one by one. I had to whisper every attribute into the clay: name, color, energy. This is terribly inefficient! Type out dictionaries for fox2 and fox3 manually so you see how repetitive it is.",
    initialCode: `# Stage 1: The Tedious Workbench (Manual Dictionaries)
fox1 = {"name": "Rusty", "color": "Red", "energy": 100}

# Add fox2 ("Luna", "Silver", 100) and fox3 ("Bandit", "Black", 100) below:
fox2 = {"name": "Luna", "color": "Silver", "energy": 100}
fox3 = {"name": "Bandit", "color": "Black", "energy": 100}

print(fox1)
print(fox2)
print(fox3)
`,
    expectedKeywords: ['fox2', 'fox3', 'name', 'color', 'energy'],
  },
  2: {
    stageId: 2,
    title: 'Stage 2: Drafting the Glowing Parchment',
    subtitle: 'Chapter 2 • The Scroll of Life (class)',
    icon: '📜',
    dialogue: "Instead of building every fox from scratch, we will use this Scroll of Life to write the Universal Rules of a Fox. In our magic, we call this master blueprint a class! Type 'class Fox:' and 'pass' below.",
    initialCode: `# Stage 2: Define your first Class blueprint
class Fox:
    pass
`,
    expectedKeywords: ['class', 'Fox', 'pass'],
  },
  3: {
    stageId: 3,
    title: 'Stage 3: The Spell of Awakening',
    subtitle: 'Chapter 3 • The Init Spell (__init__)',
    icon: '⚡',
    dialogue: "The scroll is primed, but empty! When a fox awakens, it needs a spark of initialization—the __init__ spell. We will build a law of nature: every new fox automatically starts with 100 energy!",
    initialCode: `# Stage 3: The __init__ Awakening Method
class Fox:
    def __init__(self, name, color):
        self.energy = 100

print("Fox class awakened with __init__ spell!")
`,
    expectedKeywords: ['class', 'Fox', 'def __init__', 'energy'],
  },
  4: {
    stageId: 4,
    title: 'Stage 4: The Magical Tether',
    subtitle: 'Chapter 4 • The Self Tether (self)',
    icon: '🧵',
    dialogue: "If I shout the name 'Bandit', how does the scroll know which lump of clay to attach it to? We need a magical tether called self! Hover over self in my dialogue to inspect the tether comic.",
    initialCode: `# Stage 4: Attach attributes to self
class Fox:
    def __init__(self, name, color):
        self.name = name
        self.color = color
        self.energy = 100

my_fox = Fox("Rusty", "Red")
print(f"Instantiated {my_fox.name} with {my_fox.color} fur and {my_fox.energy} energy!")
`,
    expectedKeywords: ['self.name', 'self.color', 'Fox('],
  },
  5: {
    stageId: 5,
    title: 'Stage 5: Release into the Wild',
    subtitle: 'Chapter 5 • Actions & Independent State (pounce)',
    icon: '🌲',
    dialogue: "A creature must do more than exist—it must act! Define the pounce(self) method to reduce self.energy by 10. Then instantiate bandit and copper, and command bandit.pounce()!",
    initialCode: `# Stage 5: Release into the Wild (Methods & Independent State)
class Fox:
    def __init__(self, name, color):
        self.name = name
        self.color = color
        self.energy = 100

    def pounce(self):
        self.energy -= 10
        print(f"{self.name} pounces! Remaining energy: {self.energy}")

# Instantiate two independent foxes
bandit = Fox("Bandit", "Black")
copper = Fox("Copper", "Orange")

# Command Bandit to pounce!
bandit.pounce()

print(f"Bandit energy: {bandit.energy}")
print(f"Copper energy: {copper.energy}")
`,
    expectedKeywords: ['pounce', 'bandit.pounce()', 'bandit', 'copper'],
  },
};

export function ChapterProvider({ children }) {
  const [currentChapter, setCurrentChapter] = useState(1);
  const [isChapterCompleted, setIsChapterCompleted] = useState(false);
  const [savedScrolls, setSavedScrolls] = useState({});

  const completeChapter = () => {
    setIsChapterCompleted(true);
  };

  const nextChapter = () => {
    if (chapterData[currentChapter + 1]) {
      setCurrentChapter((prev) => prev + 1);
      setIsChapterCompleted(false);
    }
  };

  const saveScroll = (chapterNum, codeText) => {
    setSavedScrolls((prev) => ({
      ...prev,
      [chapterNum]: codeText,
    }));
  };

  return (
    <ChapterContext.Provider
      value={{
        currentChapter,
        chapterInfo: chapterData[currentChapter] || chapterData[1],
        isChapterCompleted,
        completeChapter,
        nextChapter,
        savedScrolls,
        saveScroll,
        setCurrentChapter,
      }}
    >
      {children}
    </ChapterContext.Provider>
  );
}

export function useChapter() {
  return useContext(ChapterContext);
}
