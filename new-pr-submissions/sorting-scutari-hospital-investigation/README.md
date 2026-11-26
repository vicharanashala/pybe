# THE SORTING INVESTIGATION
> *"An interactive historical adventure to discover Python sorting."*

A self-contained, story-driven educational web game set in 1854 during the Crimean War. Learners step into the role of a medical data investigator at Scutari Hospital, organizing disordered hospital records, uncovering patterns, and discovering how Python's built-in `sorted()` function works in practice.

---

## 🎯 Learning Objectives

> **Project objective:** To help students understand sorting algorithms and the ideas behind TimSort through an interactive historical case study based on Florence Nightingale's work at Scutari Hospital.

By the end of this interactive adventure, learners will understand:
1. **The Meaning of Sorting:** Why unsorted data causes cognitive friction and how systematic ordering reveals immediate patterns.
2. **Ascending Order:** Arranging items from smallest to largest by default (`sorted(numbers)`).
3. **Descending Order:** Arranging items from largest to smallest using the keyword argument `reverse=True` (`sorted(numbers, reverse=True)`).
4. **List Immutability:** Python's `sorted()` returns a brand-new ordered list and never alters or mutates the original data.
5. **Practical Application:** Applying sorting to real-world operational problems (e.g., hospital emergency supply prioritization).
6. **Historical Context:** How structured data and statistical evidence empowered Florence Nightingale and the 1855 Sanitary Commission to advocate for life-saving sanitary reforms.

---

## 🚀 Quick Start Guide (Windows)

No Node.js, npm, or complex build tools are required to run the app. The server requires **Python 3.10+** and uses only the standard library; the optional test suites additionally need Pillow and Node.js.

### Option 1: Double-Click Launcher (Easiest)
1. Open the `sorting-scutari-hospital-investigation` folder in Windows File Explorer.
2. Double-click `run.bat`.
3. Open your web browser and navigate to:
   ```
   http://127.0.0.1:8000
   ```

### Option 2: Command Line (PowerShell / Command Prompt)
1. Open PowerShell or Command Prompt in the submission folder:
   ```powershell
   cd sorting-scutari-hospital-investigation
   ```
2. Start the local server:
   ```powershell
   python server.py
   ```
   If `python` is not on your PATH, use the Windows launcher alias instead:
   ```powershell
   py -3 server.py
   ```
3. Open your browser at `http://127.0.0.1:8000`.

### Stopping the Server
In the command window running the server, press:
```
Ctrl + C
```

> **Port already in use?** Older `python server.py` processes may still be listening on port 8000. The server now binds exclusively and will stop with an actionable message instead of silently sharing a port. Stop the existing `python server.py` process first, or choose a free port explicitly, e.g. `python server.py 8765`, and open `http://127.0.0.1:8765`.

---

## 🧭 Investigation Screen Map

The application consists of 8 cohesive, interactive screens:

| Screen | Title | Key Interaction |
| :---: | :--- | :--- |
| **1** | **Start: The Opening Experience** | Landing scene with a Victorian Scutari illustration and a five-stage roadmap that names the connected journey: Understand → Visualize → Practise → Play → Mission. |
| **2** | **Understand: Historical Story** | Four-scene illustrated narrative covering the arrival at Scutari, the record crisis, pattern discovery, and the investigator mission. Progress requires visiting every scene. |
| **3** | **Understand: Explore the Evidence** | Inspect five clearly labelled illustrative ward records, compare values, and observe the unordered problem. Progress requires an actual record comparison. |
| **4** | **Visualize: Adjacent-Swap Sorting Game** | The same illustrative ward sample is ordered by hand with three levels of adjacent swaps only. Pointer, touch, keyboard and button controls all use the same neighbour-swap rule that Bubble Sort demonstrates later. |
| **5** | **Visualize: Algorithm Simulator** | Compact algorithm selector, one-sentence explanation, large algorithm-specific visualization, short per-frame commentary, and **only two primary controls: Play/Pause and Next**. Play is continuous, Pause stops immediately, and Next always pauses before advancing exactly one operation. Watch Bubble adjacent swaps and sorted tail/early exit, Insertion held key/shifts/gap/prefix, Merge splits/front comparisons/output/remainder/upward combine, and a clearly labelled simplified Timsort run model. The independent **Connecting the Ideas** tab sits between Merge Sort and Timsort Model: five stages follow one ward dataset from natural runs, through the insertion and merge ideas, to TimSort's own adaptive run strategy, ending in a gated knowledge check. Timsort Model itself remains a separate, unchanged simulator destination. Each algorithm requires a short understanding check after the run; **Algorithm Comparison** explains the five dataset patterns, uses the same 60-item dataset for all four algorithms, and requires an explicit dataset choice. Optional technical definitions remain in a collapsed advanced section. |
| **6** | **Practise: Python `sorted()`** | Live three-column pipeline with illustrative hospital datasets, `sorted()` vs `list.sort()`, `reverse=True`, `key=len` / `key=str.lower` / dictionary keys, and stability cards. Progress requires comparing mutation, changing direction or key, and revealing the stability example. |
| **7** | **Play: Exercises & Terminal** | Twelve checks: eight Python/algorithm concepts plus four exercises tied to the exact simulator operations. A real terminal run uses the **restricted local Python execution runner**; progress requires every check and a successful run. |
| **8** | **Mission: Scutari Emergency** | Apply the journey: choose the descending priority strategy, verify it with real Python execution, identify the greatest deficit, name the stability property seen in the visual frames, and name CPython's Timsort. The badge is awarded only after all requirements are met. |

---

## 🔗 One Connected Journey

The eight screens are not separate demos. They deliberately reuse the same vocabulary and data:

- **One dataset:** the illustrative ward values `58, 24, 91, 12, 45` appear in the evidence room, the manual adjacent-swap game, the simulator and the final mission.
- **One operation vocabulary:** adjacent swap, sorted tail, held key, shift, gap, stable slot, split, front comparison, auxiliary buffer, remainder copy, natural run and reversal are introduced visually, then checked in Exercises 8–11 and the mission debrief.
- **One progress model:** navigating or clicking Play is never enough. Milestones require visiting all scenes, comparing records, solving all game boards, answering each simulator understanding check after a full run, choosing and running a benchmark, completing the Python concept comparison, finishing all exercises and verifying the final mission.
- **Randomised answer positions:** all 18 graded answer groups shuffle independently on load and reset. Semantic keys, explanations, scoring and retry behaviour stay fixed; the visible A/B/C/D letters are CSS counters that follow the shuffled display order, so no option can keep a stale label.
- **Honest distinctions:** animation frames, instrumented educational comparison counts and single-shot local timings are labelled separately. The simplified Timsort teaching model uses `TEACHING_MIN_RUN = 3` and is explicitly not a claim about CPython's full 32–64 run-stack internals or galloping.

---

## 🔒 Technical Architecture & Execution Controls

- **Self-Contained Application:** No external CDN scripts or stylesheets; the app is served by the bundled Python standard-library server.
- **Restricted Educational Python Runner (not a secure sandbox):**
  - Runs untrusted lesson code in a child process started with Python's `-I` and `-s` flags.
  - Validates code with an AST allowlist before execution and rejects structured bypasses such as concatenated dunder names and attribute escapes.
  - Executes with a restricted builtins dictionary and allowlisted list/string/dict methods only.
  - Binds strictly to `127.0.0.1` and checks browser origins against `127.0.0.1` / `localhost`.
  - Limits: 2,048 input characters, 4,096 output characters including the truncation notice, and a 2.5-second timeout.
  - On Windows, uses a best-effort Job Object where available to limit memory/process count and terminate the process group on timeout.
  - These are guardrails for an educational local tool, **not a hard security boundary**. Do not expose this server to an untrusted network.
