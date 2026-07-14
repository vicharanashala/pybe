import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LearnerProvider } from '../../src/state/LearnerContext.tsx';
import { WeeklyReview } from '../../src/ui/WeeklyReview.tsx';
import {
  LocalStorageTracker,
  setTrackerForTesting,
} from '../../src/analytics/tracker.ts';

beforeEach(() => {
  window.localStorage.clear();
});

function renderReview() {
  window.localStorage.setItem(
    'pybe:state:v1',
    JSON.stringify({
      revealedHints: {},
      lastAttempt: {},
      score: 0,
      level: 1,
      history: {},
      hasOnboarded: true,
    }),
  );
  return render(
    <MemoryRouter>
      <LearnerProvider>
        <WeeklyReview />
      </LearnerProvider>
    </MemoryRouter>,
  );
}

describe('WeeklyReview (Phase 10)', () => {
  it('shows empty state when no events are buffered', () => {
    renderReview();
    expect(screen.getByTestId('pybe-weekly-empty')).toBeInTheDocument();
  });

  it('aggregates events: total / unique / 7-day / success rate / feedback avg', () => {
    const tracker = new LocalStorageTracker();
    setTrackerForTesting(tracker);
    // Simulate 5 events across 2 anonymous learners.
    tracker.track({
      name: 'case_started',
      userId: 'u1',
      ts: Date.now(),
      props: { caseStudyId: 'cs_001', piagetStage: 'concrete' },
    });
    tracker.track({
      name: 'run_code_success',
      userId: 'u1',
      ts: Date.now(),
      props: { caseStudyId: 'cs_001', ms: 12 },
    });
    tracker.track({
      name: 'run_code_failure',
      userId: 'u2',
      ts: Date.now(),
      props: { caseStudyId: 'cs_001', ms: 5, errorType: 'error' },
    });
    tracker.track({
      name: 'feedback_submitted',
      userId: 'u2',
      ts: Date.now(),
      props: { score: 4, hasComment: false },
    });
    tracker.track({
      name: 'feedback_submitted',
      userId: 'u2',
      ts: Date.now(),
      props: { score: 5, hasComment: true },
    });

    // Re-render so the component re-reads from the tracker.
    renderReview();

    expect(screen.getByTestId('pybe-weekly-byname')).toBeInTheDocument();
    // 1 success / 2 runs = 50%
    expect(screen.getByText('50%')).toBeInTheDocument();
    // Feedback avg = 4.5
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('renders the feature flag table with v1 ON, v2 OFF (Phase 10 guardrail)', () => {
    renderReview();
    const flags = screen.getByTestId('pybe-weekly-flags');
    expect(flags).toBeInTheDocument();
    // v2 stretch flags all show OFF.
    expect(screen.getByTestId('pybe-flag-v1.stretch.horcruxes')).toHaveTextContent('OFF');
    expect(screen.getByTestId('pybe-flag-v1.stretch.time_stone')).toHaveTextContent('OFF');
    expect(screen.getByTestId('pybe-flag-v1.stretch.sorting_hat')).toHaveTextContent('OFF');
    expect(screen.getByTestId('pybe-flag-v1.stretch.firmware')).toHaveTextContent('OFF');
    expect(screen.getByTestId('pybe-flag-v1.stretch.embed_mode')).toHaveTextContent('OFF');
    expect(screen.getByTestId('pybe-flag-v1.stretch.bilingual')).toHaveTextContent('OFF');
    // v1 iterate flags reflect their actual state.
    expect(screen.getByTestId('pybe-flag-v1.iterate.weekly_review_page')).toHaveTextContent('ON');
  });
});

void fireEvent;