# Story-Based Lesson Module — Adder

A single story-based Python lesson ("Adder", teaching the concept of a
function) integrated into PyBe's existing client, alongside — not
replacing — the existing AI Mentor scenario UI.

**Status:** Implemented and reachable from the running application.
Click "Try: Story-based lesson (beta)" in the sidebar; "Back to PyBe"
returns to the mentor UI. See Version 0.5 in
[`version-history.md`](./version-history.md) for the integration
details and verification.

## What this is, in one paragraph

Rather than opening with Python syntax, the lesson tells a short story
(Riya can't add two numbers; Adder, a dragon who can, offers to help),
checks the learner's comprehension with questions, leads them to
articulate the underlying concept themselves (something that needs
input, does one job, returns output, and can be reused), then — only
at that point — introduces the one line of Python that expresses it
(`adder(2, 3)`), and closes with a summary. Five screens, one lesson,
plain JavaScript and CSS, no new frameworks.

## Documentation in this folder

| Document | What it covers |
|---|---|
| [`formal-specification.md`](./formal-specification.md) | Objective, educational goal, inputs/outputs, learner flow, assumptions, and constraints. Start here to understand *what* this is and *why* it's built this way. |
| [`system-design.md`](./system-design.md) | Folder structure, what each file is responsible for, and how they interact — including a component interaction diagram and the exact impact on existing code. Start here to understand *how* it's built. |
| [`version-history.md`](./version-history.md) | Every version (0.1–0.6) in order: what was added, why, its limitations at the time, and the testing performed for it. Start here to see *how it was built, incrementally*, and what was verified at each step. |
| [`error-catalogue.md`](./error-catalogue.md) | Every centralized error code this module can raise: description, likely cause, and recovery step. Start here if you hit an error, or before adding a new one. |
| [`release-checklist.md`](./release-checklist.md) | The final pre-submission checklist for this PR. |

## Where the code lives

```
client/src/lessons/
  AdderLesson.jsx          Orchestrator — decides which screen is active.
  errors/                  Centralized error codes, messages, and factory.
  content/                 Adder's story/questions/discovery/code content.
  components/              Shared presentational pieces (button, option, code block).
  screens/                 The five lesson screens.
```
Full responsibility breakdown in `system-design.md`.

## Running it

```
npm run installAll   # from the repository root
npm run seed          # from the repository root
npm run dev           # from the repository root — starts server + client
```
Open the client in a browser and look for "Try: Story-based lesson
(beta)" in the sidebar.

## What this PR deliberately does not include

Scoped out to keep this submission small and reviewable — not
oversights. Each is a reasonable next step for a future PR, once this
one has been reviewed:

- **Thirsty Crow and Crane and Fish** — the other two lessons mentioned
  in `../essential-docs.md`'s original proposal. Only Adder is
  implemented here.
- **TypeScript, Tailwind, `react-router-dom`** — none were needed to
  ship one lesson; see `formal-specification.md`'s Constraints section
  for the reasoning.
- **An "Interactive Simulation" stage** separate from the Python step,
  and a lesson-picker home screen** — the educational point is already
  made without them for a single lesson.

## Terminology used consistently across these documents

- **Learner** — the person using the lesson (never "user" or "student").
- **Screen** — one of the five lesson stages (never "page" or "step" —
  "step" is reserved for the single interaction inside the Python
  screen).
- **Content** — the authored data in `content/adderContent.js` (never
  "data" alone, to avoid confusion with component state).
- **Lesson orchestrator** / **orchestrator** — `AdderLesson.jsx`,
  interchangeably; never "lesson engine" or "framework," terms
  reserved for the multi-lesson system a future PR might build.
