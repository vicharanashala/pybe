# PyKatha

> **Think the Story. Discover the Code.**

PyKatha is a story-driven way to learn beginner **Python control flow** (`if`, `while`, `for`). A learner reads an original fable, answers reasoning questions about it, discovers the hidden programming logic inside the tale, and practises the matching Python — all inside a calm, warm, storybook-style interface.

This README explains **what** PyKatha is, **why** it teaches this way, and **how** it is built, so a mentor, reviewer, or future contributor can pick it up without a verbal walkthrough.

---

## 1. The Problem

Conventional beginner Python tutorials usually start with **syntax**:

```
if ...:
for ... in ...:
while ...:
```

The learner is told *what each keyword means* and asked to do drills. This can produce learners who can recognise `for` on a page but have little idea **when** or **why** to reach for it — they memorised the shape of the code without building a model of the behaviour it describes.

Other tutorials start with an arbitrary exercise ("write a program that …") that has no conceptual or emotional hook, so nothing sticks.

PyKatha's problem statement:

> Help a total beginner understand the **idea** behind a control-flow construct — *before* they ever see its syntax.

## 2. The Learning Philosophy

PyKatha reverses the conventional order. Instead of **syntax first, meaning later**, it offers:

```
Experience first  →  Reasoning second  →  Syntax third
```

- The story is the **experience** — a situation written with no Python in it.
- The Thinking Challenge forces the learner to **reason** about what happened, what repeated, and under what condition.
- Only after that is Python **revealed** — not as a lecture, but as the "secret behind the story": a translation of a conclusion the learner already reached.

The method is deliberately not "stories make Python fun". The actual cognitive pipeline is:

```
Scenario                     (a situation: the rabbit must cross the river)
  ↓
Observation                  (what is happening? who acts, and when?)
  ↓
Thinking Challenge           (recall + reason WITHOUT the story on screen)
  ↓
Pattern Recognition          (what repeats? what changes? what stays the same?
                              what condition controls the action?)
  ↓
Logic Discovery              (condition → decision / repetition / iteration)
  ↓
Python Concept               (which programming structure represents that logic?)
  ↓
Python Syntax                (what does it look like in Python?)
  ↓
Practice                     (reconstruct the code yourself)
  ↓
Reflection                   (the moral: what did you learn?)
```

Each story follows this exact pipeline. **docs/CASE_STUDIES.md** walks through all three stories stage by stage.

## 3. How PyKatha Differs from Conventional Learning

| Conventional course | PyKatha |
|---|---|
| Leads with the keyword and its grammar | Leads with a story; the keyword appears last |
| Explains `if` then gives a drill | Asks "why does the rabbit act?" and only then shows `if path_visible: cross()` |
| Screens the code to teach it | Hides the code and lets the learner discover it |
| Uses recall questions ("define a loop") | Asks observation/prediction/reasoning questions |
| Ties example to a dead, arbitrary task | Ties the concept to a narrative the learner retells |
| Teaches many ideas at once | Exactly **one concept per story** |
| Typing the answer is part of the test | Options are selected — the *choice of concept* is the test |

## 4. Current MVP Scope

PyKatha is intentionally small and feature-complete for its agreed workflow:

- A **client-only React SPA** — no backend, no database, no auth, no AI.
- A **7-stage learning flow** (below), one page per stage.
- **Three stories**, one per control-flow concept (`if`, `while`, `for`).
- **Static, hand-authored content** — every question, explanation, code snippet, and moral is curated data.
- Graceful **loading** and **missing-story** states on every stage.

Things that are deliberately **not** in the MVP: authentication, database, AI mentor/chatbot, a large curriculum, code execution, progress persistence, and gamification. These are boundaries, not bugs — see **docs/DECISIONS.md**.

## 5. The Three Current Stories

| Chapter | Story | Route id | Hidden concept | Code revealed |
|---|---|---|---|---|
| One | Rabbit and the Moon | `rabbit-if` | `if` statement | `if path_visible: cross()` |
| Two | Crow and the Pitcher | `crow-while` | `while` loop | `while water_out_of_reach: drop_pebble()` |
| Three | The Turtle's Journey | `turtle-for` | `for` loop | `for milestone in journey: reach(milestone)` |

## 6. Complete Learning Workflow

```
Landing
  ↓
Story Selection
  ↓
Story Reader              (read the story; Python is never mentioned)
  ↓
Thinking Challenge        (5 questions; the story is NOT on screen)
  ↓
Challenge Complete        ("You carefully observed the story…")
  ↓
Secret Behind the Story   (4-step reveal: storyMoment → pattern → logic → code)
  ↓
Practice                 (fill the blank from selectable option chips)
  ↓
Moral / Lesson           (concept named, tied back to story and real life)
```

### Screens / Pages

