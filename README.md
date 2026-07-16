# PyBe

> Offline, scenario-driven Python learning prototype

PyBe is a prototype learning application for Python that uses scenario-driven sessions and interactive concepts to help learners practice reasoning, abstraction, and Python construct generation. It is built as a local-first prototype from the supplied PRD and breakdown document, and it is intended to run without a login flow for now.

## What makes this project different

- Scenario browser with difficulty, concept, and search filters
- Interactive learning sessions with guided prompts
- Reasoning support, abstraction mapping, and reflection capture
- Progress dashboard with lessons, quizzes, and milestones
- Playground for practicing Python constructs
- Roadmap view for staged learning goals
- Offline-friendly experience with local data and no required authentication

## Current status

- No login flow is implemented yet
- The app is designed to work in offline mode
- Progress and learning content are handled locally in the prototype
- This is a learning prototype, not a production-ready platform

## Technology stack

- Frontend: React + Vite + TypeScript
- UI: React components and CSS
- Backend: Lightweight Node.js/Express setup
- Data: Local JSON-backed content and browser storage

## Getting started

Install dependencies:

```bash
npm install
```

Run the app locally:

```bash
npm run dev
```

Open the local development URL shown in the terminal.

## Offline mode

PyBe is intended to be used as an offline-friendly prototype. The current experience does not depend on authentication, remote AI services, or a live database. It is meant to be simple, local, and easy to explore without setup friction.

## Project scope

This repository is focused on the prototype experience for:

- scenario browsing
- lesson progression
- quiz practice
- guided coding exploration
- progress tracking

Future versions may expand into richer personalization, deeper analytics, and more advanced learning pathways.

