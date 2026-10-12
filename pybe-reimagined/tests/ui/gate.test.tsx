import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RevealGate } from '../../src/ui/RevealGate.tsx';

describe('RevealGate', () => {
  it('shows a padlock when locked (INV-PB-1)', () => {
    render(
      <RevealGate locked>
        <div data-testid="pybe-secret">should not render</div>
      </RevealGate>,
    );
    expect(screen.getByTestId('pybe-reveal-locked')).toBeInTheDocument();
    expect(screen.queryByTestId('pybe-secret')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pybe-reveal-unlocked')).not.toBeInTheDocument();
  });

  it('renders children when unlocked', () => {
    render(
      <RevealGate locked={false}>
        <div data-testid="pybe-secret">shown</div>
      </RevealGate>,
    );
    expect(screen.queryByTestId('pybe-reveal-locked')).not.toBeInTheDocument();
    expect(screen.getByTestId('pybe-reveal-unlocked')).toBeInTheDocument();
    expect(screen.getByTestId('pybe-secret')).toBeInTheDocument();
  });
});