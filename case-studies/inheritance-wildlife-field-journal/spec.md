# spec.md — Technical Specification

## Author: Pritam Patra
## Feature: Inheritance Discovery Engine

---

## System Overview

The Inheritance Discovery Engine is a 4-phase guided learning journey that teaches Object-Oriented Inheritance through a real-world case study ("The Wildlife Observer"). An LLM evaluates learner responses at each phase and generates adaptive follow-up questions when understanding is incomplete.

---

## Phase Definitions

| Phase | Name | Expected Insight | Advance Condition |
|---|---|---|---|
| 1 | Observe | Learner identifies shared traits among all animals (generalization) | LLM confirms structural understanding |
| 2 | Discover | Learner describes the extension pattern (Eagle = Animal + fly) | LLM confirms extension thinking |
| 3 | Connect | Learner maps their real-world observation to a new example | LLM accepts bridge example as valid |
| 4 | Apply | Learner fills `class Eagle(____)` correctly | Exact string match: `Animal` |

---

## Data Schema (`db.json`)

```json
{
  "journey": {
    "id": "string",
    "concept": "string",
    "title": "string",
    "story": "string",
    "phases": [
      {
        "phase": 1,
        "name": "string",
        "storyBeat": "string",
        "questions": ["string"],
        "expectedInsight": "string"
      }
    ]
  },
  "sessions": [
    {
      "_id": "uuid",
      "phaseAnswers": { "1": "string", "2": "string", "3": "string", "4": "string" },
      "corrections": { "1": 0, "2": 0 },
      "completedAt": "ISO timestamp",
      "createdAt": "ISO timestamp"
    }
  ]
}
```

---

## API Endpoints

| Method | Route | Body | Response |
|---|---|---|---|
| GET | `/api/journey` | — | Full journey object from db.json |
| POST | `/api/journey/evaluate` | `{ phase, userAnswer }` | `{ understood, encouragement, misconception, followUpQuestion }` |
| POST | `/api/journey/session` | `{ phaseAnswers, corrections, completedAt }` | Saved session object |

---

## LLM Evaluation Contract

### Request to Gemini
```
SYSTEM: You are an adaptive learning evaluator...
         [strict rules about not revealing concept prematurely]

USER: PHASE: 1
      STORY BEAT: "..."
      QUESTIONS ASKED: "..."
      EXPECTED INSIGHT: "..." (for evaluator reference only — never shown to learner)
      LEARNER'S ANSWER: "..."
```

### Response (strict JSON)
```json
{
  "understood": true,
  "encouragement": "string or null",
  "misconception": "string or null",
  "followUpQuestion": "string or null"
}
```

### Rules enforced in system prompt
- Never use: "class", "parent", "child", "inheritance", "Python" before Phase 3
- Follow-up questions must reference the story, not programming
- If partially correct, push deeper — do not reject
- Tone: warm, curious, mentor-like

---

## LLM Fallback (Local Rule-Based)

When no API key is set, the system falls back to keyword-based evaluation:

- **Phase 1 pass:** Answer contains ≥2 of: breathe, move, eat, common, shared, same, similar, trait
- **Phase 2 pass:** Answer contains ≥1 extension word AND ≥1 shared word
- **Phase 3:** Always passes (creative bridge examples accepted)
- **Phase 4:** Exact string match

This means the app works fully offline and without any API key — the LLM is an enhancement, not a dependency.

---

## Frontend State Machine

```
App State:
{
  currentPhase: 1 | 2 | 3 | 4,
  phaseAnswers: { 1: "", 2: "", 3: "", 4: "" },
  corrections: { 1: 0, 2: 0, 3: 0 },
  done: false
}

Transitions:
Phase 1 complete → Phase 2 → Phase 3 → Phase 4 → done=true
```

---

## Component Map

| Component | Phases | Key props |
|---|---|---|
| `ObservationPhase` | 1, 2 | `phase`, `onPhaseComplete` |
| `ConnectPhase` | 3 | `phase`, `onPhaseComplete` |
| `ApplyPhase` | 4 | `phase`, `onPhaseComplete` |
| `CorrectionBubble` | 1, 2 | `misconception`, `followUpQuestion` |
| `PhaseReveal` | All | `phase`, `encouragement`, `onContinue` |
| `ResultSummary` | Post-completion | `phaseAnswers`, `corrections` |
