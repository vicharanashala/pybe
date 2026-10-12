import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DraftCasesPage } from '../../src/admin/DraftCasesPage.tsx';
import { draftStore } from '../../src/admin/DraftStore.ts';
import type { DraftRecord } from '../../src/admin/DraftStore.ts';

function makeDraft(id: string, title = 'Test draft'): DraftRecord {
  return {
    id,
    title,
    scenario: 'A scenario.',
    hookWords: ['x'],
    piagetStage: 'concrete',
    topicTags: ['t'],
    constructHint: ['list'],
    jonassenType: 'structured',
    level: 1,
    generatedAt: Date.now(),
    generatedBy: 'MockCaseStudyGenerator (deterministic)',
  };
}

function renderDrafts() {
  return render(
    <MemoryRouter>
      <DraftCasesPage />
    </MemoryRouter>,
  );
}

describe('DraftCasesPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    draftStore.reset();
  });

  it('shows the empty state when there are no drafts', () => {
    renderDrafts();
    expect(screen.getByTestId('pybe-drafts-empty')).toBeInTheDocument();
  });

  it('renders one card per draft (INV-PB-5: reviewer sees full intent)', () => {
    draftStore.upsert(makeDraft('cs_900'));
    draftStore.upsert(makeDraft('cs_901'));
    renderDrafts();
    expect(screen.getByTestId('pybe-draft-card-cs_900')).toBeInTheDocument();
    expect(screen.getByTestId('pybe-draft-card-cs_901')).toBeInTheDocument();
  });

  it('approve removes the draft from the inbox', () => {
    draftStore.upsert(makeDraft('cs_900'));
    renderDrafts();
    fireEvent.click(screen.getByTestId('pybe-draft-approve-cs_900'));
    expect(screen.getByTestId('pybe-drafts-empty')).toBeInTheDocument();
    expect(draftStore.list().length).toBe(0);
  });

  it('reject removes the draft', () => {
    draftStore.upsert(makeDraft('cs_900'));
    renderDrafts();
    fireEvent.click(screen.getByTestId('pybe-draft-reject-cs_900'));
    expect(screen.getByTestId('pybe-drafts-empty')).toBeInTheDocument();
  });
});