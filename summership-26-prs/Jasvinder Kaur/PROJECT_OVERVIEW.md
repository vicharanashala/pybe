# Project Overview: PyBe — Interactive Visual Learning Framework for Python Recursion

## Project Information

| Field | Details |
| :--- | :--- |
| **Project Name** | **PyBe: An Interactive Visual Learning Framework for Understanding Python Recursion** |
| **Developer Name** | `Jasvinder Kaur` |
| **Developer Email** | `kaurdetaur9718@gmail.com` |
| **Repository Type** | Full-Stack Web Application (React + Vite Frontend / Express Node.js Backend) |
| **Project Version** | `1.0.0` |

---

## 1. Short Description

**PyBe** is an interactive, visual educational web application designed to help computer science beginners master Python recursion. By combining full-screen visual storytelling, environmental text reveals, animated mirror portal transitions, a step-sequenced Python code execution engine with live call stack visualization, and automated conceptual assessment, PyBe converts the abstract and invisible mechanics of recursion into an engaging, multi-sensory learning experience.

---

## 2. Problem Statement

Recursion is widely recognized as one of the most difficult concepts for programming beginners. The core challenges include:

1. **Invisible Execution Process**: Unlike linear loops, recursive function calls and call stack frames exist invisibly inside system RAM during execution.
2. **Abstract Mental Models**: Students struggle to visualize how stack frames are pushed onto the call stack during self-calls and unwound during return phases.
3. **Passive Learning Materials**: Static textbook code snippets fail to show how execution flows line-by-line between the function call, the base case, and the return sequence.
4. **Base Case Confusion**: Beginners frequently omit or misconfigure base cases, leading to stack overflow errors (`RecursionError`) without understanding why.

---

## 3. Main Goal & Objectives

The primary objective of **PyBe** is to bridge the gap between abstract computer science theory and intuitive student comprehension.

### Key Objectives:
* **Visual Analogy**: Use an intuitive real-world analogy (facing mirrors creating infinite reflections) to explain self-reference and depth.
* **Line-by-Line Tracing**: Animate execution step-by-step to show exactly which line of Python code is executing at any given moment.
* **Call Stack Visibility**: Provide a live visual representation of call stack frames building up and unwinding in real time.
* **Mandatory Practice**: Require active code execution in a hands-on mission before students progress to evaluation.
* **Diagnostic Assessment**: Evaluate conceptual understanding through code-tracing questions and provide immediate feedback.

---

## 4. Key Features

### 🎬 Full-Screen Visual Storytelling & Mirror Analogy
* **7 Sequential Scenes**: Guides students step-by-step through *What is Recursion?*, *Recursive Call*, *Call Stack Depth*, *Base Case*, *Stack Unwinding*, *Python Implementation*, and *Recursion Challenge*.
* **Environmental Panel Reveals**: Information appears attached to scene objects via floating elements:
  * 📖 **Story Explanation**: Emerges as a Magical Floating Cloud (`.magical-cloud-panel`).
  * 🐍 **Python Concept**: Appears as a Holographic Code Panel (`.holographic-code-panel`).
  * 💡 **Key Takeaway**: Displays inside a Glowing Crystal Energy Bubble (`.glowing-crystal-panel`).
* **Cinematic Mirror Portal Transitions**: Transitioning between scenes triggers a portal zoom animation with concentric light rings and ripple waves (`PortalEffect.jsx`).

### 💻 Interactive "Mirror Mission" Coding Chamber
* **Syntax-Highlighted Editor**: Displays Python recursion code with line numbers and token coloring.
* **Execution Step-Sequencer**: Animates code execution step-by-step with an active line highlight and pulsing indicator (`exec-flash`).
* **Live Call Stack Visualizer**: Shows stack frames being pushed (`mirror(depth=5)` down to `mirror(depth=1)`), base case detection (`🛑 Base Case: depth == 0`), and return sequence unwinding.
* **Interactive Terminal**: Prints console output (`Reflection 5` down to `Reflection 1`) line-by-line with typewriter animations.
* **Mandatory Execution Gate**: Next/Enter controls remain locked until the student successfully runs the code experiment.

