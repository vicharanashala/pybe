import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../src/state/ThemeContext.tsx';
import { ThemeToggle } from '../../src/ui/ThemeToggle.tsx';

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.classList.remove('dark');
});

describe('ThemeContext (UI/UX pass)', () => {
  it('cycles light -> dark -> system -> light on click', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    const btn = screen.getByTestId('pybe-theme-toggle');
    expect(btn.getAttribute('data-mode')).toBe('system');

    fireEvent.click(btn);
    expect(btn.getAttribute('data-mode')).toBe('light');

    fireEvent.click(btn);
    expect(btn.getAttribute('data-mode')).toBe('dark');

    fireEvent.click(btn);
    expect(btn.getAttribute('data-mode')).toBe('system');
  });

  it('applies the .dark class to <html> when in dark mode', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    const btn = screen.getByTestId('pybe-theme-toggle');
    fireEvent.click(btn); // system -> light
    fireEvent.click(btn); // light -> dark
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('persists the chosen mode to localStorage', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    const btn = screen.getByTestId('pybe-theme-toggle');
    fireEvent.click(btn); // -> light
    fireEvent.click(btn); // -> dark
    expect(window.localStorage.getItem('pybe:theme:v1')).toBe('dark');
  });

  it('useTheme is resilient when no provider is present', () => {
    let mode: string | null = null;
    function Probe() {
      const t = useTheme();
      mode = t.mode;
      return null;
    }
    // No ThemeProvider in the tree.
    render(<Probe />);
    expect(mode).toBe('system');
  });
});