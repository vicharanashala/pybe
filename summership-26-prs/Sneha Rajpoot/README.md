# PyBe Structuredness-Aware Adaptive Scenario Engine

## Contribution

This self-contained PyBe learning loop selects a scenario using a learner's previous outcomes and a structuredness boundary. Learners read a story, explain their reasoning, receive an outcome-based response, and continue to a different scenario selected for their current progression. The prototype keeps its analysis and selection policy deterministic and inspectable.

## Run Locally

Requires Node.js 18 or newer. There are no package dependencies or database setup steps. To enable AI mentor feedback and AI-written fresh stories, copy `server/.env.example` to `server/.env` and enter a Gemini API key there. The key stays on the server and `.env` is ignored by Git. Without a key or if Gemini is unavailable, local mentor guidance and sequenced fresh story variations keep the loop running.

```powershell
cd "summership-26-prs/Sneha Rajpoot/server"
npm test
npm start
```

Open `http://localhost:4178`. Set `PORT` to choose another local port. Progress is stored in `server/data/learning-state.json`; this local runtime data is ignored by Git.

Gemini is the primary mentor/story provider when configured. It reviews submitted reasoning and streams the teaching response to the browser before it finishes writing the next story. The mentor teaches one focal concept with an everyday analogy, a plain-language explanation, and a small story-related Python example. Each new story stays within the current lesson's declared concept family, so the chain can continue without introducing unrelated topics. Learners can choose ages 8-11, 12-15, or 16+: younger stories use original magical-academy characters, teen stories use age-respectful school/community problems, and 16+ stories use authentic stakeholder problems with trade-offs and reflection informed by constructivist problem-based learning. These are content presets, not validated reading-level or developmental assessments. If Gemini is unavailable, local feedback and fresh age-aware story variations continue on the same concept. The server validates generated focus labels and recalculates structuredness locally before selecting the next scenario. The displayed average score is mentor-awarded learning points divided by 20 possible points per attempt; it is a feedback indicator, not a mastery grade. Raw reasoning is sent to Gemini for the requested review but is not persisted in local research events.

## Learning Loop

1. The server computes a deterministic structuredness profile for each built-in scenario.
2. A learner receives the available scenario nearest their persisted boundary, with recently attempted scenarios avoided when alternatives exist.
3. Submitted reasoning is evaluated with a small observable-evidence rubric and assigned `success`, `struggle`, or `incomplete`.
4. The configured boundary policy updates the learner profile and stores an event containing the scenario dimensions, outcome, before/after boundary, and next scenario ID.
5. The learner sees a short, non-technical explanation and can continue to the selected next story.

The UI assigns a random opaque learner ID in local storage. The server stores no name, raw reasoning, or API key.

## Structuredness Baseline

Each dimension is normalized to [0,1]. The score uses explicit weights:

```text
S = 0.40 * ambiguity
  + 0.25 * (1 - goal_clarity)
  + 0.20 * solution_space
  + 0.15 * competing_constraints
```

`S = 0` represents a tightly structured task; `S = 1` represents a highly open-ended task. Goal clarity increases with explicit outcomes, conditions, stated constraints, and a single example solution. Ambiguity uses explicit broad/open language, stated alternatives, and broad trade-offs. Solution space is estimated from the number of distinct example approaches provided. Competing constraints uses explicit opposing objective language and the number of constraints. These are lexical and metadata heuristics, not validated measurements.

The engine returns `baselineScore`, the four dimensions, a coverage-based `confidence` indicator, and human-readable `reasoning`. Confidence describes input coverage only; it is not statistical confidence.

## Adaptation Policy

Policy values are centralized in `ADAPTATION_POLICY`:

- Initial boundary: `0.22`.
- Near-boundary band: `0.08`.
- Successful near-boundary attempt: increase by at most `0.03` and do not move beyond the scenario score plus the band.
- Struggle at or below the boundary: lower by at most `0.02`, without going below the scenario score.
- Struggle above the boundary and incomplete attempts do not increase the boundary; incomplete attempts do not change it.
- Candidate choice avoids the current and three most recent scenarios when alternatives exist, prefers a candidate at or below the boundary over a stretch, then minimizes distance with scenario ID as a stable tie-breaker.
- If no candidate has a valid structuredness score, the API returns a clear no-scenario fallback. If only far candidates remain after repetition avoidance, the closest one is returned with an explicit fallback decision.

The outcome rubric does not equate clicking submit with success. Empty reasoning is incomplete; non-empty reasoning under 40 characters is struggle. Success requires at least 100 characters and evidence in at least two categories: sequencing, causal explanation, edge-case reasoning, or programming concepts. Other submitted reasoning is recorded as struggle. These thresholds are deliberately simple, transparent prototype heuristics.

## API and Persistence

- `GET /api/scenarios` returns scenarios and computed structuredness profiles.
- `GET /api/learning/next?learnerId=...` returns the selected challenge and adaptation explanation.
- `GET /api/learning/progress?learnerId=...` resumes the boundary and returns recent events.
- `POST /api/learning/attempt` accepts `{ learnerId, scenarioId, reasoning }`, evaluates the outcome, updates the boundary, and records the event. The browser requests newline-delimited JSON: a `mentor` event arrives as soon as teaching is ready, followed by a `complete` event containing the next scenario. Requests that do not ask for streaming continue to receive one JSON response.
- `GET /api/health` reports app availability.

An atomic JSON repository is used only because this submission folder has no existing app database to reuse. The repository hides the local data file. Each event carries `STRUCTUREDNESS_EVALUATED` and `SCENARIO_ADAPTED` types, scenario/dimension scores, outcome, previous/updated boundary, next scenario ID, adaptation decision, opaque learner ID, and timestamp. Raw reasoning is not stored.

## Research Integrity and Limits

This implements a research hypothesis, not evidence that structuredness-based progression improves learning. The scoring and adaptation policies have not been calibrated against a human-scored corpus or evaluated against alternative progression strategies. The boundary is a prototype challenge-selection variable, not IQ, ability, XP, or a learner grade. Future work should compare scores with educator annotations, inspect disagreements, and empirically calibrate progression before making learning-effect claims.

Not implemented: human calibration corpus, validated measurement, LLM scoring, complete PyBe curriculum, authentication, or cross-device learner profiles.