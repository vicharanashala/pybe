const logger = require('../lib/logger');

/**
 * Gemini AI Service — primary AI provider.
 * Uses Google Gemini 2.0 Flash (via generativelanguage.googleapis.com).
 * All functions mirror minimax.service.js exactly so they are drop-in replacements.
 */

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent';

function getApiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is not configured in server/.env');
  return key;
}

/** Parse Gemini response → raw text string */
function extractText(data) {
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

/** Strip markdown fences, reasoning tags + extract first JSON object from text with syntax recovery */
function parseJson(raw, fallbackObj = null) {
  try {
    let clean = (raw || '').replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    if (clean.startsWith('```')) clean = clean.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
    const f = clean.indexOf('{');
    const l = clean.lastIndexOf('}');
    if (f !== -1 && l !== -1 && l > f) {
      clean = clean.slice(f, l + 1);
    } else if (f !== -1) {
      clean = clean.slice(f);
      let openBraces = 0, openBrackets = 0, inString = false, escape = false;
      for (let i = 0; i < clean.length; i++) {
        const c = clean[i];
        if (escape) { escape = false; continue; }
        if (c === '\\') { escape = true; continue; }
        if (c === '"') { inString = !inString; continue; }
        if (!inString) {
          if (c === '{') openBraces++;
          else if (c === '}') openBraces--;
          else if (c === '[') openBrackets++;
          else if (c === ']') openBrackets--;
        }
      }
      if (inString) clean += '"';
      while (openBrackets > 0) { clean += ']'; openBrackets--; }
      while (openBraces > 0) { clean += '}'; openBraces--; }
    }
    return JSON.parse(clean);
  } catch (err) {
    logger.warn(`[Gemini JSON Parser] Recovery fallback invoked: ${err.message}`);
    if (fallbackObj) return fallbackObj;
    throw new Error(`Invalid JSON returned from AI engine: ${err.message}`);
  }
}

/** Single Gemini API call — sends a combined system+user prompt with optional fallback */
async function geminiCall(systemPrompt, userPrompt, fallback = null, retries = 2) {
  const key = getApiKey();
  const url = `${GEMINI_BASE}?key=${key}`;

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
      },
    ],
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json',
    },
  };

  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errBody = await res.text();
        if (res.status === 429 && attempt < retries) {
          logger.warn(`Gemini 429 rate limit reached. Waiting 3.5s before retry…`);
          await delay(3500);
          continue;
        }
        if (fallback) return fallback;
        throw new Error(`Gemini API error ${res.status}: ${errBody}`);
      }

      const data = await res.json();
      const raw = extractText(data);
      if (!raw) {
        if (fallback) return fallback;
        throw new Error('Gemini returned empty content.');
      }
      return parseJson(raw, fallback);
    } catch (err) {
      if (attempt === retries) {
        if (fallback) return fallback;
        throw err;
      }
      await delay(2000);
    }
  }
}


/* ═══════════════════════════════════════════════════════════
   1.  generateScenarioWithGemini
═══════════════════════════════════════════════════════════ */
async function generateScenarioWithGemini(topic = 'Python Basics', difficulty = 'intermediate') {
  logger.info(`[Gemini] Generating 5-page multi-chapter case study for: "${topic}" (${difficulty})`);

  const systemPrompt = `You are an imaginative storyteller, AI system architect, and engaging Python coding mentor.
Your task is to create an extensive, lengthy, multi-page Python learning case study based on a real-world story or analogy that even a beginner can easily grasp.
Return ONLY valid JSON matching this schema exactly (no markdown fences, no extra text):
{
  "title": "Short descriptive scenario title",
  "difficulty": "${difficulty}",
  "concepts": ["concept1", "concept2", "concept3", "concept4"],
  "context": "A very lengthy, comprehensive 5-page learning case study. You MUST use '---PAGE---' as the separator between the 5 distinct pages.",
  "prompt": "Clear instructions on what the student should reason about and build in Python.",
  "objectives": ["Objective 1: ...", "Objective 2: ...", "Objective 3: ...", "Objective 4: ..."]
}

CRITICAL INSTRUCTIONS FOR 'context':
1. You MUST divide the case study into exactly 5 detailed pages separated precisely by the string '---PAGE---'.
2. Format each page with clear headings and easy-to-understand simple English words (avoid tough technical jargon):
   - Page 1: 📖 Story Setup & Background (A vivid, engaging story like the Thirsty Crow or an everyday life puzzle).
   - Page 2: 🔍 The Logical Dilemma & Challenge (Explain why simple guesswork fails and what problems occur without clear code rules).
   - Page 3: 🧩 Python Coding Tools & Blueprint (Explain the required Python syntax, while loops, variables, or if-else conditionals clearly).
   - Page 4: ⚡ Step-by-Step Execution Roadmap (Provide a clear sequential plan from start to finish with safety checks).
   - Page 5: 🏆 Mastery Challenge & Victory Goal (Summarize the required Python solution and suggest fun extension ideas!).
3. Make each page lengthy, descriptive, and immersive so the student has a complete, multi-page book reading experience!`;

  const userPrompt = `Generate a realistic, lengthy 5-page Python learning scenario and case study about: "${topic}" at difficulty level "${difficulty}". Make sure to separate pages with '---PAGE---' and use engaging story concepts! JSON only.`;

  const parsed = await geminiCall(systemPrompt, userPrompt);
  if (!parsed || !parsed.context || typeof parsed.context !== 'string' || parsed.context.length < 200) {
    throw new Error(`Gemini generated scenario context was too short or incomplete.`);
  }

  return {
    title: parsed.title || `${topic} Case Study`,
    difficulty: parsed.difficulty || difficulty,
    concepts: Array.isArray(parsed.concepts) ? parsed.concepts : ['Python', topic],
    context: parsed.context,
    prompt: parsed.prompt || `Write Python code to solve ${topic}`,
    objectives: Array.isArray(parsed.objectives) ? parsed.objectives : ['Implement the required logic in Python'],
  };
}

