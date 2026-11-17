# Product Specification: The High Pass Discovery Lab

> **A story-driven, interactive case study discovering Python Exception Handling (`try` / `except` / `else` / `finally` / `raise`) through the physical intuition of a 474 km solo Royal Enfield motorcycle journey across the Manali–Leh Highway.**

---

## 1. Executive Summary & Vision

**The High Pass** is an open-source, interactive case study built for the **PyBe (Python by Experience)** platform. It teaches Python's exception-handling architecture by placing the learner on the seat of "Dug-Dug", a Royal Enfield Bullet 350 ridden by Swati across the highest motorable mountain passes in the world.

### The Pedagogical Problem: Definition-First Teaching
Traditional computer science education introduces exception handling deductively:
1. Recite keywords: `try`, `except`, `else`, `finally`.
2. Present synthetic scenarios (e.g., dividing by zero or opening non-existent dummy files).
3. Expect learners to memorize syntax without understanding why standard `if/else` branching is inadequate.

This causes two persistent student misconceptions:
- **The "Why Not Just `if`?" Fallacy:** Without unpredictable environmental hazards outside the program's control (glacial torrents, severed drive chains, unreadable inputs), exception handling appears to be syntactic ceremony.
- **The Catch-All Anti-Pattern:** Without concrete mental models for distinct hazards, students default to `except: pass` or `except Exception:`—the digital equivalent of riding a motorcycle with all warning gauges disconnected.

### The Discovery Solution: Physical Intuition First
The Discovery Lab reverses the learning sequence:
$$\text{Physical Dilemma} \longrightarrow \text{Intuitive Consequence} \longrightarrow \text{Felt Need} \longrightarrow \text{In-Place Syntax Morph}$$

No Python syntax appears on screen until the mental model is solidified. By the time code appears in Scene 8, Python keywords feel like a natural, concise notation for mountain common sense.

---

## 2. 1:1 Mapping: Mountain Survival to Exception Handling

The 474 km Manali–Leh Highway provides an exact, organic 1:1 model for program execution:

| Himalayan Expedition Reality | Python Construct | Pedagogical Insight |
|:---|:---|:---|
| **Attempting the Hazard:** Setting off onto a dangerous riverbed or high pass. | `try:` | You only guard code that can experience unexpected environmental shocks, not safe highway. |
| **Specific Breakdown Toolkit:** Freezing water in carburetor requires drying the spark plug; puncture cement cannot fix electrical stalls. | `except WaterInEngineError:`<br/>`except FlatTyreError:` | Specific, named exceptions require dedicated handlers. A generic catch-all does not fix distinct mechanical failures. |
| **Clean Run Reward:** Celebrating with hot thermos chai only when today's ride was 100% breakdown-free. | `else:` | Executes strictly when the `try` block completes with zero exceptions raised. |
| **Mandatory Nightfall Protocol:** Pitching the shelter tent at dusk before sub-zero temperatures hit—whether the day was a breeze or an exhausting repair battle. | `finally:` | Guaranteed cleanup execution that runs unconditionally, ensuring system safety even on unhandled crashes. |
| **Sounding the Alarm:** Inspecting the petrol tank before departure, discovering contaminated kerosene, and halting before the engine seizes. | `raise ContaminatedFuelError(...)` | Actively signaling an unrecoverable violation of safety preconditions before dangerous execution begins. |

---

## 3. Verified Route Altitudes & Geographic Sources

All elevations, station sequences, and terrain descriptions have been verified against official **Border Roads Organisation (BRO)** project signboards (Projects *Deepak* and *Himank*), **Survey of India (SOI)** topographic maps, and regional transport records:

