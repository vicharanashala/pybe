# PyBe · The Mela Gatekeeper

A concise, 11-screen story lesson about Python **truthy/falsy values** and **short-circuit `and` / `or`**. Built with React, Vite and CSS, following the short scenario-first format of the supplied Dashavatara project.

## Run locally

Install Node.js with npm, extract this project, and open the folder containing `package.json` in VS Code. Run each command separately:

```sh
npm install
npm run dev
```

Open the local URL printed in the terminal (usually http://localhost:5173). On Windows, if PowerShell blocks `npm.ps1`, use `npm.cmd install` and `npm.cmd run dev`, or open a Command Prompt terminal.

Production build:

```sh
npm run build
npm run preview
```

Do not open `index.html` directly: Vite serves and builds the React source.

## The 11 screens

1. **Welcome:** enter the village mela.
2. **The gate:** empty baskets, blank slips, zero, None and False introduce falsy values.
3. **Something:** nonempty values are truthy; compare `0`, `"0"` and `[0]`.
4. **Python:** connect the story to `if basket:` and `bool()`.
5. **The runner:** first useful offer introduces `or`.
6. **OR:** animated first check, skipped/evaluated fallback and actual returned value.
7. **The VIP tent:** ticket and wristband introduce `and`.
8. **AND:** a missing ticket skips a function call; a visual bell shows the effect.
9. **Try it:** follow a name-badge or VIP-entry story one check at a time. Read the everyday result, then optionally reveal the matching Python. The original 14-value lab is in a collapsed optional section.
10. **Quiz:** three questions with immediate explanations, retry and score.
11. **Reflect:** write an explanation, submit locally and receive appreciation.

## Learning rules

- Truthiness is how a value behaves in a condition, not whether it is literally the Boolean `False`.
- `a or b`: return `a` if it is truthy; otherwise evaluate and return `b`.
- `a and b`: return `a` if it is falsy; otherwise evaluate and return `b`.
- Both operators return an operand value. The result can be a string, number, list, None or a Boolean, depending on the inputs.
- In a longer `or` chain, return the first truthy value, or the last value if all are falsy. In an `and` chain, return the first falsy value, or the last value if all are truthy.
- An empty collection is falsy, but `[0]` contains one element and is truthy. Nonempty strings such as `"0"` are truthy. Negative nonzero numbers are truthy.
- The empty-basket analogy illustrates these built-in examples, not all possible custom objects. Classes can customize truth testing.

The interactive examples are **visual simulations**, not a Python interpreter. They use an explicit catalogue of Python truth values, not JavaScript truthiness. They do not execute user-entered code. The bell is visual, with no audio.

Reference: https://docs.python.org/3/library/stdtypes.html#truth-value-testing

## Reflection storage

On Submit, the reflection, timestamp and current quiz answers/score are stored under `pybe-mela-reflection-v1` in `localStorage`. Reopening the same origin in the same browser restores the saved reflection. Edited text must be submitted again. This is browser storage, not a server submission or mentor submission. Clearing site data removes it. Different browsers, ports or deployed URLs have separate storage. Storage errors are shown without claiming the answer was saved.

## Accessibility and layout

Responsive desktop/mobile layout, readable text, keyboard-accessible controls, visible focus styles, labelled inputs, text descriptions for animation states, status announcements and reduced-motion support. No external fonts or image downloads are required.

## Tests

```sh
npm test
```

The semantics tests require Python 3 available as `python3` and Node.js. Python is only needed for these verification tests, not to run the app. The tests compare all 14 truth values and all 392 operator combinations with actual Python, including the returned type and whether the second expression is evaluated.

## Files

- `src/main.jsx`: 11 scenes, animations, quiz and reflection form.
- `src/semantics.js`: supported values, operator rules and quiz questions.
- `src/styles.css`: original mela illustration, responsive styles and motion.
- `tests/semantics.test.js`: Python cross-checks.
- `CONTRIBUTION_NOTES.md`: scope and review notes.

This is a separate project. No GitHub PR, deployment or claim that this topic is absent from the current upstream repository is included.

## Simpler stage 9

Stage 9 now starts with familiar situations rather than Python symbols. Choose a blank or filled name slip, or set up a ticket and wristband. Click **Start with the first check**, then **What happens next?**. The result is explained in everyday language. Only then does **Show the Python** reveal a word-to-code mapping and one expression. Changing a choice resets the checks and hides the code. There are no automatic timers. The full lab remains optional.
