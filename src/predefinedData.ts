import { Lesson, QuizQuestion, GameModeChallenge, ProjectTemplate, DailyProblem } from './types';

export const CORE_INTERESTS = [
  { id: 'story', label: 'Storytelling World', icon: 'BookOpen', desc: 'Step into fantasy stories and interactive book character logic.' },
  { id: 'gaming', label: 'Gaming World', icon: 'Gamepad2', desc: 'Code car racers, coordinate grids, and live combat engines.' },
  { id: 'history', label: 'History World', icon: 'Milestone', desc: 'Control ancient legions, check treaty outcomes, and trace empires.' },
  { id: 'geography', label: 'Geography World', icon: 'Globe', desc: 'Explore world maps, dictionary coordinates, and population stats.' },
  { id: 'physics', label: 'Physics World', icon: 'Rocket', desc: 'Calculate forces, object gravity, speeds, and coordinates.' },
  { id: 'economic', label: 'Economics World', icon: 'TrendingUp', desc: 'Settle balance sheets, predict supply curves, and tax rates.' },
  { id: 'music', label: 'Music World', icon: 'Music', desc: 'Manipulate beat tempos, rhythm patterns, and frequency ranges.' },
  { id: 'civics', label: 'Civics World', icon: 'ShieldCheck', desc: 'Model democratic voting logic, legislative thresholds, and veto checks.' },
];

