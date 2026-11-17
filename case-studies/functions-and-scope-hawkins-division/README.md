# Hawkins Division — Functions Field Manual

An interactive, Stranger-Things-inspired learning adventure that teaches **Python Functions**
through story, choices, and consequences instead of textbook explanations.

Built with **React + Vite + TypeScript + Tailwind CSS + Framer Motion**. No backend required.

## Quick start

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build a static production bundle:

```bash
npm run build
npm run preview   # serve the built dist/ folder locally
```

## What's inside

- **11 missions** (`src/data/missions.ts`): repetition → `def` → calling functions →
  parameters → multiple parameters → return values → local scope → global scope →
  nested functions → recursion → a final "combine everything" protocol.
- **A generic mission engine** (`src/components/screens/MissionScreen.tsx`) that plays every
  mission through the same rhythm: briefing → story → choice → consequence → concept reveal →
  field challenge → reward/unlock. All mission *content* lives in data, not UI code, so new
  missions can be added by extending `missions.ts` alone.
- **Three interactive challenge types**: multiple choice, fill-in-the-code, and drag-to-reorder
  code blocks (`src/components/missions/`).
- **Progress system** (`src/context/GameContext.tsx`): XP, ranks, badges, mission unlocking, and
  a collectible "cassette tape" tip for every mission — persisted to `localStorage`.
- **Atmosphere layer** (`src/components/layout/`): CRT scanlines, drifting fog, a cursor-following
  flashlight beam, and floating spore particles — all disabled automatically under
  `prefers-reduced-motion`.

## Extending it

To add a new mission, add one object to the `missions` array in `src/data/missions.ts` following
the `Mission` type in `src/types/mission.ts`. The engine, map screen, and progress system will
pick it up automatically — no other code changes needed.

## Accessibility

- Respects `prefers-reduced-motion` (disables the flashlight cursor and shortens/removes
  animations).
- All interactive elements are keyboard-operable and have visible focus states.
- Drag-and-drop reorder challenges have arrow-button alternatives for touch/keyboard users.
- High-contrast color palette against a near-black background.
