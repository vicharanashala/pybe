<h1 align="center">Changelog

</h1> 



<p align="center">
All notable changes to the PyBe (Scenario-First Python) platform are documented in this file.
</p>

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

> **Maintenance Rule:** `Product.md` and `change.md` are mandatory artifacts. Both must be updated atomically with every pull request or feature implementation — no code change is considered "done" until its corresponding entry exists here.

---

## **Version [2.0.0]** — 2026-07-25

### Summary
Major feature release integrating the interactive **Minecraft Lists Learning Module** into the PyBe SPA. Ships a gamified 9-step guided *Survival Mode* story, a 17-operation *Creative Sandbox* with real-time FLIP DOM animations, flexible input validation supporting both natural English and strict Python syntax, and complete product documentation.

### Added
- **`client/src/pages/MinecraftList/`** — complete React module for gamified Python List learning.
  - `MinecraftList.jsx` — main module container managing tab navigation (`welcome`, `story`, `sandbox`) without page reloads.
  - `MinecraftList.css` — scoped CSS delivering an authentic retro Minecraft aesthetic with custom borders and typography.
  - `components/SurvivalMode.jsx` — guided narrative advancing through 9 interactive inventory challenges (`[]`, `append()`, `len()`, `insert()`, `pop()`, `sort()`).
  - `components/CreativeSandbox.jsx` — open experimentation playground supporting 17 distinct Python list operations, REPL simulation history, and Big-O time complexity badges (`O(1)`, `O(n)`, `O(n log n)`).
  - `components/Stage.jsx` — presentation component rendering the inventory hotbar and executing smooth FLIP (First, Last, Invert, Play) layout animations via React's `useLayoutEffect`.
- `client/src/pages/MinecraftList/README.md` — module-specific technical documentation and component API guide.
- `client/vite.config.js` — custom Vite configuration supporting asset resolution and monorepo client builds.
- `Product.md` — authoritative project and technical documentation covering architecture, REST API endpoints, database schemas, installation, and design decisions.

### Changed
- `client/src/main.jsx`
  - Added React Router DOM (`BrowserRouter`, `Routes`, `Route`) to enable SPA navigation between the main dashboard (`/`) and the Minecraft Lists module (`/minecraft-list`).
  - Added a prominent, retro-styled **"PLAY MINECRAFT LISTS"** button to the dashboard sidebar.
- `client/src/pages/MinecraftList/components/SurvivalMode.jsx`
  - Upgraded input validation regex patterns to accept both common English commands (e.g., `"add wood"`, `"append wood"`, `"create empty list"`, `"check length"`, `"remove sword"`) and strict Python syntax, lowering beginner cognitive load.
  - Replaced hardcoded instruction labels with dynamic, step-driven instructions (`currentStep.instruction`).
  - Replaced technical code snippets in placeholders/error messages with clean, welcoming English hints (e.g., `Try: "add wood"`, `Try: "remove sword"`).

### Fixed
- Fixed rigid input validation in Survival Mode that previously rejected valid natural-language attempts from beginner students.

### Removed
- Removed legacy static HTML/JS prototype files from the old `client/` structure during the clean React SPA migration.

### Refactored
- Decoupled the Minecraft Lists module into three modular components (`MinecraftList`, `SurvivalMode`, `CreativeSandbox`), separating logic from presentation (`Stage`) for improved reusability and maintainability.
- Optimized DOM layout transitions in `Stage.jsx` by pre-calculating bounding client rectangles before browser paint, eliminating the need for a third-party animation library.

### Dependencies
- No new external packages added; leveraged existing `react-router-dom` and `lucide-react` to keep the client bundle lightweight.

### Notes
- `Product.md` and `change.md` are now mandatory artifacts, to be updated on every future pull request or feature implementation.

---

## **Version [1.2.0]** — 2026-06-20

### Summary
Introduced comprehensive developer documentation via a project Wiki, with the main repository `README.md` updated to reference onboarding guides and architectural overviews.

