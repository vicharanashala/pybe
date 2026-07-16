import { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, Lock, Unlock, CheckCircle2, Award, BookOpen, 
  Terminal, ChevronRight, Play, ArrowRight, Sparkles, RefreshCw,
  Trophy, Check
} from 'lucide-react';
import { UserProgress } from '../types';
import CodeEditor from './CodeEditor';

interface JourneyTopic {
  id: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  xp: number;
  description: string;
  explanation: string;
  starterCode: string;
  instruction: string;
  expectedOutputContains: string[];
}

const ROADMAP_TOPICS: JourneyTopic[] = [
  // --- BEGINNER ---
  {
    id: 'journey_vars',
    title: 'Variables & Core Types',
    level: 'beginner',
    xp: 100,
    description: 'Learn how to declare variables and work with string, integer, float, and boolean values.',
    explanation: `### Variables & Data Types in Python

In Python, a **variable** is a named reference that points to a value stored in memory. Think of it as a chest with a label on it.

Unlike other languages, Python does not require explicit declarations or keywords like \`var\` or \`let\`. You define a variable simply by assigning a value using the \`=\` operator:

\`\`\`python
player_name = "Alex"      # String (text)
player_level = 1          # Integer (whole number)
player_height = 5.9       # Float (decimal)
is_online = True          # Boolean (True/False)
\`\`\`

#### Rules for Variable Names:
- Must start with a letter or an underscore.
- Can only contain alphanumeric characters and underscores (\`a-z\`, \`0-9\`, and \`_\`).
- Case-sensitive (\`player\` and \`Player\` are different).`,
    starterCode: `# Set hero_name to "Arthur" and hero_xp to 150
hero_name = "Arthur"
hero_xp = 150

# Print both variables using the print() function
print(hero_name)
print(hero_xp)`,
    instruction: 'Set the variable `hero_name` to `"Arthur"`, the variable `hero_xp` to `150`, then print them both.',
    expectedOutputContains: ['Arthur', '150']
  },
  {
    id: 'journey_operators',
    title: 'Operators & Math Expressions',
    level: 'beginner',
    xp: 150,
    description: 'Master math calculations and combining text strings in expressions.',
    explanation: `### Python Operators

Python supports standard operators for mathematics and text operations:

- **Addition**: \`+\`
- **Subtraction**: \`-\`
- **Multiplication**: \`*\`
- **Division**: \`/\`
- **Floor Division** (returns whole number): \`//\`
- **Modulo** (returns division remainder): \`%\`
- **Exponentiation**: \`**\`

#### String Concatenation:
You can combine string variables or text literals using the \`+\` operator:
\`\`\`python
first = "Python"
second = "Verse"
full_name = first + " " + second
print(full_name) # "Python Verse"
\`\`\``,
    starterCode: `# Calculate the area of a rectangle with width 10 and height 5
width = 10
height = 5

# Calculate the area and print the output in this format: "Area is <result>"
area = width * height
print("Area is", area)`,
    instruction: 'Calculate the product of `width` and `height`, store it in `area`, and print "Area is 50".',
    expectedOutputContains: ['Area is', '50']
  },
  {
    id: 'journey_conditions',
    title: 'Control Flow (If-Else)',
    level: 'beginner',
    xp: 200,
    description: 'Diverge code pathways and execute operations based on conditions.',
    explanation: `### Conditionals in Python

Control flow refers to the order in which code statements are executed. Python uses \`if\`, \`elif\` (else if), and \`else\` keywords to run conditional paths.

#### Indentation is Key:
Python does not use curly braces \`{}\` for code blocks. Instead, it relies on **indentation** (standard is 4 spaces).

\`\`\`python
score = 85

if score >= 90:
    print("Grade: A")
elif score >= 75:
    print("Grade: B")
else:
    print("Grade: C")
\`\`\`

#### Logical Operators:
- \`and\`: True if both conditions are true.
- \`or\`: True if at least one condition is true.
- \`not\`: Reverses the boolean value.`,
    starterCode: `# Change or check the score to trigger conditional print statements
score = 85

if score >= 80:
    print("Success")
else:
    print("Retry")`,
    instruction: 'Write a condition that prints "Success" if the score is greater than or equal to 80, otherwise prints "Retry".',
    expectedOutputContains: ['Success']
  },
  {
    id: 'journey_loops',
    title: 'Loops (For & While)',
    level: 'beginner',
    xp: 250,
    description: 'Iterate over ranges and automate repetitive tasks using loops.',
    explanation: `### Loop Engines in Python

Loops let you repeat code execution multiple times.

#### The \`for\` Loop:
Perfect for iterating over a predefined sequence, list, or range. The \`range(start, stop)\` function generates a sequence of numbers starting from \`start\` up to (but not including) \`stop\`.

\`\`\`python
for i in range(1, 4):
    print("Iteration:", i)
# Prints:
# Iteration: 1
# Iteration: 2
# Iteration: 3
\`\`\`

#### The \`while\` Loop:
Repeats execution as long as a condition evaluates to \`True\`. Be careful not to create an infinite loop!

\`\`\`python
count = 1
while count <= 3:
    print(count)
    count += 1
\`\`\``,
    starterCode: `# Write a loop that counts from 1 to 3
# Print: "Number 1", "Number 2", "Number 3"
for i in range(1, 4):
    print("Number", i)`,
    instruction: 'Create a loop that prints "Number 1", "Number 2", and "Number 3", each on a new line.',
    expectedOutputContains: ['Number 1', 'Number 2', 'Number 3']
  },

  // --- INTERMEDIATE ---
  {
    id: 'journey_lists',
    title: 'Lists & Collections',
    level: 'intermediate',
    xp: 300,
    description: 'Work with mutable lists to store sequences of ordered items.',
    explanation: `### Python Lists

A **list** is an ordered, mutable collection that allows duplicate items. Lists are defined using square brackets \`[]\`.

\`\`\`python
# Creating a list
fruits = ["apple", "banana"]

# Accessing items (0-indexed)
print(fruits[0]) # "apple"

# Modifying lists
fruits.append("cherry") # Adds to the end
fruits.remove("banana") # Removes item
print(len(fruits))      # Count of items
\`\`\``,
    starterCode: `# Create a list named 'inventory' containing "sword" and "shield"
inventory = ["sword", "shield"]

# Append "potion" to it
inventory.append("potion")

# Print the inventory list
print(inventory)`,
    instruction: 'Create a list named `inventory` initialized with `"sword"` and `"shield"`, append `"potion"`, and print the list.',
    expectedOutputContains: ['sword', 'shield', 'potion']
  },
  {
    id: 'journey_dicts',
    title: 'Dictionaries',
    level: 'intermediate',
    xp: 350,
    description: 'Organize data in structured key-value mappings for rapid search lookups.',
    explanation: `### Python Dictionaries

A **dictionary** is an unordered, mutable collection of key-value pairs. Dictionaries are created using curly braces \`{}\`.

\`\`\`python
# Defining key-values
hero = {
    "name": "Arthur",
    "class": "Knight",
    "level": 10
}

# Accessing items
print(hero["name"]) # "Arthur"

# Adding/Updating
hero["level"] = 11
hero["weapon"] = "Excalibur"
\`\`\``,
    starterCode: `# Define a dictionary named 'hero' with keys 'name' ("Geralt") and 'level' (99)
hero = {"name": "Geralt", "level": 99}

# Print the value of the 'name' key
print(hero["name"])`,
    instruction: 'Define the dictionary `hero` with key-values `name` set to `"Geralt"` and `level` set to `99`, then print the hero name.',
    expectedOutputContains: ['Geralt']
  },
  {
    id: 'journey_functions',
    title: 'Functions',
    level: 'intermediate',
    xp: 400,
    description: 'Author reusable blocks of logic parameterized with custom inputs.',
    explanation: `### Python Functions

A **function** is a reusable block of code that runs only when called. You define a function using the \`def\` keyword:

\`\`\`python
def greet_user(name):
    # Returns a personalized message
    return "Hello, " + name

# Call the function
message = greet_user("Emma")
print(message) # "Hello, Emma"
\`\`\`

#### Parameters & Return Values:
- **Parameters**: Inputs placed inside parentheses.
- **Return Statement**: Exits the function and passes a value back to the caller.`,
    starterCode: `# Define a function named 'multiply' that accepts 'a' and 'b' and returns their product
def multiply(a, b):
    return a * b

# Call the function with 6 and 7, and print the return value
print(multiply(6, 7))`,
    instruction: 'Write a function `multiply(a, b)` that returns `a * b`. Call it with `6` and `7` and print the result.',
    expectedOutputContains: ['42']
  },
  {
    id: 'journey_exceptions',
    title: 'Exception Handling (Try-Except)',
    level: 'intermediate',
    xp: 450,
    description: 'Safeguard your software and resolve run-time errors gracefully.',
    explanation: `### Exception Handling in Python

Exceptions are errors detected during code execution. You can manage them using \`try\` and \`except\` blocks so your program doesn't crash:

\`\`\`python
try:
    number = int(input("Enter a number: "))
    result = 10 / number
except ZeroDivisionError:
    print("Cannot divide by zero!")
except ValueError:
    print("Invalid input number!")
except Exception as e:
    print("An unknown error occurred:", e)
\`\`\``,
    starterCode: `# Handle potential division error using try-except
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Error: Division by zero")`,
    instruction: 'Wrap division in a `try-except` block to capture `ZeroDivisionError` and print `"Error: Division by zero"`.',
    expectedOutputContains: ['Error: Division by zero']
  },

  // --- ADVANCED ---
  {
    id: 'journey_oop',
    title: 'Object-Oriented Programming',
    level: 'advanced',
    xp: 600,
    description: 'Model real-world states and structures using classes and objects.',
    explanation: `### Object-Oriented Programming (OOP)

OOP is a programming paradigm that organizes code around **objects** (data) rather than actions (logic).

- **Class**: A blueprint or template for creating objects.
- **Object**: An instance of a class.
- **\`__init__\` Method**: The constructor method that initializes an object's properties when created.
- **\`self\` Parameter**: Points to the current instance of the class.

\`\`\`python
class Dragon:
    def __init__(self, name, element):
        self.name = name
        self.element = element
        
    def roar(self):
        return self.name + " breathes " + self.element

# Instantiate
red_dragon = Dragon("Ignis", "Fire")
print(red_dragon.roar()) # "Ignis breathes Fire"
\`\`\``,
    starterCode: `# Create a Wizard class that takes 'name' and 'spell' in its constructor
class Wizard:
    def __init__(self, name, spell):
        self.name = name
        self.spell = spell
        
    def cast(self):
        return self.name + " casts " + self.spell

# Instantiate and print the message
gandalf = Wizard("Gandalf", "Light")
print(gandalf.cast())`,
    instruction: 'Define a class `Wizard` with properties `name` and `spell`, instantiate it as `"Gandalf"` and `"Light"`, and print the output of cast.',
    expectedOutputContains: ['Gandalf casts Light']
  },
  {
    id: 'journey_comprehensions',
    title: 'List Comprehensions',
    level: 'advanced',
    xp: 700,
    description: 'Construct new arrays dynamically in a single compact line of code.',
    explanation: `### List Comprehensions

List comprehensions offer a shorter, elegant syntax to generate lists from existing sequences or ranges.

#### Syntax:
\`\`\`python
new_list = [expression for item in iterable if condition]
\`\`\`

#### Comparison:
**Traditional Loop:**
\`\`\`python
squares = []
for x in range(5):
    squares.append(x * x)
\`\`\`

**List Comprehension:**
\`\`\`python
squares = [x * x for x in range(5)]
# Result: [0, 1, 4, 9, 16]
\`\`\``,
    starterCode: `# Generate even numbers from 2 to 10 using a list comprehension
evens = [x for x in range(1, 11) if x % 2 == 0]

# Print the resulting list
print(evens)`,
    instruction: 'Write a list comprehension to filter even numbers from 1 to 10, saving into `evens`, and print it.',
    expectedOutputContains: ['2', '4', '6', '8', '10']
  },
  {
    id: 'journey_lambdas',
    title: 'Lambda & Map/Filter',
    level: 'advanced',
    xp: 800,
    description: 'Incorporate anonymous functions and explore functional programming styles.',
    explanation: `### Lambda Functions

A **lambda** function is a small, anonymous function that can take any number of arguments, but can only have **one single expression**.

#### Syntax:
\`\`\`python
lambda arguments: expression
\`\`\`

#### Examples:
\`\`\`python
# Simple addition lambda
add = lambda x, y: x + y
print(add(3, 5)) # 8

# Doubling numbers
double = lambda x: x * 2
print(double(10)) # 20
\`\`\``,
    starterCode: `# Create a lambda function named 'power' that takes (base, exp) and returns base ** exp
power = lambda base, exp: base ** exp

# Call and print power(2, 10)
print(power(2, 10))`,
    instruction: 'Define a lambda function `power` representing `base ** exp`. Call it with `2` and `10` and print the outcome.',
    expectedOutputContains: ['1024']
  },
  {
    id: 'journey_generators',
    title: 'Generators & Yield',
    level: 'advanced',
    xp: 1000,
    description: 'Develop resource-friendly iterators that produce sequence values lazily.',
    explanation: `### Generators & Yield

A **generator** is a function that returns an iterator object. Instead of computing and returning all values at once (which takes up memory), it **yields** values one by one on-demand.

#### The \`yield\` Keyword:
When a generator function calls \`yield\`, it suspends execution and returns the value. When called next, it resumes right where it left off!

\`\`\`python
def count_to_three():
    yield 1
    yield 2
    yield 3

for num in count_to_three():
    print(num)
\`\`\`

This is incredibly memory-efficient for processing large data files or infinite ranges.`,
    starterCode: `# Write a generator that yields even numbers from 2 up to n
def evens_up_to(n):
    i = 2
    while i <= n:
        yield i
        i += 2

# Iterate over evens_up_to(8) and print them in format "Even: <value>"
for val in evens_up_to(8):
    print("Even:", val)`,
    instruction: 'Write a generator function `evens_up_to(n)` that yields even numbers up to n, and print each value prefixed with "Even:".',
    expectedOutputContains: ['Even: 2', 'Even: 4', 'Even: 6', 'Even: 8']
  }
];

