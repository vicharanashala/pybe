/**
 * Central vocabulary shared by the Phase 3 AI services, so scenario
 * generation, mastery prediction, and the learning path all agree on the
 * same concept names instead of drifting apart.
 */

// Real concept tags found in server/src/data/db.json, grouped into the
// seven learner-facing mastery categories requested for Feature 10. A tag
// can appear in more than one category is avoided on purpose to keep
// mastery math simple.
const MASTERY_CATEGORIES = {
  Variables: ['variables', 'arithmetic', 'strings', 'formatting'],
  Conditionals: ['conditionals', 'comparisons', 'comparison', 'validation', 'adaptive logic'],
  Loops: ['loops', 'while loops', 'counting'],
  Lists: ['lists', 'indexing', 'filtering', 'search', 'sets', 'mutation', 'averages'],
  Dictionaries: ['dictionaries'],
  Functions: ['functions', 'modulo', 'subtraction'],
  OOP: ['oop', 'classes', 'objects']
};

// Tier order used for the personalized learning path / dependency graph.
// Each concept generally depends on the concepts in the tiers before it.
const LEARNING_PATH_TIERS = [
  { tier: 1, concept: 'Variables', dependsOn: [] },
  { tier: 2, concept: 'Conditionals', dependsOn: ['Variables'] },
  { tier: 3, concept: 'Loops', dependsOn: ['Variables', 'Conditionals'] },
  { tier: 4, concept: 'Lists', dependsOn: ['Loops'] },
  { tier: 5, concept: 'Dictionaries', dependsOn: ['Lists'] },
  { tier: 6, concept: 'Functions', dependsOn: ['Loops', 'Conditionals'] },
  { tier: 7, concept: 'OOP', dependsOn: ['Functions', 'Dictionaries'] }
];

// Matches the keyword rules in services/learningEngine.js's conceptRules.
// Used by the offline scenario generator to guarantee generated scenarios
// trigger the *correct* computational-thinking mapping and code template,
// and as a hint to the real-LLM prompt so it tends to do the same.
const CONCEPT_TRIGGER_KEYWORDS = {
  Variables: ['store', 'remember', 'value', 'name it'],
  Conditionals: ['if', 'otherwise', 'condition', 'greater than', 'less than'],
  Loops: ['repeat', 'repeatedly', 'for every item', 'loop'],
  Lists: ['dictionary', 'key', 'value', 'pair', 'store each'],
  Dictionaries: ['dictionary', 'key', 'value', 'pair', 'map'],
  Functions: ['step', 'process', 'recipe', 'function', 'reuse'],
  OOP: ['object', 'class', 'instance', 'attribute', 'method', 'properties and actions']
};

const THEMES = [
  'School', 'Hospital', 'Sports', 'Shopping', 'Travel', 'Space',
  'Banking', 'Gaming', 'Environment', 'Cooking', 'Business', 'Office'
];

const DIFFICULTIES = ['Beginner', 'Explorer', 'Builder'];

function categoryForConcept(concept) {
  const lower = concept.toLowerCase();
  return Object.entries(MASTERY_CATEGORIES).find(([, tags]) => tags.includes(lower))?.[0] || null;
}

module.exports = {
  MASTERY_CATEGORIES,
  LEARNING_PATH_TIERS,
  CONCEPT_TRIGGER_KEYWORDS,
  THEMES,
  DIFFICULTIES,
  categoryForConcept
};
