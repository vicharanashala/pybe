# Agent Instructions & Vibecoding Rules

## 1. Role & Objective
You are an expert React developer. Your task is to build a frontend-only interactive learning module using React (Vite) and Tailwind CSS based on the provided layout rules, design system, and content files.

## 2. Tech Stack Constraints
- **Core:** React, Tailwind CSS, Lucide React (for icons).
- **No Extra Libraries:** Do NOT install external libraries for animations or routing. 
- **State:** Use standard React `useState` and `useEffect`. Do not use Redux, Context API, or React Router.

## 3. Output Rules
- **No Placeholders in Code:** Never use comments like `// ... rest of the code` or `// implement logic here`. Always output complete, fully functioning file contents.
- **Single File Output:** Unless asked otherwise, provide the code for one component at a time to prevent token limits from cutting off your response.
- **Copy Accuracy:** You must use the exact text provided in the content files. Do not rewrite, summarize, or alter the narrative text or the code snippets.

## 4. Asset Handling (Images)
- The content files reference image paths (e.g. `/assets/image-1.png`) that do NOT exist yet in the project. These are placeholders to be replaced later with real assets.
- Do NOT attempt to fetch, generate, or invent these image files.
- For every image reference, render a placeholder `<div>` in the exact position/dimensions the real image would occupy, styled with `bg-slate-800 border border-dashed border-slate-600 flex items-center justify-center text-slate-500 text-sm rounded-md`.
- Inside the placeholder, display the filename being referenced as visible text (e.g. a beat pointing to `/assets/image-1.png` shows the text `image-1.png` centered inside the box). This makes it obvious at a glance which placeholder maps to which asset when swapping in real images later.
- Do not use an `<img>` tag with a broken `src` — use the styled placeholder `<div>` described above instead, so there is no broken-image icon in the browser.

## 5. Execution Workflow
We will build this application step-by-step. Do not jump ahead. Wait for my prompt to move to the next phase:
1. **Phase 1:** Setup & App Shell (App.jsx, Landing Page).
2. **Phase 2:** Module 1 Component (Case Study).
3. **Phase 3:** Module 2 Component (Concepts & MCQs).
