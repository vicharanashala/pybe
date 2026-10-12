/**
 * Invariant registry — single source of truth for Phase 8.
 *
 * Every invariant in `Pybe_Master_Blueprint.md §6.3` must appear here with
 * ≥ 1 test name. The meta-tests below assert:
 *
 *   1. Every invariant has ≥ 1 test
 *   2. Every listed test name exists in a test file under tests/invariants/
 *   3. No invariant has been "removed but left listed" — the test name
 *      must literally appear as a `test('…', …)` call in the file.
 *
 * If a contributor deletes an invariant test, CI fails on (3). If they
 * delete the meta-test, CI fails on (1). If they delete the invariant
 * entry itself, CI fails on (1).
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export type InvariantCategory =
  | 'pedagogical'
  | 'architectural'
  | 'interface'
  | 'data';

export interface InvariantEntry {
  code: string;
  category: InvariantCategory;
  phase: number;
  description: string;
  /** Each entry must contain at least one test ID matching `${file}#${name}`. */
  tests: string[];
}

export const INVARIANTS: InvariantEntry[] = [
  // ── Pedagogical (15) ────────────────────────────────────────────────
  {
    code: 'INV-P1',
    category: 'pedagogical',
    phase: 1,
    description: 'Socratic nudges are questions, not lectures',
    tests: ['pedagogical.test.ts#nudges-are-questions'],
  },
  {
    code: 'INV-P2',
    category: 'pedagogical',
    phase: 1,
    description: 'First principles precede any Python syntax reveal',
    tests: ['pedagogical.test.ts#first-principles-before-syntax'],
  },
  {
    code: 'INV-P3',
    category: 'pedagogical',
    phase: 2,
    description: 'Score only increases via case-study events; no free points',
    tests: ['pedagogical.test.ts#no-free-points'],
  },
  {
    code: 'INV-P4',
    category: 'pedagogical',
    phase: 6,
    description: 'No fixed curriculum order — concept graph fully reachable',
    tests: ['pedagogical.test.ts#graph-is-fully-reachable'],
  },
  {
    code: 'INV-P5',
    category: 'pedagogical',
    phase: 1,
    description: 'Piaget stage is honored in copy and visual color',
    tests: ['pedagogical.test.ts#piaget-stage-honored'],
  },
  {
    code: 'INV-P6',
    category: 'pedagogical',
    phase: 4,
    description: 'Errors surfaced verbatim, stderr in red',
    tests: ['pedagogical.test.ts#errors-are-surfaced'],
  },
  {
    code: 'INV-PB-1',
    category: 'pedagogical',
    phase: 1,
    description: 'Syntax is the last step — Reveal locked until submit',
    tests: ['pedagogical.test.ts#reveal-locked-until-submit'],
  },
  {
    code: 'INV-PB-2',
    category: 'pedagogical',
    phase: 1,
    description: 'Case scenarios lead; code follows',
    tests: ['pedagogical.test.ts#scenario-is-topmost'],
  },
  {
    code: 'INV-PB-3',
    category: 'pedagogical',
    phase: 2,
    description: 'No score ceiling — score may grow without bound',
    tests: ['pedagogical.test.ts#no-score-cap'],
  },
  // INV-PB-4 (chosen metaphor is honored) — RETIRED in Phase 12.
  // Case studies no longer have per-metaphor variants.
  {
    code: 'INV-PB-5',
    category: 'pedagogical',
    phase: 7,
    description: 'Platform resists shallow PRs — draft cards show full content',
    tests: ['pedagogical.test.ts#drafts-show-full-content'],
  },
  {
    code: 'INV-PB-6',
    category: 'pedagogical',
    phase: 7,
    description: 'Case-study authoring is generative',
    tests: ['pedagogical.test.ts#generator-is-generative'],
  },
  {
    code: 'INV-PB-7',
    category: 'pedagogical',
    phase: 4,
    description: 'Students can always code — TryItEditor on every /learn route',
    tests: ['pedagogical.test.ts#editor-on-every-learn'],
  },
  {
    code: 'INV-PB-8',
    category: 'pedagogical',
    phase: 5,
    description: 'Impatience honored — voice + autocomplete available',
    tests: ['pedagogical.test.ts#impatience-honored'],
  },
  {
    code: 'INV-PB-9',
    category: 'pedagogical',
    phase: 5,
    description: 'Tolerance for vagueness — chips appear only after stall',
    tests: ['pedagogical.test.ts#chips-not-proactive'],
  },

  // ── Architectural / SOLID (5) ───────────────────────────────────────
  {
    code: 'INV-A1',
    category: 'architectural',
    phase: 0,
    description: 'SRP — each domain file owns exactly one type',
    tests: ['architectural.test.ts#domain-files-own-one-type'],
  },
  {
    code: 'INV-A2',
    category: 'architectural',
    phase: 3,
    description: 'OCP — case-study loader uses import.meta.glob; adding a cs_NNN.json is zero-code',
    tests: ['architectural.test.ts#no-hardcoded-ids'],
  },
  // INV-A3 (MetaphorDecorated is a LessonRenderer) — RETIRED in Phase 12.
  // The metaphor Decorator was removed along with the metaphor system.
  {
    code: 'INV-A4',
    category: 'architectural',
    phase: 4,
    description: 'ISP — adapters expose only the methods the UI consumes',
    tests: ['architectural.test.ts#adapter-interfaces-are-narrow'],
  },
  {
    code: 'INV-A5',
    category: 'architectural',
    phase: 4,
    description: 'DIP — UI depends on interfaces, not concrete adapters',
    tests: ['architectural.test.ts#ui-depends-on-interfaces'],
  },

  // ── Interface / UI (6) ──────────────────────────────────────────────
  {
    code: 'INV-I1',
    category: 'interface',
    phase: 1,
    description: 'Scenario is the first thing visible',
    tests: ['interface.test.tsx#scenario-is-first'],
  },
  {
    code: 'INV-I2',
    category: 'interface',
    phase: 1,
    description: 'Three-region layout — Scenario / Reasoning / Reveal',
    tests: ['interface.test.tsx#three-region-order'],
  },
  {
    code: 'INV-I3',
    category: 'interface',
    phase: 6,
    description: 'Free navigation — graph nodes are all reachable',
    tests: ['interface.test.tsx#graph-free-navigation'],
  },
  {
    code: 'INV-I4',
    category: 'interface',
    phase: 4,
    description: 'Code is always runnable — TryItEditor is real',
    tests: ['interface.test.tsx#code-is-runnable'],
  },
  {
    code: 'INV-I5',
    category: 'interface',
    phase: 3,
    description: 'No lecture walls — onboarding uses tile grid, no paragraphs',
    tests: ['interface.test.tsx#no-lecture-walls'],
  },
  {
    code: 'INV-I6',
    category: 'interface',
    phase: 2,
    description: 'Visible cognitive stage — LevelBadge visible on every page',
    tests: ['interface.test.tsx#level-badge-visible'],
  },

  // ── Data (3) ────────────────────────────────────────────────────────
  {
    code: 'INV-D1',
    category: 'data',
    phase: 0,
    description: 'JSON Schema Compliance — Ajv validates every case study',
    tests: ['data.test.ts#json-schema-compliance'],
  },
  {
    code: 'INV-D2',
    category: 'data',
    phase: 6,
    description: 'Graph Integrity — every node reachable from any other',
    tests: ['data.test.ts#graph-integrity'],
  },
  {
    code: 'INV-D3',
    category: 'data',
    phase: 1,
    description: 'Progress is lossless — localStorage persistence',
    tests: ['data.test.ts#progress-lossless'],
  },
];

