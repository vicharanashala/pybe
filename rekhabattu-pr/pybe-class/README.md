# PyBe Interactive Case Studies

This folder contains standalone PyBe storybook lessons that share the lesson engine, renderer, navigation, and design system.

## Classes lesson

The root `index.html` teaches why classes exist in Python through a guided sequence of screens. It starts with concrete examples, slows the learner down with matching and reveal steps, and then moves into the need for a reusable student format and a first `class` definition.

## Exception Handling case study

The `exception-handling/` folder contains **Mission Control: Save the Space Mission**, a data-driven case study about Python exception handling. Its entry point and lesson data are separate from the Classes lesson; it reuses the shared engine and navigation and adds its lesson-specific renderers to `js/renderer.js`.

## What is in this repo

- `index.html` - Classes lesson entry point
- `js/lessonData.js` - Classes screen content and lesson flow
- `js/renderer.js` - shared renderers for both lessons
- `js/navigation.js` - handles progress and next/back navigation
- `js/lessonEngine.js` - stores learner state and completion
- `css/` - styling for the storybook layout and lesson cards
- `exception-handling/index.html` - Exception Handling lesson entry point
- `exception-handling/js/lessonData.js` - Exception Handling content and flow
- `exception-handling/css/exception.css` - Exception Handling-specific styling
- `test-stack.html` - small test page for stack/layout checks
- `Tulip.jpeg`, `TATA-punch.jpeg`, `Michael.jpeg`, `Student.png` - local assets used on screen 10

## How to run

Open either lesson's `index.html` in a browser, or serve this folder with a local static server. For example, open `http://localhost:8765/` for Classes or `http://localhost:8765/exception-handling/` for Exception Handling:

```powershell
py -m http.server 8765
```

## Notes

- The lesson is intentionally low-jargon and paced as a discovery flow.
- Screen 10 uses local images for the right-side matching examples.
- `screen1-after-cannot.png` was removed because it was an unused leftover asset.