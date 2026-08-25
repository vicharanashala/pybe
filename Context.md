# 🧠 PyBe — Context & Architecture Reference

> **Complete developer context, system architecture, data models, state flow, and design specifications for the PyBe Interactive Debugging Platform.**

---

## 1. Project Context & Philosophy

**PyBe** is a gamified, story-driven web application designed to teach Python exception handling through 10 fairy-tale analogies. The fundamental philosophy is **Narrative-to-Code Mapping**: every plot event in a classic story corresponds 1-to-1 with a specific Python control-flow statement or exception mechanism (`try`, `except`, `else`, `finally`, `raise`).

Learners progress through a **9-Stage Curriculum** for each story, requiring them to explore, step through, visualize, answer, order, and generate code before unlocking subsequent stories.

---

## 2. High-Level System Architecture

```
                                    ┌────────────────────────┐
                                    │      index.html        │
                                    └───────────┬────────────┘
                                                │
                                    ┌───────────▼────────────┐
                                    │        main.jsx        │
                                    └───────────┬────────────┘
                                                │
                                    ┌───────────▼────────────┐
                                    │  ExceptionStudio.jsx   │
                                    │ (Root State & Stepper) │
                                    └───────────┬────────────┘
                                                │
          ┌─────────────────────────────────────┴─────────────────────────────────────┐
          │                                                                           │
┌─────────▼──────────────┐                                                 ┌──────────▼─────────────┐
│  Page1Stories.jsx      │                                                 │  DebuggerSimulator     │
│  (Dashboard & Modal)   │                                                 │  (Stage 2: Stepper)    │
└─────────┬──────────────┘                                                 └──────────┬─────────────┘
          │                                                                           │
          ├── StoryCartoonBanner.jsx                                                  ├── ExecutionFlowchart.jsx (Stage 3)
          └── StepCartoonBadge.jsx                                                    ├── LineByLineGenerator.jsx (Stage 4)
                                                                                      ├── BugHunterGame.jsx (Stage 5)
                                                                                      ├── ConceptFlipCards.jsx (Stage 6)
                                                                                      ├── SentenceOrderingPuzzles.jsx (Stage 7)
                                                                                      ├── AIReasoningSandbox.jsx (Stage 8)
                                                                                      └── CustomStoryPlayground.jsx (Stage 9)
```

---

## 3. Core Data Structure: `EXCEPTION_STORIES`

All 10 stories are defined as structured JavaScript objects in `storyData.js` and imported into `ExceptionStudio.jsx`.

### Data Schema
```typescript
interface StoryData {
  id: string;                  // Unique key e.g. 'red_hood'
  title: string;               // Display title e.g. "1. Little Red Riding Hood..."
  tagline: string;             // Subtitle e.g. "Catching AttributeError..."
  icon: string;                // Emoji icon e.g. "🐺"
  pythonConcept: string;       // Primary concept e.g. "try ... except AttributeError"
  description: string;         // Full story narrative overview
  character: string;           // Hero character e.g. "Red Riding Hood"
  antagonist: string;          // Error trigger e.g. "Disguised Wolf"
  errorType: string;           // Exception class e.g. "AttributeError"
  variables: Record<string, any>; // Initial state variables for simulator
  animationState: {
    options: Array<{           // Simulator condition toggle options
      label: string;
      val: any;
      desc: string;
    }>;
  };
  sentenceMappings: Array<{    // Story sentence to code line mapping
    stepNumber: number;
    sentence: string;
    conceptTag: string;
    codeLine: string;
    explanation: string;
  }>;
  orderingPuzzle: Array<{      // Stage 7 drag-and-drop puzzle items
    id: string;
    text: string;
    correctAscending: number;
    pythonCode: string;
  }>;
  fillups: {                   // Stage 7 fill-in-the-blank quiz
    question: string;
    codeSnippet: string[];
    options: string[];
    answers: Record<string, string>;
  };
}
```

---

