/**
 * LearnerContext — learner state with score, level, history, onboarding.
 *
 * INV-D3 (progress is lossless): every change is persisted to localStorage
 * under `pybe:state:v1`.
 *
 * INV-PB-3 (no score cap): the score is a plain integer. UI may display
 * `9999+`, but the underlying value is unbounded.
 *
 * Phase 12: the `metaphor` field is gone. Onboarding is a one-tap
 * "I've read the intro, let's start" action — no world selection.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import {
  emptyLearner,
  levelFromScore,
  type CaseHistory,
  type Learner,
  type LearnerAttempt,
  type Level,
} from '../domain/Learner.ts';
import { applyEvent, type ScoringEvent } from '../engine/ScoringEngine.ts';
import { trackEvent } from '../analytics/tracker.ts';

const STORAGE_KEY = 'pybe:state:v1';

interface PersistedShape {
  revealedHints: Record<string, string[]>;
  lastAttempt: Record<string, string>;
  score: number;
  level: Level;
  history: Record<string, CaseHistory>;
  hasOnboarded: boolean;
}

const DEFAULT_PERSISTED: PersistedShape = {
  revealedHints: {},
  lastAttempt: {},
  score: 0,
  level: 1,
  history: {},
  hasOnboarded: false,
};

function loadPersisted(): PersistedShape {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_PERSISTED };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PERSISTED };
    const parsed = JSON.parse(raw) as Partial<PersistedShape> & { metaphor?: unknown };
    return {
      revealedHints: parsed.revealedHints ?? {},
      lastAttempt: parsed.lastAttempt ?? {},
      score: typeof parsed.score === 'number' ? parsed.score : 0,
      level: (typeof parsed.level === 'number' ? parsed.level : 1) as Level,
      history: parsed.history ?? {},
      // Read hasOnboarded; the deprecated `metaphor` field is intentionally ignored.
      hasOnboarded: Boolean(parsed.hasOnboarded),
    };
  } catch {
    return { ...DEFAULT_PERSISTED };
  }
}

function persist(state: PersistedShape): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* best-effort */
  }
}

type Action =
  | { type: 'recordAttempt'; caseStudyId: string; reasoning: string }
  | { type: 'markRevealed'; caseStudyId: string }
  | { type: 'applyScoring'; event: ScoringEvent }
  | { type: 'completeOnboarding' }
  | { type: 'dismissCelebration' }
  | { type: 'reset' };

interface State {
  learner: Learner;
  persisted: PersistedShape;
  celebrateLevel: Level | null;
}

