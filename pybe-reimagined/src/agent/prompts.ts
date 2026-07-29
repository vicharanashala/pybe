/**
 * Centralized prompt templates for the case-study generator.
 * Keeping all prompts in one file makes them auditable, testable, and
 * easy to iterate without touching the generator's control flow.
 *
 * Phase 12: the per-metaphor variant instruction has been removed.
 * Case studies present a single clean scenario with an optional
 * practitionerNote footnote.
 */

export interface PromptInputs {
  hookWords: string[];
  piagetStage: 'sensorimotor' | 'preoperational' | 'concrete' | 'formal';
  jonassenType:
    | 'structured'
    | 'design'
    | 'dilemma'
    | 'unstructured'
    | 'story'
    | 'performance'
    | 'negotiation'
    | 'rule-using'
    | 'rule-induction'
    | 'diagnosis'
    | 'troubleshooting';
  level: 1 | 2 | 3 | 4 | 5;
  topic: string;
  retrievedChunks: string[];
}

const SYSTEM_PROMPT_TEXT = [
  'You are a Python pedagogy author writing case studies for "Pybe", a tool that teaches Python through real-life scenarios.',
  'Output ONLY valid JSON that conforms to the schema below. No prose, no markdown fences.',
  '',
  'JSON schema (required keys):',
  '{',
  '  "id": string,            // cs_NNN, three-digit zero-padded',
  '  "title": string,         // 100 chars or fewer',
  '  "scenario": string,      // plain-language scenario, 30-800 chars',
  '  "hookWords": string[],   // 2-6 short keywords',
  '  "piagetStage": "concrete" | "formal" | "sensorimotor" | "preoperational",',
  '  "topicTags": string[],   // 1-8 short tags',
  '  "constructHint": string[], // 1-10 Python construct identifiers (lowercase)',
  '  "jonassenType": "structured" | ... | "troubleshooting",',
  '  "level": 1 | 2 | 3 | 4 | 5,',
  '  "practitionerNote": string  // OPTIONAL - 1-2 sentence real-world anchor',
  '}',
  '',
  'Hard rules:',
  '- scenario presents ONE clear problem in plain English, no Python syntax, no fictional re-cast.',
  '- constructHint values are Python keywords or builtins: list, dict, str, int, float, tuple, set, for, while, range, enumerate, zip, slice, function, class, if, len, sum, arithmetic, f-string.',
  '- scenario must be answerable by a learner using only constructHint values.',
  '- if you include a practitionerNote, it should name where the same construct shows up in real production code or an industry workflow.',
].join('\n');

export const SYSTEM_PROMPT = SYSTEM_PROMPT_TEXT;

export function buildUserPrompt(inputs: PromptInputs): string {
  const retrieved = inputs.retrievedChunks.slice(0, 4).join('\n\n');
  return [
    'Generate a Pybe case study.',
    '',
    `HOOK WORDS: ${inputs.hookWords.join(', ')}`,
    `PIAGET STAGE: ${inputs.piagetStage}`,
    `JONASSEN TYPE: ${inputs.jonassenType}`,
    `LEVEL: ${inputs.level}`,
    `TOPIC: ${inputs.topic}`,
    '',
    'REFERENCE MATERIAL (use for accuracy; do not copy verbatim):',
    '---',
    retrieved || '(no retrieved chunks)',
    '---',
    '',
    'Now produce the JSON object. Use the SAME hook-words in the hookWords array.',
  ].join('\n');
}

export const REPAIR_PROMPT =
  'Your previous JSON did not validate. Repair only the invalid field(s) ' +
  'and return the full corrected JSON. Do NOT add commentary.';