interface CodingJourneyProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export default function CodingJourney({ progress, onUpdateProgress }: CodingJourneyProps) {
  const [completedTopics, setCompletedTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pyverse_journey_completed_topics');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(ROADMAP_TOPICS[0].id);
  const [activeSection, setActiveSection] = useState<'explanation' | 'challenge'>('explanation');
  
  // Confetti / Celebration feedback state
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationXp, setCelebrationXp] = useState(0);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('pyverse_journey_completed_topics', JSON.stringify(completedTopics));
  }, [completedTopics]);

  useEffect(() => {
    const selectedId = localStorage.getItem('pyverse_journey_selected_topic_id');
    if (selectedId) {
      const topic = ROADMAP_TOPICS.find(t => t.id === selectedId);
      if (topic) {
        setSelectedTopicId(selectedId);
        setActiveTab(topic.level);
        setActiveSection('explanation');
      }
      localStorage.removeItem('pyverse_journey_selected_topic_id');
    }
  }, []);

  // Determine unlocked topics
  const unlockedTopicIds = useMemo(() => {
    const unlocked: string[] = [];
    ROADMAP_TOPICS.forEach((topic, idx) => {
      if (idx === 0) {
        unlocked.push(topic.id);
      } else {
        const prevTopic = ROADMAP_TOPICS[idx - 1];
        if (completedTopics.includes(prevTopic.id)) {
          unlocked.push(topic.id);
        }
      }
    });
    return unlocked;
  }, [completedTopics]);

  const selectedTopic = useMemo(() => {
    return ROADMAP_TOPICS.find(t => t.id === selectedTopicId) || ROADMAP_TOPICS[0];
  }, [selectedTopicId]);

  // Compute roadmap stats
  const stats = useMemo(() => {
    const total = ROADMAP_TOPICS.length;
    const completed = ROADMAP_TOPICS.filter(t => completedTopics.includes(t.id)).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const beginnerCompleted = ROADMAP_TOPICS.filter(t => t.level === 'beginner' && completedTopics.includes(t.id)).length;
    const beginnerTotal = ROADMAP_TOPICS.filter(t => t.level === 'beginner').length;
    
    const intermediateCompleted = ROADMAP_TOPICS.filter(t => t.level === 'intermediate' && completedTopics.includes(t.id)).length;
    const intermediateTotal = ROADMAP_TOPICS.filter(t => t.level === 'intermediate').length;
    
    const advancedCompleted = ROADMAP_TOPICS.filter(t => t.level === 'advanced' && completedTopics.includes(t.id)).length;
    const advancedTotal = ROADMAP_TOPICS.filter(t => t.level === 'advanced').length;

    return {
      total,
      completed,
      percent,
      beginnerCompleted,
      beginnerTotal,
      intermediateCompleted,
      intermediateTotal,
      advancedCompleted,
      advancedTotal
    };
  }, [completedTopics]);

  // Unlock next topic helper
  const handleTopicComplete = (topicId: string, xpReward: number) => {
    if (completedTopics.includes(topicId)) return;

    // Trigger celebration
    setCelebrationXp(xpReward);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 4500);

    // Update locally
    const updated = [...completedTopics, topicId];
    setCompletedTopics(updated);

    // Update global context XP and completedLessons
    if (onUpdateProgress) {
      onUpdateProgress(prev => {
        // Prevent duplicate XP gain
        const alreadyEarned = prev.completedLessons.includes(topicId);
        const addedXP = alreadyEarned ? 0 : xpReward;
        
        return {
          ...prev,
          xp: prev.xp + addedXP,
          completedLessons: alreadyEarned ? prev.completedLessons : [...prev.completedLessons, topicId],
          streak: prev.streak > 0 ? prev.streak : 1,
          lastActive: new Date().toISOString()
        };
      });
    }

    // Automatically transition selected topic to the next one in sequence
    const currentIdx = ROADMAP_TOPICS.findIndex(t => t.id === topicId);
    if (currentIdx !== -1 && currentIdx < ROADMAP_TOPICS.length - 1) {
      const nextTopic = ROADMAP_TOPICS[currentIdx + 1];
      setTimeout(() => {
        setSelectedTopicId(nextTopic.id);
        setActiveTab(nextTopic.level);
        setActiveSection('explanation');
      }, 1500);
    }
  };

  const currentTabTopics = useMemo(() => {
    return ROADMAP_TOPICS.filter(t => t.level === activeTab);
  }, [activeTab]);

  return (
    <div className="space-y-6">
      {/* 1. Header Portfolio Progress Overview */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-sm relative overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute right-0 top-0 h-40 w-40 bg-sky-100 rounded-full blur-3xl opacity-30 -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute left-0 bottom-0 h-28 w-28 bg-blue-100 rounded-full blur-2xl opacity-20 -ml-10 -mb-10 pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-sky-50 text-blue-600 font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border border-sky-100 flex items-center gap-1">
                <Compass className="h-3 w-3 animate-spin-slow" /> Interactive Map
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Coding Journey</h1>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Embark on a modular quest to master Python. Solve real running sandboxed scripts in sequence from basic variables to decorators and generators.
            </p>
          </div>

          {/* Stats Ring/Progress Panel */}
          <div className="flex items-center gap-4 bg-slate-50/80 border border-sky-50 p-4 rounded-2xl md:w-80 shadow-inner">
            <div className="relative h-14 w-14 shrink-0 flex items-center justify-center bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
              <Trophy className="h-6 w-6" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-xs font-black text-slate-800">
                <span>Journey Completion</span>
                <span className="text-blue-600 font-black">{stats.completed} / {stats.total}</span>
              </div>
              {/* Progress bar container */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-sky-400 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${stats.percent}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {stats.percent}% Python Qualified
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Success Modal / Confetti Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center border border-sky-100 shadow-2xl relative overflow-hidden">
              {/* Glow backdrop */}
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-100/30 to-blue-100/30 -z-10" />
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mx-auto flex items-center justify-center shadow-lg text-white mb-4 animate-bounce">
                <Sparkles className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">Topic Mastered! 🎉</h2>
              <p className="text-xs text-slate-500 mt-2 font-semibold">
                You have solved the interactive compiler exercise correctly!
              </p>
              <div className="mt-4 bg-sky-50 border border-sky-100 rounded-2xl py-3 px-4 flex items-center justify-center gap-2">
                <Award className="h-5 w-5 text-blue-600 animate-pulse" />
                <span className="font-extrabold text-sm text-blue-800">+{celebrationXp} XP Points Awarded</span>
              </div>
              <p className="text-[10px] text-slate-400 font-black uppercase mt-4">
                Next level unlocked automatically
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Split View Layout: Left timeline / Right workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Vertical Roadmap (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Level Switcher tabs */}
          <div className="bg-white p-2 rounded-2xl border border-sky-100 shadow-sm flex gap-1">
            {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => {
              const isActive = activeTab === lvl;
              let compText = '';
              if (lvl === 'beginner') compText = `${stats.beginnerCompleted}/${stats.beginnerTotal}`;
              if (lvl === 'intermediate') compText = `${stats.intermediateCompleted}/${stats.intermediateTotal}`;
              if (lvl === 'advanced') compText = `${stats.advancedCompleted}/${stats.advancedTotal}`;

              return (
                <button
                  key={lvl}
                  onClick={() => setActiveTab(lvl)}
                  className={`flex-1 text-center py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow shadow-blue-500/20' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-[10px] tracking-widest">{lvl}</span>
                  <span className={`block text-[9px] font-bold mt-0.5 ${isActive ? 'text-sky-100' : 'text-slate-400'}`}>
                    {compText}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Connected list of nodes */}
          <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-sm relative">
            <div className="absolute left-[38px] top-6 bottom-6 w-0.5 bg-slate-100 pointer-events-none" />
            
            <div className="space-y-5 relative">
              {currentTabTopics.map((topic, index) => {
                const isCompleted = completedTopics.includes(topic.id);
                const isUnlocked = unlockedTopicIds.includes(topic.id);
                const isSelected = selectedTopicId === topic.id;
                const isLocked = !isUnlocked;

                // Color themes based on status
                let ringColor = 'border-slate-200 bg-white text-slate-400';
                let cardStyle = 'border-slate-100 bg-slate-50/50 opacity-60 pointer-events-none';

                if (isCompleted) {
                  ringColor = 'border-emerald-500 bg-emerald-50 text-emerald-600 shadow shadow-emerald-500/10';
                  cardStyle = isSelected 
                    ? 'border-blue-600 bg-blue-50/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 cursor-pointer';
                } else if (isUnlocked) {
                  ringColor = 'border-blue-500 bg-blue-50 text-blue-600 animate-pulse shadow shadow-blue-500/20';
                  cardStyle = isSelected
                    ? 'border-blue-600 bg-blue-50/30 shadow-md shadow-blue-500/5'
                    : 'border-blue-200 bg-white hover:border-blue-300 cursor-pointer';
                }

                return (
                  <div 
                    key={topic.id} 
                    className="flex gap-4 items-start"
                    onClick={() => {
                      if (isUnlocked || isCompleted) {
                        setSelectedTopicId(topic.id);
                        setActiveSection('explanation');
                      }
                    }}
                  >
                    {/* Status Circle Ring */}
                    <div className={`h-[38px] w-[38px] shrink-0 rounded-full border-2 flex items-center justify-center z-10 transition-colors duration-300 font-extrabold text-sm ${ringColor}`}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : isLocked ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>

                    {/* Topic details card */}
                    <div className={`flex-1 border p-4 rounded-2xl transition-all duration-300 ${cardStyle}`}>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                            {topic.title}
                            {isCompleted && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-black uppercase">
                                Done
                              </span>
                            )}
                          </h3>
                          <p className="text-[11px] text-slate-500 font-medium mt-1 line-clamp-2">
                            {topic.description}
                          </p>
                        </div>
                        <span className="text-[9px] bg-slate-100 border text-slate-600 font-extrabold px-1.5 py-0.5 rounded shrink-0">
                          {topic.xp} XP
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Explanation workspace (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedTopic ? (
            <div className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden flex flex-col min-h-[550px]">
              
              {/* Workspace Header details */}
              <div className="p-5 border-b border-sky-50 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-blue-100 text-blue-700 font-black uppercase px-2 py-0.5 rounded">
                      Level: {selectedTopic.level}
                    </span>
                    <span className="text-[9px] bg-amber-100 text-amber-700 font-black uppercase px-2 py-0.5 rounded">
                      {selectedTopic.xp} XP Reward
                    </span>
                  </div>
                  <h2 className="text-base font-black text-slate-900">{selectedTopic.title}</h2>
                </div>

                {/* Mark complete fallback button */}
                {!completedTopics.includes(selectedTopic.id) && (
                  <button
                    onClick={() => handleTopicComplete(selectedTopic.id, selectedTopic.xp)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase tracking-wider py-2 px-3.5 rounded-xl cursor-pointer shadow transition hover:scale-105"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>

              {/* Navigation Switch Tabs inside Workspace */}
              <div className="px-5 pt-3 border-b border-sky-50 flex gap-4">
                <button
                  onClick={() => setActiveSection('explanation')}
                  className={`pb-2.5 text-xs font-black uppercase tracking-wider transition-all duration-200 border-b-2 cursor-pointer ${
                    activeSection === 'explanation'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" /> Concept Explanation
                  </span>
                </button>
                <button
                  onClick={() => setActiveSection('challenge')}
                  className={`pb-2.5 text-xs font-black uppercase tracking-wider transition-all duration-200 border-b-2 cursor-pointer ${
                    activeSection === 'challenge'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5" /> Code Challenge
                  </span>
                </button>
              </div>

              {/* Switchable content areas */}
              <div className="flex-1 p-6 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {activeSection === 'explanation' ? (
                    <motion.div
                      key="exp"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-4"
                    >
                      {/* Markdown reader renderer */}
                      <div className="prose prose-blue max-w-none text-slate-700 text-xs leading-relaxed font-medium">
                        <ReactMarkdown>
                          {selectedTopic.explanation}
                        </ReactMarkdown>
                      </div>

                      {/* Prompt to move to challenge */}
                      <div className="pt-4">
                        <button
                          onClick={() => setActiveSection('challenge')}
                          className="flex items-center gap-2 bg-blue-50 text-blue-600 font-extrabold text-[11px] uppercase tracking-wider py-2.5 px-4 rounded-xl hover:bg-blue-100 transition duration-150 cursor-pointer"
                        >
                          Proceed to Challenge <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="chal"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4"
                    >
                      {/* Instructions */}
                      <div className="bg-sky-50/50 border border-sky-100 p-4 rounded-2xl space-y-1.5">
                        <h4 className="text-xs font-black text-sky-800 uppercase tracking-wider flex items-center gap-1">
                          <Terminal className="h-3.5 w-3.5 animate-pulse" /> Objective:
                        </h4>
                        <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                          {selectedTopic.instruction}
                        </p>
                      </div>

                      {/* Code Editor integration */}
                      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner bg-slate-950">
                        <CodeEditor
                          key={selectedTopic.id}
                          initialCode={selectedTopic.starterCode}
                          expectedOutputContains={selectedTopic.expectedOutputContains}
                          lessonContext={`Journey: ${selectedTopic.title}`}
                          onValidationSuccess={() => handleTopicComplete(selectedTopic.id, selectedTopic.xp)}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-sky-100 shadow-sm p-12 text-center text-slate-400">
              <Compass className="h-12 w-12 mx-auto text-slate-300 animate-spin-slow mb-4" />
              <h3 className="font-extrabold text-slate-800">Select a Topic</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Click on any unlocked or completed topic node on the timeline to read and solve the code exercises.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
