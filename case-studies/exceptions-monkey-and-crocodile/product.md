<h1 align="center">🐒 Story-Driven Lesson Engine</h1>

<p align="center">
  <strong>A feature of the PyBe platform.</strong><br/>
  <em>An interactive, story-first learning engine that teaches Python exception handling through the Panchatantra fable "The Monkey and the Crocodile" — the story builds the shape, the code fills it in.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Steps-12-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Macro_Stages-10-06B6D4?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Story_Beats-5-61DAFB?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Python_Keywords-5-F59E0B?style=for-the-badge" />
</p>

---

## Overview

Story-Driven Learning is an interactive lesson engine integrated into PyBe.

The engine teaches Python **exception handling** by first telling a complete story — the Panchatantra fable of the Monkey and the Crocodile — and then turning each story moment into one part of the five-piece Python pattern:

- **12 steps** guided by a 10-segment macro-stage progress bar
- Step types that move the learner from **story → reasoning → concept → code**
- An **interactive coding step** where the learner arranges the story by hand and watches it become a syntax-highlighted Python program
- A simulated **terminal run** that executes the assembled program line by line

The learner never starts with `try` or `except`. They start with a monkey, a crocodile, and a betrayal — the keywords arrive only after the story has already built the shape.

---

## 👥 Team Members

| Name                   | Email                                  | Contribution                                   |
| :--------------------- | :------------------------------------- | :--------------------------------------------- |
| Abhi Patel             | abhi.patel2k5@gmail.com                | Core design, bug fixing, story-concept mapping |
| Mohammed Avesh Karigar | mohammaavesh.btech2024@iujaipur.edu.in | Learning Framework, website flow, Main Story   |

## 📖 Table of Contents

