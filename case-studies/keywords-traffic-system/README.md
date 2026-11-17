# Traffic System — A Story About Rules and Names

This was a project done as a contribution to open-source project at Vicharanashala Internship, IIT Ropar.

This was made completely by AI Agents.
## Overview

This project is a cinematic, story-based introduction to Python keywords and identifiers. It uses a traffic-system analogy: traffic signals have fixed meanings, while new roads can be named by people but must follow naming rules.

The learner first follows an evening traffic story. Only in the final scenes is the connection revealed: fixed traffic signals represent Python's reserved keywords, and road names represent programmer-created identifiers.

## Learning Objectives

This project helps beginners understand:

- Python keywords and why their meanings are reserved.
- Python identifiers and their purpose as programmer-created names.
- Identifier naming constraints, including digits, underscores, spaces, special characters, case sensitivity, and keywords.
- The difference between words with predefined meanings and names created by a programmer.

## How the Story Works

The story progresses through five acts:

1. An evening traffic situation introduces the shared understanding behind traffic signals.
2. A thought experiment changes the meaning of red, showing why fixed meanings must remain protected.
3. A new road needs a name, introducing freedom of naming alongside constraints.
4. A traffic officer summarizes the difference between official meanings and names people create.
5. The final reveal maps the story to Python keywords, identifiers, and identifier rules.

## Features

- 18 sequential story scenes arranged in five acts.
- Scene titles, narration, chapter label, scene counter, and progress bar.
- Forward and back navigation buttons.
- Keyboard navigation with Right Arrow, Space, or Enter to continue, and Left Arrow to go back.
- Automatic return to the first scene after the final scene.
- Crossfading full-screen background images and animated narration transitions.
- Final reveal panels for keyword examples, identifier examples, a Python keyword image, and identifier rules.
- Preloading of scene background images for smoother transitions.

## Technology Used

This is a static front-end project built with:

- HTML5
- CSS3
- Vanilla JavaScript
- Local JPG and PNG image assets
- Google Fonts (Fraunces, Inter, and JetBrains Mono)

No build step, package manager, framework, server, or database is included in the project.

## Project Structure

```text
PyBe Final/
├── index.html
├── style.css
├── script.js
└── assets/
    └── images/
        ├── scene-01.jpg ... scene-18.jpg
        └── keywords.png
```

## How to Run

1. Open `index.html` in a modern web browser.
2. Use **Continue** and **Back**, or the keyboard controls, to move through the story.

Because the project uses only HTML, CSS, JavaScript, and local assets, no installation or npm commands are required. An internet connection is needed only if the linked Google Fonts are to load.

## Story / Scene System

The story data is defined in the `scenes` array in `script.js`. Each scene contains a chapter, title, background filename, and narration text. Final reveal scenes additionally use optional HTML blocks for keyword chips, identifier examples, rules, and the keyword image.

JavaScript renders the current scene, updates the chapter label, scene counter, navigation controls, and progress bar, and switches between two background layers to create a crossfade. It also resets the narration panel scroll position whenever a new scene is shown.

## Assets

All visual assets are stored in `assets/images/`:

- `scene-01.jpg` through `scene-18.jpg` are the scene backgrounds referenced by `script.js`.
- `keywords.png` is displayed in the Python reserved-words reveal scene.

The image base path is defined by the `IMAGE_PATH` constant in `script.js`.

## Customization

- **Story text and Python explanations:** Edit the `text` and optional `html` fields in the `scenes` array in `script.js`.
- **Scene order:** Reorder the objects in the `scenes` array. Navigation and progress automatically adapt to the number of scenes.
- **Background images:** Change a scene's `background` value or replace the corresponding image in `assets/images/`.
- **Keyword content:** Edit the keyword chips and `keywords.png` reference in the final reveal scenes in `script.js`.
- **Identifier examples and rules:** Edit the identifier chips and rule entries in the final reveal scenes in `script.js`.
- **Visual styling:** Edit colors, typography, layout, animations, controls, and panel styling in `style.css`.

## Educational Mapping

| Traffic Story | Python Concept |
| --- | --- |
| Reserved traffic signals | Python keywords |
| Fixed meaning of RED | Predefined meaning of keywords |
| Naming a new road | Python identifiers |
| Road naming rules | Identifier constraints |

## Future Improvements

- Add interactive checks after the reveal scenes.
- Add a visible scene-selection menu or restart control.
- Expand the examples with additional Python keywords and identifier cases.
- Improve accessibility with additional controls and preferences.

## Notes

The project is designed as a story-driven educational experience rather than a conventional tutorial or game.
