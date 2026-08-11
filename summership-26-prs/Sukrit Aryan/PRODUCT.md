# PyBe — Product Document

> **Version:** 2.2.0
> **Release Date:** July 2026
> **Status:** Active development — IIT Ropar Summer Internship

---

## Version History

| Version | Description |
|---|---|
| **v1.0.0** | Initial prototype — single-page React app, plain CSS, 30 classic scenarios, no routing, no auth |
| **v2.0.0** | Multi-page redesign — React Router, 6 UADE themes, 54+ scenarios, HorcruxVault, premium dark UI |
| **v2.1.0** | Auth system, left curriculum sidebar, sequential chapter learning flow, GSAP animations, docs-style theory reveal |
| **v2.2.0** | Dynamic dashboard theme selector (Default, Potterheads, Marvel, Anime), theme-switched case studies & scenarios, tailored Dark & Light mode color palettes, **First-Principles Friction Simulator**, **Interactive Mental Model Lab**, **Instant Micro-Sandbox**, and **Socratic Misconception Spotter** |

---

## What's New in v2.2

### 1. First-Principles Learning Engine
- **Friction Simulator (Before vs After)**: Side-by-side comparison cards embedded in every chapter's Theory phase. Compares fragile manual code without the construct against clean Python code, explaining the exact pain point that forced computer scientists to invent the construct.
- **Interactive Mental Model Lab**: Live hands-on visualizers embedded in the Theory phase showing RAM memory slots (`0x7F8`), arithmetic operator pipelines, zero-indexed string character arrays, decision tree flowchart branching, loop iteration steppers, array append/pop counters, hash table lookup tables ($O(1)$ key mapping), unique set buckets, function machine inputs/outputs, binary/linear search scanners, `try/except` exception shields, array sort steppers, and RAM $\rightarrow$ Disk storage buffers.
- **Instant Micro-Sandbox / Interactive Try-It Widget**: Embedded live browser-based Python code editor and executor right below code examples. Features code resetting, live syntax validation, and an authentic dark terminal stdout console (`$ python main.py`).
- **Socratic Misconception Spotter**: Automated analysis of student reasoning during the Reasoning Summary phase (`SummaryPhase`). Detects 5 common beginner mental traps (0-indexing offsets, `=` assignment vs `==` comparison, string immutability in RAM, parallel list desynchronization, unhandled edge-case inputs) and provides targeted Socratic guiding prompts.

### 2. Dynamic Dashboard Theme System
- Logged-in users can choose between 4 theme worlds on their dashboard:
  1. **Default Theme** 🐍: Classic PyBe Chai Stall & ISRO experience.
  2. **Potterheads** 🧙‍♂️: Hogwarts potions brewing, Marauder's map & spell vaults.
  3. **Marvel** 🦾: Avengers AI, J.A.R.V.I.S. suit telemetry & Infinity Stone grid.
  4. **Anime** ⚔️: Hidden Leaf Jutsu chakra engine & Legendary Creature hunter.

### 3. Theme-Switched Case Studies & Scenarios
- Choosing a theme dynamically updates case study arcs and scenario recommendations across the dashboard, case study browser, scenario browser, and chapter learning flow.
- Core curriculum, syllabus structure, and Python theory remain completely preserved.
- **93 Total Seeded Scenarios**: 54 Default/Classic + 13 Potterheads + 13 Marvel + 13 Anime scenarios covering all 13 curriculum chapters.

### 4. Tailored Dark & Light Mode Color Palettes
- Custom color tokens for both Light and Dark modes:
  - **Potterheads Light**: Warm Hogwarts parchment background (`#FAF4E8`), wizard ink text (`#291E16`), Gryffindor amber accents (`#B45309`).
  - **Marvel Light**: Stark Titanium metallic background (`#F1F5F9`), titanium dark text (`#0F172A`), Stark Red accents (`#DC2626`).
  - **Anime Light**: Tokyo Sakura Lavender background (`#FAF5FF`), cyber dark text (`#1E1B4B`), Tokyo Magenta Pink accents (`#C026D3`).
- **Landing Page Integrity**: Unauthenticated visitors on `/` retain standard public landing page styling untouched.

### 1. Authentication (Login / Signup)
- Local `localStorage`-based auth — no backend changes needed, fully offline-capable
- `AuthContext.jsx` manages sessions, progress-per-user, and chapter completion state
- Chapter completion is stored in `localStorage` keyed by `user.id` — survives browser refresh
- `Protected` route guard — unauthenticated users are redirected to `/login`

### 2. Left Curriculum Sidebar (replaces top navbar)
- Fixed `260px` sidebar with collapsible sections
- 4 sections: Getting Started, Basics, Intermediate, Advanced
- 13 chapters total, each with status dot (○ not started / ✓ done)
- Overall progress bar at the top
- User chip with avatar initials
- GSAP stagger-in animation on first render
- Mobile: hamburger overlay that slides the sidebar in

