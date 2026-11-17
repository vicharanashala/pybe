<h1 align="center">🧠 PyBe: Loop Controls & Nested Loops Module</h1>

<p align="center">
  <strong>An advanced interactive learning engine module for the PyBe platform.</strong><br/>
  <em>Designed to teach Python Loop Controls (Break/Continue) and Nested Loops through highly engaging, scenario-based problem solving with a unified 4-step pedagogical UI.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Topics-Iteration-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/UI_Architecture-Ultimate_Merge-06B6D4?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Case_Studies-2-61DAFB?style=for-the-badge" />
</p>

---
## 🌟 Overview

This standalone project introduces a completely revamped **Interactive Slideshow UI** (The "Ultimate Merge" architecture) for PyBe's Case Study Learning Engine. 

Instead of disjointed pages, learners now experience a fluid, beat-by-beat progression guided by a **Sticky Progress Toolbar**. The engine evaluates and polishes concepts by moving learners through 4 distinct stages:

1. **The Story** (Concrete Experience)
2. **The Logic** (Abstract Conceptualization)
3. **Concept Check** (Active Retrieval)
4. **Code Challenge** (Active Experimentation)

---
## 👥 Team Members

| Name | Role | Contribution |
| :--- | :--- | :--- |
| **Neeraj Agrawal** | Sole Author & Developer | Developed the "Ultimate Merge" unified UI, designed and implemented both interactive case studies (Note Counter & Cinema Hall), built the Express backend API, and managed all documentation and project architecture. |

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
- **Micro-Learning Beats:** Heavy concepts are broken down into bite-sized "beats" (slides) to completely eliminate cognitive overload.
- **Strict Mastery Progression:** Users cannot proceed past Concept Checks or Code Challenges until they provide the correct answer, ensuring true mastery before moving forward.

---

## 🗂️ 2. Codebase Structure

The feature is built using a modern React frontend (Vite) and Node.js/Express backend. 

### Core Components (`client/src/components/` & `server/`)

| File/Folder | Responsibility |
|---|---|
| **`CaseStudyOne.jsx`** | Implements the **"The Note Counter"** scenario teaching `break` vs `continue`. Features banking-themed quizzes and code challenges. |
| **`CaseStudyTwo.jsx`** | Implements the **"The Cinema Hall"** scenario teaching Nested Loops. Features row/seat grid visualizations and nested logic challenges. |
| **`server/server.js`** | An Express backend providing a REST API (`/api/quiz` and `/api/submit`) to securely deliver questions and validate answers. |

*Note: The frontend utilizes `framer-motion` for smooth slide transitions and `lucide-react` for intuitive iconography.*

---

## 📐 3. How Case Studies Are Designed

Every case study in this module runs through the **4-Stage Engine**:

```
┌────────────────────────────────────────────────────────┐
│  STAGE 1: The Story (Visual Context)                   │
│  • Introduces the pain point in plain English          │
│  • Visual anchor (e.g., Bank Machine, Cinema Hall)     │
├────────────────────────────────────────────────────────┤
│  STAGE 2: The Logic (Concept Reveal)                   │
│  • Progressive disclosure of Python syntax             │
│  • Visualizing step-by-step loop execution             │
├────────────────────────────────────────────────────────┤
│  STAGE 3: Concept Check (Logic Test)                   │
│  • Balanced multiple-choice questions fetched from API │
│  • "Next" button disabled until correct answer is hit  │
├────────────────────────────────────────────────────────┤
│  STAGE 4: Code Challenge (Execution)                   │
│  • Basic Challenge: Fill-in-the-blanks for basic flow  │
│  • Mid-Level Challenge: Apply concepts to new problem  │
└────────────────────────────────────────────────────────┘
```

---

## 📊 4. Content Coverage (Iteration)

### Topic: Iteration (Loop Controls & Nested Loops)

| Case Study | Concept Taught | Scenario |
|---|---|---|
| **Case Study One** | Loop Controls (`continue`, `break`) | **The Note Counter:** Skipping a torn note (`continue`) vs halting for a fake note (`break`). |
| **Case Study Two** | Nested Loops | **The Cinema Hall:** Cleaning seats across multiple rows. The outer loop (Rows) waits for the inner loop (Seats) to finish. |

---
<p align="center">
  <strong>Built for PyBe — Python, By Experience.</strong>
</p>
