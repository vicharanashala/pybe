# 📋 PyBe — Product Document

> **"Turn exception handling nightmares into storybook adventures."**

---

## 1. Product Vision

**PyBe** is an interactive, gamified educational platform that teaches Python exception handling through 10 fairy-tale stories. It transforms abstract programming concepts — `try`, `except`, `else`, `finally`, `raise` — into vivid narrative moments that learners can see, feel, and play through.

### Mission Statement
> Make Python exception handling intuitive, memorable, and genuinely enjoyable for every beginner and intermediate programmer — by grounding it in stories they already know and love.

### Core Problem
Exception handling is one of the most skipped and misunderstood concepts in Python. Traditional tutorials present dry syntax and documentation, leaving learners unsure of *when* or *why* to use try/except in real scenarios. They read the syntax but can't *feel* the concept.

### Solution
PyBe maps each Python exception to a critical moment in a beloved fairy tale — making the error not just understandable, but emotionally resonant. When Cinderella's spell expires at midnight, learners *feel* what `TimeoutError` means. When Goldilocks grabs bowl `[5]` from a 3-item list, `IndexError` clicks instantly.

---

## 2. Target Audience

| Audience | Profile | Use Case |
|---|---|---|
| **Primary** | Python beginners (ages 14–25) | First exposure to exception handling |
| **Secondary** | CS educators & coding bootcamps | Classroom supplement and homework |
| **Tertiary** | Self-taught developers | Filling gaps in error-handling knowledge |

### Learner Personas

**🧑‍🎓 Alex, 17 — High School CS Student**
- Learning Python for the first time
- Gets lost when reading Python docs on exceptions
- Loves games and storytelling
- Goal: Pass AP CS exam and understand real error handling

**👩‍💻 Priya, 24 — Bootcamp Graduate**
- Knows basic Python but her code crashes unexpectedly
- Frustrated by cryptic error messages she can't diagnose
- Goal: Write robust, production-ready exception handling

**🧑‍🏫 Mr. Chen, 38 — Secondary School CS Teacher**
- Teaching Python to a class of 30 students
- Needs engaging material that keeps students focused
- Goal: Use PyBe as a gamified supplement to traditional lessons

---

## 3. Core User Journey

```
User lands on PyBe
        │
        ▼
┌─────────────────────────────────────────────────────┐
│  STORY DASHBOARD (Stage 1)                          │
│  • Browse 10 story cards (1 unlocked initially)     │
│  • See illustration + error badge + Python concept  │
│  • Click card → open Story Detail Modal             │
│    ┌─────────────────────────────────────────────┐  │
│    │ STORY DETAIL MODAL                          │  │
│    │  Part 1: Header illustration image          │  │
│    │  Narrative: The Start → Conflict → Mapping  │  │
│    │  Code line mapping per story sentence        │  │
│    │  CTA: "Open in Debugger Simulator" →         │  │
│    └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
        │ (user clicks "Open in Debugger Simulator")
        ▼
┌─────────────────────────────────────────────────────┐
│  STAGE 2: Debugger Simulator                        │
│  • Step through code line-by-line                   │
│  • Toggle error conditions (e.g. wolf vs grandma)   │
│  • See variable values change in real-time          │
│  • Observe which except branch fires                │
└─────────────────────────────────────────────────────┘
        │ (activity complete → "Next Stage" unlocks)
        ▼
┌─────────────────────────────────────────────────────┐
│  STAGE 3: Execution Flowchart                       │
│  • Visual node-graph of try/except flow paths       │
│  • Color-coded: success path vs error path          │
└─────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────┐
│  STAGE 4: Line-by-Line Generator                    │
│  • Every code line explained individually           │
│  • Plain English annotation per line                │
└─────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────┐
│  STAGE 5: Bug Hunter Game                           │
│  • Multiple-choice bug-fixing quiz                  │
│  • Must score ≥ 80% to pass this stage              │
│  • Immediate feedback and explanation per answer    │
└─────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────┐
│  STAGE 6: Concept Flip Cards                        │
│  • Spaced-repetition flash cards per story concept  │
│  • Flip to reveal Python code example               │
│  • Flip all cards to mark stage complete            │
└─────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────┐
│  STAGE 7: Sentence Ordering Puzzles                 │
│  • Drag-and-drop narrative sentences into order     │
│  • Each sentence maps to a Python code block        │
│  • Fill-in-the-blank keyword challenges             │
└─────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────┐
│  STAGE 8: AI Reasoning Sandbox                      │
│  • Generate custom exception scenarios              │
│  • Experiment with edge cases and outputs           │
└─────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────┐
│  STAGE 9: Custom Story Playground                   │
│  • Build a custom exception story                   │
│  • Write code and tie it to narrative moments       │
│  • Completing this unlocks the NEXT story           │
└─────────────────────────────────────────────────────┘
        │ (story complete)
        ▼
   Next Story Unlocked 🎉 → Repeat with Story 2
```

