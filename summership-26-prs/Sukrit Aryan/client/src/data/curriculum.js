// ─────────────────────────────────────────────────────────────────
// PyBe Curriculum — Chapter definitions, concept mappings & theory
// ─────────────────────────────────────────────────────────────────

export const CURRICULUM = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    emoji: '🌱',
    color: '#A8FF3E',
    chapters: [
      {
        id: 'variables',
        title: 'Variables',
        subtitle: 'Giving names to things',
        emoji: '📦',
        concepts: ['variables'],
        intro: {
          hook: "Imagine trying to remember 10 phone numbers in your head — without writing them down. That's what a computer without variables would be.",
          whatYoullFigureOut: "How to give a name to any piece of information so you can use it later.",
          vibe: "Think like Ramu, who just started his chai stall and is trying to keep track of everything.",
        },
        theory: {
          headline: "You just discovered Variables! 🎉",
          concept: "Variable",
          beforeVsAfter: {
            beforeTitle: "Without Variables (Hardcoded Raw Values)",
            beforeCode: `print(12 * 47 - 200)\nprint("Chai price is 12") # What is 12? What is 47?`,
            beforePain: "Every number is a mystery. If price changes to 15, you must manually rewrite it in 50 places!",
            afterTitle: "With Variables (Named Memory Boxes)",
            afterCode: `price = 15\ncups_sold = 47\nprofit = (price * cups_sold) - 200 # Clear names!`,
            afterGain: "Change `price = 15` in ONE place and every calculation updates automatically across your entire program.",
          },
          explanation: `A variable is just a named box for storing information.

When you write:
  name = "Ramu"

You're telling Python: "Create a box, label it 'name', and put the word Ramu inside."

Later, whenever you need that information, you just say the box's name — and Python opens it and hands you what's inside.

That's literally it. No magic. Just named boxes.`,
          codeExample: `# Three named boxes
chai_type = "Ginger Chai"
price = 12
cups_sold = 47

# Use them later
print("Today's chai:", chai_type)
print("Total earned: ₹", price * cups_sold)`,
          realWorldConnection: "Remember when Ramu had to remember his chai's price in his head? Variables let the computer remember for him — so Ramu can focus on making great chai.",
          keyTakeaway: "Variables = named boxes that store information for you.",
        },
      },
      {
        id: 'operators',
        title: 'Operators & Math',
        subtitle: 'Making the computer calculate',
        emoji: '➕',
        concepts: ['arithmetic', 'subtraction'],
        intro: {
          hook: "You already know math. Python just lets you make the computer do it — so you never have to.",
          whatYoullFigureOut: "How to add, subtract, multiply, and divide with Python — and what happens when things don't add up perfectly.",
          vibe: "Help Ramu figure out his daily profit without using a calculator.",
        },
        theory: {
          headline: "You just discovered Operators! 🧮",
          concept: "Operators",
          beforeVsAfter: {
            beforeTitle: "Without Operators (Mental Math)",
            beforeCode: `# Manually calculating in head: 12 * 47 = 564\nearnings = 564`,
            beforePain: "Human mental math is slow, stressful, and error-prone when handling thousands of transactions.",
            afterTitle: "With Operators (Computer Calculations)",
            afterCode: `earnings = price * cups_sold\nprofit = earnings - daily_cost`,
            afterGain: "Python computes math equations in nanoseconds with 100% mathematical precision.",
          },
          explanation: `Operators are just the math symbols you already know — Python understands them too.

  +  means add
  -  means subtract
  *  means multiply
  /  means divide
  ** means "to the power of" (like 2**3 = 8)
  %  means "remainder" (12 % 5 = 2, because 12 ÷ 5 has remainder 2)

Python follows the same order of operations you learned in school — BODMAS still applies!`,
          codeExample: `price = 12
cups_sold = 47
daily_cost = 200

earnings = price * cups_sold        # 564
profit = earnings - daily_cost      # 364

print("Ramu earned: ₹", earnings)
print("Ramu's profit: ₹", profit)`,
          realWorldConnection: "The moment Ramu wanted to know 'how much did I earn minus what I spent' — he needed operators. Python can do that calculation a million times faster than any mental math.",
          keyTakeaway: "Operators let you do math on your variables — Python handles the calculation.",
        },
      },
      {
        id: 'strings',
        title: 'Strings & Text',
        subtitle: 'Working with words and sentences',
        emoji: '💬',
        concepts: ['strings'],
        intro: {
          hook: "Numbers are easy for computers. But what about words? Names? Messages? That's where strings come in.",
          whatYoullFigureOut: "How Python stores and handles text — and how to stick pieces of text together.",
          vibe: "Help create personalized greeting messages for Ramu's chai stall regulars.",
        },
        theory: {
          headline: "You just discovered Strings! 📝",
          concept: "String",
          beforeVsAfter: {
            beforeTitle: "Without Strings (Raw Numeric ASCII Codes)",
            beforeCode: `# Computers originally only understood raw numbers\nmsg_code = [72, 101, 108, 108, 111] # ASCII codes!`,
            beforePain: "Writing and reading human words as numeric codes makes reading code impossible.",
            afterTitle: "With Strings (Quotes & Concatenation)",
            afterCode: `name = "Priya"\ngreeting = f"Hello {name}! Your chai is ready."`,
            afterGain: "Manipulate text, names, and sentences directly using intuitive quotes and f-strings.",
          },
          explanation: `A string is just a piece of text in Python. You wrap it in quotes and Python treats everything inside as text — not a calculation, not a variable name, just text.

  "Hello, Ramu!"     → a string
  'Ginger Chai'      → also a string (single quotes work too)
  "12"               → this is the TEXT "12", not the number 12

You can join strings together using +:
  first = "Ginger"
  second = " Chai"
  full = first + second   → "Ginger Chai"

This is called concatenation (a fancy word for "sticking text together").`,
          codeExample: `name = "Priya"
chai = "Masala Chai"
price = 15

# Building a message
greeting = "Hello " + name + "! Your " + chai + " is ready."
print(greeting)
# → Hello Priya! Your Masala Chai is ready.

# f-strings (the modern, cleaner way)
bill = f"Your total is ₹{price}. Thank you!"
print(bill)`,
          realWorldConnection: "Every time Ramu wants to print a receipt, send a message, or display a menu — he needs strings. You just figured out how Python talks in words, not just numbers.",
          keyTakeaway: "Strings are text wrapped in quotes. Use + or f-strings to combine them.",
        },
      },
    ],
  },

  {
    id: 'basics',
    title: 'Basics',
    emoji: '📚',
    color: '#60A5FA',
    chapters: [
      {
        id: 'conditionals',
        title: 'Making Decisions',
        subtitle: 'if this, then that',
        emoji: '🔀',
        concepts: ['conditionals', 'comparisons'],
        intro: {
          hook: "Every single day you make hundreds of decisions: if it's raining, carry an umbrella. If the price is right, buy it. If your score is above 40, you pass.",
          whatYoullFigureOut: "How to teach Python to make decisions — so it can handle different situations on its own.",
          vibe: "Help a student figure out if they passed their exam — without manually checking every student's marks.",
        },
        theory: {
          headline: "You just discovered If/Else — Decisions! 🔀",
          concept: "Conditionals (if/else)",
          beforeVsAfter: {
            beforeTitle: "Without Conditionals (Flat Code Execution)",
            beforeCode: `print("Student Passed!")\nprint("Student Failed!") # Both lines print every time!`,
            beforePain: "Without branching rules, your program runs every line blindly regardless of the actual situation.",
            afterTitle: "With Conditionals (if / elif / else)",
            afterCode: `if score >= 60:\n    print("Student Passed!")\nelse:\n    print("Student Failed!")`,
            afterGain: "Your program evaluates runtime inputs and makes smart decisions automatically.",
          },
          explanation: `Python makes decisions with "if":

  if <something is true>:
      do this
  else:
      do that instead

The key is the colon (:) and the indent (spaces before the next line). Python is very particular about this — it's how it knows which code belongs to the "if" and which belongs to the "else".

You can also chain conditions:
  if score >= 90:
      grade = "A"
  elif score >= 60:
      grade = "B"
  else:
      grade = "C"

elif means "else if" — another condition to check when the first one fails.`,
          codeExample: `score = 73

if score >= 80:
    print("Great job! 🌟")
elif score >= 60:
    print("You passed! Keep it up.")
elif score >= 40:
    print("Just passed. Study harder next time.")
else:
    print("Better luck next time. Don't give up!")`,
          realWorldConnection: "The moment you wanted the computer to treat different students differently based on their marks — you needed if/else. Python calls it a conditional, and it's the foundation of all smart programs.",
          keyTakeaway: "if/else lets your code make decisions — different inputs, different outputs.",
        },
      },
      {
        id: 'loops',
        title: 'Loops',
        subtitle: 'Repeating without copying',
        emoji: '🔁',
        concepts: ['loops', 'while loops'],
        intro: {
          hook: "What if you had to check 30 students' attendance one by one, writing the same code 30 times? There's a better way.",
          whatYoullFigureOut: "How to make Python repeat an action automatically — for a list of items, or until a condition is met.",
          vibe: "Help a teacher automate the attendance roll call for a whole class.",
        },
        theory: {
          headline: "You just discovered Loops! 🔁",
          concept: "Loops (for / while)",
          beforeVsAfter: {
            beforeTitle: "Without Loops (Copy-Pasting Code Lines)",
            beforeCode: `print(students[0], "Present")\nprint(students[1], "Present")\nprint(students[2], "Present") # x100 lines!`,
            beforePain: "Processing 100 items requires copy-pasting code 100 times. Change 1 requirement = edit 100 lines!",
            afterTitle: "With Loops (for / while)",
            afterCode: `for s in students:\n    print(s, "Present ✓")`,
            afterGain: "Write the action ONCE, and Python repeats it for 10 or 10,000 items automatically.",
          },
          explanation: `A loop tells Python: "Do this thing for each item" or "Keep doing this until I say stop."

There are two kinds:

FOR loop — "do this for each item in a list":
  for student in attendance_list:
      print(student + " - Present")

WHILE loop — "keep going as long as this is true":
  attempts = 0
  while attempts < 3:
      print("Try again!")
      attempts = attempts + 1

The for loop is more common when you know what you're looping over.
The while loop is for "keep going until something changes."`,
          codeExample: `students = ["Priya", "Arjun", "Dev", "Meera"]

# Check everyone without writing 4 separate lines
for name in students:
    print(name, "- Present ✓")

# Count total attendance
total = len(students)
print(f"Total present: {total}")`,
          realWorldConnection: "The moment you wanted to do the same thing for every student without copy-pasting code 30 times — you invented loops. Python has had them since day one.",
          keyTakeaway: "Loops repeat an action — for each item in a collection, or while a condition is true.",
        },
      },
      {
        id: 'lists',
        title: 'Lists',
        subtitle: 'Storing many things together',
        emoji: '📝',
        concepts: ['lists', 'indexing', 'counting'],
        intro: {
          hook: "You have 8 chai types, 8 separate variables. You need to add a 9th. Then a 10th. Something has to change.",
          whatYoullFigureOut: "How to group many related things into one single container — instead of creating a new variable for each one.",
          vibe: "Ramu's chai menu keeps growing. Help him organize it properly.",
        },
        theory: {
          headline: "You just discovered Lists! 📝",
          concept: "List",
          beforeVsAfter: {
            beforeTitle: "Without Lists (Separate Variables)",
            beforeCode: `item1 = "Chai"\nitem2 = "Coffee"\nitem3 = "Samosa" # Need item4, item5... item100?`,
            beforePain: "Creating separate variables for 100 items makes passing data and counting total items impossible.",
            afterTitle: "With Lists (Ordered Collection Container)",
            afterCode: `menu = ["Chai", "Coffee", "Samosa"]\nmenu.append("Bun Maska")`,
            afterGain: "Store thousands of items in one named list container with instant index access.",
          },
          explanation: `A list is like a row of boxes — instead of one named box, you have many boxes in a line, all under one name.

  chai_menu = ["Ginger Chai", "Masala Chai", "Plain Tea", "Green Tea"]

Now chai_menu holds ALL four, under one name.

You get individual items by their position (starting from 0 — Python counts from zero, not one):
  chai_menu[0]   → "Ginger Chai"  (first item)
  chai_menu[1]   → "Masala Chai"  (second item)
  chai_menu[-1]  → "Green Tea"    (last item, a shortcut!)

You can add to the list:   chai_menu.append("Lemon Tea")
You can check the length:  len(chai_menu)  → 5`,
          codeExample: `chai_menu = ["Ginger Chai", "Masala Chai", "Plain Tea"]

# See everything
for chai in chai_menu:
    print("•", chai)

# Add a new item
chai_menu.append("Lemon Tea")
print(f"Now we have {len(chai_menu)} types of chai!")

# Get the first one
print("Our signature chai:", chai_menu[0])`,
          realWorldConnection: "The moment Ramu had 8 separate chai variables and realized they all belonged together — he reinvented the list. That pain you felt managing separate variables? That's exactly why Python has lists.",
          keyTakeaway: "Lists hold many items under one name — indexed from 0, grow with .append().",
        },
      },
    ],
  },

  {
    id: 'intermediate',
    title: 'Intermediate',
    emoji: '⚙️',
    color: '#F59E0B',
    chapters: [
      {
        id: 'dictionaries',
        title: 'Dictionaries',
        subtitle: 'Looking up by name, not position',
        emoji: '📖',
        concepts: ['dictionaries'],
        intro: {
          hook: "Lists are great, but what happens when you need to know the *price* of a specific chai? You'd have to count its position first. That breaks. Fast.",
          whatYoullFigureOut: "How to store key-value pairs — like a real dictionary where you look up a word and get its meaning.",
          vibe: "A critical FAIL at ISRO Mission Control at 2 AM shows why position-based lookup breaks — and how dictionaries fix it.",
        },
        theory: {
          headline: "You just discovered Dictionaries! 📖",
          concept: "Dictionary",
          beforeVsAfter: {
            beforeTitle: "Without Dictionaries (Parallel Lists)",
            beforeCode: `items = ["Chai", "Coffee"]\nprices = [12, 25]\n# Index 0 must match Index 0! Danger!`,
            beforePain: "Parallel lists fall out of sync if an item is deleted or sorted, corrupting your application data.",
            afterTitle: "With Dictionaries (Key-Value Direct Lookup)",
            afterCode: `prices = {"Chai": 12, "Coffee": 25}\nprint(prices["Chai"]) # Direct O(1) lookup!`,
            afterGain: "Associate names directly with values for instant O(1) key lookup by name.",
          },
          explanation: `A dictionary stores pairs: a key and a value. Just like a real dictionary — you look up a word (key) and get its definition (value).

  prices = {
      "Ginger Chai": 12,
      "Masala Chai": 15,
      "Plain Tea": 8,
  }

Now to find Masala Chai's price, you don't count positions — you just ask by name:
  prices["Masala Chai"]   → 15

This is much safer than lists when things have names. No more "wait, was it index 4 or 5?"

You can add entries:  prices["Lemon Tea"] = 10
Check if key exists:  "Plain Tea" in prices   → True
Get all keys:         prices.keys()`,
          codeExample: `# ISRO telemetry — safe lookup by name
subsystems = {
    "fuel_pressure": 98.6,
    "temperature": 72.3,
    "signal_strength": 94.1,
}

# Look up by name, not position!
print("Fuel pressure:", subsystems["fuel_pressure"])

# Add a new subsystem easily
subsystems["battery"] = 87.5

# Check everything
for system, value in subsystems.items():
    status = "OK ✓" if value > 80 else "WARNING ⚠️"
    print(f"{system}: {value} — {status}")`,
          realWorldConnection: "When the ISRO intern needed to find fuel pressure among 12 subsystems at 2 AM, counting list positions was too risky. Dictionaries let you look up by name — because names don't change even when you add new items.",
          keyTakeaway: "Dictionaries store key-value pairs — look up by name, not position.",
        },
      },
      {
        id: 'sets',
        title: 'Sets',
        subtitle: 'Unique collections — no duplicates allowed',
        emoji: '🎯',
        concepts: ['sets'],
        intro: {
          hook: '"Shape of You" plays for the 23rd time. Your playlist has 200 songs — 40 of them are duplicates. A set would have fixed this in one line.',
          whatYoullFigureOut: "How to store things where each item can only appear once — and how to find what's missing or what's shared.",
          vibe: "The AI Playlist that keeps repeating songs — and the duplicate biryani crisis that crashed the food delivery startup.",
        },
        theory: {
          headline: "You just discovered Sets! 🎯",
          concept: "Set",
          beforeVsAfter: {
            beforeTitle: "Without Sets (Manual Loop Duplicate Checks)",
            beforeCode: `unique = []\nfor x in items:\n    if x not in unique:\n        unique.append(x) # Slow & verbose!`,
            beforePain: "Checking for duplicates manually requires slow nested loops and messy boilerplate code.",
            afterTitle: "With Sets (Unique Element Buckets)",
            afterCode: `unique_items = set(items) # Instant 1-line deduplication!`,
            afterGain: "Guarantees 100% unique elements automatically using mathematical set operations.",
          },
          explanation: `A set is like a list, but with one golden rule: every item can only appear ONCE.

  played = {"Shape of You", "Blinding Lights", "Shape of You"}

  Actually stored: {"Shape of You", "Blinding Lights"}
  (The duplicate is automatically thrown out)

Sets are great for:
  • Removing duplicates from a list
  • Checking if something is in a group (very fast!)
  • Finding what two groups share (intersection)
  • Finding what one group has that the other doesn't (difference)

Convert a list to a set:  set(my_list)
Convert back:             list(my_set)`,
          codeExample: `# Fix a playlist with duplicates
songs_played = ["Shape of You", "Blinding Lights", "Shape of You", "Levitating", "Blinding Lights"]

# Remove all duplicates instantly
unique_songs = set(songs_played)
print(f"Unique songs: {len(unique_songs)}")  # → 3

# Find songs NOT yet played today
all_songs = {"Shape of You", "Blinding Lights", "Levitating", "Stay", "Peaches"}
unplayed = all_songs - unique_songs
print("Songs to play next:", unplayed)`,
          realWorldConnection: "The moment 'Shape of You' played for the 23rd time, you needed a set — a collection that just refuses to store duplicates. Python sets do this automatically, with zero extra code from you.",
          keyTakeaway: "Sets store unique items only — perfect for removing duplicates and finding differences.",
        },
      },
      {
        id: 'functions',
        title: 'Functions',
        subtitle: 'Write once, use everywhere',
        emoji: '🔧',
        concepts: ['functions'],
        intro: {
          hook: "You've written the same discount calculation in 5 different places in your code. Then the discount rule changes. Now you have to fix it in 5 places. There must be a better way.",
          whatYoullFigureOut: "How to package a piece of code into a named box — so you can run it anytime without rewriting it.",
          vibe: "Ramu's chai stall needs a consistent discount system — and copy-pasting the formula everywhere is already causing bugs.",
        },
        theory: {
          headline: "You just discovered Functions! 🔧",
          concept: "Function",
          beforeVsAfter: {
            beforeTitle: "Without Functions (Duplicate Code Blocks)",
            beforeCode: `# Table 1 bill calculation\ntax = 15 * 0.05\ntotal = 15 + tax\n# Repeat same 3 lines for Table 2, Table 3...`,
            beforePain: "Duplicating calculation logic across your app means bug fixes must be repeated everywhere.",
            afterTitle: "With Functions (Reusable Logic Blocks)",
            afterCode: `def get_total(price):\n    return price * 1.05\n\nbill1 = get_total(15)`,
            afterGain: "Package logic into reusable functions with inputs and outputs — write once, run anywhere.",
          },
          explanation: `A function is a named, reusable block of code. You define it once, call it anywhere.

  def calculate_bill(price, quantity):
      total = price * quantity
      discount = total * 0.1   # 10% off
      return total - discount

Now whenever you need the bill:
  bill = calculate_bill(12, 5)   → 54.0

You gave the function two inputs (price, quantity), it ran the calculation and gave you back an answer (54.0).

  def → how you declare a function
  return → how the function sends the answer back to you
  Indented code → the "body" — what runs when you call it`,
          codeExample: `def chai_bill(price, cups, has_loyalty_card):
    total = price * cups
    if has_loyalty_card:
        total = total * 0.9   # 10% loyalty discount
    return total

# Use it for any order — no copy-paste!
order1 = chai_bill(12, 3, True)   # → 32.4
order2 = chai_bill(15, 2, False)  # → 30.0
order3 = chai_bill(8,  5, True)   # → 36.0

print(f"Order 1: ₹{order1}")`,
          realWorldConnection: "The moment you had the same discount formula in 5 places and one change broke 4 of them — you needed a function. Package the logic once, name it, call it everywhere. Fix it once, fixed everywhere.",
          keyTakeaway: "Functions are reusable code blocks — define once with def, call them anywhere.",
        },
      },
      {
        id: 'search-filter',
        title: 'Search & Filter',
        subtitle: 'Finding exactly what you need',
        emoji: '🔍',
        concepts: ['search', 'filtering', 'modulo'],
        intro: {
          hook: "You have 30 students. A parent just called and wants their child's rank. You're staring at 30 names in a list. How do you find the right one — fast?",
          whatYoullFigureOut: "How to search through data, filter it by conditions, and pick out exactly what you need.",
          vibe: "The Kota coaching center needs to find any student's rank in seconds — with the director watching.",
        },
        theory: {
          headline: "You just discovered Search & Filter! 🔍",
          concept: "Search & Filter",
          beforeVsAfter: {
            beforeTitle: "Without Search Algorithms (Manual Inspection)",
            beforeCode: `# Checking elements one by one manually without pattern matching`,
            beforePain: "Scanning large datasets without systematic algorithms results in missed data and slowness.",
            afterTitle: "With Search & Filter Algorithms",
            afterCode: `found = [item for item in items if query in item]`,
            afterGain: "Find target items or filter collections in milliseconds using pattern matching.",
          },
          explanation: `Searching means finding an item that matches what you're looking for.
Filtering means keeping only the items that pass a condition.

Python gives you powerful tools for both:

  # Search: find one item
  for student in students:
      if student["name"] == "Priya":
          print("Found her!")

  # Filter: keep only items that match
  top_students = [s for s in students if s["rank"] <= 10]

That last line is called a "list comprehension" — it's Python's elegant way to filter in one line.

You can also use:
  any()  → is at least one item true?
  all()  → are all items true?
  min()  → find the smallest
  max()  → find the largest`,
          codeExample: `students = [
    {"name": "Priya", "rank": 3},
    {"name": "Arjun", "rank": 12},
    {"name": "Dev", "rank": 1},
    {"name": "Meera", "rank": 7},
]

# Find one student by name
def find_student(name):
    for s in students:
        if s["name"] == name:
            return s
    return None

result = find_student("Priya")
print(f"{result['name']} is ranked #{result['rank']}")

# Filter: who's in top 5?
top5 = [s for s in students if s["rank"] <= 5]
print("Top 5:", [s["name"] for s in top5])`,
          realWorldConnection: "When the director walked in and asked 'where is Priya's rank?' — you needed search. When you wanted only the top 10 students — you needed filter. These two operations underlie every app you've ever used.",
          keyTakeaway: "Search finds one item; Filter keeps only items that match a condition.",
        },
      },
    ],
  },

  {
    id: 'advanced',
    title: 'Advanced',
    emoji: '⚡',
    color: '#EC4899',
    chapters: [
      {
        id: 'error-handling',
        title: 'Error Handling',
        subtitle: "Expecting the unexpected",
        emoji: '🛡️',
        concepts: ['error handling', 'validation'],
        intro: {
          hook: "Someone enters -36 as a quantity. Your app crashes. 47 orders are wiped. Three friends lose their startup's first night of orders.",
          whatYoullFigureOut: "How to write code that handles bad inputs, crashes gracefully, and never loses data — even when users do the wrong thing.",
          vibe: "The HungerFix food delivery startup almost closed on its first night because of one missing input check.",
        },
        theory: {
          headline: "You just discovered Error Handling! 🛡️",
          concept: "try / except",
          beforeVsAfter: {
            beforeTitle: "Without Try/Except (Uncaught Crashes)",
            beforeCode: `result = 10 / 0 # Unhandled ZeroDivisionError -> APP CRASHES!`,
            beforePain: "An unexpected invalid input or zero division crashes your entire application for all users.",
            afterTitle: "With Try/Except (Error Shields)",
            afterCode: `try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    result = 0 # Handled safely!`,
            afterGain: "Shield your program against crashes — catch errors gracefully and keep running.",
          },
          explanation: `Real code gets real inputs — and real inputs are often wrong. Error handling lets your code deal with problems without crashing.

  try:
      risky code here
  except SomeError:
      code to run when it goes wrong

It's like a safety net. Python tries the risky thing, and if it fails, instead of crashing — it catches the fall and does something smarter.

Common errors you'll catch:
  ValueError     → wrong type of value ("abc" where a number was expected)
  ZeroDivisionError  → dividing by zero
  KeyError       → looking up a key that doesn't exist in a dict
  FileNotFoundError  → file you tried to open doesn't exist`,
          codeExample: `def place_order(item, quantity):
    # Validate input BEFORE anything breaks
    if not isinstance(quantity, (int, float)):
        return "Error: Quantity must be a number!"
    if quantity <= 0:
        return "Error: Quantity must be positive!"
    if quantity > 100:
        return "Error: Can't order more than 100 at once."

    try:
        total = calculate_price(item, quantity)
        return f"Order placed! ₹{total}"
    except KeyError:
        return f"Error: '{item}' not found on our menu."
    except Exception as e:
        return f"Unexpected error: {e}"`,
          realWorldConnection: "That -36 quantity that crashed the HungerFix startup? One if-statement would have caught it. Error handling is the difference between a toy project and a real app. Real code always has it.",
          keyTakeaway: "try/except catches errors before they crash your program — validate inputs early!",
        },
      },
      {
        id: 'algorithms',
        title: 'Algorithms',
        subtitle: 'Thinking cleverly about steps',
        emoji: '🧠',
        concepts: ['algorithms', 'sorting', 'adaptive logic'],
        intro: {
          hook: "30 students' ranks. You need to find the top 3, then sort the whole list. Do you check every pair? Or is there a smarter way?",
          whatYoullFigureOut: "How to think algorithmically — breaking a problem into efficient steps instead of brute-force checking everything.",
          vibe: "The Kota coaching center needs its merit list sorted in 10 seconds — the director is already on his way up.",
        },
        theory: {
          headline: "You just discovered Algorithms! 🧠",
          concept: "Algorithms & Sorting",
          beforeVsAfter: {
            beforeTitle: "Without Sorting Algorithms (Unordered Chaos)",
            beforeCode: `scores = [73, 98, 45, 88] # Finding top score requires scanning all items`,
            beforePain: "Unsorted data makes finding ranks, medians, and top performers extremely slow.",
            afterTitle: "With Sorting Algorithms",
            afterCode: `scores.sort(reverse=True) # [98, 88, 73, 45]`,
            afterGain: "Instantly organize unstructured data into sorted order for instant ranking.",
          },
          explanation: `An algorithm is just a set of steps to solve a problem. But the key is: some step sequences are WAY smarter than others.

Sorting is one of the most classic algorithmic problems:

Python's built-in sort is extremely fast:
  students.sort(key=lambda s: s["rank"])

But understanding WHY it works matters more than memorizing it.

The simplest sorting idea (Bubble Sort) goes through the list repeatedly, swapping adjacent items that are out of order. Python's actual sort (Timsort) is much smarter — but the IDEA is the same: compare, swap, repeat.

Lambda is just a tiny function you write inline:
  lambda s: s["rank"]
means "for each student s, sort by their rank value."`,
          codeExample: `students = [
    {"name": "Priya",  "marks": 287},
    {"name": "Dev",    "marks": 312},
    {"name": "Meera",  "marks": 245},
    {"name": "Arjun",  "marks": 298},
]

# Sort by marks — highest first
sorted_students = sorted(students, key=lambda s: s["marks"], reverse=True)

# Print merit list
print("=== MERIT LIST ===")
for rank, student in enumerate(sorted_students, start=1):
    print(f"#{rank}  {student['name']}  —  {student['marks']}")`,
          realWorldConnection: "When the director needed the merit list in 10 seconds, you needed to sort 30 entries efficiently. Python's sort handles this in microseconds — built on decades of computer science research. But now you understand the idea behind it.",
          keyTakeaway: "Algorithms are step-by-step solutions. Python's sort() is built-in, efficient, and customizable with key=.",
        },
      },
      {
        id: 'files',
        title: 'Files & Data',
        subtitle: 'Saving things so they last',
        emoji: '💾',
        concepts: ['file I/O', 'averages'],
        intro: {
          hook: "Every time you restart your app, all the data is gone. Ramu loses his entire order history. There has to be a way to make things permanent.",
          whatYoullFigureOut: "How to read from and write to files — so your program's data survives even after you close it.",
          vibe: "Ramu needs to save his daily sales records to a file so he can review them the next morning.",
        },
        theory: {
          headline: "You just discovered File I/O! 💾",
          concept: "Files & I/O",
          beforeVsAfter: {
            beforeTitle: "Without Files (Transient RAM Memory)",
            beforeCode: `# Program ends -> all variables erased from RAM permanently!`,
            beforePain: "When the app closes or the computer restarts, all student progress and data is lost forever.",
            afterTitle: "With File I/O (Permanent Disk Storage)",
            afterCode: `with open("data.json", "w") as f:\n    json.dump(records, f)`,
            afterGain: "Save data permanently to disk so records persist across sessions and restarts.",
          },
          explanation: `File I/O (Input/Output) means reading from and writing to files on your computer.

Writing to a file:
  with open("sales.txt", "w") as file:
      file.write("Day 1: ₹564\n")

Reading from a file:
  with open("sales.txt", "r") as file:
      content = file.read()

The "with" statement is the safe way — it automatically closes the file when you're done.

Modes:
  "w"  → write (starts fresh, overwrites existing)
  "a"  → append (adds to the end, keeps existing)
  "r"  → read (only reading, can't write)

For structured data, Python's "json" module lets you save dictionaries and lists directly:
  import json
  json.dump(my_dict, file)   # save
  json.load(file)             # load back`,
          codeExample: `import json

def save_daily_sales(day, earnings, cups_sold):
    record = {
        "day": day,
        "earnings": earnings,
        "cups_sold": cups_sold,
    }
    with open("ramu_sales.json", "a") as f:
        f.write(json.dumps(record) + "\\n")

def load_all_sales():
    try:
        with open("ramu_sales.json", "r") as f:
            return [json.loads(line) for line in f if line.strip()]
    except FileNotFoundError:
        return []   # No records yet, that's fine

save_daily_sales("Monday", 564, 47)
all_records = load_all_sales()
print(f"Total days recorded: {len(all_records)}")`,
          realWorldConnection: "The moment Ramu wanted to check last Tuesday's sales — he needed files. Without file I/O, every program forgets everything the second you close it. Files make data permanent.",
          keyTakeaway: "Files persist data between runs. Use 'with open()' to read/write safely. JSON handles structured data.",
        },
      },
    ],
  },
];

