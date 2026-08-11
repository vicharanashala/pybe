# PyBe MERN App Wiki

## What is PyBe MERN App?
PyBe is a prototype learning application for Python that uses scenario-driven sessions and interactive concepts to help learners practice reasoning, abstraction, and Python construct generation. It is built as a local MERN-style application with JSON-backed APIs, but does not require a database or authentication for the current prototype.

## Key Purpose
The project is designed to demonstrate a proof-of-concept for a Python learning experience that:
- Presents curated learning scenarios
- Guides learners through reasoning and abstraction mapping
- Generates Python constructs from user interactions
- Tracks progress and session insights
- Provides a roadmap of learning goals from V0 through V3

## Main Features

### 🧠 First-Principles Learning Engine
- **First-Principles Friction Simulator**: Side-by-side Before vs After code comparison in every chapter revealing the pain point behind each Python construct.
- **Interactive Mental Model Lab**: Live visualizer embedded in the Theory phase showing RAM memory slots (`0x7F8`), arithmetic pipelines, zero-indexed string cells, decision trees, loop steppers, hash tables, error shields, and sort steppers.
- **Instant Micro-Sandbox / Interactive Try-It Widget**: Embedded live browser-based Python executor with dark terminal stdout (`$ python main.py`), code resetting, and live syntax validation.
- **Socratic Misconception Spotter**: Automated analysis of student reasoning detecting 5 common beginner mental traps (0-indexing, `=` vs `==`, immutability, list desync, unhandled edge cases) with targeted Socratic prompts.

### 🎨 Theme Systems & Content
- **Dynamic Dashboard Themes**: Interactive theme selector on dashboard (Default 🐍, Potterheads 🧙‍♂️, Marvel 🦾, Anime ⚔️).
- **Tailored Light & Dark Modes**: Bespoke color palettes for both Dark and Light modes across all themes (Hogwarts Parchment, Stark Titanium, Cyber Tokyo Lavender).
- **Theme-Switched Case Studies & Scenarios**: Dynamic filtering of case study arcs and 93 total scenarios matching the active theme across all 13 curriculum chapters.
- **Scenario Browser**: Filter scenarios by difficulty, concept, theme, and keyword search.

### 📚 Learning Flow & Architecture
- **Sequential Chapter Learning**: 13 chapters across 4 curriculum sections (Getting Started, Basics, Intermediate, Advanced).
- **Interactive 4-Phase Learning Flow**: Intro → Questions → Reasoning Summary → Theory Reveal.
- **Educational Scoring System**: Reasoning quality evaluator with level labels (🔥 Excellent / ⚡ Strong / 💡 Good / 📈 Getting there / 🌱 Beginning).
- **Local JSON File Storage**: Seedable sample data (`server/src/data/db.json`) for 93 scenarios across all theme worlds.

## Technology Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Data storage: Local JSON files (`server/src/data/db.json`)
- UI: Plain CSS

## Getting Started
### Prerequisites
- Node.js 18+

### Install Dependencies
```bash
npm run installAll
```

### Configure Environment
```bash
cp server/.env.example server/.env
```

### Seed Data
```bash
npm run seed
```

### Run the App
```bash
npm run dev
```

Visit:
- Frontend: http://localhost:5173
- API: http://localhost:5000/api

## How It Works
- The frontend loads scenarios, session data, and roadmap details from the backend API.
- The backend serves static JSON-based data and handles session/analytics routes.
- Learning interactions are powered by deterministic local logic rather than external AI calls.

## Project Structure
- `client/` - React application source
- `server/` - Express API server and data services
- `server/src/data/` - JSON data storage and seed files
- `server/src/routes/` - API endpoints for analytics, roadmap, scenarios, and sessions
- `server/src/services/learningEngine.js` - core learning logic and evaluation services

## Notes
This app is intentionally minimal and prototype-focused. It is built without authentication, databases, Docker, or external AI keys. The deterministic AI behavior is implemented locally so the app can run fully offline.
