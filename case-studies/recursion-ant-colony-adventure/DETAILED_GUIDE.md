# Recursive Explorer: Ant Colony Adventure — Complete Detailed Guide

Everything this project contains: the concept, the tech, the full story, every scene line-by-line, every option the player can click, every quiz question, and exactly what happens in the animated colony diagram and the Python recursion reveal.

---

## 1. What This Project Is

An interactive, single-page **learning adventure** that teaches the programming concept of **recursion** by first letting the learner watch, predict, and interact with the behavior of a real ant colony.

The entire colony — and therefore the entire lesson — is built from **one excavation rule** that every worker follows:

```
find diggable soil  →  dig a tunnel  →  create a chamber  →  repeat
                                                    from the new chamber
```

There is **no architect, no blueprint, and no queen giving orders**. The layout emerges from thousands of workers each repeating the same tiny rule.

### The pedagogical trick
Programming vocabulary — *function*, *recursion*, *base case*, *return* — is deliberately **withheld** until the learner has observed, predicted, and interacted with the pattern through 12 scenes. Scene 9 finally **names** the pattern (recursion). Scenes 10–12 then ground that pattern in **real photographs** of ant colonies (day-by-day growth and a plaster cast), and Scene 13 maps it to Python with a post-order `build_colony()` reveal.

### Tech stack
- **React 18** + **TypeScript** (strict)
- **Vite 5** bundler/dev server
- **Tailwind CSS 3** for styling
- **framer-motion** for all animation (camera pans, reveals, ants, modals)
- **lucide-react** for icons
- **Web Audio API** — all sound effects are generated procedurally (zero audio assets)
- **localStorage** — progress, XP, achievements, and settings persist offline. No backend, no accounts.

### Commands
| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run typecheck` | Type-check with `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run preview` | Preview the production build |

---

## 2. The Player Journey (App Flow)

The app is a 3-view state machine (`App.tsx`):

```
Title Screen ──Begin──▶ Scene Map ──Select──▶ Scene Player ──Exit──▶ Scene Map
      ▲                    │                        │
      └─────── Home ◀──────┘                        └── Next/Prev between scenes
