# 07 – Episode Generation Engine

## 1. Purpose
Transforms validated educational reasoning into a complete instructional episode. Unlike previous engines (which determine WHAT the learner should understand), this engine determines HOW that understanding is communicated. Every episode SHALL faithfully implement the outputs of previous engines without altering their educational intent.

## 2. Definition of an Episode
A complete instructional experience designed to transform a learner from initial curiosity to conceptual understanding and practical application through a single coherent learning objective. An episode is NOT a script — it is an instructional blueprint that can be rendered as video, article, interactive lesson, presentation, workshop, or other format.

## 3. Canonical Episode Structure (Mandatory)
1. **ES-01 — Cognitive Hook**: Capture attention with a question, prediction, contradiction, or surprising observation related to the objective. MUST create curiosity. MUST avoid misleading clickbait. (CL-17, CL-21)
2. **ES-02 — Scenario**: Present the validated scenario from Scenario Engine. MUST preserve conceptual accuracy. (CL-03, CL-08)
3. **ES-03 — Guided Observation**: Direct learner attention toward important events. Avoid explaining the concept prematurely.
4. **ES-04 — Pattern Recognition**: Help learners identify recurring relationships. Encourage inference before revealing the answer.
5. **ES-05 — Mental Model**: Present the validated conceptual model. Explain relationships, not terminology. Replace the identified misconception.
6. **ES-06 — Programming Concept**: Introduce the formal concept as a representation of the discovered pattern. Preserve conceptual continuity. Avoid syntax-first instruction.
7. **ES-07 — Implementation**: Demonstrate how the concept is expressed in code. Implementation MUST reinforce, not replace, conceptual understanding.
8. **ES-08 — Practice**: Provide opportunity to apply the concept. Practice SHOULD require reasoning, not mechanical repetition.
9. **ES-09 — Reflection**: Consolidate understanding by encouraging learners to explain, predict, or generalize.

Stages MAY be expanded but SHALL NOT be reordered without explicit justification.

## 4. Episode Design Rules
- **ER-01**: Every episode SHALL teach exactly one primary learning objective.
- **ER-02**: Every stage SHALL support the same target mental model.
- **ER-03**: New concepts SHALL NOT be introduced during implementation unless prerequisites.
- **ER-04**: Practice activities SHALL evaluate conceptual understanding before syntax accuracy.
- **ER-05**: Reflection SHALL reinforce transferable understanding, not factual recall.
- **ER-06**: The instructional sequence SHALL preserve the canonical learning flow unless formally justified.

## 5. Episode Variants
- **EV-01 — Micro Episode**: 30–90 seconds. One objective, one scenario, one mental model, minimal implementation, single practice/reflection prompt. Suitable for short-form video.
- **EV-02 — Standard Lesson**: 5–20 minutes. Full canonical sequence, multiple observations, detailed implementation, guided practice, reflection.
- **EV-03 — Deep-Dive Lesson**: 20–60 minutes. Rich discussion, multiple examples, comparative scenarios, extended implementation, progressive exercises.
- **EV-04 — Interactive Session**: Frequent predictions, decision points, immediate feedback, multiple assessment checkpoints. Suitable for workshops.

## 6. Transition Design
Curiosity → Observation → Discovery → Explanation → Formalization → Implementation → Application → Reflection
Transitions SHOULD make the relationship between consecutive stages explicit. Learners should never feel that a programming concept appears without justification.

## 7. Episode Validation Framework
- **EVF-01 — Objective Alignment**: Every stage MUST support the primary learning objective.
- **EVF-02 — Conceptual Consistency**: Lesson MUST preserve the validated mental model throughout.
- **EVF-03 — Pattern Integrity**: Transition from scenario to programming MUST preserve the validated pattern mapping.
- **EVF-04 — Misconception Resolution**: Episode MUST explicitly address the selected misconception.
- **EVF-05 — Cognitive Flow**: Minimize unnecessary cognitive load while maintaining depth.
- **EVF-06 — Transfer Readiness**: Prepare learners to apply the concept beyond the presented example.
- **EVF-07 — Scenario Continuity**: The dominant scenario SHALL remain the primary explanatory vehicle until the learner demonstrates understanding.

## 8. Engine Workflow
Receive Pattern Mapping Specification → Determine Episode Variant → Assemble Canonical Stages → Design Transitions → Integrate Assessment → Validate Episode → Generate Specification → Pass to Production Engine

## 9. Output Schema
| Field | Description |
|---|---|
| Episode ID | Unique identifier |
| Learning Objective | Primary instructional objective |
| Episode Variant | EV classification |
| Instructional Stages | Ordered sequence |
| Transition Plan | Connections between stages |
| Assessment Plan | Embedded learning checks |
| Practice Activities | Planned learner applications |
| Reflection Prompt | End-of-lesson consolidation |
| Validation Results | EVF-01 through EVF-07 |
| Confidence | Estimated instructional quality |
