# PyBe Py-Betaal Tales - Wiki

## What is Py-Betaal Tales?

Py-Betaal Tales is a story-driven learning module for the PyBe platform that teaches foundational Python concepts (variables, conditionals, loops, lists, functions) through Panchatantra and Jataka fables. Instead of starting with syntax, the learner experiences a short story, answers a riddle posed by the spirit Betaal, discovers the computational idea hidden inside the tale, and immediately practices by writing real Python that runs in the browser.

## Key purpose

The module demonstrates the PyBe philosophy of **computational thinking before programming syntax**:

- Learners reason about a familiar story first, so the programming concept feels natural and memorable.
- Betaal acts as a Socratic questioner - each riddle requires thinking, not recall.
- Every concept is practiced immediately with hands-on, runnable Python.
- Visible progress (XP, story map, badges) keeps learners motivated through short micro-lessons.

## Main features

- Story-first learning flow: **Story → Riddle → Concept → Micro-lesson → Practice → Project → Progress**
- In-browser Python execution via Pyodide with deterministic, rule-based validation (no AI keys, fully local)
- Five complete fable modules covering foundational Python concepts
- Persistent progress: XP, per-story completion, and four badges
- Responsive, accessible, storybook-styled interface built with plain CSS

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18 + Vite |
| Python execution | Pyodide (in-browser, CDN-loaded) |
| Backend | Node.js + Express |
| Data storage | Local JSON files (`server/src/data/db.json`) |
| Styling | Plain CSS (no UI framework) |
| Validation | Deterministic rule-based checks |

## Getting started

### Prerequisites

- Node.js 18+

### Setup

```bash
npm run installAll
npm run seed
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000/api

## How it works

- The React client loads the five stories from the Express API (`/api/stories`) and session records from `/api/sessions`.
- The `StoryPlayer` component walks the learner through the seven learning stages.
- At the practice and project stages, the client loads Pyodide (once, cached for the session) and runs the learner's code in the browser. A deterministic checker compares the output or evaluates a small check snippet to decide pass/fail.
- On success, the client posts a session record to `/api/sessions` with the XP earned. Progress, badges and the story map are derived from these records.

## Project structure

```text
client/src/
├── main.jsx                 # App shell: loads data, records sessions
├── styles.css               # Storybook theme, responsive + accessible
├── hooks/usePyodide.js      # Pyodide singleton loader
├── lib/progress.js          # runPython, check evaluation, XP/badge derivation
└── components/
    ├── StoryMap.jsx         # Home: story grid, XP, badges, progress bar
    ├── StoryPlayer.jsx      # The 7-step learning flow with stepper
    ├── BetaalRiddle.jsx     # Riddle with first-try detection and feedback
    └── CodeLab.jsx          # Hands-on Python editor with run/reset/hint

server/src/
├── index.js                 # Express app
├── seed.js                  # Seeds stories.json into db.json
├── data/store.js            # JSON read/write helpers
├── data/stories.json        # Story content (fable, riddle, lesson, checks)
└── routes/
    ├── stories.js           # /api/stories endpoints
    └── sessions.js          # /api/sessions endpoints
```

## Learning content

| Story | Concept | Difficulty | What the learner does |
| --- | --- | --- | --- |
| The Thirsty Crow | Variables | Beginner | Tracks pebbles with variables; builds a water-tank counter |
| The Monkey and the Crocodile | Conditionals | Beginner | Chooses to stay or cross with `if/else`; builds a mango picker |
| The Tortoise and the Hare | Loops | Beginner | Prints laps with `for`; builds a steady-walker `while` loop |
| The Elephant and the Blind Men | Lists | Beginner | Stores views in a list; prints by index |
| The Lion and the Mouse | Functions | Builder | Writes a `gnaw()` helper; builds a rescue function |

## Notes

- The AI-like behavior in this module is deterministic and local - no external keys are required, matching the rest of PyBe. The riddle engine could later be upgraded to a TinyLLM along the V2/V3 roadmap.
- Pyodide is fetched from a CDN on first use; the stories, riddles, lessons and progress work offline, only the code practice needs the download (or an internet connection).
- Progress persists in `server/src/data/db.json`; re-running `npm run seed` resets it.
