 // scaffold-codegita.mjs
// Run from your project root (same level as package.json / src/):
//   node scaffold-codegita.mjs
// Safe to re-run — it never overwrites a file that already exists.

import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const DIRS = [
  "src/shared-components/guide",
  "src/shared-components/layout",
  "src/shared-components/ui",
  "src/shared-components/navigation",

  "src/learning/welcome",
  "src/learning/intro",
  "src/learning/foundations",
  "src/learning/lessons",
  "src/learning/lessons/content/01-try-except-basics",
  "src/learning/lessons/content/02-zero-division-error",
  "src/learning/lessons/content/03-type-error",
  "src/learning/lessons/content/04-value-error",
  "src/learning/lessons/content/05-index-error",
  "src/learning/lessons/content/06-key-error",
  "src/learning/lessons/content/07-attribute-error",
  "src/learning/lessons/content/08-file-not-found-error",
  "src/learning/lessons/content/09-else-clause",
  "src/learning/lessons/content/10-finally",
  "src/learning/lessons/content/11-raise",
  "src/learning/lessons/content/12-recursion-error",
  "src/learning/lessons/content/13-import-error",
  "src/learning/lessons/content/14-exception-hierarchy",
  "src/learning/lessons/content/15-custom-exceptions",
  "src/learning/lessons/content/16-capstone",

  "src/gadgets/code-editor",
  "src/gadgets/predict-before-reveal",
  "src/gadgets/stack-trace-animator",
  "src/gadgets/debug-diff-view",
  "src/gadgets/branching-story-choice",
  "src/gadgets/narrated-traceback",

  "src/assessment/quiz",
  "src/assessment/debugging",
  "src/assessment/interleaved-review",
  "src/assessment/exception-court",
  "src/assessment/curse-and-boon",
  "src/assessment/flashcards",
  "src/assessment/capstone",

  "src/progress",
  "src/content",
  "src/lib",
  "src/types",
  "src/styles",
  "src/assets/illustrations",
  "src/assets/fonts",
];

// [relative path, kind] — kind decides the boilerplate written into the file
const FILES = [
  // shared-components/guide
  ["src/shared-components/guide/KrishnaPanel.tsx", "component"],
  ["src/shared-components/guide/KrishnaGlyph.tsx", "component"],
  ["src/shared-components/guide/NarrationBubble.tsx", "component"],
  ["src/shared-components/guide/useGuideNarration.ts", "hook"],

  // shared-components/layout
  ["src/shared-components/layout/AppLayout.tsx", "component"],
  ["src/shared-components/layout/Backdrop.tsx", "component"],
  ["src/shared-components/layout/Chakra.tsx", "component"],
  ["src/shared-components/layout/ProgressRail.tsx", "component"],
  ["src/shared-components/layout/PathMap.tsx", "component"],

  // shared-components/ui
  ["src/shared-components/ui/PrimaryButton.tsx", "component"],
  ["src/shared-components/ui/BackButton.tsx", "component"],
  ["src/shared-components/ui/Card.tsx", "component"],
  ["src/shared-components/ui/Badge.tsx", "component"],
  ["src/shared-components/ui/CodeBlock.tsx", "component"],
  ["src/shared-components/ui/Divider.tsx", "component"],

  // shared-components/navigation
  ["src/shared-components/navigation/LessonNav.tsx", "component"],
  ["src/shared-components/navigation/SectionTabs.tsx", "component"],

  // learning
  ["src/learning/welcome/WelcomeScreen.tsx", "component"],
  ["src/learning/intro/ConceptScreen.tsx", "component"],
  ["src/learning/foundations/ErrorVsException.tsx", "component"],

  ["src/learning/lessons/types.ts", "types"],
  ["src/learning/lessons/registry.ts", "registry"],
  ["src/learning/lessons/LessonLayout.tsx", "component"],
  ["src/learning/lessons/LessonPage.tsx", "component"],

  // one content.ts per lesson folder
  ["src/learning/lessons/content/01-try-except-basics/content.ts", "content"],
  ["src/learning/lessons/content/02-zero-division-error/content.ts", "content"],
  ["src/learning/lessons/content/03-type-error/content.ts", "content"],
  ["src/learning/lessons/content/04-value-error/content.ts", "content"],
  ["src/learning/lessons/content/05-index-error/content.ts", "content"],
  ["src/learning/lessons/content/06-key-error/content.ts", "content"],
  ["src/learning/lessons/content/07-attribute-error/content.ts", "content"],
  ["src/learning/lessons/content/08-file-not-found-error/content.ts", "content"],
  ["src/learning/lessons/content/09-else-clause/content.ts", "content"],
  ["src/learning/lessons/content/10-finally/content.ts", "content"],
  ["src/learning/lessons/content/11-raise/content.ts", "content"],
  ["src/learning/lessons/content/12-recursion-error/content.ts", "content"],
  ["src/learning/lessons/content/13-import-error/content.ts", "content"],
  ["src/learning/lessons/content/14-exception-hierarchy/content.ts", "content"],
  ["src/learning/lessons/content/15-custom-exceptions/content.ts", "content"],
  ["src/learning/lessons/content/16-capstone/content.ts", "content"],

  // gadgets
  ["src/gadgets/code-editor/CodeEditor.tsx", "component"],
  ["src/gadgets/code-editor/usePythonRunner.ts", "hook"],
  ["src/gadgets/predict-before-reveal/PredictBeforeReveal.tsx", "component"],
  ["src/gadgets/stack-trace-animator/StackTraceAnimator.tsx", "component"],
  ["src/gadgets/debug-diff-view/DebugDiffView.tsx", "component"],
  ["src/gadgets/branching-story-choice/BranchingStoryChoice.tsx", "component"],
  ["src/gadgets/narrated-traceback/NarratedTraceback.tsx", "component"],

  // assessment
  ["src/assessment/quiz/QuizEngine.tsx", "component"],
  ["src/assessment/quiz/QuizQuestion.tsx", "component"],
  ["src/assessment/quiz/types.ts", "types"],
  ["src/assessment/debugging/DebugChallenge.tsx", "component"],
  ["src/assessment/interleaved-review/ReviewSetBuilder.ts", "util"],
  ["src/assessment/exception-court/ExceptionCourt.tsx", "component"],
  ["src/assessment/curse-and-boon/CustomExceptionWorkshop.tsx", "component"],
  ["src/assessment/flashcards/SpacedRepetitionDeck.tsx", "component"],
  ["src/assessment/capstone/DharmaValidator.tsx", "component"],

  // progress
  ["src/progress/ProgressContext.tsx", "component"],
  ["src/progress/useProgress.ts", "hook"],
  ["src/progress/badges.ts", "util"],

  // content (cross-cutting)
  ["src/content/narration.ts", "util"],
  ["src/content/storyMappingTable.ts", "util"],

  // lib
  ["src/lib/pythonRunner.ts", "util"],
  ["src/lib/analytics.ts", "util"],

  // types
  ["src/types/lesson.ts", "types"],
  ["src/types/exception.ts", "types"],
  ["src/types/userProgress.ts", "types"],

  // styles
  ["src/styles/tokens.css", "css"],
];

