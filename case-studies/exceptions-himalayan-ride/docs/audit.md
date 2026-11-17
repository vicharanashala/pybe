# Phase 0 Audit: Current Build vs. Antigravity v3 Specification

**Date:** October 14, 2026  
**Subject:** `The High Pass: Swati's Himalayan Ride (PyBe Discovery Lab)`  
**Scope:** Architecture, text budget, interaction variety, dead code, and responsive layout behavior.

---

## 1. Words Per Scene (Empirical Word Count)

Measured across all 12 scenes in `js/scenes.js`, inspecting narration, character speech bubbles, fixed UI labels, and side-panel MCQs:

| Scene | Place | Narration | Swati Bubble | Tashi Bubble | Bubbles Total | MCQ Panel | Stage Visible (Narr + Bubbles + HUD) | Total Visible / Scene |
|:---:|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1** | Manali Base | 13 | 13 | 13 | 26 | 53 | 53 | **108** |
| **2** | Rohtang La | 12 | 13 | 12 | 25 | 57 | 51 | **110** |
| **3** | Zingzingbar | 12 | 11 | 12 | 23 | 66 | 49 | **116** |
| **4** | Baralacha La | 13 | 13 | 12 | 25 | 68 | 52 | **122** |
| **5** | Sarchu | 13 | 12 | 11 | 23 | 72 | 50 | **123** |
| **6** | Pang | 14 | 12 | 11 | 23 | 65 | 51 | **117** |
| **7** | Morey Plains | 13 | 13 | 11 | 24 | 77 | 51 | **130** |
| **8** | Debring | 13 | 13 | 13 | 26 | 62 | 53 | **116** |
| **9** | Tanglang La | 14 | 12 | 12 | 24 | 60 | 52 | **114** |
| **10** | Karu | 12 | 13 | 10 | 23 | 72 | 49 | **122** |
| **11** | Shey | 12 | 13 | 14 | 27 | 67 | 53 | **121** |
| **12** | Leh Arrival | 14 | 9 | 12 | 21 | 50 | 49 | **102** |

### Metrics Summary
- **Narration Words:** Min = 12, Max = 14, **Average = 12.9 words** (Target: $\le 12$ words).
- **Dialogue Bubbles:** Min = 21, Max = 27, **Average = 24.2 words** across Swati & Tashi threads (Target: $\le 10$ words, max 1 radio crackle per scene, no back-and-forth threads).
- **Stage Visible (Narration + Bubbles + Fixed UI Labels):** Min = 49, Max = 53, **Average = 51.3 words** (Target: $\le 35$ total words per scene).
- **MCQ Panel Words:** Min = 50, Max = 77, **Average = 64.1 words**.
- **Total Visible Words / Scene:** Min = 102, Max = 130, **Average = 116.8 words** (Over 3.3× the specified 35-word limit).

---

## 2. Clicks Per Scene That Are Only "Next"

- **Mandatory Learning Actions Required Before "Next" Unlocks:** **0 across all 12 scenes (0%)**.
- **Scenes Where "Next Stage" is Enabled Immediately on Load:** **12 of 12 scenes (100%)**.
- **Result:** A user can click "Next Stage" 11 consecutive times from Manali to Leh without answering any question or interacting with the mountain.
- **Target:** Next button is permanently disabled until the scene's primary physical verb is successfully completed.

---

## 3. Interaction Variety & Consecutive Matches

| Scene | Place | Current Interaction Type | Consecutive Match Flag | Target v3 Primary Verb |
|:---:|---|---|:---:|---|
| **1** | Manali Base | Read text + 4-option MCQ | — | **Pack** (drag 5 items into panniers) |
| **2** | Rohtang La | Read text + 4-option MCQ | ⚠️ **MATCH (2 in a row)** | **Wrap** (pre-ride checklist + road bracket) |
| **3** | Zingzingbar | Read text + 4-option MCQ | ⚠️ **MATCH (3 in a row)** | **Hold + Match** (throttle + drag tool) |
| **4** | Baralacha La | Read text + 4-option MCQ | ⚠️ **MATCH (4 in a row)** | **Wire** (patch hazard cards to handler lanes) |
| **5** | Sarchu | Read text + 4-option MCQ | ⚠️ **MATCH (5 in a row)** | **Predict** (tap chai cup or cross for 3 days) |
| **6** | Pang | Read text + 4-option MCQ | ⚠️ **MATCH (6 in a row)** | **Beat the cold** (dropping thermometer + tap tent) |
| **7** | Morey Plains | Read text + 4-option MCQ | ⚠️ **MATCH (7 in a row)** | **Order** (drag 4 stage cards into notebook) |
| **8** | Debring | Read text + 4-option MCQ | ⚠️ **MATCH (8 in a row)** | **Flip** (in-place text morph + keyword tray) |
| **9** | Tanglang La | Scenario buttons + Terminal run + MCQ | — | **Run + Break** (Pyodide line tracer + 3 break toggles) |
| **10** | Karu | Read text + 4-option MCQ | — | **Tap the line** (int(input()) live run) |
| **11** | Shey | Read text + 4-option MCQ | ⚠️ **MATCH (2 in a row)** | **Place the flag** (drag raise flag) |
| **12** | Leh Arrival | Text input + Canvas download + MCQ | — | **Collect** (assemble 4 notes + certificate + replay) |