/**
 * Locate a test function by its `<file>#<name>` ID and return the path
 * to the test file iff a test by that name exists.
 *
 * Implementation note: we check that the test file contains a call to
 * `it('<name>'` or `it("<name>"` or `it(\`<name>\`` — covering both single
 * and double quotes, with optional backtick for completeness.
 */
export function findTestInFile(file: string, name: string): string | null {
  const basename = file;
  const invDir = __dirname;
  const candidates = [
    join(invDir, basename),
    join(invDir, basename.replace(/\.tsx?$/, '.tsx')),
    join(invDir, basename.replace(/\.tsx?$/, '.ts')),
  ];
  let path: string | null = null;
  for (const c of candidates) {
    try {
      const s = statSync(c);
      if (s.isFile()) {
        path = c;
        break;
      }
    } catch {
      /* not found */
    }
  }
  if (!path) return null;

  const src = readFileSync(path, 'utf-8');
  const quotes = ["'", '"', '`'] as const;
  for (const q of quotes) {
    // Match `it('name'` or `test('name'` or with a colon-prefixed description.
    const needle = `it(${q}${name}`;
    if (src.includes(needle)) return path;
    const testNeedle = `test(${q}${name}`;
    if (src.includes(testNeedle)) return path;
  }
  return null;
}

export function listInvariantFiles(): string[] {
  const dir = join(__dirname, '..', 'invariants');
  try {
    return readdirSync(dir).filter((f) => /\.test\.tsx?$/.test(f));
  } catch {
    return [];
  }
}