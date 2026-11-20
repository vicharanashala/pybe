import type { TopicDefinition } from "../data/curriculum";
// A local reflection checklist. It provides prompts for revision, without grading the learner.
export function evaluateReflection(text: string, topic?: TopicDefinition) {
  const points = [];
  if (text.trim().split(/\s+/).length < 6)
    points.push(
      "Name the story problem, explain the Python rule, and predict its result.",
    );
  else {
    points.push(
      `Revisit your explanation of ${topic?.title || "the concept"} alongside the story.`,
    );
    if (!/because|why|therefore|so that/i.test(text))
      points.push("Explain why the rule produces the result you predicted.");
    if (!/example|input|output|result/i.test(text))
      points.push(
        "Add a concrete example with an input and an expected result.",
      );
    points.push(
      topic?.learningReflection.memoryTrick ||
        "Connect each story action to the corresponding Python instruction.",
    );
  }
  return { scores: null, feedback: points.join("\n\n") };
}