### 📝 Assessment & Progress Reporting
* **Recursion Mastery Check**: 3-pillar breakdown (*Recursive Self-Call*, *Base Case*, *Stack Unwinding*) before the quiz.
* **Code-Tracing & Conceptual Quiz**: 5 MCQ questions including code execution tracing (`count(3)` output prediction) with detailed explanations.
* **Academic Learning Progress Report**: Displays final score percentage, mastery rating (*Mastered*, *Proficient*, *Developing*, *Needs Review*), and a checklist of completed concepts.

### 🏗️ Technical Architecture Inspector
* Toggled via <kbd>I</kbd> key or top-right Info button. Explains the 5-layer application architecture.

---

## 5. How the Project Works

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           PyBe User Journey                             │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
 ┌───────────────────────────────────────────────────────────────────────┐
 │ 1. Welcome & Introduction (IntroScene.jsx)                            │
 │    Research Motivation · 5 Objectives · Keyboard / Button Start       │
 └───────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
 ┌───────────────────────────────────────────────────────────────────────┐
 │ 2. Visual Story Scenes 1–5 (CinematicScene.jsx)                       │
 │    Sub-step 0: Title → Sub-step 1: Story Cloud →                     │
 │    Sub-step 2: Python Hologram → Sub-step 3: Key Idea Crystal        │
 └───────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
 ┌───────────────────────────────────────────────────────────────────────┐
 │ 3. Mirror Portal Transition (PortalEffect.jsx)                        │
 │    Concentric Light Rings · Ripple Wave · Portal Exit/Entry Zoom      │
 └───────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
 ┌───────────────────────────────────────────────────────────────────────┐
 │ 4. Coding Mission Experiment (InteractivePlayground.jsx)              │
 │    Run Python mirror(5) · Line Highlighting · Call Stack & Terminal  │
 │    [Next Button Locked Until Successfully Executed]                  │
 └───────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
 ┌───────────────────────────────────────────────────────────────────────┐
 │ 5. Mastery Check & Assessment (ConceptSummary.jsx & Quiz)             │
 │    3 Pillars Review → 5 MCQs (Code Tracing) → Detailed Feedback     │
 └───────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
 ┌───────────────────────────────────────────────────────────────────────┐
 │ 6. Academic Learning Report (LearningReport.jsx)                      │
 │    Score Percentage · Mastery Level · Concepts Checklist              │
 └───────────────────────────────────────────────────────────────────────┘
```

1. **State Machine**: `App.jsx` tracks `appPhase` (`intro` or `lessons`), `imageIndex` (0–6), and `subStep` (0–5).
2. **Navigation**: Pressing <kbd>Enter</kbd>, <kbd>→</kbd>, or clicking the screen advances the sub-step.
3. **Execution Sequencer**: Running code in Scene 6 executes a deterministic timer chain that updates `activeLines`, `stackLevels`, and `outputLines` sequentially.
4. **Evaluation Engine**: `RecursionChallengeQuiz.jsx` checks student responses against correct option indices and calculates percentage score.

---

## 6. Technologies & Frameworks Used

### Frontend Stack:
* **React 18**: UI component composition and state management (`useState`, `useEffect`, `useCallback`, `useRef`).
* **Vite 6**: Next-generation frontend build tool and local development server.
* **Tailwind CSS (CDN)**: Layout utility classes and typography styling.
* **Custom Vanilla CSS**: Design system with HSL tokens, glassmorphic filters (`backdrop-filter`), keyframe animations, and custom scrollbars (`src/index.css`).
* **Lucide React**: Modern iconography library.
* **Canvas Confetti**: Visual celebration effects upon quiz submission.

### Backend Stack:
* **Node.js**: JavaScript runtime environment.
* **Express 4**: Web framework serving health check (`/api/health`) and Python execution trace sandbox (`/api/execute`) endpoints.
* **CORS**: Cross-Origin Resource Sharing middleware.