---

## 4. Feature Specifications

### 4.1 Story Dashboard

| Feature | Description |
|---|---|
| **10 Story Cards** | Grid layout of all 10 stories with illustration, icon, title, error type badge, and Python concept tag |
| **Lock/Unlock States** | Locked stories show 🔒; unlocked show full detail; completed show ✅ |
| **Story Detail Modal** | Full-screen modal with Part 1 (illustration image), story metadata block, Full Story narrative, and Story Sentences to Code Line Mapping section |
| **Animated Illustrations** | Every card features an animated cartoon banner image matching the story theme |
| **Step Cartoon Badges** | Each sentence-to-code mapping card has a themed animated emoji badge |
| **Floating Close Button** | Floating close (✕) button fixed at the top-right of every modal |

### 4.2 Stage Navigation

| Feature | Description |
|---|---|
| **Sequential Stage Gate** | Each stage is locked until the previous one is completed |
| **Stage Stepper Bar** | Persistent top bar shows all 9 stages with ✓ / 🔒 / active states |
| **Completion Popup** | Celebration popup appears when a stage is marked complete |
| **Review Mode** | Completed stories allow free navigation between all stages without restrictions |
| **Progress Persistence** | All progress saved to `localStorage` — survives page refresh |
| **Next Story Unlock** | Completing Stage 9 (Playground) of a story unlocks the next story on the dashboard |

### 4.3 Debugger Simulator (Stage 2)

| Feature | Description |
|---|---|
| **Line-by-line stepper** | Step forward through code one line at a time |
| **Condition toggle** | Switch between error-triggering and success scenarios |
| **Variable inspector** | Live variable state panel showing values at each step |
| **Exception highlight** | Highlights the exact line where exception occurs |
| **Branch visualization** | Shows which except/else/finally branch was taken |

### 4.4 Bug Hunter Game (Stage 5)

| Feature | Description |
|---|---|
| **Multiple-choice questions** | 4 options per question, story-specific bug scenarios |
| **Score tracking** | Real-time score display during the quiz |
| **80% pass gate** | Must score ≥ 80% to mark stage complete and unlock next |
| **Instant feedback** | Correct/wrong feedback with full explanation per answer |
| **Retry support** | Can retry the game to improve score |

### 4.5 Custom Story Playground (Stage 9)

| Feature | Description |
|---|---|
| **Story creator** | Build a custom narrative with your own characters and exception |
| **Code binding** | Tie each story moment to a Python code snippet |
| **Live preview** | Preview your story card and code mapping |
| **Submission** | Completing a custom story marks the current story as fully done |

---

## 5. The 10 Learning Modules

| # | Story | Python Exception | Key Concept |
|---|---|---|---|
| 1 | 🐺 Little Red Riding Hood | `AttributeError` | Calling a method that doesn't exist on an object |
| 2 | 🐢 Tortoise & The Hare | `ZeroDivisionError` | Division by zero + `else` block runs on success |
| 3 | 🥣 Goldilocks & Three Bears | `IndexError / KeyError` | Out-of-bounds list access and missing dictionary keys |
| 4 | 📯 The Boy Who Cried Wolf | `raise` + Custom Exceptions | Manually triggering exceptions + defining custom error classes |
| 5 | 🐷 The Three Little Pigs | `finally` | Guaranteed cleanup block — always executes |
| 6 | 🍞 Hansel & Gretel | `FileNotFoundError` | Missing file handling and fallback strategies |
| 7 | 🫘 Jack & The Beanstalk | `TypeError` | Data type mismatch when mixing `str` and `int` |
| 8 | 🧞 Aladdin & The Genie | `PermissionError` | Forbidden access violation + `AssertionError` |
| 9 | 👠 Cinderella | `TimeoutError` | Time-bound operations and spell expiry patterns |
| 10 | 🪈 Pied Piper of Hamelin | `MemoryError / OverflowError` | System resource exhaustion and batch fallback strategies |

