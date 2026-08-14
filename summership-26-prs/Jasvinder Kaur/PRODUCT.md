# Product Specification: PyBe (Interactive Recursion Adventure)

## 1. Product Name
**PyBe** (*Python Beginner Educational Framework for Interactive Recursion*)

---

## 2. Product Overview
**PyBe** is a web-based interactive learning framework designed to make Python recursion intuitive, visual, and measurable for computer science beginners. The application replaces passive text reading with a cinematic, step-by-step presentation flow where students explore visual analogies, observe animated call stack mechanics, execute live code experiments, and verify their knowledge through diagnostic evaluations.

---

## 3. Target Users

| User Persona | Profile & Needs |
| :--- | :--- |
| **Introductory CS Students** | Students taking their first Python or Data Structures course who find abstract recursion concepts confusing. |
| **Self-Taught Developers** | Bootcamp or online learners needing an intuitive mental model of call stacks and memory allocation. |
| **CS Educators & Tutors** | Professors and teaching assistants seeking a visual demonstration tool for lectures and lab assignments. |

---

## 4. User Problem & Pain Points

1. **High Cognitive Load**: Understanding recursion requires keeping track of multiple pending function calls simultaneously in memory.
2. **Invisible Stack Dynamics**: Standard code editors show code statically; students cannot see stack frames being pushed or popped.
3. **Passive Reading Habit**: Students often skip reading long text explanations and attempt quizzes without understanding execution flow.
4. **Fear of Infinite Recursion**: Beginners struggle to identify base cases and get intimidated by stack overflow errors (`RecursionError`).

---

## 5. Proposed Solution
PyBe solves these pain points through a 4-pillar product strategy:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PyBe Product Strategy                              │
├──────────────────────┬──────────────────────┬───────────────────────────────┤
│ 1. VISUAL ANALOGY    │ 2. STEP SEQUENCER    │ 3. ACTIVE GATING              │
│ Facing mirrors creating│ Line-by-line code   │ Coding mission must be run    │
│ infinite reflections │ execution + call stack│ before quiz unlocks           │
└──────────────────────┴──────────────────────┴───────────────────────────────┘
```

* **Cognitive Anchoring**: Anchoring self-call logic to facing mirror reflections.
* **Visualizing the Invisible**: Rendering stack frames as interactive cards that grow during calls and shrink during unwinding.
* **Enforced Active Learning**: Locking progression until the student runs and observes the execution trace.
* **Immediate Feedback**: Displaying per-question explanations after quiz answers.

---

## 6. Main User Journey & Workflow

```
[ Welcome Scene ] ──> [ Scenes 1–5 Visual Journey ] ──> [ Scene 6 Mirror Mission ]
                                                                   │
                                                                   ▼