export const OFFLINE_LESSONS: Lesson[] = [
  // --- BEGINNER LESSONS ---
  {
    id: 'beg_var_gaming',
    title: 'Creating Minecraft Blocks with Variables',
    concept: 'Variables & Data Types',
    level: 'beginner',
    scenario: 'gaming',
    explanation: `### Variables in Minecraft
In Minecraft, every item in your inventory, block on the ground, or mob in the world has properties. In Python, we use **variables** to store these values.

A variable is like a chest with a label on it. You can place different items inside and change them whenever you want!

\`\`\`python
# Storing player stats in variables
player_name = "Alex"      # This is a String (text)
health_points = 20        # This is an Integer (whole number)
is_creative_mode = False  # This is a Boolean (True/False)
mining_speed = 4.5        # This is a Float (decimal number)
\`\`\`

#### Data Types Cheat Sheet:
1. **String (\`str\`)**: Wrapped in quotes, e.g. \`"Steve"\` or \`"Iron Block"\`.
2. **Integer (\`int\`)**: Whole numbers, e.g., \`64\`.
3. **Float (\`float\`)**: Decimal numbers, e.g., \`1.25\`.
4. **Boolean (\`bool\`)**: Either \`True\` or \`False\`.`,
    codeExample: `block_type = "Diamond Ore"
quantity = 64
is_rare = True

print("Block Name:", block_type)
print("Quantity:", quantity)
print("Is it rare?", is_rare)`,
    interactiveChallenge: {
      instruction: 'Create a variable named `steve_health` set to 20, and `has_diamond_sword` set to True. Then print both.',
      template: `# Define your Minecraft stats here!\nsteve_health = \nhas_diamond_sword = \n\n# Print the variables\nprint(steve_health)\nprint(has_diamond_sword)`,
      expectedOutputContains: ['20', 'True']
    }
  },
  {
    id: 'beg_var_books',
    title: 'Casting Spells with String Variables',
    concept: 'Variables & Data Types',
    level: 'beginner',
    scenario: 'books',
    explanation: `### Magic of Python Variables
In the world of Harry Potter, spells require the correct incantation and wand movement. In programming, we store these incantations inside **String variables**.

A variable is a labeled container. For example, we can store Harry's wand type or a spell inside variables:

\`\`\`python
wand_wood = "Holly"
wand_core = "Phoenix Feather"
spell_name = "Expecto Patronum"
\`\`\`

We can join strings together using the \`+\` operator. This is called **string concatenation**!
\`\`\`python
full_wand = wand_wood + " with a " + wand_core
# Result: "Holly with a Phoenix Feather"
\`\`\``,
    codeExample: `wizard_name = "Harry Potter"
house = "Gryffindor"
spell = "Expelliarmus"

print(wizard_name + " belongs to " + house + "!")
print("He casts " + spell + "!")`,
    interactiveChallenge: {
      instruction: 'Create a variable `patronus_animal` set to "Stag" and print the message: "Harry casts Expecto Patronum and a Stag appears!" by concatenating the variable.',
      template: `patronus_animal = "Stag"\n# Print the magical message using concatenation (+)\nprint("Harry casts Expecto Patronum and a " + patronus_animal + " appears!")`,
      expectedOutputContains: ['Harry casts Expecto Patronum and a Stag appears!']
    }
  },
  {
    id: 'beg_var_business',
    title: 'Assets and Liabilities in Rich Dad Poor Dad',
    concept: 'Variables & Data Types',
    level: 'beginner',
    scenario: 'business',
    explanation: `### Financial Literacy with Variables
In "Rich Dad Poor Dad" by Robert Kiyosaki, the fundamental lesson is the difference between an **Asset** (something that puts money *into* your pocket) and a **Liability** (something that takes money *out* of your pocket).

Let's model Robert's income statement using Python variables!

\`\`\`python
# Assets (Income-generating)
real_estate_income = 5000
stock_dividends = 1200

# Liabilities (Expenses)
mortgage_payment = 2000
car_loan = 450
\`\`\`

Python can perform calculations instantly using operators:
- \`+\` (addition)
- \`-\` (subtraction)
- \`*\` (multiplication)
- \`/\` (division)`,
    codeExample: `asset_flow = 5000 + 1200
liability_flow = 2000 + 450
net_cash_flow = asset_flow - liability_flow

print("Total Asset Income:", asset_flow)
print("Total Liabilities:", liability_flow)
print("Monthly Cash Flow:", net_cash_flow)`,
    interactiveChallenge: {
      instruction: 'Define variables `passive_income` with a value of 3500 and `living_expenses` with a value of 2000. Calculate `savings` by subtracting expenses from passive income and print it.',
      template: `passive_income = 3500\nliving_expenses = 2000\n\n# Calculate and print savings\nsavings = \nprint(savings)`,
      expectedOutputContains: ['1500']
    }
  },
  {
    id: 'beg_var_sports',
    title: 'Scoreboard Variables for a Football Match',
    concept: 'Variables & Data Types',
    level: 'beginner',
    scenario: 'sports',
    explanation: `### Managing Game Scores with Variables
Imagine you are building a scoreboard app for the FIFA World Cup. You need to keep track of team names, goals scored, match minutes, and whether the game is in extra time.

Variables are perfect for this because their values can be updated as the match progresses!

\`\`\`python
home_team = "Real Madrid"
away_team = "Barcelona"

home_goals = 0
away_goals = 0
\`\`\`

To add a goal to a score, we can overwrite the variable with its new value:
\`\`\`python
home_goals = home_goals + 1  # Home team scores!
# Shortcut: home_goals += 1
\`\`\``,
    codeExample: `home_team = "Arsenal"
away_team = "Chelsea"
home_goals = 1
away_goals = 2

# Chelsea scores again!
away_goals += 1

print(home_team, "vs", away_team)
print("Current Score:", home_goals, "-", away_goals)`,
    interactiveChallenge: {
      instruction: 'Set `team_a_score` to 2 and `team_b_score` to 1. Chelsea (Team B) scores! Add 1 goal to `team_b_score` using `+=` or re-assignment, and print `team_b_score`.',
      template: `team_a_score = 2\nteam_b_score = 1\n\n# Update Team B score by adding 1\n\n\n# Print score\nprint(team_b_score)`,
      expectedOutputContains: ['2']
    }
  },

  // --- INTERMEDIATE LESSONS ---
  {
    id: 'int_cond_gaming',
    title: 'Crafting Rules and Inventory Checks',
    concept: 'Conditions (if-else)',
    level: 'intermediate',
    scenario: 'gaming',
    explanation: `### Making Decisions in Python
In Minecraft, you can't craft a Diamond Pickaxe unless you have at least 3 diamonds and 2 sticks in your inventory. In programming, we handle these rules using **Conditions (if-else)**!

Python uses comparison operators to evaluate checks:
- \`>\` (Greater than)
- \`<\` (Less than)
- \`==\` (Equal to)
- \`>=\` (Greater than or equal to)
- \`and\`, \`or\`, \`not\` (Logical gates)

\`\`\`python
diamonds = 5
sticks = 1

if diamonds >= 3 and sticks >= 2:
    print("Crafting Diamond Pickaxe!")
else:
    print("Insufficient materials! Go back to mining.")
\`\`\`

*Note: Indentation (4 spaces) is required for code inside an \`if\` or \`else\` block in Python!*`,
    codeExample: `player_health = 5
hunger_level = 18

if player_health < 10:
    print("Warning: Health low! Eat a golden apple.")
elif hunger_level < 5:
    print("Starving! Mining speed reduced.")
else:
    print("Steve is fully healthy!")`,
    interactiveChallenge: {
      instruction: 'Write an if-else statement. If `creeper_distance` is less than 5, print "RUN! CREEPER SIZZLING!". Otherwise, print "Safe for now."',
      template: `creeper_distance = 3\n\n# Check if creeper is too close (less than 5)\n`,
      expectedOutputContains: ['RUN! CREEPER SIZZLING!']
    }
  },
  {
    id: 'int_cond_books',
    title: 'Sorting Hat Logic',
    concept: 'Conditions (if-else)',
    level: 'intermediate',
    scenario: 'books',
    explanation: `### Sorting Students into Hogwarts Houses
The Sorting Hat decides a student's house by examining their dominant traits. Brave students go to Gryffindor, clever ones to Ravenclaw, loyal ones to Hufflepuff, and ambitious ones to Slytherin.

In Python, we can write this decision path using \`if\`, \`elif\` (else-if), and \`else\`.

\`\`\`python
trait = "loyalty"

if trait == "bravery":
    print("GRYFFINDOR!")
elif trait == "cleverness":
    print("RAVENCLAW!")
elif trait == "loyalty":
    print("HUFFLEPUFF!")
else:
    print("SLYTHERIN!")
\`\`\``,
    codeExample: `has_wand = True
age = 11

if age >= 11 and has_wand:
    print("Welcome to Hogwarts!")
else:
    print("You are a Muggle!")`,
    interactiveChallenge: {
      instruction: 'Complete the condition so that if `courage_score` is greater than 80, the Hat prints "Gryffindor Chosen", else it prints "Try another house".',
      template: `courage_score = 95\n\n# Add your conditional code here\n`,
      expectedOutputContains: ['Gryffindor Chosen']
    }
  },
  {
    id: 'int_loop_gaming',
    title: 'Automating Cobblestone Bridges with Loops',
    concept: 'Loops (for/while)',
    level: 'intermediate',
    scenario: 'gaming',
    explanation: `### Repeating Tasks Effortlessly
Imagine you want to build a long cobblestone path. Instead of writing \`place_block()\` 10 times, you can automate it using a **for loop**!

Loops let us repeat code multiple times. In Python, we use the \`range()\` function to repeat a specific number of times.

\`\`\`python
# Place blocks 5 times
for i in range(5):
    print("Placed Cobblestone Block #", i + 1)
\`\`\`

We can also loop through items in a inventory (List):
\`\`\`python
inventory = ["Stone", "Coal", "Torch", "Sword"]
for item in inventory:
    print("Item in chest:", item)
\`\`\``,
    codeExample: `mined_blocks = 0
# A while loop runs as long as the condition is True
while mined_blocks < 4:
    mined_blocks += 1
    print("Steve mined a block. Total mined:", mined_blocks)`,
    interactiveChallenge: {
      instruction: 'Use a for loop and `range(3)` to print "Smelting Iron Ore..." 3 times.',
      template: `# Print Smelting Iron Ore... 3 times using a for loop\n`,
      expectedOutputContains: ['Smelting Iron Ore...', 'Smelting Iron Ore...', 'Smelting Iron Ore...']
    }
  },

  // --- ADVANCED LESSONS ---
  {
    id: 'adv_oop_gaming',
    title: 'Creating Mob Classes in Minecraft',
    concept: 'Object-Oriented Programming',
    level: 'advanced',
    scenario: 'gaming',
    explanation: `### Thinking in Objects (OOP)
In Minecraft, Creepers, Zombies, and Skeletons are all "Mobs". They share traits like position, health, and speed, but behave differently. In Python, we can model this using **Object-Oriented Programming (OOP)**!

We define a **Class** as a blueprint, and then create individual **Objects** (instances) from it.

\`\`\`python
class Mob:
    # Constructor initializes attributes
    def __init__(self, name, hp, attack_damage):
        self.name = name
        self.hp = hp
        self.attack_damage = attack_damage

    # Method representing an action
    def attack(self, target_name):
        print(self.name + " attacks " + target_name + " dealing " + str(self.attack_damage) + " damage!")
\`\`\`

Creating and using an object:
\`\`\`python
zombie = Mob("Zombie", 20, 3)
zombie.attack("Steve")
# Output: "Zombie attacks Steve dealing 3 damage!"
\`\`\``,
    codeExample: `class Item:
    def __init__(self, name, max_stack):
        self.name = name
        self.max_stack = max_stack

    def info(self):
        print("Item:", self.name, "| Max Stack Size:", self.max_stack)

torch = Item("Torch", 64)
torch.info()`,
    interactiveChallenge: {
      instruction: 'Create a Class named `Pet` with constructor `__init__(self, name)` that stores `self.name = name`. Add a method `bark(self)` that prints "Woof! My name is [name]". Create an instance named `dog` with name "Barky" and call `dog.bark()`.',
      template: `class Pet:\n    # Define init and bark here\n\n\n# Create instance and test\n`,
      expectedOutputContains: ['Woof!', 'Barky']
    }
  },
  {
    id: 'beg_var_history',
    title: 'Tracking Roman Legions with Integer Variables',
    concept: 'Variables & Data Types',
    level: 'beginner',
    scenario: 'history',
    explanation: `### Roman Cohorts as Python Variables
In Ancient Rome, commanders kept track of the Republic's military strength using rigorous ledger records. In Python, we do exactly the same using **Variables**!

A variable is like a message scroll containing a specific value.

\`\`\`python
emperor_name = "Julius Caesar"  # This is a String (text)
legion_id = 13                 # This is an Integer (whole number)
is_republic = True             # This is a Boolean (True/False)
reign_years = 5.5              # This is a Float (decimal number)
\`\`\`

Python allows you to increment variables as military units gather:
\`\`\`python
soldiers_count = 5000
soldiers_count += 800  # Reinforcements have arrived!
\`\`\``,
    codeExample: `emperor = "Augustus"
cohorts = 10
soldiers_per_cohort = 480
total_strength = cohorts * soldiers_per_cohort

print("Emperor:", emperor)
print("Total soldiers in command:", total_strength)`,
    interactiveChallenge: {
      instruction: 'Define variables `legion_name` with a value of "Legio X Equestris" and `legion_size` with a value of 6000. Print the legion size.',
      template: `legion_name = \nlegion_size = \n\n# Print legion_size\nprint(legion_size)`,
      expectedOutputContains: ['6000']
    }
  },
  {
    id: 'beg_var_civics',
    title: 'Democracy Voters & Ballot Boxes',
    concept: 'Variables & Data Types',
    level: 'beginner',
    scenario: 'civics',
    explanation: `### Modelling Civic Booths with Variables
In democratic governance, keeping track of votes, legislative bills, and quorum levels is essential. We store these numbers in **Variables**!

Think of a variable as a ballot box with a label representing a candidate or option.

\`\`\`python
bill_name = "Clean Energy Accord" # String representing the proposal
yes_votes = 218                    # Integer count of approval votes
no_votes = 197                     # Integer count of disapproval votes
is_passed = True                   # Boolean showing if bill enacted
\`\`\``,
    codeExample: `required_quorum = 200
voters_checked_in = 345

if voters_checked_in >= required_quorum:
    print("Quorum met. Assembly is active!")
else:
    print("Under-quorum! Postponing legislation.")`,
    interactiveChallenge: {
      instruction: 'Create a variable `registered_voters` with value 15000 and `turnout_percentage` with value 0.72. Print both.',
      template: `registered_voters = \nturnout_percentage = \n\nprint(registered_voters)\nprint(turnout_percentage)`,
      expectedOutputContains: ['15000', '0.72']
    }
  },
  {
    id: 'beg_var_economic',
    title: 'GDP calculation and Consumer Surplus',
    concept: 'Variables & Data Types',
    level: 'beginner',
    scenario: 'economic',
    explanation: `### Economic Indicators as Variables
In macroeconomic models, tracking metrics like gross domestic product (GDP), national inflation, consumer spending, and treasury interest is paramount.

We represent these financial entries as variables:

\`\`\`python
country = "Switzerland"
capital_spending = 450000000   # Integer
inflation_rate = 0.024         # Float
trade_surplus = True           # Boolean
\`\`\``,
    codeExample: `consumption = 3000
investment = 1200
government_spending = 1500
net_exports = 300

gdp = consumption + investment + government_spending + net_exports
print("Calculated GDP Result:", gdp)`,
    interactiveChallenge: {
      instruction: 'Define `market_supply` with value 800 and `market_demand` with value 950. Compute `shortage` by subtracting supply from demand and print it.',
      template: `market_supply = 800\nmarket_demand = 950\n\n# Calculate shortage\nshortage = \nprint(shortage)`,
      expectedOutputContains: ['150']
    }
  },
  {
    id: 'beg_var_story',
    title: 'Assembling Mythological Dialogue Strings',
    concept: 'Variables & Data Types',
    level: 'beginner',
    scenario: 'story',
    explanation: `### Lore-building & Character Prologs
In epic myths and narrative stories, characters speak, quests open up, and dialogue strings combine. We store names and magical titles in **String variables**.

We use the \`+\` operator to join strings together!

\`\`\`python
hero_name = "Odysseus"
title = "The Wanderer"
full_intro = hero_name + " " + title
# Result: "Odysseus The Wanderer"
\`\`\``,
    codeExample: `deity = "Zeus"
weapon = "Thunderbolt"
print(deity + " grips the sacred " + weapon + "!")`,
    interactiveChallenge: {
      instruction: 'Create a variable `beast_name` set to "Minotaur" and print: "Beware the Minotaur!" using concatenation.',
      template: `beast_name = "Minotaur"\n# Print message\nprint("Beware the " + beast_name + "!")`,
      expectedOutputContains: ['Beware the Minotaur!']
    }
  },
  {
    id: 'beg_var_games',
    title: 'Retro Arcade Coordinate & Score Registries',
    concept: 'Variables & Data Types',
    level: 'beginner',
    scenario: 'games',
    explanation: `### Classic Arcade Metrics
To build games, we must track continuous metrics like player scores, high-score benchmarks, X/Y screen coordinates, and active life counters.

\`\`\`python
player_score = 98200
lives_remaining = 3
ufo_speed_x = -4.5
is_game_over = False
\`\`\``,
    codeExample: `base_points = 100
multiplier = 3
score_bonus = base_points * multiplier
print("UFO Blast Score:", score_bonus)`,
    interactiveChallenge: {
      instruction: 'Initialize `bullets_count` with value 30. Subtract 5 bullets and print the new count.',
      template: `bullets_count = 30\n# Subtract 5 bullets\n\nprint(bullets_count)`,
      expectedOutputContains: ['25']
    }
  }
];

