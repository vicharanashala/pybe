<h1 align="center">🏰 The Grand Royal Vault</h1>

<p align="center">
  <strong>A feature of the PyBe platform.</strong><br/>
  <em>An interactive, story-first learning engine that teaches Python foundational logic through the historical Tenali Rama folktale "The Thieves at the Well" — logic builds the narrative, and Python syntax executes it.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Acts-5-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Logical_Concepts-5-06B6D4?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Interactive_MCQs-5-61DAFB?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Coding_Trials-5-F59E0B?style=for-the-badge" />
</p>

---

## 📖 Overview

"The Grand Royal Vault" is an interactive lesson engine integrated into PyBe. 

The engine teaches **foundational computer science logic** by first telling a complete story—the famous Tenali Rama folktale of the Thieves at the Well—and mapping each story action to a core programming principle.

- **5 narrative Acts** guided by a paginated, linear progression system.
- **Cinematic visual presentation** utilizing 8k photorealistic imagery.
- **Story-first pedagogy** where learners deduce logic through interactive MCQs before ever seeing code.
- **The Royal Coding Trials**, a culminating challenge where learners translate their narrative understanding into Python syntax.

The learner does not start by memorizing syntax. They start with a moonlit garden, a heavy bucket, and a group of exhausted thieves—the Python keywords arrive only after the logic is fully understood.

---

## 👥 Project Information

| Field | Details |
| :--- | :--- |
| **Institution** | SGSITS College, Indore |
| **Program** | B.Tech Biomedical Engineering |
| **Enrollment No.** | 0801Bm231062 |

---

## 🎓 1. Pedagogical Framework & Methodology

PyBe's design draws on modern educational frameworks, specifically designed to reduce cognitive load for non-traditional CS beginners.

### 1. Narrative Mapping (The Logic Bridge)
The core innovation: **the logic is inherent in the action.** The folktale is taught first, in plain words. Only when the story is complete are the actions mapped to Python logic:

| Story Action | Narrative Purpose | Python Concept |
| :--- | :--- | :--- |
| **Establishing a routine** | Creating a repeatable task using the bucket. | Functions & Parameters |
| **Handing off the bucket** | Splashing water is useless; the physical item must be delivered. | Return Values |
| **Assuming the target** | Watering the mango tree by default to save time. | Default Arguments |
| **Finding a coin** | A private discovery isolated from the main treasure. | Variable Scope |
| **The stopping rule** | Pulling the bucket *until* it hits dry dirt. | Recursion (Base Cases) |

### 2. Cognitive Load Theory
The lesson manages cognitive load by separating abstract logic from technical syntax:
- **Logic Phase:** The user focuses purely on reading comprehension and deduction.
- **Syntax Phase:** Only after the logic is mastered in the "Epilogue" are the syntax rules introduced in the coding trials.

### 3. Vygotsky's Zone of Proximal Development (ZPD)
The MCQ system acts as scaffolding. The "distractor" options are balanced in length and detail, forcing the user to actively read and deduce the correct logic. The "Continue" button remains locked until the user demonstrates comprehension.

---

## 🗂️ 2. UI/UX & Design System

The application utilizes a premium, cinematic digital storybook interface.

### Layout Architecture
* **Cinematic Hero Vertical Layout:** 
  * Replaces traditional textbook columns with a top-to-bottom reading flow.
  * A full-width, 8k-resolution cinematic image sits at the top of each page as a "Hero Banner."
* **Navigation:** 
  * A persistent, fixed left sidebar displays the structural roadmap (Prologue ➔ Acts 1-5 ➔ Epilogue ➔ Coding Trials).
  * Strict paginated flow replaces infinite scrolling to enforce focus.

### Visual Aesthetic
* **Imagery:** Photorealistic, live-action historical epic style. Images maintain consistent "moonlit night" lighting and 16th-century rustic textures to ensure visual continuity.

---

## ⚙️ 3. Codebase Structure

The feature is built as a React application leveraging Vite, with a focus on maintainability.

| Responsibility | Implementation |
| :--- | :--- |
| **State Management** | React `useState` hooks manage the `currentStep` for pagination. |
| **Data Layer** | A localized `db.json` file handles all narrative strings, MCQ logic, and coding trial variables. |
| **Asset Routing** | High-resolution assets are served directly from the Vite `/public` directory (e.g., `/act1.jpg`). |

---

## 🚀 4. Future Iterations

* **Live Python Compilation:** Upgrading "The Royal Coding Trials" to an integrated web-based IDE (e.g., using Pyodide) for executing real Python code.
* **Curriculum Expansion:** Adding new modules based on other Tenali Rama folktales (e.g., teaching Arrays or Dictionaries).
* **User Authentication:** Implementing profiles to save progress across sessions.
