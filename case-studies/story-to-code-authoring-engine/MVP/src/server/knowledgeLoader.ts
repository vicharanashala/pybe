import fs from 'fs';
import path from 'path';

/**
 * Knowledge Loading Utility for CKLIS Version 2.0.0
 * Loads markdown specification files according to strict priority layers defined in AI-01 Runtime.md
 * 
 * IMPORTANT: No substring() truncation — all spec files are loaded in full.
 * Groq llama-3.3-70b-versatile supports 131,072 token context window.
 * Total spec files combined are well within this limit.
 */

const WORKSPACE_ROOT = path.resolve(process.cwd(), '..');
const LOCAL_SPECS_DIR = path.join(process.cwd(), 'src', 'specs');

/**
 * Reads a specification file from disk safely, trying root spec paths first then MVP/src/specs
 * NO TRUNCATION — full file content is loaded
 */
function readSpecFile(relativePath: string, localFallbackName?: string): string {
  try {
    if (process.env.USE_LOCAL_SPECS === 'true' && localFallbackName) {
      const localPath = path.join(LOCAL_SPECS_DIR, localFallbackName);
      if (fs.existsSync(localPath)) {
        const content = fs.readFileSync(localPath, 'utf-8');
        console.log(`[KnowledgeLoader] Loaded (local primary): ${localFallbackName} (${content.length} chars)`);
        return cleanSpecContent(content);
      }
    }

    const rootPath = path.join(WORKSPACE_ROOT, relativePath);
    if (fs.existsSync(rootPath)) {
      const content = fs.readFileSync(rootPath, 'utf-8');
      console.log(`[KnowledgeLoader] Loaded: ${relativePath} (${content.length} chars)`);
      return cleanSpecContent(content);
    }
    if (localFallbackName) {
      const localPath = path.join(LOCAL_SPECS_DIR, localFallbackName);
      if (fs.existsSync(localPath)) {
        const content = fs.readFileSync(localPath, 'utf-8');
        console.log(`[KnowledgeLoader] Loaded (local fallback): ${localFallbackName} (${content.length} chars)`);
        return cleanSpecContent(content);
      }
    }
  } catch (err) {
    console.warn(`[KnowledgeLoader] Could not read ${relativePath}:`, (err as Error).message);
  }
  return '';
}

/**
 * Strips human administrative noise (metadata tables, change logs, document history)
 * while preserving 100% of functional rules, constitutional laws, taxonomies, and schemas.
 */
