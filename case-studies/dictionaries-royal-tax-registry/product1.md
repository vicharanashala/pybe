<h1 align="center">📚 Interactive Dictionary Learning Engine</h1>

<p align="center">
  <strong>A feature of the PyBe platform.</strong><br/>
  <em>An interactive, data-driven learning engine that teaches Python through scenario-based problem solving using a three-stage pedagogical workflow.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Story-Akbar%20%26%20Birbal-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Learning-8%20Stages-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Concept-Associative%20Mapping-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Python-Dictionaries-yellow?style=for-the-badge&logo=python&logoColor=white" />
</p>

---
## Overview

The **Interactive Dictionary Learning Engine** is a story-driven learning feature integrated into PyBe.

The engine is designed to teach Python Dictionaries by helping learners discover **associative mapping** before introducing Python syntax. Learners progress through an interactive journey consisting of:

- Story-based Exploration
- Observation & Reflection
- Associative Mapping
- Interactive Visualization
- Python Syntax
- Guided Practice

Each stage is designed to move learners from understanding **why key-value relationships are needed** to confidently using Python Dictionaries in real-world scenarios.
---
## 👥 Team Member

| Name | Email | Contribution |
| :--- | :--- | :--- |
| Krishanu Das | dkrishanu94@gmail.com | Designed and developed the Interactive Dictionary Learning Engine, including the learning flow, Akbar & Birbal's Royal Tax Registry story, associative mapping activities, interactive visualizations, Python Dictionary concept progression, UI/UX design, and technical documentation. |

---
## 📖 Table of Contents

