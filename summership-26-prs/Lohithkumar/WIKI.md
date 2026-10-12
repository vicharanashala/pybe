# Developer Wiki: The Royal Decoder Engine

## Project Structure
- `index.html`: The cinematic entry point.
- `style.css`: Premium "dark cryptography" CSS system utilizing CSS variables, glassmorphism (`backdrop-filter`), and CSS animations (curtains, pulsing, glowing).
- `script.js`: The core Vanilla JS game engine.
- `data/scenes.js`: The state-machine data defining the narrative flow.

## The Decoder UI System
Unlike the Ledger from previous iterations, the Decoder panel (`#decoder-panel`) specifically tracks `state.messageState`.
When a correct terminal command is entered, the engine:
1. Updates `state.messageState` to the `scene.newMessageState`.
2. Triggers `renderDecoder(true)`, applying a CSS `.success-flash` class for 1.5 seconds.
3. Once `scene.fullyDecoded` is true, a permanent glowing neon-green `.decoded` class is applied to signify mission success.

## Terminal Validation System
The custom terminal uses Regular Expressions to validate python syntax without running a heavy python interpreter.

Example from `scenes.js`:
```json
"terminalPrompt": "Use .replace() to swap 'z' with 'a'...",
"expectedPattern": "^msg\\s*=\\s*msg\\.replace\\(\\s*['\"]z['\"]\\s*,\\s*['\"]a['\"]\\s*\\)$"
```
This regex handles:
- Variable whitespace `\s*`
- Single or double quotes `['"]`
- Missing re-assignment (if they just type `msg.replace(...)`, it fails the regex and triggers a hint).

We also handle complex chained patterns like list `.join()` operations:
```json
"expectedPattern": "^msg\\s*=\\s*['\"]\\s*-\\s*['\"]\\.join\\(\\s*msg_list\\s*\\)$"
```
This ensures the learner properly structures their glue string (`' - '`) and passes the list parameter into the method correctly.
