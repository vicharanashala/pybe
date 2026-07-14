// Best-effort mapping from a PYBE concept slug to the matching Practice
// Questions topic. The two taxonomies don't line up perfectly (e.g. PYBE's
// single "Loops" concept covers what Practice splits into "While Loops" and
// "For Loops"), so anything ambiguous or missing falls back to `null` and
// the caller should send the learner to the general Practice topics hub
// instead of guessing wrong.
const CONCEPT_SLUG_TO_PRACTICE_TOPIC = {
  variables: 'Variables',
  operators: 'Operators',
  conditions: 'If...Else',
  functions: 'Functions',
  lists: 'Lists',
  tuples: 'Tuples',
  dictionaries: 'Dictionaries',
  sets: 'Sets',
  classes: 'Classes/Objects',
  objects: 'Classes/Objects',
  inheritance: 'Inheritance',
  // loops, string-handling, input-output, file-handling, hello-world,
  // access-modifiers, and abstraction don't map cleanly to a single
  // Practice topic — leave unmapped on purpose.
};

export function getPracticeTopicForConcept(conceptSlug) {
  return CONCEPT_SLUG_TO_PRACTICE_TOPIC[conceptSlug] || null;
}