- [Pedagogical Framework & Methodology](#-1-pedagogical-framework--methodology)
- [Codebase Structure](#-2-codebase-structure)
- [How the Learning Journey is Designed](#-3-how-the-learning-journey-is-designed)
- [Learning Content Coverage](#-4-learning-content-coverage)
- [Extending the Learning Engine](#-5-extending-the-learning-engine)
---

This document provides in-depth knowledge about the **Interactive Dictionary Learning Engine** feature integrated into the PyBe platform. It covers the pedagogical methodology, the learning journey, interactive components, codebase structure, content organization, and guidelines for extending the feature with new lessons and activities.

---

## 🎓 1. Pedagogical Framework & Methodology

The **Interactive Dictionary Learning Engine** is designed around four complementary educational principles that help learners discover the concept of associative mapping before introducing Python Dictionaries. Instead of teaching dictionary syntax directly, the feature encourages learners to observe, reason, visualize, and gradually construct the underlying computational idea through an interactive and story-driven learning experience.

### 1. Computational Thinking First

The feature follows PyBe's core philosophy of teaching **computational thinking before programming syntax**. Learners are first presented with a real-world problem where information must be organized and retrieved efficiently. They are encouraged to identify patterns, make observations, and reason about possible solutions before any Python code is introduced. By separating conceptual understanding from language syntax, learners develop a deeper understanding of why dictionaries exist rather than memorizing how they are written.

### 2. Story-Based Learning

The learning journey begins with **Akbar and Birbal's Royal Tax Registry**, where different provinces are associated with their respective tax records. This historical narrative provides a meaningful and engaging context for associative mapping. Instead of viewing a dictionary as an abstract programming construct, learners naturally recognize that every province has a corresponding record, making the transition from real-world associations to key-value relationships intuitive and memorable.

### 3. Constructivist Learning

The feature adopts a constructivist approach in which learners actively build their own understanding instead of receiving direct explanations. Through guided observations, interactive activities, and progressive questioning, learners discover that computers organize related pieces of information using associations. The Python Dictionary is therefore presented as the natural computational representation of an idea that learners have already constructed themselves.

### 4. Cognitive Load Management

The learning experience is carefully structured to introduce only one new idea at a time. The journey progresses from story, to observation, to associative mapping, to visualization, and finally to Python syntax and practice. This gradual progression minimizes cognitive overload, allowing learners to focus on understanding the underlying concept before dealing with programming notation. Interactive visualizations and guided activities further reinforce learning by connecting abstract concepts with familiar real-world experiences.
---

## 🗂️ 2. Codebase Structure

The Interactive Dictionary Learning Engine follows a lightweight, modular architecture built using **HTML, CSS, and JavaScript**. The project separates presentation, styling, lesson content, and application logic into dedicated modules, making the codebase easy to understand, maintain, and extend. This modular organization allows developers to modify individual learning components without affecting the rest of the application.

### Project Tree Structure

```text
Interactive-Dictionary-Learning-Engine/
├── assets/
│   └── images/
│       ├── akbar.png
│       └── birbal.png
├── css/
│   ├── base.css
│   ├── components.css
│   ├── editor.css
│   └── storybook.css
├── js/
│   ├── assessment.js
│   ├── codeEditor.js
│   ├── lessonData.js
│   ├── lessonEngine.js
│   ├── navigation.js
│   └── renderer.js
└── index.html
```

### Frontend

| File | Responsibility |
|---|---|
| **`index.html`** | Entry point of the application. Defines the overall layout and loads the required stylesheets and JavaScript modules. |
| **`css/base.css`** | Defines global styles, typography, color palette, spacing, and layout rules used throughout the application. |
| **`css/components.css`** | Contains reusable UI component styles such as cards, buttons, progress indicators, dialogs, and interactive elements. |
| **`css/editor.css`** | Styles the interactive Python code editor, syntax display, and code execution interface. |
| **`css/storybook.css`** | Provides styles and animations for the story-driven learning experience, including character illustrations, dialogue panels, and visual storytelling elements. |
| **`js/lessonData.js`** | Stores the complete lesson content, including stories, observations, activities, visualizations, syntax explanations, and assessment data. |
| **`js/lessonEngine.js`** | Acts as the core controller of the learning experience. It manages lesson progression, application state, and transitions between different learning stages. |
| **`js/renderer.js`** | Dynamically renders lesson screens, interactive components, animations, and visual content based on the current lesson state. |
| **`js/navigation.js`** | Handles navigation between lesson pages, progress tracking, and user interactions with navigation controls. |
| **`js/codeEditor.js`** | Manages the interactive Python code editor, syntax demonstrations, and learner coding activities. |
| **`js/assessment.js`** | Controls quizzes, interactive exercises, answer validation, feedback generation, and learner progress evaluation. |

### Assets

| Resource | Responsibility |
|---|---|
| **`assets/images/akbar.png`** | Character illustration used throughout the story-driven learning experience. |
| **`assets/images/birbal.png`** | Character illustration used for storytelling, explanations, and learner guidance. |
---
## 📐 3. How the Learning Journey is Designed

### The Learning Journey

Every learner progresses through the same guided learning experience, carefully designed to build conceptual understanding before introducing Python syntax.

```text
┌────────────────────────────────────────────────────────────────────────┐
│  STAGE 1 Story-based Exploration                                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Akbar and Birbal introduce the Royal Tax Registry.              │  │
│  │  Learners observe how provinces are linked to tax records.       │  │
│  │  No programming concepts or syntax are introduced.               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              ▼                                         │
│  STAGE 2 Observation & Associative Mapping                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Learners identify relationships between provinces and taxes.    │  │
│  │  Interactive activities reinforce one-to-one associations.       │  │
│  │  The concept of "finding information using a name" emerges.      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              ▼                                         │
│  STAGE 3 Computational Concept                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  The Royal Registry is mapped to a computer representation.      │  │
│  │  Learners discover that computers store related information      │  │
│  │  as key-value pairs.                                             │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              ▼                                         │
│  STAGE 4 Python Dictionary                                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Dictionary syntax is introduced gradually.                      │  │
│  │  Each syntax element is linked to the registry visualization.    │  │
│  │  Learners observe how code updates the visual registry.          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              ▼                                         │
│  STAGE 5 Guided Practice & Assessment                                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Learners create, access, modify, and iterate over dictionaries. │  │
│  │  Immediate feedback reinforces conceptual understanding.         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Story Design Principles

Every story is designed to introduce the computational idea naturally before any programming terminology appears.

- **Authentic Context** – The problem should resemble a realistic situation where information must be organized and retrieved efficiently.
- **Concept Before Syntax** – Learners understand the need for associative mapping before encountering dictionary syntax.
- **Progressive Discovery** – Each interaction reveals one new idea at a time, preventing cognitive overload.
- **Meaningful Characters** – Akbar and Birbal guide the learner through questioning, observation, and reasoning rather than direct instruction.

### Interactive Learning Principles

Every interactive activity follows a consistent design philosophy.

- Encourage learners to observe patterns rather than memorize definitions.
- Provide visual feedback for every interaction.
- Connect every animation to a computational concept.
- Reveal Python syntax only after learners understand the underlying idea.
- Reinforce learning through exploration instead of passive reading.

### Activity Design Criteria

All learning activities are designed to be:

- **Interactive** – Learners actively manipulate information instead of only reading content.
- **Visual** – Concepts are represented using animations, diagrams, and the Royal Registry.
- **Progressive** – Each activity builds directly upon the previous one.
- **Contextual** – Every concept remains connected to the ongoing story.
- **Transferable** – Learners can relate the concept to real-world examples beyond the story.
## 🔄 Workflow

![PyBe Workflow](PyBe%20Workflow.png)

---

## 📊 4. Learning Content Coverage

The Interactive Dictionary Learning Engine is organized as a progressive learning journey. Each stage introduces one new concept while reinforcing previously learned ideas, ensuring learners develop a strong conceptual understanding before writing Python code.

| Stage | Learning Goal | Activities |
|---|---|---|
| **1. Story-based Exploration** | Understand the real-world problem of organizing information. | Akbar and Birbal introduce the Royal Tax Registry, where provinces are associated with their respective tax records. |
| **2. Observation & Reflection** | Recognize relationships between two pieces of information. | Observe the registry, answer guided questions, and identify how provinces are linked to taxes. |
| **3. Associative Mapping** | Discover one-to-one associations. | Match provinces with their corresponding tax values and explore associative relationships through interactive activities. |
| **4. Computational Concept** | Understand how computers represent associations. | Transition from the Royal Registry to the concept of key-value pairs and associative data structures. |
| **5. Dictionary Visualization** | Visualize how a Python Dictionary stores data. | Compare the physical registry with a dictionary representation and observe how keys map to values. |
| **6. Python Dictionary Syntax** | Learn dictionary syntax in context. | Create dictionaries, access values, insert new entries, modify existing data, remove entries, and explore common dictionary methods. |
| **7. Guided Practice** | Reinforce conceptual and programming skills. | Complete interactive coding exercises involving creation, lookup, update, deletion, iteration, and membership testing. |
| **8. Assessment** | Demonstrate conceptual understanding and practical application. | Solve real-world scenarios requiring learners to select and implement appropriate dictionary operations. |

### Dictionary Concepts Covered

The learning engine introduces the following Python Dictionary concepts in a gradual and structured manner:

- Dictionary creation
- Key-value relationships
- Accessing values using keys
- Adding new key-value pairs
- Updating existing values
- Removing dictionary entries
- Iterating through dictionaries
- `keys()`, `values()`, and `items()`
- Membership testing using `in`
- Nested dictionaries
- Real-world applications of dictionaries

---
## 📝 5. Extending the Learning Engine

The Interactive Dictionary Learning Engine is designed with a modular architecture, allowing developers to extend the learning experience without modifying the core rendering or navigation logic. New lessons, stories, visualizations, and assessments can be introduced by following the existing structure and educational philosophy.

Future enhancements may include:

- Additional story-driven modules introducing advanced dictionary concepts.
- New visualization techniques for nested dictionaries and complex data structures.
- Interactive coding challenges with increasing difficulty.
- Gamified assessments and achievement tracking.
- Real-world projects demonstrating practical dictionary applications.
- AI-powered hints and personalized feedback based on learner progress.

### Guidelines for New Learning Modules

Every new lesson should follow the same pedagogical progression adopted throughout the Dictionary Learning Engine:

1. **Begin with a relatable story** that presents a real-world problem.
2. **Encourage observation** before introducing any programming terminology.
3. **Help learners discover associative relationships** through interactive activities.
4. **Introduce the computational concept** only after learners understand the underlying idea.
5. **Reveal Python syntax gradually**, connecting each language construct to the visual representation.
6. **Provide guided practice** with immediate feedback and reinforcement.
7. **Conclude with an assessment** that evaluates both conceptual understanding and practical application.

### Design Principles

Every future lesson should follow these principles:

| Principle | Description |
|---|---|
| **Story First** | Every concept should begin with an engaging real-world narrative. |
| **Concept Before Syntax** | Learners should understand why a concept exists before learning its implementation. |
| **Interactive Learning** | Encourage exploration through animations, visualizations, and learner interaction. |
| **Progressive Difficulty** | Introduce one new concept at a time while reinforcing previous knowledge. |
| **Immediate Feedback** | Provide timely feedback to help learners correct misconceptions and strengthen understanding. |
| **Visual Consistency** | Maintain a consistent visual language and user experience throughout the learning journey. |
---

<p align="center">
  <strong>Part of the PyBe Platform — Python, By Experience</strong>
</p>