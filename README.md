# PyBe — AI-Powered Python Learning Platform

PyBe is an interactive Python learning platform that teaches **reasoning before coding**. Instead of passively reading syntax, learners engage in structured reasoning exercises and receive AI-generated insights that map their natural problem-solving instincts to Python constructs.

## Project Overview

### The Problem

Traditional Python courses teach syntax first and reasoning later — if at all. This creates learners who can copy code but cannot think through problems independently. They struggle to:

- Identify which Python concept solves their problem
- Articulate their reasoning in a way Python can understand
- Connect abstract thinking to concrete code implementation

### The Solution

PyBe flips the learning model. Learners start by describing *how they think* about a problem — not what code to write. The platform then maps their reasoning to appropriate Python constructs, generates real code, and provides personalized feedback through a structured W³H (What, Why, Where, How) learning framework.

### Target Audience

- **Beginner Python learners** who know syntax but struggle with problem decomposition
- **Self-taught programmers** looking to strengthen their reasoning skills
- **Educators** seeking interactive tools for teaching computational thinking

### Learning Philosophy

> *"Before you write code, you must learn to think in code."*

PyBe believes that clear reasoning produces clear code. The platform rewards thoughtful problem description over syntax recall, building confidence and intuition before introducing language specifics.

---

## Features

### W³H Learning Insight

A structured four-perspective learning framework that helps learners understand concepts from every angle:

- **WHAT** — Personalized insight into the learner's natural thinking pattern (e.g., Repetition, Decision making, Collection handling, Computation, Reusable procedure, Selection and filtering, Sequential thinking)
- **WHY** — Context and purpose explaining why each concept matters in real-world development
- **WHERE** — Real code examples showing where concepts appear in web apps, APIs, automation, data analysis, and everyday analogies
- **HOW** — Four learning blocks: How It Works (step-by-step explanation), How to Think (reasoning process), How to Write It (code visualization with syntax highlighting and line highlighting), and Apply It Yourself (practice exercises)

### W³H Adaptive Learning Panel

Accordion-style tutor with colored section indicators (blue/yellow/orange/red), real generated code view, and a Fix Insight block when mistakes are detected.

### Personalized AI Reasoning

Maps natural language reasoning to Python concepts through:
- Abstraction mapping — connects thinking patterns to Python constructs
- Prompt evaluation — scores reasoning and provides actionable feedback
- Python code generation — deterministic templates based on detected concepts
- Misconception detection — keyword-based flagging of common errors

### Adaptive Quiz Engine

After each learning session, a personalized quiz reinforces concepts:
- Session-aware questions based on the learner's recent scenarios
- Hearts system with instant feedback
- Personalized feedback and performance analysis
- Review screen with explanations for incorrect answers
- Recommended next scenario based on performance

### XP and Streak System

- Earn XP per session based on prompt score and concept coverage
- Track consecutive daily learning activity with streak counters
- Visual progress indicators throughout the platform

### Learning Passport

Personal learning tracker featuring:
- Profile card with XP/streak/session stats
- Progress bar showing concept mastery
- Level badges (Bronze, Silver, Gold, Diamond)
- 18 concept stamps covering Variables, Loops, Conditionals, Functions, Lists, Tuples, Dictionaries, Sets, Strings, Files, Modules, Comprehensions, Classes, Objects, Exceptions, I/O, Recursion, and Algorithms

### Multi-Page Navigation

Eight distinct views following a structured learning journey:

1. **Explorer** — Scenario browser with difficulty, concept, and search filters
2. **Workspace** — Learning task form with voice input support
3. **Summary** — Session results and abstraction mapping
4. **Mentor** — AI Mentor deep-dive analysis
5. **W³H** — The structured learning guide
6. **Quiz** — Adaptive assessment
7. **Dashboard** — Progress stats, roadmap, recent sessions
8. **Passport** — Personal learning tracker

### Voice Input

Microphone support on all textareas using the browser's native SpeechRecognition API.

### Dashboard

Comprehensive view of learning progress including prompt maturity trends, concept mastery charts, misconception tracking, and recent sessions.

### Roadmap

Visual learning roadmap covering V0 through V3 phases, helping learners understand their progression path.

---

## Design Principles

### Reasoning Before Coding

Learners articulate their thinking before seeing code. The platform validates and refines reasoning, not just syntax.

### Personalized Feedback

Each learner's reasoning pattern is unique. Feedback adapts to the individual's thinking style and misconceptions.

### Learning by Understanding

Understanding *why* a concept works leads to better retention than memorization. PyBe emphasizes conceptual mapping over syntax recall.

### Incremental Guidance

The W³H framework progressively deepens understanding — from personal reflection (WHAT) to real-world application (WHERE) to practical implementation (HOW).

### Modular Architecture

Components are designed for reuse. The W³H architecture allows each section to be independently maintained and extended.

### Reusable Components

`W3HInsightSection`, `HowLearningSection`, and `AccordionSection` are purpose-built primitives that ensure consistent rendering across all W³H sections.

### Accessibility

Voice input support, semantic HTML, and keyboard-accessible navigation ensure PyBe is usable by learners with varying needs.

### Maintainability

Deterministic, locally-run AI logic means no external API dependencies. The prototype is fully self-contained and easy to test.

### Scalability

Page-based architecture with clear separation of concerns allows new features to be added without modifying existing code.

### Separation of Concerns

UI components (pages, navigation), business logic (learning engine, quiz scoring), and data persistence (JSON storage) are cleanly separated.

---

## Architecture