| Route | Page (`src/pages/`) | What the learner does |
|---|---|---|
| `/` | `Landing.jsx` | Sees the brand and one CTA: *Open the Storybook* |
| `/stories` | `StorySelection.jsx` | Picks a story card |
| `/story/:id` | `StoryReader.jsx` | Reads the story; progress bar; *I'm Ready* → challenge |
| `/challenge/:id` | `ThinkingChallenge.jsx` | Answers 5 reasoning questions ("No scores. Just thinking.") |
| `/reveal/:id` | `SecretBehindStory.jsx` | Advances a 4-step reveal (story → pattern → logic → Python) |
| `/practice/:id` | `Practice.jsx` | Selects the missing word and *See What Happens* |
| `/moral/:id` | `Moral.jsx` | Gets the concept name, story reflection, and life reflection |

Every stage has a loading spinner and a friendly "not written yet" fallback for invalid ids.

## 7. Technology Stack

- **React 19** — UI
- **react-router-dom 7** — client-side routing (`BrowserRouter`)
- **Vite 8** — build tool and dev server
- **ESLint 10** (flat config, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`) — linting
- **Plain CSS** — colocated stylesheets + CSS custom properties; no UI framework, no CSS-in-JS

There is **no backend, no authentication, no analytics, no global state library, and no code execution engine**. The practice page's "output" is pre-written story text, not an interpreter result.

## 8. Project Structure

```
client/
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
├── README.md
├── context.md              # handoff / project-state notes for contributors
├── docs/
│   ├── PRODUCT.md          # product requirements, intent, non-goals
│   ├── ARCHITECTURE.md     # technical architecture, routing, data model
│   ├── LEARNING_FLOW.md    # full journey, stage by stage, cognitive rationale
│   ├── CASE_STUDIES.md     # per-story walkthroughs (scenario → code)
│   ├── STORY_AUTHORING.md  # how to add the next story
│   ├── DEVELOPMENT.md      # commands, workflows, contribution process
│   └── DECISIONS.md        # design decisions and their trade-offs
└── src/
    ├── main.jsx            # React entry point (imports global.css)
    ├── App.jsx             # all route definitions
    ├── styles/             # global.css, variables.css, typography.css
    ├── components/         # StoryCard, StoryIllustration, StoryImage
    ├── pages/              # one component per route stage
    └── stories/            # per-story data (see below)
```

Each story is a folder under `src/stories/<id>/` with **five pure-data modules**:

```
src/stories/rabbit-if/
├── story.js        # title, concept, readingTime, chapter, paragraphs, illustrationType
├── questions.js    # 5 questions: observation / pattern / reasoning / prediction / fill-blank
├── code.js         # reveal steps: storyMoment → pattern → logic → code
├── practice.js     # codeTemplate, options, answer, output, reminder
└── moral.js        # conceptName, conceptLine, storyReflection, realLife, closing
```

## 9. How to Run Locally

Requires **Node.js 18+** (Node 20 or newer recommended).

```bash
npm install     # install dependencies
npm run dev     # start the Vite dev server
```

Then open the printed local URL (usually `http://localhost:5173`).

## 10. Available Scripts

| Script | What it does |
|---|---|
| `npm install` | Installs dependencies from `package.json` |
| `npm run dev` | Starts the development server with hot reload |
| `npm run lint` | Runs ESLint (flat config) over all `js`/`jsx` files |
| `npm run build` | Creates a production bundle in `dist/` |
| `npm run preview` | Serves the production build locally |

## 11. Current Limitations

- **Three stories only** — the catalogue is intentionally minimal.
- **One concept set** — only `if`, `while`, and `for` are covered.
- **Single fill-in-the-blank practice** per story — no free-form typing, and the code is **not executed**; "output" is hand-written story text.
- **No progress persistence** — refreshing restarts the journey; any stage can be reached by direct URL.
- **Static curated content** — everything is hand-authored data.
- **SPA hosting requirement** — production hosts must rewrite unknown paths to `index.html`.

## 12. Future Scope

- New stories for more concepts (`if-else`, `elif`, `for` with `range`, lists, functions).
- Multiple practice problems per story (the practice page already supports a "Problem X of N" pattern).
- A lightweight progress tracker between stages (no accounts required).
- Optional audio narration / text-to-speech for stories.
- Translation of the experience into other programming languages.

---

## Documentation Map

| Document | Answers |
|---|---|
| [README.md](README.md) | What, why, and how, at a glance |
| [docs/PRODUCT.md](docs/PRODUCT.md) | What problem does it solve, for whom, and what is out of scope |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | How the application is structured and why |
| [docs/LEARNING_FLOW.md](docs/LEARNING_FLOW.md) | The exact journey and the learning transition at each stage |
| [docs/CASE_STUDIES.md](docs/CASE_STUDIES.md) | Rabbit, Crow, and Turtle: scenario → reasoning → Python |
| [docs/STORY_AUTHORING.md](docs/STORY_AUTHORING.md) | How to author the next story |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | Commands, workflow, verification, contribution process |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Key product decisions and their trade-offs |
| [context.md](context.md) | Current project state for the next developer/mentor |