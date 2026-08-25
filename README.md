# 🐍 PyBe — Learn to Debug: Interactive Story Platform

> **Turn Python exception handling into an unforgettable adventure.**
> PyBe is a gamified, story-driven web application that teaches Python debugging concepts through 10 fairy-tale stories, each mapping real exceptions to narrative moments — making try/except blocks intuitive and fun for every learner.

---

## 📖 Project Overview

**PyBe** is an interactive educational platform designed to teach **Python exception** handling through immersive storybook experiences. Each story maps a classic fairy tale to a specific Python exception, walking learners through the full `try → except → else → finally` lifecycle using vivid characters, animated visuals, and hands-on interactive exercises.

Learners progress through a structured curriculum:
- **Browse** story cards on the dashboard
- **Explore** the story's narrative and exception mapping in detail
- **Play** through 7 sequential interactive stages per story
- **Unlock** the next story only after completing the current one

---

## ✨ Features

### 🗂️ Story Dashboard (Overview)
- **10 unique fairy-tale story cards**, each themed around a Python exception
- **Animated cartoon banner illustrations** for every story card
- **Story metadata**: error type badge, Python concept tag, tagline, and animated icon
- **Progress tracking**: locked/unlocked/completed states per story with visual indicators
- **Stage-gated progression**: complete all activities in sequence before unlocking the next story

### 📚 Story Detail View
- **Full-width storybook header illustration image** at the top of each story modal
- **Story narrative panels**: The Start, The Conflict, and Python Exception Mapping
- **Story Sentences to Code Line Mapping section**: every plot moment mapped to real Python code, with animated step badges
- **One-click launch** into the interactive Debugger Simulator

### 🎮 Interactive Learning Stages (9 Stages Per Story)

| Stage | Component | Description |
|---|---|---|
| 1 | **Story Overview** | Browse all story cards and explore narrative detail |
| 2 | **Debugger Simulator** | Step through code line-by-line and trigger real exceptions |
| 3 | **Execution Flowchart** | Visualize try/except flow paths interactively |
| 4 | **Line-by-Line Generator** | Watch code execute with Python explanation per line |
| 5 | **Bug Hunter Game** | Multiple-choice game to identify and fix code bugs (Score ≥ 80%) |
| 6 | **Concept Flip Cards** | Spaced-repetition flash cards for concept mastery |
| 7 | **Sentence Ordering Puzzles** | Drag-and-drop story sentences into correct Python order |
| 8 | **AI Reasoning Sandbox** | Generate and test custom exception scenarios |
| 9 | **Custom Story Playground** | Build a custom exception story to unlock the next story |

### 🐍 Python Exceptions Covered

| # | Story | Exception / Concept | Illustration Asset |
|---|---|---|---|
| 1 | 🐺 Little Red Riding Hood | `AttributeError` — calling a method that doesn't exist | `red_hood.jpg` |
| 2 | 🐢 Tortoise & The Hare | `ZeroDivisionError` + `else` block | `tortoise_hare.jpg` |
| 3 | 🥣 Goldilocks & Three Bears | `IndexError` + `KeyError` | `goldilocks.jpg` |
| 4 | 📯 The Boy Who Cried Wolf | `raise` + Custom Exception classes | `cried_wolf.jpg` |
| 5 | 🐷 The Three Little Pigs | `finally` — guaranteed cleanup block | `three_pigs.jpg` |
| 6 | 🍞 Hansel & Gretel | `FileNotFoundError` | `hansel_gretel.jpg` |
| 7 | 🫘 Jack & The Beanstalk | `TypeError` — data type mismatch | `jack_beanstalk.jpg` |
| 8 | 🧞 Aladdin & The Genie | `PermissionError` + `AssertionError` | `aladdin_genie.jpg` |
| 9 | 👠 Cinderella | `TimeoutError` — midnight spell expiry | `cinderella.jpg` |
| 10 | 🎶 Pied Piper of Hamelin | `MemoryError` — system resource exhaustion | `pied_piper.jpg` |