function componentName(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

function boilerplate(filePath, kind) {
  const name = componentName(filePath);
  switch (kind) {
    case "component":
      return `import React from "react";

export default function ${name}() {
  return null;
}
`;
    case "hook":
      return `// ${name}
// TODO: implement

export function ${name}() {
  return {};
}
`;
    case "types":
      return `// ${name}
// TODO: define types for this domain
export {};
`;
    case "registry":
      return `import type { Lesson } from "./types";

// TODO: import each lesson's content.ts and assemble in order
export const LESSONS: Lesson[] = [];
`;
    case "content":
      return `// TODO: fill in this lesson's content following the Lesson interface
// defined in src/learning/lessons/types.ts

export default {
  // id, slug, order, title, storyTitle, storyBody, pauseQuestion,
  // conceptExplainer, mappingExplainer, codeExamples, practiceLadder, reflectionPrompt
};
`;
    case "util":
      return `// ${name}
// TODO: implement
export {};
`;
    case "css":
      return `:root {
  --color-bg: #0B1220;
  --color-panel: #131B2E;
  --color-gold: #E8B34D;
  --color-vermilion: #C65D3B;
  --color-text: #F3EEE3;
  --color-text-soft: #E6DFCF;
  --color-muted: #8C96AC;
  --color-line: #2A3550;
}
`;
    default:
      return "";
  }
}

let dirsCreated = 0;
let filesCreated = 0;
let filesSkipped = 0;

for (const dir of DIRS) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) {
    fs.mkdirSync(full, { recursive: true });
    dirsCreated++;
  }
}

for (const [relPath, kind] of FILES) {
  const full = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  if (fs.existsSync(full)) {
    filesSkipped++;
    continue;
  }
  fs.writeFileSync(full, boilerplate(relPath, kind), "utf8");
  filesCreated++;
}

console.log(`CodeGita scaffold complete.`);
console.log(`Directories created: ${dirsCreated}`);
console.log(`Files created: ${filesCreated}`);
console.log(`Files skipped (already existed): ${filesSkipped}`);
