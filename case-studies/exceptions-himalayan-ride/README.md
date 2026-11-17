# The High Pass: Swati's Himalayan Ride 🏔️🏍️
### PyBe Interactive Discovery Lab — Python Exception Handling

[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla%20ES6%2B-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)](https://python.org)
[![Streamlit](https://img.shields.io/badge/Companion-Streamlit%20App-FF4B4B?logo=streamlit&logoColor=white)](https://streamlit.io)
[![Quality Gates](https://img.shields.io/badge/Quality%20Gates-4%2F4%20Passing-success)](tools/)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg)](assets/CREDITS.md)

> Discover Python Exception Handling (`try` / `except` / `else` / `finally` / `raise`) organically through the physical intuition of a 474 km solo Royal Enfield motorcycle journey from Manali to Leh across the highest passes in the world.

---

## 🌟 Executive Overview

**The High Pass** is an open-source, story-driven discovery lab built for the **PyBe (Python by Experience)** platform. 

Rather than teaching exceptions deductively through dry syntax rules or synthetic dummy examples (e.g. dividing by zero or opening non-existent files), it grounds every error-handling construct in the concrete, high-stakes dilemmas of crossing the Himalayas:

| Himalayan Expedition Reality | Python Construct | Pedagogical Intuition |
|:---|:---|:---|
| **Entering Hazard Zone:** Crossing an unstable scree pass. | `try:` | Protects only code subject to external environmental shocks, not safe highway. |
| **Specific Breakdown Toolkit:** Drowning spark plug requires plug wrench; puncture cement cannot fix electrical stalls. | `except SpecificError:` | Dedicated handlers for named hazards; avoids the dangerous catch-all anti-pattern. |
| **Clean Ride Celebration:** Savoring hot thermos chai only when today's ride had zero mechanical failures. | `else:` | Executes strictly when the `try` block completes with no exceptions raised. |
| **Mandatory Nightfall Camp:** Pitching shelter at dusk before sub-zero temperatures hit—whether the day was a breeze or a repair battle. | `finally:` | Guaranteed cleanup block that runs unconditionally on clean runs or unhandled crashes. |
| **Proactive Departure Alarm:** Inspecting fuel before departure, discovering contamination, and halting before the engine seizes. | `raise FuelContaminationError(...)` | Signaling fatal precondition violations before unsafe execution begins. |

---

## 🚀 Quick Start (Zero Build Step)

The primary application is built with pure vanilla HTML5, CSS3, and modern ES6+ JavaScript. **No Node build step, no bundlers, and no npm dependencies required.**

### Option 1: Direct Browser Launch (Fastest)
1. Clone the repository:
   ```bash
   git clone https://github.com/Kritika-1301/Ladakh.git
   cd Ladakh
   ```
2. Double-click or open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server
```bash
# Start a local static server using Python
python -m http.server 8088

# Open in your browser:
# http://localhost:8088/index.html
```

### Option 3: Streamlit Companion Deliverable
For Python notebook or Streamlit environments:
```bash
pip install streamlit
streamlit run app.py
```

---

## 🗺️ 12-Stage Himalayan Route (Official BRO Survey Elevations)

The expedition traces NH-3 across 12 progressive stations verified against official Border Roads Organisation (Projects *Deepak* & *Himank*) survey benchmarks:

```
[ACT 1: THE RIDE]
Scene 01: Manali Base    ( 6,726 FT) ──► pack      (Drag/tap 5 essential survival spares into panniers)
Scene 02: Rohtang La     (13,050 FT) ──► wrap      (Inspect pre-ride checklist, bracket rockfall hazard in try)
Scene 03: Zingzingbar    (14,000 FT) ──► match     (Hold throttle through stream, stall, dry spark plug in except)

[ACT 2: PHYSICAL INTUITION]
Scene 04: Baralacha La   (16,040 FT) ──► wire      (Patch multiple mechanical hazards to specific handler lanes)
Scene 05: Sarchu         (14,070 FT) ──► predict   (Predict chai reward logic on clean vs breakdown ride days)
Scene 06: Pang           (15,280 FT) ──► timer     (Beat dropping sub-zero thermometer with mandatory camp protocol)
Scene 07: Morey Plains   (15,400 FT) ──► order     (Drag 4 daily stages into correct chronological sequence)

[ACT 3: SYNTAX BRIDGE]
Scene 08: Debring        (15,500 FT) ──► flip      (Interactive in-place 3D card morph from English to Python syntax)
Scene 09: Tanglang La    (17,480 FT) ──► runbreak  (Execute 12-line CPython simulator with synchronized line tracer)
Scene 10: Karu           (11,100 FT) ──► tapline   (Inspect real-world input parsing code and identify ValueError)
Scene 11: Shey           (11,500 FT) ──► flag      (Place proactive safety precondition flag to discover raise)
Scene 12: Leh Arrival    (11,562 FT) ──► collect   (Assemble 4 trail notes, generate verified HTML5 canvas credential)
```

---

## 📁 Repository Architecture

```
Ladakh/
├── index.html              # Main single-page web application entry point
├── app.py                  # Single-file Streamlit companion deliverable
├── product.md              # Complete product vision & pedagogical specification
├── change.md               # Antigravity v3 rebuild & architecture changelog
├── context.md              # Pedagogy of Discovery Labs vs. definition-first teaching
├── README.md               # Quick-start guide and repository documentation
├── assets/
│   ├── photos/             # 12 high-resolution BRO survey station backdrops (01 to 12)
│   └── CREDITS.md          # Wikimedia Commons / CC attribution register
├── css/
│   ├── base.css            # Typography, custom design tokens, dark Himalayan palette
│   ├── hud.css             # Top navigation, 4-lamp motorcycle dashboard, audio toggle
│   ├── stage.css           # ≥55% illustration hero stage and interactive elevation footer
│   ├── interactions.css    # Specialized styles for all 12 physical interactive verbs
│   └── quickcheck.css      # Non-blocking collapsible Quick Check MCQ drawers
├── js/
│   ├── scenes.js           # 12-scene single source of truth data schema
│   ├── schema.js           # Runtime data schema validator
│   ├── engine.js           # Story state machine, audio triggers, navigation controller
│   ├── audio.js            # Dependency-free Web Audio procedural synthesizer
│   ├── dragkit.js          # Unified pointer and click-to-place drag-and-drop system
│   ├── certificate.js      # HTML5 canvas certificate generator and exporter
│   └── interactions/       # 12 standalone interactive verb controllers (pack, wrap, etc.)
├── docs/
│   ├── altitudes.md        # Official BRO survey elevation benchmarks
│   ├── audit.md            # Rebuild audit directives and text budget metrics
│   └── pr-review.md        # Proven concepts synthesized from top PyBe summer PRs
└── tools/
    ├── validate-scenes.mjs  # Gate 1: Scene schema, photo, and altitude validator
    ├── lint-text.mjs        # Gate 2: Text word budget and MCQ balance linter
    ├── verify_python.py     # Gate 3: 16-combination CPython execution matrix
    └── check-assets.mjs     # Gate 7: Asset footprint and attribution checker
```

---

## 🧪 Automated Quality Gates

All automated quality tests can be run with standard Node.js and Python commands:

```bash
# Gate 1: Scene Schema & BRO Elevation Validator
node tools/validate-scenes.mjs

# Gate 2: Text Budget (≤12 words/scene) & Balanced MCQ Distributions
node tools/lint-text.mjs

# Gate 3: 16-Combination CPython Execution Verification Matrix
python tools/verify_python.py

# Gate 7: Asset Footprint (<400 KB/photo) & CC Attribution Audit
node tools/check-assets.mjs
```

All 4 quality gates pass with a **100% pass rate**.

---

## 📜 Documentation Triad

* **[`product.md`](product.md):** Complete product vision, executive summary, 1:1 mountain-to-Python exception mapping, and scene-by-scene learner journeys.
* **[`context.md`](context.md):** Discovery Lab pedagogical philosophy, analysis of the "Why not just `if`?" fallacy, and overcoming the catch-all anti-pattern.
* **[`change.md`](change.md):** Architectural changelog detailing the transition from passive reading into an action-gated 12-stage discovery lab.
* **[`docs/pr-review.md`](docs/pr-review.md):** Design heritage and concepts synthesized from top Summer '26 PyBe intern contributions.

---

## ⚖️ License & Attribution

* Code is licensed under the **MIT License**.
* Photographic assets are sourced from verified Wikimedia Commons and CC-BY/CC-BY-SA public archives. Detailed photographer credits, license links, and source URLs are registered in [`assets/CREDITS.md`](assets/CREDITS.md).