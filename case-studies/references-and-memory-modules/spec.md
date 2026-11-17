# spec.md — Technical Specification

## Author: Nikhil Kumar
## Feature: Memory Management & Physical Constraints Lab
## Project: Piway / PyBe Computational Thinking Engine

---

## 1. System Overview

The **Memory Management Lab** is a high-fidelity, interactive single-page application built with **React and Vite**. It translates the abstract mechanisms of Python runtime memory (heap allocations, object references, stack frames, and reference counting garbage collection) into concrete, visual, and interactive simulations.

### Key Architectural Tenets:
- **Zero External Server Dependency for Core Learning:** Runs entirely client-side using reactive state machines and Web Audio synthesis.
- **Glassmorphic Cyber-Industrial UI:** Built with custom vanilla CSS (`App.css`), glowing borders, micro-interactions, and responsive glass panels.
- **Multi-Modal Active Retrieval:** Combines story dilemma carousels, line-by-line memory inspectors, pre-flight intuition predictions, live hardware simulations, multi-format quizzes, and interactive code-slot patching challenges.

---

## 2. Technical Stack & Component Topology

```
client/
├── src/
│   ├── App.jsx                     # Top-level coordinator, global navigation & RAM bar state
│   ├── App.css                     # Design system, glassmorphism tokens, keyframe animations
│   ├── main.jsx                    # React 18 DOM mount point
│   ├── components/
│   │   ├── StorySlider.jsx         # 3-scene narrative modal with 3 structured breakdown cards
│   │   ├── Quiz.jsx                # Multi-format assessment engine (MCQ, Jumble, Fill-in-blank)
│   │   └── CodeSlotChallenge.jsx   # 🧩 Drag-and-drop interactive code patching challenge
│   ├── levels/
│   │   ├── Level1.jsx              # Pass-by-Reference & Object Referencing (Noticeboard Dilemma)
│   │   ├── Level2.jsx              # Mutable Objects & In-Place Updates (Canteen Wallet Rush)
│   │   ├── Level3.jsx              # Recursion: Call Stack Depth vs Heap (Harbor Master)
│   │   ├── Level4.jsx              # Garbage Collection & Reference Counting (Fest Check-in)
│   │   └── Level5.jsx              # Final Comprehensive Evaluation Mastery & Certification
│   └── utils/
│       └── audio.js                # Web Audio API synthesized sound generator (pops, thuds, chimes)
```

---

## 3. Core Component Specifications

### 3.1 StorySlider (`StorySlider.jsx`)
Presents the contextual dilemma before entering the simulation lab:
- **Navigation:** Arrow keys and keyboard listeners, progress indicator dots, and dynamic button actions.
- **Directional Horizontal Slide Animations:** Smooth CSS translate transitions (`.slide-from-left`, `.slide-from-right`).
- **Structured Point Cards (`renderFormattedText`):** Automatically parses semicolons (`;`) and colons (`:`) in Scene 2 text into 3 structured point cards:
  - Card 1: `💥 Memory Bloat` (impact on physical RAM at scale)
  - Card 2: `🔄 Data Desync` (inconsistencies between detached copies)
  - Card 3: `⏳ CPU / Hardware Lag` (avoidable allocation overhead and OOM crashes)
  - Features dedicated keyword-driven icon assignment, accent borders, and hover micro-animations.

---

### 3.2 Pre-Flight Hypothesis Prediction Card
Forces active cognitive retrieval before running code:
- **Behavior:**
  - Presents a concrete question: *"Before running code: What will happen in RAM when 1,000 students call copy.deepcopy()?"*
  - Provides two distinct choices (common beginner misconception vs actual physical RAM behavior).
- **Auto-Removal Mechanism:**
  - Wrapped conditionally in `{!prediction?.isCorrect && (...) }`.
  - If incorrect: displays helpful misconception feedback with a `🔄 Revise Hypothesis` button.
  - If correct: immediately unmounts from the DOM, unlocking the **"▶ Run Program"** execution button and clearing visual real estate for simulation analysis.

---

### 3.3 Interactive Code Line Inspector & 4-Step RAM Cards
Clicking any line in the Python code snippet reveals its exact physical execution breakdown across 4 distinct steps:
1. **1. Code (Python Execution):** What the Python interpreter executes at this line.
2. **2. RAM (In Physical RAM):** Physical memory address binding, pointer creation, or heap block allocation.
3. **3. Scale (At 1,000x Iterations):** Quantified resource multiplier when executed in loops.
4. **4. Rule (Key Architecture Rule):** The foundational computer science law governing the behavior.

---

