# Phase 0 Audit: Two Roads to K2 (Python Sets)

## 1. Words Per Scene (Empirical Word Count)

Measured across all 10 scenes in `js/scenes.js`:

| Scene | Place | Narration Words | Radio Words (Pasang) | Target Narration ($\le 12$) | Target Radio ($\le 10$) | Status |
|:---:|---|:---:|:---:|:---:|:---:|:---:|
| **1** | Darjeeling Depot | 6 | 4 | $\le 12$ | $\le 10$ | PASS |
| **2** | The Fork | 7 | 5 | $\le 12$ | $\le 10$ | PASS |
| **3** | Skardu Checkpost | 8 | 5 | $\le 12$ | $\le 10$ | PASS |
| **4** | Baltoro Glacier | 8 | 5 | $\le 12$ | $\le 10$ | PASS |
| **5** | Concordia | 6 | 5 | $\le 12$ | $\le 10$ | PASS |
| **6** | Camp 3 | 7 | 5 | $\le 12$ | $\le 10$ | PASS |
| **7** | The Bottleneck | 8 | 5 | $\le 12$ | $\le 10$ | PASS |
| **8** | K2 Summit | 9 | 7 | $\le 12$ | $\le 10$ | PASS |
| **9** | Notebook | 9 | 6 | $\le 12$ | $\le 10$ | PASS |
| **10** | Darjeeling Return | 10 | 6 | $\le 12$ | $\le 10$ | PASS |

- **Max narration:** 10 words (Target $\le 12$ words).
- **Max radio:** 7 words (Target $\le 10$ words).
- **Stage clutter:** Zero white cards, zero centered papers. Mountain photo occupies $\ge 60\%$ of viewport.

## 2. Locked-Next Audit

- **Mandatory learning actions required before Next unlocks:** 10 of 10 scenes (100%).
- **Scenes unlocked by default:** 0 of 10 scenes (0%).
- **Locked button behavior:** Disabled on scene load with `.locked` CSS class. Only when `completeScene()` is triggered by the scene's interaction does `#btn-next` unlock with `.pulse`.

## 3. Interaction Variety & Physical Verbs

| Scene | Physical Verb | Interaction Mechanic | Set Concept |
|:---:|:---:|---|---|
| **1** | **PACK** | Drag/tap 6 unique items into panniers; duplicate rope bounces back | Deduplication `set()` |
| **2** | **MERGE** | Combine manifests into one Buy List; shared items fuse | Union `\|` |
| **3** | **STAMP** | Stamp cargo list matching permit; wrong items shake red | Intersection `&` |
| **4** | **UNLOAD** | Drag eaten rations off sled until leftovers remain | Difference `-` |
| **5** | **SORT** | Partition gear into 3 bins: ONLY SOUTH, BOTH, ONLY NORTH | Symmetric Diff `^` |
| **6** | **LOOKUP** | Timed duel: messy sack vs labelled single-hook pegboard | Membership `in` |
| **7** | **AUDIT** | Safety gate GO / STOP decisions for 3 summit teams | Subset `<=` |
| **8** | **SEAL** | Lock summit roster into immutable badge; block mutations | `frozenset()` |
| **9** | **FLIP** | Flip 8 plain-English cards in place into Python set code | Syntax Bridge |
| **10** | **RUN** | Step 8-line live set program line tracer & canvas certificate | Synthesis & Recap |
