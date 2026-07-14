import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LearnerProvider } from '../../src/state/LearnerContext.tsx';
import { CaseStudyPlayer } from '../../src/ui/CaseStudyPlayer.tsx';
import { MockRunner } from '../../src/adapter/MockRunner.ts';
import { setRunnerForTesting } from '../../src/adapter/runner.ts';
import { FakeVoiceInput } from '../../src/adapter/FakeVoiceInput.ts';
import { setVoiceInputForTesting } from '../../src/adapter/voice.ts';

function renderPlayer(id: string) {
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

describe('Phase 5 integration — chips and voice on CaseStudyPlayer', () => {
  beforeEach(() => {
    setRunnerForTesting(new MockRunner());
    setVoiceInputForTesting(new FakeVoiceInput(true));
    window.localStorage.clear();
  });
  afterEach(() => {
    setRunnerForTesting(null);
    setVoiceInputForTesting(null);
  });

  it('does not show chips before the user submits or idles (INV-PB-9)', () => {
    renderPlayer('cs_001');
    expect(screen.queryByTestId('pybe-auto-suggest')).not.toBeInTheDocument();
  });

  it('shows chips on the first submit attempt (cs_001 hints list, for, sum, len)', async () => {
    const user = userEvent.setup();
    renderPlayer('cs_001');
    await user.type(
      screen.getByTestId('pybe-reasoning-input'),
      'A really thorough reasoning that clears the 30-char gate easily.',
    );
    await user.click(screen.getByTestId('pybe-submit'));
    expect(await screen.findByTestId('pybe-auto-suggest')).toBeInTheDocument();
    expect(screen.getByTestId('pybe-auto-suggest-chip-list')).toBeInTheDocument();
    expect(screen.getByTestId('pybe-auto-suggest-chip-for')).toBeInTheDocument();
    expect(screen.getByTestId('pybe-auto-suggest-chip-sum')).toBeInTheDocument();
    expect(screen.getByTestId('pybe-auto-suggest-chip-len')).toBeInTheDocument();
  });

  it('chip click is a no-op after reveal is unlocked (panel locked)', async () => {
    const user = userEvent.setup();
    renderPlayer('cs_002');
    await user.type(
      screen.getByTestId('pybe-reasoning-input'),
      'A really thorough reasoning that clears the 30-char gate easily.',
    );
    await user.click(screen.getByTestId('pybe-submit'));
    const dictChip = await screen.findByTestId('pybe-auto-suggest-chip-dict');
    expect(dictChip).toBeInTheDocument();
  });

  it('renders the voice button when voice is supported', () => {
    renderPlayer('cs_001');
    expect(screen.getByTestId('pybe-voice-toggle')).toBeInTheDocument();
  });

  it('hides the voice button when voice is unsupported (Safari)', () => {
    setVoiceInputForTesting(new FakeVoiceInput(false));
    renderPlayer('cs_001');
    expect(screen.queryByTestId('pybe-voice-toggle')).not.toBeInTheDocument();
    expect(screen.getByTestId('pybe-voice-unavailable')).toBeInTheDocument();
  });

  it('clicking the voice button toggles listening state (FakeVoiceInput)', async () => {
    const user = userEvent.setup();
    renderPlayer('cs_001');
    const toggle = screen.getByTestId('pybe-voice-toggle');
    await user.click(toggle);
    expect(screen.getByText(/Stop listening/)).toBeInTheDocument();
    await user.click(screen.getByText(/Stop listening/));
    expect(screen.getByText(/^Speak$/)).toBeInTheDocument();
  });

  it('a voice transcript is appended to the reasoning textarea', async () => {
    const fake = new FakeVoiceInput(true);
    fake.autoFire = { text: 'I would use a dictionary.', isFinal: true };
    setVoiceInputForTesting(fake);
    const user = userEvent.setup();
    renderPlayer('cs_002');
    const toggle = screen.getByTestId('pybe-voice-toggle');
    await user.click(toggle);
    await new Promise((r) => setTimeout(r, 5));
    const ta = screen.getByTestId('pybe-reasoning-input') as HTMLTextAreaElement;
    expect(ta.value).toContain('dictionary');
  });

  // Regression: the Web Speech API fires BOTH an interim result and a
  // final result for the same audio. The earlier code appended both,
  // producing every word twice. The fix tracks the trailing interim
  // and replaces/strips it instead of double-appending.
  it('voice: same interim + final result does NOT duplicate the word', async () => {
    const fake = new FakeVoiceInput(true);
    setVoiceInputForTesting(fake);
    const user = userEvent.setup();
    renderPlayer('cs_001');
    await user.click(screen.getByTestId('pybe-voice-toggle'));
    act(() => {
      fake.fireUtterance('hello');
    });
    const ta = screen.getByTestId('pybe-reasoning-input') as HTMLTextAreaElement;
    expect(ta.value).toBe('hello');
    expect(ta.value).not.toBe('hello hello');
  });

  it('voice: successive utterances append, never duplicate', async () => {
    const fake = new FakeVoiceInput(true);
    setVoiceInputForTesting(fake);
    const user = userEvent.setup();
    renderPlayer('cs_001');
    await user.click(screen.getByTestId('pybe-voice-toggle'));
    act(() => {
      fake.fireUtterance('hello');
      fake.fireUtterance('world');
    });
    const ta = screen.getByTestId('pybe-reasoning-input') as HTMLTextAreaElement;
    expect(ta.value).toBe('hello world');
  });
});