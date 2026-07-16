export type LearningLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Lesson {
  id: string;
  title: string;
  concept: string;
  level: LearningLevel;
  scenario: string; // The interest context (e.g. Minecraft, Harry Potter)
  explanation: string; // Markdown content
  codeExample: string;
  interactiveChallenge: {
    instruction: string;
    template: string;
    expectedOutputContains?: string[];
    validationScript?: string; // JavaScript snippet to validate Pyodide stdout/results
  };
}

export type QuizType = 'mcq' | 'fill_blank' | 'predict_output' | 'debug';

export interface QuizQuestion {
  id: string;
  type: QuizType;
  concept: string;
  question: string;
  codeContext?: string;
  options?: string[]; // for MCQ
  correctAnswer: string; // For fill_blank or MCQ
  explanation: string;
}

export interface GameModeChallenge {
  id: string;
  mode: 'fix_the_code' | 'code_puzzle' | 'treasure_hunt' | 'boss_fight';
  title: string;
  description: string;
  starterCode: string;
  solutionCode?: string;
  expectedOutput?: string;
  options?: string[]; // for puzzles
  correctAnswer?: string;
  hint: string;
}

export interface ProjectTemplate {
  id: string;
  title: string;
  description: string;
  steps: {
    instruction: string;
    starterCode: string;
    solutionKeyword: string;
  }[];
}

export interface UserProgress {
  selectedInterests: string[];
  level: LearningLevel;
  xp: number;
  streak: number;
  lastActive: string; // Date string ISO
  completedLessons: string[]; // Lesson IDs
  completedQuizzes: string[]; // Quiz IDs
  completedChallenges: string[]; // Game IDs
  completedProjects: string[]; // Project IDs
  badges: string[];
  pasteProtectionEnabled?: boolean;
  pasteAttempts?: {
    id: string;
    timestamp: string;
    exerciseContext: string;
    attemptedText: string;
  }[];
  completedDailyProblems?: number[];
}

export interface DailyProblem {
  no: number;
  title: string;
  concept: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  starterCode: string;
  expectedOutputContains: string[];
  xpReward: number;
}

export interface ReviewResponse {
  isCorrect: boolean;
  score: number; // 0 to 100
  feedback: string; // Markdown
}
