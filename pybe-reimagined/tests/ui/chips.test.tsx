import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AutoSuggestChips } from '../../src/ui/AutoSuggestChips.tsx';

describe('AutoSuggestChips', () => {
  it('renders one chip per construct (INV-PB-9: only after typing)', () => {
    render(<AutoSuggestChips constructs={['list', 'for', 'sum']} onInsert={() => undefined} />);
    expect(screen.getByTestId('pybe-auto-suggest-chip-list')).toBeInTheDocument();
    expect(screen.getByTestId('pybe-auto-suggest-chip-for')).toBeInTheDocument();
    expect(screen.getByTestId('pybe-auto-suggest-chip-sum')).toBeInTheDocument();
  });

  it('invokes onInsert with the construct text when a chip is clicked', async () => {
    const onInsert = vi.fn();
    const user = userEvent.setup();
    render(<AutoSuggestChips constructs={['dict', 'list']} onInsert={onInsert} />);
    await user.click(screen.getByTestId('pybe-auto-suggest-chip-dict'));
    expect(onInsert).toHaveBeenCalledWith('dict');
  });

  it('renders nothing when constructs is empty (caller decides visibility)', () => {
    const { container } = render(
      <AutoSuggestChips constructs={[]} onInsert={() => undefined} />,
    );
    expect(container.querySelector('[data-testid="pybe-auto-suggest"]')).toBeNull();
  });
});