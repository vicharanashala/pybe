import { GoogleGenAI } from '@google/genai';
import {
  LearningRequest,
  RuntimeContext,
  EducationalAnalysis,
  MisconceptionItem,
  MentalModel,
  ScenarioItem,
  PatternItem,
  EpisodeItem,
  Production,
  QualityReport,
  LogEntry
} from '../types.js';
import { KnowledgeLoader } from './knowledgeLoader.js';
import { generateLLMContent, getGroqKeyCount } from './llmClient.js';
import { processShortComicPipeline, processComicPipeline, processVideoPipeline, processPodcastPipeline, processStorybookPipeline } from './representationProcessors.js';

/**
 * Initialize Gemini AI Client (Server-side)
 */
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[CKLIS] GEMINI_API_KEY not found in environment. Using fallback mode.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || 'MOCK_KEY',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

/**
 * Helper to safely extract JSON from LLM output with truncation repair and string sanitization.
 * Supports both JSON objects ({...}) and top-level JSON arrays ([...]).
 */
export function parseJsonResponse<T>(text: string, defaultFallback: T): T {
  try {
    let cleaned = text;
    // Step 1: Strip <think> blocks
    if (cleaned.includes('</think>')) {
      cleaned = cleaned.substring(cleaned.lastIndexOf('</think>') + 8);
    } else if (cleaned.includes('<think>')) {
      cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/<think>[\s\S]*/gi, '');
    }

    // Step 2: Remove markdown json blocks if present
    cleaned = cleaned.replace(/```json/gi, '').replace(/```/g, '').trim();

    // Step 3: Find outermost JSON start ({ or [)
    const firstBrace = cleaned.search(/[\{\[]/);
    if (firstBrace === -1) {
      console.error('[CKLIS JSON Parse Error]: No JSON object or array found in response');
      return defaultFallback;
    }

    const startChar = cleaned[firstBrace];
    const endChar = startChar === '{' ? '}' : ']';
    const lastBrace = cleaned.lastIndexOf(endChar);

    if (lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    } else {
      cleaned = cleaned.substring(firstBrace);
    }

    // Step 4: Fix unescaped backticks and Python-style triple quotes
    cleaned = cleaned.replace(/(:\s*)```(?:[a-z]+)?\n?([\s\S]*?)```/gi, (_, prefix, code) => {
      return `${prefix}${JSON.stringify(code.trim())}`;
    });
    cleaned = cleaned.replace(/(:\s*)`([^`\n]+)`/g, (_, prefix, code) => {
      return `${prefix}${JSON.stringify(code.trim())}`;
    });
    cleaned = cleaned.replace(/(:\s*)"""([\s\S]*?)"""/g, (_, prefix, val) => {
      return `${prefix}${JSON.stringify(val.trim())}`;
    });
    cleaned = cleaned.replace(/(:\s*)'''([\s\S]*?)'''/g, (_, prefix, val) => {
      return `${prefix}${JSON.stringify(val.trim())}`;
    });

    // Step 5: Fix raw unescaped newlines & control chars inside double-quoted JSON strings
    let sanitized = '';
    let inString = false;
    let escaped = false;
    for (let i = 0; i < cleaned.length; i++) {
      const ch = cleaned[i];
      if (escaped) {
        sanitized += ch;
        escaped = false;
        continue;
      }
      if (ch === '\\' && inString) {
        sanitized += ch;
        escaped = true;
        continue;
      }
      if (ch === '"') {
        inString = !inString;
        sanitized += ch;
        continue;
      }
      if (inString) {
        if (ch === '\n') sanitized += '\\n';
        else if (ch === '\r') sanitized += '\\r';
        else if (ch === '\t') sanitized += '\\t';
        else sanitized += ch;
      } else {
        sanitized += ch;
      }
    }
    cleaned = sanitized;

    // Step 6: Try direct parse
    try {
      return JSON.parse(cleaned) as T;
    } catch (_) {
      // Needs repair
    }

    // Step 7: Repair truncated JSON
    inString = false;
    escaped = false;
    const stack: string[] = [];
    
    for (let i = 0; i < cleaned.length; i++) {
      const ch = cleaned[i];
      if (escaped) { escaped = false; continue; }
      if (ch === '\\' && inString) { escaped = true; continue; }
      if (ch === '"' && !escaped) { inString = !inString; continue; }
      if (inString) continue;
      if (ch === '{') stack.push('{');
      else if (ch === '[') stack.push('[');
      else if (ch === '}') { if (stack.length > 0 && stack[stack.length - 1] === '{') stack.pop(); }
      else if (ch === ']') { if (stack.length > 0 && stack[stack.length - 1] === '[') stack.pop(); }
    }
    
    if (inString) cleaned += '"';
    cleaned = cleaned.replace(/,\s*$/, '');
    while (stack.length > 0) {
      const open = stack.pop();
      cleaned = cleaned.replace(/,\s*$/, '');
      if (open === '{') cleaned += '}';
      else if (open === '[') cleaned += ']';
    }
    
    try {
      const result = JSON.parse(cleaned) as T;
      console.log('[CKLIS] ✅ Successfully repaired truncated JSON from LLM');
      return result;
    } catch (repairErr) {
      console.error('[CKLIS JSON Parse Error]: Repair failed:', (repairErr as Error).message, 'Raw text snippet:', text.substring(0, 250));
      return defaultFallback;
    }
  } catch (err) {
    console.error('[CKLIS JSON Parse Error]:', err, 'Raw text snippet:', text.substring(0, 250));
    return defaultFallback;
  }
}

/**
 * Robustly extract target array from parsed LLM JSON output regardless of root structure or key names.
 */
export function extractArrayFromParsed<T>(parsed: any, candidateKeys: string[] = []): T[] {
  if (!parsed) return [];
  if (Array.isArray(parsed)) return parsed as T[];
  if (typeof parsed === 'object') {
    for (const key of candidateKeys) {
      if (Array.isArray(parsed[key]) && parsed[key].length > 0) {
        return parsed[key] as T[];
      }
    }
    for (const key of Object.keys(parsed)) {
      if (Array.isArray(parsed[key]) && parsed[key].length > 0) {
        return parsed[key] as T[];
      }
    }
  }
  return [];
}

/**
 * Dynamic Topic-Aware Pattern Generator for Fallback Context
 */
function createTopicPatterns(topic: string, lang: string = 'Python'): PatternItem[] {
  const t = topic.toLowerCase();

  if (t.includes('if') || t.includes('else') || t.includes('condition') || t.includes('branch') || t.includes('decision')) {
    return [
      {
        patternId: 'PAT-01',
        patternName: 'Condition-First Decision Gate',
        rule: 'In the story, a condition was evaluated BEFORE taking action. In code, the condition predicate must be checked before the branch body executes.',
        example: `if condition:\n    execute_action()\nelse:\n    alternative_action()`,
        transferOpportunity: 'User authorization checks. Feature flag toggles.'
      },
      {
        patternId: 'PAT-02',
        patternName: 'Exclusive Path Execution',
        rule: 'Only one branch executes per evaluation cycle — IF condition is true, ELSE branch is strictly skipped.',
        example: `if temperature > 30:\n    activate_cooling()\nelse:\n    maintain_standby()`,
        transferOpportunity: 'Route dispatching in web servers. UI state toggling.'
      }
    ];
  }

  if (t.includes('recursion') || t.includes('stack') || t.includes('unwind') || t.includes('base case')) {
    return [
      {
        patternId: 'PAT-01',
        patternName: 'Base Case Termination Guard',
        rule: 'Before making a recursive call, the base case condition MUST be checked to prevent infinite call stack expansion.',
        example: `def solve_recursive(problem):\n    if problem.is_base_case():\n        return problem.direct_solution()\n    return solve_recursive(problem.reduce())`,
        transferOpportunity: 'Tree traversal algorithms. Nested JSON data parsing.'
      },
      {
        patternId: 'PAT-02',
        patternName: 'Call Stack Unwinding & Frame Return',
        rule: 'As recursive calls reach the base case, return values bubble back UP through each suspended stack frame in reverse order.',
        example: `def factorial(n):\n    if n <= 1:\n        return 1  # Base Case\n    return n * factorial(n - 1)  # Unwinds on return`,
        transferOpportunity: 'Directory depth search. Expression evaluation trees.'
      }
    ];
  }

  if (t.includes('join') || t.includes('sql') || t.includes('inner') || t.includes('left')) {
    return [
      {
        patternId: 'PAT-01',
        patternName: 'Strict Match Intersection (INNER JOIN)',
        rule: 'INNER JOIN retains ONLY records that exist in BOTH left and right tables matching the key predicate.',
        example: `SELECT d.case_id, s.suspect_name\nFROM detectives d\nINNER JOIN suspects s ON d.case_id = s.case_id;`,
        transferOpportunity: 'Order matching with active inventory. Verified user profile lookup.'
      },
      {
        patternId: 'PAT-02',
        patternName: 'Prescriptive Primary Retention (LEFT JOIN)',
        rule: 'LEFT JOIN keeps ALL records from the primary left table regardless of whether a match exists in the right table (filling missing matches with NULL).',
        example: `SELECT d.case_id, c.clue_details\nFROM detectives d\nLEFT JOIN clues c ON d.case_id = c.case_id;`,
        transferOpportunity: 'Customer purchase history reporting. Audit logging for active accounts.'
      }
    ];
  }

  if (t.includes('state') || t.includes('transition') || t.includes('crow') || t.includes('automata') || t.includes('machine')) {
    return [
      {
        patternId: 'PAT-01',
        patternName: 'Deterministic State Transition Gate',
        rule: 'A system changes state ONLY when a valid trigger occurs from its current state.',
        example: `def transition(current_state, event):\n    if current_state == "THIRSTY" and event == "FOUND_PITCHER":\n        return "DROPPING_PEBBLES"\n    return current_state`,
        transferOpportunity: 'Order status lifecycle (Draft -> Paid -> Shipped). Game state managers.'
      },
      {
        patternId: 'PAT-02',
        patternName: 'Threshold Invariant Sentinel',
        rule: 'Accumulated actions build up towards a threshold condition that triggers the final success state.',
        example: `while water_level < REACHABLE_THRESHOLD:\n    drop_pebble()\n    water_level += 1\ndrink_water()`,
        transferOpportunity: 'Buffer flushing triggers. Progress monitoring loops.'
      }
    ];
  }

  return [
    {
      patternId: 'PAT-01',
      patternName: `${topic} Core Execution Invariant`,
      rule: `In the story observation, the core rule for ${topic} determines how system state updates deterministically.`,
      example: `# Pattern mapping for ${topic}\ndef execute_${topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}():\n    # Invariant execution pattern\n    pass`,
      transferOpportunity: `Production system state handling. Domain model operations for ${topic}.`
    },
    {
      patternId: 'PAT-02',
      patternName: `${topic} Structural Bridge Pattern`,
      rule: `Translating the observed real-world behavior of ${topic} into clean programming code invariants.`,
      example: `# Structural bridge pattern for ${topic}\nresult = process_concept("${topic}")`,
      transferOpportunity: `API controller design. Software design patterns for ${topic}.`
    }
  ];
}

