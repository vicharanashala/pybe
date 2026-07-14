import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * Theme system — Phase-11 UI/UX pass.
 *
 * - Stored in localStorage under `pybe:theme:v1`.
 * - Three modes: 'light' | 'dark' | 'system' (default).
 * - When 'system', follows `prefers-color-scheme`.
 * - The theme is applied via a `.dark` class on <html>.
 */

export type ThemeMode = 'light' | 'dark' | 'system';
const STORAGE_KEY = 'pybe:theme:v1';

interface ThemeContextValue {
  mode: ThemeMode;
  resolved: 'light' | 'dark';
  setMode: (m: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStored(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
  } catch {
    /* ignore */
  }
  return 'system';
}

function systemPref(): 'light' | 'dark' {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(resolved: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (resolved === 'dark') {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => readStored());
  const [resolved, setResolved] = useState<'light' | 'dark'>(() => {
    const initial = readStored();
    return initial === 'system' ? systemPref() : initial;
  });

  useEffect(() => {
    const next = mode === 'system' ? systemPref() : mode;
    setResolved(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  // Listen for system changes when in 'system' mode.
  useEffect(() => {
    if (mode !== 'system' || typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (): void => {
      const next: 'light' | 'dark' = mq.matches ? 'dark' : 'light';
      setResolved(next);
      applyTheme(next);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  const setMode = (m: ThemeMode): void => {
    setModeState(m);
  };

  const toggle = (): void => {
    setModeState((current) => {
      const next: ThemeMode =
        current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ mode, resolved, setMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  // Resilient to missing provider: tests that render a single component
  // (e.g. ThemeToggle) without a ThemeProvider get a safe default.
  if (!ctx) {
    return {
      mode: 'system',
      resolved: 'light',
      setMode: () => undefined,
      toggle: () => undefined,
    };
  }
  return ctx;
}