## 4. The 10 Story-to-Exception Matrix

| # | Story ID | Title | Exception / Concept | Core Analogy | Asset File |
|---|---|---|---|---|---|
| 1 | `red_hood` | Little Red Riding Hood | `AttributeError` | Calling missing `.bake_pastries()` method on Wolf | `red_hood.jpg` |
| 2 | `tortoise_hare` | Tortoise & Hare | `ZeroDivisionError` + `else` | Hare speed = 0 causes division by zero during nap | `tortoise_hare.jpg` |
| 3 | `goldilocks` | Goldilocks & 3 Bears | `IndexError / KeyError` | Accessing porridge bowl index 5 of 3-item list | `goldilocks.jpg` |
| 4 | `cried_wolf` | Boy Who Cried Wolf | `raise` + Custom Exceptions | Explicitly raising `ValueError` and `WolfAlarmError` | `cried_wolf.jpg` |
| 5 | `three_pigs` | Three Little Pigs | `finally` Cleanup | Guaranteeing site locking no matter if house collapses | `three_pigs.jpg` |
| 6 | `hansel_gretel` | Hansel & Gretel | `FileNotFoundError` | Birds ate breadcrumbs trail file → fallback to compass | `hansel_gretel.jpg` |
| 7 | `jack_beanstalk` | Jack & Beanstalk | `TypeError` | Adding string bean count `"5"` + int potion count `3` | `jack_beanstalk.jpg` |
| 8 | `aladdin_genie` | Aladdin & Genie | `PermissionError` | Requesting 5 wishes when Genie limit is 3 | `aladdin_genie.jpg` |
| 9 | `cinderella` | Cinderella | `TimeoutError` | Clock striking midnight XII 12:00 expires fairy magic | `cinderella.jpg` |
| 10 | `pied_piper` | Pied Piper of Hamelin | `MemoryError` | Allocating array for 10^12 rats at once | `pied_piper.jpg` |

---

## 5. 9-Stage Learning Workflow

Every story features a 9-stage progression managed by `ExceptionStudio.jsx`:

| Stage | Title | Icon | Key Component | Activity / Completion Criteria |
|---|---|---|---|---|
| 1 | Stories Dashboard | `BookOpen` | `Page1Stories.jsx` | Read story detail modal & launch debugger |
| 2 | Debugger Simulator | `Play` | `DebuggerSimulator.jsx` | Step through code execution line-by-line |
| 3 | Execution Flowchart | `Zap` | `ExecutionFlowchart.jsx` | Interact with try/except flow diagram |
| 4 | Code Generator | `Code2` | `LineByLineGenerator.jsx` | Inspect line explanations and annotations |
| 5 | Bug Hunter Game | `Trophy` | `BugHunterGame.jsx` | Score **≥ 80%** on story bug quiz |
| 6 | Concept Flip Cards | `Layers` | `ConceptFlipCards.jsx` | Flip all concept flashcards |
| 7 | Ordering & Fillups | `HelpCircle` | `SentenceOrderingPuzzles.jsx` | Arrange story sentences + complete fill-in-the-blank |
| 8 | AI Reasoning Sandbox | `Bot` | `AIReasoningSandbox.jsx` | Test custom scenario reasoning |
| 9 | Custom Story Playground | `Wand2` | `CustomStoryPlayground.jsx` | Create custom story → **Unlocks Next Story** |

---

## 6. Root State Architecture (`ExceptionStudio.jsx`)

```javascript
// State variables in ExceptionStudio component:
const [activeStage, setActiveStage] = useState(1);              // 1 to 9
const [activeStoryId, setActiveStoryId] = useState('red_hood'); // Current story slug
const [isModalOpen, setIsModalOpen] = useState(false);          // Story modal visibility

// Persistence Maps (synced with localStorage):
const [completedStagesMap, setCompletedStagesMap] = useState({});   // { storyId: [1, 2, 3] }
const [unlockedStagesMap, setUnlockedStagesMap] = useState({});    // { storyId: [1, 2] }
const [stageActivityDoneMap, setStageActivityDoneMap] = useState({});// { storyId: { 1: true } }
const [completedStories, setCompletedStories] = useState([]);       // ['red_hood', ...]
const [unlockedStories, setUnlockedStories] = useState(['red_hood']);// ['red_hood', 'tortoise_hare']
```

