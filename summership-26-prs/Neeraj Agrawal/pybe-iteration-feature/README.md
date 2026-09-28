# PyBe - Interactive Iteration Learning Module

A repository to log research, design, and development for a contribution to **PyBe**, a project by the **Vicharanashala Lab for Education Design, IIT Ropar** designed to teach Python by focusing on computer and programming fundamentals over syntax.

This repository contains the **Interactive Iteration Learning Module**, a frontend-only React application that guides learners through Iteration and Loop concepts using a narrative case study ("The Cricket Chase") and interactive code challenges.

---

## 🌟 Key Features

- **Relatable Case Study:** Teaches `for` and `while` loops using a Cricket Match analogy.
- **Conditional Progression Gating:** Narrative beats unlock automatically, while interactive beats (MCQs and Code Challenges) require user engagement to unlock progression.
- **Interactive Code Playgrounds:** Fill-in-the-blank code verifiers to test loop syntax understanding.
- **Stateful Interactions:** Features immediate color-coded feedback for MCQs and overall progress tracking.
- **Rich Aesthetics:** Modern UI utilizing Glassmorphism, Tailwind CSS styling, and Framer Motion for smooth micro-animations.

## 🛠️ Tech Stack

- **Framework:** React (Vite)
- **Styling:** Vanilla CSS & Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React

---

## 🚀 Getting Started (Running Locally)

To run the application locally:

```bash
# 1. Navigate to the client directory
cd client

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open your browser and navigate to the provided localhost URL (e.g., `http://localhost:5173`).

## 📁 Repository Structure

```text
.
├── planning-phase/               # Planning and ideation documents
│   ├── case-study.md             # Narratives for loops and control statements
│   └── flow.md                   # Chronological flow of the UI
├── client/                       # React application codebase
└── backend/                      # Node.js backend (if applicable)
```