### Folder Structure

```
pybe/
├── client/                    # React frontend
│   ├── src/
│   │   ├── main.jsx           # App shell, routing, state management
│   │   ├── pages/             # One file per page/view
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ExplorerPage.jsx
│   │   │   ├── MentorPage.jsx
│   │   │   ├── PassportPage.jsx
│   │   │   ├── QuizPage.jsx
│   │   │   ├── SummaryPage.jsx
│   │   │   ├── W3HPage.jsx
│   │   │   └── WorkspacePage.jsx
│   │   ├── components/
│   │   │   ├── TopNavigation.jsx    # Nav bar with journey steps, XP/streak display
│   │   │   ├── SharedComponents.jsx # W3H panel, VoiceInput, Analytics, Roadmap, etc.
│   │   │   └── ErrorBoundary.jsx
│   │   ├── utils/
│   │   │   ├── passport.js           # Learning passport logic
│   │   │   ├── quizEngine.js         # Question generation
│   │   │   ├── quizGenerator.js      # Quiz content
│   │   │   ├── quizScoring.js        # Scoring and feedback
│   │   │   └── sessionRecovery.js    # State persistence
│   │   └── styles.css               # Global stylesheet
│   └── package.json
├── server/                    # Express API backend
│   ├── src/
│   │   ├── data/
│   │   │   ├── db.json        # JSON data storage
│   │   │   ├── store.js       # Data access layer
│   │   │   └── roadmap.js     # Roadmap data
│   │   ├── routes/
│   │   │   ├── analytics.js
│   │   │   ├── roadmap.js
│   │   │   ├── scenarios.js
│   │   │   └── sessions.js
│   │   ├── services/
│   │   │   └── learningEngine.js  # Core learning logic
│   │   ├── seed.js
│   │   └── index.js
│   └── package.json
├── docs/                      # Developer documentation
│   ├── DEVELOPMENT_GUIDE.md
│   ├── KNOWN_ISSUES.md
│   └── CHANGELOG.md
├── WIKI.md
└── README.md
```

### W³H Architecture

Each W³H section follows a standardized pattern:

1. **Builder Functions** — Pure functions that transform input data into structured insight objects:
   - `buildWhatInsight(primary, reasoning, result)` — Returns `{ title, sections: [{ label, content }] }`
   - `buildWhyInsight(primary, feedback, scenario)` — Returns `{ title, sections: [{ label, content }] }`
   - `buildWhereInsight(codeText)` — Returns `{ title, sections: [{ label, content }] }`
   - `buildHowInsight(codeText, pattern)` — Returns `{ title, explanation, thinking, code: { lines, highlightIndex }, practice }`

2. **Insight Components** — React components that render the structured data:
   - `W3HInsightSection` — Renders sections with label/content pairs (used by WHAT, WHY, WHERE)
   - `HowLearningSection` — Renders four learning blocks (used by HOW)

3. **Accordion Container** — `W3H` component manages expansion state and renders all four sections with their respective components.

### Shared Reusable Components

| Component | Purpose |
|-----------|---------|
| `AccordionSection` | Expandable section with icon, label, title, and custom content |
| `W3HInsightSection` | Renders standardized `{ label, content }` sections |
| `HowLearningSection` | Renders the four-block HOW learning experience |
| `VoiceInput` | Browser-native speech recognition integration |
| `Analytics` | Concept usage meter display |
| `Roadmap` | Phase-based learning roadmap |
| `SessionList` | Recent session preview cards |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Data Storage | Local JSON files |
| Icons | Lucide React |
| Styling | Plain CSS (single global stylesheet) |
| Voice | Browser SpeechRecognition API (native) |
| AI Behavior | Deterministic local logic (rule-based) |

**No external dependencies:**
- No authentication
- No database
- No external AI keys required
- No Docker

---

## Installation

### Prerequisites

- Node.js 18+

### Steps

1. Clone the repository and navigate to the project directory:

```bash
cd pybe
```

2. Install all dependencies:

```bash
npm run installAll
```

3. Configure the server environment:

```bash
cp server/.env.example server/.env
```

The default values work for local development.

4. Seed sample data:

```bash
npm run seed
```

---

## Running the Project

Start both the frontend and backend in development mode:

```bash
npm run dev
```

This runs both servers concurrently:
- **Frontend:** http://localhost:5173
- **API:** http://localhost:5000/api

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:client` | Start frontend only (port 5173) |
| `npm run dev:server` | Start backend only (port 5000) |
| `npm run seed` | Seed sample data |
| `npm run build` | Build frontend for production |

---

## Future Improvements

The following enhancements are planned for future versions:

- **External AI Integration** — Replace deterministic logic with OpenAI, RAG, or TinyLLM for more sophisticated abstraction mapping and feedback
- **Database Migration** — Move from JSON file storage to MongoDB or PostgreSQL for production scale
- **User Authentication** — Add user accounts, progress syncing, and multi-device support
- **Enhanced Quiz Engine** — Implement spaced repetition (SM-2 algorithm) for optimal review scheduling
- **Interactive Code Editor** — Integrate a browser-based Python REPL (e.g., Pyodide) for live code execution
- **Progress Analytics Dashboard** — Visual charts showing learning trends, concept mastery over time, and streak history
- **Social Features** — Share learning achievements, compare progress with peers, collaborative coding challenges
- **Mobile App** — React Native companion app for on-the-go learning
- **Localization** — Multi-language support for global learners
- **Accessibility Improvements** — Full WCAG 2.1 AA compliance audit and remediation