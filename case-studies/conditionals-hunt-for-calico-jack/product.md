# PyBe — Product Specification

**Learn Python the Pirate Way.** An open-source, story-driven Python course where every
language construct is taught as a decision a character actually has to make.

This document is the contract for the project. It describes what PyBe is, how a chapter is
built, and — importantly — **what the stack is allowed to be**. Read it before adding a chapter.

---

## 1. Vision

Most "learn to code" material explains syntax and then bolts a story on top as decoration.
PyBe inverts that: the story *is* the semantics. The learner watches a naval expedition make a
decision, and only afterwards is told that what they just watched **was** an `if` statement.
The code panel is a subtitle track for something that already made sense.

Chapter I ships today: **conditional logic**, taught in two escalating steps.

| Step | Construct | Story | The idea it plants |
|------|-----------|-------|--------------------|
| Act I | `if` / `else` | One island, one yes-or-no question | Exactly one of two branches runs — never both, never neither |
| Act III | `if` / `elif` / `else` | Seven islands, checked in order | Python stops at the **first** `True` and never reads the rest |

## 2. Audience

- Absolute beginners, roughly ages 14+, who have never written a line of Python.
- Self-directed learners who bounce off reference documentation.
- Educators looking for a classroom demo of control flow that survives being projected.

No account, no install, no backend. Open the page and scroll.

---

## 3. Stack lock

**All future work stays inside this stack.** This is a hard constraint, not a preference: the
project's value is that it is a single static bundle anyone can fork, run, and host for free.

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | React 18 (function components + hooks) | No class components |
| Build | Vite 4 | `npm run dev` / `npm run build` from the repo root |
| Styling | Plain CSS files, one per component tree | No Tailwind, no CSS-in-JS, no preprocessor |
| Graphics | **Flat 2D — CSS gradients and inline SVG** | No three.js, no WebGL, no canvas, no perspective tricks |
| Animation | CSS keyframes + scroll-derived inline transforms | No Framer Motion, no GSAP |
| State | `useState` / `useMemo` / `useRef` | No Redux, Zustand, or context libraries |
| Routing | A single `useState` view switch in `App.jsx` | No router |
| Data | Static modules under `src/data/` | No backend, no fetch, no database |
| Assets | PNG plates in `client/public/`, everything else inline SVG | No icon or illustration packages |

Runtime dependencies are exactly `react` and `react-dom`. **A pull request that adds a runtime
dependency will be rejected** unless it also deletes one. If a feature seems to need a library,
the answer is almost always a smaller feature.

### Why flat 2D

The sea is a sky band, a horizon line, and a wide strip of water that slides sideways as the
story moves down the page. Depth is suggested the way a 2D game suggests it — things further
back sit higher on the water and are drawn a little smaller — and three rows of dashed waves
travel at different speeds behind and in front of the actors for parallax.

It costs zero kilobytes, has no perspective maths to calibrate, reads identically on a phone and
a projector, and every position can be reasoned about as plain screen pixels.

---

## 4. Information architecture

The journey is **one continuous scroll**. There are no "Next" buttons between beats — the scroll
wheel is the transport control, and every animation is a pure function of scroll position, so
scrubbing backwards replays a beat exactly rather than re-rolling it.

```
Landing page                          (unchanged; entry point)
└── The Expedition ─ one continuous scroll ────────────────────
    ├── Act 0    Prologue         7 cinematic plates, 1 per scroll screen
    ├── Act I    The Raid         if / else        (~5 screens)
    ├── Act II   The Hinge        branch narrative (~3 screens)
    ├── Act III  The Archipelago  if / elif / else (~9 screens)
    ├── Act IV   The Evaluation   6-question assessment
    └── End of Chapter I
```

The ladder is walked **exactly once**. Nothing repeats further down the page: to see the road
not taken, the re-run buttons change the outcome in place, and the acts below re-render around
the new answer.

### The branch — how Act I decides Act III

Act I's outcome is not cosmetic. It rewrites the next two acts:

- **Jack is caught** → Act II is *The Interrogation* aboard the Resolute. Jack gives up the
  location of a buried chest: "seven islands east, and it is on exactly one of them." Act III
  becomes `treasure.py` — the ladder calls `dig("Bone Reef")`, `dig("Gallows Rock")`, …
