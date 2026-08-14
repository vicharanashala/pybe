export type StepType = 'theory' | 'quiz' | 'code';

export interface BaseStep {
  id: string;
  title: string;
  type: StepType;
}

export interface TheoryStep extends BaseStep {
  type: 'theory';
  content: string; // Explanations
  codeSnippet?: string; // Optional helper snippet
}

export interface QuizStep extends BaseStep {
  type: 'quiz';
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface CodingTest {
  description: string;
  testCode?: string;
  expectedStdout?: string;
}

export interface CodingStep extends BaseStep {
  type: 'code';
  instructions: string;
  starterCode: string;
  verificationTests: CodingTest[];
  hints: string[];
}

export type LessonStep = TheoryStep | QuizStep | CodingStep;

export interface Lesson {
  id: string;
  title: string;
  description: string;
  steps: LessonStep[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  lessons: Lesson[];
}
