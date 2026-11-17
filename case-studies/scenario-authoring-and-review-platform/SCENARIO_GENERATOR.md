# Scenario Generator — architecture reference

## Routes (all under `/api/scenario-gen`, all require header `x-admin-token`)

| Method | Path | Purpose |
|---|---|---|
| GET | `/config` | Masked provider config + active provider |
| PUT | `/config/active-provider` | Body `{ provider }` — switch active provider |
| PUT | `/config/providers/:name` | Body `{ apiKey?, model?, baseUrl? }` — update one provider |
| POST | `/generate` | Body `{ concept, hookWord?, avoidList?, previousBeat? }` — runs the pipeline, returns a draft |
| GET | `/drafts?status=` | List drafts, optionally filtered |
| GET | `/drafts/:id` | One draft |
| PUT | `/drafts/:id` | Body `{ content }` — edit a draft before approving |
| POST | `/drafts/:id/approve` | Publishes into `generatedContent.json` |
| POST | `/drafts/:id/reject` | Body `{ note? }` |
| GET | `/published` | Returns `generatedContent.json` as-is — backs the mentor client's "Published" tab |

## Files

- `services/scenarioSystemPrompt.js` — fixed rulebook (system prompt) + `buildPartAUserMessage()`/`buildPartBUserMessage()` for the variable per-call part
- `services/providers/*.js` — one file per provider, uniform `callProvider({ apiKey, model, baseUrl, systemPrompt, userMessage }) -> Promise<string>`
- `services/aiConfigStore.js` — reads/writes `data/aiConfig.json`, masks keys before they leave the server
- `middleware/requireAdminToken.js` — compares header `x-admin-token` against `process.env.MENTOR_ADMIN_TOKEN`
- `services/scenarioValidator.js` — parses the model's JSON, checks it against the rules; exposes `validatePartA`, `validatePartB` (one call's output), and `validateScenarioDraft` (a complete merged case study), sharing the same per-field checks
- `services/scenarioPipeline.js` — `generateCaseStudy()`: runs Part A then Part B as two separate provider calls, each with its own 3-attempt retry loop, merges the results, runs a final full validation pass. Shared by both routes below.
- `services/draftStore.js` — CRUD over `data/scenarioDrafts.json`
- `services/scenarioContentStore.js` — appends an approved draft into `data/generatedContent.json` as the next level of its topic
- `routes/scenarioGenerator.js` — wires all of the above together; `/generate` is now a thin wrapper around `scenarioPipeline.generateCaseStudy()`

## Case study output shape (five-stage arc)

Every generated case study follows the same five-beat structure, enforced by both the system prompt's rules and `scenarioValidator.js`'s checks:

| Stage | Name | What it is | Python name allowed? |
|---|---|---|---|
| `stage1` | Observe | Raw pattern/data from the scenario + a `guidingQuestion` — no options, no answer yet | No |
| `stage2` | Interpret | Plain-English multiple choice (`attempt1`), same shape as the old single stage1 | No |
| `stage3` | Concept idea | The general computational idea in plain language (`conceptIdea`) — the bridge from story to syntax | No |
| `stage4` | Syntax | `conceptReveal` (the only field where the Python term may appear) + a code-build exercise (`codeTemplate`/`tokens`) | Yes, here only |
| `stage5` | Practice | A second, smaller code-build task (`practicePrompt`/`practiceTemplate`/`practiceTokens`) with the same characters but different data — applies the concept independently, never repeats stage4's exact fragments | N/A |

Plus a top-level `scaleReflection` — a single question posed to the learner after stage5, tying back to the "why this matters at 200, not just 5" rule already required of every scenario.

This replaced an earlier three-stage shape (problem → reveal → code) that collapsed "the general idea," "the Python name," and "practice" into one moment.

## Two-call generation pipeline (`scenarioPipeline.js`)

The five-stage arc is written across two separate provider calls instead of one:

- **Part A** — `concept`, `theory`, `levelTitle`, `designNote`, `scenario`, `stage1`, `stage2`, `stage3`. No Python term anywhere.
- **Part B** — `stage4`, `stage5`, `scaleReflection`, generated with Part A's already-validated result handed back as fixed context so the model continues the same characters/scenario rather than starting fresh.

This exists because a single call asking for the full arc regularly got truncated by gateway timeouts on slower/proxied providers (MiniMax via a third-party gateway, specifically) — the response would be cut off mid-JSON before finishing. Splitting the work roughly halves what any one call has to produce. It also happens to land exactly on the existing reveal-order rule: Part A ends right where "no Python term yet" ends, Part B starts right where it's allowed.

Each phase has its own 3-attempt retry loop (`MAX_ATTEMPTS_PER_PHASE` in `scenarioPipeline.js`) — a failed Part A retries Part A only, without wasting a Part B call; a failed Part B retries Part B only, without redoing Part A's already-successful work. Retry feedback is validator issues on a content failure, or the raw error message on a transport failure (timeout, truncated body, non-2xx status) — there's nothing else to critique in that case. After both phases succeed, the merged result gets one final pass through `validateScenarioDraft()` (the same full check the mentor's edit-a-draft flow uses) to catch cross-part issues like stage5 duplicating stage4. `attempts` on the resulting draft is the total across both phases.

## Mentor client

Two-file addition: `client/mentor.html` is a second Vite entry point alongside the existing `client/index.html`, so the learner app at `/` is untouched. `client/src/mentor/MentorApp.jsx` holds the admin-token gate and four tabs (Settings, Generate, Review Queue, Published), talking to the API with the token attached as a header on every request.

The Published tab exists because approving a draft writes into `generatedContent.json`, which is a separate file from the base app's real data source (`data/db.json`) by design — see "One gate, two sources" below. Nothing published shows up on the live homepage until a maintainer merges it in by hand, so this tab is the only current way to actually see and play what's been approved: it lists every topic/level/caseStudy from `GET /published` and, on request, hands one straight to `PlaytestEngine.jsx` (imported from `client/src/learner/`) to replay it exactly as a learner would experience it. `mentor-main.jsx` imports `learner.css` alongside `mentor.css` so that component's styling comes along.

## Phase 2 — Learner routes (`/api/scenario-gen-learner`, no auth)

| Method | Path | Purpose |
|---|---|---|
| POST | `/generate` | Body `{ concept, hookWord?, avoidList?, providerName, apiKey, model?, baseUrl? }` — runs `scenarioPipeline.generateCaseStudy()` (same two-call pipeline as the mentor path) with the learner's own credentials, returns `{ content, attempts }` without saving anything |
| POST | `/submit` | Body `{ content, completedStages, authorName, authorEmail }` — requires `completedStages` to include `1, 2, 3, 4, 5`, re-validates `content`, checks the daily cap, then creates a `needs_review` draft tagged `author.role: 'learner'` |

## Phase 2 files

- `services/submissionCap.js` — `checkSubmissionCap(email)` reads the draft store directly, counts `role: 'learner'` drafts for that email in the last 24h, compares against `LEARNER_SUBMISSION_CAP`
- `routes/scenarioGeneratorLearner.js` — the two routes above; deliberately has no `requireAdminToken`, and never touches `aiConfigStore`
- `client/learner-generate.html` + `client/src/learner-generate-main.jsx` — third Vite entry point
- `client/src/learner/LearnerGenerateApp.jsx` — form → generate → playtest → submit state machine
- `client/src/learner/PlaytestEngine.jsx` — the real five-stage flow (observe → interpret → concept idea → syntax reveal + build → practice), rendered from a single generated `content` object, calling `onComplete([1,2,3,4,5])` once all five stages are done

## One gate, two sources

Both `routes/scenarioGenerator.js` (mentor) and `routes/scenarioGeneratorLearner.js` (learner) write to the exact same `draftStore`. The mentor-only `/api/scenario-gen/drafts/*` endpoints (list, approve, reject, edit) don't distinguish by `author.role` — a learner's submission and a mentor's own generation sit in the identical queue, reviewed the identical way. Only the draft's `author` field records where it came from.