### Added
- `WIKI.md` — comprehensive developer wiki detailing architectural principles, scenario authoring instructions, API usage examples, and troubleshooting guides.

### Changed
- `README.md` — added direct links to `WIKI.md` and onboarding instructions for future open-source contributors and new developers.

### Notes
- Established the standing rule that developer guides must be updated alongside new feature implementations.

---

## **Version [1.1.1]** — 2026-06-19

### Summary
Refined the local JSON database schema and existing seed records to improve data consistency across learner session evaluation and scenario filtering.

### Changed
- `server/src/data/db.json`
  - Standardized concept tags and difficulty ratings across all scenario documents to satisfy frontend sidebar filters.
  - Updated historical session sample records to align with `learningEngine.js` abstraction mapping outputs.

### Fixed
- Fixed minor metadata discrepancies in scenario concept tags that caused filtering inconsistencies in the dashboard UI.

### Notes
- Verified that all queries against `/api/scenarios?concept=...` return accurate results.

---

## **Version [1.1.0]** — 2026-06-19

### Summary
Expanded the scenario repository with focused, real-world learning challenges designed to teach core Python concepts such as conditionals, loops, and data validation.

### Added
- Curated real-world programming scenarios in `server/src/data/scenarios.js`:
  - **Foodpanda Order Dispatch** — teaches conditionals and state validation.
  - **ATM Cash Dispenser** — teaches mathematical division and conditional flow.

### Changed
- `server/src/data/scenarios.js` — added structured scenario objects with difficulty levels (`Beginner`, `Intermediate`), starter prompts, and comprehensive problem descriptions to guide student reasoning.

### Notes
- Re-seeded `db.json` via `npm run seed` to populate the new scenario catalog across all local development environments.

---

## **Version [1.0.0]** — 2026-06-19

### Summary
Initial release of the PyBe (Scenario-First Python) MERN learning platform. Establishes the core full-stack architecture: a React SPA frontend, an Express/Node.js REST API backend, a deterministic local AI learning engine, and file-based JSON document storage.

### Added
- `client/` — complete Vite + React frontend dashboard SPA.
  - `client/src/main.jsx` — dashboard UI (`App`) handling scenario browsing, interactive session submission, progress analytics, and product roadmap visualization.
  - `client/src/styles.css` — custom vanilla CSS design system and responsive layout styling.
- `server/` — complete Express + Node.js REST API server.
  - `server/src/index.js` — server initialization, middleware, and CORS configuration.
  - `server/src/routes/scenarios.js` — `GET /api/scenarios`, `POST /api/scenarios`, `GET /api/scenarios/:id`.
  - `server/src/routes/sessions.js` — `GET /api/sessions`, `POST /api/sessions`.
  - `server/src/routes/analytics.js` — `GET /api/analytics` aggregating platform telemetry, prompt scores, and misconception counts.
  - `server/src/routes/roadmap.js` — `GET /api/roadmap` serving staged development milestones.
  - `server/src/services/learningEngine.js` — deterministic AI engine performing keyword abstraction mapping, Python construct synthesis, prompt scoring, and misconception detection without external API latency.
  - `server/src/data/store.js` — asynchronous file I/O data access layer for atomic database operations.
  - `server/src/data/db.json` — file-based document database storing scenarios and learner sessions.
  - `server/src/data/seed.js` — database seeding script for resetting initial state.

### Dependencies
- **Added:** `react` (`^18.3.1`), `react-dom` (`^18.3.1`), `react-router-dom` (`^7.18.1`), `lucide-react` (`^0.468.0`), `vite` (`^6.0.7`), `express` (`^4.21.2`), `cors` (`^2.8.5`), `concurrently` (`^9.1.2`).

### Notes
- Designed around a local JSON storage engine (`db.json`) to enable zero-configuration prototyping and fully offline functionality, with no external database server dependency.

---

*Maintained by the PyBe Core Engineering Team. This file must be updated atomically alongside every structural, architectural, or API-level modification — no exceptions.*
