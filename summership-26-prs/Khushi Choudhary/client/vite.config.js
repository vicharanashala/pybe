import { defineConfig } from 'vite';
import { resolve } from 'path';

// Three entry points: the learner app (index.html), the mentor-only
// Scenario Generator tools (mentor.html), and the learner-facing "build
// your own case study" flow (learner-generate.html). Vite's dev server
// serves all three with no config, but a production build needs them
// listed explicitly.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        mentor: resolve(__dirname, 'mentor.html'),
        learnerGenerate: resolve(__dirname, 'learner-generate.html')
      }
    }
  }
});