export const OFFLINE_QUIZZES: QuizQuestion[] = [
  {
    id: 'quiz_1',
    type: 'mcq',
    concept: 'Variables & Data Types',
    question: 'In Python, which of the following is a valid variable name?',
    options: ['2player_health', 'player_health', 'player-health', 'class'],
    correctAnswer: 'player_health',
    explanation: 'Variable names cannot start with numbers, cannot contain hyphens (-), and cannot use reserved keyword like `class`. Underscores are valid.'
  },
  {
    id: 'quiz_2',
    type: 'fill_blank',
    concept: 'Variables & Data Types',
    question: 'Fill in the blank to convert the string "64" into an integer: stack_size = ____("64")',
    correctAnswer: 'int',
    explanation: 'The `int()` function converts strings or decimal floats into integers in Python.'
  },
  {
    id: 'quiz_3',
    type: 'predict_output',
    concept: 'Conditions (if-else)',
    question: 'What will be the output of this code?',
    codeContext: `diamonds = 4\nif diamonds >= 5:\n    print("Craft Bow")\nelif diamonds >= 3:\n    print("Craft Sword")\nelse:\n    print("Mine More")`,
    options: ['Craft Bow', 'Craft Sword', 'Mine More', 'Error'],
    correctAnswer: 'Craft Sword',
    explanation: 'Since diamonds is 4, the first if condition (4 >= 5) is False. The elif (4 >= 3) is True, so it prints "Craft Sword".'
  },
  {
    id: 'quiz_4',
    type: 'debug',
    concept: 'Loops (for/while)',
    question: 'Find and fix the syntax error in this loop block:',
    codeContext: `for i in range(5)\n    print("Loop iteration:", i)`,
    correctAnswer: 'for i in range(5):',
    explanation: 'In Python, a colon (:) is required at the end of loop declarations, if conditions, and function definitions.'
  },
  {
    id: 'quiz_history_1',
    type: 'predict_output',
    concept: 'Variables & Data Types',
    question: 'What is the computed output of this legion strength script?',
    codeContext: `legionnaires = 5000\nauxiliaries = 1200\nreinforcements = 300\ntotal_army = legionnaires + auxiliaries + reinforcements\nprint(total_army)`,
    options: ['5000', '6200', '6500', '6850'],
    correctAnswer: '6500',
    explanation: 'Simple arithmetic: 5000 + 1200 is 6200, plus 300 reinforcements yields 6500 soldiers total.'
  },
  {
    id: 'quiz_civics_1',
    type: 'fill_blank',
    concept: 'Conditions (if-else)',
    question: 'Complete the check to verify if the bill passes with over 50% approval out of 435 votes (i.e. at least 218): if votes_yes ____ 218:',
    correctAnswer: '>=',
    explanation: 'To pass, votes_yes must be greater than or equal to (>=) 218.'
  },
  {
    id: 'quiz_economic_1',
    type: 'mcq',
    concept: 'Variables & Data Types',
    question: 'Which comparison expression correctly checks if a nation is running a Trade Deficit (where imports are greater than exports)?',
    options: ['imports > exports', 'imports == exports', 'imports < exports', 'imports + exports'],
    correctAnswer: 'imports > exports',
    explanation: 'A Trade Deficit occurs when a country imports more than it exports, so imports > exports is True.'
  },
  {
    id: 'quiz_story_1',
    type: 'debug',
    concept: 'Operators & Strings',
    question: 'Correct the syntax issue in this story prologue snippet:',
    codeContext: `title = "Odysseus" + " " "The Cunning"`,
    correctAnswer: 'title = "Odysseus" + " " + "The Cunning"',
    explanation: 'To concatenate multiple strings, you must specify the plus (+) operator between each string piece.'
  },
  {
    id: 'quiz_retro_games_1',
    type: 'predict_output',
    concept: 'Conditions (if-else)',
    question: 'What will be printed when a player earns a score of 12000 points?',
    codeContext: `score = 12000\nif score >= 10000:\n    print("Grand Champion")\nelif score >= 5000:\n    print("Expert Shooter")\nelse:\n    print("Recruit")`,
    options: ['Recruit', 'Expert Shooter', 'Grand Champion', 'Error'],
    correctAnswer: 'Grand Champion',
    explanation: 'Since 12000 is greater than 10000, the first condition is met, so "Grand Champion" is printed.'
  }
];

