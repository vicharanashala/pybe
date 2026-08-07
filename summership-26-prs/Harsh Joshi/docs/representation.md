# System Representations & State Machines (`representation.md`)

This document provides visual state machine representations and logic diagrams for the two core intelligent components of the Antigravity module: the **Lazy vs. Motivated Scale** and the **Contradiction Engine**.

---

## 1. Lazy vs. Motivated Scale (95/5 Scaffolding State Machine)

The psychological scale adjusts the ratio of provided syntax versus required learner input in real time.

```mermaid
stateDiagram-v2
    [*] --> EvaluateSlider: User Sets Slider (0 to 100)
    
    state EvaluateSlider {
        state "Lazy Mode (Score 0-33)" as Lazy
        state "Balanced Mode (Score 34-66)" as Balanced
        state "Motivated Mode (Score 67-100)" as Motivated
    }
    
    EvaluateSlider --> Lazy: Slider <= 33
    EvaluateSlider --> Balanced: 33 < Slider <= 66
    EvaluateSlider --> Motivated: Slider > 66
    
    Lazy --> ScaffoldingHigh: Provide 98% Syntax<br/>(Only toggle 1 keyword/boolean)
    Balanced --> ScaffoldingMed: Provide 95% Syntax<br/>(Type exact operator & target variable)
    Motivated --> ScaffoldingLow: Provide 90% Syntax<br/>(Construct loop condition or full expression)
    
    ScaffoldingHigh --> RenderApplicationLayer
    ScaffoldingMed --> RenderApplicationLayer
    ScaffoldingLow --> RenderApplicationLayer
    
    RenderApplicationLayer --> [*]
```

---

## 2. Contradiction Engine State Machine

The Contradiction Engine tracks learner beliefs and intercepts standard curriculum progression to inject productive struggle when cognitive collisions occur.

```mermaid
stateDiagram-v2
    [*] --> ReadBeliefState: Fetch User Beliefs from Storage / Session
    
    state ReadBeliefState {
        state "Belief: Variable = Single Value" as B1
        state "Belief: Sequential Execution Only" as B2
        state "Belief: Immutable Strings" as B3
    }
    
    ReadBeliefState --> TargetConcept: User Selects Rhizome Topic
    
    state TargetConcept {
        state "Concept: Lists / Collections" as C1
        state "Concept: While / For Loops" as C2
        state "Concept: String Re-assignment" as C3
    }
    
    TargetConcept --> CheckCollision: Evaluate (Belief vs Concept)
    
    state CheckCollision <<choice>>
    CheckCollision --> ContradictionDetected: (B1 & C1) or (B2 & C2) or (B3 & C3)
    CheckCollision --> StandardFlow: No Collision Detected
    
    state ContradictionDetected {
        [*] --> TriggerClashArchetype
        TriggerClashArchetype --> GenerateParadoxNarrative: Story highlights contradiction
        GenerateParadoxNarrative --> PresentStruggleCode: Code fails under old belief
    }
    
    state StandardFlow {
        [*] --> SelectStandardArchetype
        SelectStandardArchetype --> GenerateHarmoniousNarrative
    }
    
    ContradictionDetected --> ReflectionVerification: Learner solves struggle
    StandardFlow --> ReflectionVerification: Learner completes syntax
    
    ReflectionVerification --> UpdateBeliefs: Overwrite old belief with refined model
    UpdateBeliefs --> [*]
```
