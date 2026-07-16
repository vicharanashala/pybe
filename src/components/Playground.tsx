import { useState, useEffect } from 'react';
import CodeEditor from './CodeEditor';
import { 
  Terminal, Shield, BookOpen, Sparkles, Wand2, RefreshCw, 
  ArrowRight, Info, Lightbulb, Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LearningLevel } from '../types';

interface PlaygroundProps {
  selectedScenario: string;
  selectedLevel: LearningLevel;
}

interface AlchemyIngredient {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  conceptName: string;
}

interface FlowchartNode {
  id: string;
  label: string;
  desc: string;
  type: 'input' | 'process' | 'condition' | 'output';
}

interface AlchemyResult {
  title: string;
  subtitle: string;
  metaphor: string;
  code: string;
  flowchartNodes: FlowchartNode[];
}

export default function Playground({ selectedScenario, selectedLevel }: PlaygroundProps) {
  const [activeTab, setActiveTab] = useState<'alchemy' | 'sandbox'>('alchemy');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(['var', 'cond']);
  const [customScenario, setCustomScenario] = useState<string>(selectedScenario || 'books');
  const [alchemyOutput, setAlchemyOutput] = useState<AlchemyResult | null>(null);
  const [sandboxCode, setSandboxCode] = useState<string>('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Sync custom scenario when parent selectedScenario changes
  useEffect(() => {
    if (selectedScenario) {
      setCustomScenario(selectedScenario);
    }
  }, [selectedScenario]);

  // Ingredients definition
  const ingredientsList: AlchemyIngredient[] = [
    { id: 'var', name: 'Variable Vault', emoji: '🏺', desc: 'Creates storage boxes to persist data values.', conceptName: 'Variables' },
    { id: 'cond', name: 'Conditional Gate', emoji: '🎛️', desc: 'Implements If-Else routes to diverge state paths.', conceptName: 'Conditions' },
    { id: 'loop', name: 'Loop Iteration Engine', emoji: '⚙️', desc: 'Automates repeating actions over a range.', conceptName: 'Loops' },
    { id: 'list', name: 'Collection List', emoji: '📦', desc: 'Organizes multiple items in order under one name.', conceptName: 'Lists & Dictionaries' },
  ];

  // Run initial synthesis
  useEffect(() => {
    handleSynthesize(selectedIngredients, customScenario);
  }, [customScenario]);

  const handleToggleIngredient = (id: string) => {
    let updated: string[];
    if (selectedIngredients.includes(id)) {
      if (selectedIngredients.length <= 1) return; // Keep at least one
      updated = selectedIngredients.filter(x => x !== id);
    } else {
      updated = [...selectedIngredients, id];
    }
    setSelectedIngredients(updated);
    handleSynthesize(updated, customScenario);
  };

  const handleSynthesize = (ingredients: string[], theme: string) => {
    setIsSynthesizing(true);
    setTimeout(() => {
      const result = generateSynthesisResult(ingredients, theme);
      setAlchemyOutput(result);
      setSandboxCode(result.code);
      setIsSynthesizing(false);
    }, 400);
  };

  // Code synthesis core engine using string arrays to bypass template literal interpolation bugs
  const generateSynthesisResult = (ingredients: string[], theme: string): AlchemyResult => {
    const hasVar = ingredients.includes('var');
    const hasCond = ingredients.includes('cond');
    const hasLoop = ingredients.includes('loop');
    const hasList = ingredients.includes('list');

    const isStory = theme === 'books' || theme === 'history';
    const isEconomic = theme === 'business';
    const isGeography = theme === 'geography';

    let title = "Custom Synthesis Spell";
    let subtitle = "Multi-concept Fusion";
    let metaphor = "";
    let code = "";
    let flowchartNodes: FlowchartNode[] = [];

    // 1. STORY MODE SELECTIONS
    if (isStory) {
      if (hasVar && hasCond && hasLoop && hasList) {
        title = "Omni-Spellbook Grimoire Invoker";
        subtitle = "Variables + Conditions + Loops + Lists";
        metaphor = "This advanced formula models a magical spell grimoire. It declares storage flasks (Variables) for your raw mana level, iterates through a spellbook list (Loops + Lists), and evaluates each spell's activation criteria dynamically using a sorting barrier (Conditions)!";
        code = [
          "# Omni-Spellbook Grimoire Invoker",
          "mana_reserve = 120",
          "spell_vault = ['Lumos', 'Expelliarmus', 'Patronum', 'Avada Kedavra']",
          "",
          "print('=== INITIATING GRIMOIRE AUDIT ===')",
          "for spell in spell_vault:",
          "    print(f'Scanning runic seal of: {spell}')",
          "    if spell == 'Patronum':",
          "        if mana_reserve >= 100:",
          "            print(' -> STATUS: APPROVED! Guardian Patronus summoned!')",
          "            mana_reserve -= 80",
          "        else:",
          "            print(' -> STATUS: DENIED! Insufficient mana reserve.')",
          "    elif spell == 'Avada Kedavra':",
          "        print(' -> STATUS: FORBIDDEN! Dark magic blocked by Hogwarts wards!')",
          "    else:",
          "        print(' -> STATUS: APPROVED! Base incantation cast successfully.')",
          "",
          "print(f'Grimoire process complete. Final wizard mana: {mana_reserve}')"
        ].join('\n');
        flowchartNodes = [
          { id: '1', type: 'input', label: 'Mana & Spellbook', desc: 'Stores mana=120 and spell list in Variables' },
          { id: '2', type: 'process', label: 'Spells Loop Iterator', desc: 'Loops through each magical spell in the list one by one' },
          { id: '3', type: 'condition', label: 'Spell & Mana Check', desc: 'Evaluates if spell is "Patronum" and if mana >= 100' },
          { id: '4', type: 'output', label: 'Cast Or Reject', desc: 'Prints success alerts and outputs remaining mana count' },
        ];
      } else if (hasVar && hasCond && hasLoop) {
        title = "Runic Wand Sparker Loop";
        subtitle = "Variables + Conditions + Loops";
        metaphor = "Automates spell casting! A loop fires magic sparks, utilizing a counter variable to track durability, and stopping early using conditions if safety limit warnings trigger.";
        code = [
          "# Runic Wand Sparker Loop",
          "wand_heat = 0",
          "max_safe_heat = 40",
          "",
          "for spark in range(1, 6):",
          "    wand_heat += 12",
          "    print(f'Spark #{spark} discharged! Wand core heat level: {wand_heat}°C')",
          "    ",
          "    if wand_heat > max_safe_heat:",
          "        print('⚡ WARNING: Core overload detected! Initiating emergency shutdown!')",
          "        break",
          "    else:",
          "        print(' -> Wand temperature within optimal thresholds.')",
          "",
          "print('Wand discharging process ended.')"
        ].join('\n');
        flowchartNodes = [
          { id: '1', type: 'input', label: 'Heat Threshold', desc: 'Sets initial wand_heat = 0 and max threshold to 40' },
          { id: '2', type: 'process', label: 'Spark Generator (1 to 5)', desc: 'Repeats spark action up to 5 times, increasing heat by 12' },
          { id: '3', type: 'condition', label: 'Is Overheated?', desc: 'Checks if current temperature exceeds max safe heat limit' },
          { id: '4', type: 'output', label: 'Cooldown Warning', desc: 'Triggers emergency safety warning and halts the sparker' },
        ];
      } else if (hasVar && hasList && hasLoop) {
        title = "Hogwarts House Points Aggregator";
        subtitle = "Variables + Loops + Lists";
        metaphor = "Fuses variables and lists to accumulate values. We iterate over a list containing individual class point contributions, and accumulate them into a single score variable.";
        code = [
          "# Hogwarts House Points Aggregator",
          "point_contributions = [15, 30, -10, 25, 40]  # Gryffindor points logged",
          "total_points = 0",
          "",
          "for points in point_contributions:",
          "    total_points += points",
          "    print(f'Logged point entry: {points:+} -> Running total: {total_points}')",
          "",
          "print(f'🏆 Final Gryffindor Hourglass Score: {total_points} Points!')"
        ].join('\n');
        flowchartNodes = [
          { id: '1', type: 'input', label: 'Points Record', desc: 'Creates point list and sets total_points counter = 0' },
          { id: '2', type: 'process', label: 'List Traverse Loop', desc: 'Steps through each point contribution in the list' },
          { id: '3', type: 'output', label: 'Calculate & Post', desc: 'Sums points into total score and prints running hourglass count' },
        ];
      } else if (hasVar && hasCond) {
        title = "Phoenix Health & Healing Checkpoint";
        subtitle = "Variables + Conditions";
        metaphor = "A simple checkpoint. Evaluates current phoenix vitals (health variable) against survival thresholds using if-else branch logic.";
        code = [
          "# Phoenix Health & Healing Checkpoint",
          "phoenix_hp = 35",
          "has_healing_relic = True",
          "",
          "print(f'Evaluating Phoenix state... Health: {phoenix_hp} HP')",
          "if phoenix_hp < 50:",
          "    if has_healing_relic:",
          "        phoenix_hp = 100",
          "        print('✨ Relic activated! Phoenix ascends in full radiant healing!')",
          "    else:",
          "        print('🔥 Phoenix turns into ashes! Preparing for rebirth cycle...')",
          "else:",
          "    print('Phoenix is strong and soaring through the sky.')"
        ].join('\n');
        flowchartNodes = [
          { id: '1', type: 'input', label: 'Phoenix Stats', desc: 'Defines phoenix_hp=35 and healing_relic status' },
          { id: '2', type: 'condition', label: 'HP Check', desc: 'Checks if HP falls below 50' },
          { id: '3', type: 'output', label: 'Status Update', desc: 'Restores HP to 100 on success, or triggers ashes warning' },
        ];
      } else {
        title = "Lumos Spark Forge";
        subtitle = "Story Concept Synthesis";
        metaphor = "This magic spark maps your inputs into simple active outputs using Python. It ensures easy variables and safe prints.";
        code = [
          "relic_count = 5",
          "print(f'Casting Lumos! Illuminating {relic_count} ancient runic vaults.')"
        ].join('\n');
        flowchartNodes = [
          { id: '1', type: 'input', label: 'Relic Variable', desc: 'Stores relic count in variable' },
          { id: '2', type: 'output', label: 'Lumos Glow', desc: 'Prints output text using formatting f-strings' },
        ];
      }
    }

    // 2. ECONOMIC SCENARIO
    else if (isEconomic) {
      if (hasVar && hasCond && hasLoop && hasList) {
        title = "Expense Audit & Portfolio Yield Tracker";
        subtitle = "Variables + Conditions + Loops + Lists";
        metaphor = "Models a real-time ledger accounting audit. It loops through a transaction register list, flags suspicious expenses exceeding thresholds, and updates total cash account variables.";
        code = [
          "# Expense Audit & Portfolio Yield Tracker",
          "cash_reserve = 50000.0",
          "transactions = [1200.0, -450.0, -8000.0, 15000.0, -12000.0]",
          "",
          "print('=== STARTING AUDIT & BALANCE SHEET INTEGRATION ===')",
          "for amount in transactions:",
          "    if amount < 0:",
          "        expense = abs(amount)",
          "        if expense > 5000.0:",
          "            print(f'🚨 ALERT: High-risk capital expenditure flagged: -${expense}')",
          "        else:",
          "            print(f'Logged standard operational expense: -${expense}')",
          "        cash_reserve += amount",
          "    else:",
          "        print(f'Logged corporate asset inflow: +${amount}')",
          "        cash_reserve += amount",
          "",
          "print(f'Audit Complete! Adjusted liquid cash reserves: ${cash_reserve:,.2f}')"
        ].join('\n');
        flowchartNodes = [
          { id: '1', type: 'input', label: 'Cash & Transactions', desc: 'Initializes bank balances and transaction list' },
          { id: '2', type: 'process', label: 'Transaction Loop', desc: 'Iterates through each ledger transaction value' },
          { id: '3', type: 'condition', label: 'Risk/Expense Gate', desc: 'Checks if amount is an expense and exceeds $5,000' },
          { id: '4', type: 'output', label: 'Final Ledger Post', desc: 'Updates liquid reserve balances and logs audit compliance' },
        ];
      } else if (hasVar && hasCond && hasLoop) {
        title = "Compound Interest & Margin Call Projector";
        subtitle = "Variables + Conditions + Loops";
        metaphor = "Simulates wealth compound accumulation over a timeline. Uses a loop to step through years, variables to compute compounding growth, and conditions to abort early if capital falls under loan requirements.";
        code = [
          "# Compound Interest & Margin Call Projector",
          "capital = 12000.0",
          "annual_rate = 1.08  # 8% growth rate",
          "maintenance_margin = 10000.0",
          "",
          "for year in range(1, 6):",
          "    capital = capital * annual_rate - 1000  # Compound growth minus $1000 annual fee",
          "    print(f'Year {year} end - Current Capital Balance: ${capital:,.2f}')",
          "    ",
          "    if capital < maintenance_margin:",
          "        print('❌ MARGIN WARNING: Balance fell below safety threshold! Halting projection.')",
          "        break",
          "    else:",
          "        print(' -> Asset performance remains in healthy bounds.')",
          "",
          "print('Amortization timeline simulation finished.')"
        ].join('\n');
        flowchartNodes = [
          { id: '1', type: 'input', label: 'Investment & Rates', desc: 'Defines initial capital, interest rate, and margin threshold' },
          { id: '2', type: 'process', label: 'Compounding Loop', desc: 'Loops through 5 years, multiplying asset by interest minus fees' },
          { id: '3', type: 'condition', label: 'Margin Audit', desc: 'Checks if account capital is less than maintenance margin' },
          { id: '4', type: 'output', label: 'Capital Ledger', desc: 'Outputs final simulated balances' },
        ];
      } else if (hasVar && hasList && hasLoop) {
        title = "Revenue Streams & Net Profit Calculator";
        subtitle = "Variables + Loops + Lists";
        metaphor = "Sums multiple dynamic business variables. A list hosts distinct stream revenues, a loop aggregates them, and the variable retains the combined net profit capital.";
        code = [
          "# Revenue Streams & Net Profit Calculator",
          "revenue_streams = [3500, 1200, 8500, 4200]",
          "total_revenue = 0",
          "",
          "for stream in revenue_streams:",
          "    total_revenue += stream",
          "    print(f'Aggregating business division: ${stream} -> Cumulative: ${total_revenue}')",
          "",
          "expenses = 7400",
          "net_profit = total_revenue - expenses",
          "print(f'📊 Net Profit Margins: Total Rev ${total_revenue} - Expenses ${expenses} = ${net_profit}')"
        ].join('\n');
        flowchartNodes = [
          { id: '1', type: 'input', label: 'Streams & Expenses', desc: 'Declares list of incoming streams and operating expenses' },
          { id: '2', type: 'process', label: 'Summation Loop', desc: 'Adds each stream value to the total revenue balance' },
          { id: '3', type: 'output', label: 'Revenue Report', desc: 'Subtracts expenses and prints final net profit margin' },
        ];
      } else {
        title = "Asset Ledger Entry";
        subtitle = "Economic Concept Synthesis";
        metaphor = "Instantiates asset profiles using clean variable names and computes liquidity instantly using standard print tools.";
        code = [
          "liquid_cash = 25000",
          "fixed_assets = 60000",
          "total_assets = liquid_cash + fixed_assets",
          "print(f'Asset Ledger Initialized. Total Corporate Valuation: ${total_assets}')"
        ].join('\n');
        flowchartNodes = [
          { id: '1', type: 'input', label: 'Accounts Ledger', desc: 'Saves cash and fixed asset numbers' },
          { id: '2', type: 'output', label: 'Balance Sheet Output', desc: 'Sums capital values and prints total corporate valuation' },
        ];
      }
    }

    // 3. GEOGRAPHY SCENARIO
    else if (isGeography) {
      if (hasVar && hasCond && hasLoop && hasList) {
        title = "Sovereign Continent Density & Census Auditor";
        subtitle = "Variables + Conditions + Loops + Lists";
        metaphor = "Examines national registers. It iterates through country census records (Loops + Lists), filters nations by density categories (Conditions), and aggregates high-density counts (Variables).";
        code = [
          "# Continent Census Auditor",
          "high_density_count = 0",
          "nations_atlas = [",
          "    {'name': 'Canada', 'pop': 38, 'area': 9.9},",
          "    {'name': 'Singapore', 'pop': 6, 'area': 0.0007},",
          "    {'name': 'Japan', 'pop': 125, 'area': 0.37},",
          "    {'name': 'Egypt', 'pop': 109, 'area': 1.0}",
          "]",
          "",
          "print('=== INITIATING GLOBAL CENSUS DENSITY RUN ===')",
          "for nation in nations_atlas:",
          "    density = nation['pop'] / nation['area']",
          "    print(f\"{nation['name']}: Pop {nation['pop']}M | Density: {density:.2f} people/km²\")",
          "    ",
          "    if density > 100:",
          "        print(' -> Classification: HIGH POPULATION DENSITY')",
          "        high_density_count += 1",
          "    else:",
          "        print(' -> Classification: SPARSAL OR REGULAR REGION')",
          "",
          "print(f'Census Audit finished. Found {high_density_count} high-density countries.')"
        ].join('\n');
        flowchartNodes = [
          { id: '1', type: 'input', label: 'Nations Atlas Dictionary', desc: 'Stores details for various nations (Population/Area)' },
          { id: '2', type: 'process', label: 'Atlas Iterator', desc: 'Steps through each country record in the database list' },
          { id: '3', type: 'condition', label: 'Density Evaluation', desc: 'Checks if population density exceeds 100/km²' },
          { id: '4', type: 'output', label: 'Sovereign Records Post', desc: 'Logs the counts of high density regions' },
        ];
      } else if (hasVar && hasCond && hasLoop) {
        title = "Elevation Altitude & Climate Classifier";
        subtitle = "Variables + Conditions + Loops";
        metaphor = "Simulates terrain traversal! A loop climbs elevation meters, checking temperature drop points, and using variables to map alpine zones.";
        code = [
          "# Elevation Altitude Classifier",
          "current_altitude = 500  # meters",
          "rate_of_climb = 600",
          "",
          "for stage in range(1, 6):",
          "    current_altitude += rate_of_climb",
          "    temperature = 25 - (current_altitude / 150)",
          "    print(f'Stage {stage}: Climbed to {current_altitude}m. Estimated Temp: {temperature:.1f}°C')",
          "    ",
          "    if current_altitude > 3000:",
          "        print('🏔️ Climate Check: ENTERED ALPINE SNOW ZONE!')",
          "    elif current_altitude > 1500:",
          "        print('🌲 Climate Check: ENTERED TEMPERATE FOREST ZONE.')",
          "    else:",
          "        print('🌿 Climate Check: BASIN CLIMATE.')"
        ].join('\n');
        flowchartNodes = [
          { id: '1', type: 'input', label: 'Base Altitude', desc: 'Sets initial altitude=500m and rate_of_climb=600m' },
          { id: '2', type: 'process', label: 'Ascent Loop', desc: 'Increases current_altitude and reduces temperature dynamically' },
          { id: '3', type: 'condition', label: 'Altitude Range Check', desc: 'Determines if elevation is in Alpine, Temperate, or Basin zone' },
          { id: '4', type: 'output', label: 'Log Climate Zone', desc: 'Prints the zone classification status report' },
        ];
      } else if (hasVar && hasList && hasLoop) {
        title = "Itinerary Route Traversal Log";
        subtitle = "Variables + Loops + Lists";
        metaphor = "Iterates over travel maps. Loops through passport targets in a list, using distance variables to sum total mileage traversed.";
        code = [
          "# Itinerary Route Traversal Log",
          "expedition_route = ['Iceland', 'Norway', 'Greenland', 'Alaska']",
          "total_miles = 0",
          "",
          "for country in expedition_route:",
          "    total_miles += 1800",
          "    print(f'Flight path cleared to: {country} -> Added 1,800 miles.')",
          "",
          "print(f'🌍 Expedition Completed! Total travel mileage aggregated: {total_miles} miles.')"
        ].join('\n');
        flowchartNodes = [
          { id: '1', type: 'input', label: 'Expedition Targets', desc: 'Stores list of target countries and sets initial miles = 0' },
          { id: '2', type: 'process', label: 'Route Iterator Loop', desc: 'Iterates through each country destination one by one' },
          { id: '3', type: 'output', label: 'Traverse Summary', desc: 'Calculates total accumulated distance and logs expedition success' },
        ];
      } else {
        title = "National Atlas Coordinates";
        subtitle = "Geography Concept Synthesis";
        metaphor = "Establishes a neat passport profile database mapping coordinates to labels via simple variable blocks.";
        code = [
          "country = 'Japan'",
          "capital = 'Tokyo'",
          "is_island = True",
          "print(f'Atlas Log: {country}\\'s Capital is {capital}. Island status: {is_island}')"
        ].join('\n');
        flowchartNodes = [
          { id: '1', type: 'input', label: 'National Variables', desc: 'Saves country name, capital, and geographic parameters' },
          { id: '2', type: 'output', label: 'Atlas Console Log', desc: 'Formats and prints information about country' },
        ];
      }
    }

    // 4. GAME MODE SELECTIONS (DEFAULT FALLBACK / GAMING)
    else {
      if (hasVar && hasCond && hasLoop && hasList) {
        title = "Minecraft Chest Item Crafter & Sorter";
        subtitle = "Variables + Conditions + Loops + Lists";
        metaphor = "Models a player inventory system! It iterates over items in a chest, verifies crafting recipes and durability thresholds, and tracks gold counters.";
        code = [
          "# Minecraft Auto-Chest Sorter & Crafter",
          "gold_count = 12",
          "chest_items = ['Stone Brick', 'Iron Ore', 'Coal Block', 'Diamond', 'Wood Planks', 'Zombie Flesh']",
          "",
          "print('=== EXECUTING SYSTEM INVENTORY AUDIT ===')",
          "for item in chest_items:",
          "    print(f'Examining item slot: {item}')",
          "    if item == 'Diamond':",
          "        print(' -> Sorter: RARE DIAMOND FOUND! Moved to Endersafe chest!')",
          "    elif item == 'Zombie Flesh':",
          "        print(' -> Sorter: Junk discarded in incinerator.')",
          "    elif 'Block' in item or 'Brick' in item:",
          "        print(' -> Sorter: Structural block stacked in build bin.')",
          "    elif item == 'Wood Planks':",
          "        if gold_count >= 8:",
          "            print(' -> Crafter: Combined with Gold to construct a Golden Chest!')",
          "            gold_count -= 8",
          "        else:",
          "            print(' -> Crafter: Kept as raw resource block.')",
          "    else:",
          "        print(' -> Sorter: Cached in general storage drawer.')",
          "",
          "print(f'Audit finalized. Current wallet balance: {gold_count} Gold Ingots')"
        ].join('\n');
        flowchartNodes = [
          { id: '1', type: 'input', label: 'Inventory & Wallets', desc: 'Declares gold_count=12 and lists inventory items in chest' },
          { id: '2', type: 'process', label: 'Inventory Audit Loop', desc: 'Traverses each item index in the chest inventory' },
          { id: '3', type: 'condition', label: 'Item Type Filter', desc: 'Evaluates if item is Diamond, Junk, wood, or building blocks' },
          { id: '4', type: 'output', label: 'Chest Log Output', desc: 'Updates gold counters and logs item sorting classifications' },
        ];
      } else if (hasVar && hasCond && hasLoop) {
        title = "Automated Cobblestone Miner";
        subtitle = "Variables + Conditions + Loops";
        metaphor = "Simulates mining automated procedures! A loop swings the pickaxe, utilizing a durability counter variable, and halting early using conditions if the weapon shatters.";
        code = [
          "# Automated Cobblestone Miner",
          "pickaxe_durability = 30",
          "blocks_mined = 0",
          "",
          "for swing in range(1, 11):",
          "    pickaxe_durability -= 4",
          "    blocks_mined += 1",
          "    print(f'Swing #{swing}: Mined Cobblestone! Pickaxe Durability: {pickaxe_durability} HP')",
          "    ",
          "    if pickaxe_durability <= 6:",
          "        print('🛠️ WARNING: Tool is about to break! Halting automatic cobble miner!')",
          "        break",
          "    else:",
          "        print(' -> Pickaxe stable. Proceeding to next mining coordinate.')",
          "",
          "print(f'Mining halted. Total Cobblestone Blocks Secured: {blocks_mined}')"
        ].join('\n');
        flowchartNodes = [
          { id: '1', type: 'input', label: 'Tool Status Durability', desc: 'Sets pickaxe health=30 and mined counter=0' },
          { id: '2', type: 'process', label: 'Mining Swings Iterator', desc: 'Increments blocks and decreases durability per swing' },
          { id: '3', type: 'condition', label: 'Durability Check', desc: 'Checks if pickaxe durability drops below safe limit' },
          { id: '4', type: 'output', label: 'Brake Or Proceed', desc: 'Stops automated loop or logs total blocks gathered' },
        ];
      } else if (hasVar && hasList && hasLoop) {
        title = "Loot Chest XP Expender Log";
        subtitle = "Variables + Loops + Lists";
        metaphor = "Aggregates loot chest values! Iterates over item drop lists, using a variable to sum cumulative XP points earned by the player.";
        code = [
          "# Loot Chest XP Expender Log",
          "dropped_relics = ['Iron Helmet', 'Ender Pearl', 'Golden Apple']",
          "total_xp_gained = 0",
          "",
          "for loot in dropped_relics:",
          "    total_xp_gained += 350",
          "    print(f'Loot Picked Up: {loot} -> Credited +350 Experience points!')",
          "",
          "print(f'🏆 Inventory Summary: Traversed chest rewards. Total XP Gained: {total_xp_gained}')"
        ].join('\n');
        flowchartNodes = [
          { id: '1', type: 'input', label: 'Relics Drops Record', desc: 'Defines relic list and initializes xp counter to 0' },
          { id: '2', type: 'process', label: 'Relics Loop Sweep', desc: 'Loops through every dropped relic in the list' },
          { id: '3', type: 'output', label: 'Scoreboard Post', desc: 'Sums up XP points and outputs final summary stats' },
        ];
      } else {
        title = "Player Character Spawn";
        subtitle = "Gaming Concept Synthesis";
        metaphor = "Establishes a neat player profile database mapping stats coordinates to labels via simple variable blocks.";
        code = [
          "player_class = 'Warrior'",
          "player_hp = 20",
          "is_alive = True",
          "print(f'Spawn Log: Joined server as {player_class}. Current health pool: {player_hp} HP')"
        ].join('\n');
        flowchartNodes = [
          { id: '1', type: 'input', label: 'Spawn Stats', desc: 'Saves character profiles, HP, and survival status' },
          { id: '2', type: 'output', label: 'Server Console Log', desc: 'Logs player coordinates and profile information' },
        ];
      }
    }

    return {
      title,
      subtitle,
      metaphor,
      code,
      flowchartNodes
    };
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6" id="playground-view">
      {/* Page Title & Dual Mode Tab Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
            <Wand2 className="h-5.5 w-5.5 text-indigo-500 animate-pulse" />
            <span>Interactive Python Sandbox & Alchemy Lab</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Test custom scripts, or use the interactive Alchemy Lab to fuse programming concepts into visual flowcharts instantly!
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-850/80 shadow-inner">
          <button
            onClick={() => setActiveTab('alchemy')}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
              activeTab === 'alchemy'
                ? 'bg-indigo-650 text-white shadow-md shadow-indigo-500/15 border border-indigo-500/20'
                : 'text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Concept Alchemy Lab
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
              activeTab === 'sandbox'
                ? 'bg-indigo-650 text-white shadow-md shadow-indigo-500/15 border border-indigo-500/20'
                : 'text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            Raw Sandbox Editor
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'alchemy' ? (
          <motion.div
            key="alchemy-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Sidebar: Select Ingredients & Theme */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm space-y-5">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <span>Step 1: Gather Ingredients</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                    Toggle multiple programming concepts to fuse them into an integrated Python script!
                  </p>
                </div>

                {/* Ingredients Checkboxes */}
                <div className="space-y-3">
                  {ingredientsList.map((ing) => {
                    const isSelected = selectedIngredients.includes(ing.id);
                    return (
                      <button
                        key={ing.id}
                        onClick={() => handleToggleIngredient(ing.id)}
                        className={`w-full text-left p-3.5 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/25 shadow-sm ring-1 ring-indigo-500/30' 
                            : 'border-slate-100 dark:border-slate-800/60 hover:border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900'
                        }`}
                      >
                        <div className="text-2xl mt-0.5">{ing.emoji}</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">{ing.name}</span>
                            {isSelected && (
                              <span className="text-[9px] bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 font-extrabold px-1.5 py-0.5 rounded">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight font-medium">
                            {ing.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Theme Selector */}
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-2">
                  <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Step 2: Align Narrative Theme
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'books', label: 'Story Mode 🔮' },
                      { id: 'business', label: 'Finance 📈' },
                      { id: 'geography', label: 'Geography 🌍' },
                      { id: 'gaming', label: 'Gaming 🎮' }
                    ].map((themeOpt) => (
                      <button
                        key={themeOpt.id}
                        onClick={() => {
                          setCustomScenario(themeOpt.id);
                          handleSynthesize(selectedIngredients, themeOpt.id);
                        }}
                        className={`py-2 px-3 text-xs font-extrabold rounded-lg border text-center transition-all cursor-pointer ${
                          customScenario === themeOpt.id
                            ? 'border-indigo-500 bg-indigo-650 text-white shadow-sm'
                            : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {themeOpt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Explanatory badge */}
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 flex items-start gap-2.5">
                  <Info className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                    The Alchemy Lab generates real, valid Python logic mapping physical concepts into clean code instructions. Run it below!
                  </p>
                </div>
              </div>
            </div>

            {/* Right Main Panel: Visual Synthesis Diagram & Code Output */}
            <div className="lg:col-span-8 space-y-6">
              {/* Concept Fusion Showcase */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm p-6 space-y-6 relative overflow-hidden">
                {/* Glowing spell sparks */}
                <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-400/5 rounded-full blur-2xl" />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-900 uppercase tracking-widest flex items-center gap-1.5 w-fit">
                      <Sparkles className="h-3 w-3" />
                      Synthesized Code Spell
                    </span>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                      {alchemyOutput?.title}
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-slate-400 font-bold">
                      {alchemyOutput?.subtitle}
                    </p>
                  </div>

                  <button
                    onClick={() => handleSynthesize(selectedIngredients, customScenario)}
                    className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
                    Re-Compile Formula
                  </button>
                </div>

                {/* Dynamic Logic Metaphor */}
                <div className="bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-slate-950 dark:to-indigo-950/10 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 flex gap-3.5">
                  <div className="p-2.5 bg-indigo-100 dark:bg-indigo-950 rounded-lg text-indigo-600 dark:text-indigo-400 h-fit">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Concept Analogy & Metaphor</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mt-1">
                      {alchemyOutput?.metaphor}
                    </p>
                  </div>
                </div>

                {/* Step-by-Step Flowchart Visualization */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Interactive Logic Flowchart
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1 relative">
                    {alchemyOutput?.flowchartNodes.map((node, idx, arr) => (
                      <div key={node.id} className="relative flex flex-col justify-center">
                        <div className={`p-3.5 rounded-xl border text-left space-y-1.5 relative shadow-sm h-full flex flex-col justify-between ${
                          node.type === 'input' ? 'border-sky-200 bg-sky-50/30 dark:border-sky-950 dark:bg-sky-950/20' :
                          node.type === 'process' ? 'border-amber-200 bg-amber-50/30 dark:border-amber-950 dark:bg-amber-950/20' :
                          node.type === 'condition' ? 'border-rose-200 bg-rose-50/30 dark:border-rose-950 dark:bg-rose-950/20' :
                          'border-emerald-200 bg-emerald-50/30 dark:border-emerald-950 dark:bg-emerald-950/20'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase">
                              Node #{idx + 1}
                            </span>
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                              node.type === 'input' ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400' :
                              node.type === 'process' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' :
                              node.type === 'condition' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' :
                              'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                            }`}>
                              {node.type}
                            </span>
                          </div>

                          <div>
                            <h5 className="text-xs font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
                              {node.label}
                            </h5>
                            <p className="text-[10px] text-slate-400 dark:text-slate-400 leading-snug mt-1 font-semibold">
                              {node.desc}
                            </p>
                          </div>
                        </div>

                        {/* Connection arrow pointing to the next card (Desktop only) */}
                        {idx < arr.length - 1 && (
                          <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 p-0.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full shadow">
                            <ArrowRight className="h-3 w-3 text-slate-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Load into Executable Workspace Section */}
                <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Terminal className="h-4 w-4 text-emerald-500" />
                      Ready to Cast & Run Code
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                      This script has been loaded into your local Python WebAssembly Sandbox below. Press "Run Code" to execute!
                    </p>
                  </div>
                </div>
              </div>

              {/* Running sandbox space */}
              <div className="space-y-4">
                <CodeEditor
                  initialCode={sandboxCode}
                  lessonContext={alchemyOutput?.title || "Sandbox Code"}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="sandbox-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Unrestricted Sandbox Editor */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border border-emerald-950">
                  <Terminal className="h-3.5 w-3.5" />
                  UNRESTRICTED PYTHON CORE
                </div>
                <h2 className="text-xl font-extrabold tracking-tight">
                  Free Sandbox Playground
                </h2>
                <p className="text-slate-400 text-xs md:text-sm font-semibold max-w-xl">
                  Test custom logic, copy-paste snippets, solve external problems, or draft programs. Everything is compiled and run locally inside your browser WebAssembly container.
                </p>
              </div>

              <div className="flex gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] text-slate-400 font-extrabold items-center">
                <Shield className="h-4 w-4 text-indigo-400" />
                <span>OFFLINE LOCAL EVALUATION ACTIVE</span>
              </div>
            </div>

            <CodeEditor
              initialCode={`# Write unrestricted Python script below!\n# Modify, add custom variables, functions or loops.\n\ndef compound_wealth(principal, rate, years):\n    print(f"Projecting starting principal: \${principal}")\n    balance = principal\n    for year in range(1, years + 1):\n        balance *= (1 + rate)\n        print(f"Year {year}: balance is \${balance:,.2f}")\n    return balance\n\ncompound_wealth(1000, 0.12, 5)\n`}
              lessonContext="Sandbox Free Editor"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
