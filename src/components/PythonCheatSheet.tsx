import { useState, useMemo } from 'react';
import { 
  FileText, Search, Copy, Check, ChevronDown, ChevronUp, 
  Terminal, Sparkles, BookOpen, Layers, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CheatSheetItem {
  title: string;
  syntax: string;
  example: string;
  description: string;
}

interface CheatSheetSection {
  id: string;
  category: string;
  description: string;
  items: CheatSheetItem[];
}

const CHEATSHEET_SECTIONS: CheatSheetSection[] = [
  {
    id: 'variables',
    category: 'Variables',
    description: 'Declaring and managing variable assignments in Python.',
    items: [
      {
        title: 'Basic Assignment',
        syntax: 'variable_name = value',
        example: `x = 5
name = "Alice"
is_valid = True`,
        description: 'Variables are dynamically typed, meaning you do not need to declare their type beforehand.'
      },
      {
        title: 'Multiple Assignment',
        syntax: 'var1, var2, ... = val1, val2, ...',
        example: `a, b, c = 1, 2.5, "three"
x = y = z = 0`,
        description: 'Assign values to multiple variables in a single line, or a single value to multiple variables.'
      },
      {
        title: 'Type Checking & Casting',
        syntax: 'type(variable)\nnew_var = target_type(variable)',
        example: `x = 10
print(type(x))        # <class 'int'>

y = float(x)          # Convert int to float (10.0)
z = str(x)            # Convert int to string ("10")`,
        description: 'Check a variable\'s type with type() and cast it to another type using constructors.'
      }
    ]
  },
  {
    id: 'datatypes',
    category: 'Data Types',
    description: 'Core built-in basic types used in Python.',
    items: [
      {
        title: 'Numeric Types',
        syntax: 'int, float, complex',
        example: `age = 25              # Integer (int)
price = 19.99         # Decimal (float)
c = 3 + 4j            # Complex number (complex)`,
        description: 'Integers are whole numbers, floats are decimal numbers, and complex numbers hold real and imaginary parts.'
      },
      {
        title: 'Text & Boolean Types',
        syntax: 'str, bool',
        example: `message = "Hello"     # String (str)
is_active = True      # Boolean (bool)
is_admin = False     # Boolean (bool)`,
        description: 'Strings represent Unicode text characters, and Booleans represent truth values (True or False).'
      },
      {
        title: 'None Type',
        syntax: 'None',
        example: `result = None
if result is None:
    print("No result yet")`,
        description: 'None is a special constant used to represent the absence of a value or a null value.'
      }
    ]
  },
  {
    id: 'operators',
    category: 'Operators',
    description: 'Arithmetic, comparison, logical, and assignment operations.',
    items: [
      {
        title: 'Arithmetic Operators',
        syntax: '+, -, *, /, //, %, **',
        example: `sum_val = 10 + 5       # Addition (15)
div_val = 10 / 3       # Division (3.333...)
floor_div = 10 // 3    # Floor Division (3)
rem_val = 10 % 3       # Modulo remainder (1)
power_val = 2 ** 3     # Exponentiation (8)`,
        description: 'Standard operators to execute mathematical operations.'
      },
      {
        title: 'Comparison & Logical Operators',
        syntax: '==, !=, >, <, >=, <=\nand, or, not',
        example: `is_equal = (5 == 5)    # True
is_greater = (10 > 20) # False

check = (5 > 3) and (10 < 15)  # Logical AND (True)
invert = not True              # Logical NOT (False)`,
        description: 'Compare values and combine boolean expressions.'
      }
    ]
  },
  {
    id: 'strings',
    category: 'Strings',
    description: 'Handling text sequence operations and formatting.',
    items: [
      {
        title: 'String Formatting (F-Strings)',
        syntax: 'f"Text {variable}"',
        example: `name = "Arthur"
level = 42
info = f"Hero: {name}, Level: {level}"
print(info) # "Hero: Arthur, Level: 42"`,
        description: 'Embed variables or expressions inside string literals easily by prefixing with an f.'
      },
      {
        title: 'String Methods',
        syntax: 'str.lower(), str.upper(), str.strip(), str.replace()',
        example: `s = "  Python Code  "
print(s.upper())      # "  PYTHON CODE  "
print(s.strip())      # "Python Code" (removes spaces)
print(s.replace("Code", "Verse")) # "  Python Verse  "`,
        description: 'Built-in methods to clean, format, or modify text string values.'
      },
      {
        title: 'Slicing Strings',
        syntax: 'string[start:stop:step]',
        example: `s = "Hello World"
print(s[0:5])         # "Hello" (characters 0 to 4)
print(s[6:])          # "World" (character 6 to end)
print(s[::-1])         # "dlroW olleH" (reverse string)`,
        description: 'Extract specific substrings using bracket slice notation.'
      }
    ]
  },
  {
    id: 'lists',
    category: 'Lists',
    description: 'Ordered, mutable collections of linear items.',
    items: [
      {
        title: 'Creation & Basic Operations',
        syntax: 'my_list = [item1, item2, ...]',
        example: `items = ["sword", "shield"]
items.append("potion")       # Add item
items.insert(1, "gold")      # Insert at index 1
items.remove("shield")       # Remove specific item
popped = items.pop()         # Remove & return last item ("potion")`,
        description: 'Lists are mutable ordered arrays that allow duplicate elements.'
      },
      {
        title: 'List Comprehensions',
        syntax: '[expression for item in iterable if condition]',
        example: `squares = [x**2 for x in range(5)]
# Result: [0, 1, 4, 9, 16]

evens = [x for x in range(10) if x % 2 == 0]
# Result: [0, 2, 4, 6, 8]`,
        description: 'A compact and elegant syntax to generate lists from loops.'
      }
    ]
  },
  {
    id: 'tuples',
    category: 'Tuples',
    description: 'Ordered, immutable collections of values.',
    items: [
      {
        title: 'Creation & Reading',
        syntax: 'my_tuple = (item1, item2, ...)',
        example: `point = (10, 20)
rgb = ("red", "green", "blue")

print(point[0]) # 10`,
        description: 'Tuples are ordered collections that cannot be modified once created (immutable).'
      },
      {
        title: 'Tuple Unpacking',
        syntax: 'val1, val2 = my_tuple',
        example: `coord = (4, 9)
x, y = coord
print(x) # 4
print(y) # 9`,
        description: 'Assign separate elements of a tuple to independent variables directly.'
      }
    ]
  },
  {
    id: 'dictionaries',
    category: 'Dictionaries',
    description: 'Key-value maps storing unique keys bound to values.',
    items: [
      {
        title: 'Declaration & Updates',
        syntax: 'my_dict = {key: value, ...}',
        example: `player = {"name": "Geralt", "level": 99}
player["xp"] = 125000       # Set/add key-value
player["level"] = 100       # Update key-value

# Accessing keys safely
role = player.get("role", "Warrior") # Returns "Warrior" if key doesn't exist`,
        description: 'Dictionaries represent associative arrays mapping unique keys to values.'
      },
      {
        title: 'Iterating Dictionaries',
        syntax: 'dict.keys(), dict.values(), dict.items()',
        example: `hero = {"name": "Alex", "level": 10}

for k, v in hero.items():
    print(f"Key: {k}, Value: {v}")`,
        description: 'Loop over keys, values, or key-value tuples inside a dictionary.'
      }
    ]
  },
  {
    id: 'loops',
    category: 'Loops & Iteration',
    description: 'Iterative control flow engines for repeating operations.',
    items: [
      {
        title: 'For Loops',
        syntax: 'for item in sequence:',
        example: `for num in range(1, 4):
    print("Num:", num)

words = ["code", "run", "debug"]
for word in words:
    print(word)`,
        description: 'Loop over a sequence like ranges, lists, tuples, or strings.'
      },
      {
        title: 'While Loops',
        syntax: 'while condition:',
        example: `count = 0
while count < 3:
    print(count)
    count += 1`,
        description: 'Execute a block of code repeatedly as long as a condition evaluates to True.'
      },
      {
        title: 'Break & Continue',
        syntax: 'break\ncontinue',
        example: `for i in range(10):
    if i == 3:
        continue # Skip rest of this loop iteration
    if i == 6:
        break    # Terminate the loop completely
    print(i)`,
        description: 'Use continue to skip to the next iteration, and break to exit the loop block.'
      }
    ]
  },
  {
    id: 'functions',
    category: 'Functions',
    description: 'Declaring and calling modular, parameterized code blocks.',
    items: [
      {
        title: 'Basic Definition',
        syntax: 'def func_name(params):\n    return val',
        example: `def calculate_total(price, tax):
    total = price + (price * tax)
    return total

bill = calculate_total(100, 0.05)
print(bill) # 105.0`,
        description: 'Functions are defined using def and return outputs to the caller using return.'
      },
      {
        title: 'Default Arguments',
        syntax: 'def func_name(param = default_val):',
        example: `def greet(name, msg="Hello"):
    print(f"{msg}, {name}!")

greet("Bob")          # "Hello, Bob!"
greet("Bob", "Hi")    # "Hi, Bob!"`,
        description: 'Parameters can have default fallback values assigned if omitted in calls.'
      },
      {
        title: 'Lambda Functions',
        syntax: 'lambda args: expression',
        example: `double = lambda x: x * 2
print(double(7)) # 14

multiply = lambda a, b: a * b
print(multiply(3, 4)) # 12`,
        description: 'Anonymous, single-expression functions designed for short utility workflows.'
      }
    ]
  },
  {
    id: 'oop',
    category: 'Object-Oriented Programming',
    description: 'Classes, objects, constructors, and inheritance patterns.',
    items: [
      {
        title: 'Class & Constructor',
        syntax: 'class ClassName:\n    def __init__(self, args):',
        example: `class Wizard:
    def __init__(self, name, spell):
        self.name = name       # Instance variable
        self.spell = spell
        
    def cast(self):            # Class method
        return f"{self.name} casts {self.spell}!"

gandalf = Wizard("Gandalf", "Light")
print(gandalf.cast()) # "Gandalf casts Light!"`,
        description: 'Define classes with the __init__ constructor using self to reference the instance.'
      },
      {
        title: 'Inheritance',
        syntax: 'class DerivedClass(BaseClass):',
        example: `class Enemy:
    def __init__(self, hp):
        self.hp = hp

class Boss(Enemy):
    def __init__(self, hp, shield):
        super().__init__(hp)   # Initialize base class
        self.shield = shield

raid_boss = Boss(1000, 200)
print(raid_boss.hp) # 1000`,
        description: 'Inherit features from a base class and override properties using super().'
      }
    ]
  },
  {
    id: 'filehandling',
    category: 'File Handling',
    description: 'Opening, reading, writing, and closing external storage files.',
    items: [
      {
        title: 'Writing to Files',
        syntax: 'with open("file.txt", "w") as f:',
        example: `with open("log.txt", "w") as f:
    f.write("System Log: Active\\n")
    f.write("Status: OK\\n")`,
        description: 'Using with open() context manager automatically closes files when finished. "w" mode overwrites.'
      },
      {
        title: 'Reading Files',
        syntax: 'with open("file.txt", "r") as f:',
        example: `with open("log.txt", "r") as f:
    content = f.read()     # Reads complete file
    
# Or read line-by-line:
with open("log.txt", "r") as f:
    for line in f:
        print(line.strip())`,
        description: '"r" mode opens files for reading. You can read the whole file or loop line-by-line.'
      }
    ]
  },
  {
    id: 'exceptions',
    category: 'Exception Handling',
    description: 'Capturing errors and exceptions using safety checkpoints.',
    items: [
      {
        title: 'Try-Except Blocks',
        syntax: 'try:\n    ...\nexcept ErrorType:\n    ...',
        example: `try:
    num = 10 / 0
except ZeroDivisionError as e:
    print("Math error occurred:", e)
except ValueError:
    print("Invalid value entered")`,
        description: 'Prevent application crashes by enclosing risky operations in try-except.'
      },
      {
        title: 'Finally & Else Blocks',
        syntax: 'else:\n    ...\nfinally:\n    ...',
        example: `try:
    f = open("data.txt", "r")
except FileNotFoundError:
    print("File not found")
else:
    print("File read successfully!") # Runs only if NO exception occurred
finally:
    print("Cleaning up resources...") # Runs ALWAYS`,
        description: 'Use else for code to run on success, and finally to clean up regardless of outcome.'
      }
    ]
  },
  {
    id: 'modules',
    category: 'Modules & Imports',
    description: 'Importing external math, system, or custom python libraries.',
    items: [
      {
        title: 'Import Statements',
        syntax: 'import module\nfrom module import member',
        example: `import math
print(math.sqrt(16)) # 4.0

from math import pi, sin
print(sin(pi/2)) # 1.0

import random as rnd
print(rnd.randint(1, 10)) # Random between 1 and 10`,
        description: 'Organize code across files and incorporate external libraries using import.'
      }
    ]
  },
  {
    id: 'builtin_functions',
    category: 'Useful Built-in Functions',
    description: 'Highly useful globally available core functions.',
    items: [
      {
        title: 'Aggregate & Helper Functions',
        syntax: 'len(), range(), print(), input()',
        example: `items = [1, 2, 3]
print(len(items))         # Count of items: 3

# Enumerating list with index
for idx, val in enumerate(items):
    print(f"Index {idx}: {val}")`,
        description: 'Core helper methods to count, check sequences, print text outputs, or prompt inputs.'
      },
      {
        title: 'Math & Conversions',
        syntax: 'abs(), min(), max(), sum(), round()',
        example: `numbers = [4, 1, 9, 2]
print(max(numbers))       # 9
print(min(numbers))       # 1
print(sum(numbers))       # 16
print(round(3.14159, 2))  # 3.14`,
        description: 'Carry out fundamental mathematical computations on values and list structures.'
      }
    ]
  }
];

export default function PythonCheatSheet() {
  const [searchText, setSearchText] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    // Expand the first two sections by default
    return {
      'variables': true,
      'datatypes': true
    };
  });
  
  // Clipboard copy state feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopy = (code: string, itemId: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(itemId);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(err => {
      console.error("Failed to copy code snippet:", err);
    });
  };

  // Filter sections and items based on search query
  const filteredSections = useMemo(() => {
    const query = searchText.toLowerCase().trim();
    if (!query) return CHEATSHEET_SECTIONS;

    return CHEATSHEET_SECTIONS.map(section => {
      const isCategoryMatch = section.category.toLowerCase().includes(query) ||
                              section.description.toLowerCase().includes(query);
      
      const matchingItems = section.items.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.syntax.toLowerCase().includes(query) ||
        item.example.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );

      if (isCategoryMatch) {
        return section; // Return all items if category matches
      } else if (matchingItems.length > 0) {
        return {
          ...section,
          items: matchingItems
        };
      }
      return null;
    }).filter((section): section is CheatSheetSection => section !== null);
  }, [searchText]);

  const expandAll = () => {
    const allExpanded = CHEATSHEET_SECTIONS.reduce((acc, sec) => {
      acc[sec.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setExpandedSections(allExpanded);
  };

  const collapseAll = () => {
    setExpandedSections({});
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Hero Card */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-sm relative overflow-hidden">
        {/* Background Decorative Gradient Rings */}
        <div className="absolute right-0 top-0 h-40 w-40 bg-sky-100 rounded-full blur-3xl opacity-30 -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute left-0 bottom-0 h-28 w-28 bg-blue-100 rounded-full blur-2xl opacity-20 -ml-10 -mb-10 pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[10px] bg-sky-50 text-blue-600 font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border border-sky-100 inline-flex items-center gap-1">
              <FileText className="h-3 w-3" /> Quick Reference
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Python Cheat Sheet</h1>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Browse syntactic rules, code blocks, operators, and functions. Filter search results instantly and copy spells directly to your clipboard.
            </p>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={expandAll}
              className="bg-slate-50 hover:bg-slate-100 text-slate-650 font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-xl border border-slate-200 cursor-pointer transition active:scale-95"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="bg-slate-50 hover:bg-slate-100 text-slate-650 font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-xl border border-slate-200 cursor-pointer transition active:scale-95"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Search Area */}
      <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm flex items-center gap-3">
        <Search className="h-5 w-5 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by keywords (e.g. lists, loops, variables, append)..."
          className="flex-1 bg-transparent text-sm text-slate-800 font-bold focus:outline-none placeholder-slate-400"
        />
        {searchText && (
          <button 
            onClick={() => setSearchText('')}
            className="text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-wider px-2 py-1 bg-slate-50 border rounded-lg cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* 3. Cheat Sheet Results */}
      <div className="space-y-4">
        {filteredSections.length > 0 ? (
          filteredSections.map((section) => {
            const isExpanded = !!expandedSections[section.id];
            
            return (
              <div 
                key={section.id} 
                className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden transition-all duration-200"
              >
                {/* Header Collapsible Trigger */}
                <div 
                  onClick={() => toggleSection(section.id)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition duration-150 select-none border-b border-sky-50"
                >
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                      <span className="h-2 w-2 bg-blue-500 rounded-full" />
                      {section.category}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-semibold">{section.description}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[9px] bg-slate-100 border text-slate-500 font-black px-2 py-0.5 rounded-full uppercase">
                      {section.items.length} {section.items.length === 1 ? 'Item' : 'Items'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Collapsible content wrapper */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 divide-y divide-slate-100 space-y-5">
                        {section.items.map((item, idx) => {
                          const itemId = `${section.id}_${idx}`;
                          const isCopied = copiedId === itemId;

                          return (
                            <div 
                              key={itemId} 
                              className={`pt-5 first:pt-0 grid grid-cols-1 md:grid-cols-12 gap-5 items-start`}
                            >
                              {/* Left detail pane */}
                              <div className="md:col-span-4 space-y-1.5">
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                  {item.title}
                                </h4>
                                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                                  {item.description}
                                </p>
                                
                                <div className="pt-2">
                                  <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Syntax:</span>
                                  <code className="text-[10px] bg-slate-50 border px-1.5 py-0.5 rounded text-blue-700 font-mono font-bold inline-block break-all mt-1">
                                    {item.syntax}
                                  </code>
                                </div>
                              </div>

                              {/* Right code compiler codebox pane */}
                              <div className="md:col-span-8 relative">
                                <div className="absolute right-3 top-3 z-10 flex gap-2">
                                  <button
                                    onClick={() => handleCopy(item.example, itemId)}
                                    className={`p-2 rounded-lg border transition-all duration-150 cursor-pointer ${
                                      isCopied
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                                    }`}
                                    title="Copy code to clipboard"
                                  >
                                    {isCopied ? (
                                      <Check className="h-3.5 w-3.5" />
                                    ) : (
                                      <Copy className="h-3.5 w-3.5" />
                                    )}
                                  </button>
                                </div>

                                <pre className="bg-slate-950 text-slate-200 p-4 pt-10 rounded-2xl font-mono text-[11px] overflow-x-auto shadow-inner border border-slate-800">
                                  {item.example}
                                </pre>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl border border-sky-100 p-12 text-center text-slate-400 shadow-sm">
            <Search className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <h3 className="font-extrabold text-slate-800">No Match Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              We couldn't find any syntax sheets matching your keywords. Please try another query.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
