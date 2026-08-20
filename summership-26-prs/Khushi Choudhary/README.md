# PyBe MERN App

PyBe is a scenario-driven Python learning prototype built from the supplied PRD and breakdown document. It has no login flow for now.

View the project wiki: [WIKI.md](WIKI.md)
This branch adds the Scenario Generator feature — see [SCENARIO_GENERATOR.md](SCENARIO_GENERATOR.md) for architecture and [product.md](product.md) for what/why.

## Features

- Scenario browser with difficulty, concept, and search filters
- Interactive learning session: learner reasoning, abstraction mapping, conversational prompts, Python construct generation, prompt scoring, and reflection capture
- Dashboard with progress, prompt maturity, concept mastery, misconceptions, and recent sessions
- Roadmap view covering V0 through V3 from the source documents
- JSON-file backed API with seed data
- **New: Scenario Generator** — AI-generated case studies, reviewed by a mentor before anything reaches a learner. Two ways in:
  - **Mentor tools** (`mentor.html`, admin-token gated) — configure any of 6 providers (Anthropic, OpenAI, xAI, MiniMax, Gemini, custom), generate a case study, review the queue (see who submitted it, send them feedback by email, edit any stage, approve or reject), and manage everything already live on the homepage (play, edit, or delete a published case study).
  - **Learner tools** (`learner-generate.html`, no login) — a learner supplies their own provider key, generates a case study, must play through all five stages themselves before submitting, and can track their own submissions ("My case studies") to edit and resend anything rejected — or revise something already published.
  - Every generated case study follows the same five-stage arc (observe → interpret → name the concept → reveal the syntax and build it, with an execution-flow diagram and two comprehension checks → practice independently, with a transfer check), validated automatically — including actually parsing the assembled code as Python — before a human ever reviews it.

## Tech Stack

- JSON file storage
- Express + Node.js
- React + Vite
- Plain CSS, no auth (except a single admin token gating the Scenario Generator's mentor tools; the learner side has no login by design)

## Prerequisites

- Node.js 18+

## Setup

1. Install dependencies:

```bash
npm run installAll
```

2. Configure the server environment:

```bash
cp server/.env.example server/.env
```

Set `MENTOR_ADMIN_TOKEN` in `server/.env` to something only you know — this is what gates the mentor tools described in [SCENARIO_GENERATOR.md](SCENARIO_GENERATOR.md). The rest of the default values work for local development.

Provider API keys (for the mentor's Settings screen) are stored separately in `server/src/data/aiConfig.json`, which is gitignored and auto-created empty on first run — never committed, never shared in this branch.

3. Seed sample data:

```bash
npm run seed
```

4. Run the app:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Mentor tools: http://localhost:5173/mentor.html (needs the admin token)
- Learner Scenario Generator: http://localhost:5173/learner-generate.html (no login — bring your own provider key)
- API: http://localhost:5000/api

## Notes

The AI behavior in the base learning flow is deterministic and local. The abstraction mapper, prompt evaluator, and Python construct generator use rule-based logic so you can run everything without external AI keys. The Scenario Generator feature is the one place that calls a real LLM provider — either the mentor's own key (Settings screen) or a learner's own key (entered once, per request, never stored).

Learning data is stored in `server/src/data/db.json`. This keeps the prototype simple and fully local, without MongoDB, Docker, Atlas, or any external database.
