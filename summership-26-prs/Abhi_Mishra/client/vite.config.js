import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// Content (JSON + Python snippets) lives in ../shared so the API and the UI can never drift apart.
const shared = fileURLToPath(new URL('../shared', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@shared': shared } },
  server: { port: 5173, fs: { allow: ['..'] }, proxy: { '/api': 'http://localhost:4000' } }
});
