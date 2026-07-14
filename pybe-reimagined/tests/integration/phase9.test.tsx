import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LearnerProvider } from '../../src/state/LearnerContext.tsx';
import { FeedbackWidget } from '../../src/ui/FeedbackWidget.tsx';
import { setTrackerForTesting } from '../../src/analytics/tracker.ts';
import { LocalStorageTracker } from '../../src/analytics/tracker.ts';

function renderWidget() {
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
        <FeedbackWidget />
      </LearnerProvider>
    </MemoryRouter>,
  );
}

describe('FeedbackWidget (Phase 9)', () => {
  beforeEach(() => {
    setTrackerForTesting(new LocalStorageTracker());
  });

  it('renders a trigger button by default', () => {
    renderWidget();
    expect(screen.getByTestId('pybe-feedback-trigger')).toBeInTheDocument();
  });

  it('opens to a star + comment form on click', () => {
    renderWidget();
    fireEvent.click(screen.getByTestId('pybe-feedback-trigger'));
    expect(screen.getByTestId('pybe-feedback-open')).toBeInTheDocument();
    expect(screen.getByTestId('pybe-feedback-stars')).toBeInTheDocument();
  });

  it('records feedback_submitted analytics on submit', async () => {
    const tracker = new LocalStorageTracker();
    setTrackerForTesting(tracker);
    renderWidget();
    fireEvent.click(screen.getByTestId('pybe-feedback-trigger'));
    fireEvent.click(screen.getByTestId('pybe-feedback-star-4'));
    fireEvent.click(screen.getByTestId('pybe-feedback-submit'));
    await waitFor(() => {
      expect(tracker.list().length).toBe(1);
    });
    const events = tracker.list();
    expect(events[0]?.name).toBe('feedback_submitted');
    expect((events[0]?.props as { score: number }).score).toBe(4);
  });

  it('shows the thank-you message after submit', async () => {
    renderWidget();
    fireEvent.click(screen.getByTestId('pybe-feedback-trigger'));
    fireEvent.click(screen.getByTestId('pybe-feedback-star-5'));
    fireEvent.click(screen.getByTestId('pybe-feedback-submit'));
    expect(await screen.findByTestId('pybe-feedback-thanks')).toBeInTheDocument();
  });
});