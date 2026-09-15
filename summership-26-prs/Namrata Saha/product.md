# 📜 Py-Betaal Tales: Story-Driven Python Foundations

> **A feature of the PyBe platform.** A scenario-first learning engine that introduces foundational Python through Panchatantra/Jataka fables, a questioning spirit (Betaal), micro-lessons, hands-on practice, and mini-projects.

<p align="center">
  <em>Python, by experience — the story comes first, the syntax comes last.</em>
</p>

---

## 1. Overview

PyBe already teaches Python through real-life scenarios. **Py-Betaal Tales** takes that philosophy one step further: instead of school-bag weights and canteen bills, the scenario is a fable. Learners begin with a familiar, morally rich story, are challenged by **Betaal's riddle**, pause for a quiet reflection, and only then discover the Python concept hidden inside the tale.

| | |
| --- | --- |
| **Author** | Namrata Saha |
| **Project** | PyBe (Python, By Experience) |
| **Concepts covered** | Variables, conditionals, loops, lists, functions |
| **Learning units** | 25 story modules — 5 under each of the 5 foundational concepts (variables, conditionals, loops, lists, functions) |
| **Runtime** | React + Vite client, Express + JSON server, Pyodide in-browser Python |
| **AI dependency** | None — fully deterministic and local |

---

## 2. Problem statement

Traditional beginner tutorials start with syntax ("this is a variable, this is an `if`"), which is abstract and forgettable. Scenario-driven learning is PyBe's answer, but even scenario prompts can feel like exercises. Learners stay engaged longer, and remember concepts longer, when:

1. The problem arrives inside a **narrative** they already understand.
2. A **questioning character** forces them to reason, not guess.
3. Lessons are **short** (micro-lessons) and immediately followed by **practice**.
4. Progress is **visible** (XP, badges, a story map).
5. Learning ends with a **mini-project** they can point to.

### Objectives

1. Teach foundational Python concepts through Panchatantra/Jataka fables — **story before syntax**.
2. Use **Betaal**, a riddling spirit, as a Socratic questioner that promotes thinking and problem-solving after each tale.
3. Keep each unit a **micro-lesson**: one concept, three small ideas, low cognitive load.
4. Provide **immediate hands-on practice** with real Python that runs in the browser, with instant deterministic feedback.
5. Show **visible progress** through XP, badges and a story map.
6. End every tale with a **practical mini-project** that reuses the concept in a new, small context.

---

## 3. The pedagogy: the Betaal method

In the *Vikram-Betaal* stories, the king carries the spirit Betaal on his shoulders, and Betaal challenges him with a riddle after every tale. Each riddle forces thought before action. Py-Betaal Tales borrows this device as a deliberate pedagogical checkpoint.

### 3.1 Story first

Every unit opens with a fable (The Thirsty Crow, The Monkey and the Crocodile, etc.). No programming vocabulary appears yet. The learner reads the tale in short, paginated steps that keep the experience light and storybook-like.

### 3.2 The riddle checkpoint (Betaal)

After the fable, **Betaal asks a question** about the story that is really a question about the concept: "What does the crow keep track of as it drops pebbles?" The learner must reason about *structure*, not recall definitions. Answering correctly on the **first try** earns bonus XP, which encourages careful thought over random clicking. Wrong answers are met with a gentle explanation and a free retry — there is no penalty for trying, only a reward for thinking.

### 3.3 Reflection

Before the idea is revealed, the learner pauses for one quiet minute. Betaal invites them to sit with the tale and the riddle — no answers needed, just wonder. The **Ready** button stays disabled until the minute passes, and each tale closes with a story-specific reflection to carry forward.

### 3.4 Concept reveal

Only after the learner has reasoned through the riddle and reflected is the "hidden idea" revealed: *variables*, *conditionals*, *loops*, *lists*, *functions*. The reveal connects the story mechanism directly to the Python construct.

### 3.5 Micro-lesson

A deliberately short lesson: **one concept, three small ideas**, plus a "remember this" list. This keeps cognitive load low — the goal is a *seed*, not a chapter.

### 3.6 Hands-on practice

