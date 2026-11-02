# End-to-End Workflow & User Journey (`workflow_chart.md`)

This document illustrates the complete user journey and system workflow for the PyBe "Antigravity" module using Mermaid.js flowcharts.

---

## 1. Simplified Story Generation Flow

This high-level flow shows how user preferences are transformed into a personalized narrative.

```mermaid
graph TD
    A[User Data: Selected Theme & Concept] --> B(Load Master Story Template)
    B --> C(Fetch Thematic Keywords)
    C --> D{Combine: String Interpolation}
    D --> E[Final Personalized Case Study]
```

---

## 2. End-to-End User Journey Flowchart

```mermaid
graph TD
    A[Learner Starts at /personalized-journey] --> B[Step 1: Rhizomatic Onboarding Drill-Down]
    B --> C[Select Broad Category e.g., Hobbies, Pop Culture, Mythology]
    C --> D[Select Specific Interest e.g., Football, Avengers, Panchatantra]
    D --> E[Select Role/Focus e.g., Striker, Time Stone, The Clever Fox]
    E --> F[Step 2: Psychological Scale Configuration]
    F --> G[Adjust 'Lazy vs. Motivated' Slider]
    G --> H[Submit Configuration to Backend POST /api/personalized/generate]
    
    H --> I[Service Layer Intercepts & Checks Contradiction State]
    I --> J{Contradiction Detected?}
    J -- Yes --> K[Select Productive Struggle Archetype e.g., Depletion Loop / Clash]
    J -- No --> L[Select Standard Master Story Archetype e.g., Accumulation / Condition]
    
    K --> M[Inject Thematic Vocabulary via Rule-Based String Interpolation]
    L --> M
    
    M --> N[Apply Lazy/Motivated Modifier to Calculate 95/5 Syntax Ratio]
    N --> O[Return 4-Layer Case Study JSON Payload]
    
    O --> P[Frontend Renders 4-Layer Interactive View]
    P --> Q1[Layer 1: Story Layer < 100 words narrative]
    P --> Q2[Layer 2: Discovery Layer Pseudo-code logic]
    P --> Q3[Layer 3: Application Layer Interactive Code with 5% blank]
    P --> Q4[Layer 4: Reflection Layer Socratic verification questions]
    
    Q3 --> R[Learner Types 5% Concept Syntax]
    R --> S{Syntax Valid?}
    S -- No --> T[Provide Pedagogical Hint without giving answer]
    T --> R
    S -- Yes --> U[Unlock Reflection Layer & Record Mastery/Belief State]
    U --> V[Update Local Contradiction Tracker & Suggest Next Rhizomatic Path]
```

---

## 2. Rule-Based Interpolation & Engine Pipeline

```mermaid
sequenceDiagram
    participant UI as React UI (/personalized-journey)
    participant API as Express Router (personalizedRoutes.js)
    participant Svc as Service Layer (PersonalizedService.js)
    participant Repo as Repository Layer (PersonalizedRepo.js)
    participant DB as Local Storage (personalized_templates.json)

    UI->>API: POST /api/personalized/generate (interest, role, slider, beliefs)
    API->>Svc: generateCaseStudy(payload)
    Svc->>Repo: getTemplatesAndDictionaries()
    Repo->>DB: Read JSON schema
    DB-->>Repo: Return Master Archetypes & Vocabularies
    Repo-->>Svc: Domain Data Objects
    
    Note over Svc: 1. Evaluate Contradiction Engine against userBeliefs<br/>2. Select Master Story Archetype<br/>3. Map Interest to Allowed Archetype<br/>4. Perform Deterministic String Interpolation<br/>5. Apply 95/5 Rule based on Lazy/Motivated Score
    
    Svc-->>API: Formatted 4-Layer Case Study Object
    API-->>UI: 200 OK (Story, Discovery, Application, Reflection)
    UI->>UI: Render 4-Layer Interface
```
