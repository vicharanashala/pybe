// INV-A1: this file owns the LessonRenderer abstraction.
// The Learn side of the app must depend on this interface, never on
// a concrete renderer. (INV-A5 — DIP.)

import type { CaseStudy } from './CaseStudy.ts';

/**
 * The rendered scenario that the UI displays.
 *
 * After the Phase-12 metaphor-system removal there is no Decorator
 * chain any more — the scenario is always the case study's own text.
 * The shape is kept so future additions (translation, level-of-detail,
 * accessibility layers) can drop in without changing call sites.
 */
export interface ScenarioView {
  /** The scenario text rendered to the learner. */
  text: string;
  /**
   * Optional "in the wild" footnote — a 1–2 sentence real-world anchor
   * for the same construct. Empty string when the case has no note.
   */
  practitionerNote: string;
}

export interface LessonRenderer {
  renderScenario(caseStudy: CaseStudy): ScenarioView;
}

/**
 * Default renderer. Returns the case study's own scenario text and,
 * if present, the practitioner note.
 */
export class DefaultRenderer implements LessonRenderer {
  renderScenario(caseStudy: CaseStudy): ScenarioView {
    return {
      text: caseStudy.scenario,
      practitionerNote: caseStudy.practitionerNote ?? '',
    };
  }
}

/**
 * Substitutability test (INV-A3): a DefaultRenderer works where any
 * LessonRenderer is expected.
 */
export const DEFAULT_RENDERER: LessonRenderer = new DefaultRenderer();