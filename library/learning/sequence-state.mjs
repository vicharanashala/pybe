export const readingTypes = new Set([
  "story",
  "mapping-visual",
  "reveal",
  "mental-model",
  "syntax",
]);
export function validateSource(validation = {}, code) {
  if (validation.mustContain && !code.includes(validation.mustContain))
    return false;
  if (validation.patterns?.length) {
    const matches = validation.patterns.map((item) =>
      new RegExp(item.pattern, item.flags).test(code),
    );
    if (
      validation.patternsRequireAny
        ? !matches.some(Boolean)
        : !matches.every(Boolean)
    )
      return false;
  }
  if (validation.requiredSubstrings?.length) {
    const matches = validation.requiredSubstrings.map((text) =>
      code.includes(text),
    );
    if (
      validation.requiredAny ? !matches.some(Boolean) : !matches.every(Boolean)
    )
      return false;
  }
  return true;
}
export function stepReady(step, response) {
  if (step.type === "syntax" && step.operations)
    return (
      response?.finished === true &&
      response.opsPlayed >= step.operations.length
    );
  if (readingTypes.has(step.type)) return true;
  if (step.type === "question")
    return (
      Number.isInteger(response) &&
      response >= 0 &&
      response < step.options.length
    );
  if (["assessment", "discovery"].includes(step.type))
    return step.questions.every(
      (q) =>
        Number.isInteger(response?.[q.id]) &&
        response[q.id] >= 0 &&
        response[q.id] < q.options.length,
    );
  if (["retrieval-activity", "lookup-activity"].includes(step.type))
    return response?.roundIndex >= step.rounds.length;
  if (step.type === "coding")
    return (
      response?.ran === true &&
      (!step.storyEvents ||
        step.storyEvents.every(
          (event, index) => response.order?.[index] === event.id,
        ))
    );
  if (step.type === "reflection")
    return step.prompts.some(
      (_, index) =>
        typeof response?.[index] === "string" && response[index].trim(),
    );
  return false;
}
export function readSequence(storage, collection, count) {
  try {
    const state = JSON.parse(
      storage.getItem(`pybe-sequence-v1:${collection}`) || "{}",
    );
    return {
      index: Number.isInteger(state.index)
        ? Math.max(0, Math.min(count - 1, state.index))
        : 0,
      responses:
        state.responses &&
        typeof state.responses === "object" &&
        !Array.isArray(state.responses)
          ? state.responses
          : {},
      done: state.done === true,
    };
  } catch {
    return { index: 0, responses: {}, done: false };
  }
}
export function saveSequence(storage, collection, state) {
  try {
    storage.setItem(
      `pybe-sequence-v1:${collection}`,
      JSON.stringify({
        index: state.index,
        responses: state.responses,
        done: state.done,
      }),
    );
    return true;
  } catch {
    return false;
  }
}
