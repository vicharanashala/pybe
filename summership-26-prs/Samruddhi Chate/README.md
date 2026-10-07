# Help Mia Run the Smart Parking Gate

A small illustrated story that teaches **Python functions** — built with
React + Vite, no backend, no database, no external API.

## The idea

This isn't a course or a dashboard. It's one continuous story, told one
scene at a time: a picture, a line or two of narration, and a single next
step. The learner watches Mia turn a repeated manual process into a
reusable Python function, discovering each idea through the story before
ever seeing it named:

**function → definition → call → parameter → argument → return value**

The story ends with a small working simulation where the learner checks a
car themselves, using the same `verify_car()` function built throughout.

## Tech stack

- React 18 + Vite 5
- Plain CSS (custom properties, no framework)
- No backend, no database, no auth, no external API
- No Python runtime — `verify_car()`'s behavior is mirrored safely in
  JavaScript (`src/data/vehicles.js`)

## Getting started

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

Production build:

```bash
npm run build
npm run preview
```

## Project structure

```
mia-smart-parking-gate/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx                 # React entry point
    ├── App.jsx                  # Steps through the story's scenes
    ├── components/
    │   ├── Scene.jsx             # The one illustration: sun, gate, Mia, car
    │   ├── CodeCard.jsx          # Code shown as a story object, not an IDE
    │   ├── ChoiceCard.jsx        # The handful of short knowledge checks
    │   ├── FlowSteps.jsx         # Vertical "what's happening" animation
    │   ├── VehicleButtons.jsx    # Pick-a-plate buttons
    │   └── ProgressDots.jsx      # Small ● ● ● ○ ○ ○ indicator
    ├── data/
    │   └── vehicles.js           # Sample plates + verify_car() simulation
    ├── scenes/
    │   ├── StartScene.jsx        # Cover
    │   ├── Scene1Problem.jsx     # The repetition problem
    │   ├── Scene2Idea.jsx        # Mia's idea → function
    │   ├── Scene3Call.jsx        # Calling the function
    │   ├── Scene4Parameter.jsx   # Parameter
    │   ├── Scene5Argument.jsx    # Argument
    │   ├── Scene6Return.jsx      # Return value (the main lesson)
    │   ├── FinalScene.jsx        # The learner checks a car themselves
    │   └── CompletionScene.jsx   # Closing scene
    └── styles/
        ├── global.css            # Warm storybook palette, type, layout
        └── components.css        # Scene illustration, code card, etc.
```

## Design notes

- Every screen shows one scene, one short line or two, and one action —
  no sidebars, no dashboards, no multi-panel layouts.
- Six small progress dots appear only during the six core scenes.
- Only four knowledge checks exist in the whole story; everything else is
  taught by watching the scene animate.
- Motion respects `prefers-reduced-motion`; feedback always pairs an icon
  with text, never color alone.
