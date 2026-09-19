# PyBe TraceLab — Interactive Python Execution & Notional Machine

## Overview

PyBe TraceLab adds an interactive code execution and state inspection interface to PyBe. It allows learners to step through Python code line-by-line, observe variable changes in memory, and predict execution state before code runs.

## Features

- **Step Stepper**: Step forward and backward through Python code line-by-line with play/pause and adjustable speed controls.
- **Variable Memory Watch**: Shows variable names, data types, current values, and highlights updated variables during execution.
- **State Prediction Checkpoints**: Prompts learners at key steps to predict variable values or branch outcomes before execution proceeds.
- **Real-World Context Anchors**: Connects code execution steps to the scenario's physical context.
- **Misconception Detection**: Checks for common beginner errors like assignment in conditions, range boundaries, and accumulator placement.
- **Interactive Sandbox**: Allows testing custom Python code with live step-by-step state tracing.
- **Learning Analytics**: Displays session metrics, concept counts, and prediction accuracy.

## Tech Stack

- **Frontend**: React + Vite, Lucide Icons, Plain CSS
- **Backend**: Node.js + Express
- **Data Storage**: Local JSON file storage (`server/src/data/db.json`)

## Prerequisites

- Node.js 18+
- npm 9+

## Setup & Running

1. Install dependencies:

```bash
npm run installAll
```

2. Configure environment:

```bash
cp server/.env.example server/.env
```

3. Seed scenario data:

```bash
npm run seed
```

4. Start development server:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000/api

## API Endpoints

### `POST /api/tracer/trace`
Generates step-by-step execution traces from scenario or user code.
- **Body**: `{ "scenarioId": "string", "code": "string (optional)" }`
- **Response**: Returns execution steps, variables per step, stdout, and detected misconceptions.

### `POST /api/tracer/predict`
Checks a learner's answer for a prediction checkpoint.
- **Body**: `{ "checkpoint": object, "selectedIndex": number }`
- **Response**: `{ "isCorrect": boolean, "pedagogicalFeedback": "string", "explanation": "string" }`

### `GET /api/scenarios`
Returns the list of learning scenarios.

### `POST /api/sessions`
Saves a completed learning session with reasoning, abstraction map, code, and tracer metrics.

## Project Structure

```
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       └── styles.css
├── server/
│   ├── package.json
│   ├── src/
│   │   ├── index.js
│   │   ├── seed.js
│   │   ├── data/
│   │   │   ├── store.js
│   │   │   └── roadmap.js
│   │   ├── routes/
│   │   │   ├── tracer.js
│   │   │   ├── scenarios.js
│   │   │   ├── sessions.js
│   │   │   ├── analytics.js
│   │   │   ├── codeReview.js
│   │   │   └── roadmap.js
│   │   └── services/
│   │       ├── tracerEngine.js
│   │       ├── codeEvaluator.js
│   │       └── learningEngine.js
└── readme.md
```