/* ═══════════════════════════════════════════════════════════
   2.  generateConceptTreeWithGemini  (multi-prompt strategy)
═══════════════════════════════════════════════════════════ */
async function generateConceptTreeWithGemini(topic = 'Loops') {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  const DEPTH_COLORS = ['#a855f7', '#6366f1', '#06b6d4', '#10b981', '#f59e0b'];

  // ── Call 1: root + branch names ──────────────────────────────────────────────
  logger.info(`[Gemini ConceptTree] Step 1 — root + branches for "${topic}"`);
  const rootResult = await geminiCall(
    'You are an expert engineering diagram designer. Return ONLY valid JSON. No markdown.\nSchema: {"title":"string","desc":"string","children":[{"title":"string","desc":"string"}]}',
    `Create root concept and exactly 4 main branch categories for: "${topic}".\nCRITICAL DIAGRAM RULES FOR HIGH READABILITY:\n1) Titles MUST be short ALL-CAPS KEYWORDS (2-3 words max, e.g., "DYNAMIC RULE ENGINE", "REAL-TIME SCORING", "ANOMALY CHECK").\n2) Descriptions MUST be extremely brief 3-5 word bullet summaries (e.g., "Adjust rules without code.", "Calculate risk per order."). NO PARAGRAPHS OR LONG SENTENCES!\nJSON only.`
  );

  const root = {
    title: rootResult.title || topic,
    desc: rootResult.desc || `Overview of ${topic}`,
    color: DEPTH_COLORS[0],
    children: (rootResult.children || []).slice(0, 4).map((b) => ({
      title: b.title,
      desc: b.desc || '',
      color: DEPTH_COLORS[1],
      children: [],
    })),
  };

  if (root.children.length === 0) return { title: topic, root };

  // ── Calls 2-N: expand each branch ────────────────────────────────────────────
  for (let i = 0; i < root.children.length; i++) {
    const branch = root.children[i];
    logger.info(`[Gemini ConceptTree] Step ${i + 2}/${root.children.length + 1} — expanding "${branch.title}"`);
    await delay(1000); // Gemini is faster, 1s gap is enough

    try {
      const leafResult = await geminiCall(
        'You are an engineering system architect. Return ONLY valid JSON. No markdown.\nSchema: {"children":[{"title":"string","desc":"string"}]}',
        `Give exactly 3 specific child node tools under "${branch.title}" (topic: "${topic}").\nCRITICAL DIAGRAM RULES:\n1) Titles MUST be short ALL-CAPS KEYWORDS (2-3 words max, e.g., "VELOCITY SPIKE", "IP MISMATCH", "PAYLOAD CHECK").\n2) Descriptions MUST be crisp 3-5 word bullet summaries (e.g., "Flag sudden velocity spikes.", "Detect mismatched IP locations."). NO PARAGRAPHS!\nJSON only.`
      );
      branch.children = (leafResult.children || []).slice(0, 3).map((leaf, j) => ({
        title: leaf.title,
        desc: leaf.desc || '',
        color: DEPTH_COLORS[2 + (j % 3)],
        children: [],
      }));
    } catch (err) {
      logger.warn(`[Gemini ConceptTree] Branch "${branch.title}" expansion failed: ${err.message} — skipping`);
    }
  }

  const totalLeaves = root.children.reduce((s, b) => s + b.children.length, 0);
  logger.info(`[Gemini ConceptTree] Complete — ${root.children.length} branches, ${totalLeaves} leaves`);
  return { title: topic, root };
}

