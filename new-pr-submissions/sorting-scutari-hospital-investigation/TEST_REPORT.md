# The Sorting Investigation — Comprehensive Test Report

**Execution Date:** November 21, 2026  
**Environment:** Windows 11, Python 3.15.0, Node.js 24.11.1  
**Automated Server:** Loopback (`127.0.0.1`, test port `8765`)  
**Browser Server:** `http://127.0.0.1:8767` (current recovery verification pass; temporary process stopped after checks)  
**Commands:** `python tests\run_tests.py`, `node tests\js\behaviour_harness.cjs`

---

## 1. Executive Summary

| Test Category | Total Tests | Passed | Failed | Status |
| :--- | :---: | :---: | :---: | :---: |
| Backend execution (`tests/test_server.py`) | 9 | 9 | 0 | **PASS** |
| Static assets, randomized answers, palette and DOM contracts (`tests/test_assets_and_integrity.py`) | 21 | 21 | 0 | **PASS** |
| Live HTTP and API endpoints (`tests/test_assets_and_integrity.py`) | 6 | 6 | 0 | **PASS** |
| Browser-module behaviour (`tests/test_behaviour.py`) | 1 | 1 | 0 | **PASS** |
| Benchmark and execution-guard regressions (`tests/test_benchmark_and_security.py`) | 17 | 17 | 0 | **PASS** |
| **Total Python-side Suite** | **62** | **62** | **0** | **PASS** |
| Node interaction harness (`tests/js/behaviour_harness.cjs`) | 451 assertions | 451 | 0 | **PASS** |

**Measured suite result:** `Ran 62 tests` in **5.643 seconds**, `OK` — 62 passed, 0 failed, 0 errors, 0 skipped.  
**Measured Node result:** `{"total":451,"passed":451,"failed":0,"failures":[]}`.

This pass adds coverage for independent answer shuffling, stable semantic keys and explanations, shuffle-aware scoring, retry/double-click safety, duplicate-record stability across all four algorithms, the Soft Slate simulator palette, cache version `?v=2.2`, and Python `sorted(..., key=..., reverse=True)` examples. The restricted Python runner guardrails were not weakened.

> **Operational note:** the Python suite binds its own loopback test server. The earlier malformed-body flake was fixed by discarding unparsed request bodies before JSON `400`/`413` responses; `test_invalid_content_length_returns_json_400` then passed 10/10 repeated runs. The final 62/62 run completed successfully while the separate `8767` browser server was still active.

---

## 2. Automated Test Breakdown

### Suite A: Backend Execution (`tests/test_server.py`) — 9/9

Real child-process execution of ascending and descending `sorted()`, original-list preservation, `key`/`reverse` combinations preserving arrival order for equal keys, syntax and timeout handling, dangerous-import rejection, and the 2,048-character code limit.

### Suite B: Static Integrity and Redesign Contracts — 21/21

Required files and readable archival images exist; no external CDN dependencies; all local scripts are referenced in dependency-safe order; all eight screens remain present; illustration SVGs and the brand emblem are valid; Soft Rose tokens and story-image styling remain intact; terminal presets and mission strategy wiring remain present.

Updated contracts verify:

