# Changelog — PyBe Feature Branch

This changelog summarizes major architectural and feature changes introduced in the `feature/v0-experience-layer` branch.

## v0.3.0 — W³H Architecture Refactor (2026-07-03)

### Summary

Refactored the W³H learning panel from hardcoded rendering into a standardized, component-driven architecture. Each section (WHAT, WHY, WHERE, HOW) now uses dedicated builder functions and reusable insight components.

### Breaking Changes

None — all changes are backward-compatible refactors.

---

### W³H Standardized Architecture

#### WHAT Section
- **Before:** Hardcoded inside `W3H` component with inline content
- **After:** `buildWhatInsight(primary, reasoning, result)` returns standardized `{ title, sections: [{ label, content }] }` object
- **Renders via:** `W3HInsightSection` component

#### WHY Section
- **Before:** Hardcoded inside `W3H` component with inline content
- **After:** `buildWhyInsight(primary, feedback, scenario)` returns standardized `{ title, sections: [{ label, content }] }` object
- **Renders via:** `W3HInsightSection` component

#### WHERE Section
- **Before:** `buildWhere()` returned `{ whereLabel, whereText }` with inline rendering
- **After:** `buildWhereInsight()` returns standardized `{ title, sections: [{ label: 'Where It Appears in Real Code', content: '...' }, { label: 'Where It Is Used in Real Life', content: '...' }] }` object
- **Renders via:** `W3HInsightSection` component
- **Content additions:**
  - Real code usage examples (web apps, APIs, automation, data analysis, etc.)
  - Everyday life analogies (traffic lights, shopping lists, GPS navigation, etc.)

#### HOW Section
- **Before:** `buildHow()` returned `{ codeLines: [], highlightIdx: 0 }` with inline code visualization
- **After:** `buildHowInsight(codeText, pattern)` returns comprehensive `{ title, explanation, thinking, code: { lines, highlightIndex }, practice }` object
- **Renders via:** New `HowLearningSection` component with four learning blocks:
  - 🧩 How It Works — step-by-step concept explanation
  - 🧠 How to Think — reasoning process with guiding questions
  - 💻 How to Write It — code visualization with syntax highlighting and line highlighting preserved
  - 🚀 Apply It Yourself — practice exercise matching the detected concept

### New Components

| Component | File | Purpose |
|-----------|------|---------|
| `HowLearningSection` | `SharedComponents.jsx` | Renders the 4-block HOW learning experience with preserved code visualization |

### Deprecated Functions

| Function | Status | Replacement |
|----------|--------|-------------|
| `buildWhere()` | Renamed | `buildWhereInsight()` |
| `buildHow()` | Renamed | `buildHowInsight()` |

### Code Cleanup

- Removed unused imports: `ChartNoAxesCombined`, `Route`, `MessageSquareText` from `SharedComponents.jsx`
- Removed dead variables: `howCodeLines`, `howHighlightIdx` (computed but never used after HOW refactor)

---

## v0.2.0 — Core V0 Experience Layer (2026-06-26)

### Features Added

- **W3H Adaptive Learning Panel** — Accordion UI with colored indicators, real code view, Fix Insight block
- **XP System** — Earn XP per session based on prompt score and concept coverage
- **Streak System** — Consecutive daily learning activity tracking
- **Quiz Engine v2** — Session-aware questions, hearts system, personalized feedback, review screen
- **Multi-page Navigation** — 8 distinct views with journey tracking
- **Passport Page** — Learning tracker with stamps and badges
- **Voice Input** — Browser SpeechRecognition API integration
- **Responsive Layout** — Fluid grids and container system
- **Error Boundary** — React error boundary for graceful crash handling
- **Dev Environment Hardening** — strictPort, crash guards, API resilience

### Pages Added

| Page | Purpose |
|------|---------|
| `DashboardPage.jsx` | Progress stats, roadmap, recent sessions |
| `ExplorerPage.jsx` | Scenario browser with filters |
| `WorkspacePage.jsx` | Learning task form and AI output |
| `SummaryPage.jsx` | Session results and abstraction map |
| `MentorPage.jsx` | AI Mentor deep-dive analysis |
| `W3HPage.jsx` | What/Why/Where/How learning guide |
| `QuizPage.jsx` | Adaptive quiz with hearts system |
| `PassportPage.jsx` | Personal learning tracker |

### Components Added

| Component | Purpose |
|-----------|---------|
| `TopNavigation.jsx` | Nav bar, journey steps, XP/streak display |
| `SharedComponents.jsx` | W3H panel, VoiceInput, Analytics, Roadmap, etc. |
| `ErrorBoundary.jsx` | React error boundary |

### Utilities Added

| File | Purpose |
|------|---------|
| `passport.js` | Learning passport logic, badges, stamps |
| `quizEngine.js` | Question generation and pooling |
| `quizGenerator.js` | Quiz content and concept questions |
| `quizScoring.js` | Scoring and personalized feedback |
| `sessionRecovery.js` | State persistence |

---

## v0.1.0 — Initial PyBe Prototype (2026-06-09)

### Initial Features

- Scenario-driven Python learning sessions
- Basic abstraction mapping (reasoning → Python concept)
- JSON file storage with seed data
- Express API with scenarios, sessions, roadmap, analytics routes
- Learning engine with deterministic AI behavior
- WIKI documentation

---

*Previous base branch: `main` (commit b69a856)*
*Feature branch: `feature/v0-experience-layer`*