export const GAME_CHALLENGES: GameModeChallenge[] = [
  {
    id: 'game_fix_1',
    mode: 'fix_the_code',
    title: 'Fix the Creeper Alarm',
    description: 'The automated alarms are broken! Fix the indentation error and missing colon so our defensive systems can spot the incoming creepers.',
    starterCode: `creeper_detected = True\nif creeper_detected\nprint("ALERT: Sizzling detected!")`,
    solutionCode: `creeper_detected = True\nif creeper_detected:\n    print("ALERT: Sizzling detected!")`,
    expectedOutput: 'ALERT: Sizzling detected!',
    hint: 'Add a colon (:) after the condition and indent the print line by 4 spaces.'
  },
  {
    id: 'game_puzzle_1',
    mode: 'code_puzzle',
    title: 'Hogwarts Spell Assembler',
    description: 'Help Harry sort Gryffindor house points! Arrange the pieces below to check if Gryffindor points exceed 100.',
    starterCode: `# Assemble checking logic\ngryffindor_points = 120\n\n[Block A]: if gryffindor_points > 100:\n[Block B]:     print("Gryffindor Wins!")\n[Block C]: else:\n[Block D]:     print("Keep Studying")`,
    options: ['A, B, C, D', 'A, C, B, D', 'C, D, A, B'],
    correctAnswer: 'A, B, C, D',
    hint: 'If condition (A) must precede its block (B), then the else branch (C) followed by its body (D).'
  },
  {
    id: 'game_treasure_1',
    mode: 'treasure_hunt',
    title: 'Rich Dad’s Cash Flow Safe',
    description: 'A secret safe containing high-yield investment secrets requires the correct code! Calculate the final `cash_flow` output to crack it.',
    starterCode: `salary = 5000\nrental_income = 1500\nexpenses = 3000\ncash_flow = (salary + rental_income) - expenses\n# Safe Code is the print result!`,
    expectedOutput: '3500',
    hint: 'Add 5000 and 1500 to get 6500, then subtract 3000.'
  },
  {
    id: 'game_boss_1',
    mode: 'boss_fight',
    title: 'Ender Dragon Final Blow',
    description: 'The Ender Dragon has 50 HP left! Define a function `strike()` that returns the remaining dragon health after a hit of 50 damage.',
    starterCode: `dragon_hp = 50\ndef strike(hp):\n    # Return HP after taking 50 damage\n    pass\n\nprint(strike(dragon_hp))`,
    solutionCode: `dragon_hp = 50\ndef strike(hp):\n    return hp - 50\n\nprint(strike(dragon_hp))`,
    expectedOutput: '0',
    hint: 'Complete the strike function to return hp - 50.'
  },
  {
    id: 'game_civics_1',
    mode: 'fix_the_code',
    title: 'Enact the Constitutional Amendment',
    description: 'A historic legislative bill needs approval! Fix the condition check so that it prints "Passed" only if yes_votes is greater than or equal to 290 (the 2/3 supermajority).',
    starterCode: `yes_votes = 300\nif yes_votes >= 290:\nprint("Passed")`,
    solutionCode: `yes_votes = 300\nif yes_votes >= 290:\n    print("Passed")`,
    expectedOutput: 'Passed',
    hint: 'Indent the print line by 4 spaces under the if condition.'
  },
  {
    id: 'game_economic_1',
    mode: 'treasure_hunt',
    title: 'Compound Trade Dividend Yield',
    description: 'Calculate the cumulative cash flow reserves after 3 years of trade surpluses! Find the printed amount of the compounding loop.',
    starterCode: `balance = 1000\nfor year in range(3):\n    balance += 100\nprint(balance)`,
    expectedOutput: '1300',
    hint: '1000 + 100 + 100 + 100 equals 1300.'
  },
  {
    id: 'game_history_1',
    mode: 'code_puzzle',
    title: 'Legio X Army Command Assembly',
    description: 'Arrange the conditional commands correctly to check if Augustus has enough legions to guard the borders of the Empire.',
    starterCode: `legions = 28\n\n[Block A]: if legions >= 25:\n[Block B]:     print("Borders Safe")\n[Block C]: else:\n[Block D]:     print("Send Envoys")`,
    options: ['A, B, C, D', 'A, C, B, D', 'C, D, A, B'],
    correctAnswer: 'A, B, C, D',
    hint: 'The if statement block (A) precedes its body (B), followed by the else branch (C) and its body (D).'
  },
  {
    id: 'game_story_1',
    mode: 'fix_the_code',
    title: 'Assemble the Prophecy of the Oracle',
    description: 'The ancient mythological scroll is fragmented! Fix the syntax error in the oracle\'s string concatenation so it compiles.',
    starterCode: `oracle_says = "The " + "hero" + " shall return"\nprint(oracle_says)`,
    solutionCode: `oracle_says = "The " + "hero" + " shall return"\nprint(oracle_says)`,
    expectedOutput: 'The hero shall return',
    hint: 'Make sure the print statement prints oracle_says exactly.'
  }
];

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'proj_calc',
    title: 'Text-Based Magic Calculator',
    description: 'Build a calculator that handles addition, subtraction, and multiplication in Python. Perfect for potion-brewing measurements!',
    steps: [
      {
        instruction: 'Step 1: Declare two variables `a` and `b` with values `15` and `5`.',
        starterCode: `# Declare a and b\n`,
        solutionKeyword: 'a = 15'
      },
      {
        instruction: 'Step 2: Create a function `add_numbers(x, y)` that returns their sum.',
        starterCode: `# Write the add function\ndef `,
        solutionKeyword: 'return x + y'
      }
    ]
  },
  {
    id: 'proj_snake',
    title: 'Classic Arcade Score Keeper',
    description: 'Build a game state tracking machine that keeps a highscore list, updates streaks, and unlocks level metrics.',
    steps: [
      {
        instruction: 'Step 1: Initialize a list named `scores` with values `10`, `50`, and `120`.',
        starterCode: `scores = `,
        solutionKeyword: 'scores = [10, 50, 120]'
      },
      {
        instruction: 'Step 2: Add a new score of `200` to the list using `.append()`.',
        starterCode: `# Append highscore\n`,
        solutionKeyword: 'scores.append(200)'
      }
    ]
  },
  {
    id: 'proj_history',
    title: 'Imperial Dynasty Timeline Synthesizer',
    description: 'Assemble an automated historical timeline registry using Python lists and dictionary databases!',
    steps: [
      {
        instruction: 'Step 1: Initialize a timeline dictionary `dynasties` mapping "Han" to 206 and "Tang" to 618.',
        starterCode: `dynasties = `,
        solutionKeyword: 'dynasties = {"Han": 206, "Tang": 618}'
      },
      {
        instruction: 'Step 2: Print the start year of Han dynasty using the key "Han".',
        starterCode: `print(`,
        solutionKeyword: 'dynasties["Han"]'
      }
    ]
  },
  {
    id: 'proj_civics',
    title: 'AI Veto Power and Constitution Checker',
    description: 'Build a legislative voting check simulator that handles representative quorums and executive vetoes.',
    steps: [
      {
        instruction: 'Step 1: Initialize `vetoed` to `False` and `votes` to `240`.',
        starterCode: `vetoed = \nvotes = `,
        solutionKeyword: 'vetoed = False'
      },
      {
        instruction: 'Step 2: Write an if statement to print "Passed" if not vetoed and votes >= 218.',
        starterCode: `if not vetoed and votes >= 218:\n    print(`,
        solutionKeyword: 'Passed'
      }
    ]
  },
  {
    id: 'proj_economic',
    title: 'Forex Market & Asset Compounder Sim',
    description: 'Build an algorithmic asset growth calculator that projects compound interest gains and tracks cash flow deficits.',
    steps: [
      {
        instruction: 'Step 1: Initialize `capital` with `5000` and `yield_rate` with `1.08`.',
        starterCode: `capital = \nyield_rate = `,
        solutionKeyword: 'capital = 5000'
      },
      {
        instruction: 'Step 2: Use a for loop of `range(5)` to grow the capital by multiplying by yield_rate.',
        starterCode: `for year in range(5):\n    `,
        solutionKeyword: 'capital = capital * yield_rate'
      }
    ]
  },
  {
    id: 'proj_story',
    title: 'Mythological Quest Choose-Your-Path Engine',
    description: 'Construct an interactive choose-your-own-adventure lore terminal using strings, inputs, and conditional branches.',
    steps: [
      {
        instruction: 'Step 1: Initialize a list `choices` with "fight" and "flee".',
        starterCode: `choices = `,
        solutionKeyword: 'choices = ["fight", "flee"]'
      },
      {
        instruction: 'Step 2: Add "negotiate" to the list of choices using `.append()`.',
        starterCode: `choices.`,
        solutionKeyword: 'append'
      }
    ]
  }
];

