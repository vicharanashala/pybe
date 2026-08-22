# Feature: Bookmarks / Save for Later

## What it does
Lets learners mark scenarios from the Scenario Browser as "saved" so they can
find them again later without re-searching or re-filtering. A new "Saved"
tab in the sidebar shows only bookmarked scenarios.

## Why
PyBe has 30+ scenarios spanning multiple difficulty levels and concepts.
As a learner explores, they often find scenarios they want to revisit later
(e.g. to retry after learning a new concept) but have no way to keep track
of them without manually remembering titles. Bookmarks solves this with a
lightweight, one-click way to build a personal shortlist.

## How it works

### Backend
- Added a `bookmarks` collection to `server/src/data/db.json`, alongside the
  existing `scenarios` and `sessions` collections.
- Added `listBookmarks`, `addBookmark`, and `removeBookmark` functions to
  `server/src/data/store.js`, following the same `createRecord`-based pattern
  used for scenarios and sessions.
- Added a new route file `server/src/routes/bookmarks.js` with three
  endpoints:
  - `GET /api/bookmarks` — list all bookmarks, each with the full scenario
    object populated (so the frontend doesn't need a second lookup)
  - `POST /api/bookmarks` — bookmark a scenario by `scenarioId`
  - `DELETE /api/bookmarks/:id` — remove a bookmark
- Since PyBe has no authentication/login system, bookmarks are stored
  globally rather than per-user — consistent with how the rest of the
  prototype works.

### Frontend
- Added a small bookmark icon to each scenario card in the sidebar list
  (using the existing `lucide-react` icon set already used elsewhere in the
  app, for visual consistency).
- Clicking the icon toggles the bookmark via the new API endpoints, without
  selecting that scenario (click event is isolated with `stopPropagation`).
- Added a "Browse" / "Saved (N)" tab toggle above the scenario list. Since
  the app has no client-side router, this reuses the existing pattern of
  driving the UI from local component state rather than introducing a new
  dependency like `react-router`.
- The Saved tab filters the same scenario list down to only bookmarked
  items, and shows a friendly empty state if nothing is saved yet.

## Testing performed
- Verified all three API endpoints directly via `curl` (POST returns 201
  with the new bookmark, GET returns the populated list, DELETE returns 204).
- Verified in-browser: bookmarking a scenario updates the "Saved" count and
  icon immediately.
- Verified persistence: bookmarked a scenario, hard-refreshed the browser,
  and confirmed it was still bookmarked — confirming data is written to and
  read from `db.json` correctly rather than only held in memory.
- Verified the Saved tab correctly filters to show only bookmarked
  scenarios.

## Files changed
- `server/src/data/store.js`
- `server/src/routes/bookmarks.js` (new)
- `server/src/index.js`
- `client/src/main.jsx`
- `client/src/styles.css`