| Scene # | Station Name | Elevation (BRO Survey) | Landmarks & Terrain Reality |
|:---:|---|:---:|---|
| **01** | **Manali Base** | **6,726 FT** (2,050 m) | Kullu valley floor; origin of NH-3; packing saddlebags before signal drops |
| **02** | **Rohtang La** | **13,050 FT** (3,978 m) | Pir Panjal crest; loose scree and active rockfall zone; pre-ride inspection |
| **03** | **Zingzingbar** | **14,000 FT** (4,270 m) | Bhaga River gorge transit camp; icy glacial melt torrent choking carburetor |
| **04** | **Baralacha La** | **16,040 FT** (4,890 m) | High watershed pass connecting Lahaul to Zanskar; razor moraine slate puncturing tyre |
| **05** | **Sarchu** | **14,070 FT** (4,290 m) | Broad windswept plain on HP–Ladakh border; clean, smooth cruising run |
| **06** | **Pang** | **15,280 FT** (4,600 m) | Deep canyon river transit camp; dropping thermometer and mandatory night camp |
| **07** | **Morey Plains** | **15,400 FT** (4,800 m) | 40 km high-altitude plateau; ordering Swati's 4-stage daily survival routine |
| **08** | **Debring** | **15,500 FT** (4,850 m) | Base camp beneath Tanglang La; Swati's indented English notebook morphs into Python |
| **09** | **Tanglang La** | **17,480 FT** (5,328 m) | Second-highest motorable summit pass; running the real 12-line CPython simulator |
| **10** | **Karu** | **11,100 FT** (3,450 m) | Descent into Indus Valley tarmac; mapping mountain logic to `int(input())` ValueError |
| **11** | **Shey** | **11,500 FT** (3,500 m) | Ancient monastery plains; proactive safety inspection triggering `raise` |
| **12** | **Leh Arrival** | **11,562 FT** (3,524 m) | Shanti Stupa victory; trail notes assembled into verified Himalayan Pythonist credential |

---

## 4. The 12-Stage Learner Journey (12 Unique Physical Verbs)

Following the Phase 0 audit findings (`docs/audit.md`), the curriculum eliminates repetitive reading/quiz loops. Every single scene is anchored around a **unique physical verb**:

```
[ACT 1: THE RIDE]
Scene 1: Manali Base  ──► Pack     (Drag 5 essential survival tools into panniers)
Scene 2: Rohtang La    ──► Wrap     (Inspect checklist, wrap rockfall hazard in try)
Scene 3: Zingzingbar   ──► Match    (Hold throttle through stream, match plug tool)

[ACT 2: PHYSICAL INTUITION]
Scene 4: Baralacha La  ──► Wire     (Patch multiple mechanical hazards to handler lanes)
Scene 5: Sarchu        ──► Predict  (Predict chai reward outcome for 3 distinct ride days)
Scene 6: Pang          ──► Timer    (Beat falling sub-zero thermometer by pitching tent)
Scene 7: Morey Plains  ──► Order    (Drag 4 daily stages into correct chronological sequence)

[ACT 3: SYNTAX BRIDGE]
Scene 8: Debring       ──► Flip     (In-place interactive morph of plain English into Python)
Scene 9: Tanglang La   ──► Runbreak (Test 12-line simulator across 4 days with line tracer)
Scene 10: Karu         ──► Tapline  (Inspect real-world input code and identify crashing line)
Scene 11: Shey         ──► Flag     (Drag raise alarm flag into pre-flight safety check)
Scene 12: Leh Arrival  ──► Collect  (Assemble 4 trail notes, render HTML5 canvas certificate)
```

### Action-First Gating (Zero Passive Next Clicks)
- The **Next Stage** button is permanently locked upon entering every scene.
- It unlocks exclusively when the learner completes that scene's physical action.
- A user cannot click through the journey without engaging with the mountain's mechanics.

---

## 5. UI Architecture & Design Standards

### 1. Visual Dominance ($\ge 55\%$ Viewport)
- The upper $\ge 55\%$ of the viewport is dedicated to the **Illustration & Photo Stage** (`#photo-stage-container`).
- High-resolution photographic backdrops from BRO NH-3 survey stations are paired with SVG interactive overlays, road paths, and animations.

### 2. 4-Lamp Motorcycle Dashboard
Mounted prominently in the top HUD, four color-coded dashboard lamps light up as Swati earns each mental stage of the exception architecture:
- 🔵 **Road (`try:`):** Lit at Rohtang La.
- 🔴 **Fix (`except:`):** Lit at Zingzingbar.
- 🟡 **Chai (`else:`):** Lit at Sarchu.
- 🟢 **Camp (`finally:`):** Lit at Pang.