The learner writes real Python in a code editor that runs in the browser (Pyodide). The task is framed inside the story, starts from working code, and asks for one small change. Validation is **deterministic**: the output is compared to the expected output, or a small check snippet is evaluated. Feedback is immediate.

### 3.7 Mini-project

Each unit ends with a small build — a water-tank counter, a mango picker, a steady-walker loop, elephant notes, a lion's rescue kit. The project reuses the concept in a fresh, practical context, giving learners something to "make" rather than just "answer".

### 3.8 Progress, XP, badges

| Action | XP |
| --- | --- |
| Riddle solved on first try | +15 |
| Hands-on practice passed | +60 |
| Mini-project passed | +40 |

Badges reward breadth and depth:

| Badge | Condition |
| --- | --- |
| **First Tale** | Complete any one tale (riddle + practice + project) |
| **All Five Tales** | Complete all 25 tales in the library |
| **Riddle Master** | Solve every tale's riddle in the library (all 25) |
| **Code Weaver** | Pass every practice task and every mini-project across all 25 tales |

*Badge labels date from the original five-tale MVP; their conditions now unlock across the full 25-tale library.*

---

## 4. Learning journey

```text
┌─────────────────────────────────────────────────────────────┐
│  STAGE 1  STORY                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  The fable is read in short pages. No syntax yet.     │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ▼                                  │
│  STAGE 2  BETAAL'S RIDDLE                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  A story question that is really a structure question.│  │
│  │  First-try answer → +15 XP. Retries always allowed.   │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ▼                                  │
│  STAGE 3  REFLECTION                                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  A quiet minute with Betaal before the idea is shown. │  │
│  │  Ready unlocks when the minute is up.                 │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ▼                                  │
│  STAGE 4  CONCEPT REVEAL (IDEA)                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  The hidden idea is named and tied to the story.      │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ▼                                  │
│  STAGE 5  MICRO-LESSON                                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  One concept, three small ideas, a short remember-list│  │
│  └───────────────────────────────────────────────────────┘  │
│                          ▼                                  │
│  STAGE 6  HANDS-ON PRACTICE                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Real Python in the browser. Deterministic pass/fail. │  │
│  │  Instant feedback.  +60 XP                            │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ▼                                  │
│  STAGE 7  MINI-PROJECT                                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  A small practical build reusing the concept. +40 XP  │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ▼                                  │
│  STAGE 8  TALE COMPLETE & PROGRESS                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Tale complete; XP added; badges and story map update.│  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Content coverage

| # | Story (Panchatantra/Jataka) | Concept | Riddle | Practice | Mini-project |
| --- | --- | --- | --- | --- | --- |
| 1 | The Thirsty Crow | Variables | What grows with every pebble drop and must be updated? | Fill the pot: track the pebbles | The Village Water Tank |
| 2 | The Milkmaid and Her Pail | Variables | A running total that grows at every step | Count the chicks | The Market Ledger |
| 3 | The Dog and His Reflection | Variables | The value held in a name can change completely | Keep or lose the bone | The Riverbank Counter |
| 4 | The Elephant and the Dog | Variables | Track a changing feeling by name | Track the elephant's journey | The Elephant's Memory |
| 5 | The Blue Jackal | Variables | One name can hold a changing truth | The jackal's changing coat | The Chameleon's Wardrobe |
| 6 | The Monkey and the Crocodile | Conditionals | Decide from a condition before acting | The dangerous crossing | The Mango Picker |
| 7 | The Heron and the Crab | Conditionals | One decision resting on one condition | The crab's decision | The Pond Watcher |
| 8 | The Brahmin and the Goat | Conditionals | A chain of checks, one by one | What is on the Brahmin's shoulders? | The Road of Voices |
| 9 | The Great Monkey King | Conditionals | Many conditions, choose the right action | The monkey king's warning | The Rising Lake |
| 10 | The Crow and the Snake | Conditionals | A choice that fits what she sees | Choose the crow's move | The Crow's Plan Book |
| 11 | The Tortoise and the Hare | Loops | The same simple step, repeated steadily | Every lap counts | The Steady Walker |
| 12 | The Banyan Deer | Loops | A lot drawn again each morning | Draw the daily lots | End the Cycle |
| 13 | The Ant and the Dove | Loops | Small steps repeated until the goal | Cross the stream | Up the Hunter's Arm |
| 14 | The Golden Goose | Loops | A rhythm repeated once for each passing week | Three visits of gold | Market Weeks |
| 15 | The Monkey and the Wedge | Loops | Repeat while the condition still holds | Keep tugging | The Wedge Comes Loose |
| 16 | The Elephant and the Blind Men | Lists | Keep six views together, in order | The six views of the elephant | Elephant Notes |
| 17 | The Crows and the Owls | Lists | A list of members and plans that keeps changing | Choosing a Plan | Inside the Owl Cave |
| 18 | The Dove, Crow, Mouse, Tortoise and Deer | Lists | Call any friend by name, or visit all in turn | Roll Call of Friends | Each Friend's Rescue Role |
| 19 | The Elephant Caravan | Lists | Order matters: who marches first, middle, last | Fix the Marching Order | The Safe Crossing |
| 20 | The Wise Quail | Lists | Count the flock and visit every member | Count the Flock | Lift the Net Together |
| 21 | The Lion and the Mouse | Functions | Ask for the same help again without retelling | The rope chewer | Lion's Rescue Kit |
| 22 | The Tortoise and the Geese | Functions | One plan, passenger name filled in each time | Board the Stick | The Sky Ferry |
| 23 | The Ruru Deer | Functions | Take something in, give something back | Carry Him Ashore | The King's Questions |
| 24 | The Jackal and the Drum | Functions | One method for any mystery | Approach the Drum | Every Mystery, One Method |
| 25 | The Sparrow and the Elephant | Functions | Small actions chained into one plan | The First Helper Answers | The Plan Against the Elephant |

---

## 6. Codebase structure

```text
Namrata Saha/
├── package.json
├── README.md
├── WIKI.md
├── product.md
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx                 # App shell, data + session wiring
│       ├── styles.css               # Storybook theme (CSS variables)
│       ├── intro.css                # Intro screen styles
│       ├── hooks/
│       │   └── usePyodide.js        # Pyodide singleton + async loader
│       ├── lib/
│       │   ├── progress.js          # runPython, deterministic checks, XP/badges
│       │   ├── questionGenerator.js # Fresh practice/project variants
│       │   ├── riddleGenerator.js   # Length-balanced riddle shuffler
│       │   └── reflectionGenerator.js # Story-specific reflection lines
│       └── components/
│           ├── Intro.jsx            # Landing / intro screen
│           ├── StoryMap.jsx         # Home / story grid / stats
│           ├── StoryPlayer.jsx      # 8-stage flow + stepper
│           ├── BetaalLogo.jsx       # Betaal avatar (SVG)
│           ├── BetaalRiddle.jsx     # Riddle checkpoint
│           ├── Reflection.jsx       # 60-second reflection gate
│           └── CodeLab.jsx          # Python editor + output + checks
└── server/
    ├── package.json
    ├── .env.example
    └── src/
        ├── index.js                 # Express app (port 5000)
        ├── seed.js
        ├── data/
        │   ├── store.js             # JSON read/write store
        │   └── stories.json         # All story content (the "content DB")
        └── routes/
            ├── stories.js           # GET /api/stories, /:id
            └── sessions.js          # GET/POST /api/sessions
