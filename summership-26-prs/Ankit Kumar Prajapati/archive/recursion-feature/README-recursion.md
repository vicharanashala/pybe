# PyBe - Interactive Recursion Learning Module

> **⚠️ ARCHIVE NOTICE: SUPERSEDED FEATURE ⚠️**
> 
> **This feature is inactive and was discarded.** During the development phase, based on pedagogical feedback, the project was officially pivoted from teaching "Recursion" to "Iteration". This directory and its contents remain strictly for historical logging and reference. 
> 
> 👉

A repository to log research, design, and development for a contribution to **PyBe**, a project by the **Vicharanashala Lab for Education Design, IIT Ropar** designed to teach Python by focusing on computer and programming fundamentals over syntax. 

Main PyBe repository: [https://github.com/vicharanashala/pybe](https://github.com/vicharanashala/pybe)

This repository contains the **Interactive Recursion Learning Module**, a frontend-only React application built via iterative vibe-coding that guides learners through recursion concepts using a narrative case study ("Finding Row Number in Dark Movie Theatre") and interactive multiple-choice questions.

---

## 🌟 Key Features

- **Split-Pane Architecture:** A responsive 40/60 layout separating contextual media from an interactive 3-zone reading and testing engine.
- **Dynamic `<z-*>` Tag Parsing:** Converts custom domain-specific markdown tags (`<z-ponder>`, `<z-options>`, etc.) into rich, interactive React components.
- **Conditional Progression Gating:** Narrative beats unlock automatically, while interactive beats (MCQs and Reflections) require user engagement to unlock progression.
- **Stateful Interactions:** Features two-stage reveal mechanisms for reflections and immediate color-coded feedback for MCQs.

## 🛠️ Tech Stack

- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS v3 & PostCSS
- **Icons:** Lucide React

---

## 🚀 Getting Started (Running Locally)

The React application is isolated within the `pybe-recursion-feature/client` directory. To run it locally:

```bash
# 1. Navigate to the client directory
cd pybe-recursion-feature/client

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.


## 📁 Repository Structure

```text
.
├── archive/                  # Archived planning and ideation documents
├── development-log.md        # Chronological development log
├── future-enhancements.md    # Roadmap for deferred features
├── project-decisions.md      # Architectural and design decisions log
├── pybe-recursion-feature/   # Main feature workspace (React application & docs)
├── README.md                 # Project overview
└── vibe-coding-docs/         # Templates and agent instruction documents
```