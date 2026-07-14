/**
 * CaseStudyOrchestrator — the engine-level wrapper that the UI talks to.
 *
 * Phase 1 scope:
 * - given a case-study id, return the CaseStudy (from the in-memory store)
 * - given a candidate id, validate it exists
 *
 * Phase 7 (LLM-backed content) will replace this with a generator-backed
 * implementation. INV-A2 (Open/Closed) means the UI does not change.
 */
import type { CaseStudy } from '../domain/CaseStudy.ts';
import { CASE_STUDIES, getCaseStudy } from '../lib/cases.ts';

export class CaseStudyNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Case study not found: ${id}`);
    this.name = 'CaseStudyNotFoundError';
  }
}

export interface CaseStudyOrchestrator {
  load(id: string): CaseStudy;
  list(): readonly CaseStudy[];
}

export const orchestrator: CaseStudyOrchestrator = {
  load(id: string): CaseStudy {
    const cs = getCaseStudy(id);
    if (!cs) {
      throw new CaseStudyNotFoundError(id);
    }
    return cs;
  },
  list(): readonly CaseStudy[] {
    return CASE_STUDIES;
  },
};

export function listCaseStudies(): readonly CaseStudy[] {
  return CASE_STUDIES;
}