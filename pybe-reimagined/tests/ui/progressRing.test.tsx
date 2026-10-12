import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ProgressRing } from '../../src/ui/ProgressRing.tsx';

describe('ProgressRing', () => {
  it('renders the level number inside the ring', () => {
    const { container } = render(<ProgressRing progress={0.5} currentLevel={2} score={50} />);
    expect(container.querySelector('[data-testid="pybe-progress-ring-level"]')?.textContent).toBe('2');
  });

  it('renders the progress ring with two <circle> elements (track + foreground)', () => {
    const { container } = render(<ProgressRing progress={0.3} currentLevel={1} score={10} />);
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(2);
  });

  it('shows the next-level target when nextLevelLabel is provided', () => {
    const { container } = render(
      <ProgressRing
        progress={0.4}
        currentLevel={2}
        score={20}
        nextLevelLabel="Intermediate"
        nextLevelThreshold={50}
      />,
    );
    expect(container.textContent).toContain('Intermediate');
    expect(container.textContent).toContain('20');
    expect(container.textContent).toContain('50');
  });

  it('omits the target text when nextLevelLabel is undefined (already at Mastery)', () => {
    const { container } = render(
      <ProgressRing progress={1} currentLevel={5} score={1000} />,
    );
    expect(container.textContent).not.toContain('→');
  });
});