### 3. Sequential Chapter Learning Flow
Every chapter follows a fixed 4-phase flow:

| Phase | Description |
|---|---|
| **Intro** | Hook, what you'll figure out, setup scenario, "Let's go" |
| **Questions** | Scenarios one-by-one (slide in/out with GSAP), plain-English reasoning textarea |
| **Summary** | Reasoning recap with educational score labels (🔥 Excellent / ⚡ Strong / 💡 Good / 📈 Getting there / 🌱 Just beginning) |
| **Theory** | Docs-style concept explanation (eyebrow → title → gradient concept name → prose → code block → callout → key takeaway → Mark Complete) |

### 4. Educational Score System
- Primary: backend learning engine score (`promptScore`) from keyword/concept matching
- Fallback: client-side estimator based on reasoning length + quality signals (because/since/instead/organize/etc.)
- Score displayed as level label + emoji + colour — not just a number
- Per-answer badges in summary view

### 5. Docs-style Theory Reveal (fixed)
- Previously: GSAP `.from('.theory-body > *')` re-animated already-visible headings, causing them to flash/disappear
- Fixed: All theory elements targeted by individual class selectors via `querySelectorAll`, then animated once with `gsap.set` + `gsap.to`. No double-animation.
- Phase reset: `useEffect([chapterId])` resets all state when the chapterId param changes, so "Mark Complete → next chapter" always starts at Intro, not Theory.

### 6. Curriculum Structure

| Section | Chapters |
|---|---|
| 🌱 Getting Started | Variables, Operators & Math, Strings & Text |
| 📚 Basics | Making Decisions (if/else), Loops, Lists |
| ⚙️ Intermediate | Dictionaries, Sets, Functions, Search & Filter |
| ⚡ Advanced | Error Handling, Algorithms, Files & Data |

Each chapter contains: intro (hook, vibe, discover), theory (layman explanation, code example, real-world connection, key takeaway), and maps to 2–4 scenarios from the DB.

### 7. Theory Content (per chapter)
All 13 chapters have hand-written theory content in `curriculum.js`:
- Written at a **junior student level** — plain English, no jargon
- Explains the concept as a rediscovery of what the learner just reasoned about
- Includes working code examples with in-line comments
- Ends with a key takeaway sentence
- Grounded in Barrows' PBL framework (theory emerges from lived problem)

---

## Deliberate Design Decisions

### No Authentication Backend (by design)
Auth is localStorage-only. This keeps the app 100% offline, requires zero database changes, and is appropriate for a single-user prototype. A real server-side auth layer is Phase 3.

### No Python Sandbox (deferred to v3)
The current interaction model (reason in English → theory reveal → code example) is Phase 2. Running actual Python (Pyodide/WASM or server-side exec) is Phase 3.

### Left Sidebar Always Visible
Research on educational platforms (Khan Academy, Codecademy, Brilliant) consistently shows that a persistent curriculum sidebar improves learner orientation. The sidebar shows progress at a glance and prevents the "where am I?" confusion of accordion menus.

---

## Routing Structure

```
/          → Landing page (public)
/login     → Login  (redirect to /app if already logged in)
/signup    → Signup (redirect to /app if already logged in)
/app       → AppLayout (protected)
  /app     → AppHome dashboard
  /app/chapter/:id  → ChapterPage (4-phase learning flow)
```

---

## API Routes

| Route | Description |
|---|---|
| `GET /api/health` | `{"ok":true,"product":"PyBe","version":"2.0.0"}` |
| `GET /api/casestudies` | All 6 UADE themes |
| `GET /api/casestudies/:id` | One theme |
| `GET /api/scenarios` | All 54 scenarios |
| `GET /api/scenarios?concept=X` | Filter by concept |
| `GET /api/scenarios?theme=X` | Filter by UADE theme |
| `POST /api/sessions` | Submit a reasoning session, get back score + feedback |
| `GET /api/analytics` | Aggregate stats (session count, concept counts, etc.) |

---

## Roadmap (V0 → V3)

| Phase | What |
|---|---|
| V0 (done) | Single-page prototype, 30 scenarios, plain CSS |
| V1 → v2.0 | Multi-page app, 6 UADE themes, 54+ scenarios, premium dark UI |
| V2 → v2.1 | Auth, left sidebar, sequential chapter flow, docs-style theory, GSAP |
| V3 (planned) | Python sandbox (Pyodide), audio input, leaderboard, real server-side auth |
| V4 (planned) | LLM trained on Python textbooks, rhizomatic path selector, Piaget-stage adaptive delivery |

---

*PyBe v2.1 — IIT Ropar Summer Internship 2026 | Sukrit*
