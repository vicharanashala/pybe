# PyBe Product Brief

## Product Vision
PyBe is a scenario-driven Python learning prototype that helps early Python learners practice problem solving, reasoning, and code thinking through interactive, story-based sessions.

## Problem Statement
Many beginner Python experiences separate concepts from real-world context. Learners need a lightweight, guided environment that blends scenario comprehension, abstraction mapping, feedback, and Python construct generation without requiring a full backend or external AI keys.

## Target Users
- Beginner Python learners
- Coding learners who want scaffolding for reasoning and abstraction
- Instructors or curriculum designers validating prototype learning flows
- Product teams exploring early-stage edtech concepts with low infrastructure overhead

## Core Value
PyBe delivers a low-friction learning experience where users:
- explore curated scenarios by difficulty and concept
- reason through tasks in context
- map ideas to Python constructs
- receive feedback and explanations
- track progress and mastery in a dashboard

## Key Features
- Scenario browser with filters for difficulty, concept, and search
- Interactive reasoning sessions that capture learner reflection and prompt maturity
- Story-based learning flow with MCQ practice, feedback, and Python concept explanations
- Dashboard with progress metrics, mastery insights, misconceptions, recent sessions, and story scores
- Local JSON-backed API for fast prototype deployment and development

## User Stories
- As a beginner learner, I want to browse Python scenarios so I can choose practice exercises at the right level.
- As a learner, I want to answer guided questions and see reasoning feedback so I can understand my thought process.
- As a learner, I want a narrative story flow with exercises and explanations so I stay engaged while practicing Python concepts.
- As a learner, I want to see my progress and mastery trends so I can track growth across sessions.

## MVP Scope
- Frontend built in React + Vite
- Backend built in Express + Node.js
- Local JSON storage for scenario, roadmap, and session data
- No login or database required
- Deterministic local AI-like behavior for reasoning, scoring, and explanations

## Success Metrics
- Learners can complete a scenario session and receive immediate feedback
- Users can filter scenarios and launch a learning flow without errors
- Dashboard reflects recent sessions and progress data clearly
- The application runs locally with a single `npm run dev` command

## Product Roadmap
- V0: scenario discovery, session flow, local content API
- V1: interactive story learning lab, MCQ practice, concept explanations
- V2: richer dashboard metrics and progress analytics
- V3: adaptive learning support, personalized recommendations, future AI integration

## Implementation Notes
- Data is stored in `server/src/data/db.json`
- The frontend is under `client/`
- The backend API routes are under `server/src/routes/`
- Local learning and AI-like services are in `server/src/services/`

## How to Run
1. Install dependencies: `npm run installAll`
2. Seed sample data: `npm run seed`
3. Run the app: `npm run dev`

Frontend: `http://localhost:5173`
API: `http://localhost:5000/api`