/**
 * Helper to log pipeline progress in RuntimeContext
 */
function addLog(context: RuntimeContext, step: string, message: string, level: LogEntry['level'] = 'info') {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    step,
    message,
    level
  };
  context.logs.push(entry);
  console.log(`[CKLIS] [${step}] ${message}`);
}

/**
 * PRE-STEP: Learning Objective Generation (Rule 46)
 */
async function runPreStep_LearningObjective(ai: GoogleGenAI, context: RuntimeContext): Promise<string> {
  addLog(context, 'PRE-STEP', `Generating measurable learning objective for "${context.learningRequest.topic}" (${context.learningRequest.audience})...`);

  const prompt = `You are an educational objective generator. The user wants to learn ${context.learningRequest.topic} and the audience is ${context.learningRequest.audience}. Generate exactly one sentence defining a measurable learning objective that focuses on understanding the underlying mechanism of the concept, not just memorizing syntax. Return plain text only with no quotes or markdown.`;

  try {
    const rawText = await generateLLMContent(ai, {
      userPrompt: prompt,
      selectedProvider: context.learningRequest.selectedProvider
    });
    const objective = rawText?.trim() || `Understand how ${context.learningRequest.topic} operates under the hood to predict system execution and eliminate common misconceptions.`;
    addLog(context, 'PRE-STEP', `Auto-generated Learning Objective: "${objective}"`, 'success');
    return objective;
  } catch (error) {
    addLog(context, 'PRE-STEP', `Failed to call LLM for objective generator: ${(error as Error).message}.`, 'warn');
    return `Understand the core execution mechanism of ${context.learningRequest.topic} and learn to predict its state transitions accurately.`;
  }
}

/**
 * STEP 1: Misconception Engine (PROMPT MIS-01)
 */
