# PyBe — Treasure Kingdom (Iterators & Generators)

This project introduces the **Iterators & Generators** adventure topic into the **PyBe Gamified Programming Learning Engine**.

---

## 🎯 Project Overview

Added Topic: 🏰 **Iterators & Generators (Treasure Kingdom Adventure)**

This project contains a 13-stage gamified adventure engine designed to teach core Python memory architecture, state suspension, and lazy evaluation through intuitive analogies:

- **Page 1 — Kingdom Entrance**: Hero welcome screen and adventure roadmap.
- **Page 2 — The Carry Challenge**: Memory footprint intuition ($1,000,000$ treasure boxes in storage).
- **Page 3 — Concept Reveal (Iterable)**: The `🏠 Warehouse` storing full data collections in RAM memory.
- **Page 4 — Who Opens Treasure**: Distinguishing data containers (`list`) from stream cursors (`iter()`).
- **Page 5 — Concept Reveal (Iterator)**: Step-by-step cursor movement (`next()`), state persistence, and `StopIteration` handling.
- **Page 6 — Thirsty Hero Dilemma**: Comparing 9 pre-filled juice cups vs 1 fresh water tap.
- **Page 7 — Concept Reveal (Generator)**: The `🚰 Magic Water Tap` generating items lazily on demand.
- **Page 8 — Memory Meter Comparison**: RAM footprint breakdown (High RAM 95% vs Low RAM 15%).
- **Page 9 — Yield Concept**: State suspension & resumption (`yield`) explained via interactive movie pause/play.
- **Page 10 — Super Comparison**: Side-by-side breakdown of Iterable, Iterator, and Generator.
- **Page 11 — Boss Match Game**: Interactive dual-column term matching challenge.
- **Page 12 — Python Syntax in Action**: Comparative code windows (`iterator.py` with `iter()`/`next()` vs `generator.py` with `yield`).
- **Page 13 — MCQ Quiz**: 6-question comprehensive concept assessment.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core**: React 18 + Vite
- **Styling**: Vanilla CSS with dark mode glassmorphism & Duolingo-style 3D pressable buttons
- **Iconography**: Lucide React (`lucide-react`)
- **Sound Engine**: Synthesized Web Audio API (`AudioContext` for page turns, correct/incorrect chimes, and water drops)
- **Background Animations**: HTML5 2D Canvas rendering clouds and flying birds

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
- **Frontend Application**: [http://localhost:5173/](http://localhost:5173/)

### 3. Build for Production
```bash
npm run build
```

---

## 📁 Directory Structure

```
magical-library-adventure/
├── src/
│   ├── components/
│   │   ├── Header.jsx               # Navigation bar & menu triggers
│   │   ├── FooterNavigation.jsx     # Progress bar, step dots, and Prev/Next controls
│   │   ├── AdventureMapModal.jsx    # Quick jump map modal overlay
│   │   ├── BackgroundCanvas.jsx     # Animated clouds & birds background canvas
│   │   └── MCQCard.jsx              # Reusable 4-option quiz component
│   ├── slides/                      # 13 Adventure slide pages
│   │   ├── Page1_Entrance.jsx
│   │   ├── Page2_CarryChallenge.jsx
│   │   ├── Page3_IterableConcept.jsx
│   │   ├── Page4_WhoOpensTreasure.jsx
│   │   ├── Page5_IteratorConcept.jsx
│   │   ├── Page6_ThirstyDilemma.jsx
│   │   ├── Page7_GeneratorConcept.jsx
│   │   ├── Page8_MemoryMeter.jsx
│   │   ├── Page9_YieldConcept.jsx
│   │   ├── Page10_SuperComparison.jsx
│   │   ├── Page11_BossMatchingGame.jsx
│   │   ├── Page12_MemoryCard.jsx
│   │   └── Page13_VictorySandbox.jsx
│   ├── utils/
│   │   └── soundEngine.js           # Web Audio API synthesizer
│   ├── App.jsx                      # Main slide manager
│   ├── main.jsx                     # React entry point
│   └── index.css                    # Design system & glassmorphism CSS
├── index.html                       # Application shell
├── package.json                     # Project dependencies & scripts
└── README.md                        # Documentation
```
