// INV-A1: this file owns ONE type — CaseStudy.

import type { Construct } from './Construct.js';
import type { PiagetStage } from './PiagetStage.js';

export type JonassenType =
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

export type Level = 1 | 2 | 3 | 4 | 5;

/**
 * A Pybe case study — scenario first, constructs revealed later.
 *
 * The case study is presented as a single clean scenario in plain
 * English. Optionally a `practitionerNote` field anchors the same
 * construct in a real-world setting (the "you'd meet this on the job
 * as a backend engineer" footnote).
 *
 * INV-PB-2 (problems first) and INV-I5 (no lecture walls) are
 * satisfied by the `scenario` field being the only required narrative;
 * practitioners notes are short and supplementary.
 */
export interface CaseStudy {
  id: string;
  title: string;
  scenario: string;
  /** Short keyword list used by the Phase-7 generator. */
  hookWords: string[];
  piagetStage: PiagetStage;
  topicTags: string[];
  constructHint: Construct[];
  jonassenType: JonassenType;
  level: Level;
  /**
   * Optional real-world anchor. A one- or two-sentence footnote that
   * names where the same construct shows up in production code, an
   * industry workflow, or a research field. Rendered below the
   * scenario as a quiet aside — never as a wallpaper overlay.
   */
  practitionerNote?: string;
}