# PyBe v2.0 — System Architecture & Technical Manual

**Pedagogical Story & Concept-to-Code Intelligence Engine (CKLIS)**

---

## 1. System Overview & Pedagogical Philosophy

**PyBe** is a state-of-the-art learning intelligence engine designed to bridge real-world physical observations, historical anecdotes, and natural phenomena directly to computer science principles and programming constructs.

Rather than relying on artificial code analogies or forced metaphors (*e.g., comparing variables to post-office boxes or traffic lights*), PyBe operates on a strict **Constitutional Framework (18 Constitutional Laws CL-01 through CL-18)** that guarantees **100% real-world physical and historical fidelity**.

### Key System Capabilities
- **Dual-Mode Intake**: Supports both *Topic-First Discovery* (CS concept → auto-find story) and *Experience-First Anchor Lock* (Custom story/fable → lock story & extract concept).
- **Canonical Story Grounding Engine**: Preserves real character names, plot structures, and physical laws for fables (*Vikram & Betaal, Akbar & Birbal, The Thirsty Crow, Tenali Raman, Panchatantra*).
- **Code-at-the-End Staging (CL-17)**: Panels 1 to N-1 focus 100% on pure narrative immersion. Executable Python code snippets and concept callouts appear strictly on the final scene.
- **Authentic Variable Mapping**: Replaces generic pseudocode (`perform_story_action()`) with story-native physical state variables (`water_level = 0.2`, `pebbles_dropped += 1`, `betaal_captured = True`).
- **Resilient Multi-Provider LLM Engine**: Automatic rotation and sliding window cooldown across Groq (`llama-3.3-70b-versatile`), Gemini 2.0 Flash, MiniMax, and Kimi with automatic failover.

---

## 2. System Architecture & Pipeline Flow

PyBe processes learning requests through a **4-Pass Pipeline** managed by the CKLIS Orchestrator ([`cklisOrchestrator.ts`](../MVP/src/server/cklisOrchestrator.ts)):

```
                                ┌─────────────────────────────────────────┐
                                │             USER INTAKE MODE            │
                                └────────────────────┬────────────────────┘
                                                     │
                      ┌──────────────────────────────┴──────────────────────────────┐
                      ▼                                                             ▼
         🎯 TOPIC-FIRST INTAKE                                        📖 EXPERIENCE-FIRST INTAKE
  (Provide CS Concept → Auto-Discover Story)                  (Provide Observation → Anchor Lock Story)
                      │                                                             │
                      └──────────────────────────────┬──────────────────────────────┘
                                                     │
                                                     ▼
                                     ┌───────────────────────────────┐
                                     │ CKLIS 4-PASS REASONING ENGINE │
                                     └───────────────┬───────────────┘
                                                     │
               ┌─────────────────────────────────────┼─────────────────────────────────────┐
               ▼                                     ▼                                     ▼
     PASS 1: FOUNDATION                    PASS 2: NARRATIVE                     PASS 3: STUDIO
   • Misconceptions (MC-01)               • Pattern Mapping                     • Short Comic (1-Page)
   • Mental Model (MT-01)                 • Episode Sequencing                  • Long Comic (Multi-Page)
   • Scenario Anchor Lock                                                       • Video Script (3D Motion)
                                                                                • Split-Screen Storybook
                                                                                • Audio Podcast
                                                     │
                                                     ▼
                                     ┌───────────────────────────────┐
                                     │ PASS 4: QUALITY ENGINE AUDIT  │
                                     │ • Constitution Score (0-100)  │
                                     │ • Learning Science Score      │
                                     └───────────────────────────────┘
```

---

## 3. Core Engine Components

### 3.1 CKLIS Orchestrator (`cklisOrchestrator.ts`)
- Manages SSE (Server-Sent Events) streaming to `http://localhost:3000/api/cklis/stream`.
- Controls step-by-step progress notifications (`STEP_1_MISCONCEPTION`, `STEP_2_MENTAL_MODEL`, `STEP_3_SCENARIO`, `STEP_4_PATTERN`, `STEP_5_EPISODE`, `STEP_6_PRODUCTION`, `STEP_7_QUALITY`).

### 3.2 Canonical Story Grounding Engine (`knowledgeLoader.ts`)
- Grounded in authentic story sources ([*KidsGen Betal Pachisi Tales*](https://www.kidsgen.com/stories/betal-pachisi/#tales)).
- Enforces inviolable story rules:
  - **Vikram & Betaal**: King Vikramaditya captures Betaal from the banyan tree in a dark cremation ground; Betaal narrates a riddle tale. If Vikram speaks, Betaal laughs and flies back (`while betaal_captured: betaal.tell_story(); if silence_broken: betaal.fly_back()`).
  - **The Thirsty Crow**: Volume displacement loop (`while water_level < REACHABLE: drop_pebble(); water_level += 0.2`).
  - **Akbar & Birbal**: Emperor Akbar poses court decree; Birbal tests physical invariant to prove truth.

### 3.3 Representation Processors (`representationProcessors.ts`)
Generates 5 presentation outcomes:
1. **Short Comic (1-Page)**: 4–5 panels with copyable AI image prompts and Python code on final panel.
2. **Long Comic (Multi-Page)**: CP1 Blueprint → CP2 Script generation.
3. **Video Script**: VP1 Blueprint → VP2 SnapGenAI 3D motion scene breakdown.
4. **Split-Screen Storybook**: Visual narrative + Code Concept Bridge + Python Snippet.
5. **Audio Podcast**: Scripted dialogue between Educational Host (*Alex*) and Co-Host (*Dr. Sam*).

### 3.4 Multi-Provider LLM Client (`llmClient.ts`)
- Multi-provider support: Groq (`llama-3.3-70b-versatile`), Gemini 2.0 Flash, MiniMax, Kimi.
- Sliding window key cooldown mechanism with 2s–4s pacing delays between passes to guarantee 0 rate-limit crashes (`429`).

---

## 4. UI Defensive Safeguards

To ensure absolute UI stability, PyBe implements two defensive layers in the frontend ([`DeliverableViewer.tsx`](../MVP/src/components/DeliverableViewer.tsx) and [`App.tsx`](../MVP/src/App.tsx)):
1. **React ErrorBoundary**: Catches unexpected runtime render exceptions without blanking the screen.
2. **`renderSafeText(...)` Helper**: Safely stringifies complex LLM objects/arrays so React never throws `Objects are not valid as a React child`.
