# PyBe v2.0 — Prompt & Usage Guide

This guide details the dual intake modes, sample user prompts, custom story grounding guidelines, and UI studio features for **PyBe (CKLIS Intelligence Engine)**.

---

## 1. Dual Intake Modes

PyBe supports two distinct learning intake workflows ([`LesForm.tsx`](../MVP/src/components/LesForm.tsx)):

### Mode 1: 🎯 Topic-First Intake (Learn a CS Concept)
- **Use Case**: You want to learn or teach a computer science topic (*e.g., If-Else Statements, Accumulator Loops, Recursion, SQL JOINs*).
- **How it Works**: You provide the CS topic and an optional environment setting (*e.g., "Indian Historical Places", "Space Exploration"*). PyBe auto-discovers an authentic domain story or historical anecdote that naturally models the concept.
- **Example Input**:
  - **Topic**: `What is an If-Else Statement`
  - **Environment**: `Indian Historical Places (Mughal Court)`

---

### Mode 2: 📖 Experience-First Story Anchor Lock (Learn from Real Story / Observation)
- **Use Case**: You have a specific fable, real story, or physical observation (*e.g., Vikram & Betaal, The Thirsty Crow, Akbar & Birbal*) and want PyBe to extract the underlying CS concept.
- **How it Works**: You enter your story narrative in the *Story / Physical Observation* box. PyBe locks your story 100% (under Constitutional Laws CL-14 and CL-18) and maps its physical actions line-by-line to Python code.
- **Example Input**:
  - **Story / Observation**: `King Vikramaditya captures Betaal from the banyan tree and carries him in silence. Betaal tells a riddle. If Vikram speaks, Betaal flies back to the banyan tree.`
  - **Target Concept**: `State Machine Loops & Conditionals`

---

## 2. Sample Presets for Testing

PyBe comes pre-configured with 4 one-click demonstration presets:

| Preset Name | Topic | Story Anchor | Target CS Concept |
| :--- | :--- | :--- | :--- |
| **1. The Thirsty Crow** | State Transitions & Accumulator Loops | The Thirsty Crow Fable | While-Loop Volume Displacement (`water_level += 0.2`) |
| **2. Vikram and Betaal** | Control Flow & Invariant State Machines | Betal Pachisi Fable | Silence Invariant Gate (`if silence_broken: betaal.fly_back()`) |
| **3. Akbar and Birbal** | Conditional Logic & Boundary Testing | Court of Emperor Akbar | If-Else Decision Gate (`verify_court_claim()`) |
| **4. Vijaya Stambha** | Stack Unwinding & Recursive Depth | Vijaya Stambha Tower | Recursive Stack Call (`solve_recursive_step()`) |

---

## 3. Custom Story Grounding Guidelines

When providing a custom story or fable in Mode 2, follow these guidelines for best results:

1. **Include Physical Actions**: Mention physical state changes (*e.g., dropping pebbles, filling water, opening gates, breaking silence*).
2. **Include Character Names**: Use authentic real names (*e.g., King Vikram, Betaal, Emperor Akbar, Birbal, Tenali Raman*).
3. **Specify the Dilemma or Condition**: State clearly what triggers a state transition (*e.g., "If the king speaks", "When water reaches beak height"*).

---

## 4. UI Studio Outcome Inspection

Once generation completes:
- **Interactive Viewer Tab**: Use the left/right carousel arrows to step through visual story scenes. Notice that early panels focus on pure story narrative, while the **final scene** reveals the Code Concept Invariant Badge and Executable Python Code Snippet with a **Copy Code** button.
- **📜 Full Script Tab**: View the complete publication-ready markdown output.
- **🏛️ Full Blueprint Tab**: Inspect character bibles, environment setup, and pedagogical objectives.
- **PyBe Internal Educational Reasoning Context**: Expand the bottom drawer to audit all 7 CKLIS reasoning steps, including Misconception Taxonomy (MC-01), Mental Model Taxonomy (MT-01), and Quality Engine Scores (Q1 to Q4).