```

### 2.1 Title Screen (`TitleScreen.tsx`)
- A **fully built colony cross-section** animates in the background (28 ants, all 7 chambers, eggs, larvae, ventilation, and the rock) at 60% opacity, dimmed by a vignette.
- Top-right buttons:
  - **Mute/Unmute** toggle (VolumeX / Volume2 icons) — persists in localStorage.
  - **Achievements + XP** pill (Trophy icon) — opens the achievements drawer.
- Badge: "An Interactive Learning Adventure" (Bug icon).
- Hero title **"Recursive Explorer"** with subtitle **"Ant Colony Adventure"**.
- Tagline: *"Watch a living ant colony build itself, step by step. Discover the hidden pattern that grows an underground city — and uncover the idea of recursion along the way."*
- Primary button: **Begin Adventure** (Play icon). If the player has partial progress, it becomes **Resume Adventure** and shows *"X of 13 scenes explored"*.
- Footer feature list: Animated colony • Narrated story • Interactive quizzes • XP & achievements.

**Begin logic:** if the player has progress (`lastSceneId > 0` and ≥1 completed scene) → go to **Scene Map**. Otherwise → jump straight into **Scene 1**.

### 2.2 Scene Map (`SceneMap.tsx`)
- Header: **Home** button (back to title), title **"Choose Your Path"**, mute toggle, and XP pill.
- **Colony progress bar**: amber gradient bar, "X / 13 scenes".
- **Scene cards** render as a vertical "descending journey" list. Each card shows:
  - A circular badge: **✓ check** (emerald) if completed, a **lock** if locked, otherwise the scene number (amber if it's the next scene).
  - The scene title and subtitle.
  - `+XP` value on the right (hidden on small screens).
  - A **"Reveal"** badge on Scene 13's card.
  - The last-visited scene gets an amber ring.
- **Locking is soft**: a scene is locked only if it is neither completed nor the next unfinished scene. Learners can revisit any explored scene and continue from the next one.
- Clicking an unlocked scene plays a click sound, jumps to it, and records it as `lastSceneId`.
- **Reset all progress** link appears once any scene is complete (RotateCcw icon, turns red on hover). It wipes localStorage and all in-memory state.

### 2.3 Scene Player (`ScenePlayer.tsx`)
The heart of the experience. Each scene runs a fixed **7-stage loop** (the code, conclusion, and bridge stages are optional and scene-specific):

```
narration → action → (code, Scene 13 only) → quiz → (conclusion, Scenes 11–12 only) → (bridge, Scene 12 only) → next scene
```

- **Top bar**: `‹ Map` button, "Scene N of 13" + scene title, and prev/next round arrow buttons. The next arrow either finishes the scene (if not done) or advances to the next scene (if done).
- **Subtitle** centered under the bar.
- **Recursion-step pill** (once narration ends): a small rounded chip near the top center showing `↻ <recursionStep.label>` and, when present, `repeats: <...>`.
- **Reality photograph stage** (Scenes 10–12 only): a framed, Ken-Burns-zoomed real photo card sits above the dimmed animation. The photo advances with the narration (narration line → photo index); during the activity/quiz the compare layout shows both photos side by side so the learner can answer "what changed" questions. The stage is `pointer-events: none`, so camera panning still works beneath it. Photos **always start on the first image** — the narration index resets to 0 on scene load *and* on Replay.
- **Transition reel** (Scene 12 only): after the conclusion's **Continue to Python** button, a full-screen word-by-word reel fades through *Nature → Same Rule → Recursion → Python* (~2.5 s), then fades directly into Scene 13's Python visualization.
- **"tap a chamber to explore"** hint pulses near the center while a scene is interactive — but it is **suppressed on the photo scenes** (10–12), where the photographs take focus.
- Camera does a short **cinematic pan-in** when a scene loads, then settles.
- The colony diagram is the animated backdrop; the interaction dock sits at the bottom; dark vignettes (vertical + horizontal gradients) keep text readable.

#### Stage details
| Stage | What the player sees | How it advances |
| --- | --- | --- |
| **narration** | `Narration.tsx` card: "Narration" header (Volume icon), line counter `N / M`, one fades in per click, progress dots at bottom, **Next / Continue** button (ChevronRight). | Each click shows the next line; on the last line, "Continue" advances to the action stage (all scenes have activities). |
| **action** | "Make it happen" header (Hand icon) + one button per `activity`. Each shows a label and description. | Clicking runs the activity animation (see below). Completed activities show a green `✓` and disable — observation activities (which reveal no layer) flip to **`✓ Observed`** so they read as completed documentary checkpoints. A **Continue** button appears: "Continue to quiz", "See the code" (Scene 13), or "Finish scene". |
| **code** | Only in Scene 13: the 3-panel `PythonCodeReveal` (Section 6). | Its "Continue" button advances to the quiz. |
| **quiz** | `QuizCard.tsx`: "Quick Check" header (Sparkles icon), `+XP` in the corner, the question, and 4 answer buttons in a 2×2 grid. | Clicking an answer locks it, colors it (green = correct, red = chosen-but-wrong, dimmed = other), reveals the explanation, plays a correct/wrong jingle, and auto-advances after ~1.8 s — to the **conclusion** stage on a correct answer in Scenes 11–12, or straight to **done** otherwise. |
| **conclusion** | `ConclusionCard.tsx` (Scenes 11–12, correct answers only): lines reveal in sequence. Scene 11 renders one centered, softly glowing sentence ("A simple rule, repeated many times, creates a complex colony."). Scene 12 shows a 3-line card with "Recursion" highlighted in amber and a **Continue to Python** button. | The documentary scenes **never stop on a done screen**: Scene 11 auto-advances straight into Scene 12 a beat after its reveal; Scene 12's button awards the scene and hands off to the bridge reel (Scene 13). |
| **bridge** | `TransitionReel.tsx` (Scene 12 only): a full-screen stone-950 overlay; the words *Nature → Same Rule → Recursion → Python* fade in one at a time (~0.5 s apart), then the whole reel fades out. | Auto-advances straight into Scene 13 once the reel has played out. |
| **done** | Emerald panel: **"Scene complete — +X XP earned"**, a **Replay** button (re-runs narration), and either **Next scene** (amber) or **Back to map** on the final scene. | Replay restarts the narration (photo scenes restart on the first image); Next goes to the following scene. |

#### Activity execution mechanics
When the player clicks an activity button:
1. The activity becomes `active` (all other buttons disable).
2. A sound plays (mapped per activity id).
3. If the activity carves a chamber, that chamber **highlights** (amber pulsing stroke).
4. The **visual work happens**: dust particles at the dig site, growing shaft, springing-in chamber, etc.
5. After **1.4 s** the target layer/chamber is **permanently revealed** (the "work is done" moment).
6. After **2.6 s** the activity deactivates and the highlight clears.

Observation activities (Scenes 10–12) reveal no layer, but they **still complete**: after the 1.4 s pulse the button flips to a green **`✓ Observed`** and disables, so every activity — documentary checkpoint or structural — gives the same "click → something happens → done" feedback.

This is the core of **progressive disclosure**: nothing in the colony appears before the activity that creates it finishes.

---

## 3. Game Systems

### 3.1 XP economy
Three sources of XP exist in the data:

| Source | Per item | Total |
| --- | --- | --- |
| Scene completion XP | 40, 60, 80, 90, 110, 130, 140, 120, 200, 100, 120, 150, 300 | **1640** |
| Quiz XP (displayed on card) | 20, 30, 40, 50, 60, 70, 70, 60, 150, 60, 60, 100, 200 | **970** |
| Achievement XP | 50 + 120 + 200 + 250 + 300 | **920** |

**Important implementation note:** the quiz card advertises `+XP`, but the state layer (`useGameState.recordQuiz`) currently only records *correctness* for the "Quiz Master" achievement — it does **not** add quiz XP to the running total. The XP that is actually granted comes from **scene completion** (via `completeScene`) and **achievements** (via `checkAchievements`). Realistic max earnable XP is therefore **2560** (1640 + 920), not 3530.

A toast fires on each scene completion: `+X XP — Scene complete` (Star icon, emerald accent, "levelup" sound).

### 3.2 Achievements (`achievements.ts`)
All five, with conditions and how to earn them:

| ID | Name | Icon | Condition | XP |
| --- | --- | --- | --- | --- |
| `first-tunnel` | First Tunnels | Pickaxe | Complete 3 scenes | +50 |
| `pattern-spotter` | Pattern Spotter | Repeat | Complete 5 scenes | +120 |
| `recursion-revealed` | Recursion Revealed | Sparkles | Discover recursion (Scene 9) | +200 |
| `quiz-master` | Quiz Master | Brain | Answer all 13 scene quizzes correctly | +250 |
| `colony-architect` | Colony Architect | Castle | Earn 1000+ total XP | +300 |

When earned: a "levelup" jingle plays, XP is added, and a toast appears: **"Achievement Unlocked — <name> — <description>"** (amber accent). The achievements drawer (`AchievementsPanel.tsx`) slides in from the right, showing locked (Lock icon, dimmed) and unlocked (icon, amber) rows.

### 3.3 Progressive disclosure layers
A scene can reveal 7 kinds of things. Layers persist per scene via component state (`revealedLayers` + `visibleChamberIds`):

| Layer | What appears |
| --- | --- |
| `shaft` | The main vertical tunnel extends to its full planned depth |
| `chamber` | A specific chamber (by `chamberId`) pops into view |
| `eggs` | Egg clusters inside the Nursery |
| `food` | Seed piles in Food Storage and the galleries |
| `larvae` | Larvae in the Brood Chamber |
| `ventilation` | Three narrow ventilation shafts with rising air motes |
| `obstacle` | The base-case rock slab at the bottom |

Everything already built in earlier scenes is visible from the start of a scene; only the new stuff is gated.

### 3.4 Audio engine (`soundEngine.ts`)
All sounds are synthesized with Web Audio oscillators + noise buffers. The 12 SFX names:

`dig` · `chamber` · `signal` · `brigade` · `egg` · `vent` · `click` · `correct` · `wrong` · `reveal` · `levelup` · `transition`

Activity-to-sound mapping (`activitySfx`):
- `dig`, `probe` → **dig** (low square-tone + filtered noise)
- `carve`, `found`, `celebrate`, `carve-a`, `carve-b` → **chamber** (soft sine thud)
- `hatch`, `transport`, `stock`, `tend` → **egg** (two bright sine chirps)
- `vent` → **vent** (airy noise)
- `signal`, `brigade` → **signal** / **brigade** (defined in the engine and reachable by id, but **no current activity uses them** — they are legacy hooks)
- anything else → **click** (short 440 Hz blip)

Other sound hooks: `transition` on scene load, `correct` (rising 523/659/784 arpeggio) / `wrong` (falling sawtooth) on quiz answers, `reveal` (ascending 4-note) on recursion discovery, `levelup` (5-note ascending) on XP/achievements, `click` on narration advance and Run/Reset.

The AudioContext is created/resumed on the first user `pointerdown` (browser autoplay policy). Mute is global and persisted.

### 3.5 Persistence (`storage/progress.ts`)
Stored under localStorage key **`recursive-explorer-progress-v2`**:

```ts
{
  xp: number,
  completedScenes: number[],
  correctQuizScenes: number[],
  unlockedAchievements: string[],
  recursionDiscovered: boolean,
  lastSceneId: number,
  settings: { muted: boolean }
}
```

The state hook hydrates from this on mount and saves on every change. Malformed/missing data falls back to defaults; save failures are non-fatal. `reset` removes the key entirely.

---

## 4. Scene-by-Scene Breakdown (all 13 scenes)

This section documents every scene in full: narration (verbatim), colony state, every clickable option, the recursion-step pill, the quiz, and what happens in the diagram.

> **Legend for "What happens in the diagram":** each scene starts with a camera pan-in, then runs narration, then the action phase. Activity effects are described per button.

---

### Scene 1 — A New Colony Begins
- **Slug:** `new-colony` · **Phase:** `introduction` · **XP:** 40

**Narration:**
1. *"After a rainy night, a newly mated queen ant lands on the forest floor. Her wings fall away — her flying days are over. Her only job now is to start a colony."*
2. *"Alone, she digs a tiny chamber in the soft soil. It is the first room of the colony — and for now it holds everything: her, and the eggs she will lay."*
3. *"She seals the entrance and waits. For weeks she feeds the eggs from her own body's reserves — no foraging, no workers — until her first daughters hatch and break open the nest."*

**Colony state:** 3 ants · 1 tunnel · chambers: `founding` (depth 1, right) · 8 eggs · 0 larvae · no ventilation · no obstacle.

**Actions (2):**
| Button | Description | Reveals | Sound |
| --- | --- | --- | --- |
| Carve the founding chamber | "The queen digs the colony's very first room out of soft soil." | chamber `founding` | chamber |
| First workers hatch | "The first daughters break the seal and open the nest to the world." | shaft | egg |

**Recursion-step pill:** none.

**Quiz (q1, +20 XP):**
- *"The first workers emerge from the founding chamber. Where will they most likely start working?"*
  1. ✅ Test the surrounding soil for somewhere soft to dig
  2. March to the nearest stream for water
  3. Wait quietly for the queen to give each one a job
  4. Re-seal the entrance and go back to sleep
- Explanation: *"Workers do not wait for orders — they sense their surroundings. Soft, diggable soil is the cue that tells them where to start."*

**What happens in the diagram:** camera pans from the founding-chamber corner to center. The shaft area is dark/hidden. Clicking **"Carve the founding chamber"** throws dust at the founding chamber position, the chamber pops in with a spring animation while pulsing amber, and egg clusters appear in it. Clicking **"First workers hatch"** grows the main shaft from the surface down to the founding chamber, with ants beginning to crawl along it.

---

### Scene 2 — The Excavation Rule
- **Slug:** `excavation-rule` · **Phase:** `observation` · **XP:** 60

**Narration:**
1. *"There is no architect and no blueprint. The queen cannot tell her daughters where to build — so how does a colony grow into a maze of rooms?"*
2. *"Watch one worker. Her antennae and mandibles meet the soil. Is it diggable? Soft, loose, and moist — she digs. Packed solid or tangled with roots — she moves on."*
3. *"That single decision, repeated by thousands of workers, is the only rule the colony ever needs: find diggable soil, dig a tunnel, and make a room."*

**Colony state:** 6 ants · 1 tunnel · chambers: `founding` · 10 eggs · no larvae · no ventilation · no obstacle.

**Actions (1):**
| Button | Description | Reveals | Sound |
| --- | --- | --- | --- |
| Inspect the soil | "A worker tests the soil with her antennae and mandibles before deciding where to dig." | — (none) | click |

**Recursion-step pill:** `↻ find diggable soil → dig` — *"Every worker begins the same way: inspect the soil, and only dig where it gives way."*

**Quiz (q2, +30 XP):**
- *"A worker has just finished carving a chamber and faces a wall of loose soil. What should she do next?"*
  1. Wait for the queen to point out the next room
  2. ✅ Check the soil is diggable, then keep digging
  3. Close off the chamber and rest for the day
  4. Climb to the surface and wait for rain
- Explanation: *"The rule repeats. After one chamber, the worker inspects the next wall of soil and, if it is diggable, digs the next tunnel."*

**What happens in the diagram:** mostly a slow, observational scene. The founding chamber, shaft, and 6 ants are visible and moving. Clicking **"Inspect the soil"** plays a short dust puff near the surface where a worker pauses, then life resumes. The recursion-step pill first appears in this scene, labeling the rule.

---

### Scene 3 — First Tunnel
- **Slug:** `first-tunnel` · **Phase:** `action` · **XP:** 80

**Narration:**
1. *"Below the founding chamber, the workers find a patch of soft soil and dig straight down — the colony's first true tunnel."*
2. *"At the bottom, the soil opens into a rounded pocket. The workers hollow it out into a warm, humid room: the nursery, where eggs will grow."*
3. *"A worker carries the first eggs down from the founding chamber. The rule has built its first new room."*

**Colony state:** 12 ants · 2 tunnels · chambers: `founding`, `nursery` (depth 2, right) · 16 eggs · 0 larvae · no ventilation · no obstacle.

**Actions (3):**
| Button | Description | Reveals | Sound |
| --- | --- | --- | --- |
| Dig the first tunnel | "Workers excavate a vertical shaft down from the founding chamber." | shaft | dig |
| Carve the nursery | "The tunnel opens into a rounded room for the eggs." | chamber `nursery` | chamber |
| Move the eggs in | "Eggs are carried carefully down into the new nursery." | eggs | egg |

**Recursion-step pill:** `↻ dig down → build a chamber` — *"Dig a tunnel downward, then hollow out a new chamber."*

**Quiz (q3, +40 XP):**
- *"After hollowing out the nursery, what will the workers most likely do?"*
  1. Stop digging — the colony is finished
  2. ✅ Search the new walls for more diggable soil
  3. Seal the tunnel so nothing else can enter
  4. Wait for the queen to inspect the room
- Explanation: *"The rule continues. The walls of a freshly made chamber are the nearest place to test for diggable soil and grow the colony."*

**What happens in the diagram:** the three activities build the first new room in order. "Dig the first tunnel" extends the shaft down one level (deep dust at the dig tip); "Carve the nursery" springs the nursery pocket onto the shaft, highlighted amber; "Move the eggs in" fills the nursery with a cluster of pale egg ellipses that scale in one by one.

---

### Scene 4 — The Pattern Begins to Emerge
- **Slug:** `pattern-emerges` · **Phase:** `action` · **XP:** 90

**Narration:**
1. *"From the nursery, a worker tests the soil again. Soft enough — she digs. A second tunnel branches off, and the colony grows one level deeper."*
2. *"The tunnel reaches another pocket of soft soil, and again the workers stop to hollow it out — this time a dry store room for seeds."*
3. *"One worker, one rule: dig when the soil allows, make a chamber, and start again from there. The colony is building a pattern."*

**Colony state:** 18 ants · 3 tunnels · chambers: `founding`, `nursery`, `food` (depth 3, right) · 20 eggs · 8 larvae · no ventilation · no obstacle.

**Actions (3):**
| Button | Description | Reveals | Sound |
| --- | --- | --- | --- |
| Dig another tunnel | "Workers extend the network with a new tunnel down from the nursery." | shaft | dig |
| Carve the store room | "A second chamber is hollowed out for seeds." | chamber `food` | chamber |
| Stockpile food | "Seeds and foraged food are carried into the new room." | food | egg |

**Recursion-step pill:** `↻ dig down → build a chamber` — *"The same two steps repeat: dig a tunnel, then hollow out a chamber."* — **repeats: dig down → build a chamber**

**Quiz (q4, +50 XP):**
- *"The workers have just filled the store room. Where will they likely dig their next tunnel?"*
  1. ✅ From the newest chamber, into the soil beyond it
  2. All the way back up to the founding chamber
  3. Through the grass on the surface
  4. Nowhere — the colony has enough rooms
- Explanation: *"The rule always restarts from the newest chamber: inspect its walls for diggable soil and dig the next tunnel from there."*

**What happens in the diagram:** this is the **first explicit repeat** — the pill now shows `repeats: dig down → build a chamber`. The shaft grows to depth 3, the Food Storage pocket pops in (highlighted), then seed circles stack inside it. The colony now visibly looks like beads threaded on a vertical string.

---

### Scene 5 — Digging Deeper
- **Slug:** `digging-deeper` · **Phase:** `action` · **XP:** 110

**Narration:**
1. *"Each new chamber sits a little deeper, where the soil is more compact. The work slows — every mouthful of earth is heavier than the last."*
2. *"Still, the rule holds. The workers hollow out a third room for the growing brood, and young larvae are carried in to be tended."*
3. *"Watch the shape of the colony. Every room was reached the same way: dig until the soil is right, carve a chamber, and repeat."*

**Colony state:** 26 ants · 4 tunnels · chambers: `founding`, `nursery`, `food`, `brood` (depth 4, **left**) · 28 eggs · 16 larvae · no ventilation · no obstacle.

**Actions (3):**
| Button | Description | Reveals | Sound |
| --- | --- | --- | --- |
| Dig down once more | "A new tunnel extends the colony deeper into harder soil." | shaft | dig |
| Carve the brood chamber | "Another room is hollowed out for the growing young." | chamber `brood` | chamber |
| Tend the larvae | "Workers feed and groom the hatched larvae." | larvae | egg |

**Recursion-step pill:** `↻ dig down → build a chamber` — *"The same two steps repeat, level after level."* — **repeats: dig down → build a chamber**

**Quiz (q5, +60 XP):**
- *"The soil keeps getting harder with every level. What might the workers find if they keep going down?"*
  1. ✅ Soil so hard or solid that they cannot dig at all
  2. Soil that gets softer and easier forever
  3. Open sky below the ground
  4. Another colony exactly like theirs
- Explanation: *"Down here the soil is increasingly compact. Eventually they will reach a point where it simply will not yield — a place that stops the digging."*

**What happens in the diagram:** the shaft grows to depth 4, the Brood Chamber (the first chamber placed on the **left** side of the shaft) springs in highlighted, and the "Tend the larvae" action fills it with tan larva ellipses that wiggle slightly. This scene plants the seed for the base case — the quiz asks the learner to predict a stopping point.

---

### Scene 6 — The Base Case
- **Slug:** `base-case` · **Phase:** `observation` · **XP:** 130

**Narration:**
1. *"Deeper still, the soil turns to packed clay — and then, unmistakable: a slab of solid rock. The workers scrape their mandibles against it. Nothing gives."*
2. *"No matter how they try, the rock will not break. There is no more diggable soil down here. For the first time, the digging simply stops."*
3. *"This is the stopping point every digging rule eventually reaches. A colony does not need to dig forever — it needs to know when to stop."*

**Colony state:** 32 ants · 5 tunnels · chambers: `founding`, `nursery`, `food`, `brood` · 32 eggs · 22 larvae · no ventilation · **obstacle: rock at depth 6**.

**Actions (1):**
| Button | Description | Reveals | Sound |
| --- | --- | --- | --- |
| Test the hard ground | "A worker probes the packed clay and strikes solid rock below." | obstacle | dig |

**Recursion-step pill:** `↻ dig until the soil is no longer diggable` — *"The rule carries a stopping condition: when there is no diggable soil, the digging stops."*

**Quiz (q6, +70 XP):**
- *"The workers strike solid rock. What happens next?"*
  1. They chew through the rock, one grain at a time
  2. ✅ They stop digging downward and search for diggable soil elsewhere
  3. The whole colony collapses into the tunnel
  4. They wait for the queen to order a new plan
- Explanation: *"Rock is not diggable, so the rule says stop here. Workers do not waste effort where the soil will not yield — they go where it will."*

**What happens in the diagram:** clicking **"Test the hard ground"** throws dust at the planned rock depth (~y=546) and the **rock slab springs in** spanning the full width of the cross-section — jagged grey bedrock with mineral veins and a brief amber impact spark. The main shaft now **stops exactly at the top of the rock** (y≈528), and patrolling ants visibly turn around just above the bedrock instead of passing through it. This is the base case rendered visually.

---

### Scene 7 — Expand Sideways
- **Slug:** `expand-sideways` · **Phase:** `action` · **XP:** 140

**Narration:**
1. *"The rock ends the downward journey, but the colony is not finished. Just below the surface, the soil stays loose and diggable — so the workers dig sideways."*
2. *"The first horizontal chamber is carved right near the ground, close to the entrance. More rooms spread out from it, like shelves in a pantry."*
3. *"Same rule, new direction. The workers found diggable soil, dug a tunnel, and made a chamber — they just did it sideways instead of down."*

**Colony state:** 38 ants · 5 tunnels · chambers: `founding`, `nursery`, `food`, `brood`, **`gallery-a`** (depth 1, left, x=0.15), **`gallery-b`** (depth 2, left, x=0.7) · 34 eggs · 26 larvae · no ventilation · rock at depth 6.

**Actions (2):**
| Button | Description | Reveals | Sound |
| --- | --- | --- | --- |
| Carve the first gallery | "A horizontal room is hollowed out just under the surface." | chamber `gallery-a` | chamber |
| Extend the gallery | "Another room branches sideways from the first gallery." | chamber `gallery-b` | chamber |

**Recursion-step pill:** `↻ the same rule, turned sideways` — *"With depth blocked, the same rule is applied sideways near the surface."* — **repeats: dig down → build a chamber**

**Quiz (q7, +70 XP):**
- *"The rock blocks digging straight down. Where will the workers look for diggable soil next?"*
  1. Straight through the rock, no matter how hard
  2. ✅ Sideways, just below the surface, where the soil is still loose
  3. Only inside the founding chamber
  4. They will never dig again
- Explanation: *"The rule looks for diggable soil wherever it exists. With depth blocked, the loose soil near the surface is the natural next place."*

**What happens in the diagram:** the renderer introduces a new geometry type — **side galleries**. Each gallery grows a **straight horizontal connector tunnel** off the shaft, then the room springs in at its lateral offset. Gallery East appears near the surface (x≈155), Gallery West further out (x≈61). Deep chambers stay pockets on the shaft; galleries are flat horizontal rooms with labels *below* them. This visually demonstrates the same rule applied in a new direction.

---

### Scene 8 — Ventilation and Organization
- **Slug:** `ventilation` · **Phase:** `observation` · **XP:** 120

**Narration:**
1. *"A deep colony needs fresh air. Workers carve narrow shafts up to the surface, and warm stale air rises out of them while fresh air is drawn in."*
2. *"Now the colony has a shape and a purpose. The nursery stays warm and humid for eggs; the store rooms stay dry for seeds; the brood is tended deep inside."*
3. *"Every room sits exactly where the same simple rule placed it — no plans, no blueprints. Just soil, workers, and repetition."*

**Colony state:** 44 ants · 6 tunnels · chambers: all six (founding → gallery-b) · 40 eggs · 30 larvae · **ventilation: true** · rock at depth 6.

**Actions (1):**
| Button | Description | Reveals | Sound |
| --- | --- | --- | --- |
| Carve the ventilation shafts | "Narrow shafts connect the deep colony to fresh surface air." | ventilation | vent |

**Recursion-step pill:** `↻ dig a tunnel, connect a chamber` — *"Even the ventilation reuses the same building block: dig a tunnel, connect it to a chamber."* — **repeats: dig down → build a chamber**

**Quiz (q8, +60 XP):**
- *"Why do the workers carve narrow shafts up to the surface?"*
  1. ✅ To let stale, warm air escape and draw in fresh air
  2. To build a second private entrance for the queen
  3. To help water drain out of the chambers
  4. For decoration, so the colony looks finished
- Explanation: *"The shafts let warm stale air rise and escape while fresh air is pulled in, keeping the deep chambers breathable and temperature-stable."*

**What happens in the diagram:** clicking **"Carve the ventilation shafts"** draws **three dashed narrow shafts** at x = 340, 400, 460 (each deeper than the last, hugging the main tunnel) that grow downward from the surface, with tiny pale **air motes** that continuously rise from inside the colony up and out — the colony visibly "breathes". The full colony now stands assembled.

---

### Scene 9 — Pattern Recognition
- **Slug:** `pattern-recognition` · **Phase:** `quiz` · **XP:** 200

**Narration:**
1. *"Step back and look at everything the ants built. The founding chamber, the tunnels, the nursery, the stores, the galleries — each one came from the same rule."*
2. *"Every unfinished chamber was solved the same way: find diggable soil, dig a tunnel, make a room, then repeat from the new room. The rule solved a smaller version of the same problem each time."*
3. *"When a process is described in terms of itself — build a colony by building one chamber, then build the rest of the colony from that chamber — the pattern has a name. Can you name it?"*

**Colony state:** 46 ants · 6 tunnels · all six chambers · 42 eggs · 32 larvae · ventilation on · rock at depth 6.

**Actions (1):**
| Button | Description | Reveals | Sound |
| --- | --- | --- | --- |
| Observe the full colony | "See how the whole colony is built from one repeating rule." | — (none) | click |

**Recursion-step pill:** `↻ colony = dig + chamber + repeat from the new chamber` — *"Every chamber is reached by repeating the same dig-and-build step from the chamber above it."* — **repeats: dig down → build a chamber**

**This scene sets `discoversRecursion: true`** — finishing it (or answering the quiz) fires the **Recursion Discovered** moment: a "reveal" arpeggio, a toast *"Recursion Discovered — You named the repeating pattern — recursion revealed."*, and unlocks the `recursion-revealed` achievement (+200 XP).

**Quiz (q9, +150 XP):**
- *"The colony is built by a rule that keeps solving a smaller version of the same problem — build one chamber, then build the rest of the colony from there. What is this idea called?"*
  1. Looping
  2. ✅ Recursion
  3. Stacking
  4. Branching
- Explanation: *"A process that is defined in terms of a smaller version of itself is called recursion. The ants 'dig, chamber, repeat' — recursion built the whole colony."*

**What happens in the diagram:** the scene is a moment of reflection — the entire colony (all six chambers, ventilation, rock) sits fully animated behind a single "Observe the full colony" button that reveals nothing new. The educational climax is the quiz: naming **recursion**.

---

### Scene 10 — Reality Begins
- **Slug:** `reality-begins` · **Phase:** `observation` · **XP:** 100 · **Real photos:** day-1.png, day-3.png

**Narration:**
1. *"Everything you have seen so far has been an animation inspired by real ant colonies."*
2. *"Real colonies begin with only a few workers excavating beneath the surface."*
3. *"They don't build an entire colony at once."*
4. *"Instead, they repeatedly extend the nest one excavation at a time."*

**Colony state:** 46 ants · 6 tunnels · all six chambers · 42 eggs · 32 larvae · ventilation on · rock at depth 6 (the same finished colony as Scene 9, dimmed behind the photos).

**Real photographs:** a framed, Ken-Burns-zoomed card replaces the visual focus. `day-1.png` (a newly started colony) shows for narration lines 1–2; `day-3.png` (the nest grown deeper) shows for lines 3–4. During the activity and quiz the **compare layout** shows both photos side by side.

**Actions (1):**
| Button | Description | Reveals | Sound |
| --- | --- | --- | --- |
| Compare the photographs | "Look closely at how the colony changed between these two real photographs." | — (none) | click |

**Recursion-step pill:** `↻ find diggable soil → dig` — *"Real workers use the same excavation rule the animation showed: dig where the soil gives way."*

**Quiz (q10, +60 XP):**
- *"What changed between these two photographs?"*
  1. ✅ The colony became deeper
  2. The ants changed how they dig
  3. The entrance disappeared
- Explanation: *"Notice that the excavation behavior has not changed. Only the colony grew deeper — the same rule kept repeating."*

**What happens in the diagram:** the finished colony sits dimmed behind a framed real photo. The photo advances with the narration; the "tap a chamber to explore" hint is suppressed. The quiz asks the learner to compare the two real photos (both shown side by side).

---

### Scene 11 — The Pattern Exists in Nature
- **Slug:** `pattern-in-nature` · **Phase:** `observation` · **XP:** 120 · **Real photos:** day-5.png, day-10.png

**Narration:**
1. *"As excavation continues, more chambers appear."*
2. *"Every newly excavated chamber becomes another place where workers continue expanding the colony."*
3. *"No ant knows the final shape of the nest."*
4. *"Each worker simply follows the same excavation rule."*

**Colony state:** 46 ants · 6 tunnels · all six chambers · 42 eggs · 32 larvae · ventilation on · rock at depth 6.

**Real photographs:** `day-5.png` shows for narration lines 1–2, `day-10.png` for lines 3–4; the compare layout appears during the activity and quiz.

**Actions (1):**
| Button | Description | Reveals | Sound |
| --- | --- | --- | --- |
| Observe the colony's growth | "See how the same excavation behavior keeps building new rooms." | — (none) | click |

**Recursion-step pill:** `↻ the same rule, repeated` — *"The same excavation step repeats from each new chamber — that is what grows the colony."* — **repeats: dig down → build a chamber**

**Conclusion (glow):** on a correct quiz answer the **conclusion stage** plays a single centered, softly glowing sentence — *"A simple rule, repeated many times, creates a complex colony."* — which blurs in, then auto-advances **straight into Scene 12** (the done screen is skipped so the documentary flow keeps moving). A wrong answer skips the conclusion and goes straight to done.

**Quiz (q11, +60 XP):**
- *"What stayed the same while the colony continued growing?"*
  1. ✅ Workers repeated the same excavation behavior
  2. Every chamber was designed differently
  3. The queen planned every tunnel
- Explanation: *"The workers kept repeating the same excavation behavior — find diggable soil, dig, and make a chamber."*

**What happens in the diagram:** two more real photos track the colony's continued growth; the recursion-step pill now labels the repeated rule explicitly. The conclusion stage delivers the scene's thesis sentence with a soft amber glow.

---

### Scene 12 — A Real Colony
- **Slug:** `real-colony` · **Phase:** `observation` · **XP:** 150 · **Real photo:** final_.jpg (plaster cast)

**Narration:**
1. *"This is a real plaster cast made from an abandoned ant colony."*
2. *"What appears to be an incredibly complicated underground city was not designed from a master blueprint."*
3. *"Thousands of workers simply repeated the same local excavation behavior."*
4. *"Everything you learned in the animation is happening here in nature."*

**Colony state:** 46 ants · 6 tunnels · all six chambers · 42 eggs · 32 larvae · ventilation on · rock at depth 6.

**Real photograph:** a single framed card of the plaster cast (with a human for scale) stays on screen for all four narration lines and the quiz.

**Actions (1):**
| Button | Description | Reveals | Sound |
| --- | --- | --- | --- |
| Study the plaster cast | "Take in the full size and complexity of this real colony." | — (none) | click |

**Recursion-step pill:** `↻ one rule, repeated many times` — *"The same repeating rule produced this entire underground city — no blueprint required."* — **repeats: dig down → build a chamber**

**Conclusion (button) + transition reel:** on a correct quiz answer the conclusion card reveals three lines in sequence — *"Nature first."* · *"Programming second."* · *"The same repeating pattern you observed in real ant colonies is called **Recursion** in Computer Science."* ("Recursion" is highlighted in amber). The amber **Continue to Python** button appears once all lines are shown; tapping it awards the scene and plays the full-screen **transition reel** — *Nature → Same Rule → Recursion → Python*, each word fading in ~0.7 s apart — which then fades directly into Scene 13's Python visualization (the done screen is skipped). A wrong answer goes straight to done.

**Quiz (q12, +100 XP):**
- *"Why does this colony resemble recursion?"*
  1. ✅ The same rule keeps being applied whenever new work appears.
  2. One ant memorized the entire colony.
  3. The queen designed the complete layout before digging started.
- Explanation: *"The same rule keeps being applied whenever new work appears — just like recursion applies a function to itself."*

**What happens in the diagram:** the plaster cast grounds everything in reality, then the conclusion explicitly names **Recursion** for the first time as a computer-science idea and hands the learner to Python.

---

### Scene 13 — Recursion Revealed
- **Slug:** `python-mapping` · **Phase:** `reveal` · **XP:** 300

**Narration:**
1. *"Now you can see what the ants were doing all along: the colony was built recursively. One rule, applied to itself, over and over."*
2. *"A function that calls itself is a recursive function. The stopping point — the rock that stopped the digging — is called the base case. When the base case is reached, the function returns."*
3. *"Watch build_colony() dig down to the rock, then carve each chamber on the way back up. Every return builds one more room."*

**Colony state:** 52 ants · 7 tunnels · chambers: all six + **`queen`** (depth 5, right) · 60 eggs · 44 larvae · ventilation on · rock at depth 6.

**Actions (1):**
| Button | Description | Reveals | Sound |
| --- | --- | --- | --- |
| Welcome the queen | "The queen moves to her new chamber at the heart of the finished colony." | chamber `queen` | chamber |

**Recursion-step pill:** `↻ build_colony = dig_tunnel + build_colony + carve_chamber` — *"A recursive definition: dig down, solve the rest of the colony from there, and carve a chamber on the way back up."* — **repeats: dig down → build a chamber**

**Special flow:** narration → action → **"See the code"** (launches the 3-panel Python reveal, Section 6) → quiz → done.

**Quiz (q13, +200 XP):**
- *"In build_colony(), what makes the recursion stop digging?"*
  1. Running out of memory
  2. ✅ The base case — hit_obstacle() is true
  3. The queen gives an order to stop
  4. Nothing — the recursion never stops
- Explanation: *"Every recursion needs a base case that stops it. Here it is hit_obstacle() — exactly like the rock that stopped the ants. Without it, the digging would never end."*

**What happens in the diagram:** clicking **"Welcome the queen"** springs the deepest chamber — the **Queen's Chamber** at depth 5, directly on the shaft just above the rock — into view, highlighted, with a small queen glyph (a dark ellipse pair) inside it. The colony is now complete: 7 rooms, ventilation, and the base-case rock. Then the player enters the Python reveal.

---

## 5. The Colony Diagram, In Depth

### 5.1 Coordinate system (`colony/geometry.ts`)
The animated cross-section is an **SVG with a 800 × 620 viewBox**. Key constants:

| Constant | Value | Meaning |
| --- | --- | --- |
| `SURFACE_Y` | 90 | Ground line (sky above, soil below) |
| `SHAFT_X` | 280 | X of the single main vertical shaft |
| `ROW_H` | 76 | Pixels per depth level |
| `CHAMBER_RX` / `CHAMBER_RY` | 56 / 26 | Deep chamber pocket size |
| `GALLERY_RX` / `GALLERY_RY` | 40 / 15 | Gallery room size |
| `GALLERY_GAP` | 100 | Base lateral offset for a gallery |
| `SIDE_SPREAD` | 170 | Extra spread from a gallery's `x` fraction |
| `GALLERY_RISE` | 38 | Galleries sit shallower than nominal depth |
| `ROCK_CLEARANCE` | 20 | Ants turn around this far above the rock top |

### 5.2 Exactly where everything is drawn
- **Deep chambers** (founding, nursery, food, brood, queen) are bulbous pockets on the shaft: center `x = 280`, `y = 90 + depth × 76`. They thread onto the shaft "like beads on a string" — no elbow connectors. Labels sit *above* each pocket.

| Chamber | depth | center y |
| --- | --- | --- |
| Founding Chamber | 1 | 166 |
| Nursery | 2 | 242 |
| Food Storage | 3 | 318 |
| Brood Chamber | 4 | 394 |
| Queen's Chamber | 5 | 470 |

- **Galleries** (gallery-a, gallery-b) are flat horizontal rooms connected by a straight horizontal tunnel: `y = 90 + depth × 76 − 38`; `x = 280 − (100 + xfrac × 170)` for left-side rooms. Labels sit *below* them.

| Gallery | depth | xfrac | center (x, y) |
| --- | --- | --- | --- |
| Gallery East (gallery-a) | 1 | 0.15 | (154.5, 128) |
| Gallery West (gallery-b) | 2 | 0.70 | (61, 204) |

- **Base-case rock** (depth 6): sits at `y = 546`, a jagged slab spanning the full 800 px width with mineral veins. The **shaft stops at `y ≈ 528`** (just above the rock — never pokes through). Patrolling ants turn around at `y = 526` (`rockTopY`).
- **Ventilation shafts** at `x = 340, 400, 460` (close beside the main tunnel), each reaching `y = 210 / 300 / 390` respectively, dashed, with rising air motes.

### 5.3 Camera pans per scene
On scene load, the camera animates from `{ x: −depth×6, y: depth×8, scale: 1 + depth×0.03 }` back to `{ x: 0, y: 0, scale: 1 }` over 1.6 s, where `depth = min(chambers.count, 4)`:

| Scenes | depth | pan start |
| --- | --- | --- |
| 1, 2 (1 chamber) | 1 | (−6, 8, ×1.03) |
| 3 (2 chambers) | 2 | (−12, 16, ×1.06) |
| 4 (3 chambers) | 3 | (−18, 24, ×1.09) |
| 5–13 (4+ chambers) | 4 | (−24, 32, ×1.12) |

### 5.4 Everything drawn in the SVG (`AntColony.tsx`)
1. **Sky gradient** band (top 90 px, dark green) and a grass strip with 26 individually animated grass blades that grow and sway.
2. **Soil mass** with a 3-stop brown gradient and ~60 random dark speckles (opacity 0.25) for texture.
3. **Entrance glow** — a soft amber radial gradient circle at the surface opening.
4. **Main shaft** — a thick (12 px) dark stroke that grows from `y = top` down to the current `shaftBottom`; it re-animates whenever the target depth increases.
5. **Ventilation shafts** (Scene 8+) with looping rising air motes.
6. **Rock barrier** (`ObstacleBarrier.tsx`) with jagged top, mineral veins, and a one-time amber impact spark.
7. **Chambers** — only visible ids are drawn; each springs in (scale 0→1) with its connector tunnel growing first; the active chamber gets a pulsing amber stroke highlight.
8. **Chamber contents**:
   - **Founding chamber**: up to 8 pale egg ellipses whenever eggs > 0.
   - **Nursery**: up to 14 eggs once the `eggs` layer is revealed.
   - **Brood chamber**: up to 10 tan larvae (subtle wiggling) once `larvae` is revealed.
   - **Food Storage + galleries**: golden seed dots (8 in Food Storage, 5 per gallery) once `food` is revealed.
   - **Queen's chamber**: a dark queen glyph (two ellipses).
9. **Activity effects**:
   - **Dust**: 8 brown particles burst upward from the dig site (the chamber center, the shaft tip, the rock top, or a vent) while an activity runs.
   - **Brigade motes**: 6 soil pellets get carried away from the surface (only for the unused `brigade` activity).
   - **Signal ripples**: 3 expanding green rings (only for the unused `signal` activity).
10. **Ants** — see below.

### 5.5 Ant behavior (`AntWalker.tsx`, `geometry.ts`)
- Each ant animates a single **scalar progress value** (0→1, looping) and its position is derived from a **route polyline** via `pointAlongRoute` — so ants are *constrained to tunnels by construction* and never cut across open soil.
- Routes are built in `buildAnts`: every 3rd ant **patrols** the shaft (top ↔ bottom, turning around at the rock top once the base case is revealed); the rest **dive** to a visible chamber and back (or for galleries, exit, detour sideways, and return).
- Each ant has its own duration (5–9 s), stagger delay, and size (0.8–1.0 scale).
- The ant glyph (`AntGlyph.tsx`) is a 3-segment body, 6 legs, 2 curved antennae — drawn as a `<g>` so parents translate/rotate/scale it.

### 5.6 Clicking a chamber (`ChamberModal.tsx`)
Clicking any visible chamber opens a modal with its name, **Depth N**, its purpose, and two real ant facts:

| Chamber | Facts |
| --- | --- |
| Founding | "A newly mated queen digs this first room alone and seals herself in." / "She raises her first brood here, feeding the eggs from her own reserves." |
| Nursery | "Eggs and tiny larvae are kept here where temperature stays steady." / "Worker ants rotate the eggs to keep them evenly warmed." |
| Food | "Seeds and foraged food are stacked here for the colony to eat later." / "Some ants farm fungus here instead of storing seeds." |
| Brood | "Larvae and pupae grow here, fed and groomed by nurses." / "Deeper chambers stay cooler — ideal for developing young." |
| Gallery East | "A shallow horizontal room, hollowed out once the rock blocked going deeper." / "Just below the surface, this soil stays loose and easy to carve." |
| Gallery West | "A room hollowed out beneath the shallow gallery line." / "Sideways rooms let the colony grow wider when depth is exhausted." |
| Queen's Chamber | "The queen lives deepest, where it is safest and coolest." / "She can lay thousands of eggs in her lifetime." |

---

## 6. The Python Reveal — Scene 13's Diagram (`PythonCodeReveal.tsx`)

Three synchronized panels driven by one shared step counter:

```
Python Code  |  Call Stack  |  Mini Colony
```

It demonstrates **post-order recursion**: `build_colony()` digs *down* to the rock (descending, pushing frames), then carves every chamber on the *way back up* (unwinding, popping frames) — exactly the shape the colony actually built.

### 6.1 The code (`colony.py`), shown line-by-line
Lines are revealed one at a time every **420 ms** (with a click tick):

| # | Line | Kind / color | Annotation |
| --- | --- | --- | --- |
| 1 | `def build_colony(depth):` | def (sky) | Build from this depth down |
| 2 | `if hit_obstacle(depth):` | keyword (fuchsia) | Base case — the rock stops the digging |
| 3 | `return` | return (rose) | — |
| 4 | `dig_tunnel()` | call (amber) | Step down one level |
| 5 | `build_colony(depth + 1)` | call (amber) | Build the rest of the colony first — recursion! |
| 6 | `carve_chamber(depth)` | call (amber) | Then carve a room on the way back up |

The **Run** button stays disabled until all 6 lines are revealed. Intro copy explains: the colony you watched *is exactly this function*; build the rest first, then make a room — **post-order**.

### 6.2 The 29-step run trace
After Run is pressed, every **640 ms** one step executes. The rock is at `MAX = 6`. Here is the full trace:

| Step | Code line highlighted | Action | Status caption |
| --- | --- | --- | --- |
| 1 | `def build_colony(depth):` | Push `build_colony(1)` | Calling build_colony(1) |
| 2 | `if hit_obstacle(depth):` | check | Checking hit_obstacle() |
| 3 | `dig_tunnel()` | Shaft grows to depth 2 | Digging tunnel to depth 2 |
| 4 | `build_colony(depth + 1)` | Push `build_colony(2)` | Calling build_colony(2) |
| 5 | `if hit_obstacle(depth):` | check | Checking hit_obstacle() |
| 6 | `dig_tunnel()` | Shaft grows to depth 3 | Digging tunnel to depth 3 |
| 7 | `build_colony(depth + 1)` | Push `build_colony(3)` | Calling build_colony(3) |
| 8 | `if hit_obstacle(depth):` | check | Checking hit_obstacle() |
| 9 | `dig_tunnel()` | Shaft grows to depth 4 | Digging tunnel to depth 4 |
| 10 | `build_colony(depth + 1)` | Push `build_colony(4)` | Calling build_colony(4) |
| 11 | `if hit_obstacle(depth):` | check | Checking hit_obstacle() |
| 12 | `dig_tunnel()` | Shaft grows to depth 5 | Digging tunnel to depth 5 |
| 13 | `build_colony(depth + 1)` | Push `build_colony(5)` | Calling build_colony(5) |
| 14 | `if hit_obstacle(depth):` | check | Checking hit_obstacle() |
| 15 | `dig_tunnel()` | Shaft grows to depth 6 | Digging tunnel to depth 6 |
| 16 | `build_colony(depth + 1)` | Push `build_colony(6)` | Calling build_colony(6) |
| 17 | `if hit_obstacle(depth):` | check | Checking hit_obstacle() |
| 18 | `return` | **Rock revealed, pop `build_colony(6)`** | **Base case — hit_obstacle(6)** (rose) |
| 19 | `carve_chamber(depth)` | **Chamber carved at depth 5** | Carving chamber at depth 5 |
| 20 | `return` | Pop `build_colony(5)` | Returning… |
| 21 | `carve_chamber(depth)` | **Chamber carved at depth 4** | Carving chamber at depth 4 |
| 22 | `return` | Pop `build_colony(4)` | Returning… |
| 23 | `carve_chamber(depth)` | **Chamber carved at depth 3** | Carving chamber at depth 3 |
| 24 | `return` | Pop `build_colony(3)` | Returning… |
| 25 | `carve_chamber(depth)` | **Chamber carved at depth 2** | Carving chamber at depth 2 |
| 26 | `return` | Pop `build_colony(2)` | Returning… |
| 27 | `carve_chamber(depth)` | **Chamber carved at depth 1** | Carving chamber at depth 1 |
| 28 | `return` | Pop `build_colony(1)` | Returning… |
| 29 | — | done | **Colony complete!** (emerald) |

Full run takes ≈ 17.9 s. Sounds fire per action: click on pushes, dig on shaft growth, "correct" on the base case, "chamber" on each carve, "reveal" at the end.

### 6.3 What each panel shows
- **Python Code**: dark GitHub-style editor with macOS traffic-light dots and a `colony.py` tab. The currently executing line glows amber (`bg-amber-400/10` + ring).
- **Call Stack**: stack frames stacked upward (newest on top). Frames are amber; the top running frame shows `running…`; the base-case frame `build_colony(6)` is **rose**. Springs in from the right on push, exits left on pop. When empty and idle it reads "Press Run to watch the recursion unfold." When finished, the header shows a small emerald **"unwound"** tag.
- **Mini Colony**: a 260×262 SVG — dark-green surface band, brown soil. The shaft grows down from the entrance dot; the grey rock pops in at depth 6 on the base case; then the five chambers (`d1`…`d5`) appear **deepest first** (5 → 4 → 3 → 2 → 1) as rounded rooms **threaded directly on the shaft** — exactly the main colony diagram's layout. A live status caption below the mini-map updates every step.

**Controls:** **Run** (amber, disabled until code is fully revealed) → **Reset** (grey, restarts the trace) → **Continue** (emerald, appears when done, advances to the quiz).

### 6.4 Mapping hint (code ↔ ants)
Three chips under the panels:
- `def build_colony` = the colony-building behavior
- `build_colony(depth + 1)` = build the rest first, then carve (post-order)
- `if hit_obstacle(depth)` = the rock — the base case that stops the digging

---

## 7. Component Map

| File | Role |
| --- | --- |
| `src/App.tsx` | App shell: view routing (title/map/scene), global toast stack, achievements drawer, audio unlock, scene nav state |
| `src/main.tsx` | React entry, mounts `App` |
| `src/data/types.ts` | All TypeScript types: Scene, SceneAction, QuizQuestion, ChamberSpec, ColonyState, Achievement, ProgressState, etc. |
| `src/data/story.ts` | The 13-scene content: narration, colony states, activities, recursion steps, photos, conclusions, quizzes, XP |
| `src/data/achievements.ts` | The 5 achievements and their conditions |
| `src/data/index.ts` | Barrel re-export of the data layer |
| `src/state/useGameState.ts` | Global state hook: XP, progress, achievements, recursion flag, mute, toasts; persistence wiring |
| `src/storage/progress.ts` | localStorage read/write/reset under `recursive-explorer-progress-v2` |
| `src/audio/soundEngine.ts` | Procedural Web Audio SFX engine |
| `src/components/TitleScreen.tsx` | Cinematic title + Begin/Resume |
| `src/components/SceneMap.tsx` | Chapter-select hub with progress bar and soft locking |
| `src/components/ScenePlayer.tsx` | Orchestrates one scene's 6 stages and progressive disclosure |
| `src/components/Narration.tsx` | Typewriter-style line-by-line narration with progress dots |
| `src/components/QuizCard.tsx` | 4-option quiz with instant feedback + explanation |
| `src/components/ChamberModal.tsx` | Chamber detail popup (purpose + real ant facts) |
| `src/components/PhotoStage.tsx` | Framed Ken-Burns real-photo stage for the reality-bridge scenes (10–12) |
| `src/components/ConclusionCard.tsx` | Animated post-quiz conclusion (glow sentence / "Continue to Python" card) |
| `src/components/TransitionReel.tsx` | Full-screen word-by-word bridge reel (Scene 12 → Python) |
| `src/components/PythonCodeReveal.tsx` | The 3-panel post-order recursion trace |
| `src/components/AntColony.tsx` | The animated SVG colony cross-section renderer |
| `src/components/colony/geometry.ts` | Coordinate math, route sampling, shaft/rock logic |
| `src/components/colony/AntWalker.tsx` | One ant animated along a tunnel route |
| `src/components/colony/AntGlyph.tsx` | The ant's visual (3 segments, 6 legs, 2 antennae) |
| `src/components/colony/ObstacleBarrier.tsx` | The base-case rock slab |
| `src/components/AchievementsPanel.tsx` | Slide-over achievements drawer |
| `src/components/ToastStack.tsx` | XP / achievement / info toasts (auto-dismiss 4.2 s) |

---

## 8. Fun Facts / Easter Eggs

- The colony layout in the final scenes maps 1:1 to the recursion: depth = recursion depth, the rock = the base case, each chamber = one `carve_chamber()` call on the way back up.
- Gallery West sits at x = 61, nearly at the left edge of the 800 px viewBox — the widest the colony gets.
- The `signal` and `brigade` sound effects and their particle animations exist in the engine and renderer but no live scene triggers them (dead-code hooks from an earlier design).
- The ventilation shafts sit tight against the main tunnel (x = 340 / 400 / 460, reaching y = 210 / 300 / 390) so they read as part of the colony rather than floating far off to the right.
- Scenes 10–12 are the only scenes that use **real photographs**; the compare layout (both photos side by side) is what lets Scene 10's "what changed?" question be answered from the screen itself.
- Scene 13's colony state has 52 ants, 60 eggs, and 44 larvae — the colony's final census.
- Total achievable XP (as actually awarded) is **2560**: 1640 from the 13 scenes + 920 from all 5 achievements.
