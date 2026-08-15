# Minecraft Lists Learning Module

This directory contains the completely refactored, native React implementation of the **"PLAY MINECRAFT LISTS"** interactive tutorial. It replaces the old, static HTML/JS DataVille implementation with a seamless, Single Page Application (SPA) experience built natively into the PyBe React architecture.

## Overview
The module uses a Minecraft-themed gamified environment to teach Python List operations. It contains two main modes:
1. **Survival Mode**: A guided, interactive story where the user learns fundamental list operations (`append`, `insert`, `pop`, `sort`, `len`) through the narrative of Steve managing his hotbar inventory.
2. **Creative Sandbox**: A free-play environment allowing the user to experiment with all 17 standard Python list operations, complete with visual feedback, Big-O time complexity analysis, and a simulated Python REPL history log.

---

## Architecture & Migration Details

### 1. State Management (Vanilla to React)
Previously, the application relied heavily on direct DOM manipulation (`document.createElement`, `classList.add`). In this refactor, all state (inventory arrays, history logs, operation status) was mapped into standard React `useState` hooks. 
- The `items` array dynamically dictates what is rendered on the screen.
- The UI reacts immediately to changes, making the code much more resilient and predictable.

### 2. The FLIP Animation Engine (`Stage.jsx`)
The most significant architectural achievement of this module is the perfect replication of the vanilla JavaScript **FLIP (First, Last, Invert, Play)** animation algorithm inside a React lifecycle.
- **How it works:** When an operation occurs (like `insert` or `sort`), the `Stage` component uses `useLayoutEffect` to snapshot the bounding client rectangles of every item box *before* React commits the visual changes to the DOM.
- It then calculates the positional difference (`dx`) and applies a reverse CSS transform (`Invert`), immediately followed by a transition to `0` (`Play`).
- This allows the DOM to render complex re-ordering animations flawlessly without external animation libraries.

### 3. Component Hierarchy
To ensure maintainability, the massive 600-line monolithic script was decoupled into focused React components:

- `MinecraftList.jsx`
  - The main container managing the layout, the Minecraft-themed CSS framing, and the tab navigation state (`welcome`, `story`, `sandbox`).
- `components/SurvivalMode.jsx`
  - Manages the state of the story sequence (`currentStepIndex`).
  - Implements regular expression validation to ensure the user types the exact correct Python syntax before advancing.
- `components/CreativeSandbox.jsx`
  - Provides a comprehensive UI for testing 17 unique list operations.
  - Manages complex form state and error boundary handling (e.g., trying to pop an empty list).
- `components/Stage.jsx`
  - The pure, visual presentation layer of the hotbar. Takes `items`, `highlight`, and `speed` as props and handles all complex CSS and FLIP animations.

---

## Routing & Vercel Deployment

### React Router Integration
The module is integrated into the core PyBe application via `react-router-dom` in `main.jsx`. Navigating to `/minecraft-list` loads the module instantly with no page refresh, preserving the SPA experience.

### Vercel SPA Routing Fix
Because the application now relies on client-side React routing rather than physical `.html` files, a custom `vercel.json` configuration was added to the repository root. This ensures that Vercel rewrites all paths to `index.html` and correctly executes the `client` build process within the monorepo structure, preventing `404 NOT_FOUND` errors on direct links.

## CSS Scoping
All Minecraft-specific styling is contained within `MinecraftList.css`. Global tags (like the body dirt texture) were specifically scoped to a `.minecraft-app` wrapper class. This guarantees that the vibrant, blocky aesthetic of this learning module does not leak out and accidentally break the styling of the main PyBe dashboard.