- **Jack escapes** → Act II is *Fresh Intelligence* in the chart room. An informant places Jack
  on one of the same seven islands. Act III becomes `manhunt.py` — the ladder calls
  `raid("Bone Reef")`, `raid("Gallows Rock")`, …

Only one of the two ever runs on a given pass. Both roads reach the same construct, which is the
point: `elif` is what you reach for when a two-way fork is no longer enough.

### Scroll mechanics

Every act is a tall `<section>` containing a `position: sticky` stage. `useScrollProgress` turns
the viewport's travel through that section into a number from 0 to 1, and **every** position,
opacity and code-line state is a pure function of it. Nothing is driven by timers, so scrubbing
back up the page replays a beat exactly rather than re-rolling it.

Outcomes are derived from a seed rather than from `Math.random()` at paint time, so a re-render
never quietly rewrites what the reader already watched. Only the explicit re-run buttons change
the hand.

### Learner controls

Two inline buttons, no modals:

- **Act I — "Re-run with the other answer"** deliberately *flips* the branch rather than
  re-rolling it. A learner who presses it wants to watch the road not taken.
- **Act III — "Re-run this expedition"** re-rolls which island hides the prize, including the
  ~18% case where none of them do and the `else` at the bottom is the only thing left to run.

---

## 5. Teaching devices

These carry the pedagogy and should survive any redesign:

| Device | What it makes visible |
|--------|-----------------------|
| Line tags (`True → runs`, `False`, `skipped`, `never checked`) | Which branch Python actually executed |
| Struck-through, faded code lines | Blocks that were *loaded but never read* |
| The ladder rail (left edge, Act III) | The `elif` chain as a top-to-bottom scoreboard |
| `⏭` badges on unvisited islands | Short-circuit — the hunt stops at the first `True` |
| Branch scoreboard (Act I) | Both branches side by side, one greyed, after resolution |
| The `else` at the bottom of the rail | Lights up **only** when all seven came back `False` |

The single most-missed fact about an `elif` ladder is that a match ends it. That is why the ship
physically stops and the remaining islands are never sighted — the animation and the semantics
are the same statement.

---

## 6. File map

```
package.json                         root scripts: dev / build / preview / installAll
product.md                           this document
.claude/launch.json                  dev-server config for the in-editor preview (optional)
client/
  index.html                         fonts + mount point
  src/
    App.jsx                          landing ⇄ journey view switch
    index.css                        global resets
    data/
      story.js                       ALL narrative copy, island name pools, island layout
    components/
      LandingPage.jsx / .css         marketing page + chapter grid
      journey/
        ScrollJourney.jsx            orchestrator: prologue, the expedition, quiz, HUD, closing
        journey.css                  the entire journey stylesheet
        scrollUtils.js               scroll-progress hook, easing, viewport framing, seeded RNG
        Scene2D.jsx                  the sea: sky, horizon, parallax wave rows, Prop / Wake placement
        Sprites.jsx                  inline SVG: ship, rowboat, soldier, pirate, cuffs, chest, islands
        CodeCard.jsx                 floating code panel + tiny Python colouriser
        Overlays.jsx                 act title, caption, banner, branch scoreboard
        IntroAct.jsx                 Act 0 — the seven plates
        Expedition.jsx               Acts I–III; owns the outcome seed and the re-run buttons
        RaidAct.jsx                  Act I — if / else
        BridgeAct.jsx                Act II — interrogation / intelligence
        ArchipelagoAct.jsx           Act III — if / elif / else
        QuizAct.jsx                  Act IV — assessment
      modules/                       ⚠️ superseded by journey/ — see §10
  public/                            9 story plates, all in use
```

### Coordinate system

Positions on the sea are `{ x, z }`:

- **`x`** — 0 to 100 along the strip, which is several viewports wide. One unit is one percent of
  the strip, so offsets hold their proportions at any screen size.
- **`z`** — 0 (far, just under the horizon) to 100 (near the front). It sets the vertical spot on
  the water and a modest sprite scale. It is *not* perspective; nothing is projected.