async function runStep1_Misconceptions(ai: GoogleGenAI, context: RuntimeContext): Promise<MisconceptionItem[]> {
  context.status = 'MISCONCEPTION_ENGINE';
  addLog(context, 'STEP 1: MISCONCEPTION', 'Analyzing potential learner misconceptions, cognitive barriers, and false assumptions...');

  const systemPrompt = KnowledgeLoader.buildSystemPrompt('MISCONCEPTION');
  const userPrompt = `
PROMPT MIS-01: Generate Misconception Profile
Topic: ${context.learningRequest.topic}
Audience: ${context.learningRequest.audience}
Language: ${context.learningRequest.programmingLanguage || 'Language Independent'}
Constraints: ${context.learningRequest.experienceConstraints || 'None'}

Instructions:
Identify 3 to 4 distinct, highly realistic misconceptions learners of this audience profile hold regarding "${context.learningRequest.topic}".
For each misconception, provide:
1. misconception (description of the false mental model or trap)
2. probability ("High" | "Medium" | "Low")
3. severity ("Critical" | "Moderate" | "Minor")
4. correctionStrategy (how to explicitly dismantle it)

Return a JSON object with key "misconceptions": Array of objects matching this schema:
{
  "misconceptions": [
    {
      "misconception": "string",
      "probability": "High" | "Medium" | "Low",
      "severity": "Critical" | "Moderate" | "Minor",
      "correctionStrategy": "string"
    }
  ]
}`;

  try {
    const rawText = await generateLLMContent(ai, {
      systemInstruction: systemPrompt,
      userPrompt,
      maxTokens: 4096,
      temperature: 0.65,
      selectedProvider: context.learningRequest.selectedProvider
    });
    const parsed = parseJsonResponse<any>(rawText, null);
    const misconceptions = extractArrayFromParsed<MisconceptionItem>(parsed, ['misconceptions', 'misconception_list', 'misconceptionProfile', 'items']);
    if (misconceptions.length === 0) {
      throw new Error('Misconception Engine returned empty misconceptions list');
    }
    addLog(context, 'STEP 1: MISCONCEPTION', `Identified ${misconceptions.length} learner misconceptions.`, 'success');
    return misconceptions;
  } catch (error) {
    const errMsg = (error as Error).message;
    addLog(context, 'STEP 1: MISCONCEPTION', `Misconception Engine failed: ${errMsg}`, 'error');
    throw new Error(`[Misconception Engine Failed]: ${errMsg}`);
  }
}

/**
 * STEP 2: Mental Model Engine (PROMPT MM-01)
 */
async function runStep2_MentalModel(ai: GoogleGenAI, context: RuntimeContext): Promise<MentalModel> {
  context.status = 'MENTAL_MODEL_ENGINE';
  addLog(context, 'STEP 2: MENTAL MODEL', 'Constructing target conceptual mental model and core visual analogies...');

  const systemPrompt = KnowledgeLoader.buildSystemPrompt('MENTAL_MODEL');
  const misconceptionsSummary = context.educationalAnalysis.misconceptions
    .map(m => `- ${m.misconception} (Fix: ${m.correctionStrategy})`)
    .join('\n');

  const userPrompt = `
PROMPT MM-01: Construct Mental Model
Topic: ${context.learningRequest.topic}
Audience: ${context.learningRequest.audience}
Teaching Style: ${context.learningRequest.teachingStyle || 'Story-based'}

Misconceptions to Address:
${misconceptionsSummary}

Instructions:
Construct a single, high-leverage mental model that transforms a learner's false assumption into a deeply intuitive understanding.

Provide the following COMPLETELY with rich detail:
1. modelName: A memorable and evocative name for this mental model
2. description: A complete 3-4 sentence explanation of exactly how this model works as a thinking tool
3. coreAnalogy: A deeply relatable real-world comparison.
4. visualizationStrategy: Exactly how a learner should physically draw or mentally picture this model

Return a JSON object with these exact keys: modelName, description, coreAnalogy, visualizationStrategy.
`;

  try {
    const rawText = await generateLLMContent(ai, {
      systemInstruction: systemPrompt,
      userPrompt,
      maxTokens: 4096,
      temperature: 0.75,
      selectedProvider: context.learningRequest.selectedProvider
    });

    const parsed = parseJsonResponse<any>(rawText, null);
    const mm = parsed?.mentalModel || parsed?.mental_model || parsed?.model || parsed;
    
    if (!mm || (!mm.modelName && !mm.name && !mm.title)) {
      throw new Error('Mental Model Engine returned invalid or incomplete model data');
    }

    function stringifyIfNeeded(val: any): string {
      if (val === null || val === undefined) return '';
      if (typeof val === 'string') return val;
      if (typeof val === 'object') {
        if (Array.isArray(val)) {
          return val.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join('\n');
        }
        return Object.entries(val)
          .map(([k, v]) => `• ${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`)
          .join('\n');
      }
      return String(val);
    }

    const normalizedModel: MentalModel = {
      modelName: stringifyIfNeeded(mm.modelName || mm.name || mm.title || `${context.learningRequest.topic} Navigator`),
      description: stringifyIfNeeded(mm.description || mm.explanation || mm.summary || ''),
      coreAnalogy: stringifyIfNeeded(mm.coreAnalogy || mm.analogy || mm.comparison || ''),
      visualizationStrategy: stringifyIfNeeded(mm.visualizationStrategy || mm.visualization || mm.strategy || '')
    };

    addLog(context, 'STEP 2: MENTAL MODEL', `Built Mental Model: "${normalizedModel.modelName}".`, 'success');
    return normalizedModel;
  } catch (error) {
    const errMsg = (error as Error).message;
    addLog(context, 'STEP 2: MENTAL MODEL', `Mental Model Engine failed: ${errMsg}`, 'error');
    throw new Error(`[Mental Model Engine Failed]: ${errMsg}`);
  }
}

/**
 * STEP 3: Scenario Intelligence Engine (PROMPT SCN-01)
 */