### Key Handlers & Lifecycle Rules

1. **`handleLoadDebugger(storyId)`**:
   Marks Stage 1 complete for `storyId`, unlocks Stage 2, and switches view to Stage 2.
2. **`handleActivityDone(stageId)`**:
   Records stage completion in state map. If `stageId === 9`, automatically triggers `unlockNextStory(activeStoryId)`.
3. **`unlockNextStory(storyId)`**:
   Adds `storyId` to `completedStories` and pushes the next story's ID into `unlockedStories`.
4. **Review Mode**:
   When a story is in `completedStories`, all 9 stages are automatically unlocked (`unlockedStages = [1..9]`) for unrestricted review.

---

## 7. Component Map & Architecture

### `Page1Stories.jsx`
- **Dashboard View**: Grid of 10 story cards showing cartoon illustrations, badges, concepts, and progress lock icons.
- **Detail Modal**: Full-height scrollable modal organized sequentially:
  - **Part 1**: Header illustration image (`StoryCartoonBanner`)
  - **Title & Metadata**: Title, error badge, concept tag, tagline
  - **Narrative Panels**: The Start, The Conflict, Python Exception Mapping
  - **Code Mapping**: `Story Sentences to Code Line Mapping` list with step cartoon badges (`StepCartoonBadge`)
  - **Action CTA**: "Open in Debugger Simulator" button

### `StoryCartoonBanner.jsx`
- Standalone banner renderer importing raster `.jpg` illustrations for all 10 stories.
- Supports modes: `both`, `imageOnly`, `illustrationOnly`.

### `StepCartoonBadge.jsx`
- Renders animated CSS emoji badges (`bounce`, `float`, `wiggle`, `pulse`) next to each code mapping step.

---

## 8. Styling Tokens & Design System (`styles.css`)

```css
/* Soft Pastel Color System */
--bg-main:        #FFFDF5; /* Warm White canvas */
--bg-secondary:   #F8FAFC; /* Soft Off-White */
--bg-card:        #FFFFFF; /* Pure White card background */
--yellow:         #FFF4C2; /* Soft Yellow accent */
--blue:           #DDEEFF; /* Sky Blue accent */
--mint:           #DDF8E8; /* Mint Green accent */
--lavender:       #E9E0FF; /* Soft Lavender accent */
--pink:           #FFE4EC; /* Rosy Pink accent */
--text-primary:   #2D3748; /* Primary dark text */
--text-heading:   #1E1B4B; /* Deep Indigo heading text */
--text-secondary: #6B7280; /* Secondary slate text */
--border:         #E8EAF0; /* Light pastel border */
--shadow-soft:    0 6px 18px rgba(0,0,0,0.07);

/* Micro-Animations */
@keyframes scb-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes scb-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes scb-wiggle { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-5deg); } 75% { transform: rotate(5deg); } }
@keyframes scb-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
```

---

## 9. File Directory Map

```
pybe/
├── README.md                 # Public documentation
├── product.md                # Product requirements document
├── Context.md                # Architectural reference (this document)
├── package.json              # Monorepo root script config
├── client/
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── main.jsx          # App root mount
│       ├── ExceptionStudio.jsx  # Main state orchestrator
│       ├── storyData.js      # Central story content database
│       ├── styles.css        # Global CSS & animations
│       ├── assets/           # 10 story raster images (red_hood.jpg ... pied_piper.jpg)
│       └── components/       # 12 React component files
└── server/                   # Express API backend base
```

---

<div align="center">

**PyBe Technical Architecture Document**
*Maintained for developers and AI pair programmers.*

</div>
