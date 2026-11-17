# Recursive Explorer: Ant Colony Adventure

An interactive learning adventure that teaches **recursion** through the real behavior of an ant colony. Watch the colony build itself by following one excavation rule — *find diggable soil → dig a tunnel → create a chamber → repeat from the new chamber* — then discover that the pattern is recursion, and map it to Python.

No backend. No accounts. Progress, XP, achievements, and settings persist in `localStorage`.

## How to run

```
npm install
npm run dev
```

## The experience

- **10-scene story arc** — from a founding chamber to the base-case rock to post-order recursion. Programming vocabulary (function, recursion, base case) is deliberately withheld until the learner has observed and interacted with the pattern.
- **Animated colony cross-section** — procedural ants, straight tunnels, progressive disclosure: nothing appears before the activity that creates it finishes.
- **Post-order Python reveal** — three synchronized panels (Python code, call stack, mini colony) trace `build_colony()` digging down to the rock, then carving each chamber on the way back up.
- **Quizzes, XP, and achievements** embedded in every scene.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run typecheck` | Type-check with `tsc --noEmit` |
| `npm run lint` | Lint with ESLint |

## Structure

- `src/data/` — all story content: `types.ts`, `story.ts` (scenes with embedded quizzes), `achievements.ts`
- `src/components/` — UI including the colony renderer and Python reveal
- `src/components/colony/` — colony geometry and glyphs
- `src/state/` — game state; persisted to `localStorage`
- `src/audio/` — procedural Web Audio sound effects (no assets)
