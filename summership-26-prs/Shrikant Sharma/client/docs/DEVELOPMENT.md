# Development — PyKatha

## Prerequisites

- **Node.js 18+** (Node 20 or newer is recommended)
- npm (bundled with Node)

## Commands

| Command | What it does |
|---|---|
| `npm install` | Installs all dependencies from `package.json`. |
| `npm run dev` | Starts the Vite dev server with HMR. Open the printed URL (usually `http://localhost:5173`). |
| `npm run lint` | Runs ESLint (flat config `eslint.config.js`) over all `js`/`jsx` files, excluding `dist`. |
| `npm run build` | Runs `vite build`, producing a production bundle in `dist/`. |
| `npm run preview` | Serves the production build locally so you can verify `dist/` behaves like the deployed app. |

## Development Workflow

1. **Install once**

   ```bash
   npm install
   ```

2. **Run the dev server** while you work

   ```bash
   npm run dev
   ```

   Vite hot-reloads source changes after any save. Because this is a client-only SPA with `BrowserRouter`, deep links like `/story/rabbit-if` work in dev automatically.

3. **Make your change**

   - Content only? Edit files under `src/stories/<id>/` (pure data — see [STORY_AUTHORING.md](STORY_AUTHORING.md)).
   - UI only? Edit the colocated `PageName.jsx` + `PageName.css`.
   - New route? Never necessary for a new story (only registrations in `StorySelection.jsx`, `StoryReader.jsx`, `Practice.jsx`).

4. **Verify before committing**

   Run the manual QA checklist — it is deliberately a single walk-through:

   ```bash
   npm run lint   # must pass with zero errors
   npm run build  # must complete; watch for warnings
   ```

   Then, in the dev server, walk **one full journey** end-to-end:

   - `/` → the Storybook CTA works.
   - `/stories` → all three cards render with art, concept, and correct links.
   - `/story/rabbit-if` → story loads, scroll progress fills, and, at the bottom of the page, "I'm Ready" leads to the challenge.
   - `/challenge/rabbit-if` → answer all 5 questions (multiple-choice + the fill-in-the-blank word chip); wrong answers show feedback; "Finish" leads to the secret.
   - `/reveal/rabbit-if` → the four reveal steps (story → pattern → logic → code) advance via button **and** Enter key, ending at "Try It Yourself".
   - `/practice/rabbit-if` → pick a wrong option (hint appears), then the correct one (`path_visible`); the story output appears and "Continue" appears.
   - `/moral/rabbit-if` → concept, reflections, and both CTAs render.
   - **Invalid id** check: open `/story/does-not-exist` — it should show the friendly "not written yet" page, not a crash. Repeat for `/challenge`, `/reveal`, `/practice`, `/moral` with a bad id.
   - **Mobile check**: narrow the window to ~375px. Cards stack, navigation wraps, and the fixed decorative frame stays inside the screen.

## Adding a New Story

New stories are **pure data** + three registrations (no page code). Follow [STORY_AUTHORING.md](STORY_AUTHORING.md) exactly, then verify with the checklist there and the manual flow above. Confirm the content-consistency rule: the story's rule, the challenge questions, the reveal, the practice answer, and the moral must all describe the **same** underlying logic (see [CASE_STUDIES.md](CASE_STUDIES.md) for what this looks like for each existing story).

## Modifying Existing Story Content

1. Change the data files under `src/stories/<id>/`.
2. Keep the five modules in agreement — if you change the reveal code, the practice blank and answer **must** change to match, and the moral should still reflect the story.
3. Re-run the QA walk-through for that story (`/story/<id>` → `/challenge/<id>` → `/reveal/<id>` → `/practice/<id>` → `/moral/<id>`).

## What Careful Verification Looks Like

- **The practice answer must actually be the correct condition.** For *Rabbit and the Moon*, the reveal shows `if path_visible: cross()` and the practice blank is `path_visible` — the condition that *gates* the action. Verify the two agree.
- **The challenge and moral never leak Python** into the learner's path until the reveal.
- **Every stage has a missing-state and a loading-state.** Page refreshes mid-flow must render a spinner, and bogus ids must render the "ink is still drying" page.

## Contribution Workflow

Follow this process for any contribution (new story, content fix, UI polish, documentation):

1. **Pull latest changes** — `git pull` (or synchronise your fork) so you start from the current head.
2. **Create a branch** — descriptive name, e.g. `feat/story-fox-grapes`, `fix/practice-rabbit`.
3. **Make your changes** — code, story data, or documentation.
4. **Update `context.md`** — the project's handoff file. Note what changed and why (see the "Keep updated" rule at the top of that file).
5. **Run lint** — `npm run lint` must pass with zero errors.
6. **Run build** — `npm run build` must complete cleanly.
7. **Verify the complete learner flow** — walk one full journey in `npm run dev`, plus the invalid-id and mobile checks.
8. **Commit** — a concise message describing the change (stage only intended files; never commit `node_modules/` or `dist/`).
9. **Push** — push the branch to your remote.
10. **Raise a PR** — reference the issue/decision this addresses; mention in the PR description that `context.md` was updated.

## Testing Navigation

Navigation is pure client-side routing with no guards — every stage is reachable by direct URL, and every page renders a loading state and a missing-state for unknown ids. When testing, deliberately:

- Refresh mid-flow (e.g. directly load `/practice/crow-while`) — should render a spinner then the page.
- Direct-load an unknown id (`/reveal/gibberish`) — should render the friendly missing page, never a crash.
- Click every CTA along a journey: Landing → Stories → Reader → Challenge → Reveal → Practice → Moral, plus the "Back to Story" / "Return to the Storybook" links.

## Build Verification

- `npm run build` must exit 0 and emit `dist/`.
- The build output should include **code-split per-story chunks** (Vite splits each dynamically imported story module), confirming dynamic story loading works for all registered ids.
- `npm run preview` lets you confirm the production build behaves like the deployed app (still needs SPA fallback on the real host — see Troubleshooting).

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| `npm run dev` fails with a Node error | Node version too old; upgrade to Node 20+. |
| Lint reports a React Hook error | You changed a `useEffect` dependency array; re-run `npm run lint` after fixing the deps. |
| A story shows "This story has not been written yet." | The id in the URL doesn't match a folder under `src/stories/`, or the file is missing. |
| New story isn't listed | It wasn't registered in `StorySelection.jsx`, `StoryReader.jsx`, and `Practice.jsx`. |
| Redirect issues on refresh in production | The host must rewrite unknown paths to `index.html` (SPA fallback). This is automatic in Vite dev; document it for your static host. |