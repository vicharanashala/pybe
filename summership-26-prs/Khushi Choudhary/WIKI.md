# PyBe MERN App Wiki

## What is PyBe MERN App?
PyBe is a prototype learning application for Python that uses scenario-driven sessions and interactive concepts to help learners practice reasoning, abstraction, and Python construct generation. It is built as a local MERN-style application with JSON-backed APIs, but does not require a database or authentication for the current prototype (the one exception is the mentor-only Scenario Generator added in this fork, gated by a single admin token — see [SCENARIO_GENERATOR.md](SCENARIO_GENERATOR.md)).

## Key Purpose
The project is designed to demonstrate a proof-of-concept for a Python learning experience that:
- Presents curated learning scenarios
- Guides learners through reasoning and abstraction mapping
- Generates Python constructs from user interactions
- Tracks progress and session insights
- Provides a roadmap of learning goals from V0 through V3

## Main Features
- Scenario browser with difficulty, concept, and search filters
- Interactive learning sessions with conversational prompts
- Reasoning support, abstraction mapping, prompt scoring, and reflection capture
- Dashboard with progress, prompt maturity, concept mastery, and misconceptions
- Roadmap visualization for staged product development
- Local JSON file storage with seedable sample data
- Mentor-only Scenario Generator: system-prompt-driven case study generation across six AI providers, with a validator, a review queue, and a publish step

## Technology Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Data storage: Local JSON files (`server/src/data/db.json`, plus `aiConfig.json`, `scenarioDrafts.json`, `generatedContent.json` for the Scenario Generator)
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
- Mentor tools: http://localhost:5173/mentor.html
- API: http://localhost:5000/api

## How It Works
- The frontend loads scenarios, session data, and roadmap details from the backend API.
- The backend serves static JSON-based data and handles session/analytics routes.
- Learning interactions are powered by deterministic local logic rather than external AI calls.
- The Scenario Generator (this fork's addition) is the one path that calls a real LLM, only from the mentor-only tools, only with a key the mentor supplies themselves.

## Project Structure
- `client/` - React application source (learner app at `/`, mentor tools at `/mentor.html`)
- `server/` - Express API server and data services
- `server/src/data/` - JSON data storage and seed files
- `server/src/routes/` - API endpoints for analytics, roadmap, scenarios, sessions, and the scenario generator
- `server/src/services/learningEngine.js` - core learning logic and evaluation services for the base app
- `server/src/services/` (new) - system prompt, provider adapters, config store, validator, draft store, content store for the Scenario Generator

## Notes
This app is intentionally minimal and prototype-focused. It is built without authentication, databases, Docker, or external AI keys — except for the Scenario Generator, which is opt-in, mentor-gated, and clearly documented in [SCENARIO_GENERATOR.md](SCENARIO_GENERATOR.md).