**Audit Finding:** Scenes 1 through 8 form **8 consecutive identical interactions** (Read $\rightarrow$ MCQ $\rightarrow$ Next). Zero mountain interaction exists on the hero stage.

---

## 4. Duplicate & Dead Code Analysis

The current codebase maintains two competing controllers and two overlapping styling systems:

1. **Controller Conflict:**
   - **Active:** `js/engine.js` + `js/scenes.js` (12 scenes, referenced in `index.html`).
   - **Dead/Competing:** `js/story.js` (1,186 lines, 41.6 KB; contains a 19-scene GSAP controller, procedural audio duplicates, and hardcoded inline SVG templates).
   - *Decision:* **Delete `js/story.js`**. Eliminate GSAP dependency in favor of pure CSS and Web Animations API.

2. **Stylesheet Conflict:**
   - **Active:** `css/base.css` (2.6 KB), `css/stage.css` (6.6 KB), `css/bubbles.css` (4.3 KB), `css/checkpoint.css` (7.7 KB).
   - **Dead/Competing:** `css/style.css` (30.1 KB; monolithic sheet with obsolete 19-scene classes, duplicated variables, and legacy layouts).
   - *Decision:* **Delete `css/style.css`**. Refactor the active CSS into modular files: `base.css`, `hud.css`, `stage.css`, `interactions.css`, and `quickcheck.css`.

3. **PR Studies Archive:**
   - `study_prs/` contains intern reference code (`hamdan_app.py`, `postman-exceptions/`, `rekhabattu-pr/`). Remains read-only or removed from app build footprint.

---

## 5. Console Errors, 404s & Layout Overflow Audit

Tested locally via HTTP server (`python -m http.server 8088`):

1. **Network Requests & 404s:**
   - All 12 Wikimedia scene photos (`assets/photos/01_manali.jpg` to `12_leh.jpg`) return HTTP 200.
   - Missing `/favicon.ico` returns HTTP 404 (needs an inline SVG favicon data URI).
   - Pyodide script loads from external CDN without SRI hash; needs explicit offline fallback test gating.

2. **Console Errors & Warnings:**
   - Clean execution on load; no uncaught runtime exceptions in current `engine.js`.
   - Web Audio context suspended warning on initial load (normal prior to first user gesture).

3. **Layout & Viewport Overflow Analysis:**
   - **At 1920×1080 (Desktop Wide):** Layout fits within viewport height without page scroll, but stage area is visually passive (empty text boxes, low interactive density).
   - **At 1366×768 (Standard Laptop):**
     - Total available height: 768px - (52px header + 62px footer + 4px ribbon) = 650px.
     - Photo wrap is locked to `58%` (~377px).
     - Remaining narrative shelf is 273px.
     - On Scenes 3–11, when the `code-card-container` appears beneath the dual dialogue bubbles (each ~80px) and narration bar (~40px), total content height reaches ~350px.
     - Result: **Internal vertical scrollbar triggers on `.story-narrative-shelf`** on 1366×768, violating the zero-vertical-scroll target.
   - **At 390×844 (Mobile Portrait):**
     - `.checkpoint-panel` becomes a bottom drawer with `transform: translateY(calc(100% - 46px))`.
     - The `.story-stage-column` takes 100% of viewport, but dual speech bubbles consume vertical space, pushing narrative content down behind the bottom drawer header.
     - Touch targets in the MCQ panel become cramped.

---

## 6. Audit Verdict & Rebuild Directives

1. **Purge dead files:** Remove `js/story.js` and `css/style.css`.
2. **Eliminate conversation threads:** Replace dual dialogue bubbles with at most 1 radio crackle ($\le 10$ words) and 1 crisp narration line ($\le 12$ words).
3. **Action-first gating:** Disable "Next" until the primary physical interaction for that scene is solved.
4. **Kill repetitive MCQs:** Limit Quick Check MCQs to at most 6 scenes (2, 4, 5, 6, 9, 10) as optional collapsed drawers, replacing the constant side-quiz.
5. **Install 4-lamp bike dashboard:** Road (`try`, blue), Fix (`except`, red), Chai (`else`, amber), Camp (`finally`, green).
