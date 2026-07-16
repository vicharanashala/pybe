export interface ReelStep {
  lineIndex: number; // 0-indexed line in codeLines to highlight
  narration: string; // Caption explaining this exact line
  variables: Record<string, string | number | boolean>; // Monitored variables at this point
  output: string[]; // Console lines outputted so far
}

export interface CodeReel {
  id: string;
  title: string;
  concept: string;
  codeLines: string[];
  steps: ReelStep[];
}

export const CONCEPT_REELS: Record<string, Record<string, CodeReel>> = {
  // Keyed by Concept -> then by Scenario group/id
  'Variables & Data Types': {
    story: {
      id: 'reel_var_story',
      title: 'Lore Variables: Mythological Introduction',
      concept: 'Variables & Data Types',
      codeLines: [
        '# Let\'s craft a mythological hero card',
        'hero_name = "Odysseus"',
        'title = "The Wise Wanderer"',
        'fleet_ships = 12',
        'is_immortal = False',
        '',
        '# Now let\'s print their full introduction',
        'full_intro = hero_name + " " + title',
        'print("Behold " + full_intro)'
      ],
      steps: [
        {
          lineIndex: 0,
          narration: "We start with a comment. In Python, comments begin with a '#' and are completely ignored by the computer. They are strictly for human readers!",
          variables: {},
          output: []
        },
        {
          lineIndex: 1,
          narration: "We create a variable named 'hero_name' and store the text 'Odysseus' inside it. This is a String data type.",
          variables: { hero_name: '"Odysseus"' },
          output: []
        },
        {
          lineIndex: 2,
          narration: "Next, we assign another string 'The Wise Wanderer' to 'title'. Both variables now exist in memory.",
          variables: { hero_name: '"Odysseus"', title: '"The Wise Wanderer"' },
          output: []
        },
        {
          lineIndex: 3,
          narration: "We assign the whole number 12 to 'fleet_ships'. This is an Integer (int) data type, perfect for count metrics.",
          variables: { hero_name: '"Odysseus"', title: '"The Wise Wanderer"', fleet_ships: 12 },
          output: []
        },
        {
          lineIndex: 4,
          narration: "We store False in 'is_immortal'. This is a Boolean (bool) data type, which can ONLY be True or False.",
          variables: { hero_name: '"Odysseus"', title: '"The Wise Wanderer"', fleet_ships: 12, is_immortal: 'False' },
          output: []
        },
        {
          lineIndex: 6,
          narration: "This line is blank, so Python simply skips to the next statement.",
          variables: { hero_name: '"Odysseus"', title: '"The Wise Wanderer"', fleet_ships: 12, is_immortal: 'False' },
          output: []
        },
        {
          lineIndex: 7,
          narration: "We use the '+' operator to join (concatenate) the strings 'hero_name', a space, and 'title' into a brand new variable 'full_intro'.",
          variables: { hero_name: '"Odysseus"', title: '"The Wise Wanderer"', fleet_ships: 12, is_immortal: 'False', full_intro: '"Odysseus The Wise Wanderer"' },
          output: []
        },
        {
          lineIndex: 8,
          narration: "Finally, we print the concatenated text to the terminal console! Notice how the variables are resolved to their stored values.",
          variables: { hero_name: '"Odysseus"', title: '"The Wise Wanderer"', fleet_ships: 12, is_immortal: 'False', full_intro: '"Odysseus The Wise Wanderer"' },
          output: ["Behold Odysseus The Wise Wanderer"]
        }
      ]
    },
    economic: {
      id: 'reel_var_economic',
      title: 'Ledger Audit: GDP & Trade Balance Variables',
      concept: 'Variables & Data Types',
      codeLines: [
        '# Calculate a nation\'s gross domestic product',
        'consumer_spending = 3500.5',
        'investments = 1200.0',
        'gov_funding = 1500.2',
        'net_exports = -300.0',
        '',
        '# Aggregate items together',
        'gdp = consumer_spending + investments + gov_funding + net_exports',
        'print("Final calculated National GDP:", gdp)'
      ],
      steps: [
        {
          lineIndex: 0,
          narration: "We begin our economic ledger with a documentation comment. Python ignores lines starting with '#'.",
          variables: {},
          output: []
        },
        {
          lineIndex: 1,
          narration: "We set 'consumer_spending' to 3500.5. This is a Float (decimal number), representing trillions of dollars.",
          variables: { consumer_spending: 3500.5 },
          output: []
        },
        {
          lineIndex: 2,
          narration: "Next, we assign 1200.0 to 'investments'. This stores another Float in memory.",
          variables: { consumer_spending: 3500.5, investments: 1200.0 },
          output: []
        },
        {
          lineIndex: 3,
          narration: "We initialize 'gov_funding' with 1500.2 to represent total government outlays.",
          variables: { consumer_spending: 3500.5, investments: 1200.0, gov_funding: 1500.2 },
          output: []
        },
        {
          lineIndex: 4,
          narration: "We store a negative Float (-300.0) in 'net_exports', meaning this nation is currently running a trade deficit.",
          variables: { consumer_spending: 3500.5, investments: 1200.0, gov_funding: 1500.2, net_exports: -300.0 },
          output: []
        },
        {
          lineIndex: 6,
          narration: "Blank line skipped.",
          variables: { consumer_spending: 3500.5, investments: 1200.0, gov_funding: 1500.2, net_exports: -300.0 },
          output: []
        },
        {
          lineIndex: 7,
          narration: "We calculate the GDP variable by adding all sectors. Python evaluates the mathematical expression before saving the result to 'gdp'.",
          variables: { consumer_spending: 3500.5, investments: 1200.0, gov_funding: 1500.2, net_exports: -300.0, gdp: 5900.7 },
          output: []
        },
        {
          lineIndex: 8,
          narration: "We pass the label string and the calculated float 'gdp' to the print() function, which outputs them neatly together.",
          variables: { consumer_spending: 3500.5, investments: 1200.0, gov_funding: 1500.2, net_exports: -300.0, gdp: 5900.7 },
          output: ["Final calculated National GDP: 5900.7"]
        }
      ]
    },
    gaming: {
      id: 'reel_var_gaming',
      title: 'Arcade Physics: Player Scores & Bullet Coordinates',
      concept: 'Variables & Data Types',
      codeLines: [
        '# Retro arcade coordinate tracker',
        'player_score = 9450',
        'bullets_fired = 14',
        'is_boss_spawned = True',
        'multiplier = 1.5',
        '',
        '# Compute final score after multiplier bonus',
        'final_score = player_score * multiplier',
        'print("Arcade score result:", final_score)'
      ],
      steps: [
        {
          lineIndex: 0,
          narration: "We set up an arcade gaming script. Lines prefixed with '#' are ignored comments.",
          variables: {},
          output: []
        },
        {
          lineIndex: 1,
          narration: "We create an Integer variable 'player_score' and set it to 9450.",
          variables: { player_score: 9450 },
          output: []
        },
        {
          lineIndex: 2,
          narration: "We declare 'bullets_fired' and store the integer value 14.",
          variables: { player_score: 9450, bullets_fired: 14 },
          output: []
        },
        {
          lineIndex: 3,
          narration: "We store True in 'is_boss_spawned'. This Boolean variable lets us trigger boss combat checks in our game logic.",
          variables: { player_score: 9450, bullets_fired: 14, is_boss_spawned: 'True' },
          output: []
        },
        {
          lineIndex: 4,
          narration: "We declare a decimal Float multiplier of 1.5.",
          variables: { player_score: 9450, bullets_fired: 14, is_boss_spawned: 'True', multiplier: 1.5 },
          output: []
        },
        {
          lineIndex: 6,
          narration: "Blank line skipped.",
          variables: { player_score: 9450, bullets_fired: 14, is_boss_spawned: 'True', multiplier: 1.5 },
          output: []
        },
        {
          lineIndex: 7,
          narration: "We multiply our integer player_score by the float multiplier. The result automatically becomes a Float (14175.0) and is saved in 'final_score'!",
          variables: { player_score: 9450, bullets_fired: 14, is_boss_spawned: 'True', multiplier: 1.5, final_score: 14175.0 },
          output: []
        },
        {
          lineIndex: 8,
          narration: "The print() function outputs the retro score result directly onto our gaming UI.",
          variables: { player_score: 9450, bullets_fired: 14, is_boss_spawned: 'True', multiplier: 1.5, final_score: 14175.0 },
          output: ["Arcade score result: 14175.0"]
        }
      ]
    }
  },
  'Conditions (if-else)': {
    story: {
      id: 'reel_cond_story',
      title: 'Lore Choice: The Sphinx\'s Riddle Check',
      concept: 'Conditions (if-else)',
      codeLines: [
        '# Mythological riddler check',
        'player_answer = "human"',
        'sphinx_rage_meter = 20',
        '',
        'if player_answer == "human":',
        '    print("The Sphinx flies away, defeated!")',
        'else:',
        '    sphinx_rage_meter += 80',
        '    print("The beast strikes in anger!")'
      ],
      steps: [
        {
          lineIndex: 0,
          narration: "We begin with a comment introducing the Sphinx's riddle scenario.",
          variables: {},
          output: []
        },
        {
          lineIndex: 1,
          narration: "We store the string 'human' in 'player_answer'. This represents the user's guess.",
          variables: { player_answer: '"human"' },
          output: []
        },
        {
          lineIndex: 2,
          narration: "We set 'sphinx_rage_meter' to 20. This tracks the danger level.",
          variables: { player_answer: '"human"', sphinx_rage_meter: 20 },
          output: []
        },
        {
          lineIndex: 4,
          narration: "Here is the 'if' condition statement. It compares 'player_answer' to 'human'. Since 'human' == 'human' evaluates to True, Python executes the indented block immediately below!",
          variables: { player_answer: '"human"', sphinx_rage_meter: 20 },
          output: []
        },
        {
          lineIndex: 5,
          narration: "Python runs this line since the condition was met. Note the 4-space indentation! This line prints our victory message.",
          variables: { player_answer: '"human"', sphinx_rage_meter: 20 },
          output: ["The Sphinx flies away, defeated!"]
        },
        {
          lineIndex: 6,
          narration: "Python entirely skips the 'else:' branch and everything inside it, because the 'if' statement was already satisfied. It goes straight to the end!",
          variables: { player_answer: '"human"', sphinx_rage_meter: 20 },
          output: ["The Sphinx flies away, defeated!"]
        }
      ]
    },
    economic: {
      id: 'reel_cond_economic',
      title: 'Forex Check: Trade Surplus and Tariffs',
      concept: 'Conditions (if-else)',
      codeLines: [
        '# Evaluate tariff rates based on net imports',
        'net_imports = -450',
        'tariff_rate = 0.05',
        '',
        'if net_imports > 0:',
        '    tariff_rate = 0.15',
        '    print("Imposing standard imports tariff.")',
        'else:',
        '    tariff_rate = 0.02',
        '    print("Surplus detected. Reducing tariffs.")'
      ],
      steps: [
        {
          lineIndex: 0,
          narration: "We declare a comment. Let's model tariff policy logic.",
          variables: {},
          output: []
        },
        {
          lineIndex: 1,
          narration: "We assign -450 to 'net_imports', representing a net trade surplus (negative imports).",
          variables: { net_imports: -450 },
          output: []
        },
        {
          lineIndex: 2,
          narration: "We initialize 'tariff_rate' to a baseline of 0.05.",
          variables: { net_imports: -450, tariff_rate: 0.05 },
          output: []
        },
        {
          lineIndex: 4,
          narration: "We check if 'net_imports' is greater than 0. Since -450 > 0 is False, Python skips the indented 'if' block completely and searches for an 'else' branch!",
          variables: { net_imports: -450, tariff_rate: 0.05 },
          output: []
        },
        {
          lineIndex: 7,
          narration: "Since the 'if' condition was False, Python jumps directly to the 'else:' statement.",
          variables: { net_imports: -450, tariff_rate: 0.05 },
          output: []
        },
        {
          lineIndex: 8,
          narration: "Inside the else branch, we update the tariff_rate variable to 0.02.",
          variables: { net_imports: -450, tariff_rate: 0.02 },
          output: []
        },
        {
          lineIndex: 9,
          narration: "We print a notice indicating that trade is healthy and tariff policies have successfully adapted.",
          variables: { net_imports: -450, tariff_rate: 0.02 },
          output: ["Surplus detected. Reducing tariffs."]
        }
      ]
    },
    gaming: {
      id: 'reel_cond_gaming',
      title: 'RPG Mechanics: Mana Spell Trigger Check',
      concept: 'Conditions (if-else)',
      codeLines: [
        '# Can our gaming avatar cast an ultimate spell?',
        'mana_points = 45',
        'has_spell_scroll = True',
        '',
        'if mana_points >= 50 or has_spell_scroll:',
        '    mana_points -= 10',
        '    print("Spell Cast Successfully!")',
        'else:',
        '    print("Insufficent Mana! Spell failed.")'
      ],
      steps: [
        {
          lineIndex: 0,
          narration: "We set up an RPG spell casting check using logical operators.",
          variables: {},
          output: []
        },
        {
          lineIndex: 1,
          narration: "The player has 45 mana points left. (An ultimate spell typically costs 50).",
          variables: { mana_points: 45 },
          output: []
        },
        {
          lineIndex: 2,
          narration: "However, 'has_spell_scroll' is True. This represents an inventory item that bypasses cost limitations.",
          variables: { mana_points: 45, has_spell_scroll: 'True' },
          output: []
        },
        {
          lineIndex: 4,
          narration: "We check if 'mana_points >= 50' OR 'has_spell_scroll' is True. Since 'has_spell_scroll' is True, the entire compound expression evaluates to True!",
          variables: { mana_points: 45, has_spell_scroll: 'True' },
          output: []
        },
        {
          lineIndex: 5,
          narration: "Python enters the if-body and subtracts 10 points from the player's remaining mana reserves.",
          variables: { mana_points: 35, has_spell_scroll: 'True' },
          output: []
        },
        {
          lineIndex: 6,
          narration: "The print() function outputs a success confirmation.",
          variables: { mana_points: 35, has_spell_scroll: 'True' },
          output: ["Spell Cast Successfully!"]
        },
        {
          lineIndex: 7,
          narration: "The 'else' block is completely ignored because the primary condition was already met. Spell cast complete!",
          variables: { mana_points: 35, has_spell_scroll: 'True' },
          output: ["Spell Cast Successfully!"]
        }
      ]
    }
  },
  'Loops (for/while)': {
    story: {
      id: 'reel_loops_story',
      title: 'Dynamic Quest: Bestowing Magical Artifacts',
      concept: 'Loops (for/while)',
      codeLines: [
        '# Looping through an inventory of legendary items',
        'artifacts = ["Aegis Shield", "Hermes Boots", "Midas Ring"]',
        'equipped_count = 0',
        '',
        'for item in artifacts:',
        '    equipped_count += 1',
        '    print("Equipped: " + item)',
        '',
        'print("Equipped items total:", equipped_count)'
      ],
      steps: [
        {
          lineIndex: 0,
          narration: "Let's explore 'for' loops! Loops repeat a section of code once for each item in a collection.",
          variables: {},
          output: []
        },
        {
          lineIndex: 1,
          narration: "We define a Python List 'artifacts' containing three mythical string items.",
          variables: { artifacts: '["Aegis Shield", "Hermes Boots", "Midas Ring"]' },
          output: []
        },
        {
          lineIndex: 2,
          narration: "We set an integer counter variable 'equipped_count' to 0.",
          variables: { artifacts: '["Aegis Shield", "Hermes Boots", "Midas Ring"]', equipped_count: 0 },
          output: []
        },
        {
          lineIndex: 4,
          narration: "The loop starts. In Python, 'for item in artifacts:' takes the FIRST element ('Aegis Shield') and assigns it to 'item'.",
          variables: { artifacts: '["Aegis Shield", "Hermes Boots", "Midas Ring"]', equipped_count: 0, item: '"Aegis Shield"' },
          output: []
        },
        {
          lineIndex: 5,
          narration: "We increment our counter by 1. 'equipped_count' is now 1.",
          variables: { artifacts: '["Aegis Shield", "Hermes Boots", "Midas Ring"]', equipped_count: 1, item: '"Aegis Shield"' },
          output: []
        },
        {
          lineIndex: 6,
          narration: "We print the action for our first legendary item.",
          variables: { artifacts: '["Aegis Shield", "Hermes Boots", "Midas Ring"]', equipped_count: 1, item: '"Aegis Shield"' },
          output: ["Equipped: Aegis Shield"]
        },
        {
          lineIndex: 4,
          narration: "Python loops back! It takes the SECOND element ('Hermes Boots') and assigns it to 'item'.",
          variables: { artifacts: '["Aegis Shield", "Hermes Boots", "Midas Ring"]', equipped_count: 1, item: '"Hermes Boots"' },
          output: ["Equipped: Aegis Shield"]
        },
        {
          lineIndex: 5,
          narration: "We increment equipped_count again. It increases to 2.",
          variables: { artifacts: '["Aegis Shield", "Hermes Boots", "Midas Ring"]', equipped_count: 2, item: '"Hermes Boots"' },
          output: ["Equipped: Aegis Shield"]
        },
        {
          lineIndex: 6,
          narration: "We print the action for our second item.",
          variables: { artifacts: '["Aegis Shield", "Hermes Boots", "Midas Ring"]', equipped_count: 2, item: '"Hermes Boots"' },
          output: ["Equipped: Aegis Shield", "Equipped: Hermes Boots"]
        },
        {
          lineIndex: 4,
          narration: "Python loops back a third time! It takes the THIRD element ('Midas Ring') and assigns it to 'item'.",
          variables: { artifacts: '["Aegis Shield", "Hermes Boots", "Midas Ring"]', equipped_count: 2, item: '"Midas Ring"' },
          output: ["Equipped: Aegis Shield", "Equipped: Hermes Boots"]
        },
        {
          lineIndex: 5,
          narration: "We increment the equipped_count to 3.",
          variables: { artifacts: '["Aegis Shield", "Hermes Boots", "Midas Ring"]', equipped_count: 3, item: '"Midas Ring"' },
          output: ["Equipped: Aegis Shield", "Equipped: Hermes Boots"]
        },
        {
          lineIndex: 6,
          narration: "We print the action for our third item.",
          variables: { artifacts: '["Aegis Shield", "Hermes Boots", "Midas Ring"]', equipped_count: 3, item: '"Midas Ring"' },
          output: ["Equipped: Aegis Shield", "Equipped: Hermes Boots", "Equipped: Midas Ring"]
        },
        {
          lineIndex: 8,
          narration: "All elements in the collection have been processed! Python exits the loop body and executes the unindented line below.",
          variables: { artifacts: '["Aegis Shield", "Hermes Boots", "Midas Ring"]', equipped_count: 3 },
          output: ["Equipped: Aegis Shield", "Equipped: Hermes Boots", "Equipped: Midas Ring", "Equipped items total: 3"]
        }
      ]
    },
    economic: {
      id: 'reel_loops_economic',
      title: 'Market Compounder: Projecting Yearly Dividend Growth',
      concept: 'Loops (for/while)',
      codeLines: [
        '# Let\'s compound an initial capital investment',
        'investment_fund = 1000',
        'interest_rate = 1.10',
        '',
        'for year in range(1, 4):',
        '    investment_fund = investment_fund * interest_rate',
        '    print("Year " + str(year) + " Fund:", round(investment_fund))'
      ],
      steps: [
        {
          lineIndex: 0,
          narration: "We setup a basic compounding ledger loop. In Python, 'range(1, 4)' generates integers 1, 2, and 3.",
          variables: {},
          output: []
        },
        {
          lineIndex: 1,
          narration: "We start with a seed investment fund of 1000.",
          variables: { investment_fund: 1000 },
          output: []
        },
        {
          lineIndex: 2,
          narration: "We specify an annual yield multiplier rate of 1.10 (representing a healthy 10% annual interest).",
          variables: { investment_fund: 1000, interest_rate: 1.10 },
          output: []
        },
        {
          lineIndex: 4,
          narration: "The loop triggers! In this first iteration, 'year' is set to 1.",
          variables: { investment_fund: 1000, interest_rate: 1.10, year: 1 },
          output: []
        },
        {
          lineIndex: 5,
          narration: "We multiply our current fund value by the interest rate. 1000 * 1.10 = 1100. The new value is assigned back to 'investment_fund'.",
          variables: { investment_fund: 1100.0, interest_rate: 1.10, year: 1 },
          output: []
        },
        {
          lineIndex: 6,
          narration: "We print out our first year statement rounded to the nearest dollar.",
          variables: { investment_fund: 1100.0, interest_rate: 1.10, year: 1 },
          output: ["Year 1 Fund: 1100"]
        },
        {
          lineIndex: 4,
          narration: "Python loops back! 'year' takes the next value in the range, which is 2.",
          variables: { investment_fund: 1100.0, interest_rate: 1.10, year: 2 },
          output: ["Year 1 Fund: 1100"]
        },
        {
          lineIndex: 5,
          narration: "Our funds compound once more. 1100.0 * 1.10 = 1210.0.",
          variables: { investment_fund: 1210.0, interest_rate: 1.10, year: 2 },
          output: ["Year 1 Fund: 1100"]
        },
        {
          lineIndex: 6,
          narration: "We print out our second year statement.",
          variables: { investment_fund: 1210.0, interest_rate: 1.10, year: 2 },
          output: ["Year 1 Fund: 1100", "Year 2 Fund: 1210"]
        },
        {
          lineIndex: 4,
          narration: "Python loops back for the final time. 'year' takes the value of 3.",
          variables: { investment_fund: 1210.0, interest_rate: 1.10, year: 3 },
          output: ["Year 1 Fund: 1100", "Year 2 Fund: 1210"]
        },
        {
          lineIndex: 5,
          narration: "Our funds compound one last time. 1210.0 * 1.10 = 1331.0.",
          variables: { investment_fund: 1331.0, interest_rate: 1.10, year: 3 },
          output: ["Year 1 Fund: 1100", "Year 2 Fund: 1210"]
        },
        {
          lineIndex: 6,
          narration: "We print out our final third-year balance statement.",
          variables: { investment_fund: 1331.0, interest_rate: 1.10, year: 3 },
          output: ["Year 1 Fund: 1100", "Year 2 Fund: 1210", "Year 3 Fund: 1331"]
        }
      ]
    },
    gaming: {
      id: 'reel_loops_gaming',
      title: 'Block Builder: Crafting Dynamic Block Walls',
      concept: 'Loops (for/while)',
      codeLines: [
        '# Looping to place construction blocks in a row',
        'blocks = ["Gold", "Diamond", "Emerald"]',
        'grid_position_x = 0',
        '',
        'for material in blocks:',
        '    print("Placed block of " + material)',
        '    grid_position_x += 16',
        '',
        'print("Row complete. End coord x:", grid_position_x)'
      ],
      steps: [
        {
          lineIndex: 0,
          narration: "We write a looping script to place elements relative to a coordinate spacing grid.",
          variables: {},
          output: []
        },
        {
          lineIndex: 1,
          narration: "We initialize a list of block materials.",
          variables: { blocks: '["Gold", "Diamond", "Emerald"]' },
          output: []
        },
        {
          lineIndex: 2,
          narration: "We start our horizontal coordinate 'grid_position_x' at 0.",
          variables: { blocks: '["Gold", "Diamond", "Emerald"]', grid_position_x: 0 },
          output: []
        },
        {
          lineIndex: 4,
          narration: "The loop begins. In our first iteration, the string 'Gold' is assigned to the loop variable 'material'.",
          variables: { blocks: '["Gold", "Diamond", "Emerald"]', grid_position_x: 0, material: '"Gold"' },
          output: []
        },
        {
          lineIndex: 5,
          narration: "We call print() to simulate laying the physical Gold brick.",
          variables: { blocks: '["Gold", "Diamond", "Emerald"]', grid_position_x: 0, material: '"Gold"' },
          output: ["Placed block of Gold"]
        },
        {
          lineIndex: 6,
          narration: "We increase the grid coordinates by 16 pixels to make room for the next building block.",
          variables: { blocks: '["Gold", "Diamond", "Emerald"]', grid_position_x: 16, material: '"Gold"' },
          output: ["Placed block of Gold"]
        },
        {
          lineIndex: 4,
          narration: "The loop advances. Python sets 'material' to the second element, 'Diamond'.",
          variables: { blocks: '["Gold", "Diamond", "Emerald"]', grid_position_x: 16, material: '"Diamond"' },
          output: ["Placed block of Gold"]
        },
        {
          lineIndex: 5,
          narration: "We print a placement message for the Diamond block.",
          variables: { blocks: '["Gold", "Diamond", "Emerald"]', grid_position_x: 16, material: '"Diamond"' },
          output: ["Placed block of Gold", "Placed block of Diamond"]
        },
        {
          lineIndex: 6,
          narration: "We advance the horizontal position by another 16 pixels to 32.",
          variables: { blocks: '["Gold", "Diamond", "Emerald"]', grid_position_x: 32, material: '"Diamond"' },
          output: ["Placed block of Gold", "Placed block of Diamond"]
        },
        {
          lineIndex: 4,
          narration: "The loop enters its final step. 'material' takes the third value, 'Emerald'.",
          variables: { blocks: '["Gold", "Diamond", "Emerald"]', grid_position_x: 32, material: '"Emerald"' },
          output: ["Placed block of Gold", "Placed block of Diamond"]
        },
        {
          lineIndex: 5,
          narration: "We print a placement confirmation for the Emerald block.",
          variables: { blocks: '["Gold", "Diamond", "Emerald"]', grid_position_x: 32, material: '"Emerald"' },
          output: ["Placed block of Gold", "Placed block of Diamond", "Placed block of Emerald"]
        },
        {
          lineIndex: 6,
          narration: "We advance the grid coordinate by 16 once more, reaching a final index of 48.",
          variables: { blocks: '["Gold", "Diamond", "Emerald"]', grid_position_x: 48, material: '"Emerald"' },
          output: ["Placed block of Gold", "Placed block of Diamond", "Placed block of Emerald"]
        },
        {
          lineIndex: 8,
          narration: "The loop completes. Python exits the loop body and executes the final statement, printing the overall row coordinates.",
          variables: { blocks: '["Gold", "Diamond", "Emerald"]', grid_position_x: 48 },
          output: ["Placed block of Gold", "Placed block of Diamond", "Placed block of Emerald", "Row complete. End coord x: 48"]
        }
      ]
    }
  }
};
