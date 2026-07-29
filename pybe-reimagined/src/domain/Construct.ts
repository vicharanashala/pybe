// INV-A1: this file owns ONE type — Construct.
// Construct names are Python-language primitives. New ones can be added
// in later phases (regex, async, etc.).

export type Construct =
  | 'list'
  | 'dict'
  | 'str'
  | 'int'
  | 'float'
  | 'tuple'
  | 'set'
  | 'for'
  | 'while'
  | 'range'
  | 'enumerate'
  | 'zip'
  | 'slice'
  | 'function'
  | 'class'
  | 'if'
  | 'arithmetic'
  | 'f-string'
  | 'len'
  | 'sum';

export const CONSTRUCTS: readonly Construct[] = [
  'list',
  'dict',
  'str',
  'int',
  'float',
  'tuple',
  'set',
  'for',
  'while',
  'range',
  'enumerate',
  'zip',
  'slice',
  'function',
  'class',
  'if',
  'arithmetic',
  'f-string',
  'len',
  'sum',
] as const;

export function isConstruct(value: unknown): value is Construct {
  return typeof value === 'string' && (CONSTRUCTS as readonly string[]).includes(value);
}