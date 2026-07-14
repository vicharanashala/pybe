// INV-A1: this file owns ONE type — PiagetStage.

export type PiagetStage = 'sensorimotor' | 'preoperational' | 'concrete' | 'formal';

export const PIAGET_STAGES: readonly PiagetStage[] = [
  'sensorimotor',
  'preoperational',
  'concrete',
  'formal',
] as const;

export function isPiagetStage(value: unknown): value is PiagetStage {
  return (
    typeof value === 'string' && (PIAGET_STAGES as readonly string[]).includes(value)
  );
}