[ Learning Report ] <── [ Scene 7 Quiz Assessment ] <── [ Scene 7 Mastery Check ]
```

1. **Introduction Phase**: Student reviews research objectives and clicks "Begin Learning Adventure" (or presses <kbd>Enter</kbd>).
2. **Visual Analogies (Scenes 1–5)**: Student progresses through full-screen visual scenes. Pressing <kbd>Enter</kbd> reveals story, Python concept, and key takeaway inside floating environmental panels.
3. **Mirror Portal Transition**: Moving between scenes plays a glowing mirror portal zoom animation.
4. **Mirror Mission (Scene 6)**: Student enters the glass coding chamber, clicks "Run Code", observes line highlighting and stack frame allocation, and triggers the completion card. Next button unlocks.
5. **Mastery Check (Scene 7, Part 1)**: Student reviews the 3 Pillars of Recursion.
6. **Quiz Assessment (Scene 7, Part 2)**: Student completes 5 questions (conceptual + code output tracing) and receives instant explanations.
7. **Progress Report**: Student views their final score, percentage, mastery rating (*Mastered*, *Proficient*, *Developing*, *Needs Review*), and completed concepts.

---

## 7. Core Product Features (Actual Implemented Features)

### Feature 1: Multi-Step Environmental Reveal System
* **Implementation**: `CinematicScene.jsx` + `index.css`
* **Details**: Replaces center modal popups with object-attached floating panels (`.magical-cloud-panel`, `.holographic-code-panel`, `.glowing-crystal-panel`) that preserve image visibility while delivering structured content.

### Feature 2: Animated Mirror Portal Transition Engine
* **Implementation**: `PortalEffect.jsx` + CSS `@keyframes mirrorPortalZoomExit` / `mirrorPortalEmergence`
* **Details**: Plays a camera zoom effect into the mirror reflection with expanding concentric light rings and ripple waves whenever scene index changes.

### Feature 3: Interactive Python "Mirror Mission" IDE
* **Implementation**: `InteractivePlayground.jsx`
* **Details**: Includes syntax-highlighted editor, active line cursor (`exec-flash`), step-by-step timer execution, call stack frame container, and line-by-line terminal output console.

### Feature 4: Progression Lock Gate
* **Implementation**: `App.jsx` (`codingMissionDone` state)
* **Details**: Locks the "Next" button and disables <kbd>Enter</kbd> key progression on Scene 6 until the student executes the code experiment.

### Feature 5: 3 Pillars Mastery Check
* **Implementation**: `ConceptSummary.jsx`
* **Details**: Interactive cards highlighting *Recursive Call*, *Base Case*, and *Stack Unwinding* with code snippets.

### Feature 6: Code-Tracing & MCQ Assessment Engine
* **Implementation**: `RecursionChallengeQuiz.jsx`
* **Details**: Evaluates theoretical knowledge and code prediction (e.g. `count(3)` output order) with immediate feedback and explanation boxes.

### Feature 7: Academic Learning Progress Report
* **Implementation**: `LearningReport.jsx`
* **Details**: Summarizes assessment score, percentage, mastery level classification, concept checklist, and next-step recommendations.

### Feature 8: Technical Architecture Modal
* **Implementation**: `ArchitecturePanel.jsx`
* **Details**: Explains the system's 5-layer design stack; toggling via <kbd>I</kbd> key or floating info button.

---

## 8. Benefits & Value Provided

* **For Students**: Intuitive mental model of recursion, reduced anxiety regarding stack overflow errors, active learning through mandatory execution.
* **For Educators**: Zero-setup visual tool for live classroom demonstrations and self-paced student homework.
* **For Institutional Evaluation**: Clear assessment metrics and learning reports demonstrating outcome-based learning.

---

## 9. Important Product Decisions

1. **Environmental Panels vs. Center Popups**: Placing text cards on the sides attached to visual objects keeps the central illustration visible at all times.
2. **Gated Progression**: Requiring code execution before unlocking the quiz prevents passive skimming and enforces active engagement.
3. **Deterministic Client-Side Sequencer**: Running code tracing client-side via a timed step-sequencer ensures instant animation feedback without network latency or heavy Pyodide WASM overhead.
4. **Single-Viewport Layout**: Capping the coding chamber height at 72vh (`max-height: calc(100vh - 130px)`) ensures all controls remain visible without whole-page scrollbars.

---

## 10. Current Limitations

1. **Fixed Starter Code**: The current coding mission features a pre-configured `mirror(depth)` function; arbitrary Python code editing is not fully parsed into a dynamic AST tree.
2. **Client-Side Simulation**: Code execution tracing is simulated via a step-sequencer rather than executing a full server-side Python runtime or Pyodide WebAssembly container.
3. **Session-Based State**: User progress (`subStep`, `score`, `xp`) is maintained in React state and resets if the browser is refreshed.

---

## 11. Possible Future Improvements

1. **WASM / Pyodide Integration**: Embedding Pyodide to allow students to write and execute arbitrary Python scripts with dynamic AST call stack generation.
2. **Multi-Algorithm Library**: Expanding beyond `mirror()` to include visual modules for Fibonacci, Factorial, Binary Search, and Tower of Hanoi.
3. **Backend User Authentication & Analytics**: Connecting the Node.js/Express backend to a database to save student quiz scores, track time-on-task, and provide teacher dashboards.
