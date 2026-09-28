// The schema that makes the 7-beat template reusable across all 16 lessons.
// A lesson author fills in a content.ts matching this shape — LessonLayout.tsx
// does the rendering, no lesson-specific JSX required for a standard lesson.

export type ExceptionId =
  | "TryExceptBasics"
  | "ZeroDivisionError"
  | "TypeError"
  | "ValueError"
  | "IndexError"
  | "KeyError"
  | "AttributeError"
  | "FileNotFoundError"
  | "ElseClause"
  | "Finally"
  | "Raise"
  | "RecursionError"
  | "ImportError"
  | "ExceptionHierarchy"
  | "CustomExceptions"
  | "Capstone";

export interface CodeExample {
  label: string; // e.g. "Unhandled" / "Handled"
  code: string;
  language: "python";
}

export type PracticeStage =
  | "predict"
  | "trace"
  | "debug"
  | "complete"
  | "build"
  | "apply";

export interface PracticeItem {
  stage: PracticeStage;
  prompt: string;
  starterCode?: string;
  solutionCode?: string;
  choices?: string[]; // for "predict" stage multiple choice
  correctChoice?: number; // index into choices
}

export interface StoryLine {
  speaker: string; // e.g. "Arjuna", "Krishna"
  line: string; // one short, simple line of dialogue
}

export interface Lesson {
  id: ExceptionId;
  slug: string; // "02-zero-division-error"
  order: number;
  title: string;

  // Beat 1 — The Story
  storyTitle: string;
  storyBody: string; // fallback prose, used only if storyDialogue isn't provided
  storyDialogue?: StoryLine[]; // preferred: simple back-and-forth lines, one per card
  storyIntroLine: string; // Krishna's line before the story cards, specific to this lesson
  storyOutroQuestion: string; // Krishna's question after the story cards, specific to this lesson

  // Beat 2 — The Pause
  pauseQuestion: string;
  pauseChoices?: string[];
  pauseCorrectChoice?: number;

  // Beat 3 — The Concept, Named
  conceptExplainer: string;

  // Beat 4 — The Mapping, Made Explicit
  mappingExplainer: string;

  // Beat 5 — See It Break, See It Handled
  codeExamples: CodeExample[];

  // Beat 6 — Practice Ladder
  practiceLadder: PracticeItem[];

  // Beat 7 — Reflection
  reflectionPrompt: string;

  badgeUnlocked?: string;
}