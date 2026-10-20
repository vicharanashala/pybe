# Mastery Progression Engine — PyBe Submission

**Contributor:** Niranjan Praveen

## The Feature

PyBe's three difficulty labels (Beginner / Explorer / Builder) were cosmetic — every scenario was open to every learner from the first click, and nothing in the system answered the question the mentors raised directly in the review sessions: *when is a learner ready to move up, and what should they do next?*

This submission adds a **Mastery Progression Engine**: a deterministic, rule-based service that turns PyBe's existing session data into

1. **Per-concept mastery scores** (0–100) for every curriculum concept a learner has touched,
2. **Stage gating** — Explorer and Builder scenarios stay locked until the learner crosses an explicit mastery threshold in the previous stage, and
3. **A next-scenario recommender** that surfaces the three unattempted scenarios with the highest growth potential for that specific learner.

No new database, no external AI, no new dependencies. The engine reads the same `db.json` sessions the rest of PyBe already writes, keeping the V0 constraint of fully local, deterministic logic — and, like the rest of the learning engine, every function is a clean seam for a future LLM/TinyLLM replacement in V2.

## The Philosophies Behind It

The feature is a direct implementation of three learning theories:

**Bloom — Learning for Mastery (1968).** Bloom's central claim is that most learners can master material if advancement is tied to demonstrated mastery rather than seat time. The engine encodes this as an explicit threshold (default **70/100**, configurable via `MASTERY_THRESHOLD`): a stage unlocks only when the learner has mastered at least half of the previous stage's concept pool across a minimum of 3 sessions. The threshold the mentors said was "currently undefined" now has a concrete, tunable definition.

**Piaget — Cognitive Stages.** The three difficulties are reframed as cognitive stages rather than labels: *Concrete Foundations* (single-value, single-decision reasoning), *Relational Thinking* (coordinating repetition, comparison, grouping), and *Formal Abstraction* (designing reusable general procedures). Each stage card in the UI explains its Piagetian rationale, so the progression is legible to the learner, not just enforced on them.

**Vygotsky — Zone of Proximal Development.** The recommender scores every unattempted, unlocked scenario by summing how far each of its concepts sits *below* the mastery threshold. The scenarios that stretch the learner's weakest concepts — while remaining inside unlocked stages — rank highest. That is ZPD operationalized: always slightly beyond current ability, never out of reach.

## How Mastery Is Computed

For each curriculum concept (the tags on scenarios, e.g. `loops`), across every session touching that concept:

| Signal | Meaning | Max |
|---|---|---|
| Exposure | Repeated engagement (10 pts/session, capped at 4) | 40 |
| Prompt quality | Average prompt maturity score × 0.4 | 40 |
| Abstraction depth | Average reasoning patterns recognized per session | 15 |
| Reflection | Bonus for reflective practice | 5 |
| Misconceptions | −5 per flagged misconception | −20 |

Mastery = clamp(sum, 0, 100). Status bands: **Emerging** (< 35), **Developing** (35–69), **Mastered** (≥ 70).

## What Changed

```
server/src/services/masteryEngine.js   NEW — mastery scoring, stage gating, ZPD recommender
server/src/routes/mastery.js           NEW — GET /api/mastery (optional ?learner= filter)
server/src/index.js                    + mounts /api/mastery
client/src/main.jsx                    + Mastery Journey panel, locked scenarios in browser,
                                         recommendation cards with one-click "Start"
client/src/styles.css                  + styles for stages, concept bars, recommendations
```

### API

`GET /api/mastery` returns:

```json
{
  "threshold": 70,
  "minSessionsToAdvance": 3,
  "totalSessions": 8,
  "concepts": [{ "concept": "variables", "mastery": 91, "sessions": 3, "status": "Mastered" }],
  "levels": [{ "level": "Explorer", "stage": "Relational Thinking", "coverage": 33, "unlocked": true }],
  "recommendations": [{ "title": "Bus Stop Search", "reason": "Builds search (current mastery 0/100)" }]
}
```

## Running It

```bash
npm run installAll   # server + client deps
npm install          # root (concurrently)
cp server/.env.example server/.env
npm run seed
npm run dev
```

- Frontend: http://localhost:5173 · API: http://localhost:5000/api

A fresh learner sees only Beginner unlocked and three Beginner recommendations. Complete sessions with thoughtful reasoning and prompts, and the Mastery Journey panel updates live: concept bars fill, Explorer unlocks at the threshold, and recommendations shift to the newly opened stage targeting the weakest concepts.

## Why This and Not Another Theme Pack

Most existing submissions add themed scenario content on top of the same open-ended loop. This submission changes the loop itself: PyBe now has a defensible, theory-grounded answer to "what should this learner do next, and when are they ready to advance" — the exact gap named in the mentor sessions, and the foundation the V3 "Adaptive Learning Engine" phase assumes will exist.
