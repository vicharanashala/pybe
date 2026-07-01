import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    strictPort: true,
    port: 5173,
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: false,
    },
  },
  build: {
    sourcemap: true,
  },
});