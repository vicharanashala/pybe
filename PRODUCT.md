# Learning Streak — Feature Summary

## What it does

Adds a learning streak to the PyBe dashboard. The dashboard now shows how
many consecutive days a learner has completed at least one scenario
session, plus their best (longest) streak ever — a small 🔥 badge sitting
alongside the existing Scenarios / Sessions / Prompt score stats.

## Why

PyBe has no login or persistent user accounts — progress lives entirely
in local session history. A streak is a lightweight way to encourage
regular practice without needing to add authentication or a database.

## How it works

- **`computeStreak(sessionDates, todayDateString)`** — a pure function in
  `server/src/services/streak.js` that takes the list of session
  timestamps already stored in `db.json` and derives:
  - `current` — the active streak right now
  - `longest` — the best streak ever recorded
  - `lastActiveDate` — the most recent day with a session
- No new fields were added to `db.json`. The streak is calculated on the
  fly from existing session history every time `/api/analytics` is
  called, so there's nothing new to keep in sync.
- The `/api/analytics` endpoint now includes a `streak` object in its
  response.
- The dashboard (`client/src/main.jsx`) displays it as a fourth stat card
  next to the existing three.

## Testing

- 6 unit tests in `server/src/services/__tests__/streak.test.js`,
  run via `npm test` (Node's built-in test runner, no new dependency):
  - no sessions yet
  - first-ever session
  - multiple sessions on the same day (should not double-count)
  - consecutive days (streak increments)
  - a gap day (current streak resets, longest is preserved)
  - last active yesterday (streak still considered "alive")
- Manually verified end-to-end: submitted a real scenario session in the
  running app and confirmed the dashboard correctly showed a 1-day streak.

## Files changed

- `server/src/services/streak.js` — new
- `server/src/services/__tests__/streak.test.js` — new
- `server/src/routes/analytics.js` — modified (added streak to response)
- `client/src/main.jsx` — modified (added streak badge)
- `server/package.json` — modified (added `test` script)