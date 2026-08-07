# PyBe v2.2

> **Python through discovery. Not syntax — stories.**

PyBe is a scenario-driven Python learning platform built on **Problem-Based Learning** and the **Universal Abstraction Discovery Engine (UADE)** concept. Instead of teaching Python constructs directly, PyBe presents real-world problems that grow until the current approach breaks — forcing the learner to *rediscover* the construct themselves.

📚 [context.md](context.md) · [product.md](product.md) · [WIKI.md](WIKI.md)

---

## What's New in v2.2

### 1. 🧠 First-Principles Learning Engine
- **Friction Simulator (Before vs After)**: Side-by-side code comparison cards embedded in every chapter's Theory phase. Displays fragile manual code without the construct vs clean Python code, highlighting the exact pain point that led to the abstraction.
- **Interactive Mental Model Lab**: Live hands-on visualizers embedded in the Theory phase showing RAM memory slots (`0x7F8`), arithmetic operator pipelines, zero-indexed string character arrays, decision tree flowchart branching, loop iteration steppers, array append/pop counters, hash table lookup tables ($O(1)$ key mapping), unique set buckets, function machine inputs/outputs, binary/linear search scanners, `try/except` exception shields, array sort steppers, and RAM $\rightarrow$ Disk storage buffers.
- **Instant Micro-Sandbox / Interactive Try-It Widget**: Live browser-based Python code editor and executor embedded right below code examples. Features code resetting, live syntax validation, and an authentic dark terminal stdout console (`$ python main.py`).
- **Socratic Misconception Spotter**: Automated analysis of student plain-English reasoning during the Reasoning Summary phase (`SummaryPhase`). Detects 5 common beginner mental traps (0-indexing offsets, `=` assignment vs `==` comparison, string immutability in RAM, parallel list desynchronization, unhandled edge-case inputs) and provides targeted Socratic guiding prompts.

### 2. 🎨 Dynamic Dashboard Theme Engine & Theme-Switched Curriculum
- **4 Theme Worlds**: Logged-in users can switch between **Default Theme** 🐍, **Potterheads** 🧙‍♂️, **Marvel** 🦾, and **Anime** ⚔️ directly from the dashboard.
- **Theme-Switched Scenarios & Case Studies**: Choosing a theme dynamically switches case study arcs and chapter scenarios across the dashboard, case study browser, scenario browser, and chapter learning flow.
- **Complete Chapter Coverage**: Every single one of the 13 curriculum chapters dynamically adapts its scenario questions, vibe, real-world connection, and code examples per active theme.

### 3. 🌗 Tailored Light & Dark Modes
- Custom HSL color variables and dedicated Light & Dark mode styling for every theme:
  - **Potterheads**: Hogwarts Dark Parchment (`#1E1610`) & Warm Light Parchment (`#FAF4E8`) with Dark Wizard Ink (`#291E16`).
  - **Marvel**: Stark Cyber Dark (`#0B132B`) & Titanium Light (`#F1F5F9`) with Slate Ink (`#0F172A`).
  - **Anime**: Tokyo Neon Dark (`#120D1D`) & Sakura Lavender Light (`#FAF5FF`) with Cyber Ink (`#1E1B4B`).

### 4. 📊 93 Total Seeded Scenarios
- **54 Default/Classic Scenarios**: Real-world scenarios spanning Chai Stall, ISRO Space Mission Control, Instagram Filters, Food Delivery, AI Playlists, and Kota Merit Lists.
- **39 Theme-Specific Scenarios**: 13 Potterheads + 13 Marvel + 13 Anime scenarios covering all 13 chapters.

## What came in v2.1

- **Login / Signup** — localStorage-based auth with per-user chapter progress tracking
- **Left curriculum sidebar** — full syllabus always visible, 13 chapters across 4 sections
- **Sequential chapter flow** — Intro → Questions → Reasoning Summary → Theory Reveal
- **Docs-style theory** — concept explained as documentation (prose + code block + callout)
- **GSAP animations** — staggered reveal on theory, slide transitions between phases
- **Educational score display** — level labels (🔥 Excellent / ⚡ Strong / 💡 Good / 📈 Getting there / 🌱 Beginning) with client-side fallback scoring

## What came in v2.0

- Complete UI redesign — dark mode, glassmorphism, Space Grotesk + Inter typography
- 6 UADE Case Study Themes — Chai Stall, ISRO, Instagram, Food Delivery, AI Playlist, Kota
- 54+ scenarios — original 30 plus 24 theme-based scenarios
- `/api/casestudies` endpoint + theme filtering on `/api/scenarios`

---

## Curriculum (13 Chapters)

