# Feature: Scenario Generator (Phase 1 — mentor-only, Phase 2 — learner extension)

**Contributor:** Khushi Choudhary
**Email:** 23f3002872@ds.study.iitm.ac.in

## What this is

A tool that generates new PyBe case studies with an LLM, checks them against PyBe's own rules before a human ever sees them, and only publishes what a mentor explicitly approves. Phase 1 is mentor-only, using a key the mentor manages. Phase 2 opens the same generator to any learner, using a key *they* supply for that one request only, with a mandatory playtest and a daily submission cap before anything reaches the same review queue. Six providers are supported throughout: Anthropic, OpenAI, xAI, MiniMax, Gemini, or a custom OpenAI-compatible endpoint.

## Why this design

Sir has been explicit, across every session, that generated content is not trustworthy until a human has checked it, and that PyBe's own scenario-writing rules (discovery before naming, one concept per case study, a defensible level boundary, no LLM-tell phrasing) have to hold even when the writer is a model instead of a person. This feature encodes those exact rules into a system prompt (`server/src/services/scenarioSystemPrompt.js`) rather than a fill-in-the-blank template, runs an automatic validator against them before anything reaches a mentor, and still requires a manual approve step before anything reaches a learner — no matter which of the two paths a case study came from.

Phase 2 specifically answers sir's own framing of what PyBe should become: "your own version," open source, every contributor's name staying on what they made. Letting a learner generate, play, and submit their own case study is the SOLO taxonomy's top level — teach-back, design something for a peer — turned into an actual feature rather than left as an aspiration.

## Pipeline

**Phase 1 (mentor).** Input (concept + optional hook word) → system prompt + user message → the mentor's configured provider → validator (schema shape, banned phrases, concept-named-too-early check) → up to 3 retries with the validator's specific feedback appended → saved as a draft (`needs_review`) → mentor approves, edits, or rejects.

**Phase 2 (learner).** Same system prompt and same validator, but the learner supplies their own provider + key + name + email for one request only. The generated case study is *not* saved yet — it's handed back to the browser, where the learner must play through all three stages themselves (`PlaytestEngine.jsx`) before the submit button unlocks. Submission re-validates the content server-side, checks a per-email daily cap (`LEARNER_SUBMISSION_CAP`, default 3), then lands in the exact same `needs_review` queue Phase 1 uses — one gate (Mentor Approves), two sources.

Approved drafts from either path are appended into `server/src/data/generatedContent.json`, schema-compatible with the shared `content.json` convention so they can be merged upstream by hand.

## Why the learner path is safe

The learner's API key is never written to a file, a log, or any store on either side — server-side it exists only inside the one request handler that uses it; client-side it's cleared from component state the moment the generation call returns. Nothing is published without the same mentor approval gate as Phase 1. The playtest requirement means a mentor is never the first person to actually experience a submitted case study. The submission cap keeps the review queue from being flooded. Attribution is a plain name + email field, matching the same convention already used for `product.md` across the cohort — no login system was added, keeping this app's zero-auth posture everywhere except the two things that need a gate (mentor settings, learner submission volume).

## How to run it

1. `npm run installAll` from this folder, then `cp server/.env.example server/.env`.
2. Set `MENTOR_ADMIN_TOKEN` in `server/.env` to a secret only you know. Optionally adjust `LEARNER_SUBMISSION_CAP`.
3. `npm run seed` (populates the base learner app's scenario data).
4. `npm run dev`.
5. Mentor tools: `http://localhost:5173/mentor.html` — enter the admin token, paste a real key into Settings, generate on the Generate tab, review on the Review Queue tab.
6. Learner path: `http://localhost:5173/learner-generate.html` — anyone can fill in their own key and try it, no admin token needed.

See [SCENARIO_GENERATOR.md](SCENARIO_GENERATOR.md) for the full architecture.
