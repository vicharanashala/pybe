// INV-A1: this file owns ONE type — ConceptNode (recursive composite).

import type { PiagetStage } from './PiagetStage.js';

export type TopicTag =
  | 'slicing'
  | 'dicts'
  | 'loops'
  | 'conditionals'
  | 'lists'
  | 'strings'
  | 'variables'
  | 'functions'
  | 'modules'
  | 'files'
  | 'errors'
  | 'oop'
  | 'comprehensions'
  | 'regex'
  | 'async'
  | 'testing'
  | 'data'
  | 'web'
  | 'firmware';

export interface ConceptNode {
  id: string;
  title: string;
  topics: TopicTag[];
  stage: PiagetStage;
  firstPrinciples: string[];
  anchorProblemIds: string[];
  children: ConceptNode[];
}