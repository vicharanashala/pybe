# 09 – Quality Engine

## 1. Purpose
The independent governance authority responsible for evaluating every educational artifact, engine output, and instructional decision produced within CKLIS. Does NOT generate educational content. Verifies conformance to Charter, Constitution, Learning Science, and all engine specifications. Possesses authority to approve, reject, or request revision of any output.

## 2. Quality Principles
- **QP-01 — Independence**: Quality evaluation SHALL remain independent from content generation. The engine being evaluated SHALL never approve its own output.
- **QP-02 — Traceability**: Every quality decision SHALL reference the exact specification, constitutional law, learning principle, or engine rule supporting it.
- **QP-03 — Evidence-Based Evaluation**: Quality judgments SHALL rely on observable evidence, not subjective preference.
- **QP-04 — Reproducibility**: Repeated evaluation of identical inputs SHOULD produce identical quality outcomes.
- **QP-05 — Educational Priority**: When educational quality conflicts with production convenience, educational quality SHALL prevail.
- **QP-06 — Continuous Improvement**: Identify opportunities for improvement without compromising approved principles.

## 3. Quality Dimensions
- **QD-01 — Constitutional Compliance**: Does the artifact comply with every applicable CL law?
- **QD-02 — Learning Science Alignment**: Does the design reflect LP principles?
- **QD-03 — Technical Accuracy**: Are all programming concepts technically correct?
- **QD-04 — Mental Model Integrity**: Does the artifact preserve the validated conceptual model?
- **QD-05 — Pattern Integrity**: Is the scenario-to-programming transition logically correct?
- **QD-06 — Educational Clarity**: Can the intended learner understand without unnecessary cognitive load?
- **QD-07 — Production Quality**: Are presentation, pacing, terminology, and accessibility consistent?
- **QD-08 — Representation Fidelity**: Does the educational representation preserve the complete instructional intent?
- **QD-09 — Execution Context Consistency**: Does the CKMS context reflect the validated request without contradictions?

## 4. Quality Levels
| Level | Meaning | Result |
|---|---|---|
| Q0 | Critical Failure | Reject immediately |
| Q1 | Major Issues | Revision required |
| Q2 | Minor Issues | Conditional approval |
| Q3 | Fully Compliant | Approved |

## 5. Quality Scoring
| Score | Interpretation |
|---|---|
| 0 | Not Evaluated |
| 1 | Critical Defect |
| 2 | Major Defect |
| 3 | Minor Defect |
| 4 | Acceptable |
| 5 | Excellent |
Critical failures SHALL override aggregate scores.

## 6. Failure Classifications
- **FC-01 — Constitutional Failure**: Violation of CL laws. Result: Immediate rejection.
- **FC-02 — Learning Science Failure**: Conflict with LP principles. Result: Revision required.
- **FC-03 — Technical Failure**: Incorrect programming concepts. Result: Immediate rejection.
- **FC-04 — Conceptual Failure**: Validated mental model distorted. Result: Revision required.
- **FC-05 — Production Failure**: Platform adaptation changes instructional intent. Result: Revision required.
- **FC-06 — Documentation Failure**: Missing traceability or metadata. Result: Conditional approval or revision.

## 7. Audit Framework
- **AG-01 — Specification Audit**: Each engine output conforms to its own specification.
- **AG-02 — Constitutional Audit**: Compliance with all applicable CL laws. Every violation references the specific law.
- **AG-03 — Learning Science Audit**: Consistency with LP principles.
- **AG-04 — Cross-Engine Consistency Audit**: Outputs remain logically consistent across engine boundaries (Misconception↔Mental Model, Mental Model↔Scenario, Scenario↔Pattern, Pattern↔Episode, Episode↔Production).
- **AG-05 — Production Audit**: Produced artifact preserves the approved Episode Specification.

## 8. Representation Validation
The Quality Engine SHALL verify that the selected educational representation:
- Preserves every mandatory instructional stage
- Preserves the validated mental model
- Preserves misconception coverage
- Preserves assessment intent
- Preserves reflection and transfer activities
A representation SHALL NOT be approved if educational meaning is lost during adaptation.

## 9. Engine Workflow
Receive Artifact → Determine Applicable Audits → Evaluate Quality Dimensions → Classify Failures → Generate Quality Report → Decision: Approve / Revise / Reject → (If Revise/Reject: Generate Feedback Request → Return to Responsible Engine)

## 10. Output Schema
| Field | Description |
|---|---|
| Report ID | Unique identifier |
| Evaluated Artifact | Engine output under review |
| Quality Scores | Scores by quality dimension |
| Identified Failures | FC classifications |
| Constitutional References | Applicable CL identifiers |
| Learning Science References | Applicable LP identifiers |
| Recommended Actions | Required revisions or approval |
| Final Decision | Approved, Conditionally Approved, Rejected |
| Representation Score | Representation fidelity assessment |
| Execution Context Status | CKMS consistency check |
