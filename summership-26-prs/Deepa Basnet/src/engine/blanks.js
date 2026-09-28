// Fill-in-the-blanks scaffolding for the code challenge.
//
// The point of this mode is to remove the typing and the indentation trap while
// keeping the actual decision intact — the learner still has to choose which
// snippet belongs where. What they assemble is real Python that goes through the
// same harness and the same validator as hand-typed code, so a blank filled
// wrongly fails because the program genuinely misbehaved, not because a string
// did not match.
//
// A template marks its blanks with {{slotId}}. The surrounding text carries the
// structure, including indentation, so a snippet is always a single statement or
// expression.

const SLOT = /\{\{(\w+)\}\}/g;

/**
 * Splits a template into lines of segments for rendering.
 * @returns {Array<Array<{type:'text',value:string}|{type:'slot',id:string}>>}
 */
export function templateLines(template) {
  return template.split('\n').map((line) => {
    const parts = [];
    let last = 0;
    let match;
    SLOT.lastIndex = 0;

    while ((match = SLOT.exec(line)) !== null) {
      if (match.index > last) parts.push({ type: 'text', value: line.slice(last, match.index) });
      parts.push({ type: 'slot', id: match[1] });
      last = match.index + match[0].length;
    }
    if (last < line.length) parts.push({ type: 'text', value: line.slice(last) });
    return parts;
  });
}

/** The slot ids a template actually uses, in the order they appear. */
export function slotIdsInTemplate(template) {
  const ids = [];
  let match;
  SLOT.lastIndex = 0;
  while ((match = SLOT.exec(template)) !== null) {
    if (!ids.includes(match[1])) ids.push(match[1]);
  }
  return ids;
}

/**
 * Builds the Python to run from the template and the learner's choices.
 * An unfilled slot becomes an empty string, which is why callers must check
 * `isComplete` before running — assembling an incomplete template would produce
 * code whose failure says nothing about the learner's understanding.
 */
export function assembleBlanks(template, selections) {
  return template.replace(SLOT, (_, id) => selections[id] ?? '');
}

/** Every slot the template uses has a choice recorded. */
export function isComplete(template, selections) {
  return slotIdsInTemplate(template).every((id) => {
    const value = selections[id];
    return typeof value === 'string' && value.length > 0;
  });
}

/** How many slots are filled, for progress wording like "2 of 3 chosen". */
export function filledCount(template, selections) {
  return slotIdsInTemplate(template).filter((id) => selections[id]).length;
}