- every literal `getElementById("x")` in `js/*.js` has a static `id="x"` in `index.html`;
- the old Watch/Guided/checkpoint/Previous controls have no static markup and no direct lookups;
- `sim-check-panel`, `sim-check-question`, `sim-check-option-a/b`, `sim-check-feedback`, `sim-commentary-label`, `sim-commentary-text` and `sim-commentary-why` exist;
- `advanceOneStep`, `if (!advanceOneStep()) pause();`, `playbackTimerActive`, and `window.SimulatorModule.pause()` are present, so the timer is separate from manual Next and leaving the simulator pauses playback;
- local assets use `?v=2.2`, not `?v=2.1`, so the Soft Slate CSS/JS and shuffle helper cannot be served from a stale browser cache;
- `js/randomize.js` is loaded before the modules that use it and exposes `randomInt`, `shuffled`, `shuffleGroup`, and `setRandomSource`;
- all 18 graded answer groups have no static `A)`-style visible prefixes and rely on CSS counters for displayed letters;
- the final Soft Slate cascade defines the coordinated simulator surface, raised surface, border, text, muted text and focus tokens while preserving state classes and word/symbol markers;
- the beginner comparison IDs `comparison-purpose`, `comparison-pattern-help`, `comparison-loading`, `comparison-results`, `comparison-chart`, `comparison-interpretation`, `comparison-success-badge` and `comparison-advanced` exist;
- the collapsed `<summary>Advanced results and technical details</summary>` preserves the full technical table;
- `DATASET_EXPLANATIONS`, `clearComparisonResults`, `renderComparisonCards`, `buildComparisonInterpretation`, `renderOriginalArrayStrip` and `op: "stack"` are present in the simulator source.

### Suite C: Live HTTP Integration — 6/6

`GET /api/health`, `/`, `/css/style.css`, historical images, valid `POST /api/execute`, and forbidden-origin `POST /api/execute` all return the expected JSON/content types and status codes.

### Suite D: Browser-Module Behaviour — 1 Python test / 451 JS assertions

The Node harness covers all previous behaviour plus:

- shuffle distribution and per-instance independence with an injectable random source;
- 18 semantic answer groups retaining their keys while their displayed order varies;
- simulator wrong answer, correct answer, retry and double-click behaviour after shuffling;
- shuffle-aware exercise and final-mission scoring, including wrong-feedback text taken from the displayed button rather than a fixed letter;
- duplicate-record stability and immutable source order for all four algorithms in both ascending and descending modes;
- generic sorting correctness for Bubble, Insertion, Merge and the simplified Timsort model on ascending/descending, empty, singleton, duplicate and reversed inputs;
- fake-interval playback tests with a real `Map` timer registry and ticking: multi-frame Play, continuing after the first tick, Pause, resume, Next pausing then advancing exactly one frame, Next while paused, auto-stop at the final frame, replay from the final frame rendering frame 1 first, repeated Play/Pause, no overlapping intervals, and timer stop on algorithm/dataset/speed change;
- each algorithm's end-of-run check: no milestone on the final frame or after wrong answers, one milestone only after the correct explanation, frozen options after success, and no duplicate credit on repeated clicks;
- beginner comparison success state with four cards, comparison-only chart, computed interpretation, sample preview, selected-pattern help, and the UI-only success badge;
- comparison loading state, forced request failure clearing stale cards/chart/interpretation/badge, and stale responses being ignored;
- algorithm-specific visual surfaces: Bubble bars with compare/swap/sorted states, Insertion lanes/held key/shift gap/prefix, Merge original-array strip plus idle workbench and upward combine path, Timsort runs/reversal/merge and the frame-specific `Run stack` label;
- short per-frame commentary labels/sentences and optional “why” reasons;
- Exercises 1–12 and terminal success/failure/reset states;
- stronger Python lesson completion (mutation comparison, direction/key change and stability reveal);
- final mission strategy, verified execution output, wrong/retry debrief answers and badge gating, including the stability question.

### Suite E: Benchmark and Execution-Guard Regressions — 17/17

All benchmark dataset schemas, honest movement labels, count expectations, small/duplicate datasets, JSON error responses, output cap, structured-concatenation bypass rejection, restricted builtins and exclusive local-server port behaviour remain passing. The benchmark request contract remains `POST /api/benchmark` with `{ dataset_type, size: 60 }`. A recovery fix now rejects non-integer `size` values and invalid CLI ports before binding; both are covered by new regression assertions.

### Suite F: Recovery Verification (25 November 2026)

