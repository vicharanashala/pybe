import { defineConfig } from 'vite';

export default defineConfig({
  worker: {
    // The Pyodide worker (src/shared/pyodide/pyodideWorker.js and
    // src/recursion/workers/pyodideWorker.js) imports Pyodide's ES module
    // build directly from a CDN. Vite's default worker output format is
    // IIFE, which cannot represent an external ES `import` — it silently
    // falls back to referencing an undefined global instead of the real
    // module. 'es' format preserves the import correctly. This requires the
    // Worker to be constructed with { type: 'module' } on the calling side —
    // see src/shared/pyodide/usePyodide.js and src/recursion/hooks/usePyodide.js.
    format: 'es'
  }
});