### 🎨 Visual Design
- **Soft Pastel Storybook UI** with multi-stop pastel gradients (Soft Lavender, Rosy Pink, Sky Blue, Warm White) and high-contrast dark typography for optimal readability
- **High-quality storybook cartoon illustrations** for all 10 stories
- **Animated SVG interactive banners** with per-story exception code badges
- **Step cartoon badges** with CSS animations (`bounce`, `float`, `wiggle`, `pulse`) in each sentence-to-code mapping card
- **Smooth micro-animations** throughout: modal slide-up, card hover lift, badge glow effects
- **Custom scrollbar styling** and responsive layout

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | [React 18](https://react.dev/) | Component-based UI |
| **Build Tool** | [Vite 6](https://vitejs.dev/) | Fast dev server & production bundler |
| **Styling** | Vanilla CSS (Custom Properties) | Animations, themes, glassmorphism |
| **Icons** | [Lucide React](https://lucide.dev/) | UI icon library |
| **Illustrations** | Custom SVG vector art + AI-generated JPEG | Story banner images |
| **Backend** | Node.js / Express | API server (MERN stack base) |
| **Process Manager** | [concurrently](https://www.npmjs.com/package/concurrently) | Runs client + server in parallel |
| **Runtime** | Node.js 18+ | JavaScript runtime |

---

## 🚀 Setup & Installation

### Prerequisites

Make sure you have the following installed:
- **Node.js** `v18.0.0` or higher
- **npm** `v9.0.0` or higher

Verify your versions:
```bash
node --version
npm --version
```

---

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd pybe
```

---

### 2. Install All Dependencies

Install both server and client dependencies in one command:

```bash
npm run installAll
```

> This runs `npm install` for both the `/server` and `/client` packages.

---

### 3. Run the Development Server

```bash
npm run dev
```

This will start:
- **Client** (Vite dev server) → [http://localhost:5173](http://localhost:5173)
- **Server** (Express API) → [http://localhost:5000](http://localhost:5000) *(or configured port)*

Both run concurrently in the same terminal.

---

### 4. Build for Production (Optional)

```bash
npm run build --prefix client
```

The production bundle will be output to `client/dist/`.

---

## 📁 Project Structure

```
pybe/
├── package.json              # Root scripts (dev, build, installAll)
├── client/                   # React frontend (Vite)
│   ├── src/
│   │   ├── main.jsx          # App entry point & routing
│   │   ├── ExceptionStudio.jsx  # Main orchestrator: stories, stages, state
│   │   ├── storyData.js      # All story narrative data, sentence mappings,
│   │   │                     #   BugHunter questions, AI sandbox prompts
│   │   ├── styles.css        # All global styles, animations, themes
│   │   ├── assets/           # Story illustration images (JPG)
│   │   │   ├── red_hood.jpg
│   │   │   ├── tortoise_hare.jpg
│   │   │   ├── goldilocks.jpg
│   │   │   ├── cried_wolf.jpg
│   │   │   ├── three_pigs.jpg
│   │   │   ├── hansel_gretel.jpg
│   │   │   ├── jack_beanstalk.jpg
│   │   │   ├── aladdin_genie.jpg
│   │   │   ├── cinderella.jpg
│   │   │   └── pied_piper.jpg
│   │   └── components/       # UI Components
│   │       ├── Page1Stories.jsx         # Story dashboard & detail modal
│   │       ├── StoryCartoonBanner.jsx   # Illustration renderer (image + SVG modes)
│   │       ├── StepCartoonBadge.jsx     # Animated step badges in code mapping
│   │       ├── DebuggerSimulator.jsx    # Step-through code debugger
│   │       ├── ExecutionFlowchart.jsx   # Visual try/except flow diagram
│   │       ├── LineByLineGenerator.jsx  # Line-by-line code explainer
│   │       ├── BugHunterGame.jsx        # Multiple-choice bug quiz game
│   │       ├── ConceptFlipCards.jsx     # Spaced-repetition flip cards
│   │       ├── SentenceOrderingPuzzles.jsx  # Drag-and-drop puzzles
│   │       ├── AIReasoningSandbox.jsx   # Custom exception playground
│   │       ├── CustomStoryModal.jsx     # Custom story creator modal
│   │       └── CustomStoryPlayground.jsx  # Custom story stage builder
│   ├── index.html
│   └── package.json          # Client dependencies (React, Vite, Lucide)
└── server/                   # Express backend
    ├── package.json
    └── ...                   # API routes & middleware
```

---

## 🎓 Learning Progression

Each story follows a **strict sequential stage-gating system**:

```
Story Dashboard
     │
     ▼
[Stage 1] Story Overview ──→ Read narrative & sentence-to-code mapping
     │ (complete)
     ▼
[Stage 2] Debugger Simulator ──→ Step through code, trigger exceptions
     │ (complete)
     ▼
[Stage 3] Execution Flowchart ──→ Visualize control flow
     │ (complete)
     ▼
[Stage 4] Line-by-Line Generator ──→ Understand each line
     │ (complete)
     ▼
[Stage 5] Bug Hunter Game ──→ Score ≥ 80% to unlock next
     │ (complete)
     ▼
[Stage 6] Concept Flip Cards ──→ Flip all cards
     │ (complete)
     ▼
[Stage 7] Sentence Ordering Puzzles ──→ Arrange in correct order
     │ (complete)
     ▼
Next Story Unlocked 🎉
```

> **Completion Rules**: A learner must complete **all activities in a stage** before the next stage unlocks. Stories must be completed **in order**. The Bug Hunter Game requires a score of **≥ 80%** to pass.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add: your feature description'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## Contributor

**Muskan kumari (tulipcoder)**

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Python exception handling fun for every learner.**

*"Every bug is just a story waiting to be debugged."*

</div>
