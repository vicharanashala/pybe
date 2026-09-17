# PyBe - Py-Betaal Tales

**A story-driven Python learning module for the PyBe platform.**

Py-Betaal Tales teaches foundational Python through Panchatantra and Jataka fables. After each story, the spirit Betaal asks a riddle that forces you to think about the problem *before* you see any code. Solve it, discover the hidden computational idea, take a short micro-lesson, and practice with real Python running inside your browser.

📖 Product spec: [product.md](product.md) · 📚 Wiki: [WIKI.md](WIKI.md)

---

## The learning flow

```
Story (Panchatantra / Jataka fable)
  → Betaal's riddle (reasoning checkpoint)
  → Concept reveal (the hidden idea)
  → Micro-lesson (one concept, three small ideas)
  → Hands-on Python practice (in-browser, instant feedback)
  → Mini-project (a small real-world build)
  → Progress, XP and badges
```

## Five tales, five foundational concepts

| Tale | Hidden idea |
| --- | --- |
| The Thirsty Crow | Variables |
| The Monkey and the Crocodile | Conditionals |
| The Tortoise and the Hare | Loops |
| The Elephant and the Blind Men | Lists |
| The Lion and the Mouse | Functions |

## Tech stack

- **Frontend:** React 18 + Vite, plain CSS (no UI framework)
- **Python execution:** [Pyodide](https://pyodide.org) in the browser - no server-side Python, no API keys
- **Backend:** Express + Node.js, JSON-file storage
- **Validation:** deterministic rule-based checks (output comparison / check snippets), matching PyBe's no-AI-keys philosophy

## Getting started

Prerequisites: Node.js 18+

```bash
npm run installAll   # installs server + client dependencies
npm run seed         # seeds the 5 story modules into server/src/data/db.json
npm run dev          # runs server (http://localhost:5000) and client (http://localhost:5173)
```

Open http://localhost:5173 and begin the first tale.

> **Note:** the in-browser Python engine (Pyodide) downloads once from a CDN on first use. The stories, riddles, lessons and progress all work without it.

## How progress is stored

Progress is stored as session records in `server/src/data/db.json` (created by `npm run seed`; ignored by git). XP and badges are derived deterministically from those records:

- Betaal's riddle solved on first try: **+15 XP**
- Hands-on practice passed: **+60 XP**
- Mini-project passed: **+40 XP**

Badges: **First Tale**, **All Five Tales**, **Riddle Master**, **Code Weaver**.

## Project structure

```text
Namrata Saha/
├── package.json            # root scripts (installAll / dev / seed)
├── client/                 # React + Vite app
│   └── src/
│       ├── main.jsx        # app shell, data loading, session recording
│       ├── styles.css      # storybook theme, responsive, accessible
│       ├── hooks/usePyodide.js
│       ├── lib/progress.js # Pyodide runner, check evaluation, XP/badges
│       └── components/
│           ├── StoryMap.jsx      # story map / home
│           ├── StoryPlayer.jsx   # 7-step learning flow
│           ├── BetaalRiddle.jsx  # riddle + reasoning feedback
│           └── CodeLab.jsx       # hands-on Python practice
└── server/                 # Express API + JSON store
    └── src/
        ├── index.js        # Express app (port 5000)
        ├── seed.js         # seeds stories.json → db.json
        ├── data/
        │   ├── store.js    # JSON read/write helpers
        │   └── stories.json # the 5 story modules (content)
        └── routes/
            ├── stories.js  # GET /api/stories, GET /api/stories/:id
            └── sessions.js # GET/POST /api/sessions
```

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/stories` | List story summaries |
| GET | `/api/stories/:id` | Full story content |
| GET | `/api/sessions` | Recent learning sessions |
| POST | `/api/sessions` | Record a session event (riddle / practice / project) |
| GET | `/api/health` | Health check |

---

*Part of the PyBe platform — Python, By Experience. Submission by Namrata Saha.*