- **Honest Algorithm Comparison:**
  - Beginner cards compare real returned comparisons, algorithm-specific movements where available, theoretical time pattern, extra space and stability using short plain-language labels.
  - The interpretation is computed from the returned data; it makes no unsupported winner or speed-ranking claim.
  - Simulation counters come from the visible teaching algorithm; backend comparisons use an instrumented educational comparison operator.
  - Movement metrics stay distinct: adjacent swaps, shifts plus placements, auxiliary array writes, and `Not exposed` for CPython Timsort.
  - Failed or stale benchmark responses clear the beginner results and success badge instead of leaving misleading numbers on screen.
  - Timings are local single-shot measurements of the implementations shown; pure-Python loops and CPython's built-in `sorted()` are not presented as a like-for-like race. The full technical table remains available in the collapsed advanced section.

---

## 🧪 Testing

Automated suites cover backend execution and guard regressions, DOM/static integrity, live HTTP APIs, benchmark validation/schema, and real browser-module interactions:
```powershell
python tests\run_tests.py
node tests\js\behaviour_harness.cjs
```
The interaction harness requires Node.js; the running app needs only Python 3.10+ and its standard library. In the verified environment (Python 3.15.0, Node 24.11.1), the Python suite reported **62/62 passing**, the Node interaction harness **451/451 assertions**, server-specific tests **9/9**, and the live loopback API smoke test **23/23**. An in-app browser pass passed **34/34** functional checks (six-tab flow, independent bridge, 64 sorting edge cases, answer randomization, Play/Pause/Next, benchmark, milestone gating, and reset behavior), with a separate exercise-replay check passing **6/6**. A Chromium/CDP pass passed **27/27** checks at 1280, 768 and 320 px and for a standalone-file candidate. Console errors, warnings, failed requests and external requests were zero in those passes. The submitted app uses `index.html` plus `server.py`; the standalone-file candidate was outside the project and is not part of the submission. See [`TEST_REPORT.md`](TEST_REPORT.md) for the full breakdown and verification limits.

---

## 📜 Historical Sources & Notes

Detailed historical references and ethical distinctions are documented in [`HISTORICAL_NOTES.md`](HISTORICAL_NOTES.md).

---

## 🏛️ PyBe Repository Submission Readiness

Details regarding submission readiness for the official PyBe repository (`vicharanashala/pybe`) are documented in [`PYBE_SUBMISSION_REPORT.md`](PYBE_SUBMISSION_REPORT.md). Exclusion candidates and maintainer-integration notes are documented in [`SUBMISSION_CLEANUP_RECOMMENDATIONS.md`](SUBMISSION_CLEANUP_RECOMMENDATIONS.md).

### Submission package

**Entry point:** `index.html`, served by `python server.py` (or `run.bat` / `run.ps1` on Windows).  
**Concepts covered:** sorting and `sorted()`, `reverse=True`, immutability, `key` functions and stability; Bubble, Insertion, Merge and a clearly labelled simplified Timsort teaching model; historical data investigation.  
**Dependencies:** Python 3.10+ standard library to run the app. Pillow is needed only by the asset-integrity tests; Node.js is needed only by the interaction harness. No external CDN or API calls.  
**Author credit:** Divyansh Garg.

```text
sorting-scutari-hospital-investigation/
├── index.html
├── server.py
├── run.bat / run.ps1
├── README.md
├── HISTORICAL_NOTES.md
├── TEST_REPORT.md
├── PYBE_SUBMISSION_REPORT.md
├── SUBMISSION_CLEANUP_RECOMMENDATIONS.md
├── css/style.css
├── js/
│   ├── app.js
│   ├── randomize.js
│   ├── story.js
│   ├── evidence.js
│   ├── sortGame.js
│   ├── simulator.js
│   ├── timsortBridge.js
│   ├── pythonLearn.js
│   ├── exercises.js
│   └── finalMission.js
├── assets/
│   ├── favicon.svg
│   ├── illustrations.js
│   └── images/
└── tests/
    ├── run_tests.py
    ├── test_*.py
    └── js/behaviour_harness.cjs
```

