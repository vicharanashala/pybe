# 06 – Pattern Mapping Engine

## 1. Purpose
Identifies the abstract computational pattern hidden within an educational scenario and connects it to the target programming concept. Without this engine, scenarios remain stories. With this engine, scenarios become instructional bridges. Operationalizes CL-08 — Patterns Connect Scenarios to Programming.

## 2. Definition of a Pattern
A recurring relationship, behavior, or structure that exists independently of a specific scenario or programming language. Patterns are neither stories nor syntax — they are the conceptual bridge between concrete experiences and abstract computation. Examples: Repetition, Selection, Transformation, State change, Communication, Dependency, Sequencing.

## 3. Pattern Hierarchy
- **PM-01 — Observable Pattern**: The learner notices recurring behavior inside the scenario. Example: "Every customer waits until the previous customer finishes."
- **PM-02 — Abstract Pattern**: The learner recognizes the underlying rule. Example: "Work happens sequentially because only one task can proceed at a time."
- **PM-03 — Programming Pattern**: The learner connects the abstract rule to programming. Example: "Sequential execution."

ALL instructional mappings SHALL progress through these three levels.

## 4. Pattern Categories
- **PC-01 — Sequence**: Events in a defined order. Programming: statements, function execution, pipelines.
- **PC-02 — Selection**: Different outcomes depending on conditions. Programming: if, else, switch.
- **PC-03 — Repetition**: Behavior repeats while a condition is valid. Programming: for, while, iteration.
- **PC-04 — State Change**: System state changes over time. Programming: variables, objects, assignment.
- **PC-05 — Transformation**: Inputs become outputs according to rules. Programming: functions, mapping, algorithms.
- **PC-06 — Communication**: Information moves between entities. Programming: parameters, return values, messages, events.
- **PC-07 — Organization**: Information is grouped or structured. Programming: arrays, lists, objects, trees.
- **PC-08 — Coordination**: Multiple entities cooperate toward a shared objective. Programming: threads, distributed systems, event-driven architectures.

## 5. Mapping Rules
- **PR-01**: Extract patterns from observable behavior BEFORE introducing programming terminology.
- **PR-02**: Preserve conceptual equivalence between scenario and programming concept.
- **PR-03**: Avoid mappings that rely solely on superficial similarity.
- **PR-04**: Prefer one dominant programming pattern per lesson. Prefer one dominant scenario realization until transfer learning begins.
- **PR-05**: Reject mappings that require learners to ignore important differences between scenario and programming concept.
- **PR-06**: Every mapping reinforces the target mental model from the Mental Model Engine.

## 6. Validation Framework
- **PV-01 — Behavioral Equivalence**: Observable behavior in scenario MUST correspond to programming concept behavior with the same causal relationships.
- **PV-02 — Structural Equivalence**: Entities and relationships MUST align with the Mental Model Specification.
- **PV-03 — Predictive Equivalence**: A learner who understands the scenario SHOULD correctly predict programming behavior.
- **PV-04 — Misconception Safety**: MUST NOT reinforce any misconception identified by the Misconception Engine.
- **PV-05 — Abstraction Integrity**: Emphasize the underlying pattern rather than surface details.

## 7. Mapping Strategy
Observe Events → Identify Repeated Behavior → Extract Abstract Rule → Generalize the Rule → Associate with Programming Concept → Verify Predictive Understanding

## 8. Engine Workflow
Receive Scenario Specification → Identify Observable Behaviors → Extract Recurring Pattern → Generalize Pattern → Map to Programming Concept → Validate Mapping → Generate Specification → Pass to Episode Generation Engine

## 9. Output Schema
| Field | Description |
|---|---|
| Target Concept | Programming concept |
| Pattern Category | PC classification |
| Observable Pattern | What the learner sees |
| Abstract Pattern | Generalized conceptual rule |
| Programming Correspondence | Equivalent programming concept |
| Transition Sequence | Ordered conceptual progression |
| Validation Results | PV-01 through PV-05 |
| Confidence | Estimated confidence in the mapping |
