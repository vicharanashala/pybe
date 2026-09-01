# Product — PyKatha

This document records the **product requirements and intent**: the problem PyKatha solves, the learner it serves, the principles that govern every design choice, and the explicit boundaries of the current MVP.

---

## 1. Problem

Traditional beginner Python learning usually starts with **syntax**:

```
if ...
for ... in ...
while ...
variables, lists, functions ...
```

The learner may memorise the shape of each keyword without understanding **when** or **why** to use it. Two failure modes are common:

1. **Syntax-first tutorials** present grammar followed by drills. The learner can often *recognise* an `if` but cannot decide *in an unfamiliar situation* that an `if` is the right tool.
2. **Arbitrary exercises** ("write a program that…") start from a made-up task with no conceptual or emotional hook, so the concept never anchors in the learner's mind.

The underlying problem is the same: the learner is asked to learn **code** before they have a **model of the behaviour** the code represents.

## 2. PyKatha's Approach

PyKatha reverses the order:

```
Experience first.
Reasoning second.
Syntax third.
```

- **Experience first** — the learner meets a complete story written with no Python in it. The story's conflict *is* the concept: the rabbit crosses **when** the path appears; the crow drops pebbles **until** the water is within reach; the turtle passes each milestone **once, in order**.
- **Reasoning second** — the Thinking Challenge hides the story and asks the learner to reconstruct, from memory, what happened, what repeated, what changed, and what condition controlled the action. These are the same cognitive operations a programmer uses to read code.
- **Syntax third** — only after the learner has reached the conclusion themselves is Python revealed, as the "secret behind the story": a faithful translation of that conclusion.

The tagline is the whole vision in five words: **Think the Story. Discover the Code.**

## 3. Target Learner

PyKatha is built for:

- **Absolute beginners** — no programming background, possibly intimidated by syntax-heavy tutorials.
- **Younger / first-time learners** — the voice, pacing, vocabulary, and illustration style reflect this.
- **Inquisitive learners who respond to narrative** — learners who remember a story far better than a keyword reference.

It is explicitly **not** aimed at experienced programmers, who need reference material instead of a storybook.

The learner is expected to leave each story able to:

1. Look at a situation and decide whether it is a **conditional**, a **repetition-while-condition**, or a **repeat-over-each-item**.
2. Explain in their own words why that structure fits.
3. Recognise the Python syntax that expresses it (and fill it in when the concept is chosen).

## 4. Product Principles

Every feature in PyKatha follows these principles:

1. **Story before syntax.** Python never appears during the reading stage; the story must stand alone as a story.
2. **Thinking before terminology.** The learner reasons about behaviour before any concept is named.
3. **Discovery before explanation.** The code is *revealed* as a secret, not lectured at the start.
4. **One concept at a time.** Each story maps to exactly one control-flow idea; no cognitive overload.
5. **No answer-hunting during questions.** The story is hidden during the challenge, forcing recall and reasoning over searching.
6. **Practice immediately after discovery.** A separate practice stage forces a retrieval attempt — the learner must reconstruct the construct, not copy it.
7. **Minimal cognitive distraction.** No scores, no timers, no dashboard — "No scores. Just thinking."
8. **Short, focused learning journey.** Each story is a single sitting: read → think → discover → practise → reflect.

## 5. MVP Scope

The current MVP intentionally contains:

- A **client-only React SPA** with seven routes (`/`, `/stories`, `/story/:id`, `/challenge/:id`, `/reveal/:id`, `/practice/:id`, `/moral/:id`).
- A **7-stage learning flow** — Landing, Story Selection, Story Reader, Thinking Challenge, Hidden Logic reveal, Practice, Moral.
- **Three stories**, one per concept: `if` (Rabbit and the Moon), `while` (Crow and the Pitcher), `for` (The Turtle's Journey).
- **Static, hand-authored content** — questions, reveal steps, practice items, morals.
- **Graceful loading and missing-story states** on every stage.
- **Responsive layouts** with a warm storybook visual language (paper, ink, forest green, gold, clay orange; serif display type; inline SVG art).
- Accessibility touches: `prefers-reduced-motion` support and focus-visible styling.

## 6. Non-Goals (Deliberate MVP Boundaries)

These are **not** part of the current MVP. They are not bugs or missing features; they are deliberate decisions documented in [DECISIONS.md](DECISIONS.md):

- **Authentication / accounts**
- **Database / backend**
- **AI mentor / generic chatbot / generated explanations**
- **A large Python curriculum** (deliberately limited to `if`, `while`, `for`)
- **Code execution engine** (practice output is pre-written story text)
- **Progress persistence** (refreshing restarts; stages are reachable by direct URL)
- **Complex gamification** (no scores, leaderboards, badges, or analytics)

## 7. How to Read the Rest of the Docs

- [LEARNING_FLOW.md](LEARNING_FLOW.md) — the exact journey, stage by stage, with the learning transition at each step.
- [CASE_STUDIES.md](CASE_STUDIES.md) — full per-story walkthroughs from scenario to Python code.
- [ARCHITECTURE.md](ARCHITECTURE.md) — how the product is technically built.
- [STORY_AUTHORING.md](STORY_AUTHORING.md) — how to extend the catalogue while preserving the methodology.
- [DECISIONS.md](DECISIONS.md) — why each of these boundaries exists.