- `server.py` line 1 is exactly `"""`; first bytes are `22 22 22 0a`. Current staged size is **38,242 bytes** and SHA-256 is `32715B5C39B46E7D14B60C6F15BE3F97BADDDC08A662FF197009B647E734427A` after the later runner-readiness handshake fix. Earlier SHA-256 values in this report referred to pre-readiness-fix copies and are superseded.
- Server-specific unit tests: **9/9**. Temporary loopback API smoke test: **23/23**, covering health, static index, valid execution, unsafe imports, benchmark, invalid dataset/size, malformed JSON, oversized body, unsafe origin, unknown route and unsupported methods.
- In-app browser functional pass: **34/34**, covering six-tab order, independent bridge gating and award, 64 sorting edge cases, four answer-randomization groups, aria-labelledby updates, simulator reset UI, all six Screen-5 milestones and a live benchmark.
- Exercise reset/replay pass: **6/6**, proving that a full progress reset followed by a replayed exercise set re-awards `exercises.complete`.
- Chromium/CDP pass: **27/27** across source at 1280/768/320 px and a standalone-file candidate. Each phase reported zero console errors, exceptions, failed requests and external requests.
- The standalone-file candidate was outside the project (`C:\Users\divya\AppData\Local\Temp\opencode\Sorting_Investigation.candidate.html`). The submitted project contains `index.html` and `server.py` only; no project standalone HTML file was created or deleted.

---

## 3. Screen-by-Screen Verification Matrix

| Screen | Target Functionality | Verification Method | Result |
| :--- | :--- | :--- | :---: |
| **1: Start** | Roadmap, navigation and full progress reset. | Reset to 0/12, start CTA, stepper navigation and full journey replay. | **PASS** |
| **2: Understand Story** | Four scene visits before credit. | Browser replay clicked through all four scenes; milestone appeared only after the final scene. | **PASS** |
| **3: Understand Evidence** | Record inspection and real comparison. | Browser replay selected two cards; evidence comparison displayed and proceed unlocked. | **PASS** |
| **4: Visualize Game** | Three boards solved with adjacent swaps only; shared ward sample. | Browser replay solved all three boards, including descending order, using right-shift controls. | **PASS** |
| **5: Visualize Simulator** | Two-control transport, short commentary, four shuffled understanding checks, beginner Algorithm Comparison plus advanced table. | Full browser replay plus 451-assertion harness. Play showed Pause and kept advancing; Next paused and advanced one frame; replay rendered frame 1; all four checks were answered using semantic keys; benchmark succeeded; six input datasets and descending mode rendered valid runs. | **PASS** |
| **6: Practise Python** | Deeper concept comparison before progress. | Browser replay used the records dataset, mutation comparison, reverse toggle and stability reveal. | **PASS** |
| **7: Play Exercises** | Twelve checks plus real terminal run. | Browser replay completed all twelve checks and a real `/api/execute` run before the proceed button unlocked. Shuffled options were clicked by stable `data-option` value. | **PASS** |
| **8: Mission** | Strategy, real execution, shuffled Q1–Q3 and badge. | Browser replay reached 12/12 milestones and revealed the badge. Semantic `data-val` values were used rather than display letters. | **PASS** |

---

## 4. Live Browser Verification

An earlier verified full-journey pass used `python -u server.py 8766`. The current recovery pass used a temporary `python server.py 8767` process, which was stopped after checks. The full functional journey was replayed on the main tab; all eight screens were then opened at emulated widths of 320, 768 and 1280 px for layout, content and state checks.

Normal iframes could not be used because the server sends `X-Frame-Options: DENY`. Width emulation therefore used same-origin `srcdoc` iframes with an injected `<base href="http://127.0.0.1:8766/">`; Chromium still evaluated the responsive CSS at the requested widths.

### Full-journey results

From a cleared `localStorage` state, the real DOM journey reached:

- screen 2 after visiting all four story scenes;
- screen 3 after comparing two evidence records;
- screen 4 after solving all three adjacent-swap boards;
- screen 5 after the four algorithm checks, the independent connection check, a successful benchmark and Timsort;
- screen 6 after the Python concept comparison;
- screen 7 after all exercises and a real terminal run;
- screen 8 after the final mission strategy, verified execution and Q1–Q3;
- final state: **12/12 milestones**, mission badge visible, all five debrief requirement ticks present.

