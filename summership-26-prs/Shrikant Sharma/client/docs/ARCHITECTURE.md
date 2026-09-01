# Architecture — PyKatha

## Overview

PyKatha is a **client-only React SPA**. There is no backend, no database, and no authentication. Everything renders from static data bundled into the app; stories are loaded dynamically so each story can be added or changed without touching the pages.

- **React 19** — UI
- **react-router-dom 7** — client-side routing
- **Vite 8** — bundler / dev server
- **Plain CSS** — colocated stylesheets with CSS custom properties

## High-Level Diagram

```
              ┌─────────────────────────────┐
              │   main.jsx (React root)     │
              │   imports styles/global.css │
              └──────────────┬──────────────┘
                             │
                     App.jsx (BrowserRouter)
                             │
   ┌──────────┬──────────────┼──────────────┬───────────────┐
   ▼          ▼              ▼              ▼               ▼
(/)        /stories      /story/:id     /challenge/:id  /reveal/:id
Landing   StorySelection StoryReader  ThinkingChallenge SecretBehindStory
                                                          (Hidden Logic)
   ┌───────────────────────────┐              │
   ▼                           ▼              │
/practice/:id               /moral/:id        │
Practice                    Moral              │
                                              │
        each `:id` page dynamically imports  ▼
        ┌────────────────────────────────────────┐
        │  src/stories/<id>/                      │
        │  story.js  questions.js  code.js        │
        │  practice.js  moral.js                  │
        └────────────────────────────────────────┘
```

## Routing

All routes are declared centrally in `src/App.jsx` inside a single `<BrowserRouter>`:

| Route | Page | Purpose |
|---|---|---|
| `/` | `Landing` | Intro brand screen |
| `/stories` | `StorySelection` | Catalog of the three stories |
| `/story/:id` | `StoryReader` | Read the story |
| `/challenge/:id` | `ThinkingChallenge` | 5 reasoning questions |
| `/reveal/:id` | `SecretBehindStory` | Hidden Logic reveal, 4 steps |
| `/practice/:id` | `Practice` | Fill-in-the-blank practice |
| `/moral/:id` | `Moral` | Concept moral and reflection |

Navigation is purely declarative links between pages; there is no route guard or authentication layer.

## Pages

Each page (`src/pages/*.jsx`) is a self-contained component that:

1. Reads the story `id` from the URL via `useParams()`.
2. Loads its story data with a dynamic import (see below).
3. Renders one of three states: **loading**, **missing** (invalid id), or **ready**.

### `Landing.jsx`
Static brand hero with an animated SVG scene (`StoryImage`/`StorybookHero`) and a single CTA to `/stories`.

### `StorySelection.jsx`
Renders the hard-coded `STORIES` array (title, concept, difficulty, minutes, route, art variant, accent) through `StoryCard`.

### `StoryReader.jsx`
Fetches `stories/<id>/story.js`, renders the paragraphs, and calculates a scroll-reading **progress bar** (requestAnimationFrame-driven, throttled on scroll/resize). The bottom navigation derives prev/next from the ordered `STORY_IDS` list and disables the ends.

### `ThinkingChallenge.jsx`
Fetches `stories/<id>/questions.js`, manages local state for the current index, the user's selected answers, and which questions are submitted. Supports multiple-choice and fill-in-the-blank (`____` in the question text). No score is shown — only per-question feedback.

### `SecretBehindStory.jsx` (Hidden Logic)
Fetches `stories/<id>/code.js` and walks through **four reveal steps**: `storyMoment` → `pattern` → `logic` → `code`. Enter-key support advances steps; the final step offers a transition to Practice.

### `Practice.jsx`
Fetches `stories/<id>/practice.js`, renders a code template with a `______` blank, lets the learner pick one option, and on "See What Happens" shows either the intended `output` or a gentle hint. A correct answer enables "Continue", which routes to `/moral/:id`.

### `Moral.jsx`
Fetches `stories/<id>/moral.js` and renders the concept name, concept line, story reflection, real-life reflection, and closing.

## Reusable Components

| Component | Location | Used by |
|---|---|---|
| `StoryCard` | `components/StoryCard/` | StorySelection |
| `StoryIllustration` | `components/StoryIllustration/` | StoryReader (hero art per scene) |
| `StoryImage` (export `StorybookHero`) | `components/StoryImage/` | Landing (animated hero) |

Icons are small inline SVG components defined locally within each page (there is no shared icon library). This keeps every page self-contained.

## Story Data Architecture

Each story is a directory under `src/stories/<story-id>/` with five data modules:

