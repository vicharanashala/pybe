# AGENTS.md — AI Pair Programming & Vibe Coding Guidelines

This document provides instructions and behavioral constraints for AI coding agents (**Gemini, Claude, Cursor, ChatGPT, Antigravity**) working on the **PyBe (CKLIS Story-to-Code Intelligence Engine)** codebase.

---

## 🤖 Core Agent Directives

1. **Obey Constitutional Laws (CL-01 to CL-18)**:
   - Never write shortcut code or generate code examples without first establishing scenario and mental model alignment.
   - Preserves 100% real-world physical and historical fidelity. Never use modern industrial metaphors (*e.g., conveyor belts*) for historical settings (*e.g., Mughal court*).

2. **Preserve User Story Anchors (CL-14/CL-18)**:
   - When the user provides a custom story or fable (*e.g., Vikram and Betaal, Akbar and Birbal, The Thirsty Crow*), NEVER replace, rewrite, or simplify it.
   - Always reference `KnowledgeLoader.getCanonicalStoryGrounding(story)` to preserve real character names, plot structures, and canonical rules.

3. **Code Staging Rule (CL-17)**:
   - Panels 1 to N-1 MUST focus 100% on pure story narrative, dialogue, visual art, and character emotion.
   - Code snippets and concept callouts MUST appear strictly on the final scene.

4. **Zero Generic Pseudocode**:
   - Never generate generic code placeholders like `perform_story_action()` or `item_count = 0`.
   - Always map actual physical variables of the story (*e.g., `water_level = 0.2`, `pebbles_dropped += 1`, `betaal_captured = True`*).

5. **UI Rendering Defensive Safeguards**:
   - Never render LLM fields directly into React JSX without `renderSafeText(...)` or string coercion.
   - LLMs can return strings, arrays, or objects (*e.g., `{ Vikram: "...", Betaal: "..." }`*); `renderSafeText` handles them safely without triggering React error boundaries.

---

## 🛠️ Codebase Structure

```
Short Story Creation/
├── docs/                       ← System documentation & prompt usage guide
├── MVP/                        ← Core React + Express Application
│   ├── server.ts               ← Express API entry point & SSE streaming
│   └── src/
│       ├── types.ts            ← TypeScript interfaces (LearningRequest, RuntimeContext, etc.)
│       ├── App.tsx             ← Main React SPA view container with ErrorBoundary
│       ├── components/
│       │   ├── LesForm.tsx     ← Dual-mode intake form
│       │   ├── DeliverableViewer.tsx ← Studio outcome viewer (Visual / Script / Blueprint)
│       │   └── InternalReasoningDrawer.tsx ← 7-step CKLIS auditability drawer
│       └── server/
│           ├── cklisOrchestrator.ts    ← 4-pass CKLIS pipeline runner
│           ├── knowledgeLoader.ts     ← Spec loader & Canonical Story Grounding engine
│           ├── llmClient.ts           ← Multi-key Groq rotation & provider failover
│           └── representationProcessors.ts ← Short Comic, Long Comic, Video, Storybook, Podcast
```

---

## 🧪 Verification Commands

Before declaring any task completed, run:

```bash
cd MVP

# 1. Type check
npx tsc --noEmit

# 2. Production Build check
npm run build
```
