# NovaTech Investor Room (PyBe)

An interactive React + Express case study that teaches Matplotlib through a fictional investor pitch.
Your manager asks you to present NovaTech. For each investor question you pick the chart that answers it.
A wrong chart breaks the deal. A right chart shows the real Matplotlib code behind it.

## Run it

```bash
npm install
npm run install:all
npm run dev            # client http://localhost:5173, API http://localhost:4000
```

One-port production mode: `npm run build && npm start` (API + built client on http://localhost:4000).
Tests: `npm test` (the "built client" test is skipped until you run `npm run build`).

## Structure

- `shared/` is the single source of truth: `caseStudy.json` (data), `plots.json` (questions and explanations),
  `quiz.json`, and `code/*.py` (runnable Matplotlib snippets). The API and the React app both read it.
- `client/src/components/scenes` full-screen steps (intro, meeting, table, plot challenge, quiz, outcomes, completion).
- `client/src/components/ui` small reusable pieces (top bar, room image, plot canvas, code panel).
- `client/src/data/story.js` holds game settings.
- `client/src/images/charts` 36 real Matplotlib images: every question drawn with every chart type.
- `server/src` small modular Express API.
- `tools/build_assets.py` regenerates the code snippets and chart images from `shared/*.json`
  (`pip install -r tools/requirements.txt` first).

## Game settings

`client/src/data/story.js`: `MAX_MISTAKES = 1` is the original rule (one wrong chart ends the deal).
Set it to 2 or 3 for a gentler "investor patience" mode.

## Extending

1. Add the dataset to `shared/caseStudy.json` under `datasets.<id>` and the question to `shared/plots.json`.
2. Add a snippet template and wrong-chart rule in `tools/build_assets.py`, then `npm run assets`.
3. `npm test` checks that data, images, code and quiz stay consistent.

Rule of thumb for new questions: only ONE chart type should answer the question well. If two could,
rewrite the question or change the data until it is unambiguous.