---

## 6. State Management Model

```
ExceptionStudio (root state owner)
│
├── completedStagesMap     { storyId: [1, 2, 3, ...] }   ← persisted in localStorage
├── unlockedStagesMap      { storyId: [1, 2, 3, ...] }   ← persisted in localStorage
├── stageActivityDoneMap   { storyId: { 1: true, ... } } ← persisted in localStorage
├── completedStories       ['red_hood', 'tortoise_hare', ...]
├── unlockedStories        ['red_hood']  ← grows as stories are completed
│
├── activeStoryId          (currently selected story)
├── activeStage            (1–9, current stage tab)
└── storyConditions        { storyId: conditionValue } ← controls debugger scenario
```

**Progression rules:**
- `Stage N` can only be accessed if `Stage N-1` is in `completedStages`
- A stage enters `completedStages` only when its activity is done (e.g. score ≥ 80% in Bug Hunter)
- `Story N+1` unlocks only when `Stage 9` (Playground) of `Story N` is completed
- Completed stories enter **Review Mode** — all stages unlocked freely

---

## 7. Visual Design System

| Element | Design Decision | Rationale |
|---|---|---|
| **Color Palette** | Soft Pastel Light Theme (Warm White `#FFFDF5`, Soft Lavender `#F5F0FF`, Rosy Pink `#FFF0F6`, Sky Blue `#E0F2FE`, Mint `#E8FFF6`) with high-contrast dark text (`#1E1B4B`, `#0C3B6E`, `#0F172A`) | Storybook-inspired, magical light theme; reduces eye strain and provides optimal readability for long study sessions |
| **Typography** | System UI / Inter — clean, highly legible, dark bold headings | Optimized for code readability and narrative clarity |
| **Cards** | Pure White & Soft Pastel Cards with light borders and subtle shadows | Soft, friendly, elegant feel without visual clutter |
| **Animations** | CSS keyframes: `bounce`, `float`, `wiggle`, `pulse`, `dash` | Keeps learners engaged; communicates state changes |
| **Story Themes** | Each story has a unique soft pastel accent badge (red, green, amber, purple…) | Instant visual recognition between stories |
| **Illustrations** | High-quality JPG cartoon art + animated SVG banners | Bridges the narrative to visual memory |
| **Story-specific glow** | `.story-theme-red_hood`, `.story-theme-goldilocks`, etc. | Consistent per-story theming throughout all stages |

---

## 8. Success Metrics

### Learning Outcomes
- Learner can correctly identify which Python exception to use in 10 common scenarios
- Learner can write a complete `try / except / else / finally` block from scratch
- Learner can define and raise a custom exception class

### Engagement Metrics
| Metric | Target |
|---|---|
| Stories completed per session | ≥ 2 |
| Stage completion rate | ≥ 85% of started stages |
| Bug Hunter pass rate (1st attempt) | ≥ 70% of users |
| Time on platform per session | ≥ 15 minutes |
| Return rate (Day 7) | ≥ 40% |

### Quality Gates
| Gate | Threshold |
|---|---|
| Bug Hunter Game | Must score **≥ 80%** to unlock next stage |
| Stage 9 Playground | Must submit a custom story to unlock next fairy tale |
| Story Unlock | Strict sequential — no skipping |

---

## 9. Technical Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT (React + Vite)                       │
│                                                                 │
│  main.jsx                                                       │
│    └── ExceptionStudio.jsx   [State Orchestrator]               │
│          ├── Page1Stories.jsx         Stage 1: Dashboard        │
│          │    ├── StoryCartoonBanner.jsx  Illustration renderer  │
│          │    └── StepCartoonBadge.jsx    Step badge system      │
│          ├── DebuggerSimulator.jsx    Stage 2: Debugger         │
│          ├── ExecutionFlowchart.jsx   Stage 3: Flow graph       │
│          ├── LineByLineGenerator.jsx  Stage 4: Line explainer   │
│          ├── BugHunterGame.jsx        Stage 5: Quiz game        │
│          ├── ConceptFlipCards.jsx     Stage 6: Flash cards      │
│          ├── SentenceOrderingPuzzles  Stage 7: Drag puzzle      │
│          ├── AIReasoningSandbox.jsx   Stage 8: AI sandbox       │
│          ├── CustomStoryModal.jsx     Stage 9: Story creator    │
│          └── CustomStoryPlayground.jsx   Custom stage builder   │
│                                                                 │
│  storyData.js   [All content: narratives, questions, mappings]  │
│  styles.css     [Animations, themes, glassmorphism layout]      │
│  assets/        [10 story raster JPG illustration images]         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP API (future)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SERVER (Node.js + Express)                    │
│  API routes, middleware, user session management (planned)      │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow
- **`storyData.js`** is the single source of truth for all story content (narratives, sentence mappings, bug hunter questions, AI prompts, custom story templates)
- **`ExceptionStudio.jsx`** is the root state owner — child components receive story/stage data via props and report completion via `onActivityDone` callbacks
- **`localStorage`** persists progress across sessions (no backend auth required for MVP)

