# PyBe MERN App

PyBe is a scenario-driven Python learning prototype built from the supplied PRD and breakdown document. It has no login flow for now.

📚 View the project wiki: [WIKI.md](WIKI.md)

## Features

- **Scenario browser** with difficulty, concept, and search filters
- **Multi-page Navigation** — 8 distinct views: Explorer → Workspace → Summary → Mentor → W3H → Quiz → Review → Dashboard
- **Interactive learning session**: learner reasoning, abstraction mapping, conversational prompts, Python construct generation, prompt scoring, and reflection capture
- **AI Mentor Output** with abstraction map, generated Python code, prompt feedback, and misconception signals
- **W3H Adaptive Learning Panel** — accordion-style What / Why / Where / How tutor with colored section indicators, real generated code view with syntax highlighting, and a Fix Insight block when mistakes are detected
- **XP System** — earns XP per session based on prompt score and concept coverage
- **Streak System** — tracks consecutive daily learning activity
- **Quiz Engine** — adaptive multiple-choice questions reinforcing the session concept with instant feedback, hearts system, personalized feedback, session-aware questions, review screen, and recommended next scenario
- **Voice Input** — microphone support on all textareas using browser SpeechRecognition API
- **Dashboard** with progress, prompt maturity, concept mastery, misconceptions, and recent sessions
- **Roadmap view** covering V0 through V3 from the source documents
- **Learning Passport** — personal learning tracker with profile card, XP/streak/sessions stats, progress bar, level badges, and 18 concept stamps (Variables, Loops, Conditionals, Functions, Lists, Tuples, Dictionaries, Sets, Strings, Files, Modules, Comprehensions, Classes, Objects, Exceptions, I/O, Recursion, Algorithms)
- JSON-file backed API with seed data

## Tech Stack

- JSON file storage
- Express + Node.js
- React + Vite
- Plain CSS, no auth
- Browser SpeechRecognition (native) for voice input

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

## V0 Experience Layer

Session submission produces structured learning intelligence:

1. **Abstraction Mapping** — maps natural language reasoning to Python concepts (loops, conditionals, functions, lists, etc.)
2. **Prompt Evaluation** — scores the AI prompt and provides actionable feedback
3. **Python Code Generation** — deterministic templates selected based on detected concepts
4. **W3H Adaptive Learning Panel** — 4-section accordion tutor (What/Why/Where/How) with colored indicators, adaptive Fix Insight block when mistakes are detected, and real code view with line highlighting
5. **Misconception Detection** — keyword-based flagging of common misconceptions
6. **Quiz Reinforcement** — adaptive quiz questions after each session with light difficulty adjustment

## Architecture

The codebase follows a page-based structure to keep each screen self-contained.

```
client/src/
├── main.jsx              # App shell, routing, state management
├── pages/                # One file per page/view
│   ├── ExplorerPage.jsx  # Scenario browser and filters
│   ├── WorkspacePage.jsx # Learning task form and AI output preview
│   ├── SummaryPage.jsx   # Session result and abstraction map
│   ├── MentorPage.jsx    # AI Mentor deep-dive analysis
│   ├── W3HPage.jsx       # What/Why/Where/How learning guide
│   ├── QuizPage.jsx      # Adaptive multiple-choice quiz
│   ├── DashboardPage.jsx # Progress stats, roadmap, recent sessions
│   └── PassportPage.jsx  # Placeholder for learning passport
├── components/
│   ├── TopNavigation.jsx # Nav bar, journey step icons, XP/streak display
│   └── SharedComponents.jsx # W3H panel, VoiceInput, EmptyResult, Analytics, etc.
└── styles.css
```

- **`main.jsx`** — hosts the App component, owns all shared state (scenarios, sessions, XP, streak, view), and renders the correct page based on `view` state.
- **`pages/`** — each file exports a single React component that renders one full page. Props flow down from `App`.
- **`components/`** — reusable UI pieces shared across multiple pages (TopNav, W3H accordion, VoiceInput, Analytics, etc.).