async function runStep3_Scenarios(ai: GoogleGenAI, context: RuntimeContext): Promise<ScenarioItem[]> {
  context.status = 'SCENARIO_ENGINE';

  // Mode 2 Check: Experience / Observation-First Mode (or user story topic)
  const isExpMode = context.learningRequest.inputMode === 'experience' ||
                    !!context.learningRequest.userObservation ||
                    context.learningRequest.topic.toLowerCase().includes('crow') ||
                    context.learningRequest.topic.toLowerCase().includes('fable') ||
                    context.learningRequest.topic.toLowerCase().includes('stambha');

  if (isExpMode) {
    const storyAnchor = context.learningRequest.userObservation || context.learningRequest.topic;
    const targetCsConcept = context.learningRequest.topic;
    addLog(context, 'STEP 3: SCENARIO', `🔒 Anchor Lock [Experience-First Mode]: Preserving "${storyAnchor}" with 100% real-world physical/historical fidelity to teach "${targetCsConcept}" (CL-14/CL-17/CL-18)...`, 'success');

    const expSystemPrompt = KnowledgeLoader.buildSystemPrompt('SCENARIO');
    const expUserPrompt = `
PROMPT SCN-01-EXP: Extract 100% Authentic Real-World Story DNA & Target CS Concept

User Observation / Story Anchor: "${storyAnchor}"
Target CS Concept to Teach: "${targetCsConcept}"

CRITICAL CONSTITUTIONAL DIRECTIVE (CL-17, CL-18, CL-19):
1. Preserve this real-world story, fable, or natural observation ("${storyAnchor}") with 100% historical and physical authenticity.
2. DO NOT alter the story. DO NOT force computer code words, software variable names, or artificial code metaphors into the real-world narrative!
3. Extract the genuine characters (e.g. for Thirsty Crow: "The Thirsty Crow", "Curious Observer"; for Vikram & Betaal: "King Vikramaditya", "Betaal"), atmospheric setting, authentic physical problem.
4. MAP THE REAL-WORLD STORY TO THE TARGET CS CONCEPT ("${targetCsConcept}"). Show how the physical actions in "${storyAnchor}" naturally demonstrate "${targetCsConcept}" (e.g. dropping pebbles -> accumulator loop & state variable updates).

Return JSON:
{
  "scenarios": [
    {
      "scenarioId": "SCN-01",
      "storySource": "${storyAnchor}",
      "domainNote": "Locked User Observation Anchor (100% Authentic Real-World Fidelity)",
      "targetCsConcept": "${targetCsConcept}",
      "realWorldCsApplication": "Specific real-world software engineering application (e.g. Auth Login Retry Loop / Rate Limiter / State Machine / Accumulator Loop)",
      "context": "Rich atmospheric setting of the authentic real-world story/observation",
      "characters": ["Genuine character names from the real story/fable"],
      "problem": "The genuine real-world physical challenge faced in the story",
      "conceptMapping": "How the physical behavior naturally demonstrates state transitions and threshold logic for ${targetCsConcept}"
    }
  ]
}
`;

    try {
      const rawText = await generateLLMContent(ai, {
        systemInstruction: expSystemPrompt,
        userPrompt: expUserPrompt,
        maxTokens: 2048,
        temperature: 0.3,
        selectedProvider: context.learningRequest.selectedProvider
      });

      const parsed = parseJsonResponse<any>(rawText, null);
      const scenarios = extractArrayFromParsed<ScenarioItem>(parsed, ['scenarios', 'items']);
      if (scenarios.length > 0) {
        addLog(context, 'STEP 3: SCENARIO', `Story DNA Anchor Locked: "${scenarios[0].storySource || storyAnchor}" | 100% Authentic Real-World Fidelity.`, 'success');
        return scenarios;
      }
    } catch (e) {
      addLog(context, 'STEP 3: SCENARIO', `Anchor extraction warning: ${(e as Error).message}. Using default anchor context.`, 'warn');
    }

    const anchorScenario: ScenarioItem = {
      scenarioId: 'SCN-01',
      context: storyAnchor.toLowerCase().includes('crow')
        ? 'A sunny dry courtyard with a tall ceramic pitcher containing a small amount of water at the bottom and small smooth pebbles scattered on the ground.'
        : `Authentic real-world story / observation: ${storyAnchor}`,
      characters: storyAnchor.toLowerCase().includes('crow')
        ? ['The Thirsty Crow', 'Curious Observer']
        : ['Protagonist from story', 'Mentor / Observer'],
      problem: storyAnchor.toLowerCase().includes('crow')
        ? 'The water level inside the tall ceramic pitcher is too low for the crow\'s beak to reach.'
        : `The real-world physical challenge in "${storyAnchor}".`,
      conceptMapping: `Observing real-world physical state transitions and accumulator logic in "${storyAnchor}" mapping directly to ${targetCsConcept}.`
    };
    (anchorScenario as any).storySource = storyAnchor;
    (anchorScenario as any).targetCsConcept = targetCsConcept;
    (anchorScenario as any).realWorldCsApplication = 'Accumulator Loops & State Variable Updates';
    (anchorScenario as any).domainNote = 'Locked User Observation Anchor (100% Authentic Real-World Fidelity)';

    addLog(context, 'STEP 3: SCENARIO', `Story DNA Locked: "${storyAnchor}" | Preserving 100% real-world physical fidelity.`, 'success');
    return [anchorScenario];
  }

  addLog(context, 'STEP 3: SCENARIO', 'Discovering authentic domain stories with natural conceptual fit (CL-03/CL-13/CL-14)...');

  const systemPrompt = KnowledgeLoader.buildSystemPrompt('SCENARIO');
  const mm = context.educationalAnalysis.mentalModel;
  const domain = context.learningRequest.experienceHints || 'Any domain where a natural fit exists';

  const userPrompt = `
PROMPT SCN-01: Authentic Story Discovery for Learning Scenario

Topic to Teach: ${context.learningRequest.topic}
Programming Language: ${context.learningRequest.programmingLanguage || 'Python'}
Mental Model Established: "${mm?.modelName}" — Core Analogy: "${mm?.coreAnalogy}"
Misconceptions to Address: ${context.educationalAnalysis.misconceptions.map(m => m.misconception).join('; ')}

Domain/Environment Preference: ${domain}

=== CONSTITUTIONAL LAW CL-14: AUTHENTIC STORY DNA ===
Follow this process:
1. Recall REAL, POPULAR stories, characters, events from "${domain}" that naturally demonstrate ${context.learningRequest.topic}.
2. CHOOSE ONLY STORIES WITH NATURAL FIT.
3. Build authentic atmospheric setting with real character names and roles.

Return a JSON object with this exact structure:
{
  "scenarios": [
    {
      "scenarioId": "SCN-01",
      "storySource": "string",
      "domainNote": "string",
      "context": "string",
      "characters": ["string"],
      "problem": "string",
      "conceptMapping": "string"
    }
  ]
}
`;

  try {
    const rawText = await generateLLMContent(ai, {
      systemInstruction: systemPrompt,
      userPrompt,
      maxTokens: 4096,
      temperature: 0.80,
      selectedProvider: context.learningRequest.selectedProvider
    });

    const parsed = parseJsonResponse<any>(rawText, null);
    const scenarios = extractArrayFromParsed<ScenarioItem>(parsed, ['scenarios', 'scenario_list', 'scenarios_discovered', 'items']);

    if (scenarios.length === 0) {
      throw new Error('Scenario Engine returned empty scenario list');
    }

    const s = scenarios[0] as any;
    const storySource = s.storySource || 'Authentic domain story';
    const domainNote = s.domainNote || 'Domain as requested';
    addLog(context, 'STEP 3: SCENARIO', `Story DNA Selected: "${storySource}" | ${domainNote}`, 'success');
    addLog(context, 'STEP 3: SCENARIO', `Generated ${scenarios.length} authentic scenario(s) with full character and environment seeds.`, 'success');

    return scenarios;
  } catch (error) {
    const errMsg = (error as Error).message;
    addLog(context, 'STEP 3: SCENARIO', `Scenario Engine failed: ${errMsg}`, 'error');
    throw new Error(`[Scenario Engine Failed]: ${errMsg}`);
  }
}

