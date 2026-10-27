# Product Document: The Smart Factory Assembly Line

## 1. Problem Statement
Learners who understand loops and functions frequently struggle to understand *lazy evaluation* and *generators*. They know the keyword `yield` exists, but cannot explain how it differs from `return`, why it remembers internal variables, or when to choose a generator over a list comprehension.

## 2. Target Audience
* Early-to-intermediate Python students (introductory computer science, engineering, or data analytics).
* Learners transitioning from basic scripts to data-heavy or memory-constrained applications.

## 3. Product Architecture & User Journey

The module is structured as a guided 6-phase discovery journey:

```text
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ 1. The Incident │ ──> │ 2. The Diagnosis│ ──> │ 3. Physical     │
│ (Memory Crash)  │     │ (RAM Overload)  │     │    Conveyor     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ 6. Real-World   │ <── │ 5. Python Syntax│ <── │ 4. Interactive  │
│    Challenge    │     │    (yield/next) │     │    Simulation   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Stage 1: The Factory Floor Crisis
* **Scenario:** Shift Supervisor Sharma at Precision Motors calls in panic. The automated vibration detection workstation just crashed with a blue-screen `MemoryError` right in the middle of a high-priority production run of 100,000 engine bearings.
* **Learner Action:** Inspect the junior engineer's code snippet (`all_readings = [] ... return all_readings`).

### Stage 2: Diagnosing Memory Consumption
* **Socratic Interaction:** The learner compares storing 1,000,000 floating-point sensor tuples in a list (~80 MB) vs. passing 1 item at a time (~128 bytes).
* **Key Realization:** The inspection station only ever needs to inspect **one bearing at a time**. Why store all 100,000 in RAM simultaneously?

### Stage 3: The Conveyor Belt Paradigm Shift
* **Mental Model:** Contrast the "Warehouse Staging Area" with a "Continuous Conveyor Belt".
* **Interactive Element:** A visual conveyor simulation showing parts generated on-demand.

### Stage 4: Interactive Simulation (`next()` in action)
* **Mechanic:** The learner presses the `[ Pull Lever : next() ]` button to advance the conveyor belt.
* **Observation:** Notice how the function pauses at `yield`, maintains its internal counter, and returns control to the inspector without losing its place.

### Stage 5: Code Reveal & Mechanics
* Direct side-by-side comparison between `return` (destroy function frame) and `yield` (freeze function frame).
* Handling the end of stream: Catching `StopIteration` behind the scenes.

### Stage 6: The Quality Control Challenge
* A short, interactive multi-choice challenge testing retention of lazy evaluation vs eager evaluation.
* Certificate / Completion badge: *"Certified Precision Stream Engineer"*.

## 4. Technical Specifications
* **Frontend:** Zero-dependency Vanilla HTML5, CSS3, and modern JavaScript (ES6+).
* **Offline Compatibility:** Works directly by opening `index.html` in any modern web browser without internet or a node server.
* **Companion Python Engine:** Pure standard-library Python 3 (`sys`, `time`, `tracemalloc`, `unittest`).
