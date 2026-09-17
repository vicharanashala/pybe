<h1 align="center">📮 The Postman's Route</h1>

<p align="center">
  <strong>A story-driven learning module for the PyBe platform.</strong><br/>
  <em>Teaches Python exception handling (try / except / finally / raise) through the daily route of a postman who has a specific plan for every specific problem.</em>
</p>

---

## Overview

**The Postman's Route** is a standalone, story-driven learning feature built for PyBe. It teaches Python's exception-handling model — `try`, multiple `except` blocks, `finally`, and `raise` — by walking the learner through six stops on a postman's real delivery day, each stop introducing exactly one new piece of the pattern before showing the matching Python code.

No backend. No accounts. Progress within a session lives in the page itself — no database, no external dependencies, nothing to configure. Open `index.html` and it runs.

## Why this concept, why this story

At the time this module was scoped, PyBe's built-in scenario library already covers loops, conditionals, lists, strings, sets, dictionaries, functions, and several other foundational concepts (confirmed by inspecting `server/src/data/db.json`'s seeded `concepts` fields). Exception handling was not represented there, and a review of existing intern submissions under `summership-26-prs/` did not find another module covering it — this fills a genuine gap rather than duplicating existing coverage.

The postman narrative was chosen because exception handling has a very natural one-to-one mapping to a real, familiar routine:
- A **normal delivery** is the code path you hope for every time (`try`).
- A **locked gate** is a specific, anticipated problem with a specific, ready response (`except GateLockedError`).
- A **wrong address** is a *different* specific problem needing a *different* response — motivating multiple `except` blocks rather than one catch-all.
- Writing the **time in the logbook** happens no matter what else happened that stop — a clean, intuitive analogy for `finally`.
- An **unreadable address** is something the postman deliberately refuses to guess at, and instead flags outward — the same instinct behind `raise`.

## Learner Journey

```
Stop 0  Title / framing            — meet the story, name the concept
Stop 1  Ordinary delivery          — the "try" happy path
Stop 2  Locked gate                — one named except, gated behind a check-in quiz
Stop 3  Wrong address              — a second except, contrasted against the first
Stop 4  The logbook                — finally, gated behind a check-in quiz
Stop 5  Unreadable address         — raise
Stop 6  Full pattern + assessment  — complete code, 3-question quiz, completion state
```

Two stops (2 and 4) gate their code reveal behind a short inline quiz question — the learner has to reason about *why* the mechanism exists before seeing the syntax, rather than being handed code with no context. This mirrors PyBe's own stated philosophy of computational thinking before syntax.

## Tech Stack

- Plain **HTML / CSS / JavaScript** — no build step, no framework, no npm install required to run it.
- Google Fonts (Fraunces for display type, Inter for body, JetBrains Mono for code) — loaded via CDN link tags; degrades gracefully to system fonts if offline.
- All interaction (stage navigation, quiz gating, progress trail, restart) is handled in a single `js/story.js` file, under 100 lines.

## How to Run

No installation needed — this is fully static.

```
Open index.html directly in any browser
```

or, to serve it locally (avoids any browser file:// restrictions):

```
cd postman-exceptions
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
postman-exceptions/
├── index.html       # all 7 stages (0–6), markup and copy
├── css/
│   └── style.css    # postal-themed design tokens and layout
├── js/
│   └── story.js     # stage navigation, quiz gating, progress trail
└── product.md        # this document
```

## Design Notes

- **Color & type**: kraft-paper cream background, deep postal-red accent (stamps, progress trail, stop badges), ink-navy text, sage green reserved for correct-answer feedback. Display type is a serif (Fraunces) for story beats; code and technical labels use a monospace face (JetBrains Mono) to read like an actual logbook entry.
- **Numbered stops** are a deliberate structural choice, not decoration — they mirror the literal order of stops on a real delivery route, so the numbering carries real sequence information.
- **Gating mechanic**: the two most conceptually important stops (the first `except`, and `finally`) lock their code reveal until the learner answers a short check-in question correctly, encouraging active reasoning over passive scrolling.
- **Accessibility**: `prefers-reduced-motion` is respected (animations disabled), and all interactive elements are native `<button>` elements reachable by keyboard.

## What I'd Extend Next

- A visual "route map" showing all 6 stops as pins, letting a learner jump back to review any stop instead of only moving forward.
- A short "write your own except" free-text stage, where the learner types a plan for a made-up seventh problem, checked against a simple keyword rubric rather than multiple choice.
- Persisting progress in `localStorage` so a learner who reloads mid-route doesn't lose their place (currently, refreshing resets to Stop 0 by design, since there's no backend).

---

<p align="center">
  <strong>Part of the PyBe Platform — Python, By Experience</strong>
</p>
