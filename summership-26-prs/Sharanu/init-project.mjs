// init-project.mjs
// Run from inside the Sharanu folder:
//   node init-project.mjs
// Then: npm install
// Then: npm run dev
//
// Safe to re-run — never overwrites a file that already exists.

import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const FILES = {
  "package.json": `{
  "name": "codegita",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "lucide-react": "^0.383.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.40",
    "tailwindcss": "^3.4.7",
    "typescript": "^5.5.4",
    "vite": "^5.4.0"
  }
}
`,

  "vite.config.ts": `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
`,

  "tsconfig.json": `{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
`,

  "tsconfig.app.json": `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
`,

  "tsconfig.node.json": `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
`,

  "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CodeGita — PYBE</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,

  "tailwind.config.ts": `import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B1220",
        panel: "#131B2E",
        gold: "#E8B34D",
        vermilion: "#C65D3B",
        ink: "#F3EEE3",
        mutedSoft: "#B9C0D4",
        muted: "#8C96AC",
        line: "#2A3550",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
`,

  "postcss.config.js": `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`,

  "public/favicon.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="none" stroke="#E8B34D" stroke-width="4"/><circle cx="50" cy="50" r="8" fill="#E8B34D"/></svg>
`,

  "src/index.css": `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  background: #0B1220;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
`,

  "src/App.css": `/* component-level overrides go here if ever needed — prefer Tailwind classes first */
`,

  "src/main.tsx": `import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
`,

  "src/App.tsx": `import { Routes, Route } from "react-router-dom";
import WelcomeScreen from "./learning/welcome/WelcomeScreen";
import ConceptScreen from "./learning/intro/ConceptScreen";
import ErrorVsException from "./learning/foundations/ErrorVsException";
import LessonPage from "./learning/lessons/LessonPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/intro" element={<ConceptScreen />} />
      <Route path="/foundations" element={<ErrorVsException />} />
      <Route path="/lessons/:slug" element={<LessonPage />} />
    </Routes>
  );
}
`,
};

let created = 0;
let skipped = 0;

for (const [relPath, content] of Object.entries(FILES)) {
  const full = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  if (fs.existsSync(full)) {
    skipped++;
    continue;
  }
  fs.writeFileSync(full, content, "utf8");
  created++;
}

console.log(`Project scaffold complete.`);
console.log(`Files created: ${created}`);
console.log(`Files skipped (already existed): ${skipped}`);
console.log(`\nNext steps:`);
console.log(`  npm install`);
console.log(`  npm run dev`);
