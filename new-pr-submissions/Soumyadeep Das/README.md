# The Sorcerer's Apprentice

A story-driven browser game that teaches **Python exception handling** through magical experiments.

## How the Game Teaches

You play as an apprentice guided by the Master. For each chapter, the Master assigns an experiment. Explore the tower and nearby grounds, collect the required magical materials, bring them to the chapter's experiment station, and arrange code pieces to build a Python program. Run the experiment, examine the result, and use the Master's explanations to understand what happened. Completing an experiment lets you progress through the story.

The eight chapters introduce exception recognition (`ZeroDivisionError`, `ValueError`, `TypeError`, and `NameError`), `try`/`except`, multiple handlers, `else`, `finally`, `with` and context managers, `raise` and exception propagation, and custom exceptions. Magical warnings, protective circles, spell cleanup, and other story events provide a narrative context for these programming ideas.

## Entry Point

`python-exception-handling-sorcerers-apprentice/index.html`

## Dependencies

- A modern web browser.
- Python 3, only for running the local development server.
- Node.js, only for running the automated tests.

No additional package installation or external Python execution service is required.

## How to Run

From the PyBE repository root, open a terminal and run:

**Windows:**
```powershell
cd "new-pr-submissions/Soumyadeep Das/python-exception-handling-sorcerers-apprentice"
py -m http.server 8000
```

**macOS / Linux:**
```bash
cd "new-pr-submissions/Soumyadeep Das/python-exception-handling-sorcerers-apprentice"
python3 -m http.server 8000
```


Press `Ctrl+C` in the terminal to stop the server.

## Run Tests

From the project folder, run:

```bash
node --test tests/*.test.mjs
```

## Controls

- **Move:** Arrow keys or `W`, `A`, `S`, `D`
- **Interact / collect:** `E`
- **Inspect:** Click an object
- **Release:** `Q`

## Technology and Execution

Built with HTML, CSS, and JavaScript. Experiments are evaluated locally by a built-in JavaScript interpreter for the Python subset used in the lessons. It is an educational simulation, **not a full Python interpreter**, and it does not execute arbitrary Python programs. The game does not require an online Python runtime or external API.