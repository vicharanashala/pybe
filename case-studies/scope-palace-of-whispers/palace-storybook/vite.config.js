import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset paths, so the built site works from any sub-folder
  // (for example GitHub Pages).
  base: './',
  server: { port: 5176 }
});
