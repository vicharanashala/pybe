import React, { createContext, useContext } from 'react';
import { usePyodide } from './usePyodide';

const PyodideCtx = createContext(null);

export function PyodideProvider({ children }) {
  const pyodide = usePyodide();
  return <PyodideCtx.Provider value={pyodide}>{children}</PyodideCtx.Provider>;
}

export function useSharedPyodide() {
  const ctx = useContext(PyodideCtx);
  if (!ctx) throw new Error('useSharedPyodide must be used within a PyodideProvider');
  return ctx;
}
