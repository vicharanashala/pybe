import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LearnerProvider } from '../../src/state/LearnerContext.tsx';
import { CaseStudyPlayer } from '../../src/ui/CaseStudyPlayer.tsx';

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

describe('CaseStudyPlayer', () => {
  it('renders the three-region layout in order (INV-I2)', () => {
    renderPlayer('cs_001');
    // Scenario must come first
    const scenario = screen.getByTestId('pybe-scenario');
    const reasoning = screen.getByTestId('pybe-reasoning');
    const reveal = screen.getByTestId('pybe-reveal-locked');

    expect(scenario).toBeInTheDocument();
    expect(reasoning).toBeInTheDocument();
    expect(reveal).toBeInTheDocument();

    // Document order: scenario before reasoning before reveal-locked.
    const all = [scenario, reasoning, reveal];
    for (let i = 1; i < all.length; i++) {
      const prev = all[i - 1];
      const curr = all[i];
      expect(
        prev && curr && prev.compareDocumentPosition(curr) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    }
  });

  it('keeps reveal locked until submit (INV-PB-1, INV-PB-2)', () => {
    renderPlayer('cs_001');
    expect(screen.getByTestId('pybe-reveal-locked')).toBeInTheDocument();
    expect(screen.queryByTestId('pybe-reveal-unlocked')).not.toBeInTheDocument();
  });

  it('disables submit until ≥ 30 chars typed (INV-PB-1)', async () => {
    const user = userEvent.setup();
    renderPlayer('cs_001');
    const submit = screen.getByTestId('pybe-submit') as HTMLButtonElement;
    expect(submit.disabled).toBe(true);

    await user.type(
      screen.getByTestId('pybe-reasoning-input'),
      'I would collect all the numbers into a list and average them with sum and len.',
    );
    expect(submit.disabled).toBe(false);
  });

  it('unlocks reveal after submit (INV-PB-1, INV-PB-2)', async () => {
    const user = userEvent.setup();
    renderPlayer('cs_004');
    await user.type(
      screen.getByTestId('pybe-reasoning-input'),
      'I would walk through the marks with a for loop, summing them up, then divide by count.',
    );
    await user.click(screen.getByTestId('pybe-submit'));

    expect(screen.queryByTestId('pybe-reveal-locked')).not.toBeInTheDocument();
    expect(screen.getByTestId('pybe-reveal-unlocked')).toBeInTheDocument();
    expect(screen.getByTestId('pybe-visual-loop')).toBeInTheDocument();
  });

  it('renders the dictionary visual for cs_002 (focus area: dicts)', async () => {
    const user = userEvent.setup();
    renderPlayer('cs_002');
    await user.type(
      screen.getByTestId('pybe-reasoning-input'),
      'I would store the fields with their names in a dictionary and look them up by key.',
    );
    await user.click(screen.getByTestId('pybe-submit'));
    expect(screen.getByTestId('pybe-visual-dictionary')).toBeInTheDocument();
  });

  it('renders the slicing visual for cs_001 (focus area: slicing)', async () => {
    const user = userEvent.setup();
    renderPlayer('cs_001');
    await user.type(
      screen.getByTestId('pybe-reasoning-input'),
      'I would group the marks into a list and total them up using sum, then divide by count.',
    );
    await user.click(screen.getByTestId('pybe-submit'));
    expect(screen.getByTestId('pybe-visual-string-slicing')).toBeInTheDocument();
  });

  it('shows 404 when case study id does not exist', () => {
    renderPlayer('cs_does_not_exist');
    expect(screen.getByText(/No case study with id/i)).toBeInTheDocument();
  });
});