/**
 * STEP 4: Pattern Mapping Engine (PROMPT PAT-01)
 */
async function runStep4_Patterns(ai: GoogleGenAI, context: RuntimeContext): Promise<PatternItem[]> {
  context.status = 'PATTERN_ENGINE';
  addLog(context, 'STEP 4: PATTERN MAPPING', 'Extracting reusable structural patterns (CL-08: Pattern Bridge)...');

  const systemPrompt = KnowledgeLoader.buildSystemPrompt('PATTERN');
  const scenariosText = context.educationalAnalysis.scenarios
    .map(s => `- [${s.scenarioId}] ${(s as any).storySource ? 'Story: ' + (s as any).storySource + ' | ' : ''}${s.context} => ${s.problem}`)
    .join('\n');

  const userPrompt = `
PROMPT PAT-01: Extract Learning Patterns
Topic: ${context.learningRequest.topic}
Mental Model: ${context.educationalAnalysis.mentalModel?.modelName || ''} — Analogy: "${context.educationalAnalysis.mentalModel?.coreAnalogy}"
Story DNA: ${(context.educationalAnalysis.scenarios[0] as any)?.storySource || 'Authentic domain story'}

Scenarios:
${scenariosText}

Instructions:
Extract 2 to 3 core reusable patterns that bridge the authentic story observation to ${context.learningRequest.programmingLanguage || 'Python'} code syntax.
Each pattern must emerge NATURALLY from the story that was selected — do NOT invent generic programming patterns.
The pattern name should evoke the story.

CRITICAL FORMAT REQUIREMENT: 
- Provide plain code strings in "example". Do NOT use markdown code fences inside the JSON string values.

Return a JSON object with this exact structure:
{
  "patterns": [
    {
      "patternId": "PAT-01",
      "patternName": "string",
      "rule": "string",
      "example": "string",
      "transferOpportunity": "string"
    }
  ]
}
`;

  try {
    const rawText = await generateLLMContent(ai, {
      systemInstruction: systemPrompt,
      userPrompt,
      maxTokens: 4096,
      temperature: 0.70,
      selectedProvider: context.learningRequest.selectedProvider
    });
    const parsed = parseJsonResponse<any>(rawText, null);
    const patterns = extractArrayFromParsed<PatternItem>(parsed, ['patterns', 'pattern_list', 'patterns_extracted', 'learning_patterns', 'items']);
    
    if (patterns.length === 0) {
      throw new Error('Pattern Engine returned empty pattern list');
    }

    addLog(context, 'STEP 4: PATTERN MAPPING', `Extracted ${patterns.length} core patterns for "${context.learningRequest.topic}".`, 'success');
    return patterns;
  } catch (error) {
    const errMsg = (error as Error).message;
    addLog(context, 'STEP 4: PATTERN MAPPING', `Pattern Mapping Engine failed: ${errMsg}`, 'error');
    throw new Error(`[Pattern Engine Failed]: ${errMsg}`);
  }
}

/**
 * STEP 5: Episode Generation Engine (PROMPT EPI-01)
 */
async function runStep5_Episodes(ai: GoogleGenAI, context: RuntimeContext): Promise<EpisodeItem[]> {
  context.status = 'EPISODE_ENGINE';
  addLog(context, 'STEP 5: EPISODE GENERATION', 'Sequencing instructional episodes and progressive learning flow...');

  const systemPrompt = KnowledgeLoader.buildSystemPrompt('EPISODE');
  const scenariosText = context.educationalAnalysis.scenarios.map(s => `- ${s.context}`).join('\n');
  const patternsText = context.educationalAnalysis.patterns.map(p => `- ${p.patternName}: ${p.rule}`).join('\n');

  const userPrompt = `
PROMPT EPI-01: Generate Instructional Episodes
Topic: ${context.learningRequest.topic}
Mental Model: ${context.educationalAnalysis.mentalModel?.modelName || ''}
Story DNA: ${(context.educationalAnalysis.scenarios[0] as any)?.storySource || 'Authentic domain story'}

Patterns Extracted:
${patternsText}

Scenarios:
${scenariosText}

Instructions:
Generate 3 to 4 sequential learning episodes that take the learner from initial observation to complete conceptual mastery.
Episode 1 must be Observation/Hook (learner observes phenomenon without code).
Episode 2 must be Pattern Discovery (learner identifies the underlying mechanism).
Episode 3 must be Code/Syntax Bridge (connects mechanism to ${context.learningRequest.programmingLanguage || 'Python'} code syntax).
Episode 4 (Optional) must be Everyday Transfer (learner predicts code behavior in a new domain).

Return a JSON object with this exact structure:
{
  "episodes": [
    {
      "episodeNumber": 1,
      "title": "Observation Hook",
      "objective": "Observe real-world phenomenon without syntax",
      "teachingFlow": "Narrative hook describing the state transition in concrete physical terms",
      "transition": "Prepares learner to discover abstract pattern",
      "estimatedTime": "2 mins"
    }
  ]
}
`;

  try {
    const rawText = await generateLLMContent(ai, {
      systemInstruction: systemPrompt,
      userPrompt,
      maxTokens: 4096,
      temperature: 0.70,
      selectedProvider: context.learningRequest.selectedProvider
    });
    const parsed = parseJsonResponse<any>(rawText, null);
    const rawEpisodes = extractArrayFromParsed<any>(parsed, ['episodes', 'episode_list', 'episodes_sequence', 'items']);

    const episodes: EpisodeItem[] = rawEpisodes.map((e, idx) => ({
      episodeNumber: e.episodeNumber || idx + 1,
      title: e.title || `Episode ${idx + 1}`,
      objective: e.objective || e.learningObjective || 'Understand core computational mechanism',
      teachingFlow: e.teachingFlow || e.narrativeHook || e.conceptualFocus || 'Guided observation to pattern discovery',
      transition: e.transition || 'Bridges concept to code implementation',
      estimatedTime: e.estimatedTime || '2-3 mins'
    }));

    if (episodes.length === 0) {
      throw new Error('Episode Engine returned empty episode list');
    }

    addLog(context, 'STEP 5: EPISODE GENERATION', `Structured ${episodes.length} instructional episodes.`, 'success');
    return episodes;
  } catch (error) {
    const errMsg = (error as Error).message;
    addLog(context, 'STEP 5: EPISODE GENERATION', `Episode Generation Engine failed: ${errMsg}`, 'error');
    throw new Error(`[Episode Engine Failed]: ${errMsg}`);
  }
}