### 3.4 Real-Time RAM Allocation Lab & Memory Box Tracker
The right-hand panel visualizes hardware memory consumption:
- **Live RAM Gauge (`RamBar`):** Real-time percentage indicator transitioning from Blue (<60%) to Amber (60-80%) to Flashing Red (>80%).
- **Visual Memory Floor:**
  - Level 1: Wooden noticeboard with sticky note pointers vs duplicate white paper sheets.
  - Level 2: Original wallet box with in-place coin increment counter vs cloned wallet dictionaries.
  - Level 3: Call stack depth bars vs warehouse crates.
  - Level 4: Active attendee cards vs severing pointer strings.
- **RAM Memory Box Tracker Table:** Displays memory addresses (e.g., `Location: 1000`), object types, byte sizes, and active referencing variables.

---

### 3.5 Post-Simulation Assessment Engine (`Quiz.jsx`)
Triggered via the **"Check Knowledge"** button after passing the optimized simulation:
- **Question Types:**
  1. **MCQs:** Conceptual reasoning questions with instant feedback.
  2. **Jumbled Syntax:** Interactive token sorting to reconstruct crucial memory commands (e.g., `wallet['balance'] += 20`).
  3. **Fill-in-the-Blank / Debugging:** Direct code completion (e.g., specifying built-in functions like `id` or operators like `+=`).

---

### 3.6 🧩 "Fix the Bug" Code Slot Challenge (`CodeSlotChallenge.jsx`)
Unlocked immediately after scoring 100% on the 3-question quiz:
- **Pedagogical Rationale:** Active coding retrieval; learners do not just observe optimized code—they physically patch the buggy snippet.
- **Workflow:**
  1. Learners view the naive buggy snippet with a missing highlighted code slot: `[ ??? CLICK OR DROP CODE BLOCK HERE ??? ]`.
  2. Three selectable replacement blocks are provided with hover states and badges (1 correct patch, 2 plausible traps).
  3. Learners click or drag the patch into the slot and click **"Run & Verify Patched Code"**.
  4. The engine simulates execution, verifies the patch against expected memory constraints, triggers success audio fanfare, and unlocks completion / next level.

---

### 3.7 Synthesized Web Audio API (`audio.js`)
Zero external `.mp3` or `.wav` dependencies; all sound effects are generated mathematically using HTML5 `AudioContext`:
- `playPop()`: Clean frequency ramp (400 Hz $\rightarrow$ 800 Hz) for UI button clicks.
- `playThud()`: Low-frequency sine thump (120 Hz $\rightarrow$ 40 Hz) when heavy memory allocations occur.
- `playSlideTransition(direction)`: Stereo frequency sweep indicating slide progression.
- `playSuccessChime()`: Multi-note arpeggiated major chord for quiz and patch completion.

---

## 4. Scenario Specifications

### Level 1: Pass By Reference (`Level1.jsx`)
- **Core Concept:** Python variables are pointers (memory addresses), not value copies.
- **Buggy Code:** `copy.deepcopy(announcement)` inside a 1,000-iteration loop allocating 20,000 GB of attempted RAM.
- **Patch:** `student_pointer = announcement` (binding to address `1000`).
- **RAM Baseline:** 20 GB master noticeboard + 0.01 GB lightweight pointers vs 20 GB duplicates.

### Level 2: In-Place Mutation (`Level2.jsx`)
- **Core Concept:** Mutable compound objects (dictionaries) can be updated in-place without reallocating heap memory.
- **Buggy Code:** `new_wallet = wallet.copy()`, discarding original address and desyncing callers.
- **Patch:** `wallet['balance'] += 20` (in-place modification preserving `id(wallet)`).
- **RAM Baseline:** Flat 20 MB memory footprint.

### Level 3: Call Stack vs Heap Space (`Level3.jsx`)
- **Core Concept:** Recursive execution stack frames vs heap object allocations.
- **Buggy Code:** Recursive list slicing allocating duplicate sub-arrays on each stack frame.
- **Patch:** In-place list mutation with `items.pop()`, preventing heap memory bloat.

### Level 4: Garbage Collection & Reference Counting (`Level4.jsx`)
- **Core Concept:** Python's GC reclaims objects when their reference count drops to zero.
- **Buggy Code:** Retaining attendee objects inside a global `sessions` list indefinitely.
- **Patch:** `del student` / removing global list bindings, allowing GC to free memory.

### Level 5: Final Comprehensive Evaluation Mastery (`Level5.jsx`)
- **Core Concept:** Full architectural synthesis across all 4 paradigms.
- **Assessment:** 10 questions covering MCQ, debugging, and syntax ordering.
- **Deliverable:** Generates an official Certificate of Mastery with verifiable score and completion timestamp.

---

## 5. Verification & Performance Benchmarks

- **Build Time:** $\approx 680\text{ ms}$ via Vite v8 production bundler (`dist/index.html`: 0.45 kB, JS chunk: $\approx 428\text{ kB}$).
- **Rendering Performance:** 60 FPS CSS transforms with zero DOM reflows during memory object rendering.
- **State Determinism:** Pure functional React state updates with predictable crash thresholds and instant HMR compliance.