---

## 10. Content Data Model

```js
// Each story in EXCEPTION_STORIES follows this shape:
{
  id: 'red_hood',              // unique slug
  title: '1. Story Title',
  tagline: 'Short description of exception',
  icon: '🐺',
  pythonConcept: 'try...except AttributeError',
  description: '...',          // full story description
  errorType: 'AttributeError',
  character: 'Red Riding Hood',
  antagonist: 'Disguised Wolf',
  animationState: {
    options: [
      { label, val, desc }     // interactive condition toggles
    ]
  },
  sentenceMappings: [
    {
      stepNumber: 1,
      sentence: 'Story narrative sentence...',
      codeLine: 'try:',
      conceptTag: 'TRY BLOCK START',
      explanation: 'Why this code maps here'
    }
  ],
  orderingPuzzle: [...],       // drag-and-drop puzzle items
  fillups: {                   // fill-in-the-blank exercise
    question, codeSnippet, options, answers
  }
}
```

---

## 11. Roadmap

### ✅ MVP (Completed)
- [x] 10 story cards with animated cartoon illustrations
- [x] Story detail modal with narrative + code mapping
- [x] All 9 interactive learning stages
- [x] Sequential stage-gating and story unlocking
- [x] LocalStorage progress persistence
- [x] Custom story playground (Stage 9)
- [x] Bug Hunter Game with ≥ 80% completion gate

### 🔜 Phase 2 — User Accounts & Persistence
- [ ] User authentication (email / Google OAuth)
- [ ] Cloud-synced progress (MongoDB)
- [ ] Global leaderboard by story completion speed
- [ ] Shareable custom stories (public URL)
- [ ] Teacher dashboard with class progress view

### 🔮 Phase 3 — Content Expansion
- [ ] 10 additional stories covering: `ValueError`, `RecursionError`, `StopIteration`, `RuntimeError`, `ConnectionError`, `NotImplementedError`, `ArithmeticError`, `AssertionError`, `NameError`, `OSError`
- [ ] Python 3.11+ `ExceptionGroup` and `except*` chapters
- [ ] Audio narration mode for accessibility
- [ ] Dark / Light theme toggle
- [ ] Mobile-optimized responsive layout

### 🚀 Phase 4 — AI Features
- [ ] AI-powered hint system (context-aware tips per stage)
- [ ] AI custom story generator from user-provided prompt
- [ ] Natural language question answering about each exception
- [ ] Adaptive difficulty — harder bug hunter questions based on accuracy

---

## 12. Non-Goals (Out of Scope)

The following are **explicitly not in scope** for the current version:
- General Python programming tutorial (PyBe focuses *exclusively* on exception handling)
- IDE integration or code execution in the browser (no REPL runtime)
- Certificate or assessment grading system
- Multi-language support (currently English only)
- Mobile native app (web only for MVP)

---

## 13. Glossary

| Term | Definition |
|---|---|
| **Stage** | One of 9 sequential learning activities per story |
| **Stage Gate** | Completion requirement that must be met to unlock the next stage |
| **Review Mode** | Mode entered after completing all 9 stages of a story — all stages freely accessible |
| **Condition Toggle** | Interactive switch in the Debugger Simulator that changes the runtime scenario (e.g. wolf vs. grandma) |
| **Story Unlock** | When a story becomes accessible to the learner after completing the previous one |
| **Activity Done** | Signal sent from a child component to `ExceptionStudio` indicating the user has satisfied the completion requirement for a stage |

---

<div align="center">

**PyBe Product Document v1.0**
*Last updated: August 2026*

*Built to make Python exception handling unforgettable.*

</div>
