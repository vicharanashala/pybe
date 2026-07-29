import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, RefreshCw } from 'lucide-react';
import { draftStore } from './DraftStore.ts';
import type { DraftRecord } from './DraftStore.ts';
import { DraftCard } from './DraftCard.tsx';

/**
 * /admin/draft-cases — human-in-the-loop review of LLM-generated drafts.
 *
 * Phase 7 ships an empty draft list (mock drafts are auto-approved by the
 * generator script). When real LLM drafts arrive in Phase 9, this page
 * becomes the primary review surface.
 */
export function DraftCasesPage() {
  const [drafts, setDrafts] = useState<DraftRecord[]>([]);

  const refresh = useCallback(() => setDrafts(draftStore.list()), []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleApprove = (id: string): void => {
    const approved = draftStore.approve(id);
    if (approved) {
      // eslint-disable-next-line no-console
      console.info(`[pybe] approved draft ${approved.id} — moving to content/case_studies/${approved.id}.json`);
    }
    refresh();
  };

  const handleReject = (id: string): void => {
    draftStore.reject(id);
    refresh();
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <Link
            to="/cases"
            className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800"
          >
            <ArrowLeft className="h-3 w-3" /> Back to case studies
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-stone-900">Draft cases</h1>
          <p className="mt-1 text-sm text-stone-600">
            Human review of LLM-generated drafts. Approve to publish; reject to discard.
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="pybe-btn-ghost"
          data-testid="pybe-drafts-refresh"
        >
          <RefreshCw className="h-3 w-3" /> Refresh
        </button>
      </header>

      {drafts.length === 0 ? (
        <div
          data-testid="pybe-drafts-empty"
          className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-10 text-center"
        >
          <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
          <p className="mt-3 text-sm font-medium text-stone-700">
            Inbox empty — no pending drafts.
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Run <code>npm run generate-cases</code> to create new drafts.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4" data-testid="pybe-drafts-list">
          {drafts.map((d) => (
            <li key={d.id}>
              <DraftCard draft={d} onApprove={handleApprove} onReject={handleReject} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}