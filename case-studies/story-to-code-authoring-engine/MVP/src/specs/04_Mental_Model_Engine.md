# 04 – Mental Model Engine

## 1. Purpose
Constructs the conceptual understanding learners must acquire BEFORE encountering implementation details. Defines the internal representation of the concept that the learner should reason with after instruction. Operationalizes CL-07 — Mental Models Are Mandatory.

## 2. Definition of a Mental Model
An internal conceptual representation that enables a learner to explain, predict, and reason about the behavior of a programming concept across multiple situations.

A learner demonstrates possession of a mental model when they can:
- Predict outcomes before execution
- Explain why those outcomes occur
- Apply the same reasoning to unfamiliar problems
- Detect inconsistencies in incorrect explanations

Memorized syntax alone does NOT constitute a mental model.

## 3. Mental Model Components
- **MM-01 — Core Concept**: The central idea being learned. Example: "A variable represents a named storage location whose value may change over time."
- **MM-02 — Entities**: The objects or elements that participate (Variables, Functions, Objects, Conditions, Loops, Data structures)
- **MM-03 — Relationships**: How entities interact (dependency, ownership, flow, comparison, sequencing, communication)
- **MM-04 — Rules**: Governing principles that determine system behavior, expressed conceptually before syntactically
- **MM-05 — Observable Behaviors**: Behaviors a learner should expect when applying the model, enabling verification of understanding

## 4. Mental Model Taxonomy (MT)
- **MT-01 — State Models**: Reasoning about before, during, and after states over time. Concepts: Variables, Assignment, Object state, Mutable data.
- **MT-02 — Flow Models**: Reasoning about execution sequence. Concepts: Conditionals, Loops, Function calls, Program execution. Learner reasons about "what happens next and why."
- **MT-03 — Relationship Models**: Reasoning about entity interactions. Concepts: References, Objects, Inheritance, Composition, Dependencies.
- **MT-04 — Transformation Models**: Converting inputs to outputs systematically. Concepts: Functions, Mapping, Recursion, Data processing pipelines.
- **MT-05 — System Models**: Multi-component mechanism interaction. Concepts: Memory management, Client-server, Concurrency, Event-driven programming.

## 5. Quality Criteria
- **MQ-01 — Accuracy**: MUST correctly represent the programming concept. No false reasoning.
- **MQ-02 — Simplicity**: Only concepts necessary for the lesson objective. Unnecessary detail increases cognitive load.
- **MQ-03 — Predictive Power**: Enable learners to predict system behavior before observing code execution.
- **MQ-04 — Transferability**: Apply to multiple programming problems, not a single example.
- **MQ-05 — Consistency**: Remain internally consistent across explanations, scenarios, and implementations.

## 6. Construction Rules
- **MMR-01**: Begin with the conceptual objective defined by the learning objective.
- **MMR-02**: Use the misconception profile to determine which incorrect reasoning must be replaced.
- **MMR-03**: Construct one dominant mental model per lesson.
- **MMR-04**: Exclude implementation details that do not support conceptual understanding.
- **MMR-05**: Prefer models that explain both successful and incorrect outcomes.
- **MMR-06**: Validate the model against quality criteria before passing to downstream engines.

## 7. Validation Framework
- **MV-01 — Explanatory Test**: Can the model explain WHY the concept behaves as it does?
- **MV-02 — Predictive Test**: Can a learner using the model correctly predict future behavior?
- **MV-03 — Transfer Test**: Can the same reasoning be applied in a different but related context?
- **MV-04 — Misconception Test**: Does the model directly replace the targeted misconception?
- **MV-05 — Simplicity Test**: Is every included element necessary for the lesson objective?

A model SHALL pass ALL validation tests before being released to downstream engines.

## 8. Engine Workflow
Receive Misconception Profile → Determine Learning Objective → Select Mental Model Type → Construct Conceptual Structure → Define Entities and Relationships → Establish Governing Rules → Describe Observable Behaviors → Validate Mental Model → Generate Specification → Pass to Scenario Intelligence Engine

## 9. Output Schema
| Field | Description |
|---|---|
| Target Concept | Programming concept being taught |
| Mental Model Type | MT classification |
| Core Concept | Central conceptual statement |
| Entities | Key conceptual elements |
| Relationships | Interactions among entities |
| Rules | Governing conceptual principles |
| Observable Behaviors | Expected learner predictions |
| Replacement Objective | Misconception being replaced |
| Validation Results | MV-01 through MV-05 |
| Confidence | Estimated confidence in the model |