### Randomized answer verification

A dedicated browser pass recorded 7/7 checks:

- exercise option order varied across eight reshuffles while the sorted key set stayed `A,B,C,D`;
- mission Q3 order varied across eight reshuffles while the sorted semantic value set stayed `BUBBLE,QUICKSORT,TIMSORT`;
- the simulator Timsort check varied between the two possible orders;
- the visible exercise letter is generated by `counter(answer-option, upper-alpha)`, not hard-coded text;
- sampled graded buttons had zero stale `A)`/`B.`-style prefixes.

### Playback, datasets and API

- Bubble started at frame `0/19`; Play set both `isPlaying` and `playbackTimerActive` to `true` and advanced to frame 3.
- Pause cleared the timer and froze the frame; Next advanced exactly one frame while paused.
- From the final frame, Play replayed from frame 1 before ticking forward again.
- All six simulator input datasets — `ward_sample`, `random`, `sorted`, `reversed`, `nearly_sorted`, `duplicates` — regenerated five-item runs with correctly sorted final arrays.
- Descending mode generated `[91, 58, 45, 24, 12]` for the ward sample.
- A direct browser `POST /api/execute` with `sorted(nums, reverse=True)` returned HTTP 200 and stdout `[3, 2, 1]`.
- The benchmark returned a `success` state with four cards, chart rows and the computed interpretation.

### Persistence, console, network and layout

- With all milestones earned, screen 8 was saved to `localStorage`; after a clean reload the active screen was still 8, all 12 milestones were present, and the mission badge was restored.
- Final reload: **0 console errors**, **0 console warnings**, **14 requests**, all `200`, **0 failed or non-OK requests**.
- Responsive pass: all eight screens had an active section, visible content and no horizontal overflow at 320, 768 and 1280 px. The simulator stage widths were 224, 654 and 982 px respectively, with zero internal stage overflow at each width.
- Computed Soft Slate styles were verified: stage background `rgb(44, 58, 74)`, stage text `rgb(248, 250, 252)`, commentary background `rgb(56, 72, 90)`.
- Two screenshots were captured for the final mission and the simulator palette and opened in the Review pane. This model cannot pixel-inspect image attachments, so visual assertions relied on computed styles and geometry rather than image content.

---

## 5. Honest Limitations

- **Screenshots were captured but not pixel-inspected by this model.** Visual verification used rendered DOM state, computed styles, geometry, text content and the user-visible Review pane.
- Only Chromium was used (in-app browser plus a separate headless CDP session). Cross-browser testing (Firefox, Safari, Edge) was not performed.
- The original full-journey layout checks used `srcdoc` iframe viewport emulation because `X-Frame-Options: DENY` blocked normal iframes. The recovery pass additionally used CDP `Emulation.setDeviceMetricsOverride` at 1280, 768 and 320 px. These verify responsive CSS and geometry, not touch hardware, device pixel ratio or device-specific rendering.
- The standalone-file pass exercised a generated temp candidate, not a file in the submitted project. The project intentionally ships `index.html` plus `server.py`; no project standalone HTML file was available to verify or rebuild.
- Progress persistence was verified manually across a reload from screen 8; it is not covered by the automated harness.
- No Teacher Edition folder or ZIP is present in the current project; earlier packaging artifacts were not found and were not recreated.
- Movement figures remain educational instrumentation: adjacent swaps, shifts plus placements, auxiliary buffer writes, and `Not exposed` for CPython Timsort. Timings are single-shot local measurements, not a rigorous speed ranking; pure-Python implementations are not a like-for-like race with CPython `sorted()`.
- The Timsort visualization remains a simplified `TEACHING_MIN_RUN = 3` teaching model, explicitly not CPython’s exact run-stack or galloping internals.
- The restricted Python runner remains an educational guardrail, not a secure sandbox. It was used only over loopback during testing.
- Historical claims and the illustrative “fictional practice data” labelling were checked statically and in rendered copy; no new historical claim was introduced, and modern algorithms were not presented as Nightingale-era techniques.