### 3. Radical Text Reduction
- **Narration Bar:** Strictly $\le 12$ words per scene (verified by automated linter).
- **Radio Bubble:** Strictly $\le 10$ words per scene. Replaced dialogue ping-pong with crisp radio dispatches between Swati and Tashi (BRO Guide).

### 4. Non-Blocking Quick Check Drawers
- Rather than constant intrusive side-quizzes, Quick Checks are restricted to exactly 6 scenes (2, 4, 5, 6, 9, 10).
- Quick Checks live in collapsible bottom drawers with balanced 3-option distributions (A: 2, B: 2, C: 2) and story-driven consequence feedback.

### 5. Web Audio Synthesizer Engine
- Fully procedural Web Audio API engine (`js/audio.js`).
- Produces authentic low-frequency single-cylinder Royal Enfield engine thumps, gear clicks, radio squelches, error thuds, and completion chimes.
- Default: **Muted** (zero auto-play violations, explicit user toggle).

---

## 6. Concepts Borrowed from Summer '26 PRs

The High Pass integrates best practices proven in fellow PyBe intern submissions (`docs/pr-review.md`):

1. **Deepa Basnet (PyFarm):** Real execution harness and test matrix verifying runtime state rather than brittle string matching.
2. **Anshika Saraswat (Hawkins):** Action rhythm of physical choice $\rightarrow$ consequence $\rightarrow$ syntax reveal; collectible Trail Notes.
3. **Mehak Gupta (Lost Library) & Khushi Choudhary:** Constrained solvable hazard scenarios and randomized card presentation.
4. **Jasvinder Kaur & Aryan Vishala:** Synchronized line tracer stepping the active Python line simultaneously with dashboard lamps and elevation markers.
5. **Abhi Patel (Monkey & Crocodile):** Plain English rules assembled by hand morph in place into syntax-highlighted code.
6. **Siddharth Sadhu & Writwik Das:** Misconception-first framing; physical environmental shocks establish felt need before keywords appear.
7. **Bhoomi Gupta & Pritam Patra:** Strict discovery arc; Python keywords earned as visual badges rather than presented up front.
8. **Hemanth Kumar Reddy:** Balanced shuffled options with physical consequence feedback.
9. **Damanpreet Singh & Pradeep Mishra:** Unit testing quality gates, schema validation, and verified BRO altitudes.
10. **Mohammad Hamdan:** Dual-deliverable support including single-file Streamlit companion (`app.py`).

---

## 7. Tech Stack & Delivery Formats

### Primary Deliverable: Pure Vanilla Web App
- **Stack:** HTML5, Vanilla CSS3, Modern ES6+ JavaScript.
- **Dependencies:** **Zero external dependencies**, zero build step, zero npm install.
- **Font Stack:** Google Fonts (`Cinzel`, `Plus Jakarta Sans`, `JetBrains Mono`) with system fallbacks.
- **Execution:** Runs instantly via direct file open (`file:///.../index.html`) or any lightweight HTTP server.

### Companion Deliverable: Single-File Streamlit App (`app.py`)
- Python 3.10+ / Streamlit application implementing the identical 12-scene data schema, base64 background injection, in-process CPython execution redirect, and Pillow-based credential PNG generation.

---

## 8. Quality Gates & Automated Verification

Four automated verification scripts run in `tools/` with a 100% pass rate:

1. `node tools/validate-scenes.mjs`: Asserts all 12 scenes contain mandatory schema keys, valid photos, and match BRO altitudes.
2. `node tools/lint-text.mjs`: Enforces text budgets ($\le 12$ words narration, $\le 10$ words radio), verifies non-consecutive verbs, and checks MCQ distribution.
3. `node tools/check-assets.mjs`: Validates photo presence on disk, file sizes ($< 400$ KB), and `assets/CREDITS.md` documentation.
4. `python tools/verify_python.py`: Runs a 16-combination CPython execution matrix verifying clean, water, puncture, and fuel scenarios across all break variations.
