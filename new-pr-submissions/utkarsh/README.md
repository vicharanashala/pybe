# Two Roads to K2: Discovering Python Sets

An interactive, action-first PyBe story module modeled after Kritika's *The High Pass*. The learner travels with nineteen-year-old trainee Tara and Sherpa quartermaster Pasang to prepare, merge, check, and seal expedition gear for K2 (8,611 m).

## Key Architecture & Invariants

- **The photo IS the page:** Full-viewport mountain backdrop with a dark-glass dock at the bottom. No white cards.
- **Physical action on every scene:** Pack, merge, stamp, unload, sort, lookup, audit, seal, flip, run.
- **Strictly locked Next button:** Next is disabled on entry and unlocks with a glowing pulse only after completing the physical action.
- **Zero Python syntax until Scene 9:** The first 8 scenes use plain words only.
- **Dashboard lamps:** 8 mental model lamps (`ONCE`, `EVERYTHING`, `SHARED`, `LEFT`, `ONLY ONE`, `IS IT THERE`, `ALL REQUIRED`, `SEALED`) light up as concepts are discovered.
- **Elevation SVG track:** Interactive altitude profile with real-time climber marker.
- **Non-blocking Quick-Check:** Collapsible trail drawer with story-grounded MCQs.

## How to Run

1. Open `index.html` in any modern web browser.
2. Complete each scene's physical action to unlock Next Stage.
3. No build steps, dependencies, or network calls required.

## 10-Scene Learning Flow

| Scene | Place & Elevation | Verb | Set Concept | Action Summary |
|:---:|---|:---:|---|---|
| **1** | Darjeeling Depot (2,000 m) | **PACK** | `set()` Deduplication | Pack 6 essentials; duplicate rope bounces back. |
| **2** | The Fork (2,200 m) | **MERGE** | `\|` Union | Combine manifests into one Buy List; shared items fuse. |
| **3** | Skardu Checkpost (2,230 m) | **STAMP** | `&` Intersection | Stamp only items on both permit and cargo sheets. |
| **4** | Baltoro Glacier (4,400 m) | **UNLOAD** | `-` Difference | Drag eaten rations off sled until leftovers remain. |
| **5** | Concordia (4,600 m) | **SORT** | `^` Symmetric Diff | Partition gear into 3 bins: South, Both, North. |
| **6** | Camp 3 (7,300 m) | **LOOKUP** | `in` Membership | Timed duel: messy sack vs labelled single-hook pegboard. |
| **7** | The Bottleneck (8,200 m) | **AUDIT** | `<=` Subset | Inspect 3 teams and decide GO / STOP on required gear. |
| **8** | K2 Summit (8,611 m) | **SEAL** | `frozenset()` | Seal summit party roster; block mutations. |
| **9** | Notebook (8,611 m) | **FLIP** | Syntax Bridge | 8 field note cards flip in place into Python expressions. |
| **10** | Return / Finale (2,000 m) | **RUN** | Synthesis & Recap | Step 8-line live set program line tracer & canvas certificate. |
