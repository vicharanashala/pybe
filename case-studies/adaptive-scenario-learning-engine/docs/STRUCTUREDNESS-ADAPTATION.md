# Structuredness-Aware Scenario Adaptation

## Purpose

PyBe scenarios can ask for a tightly specified result or invite exploration among several defensible approaches. The adaptation prototype represents that difference and uses it to choose a learner's next scenario. It evaluates the task, not the learner.

## Structuredness Dimensions

`StructurednessEngine` in `server/src/services/structurednessEngine.js` returns a baseline score in `[0,1]` and four normalized dimensions:

- `ambiguity`: broad or underspecified goal/context language and open trade-offs.
- `solutionSpace`: number of distinct example approaches supplied with the scenario.
- `goalClarity`: explicit outcomes, conditions, constraints, and a single solution example.
- `competingConstraints`: opposing objective signals and the number of stated constraints.

The deterministic baseline is `0.40 * ambiguity + 0.25 * (1 - goalClarity) + 0.20 * solutionSpace + 0.15 * competingConstraints`. Each scenario also returns `confidence`, an input-coverage indicator, and `reasoning` strings describing the signals used. Neither confidence nor the score is a statistically or scientifically validated measurement.

## Learner Boundary and Selection

The learner's `currentStructurednessBoundary` starts at `0.22`. It is an adaptive challenge-selection estimate, not an intelligence score, grade, or XP value. The `ADAPTATION_POLICY` centralizes the initial boundary, `0.08` near-boundary band, and update steps.

Selection first ignores scenarios without valid scores. It avoids the current and three most recent scenario IDs when alternatives exist, prefers a scenario no higher than the learner boundary, then selects the smallest absolute distance. A stable scenario-ID tie-breaker makes the result repeatable. If no valid scenario remains, the API returns a no-scenario response; if only distant scenarios remain, it identifies the closest fallback.

## Outcome and Boundary Update

The server derives outcomes from submitted reasoning evidence, not from the submit action alone. Empty reasoning is `incomplete`; short or insufficiently evidenced reasoning is `struggle`; `success` requires at least 100 characters and evidence in at least two observable categories (sequence, causal explanation, edge-case reasoning, programming concepts). The rubric is intentionally inspectable, but is not a validated assessment.

A successful attempt near the boundary nudges it upward by at most `0.03`, capped at the scenario score plus the near-boundary band. Success on a much easier task does not inflate the boundary. Struggle on a task above the boundary never raises it; struggle at or below the boundary can lower it by at most `0.02`. Incomplete attempts and missing scenario scores do not update progression. Values remain within `[0,1]`.

## Persistence and Research Events

One JSON repository persists the opaque local learner ID, boundary, attempt count, and adaptation event history. An event includes event types, session/scenario IDs, structuredness score and dimensions, outcome and evidence explanation, previous/updated boundary, next scenario ID, adaptation decision, and timestamp. Raw reasoning and personal names are not retained. The file is local runtime state and excluded from Git.

## Limitations and Calibration

This is an implementation of a research hypothesis, not evidence that structuredness-based progression improves learning. The lexical indicators and boundary update rules require future comparison with human scenario annotations and empirical study against other progression policies. Gemini can provide formative mentor feedback and generate fresh stories, but it does not establish a validated learner assessment. Without a configured Gemini key, local deterministic teaching and sequenced story variations are used. There is no cross-device account sync, calibrated confidence estimate, or complete assessment model in this slice.