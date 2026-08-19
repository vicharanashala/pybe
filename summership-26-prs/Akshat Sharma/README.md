# 🥭 The Mango Harvest (For Loops) - PyBe Case Study

![PyBe - The Mango Harvest](https://img.shields.io/badge/PyBe-Case_Study-2563eb?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

<br/>

**The Mango Harvest** is a standalone, interactive case study module for the [PyBe platform](../team_product.md) designed to teach **For Loops** in Python. 

By following a relatable narrative of Dada (a worker harvesting a mango orchard) and The Fox (a Socratic observer), learners intuitively grasp sequential processing before ever touching the syntax of a Python `for` loop.

---

## 📖 Table of Contents
- [About the Module](#-about-the-module)
- [Learning Progression](#-learning-progression)
- [Getting Started](#-getting-started)
- [Technical Architecture](#-technical-architecture)
- [Project Structure](#-project-structure)
- [State & Data Flow](#-state--data-flow)

---

## 🎯 About the Module

Traditional programming education often starts with abstract syntax. This module employs a **Constructivist** and **Cognitive Load Theory** approach, starting with a familiar scenario. The goal is analogical transfer: the orchard acts as a list, and the tree acts as a loop variable.

**Key Concepts Taught:**
- Sequential Action and Iteration
- Abstraction of repeating patterns
- Python `for` loop syntax
- Mapping real-world logic (lists, strings, math) to code

For information on how this module fits into the broader PyBe pedagogical framework, please see the [Team Product Document](../team_product.md).

---

## 🧠 Learning Progression

The module follows a strict concrete-to-abstract progression:

1. **Story (Concrete Context)**: Narrative of Dada harvesting mangoes. No code.
2. **Story Questions (Active Processing)**: Socratic checks ensuring the learner internalizes the core mechanism.
3. **Computational Thinking (Abstraction Building)**: 
    - *Sequential Action:* Visualizing the action map.
    - *Sequencing Activity:* Learners take over Dada's task interactively.
    - *Discovery Questions:* "What if there were 1,000 trees?" (Abstraction).
    - *Simulation Activity:* Confirming the abstracted pattern.
4. **Concept Discovery (The Bridge)**: The "For Loop" is revealed using analogical transfer.
5. **Mental Model (Cognitive Scaffolding)**: The "Conveyor Belt" analogy for iteration mechanics.
6. **Python Syntax (Formalization)**: Practical Python code translating the logic.
7. **Interactive Coding (Application)**: Drag-and-drop block coding (a librarian checking books) to test syntax transfer.
8. **Assessment (Validation)**: Multiple-choice questions targeting specific misconceptions without penalty.

---

## 🚀 Getting Started

This project is built as a lightweight, highly responsive Single Page Application (SPA) using purely **Vanilla HTML, CSS, and JavaScript**. There is no build step or framework required.

### Prerequisites
A modern web browser and a local development server to avoid CORS issues with local assets.

### Installation & Execution
1. Clone the repository and navigate to the module directory:
   ```bash
   cd "summership-26-prs/Akshat Sharma"
   ```
2. Start a local server. For example, using Python:
   ```bash
   python -m http.server 8000
   ```
3. Open your browser and navigate to `http://localhost:8000`.

---

## 🏗 Technical Architecture

The module relies on a unidirectional data flow managed by a custom local engine. It does not use React, Webpack, or external libraries.

- **`lessonEngine.js`**: State manager tracking `currentStepIndex`, `stepCompletion` (dictionary of booleans), and learner `responses`. Engine blocks progression until the current step is resolved.
- **`renderer.js`**: Dynamically clears and constructs DOM nodes in the `#storybook-card` based on step types. Dispatches `CustomEvent("pybe:interaction")` upon interactive success.
- **`codeEditor.js`**: HTML5 Drag and Drop API implementation for block coding validation.
- **`assessment.js`**: Grading logic for multiple-choice steps with localized visual feedback.

---

## 📁 Project Structure

```text
.
├── index.html            # Main UI shell (Header, Theme Toggle, Main Card, Footer Nav)
├── css/                  
│   ├── base.css          # Design system, CSS variables, typography
│   ├── storybook.css     # Layout for the main stage and progress bar
│   ├── components.css    # Interactive elements (buttons, chips, matching board)
│   └── editor.css        # Drag-and-drop code block styling
├── js/                   
│   ├── lessonData.js     # Pure data array (LESSON_STEPS) defining the exact content
│   ├── lessonEngine.js   # State manager (tracks current step, completion, saved responses)
│   ├── renderer.js       # DOM manipulation (reads step type, builds DOM into #storybook-card)
│   ├── codeEditor.js     # Drag-and-drop logic for coding steps
│   ├── assessment.js     # Grading logic for quiz steps
│   └── navigation.js     # Bootstraps the app, wires footer buttons and progress bar
└── assets/               # Images (Dada and the Fox)
```

---

## 🧩 State & Data Flow

The pedagogical flow is defined purely as data in `lessonData.js` via the `LESSON_STEPS` array. To extend or modify the module, you simply adjust this array. 

Each step object contains:
- `id` and `type` (e.g., `story`, `question`, `mapping-visual`, `coding`).
- `macroIndex` tying it to the 8 pedagogical stages for the progress bar.
- Schema specific properties (e.g., `draggableBlocks` and `dropSlots` for coding steps).
