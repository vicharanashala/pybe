import { Lesson, LearningLevel } from '../types';

export function getCustomOfflineLesson(concept: string, level: LearningLevel, scenario: string): Lesson {
  const isStory = scenario === 'books' || scenario === 'history' || scenario === 'story';
  const isEconomic = scenario === 'business' || scenario === 'economic';
  const isGeography = scenario === 'geography' || scenario === 'civics';
  const isGaming = scenario === 'gaming' || scenario === 'sports' || scenario === 'space' || scenario === 'games';

  let title = `Mastering ${concept}`;
  let explanation = '';
  let codeExample = '';
  let instruction = '';
  let template = '';
  let expectedOutputContains: string[] = [];

  // 1. VARIABLES & DATA TYPES
  if (concept.includes('Variables')) {
    if (isStory) {
      title = "Character Records with Story Variables";
      explanation = `### Story Learning Mode: Characters as Variables
In interactive stories, every hero has a name, age, and a set of magical items. In Python, we use **Variables** to store these records!

Think of a variable as a labeled storage trunk in Hogwarts. You can place different labels on it, and store magical values inside.

\`\`\`python
character_name = "Harry Potter"  # String (text)
wizard_age = 11                 # Integer (whole number)
wand_length = 11.5              # Float (decimal number)
is_gryffindor = True            # Boolean (True/False)
\`\`\`

Whenever you reference \`character_name\`, Python opens the trunk and retrieves \`"Harry Potter"\`!`;
      codeExample = `hero = "Frodo"
ring_count = 1
is_invisible = False

print("Hero name:", hero)
print("Rings owned:", ring_count)
print("Is invisible?", is_invisible)`;
      instruction = "Create a variable named `hero_name` set to \"Arthur\" and `sword_power` set to 150. Then print both values.";
      template = `# Declare your story variables\nhero_name = \nsword_power = \n\nprint(hero_name)\nprint(sword_power)`;
      expectedOutputContains = ["Arthur", "150"];
    } else if (isEconomic) {
      title = "Accounting Assets with Economic Variables";
      explanation = `### Economic Mode: Ledgers as Variables
In finance and accounting, we track our balance sheet using entries for assets, liabilities, and monthly cash flow. In Python, we store these entries in **Variables**!

Think of a variable as an account or a cell in a ledger. You can declare its name and update its balance as transactions occur.

\`\`\`python
cash_balance = 50000.0        # Float representing your cash account
active_liabilities = 20000    # Integer representing a bank loan
company_name = "Apex Corp"    # String representing the corporation
is_profitable = True          # Boolean indicating positive net margin
\`\`\`

We can compute our net worth instantly by performing math:
\`\`\`python
net_worth = cash_balance - active_liabilities
\`\`\``;
      codeExample = `assets = 75000
liabilities = 30000
net_worth = assets - liabilities

print("Corporation Assets:", assets)
print("Total Liabilities:", liabilities)
print("Net Worth Capital:", net_worth)`;
      instruction = "Define a variable named `company_revenue` with a value of 12000, and `expenses` with a value of 8000. Calculate `net_profit` and print it.";
      template = `# Economic ledger calculations\ncompany_revenue = 12000\nexpenses = 8000\n\n# Calculate net_profit and print it\n`,
      expectedOutputContains = ["4000"];
    } else if (isGeography) {
      title = "Atlas Databases with Geography Variables";
      explanation = `### Geography Mode: Passports and Capitals as Variables
In geography, every country has coordinates, a capital, a sovereign name, and a population count. In Python, we represent these details using **Variables**!

Think of a variable as a passport entry or a field in a world atlas.

\`\`\`python
country_name = "Japan"       # String (text)
capital_city = "Tokyo"       # String (text)
gdp_trillions = 4.9          # Float (decimal number)
is_island_nation = True      # Boolean (True/False)
population = 125000000       # Integer (whole number)
\`\`\``;
      codeExample = `continent = "Europe"
country_count = 44
has_coastline = True

print("Target Continent:", continent)
print("Number of Countries:", country_count)
print("Has Coastline?", has_coastline)`;
      instruction = "Create a variable named `capital` set to \"Paris\" and `population_millions` set to 67. Print both values.";
      template = `# Geography data entries\ncapital = \npopulation_millions = \n\nprint(capital)\nprint(population_millions)`;
      expectedOutputContains = ["Paris", "67"];
    } else {
      title = "Inventory Slots with Game Variables";
      explanation = `### Game Learning Mode: Player Stats as Variables
In video games like Minecraft, player states—such as remaining health, inventory slot counts, and levels—must be tracked dynamically. We store these in **Variables**!

Think of a variable as a chest slot. It holds a specific item count, tool name, or status flag.

\`\`\`python
player_hp = 20                # Integer tracking health points
equipped_weapon = "Diamond"   # String tracking equipped gear
hunger_level = 18.5           # Float tracking hunger bar
is_in_combat = False          # Boolean tracking state
\`\`\`

Python allows you to update variables as the game state changes:
\`\`\`python
player_hp = player_hp - 5     # Player took fall damage!
\`\`\``;
      codeExample = `inventory_slots = 36
diamond_count = 12
has_iron_pickaxe = True

print("Inventory Slots:", inventory_slots)
print("Diamonds Mined:", diamond_count)
print("Has Pickaxe?", has_iron_pickaxe)`;
      instruction = "Define a variable `mana` set to 100, and `is_wizard` set to True. Print both variables.";
      template = `# Player stats tracker\nmana = \nis_wizard = \n\nprint(mana)\nprint(is_wizard)`;
      expectedOutputContains = ["100", "True"];
    }
  }

  // 2. INPUT & OUTPUT
  else if (concept.includes('Input')) {
    if (isStory) {
      title = "Interactive Dialogue and Story Choices";
      explanation = `### Story Mode: Interactive Conversational Trees
To build an interactive text adventure, the story must ask the reader for their input! We do this using Python's \`input()\` function, and display narrative text using \`print()\`.

The \`input()\` function prompts the reader to type something and pauses execution until they press enter.

\`\`\`python
# Ask the player for their wizard character's name
wizard_name = input("What is your wizard name? ")
print("The elders salute you, " + wizard_name + "!")
\`\`\``;
      codeExample = `print("You stand before the gates of Elvoria.")
choice = "enter" # Simulated input
print("You chose to: " + choice)`;
      instruction = "Create an output statement printing \"The Dragon roars: BEWARE!\" using the print function.";
      template = `# Write your print statement here\n`,
      expectedOutputContains = ["Dragon", "roars", "BEWARE"];
    } else if (isEconomic) {
      title = "Interactive Cashiers & Budget Inputs";
      explanation = `### Economic Mode: Interactive Financial Terminals
In financial software, users type in transaction amounts or interest rates. We accept these values using \`input()\` and format them using \`print()\`.

Note: Since \`input()\` always returns a String, we must convert numbers using \`float()\` or \`int()\` to perform math!

\`\`\`python
investment = float(input("Enter capital to invest: "))
gains = investment * 1.12
print("Your portfolio value after 1 year: ", gains)
\`\`\``;
      codeExample = `tax_rate = 0.05
income = 5000
tax_due = income * tax_rate
print("Calculated Tax Liability Amount:", tax_due)`;
      instruction = "Write a statement printing \"Total Balance: $1000\" using the print function.";
      template = `# Output the balance\n`,
      expectedOutputContains = ["Total", "Balance", "1000"];
    } else if (isGeography) {
      title = "Dynamic Tourist Registers";
      explanation = `### Geography Mode: Dynamic Passport Scanners
Let's build a dynamic passport register. We can request a traveler's origin and destination using \`input()\`, and output an entry log using \`print()\`.

\`\`\`python
traveler_name = "Sophia" # Simulated scanner input
destination = "Iceland"
print("Logged traveler: " + traveler_name + " flying to " + destination)
\`\`\``;
      codeExample = `destination = "Italy"
print("Welcome to your dynamic itinerary to " + destination + "!")`;
      instruction = "Write a print statement that outputs \"Exploring the Amazon rainforest!\"";
      template = `# Output your expedition\n`,
      expectedOutputContains = ["Exploring", "Amazon", "rainforest"];
    } else {
      title = "Game Prompts and Interactive Player Setup";
      explanation = `### Game Mode: Player Setup and Commands
When launching a terminal-based RPG game, we want to ask the player to choose their username or choose an action command.

We use \`input()\` to read their key commands:

\`\`\`python
# Read choice of path
command = input("Type 'left' or 'right' to navigate: ")
print("You moved towards the " + command)
\`\`\``;
      codeExample = `player_tag = "DoomSlayer"
print("Logged into server as " + player_tag + "!")`;
      instruction = "Print a welcome message saying \"Game Server Online!\" to indicate successful initialization.";
      template = `# Print the message\n`,
      expectedOutputContains = ["Game", "Server", "Online"];
    }
  }

  // 3. CONDITIONS (if-else)
  else if (concept.includes('Conditions') || concept.includes('if-else')) {
    if (isStory) {
      title = "Interactive Choice Branches: Sorting Hat & Magic Rules";
      explanation = `### Story Mode: Branches of Fate
In interactive fiction, if-else statements represent crucial choice points. "If the reader possesses the magic sword, they slay the monster; else, they must flee."

We use comparison operators like \`==\`, \`>\`, \`<\` and block indentations.

\`\`\`python
has_spellbook = True

if has_spellbook:
    print("You successfully cast Lumos!")
else:
    print("You wave your empty hands. Nothing happens.")
\`\`\``;
      codeExample = `wisdom_score = 85

if wisdom_score > 90:
    print("You are sorted into Ravenclaw!")
elif wisdom_score >= 50:
    print("You are sorted into Hufflepuff!")
else:
    print("You remain an apprentice!")`;
      instruction = "Complete the code so that if `has_potion` is True, print \"Poison cured!\", else print \"Danger! Go to apothecary!\"";
      template = `has_potion = True\n\n# Check if has_potion is True\n`,
      expectedOutputContains = ["Poison", "cured"];
    } else if (isEconomic) {
      title = "Financial Thresholds & Cash Flow Decisions";
      explanation = `### Economic Mode: Margin Checks & Asset Decisions
In finance, decision logic is vital. "If the investment yield exceeds inflation, buy the asset; otherwise, hold cash."

We translate this using \`if-elif-else\` logic:

\`\`\`python
savings_rate = 15.5

if savings_rate >= 20.0:
    print("Excellent wealth building!")
elif savings_rate >= 10.0:
    print("Healthy savings habit.")
else:
    print("Warning: High consumption! Trim liabilities.")
\`\`\``;
      codeExample = `cash_flow = 1200
expenses = 1500

if cash_flow > expenses:
    print("Profitable! Cash surplus.")
else:
    print("Deficit! Reduce monthly expenses.")`;
      instruction = "Complete the condition. If `debt_ratio` is less than 0.4, print \"Approved for financing\". Otherwise, print \"Declined due to risk\".";
      template = `debt_ratio = 0.25\n\n# Evaluate debt_ratio\n`,
      expectedOutputContains = ["Approved", "financing"];
    } else if (isGeography) {
      title = "Border Patrol and Population Density Logic";
      explanation = `### Geography Mode: Regional Criteria & Borders
Geographers classify regions based on various attributes (e.g., if population density exceeds 1000/km², it is classified as Urban).

Let's model classification logic using Python conditions:

\`\`\`python
population = 8000000

if population >= 5000000:
    print("Megacity Class")
elif population >= 500000:
    print("Metropolis Class")
else:
    print("Town or Village Class")
\`\`\``;
      codeExample = `elevation = 3200

if elevation > 3000:
    print("Alpine Mountain Climate Zone")
else:
    print("Lowland Climate Zone")`;
      instruction = "Write a condition. If `temperature_celsius` is less than 0, print \"Freezing polar climate\". Otherwise, print \"Temperate climate\".";
      template = `temperature_celsius = -5\n\n# Check temperature\n`,
      expectedOutputContains = ["Freezing", "polar"];
    } else {
      title = "Combat Logic & HP Checkpoints";
      explanation = `### Game Mode: Player Status & Damage Controls
In games, every interaction involves checks. "If player health drops below zero, trigger Game Over. If player has gold key, unlock boss dungeon door."

Let's model simple combat checks:

\`\`\`python
player_hp = 4
is_poisoned = True

if player_hp < 5 and is_poisoned:
    print("Warning: Critical HP! Drink an antidote!")
elif player_hp <= 0:
    print("Steve has perished.")
else:
    print("Steve is stable.")
\`\`\``;
      codeExample = `xp = 1200

if xp >= 1000:
    print("Level Up! You are now a Pythonic Mage!")
else:
    print("Keep mining to accumulate more XP.")`;
      instruction = "Complete the logic. If `boss_hp` is less than or equal to 0, print \"VICTORY! BOSS DEFEATED!\". Otherwise, print \"Boss is still standing!\"";
      template = `boss_hp = 0\n\n# Check if boss health is empty\n`,
      expectedOutputContains = ["VICTORY", "DEFEATED"];
    }
  }

  // 4. LOOPS (for/while)
  else if (concept.includes('Loops') || concept.includes('for/while')) {
    if (isStory) {
      title = "Repetitive Incantations and Wizardry Iteration";
      explanation = `### Story Mode: Multi-cast Magic Loops
In fantasy stories, wizards often recite spells repeatedly to break powerful runes, or army cohorts march over leagues. In Python, we automate repetition using **for** and **while loops**!

Use \`range(N)\` to loop exactly N times:

\`\`\`python
# Cast standard Lumos 3 times
for wave in range(3):
    print("Reciting Lumos incantation... Cast #", wave + 1)
\`\`\``;
      codeExample = `mana = 3
# A while loop runs until the condition is False
while mana > 0:
    print("Cast Fireball! Mana remaining:", mana)
    mana -= 1`;
      instruction = "Write a for loop that prints \"Casting Wingardium Leviosa!\" exactly 3 times using range(3).";
      template = `# Repeat casting Wingardium Leviosa! 3 times\n`,
      expectedOutputContains = ["Wingardium", "Leviosa", "Wingardium"];
    } else if (isEconomic) {
      title = "Compound Interest & Ledger Amortization Loops";
      explanation = `### Economic Mode: Compounding Interest & Projections
In financial projections, spreadsheets repeat calculations year after year to estimate returns on assets, balance adjustments, or liability payoffs.

We can compute 5-year investment balances effortlessly using loops:

\`\`\`python
capital = 10000
growth_rate = 1.10 # 10% annual gains

for year in range(5):
    capital = capital * growth_rate
    print("Year", year + 1, "Account Balance: $", round(capital, 2))
\`\`\``;
      codeExample = `months_remaining = 3
loan_amount = 900
monthly_payment = 300

while months_remaining > 0:
    loan_amount -= monthly_payment
    print("Payment made. Remaining Debt: $", loan_amount)
    months_remaining -= 1`;
      instruction = "Write a for loop using range(4) that prints \"Dividend credited: $25\" 4 times.";
      template = `# Print Dividend credited: $25 exactly 4 times\n`,
      expectedOutputContains = ["Dividend", "credited", "25"];
    } else if (isGeography) {
      title = "Iterating Through the Globe & Travel Itineraries";
      explanation = `### Geography Mode: Continent Expeditions
When navigating maps or databases containing cities, we want to inspect or process each region one by one. This is called **iteration**.

We can loop through lists of locations:

\`\`\`python
destinations = ["Egypt", "Iceland", "Japan", "Peru"]

for country in destinations:
    print("Voyaging to next destination: " + country)
\`\`\``;
      codeExample = `kilometer_marker = 1
while kilometer_marker <= 3:
    print("Expedition has traversed to kilometer:", kilometer_marker)
    kilometer_marker += 1`;
      instruction = "Create a list of locations `continents` containing \"Asia\" and \"Africa\". Loop through it and print each continent name.";
      template = `continents = ["Asia", "Africa"]\n# Loop and print each\n`,
      expectedOutputContains = ["Asia", "Africa"];
    } else {
      title = "Mining blocks and Automating Bridge Builds";
      explanation = `### Game Mode: Repetitive Farming & Block Placements
When mining resources or constructing bridges, manually coding each action is tedious. We use loops to automate repetitive operations.

\`\`\`python
# Place 4 bridge blocks
for block in range(4):
    print("Placed Obsidian block at coordinates x =", block + 1)
\`\`\``;
      codeExample = `arrows = 3
while arrows > 0:
    print("Fired Arrow! Remaining in quiver:", arrows)
    arrows -= 1`;
      instruction = "Use a for loop and range(3) to print \"Smelting Ore...\" 3 times.";
      template = `# Smelt ore 3 times using a loop\n`,
      expectedOutputContains = ["Smelting", "Ore", "Smelting"];
    }
  }

  // 5. LISTS, DICTIONARIES & COLLECTIONS
  else if (concept.includes('Lists') || concept.includes('concept_collections')) {
    if (isStory) {
      title = "Spell Inventories and Hogwarts House Registers";
      explanation = `### Story Mode: Spellbooks & Relics
Wizards store their list of mastered incantations or inventory of relics in collection structures. In Python:
1. **List**: An ordered, indexable sequence of magic items.
2. **Dictionary**: A set of key-value associations (e.g. associating a wizard with their house).

\`\`\`python
# Magic spells list
spellbook = ["Lumos", "Expelliarmus", "Patronum"]
print("First spell:", spellbook[0]) # index starts at 0

# Wand specifications dictionary
wand = {
    "wood": "Elder",
    "core": "Thestral Hair",
    "length": 15
}
print("Wand Core:", wand["core"])
\`\`\``;
      codeExample = `house_points = {"Gryffindor": 150, "Slytherin": 120}
print("Gryffindor points:", house_points["Gryffindor"])`;
      instruction = "Create a list named `spells` containing \"Lumos\" and \"Alohomora\", then print the list.";
      template = `# Declare your list\nspells = \nprint(spells)`,
      expectedOutputContains = ["Lumos", "Alohomora"];
    } else if (isEconomic) {
      title = "Expense Lists and Asset Portfolios";
      explanation = `### Economic Mode: Portfolios & Ledger Ledgers
In finance, we maintain collections of assets or lists of historical expenses. Python's data structures let us store and manage these!

\`\`\`python
# Portfolio asset list
portfolio = ["Apple Stock", "Real Estate Fund", "Gold ETFs"]
print("Primary asset asset:", portfolio[0])

# Corporation details dictionary
ledger = {
    "cash": 45000,
    "equity": 30000,
    "debt": 15000
}
print("Current Cash Account Asset:", ledger["cash"])
\`\`\``;
      codeExample = `expenses_dict = {"rent": 1200, "utilities": 250}
print("Rent bill:", expenses_dict["rent"])`;
      instruction = "Create a dictionary named `assets` with key \"bonds\" set to 5000, and print it.";
      template = `# Declare corporate assets dictionary\nassets = \nprint(assets)`,
      expectedOutputContains = ["bonds", "5000"];
    } else if (isGeography) {
      title = "Capitals Atlas & Global Geographical Coordinate Sets";
      explanation = `### Geography Mode: Atlas Lookup Tables
Geographical databases map countries to their specific capital cities, populations, or climate indexes. We use **Dictionaries** for key-value looks!

\`\`\`python
# Capital Lookup Atlas
capitals = {
    "France": "Paris",
    "Egypt": "Cairo",
    "Japan": "Tokyo"
}
print("Capital of Egypt:", capitals["Egypt"])

# Nations List
nations = ["Canada", "Mexico", "United States"]
print("North American border nation:", nations[1])
\`\`\``;
      codeExample = `coordinates = {"latitude": 48.8566, "longitude": 2.3522}
print("Latitude Coordinate of Paris:", coordinates["latitude"])`;
      instruction = "Create a dictionary `geography_lookup` with key \"India\" set to \"New Delhi\", then print it.";
      template = `# Create and print geography_lookup\ngeography_lookup = \nprint(geography_lookup)`,
      expectedOutputContains = ["India", "New Delhi"];
    } else {
      title = "Hotbars, Inventories, and Weapon Damage Indexes";
      explanation = `### Game Mode: Inventory Chests & Item Lookup Databases
Games keep a list of equipped weapons or a dictionary matching item names to their weapon stats.

\`\`\`python
# Player hotbar inventory list
hotbar = ["Diamond Sword", "Cobblestone", "Golden Apple", "Bow"]
print("Equipped Weapon:", hotbar[0])

# Monster stats lookup dictionary
mob_stats = {
    "creeper_hp": 20,
    "zombie_hp": 20,
    "enderman_hp": 40
}
print("Enderman Health Index:", mob_stats["enderman_hp"])
\`\`\``;
      codeExample = `inventory = ["Coal", "Torch", "Cobblestone"]
inventory.append("Iron Ore") # add new block!
print("Updated Inventory slots:", inventory)`;
      instruction = "Create a list named `weapon_chest` containing \"Sword\" and \"Bow\". Print the list.";
      template = `# Declare list and print it\nweapon_chest = \nprint(weapon_chest)`,
      expectedOutputContains = ["Sword", "Bow"];
    }
  }

  // DEFAULT / FALLBACK FOR OTHER CONCEPTS
  else {
    title = `Mastering ${concept} in ${scenario}`;
    explanation = `### Mastery of ${concept} (${scenario} Edition)
Welcome! In this lesson, we will explore the core concept of **${concept}** inside our personalized universe of **${scenario}**.

#### Python Logic:
Every program needs to manipulate inputs, execute calculations, and print outcomes. 
When writing Python scripts, ensure clean formatting and pay close attention to indentation.

\`\`\`python
# Simple demo of ${concept}
print("Studying ${concept}!")
\`\`\`

#### Quick Tip:
Experiment by modifying the source parameters on the sandbox code panel and hitting the run button!`;
    codeExample = `print("Mastering ${concept} in ${scenario}")`;
    instruction = `Write a python statement printing: "Successfully resolved ${concept}"`;
    template = `print("Successfully resolved ${concept}")`;
    expectedOutputContains = ['Successfully', 'resolved'];
  }

  return {
    id: `offline_lesson_${concept.toLowerCase().replace(/\s+/g, '_')}_${scenario}`,
    title,
    concept,
    level,
    scenario,
    explanation,
    codeExample,
    interactiveChallenge: {
      instruction,
      template,
      expectedOutputContains
    }
  };
}