function init(): State {
  const p = loadPersisted();
  const learner = emptyLearner('local-learner');
  return {
    learner: {
      ...learner,
      score: p.score,
      level: p.level,
      history: p.history,
      hasOnboarded: p.hasOnboarded,
    },
    persisted: p,
    celebrateLevel: null,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'recordAttempt': {
      const attempt: LearnerAttempt = {
        caseStudyId: action.caseStudyId,
        reasoning: action.reasoning,
        timestamp: Date.now(),
        revealed: false,
      };
      const next: State = {
        ...state,
        learner: {
          ...state.learner,
          attempts: [...state.learner.attempts, attempt],
        },
        persisted: {
          ...state.persisted,
          lastAttempt: {
            ...state.persisted.lastAttempt,
            [action.caseStudyId]: action.reasoning,
          },
        },
      };
      persist(next.persisted);
      return next;
    }
    case 'markRevealed': {
      const hintList = state.persisted.revealedHints[action.caseStudyId] ?? [];
      const next: State = {
        ...state,
        learner: {
          ...state.learner,
          revealedHints: {
            ...state.learner.revealedHints,
            [action.caseStudyId]: hintList.includes(action.caseStudyId)
              ? hintList
              : [...hintList, action.caseStudyId],
          },
        },
        persisted: {
          ...state.persisted,
          revealedHints: {
            ...state.persisted.revealedHints,
            [action.caseStudyId]: hintList.includes(action.caseStudyId)
              ? hintList
              : [...hintList, action.caseStudyId],
          },
        },
      };
      persist(next.persisted);
      return next;
    }
    case 'applyScoring': {
      const { learner: nextLearner, levelCrossedTo } = applyEvent(
        state.learner,
        action.event,
      );
      const next: State = {
        ...state,
        learner: nextLearner,
        persisted: {
          ...state.persisted,
          score: nextLearner.score,
          level: nextLearner.level,
          history: nextLearner.history,
        },
        celebrateLevel: levelCrossedTo,
      };
      persist(next.persisted);
      if (levelCrossedTo) {
        trackEvent('level_unlocked', {
          from: state.learner.level,
          to: levelCrossedTo,
          totalScore: nextLearner.score,
        });
      }
      return next;
    }
    case 'completeOnboarding': {
      const next: State = {
        ...state,
        learner: { ...state.learner, hasOnboarded: true },
        persisted: { ...state.persisted, hasOnboarded: true },
      };
      persist(next.persisted);
      return next;
    }
    case 'dismissCelebration': {
      return { ...state, celebrateLevel: null };
    }
    case 'reset': {
      persist({ ...DEFAULT_PERSISTED });
      return {
        learner: emptyLearner('local-learner'),
        persisted: { ...DEFAULT_PERSISTED },
        celebrateLevel: null,
      };
    }
  }
}

interface LearnerContextValue {
  learner: Learner;
  revealedHints: Record<string, string[]>;
  lastAttempt: (caseStudyId: string) => string;
  recordAttempt: (caseStudyId: string, reasoning: string) => void;
  markRevealed: (caseStudyId: string) => void;
  dispatchScoring: (event: ScoringEvent) => void;
  completeOnboarding: () => void;
  celebrateLevel: Level | null;
  dismissCelebration: () => void;
  reset: () => void;
}

const LearnerContext = createContext<LearnerContextValue | null>(null);

export function LearnerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, init);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (e: StorageEvent): void => {
      if (e.key === STORAGE_KEY) {
        // eslint-disable-next-line no-console
        console.debug('[pybe] state sync from another tab observed');
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const recordAttempt = useCallback(
    (caseStudyId: string, reasoning: string): void =>
      dispatch({ type: 'recordAttempt', caseStudyId, reasoning }),
    [],
  );
  const markRevealed = useCallback(
    (caseStudyId: string): void => dispatch({ type: 'markRevealed', caseStudyId }),
    [],
  );
  const dispatchScoring = useCallback(
    (event: ScoringEvent): void => dispatch({ type: 'applyScoring', event }),
    [],
  );
  const completeOnboarding = useCallback(
    (): void => dispatch({ type: 'completeOnboarding' }),
    [],
  );
  const dismissCelebration = useCallback(
    (): void => dispatch({ type: 'dismissCelebration' }),
    [],
  );
  const reset = useCallback((): void => dispatch({ type: 'reset' }), []);

  const value: LearnerContextValue = useMemo(
    () => ({
      learner: state.learner,
      revealedHints: state.persisted.revealedHints,
      lastAttempt: (id: string) => state.persisted.lastAttempt[id] ?? '',
      recordAttempt,
      markRevealed,
      dispatchScoring,
      completeOnboarding,
      celebrateLevel: state.celebrateLevel,
      dismissCelebration,
      reset,
    }),
    [state, recordAttempt, markRevealed, dispatchScoring, completeOnboarding, dismissCelebration, reset],
  );

  return <LearnerContext.Provider value={value}>{children}</LearnerContext.Provider>;
}

export function useLearner(): LearnerContextValue {
  const ctx = useContext(LearnerContext);
  if (!ctx) {
    throw new Error('useLearner must be used inside LearnerProvider');
  }
  return ctx;
}

export { levelFromScore };