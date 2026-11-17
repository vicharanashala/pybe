# 03 – Misconception Engine

## 1. Purpose
Identifies, models, prioritizes, and resolves learner misconceptions BEFORE educational content is generated. Anticipates misunderstandings and designs instruction that prevents or corrects them. Operationalizes CL-06 — Misconceptions Must Be Addressed.

## 2. Core Definitions
- **Misconception**: A stable but inaccurate mental model that leads a learner to consistently predict or explain a concept incorrectly.
- **Knowledge Gap**: Missing information. A knowledge gap is NOT automatically a misconception.
- **Error**: An incorrect answer or action. Errors may result from misconceptions, carelessness, or oversight. An error alone does not prove a misconception.
- **Conceptual Change**: The process by which an inaccurate mental model is replaced or reorganized into a more accurate one. The goal is conceptual change, not merely error correction.

## 3. Misconception Classification (MC)
- **MC-01 — Overgeneralization**: Applying a correct rule beyond its valid scope. Example: Believing variables always store copies rather than references.
- **MC-02 — Incorrect Causality**: Misunderstanding WHY something happens. Example: Believing a loop repeats because the computer "knows" how many times, rather than because a condition evaluates true.
- **MC-03 — Faulty Analogy**: Extending an oversimplified teaching analogy too far beyond what it accurately represents.
- **MC-04 — Terminology Confusion**: Assigning incorrect meaning to technical vocabulary. Linguistic rather than conceptual, but can still block learning.
- **MC-05 — Procedural Memorization**: Remembering steps or syntax without understanding the underlying mechanism. Prevents transferable knowledge.

## 4. Severity Model
| Level | Meaning | Priority |
|---|---|---|
| S1 | Minor confusion | Address if time permits |
| S2 | Limits understanding | Recommended to address |
| S3 | Blocks concept acquisition | Must be addressed |
| S4 | Creates cascading misunderstandings | Highest priority |
Severity reflects educational impact, not frequency. A rare misconception that prevents future learning may deserve higher priority.

## 5. Root Cause Analysis
| Code | Description | Typical Response |
|---|---|---|
| RC-01 | Missing prerequisite knowledge | Review prerequisite concepts first |
| RC-02 | Incorrect prior mental model | Replace or restructure via conceptual change |
| RC-03 | Misleading analogy | Replace analogy with one reflecting the actual mechanism |
| RC-04 | Terminology misunderstanding | Clarify vocabulary using observable examples before definitions |
| RC-05 | Syntax-first learning | Rebuild understanding from mechanism to implementation |
| RC-06 | Overgeneralization | Present counterexamples revealing the limits of the rule |
| RC-07 | Incomplete observation | Guide learner to observe the missing behavior |
Identify the simplest root cause that adequately explains the misconception before considering more complex explanations.

## 6. Intervention Strategies
| Code | Strategy | Purpose |
|---|---|---|
| IS-01 | Prediction | Ask the learner to anticipate an outcome before revealing the result |
| IS-02 | Contrasting Cases | Compare correct and incorrect situations to expose the misconception |
| IS-03 | Guided Discovery | Lead the learner to infer the correct principle through observation |
| IS-04 | Counterexample | Present an example that the misconception cannot explain |
| IS-05 | Mental Model Reconstruction | Replace the inaccurate model with a more accurate structure |
| IS-06 | Progressive Refinement | Simple model first, then increase precision as understanding grows |
| IS-07 | Reflection | Encourage learners to explain why their earlier reasoning changed |

## 7. Engine Decision Rules
- **MR-01**: Address misconceptions that directly block the lesson objective before secondary misunderstandings.
- **MR-02**: Prefer correcting one high-impact misconception over mentioning several low-impact ones.
- **MR-03**: Every selected misconception MUST be linked to a target mental model that will replace it.
- **MR-04**: Do not introduce misconceptions unlikely to occur for the intended learner profile.
- **MR-05**: The corrective strategy MUST preserve technical accuracy while minimizing cognitive load.

## 8. Engine Workflow
Receive Target Concept → Analyze Learner Profile → Retrieve Candidate Misconceptions → Classify Misconceptions → Determine Root Causes → Assign Severity → Select Priority Misconception(s) → Recommend Intervention Strategy → Produce Structured Profile → Pass to Mental Model Engine

## 9. Output Schema
| Field | Description |
|---|---|
| Target Concept | Programming concept being taught |
| Learning Objective | Primary educational objective |
| Learner Profile | Intended learner characteristics |
| Selected Misconception(s) | Prioritized misconceptions |
| Classification | MC category |
| Severity | S level |
| Root Cause | RC code |
| Recommended Strategy | IS code |
| Replacement Mental Model | Target conceptual understanding |
| Confidence | Estimated confidence in the analysis |
