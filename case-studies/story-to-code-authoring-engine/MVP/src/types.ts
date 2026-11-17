/**
 * Code Katha Learning Intelligence System (CKLIS) Version 2.0.0
 * Data Models and State Management Interfaces
 */

export interface LearningRequest {
  topic: string; // Educational Intent / Learning Goal (e.g. "Recursion in Python")
  audience: string; // Target Audience (e.g. "Beginner CS Student", "School Student")
  desiredOutput?: string; // Deliverable type: "Lesson", "Video Script", "Slide Deck", "Blog Post", "Quiz & Exercises", "Interactive Lesson", "Comic"
  representation?: string; // "Story-based Comic", "Story", "Dialogue", "Comic", "Video", "Presentation", "Blog", "Interactive Lesson", "Podcast"
  programmingLanguage?: string; // "Python", "JavaScript", "Java", "C++", "SQL", "TypeScript", etc.
  teachingStyle?: string; // "Story-based", "Concept-first", "Example-first", "Problem-based"
  experienceHints?: string; // Scenario / Environment preference (e.g. "Fantasy Kingdom", "Space Station", "Surprise Me")
  experienceConstraints?: string; // e.g., "8-10 minutes", "No syntax until end", "Colorful characters"
  outputRequirements?: string; // e.g., "Comic panels, character dialogues, recap, practice activity"
  isSimpleForm?: boolean; // Flag to indicate if submitted via Simple vs Advanced Form
  learningObjective?: string; // Auto-generated measurable learning objective from Pre-Step
  selectedProvider?: 'auto' | 'kimi' | 'groq' | 'minimax' | 'gemini'; // User selected LLM provider
  inputMode?: 'topic' | 'experience'; // Mode 1: Topic-First vs Mode 2: Experience-First
  userObservation?: string; // Real-world experience/observation/story entered by user
  conceptSelectionMode?: 'auto' | 'custom'; // In Experience mode: 'auto' (Auto-discover CS concept) or 'custom'
}

export interface MisconceptionItem {
  misconception: string;
  probability: 'High' | 'Medium' | 'Low' | string;
  severity: 'Critical' | 'Moderate' | 'Minor' | string;
  correctionStrategy: string;
}

export interface MentalModel {
  modelName: string;
  description: string;
  coreAnalogy: string;
  visualizationStrategy: string;
}

export interface ScenarioItem {
  scenarioId: string;
  context: string;
  characters?: string[];
  problem: string;
  conceptMapping: string;
  storySource?: string;
  domainNote?: string;
  targetCsConcept?: string;
  realWorldCsApplication?: string;
}

export interface PatternItem {
  patternId: string;
  patternName: string;
  rule: string;
  example: string;
  transferOpportunity: string;
}

export interface EpisodeItem {
  episodeNumber: number;
  title: string;
  objective: string;
  teachingFlow: string;
  transition: string;
  estimatedTime: string;
}

export interface EducationalAnalysis {
  misconceptions: MisconceptionItem[];
  mentalModel?: MentalModel;
  scenarios: ScenarioItem[];
  patterns: PatternItem[];
  episodes: EpisodeItem[];
}

export interface ScenePromptItem {
  sceneNumber: number;
  title: string;
  duration: string;
  summary: string;
  refImagePrompt: string;
  refImageNegativePrompt?: string;
  snapVideoPrompt: string;
  snapNegativePrompt?: string;
  cameraDirection?: string;
  narration: string;
  dialogue?: string;
  soundEffects?: string;
  backgroundMusic?: string;
  educationalGraphics?: string;
}

export interface ComicPanelItem {
  panelNumber: number;
  purpose: string;
  storyProgress: string;
  learningPurpose: string;
  narrationBox: string;
  speechBubble: string;
  characterEmotion: string;
  panelComposition: string;
  imagePrompt: string;
  negativePrompt: string;
  educationalGraphic?: string;
  codeSnippet?: string;
}

export interface ProductionBlueprint {
  type: 'comic' | 'short-comic' | 'long-comic' | 'video' | 'podcast' | 'storybook' | 'standard';
  title: string;
  historicalBackground?: string;
  storyOverview?: string;
  characterBible?: string;
  environmentBible?: string;
  panels?: ComicPanelItem[];
  scenes?: ScenePromptItem[];
  markdownBlueprint: string;
}

export interface Production {
  deliverableType: string;
  title: string;
  content: string; // Complete Markdown formatted deliverable
  blueprint?: ProductionBlueprint;
  metadata?: {
    estimatedDuration?: string;
    targetAudience?: string;
    language?: string;
    representationUsed?: string;
    learningObjective?: string;
  };
}

export interface QualityReport {
  status: 'PASS' | 'FAIL';
  qualityLevel: 'Q0' | 'Q1' | 'Q2' | 'Q3';
  overallScore: number; // 0 - 100
  constitutionScore: number;
  learningScienceScore: number;
  failingEngine?: 'Misconception' | 'MentalModel' | 'Scenario' | 'Pattern' | 'Episode' | 'Production' | 'None';
  revisionNotes?: string;
  reviewNotes?: string;
}

export interface LogEntry {
  timestamp: string;
  step: string;
  message: string;
  level?: 'info' | 'warn' | 'error' | 'success';
}

export interface RuntimeContext {
  executionId: string;
  timestamp: string;
  cklisVersion: string;
  learningRequest: LearningRequest;
  educationalAnalysis: EducationalAnalysis;
  production?: Production;
  quality?: QualityReport;
  revisionCount: number;
  status:
    | 'INITIALIZING'
    | 'MISCONCEPTION_ENGINE'
    | 'MENTAL_MODEL_ENGINE'
    | 'SCENARIO_ENGINE'
    | 'PATTERN_ENGINE'
    | 'EPISODE_ENGINE'
    | 'PRODUCTION_ENGINE'
    | 'QUALITY_ENGINE'
    | 'REVISING'
    | 'COMPLETED'
    | 'FAILED';
  logs: LogEntry[];
}

export interface CklisResponse {
  executionId: string;
  status: 'COMPLETED' | 'FAILED';
  production: Production; // Studio Outcome
  studioOutcome?: Production; // Explicit PyBe Dual Outcome alias
  pipelineOutcome?: {
    topic: string;
    learningObjective: string;
    educationalAnalysis: EducationalAnalysis;
  };
  quality: QualityReport;
  summary: {
    topic: string;
    audience: string;
    representation: string;
    stepsCompleted: number;
    revisionCount: number;
    durationMs: number;
  };
  educationalAnalysis?: EducationalAnalysis;
  logs?: LogEntry[];
  normalizedRequest?: LearningRequest;
}