/* ═══════════════════════════════════════════════════════════
   3.  generateConceptMapWithGemini (Clean Architecture Map)
═══════════════════════════════════════════════════════════ */
async function generateConceptMapWithGemini(scenario) {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  function getStoryFallbacks(scene) {
    const title = (scene.title || '').toLowerCase();
    const context = (scene.context || '').toLowerCase();
    const text = (title + ' ' + context);

    // 1. Thirsty Crow Story
    if (text.includes('crow') || text.includes('water') || text.includes('pebble')) {
      return {
        zone1: {
          systemTitle: scene.title.toUpperCase(),
          systemSubtitle: "HOW A CLEVER CROW USES A PYTHON 'WHILE LOOP' TO RAISE COOL WATER AND SAVE THE DAY",
          tags: ["⚠️ Water Deep Down", "🐦 Crow is Super Thirsty", "🛑 Beak Cannot Reach", "❓ Needs Smart Loop Strategy"],
          concepts: [
            { label: "THE DEEP PITCHER PUZZLE", desc: "The water sits too deep — Corvus can't reach it without a plan!" },
            { label: "WHY GUESSING WON'T WORK", desc: "Random stone drops won't work. We need a smart repeating loop!" }
          ]
        },
        zone2: {
          tags: ["🔄 Automatic while Loop", "⚖️ Smart Depth Guard", "➕ Pebble Step Counter"],
          concepts: [
            { label: "THE LOOP GUARDIAN", desc: "Keep dropping pebbles one by one until the cool water rises up!", badge: "🔁 LOOP HERO" },
            { label: "WATER DEPTH GUARD", desc: "A Python check monitors water level after every pebble drop!", badge: "🎯 SMART DETECTIVE" },
            { label: "STEP TRACKER", desc: "Counts each pebble so we know how high the water has risen!", badge: "📊 PROGRESS STAR" }
          ]
        },
        zone3: {
          tags: ["🎉 Water Right at Top!", "🐦 Crow Quenches Thirst", "🧠 Smart Logic Win!", "🚀 Mission Completed"],
          concepts: [
            { label: "COOL SIP SUCCESS", desc: "Water reaches the top and Corvus finally drinks safely!" },
            { label: "ZERO WASTED ENERGY", desc: "The loop stops the exact moment the water is high enough!" }
          ],
          achievements: [
            { title: "LOOP HERO", subtitle: "Mastered repeating action loops", achievement: "Built an awesome while loop that repeats until the goal is won!" },
            { title: "SMART DETECTIVE", subtitle: "Mastered boundary checks", achievement: "Used Python decision logic to verify exactly when the water is ready!" },
            { title: "STORY CHAMPION", subtitle: "Solved an ancient classic", achievement: "Turned the legendary crow adventure into fun, working Python code!" }
          ]
        }
      };
    }

    // 2. Data Types & Collections (Score Average, Shopping Cart, Student Profile Dict, Lists, Sets, Nested Structures)
    if (text.includes('nested') || text.includes('score') || text.includes('list') || text.includes('dictionary') || text.includes('dict') || text.includes('tuple') || text.includes('set') || text.includes('data') || text.includes('cart') || text.includes('contact') || (scene.title || '').toLowerCase().includes('data') || (scene.title || '').toLowerCase().includes('dt')) {
      return {
        zone1: {
          systemTitle: (scene.title || "ORGANIZING SUPERHERO SQUADS & PLAYLISTS").toUpperCase(),
          systemSubtitle: "HOW PYTHON BOXES HELP SCHOOL KIDS ORGANIZE AWESOME REAL-WORLD COLLECTIONS",
          tags: ["🎮 Video Game Inventory", "🦸‍♂️ Superhero Squad Roster", "🎵 Favorite Music Playlist", "📦 Magic Labeled Drawers"],
          concepts: [
            { label: "THE MESSY BACKPACK PUZZLE", desc: "Dumping all your games or songs in one pile makes finding them impossible!" },
            { label: "SMART BOXES SAVE THE DAY", desc: "Python lists and labeled lockers organize thousands of items instantly!" }
          ]
        },
        zone2: {
          tags: ["📦 List Backpacks", "🏷️ Magic Labeled Drawers", "⚡ Instant Item Finder"],
          concepts: [
            { label: "LIST BACKPACK BUILDER", desc: "Lists are like a Spotify playlist — items stored neatly in order!", badge: "📦 BACKPACK HERO" },
            { label: "MAGIC LABELED LOCKER (DICTIONARY)", desc: "Dictionaries are lockers with name-tags — grab any item instantly!", badge: "🏷️ LABEL MASTER" },
            { label: "NESTED SUPERBOXES", desc: "Put backpacks inside lockers — lists inside dictionaries for super storage!", badge: "💎 SQUAD LEADER" }
          ]
        },
        zone3: {
          tags: ["🎉 Squad Perfectly Organized!", "⚡ Found in One Second", "🌟 Zero Messy Piles", "🚀 Ready to Play"],
          concepts: [
            { label: "INSTANT COLLECTION FINDER", desc: "Your playlist or game inventory opens in crystal-clear labeled drawers!" },
            { label: "SUPERHERO SPEED", desc: "Pick the right Python box and your app runs super fast!" }
          ],
          achievements: [
            { title: "BACKPACK HERO", subtitle: "Mastered Python lists & sets", achievement: "Organized scattered real-world treasures into neat, ordered lists!" },
            { title: "LABEL MASTER", subtitle: "Mastered magic dictionaries", achievement: "Used labeled name-tags so looking up details feels instantly magical!" },
            { title: "SQUAD LEADER", subtitle: "Mastered nested collections", achievement: "Designed an awesome nested data solution for Saksham's teach-back project!" }
          ]
        }
      };
    }

    // 3. Conditionals (Movie Night 18+, Smart Thermostat, Shopping Discount, Pass/Fail, Letter Grades)
    if (text.includes('movie') || text.includes('age') || text.includes('18+') || text.includes('thermostat') || text.includes('discount') || text.includes('condition') || text.includes('if/else') || text.includes('pass mark') || text.includes('grade') || (scene.title || '').toLowerCase().includes('condition') || (scene.title || '').toLowerCase().includes('c1') || (scene.title || '').toLowerCase().includes('c2')) {
      return {
        zone1: {
          systemTitle: (scene.title || "THE SMART DECISION GATEKEEPER").toUpperCase(),
          systemSubtitle: "HOW PYTHON LOGIC GUARDS REAL-WORLD RULES (LIKE CINEMA TICKETS, GRADES, OR COZY ROOMS)",
          tags: ["🎟️ Movie Night Check", "❄️ Smart Room Temp", "🎯 School Grade Finder", "🔀 Yes/No Secret Gate"],
          concepts: [
            { label: "THE RULE GATEKEEPER PUZZLE", desc: "Like a cinema guard checking your age before letting you inside!" },
            { label: "WHY BLIND GUESSING IS RISKY", desc: "Without a Yes/No check, the wrong person gets in every time!" }
          ]
        },
        zone2: {
          tags: ["🔀 Smart IF/ELSE Guard", "⚖️ Symbol Comparers (>=, ==)", "🛡️ Safe Backup Action"],
          concepts: [
            { label: "THE SMART IF-GUARD", desc: "Checks one rule first — like 'Is age >= 18?' — before acting!", badge: "🔀 GATE GUARDIAN" },
            { label: "THE ELIF & ELSE SAFETY LADDER", desc: "Checks each option one by one — 'Else' is the safe fallback door!", badge: "🛡️ SAFETY SHIELD" },
            { label: "MAGIC MATH SYMBOLS", desc: "Use > and == to compare grades, ages, or prices clearly!", badge: "⚖️ RULE DETECTIVE" }
          ]
        },
        zone3: {
          tags: ["🎯 Gate Checked Safely!", "✅ Perfect Decision Won", "🌟 Zero Guessing Errors", "🚀 Smart System Online"],
          concepts: [
            { label: "SMART RULE VICTORY", desc: "Every visitor passes through the correct gate without any errors!" },
            { label: "TRUSTY SCHOOL FRIEND", desc: "Every grade or discount is instantly assigned — 100% accurate!" }
          ],
          achievements: [
            { title: "GATE GUARDIAN", subtitle: "Mastered 'if/elif/else' logic", achievement: "Built a smart decision ladder that evaluates real-world rules in perfect order!" },
            { title: "RULE DETECTIVE", subtitle: "Mastered number comparisons", achievement: "Used easy comparison symbols to check ages, grades, and discounts!" },
            { title: "STORY CHAMPION", subtitle: "Real-world decision winner", achievement: "Solved Saksham's puzzle with crystal-clear, bug-free Python gates!" }
          ]
        }
      };
    }

    // 4. Loops (Birthday App 100x, Rocket Countdown, Guest Greeter, ATM Lockout)
    if ((scene.title || '').toLowerCase().includes('loops') || text.includes('birthday') || text.includes('100 times') || text.includes('rocket') || text.includes('countdown') || text.includes('atm pin') || text.includes('wedding seating')) {
      return {
        zone1: {
          systemTitle: (scene.title || "SUPERPOWERED AUTOMATIC REPEATER").toUpperCase(),
          systemSubtitle: "SENDING 100 BIRTHDAY WISHES OR COUNTING DOWN ROCKETS WITH PYTHON LOOPS",
          tags: ["🎂 100 Birthday Wishes", "🚀 Rocket Countdown", "🛑 Fingers Tired Typing", "🔁 Automatic Repeat Magic"],
          concepts: [
            { label: "THE TIRED FINGERS PUZZLE", desc: "Typing 'Happy Birthday!' 100 times by hand is painful and slow!" },
            { label: "SUPERPOWERED AUTOMATION", desc: "A Python loop tells your computer 'Do this 100 times' instantly!" }
          ]
        },
        zone2: {
          tags: ["🔁 Magic FOR Loop Engine", "🔢 range(100) Step Counter", "⚡ Automatic Super Speed"],
          concepts: [
            { label: "THE REPEAT ENGINE", desc: "A 'for' loop is a robot that does your repeated tasks automatically!", badge: "🔁 LOOP HERO" },
            { label: "NUMBER GENERATOR (RANGE)", desc: "range(100) builds a counting ladder from 0 to 99 automatically!", badge: "🔢 COUNTER STAR" },
            { label: "CLEAN INDENTED BLOCK", desc: "The colon (:) and spaces keep your action safely inside the loop!", badge: "✨ SYNTAX WIZARD" }
          ]
        },
        zone3: {
          tags: ["🎉 100 Wishes Sent!", "⚡ Zero Finger Fatigue", "🌟 Awesome Super Speed", "🚀 Rocket Launched"],
          concepts: [
            { label: "INSTANT BIRTHDAY CELEBRATION", desc: "Your message pops up 100 times instantly — zero typing mistakes!" },
            { label: "AUTOMATIC SUPERPOWER", desc: "The computer repeats every round while you sit back and relax!" }
          ],
          achievements: [
            { title: "LOOP HERO", subtitle: "Mastered automatic 'for' loops", achievement: "Automated a repeating task so it finishes instantly without tired fingers!" },
            { title: "COUNTER STAR", subtitle: "Zero hand counting", achievement: "Let Python handle step counts automatically using magic range numbers!" },
            { title: "STORY CHAMPION", subtitle: "Real-world loop victory", achievement: "Solved Saksham's repeating challenge with super speed and elegance!" }
          ]
        }
      };
    }

    // 5. Generic kid-friendly fallback
    return {
      zone1: {
        systemTitle: (scene.title || "THE EXCITING STORY CODING PUZZLE").toUpperCase(),
        systemSubtitle: "SOLVING THIS SCHOOL STORY ADVENTURE WITH EASY & FUN PYTHON SUPERPOWERS",
        tags: ["🧩 Everyday School Puzzle", "🎮 Fun Strategy Needed", "🛑 Doing by Hand is Slow", "🚀 Smart Python Help"],
        concepts: [
          { label: "THE EVERYDAY PUZZLE", desc: "Doing this by hand is confusing and way too slow!" },
          { label: "WHY PYTHON IS YOUR HERO", desc: "Python turns this story problem into automatic code in seconds!" }
        ]
      },
      zone2: {
        tags: ["🔀 Smart Step Logic", "🛡️ Friendly Safety Guard", "⚡ Automatic Speed"],
        concepts: [
          { label: "SAFETY SHIELD", desc: "Check inputs first so your adventure never crashes or gets stuck!", badge: "🛡️ SAFETY HERO" },
          { label: "SMART DECISION PATH", desc: "Python words guide your story step by step like a board game!", badge: "🏆 STRATEGY LEADER" },
          { label: "ADVENTURE TRACKER", desc: "Track scores and items so your app always knows what's next!", badge: "🔍 EXPLORER STAR" }
        ]
      },
      zone3: {
        tags: ["🎯 Adventure Solved!", "✨ Simple & Fun", "🌟 Smooth Sailing", "🚀 Ready to Share"],
        concepts: [
          { label: "HAPPY VICTORY", desc: "The story challenge finishes cleanly with awesome winning results!" },
          { label: "SUPERPOWER UNLOCKED", desc: "You turned an everyday idea into a real working Python program!" }
        ],
        achievements: [
          { title: "STRATEGY LEADER", subtitle: "Mastered clean step logic", achievement: "Organized your story puzzle clearly so the computer knows exactly how to win!" },
          { title: "SAFETY HERO", subtitle: "Mastered bug protection", achievement: "Used smart Python checks to protect your application from surprises!" },
          { title: "STORY CHAMPION", subtitle: "Solved the challenge", achievement: "Turned Saksham's interactive scenario into awesome, working Python logic!" }
        ]
      }
    };
  }

  const storyFallbacks = getStoryFallbacks(scenario);
  const scenarioText = `Title: ${scenario.title}\nConcepts: ${Array.isArray(scenario.concepts) ? scenario.concepts.join(', ') : (scenario.concepts || '')}\nContext:\n${(scenario.context || '').slice(0, 2000)}`;
  const storyPromptRules = `CRITICAL STORY & VOCABULARY RULES FOR SCHOOL KIDS UNDER CLASS 10 (AGES 10-15):
1. TARGET AUDIENCE & TONE: You are writing specifically for children and school students under Class 10 (ages 10 to 15). Use joyful, enthusiastic, and engaging English! Explain everything like a thrilling adventure story or game puzzle!
2. CONNECT TO EXCITING REAL-WORLD STUDENT EXAMPLES: When describing the Problem Statement (Zone 1) and Coding Tools (Zone 2), relate directly to everyday life examples kids love—such as video game inventories, Marvel superhero squads, Spotify music playlists, sending friends birthday wishes in chat groups, sports rosters, or movie cinema tickets! Connect these directly to the author's exact scenario story!
3. ZERO TOUGH ACADEMIC JARGON: NEVER use confusing college-level engineering words like 'deterministic', 'anomalies', 'encapsulation', 'instantiate', 'override', or 'parameterized'. Instead, use friendly kid-centric words like 'magic locker', 'labeled drawers', 'superpowered loop', 'smart rule guard', 'backpack of items', and 'secret code' so a school child learns effortlessly and feels like a coding hero!`;

  // ── Architect Command 1: Zone 1 (Problem Statement / Story Setup) ────────
  logger.info(`[Gemini ConceptMap] Command 1/3: Designing Zone 1 (Problem Statement) for "${scenario.title}"`);
  const zone1Result = await geminiCall(
    `You are an imaginative storyteller and logic teacher for school kids under Class 10 building Zone 1 (Problem Statement & Story Setup). Return ONLY valid JSON without markdown fencings.\nSchema: {"systemTitle":"string","systemSubtitle":"string","tags":["string","string"],"concepts":[{"label":"string","desc":"string"}]}\n${storyPromptRules}`,
    `Analyze this story case study as it is and return Zone 1 (Problem Statement / Story Setup) tailored for a school student under Class 10:\n- systemTitle & systemSubtitle: ALL-CAPS fun, inspiring story title and subtitle matching the exact scenario provided.\n- tags: 3-4 simple, engaging tags describing the real-world everyday puzzle in this story.\n- concepts: Exactly 2 story cards (ALL-CAPS label, SHORT 1-sentence kid-friendly description MAX 18 WORDS — like 'Without a plan, the crow keeps missing the water!' — simple and punchy!).\nCase study text:\n${scenarioText}\nJSON only.`,
    storyFallbacks.zone1
  );

  // ── Architect Command 2: Zone 2 (Your Coding Tools & How We Solve It) ────────
  await delay(600);
  logger.info(`[Gemini ConceptMap] Command 2/3: Designing Zone 2 (Your Coding Tools)`);
  const zone2Result = await geminiCall(
    `You are a friendly computer science teacher for school kids under Class 10 building Zone 2 (Your Coding Tools & How We Solve It). Return ONLY valid JSON without markdown fencings.\nSchema: {"tags":["string","string"],"concepts":[{"label":"string","desc":"string","badge":"string"}]}\n${storyPromptRules}`,
    `Analyze this story case study as it is and return Zone 2 (Your Coding Tools) tailored for a school student under Class 10:\n- tags: 3 simple, exciting programming tool chips suitable for this scenario (e.g. "🔁 Automatic Loop Engine", "🔀 Smart Rule Guard", "🏷️ Magic Labeled Drawers").\n- concepts: Exactly 3 solution cards (ALL-CAPS label, SHORT 1-sentence explanation MAX 18 WORDS using fun comparisons like backpacks/lockers, and a badge like "LOOP HERO").\nCase study text:\n${scenarioText}\nJSON only.`,
    storyFallbacks.zone2
  );

  // ── Architect Command 3: Zone 3 (What's The Goal / Story Solution) ────────
  await delay(600);
  logger.info(`[Gemini ConceptMap] Command 3/3: Designing Zone 3 (What's The Goal & Rewards)`);
  const zone3Result = await geminiCall(
    `You are an enthusiastic teacher celebrating with school kids under Class 10 building Zone 3 (What's The Goal? Story Solution & Reward). Return ONLY valid JSON without markdown fencings.\nSchema: {"tags":["string"],"concepts":[{"label":"string","desc":"string"}],"achievements":[{"title":"string","subtitle":"string","achievement":"string"}]}\n${storyPromptRules}`,
    `Analyze this story case study as it is and return Zone 3 (What's The Goal & Rewards) tailored for a school student under Class 10:\n- tags: 3-4 joyful celebration chips for finishing this scenario (e.g. "🎉 100 Wishes Sent!", "🛡️ Age Checked Safely", "🌟 Squad Organized").\n- concepts: Exactly 2 happy conclusion cards (ALL-CAPS label, SHORT 1-sentence description MAX 18 WORDS — celebrate how the story ended successfully!).\n- achievements: Exactly 3 unlocked badges explaining in simple words what exciting Python skill was mastered.\nCase study text:\n${scenarioText}\nJSON only.`,
    storyFallbacks.zone3
  );

  const phases = [
    {
      id: "p0",
      label: "PROBLEM STATEMENT (STORY SETUP)",
      theme: "red",
      color: "#ef4444",
      tags: zone1Result.tags || storyFallbacks.zone1.tags,
      concepts: (zone1Result.concepts || storyFallbacks.zone1.concepts).map((c, idx) => ({ ...c, id: `p0c${idx}`, phaseId: "p0", phaseColor: "#ef4444" }))
    },
    {
      id: "p1",
      label: "YOUR CODING TOOLS (HOW WE SOLVE IT)",
      theme: "purple",
      color: "#a855f7",
      tags: zone2Result.tags || storyFallbacks.zone2.tags,
      concepts: (zone2Result.concepts || storyFallbacks.zone2.concepts).map((c, idx) => ({ ...c, id: `p1c${idx}`, phaseId: "p1", phaseColor: "#a855f7" }))
    },
    {
      id: "p2",
      label: "WHAT'S THE GOAL? (STORY SOLUTION & REWARD)",
      theme: "green",
      color: "#10b981",
      tags: zone3Result.tags || storyFallbacks.zone3.tags,
      concepts: (zone3Result.concepts || storyFallbacks.zone3.concepts).map((c, idx) => ({ ...c, id: `p2c${idx}`, phaseId: "p2", phaseColor: "#10b981" }))
    }
  ];

  logger.info(`[Gemini ConceptMap] Completed multi-step visual story dashboard cleanly!`);
  return {
    title: zone1Result.systemTitle || storyFallbacks.zone1.systemTitle,
    subtitle: zone1Result.systemSubtitle || storyFallbacks.zone1.systemSubtitle,
    phases,
    achievements: zone3Result.achievements || storyFallbacks.zone3.achievements
  };
}

