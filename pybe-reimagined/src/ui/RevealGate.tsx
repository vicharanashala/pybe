import { Lock } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  locked: boolean;
  children: ReactNode;
}

/**
 * INV-PB-1 (syntax is the last step) and INV-I2 (three-region layout):
 * the reveal region is locked until the user has submitted reasoning.
 *
 * When locked: shows a padlock and a one-line message.
 * When unlocked: renders whatever children the parent provides.
 */
export function RevealGate({ locked, children }: Props) {
  if (locked) {
    return (
      <div
        data-testid="pybe-reveal-locked"
        className="rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 p-8 text-center"
      >
        <Lock className="mx-auto h-8 w-8 text-stone-400" />
        <p className="mt-3 text-sm text-stone-500">
          Submit your reasoning above to unlock the construct.
        </p>
      </div>
    );
  }
  return (
    <div data-testid="pybe-reveal-unlocked" className="contents">
      {children}
    </div>
  );
}