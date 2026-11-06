# The Tatkal Berth Rush — PyBe Interactive Discovery Lab
### Interactive Python Execution Stepper & Notional Machine Visualizer

[![JavaScript](https://img.shields.io/badge/JavaScript-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express%20REST%20API-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Quality Gates](https://img.shields.io/badge/Quality%20Gates-Passing-success)](case-study.md)
[![Case Study](https://img.shields.io/badge/PyBe-Case%20Study%20Certified-orange)](product.md)

> Discover Python sequence indexing (`0`-based offset), range boundaries (`range(start, stop)` upper-bound exclusion), and variable mutation organically through the high-stakes pressure of a Diwali railway Tatkal booking rush.

---

## 📖 Case Study Documentation

- 📋 [**case-study.md**](case-study.md): Complete pedagogical narrative, Indian Railways domain mapping, 4-act progression, and mental model analysis.
- 🎯 [**product.md**](product.md): Detailed product specification, SOLO taxonomy alignment, system architecture, and verification gates.

---

## 🌟 Executive Overview

**The Tatkal Berth Rush** is an interactive, story-driven case study engineered for the **PyBe (Python by Experience)** platform. 

Instead of teaching Python syntax deductively through abstract rules or dry numerical prints, it grounds core programming mechanics in the concrete operational dilemmas of booking **Coach S1 (72 sleeper berths)** on the Mumbai–Varanasi Superfast Express:

| Real-World Railway Dilemma | Python Construct / Bug | Notional Machine Insight |
| :--- | :--- | :--- |
| **Senior Citizen Skipped:** Ramesh (#1 in queue) bypassed for lower berth. | `assigned = queue[1]` | **Zero-Based Indexing:** Python sequences measure offset from start (`0`), not human counting (`1`). `queue[1]` is the *second* passenger! |
| **Ghost Berth 72 Left Empty:** Coach marked "Full" while Berth 72 sits vacant. | `for berth in range(1, 72):` | **Range Upper-Bound Exclusion:** `range(start, stop)` stops at `stop - 1`. `range(1, 72)` stops at 71; Berth 72 is never reached. |
| **Audit Counter Collapses:** Revenue tally reports `Total Confirmed: 1`. | `total = 0` inside loop | **Accumulator Scope Reset:** Re-initializing accumulators inside a loop destroys memory state on every single iteration. |

---

## 🚀 Key Features

- **Interactive Coach S1 72-Berth Schematic:** Live SVG/grid visualization of all 9 compartments and 72 berths (Lower, Middle, Upper, Side Lower, Side Upper), highlighting allocated berths in emerald green and ghost/unallocated berths in warning amber.
- **Bi-Directional Execution Stepper:** Step forward and backward line-by-line with play/pause and adjustable playback speeds (0.5x, 1x, 2x).
- **Live Memory Watch Panel (The Notional Machine):** Displays variable names, data types (`int`, `str`, `list`, `bool`), memory values, and highlights updated variables in real time.
- **Socratic State Prediction Checkpoints:** Pauses before critical state-mutating lines to prompt the learner to predict the outcome before seeing the answer.
- **Automated Misconception Detection:** Detects `off_by_one_range`, `list_index_zero_based`, `accumulator_reset`, and assignment vs equality errors.
- **Interactive Sandbox & Custom Code Trace:** Allows testing any custom Python snippet with live step-by-step state tracing.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Lucide Icons, Vanilla CSS with custom cyber-rail design tokens and Emil Kowalski motion principles.
- **Backend:** Node.js + Express REST API with deterministic AST evaluation (zero external cloud LLM dependencies).
- **Data Storage:** Local JSON file storage (`server/src/data/db.json`).

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm run installAll
```

### 2. Configure Environment
```bash
cp server/.env.example server/.env
```

### 3. Seed Case Study Data
```bash
npm run seed
```

### 4. Start Development Servers
```bash
npm run dev
```

* **Frontend:** http://localhost:5173
* **Backend API:** http://localhost:5000/api

---

## 🗺️ Project Structure

```
Shanmukha Medisetty/
├── client/                     # Interactive React 18 frontend
│   ├── index.html              # HTML container
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx            # Application coordinator & Coach S1 visualizer
│       └── styles.css          # Design tokens & responsive styles
├── server/                     # Express REST backend
│   ├── package.json
│   └── src/
│       ├── index.js            # Express server
│       ├── seed.js             # Seeding Tatkal Berth Rush Case Study
│       ├── data/               # Persistent JSON storage
│       ├── routes/             # REST endpoints (/tracer, /scenarios, /sessions)
│       └── services/           # Deterministic AST tracer engine & Notional Machine
├── case-study.md               # Complete Case Study narrative & pedagogical design
├── product.md                  # Comprehensive product specification
└── readme.md                   # Quick-start guide and project overview
```
