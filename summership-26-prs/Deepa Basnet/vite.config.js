import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  worker: {
    // src/shared/pyodide/pyodideWorker.js imports Pyodide's ES module build
    // straight from a CDN. Vite's default worker output format is IIFE, which
    // cannot represent an external ES `import` — it silently emits a reference
    // to an undefined global instead of loading the real module, and the worker
    // then fails with no useful error. 'es' preserves the import. This requires
    // the Worker to be constructed with { type: 'module' } on the calling side —
    // see src/shared/pyodide/usePyodide.js.
    format: 'es'
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.js']
  }
});
