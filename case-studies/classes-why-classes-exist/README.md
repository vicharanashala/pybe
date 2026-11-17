# PyBe - Why Classes Exist

PyBe is a small interactive lesson that teaches why classes exist in Python through a guided sequence of screens. The experience starts with concrete examples, slows the learner down with matching and reveal steps, and then moves into the need for a reusable student format and a first `class` definition.

## What is in this repo

- `index.html` - main entry point for the lesson
- `js/lessonData.js` - screen content and lesson flow
- `js/renderer.js` - turns lesson data into the visible screens
- `js/navigation.js` - handles progress and next/back navigation
- `js/lessonEngine.js` - stores learner state and completion
- `css/` - styling for the storybook layout and lesson cards
- `test-stack.html` - small test page for stack/layout checks
- `Tulip.jpeg`, `TATA-punch.jpeg`, `Michael.jpeg`, `Student.png` - local assets used on screen 10

## How to run

Open `index.html` in a browser, or serve the folder with any local static server and open the page from there.

## Notes

- The lesson is intentionally low-jargon and paced as a discovery flow.
- Screen 10 uses local images for the right-side matching examples.
- `screen1-after-cannot.png` was removed because it was an unused leftover asset.