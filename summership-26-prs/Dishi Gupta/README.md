# PyBe — Rosewood Manor

PyBe is a scenario-driven Python learning app. This version turns it into a murder-mystery: the learner plays the detective, solves a six-part case by tapping through short slides and multiple-choice questions, and discovers the Python ideas behind each step as the case files close. There is no login and no external database or AI key.

Author: Dishi Gupta (VLED Lab, IIT Ropar, Summer Internship 2026)

## How it plays
1. **Onboarding:** three short screens, then straight into the case.
2. **Case files:** six connected files (the case opens, the notes, the timeline, the alibis, narrowing it down, the reveal). Each is a series of short slides with one question at a time.
3. **No typing:** every step is multiple choice, with instant feedback and a retry on wrong answers. Correct answers are shuffled across A–D.
4. **Plain language:** wording is written for a first-year student with no coding background. Concept names stay hidden until a case file is finished.
5. **Code reveal:** when a file closes, its Python is shown with a plain-words comment on every line.
6. **Suspect Board:** starts as five unnamed slots, reveals each suspect as the story introduces them, re-ranks them as clues arrive, moves cleared suspects to a Cleared drawer, and ends with the culprit at 100/100.
7. **Ledger:** a case notebook that logs the concepts learned after each completed file.

## Features
- Six-part chained case study in a new **Advanced** tier (`storyId`, `order`, `nextScenarioId`), replacing the old standalone scenarios
- Slide-based, multiple-choice-only flow with visuals instead of long text
- Light and dark themes (haunted-mansion dark with lightning, a daylight counterpart in light), onboarding, sidebar case navigation, and progress saved in `localStorage`
- Suspect Board driven by hand-authored clue events and a pure `computeBoard` function
- Case bible: one source of truth for the victim, suspects, witnesses, clues, times, and rooms, checked by an audit script
- Concept-driven Python code generation, so each case file gets code that matches the idea it taught
- Supplied manor and suspect photos used throughout

## Tech stack
- React + Vite (client)
- Node.js + Express (server)
- Local JSON-file storage, no database or authentication

## Setup
Requires Node.js 18+.

```bash
npm run installAll
cp server/.env.example server/.env
npm run seed
npm run dev
```
- Frontend: http://localhost:5173
- API: http://localhost:5000/api

## Quality checks
Scripts are defined in `client/package.json` and `server/package.json` (run `npm run` in each folder to list them): `audit:text` (text length, plain-language, banned terms), `audit:colors`, `audit:answers` (answer-position spread), `audit:story` (story consistency), `audit:type`, and `smoke`.

## Project structure
- `client/` — React app (slides, Suspect Board, ledger, themes)
- `server/` — Express API, seed data, case data, learning engine
- `server/src/data/` — JSON storage and case data
- `server/src/services/learningEngine.js` — concept-driven code generation

## Notes
Progress and theme live in the browser's `localStorage`, so they don't sync across devices. All learning logic is deterministic and local, with no external AI calls.