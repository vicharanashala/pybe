<h1 align="center">🧠 Case Study Learning Engine</h1>

<p align="center">
  <strong>A feature of the PyBe platform.</strong><br/>
  <em>An interactive, data-driven learning engine that teaches Python through scenario-based problem solving using a three-stage pedagogical workflow.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Topics-1-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Levels-5-06B6D4?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Case_Studies-8-61DAFB?style=for-the-badge" />
</p>

---
## Overview

Case Study Learning is an interactive learning engine integrated into PyBe.

The engine is designed to evaluate and polish the concepts, learners progress through
case study driven exercises consisting of:

- Logic Test
- Concept Reveal
- Guided Code Build

Each stage is designed to move learners from reasoning about a problem
to implementing the solution in Python.

---
## 👥 Team Members

| Name | Email | Contribution |
| :--- | :--- | :--- |
| Saksham Sharma | sakshammayoor@gmail.com | Core Feature Design, Bug Fixing, Case Study template, Added Case Study (Loops, Conditions, Data Types) |
| Vedhanth M | vedhanthmanju@gmail.com | Added Case Study (Functions, String Manipulation, Error Handling) |
| Aarsh Sohane | suhaniaarsh@gmail.com | Added Case Study (Dictionaries, File Handling, Lists) and Helped with documentation |
| Ansh | ansh@example.com | Added Case Study (Sorting & Searching Basics) |

---
## 📖 Table of Contents

