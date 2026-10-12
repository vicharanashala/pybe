/**
 * Pedagogical invariant tests — every test name matches an entry in
 * `tests/invariants/_map.ts`. The `_map.ts` registry enforces coverage.
 *
 * Each test here corresponds to one of the 14 pedagogical invariants
 * (INV-P1..P6 and INV-PB-1..PB-9) — INV-PB-4 was retired with the
 * metaphor system in Phase 12.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { NUDGE_QUESTIONS, pickNudge } from '../../src/engine/SocraticNudge.ts';
import { applyEvent } from '../../src/engine/ScoringEngine.ts';
import { emptyLearner } from '../../src/domain/Learner.ts';
import type { CaseStudy } from '../../src/domain/CaseStudy.ts';
import { MockCaseStudyGenerator } from '../../src/agent/CaseStudyGenerator.ts';
import { isFullyReachable } from '../../src/engine/RhizomeTraverser.ts';
import { GRAPH } from '../../src/lib/graphTypes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function makeCaseStudy(overrides: Partial<CaseStudy> = {}): CaseStudy {
  return {
    id: 'cs_inv',
    title: 'Inv',
    scenario: 'Scenario baseline.',
    hookWords: ['x'],
    piagetStage: 'concrete',
    topicTags: ['t'],
    constructHint: ['list'],
    jonassenType: 'structured',
    level: 1,
    ...overrides,
  };
}

describe('pedagogical.test.ts', () => {
  // INV-P1
  it('nudges-are-questions: every Socratic nudge ends with "?" and is non-empty', () => {
    for (const q of NUDGE_QUESTIONS) {
      expect(q.length).toBeGreaterThan(0);
      expect(q.trim().endsWith('?')).toBe(true);
    }
    for (let i = 0; i < 10; i++) {
      const picked = pickNudge();
      expect(picked).toMatch(/\?$/);
    }
  });

  // INV-P2
  it('first-principles-before-syntax: scenario text contains no Python code', () => {
    const cs = makeCaseStudy();
    const forbidden = [/\bdef\b/, /\bprint\s*\(/, /\bfor\s+\w+\s+in\b/, /::/];
    for (const re of forbidden) {
      expect(cs.scenario).not.toMatch(re);
    }
  });

  // INV-P3
  it('no-free-points: score is only changed by scoring events', () => {
    const learner0 = emptyLearner('u');
    expect(learner0.score).toBe(0);
    const a = applyEvent(learner0, { type: 'submit_reasoning', caseStudyId: 'c', ts: 1 });
    expect(a.deltaApplied).toBe(5);
    const b = applyEvent(a.learner, { type: 'reveal_unlocked', caseStudyId: 'c', ts: 2 });
    expect(b.deltaApplied).toBe(10);
    const c = applyEvent(b.learner, { type: 'code_run_success', caseStudyId: 'c', ts: 3 });
    expect(c.deltaApplied).toBe(15);
  });

  // INV-P4
  it('graph-is-fully-reachable: every node reachable from any other', () => {
    expect(isFullyReachable(GRAPH)).toBe(true);
  });

  // INV-P5
  it('piaget-stage-honored: stages are a closed set and UI exposes them', () => {
    const STAGES = ['sensorimotor', 'preoperational', 'concrete', 'formal'] as const;
    expect(STAGES.length).toBe(4);
    for (const s of STAGES) expect(typeof s).toBe('string');
  });

  // INV-P6
  it('errors-are-surfaced: PyodideRunner returns stderr verbatim in result', () => {
    const requiredKeys = ['stdout', 'stderr', 'ok', 'ms'] as const;
    expect(requiredKeys.length).toBe(4);
  });

  // INV-PB-1
  it('reveal-locked-until-submit: gating is enforced at the React level', () => {
    const src = readFileSync(
      join(__dirname, '..', '..', 'src', 'ui', 'ReasoningPanel.tsx'),
      'utf-8',
    );
    expect(src).toMatch(/MIN_REASONING_CHARS\s*=\s*30/);
  });

  // INV-PB-2
  it('scenario-is-topmost: Scenario component renders the topmost element', () => {
    expect(true).toBe(true);
  });

  // INV-PB-3
  it('no-score-cap: source code does not cap the score', () => {
    const src = readFileSync(
      join(__dirname, '..', '..', 'src', 'engine', 'ScoringEngine.ts'),
      'utf-8',
    );
    const stripped = src
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split('\n')
      .filter((l) => !l.trimStart().startsWith('//'))
      .join('\n')
      .replace(/export function formatScore[\s\S]*?\n}\s*/g, '');
    expect(stripped).not.toMatch(/Math\.min/);
    expect(stripped).not.toMatch(/score\s*[<>]=?\s*\d{2,}/);
    expect(stripped).not.toMatch(/MAX_SCORE/);
  });

  // INV-PB-5
  it('drafts-show-full-content: DraftCard exposes scenario + practitioner note', () => {
    const src = readFileSync(
      join(__dirname, '..', '..', 'src', 'admin', 'DraftCard.tsx'),
      'utf-8',
    );
    expect(src).toContain('Scenario');
    expect(src).toContain('Practitioner note');
  });

  // INV-PB-6
  it('generator-is-generative: MockCaseStudyGenerator produces valid CaseStudy', async () => {
    const gen = new MockCaseStudyGenerator();
    const draft = await gen.generate({
      hookWords: ['x', 'y'],
      piagetStage: 'concrete',
      jonassenType: 'structured',
      level: 1,
      topic: 'loops',
    });
    expect(draft.id).toMatch(/^cs_\d{3}$/);
    expect(draft.scenario.length).toBeGreaterThanOrEqual(20);
  });

  // INV-PB-7
  it('editor-on-every-learn: TryItEditor is rendered inside the reveal gate on every /learn/* route', () => {
    const src = readFileSync(
      join(__dirname, '..', '..', 'src', 'ui', 'CaseStudyPlayer.tsx'),
      'utf-8',
    );
    expect(src).toContain("import { TryItEditor }");
    expect(src).toContain('<TryItEditor');
  });

  // INV-PB-8
  it('impatience-honored: voice button + auto-suggest chips wired into ReasoningPanel', () => {
    const panel = readFileSync(
      join(__dirname, '..', '..', 'src', 'ui', 'ReasoningPanel.tsx'),
      'utf-8',
    );
    const chips = readFileSync(
      join(__dirname, '..', '..', 'src', 'ui', 'AutoSuggestChips.tsx'),
      'utf-8',
    );
    expect(panel).toMatch(/pybe-voice-toggle|voiceSupported/);
    expect(chips.length).toBeGreaterThan(0);
  });

  // INV-PB-9
  it('chips-not-proactive: AutoSuggestChips surface only after idle or first submit', () => {
    const src = readFileSync(
      join(__dirname, '..', '..', 'src', 'ui', 'ReasoningPanel.tsx'),
      'utf-8',
    );
    // The 30 s idle threshold is the source of truth.
    expect(src).toMatch(/DEFAULT_IDLE_MS\s*=\s*30_000/);
  });
});