// Pure shared lesson rules. No rewards, transports, or UI state live here.
export function parseTemplate(template) {
  const parts = [];
  let end = 0,
    count = 0;
  for (const match of template.matchAll(/_{2,}/g)) {
    if (match.index > end)
      parts.push({ type: "text", content: template.slice(end, match.index) });
    parts.push({ type: "blank", index: count++ });
    end = match.index + match[0].length;
  }
  if (end < template.length)
    parts.push({ type: "text", content: template.slice(end) });
  return { parts, blankCount: count };
}
export function assembleCode(parts, values) {
  return parts
    .map((part) =>
      part.type === "text" ? part.content : (values[part.index] ?? "_____"),
    )
    .join("");
}
export function correctOrder(stage) {
  return (
    stage.correctOrder ??
    stage.tokens.filter((token) => token.correct).map((token) => token.value)
  );
}
export function hintFor(token, attempts) {
  if (!attempts) return "";
  const fallback =
    token?.hint || "Look at the current blank and try another option.";
  const hints = token?.hints;
  if (!hints) return fallback;
  if (attempts === 1) return hints.concept || fallback;
  if (attempts === 2) return hints.syntax || hints.concept || fallback;
  if (attempts === 3) return hints.example || hints.syntax || fallback;
  return `${hints.explanation || fallback} The token is: ${token.value}`;
}
export function validateOutput(validation, output) {
  if (!validation) return { valid: true };
  if (validation.type === "exact")
    return {
      valid: output.trim() === validation.expected.trim(),
      expected: validation.expected,
    };
  return {
    valid: false,
    error: `Unsupported exercise validation: ${validation.type}`,
  };
}
export function caseKey(topic, level, caseStudy) {
  return `${topic.topicId}/${level.levelId}/${caseStudy.id}`;
}
export function progressKey(collection) {
  return `pybe-learning-v1:${collection}`;
}
export function readProgress(storage, collection) {
  try {
    const value = JSON.parse(storage.getItem(progressKey(collection)) || "{}");
    return {
      completed: Array.isArray(value.completed)
        ? value.completed.filter((key) => typeof key === "string")
        : [],
    };
  } catch {
    return { completed: [] };
  }
}
export function saveProgress(storage, collection, progress) {
  try {
    storage.setItem(
      progressKey(collection),
      JSON.stringify({ completed: [...new Set(progress.completed)] }),
    );
    return true;
  } catch {
    return false;
  }
}
