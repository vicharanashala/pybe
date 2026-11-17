import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const STORAGE_KEY = "codegita:progress";

interface ProgressState {
  completedSlugs: string[];
  unlockedBadges: string[];
}

interface ProgressContextValue {
  completedSlugs: string[];
  unlockedBadges: string[];
  isComplete: (slug: string) => boolean;
  markComplete: (slug: string, badge?: string) => void;
  resetProgress: () => void;
  completedCount: number;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

function loadInitialState(): ProgressState {
  if (typeof window === "undefined") return { completedSlugs: [], unlockedBadges: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completedSlugs: [], unlockedBadges: [] };
    const parsed = JSON.parse(raw);
    return {
      completedSlugs: Array.isArray(parsed.completedSlugs) ? parsed.completedSlugs : [],
      unlockedBadges: Array.isArray(parsed.unlockedBadges) ? parsed.unlockedBadges : [],
    };
  } catch {
    return { completedSlugs: [], unlockedBadges: [] };
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(loadInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage unavailable (private browsing, etc.) — progress just won't persist
    }
  }, [state]);

  function isComplete(slug: string) {
    return state.completedSlugs.includes(slug);
  }

  function markComplete(slug: string, badge?: string) {
    setState((prev) => {
      const completedSlugs = prev.completedSlugs.includes(slug)
        ? prev.completedSlugs
        : [...prev.completedSlugs, slug];
      const unlockedBadges =
        badge && !prev.unlockedBadges.includes(badge)
          ? [...prev.unlockedBadges, badge]
          : prev.unlockedBadges;
      return { completedSlugs, unlockedBadges };
    });
  }

  function resetProgress() {
    setState({ completedSlugs: [], unlockedBadges: [] });
  }

  return (
    <ProgressContext.Provider
      value={{
        completedSlugs: state.completedSlugs,
        unlockedBadges: state.unlockedBadges,
        isComplete,
        markComplete,
        resetProgress,
        completedCount: state.completedSlugs.length,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgressContext(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgressContext must be used within a ProgressProvider");
  }
  return ctx;
}