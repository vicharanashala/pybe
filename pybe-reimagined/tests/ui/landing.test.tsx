import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LearnerProvider } from '../../src/state/LearnerContext.tsx';
import LandingPage from '../../src/ui/LandingPage.tsx';

beforeEach(() => {
  window.localStorage.clear();
  window.localStorage.setItem(
    'pybe:state:v1',
    JSON.stringify({
      revealedHints: {},
      lastAttempt: {},
      score: 100,
      level: 2,
      history: { cs_001: { lastScoreDelta: 25, lastAttemptAt: Date.now() } },
      hasOnboarded: true,
    }),
  );
});

describe('LandingPage (Phase-11 redesign)', () => {
  it('renders the hero, feature grid, and CTA', () => {
    render(
      <MemoryRouter>
        <LearnerProvider>
          <LandingPage />
        </LearnerProvider>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('pybe-hero-badge')).toBeInTheDocument();
    expect(screen.getByTestId('pybe-cta-begin')).toBeInTheDocument();
    expect(screen.getByTestId('pybe-cta-final')).toBeInTheDocument();
    expect(screen.getByText(/Why Pybe feels different/i)).toBeInTheDocument();
  });

  it('displays the stats grid (35 / 29 / 8 / 0)', () => {
    render(
      <MemoryRouter>
        <LearnerProvider>
          <LandingPage />
        </LearnerProvider>
      </MemoryRouter>,
    );
    const stats = within(screen.getByTestId('pybe-stats-grid'));
    expect(stats.getByText('35')).toBeInTheDocument();
    expect(stats.getByText('29')).toBeInTheDocument();
    expect(stats.getByText('8')).toBeInTheDocument();
    expect(stats.getByText('0')).toBeInTheDocument();
  });

  it('shows the "How it works" 3-step pipeline', () => {
    render(
      <MemoryRouter>
        <LearnerProvider>
          <LandingPage />
        </LearnerProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText(/How a case study works/i)).toBeInTheDocument();
    expect(screen.getByText('Read')).toBeInTheDocument();
    expect(screen.getByText('Reason')).toBeInTheDocument();
    expect(screen.getByText('Reveal')).toBeInTheDocument();
  });
});