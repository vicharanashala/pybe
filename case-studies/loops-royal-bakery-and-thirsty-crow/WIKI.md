# PyBe MERN App Wiki — v2.0

## What is PyBe MERN App?

PyBe is a production-grade learning platform for Python that uses scenario-driven sessions and interactive concepts to help learners practice reasoning, abstraction, and Python construct generation. Version 2.0 introduces enterprise-grade architecture with a layered backend, ORM-backed database, validated API endpoints, and advanced frontend tooling.

## Architecture Overview

### Backend: Controller-Service-Repository (CSR)

```
Request → Route → Middleware (Zod) → Controller → Service → Repository → Prisma → SQLite
```

- **Routes** define endpoints and attach validation middleware
- **Controllers** handle HTTP request/response translation
- **Services** contain pure business logic (no HTTP, no DB)
- **Repositories** are the only layer that touches the database via Prisma

### Frontend: Modular Component Architecture

```
App.jsx (orchestrator)
├── Sidebar → ScenarioList
├── HeroSection
├── InteractiveWizard ↔ ResultPanel → CodeViewer → PythonSandbox
└── Dashboard: AnalyticsPanel + RoadmapTimeline + SessionList
```

- **Zustand** manages global state (selected scenario, active result, filters)
- **TanStack Query** handles server state with caching and automatic refetching
- **Axios** provides the HTTP client layer
- **Recharts** powers dynamic analytics visualizations
- **Pyodide** enables in-browser Python execution

## Key Concepts

### MEMENTO_MODE

The backend supports two AI processing modes via the `MEMENTO_MODE` environment variable:

- `LOCAL_HEURISTIC` (default): Uses keyword-based pattern matching for abstraction mapping, code generation, and misconception detection
- `GEMINI_LIVE`: Placeholder for Google Gemini API integration — the service layer is structured to swap heuristics for LLM calls

### Prisma ORM

Data is persisted in SQLite via Prisma ORM. The schema defines three models:
- **Scenario**: Learning scenarios with difficulty levels and concept tags
- **Session**: User learning sessions linked to scenarios with full AI output
- **RoadmapPhase**: Product roadmap phases (V0–V3)

To switch to PostgreSQL, update the provider in `schema.prisma` and change `DATABASE_URL`.

### Zod Validation

All POST/PUT endpoints validate request bodies using Zod schemas before reaching the controller. Invalid payloads return `422 Unprocessable Entity` with detailed error messages.

### Pyodide Sandbox

The frontend includes an in-browser Python execution environment powered by Pyodide (WebAssembly-compiled CPython). Users can run generated Python code directly without needing a backend compiler.

## Getting Started

1. `npm run installAll` — Install all dependencies
2. `npm run prisma:setup` — Generate Prisma client and push schema
3. `npm run seed` — Seed 8 scenarios and 4 roadmap phases
4. `npm run dev` — Start both servers concurrently

## Developer Tooling

- **ESLint**: Linting with React plugin and Prettier integration
- **Prettier**: Consistent code formatting
- **Husky**: Git hooks for pre-commit validation
- **lint-staged**: Run linters only on staged files