- [Pedagogical Framework & Methodology](#-1-pedagogical-framework--methodology)
- [Codebase Structure](#-2-codebase-structure)
- [How Case Studies Are Designed](#-3-how-case-studies-are-designed)
- [Content Coverage](#-4-content-coverage)
- [Adding New Topics (Content Integration)](#-5-adding-new-topics-content-integration)

---

This document provides in-depth knowledge about the **Case Study Learning** feature integrated into the base PyBe application. It covers the pedagogical methodology, the codebase structure, how case studies are designed, and how to add new content.

---

## 🎓 1. Pedagogical Framework & Methodology

Case study design draws on **five interconnected educational frameworks**, each governing a different dimension of the learning experience:

### 1. SOLO Taxonomy (Structure of Observed Learning Outcomes)

Every topic follows a **5–7 level progression** mapped to SOLO stages:

| SOLO Stage | Level | What the Learner Experiences |
|---|---|---|
| **Prestructural** | Level 1 | *The pain scenario.* Feel the absence of the concept experience the problem that the programming construct was invented to solve. |
| **Unistructural** | Level 2 | One isolated mechanic, heavily scaffolded. Learn the single simplest version of the concept. |
| **Multistructural** | Level 3 | Parallel scenarios with different mechanics kept separate. See variations of the concept in isolation. |
| **Relational** | Level 4 | A scenario that **breaks** unless mechanics are combined. Force integration of multiple ideas. |
| **Extended Abstract** | Level 5+ | **Teach-back** design a case study for a peer, proving mastery by creating, not just consuming. |

This taxonomy ensures learners don't just accumulate facts; they progressively build **structural understanding** of how concepts interconnect.

### 2. Kolb's Experiential Learning Cycle

Each case study implements a complete Kolb cycle, doubled:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Concrete Experience (abstract)                            │
│   └──▶ Choosing a strategy in plain English                 │
│                                                             │
│   Reflective Observation                                    │
│   └──▶ Reflective prompts that nudge without giving answers │
│                                                             │
│   Abstract Conceptualisation                                │
│   └──▶ Concept Reveal syntax explained piece by piece     │
│                                                             │
│   Active Experimentation                                    │
│   └──▶ Guided Code Build running real Python              │
│                                                             │
│   Concrete Experience (concrete)                            │
│   └──▶ Seeing the code execute and produce output           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3. Vygotsky's Zone of Proximal Development (ZPD)

The **three-stage engine** implements scaffolded learning that fades support:

- **Stage 1 (Logic Test):** Maximum scaffolding multiple-choice options in plain English, reflective prompts on wrong answers
- **Stage 2 (Concept Reveal):** Guided explanation syntax introduced with full contextual breakdown
- **Stage 3 (Code Build):** Minimum scaffolding fill-in-the-blank with token buttons, inline corrections only (no reflective cycles)

This mirrors Vygotsky's principle of *"guided practice with fading support"* the conceptual heavy lifting is done by Stage 1; Stage 3 is pure retrieval/consolidation.

### 4. Cognitive Load Theory

Case studies are designed with strict rules to manage cognitive load:

- **One new mechanic per case study** never introduce two concepts simultaneously
- **Plain English first** separates logical reasoning from syntax recognition, halving the cognitive load at each stage
- **Progressive disclosure** syntax only appears after the learner has already committed to the correct logical approach
- **Inline corrections** (Stage 3) instead of full reflective cycles once the concept is understood, wrong clicks get a quick fix, not a heavy redirect

### 5. Constructivism (Piaget)

The entire platform is built on the constructivist principle that **knowledge is constructed, not transmitted**:

- Learners **build** understanding by encountering problems first
- **Teach-back levels** (Level 5+) are the ultimate constructivist exercise: design a case study for a peer
- Reflective prompts are Socratic they **nudge** toward the answer without stating it
- The platform never tells a learner they're wrong without asking *"but what about...?"*

---

## 🗂️ 2. Codebase Structure

To keep the base PyBe app (`main.jsx`) clean, the learning feature is entirely modularized. The frontend logic is encapsulated in the `src/learning/` directory, while the data is served via a new backend route.

### Project Tree Structure

```text
pybe/
├── .gitignore
├── README.md
├── WIKI.md
├── Product.md
├── package.json
├── package-lock.json
├── client/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── src/
│       ├── main.jsx
│       ├── styles.css
│       └── learning/
│           ├── CaseStudyEngine.jsx
│           ├── LearningPage.jsx               ← Topic selector + Level grid
│           ├── Stage1LogicTest.jsx
│           ├── Stage2ConceptReveal.jsx
│           ├── Stage3CodeBuild.jsx
│           ├── usePyodide.js
│           └── utils.jsx
└── server/
    ├── .env.example
    ├── package.json
    ├── package-lock.json
    └── src/
        ├── index.js                  ← Express API: GET /api/topics, /api/topics/:id
        ├── seed.js
        ├── data/
        │   └── content.json             ← All topic/level/case study data
        ├── routes/
        │   ├── analytics.js
        │   ├── roadmap.js
        │   ├── scenarios.js
        │   ├── sessions.js
        │   └── topics.js
        └── services/
            └── learningEngine.js
```

### Frontend (`client/src/learning/`)

| File | Responsibility |
|---|---|
| **`LearningPage.jsx`** | The top-level entry point. It manages topic loading, the levels grid, and memory-based level completion states. It renders the Topic Selector and the Level Cards. |
| **`CaseStudyEngine.jsx`** | Orchestrates the state between Stage 1, 2, and 3 case studies. It renders progress trackers (`StageIndicator`, `CaseStudyProgress`) and the Level Complete screen. |
| **`Stage1LogicTest.jsx`** | Handles Stage 1. Renders the scenario text, multiple-choice logic options, reflective prompts on incorrect attempts, and secondary attempts. |
| **`Stage2ConceptReveal.jsx`** | Handles Stage 2. Renders the syntax reveals and descriptive breakdowns of the Python concepts using markdown. |
| **`Stage3CodeBuild.jsx`** | Handles Stage 3. Embeds the Pyodide sandbox execution, dynamic blanks (`___`), shuffled token chips, and runner output/error panels. |
| **`utils.jsx`** | Contains global color tokens (`C`) for styling to ensure high contrast and readability. It also exports shared text-rendering functions (`InlineMarkdown`, `ConceptRevealText`, `parseTemplate`, `assembleCode`). |
| **`usePyodide.js`** | Manages the lazy-loaded Pyodide WebAssembly client and injects runtime function stubs (like `get_coin_inserted()` or `ask_for_pin()`). It ensures Pyodide is only downloaded once per session (Singleton). |

### Backend (`server/`)

| File | Responsibility |
|---|---|
| **`src/routes/topics.js`** | A new route mounted at `/api/topics` that serves the case study content. It exposes endpoints to list all topics (`/`) and fetch full topic details (`/:topicId`). |
| **`src/data/content.json`** | The core data file containing all topics, levels, and case study JSON structures. |

---
### Data Model (`content.json`)

The entire content tree is stored in `content.json`. The structure is:

```
Array of Topics
└── Topic
    ├── topicId          (e.g. "loops")
    ├── topicName        (e.g. "Loops (For/While)")
    └── levels[]
        └── Level
            ├── levelId          (integer: 1, 2, 3…)
            ├── title            (e.g. "Level 1: Birthday App")
            └── caseStudies[]
                └── CaseStudy
                    ├── id              (e.g. "l1_c1")
                    ├── scenario        (the problem description string)
                    ├── stage1          ← Logic Test data
                    │   ├── attempt1[]
                    │   │   ├── text         (option label)
                    │   │   ├── status       ("correct" | "incorrect")
                    │   │   └── routesTo     ("reveal" | "reflection_X")
                    │   └── reflections{}
                    │       └── reflection_X
                    │           ├── prompt       (reflection question text)
                    │           └── attempt2[]
                    │               ├── text     (option label)
                    │               └── status   ("correct" | "incorrect")
                    ├── stage2          ← Concept Reveal data
                    │   └── conceptReveal  (markdown string with **bold**, `code`, *italic*)
                    └── stage3          ← Code Build data
                        ├── codeTemplate   (string with _____ blanks for fills)
                        ├── correctOrder[] (optional ordered list of correct values)
                        └── tokens[]
                            ├── value        (the token label)
                            ├── correct      (boolean)
                            └── hint         (shown on wrong selection)
```

## 📐 3. How Case Studies Are Designed

### The Three-Stage Engine

Every case study in PyBe runs through the same pedagogical engine:

```
┌──────────────────────────────────────────────────────┐
│  STAGE 1 Logic Test (Plain English)                │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Scenario presented in everyday language         │ │
│  │                                                  │ │
│  │  Attempt 1: Multiple-choice logic options        │ │
│  │  (no Python syntax pure strategy selection)    │ │
│  │                                                  │ │
│  │  ✅ Correct → advance to Stage 2                 │ │
│  │  ❌ Wrong   → Reflective Prompt → Attempt 2      │ │
│  │  🟡 Partial → Reflective Prompt → Attempt 2      │ │
│  └─────────────────────────────────────────────────┘ │
│                       ▼                              │
│  STAGE 2 Concept Reveal                            │
│  ┌─────────────────────────────────────────────────┐ │
│  │  The Python syntax is introduced for the FIRST   │ │
│  │  time, broken down symbol by symbol:             │ │
│  │  • What `for` means                              │ │
│  │  • What `in` means                               │ │
│  │  • What `range()` produces                       │ │
│  │  • What `:` and indentation do                   │ │
│  └─────────────────────────────────────────────────┘ │
│                       ▼                              │
│  STAGE 3 Guided Code Build                         │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Pre-written code template with blanks (___)     │ │
│  │  Token buttons to fill the blanks                │ │
│  │  ▶ Run button → Pyodide executes in-browser      │ │
│  │  Wrong tokens → inline hint (no reflection loop) │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### Option Design Principles

Every Attempt 1 option set follows strict rules:

1. **One fully correct option** maps to the concept being taught
2. **One "not absolutely correct" (partial) option** works but isn't the natural fit; a plausible near-miss
3. **One or two clearly wrong options** genuine misconceptions that real beginners hold
4. **All options are in 100% plain English** no Python syntax appears anywhere in Stage 1

### Reflective Prompt Design

Reflective prompts follow Socratic principles:

- Never state the answer directly
- Present a **counter-scenario** that breaks the wrong approach (*"What if the guest list had 200 names...?"*)
- Guide the learner to **discover the flaw** in their reasoning themselves
- Always end with an implicit or explicit question

### Scenario Selection Criteria

Scenarios are chosen to be:

- **Relatable** real-world situations anyone can understand (birthday apps, vending machines, ATM PINs, movie tickets)
- **Unambiguous** one clear "right" approach for the concept being taught
- **Scalable** the scenario naturally reveals why the concept is needed (*"What about 200 names?"*)
- **Culturally inclusive** names and contexts drawn from diverse backgrounds

---

## 🔄 Workflow

![PyBe Workflow](Pybe%20workflow.jpg)

---

## 📊 4. Content Coverage

### Topic 1: Loops (For/While) 5 Levels, 7 Case Studies

| Level | SOLO Stage | Title | Case Studies |
|---|---|---|---|
| 1 | Prestructural | Birthday App | Print "Happy Birthday!" 100 times discover `for` + `range()` |
| 2 | Unistructural | Three Case Studies | Rocket Countdown (`range(start,stop,step)`), Guest List (`for...in list`), Vending Machine (`while`) |
| 3 | Multistructural | ATM PIN Lockout | Combine `while` + `break` two stopping conditions |
| 4 | Relational | Wedding Seating | Nested loops `for` inside `for` |
| 5 | Extended Abstract | Teach-Back | Design a `break` vs `continue` case study for a peer |

### Topic 2: Conditionals (If/Else) 5 Levels, 7 Case Studies

| Level | SOLO Stage | Title | Case Studies |
|---|---|---|---|
| 1 | Prestructural | Movie Night Age Check | Single `if/else` gate |
| 2 | Unistructural | Three Case Studies | Traffic Light (`elif`), Grade Calculator (chained `elif`), Thermostat (`elif` with ranges) |
| 3 | Multistructural | Shopping Discount | Nested `if` inside `if` |
| 4 | Relational | Password Validator | Combine `and`/`or` with conditionals |
| 5 | Extended Abstract | Student Report Card | Multi-condition grading + teach-back |

### Topic 3: Data Types 7 Levels, 14 Case Studies

| Level | SOLO Stage | Title | Case Studies |
|---|---|---|---|
| 1 | Pre → Uni | Numbers: `int` vs `float` | Report card averaging |
| 2 | Multi (set 1) | `str`, `bool`, `None` | Nameplate (strings), Light Switch (booleans), Empty Shelf (None) |
| 3 | Multi (set 2) | `list`, `tuple` | Shopping Cart (lists), Coordinates (tuples) |
| 4 | Multi (set 3) | `dict`, `set` | Phonebook (dictionaries), Badge Scanner (sets) |
| 5 | Relational | Combining Types | Weather Station, Playlist Manager |
| 6 | Consolidation | Type Conversion | Survey form `int()`, `str()`, `float()` casting |
| 7 | Extended Abstract | Nested Structures | Library catalog (list of dicts) + Teach-back |

### Topic 4: Functions 4 Levels, 6 Case Studies

| Level | SOLO Stage | Title | Case Studies |
|---|---|---|---|
| 1 | Prestructural | Report Card Averages | `def`, parameters, `return` defining a basic reusable function |
| 2 | Unistructural | Three Case Studies | Welcome Screen, Tip Calculator, Shipping Confirmation |
| 3 | Multistructural | Movie Ticket Pricing | Early `return` as a guard clause |
| 4 | Relational | Order Total Calculator | Function composition functions calling other functions |

### Topic 5: String Manipulation 4 Levels, 6 Case Studies

| Level | SOLO Stage | Title | Case Studies |
|---|---|---|---|
| 1 | Prestructural | Conference Badge Initials | Introduction to string concepts |
| 2 | Unistructural | Three Case Studies | Area Code Extractor, Messy Signup Form, Comment Filter |
| 3 | Multistructural | Masked Card Number | Intermediate string manipulation |
| 4 | Relational | Business Card Formatter | Combining String Mechanics |

### Topic 6: Error Handling 4 Levels, 6 Case Studies

| Level | SOLO Stage | Title | Case Studies |
|---|---|---|---|
| 1 | Prestructural | Quiz Age Crash | Handling unexpected inputs |
| 2 | Unistructural | Three Case Studies | Calculator Guard, Login Success, File Cleanup |
| 3 | Multistructural | ATM Withdrawal Guard | Intermediate error handling |
| 4 | Relational | Complete ATM Transaction | Combining Error-Handling Mechanics |

### Topic 7: Dictionaries 5 Levels, 8 Case Studies

| Level | SOLO Stage | Title | Case Studies |
|---|---|---|---|
| 1 | Prestructural | Two Lists Falling Out of Sync | Introduction to key-value pairs |
| 2 | Unistructural | Three Case Studies | New Player Registers, Does This Player Exist?, Correcting a Score |
| 3 | Multistructural | Two Case Studies | Announce All Player Names, Total of All Scores |
| 4 | Relational | Full Leaderboard | Combining Keys and Values |
| 5 | Extended Abstract | Teach-Back | Design a case study for a peer |

### Topic 8: File Handling 5 Levels, 8 Case Studies

| Level | SOLO Stage | Title | Case Studies |
|---|---|---|---|
| 1 | Prestructural | The Scores That Vanish | Why files are needed (persistent storage) |
| 2 | Unistructural | Three Case Studies | Loading Saved Scores, Adding Without Erasing, Reading Line by Line |
| 3 | Multistructural | Two Case Studies | Forgetting to Close (`with`), Stray Blank Lines |
| 4 | Relational | Calculating the Average | Combining Read + Convert + Loop |
| 5 | Extended Abstract | Teach-Back | Design a case study for a peer |

### Topic 9: Lists 5 Levels, 8 Case Studies

| Level | SOLO Stage | Title | Case Studies |
|---|---|---|---|
| 1 | Prestructural | Quiz Scoreboard | Why lists are needed |
| 2 | Unistructural | Three Case Studies | New Player Joins, Last Score Check, How Many Scores? |
| 3 | Multistructural | Two Case Studies | Top 3 Leaderboard, Disqualified Player |
| 4 | Relational | Filtering Passing Scores | Combining Loop + Condition + List |
| 5 | Extended Abstract | Teach-Back | Design a case study for a peer |

---

## 📝 5. Adding New Topics (Content Integration)

Case Study Learning is designed to be **content-extensible**. You do not need to modify any React UI code to add new topics or levels. The entire engine is data-driven via `server/src/data/content.json`.

To add a new topic (e.g., Functions, Classes), simply append a new topic object to `content.json`. The frontend `LearningPage` will automatically discover it and populate the Topic Selector.

New topics (e.g., Functions, Classes) can be added by:

1. **Writing a plain-English roadmap** following the SOLO progression
2. **Structuring the content as JSON** following this schema:

```json
{
  "topicId": "functions",
  "topicName": "Functions (def/return)",
  "levels": [
    {
      "levelId": 1,
      "title": "Level 1: The Pizza Order",
      "caseStudies": [
        {
          "id": "fn1_c1",
          "scenario": "Your scenario in plain English...",
          "stage1": {
            "attempt1": [
              { "text": "Correct approach", "status": "correct", "routesTo": "reveal" },
              { "text": "Wrong approach", "status": "incorrect", "routesTo": "reflection_1" }
            ],
            "reflections": {
              "reflection_1": {
                "prompt": "Socratic nudge question...",
                "attempt2": [
                  { "text": "Correct", "status": "correct" },
                  { "text": "Still wrong", "status": "incorrect" }
                ]
              }
            }
          },
          "stage2": {
            "conceptReveal": "Syntax explanation with **markdown** and `inline code`..."
          },
          "stage3": {
            "codeTemplate": "def greet(name):\n    return ___",
            "tokens": [
              { "value": "\"Hello, \" + name", "correct": true },
              { "value": "name", "correct": false, "hint": "Don't forget the greeting!" }
            ]
          }
        }
      ]
    }
  ]
}
```

### Pedagogical Rules for New Topics

| Level | SOLO Stage | Design Rule |
|---|---|---|
| 1 | Prestructural | Let them **feel the absence** of the concept |
| 2 | Unistructural | One isolated mechanic, heavily scaffolded |
| 3 | Multistructural | Parallel scenarios, different mechanics kept separate |
| 4 | Relational | A scenario that **breaks** unless mechanics are combined |
| 5+ | Extended Abstract | **Teach-back** design a case study for a peer |


---

<p align="center">
  <strong>Part of the PyBe platform Python, By Experience.</strong>
</p>
