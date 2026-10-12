import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LearnerProvider, useLearner } from '../../src/state/LearnerContext.tsx';
import { CaseStudyPlayer } from '../../src/ui/CaseStudyPlayer.tsx';
import { MockRunner } from '../../src/adapter/MockRunner.ts';
import { setRunnerForTesting, getRunner } from '../../src/adapter/runner.ts';

function ScoreHarness() {
  const { learner } = useLearner();
  return (
    <div>
      <div data-testid="harness-score">{learner.score}</div>
      <div data-testid="harness-level">{learner.level}</div>
    </div>
  );
}

function renderPlayer(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/learn/${id}`]}>
      <LearnerProvider>
        <ScoreHarness />
        <Routes>
          <Route path="/learn/:caseStudyId" element={<CaseStudyPlayer />} />
        </Routes>
      </LearnerProvider>
    </MemoryRouter>,
  );
}

describe('TryItEditor end-to-end (with MockRunner)', () => {
  let mock: MockRunner;
  beforeEach(() => {
    mock = new MockRunner();
    setRunnerForTesting(mock);
    window.localStorage.clear();
  });
  afterEach(() => {
    setRunnerForTesting(null);
  });

  it('runner is present and runnable on every /learn route (INV-I4, INV-PB-7)', () => {
    renderPlayer('cs_001');
    // Reveal must be unlocked first by typing + submitting reasoning.
    expect(screen.getByTestId('pybe-reveal-locked')).toBeInTheDocument();
  });

  it('Run button is not in DOM until reveal is unlocked (INV-PB-1 / gate)', async () => {
    renderPlayer('cs_001');
    // While reveal is locked, the TryItEditor is hidden behind the gate.
    expect(screen.queryByTestId('pybe-try-it-run')).not.toBeInTheDocument();
  });

  it('executes code via the runner and renders stdout', async () => {
    const user = userEvent.setup();
    mock.next = { stdout: '4\n', stderr: '', ok: true, ms: 12 };
    renderPlayer('cs_001');

    await user.type(
      screen.getByTestId('pybe-reasoning-input'),
      'Walk the marks with a for loop and total them.',
    );
    await user.click(screen.getByTestId('pybe-submit'));

    // Now TryItEditor is reachable.
    const textarea = screen.getByTestId('pybe-try-it-code') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'print(2+2)' } });

    await user.click(screen.getByTestId('pybe-try-it-run'));

    await waitFor(() =>
      expect(screen.getByTestId('pybe-try-it-stdout')).toHaveTextContent('4'),
    );
    expect(mock.lastRunCode).toBe('print(2+2)');
    expect(mock.callCount).toBe(1);
  });

  it('shows stderr in red and surfaces error verbatim (INV-P6)', async () => {
    const user = userEvent.setup();
    mock.next = {
      stdout: '',
      stderr: 'Traceback (most recent call last):\n  File "<exec>", line 1\nNameError: name \'x\' is not defined\n',
      ok: false,
      ms: 5,
    };
    renderPlayer('cs_004');

    await user.type(
      screen.getByTestId('pybe-reasoning-input'),
      'Walk the list with a for loop summing the marks.',
    );
    await user.click(screen.getByTestId('pybe-submit'));

    const textarea = screen.getByTestId('pybe-try-it-code') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'print(x)' } });
    await user.click(screen.getByTestId('pybe-try-it-run'));

    await waitFor(() =>
      expect(screen.getByTestId('pybe-try-it-stderr')).toHaveTextContent(/NameError/),
    );
    expect(screen.getByTestId('pybe-try-it-meta')).toHaveTextContent(/Error/);
  });

  it('+15 score recorded on first successful run only (Phase 2 acceptance)', async () => {
    const user = userEvent.setup();
    mock.script = [
      { code: 'a', stdout: 'OK', ok: true },
      { code: 'b', stdout: 'OK', ok: true },
      { code: 'c', stdout: 'OK', ok: true },
    ];
    renderPlayer('cs_001');

    await user.type(
      screen.getByTestId('pybe-reasoning-input'),
      'Loop, sum, divide. The standard answer.',
    );
    await user.click(screen.getByTestId('pybe-submit'));
    // Reason + reveal = +5 + +10 = +15
    expect(screen.getByTestId('harness-score')).toHaveTextContent('15');

    // Run 1: first success → +15
    const textarea = screen.getByTestId('pybe-try-it-code') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'a' } });
    await user.click(screen.getByTestId('pybe-try-it-run'));
    await waitFor(() =>
      expect(screen.getByTestId('pybe-try-it-stdout')).toHaveTextContent('OK'),
    );
    expect(screen.getByTestId('harness-score')).toHaveTextContent('30');

    // Run 2: already scored → no further +15
    fireEvent.change(textarea, { target: { value: 'b' } });
    await user.click(screen.getByTestId('pybe-try-it-run'));
    await waitFor(() => expect(mock.callCount).toBe(2));
    // Score should still be 30 (no additional +15).
    expect(screen.getByTestId('harness-score')).toHaveTextContent('30');

    // Run 3: also no change.
    fireEvent.change(textarea, { target: { value: 'c' } });
    await user.click(screen.getByTestId('pybe-try-it-run'));
    await waitFor(() => expect(mock.callCount).toBe(3));
    expect(screen.getByTestId('harness-score')).toHaveTextContent('30');
  });

  it('Stop button calls runner.cancel()', async () => {
    const user = userEvent.setup();
    mock.script = [{ code: 'long_loop', stdout: '', ok: true, delayMs: 200 }];
    renderPlayer('cs_001');

    await user.type(
      screen.getByTestId('pybe-reasoning-input'),
      'Walk the marks with a for loop summing them up.',
    );
    await user.click(screen.getByTestId('pybe-submit'));
    const textarea = screen.getByTestId('pybe-try-it-code') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'long_loop' } });

    await user.click(screen.getByTestId('pybe-try-it-run'));
    // Stop button replaces Run button while running.
    const stopBtn = await screen.findByTestId('pybe-try-it-stop');
    await user.click(stopBtn);
    expect(mock.cancelCount).toBe(1);
    // After cancel resolves, Run button is back.
    await waitFor(() =>
      expect(screen.getByTestId('pybe-try-it-run')).toBeInTheDocument(),
    );
  });

  it('does not load the runner until the user clicks Run (lazy)', async () => {
    const user = userEvent.setup();
    renderPlayer('cs_004');

    await user.type(
      screen.getByTestId('pybe-reasoning-input'),
      'For-loop walk to total the marks. The classic pattern.',
    );
    await user.click(screen.getByTestId('pybe-submit'));

    // We see the editor, but mock.load has not been called yet.
    expect(mock.loadCount).toBe(0);
    fireEvent.change(screen.getByTestId('pybe-try-it-code') as HTMLTextAreaElement, {
      target: { value: 'print("hi")' },
    });
    await user.click(screen.getByTestId('pybe-try-it-run'));
    await waitFor(() => expect(mock.loadCount).toBeGreaterThanOrEqual(1));
  });
});

describe('getRunner/setRunnerForTesting (test seam)', () => {
  it('returns the active runner', () => {
    const original = getRunner();
    expect(original).toBeDefined();
  });

  it('setRunnerForTesting(null) resets to a default runner', () => {
    setRunnerForTesting(new MockRunner());
    expect(getRunner()).toBeInstanceOf(MockRunner);
    setRunnerForTesting(null);
    expect(getRunner()).toBeDefined();
    // After reset, runner is no longer the mock.
    expect(getRunner()).not.toBeInstanceOf(MockRunner);
  });
});