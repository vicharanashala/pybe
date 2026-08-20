# PyBe — Interactive Visual Learning Framework for Python Recursion

> **"PyBe: An Interactive Visual Learning Framework for Understanding Python Recursion Through Visualization and Hands-On Practice"**

Welcome to **PyBe**! This project is an interactive, visual educational web application designed to help computer science beginners understand and master Python recursion through visual storytelling, animated call-stack visualizations, step-by-step code execution tracing, and diagnostic assessments.

---

## 📚 Essential Project Documentation

Before reviewing the codebase or submitting a Pull Request, please inspect the following comprehensive Markdown documentation files created for this project:

1. 📖 [**PROJECT_OVERVIEW.md**](./PROJECT_OVERVIEW.md) — Detailed summary of the project idea, problem statement, academic objectives, key features, architecture workflow, and tech stack.
2. 📦 [**PRODUCT.md**](./PRODUCT.md) — Product specification covering target user personas, pain points, proposed solution, main user journey, core implemented features, product decisions, limitations, and future roadmap.
3. 🏛️ [**PRINCIPLES.md**](./PRINCIPLES.md) — In-depth evaluation of software engineering and design principles (SoC, Modularity, UX, Progressive Disclosure, KISS, Responsive Design, Error Handling, etc.) followed or consciously traded off in the actual implementation.

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Jasvinder-Kaur93/pybe.git
   cd pybe-main
   ```

2. **Frontend Setup (`client`)**
   ```bash
   cd client
   npm install
   npm run dev
   ```
   The frontend development server will launch locally at `http://localhost:5173/` (or next available port).

3. **Backend API Server Setup (`server`)** *(Optional for trace endpoint)*
   ```bash
   cd ../server
   npm install
   npm start
   ```
   The backend Express API will launch locally at `http://localhost:5000/`.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Enter</kbd> or <kbd>→</kbd> | Advance to next sub-step or next visual scene |
| <kbd>←</kbd> | Return to previous sub-step or scene |
| <kbd>I</kbd> | Toggle System Architecture Inspector Modal |
| <kbd>Esc</kbd> | Close System Architecture Modal |

---

## 🛠️ Project Structure

```
pybe-main/
├── PROJECT_OVERVIEW.md      # Document 1: Project Idea & Overview
├── PRODUCT.md               # Document 2: Product File & Features Specification
├── PRINCIPLES.md            # Document 3: Architectural Principles Evaluated
├── README.md                # Project README & Documentation Hub
├── client/                  # Frontend Vite + React Application
│   ├── index.html           # HTML entry point with Google Fonts & Tailwind CDN
│   ├── package.json         # Client dependencies (React, Lucide, Confetti)
│   ├── vite.config.js       # Vite build configuration
│   ├── public/              # Public visual assets
│   │   └── images/          # 7 Full-screen lesson illustrations (image_1.png .. image_7.png)
│   └── src/
│       ├── main.jsx         # React application root entry
│       ├── App.jsx          # Top-level state machine & phase router
│       ├── index.css        # Custom glassmorphism design system & keyframe animations
│       ├── data/
│       │   └── lessonsData.js # Curriculum content definition for 7 scenes
│       └── components/
│           ├── IntroScene.jsx               # Academic welcome & objectives
│           ├── CinematicScene.jsx           # Scene viewer with environmental reveals
│           ├── InteractivePlayground.jsx    # Mirror Mission IDE & live call stack visualizer
│           ├── ConceptSummary.jsx           # 3 Pillars of Recursion mastery review
│           ├── RecursionChallengeQuiz.jsx   # 5-question code tracing MCQ assessment
│           ├── LearningReport.jsx           # Academic progress report & score verdict
│           ├── ArchitecturePanel.jsx        # System architecture inspector
│           ├── PortalEffect.jsx             # Mirror portal transition overlay
│           └── BackgroundParticles.jsx      # Ambient floating code symbols
└── server/                  # Backend Node.js + Express API
    ├── package.json         # Server dependencies (Express, CORS)
    └── index.js             # Express API health & trace sandbox server
```

---

## 👤 Author Information

* **Developer Name**: `Jasvinder Kaur`
* **Email**: `kaurdetaur9718@gmail.com`
* **Project**: PyBe Interactive Visual Learning Framework
