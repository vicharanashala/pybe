# PyBe MERN App

PyBe is a scenario-driven Python learning prototype built from the supplied PRD and breakdown document. It has no login flow for now.

📚 View the project wiki: [WIKI.md](WIKI.md)

## Features

- Scenario browser with difficulty, concept, and search filters
- Interactive learning session: learner reasoning, abstraction mapping, conversational prompts, Python construct generation, prompt scoring, and reflection capture
- Dashboard with progress, prompt maturity, concept mastery, misconceptions, and recent sessions
- Roadmap view covering V0 through V3 from the source documents
- JSON-file backed API with seed data

## Tech Stack

- JSON file storage
- Express + Node.js
- React + Vite
- Plain CSS, no auth

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

The default values work for local development.

3. Seed sample data:

```bash
npm run seed
```

4. Run the app:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000/api

## Notes

The AI behavior in this prototype is deterministic and local. The abstraction mapper, prompt evaluator, and Python construct generator use rule-based logic so you can run everything without external AI keys. Later phases can replace those services with OpenAI, RAG, or TinyLLM components.

Learning data is stored in `server/src/data/db.json`. This keeps the prototype simple and fully local, without MongoDB, Docker, Atlas, or any external database.
