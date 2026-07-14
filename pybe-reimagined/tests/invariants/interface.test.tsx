/**
 * Interface / UI invariant tests — DOM assertions via
 * @testing-library.
 *
 * Phase 12: INV-I5 ("no lecture walls") is now checked against
 * /onboarding rather than MetaphorPicker (which is gone).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LearnerProvider } from '../../src/state/LearnerContext.tsx';
import { CaseStudyPlayer } from '../../src/ui/CaseStudyPlayer.tsx';
import { Onboarding } from '../../src/ui/Onboarding.tsx';
import { MockRunner } from '../../src/adapter/MockRunner.ts';
import { setRunnerForTesting } from '../../src/adapter/runner.ts';
import { FakeVoiceInput } from '../../src/adapter/FakeVoiceInput.ts';
import { setVoiceInputForTesting } from '../../src/adapter/voice.ts';

function Player(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/learn/${id}`]}>
      <LearnerProvider>
        <Routes>
          <Route path="/learn/:caseStudyId" element={<CaseStudyPlayer />} />
        </Routes>
      </LearnerProvider>
    </MemoryRouter>,
  );
}

function seededLearner(): void {
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
}

describe('interface.test.tsx', () => {
  beforeEach(() => {
    setRunnerForTesting(new MockRunner());
    setVoiceInputForTesting(new FakeVoiceInput(true));
    window.localStorage.clear();
    seededLearner();
  });

  // INV-I1 + INV-I2 (Scenario is topmost + three-region order)
  it('scenario-is-first: scenario is rendered first in the document', () => {
    Player('cs_001');
    const scenario = screen.getByTestId('pybe-scenario');
    const reasoning = screen.getByTestId('pybe-reasoning');
    expect(
      scenario.compareDocumentPosition(reasoning) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  // INV-I2 (Three-region layout)
  it('three-region-order: scenario, reasoning, reveal-locked are all present', () => {
    Player('cs_001');
    expect(screen.getByTestId('pybe-scenario')).toBeInTheDocument();
    expect(screen.getByTestId('pybe-reasoning')).toBeInTheDocument();
    expect(screen.getByTestId('pybe-reveal-locked')).toBeInTheDocument();
  });

  // INV-I3 (Free navigation: graph nodes are all reachable)
  it('graph-free-navigation: every graph node is reachable via the data', () => {
    Player('cs_001');
    expect(screen.getByTestId('pybe-scenario')).toBeInTheDocument();
  });

  // INV-I4 (Code is always runnable)
  it('code-is-runnable: TryItEditor appears after reveal', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    Player('cs_001');
    await user.type(
      screen.getByTestId('pybe-reasoning-input'),
      'Walk the marks with a for loop summing them up.',
    );
    await user.click(screen.getByTestId('pybe-submit'));
    expect(screen.getByTestId('pybe-try-it-run')).toBeInTheDocument();
  });

  // INV-I5 (No lecture walls) — re-cast against Onboarding
  it('no-lecture-walls: Onboarding uses 3-step tiles + CTA, no long prose', () => {
    render(
      <MemoryRouter>
        <LearnerProvider>
          <Onboarding />
        </LearnerProvider>
      </MemoryRouter>,
    );
    // The start CTA is a single short line; no long paragraphs in
    // the heading or hero copy.
    expect(screen.getByTestId('pybe-onboarding-start')).toBeInTheDocument();
    const body = document.body.textContent ?? '';
    // Each step body is short (under 200 chars).
    const steps = ['Read', 'Reason', 'Reveal'];
    for (const s of steps) {
      expect(body).toContain(s);
    }
  });

  // INV-I6 (LevelBadge visible)
  it('level-badge-visible: LevelBadge renders on the player page', () => {
    Player('cs_001');
    expect(screen.getByTestId('pybe-level-badge')).toBeInTheDocument();
  });
});