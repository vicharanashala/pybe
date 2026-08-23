# PyBe — Submission by Dishi Gupta

This folder contains my individual contribution to the PyBe Python learning app.

## Features Implemented

### 1. Voice Dictation
Added browser-native voice dictation (Web Speech API — no external key required) to all
three free-text session inputs: the reasoning prompt, the AI-mentor prompt, and the
reflection field. Includes a graceful fallback ("Voice input unavailable") for browsers
without SpeechRecognition support, so typing always continues to work.

### 2. New "Advanced" Difficulty Tier
Added a fourth difficulty tier — above Beginner, Explorer, and Builder — to house more
advanced, multi-step learning material.

### 3. Rosewood Manor — Chained Murder-Mystery Case Study
Built PyBe's first connected, multi-part scenario: a 6-part murder-mystery investigation
where the learner solves the case while learning progressively harder Python concepts —
string parsing, datetime handling and sorting, sets, and finally backtracking/recursion.
Each part is linked to the next via `storyId`, `order`, and `nextScenarioId`, with a
"Next Case File" flow taking the learner through the story to a final reveal.

### 4. Case Narrative & Detail
Wrote the full case content: the victim, five suspects with individual motives, household
witnesses, evidence, and the final solution — so the case is coherent and engaging, not
just abstract data to sort.

### 5. Concept-Aware Python Code Generation Fix
Fixed the Python code generator, which previously ignored each scenario's declared
concepts and fell back to printing just the scenario title. Code generation is now
concept-driven, covering all concepts used across the app's scenarios, including
recursion, backtracking, sets, sorting, and datetime handling.

## How to Run

```bash
npm run installAll
cp server/.env.example server/.env
npm run seed
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000/api

Seed data includes 36 scenarios: 30 standalone scenarios plus the 6-part Rosewood Manor case.