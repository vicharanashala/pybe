import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StringSlicingVisual } from '../../src/ui/components/StringSlicingVisual.tsx';

describe('StringSlicingVisual', () => {
  it('renders the initial slice expression', () => {
    render(<StringSlicingVisual initial="hello world" />);
    // Default initial slice = s[0:5] of "hello world"
    expect(screen.getByText(/s\[0:5:1\]/)).toBeInTheDocument();
    // The slice result "hello" appears in the slice-expression code badge.
    expect(screen.getByText(/"hello"/)).toBeInTheDocument();
    // Each character of the string is rendered as its own cell.
    expect(screen.getByText('h')).toBeInTheDocument();
    expect(screen.getByText('w')).toBeInTheDocument();
  });

  it('updates the slice preview when start slider moves', () => {
    render(<StringSlicingVisual initial="hello world" />);
    const start = screen.getByTestId('pybe-slice-start') as HTMLInputElement;

    fireEvent.change(start, { target: { value: '6' } });

    // The displayed expression updates to s[6:5:1] (any range where stop<start still renders)
    expect(screen.getByText(/s\[6:/)).toBeInTheDocument();
  });

  it('matches Python slice semantics for the default initial', () => {
    render(<StringSlicingVisual initial="hello world" />);
    // s[0:5] should yield "hello"
    expect(screen.getByText(/"hello"/)).toBeInTheDocument();
  });
});