| Section | Chapters |
|---|---|
| 🌱 Getting Started | Variables · Operators & Math · Strings & Text |
| 📚 Basics | Making Decisions · Loops · Lists |
| ⚙️ Intermediate | Dictionaries · Sets · Functions · Search & Filter |
| ⚡ Advanced | Error Handling · Algorithms · Files & Data |

---

## Tech Stack

- **Frontend:** React 18 + Vite + React Router v6 + GSAP 3
- **Styling:** Vanilla CSS (custom properties, dark mode, glassmorphism)
- **Fonts:** Space Grotesk (headings) + Inter (body) + JetBrains Mono (code)
- **Backend:** Node.js + Express
- **Data:** JSON file storage (`server/src/data/db.json`) — no MongoDB, no Docker
- **Auth:** localStorage-based (prototype — no backend auth)
- **Logic:** Deterministic rule-based learning engine (no external AI keys required)

---

## Prerequisites

- Node.js 18+

---

## Setup

### 1. Install dependencies
```bash
npm run installAll
```

### 2. Configure the server environment
```bash
# Windows
copy server\.env.example server\.env

# macOS/Linux
cp server/.env.example server/.env
```
Default values work for local development.

### 3. Seed sample data
```bash
npm run seed
```

### 4. Run the app
```bash
# Start both servers together
npm run dev

# Or separately
npm run dev --prefix server   # API on :5000
npm run dev --prefix client   # App on :5173
```

- **App:** http://localhost:5173 → sign up, then start a chapter
- **API:** http://localhost:5000/api

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | `{"ok":true,"version":"2.0.0"}` |
| GET | `/api/scenarios` | All 69 scenarios (`?q=`, `?concept=`, `?theme=`, `?caseStudyId=`) |
| GET | `/api/scenarios/:id` | One scenario |
| POST | `/api/sessions` | Submit reasoning session → returns score + code + feedback |
| GET | `/api/sessions` | Recent sessions |
| GET | `/api/analytics` | Aggregate learner stats |
| GET | `/api/roadmap` | Learning roadmap phases |
| GET | `/api/casestudies` | All case study themes (`?theme=default`, `?theme=potterheads`, `?theme=marvel`, `?theme=anime`) |
| GET | `/api/casestudies/:id` | One theme |

---

## Project Structure

```
pybe/
├── client/
│   └── src/
│       ├── context/
│       │   └── AuthContext.jsx       # localStorage auth + progress tracking
│       ├── data/
│       │   └── curriculum.js         # 13 chapters with theory content + concept mappings
│       ├── layouts/
│       │   └── AppLayout.jsx         # Sidebar + content wrapper (protected)
│       ├── components/
│       │   └── CurriculumSidebar.jsx # Collapsible syllabus with progress dots
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── Login.jsx         # GSAP entrance, glassmorphism card
│       │   │   └── Signup.jsx
│       │   ├── AppHome.jsx           # Dashboard: progress bar, chapter list
│       │   ├── ChapterPage.jsx       # 4-phase learning flow (Intro→Q→Summary→Theory)
│       │   └── Home.jsx              # Public landing page
│       ├── styles/
│       │   ├── index.css             # Design system (CSS vars, dark mode, utilities)
│       │   └── animations.css        # Keyframes
│       ├── App.jsx                   # Router with Protected/GuestOnly guards
│       └── main.jsx
│
├── server/
│   └── src/
│       ├── data/
│       │   ├── db.json               # JSON data store (scenarios + sessions)
│       │   ├── store.js              # CRUD helpers
│       │   └── roadmap.js
│       ├── routes/                   # scenarios, sessions, analytics, roadmap, casestudies
│       ├── services/
│       │   └── learningEngine.js     # Keyword mapper, code generator, prompt evaluator
│       ├── seed.js                   # 54 scenarios (30 classic + 24 UADE themed)
│       └── index.js
│
├── context.md                        # Pedagogical foundations
├── product.md                        # Full product document (features, decisions, roadmap)
└── README.md
```

---

## Learning Flow (per chapter)

```
[Intro]      → Hook, what you'll discover, scenario setup
    ↓  "Let's go"
[Questions]  → Scenarios one at a time (GSAP slide-in)
              → User writes plain-English reasoning
    ↓  Last question submitted
[Summary]    → All answers shown with educational score level
              → "Now discover why →"
    ↓
[Theory]     → Docs-style: explanation prose → code block → callout → key takeaway
              → "Mark as Complete ✓" → next chapter (always starts fresh at Intro)
```

---

## Notes

- The AI behavior is deterministic and local — no external API keys needed
- Learning data is in `server/src/data/db.json`; running `npm run seed` resets scenarios (not user progress)
- User progress is in `localStorage` and persists across browser sessions
- See `product.md` for full design decisions and `context.md` for the pedagogy

---

*PyBe v2.1 — IIT Ropar Summer Internship 2026 | Sukrit*