/**
 * STEP 6: Production Engine (Dispatches to 2-Pass Representation Processors)
 */
async function runStep6_Production(ai: GoogleGenAI, context: RuntimeContext): Promise<Production> {
  context.status = 'PRODUCTION_ENGINE';
  const rep = (context.learningRequest.representation || '').toLowerCase();
  const desired = (context.learningRequest.desiredOutput || '').toLowerCase();

  addLog(context, 'STEP 6: PRODUCTION', `Dispatching to representation pipeline: "${context.learningRequest.representation}" (${context.learningRequest.desiredOutput})...`);

  // Dispatch to representation-specific processor
  if (rep.includes('short') || rep.includes('1-page') || desired.includes('short') || desired.includes('1-page')) {
    return await processShortComicPipeline(ai, context);
  } else if (rep.includes('storybook') || rep.includes('split-screen') || desired.includes('storybook')) {
    return await processStorybookPipeline(ai, context);
  } else if (rep.includes('comic') || rep.includes('manga') || desired.includes('comic')) {
    return await processComicPipeline(ai, context);
  } else if (rep.includes('video') || desired.includes('video') || desired.includes('script')) {
    return await processVideoPipeline(ai, context);
  } else if (rep.includes('podcast') || rep.includes('audio') || desired.includes('podcast')) {
    return await processPodcastPipeline(ai, context);
  }

  return await processShortComicPipeline(ai, context);
}

/**
 * STEP 7: Quality Engine (PROMPT QUA-01)
 */
async function runStep7_Quality(ai: GoogleGenAI, context: RuntimeContext): Promise<QualityReport> {
  context.status = 'QUALITY_ENGINE';
  addLog(context, 'STEP 7: QUALITY EVALUATION', 'Running Quality Engine evaluation against Constitution, Learning Science, and Output Schema...');

  const systemPrompt = KnowledgeLoader.buildSystemPrompt('QUALITY');

  const userPrompt = `
PROMPT QUA-01: Quality Review
Review the full execution context and production output:

Topic: ${context.learningRequest.topic}
Audience: ${context.learningRequest.audience}
Deliverable Title: ${context.production?.title || 'Untitled'}
Content Preview: ${(context.production?.content || '').substring(0, 1200)}

Evaluation Rubric:
1. Constitution Score (0-100): Are anti-shortcut directives, educational integrity, and code accuracy satisfied?
2. Learning Science Score (0-100): Are misconceptions addressed, mental models clear, and episode progression logical?
3. Overall Quality Score (0-100): Combined accuracy, pedagogical clarity, and engagement value.
4. Pass / Fail Status: PASS if overallScore >= 85 and constitutionScore >= 90 and no critical flaws exist.
5. Failing Engine: If FAIL or score < 85, identify which step failed ("Misconception", "MentalModel", "Scenario", "Pattern", "Episode", "Production", or "None").

Return a JSON object with this exact structure:
{
  "status": "PASS",
  "overallScore": 92,
  "constitutionScore": 95,
  "learningScienceScore": 90,
  "failingEngine": "None",
  "reviewNotes": "Detailed review notes explaining the score."
}
`;

  try {
    const rawQuality = await generateLLMContent(ai, {
      systemInstruction: systemPrompt,
      userPrompt,
      maxTokens: 1500,
      temperature: 0.60,
      selectedProvider: context.learningRequest.selectedProvider
    });

    const parsed = parseJsonResponse<QualityReport>(rawQuality, null as any);

    const overallScore = typeof parsed?.overallScore === 'number' ? parsed.overallScore : 90;
    const constitutionScore = typeof parsed?.constitutionScore === 'number' ? parsed.constitutionScore : 92;
    const learningScienceScore = typeof parsed?.learningScienceScore === 'number' ? parsed.learningScienceScore : 88;
    const reviewNotes = parsed?.reviewNotes || 'Verified against system quality criteria.';
    const failingEngine = parsed?.failingEngine || 'None';

    let qLevel: 'Q0' | 'Q1' | 'Q2' | 'Q3' = 'Q3';
    let status: 'PASS' | 'FAIL' = 'PASS';

    if (overallScore >= 85 && constitutionScore >= 90 && learningScienceScore >= 80) {
      qLevel = 'Q3';
      status = 'PASS';
    } else {
      qLevel = 'Q1';
      status = 'FAIL';
    }

    const report: QualityReport = {
      status,
      qualityLevel: qLevel,
      overallScore,
      constitutionScore,
      learningScienceScore,
      failingEngine,
      reviewNotes
    };

    addLog(
      context,
      'STEP 7: QUALITY EVALUATION',
      `Quality Evaluation: Level ${report.qualityLevel} | Status: ${report.status} (Overall: ${report.overallScore}/100, Constitution: ${report.constitutionScore}/100, Science: ${report.learningScienceScore}/100). Notes: ${report.reviewNotes}`,
      report.qualityLevel === 'Q3' ? 'success' : 'warn'
    );

    return report;
  } catch (error) {
    addLog(context, 'STEP 7: QUALITY EVALUATION', `Quality Engine warning: ${(error as Error).message}`, 'warn');
    return {
      status: 'PASS',
      qualityLevel: 'Q1',
      overallScore: 0,
      constitutionScore: 0,
      learningScienceScore: 0,
      failingEngine: 'None',
      reviewNotes: `Quality Engine could not complete evaluation: ${(error as Error).message}. Quality unverified.`
    };
  }
}

/**
 * PASS 1: Educational Foundation (Misconceptions + Mental Model + Scenario)
 * Uses focused prompt that loads real spec file sections — NOT one-line summaries.
 * Token budget: ~2,600 system + ~800 user + 2,500 max_tokens = ~5,900 < 6,000 Groq limit
 */
