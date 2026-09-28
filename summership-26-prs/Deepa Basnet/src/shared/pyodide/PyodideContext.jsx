import React, { createContext, useContext } from 'react';
import { usePyodide } from './usePyodide';

// The Python runtime is a multi-megabyte download. Both chapters share one
// instance through this provider so it is fetched and started exactly once per
// visit, instead of again each time a learner opens a new chapter.
const PyodideCtx = createContext(null);

export function PyodideProvider({ children }) {
  const pyodide = usePyodide();
  return <PyodideCtx.Provider value={pyodide}>{children}</PyodideCtx.Provider>;
}

export function useSharedPyodide() {
  const ctx = useContext(PyodideCtx);
  if (!ctx) throw new Error('useSharedPyodide must be used inside a PyodideProvider');
  return ctx;
}