1. [Pedagogical Framework &amp; Methodology](#-1-pedagogical-framework--methodology)
2. [Codebase Structure](#-2-codebase-structure)
3. [How the Lesson Is Designed](#-3-how-the-lesson-is-designed)
4. [Content Coverage](#-4-content-coverage)
5. [Adding New Steps (Content Integration)
   ](#-5-adding-new-steps-content-integration)

---

This document provides in-depth knowledge about the **Story-Driven Lesson** feature integrated into the base PyBe application. It covers the pedagogical methodology, the codebase structure, how the lesson is designed, and how to add new content.

---

## 🎓 1. Pedagogical Framework & Methodology

Lesson design draws on **five interconnected educational frameworks**, each governing a different dimension of the learning experience:

### 1. Narrative Mapping (The Story Bridge)

The core innovation of this feature: **the learner already knows this story.**

The fable is taught first, in plain words, with no code anywhere. Only then is each story beat attached to a purpose, and each purpose attached to a Python keyword:

| Story Beat           | Purpose                    | Python Pattern          |
| -------------------- | -------------------------- | ----------------------- |
| Wife's demand        | A problem named in advance | `class ... Exception` |
| The crossing         | A risky operation          | `try:`                |
| "I want your heart!" | A signal of failure        | `raise`               |
| The bluff            | A response to the signal   | `except`              |
| Return to the tree   | A guaranteed end point     | `finally:`            |

Because the story has an emotional arc, the pattern has a *felt shape*. Learners do not memorize keywords; they **recognize moments**.

### 2. SOLO Taxonomy (Structure of Observed Learning Outcomes)

The 12 steps are one continuous SOLO progression:

| SOLO Stage                  | Lesson Step                               | What the Learner Experiences                                                                                                              |
| --------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Prestructural**     | Story + Story Questions                   | *Feel the absence.* The wife names the problem before it exists — the learner feels why an exception class must be defined in advance. |
| **Unistructural**     | Associative Mapping                       | One isolated mechanic: each story beat connects to exactly one purpose.                                                                   |
| **Multistructural**   | Discovery + Retrieval                     | Three separate problems, each handled by its own specific response.                                                                       |
| **Relational**        | Mental Model + Interactive Coding         | The five beats combine into one complete program; the drag-and-drop timeline*breaks* unless the parts are ordered correctly.            |
| **Extended Abstract** | Syntax + Assessment + Reveal + Reflection | Learners read the full pattern, prove it, and then transfer it:*"What other situations in life follow this pattern?"*                   |

### 3. Kolb's Experiential Learning Cycle

Each macro stage implements a complete Kolb cycle:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Concrete Experience (abstract)                            │
│   └──▶ The story beat retold in plain English               │
│                                                             │
│   Reflective Observation                                    │
│   └──▶ Discovery questions that nudge without giving answers│
│                                                             │
│   Abstract Conceptualisation                                │
│   └──▶ Mental model: keyword ↔ story moment pigeonholes     │
│                                                             │
│   Active Experimentation                                    │
│   └──▶ Arranging the story cards and running the program    │
│                                                             │
│   Concrete Experience (concrete)                            │
│   └──▶ Watching the code execute line by line in a terminal │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4. Vygotsky's Zone of Proximal Development (ZPD)

The **step types** implement scaffolded learning that fades support:

- **Story + Questions:** Maximum scaffolding — the whole fable is given, MCQ options are in plain English, every wrong answer carries an explanation
- **Computational Thinking:** Guided practice — associative mapping, Socratic discovery, then timed retrieval
- **Interactive Coding:** Minimum scaffolding — the learner builds the program from the story alone, with teaching feedback only when the order is wrong
- **Syntax → Assessment → Reveal:** Consolidation — read the full pattern, prove understanding, then receive the legend

This mirrors Vygotsky's principle of *"guided practice with fading support"*: the conceptual heavy lifting is done by the story; the coding step is pure retrieval.

### 5. Cognitive Load Theory

The lesson is designed with strict rules to manage cognitive load:

- **One keyword per concept block** — syntax blocks appear one at a time, each motivated by a single story line
- **Plain English first** — no Python syntax appears until Step 6, after the learner has already committed to the correct logical approach
- **Progressive disclosure** — `class ... Exception` → `try:` → `raise` → `except` → `finally:` are revealed in exactly the order the story needs them
- **Inline corrections** (coding step) — a wrong order gets a quick teaching message, not a heavy redirect
- **Low-load interactions** — cards are clickable *or* draggable; the check button gives one clear teaching message at a time

### 6. Constructivism (Piaget)

- Learners **build** the program themselves by arranging the story — the code is constructed, not transmitted
- **The Reveal** is the constructivist pay-off: learners discover they already knew the structure; it just has different words now
- Reflective prompts are Socratic and open-ended (*"What other situations in life follow this pattern…?"*)
- The lesson never tells a learner they're wrong without showing *why* in story terms

---

## 🗂️ 2. Codebase Structure

To keep the base PyBe app (`main.jsx`) clean, the learning feature is entirely modularized inside `client/src/lesson/`. The lesson is **self-contained** — it needs no server endpoints, no database, no build steps beyond Vite.

### Project Tree Structure

```text
pybe/
├── .gitignore
├── README.md
├── WIKI.md
├── Product.md
├── package.json
├── package-lock.json
├── pypanchatantra.html          ← Original standalone lesson (feature source)
├── client/
│   ├── index.html               ← Fonts (Inter, JetBrains Mono) + lesson title
│   ├── package.json
│   ├── package-lock.json
│   └── src/
│       ├── main.jsx             ← Router: / = base PyBe app, /learn = lesson
│       ├── styles.css           ← Base app styles (unchanged)
│       └── lesson/
│           ├── lessonData.js    ← All lesson content (12 steps, beats, labels)
│           ├── lesson.css       ← The lesson design system
│           ├── highlight.jsx    ← Python syntax tokenizer
│           ├── LessonPage.jsx   ← Engine + shell + navigation
│           ├── StepViews.jsx    ← Renderers for all step types
│           └── CodingStep.jsx   ← Drag-and-drop timeline + code mirror + terminal
└── server/                      ← Base PyBe API (unchanged)
    ├── .env.example
    ├── package.json
    └── src/
        ├── index.js
        ├── seed.js
        ├── routes/
        ├── services/
        └── data/
```

### Frontend (`client/src/lesson/`)

| File                         | Responsibility                                                                                                                                                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`lessonData.js`**  | The data layer:`LESSON_STEPS` (all 12 steps), `STORY_BEATS`, `BEAT_KEYWORDS`, `MACRO_STAGE_LABELS`, `CT_SUBSTEP_LABELS`. Extracted verbatim from `pypanchatantra.html`.                                                              |
| **`lesson.css`**     | The exact design system of the lesson: Inter/JetBrains Mono typography, blue accent, macOS-style code windows, timeline slots, terminal, animations. Scoped under`.pb-lesson` / `.pb-page`.                                                  |
| **`highlight.jsx`**  | Tokenizes Python into keyword/string/comment/number/class/function spans for the live code mirror (port of the HTML's tokenizer).                                                                                                                |
| **`LessonPage.jsx`** | The engine and shell: step index, completion map, saved responses, 10-segment progress bar, Back / Next controls, and the per-step-type dispatch.                                                                                                |
| **`StepViews.jsx`**  | One renderer per step type: story, question, mapping-visual, discovery, retrieval-activity, mental-model, syntax, assessment, reveal, reflection. All interaction states restore when navigating back.                                           |
| **`CodingStep.jsx`** | The interactive coding exercise: HTML5 drag-and-drop story cards, five timeline slots, a live code mirror with line numbers, check-order feedback with teaching messages, a simulated terminal with line-by-line execution animation, and reset. |

### Data Model (`lessonData.js`)

The entire lesson is a flat list of step objects:

```
LESSON_STEPS[]
└── Step
    ├── id              (e.g. "interactive-coding")
    ├── type            (one of 11 step types)
    ├── macroIndex      (0–9 → progress bar segment)
    ├── eyebrow         (UPPERCASE small label)
    ├── title           (step heading)
    ├── ctIndex         (0–2 → Computational Thinking subtick, optional)
    └── type-specific fields
        ├── story: paragraphs[]
        ├── question: prompt, options[], correctIndex, wrongExplanations[], explanation
        ├── mapping-visual: pairs[], closingLine
        ├── discovery: intro, questions[] { prompt, options[], correctIndex, followUp }
        ├── retrieval-activity: instructions, rightChoices[], rounds[] { ask, correct, wrongDirection }, completionLine
        ├── mental-model: paragraphs[], visualBoxes[] { label, value }
        ├── coding: instructions, filename, storyEvents[] { id, story, code, lineFrom, lineTo }, expectedOutput
        ├── syntax: codeBlocks[] { label, motivation, code }
        ├── assessment: questions[] { prompt, options[], correctIndex, explanation }
        ├── reveal: mapPairs[], code, legendPairs[], closingLine
        └── reflection: paragraphs[], prompts[]
```

---

## 📐 3. How the Lesson Is Designed

### The 10 Macro Stages

The 12 steps run through the same pedagogical engine:

```
┌──────────────────────────────────────────────────────────────────┐
│  STAGE 1  Story (Plain English)                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  The full fable retold — no code anywhere                   │ │
│  │  └─▶ Story Question: what did the demand introduce?         │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                       ▼                                          │
│  STAGE 2  Computational Thinking                               │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Associative Mapping  → beat animates onto its purpose      │ │
│  │  Discovery Questions  → Socratic MCQs with follow-ups       │ │
│  │  Retrieval Activity   → timed rounds, match beat to purpose │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                       ▼                                          │
│  STAGE 3  Concept Discovery → The five moments have names       │
│                       ▼                                          │
│  STAGE 4  Mental Model → keyword ↔ story pigeonholes           │
│                       ▼                                          │
│  STAGE 5  Interactive Coding                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Drag story cards into the timeline slots                   │ │
│  │  → each card becomes a highlighted Python block             │ │
│  │  ✓ Check Order → teaching message on first wrong beat       │ │
│  │  ▶ Run → terminal executes the program line by line         │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                       ▼                                          │
│  STAGE 6  Python Syntax → five blocks, five story motivations  │
│                       ▼                                          │
│  STAGE 7  Assessment → three MCQs                              │
│                       ▼                                          │
│  STAGE 8  The Reveal → legend: story moment → keyword          │
│                       ▼                                          │
│  STAGE 9  Reflection → two open-ended prompts                  │
└──────────────────────────────────────────────────────────────────┘
```

### Step Design Principles

1. **One keyword per concept** — syntax blocks each carry exactly one story motivation
2. **Plain English first** — no Python syntax appears before Step 6
3. **Story-faithful MCQs** — every option maps to a story moment, and every wrong option has a story-based explanation (*"Would the monkey's bluff about the Jamun tree fool a tiger?"*)
4. **Consistent completion gating** — the Continue button only unlocks when the current step is complete; auto-complete types (story, mapping, reveal, mental model, syntax) unlock immediately
5. **Restorable progress** — answers, retrieval rounds, timeline placement, and reflection text all restore when navigating back

### Interactive Coding Design

The coding step (Step 8) follows the HTML's exact interaction model:

- **Story cards** are color-coded per beat (`--s1`…`--s5`) and can be dragged or clicked into the first empty slot
- **Filled slots** are clickable to return the card to the source grid
- **The code mirror** mirrors the slot order with global line numbers and FLIP animation on reorder
- **Check Order** compares against the story timeline: correct slots turn green, the first wrong slot shakes red, the offending code block is highlighted, and a teaching message explains the ordering rule (*"Programming executes from top to bottom."*)
- **Run** animates execution line by line, appending to a simulated bash terminal (`$ python crocodile_river.py` → output → `Process finished with exit code 0`)

---

## 📊 4. Content Coverage

### The Monkey and the Crocodile · Exception Handling — 12 Steps

| Step | Macro Stage            | Title                                     | Type                   | Content                                                   |
| ---- | ---------------------- | ----------------------------------------- | ---------------------- | --------------------------------------------------------- |
| 1    | Story                  | The Monkey and the Crocodile              | `story`              | Six paragraphs, the complete fable                        |
| 2    | Story Questions        | Before We Continue...                     | `question`           | What did the wife's demand introduce?                     |
| 3    | Computational Thinking | Story Beats → Their Purpose              | `mapping-visual`     | 5 beats mapped to 5 purposes                              |
| 4    | Computational Thinking | Think It Through                          | `discovery`          | Signal → response, specific handlers, guarantees         |
| 5    | Computational Thinking | Quick Recall                              | `retrieval-activity` | 3 timed rounds                                            |
| 6    | Concept Discovery      | The Same Shape                            | `story`              | Storytellers and programmers need the same 5-part pattern |
| 7    | Mental Model           | Exception as a Signal                     | `mental-model`       | 5 pigeonholes: keyword ↔ story moment                    |
| 8    | Interactive Coding     | Arrange the Story → Watch it Become Code | `coding`             | 5 story cards →`crocodile_river.py`                    |
| 9    | Python Syntax          | Every Operation Has a Story               | `syntax`             | 5 blocks with motivations                                 |
| 10   | Assessment             | Check Your Understanding                  | `assessment`         | `raise`, `finally`, custom exceptions                 |
| 11   | The Reveal             | Exception Handling in Python              | `reveal`             | Beat→keyword map, full program, legend                   |
| 12   | Reflection             | Think Back Over the Journey               | `reflection`         | 2 open-ended prompts                                      |

### The Five-Beat Pattern

| Level | Story Beat           | Purpose                    | Python                  |
| ----- | -------------------- | -------------------------- | ----------------------- |
| 1     | Wife's demand        | A problem named in advance | `class ... Exception` |
| 2     | The crossing         | A risky operation          | `try:`                |
| 3     | "I want your heart!" | A signal of failure        | `raise`               |
| 4     | The bluff            | A response to the signal   | `except`              |
| 5     | Return to the tree   | A guaranteed end point     | `finally:`            |

The program the learner assembles:

```python
class BetrayalError(Exception):
    pass

try:
    cross_river()
except BetrayalError:
    print("My heart is on the Jamun tree!")
finally:
    print("Back to safety.")
```

---

## 📝 5. Adding New Steps (Content Integration)

The lesson is designed to be **content-extensible**. You do not need to modify any React UI code to add new steps — the entire engine is data-driven via `LESSON_STEPS` in `client/src/lesson/lessonData.js`.

To add a new step:

1. **Choose the step type** that matches the pedagogical move (story, question, discovery, coding, …)
2. **Set `macroIndex`** (0–9) to the macro stage it belongs to — the progress bar updates automatically
3. **Append the step object** to `LESSON_STEPS` following this schema:

```js
{
  id: "story-extra",
  type: "story",
  macroIndex: 0,
  eyebrow: "A Panchatantra Fable",
  title: "A New Scene",
  paragraphs: [
    "Once more the monkey sat on the jamun tree..."
  ]
}
```

A question step:

```js
{
  id: "question-extra",
  type: "question",
  macroIndex: 1,
  eyebrow: "Story Questions",
  title: "Before We Continue...",
  prompt: "Why does sending a signal matter?",
  options: [
    "Because the monkey needed to know what went wrong so he could respond",
    "Because the crocodile wanted to feel better about his choice"
  ],
  correctIndex: 0,
  wrongExplanations: [
    null,
    "A signal isn't about the sender's feelings, it's about communication..."
  ],
  explanation: "Exactly. A silent failure gives no information about what went wrong."
}
```

### Pedagogical Rules for New Steps

| Step Type                             | Design Rule                                                                  |
| ------------------------------------- | ---------------------------------------------------------------------------- |
| `story`                             | Let them**feel the absence** of the concept — no code, no keywords    |
| `question`                          | Plain-English options, each wrong option has a story-based explanation       |
| `discovery`                         | Socratic prompts that nudge without stating the answer                       |
| `mapping-visual` / `mental-model` | One beat ↔ one purpose, never two concepts simultaneously                   |
| `coding`                            | The cards ARE the code — every story event carries exactly one Python block |
| `assessment`                        | Every question must be answerable purely from the story + revealed syntax    |
| `reflection`                        | Open-ended transfer prompts: find the pattern in your own life               |

New step *types* follow the same pattern as the renderers in `StepViews.jsx` — add a component and one line in the `LessonPage.jsx` dispatch switch.

---

<p align="center">
  <strong>Part of the PyBe platform Python, By Experience.</strong>
</p>