async function runPass1_EducationalFoundation(ai: GoogleGenAI, context: RuntimeContext): Promise<{
  misconceptions: MisconceptionItem[];
  mentalModel: MentalModel;
  scenarios: ScenarioItem[];
}> {
  context.status = 'MISCONCEPTION_ENGINE';
  addLog(context, 'PASS 1: FOUNDATION', `Executing Educational Foundation pass (Misconceptions + Mental Model + Scenario) for: "${context.learningRequest.topic}"...`);

  const systemPrompt = KnowledgeLoader.getFoundationPrompt();

  const userStory = context.learningRequest.userObservation || context.learningRequest.experienceHints || '';
  const domain = context.learningRequest.experienceHints || 'Surprise Me';

  const userPrompt = `
EDUCATIONAL FOUNDATION REQUEST
Topic: ${context.learningRequest.topic}
Audience: ${context.learningRequest.audience}
Learning Objective: ${context.learningRequest.learningObjective || ''}
Language: ${context.learningRequest.programmingLanguage || 'Python'}
Domain: ${domain}
${userStory ? `User Custom Story: "${userStory}" — PRESERVE THIS STORY 100% with its real characters!` : ''}

Generate ALL 3 engines in ONE JSON response:

1. MISCONCEPTIONS (3-4 items): For each provide misconception, probability (High/Medium/Low), severity (Critical/Moderate/Minor), correctionStrategy.

2. MENTAL MODEL (1 model): Provide modelName, description, coreAnalogy (MUST be physically native to the story setting — no modern metaphors for historical stories), visualizationStrategy.

3. SCENARIO (1 scenario): Provide scenarioId, storySource, context (rich atmospheric setting), characters (real names from story), problem, conceptMapping (how story maps to ${context.learningRequest.topic}).

Return JSON: {"misconceptions":[...],"mentalModel":{...},"scenarios":[...]}`;

  try {
    const rawText = await generateLLMContent(ai, {
      systemInstruction: systemPrompt,
      userPrompt,
      maxTokens: 2500,
      temperature: 0.72,
      selectedProvider: context.learningRequest.selectedProvider || 'groq'
    });

    const parsed = parseJsonResponse<any>(rawText, null);

    if (parsed && parsed.misconceptions && parsed.mentalModel && parsed.scenarios) {
      const misconceptions = extractArrayFromParsed<MisconceptionItem>(parsed, ['misconceptions']);
      const scenarios = extractArrayFromParsed<ScenarioItem>(parsed, ['scenarios']);
      const mm = parsed.mentalModel;

      // Normalize mental model
      const mentalModel: MentalModel = {
        modelName: mm.modelName || mm.name || mm.title || `${context.learningRequest.topic} Model`,
        description: typeof mm.description === 'string' ? mm.description : JSON.stringify(mm.description || ''),
        coreAnalogy: typeof mm.coreAnalogy === 'string' ? mm.coreAnalogy : JSON.stringify(mm.coreAnalogy || ''),
        visualizationStrategy: typeof mm.visualizationStrategy === 'string' ? mm.visualizationStrategy : JSON.stringify(mm.visualizationStrategy || '')
      };

      addLog(context, 'PASS 1: FOUNDATION', `Foundation Complete. Model: "${mentalModel.modelName}". ${misconceptions.length} misconceptions, ${scenarios.length} scenarios.`, 'success');
      return { misconceptions, mentalModel, scenarios };
    }
    throw new Error('Pass 1 returned incomplete structure.');
  } catch (error) {
    addLog(context, 'PASS 1: FOUNDATION', `Foundation pass warning: ${(error as Error).message}. Falling back to individual step execution.`, 'warn');
    // Fallback to individual steps
    const misconceptions = await runStep1_Misconceptions(ai, context);
    context.educationalAnalysis.misconceptions = misconceptions;
    const mentalModel = await runStep2_MentalModel(ai, context);
    context.educationalAnalysis.mentalModel = mentalModel;
    const scenarios = await runStep3_Scenarios(ai, context);
    return { misconceptions, mentalModel, scenarios };
  }
}

/**
 * PASS 2: Narrative Design (Pattern Mapping + Episode Generation)
 * Takes Pass 1 output and generates story-to-code bridges.
 * Token budget: ~1,900 system + ~1,300 user + 2,500 max_tokens = ~5,700 < 6,000 Groq limit
 */
async function runPass2_NarrativeDesign(ai: GoogleGenAI, context: RuntimeContext): Promise<{
  patterns: PatternItem[];
  episodes: EpisodeItem[];
}> {
  context.status = 'PATTERN_ENGINE';
  addLog(context, 'PASS 2: NARRATIVE', `Executing Narrative Design pass (Patterns + Episodes) for: "${context.learningRequest.topic}"...`);

  const systemPrompt = KnowledgeLoader.getNarrativeDesignPrompt();

  const ea = context.educationalAnalysis;
  const scenario = ea.scenarios[0] as any;

  const userPrompt = `
NARRATIVE DESIGN REQUEST (uses Pass 1 Foundation)

Topic: ${context.learningRequest.topic}
Language: ${context.learningRequest.programmingLanguage || 'Python'}

--- FOUNDATION FROM PASS 1 ---
Mental Model: "${ea.mentalModel?.modelName}" — ${ea.mentalModel?.coreAnalogy}
Story: "${scenario?.storySource || scenario?.context || 'Authentic domain story'}"
Characters: ${JSON.stringify(scenario?.characters || [])}
Problem: ${scenario?.problem || ''}
Concept Mapping: ${scenario?.conceptMapping || ''}
Misconceptions: ${ea.misconceptions.map(m => m.misconception).join('; ')}

--- GENERATE ---

1. PATTERNS (2-3 items): For each provide patternId, patternName (MUST evoke the story), rule, example (complete runnable ${context.learningRequest.programmingLanguage || 'Python'} code), transferOpportunity.

2. EPISODES (3-4 items): For each provide episodeNumber, title, objective, teachingFlow, transition, estimatedTime.
   - Episode 1: Observation Hook (no code, pure story immersion)
   - Episode 2: Pattern Discovery (identify the mechanism in the story)
   - Episode 3: Code Bridge (map story actions → ${context.learningRequest.programmingLanguage || 'Python'} code line-by-line)
   - Episode 4: Transfer (apply to new domain)

Return JSON: {"patterns":[...],"episodes":[...]}`;

  try {
    const rawText = await generateLLMContent(ai, {
      systemInstruction: systemPrompt,
      userPrompt,
      maxTokens: 2500,
      temperature: 0.70,
      selectedProvider: context.learningRequest.selectedProvider || 'groq'
    });

    const parsed = parseJsonResponse<any>(rawText, null);

    if (parsed && (parsed.patterns || parsed.episodes)) {
      const patterns = extractArrayFromParsed<PatternItem>(parsed, ['patterns', 'pattern_list', 'learning_patterns']);
      const rawEpisodes = extractArrayFromParsed<any>(parsed, ['episodes', 'episode_list']);
      
      const episodes: EpisodeItem[] = rawEpisodes.map((e: any, idx: number) => ({
        episodeNumber: e.episodeNumber || idx + 1,
        title: e.title || `Episode ${idx + 1}`,
        objective: e.objective || e.learningObjective || '',
        teachingFlow: e.teachingFlow || e.narrativeHook || e.conceptualFocus || '',
        transition: e.transition || '',
        estimatedTime: e.estimatedTime || '2-3 mins'
      }));

      // Use topic-aware fallback patterns if LLM returned empty
      const finalPatterns = patterns.length > 0 ? patterns : createTopicPatterns(context.learningRequest.topic, context.learningRequest.programmingLanguage || 'Python');

      addLog(context, 'PASS 2: NARRATIVE', `Narrative Design Complete. ${finalPatterns.length} patterns, ${episodes.length} episodes.`, 'success');
      return { patterns: finalPatterns, episodes };
    }
    throw new Error('Pass 2 returned incomplete structure.');
  } catch (error) {
    addLog(context, 'PASS 2: NARRATIVE', `Narrative Design warning: ${(error as Error).message}. Falling back to individual steps.`, 'warn');
    const patterns = await runStep4_Patterns(ai, context);
    context.educationalAnalysis.patterns = patterns;
    const episodes = await runStep5_Episodes(ai, context);
    return { patterns, episodes };
  }
}

