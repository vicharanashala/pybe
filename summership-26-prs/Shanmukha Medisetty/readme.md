# Code Practice & Evaluator — PyBe Submission

## The Feature

PyBe asked learners to reason, prompt, and reflect — but never to actually **write Python**. The generated snippet arrived ready-made, so the learner's hands never touched the keyboard as a programmer. The mentors named this gap directly in the review sessions: students should be able to hand-code solutions, not just provide prompts.

This submission adds a **Code Practice step with a deterministic code evaluator**:

1. A **"Your Python attempt"** editor inside the learning session, where the learner translates their own reasoning into real code,
2. A **"Check My Code"** button giving instant, pre-submission feedback — a score (0–100), which expected constructs were found or missing, and beginner-specific syntax warnings, and
3. **Persistent code review** — the attempt and its evaluation are stored with the session, so the learner's actual code sits beside the AI-generated example in every result.

The evaluator is **pure static analysis**: learner code is treated as untrusted text and inspected with pattern rules. It is **never executed** — no `eval`, no subprocess, no sandbox needed. Fully deterministic and local, consistent with PyBe's V0 constraints, and like the rest of the learning engine, a clean seam for an LLM-based reviewer in V2.

## The Philosophies Behind It

**Papert — Constructionism.** Learning happens most powerfully when the learner builds the artifact themselves. Reading a generated snippet is instruction; writing your own is construction. The feature makes the learner the author, and the generated code becomes a comparison point rather than the destination.

**Kolb — Experiential Learning Cycle.** Kolb's cycle has four quadrants: concrete experience, reflective observation, abstract conceptualization, and active experimentation. PyBe already had three — the scenario (experience), the reasoning box (reflection), and the abstraction map (conceptualization). The fourth quadrant was missing. Writing and checking real code **completes the cycle**, which is the specific reason this feature belongs in PyBe rather than being a generic "add an editor" idea.

**Ericsson — Deliberate Practice.** Skill grows fastest from attempts paired with immediate, specific feedback. "Check My Code" is exactly that loop: attempt → targeted feedback ("this scenario usually calls for a for loop — where could it fit?") → revise → re-check, as many times as the learner wants before committing the session.

## How Evaluation Works

For each scenario, the curriculum concepts (e.g. `loops`, `conditionals`) map to expected Python constructs. The evaluator then checks the attempt three ways:

| Dimension | What it checks | Weight |
|---|---|---|
| Construct coverage | Expected constructs present (for/while, if/else, def, lists, dicts, comparisons…) | up to 50 |
| Craftsmanship | Descriptive variable names, comments, meaningful length, printed output | up to 30 |
| Syntax watch | Beginner slips: `=` instead of `==` in conditions, missing colons, Python-2 style `print`, unbalanced brackets | −8 each (max −24) |

Every attempt gets a base of 10 for trying — an empty submission gets encouragement, not a zero-score scolding. Feedback is phrased as questions and nudges, never verdicts, because the evaluator is a learning signal, not a compiler.

## What Changed

```
server/src/services/codeEvaluator.js   NEW — construct detectors, concept mapping,
                                             syntax warnings, scoring (no code execution)
server/src/routes/codeReview.js        NEW — POST /api/code-review (live pre-submission check)
server/src/routes/sessions.js          + learnerCode accepted, evaluated, persisted per session
server/src/index.js                    + mounts /api/code-review
client/src/main.jsx                    + code editor, Check My Code button, live review card,
                                         code review in the session result panel
client/src/styles.css                  + editor and review-card styles
```

### API

`POST /api/code-review` with `{ scenarioId, code }` returns:

```json
{
  "attempted": true,
  "score": 85,
  "constructsFound": ["a for loop", "a comparison"],
  "constructsMissing": [],
  "syntaxWarnings": ["Line 3: looks like a single = inside a condition..."],
  "feedback": ["Found a for loop — that matches this scenario's thinking."]
}
```

`POST /api/sessions` now accepts an optional `learnerCode` field; the stored session gains `learnerCode` and `codeReview`.

## Running It

```bash
npm run installAll   # server + client deps
npm install          # root (concurrently)
cp server/.env.example server/.env
npm run seed
npm run dev
```

- Frontend: http://localhost:5173 · API: http://localhost:5000/api

Pick any scenario, write your reasoning, then try expressing it in the "Your Python attempt" editor. Click **Check My Code** — the feedback updates instantly and you can revise as often as you like. Submit the session and your code review is stored alongside the AI mentor's output.

Try intentionally writing `if x = 5` or dropping a colon: the syntax watch catches the classic beginner slips with a plain-language explanation of each.

## Why This Feature

Most submissions add themed content on top of the same interaction loop. This one changes what the learner *does*: PyBe's loop previously ended at reading generated code, and now it ends with the learner writing their own — the explicit mentor request, and the Kolb quadrant the product was missing.
