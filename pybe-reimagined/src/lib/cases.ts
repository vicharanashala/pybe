/**
 * Case-study loader.
 *
 * Phase 0 used static imports for the 5 seeds; Phase 7 grew the count
 * to ≥ 25 via the LLM/Mock generator. We now glob all `cs_*.json` files
 * at build time.
 *
 * INV-A2 (OCP): adding case studies requires no code change — drop a
 * `cs_NNN.json` file in content/case_studies/ and Vite includes it.
 */

import type { CaseStudy } from '../domain/CaseStudy.ts';

// Eagerly loads every cs_NNN.json file under content/case_studies/.
const allCaseStudyModules = import.meta.glob<CaseStudy>('/content/case_studies/cs_*.json', {
  eager: true,
});

const allCases: CaseStudy[] = Object.values(allCaseStudyModules);

export const CASE_STUDIES: readonly CaseStudy[] = allCases.slice().sort((a, b) =>
  a.id.localeCompare(b.id),
);

export function getCaseStudy(id: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.id === id);
}