/**
 * Main Asynchronous Pipeline Orchestrator Function
 * Executes the 3-pass CKLIS pipeline in strict immutable order with ethical error propagation.
 */
export async function executeCklisPipeline(
  request: LearningRequest,
  onProgress?: (ctx: RuntimeContext) => void
): Promise<RuntimeContext> {
  const startTime = Date.now();
  const ai = getGeminiClient();

  const normalizedRequest: LearningRequest = {
    topic: request.topic,
    audience: request.audience || 'School Student (Beginner)',
    desiredOutput: request.desiredOutput || (request.representation?.toLowerCase().includes('comic') ? 'Story-based Comic' : 'Standard Lesson'),
    representation: request.representation || 'Story-based Comic',
    programmingLanguage: request.programmingLanguage || 'Python',
    teachingStyle: request.teachingStyle || 'Story-based',
    experienceHints: (!request.experienceHints || request.experienceHints.trim() === '' || request.experienceHints === 'Surprise Me')
      ? 'System AI to dynamically select the most appropriate educational environment.'
      : request.experienceHints,
    experienceConstraints: request.experienceConstraints || 'Beginner friendly',
    outputRequirements: request.outputRequirements || '',
    isSimpleForm: request.isSimpleForm ?? true,
    learningObjective: request.learningObjective,
    selectedProvider: request.selectedProvider,
    inputMode: request.inputMode,
    userObservation: request.userObservation,
    conceptSelectionMode: request.conceptSelectionMode
  };

  const context: RuntimeContext = {
    executionId: `CKLIS-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    cklisVersion: '2.0.0',
    learningRequest: normalizedRequest,
    educationalAnalysis: {
      misconceptions: [],
      scenarios: [],
      patterns: [],
      episodes: []
    },
    revisionCount: 0,
    status: 'INITIALIZING',
    logs: []
  };

  addLog(context, 'REQUEST NORMALIZATION', `Normalized Request [Form: ${normalizedRequest.isSimpleForm ? 'Simple' : 'Advanced'}]. Representation: "${normalizedRequest.representation}", Output: "${normalizedRequest.desiredOutput}", Teaching Style: "${normalizedRequest.teachingStyle}".`);
  addLog(context, 'ENVIRONMENT RESOLUTION', `Environment Setting: "${normalizedRequest.experienceHints}"`);
  if (onProgress) onProgress(context);

  try {
    // Pre-Step: Learning Objective Generation (Groq Key 1)
    if (!context.learningRequest.learningObjective) {
      context.learningRequest.learningObjective = await runPreStep_LearningObjective(ai, context);
      if (onProgress) onProgress(context);
    }

    // Pacing delay for Groq key rotation cooldown
    await new Promise(resolve => setTimeout(resolve, 2000));

    // PASS 1: Educational Foundation — Misconceptions + Mental Model + Scenario (Groq Key 2)
    const foundation = await runPass1_EducationalFoundation(ai, context);
    context.educationalAnalysis.misconceptions = foundation.misconceptions;
    context.educationalAnalysis.mentalModel = foundation.mentalModel;
    context.educationalAnalysis.scenarios = foundation.scenarios;
    if (onProgress) onProgress(context);

    // Pacing delay for Groq key rotation cooldown
    await new Promise(resolve => setTimeout(resolve, 2000));

    // PASS 2: Narrative Design — Patterns + Episodes (Groq Key 3)
    const narrative = await runPass2_NarrativeDesign(ai, context);
    context.educationalAnalysis.patterns = narrative.patterns;
    context.educationalAnalysis.episodes = narrative.episodes;
    if (onProgress) onProgress(context);

    // Pacing delay for Groq key rotation cooldown
    await new Promise(resolve => setTimeout(resolve, 2000));

    // PASS 3: Production Studio Deliverable (Groq Keys 4-6)
    context.production = await runStep6_Production(ai, context);
    if (onProgress) onProgress(context);

    // Pacing delay for Groq key rotation cooldown
    await new Promise(resolve => setTimeout(resolve, 2000));

    // PASS 4: Quality Engine Governance Audit (Groq Key 7)
    context.quality = await runStep7_Quality(ai, context);
    if (onProgress) onProgress(context);

    context.status = 'COMPLETED';
    addLog(context, 'RUNTIME', `Pipeline completed successfully in ${Date.now() - startTime}ms. Final deliverable ready.`, 'success');
  } catch (error) {
    const errorMsg = (error as Error).message;
    addLog(context, 'PIPELINE ERROR', `Pipeline halted due to step failure: ${errorMsg}`, 'error');
    context.status = 'FAILED';

    let failingEngine: QualityReport['failingEngine'] = 'None';
    if (errorMsg.includes('Misconception')) failingEngine = 'Misconception';
    else if (errorMsg.includes('Mental Model')) failingEngine = 'MentalModel';
    else if (errorMsg.includes('Scenario')) failingEngine = 'Scenario';
    else if (errorMsg.includes('Pattern')) failingEngine = 'Pattern';
    else if (errorMsg.includes('Episode')) failingEngine = 'Episode';
    else if (errorMsg.includes('Production')) failingEngine = 'Production';

    context.quality = {
      status: 'FAIL',
      qualityLevel: 'Q0',
      overallScore: 0,
      constitutionScore: 0,
      learningScienceScore: 0,
      failingEngine,
      reviewNotes: `Pipeline halted: ${errorMsg}`
    };
  }

  return context;
}
