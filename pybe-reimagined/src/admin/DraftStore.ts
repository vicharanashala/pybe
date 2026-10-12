/**
 * Draft store — backs the /admin/draft-cases review page.
 *
 * Drafts are JSON files under content/case_studies/_drafts/. The admin
 * page reads/writes them. Approving a draft moves it to
 * content/case_studies/<id>.json (the canonical location).
 *
 * Phase 7 ships a simple localStorage-backed runtime draft store so the
 * UI is testable without filesystem access. Phase 9 can swap to a server.
 */

import type { CaseStudy } from '../domain/CaseStudy.ts';

const DRAFTS_KEY = 'pybe:drafts:v1';

export interface DraftRecord extends CaseStudy {
  generatedAt: number;
  generatedBy: string; // generator label
}

export interface DraftStore {
  list(): DraftRecord[];
  upsert(draft: DraftRecord): void;
  approve(id: string): DraftRecord | null;
  reject(id: string): void;
  reset(): void;
}

function load(): DraftRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(DRAFTS_KEY);
    return raw ? (JSON.parse(raw) as DraftRecord[]) : [];
  } catch {
    return [];
  }
}

function persist(drafts: DraftRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  } catch {
    /* best-effort */
  }
}

export class LocalDraftStore implements DraftStore {
  list(): DraftRecord[] {
    return load();
  }
  upsert(draft: DraftRecord): void {
    const drafts = load();
    const idx = drafts.findIndex((d) => d.id === draft.id);
    if (idx >= 0) drafts[idx] = draft;
    else drafts.push(draft);
    persist(drafts);
  }
  approve(id: string): DraftRecord | null {
    const drafts = load();
    const idx = drafts.findIndex((d) => d.id === id);
    if (idx < 0) return null;
    const approved = drafts[idx]!;
    drafts.splice(idx, 1);
    persist(drafts);
    return approved;
  }
  reject(id: string): void {
    const drafts = load();
    const next = drafts.filter((d) => d.id !== id);
    persist(next);
  }
  reset(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(DRAFTS_KEY);
    }
  }
}

export const draftStore: DraftStore = new LocalDraftStore();