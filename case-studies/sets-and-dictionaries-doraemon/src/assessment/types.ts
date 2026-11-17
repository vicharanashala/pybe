import type { CodingTest } from '../gadgets/types';

export interface CodingChallenge {
  id: string;
  title: string;
  instructions: string;
  starterCode: string;
  tests: CodingTest[];
  hints: string[];
}

export type QuestionType = 'predict' | 'true_false' | 'mcq';

export interface QuizQuestion {
  id: string;
  type?: QuestionType;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  whyReasoning?: string;
}