// Flat chapter list for easy lookup
export const CHAPTERS_MAP = {};
CURRICULUM.forEach(section => {
  section.chapters.forEach(chapter => {
    CHAPTERS_MAP[chapter.id] = { ...chapter, sectionId: section.id, sectionTitle: section.title, sectionColor: section.color };
  });
});

// All chapters in order
export const ALL_CHAPTERS = CURRICULUM.flatMap(s => s.chapters.map(c => ({
  ...c,
  sectionId: s.id,
  sectionTitle: s.title,
  sectionColor: s.color,
})));

// ── Theme Variations for Chapter Intro & Theory ────────────────────
const THEMED_CHAPTER_VARIANTS = {
  potterheads: {
    variables: {
      vibe: "Think like a Potions Apprentice at Hogwarts keeping track of ingredients for Severus Snape's cauldron.",
      realWorldConnection: "When Snape measures Boomslang skin and Lacewing flies, variables let Hogwarts magic track the exact dosage — so your cauldron doesn't explode.",
      codeExample: `# Hogwarts Potion Ingredients
ingredient = "Boomslang Skin"
grams = 15
potency = 98

print("Brewing:", ingredient)
print("Total dosage:", grams * potency)`,
    },
    operators: {
      vibe: "Help Hermione calculate House points and potion brewing times without a Time-Turner.",
      realWorldConnection: "Calculating House point totals and potion brewing duration requires Python math operators.",
      codeExample: `base_points = 100
bonus = 45
penalty = 15

final_points = base_points + bonus - penalty
print("Gryffindor total:", final_points)`,
    },
    strings: {
      vibe: "Craft incantation formulas and Marauder's Map scroll greetings.",
      realWorldConnection: "Spells like 'Expelliarmus' and Marauder's Map scroll messages are strings in Python.",
      codeExample: `wizard = "Harry"
spell = "Expelliarmus"

greeting = f"I solemnly swear {wizard} casts {spell}!"
print(greeting)`,
    },
    conditionals: {
      vibe: "Help the Sorting Hat assign students to Gryffindor, Ravenclaw, Hufflepuff, or Slytherin.",
      realWorldConnection: "The Sorting Hat uses if/elif/else to evaluate student traits and assign their house.",
      codeExample: `bravery = 88
wisdom = 72

if bravery >= 80:
    house = "Gryffindor"
elif wisdom >= 80:
    house = "Ravenclaw"
else:
    house = "Hufflepuff"

print("Assigned to:", house)`,
    },
    loops: {
      vibe: "Automate stirring the Felix Felicis cauldron 50 times in a clockwise direction.",
      realWorldConnection: "Potion brewing requires repetitive clockwise stirs — loops repeat the action automatically.",
      codeExample: `for stir in range(1, 6):
    print(f"Stirring Felix Felicis... Turn {stir} ✨")`,
    },
    lists: {
      vibe: "Organize Harry's DADA Defense Against the Dark Arts spellbook list.",
      realWorldConnection: "Storing spell books and potion ingredients in a Python list keeps Hogwarts inventories organized.",
      codeExample: `spells = ["Lumos", "Alohomora", "Expecto Patronum"]
spells.append("Stupefy")

print("Known spells:", spells)`,
    },
    dictionaries: {
      vibe: "Manage Dumbledore's House Points tally dictionary.",
      realWorldConnection: "Looking up House Points by house name ('Gryffindor') requires a dictionary lookup.",
      codeExample: `house_points = {"Gryffindor": 450, "Slytherin": 420, "Ravenclaw": 390}
print("Gryffindor points:", house_points["Gryffindor"])`,
    },
    sets: {
      vibe: "Filter out duplicate curse owl reports in the Ministry of Magic.",
      realWorldConnection: "Sets eliminate duplicate owl telemetry reports automatically.",
      codeExample: `curse_reports = {"Curse_A", "Curse_B", "Curse_A"}
print("Unique curses:", curse_reports)`,
    },
    functions: {
      vibe: "Package reusable potion stir and incantation power calculations into magic functions.",
      realWorldConnection: "Defining a brewing function lets any wizard re-use complex magic logic anywhere.",
      codeExample: `def cast_patronus(happy_memory):
    return f"Expecto Patronum! Powered by {happy_memory}"

print(cast_patronus("Flying on Buckbeak"))`,
    },
    search: {
      vibe: "Find a specific dark magic scroll in the Hogwarts Restricted Section.",
      realWorldConnection: "Search algorithms locate rare magical artifacts in vast library scrolls.",
      codeExample: `library = ["Standard Spells", "Dark Curses", "Alchemy"]
found = "Dark Curses" in library
print("Found in Restricted Section:", found)`,
    },
    error: {
      vibe: "Handle explosive cauldron failures gracefully with try/except.",
      realWorldConnection: "When a potion fails, try/except prevents the entire dungeon from blowing up.",
      codeExample: `try:
    heat = 500
    if heat > 300:
        raise ValueError("Cauldron Overheat!")
except ValueError as e:
    print("Shield charm cast! 🛡️", e)`,
    },
    algorithms: {
      vibe: "Sort the House Cup leaderboard before Dumbledore awards the trophy.",
      realWorldConnection: "Algorithms sort House points from highest to lowest instantly.",
      codeExample: `scores = [420, 450, 390]
scores.sort(reverse=True)
print("Leaderboard:", scores)`,
    },
    files: {
      vibe: "Save Ministry of Magic secret archives to permanent scroll files.",
      realWorldConnection: "File I/O persists magical records across Hogwarts terms.",
      codeExample: `with open("scrolls.txt", "w") as f:
    f.write("Secret Spell Archive v1")`,
    },
  },

  marvel: {
    variables: {
      vibe: "Think like Tony Stark's AI engineer, tracking Mark 85 Arc Reactor voltage percentage.",
      realWorldConnection: "Tracking Arc Reactor output and repulsor battery levels requires named variables.",
      codeExample: `# J.A.R.V.I.S. Suit Status
armor_model = "Mark 85"
arc_reactor_pct = 98.5
status = "ONLINE"

print("Armor:", armor_model)
print("Power:", arc_reactor_pct, "%")`,
    },
    operators: {
      vibe: "Help J.A.R.V.I.S. calculate flight thruster force and repulsor power drain.",
      realWorldConnection: "Computing nanotech suit energy depletion requires Python operators.",
      codeExample: `max_power = 1000
thrust_cost = 250
shield_cost = 180

remaining = max_power - thrust_cost - shield_cost
print("Power remaining:", remaining)`,
    },
    strings: {
      vibe: "Configure J.A.R.V.I.S. voice alerts and Avengers Assembly broadcast messages.",
      realWorldConnection: "Suit HUD status updates and AI voice responses are strings.",
      codeExample: `hero = "Tony"
alert = f"J.A.R.V.I.S.: Welcome back Mr. {hero}. All systems nominal."
print(alert)`,
    },
    conditionals: {
      vibe: "Program Stark defense suit automated threat level protocols.",
      realWorldConnection: "Suit nanotech decides whether to deploy repulsors or shields using if/elif/else.",
      codeExample: `threat_level = 85

if threat_level > 80:
    weapon = "Nanotech Shield"
elif threat_level > 50:
    weapon = "Repulsor Beam"
else:
    weapon = "Scan Only"

print("Deployed:", weapon)`,
    },
    loops: {
      vibe: "Scan 100 Iron Man armor modules for subsystem damage.",
      realWorldConnection: "Scanning armor thruster arrays one by one is done in a loop.",
      codeExample: `modules = ["Helmet", "Chest", "Repulsor L", "Repulsor R"]
for m in modules:
    print(f"Scanning {m}... OK ✓")`,
    },
    lists: {
      vibe: "Maintain the Avengers active emergency team roster.",
      realWorldConnection: "Storing hero names in a list lets J.A.R.V.I.S. broadcast missions instantaneously.",
      codeExample: `avengers = ["Iron Man", "Thor", "Captain America"]
avengers.append("Spider-Man")

print("Active Avengers:", avengers)`,
    },
    dictionaries: {
      vibe: "Build J.A.R.V.I.S. weapon status telemetry lookup dictionary.",
      realWorldConnection: "Looking up weapon status by name ('unibeam') needs a dictionary.",
      codeExample: `suit_status = {"unibeam": "CHARGED", "thrusters": "ACTIVE"}
print("Unibeam status:", suit_status["unibeam"])`,
    },
    sets: {
      vibe: "Filter duplicate cosmic energy spikes from Wakanda vibranium sensors.",
      realWorldConnection: "Sets eliminate duplicate satellite energy readings automatically.",
      codeExample: `signals = {"Gamma_88", "Cosmic_X", "Gamma_88"}
print("Unique energy spikes:", signals)`,
    },
    functions: {
      vibe: "Package repulsor thrust and trajectory calculations into J.A.R.V.I.S. functions.",
      realWorldConnection: "Encapsulating flight telemetry calculations inside functions keeps suit AI fast.",
      codeExample: `def compute_thrust(mass, accel):
    return mass * accel

print("Flight thrust:", compute_thrust(85, 9.8))`,
    },
    search: {
      vibe: "Locate Infinity Stone energy signatures across planetary grids.",
      realWorldConnection: "Filtering cosmic radar scans locates hostiles instantly.",
      codeExample: `targets = ["Power Stone", "Space Stone", "Mind Stone"]
found = "Space Stone" in targets
print("Target locked:", found)`,
    },
    error: {
      vibe: "Handle power overload power surges without crashing J.A.R.V.I.S.",
      realWorldConnection: "Using try/except ensures suit AI re-routes power safely during an overload.",
      codeExample: `try:
    power_surge = 1200
    if power_surge > 1000:
        raise OverflowError("Arc Reactor Surge!")
except OverflowError as e:
    print("Diverting to heat sinks!", e)`,
    },
    algorithms: {
      vibe: "Sort gauntlet energy stability levels in ascending threat order.",
      realWorldConnection: "Sorting algorithms help Stark tech rank threat levels in milliseconds.",
      codeExample: `threats = [95, 40, 88, 12]
threats.sort(reverse=True)
print("Priority threat order:", threats)`,
    },
    files: {
      vibe: "Save J.A.R.V.I.S. telemetry logs to permanent Stark Cloud files.",
      realWorldConnection: "File storage saves suit performance logs across missions.",
      codeExample: `with open("jarvis_logs.json", "w") as f:
    f.write('{"mission": "Endgame", "status": "Success"}')`,
    },
  },

  anime: {
    variables: {
      vibe: "Think like a Shinobi Academy trainee tracking Naruto's Nine-Tails chakra reserves.",
      realWorldConnection: "Storing chakra points, stamina, and ninja rank requires named variables.",
      codeExample: `# Shinobi Status
ninja = "Naruto"
chakra_level = 9000
rank = "Genin"

print("Ninja:", ninja)
print("Chakra:", chakra_level)`,
    },
    operators: {
      vibe: "Calculate chakra consumption per shadow clone and jutsu stamina cost.",
      realWorldConnection: "Multiplying chakra cost by shadow clone count uses Python operators.",
      codeExample: `chakra_per_clone = 150
clones_wanted = 12

total_chakra = chakra_per_clone * clones_wanted
print("Chakra required:", total_chakra)`,
    },
    strings: {
      vibe: "Write jutsu incantations and Secret Leaf Scroll messages.",
      realWorldConnection: "Jutsu names like 'Rasengan' and secret scroll texts are strings.",
      codeExample: `jutsu = "Shadow Clone Jutsu"
user = "Naruto"

print(f"{user} invokes {jutsu}!")`,
    },
    conditionals: {
      vibe: "Determine Chunin exam promotion results based on chakra scores.",
      realWorldConnection: "Evaluating whether a shinobi advances uses if/elif/else.",
      codeExample: `chakra_score = 88

if chakra_score >= 85:
    rank = "Chunin"
elif chakra_score >= 60:
    rank = "Genin"
else:
    rank = "Academy Student"

print("Promoted to:", rank)`,
    },
    loops: {
      vibe: "Train 100 shadow clones simultaneously in parallel jutsu loops.",
      realWorldConnection: "Repeating physical training reps across all clones uses loops.",
      codeExample: `for clone in range(1, 6):
    print(f"Clone #{clone} practicing Rasengan... Complete! 🌀")`,
    },
    lists: {
      vibe: "Organize Squad 7's ninja scroll inventory.",
      realWorldConnection: "Keeping track of squad ninja weapons in a list makes preparation seamless.",
      codeExample: `squad_7 = ["Naruto", "Sasuke", "Sakura"]
squad_7.append("Kakashi-sensei")

print("Squad roster:", squad_7)`,
    },
    dictionaries: {
      vibe: "Build the Shinobi library Jutsu hand sign dictionary.",
      realWorldConnection: "Looking up hand sign requirements by Jutsu name uses dictionaries.",
      codeExample: `jutsu_dict = {"Rasengan": "Ram → Serpent", "Chidori": "Ox → Rabbit"}
print("Rasengan signs:", jutsu_dict["Rasengan"])`,
    },
    sets: {
      vibe: "Deduplicate wild dungeon rift monster radar pings.",
      realWorldConnection: "Sets eliminate duplicate monster radar detections automatically.",
      codeExample: `dungeon_monsters = {"Dragon_Rift", "Goblin_King", "Dragon_Rift"}
print("Unique beasts detected:", dungeon_monsters)`,
    },
    functions: {
      vibe: "Package secret Jutsu chakra multiplier logic into reusable functions.",
      realWorldConnection: "Functions allow any shinobi to trigger complex jutsu logic with one call.",
      codeExample: `def cast_shadow_clone(base_chakra, count):
    return f"Summoned {count} clones! Used {base_chakra * count} chakra."

print(cast_shadow_clone(100, 5))`,
    },
    search: {
      vibe: "Search the dungeon rift for S-Rank legendary monsters.",
      realWorldConnection: "Filter algorithms scan dungeon levels for high-value targets.",
      codeExample: `beasts = ["Rank-C Goblin", "Rank-S Dragon", "Rank-A Wolf"]
found = "Rank-S Dragon" in beasts
print("S-Rank Beast spotted:", found)`,
    },
    error: {
      vibe: "Handle chakra depletion exceptions cleanly during high-level battles.",
      realWorldConnection: "Catching chakra exhaustion with try/except prevents total collapse.",
      codeExample: `try:
    chakra = 10
    if chakra < 50:
        raise Exception("Chakra Depleted!")
except Exception as e:
    print("Wood clone substitution triggered! 🍃", e)`,
    },
    algorithms: {
      vibe: "Rank the Shinobi Guild leaderboard by combat power.",
      realWorldConnection: "Sorting algorithms order ninja ranks dynamically.",
      codeExample: `power_levels = [9500, 12000, 8800]
power_levels.sort(reverse=True)
print("Shinobi Rankings:", power_levels)`,
    },
    files: {
      vibe: "Save Secret Leaf Scroll scrolls to permanent archive files.",
      realWorldConnection: "File storage saves ninja clan scroll scrolls across generations.",
      codeExample: `with open("forbidden_scrolls.txt", "w") as f:
    f.write("Secret Shinobi Scrolls v1")`,
    },
  },
};

export function getThemedChapter(chapterId, theme) {
  const base = CHAPTERS_MAP[chapterId];
  if (!base) return null;
  if (!theme || theme === 'default' || !THEMED_CHAPTER_VARIANTS[theme]) {
    return base;
  }
  const variant = THEMED_CHAPTER_VARIANTS[theme][chapterId];
  if (!variant) return base;

  return {
    ...base,
    intro: {
      ...base.intro,
      vibe: variant.vibe || base.intro.vibe,
    },
    theory: {
      ...base.theory,
      realWorldConnection: variant.realWorldConnection || base.theory.realWorldConnection,
      codeExample: variant.codeExample || base.theory.codeExample,
    },
  };
}
