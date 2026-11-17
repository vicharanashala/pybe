# Principles — Followed and Not Followed

## A. Sir's Feature Expectations

| Expectation | Followed? | How |
|---|---|---|
| Not a traditional lesson | ✅ Yes | No "here's the syntax, here's an example" format. Teaches through a story, builds code from scratch one small piece at a time, and checks understanding with feedback-rich quizzes throughout — not a single quiz at the end. |
| Real-life-scenario based | ✅ Yes | Every concept is paired with a real-world code parallel (e.g. `Manager(Employee)`, `AdminUser.login()` with `super()`), not just the bird metaphor in isolation. |
| Story-based / user-friendly | ✅ Yes | One continuous story (the Bird Family) carries all four concepts, rather than four disconnected examples. |
| Levels (basic → medium) | ✅ Yes | Four explicit levels, labeled Basic → Basic+ → Medium → Medium+, each with its own intro, simulator, and recap. |
| Case-study based | ✅ Yes | Each bird is a small case study — "given this parent, what did this specific child do differently, and why." |
| Pictures included | ✅ Yes | All illustrations are hand-drawn inline SVG (`BirdIllustration.jsx`, `InheritanceTree.jsx`) — no external/licensed image assets. |
| Exciting to play and learn | ✅ Yes | Interactive simulator with clickable method calls and live console output at every level, not passive reading. |

## B. Software Design Principles Followed

- **DRY (Don't Repeat Yourself):** all four levels' content lives in one data file, `levels.js`.
  `LevelIntro`, `TrySimulator`, and `LevelComplete` are generic components driven entirely by that
  data — no per-level component duplication.
- **Separation of concerns:** frontend (UI/flow) and backend (progress persistence) are fully
  separate; the UI never blocks on network calls (`saveProgress(...).catch(() => {})`) so the
  lesson works even if the backend is unreachable.
- **Progressive disclosure (pedagogical principle):** concepts are introduced one at a time —
  story → pattern quiz → definition → syntax quiz → an 8-step code build-up (starting from "what
  is a class") → hands-on practice — with the code growing one small, story-tied piece per step
  rather than being shown all at once.
- **Immediate, specific feedback:** every quiz option (right or wrong) has its own explanation,
  not a generic pass/fail message.
- **Scaffolding (zero assumed prior knowledge):** the code build-up assumes the learner has never
  seen Python class syntax before — it starts at "what is a class" and introduces one new keyword
  or concept per step (`class`, `def`, `self`, inheritance syntax, overriding, `super()`), each
  tied to the exact story sentence it maps to. This was a direct revision after feedback that an
  earlier version showed the complete, combined code in one block — too much for a first-time
  learner to absorb at once.

## C. Principles/Concepts Not (Yet) Covered — Stated Honestly

- **Constructor inheritance** (`__init__`, shared attributes, `super().__init__()`) is not
  covered. This is a real gap — most practical inheritance code involves constructors — and is
  the most valuable next addition if more depth is wanted.
- **Polymorphism** (treating different child objects uniformly through the parent type, e.g.
  looping over a list of birds and calling `.fly()` on each) is not covered as its own concept,
  though the simulator demonstrates the underlying mechanism.
- **Multi-level inheritance** (a chain like `Animal → Bird → Penguin`, more than one hop) is not
  covered — everything here is a single parent with direct children.
- **Multiple inheritance** (a class inheriting from two parents) is deliberately left out — it's
  a more advanced, less commonly needed topic, and including it risked diluting focus for a
  single-feature contribution.
- **Automated tests** are not included for either the frontend or backend — out of scope for a
  single-feature demo, but a real gap if this were shipped as-is.
- **Authentication** is not implemented; `learnerId` is currently a random ID stored in
  `localStorage`, meant to be swapped for pyBe's real auth system once available.