function cleanSpecContent(content: string): string {
  if (!content) return '';
  let cleaned = content;
  // Strip human document metadata tables
  cleaned = cleaned.replace(/\|?\s*Field\s*\|?\s*Value\s*\|?[\s\S]*?\n\n/gi, '');
  cleaned = cleaned.replace(/\|?\s*Document ID\s*\|?[\s\S]*?\n\n/gi, '');
  // Strip repeated title header blocks
  cleaned = cleaned.replace(/\*\*Code Katha Learning Intelligence System \(CKLIS\)\*\*\n+/gi, '');
  // Strip document history / change log sections
  cleaned = cleaned.replace(/##?\s*Revision History[\s\S]*?(?=\n##|\n#|$)/gi, '');
  cleaned = cleaned.replace(/##?\s*Document History[\s\S]*?(?=\n##|\n#|$)/gi, '');
  return cleaned.trim();
}

export interface PromptPayload {
  systemInstruction: string;
  userPrompt: string;
}

export class KnowledgeLoader {
  private static layer1Cache: string | null = null;
  private static masterPromptCache: string | null = null;
  private static specCache: Map<string, string> = new Map();

  /**
   * Layer 1: Core Identity & Constitutional Laws (00 Project Charter + 01 Constitution)
   * FULL CONTENT — no truncation
   */
  public static getLayer1(): string {
    if (!this.layer1Cache) {
      const charter = readSpecFile('Core Layer-Defines why the system exists/00 - Project Charter.docx.md', '00_Project_Charter.md');
      const constitution = readSpecFile('Core Layer-Defines why the system exists/01 - Constitution.docx.md', '01_Constitution.md');
      
      this.layer1Cache = `=== LAYER 1: CORE IDENTITY & CONSTITUTION ===\n\n${charter}\n\n${constitution}`;
    }
    return this.layer1Cache;
  }

  /**
   * Layer 2: Educational Intelligence (02 Learning Science + Engine specific spec)
   * FULL CONTENT — no truncation
   */
  public static getLayer2(stepName: string): string {
    const cacheKey = `layer2_${stepName}`;
    if (this.specCache.has(cacheKey)) return this.specCache.get(cacheKey)!;

    const learningScience = readSpecFile('Core Layer-Defines why the system exists/02- Learning Science.docx.md', '02_Learning_Science.md');

    let engineSpecRelPath = '';
    let fallbackName = '';
    switch (stepName) {
      case 'MISCONCEPTION':
        engineSpecRelPath = 'Engines Layer - Heart of the system/03 - Misconception Engine.docx.md';
        fallbackName = '03_Misconception_Engine.md';
        break;
      case 'MENTAL_MODEL':
        engineSpecRelPath = 'Engines Layer - Heart of the system/04 - Mental Model Engine.docx.md';
        fallbackName = '04_Mental_Model_Engine.md';
        break;
      case 'SCENARIO':
        engineSpecRelPath = 'Engines Layer - Heart of the system/05 – Scenario Intelligence Engine.docx.md';
        fallbackName = '05_Scenario_Engine.md';
        break;
      case 'PATTERN':
        engineSpecRelPath = 'Engines Layer - Heart of the system/06 – Pattern Mapping Engine.docx.md';
        fallbackName = '06_Pattern_Engine.md';
        break;
      case 'EPISODE':
        engineSpecRelPath = 'Engines Layer - Heart of the system/07 – Episode Generation Engine.docx.md';
        fallbackName = '07_Episode_Engine.md';
        break;
      case 'PRODUCTION':
        engineSpecRelPath = 'Engines Layer - Heart of the system/08 – Production Engine.docx.md';
        fallbackName = '08_Production_Engine.md';
        break;
      case 'QUALITY':
        engineSpecRelPath = 'Engines Layer - Heart of the system/09 – Quality Engine.docx.md';
        fallbackName = '09_Quality_Engine.md';
        break;
      default:
        fallbackName = '03_09_Engines.md';
    }

    const engineSpec = readSpecFile(engineSpecRelPath, fallbackName);

    // Load FULL content — no truncation
    const result = `=== LAYER 2: EDUCATIONAL INTELLIGENCE (${stepName}) ===\n\n${learningScience}\n\n${engineSpec}`;
    this.specCache.set(cacheKey, result);
    return result;
  }

  /**
   * Master Prompt (AI-02 Master Prompt)
   * FULL CONTENT — no truncation
   */
  public static getMasterPrompt(): string {
    if (!this.masterPromptCache) {
      const master = readSpecFile('Runtime/AI-02 Master Prompt.md', 'AI-02_Master_Prompt.md');
      this.masterPromptCache = master || `
# AI-02 Master Prompt
You are the CKLIS Educational Reasoning Runtime.
Execute the 7-step pipeline in strict immutable order.
Never bypass steps or generate shortcut code without scenario and mental model alignment.
Every output must be COMPLETE — partial outputs are not acceptable.
`;
    }
    return `=== MASTER PROMPT ===\n\n${this.masterPromptCache}`;
  }

  /**
   * Load Representation Template (CP1, CP2, VP1, VP2)
   * FULL CONTENT — no truncation
   */
  public static getRepresentationTemplate(templateName: 'CP1' | 'CP2' | 'VP1' | 'VP2' | 'SHORT_COMIC'): string {
    const cacheKey = `template_${templateName}`;
    if (this.specCache.has(cacheKey)) return this.specCache.get(cacheKey)!;

    let content = '';
    if (templateName === 'CP1') {
      content = readSpecFile('Prompts/Comics/CP1.md');
    } else if (templateName === 'CP2') {
      content = readSpecFile('Prompts/Comics/CP2.md');
    } else if (templateName === 'VP1') {
      content = readSpecFile('Prompts/Video/VP1.md');
    } else if (templateName === 'VP2') {
      content = readSpecFile('Prompts/Video/VP2.md');
    } else if (templateName === 'SHORT_COMIC') {
      content = readSpecFile('Prompts/Comics/1_Page_Comic_Example.md');
    }
    this.specCache.set(cacheKey, content);
    return content;
  }

  /**
   * Constructs the full System Instruction payload for a given step in the pipeline
   * FULL CONTENT — loads real spec files via getLayer1(), getLayer2(), getMasterPrompt()
   */
  public static buildSystemPrompt(stepName: string): string {
    if (stepName === 'QUALITY') {
      const qualitySpec = readSpecFile('Engines Layer - Heart of the system/09 – Quality Engine.docx.md', '09_Quality_Engine.md');
      return `=== CKLIS QUALITY ENGINE GOVERNANCE DIRECTIVES ===\n${qualitySpec}\n\nCRITICAL: Respond strictly in valid JSON format.`;
    }
    if (stepName === 'PRODUCTION') {
      const prodSpec = readSpecFile('Engines Layer - Heart of the system/08 – Production Engine.docx.md', '08_Production_Engine.md');
      return `=== CKLIS PRODUCTION ENGINE DIRECTIVES ===\n${prodSpec}\n\nCRITICAL: Respond strictly in valid JSON format.`;
    }

    const layer1 = this.getLayer1();         // Project Charter + Constitution
    const layer2 = this.getLayer2(stepName); // Learning Science + Engine-specific spec
    const master = this.getMasterPrompt();   // AI-02 Master Prompt

    return [
      layer1,
      layer2,
      master,
      `=== CURRENT STEP: ${stepName} ===`,
      `CRITICAL: Respond strictly in valid JSON format. Generate rich, detailed, publication-ready output for every field.`
    ].join('\n\n');
  }

  /**
   * CANONICAL STORY GROUNDING ENGINE
   * Provides exact, authentic plot structures, character roles, and inviolable narrative rules
   * for major Indian and world story canons (Vikram & Betaal, Akbar & Birbal, Panchatantra, Tenali Raman, Thirsty Crow, etc.)
   * Reference Grounding Source: KidsGen Stories (https://www.kidsgen.com/stories/betal-pachisi/#tales)
   */
  public static getCanonicalStoryGrounding(topicOrStory: string): string {
    const s = (topicOrStory || '').toLowerCase();

    if (s.includes('vikram') || s.includes('betal') || s.includes('pachisi')) {
      return `
=== CANONICAL STORY GROUNDING: VIKRAM AND BETAAL (BETAL PACHISI) ===
Reference Source: KidsGen Betal Pachisi Tales (https://www.kidsgen.com/stories/betal-pachisi/)
CHARACTERS:
- King Vikramaditya (Vikram): Brave, wise, righteous king of Ujjain, resolute and bound by his royal vow.
- Betaal (the Celestial Ghost): Wise ghoul hanging upside down from a banyan tree in a dark cremation ground.
AUTHENTIC STORY CANON & PLOT STRUCTURE:
1. King Vikramaditya goes to the dark cremation ground, captures Betaal from the banyan tree, and carries him on his shoulder in silence.
2. Betaal agrees to be carried on ONE condition: Betaal will tell a story containing a complex ethical dilemma or riddle. If Vikram knows the answer and speaks, he breaks his vow of silence, and Betaal will laugh and fly back to the banyan tree.
3. Betaal narrates the story to King Vikram.
4. At the climax of the story, Betaal poses a sharp riddle/question to King Vikram.
5. Because King Vikramaditya is righteous and knows the correct answer, he MUST answer. As soon as he speaks, Betaal laughs ("Ha ha ha!") and flies back to the banyan tree, forcing King Vikram to return and capture him again.

PYTHON CODE CONCEPT BRIDGE FOR VIKRAM & BETAAL:
- Loop Invariant: \`while betaal_captured:\`
- Condition Gate: \`if silence_broken:\` → \`betaal.fly_back()\`; \`state = "RE_CAPTURE"\`
- Invariant Rule: King Vikram's wisdom forces him to speak when he knows the truth, triggering the state transition!
`;
    }

    if (s.includes('akbar') || s.includes('birbal')) {
      return `
=== CANONICAL STORY GROUNDING: AKBAR AND BIRBAL ===
CHARACTERS:
- Emperor Akbar: Magnificent Mughal ruler, inquisitive, loves posing difficult court decrees and riddles.
- Raja Birbal: Witty royal minister, master of lateral thinking, logical reasoning, and justice.
AUTHENTIC STORY CANON & PLOT STRUCTURE:
1. Emperor Akbar presents a tricky problem, impossible decree, or mysterious puzzle to the Mughal court in Agra.
2. Courtiers and jealous rivals make foolish guesses or fail completely.
3. Birbal observes the underlying real-world physical or logical invariant.
4. Birbal uses clever, witty physical demonstration to prove the solution to Akbar.
5. Akbar praises Birbal's wisdom and rewards him.

PYTHON CODE CONCEPT BRIDGE FOR AKBAR & BIRBAL:
- Condition Predicate: Checking the problem invariant before taking action (\`if condition:\`).
- Invariant Gate: Birbal's solution tests the exact boundary condition of Akbar's decree.
`;
    }

    if (s.includes('crow') || s.includes('pitcher') || s.includes('pebble') || s.includes('thirsty')) {
      return `
=== CANONICAL STORY GROUNDING: THE THIRSTY CROW FABLE ===
CHARACTERS:
- The Thirsty Crow: Intelligent, persistent, observant bird.
AUTHENTIC STORY CANON & PLOT STRUCTURE:
1. Hot sunny day. Crow finds a tall ceramic pitcher with water deep at the bottom, beyond beak reach.
2. Crow tries to tip the pitcher over (fails — pitcher is heavy).
3. Crow notices small smooth pebbles scattered nearby.
4. Crow drops pebbles into the pitcher one by one.
5. Each pebble displaces volume, raising the water level incrementally until the crow can drink.

PYTHON CODE CONCEPT BRIDGE FOR THE THIRSTY CROW:
- Loop: \`while water_level < REACHABLE_HEIGHT:\`
- Accumulation Update: \`drop_pebble()\`; \`water_level += 0.2\`
- Termination Condition: \`drink_water()\`.
`;
    }

    if (s.includes('tenali') || s.includes('raman') || s.includes('krishnadevaraya')) {
      return `
=== CANONICAL STORY GROUNDING: TENALI RAMAN ===
CHARACTERS:
- King Krishnadevaraya: Ruler of Vijayanagara Empire.
- Tenali Raman: Court jester and brilliant advisor.
AUTHENTIC STORY CANON & PLOT STRUCTURE:
1. King poses a challenge or rival kingdom sends a trickster scholar.
2. Tenali Raman identifies the hidden mathematical or logical loophole.
3. Tenali demonstrates the invariant through a humorous, clever real-world experiment.
`;
    }

    return `
=== CANONICAL STORY GROUNDING DIRECTIVE ===
INVIOLABLE GROUNDING LAW: PRESERVE REAL STORY ESSENCE (CL-14/CL-18)
1. DO NOT invent fake fantasy plots or alter real story canons.
2. Maintain authentic character personalities, real historical/cultural setting, and natural physical laws.
3. Ensure physical story actions naturally map line-by-line to Python state updates, loops, or conditionals.
`;
  }

  /**
   * PASS 1: Educational Foundation System Prompt
   * Loads critical sections from Constitution + Misconception + Mental Model + Scenario specs.
   * Token budget: ~2,600 tokens system prompt (fits within Groq's Input+Output ≤ 6,000 with 2,500 max_tokens + ~800 user prompt)
   */
  public static getFoundationPrompt(): string {
    // Load the real spec files (shortened local versions — they contain all critical rules)
    const constitution = readSpecFile('Core Layer-Defines why the system exists/01 - Constitution.docx.md', '01_Constitution.md');
    const misconceptionSpec = readSpecFile('Engines Layer - Heart of the system/03 - Misconception Engine.docx.md', '03_Misconception_Engine.md');
    const mentalModelSpec = readSpecFile('Engines Layer - Heart of the system/04 - Mental Model Engine.docx.md', '04_Mental_Model_Engine.md');
    const scenarioSpec = readSpecFile('Engines Layer - Heart of the system/05 – Scenario Intelligence Engine.docx.md', '05_Scenario_Engine.md');

    // Extract critical sections from each spec (Purpose + Taxonomy + Quality Criteria + Rules)
    const constitutionCore = extractSection(constitution, ['Constitutional Principles', 'Core Constitutional Principles', 'AI Reasoning Laws', 'Prohibited Practices']);
    const misconceptionCore = extractSection(misconceptionSpec, ['Purpose', 'Misconception Categories', 'Misconception Taxonomy', 'Severity', 'Root Cause', 'Intervention', 'Construction Rules']);
    const mentalModelCore = extractSection(mentalModelSpec, ['Purpose', 'Definition', 'Mental Model Components', 'Mental Model Taxonomy', 'Quality Criteria', 'Construction Rules']);
    const scenarioCore = extractSection(scenarioSpec, ['Purpose', 'Definition', 'Scenario Design Principles', 'Scenario Taxonomy', 'Selection Rules', 'Evaluation Framework', 'Pattern Exposure']);

    return `=== CKLIS EDUCATIONAL FOUNDATION ENGINE ===
You are the CKLIS Educational Intelligence Engine executing Pass 1: Educational Foundation.
Your task: Produce deep, rigorous educational analysis across 3 engines (Misconceptions, Mental Model, Scenario).

=== CONSTITUTION (Critical Laws) ===
${constitutionCore || this.getConstitutionFallback()}

=== MISCONCEPTION ENGINE (03) ===
${misconceptionCore || 'Identify 3-4 probable beginner misconceptions with categories MC-01 to MC-05, severity levels S1-S4, root causes, and correction strategies.'}

=== MENTAL MODEL ENGINE (04) ===
${mentalModelCore || 'Build 1 dominant mental model using taxonomy MT-01 to MT-05. Include core concept, entities, relationships, rules, observable behaviors. Quality criteria MQ-01 to MQ-05.'}
CRITICAL RULE: The mental model analogy MUST use objects/concepts physically native to the story setting and era. For Mughal India → use royal seals, court decrees, palace gates. NEVER use modern industrial metaphors (conveyor belts, traffic lights) for historical settings.

=== SCENARIO INTELLIGENCE ENGINE (05) ===
${scenarioCore || 'Select 1 authentic domain story using taxonomy SC-01 to SC-08. Apply selection rules SR-01 to SR-05 and evaluation SE-01 to SE-06.'}
CRITICAL RULE (CL-14/CL-18): If the user provided a custom story/fable, you MUST 100% PRESERVE it with real characters and authentic setting. DO NOT replace or rewrite the user\'s story.

CRITICAL: Output ALL 3 parts in valid, publication-ready JSON. Perform deep reasoning for each engine.`;
  }

  /**
   * PASS 2: Narrative Design System Prompt
   * Loads critical sections from Pattern Engine + Episode Engine specs.
   * Token budget: ~1,900 tokens system prompt
   */
  public static getNarrativeDesignPrompt(): string {
    const patternSpec = readSpecFile('Engines Layer - Heart of the system/06 – Pattern Mapping Engine.docx.md', '06_Pattern_Engine.md');
    const episodeSpec = readSpecFile('Engines Layer - Heart of the system/07 – Episode Generation Engine.docx.md', '07_Episode_Engine.md');

    const patternCore = extractSection(patternSpec, ['Purpose', 'Pattern Abstraction', 'Pattern Categories', 'Taxonomy', 'Mapping Rules', 'Validation', 'Construction Rules']);
    const episodeCore = extractSection(episodeSpec, ['Purpose', 'Episode Structure', 'Canonical Flow', 'Episode Sequencing', 'Construction Rules', 'Validation']);

    return `=== CKLIS NARRATIVE DESIGN ENGINE ===
You are the CKLIS Narrative Design Engine executing Pass 2: Pattern Mapping + Episode Generation.
Your task: Take the educational foundation (misconceptions, mental model, scenario) and design the story-to-code bridge.

=== CONSTITUTIONAL BRIDGE LAWS ===
- CL-03: Scenario Before Code — learners encounter scenario BEFORE code.
- CL-08: Patterns Connect Scenarios to Programming — Scenario → Observation → Pattern → Programming Concept.
- CL-16: Progressive Abstraction — concrete experience → abstract concept.
- CL-18: Reflection Completes Learning — conclude with application/reflection.

=== PATTERN MAPPING ENGINE (06) ===
${patternCore || 'Extract 2-3 patterns bridging physical story actions to code syntax. Each pattern MUST include executable code example.'}
CRITICAL: Pattern names must EVOKE THE STORY (e.g. "Akbar\'s Royal Decree Gate" not "Condition Check"). Code examples must be complete, runnable snippets.

=== EPISODE GENERATION ENGINE (07) ===
${episodeCore || 'Structure 3-4 canonical learning episodes: Hook → Observation → Pattern → Code Bridge → Transfer.'}
CRITICAL: Episode 3 (Code Bridge) MUST contain a complete, executable code snippet that maps physical story actions to programming syntax line-by-line.

CRITICAL: Output ALL parts in valid, publication-ready JSON. Every pattern must have a runnable code example. Every episode must have clear learning flow.`;
  }

  /**
   * Fallback constitution text if spec file loading fails
   */
  private static getConstitutionFallback(): string {
    return `CL-01: Education First. CL-02: Understanding Before Memorization. CL-03: Scenario Before Code.
CL-04: Mechanism Before Implementation. CL-05: One Core Learning Objective. CL-06: Misconceptions Must Be Addressed.
CL-07: Mental Models Mandatory. CL-08: Patterns Connect Scenarios to Code. CL-09: Technical Correctness Non-Negotiable.
CL-13: Scenario Selection Is Intentional. CL-14: Simplicity Over Cleverness. CL-15: Internal Consistency.
PROHIBITED: CP-01 Syntax-First Teaching, CP-02 Forced Analogies, CP-05 Incorrect Simplification, CP-07 AI Hallucination.`;
  }

  /**
   * Reset all caches (useful when spec files change on disk)
   */
  public static resetCache(): void {
    this.layer1Cache = null;
    this.masterPromptCache = null;
    this.specCache.clear();
  }
}

/**
 * Extract specific sections from a spec document by matching section header keywords.
 * Returns concatenated text of matching sections, or empty string if no matches.
 */
function extractSection(content: string, sectionKeywords: string[]): string {
  if (!content) return '';
  
  const lines = content.split('\n');
  const sections: string[] = [];
  let capturing = false;
  let currentSection: string[] = [];
  let currentDepth = 0;

  for (const line of lines) {
    // Detect section headers (## or **N. Title** patterns)
    const headerMatch = line.match(/^#{1,3}\s+(?:\d+\.\s*)?(.+)/);
    const boldHeaderMatch = line.match(/^\*\*(\d+)\\?\.\s*(.+)\*\*/);
    const headerText = headerMatch?.[1] || boldHeaderMatch?.[2] || '';

    if (headerText) {
      // Save previous section if it was being captured
      if (capturing && currentSection.length > 0) {
        sections.push(currentSection.join('\n'));
      }
      
      // Check if this new header matches any keyword
      const matches = sectionKeywords.some(kw => 
        headerText.toLowerCase().includes(kw.toLowerCase())
      );
      
      if (matches) {
        capturing = true;
        currentSection = [line];
        currentDepth = (headerMatch?.[0] || '').split('#').length - 1;
      } else {
        capturing = false;
        currentSection = [];
      }
    } else if (capturing) {
      currentSection.push(line);
    }
  }
  
  // Don't forget the last section
  if (capturing && currentSection.length > 0) {
    sections.push(currentSection.join('\n'));
  }

  return sections.join('\n\n').trim();
}
