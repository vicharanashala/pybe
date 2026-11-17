# Khul Ja Sim Sim — Private vs Public Members, Told as a Story

A small, story-driven interactive demo that teaches one core programming
idea — **Private vs Public members (data hiding)** — through the classic
tale of Ali Baba and the sealed treasure cave.

Built as a scoped-down, story-first redesign of a larger "Encapsulate"
learning project, based on feedback that the concept should be smaller,
grounded in a real-world/familiar story, and visually rich like a
storybook — rather than a full course covering all of encapsulation with
an abstract sci-fi metaphor.

## What it teaches

One concept only: the difference between **private** data (hidden inside
a system) and **public** methods (the one approved way to interact with
it) — using the cave (private treasure) and the phrase "Khul Ja Sim Sim"
(the public way in) as the story's core metaphor.

## How the experience flows

1. **Cover screen** — sets the scene, "Begin" to start
2. **The Cave** — introduces the sealed cave and its treasure
3. **The Before** — shows what happens when nothing is protected
4. **The Sealed Door** *(interactive)* — try forcing the door open (fails)
   vs. saying "Khul Ja Sim Sim" (works)
5. **Inside the Cave** — the concept is named: Private vs Public members
6. **Now You Design It** *(interactive)* — drag the story's own elements
   into Private / Public zones yourself
7. **The Class Takes Shape** — your choices become a simple diagram
8. **The Code** *(three paced pages)* — the same design revealed as real
   Python, one small piece at a time, narrated by a small in-story
   character
9. **Closing** — wraps the story and ties it to a real-world example

This follows a **discovery-based learning** approach throughout: the
learner experiences the problem, tries something themselves, and only
receives the concept's name after they've already understood it through
experience.

## Tech stack

- Vite
- Vanilla JavaScript (ES modules)
- Vanilla CSS
- Web Audio API (procedurally generated sound — no external audio files)
- Native HTML5 Drag and Drop API (no external drag-and-drop library)

No frameworks, no external animation or Python-execution libraries —
kept deliberately minimal for the scope of this demo.

## Project structure

```
khul-ja-sim-sim/
├── index.html
├── style.css
├── src/
│   ├── main.js           # entry point
│   ├── scenes.js         # all page/scene content and data
│   ├── SceneManager.js   # navigation, transitions, page logic
│   └── SoundManager.js   # procedural audio (Web Audio API)
├── assets/
│   └── images/           # story illustrations (AI-generated, 8 scenes)
├── CHANGES.md            # detailed change log and rationale
└── README.md             # this file
```

## Running it locally

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal (typically
`http://localhost:5173/`).

## Notes for reviewers

- All narrative text, story choices, and pacing were deliberately kept
  short — the goal was a small, focused concept, not full course coverage
  of encapsulation.
- See `Walkthrough.md` for the full list of design decisions and how each
  piece of feedback was addressed.
- Accessibility: respects `prefers-reduced-motion` throughout (disables
  page-turn animation, particle effects, and pulse animations in favor
  of instant transitions).