`useFraming()` is the whole camera and layout budget in one hook: strip width, the sky/water
split, where props sit in the water, sprite scale, and `centreOn(x)` — give it a position along
the strip and it returns the `translateX` that frames it, nudged left of the code panel on wide
screens and centred on narrow ones.

Place actors as offsets from the island they belong to rather than in absolute coordinates; that
way one number moves the whole scene.

---

## 7. Design system

Defined once as custom properties on `.jr-root` in `journey.css`.

| Token | Value | Use |
|-------|-------|-----|
| `--navy-deep` | `#0a1725` | Page ground |
| `--navy` / `--navy-light` | `#16283f` / `#233c5c` | Panel chrome |
| `--parchment` / `--parchment-dim` | `#ecdfbd` / `#cbbc95` | Body text |
| `--brass` / `--brass-bright` | `#c8a15a` / `#f0d093` | The "this ran" colour — reserve it |
| `--danger` / `--success` | `#d1594c` / `#6fae74` | False / True outcomes |
| `--glass` / `--glass-line` | translucent navy / brass | Floating overlay cards |

Type: `Pirata One` (display), `IM Fell English SC` (labels, small caps), `Special Elite` (body),
`JetBrains Mono` (code), `Inter` (UI micro-copy). All loaded from Google Fonts in `index.html`.

**Brass means "this executed."** Do not spend it on decoration.

Accessibility: `prefers-reduced-motion: reduce` collapses every animation and transition to
instant. Scroll-driven positions still resolve, so a reduced-motion reader gets the same story
as a series of stills. Keep it that way.

---

## 8. Responsive behaviour

Single breakpoint at **860px**.

- **Wide** — the code panel is a tilted glass card on the right and `centreOn` nudges the scene
  14% left to clear it; the `elif` rail sits on the left; the water gets 70% of the frame.
- **Narrow** — the code panel becomes a bottom sheet, the scene re-centres and the horizon rises
  so the whole sea fits in the top band; the rail and branch scoreboard are hidden (their
  information is already in the code panel's line tags) and the caption sits above the sheet.

---

## 9. Roadmap

Chapters II–IV are stubbed on the landing page as "Coming Soon". Each should reuse
`Scene2D` / `CodeCard` / `Overlays` and follow the same shape: **story beat first, code reveal
second, one construct per act.**

| Chapter | Construct | Story handle |
|---------|-----------|--------------|
| II | `for` / `while` loops | Patrolling a shipping lane until the mission condition is met |
| III | Functions | Standing orders — a manoeuvre written once and called by name |
| IV | Lists & dictionaries | The manifest: crew roster, cargo hold, prize ledger |

Cross-cutting work, in priority order:

1. Keyboard and reduced-motion navigation — jump-to-act controls for readers who cannot scroll.
2. Progress persistence in `localStorage` (expeditions completed, assessment score).
3. Extract the act scaffolding into a small reusable `<Act>` so chapter II is mostly data.
4. Screen-reader narration: an `aria-live` transcript of the caption track.

---

## 10. Housekeeping

`client/src/components/modules/` (`PirateIntroView`, `IfElseAdventure`, `IfElseAssessment` and
their stylesheets) is the previous click-through implementation. It is **no longer imported** and
is not included in the production bundle — it was left on disk rather than deleted because this
working copy is not under version control. Once the project is in Git, delete the directory; its
narration lives in `src/data/story.js` and its assessment lives in `QuizAct.jsx`.

## 11. Contributing

1. Read §3. If your change needs a new runtime dependency, it needs a different design.
2. Narrative copy goes in `src/data/story.js`, never inline in a component.
3. Animations must be pure functions of scroll progress — no timers, no `setTimeout` chains.
   Scrubbing backwards has to replay a beat identically.
4. Randomness comes from `rngFrom(seed)`, never bare `Math.random()` during render.
5. Every new act must be legible at 375px wide and must respect `prefers-reduced-motion`.
6. Run `npm run build` before opening a PR.

```bash
npm run installAll && npm run dev
```

Crafted with 🏴‍☠️ by Husanpreet Singh.
