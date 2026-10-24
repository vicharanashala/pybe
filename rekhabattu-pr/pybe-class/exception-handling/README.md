# Mission Control: Save the Space Mission

An interactive beginner case study about Python exception handling. It uses the existing PyBe storybook lesson engine, progress controls, and shared styles from the adjacent Classes lesson without changing that lesson's content or entry point.

## Learning journey

The nine-screen journey introduces the mission and objectives, asks learners to predict a `ValueError`, reveals runtime errors and `try`/`except`, and then guides them through `ValueError`, `ZeroDivisionError`, `else`, `finally`, and `raise`. A final telemetry challenge combines those ideas and reports completion and prediction results.

Code exercises use a deterministic checklist for requested Python constructs. They do not execute learner code or validate full Python syntax.

## Run

Open `index.html` directly in a browser, or start a local server from the parent `pybe-class` folder and open `http://localhost:8765/exception-handling/index.html`:

```powershell
py -m http.server 8765
```

Serving the parent folder keeps the shared engine, renderer, navigation, and design styles from the Classes lesson available at their relative paths.