```

### Responsibilities

| File | Responsibility |
| --- | --- |
| `stories.json` | All learning content: fable, riddle, concept reveal, micro-lesson, practice, project, checks |
| `usePyodide.js` | Loads Pyodide once per session; exposes `pyodide`, `loading`, `error` |
| `progress.js` | Runs learner code, captures stdout, evaluates deterministic checks, derives XP and badges |
| `questionGenerator.js` | Generates fresh practice/project variants with deterministic checks |
| `riddleGenerator.js` | Rebalances each story's riddle into 4 unique, length-balanced choices |
| `reflectionGenerator.js` | Supplies the story-specific reflection message, prompt, and reveal line |
| `StoryPlayer.jsx` | Owns the learning flow state and stage gating (story → riddle → reflection → idea → lesson → practice → project → done) |
| `Reflection.jsx` | 60-second quiet minute; gates "Ready" until the time passes; reveals the story-specific line |
| `Intro.jsx` | Landing screen that introduces the module |
| `BetaalLogo.jsx` | Reusable Betaal avatar (SVG) |
| `BetaalRiddle.jsx` | Riddle UI with first-try detection and supportive feedback |
| `CodeLab.jsx` | Code editor with run/reset/hint, output pane, pass/fail banner |
| `routes/sessions.js` | Persists each learning event (riddle/practice/project) with XP |
| `store.js` | JSON-file persistence (mirrors PyBe's `server/src/data/store.js`) |

---

## 7. Technical decisions

### Why Pyodide?
Real Python in the browser means **immediate hands-on practice** with zero server-side Python and zero API keys. The engine loads once (cached for the session) and runs every learner program in a sandboxed WebAssembly interpreter.

### Why deterministic checks?
PyBe's philosophy is a fully local, keyless prototype. Every task uses one of two deterministic checks:
- **output-equals** — normalize and compare program stdout with the expected output;
- **py-check** — append a small snippet that sets `__pybe_pass` to validate logic precisely.

This makes feedback instant, predictable, and testable — no LLM required.

### Why JSON files?
The rest of PyBe uses JSON-file storage (`server/src/data/db.json`). Mirroring it keeps the module consistent, runnable anywhere, and free of Mongo/Docker/Auth infrastructure.

### Why 25 stories (5 × 5)?
The library pairs five foundational concepts — *store* (variables), *decide* (conditionals), *repeat* (loops), *group* (lists), *reuse* (functions) — with five tales each. Seeing the same idea surface again and again through different fables builds depth without repetition, while the five-concept spread gives breadth: every learner meets the full first-curriculum. The content schema in `stories.json` still makes adding further tales a data-only change.

---

## 8. User experience principles

- **Storybook aesthetic** — parchment tones, serif story type, warm gold/forest/terracotta palette.
- **One thing per screen** — fable pages, then riddle, then concept, then practice.
- **Always room to try again** — no dead-ends; wrong answers explain and invite retry.
- **Visible progress** — stepper inside a tale, story map and XP/badges outside it.
- **Accessible** — semantic landmarks, labelled controls, `aria-live` output, keyboard support (Ctrl+Enter runs code), visible focus, reduced-motion support.
- **Responsive** — single-column layouts on small screens, fluid grids on large ones.

---

## 9. API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET | `/api/stories` | Story summaries (id, title, concept, difficulty, XP, moral) |
| GET | `/api/stories/:id` | Full story content |
| GET | `/api/sessions` | Recent session records (with story titles) |
| POST | `/api/sessions` | Record `{ storyId, event, xp, firstTry, passed, learnerName }` |

---

## 10. Running the module

```bash
npm run installAll
npm run seed
npm run dev
```

Frontend: http://localhost:5173 · API: http://localhost:5000/api

---

## 11. Future roadmap

Aligned with PyBe's V0→V3 vision:

- **V0 (done here):** story-driven flow, riddle checkpoint, reflection, 25-tale library, deterministic practice, progress.
- **V1:** expand the content library further (strings, dictionaries, while/validation, lists of dicts); richer learner interaction logging.
- **V2:** a TinyLLM / rule-based hybrid that adapts Betaal's riddles to learner misconceptions (per PyBe's roadmap, still runnable locally).
- **V3:** adaptive difficulty, persistent learner profiles, gamified leaderboards, community-built tales.

### Design principles for future tales

1. Begin with a relatable fable; keep it short (3–4 pages).
2. Betaal's riddle must test *structure*, not recall.
3. Reveal the concept only after reasoning.
4. Keep the micro-lesson to one idea and three points.
5. Practice must start from working code and ask for one change.
6. Every tale ends with a small, practical build.

---

<p align="center">
  <strong>Part of the PyBe platform — Python, By Experience.</strong><br/>
  Submission by Namrata Saha · SummerShip 2026
</p>