export const DAILY_PROBLEMS: DailyProblem[] = [
  {
    no: 1,
    title: 'Even or Odd Number Checker',
    concept: 'Conditions (if-else)',
    difficulty: 'easy',
    description: 'Create a program that checks if the variable `num` is even or odd. If it is even, print "Even Number". Otherwise, print "Odd Number". Try it with `num = 14`.',
    starterCode: `# Check if num is even or odd\nnum = 14\n\nif num % 2 == 0:\n    print("Even Number")\nelse:\n    print("Odd Number")`,
    expectedOutputContains: ['Even Number'],
    xpReward: 50
  },
  {
    no: 2,
    title: 'Sum of Ledger Transactions',
    concept: 'Loops (for/while)',
    difficulty: 'medium',
    description: 'Write a loop to calculate the sum of numbers in the list `ledger = [10.5, 4.5, 5.0]`. Save the sum in a variable `total` and print it (should be 20.0).',
    starterCode: `# Calculate total sum\nledger = [10.5, 4.5, 5.0]\ntotal = 0\n\n# Loop over ledger list\nfor price in ledger:\n    total += price\n\nprint(total)`,
    expectedOutputContains: ['20.0'],
    xpReward: 70
  },
  {
    no: 3,
    title: 'Chanting a Magical Incantation',
    concept: 'Variables & Operators',
    difficulty: 'easy',
    description: 'Use the multiplication operator `*` to repeat the string variable `spell = "Victory!"` exactly 3 times separated by spaces, and print the resulting string: "Victory! Victory! Victory!".',
    starterCode: `# Chant the spell\nspell = "Victory!"\n\n# Print spell repeated 3 times with spaces\nprint(" ".join([spell] * 3))`,
    expectedOutputContains: ['Victory! Victory! Victory!'],
    xpReward: 40
  },
  {
    no: 4,
    title: 'Filtering Royal Scholars',
    concept: 'Lists & Dictionaries',
    difficulty: 'medium',
    description: 'Iterate through the list of student grades `scores = [85, 42, 90, 55, 78]` and print only the grades that are greater than or equal to 75.',
    starterCode: `# Filter and print passing scores >= 75\nscores = [85, 42, 90, 55, 78]\n\nfor score in scores:\n    if score >= 75:\n        print(score)`,
    expectedOutputContains: ['85', '90', '78'],
    xpReward: 80
  },
  {
    no: 5,
    title: 'Power of the Base Wizard',
    concept: 'Functions & Modules',
    difficulty: 'hard',
    description: 'Define a function `square(x)` that returns the squared value of `x`. Then call the function with the argument `8` and print the result (should print 64).',
    starterCode: `# Define a square function and print square(8)\ndef square(x):\n    return x * x\n\nprint(square(8))`,
    expectedOutputContains: ['64'],
    xpReward: 100
  }
];
