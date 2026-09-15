<h1 align="center">🧠 PyBe: Iteration & Loop Controls Module</h1>

<p align="center">
  <strong>An advanced interactive learning engine module for the PyBe platform.</strong><br/>
  <em>Designed to teach Python Loops (For/While) through highly engaging, scenario-based problem solving with a unified 4-step pedagogical UI.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Topics-Iteration-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/UI_Architecture-Ultimate_Merge-06B6D4?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Case_Studies-1-61DAFB?style=for-the-badge" />
</p>

---
## 🌟 Overview

This feature branch introduces a completely revamped **Interactive Slideshow UI** (The "Ultimate Merge" architecture) for PyBe's Case Study Learning Engine. 

Instead of disjointed pages, learners now experience a fluid, beat-by-beat progression guided by a **Sticky Progress Toolbar**. The engine evaluates and polishes concepts by moving learners through 4 distinct stages:

1. **The Story** (Concrete Experience)
2. **The Logic** (Abstract Conceptualization)
3. **Concept Check** (Active Retrieval)
4. **Code Challenge** (Active Experimentation)

---
## 👥 Team Members

| Name | Email | Contribution |
| :--- | :--- | :--- |
| **Neeraj Agrawal** | neerajagrawal689@gmail.com | Entire UI architecture ("Ultimate Merge" unified UI, Sticky Progress Toolbar) and Case Study on The Cricket Chase. |
| **Shyam Sundar Sharma** | ssharma08550@gmail.com | Overall maintain the project, debugging errors, and documentation. |

---
## 📖 Table of Contents

- [1. Pedagogical Framework & UI Innovation](#-1-pedagogical-framework--ui-innovation)
- [2. Codebase Structure](#-2-codebase-structure)
- [3. How Case Studies Are Designed](#-3-how-case-studies-are-designed)
- [4. Content Coverage (Iteration)](#-4-content-coverage-iteration)

---

## 🎓 1. Pedagogical Framework & UI Innovation

This module builds upon Kolb's Experiential Learning Cycle and Vygotsky's Zone of Proximal Development, but enhances it with a **zero-friction UI**.

### The "Ultimate Merge" Architecture
Previously, learning stages were separated. This project introduces a **Beat-based Slideshow System**:
- **Sticky Progress Toolbar:** A persistent top navigation bar that highlights the current stage (Story, Logic, Check, Code) and allows jumping back to review past material.
- **Micro-Learning Beats:** Heavy concepts are broken down into 12 to 15 bite-sized "beats" (slides) to completely eliminate cognitive overload.
- **Strict Mastery Progression:** Users cannot proceed past Concept Checks or Code Challenges until they provide the correct answer, ensuring true mastery before moving forward.

---

## 🗂️ 2. Codebase Structure

The feature is built using a modern React frontend (Vite) and Node.js/Express backend. 

### Core Components (`client/src/components/`)

| File | Responsibility |
|---|---|
| **`CaseStudyOne.jsx`** | Implements the **"The Cricket Chase"** scenario teaching `for` vs `while` loops. Features a 15-beat slideshow, balanced quizzes, and 2 progressive code challenges. |

*Note: Both components utilize `framer-motion` for smooth slide transitions and `lucide-react` for intuitive iconography.*

---

## 📐 3. How Case Studies Are Designed

Every case study in this module runs through the **4-Stage Engine**:

```
┌────────────────────────────────────────────────────────┐
│  STAGE 1: The Story (Visual Context)                   │
│  • Introduces the pain point in plain English          │
│  • Visual anchor (e.g., Cricket Match)                                 │
├────────────────────────────────────────────────────────┤
│  STAGE 2: The Logic (Concept Reveal)                   │
│  • Progressive disclosure of Python syntax             │
│  • Side-by-side comparison (e.g., for vs while)        │
├────────────────────────────────────────────────────────┤
│  STAGE 3: Concept Check (Logic Test)                   │
│  • Balanced multiple-choice questions                  │
│  • "Next" button disabled until correct answer is hit  │
├────────────────────────────────────────────────────────┤
│  STAGE 4: Code Challenge (Execution)                   │
│  • Basic Challenge: Fill-in-the-blanks for basic flow  │
│  • Mid-Level Challenge: Apply concepts to new problem  │
└────────────────────────────────────────────────────────┘
```

---

## 📊 4. Content Coverage (Iteration)

### Topic: Iteration & Loop Controls

| Case Study | Concept Taught | Scenario | Challenges |
|---|---|---|---|
| **Case Study One** | `for` vs `while` loops | **The Cricket Chase:** Bowling 6 balls (known repetitions = `for`) vs chasing a target score (unknown repetitions = `while`). | 1. Basic loop creation<br>2. Umpire countdown (Mid-Level) |

---
<p align="center">
  <strong>Built for PyBe — Python, By Experience.</strong>
</p>