| File | Exports | Shape |
|---|---|---|
| `story.js` | default object + named exports | `{ title, concept, readingTime, chapter, paragraphs[], illustrationType }` |
| `questions.js` | default array (or `questions`) | array of `{ id, type, skill, question, options[], answer, explanation }` |
| `code.js` | default object | `{ storyMoment, pattern, logic, code, conceptName, finalNote }` |
| `practice.js` | default object | `{ prompt, codeTemplate, options[], answer, output, reminder }` |
| `moral.js` | default object | `{ conceptName, conceptLine, storyReflection, realLife, closing }` |

Field-by-field documentation: **[STORY_AUTHORING.md](STORY_AUTHORING.md)**.

How that data is turned into a learning experience (story → reasoning → pattern → logic → code → practice → moral) is documented in **[LEARNING_FLOW.md](LEARNING_FLOW.md)**, and each story is walked through end-to-end in **[CASE_STUDIES.md](CASE_STUDIES.md)**.

## Dynamic Story Loading

Story files are **not** statically imported in `App.jsx`. Instead each page uses Vite's dynamic import:

```js
import(`../stories/${id}/story.js`).then((mod) => mod.default).catch(() => null)
```

Because the path is purely dynamic, Vite must be told which chunks to produce. Vite includes the `src/stories/**/*.js` files as small code-split chunks (visible in the build output as `story-*.js`, `questions-*.js`, `code-*.js`, etc.). Every load is guarded by:

- a `cancelled` flag so a fast component unmount cannot set state;
- a `.catch()` that turns failures into a friendly "not written yet" missing-state page.

This is why adding a story requires **no code changes in the pages** — just new files under `src/stories/` plus three id-list registrations.

## How Story IDs Map to Routes

The `:id` URL segment, the story folder name, and the registrations must all match:

1. **Folder**: `src/stories/<id>/` (e.g. `rabbit-if`).
2. **StorySelection** — `STORIES` entries include `href: "/story/<id>"`, plus `variant` (art), `artSpan`, and `accent` for the card.
3. **StoryReader** — the ordered `STORY_IDS` array (`["rabbit-if", "crow-while", "turtle-for"]`) drives prev/next and chapter order.
4. **Practice** — the `PRACTICE_STORIES` array drives "Problem X of N".

If an id appears in one place but not another, that page degrades gracefully to its missing state rather than crashing.

## State Management Approach

There is **no global state management** — no Redux, Context provider, or persisted store, by design.

- Each page manages its own local state with `useState` / `useRef` / `useEffect`.
- The current question index, selected answers, and submission flags in the Challenge; the selected practice option and result; the reveal step counter — all live inside their page component.
- Crucially, the app **does not persist progress** and **does not restrict navigation**: a direct URL to any stage works.

This keeps the architecture simple, testable, and faithful to the "no dashboard / no auth" decision.

## Styling Approach

- **Plain, colocated CSS.** Each page has `PageName.css` next to its component; components carry their own CSS folder. No CSS Modules, no Sass, no Tailwind.
- **Global styles** live in `src/styles/`: `global.css` (reset + focus defaults) imports `variables.css` (design tokens) and `typography.css`.
- **Design tokens** are CSS custom properties (`--color-primary`, `--font-heading`, `--radius-*`)
- **Class naming** follows a loose BEM style (`block__element--modifier`, e.g. `.reader__reflect-cta`).
- Every page's root class re-declares a local token set (`--ink`, `--paper`, `--primary`, `--green`, `--gold`, `--accent`) so pages are visually coherent.
- **Accessibility**: `prefers-reduced-motion` media queries disable animations; focus-visible rings are defined per interactive element; loading and missing states expose polite `aria-live` status text.

## File Tree (source)

```
src/
├── main.jsx
├── App.jsx
├── styles/
│   ├── global.css
│   ├── variables.css
│   └── typography.css
├── components/
│   ├── StoryCard/StoryCard.jsx (+ .css)
│   ├── StoryIllustration/StoryIllustration.jsx (+ .css)
│   └── StoryImage/StoryImage.jsx (+ .css)
├── pages/
│   ├── Landing.jsx (+ .css)
│   ├── StorySelection.jsx (+ .css)
│   ├── StoryReader.jsx (+ .css)
│   ├── ThinkingChallenge.jsx (+ .css)
│   ├── SecretBehindStory.jsx (+ .css)
│   ├── Practice.jsx (+ .css)
│   └── Moral.jsx (+ .css)
└── stories/
    ├── rabbit-if/{story,questions,code,practice,moral}.js
    ├── crow-while/{story,questions,code,practice,moral}.js
    └── turtle-for/{story,questions,code,practice,moral}.js
```