async function explainConceptWithGemini(topic, context = '') {
  return await geminiCall(
    'You are an enthusiastic computer science teacher explaining Python code to school students under Class 10 (ages 10 to 15) in a fun, exciting adventure style. Return ONLY valid JSON without markdown fencings.\nSchema: {"title":"string","oneLineSummary":"string","simpleAnalogy":"string","keyVisualPoints":["string","string","string"],"pseudoCode":"string"}',
    `Explain the computer science/Python concept: "${topic}" ${context ? `(in the context of this story: ${context})` : ''} for a school kid under Class 10.\nCRITICAL RULES FOR SCHOOL STUDENTS (AGES 10-15):\n1) oneLineSummary: A joyful, ultra-clear summary a school student can understand instantly (max 15 words).\n2) simpleAnalogy: An awesome real-world comparison kids love (like video game inventories, Marvel superhero squads, Spotify music playlists, labeled backpacks, or sports matches) that makes it click immediately!\n3) keyVisualPoints: Exactly 3 fun bullet points starting with colorful emojis explaining how this Python tool works.\n4) pseudoCode: Super clear, welcoming before/after or simple Python code demonstrating how it works without boring academic text. Make it look like a fun puzzle!`
  );
}

async function generateSkeletonWithGemini(scenario) {
  const title = scenario?.title || 'Interactive Case Study';
  const content = scenario?.description || scenario?.scenario || scenario?.content || '';
  return await geminiCall(
    'You are an engaging Computer Science educator designing a "Skeleton Code Scanner" for Class 9 and 10 students. Your goal is to map a real-world story to coding logic. The tone should be smart, accessible, and balanced—no walls of text, but enough detail to teach real concepts. Return ONLY valid JSON matching the exact schema.',
    `Task: Break down the provided case study into exactly 6 chronological steps. For each step, you must provide data for three specific columns:
Column 1: Narrative Skeleton (The Story Flow)
Write exactly 1 or 2 short, punchy sentences describing what is happening in the actual story at this step. Make sure to name characters, objects, and specific events so it is instantly recognizable which story this is!
Column 2: Interactive Timeline (The Bone Scan)
Provide a 2 to 4-word action label for this step (e.g., "Add Initial Layers", "Error Detected", "Condition Check", "Repeat Loop").
Column 3: Code Logic Scan (The Coding Part)
Code: Write 1 or 2 lines of simple, highly readable Python-style pseudo-code that matches the story step (e.g., cake_stack.pop(), while mistake_present:, status = "ready"). Keep variables readable and tied directly to the story items.
Explanation: Write exactly 1 short sentence explaining what the code is doing in plain English.

Case Study Title: "${title}"
Case Study Content: "${content}"

Extract the following specific layers in strictly valid JSON format:
{
  "title": "SKELETON CODE SCANNER: [STORY TITLE & PYTHON CONCEPT]",
  "themeIcons": ["emoji1", "emoji2 (Pick two distinct emojis representing the story theme, e.g. ['🎂', '👨‍🍳'] for bakery, ['🚀', '⭐'] for space)"],
  "coreNodes": {
    "mainCharacter": "[Main Character] (Name and role in the story)",
    "bigProblem": "[Big Problem] (What challenge needs solving in this story)",
    "cleverAction": "[Clever Action] (How Python logic solves it in story context)",
    "happyEnding": "[Happy Ending] (The story's successful resolution)"
  },
  "actorActionMatrix": [],
  "storyChain": [],
  "rows": [
    {
      "step": 1,
      "nodeLabel": "Node 1:",
      "nodeIcon": "📦",
      "nodeText": "1-2 punchy sentences describing initial story setup and problem arrival.",
      "timelineTitle": "Start/\nVariables",
      "timelineType": "start",
      "codeSnippet": "variable = initial_val\\ngoal = target_val",
      "codeTitle": "Setting variables:",
      "codeDesc": "1 short plain English sentence explaining variable setup."
    },
    {
      "step": 2,
      "nodeLabel": "Node 2:",
      "nodeIcon": "👁️",
      "nodeText": "1-2 punchy sentences describing checking the condition or rule in the story.",
      "timelineTitle": "Condition\nCheck/\nThe Rule",
      "timelineType": "condition",
      "codeSnippet": "while condition_not_met:",
      "codeTitle": "The Safety Check:",
      "codeDesc": "1 short plain English sentence explaining the condition check."
    },
    {
      "step": 3,
      "nodeLabel": "Node 3:",
      "nodeIcon": "⚙️",
      "nodeText": "1-2 punchy sentences describing the main action performed in the story.",
      "timelineTitle": "Action/\nEngine",
      "timelineType": "action",
      "codeSnippet": "action_item.execute()",
      "codeTitle": "Action Engine:",
      "codeDesc": "1 short plain English sentence explaining the code action."
    },
    {
      "step": 4,
      "nodeLabel": "Node 4:",
      "nodeIcon": "✨",
      "nodeText": "1-2 punchy sentences describing the resulting change or state update in the story.",
      "timelineTitle": "Effect/\nUpdate",
      "timelineType": "effect",
      "codeSnippet": "state = state + progress",
      "codeTitle": "State Update:",
      "codeDesc": "1 short plain English sentence explaining how state updates."
    },
    {
      "step": 5,
      "nodeLabel": "Node 5:",
      "nodeIcon": "🔄",
      "nodeText": "1-2 punchy sentences describing repeating the check until the goal is achieved.",
      "timelineTitle": "Repeat\nCheck",
      "timelineType": "repeat",
      "codeSnippet": "# Jump back to Step 2 rules\\ncontinue",
      "codeTitle": "Loop Cycle:",
      "codeDesc": "1 short plain English sentence explaining automatic looping."
    },
    {
      "step": 6,
      "nodeLabel": "Node 6:",
      "nodeIcon": "🏁",
      "nodeText": "1-2 punchy sentences describing the final celebratory outcome of the story!",
      "timelineTitle": "Finish\nGoal",
      "timelineType": "finish",
      "codeSnippet": "print(\"Mission completed successfully!\")",
      "codeTitle": "Mission Completed!",
      "codeDesc": "1 short plain English sentence explaining loop exit and success."
    }
  ]
}
Ensure the output is 100% valid JSON without markdown formatting or commentary.`
  );
}

module.exports = { generateScenarioWithGemini, generateConceptTreeWithGemini, generateConceptMapWithGemini, explainConceptWithGemini, generateSkeletonWithGemini };

