# Decisions — PyKatha

This document records the important product decisions and — more importantly — **why** they were made. It is the reference for anyone asking "but why didn't you just…".

Each decision follows the same five-part structure:

- **Decision** — what was chosen.
- **Context** — the situation at the time.
- **Reason** — why this choice was correct.
- **Trade-off** — what was given up or made harder.
- **Current status** — whether it still applies today.

---

## 1. Story-first learning instead of syntax-first learning

- **Decision:** The learning journey begins with a complete narrative and ends with Python syntax. Python is never shown during the reading stage.
- **Context:** Conventional beginner courses lead with grammar (`if`, `for`, `while`…) and drills. The result is learners who recognise syntax but cannot decide *when* or *why* to use it.
- **Reason:** Abstract syntax has no mental anchor and is easily forgotten. A story supplies a **durable, emotional mental model** — "the rabbit crosses only when the path appears" is far more memorable than "`if` evaluates a condition". The learner reaches the syntax as a translation of a conclusion they already own, so it is understood rather than memorised.
- **Trade-off:** The learner cannot write *any* Python until late in the journey, and the emotional first exposure is not "real programming". A learner seeking pure syntax reference would want the opposite order.
- **Current status:** Governing decision. The entire flow (read → think → discover → practise → reflect) exists to protect this.

## 2. One Python concept per story

- **Decision:** Each story teaches exactly one control-flow concept (`if`, `while`, or `for`). No multi-concept lessons.
- **Context:** Multi-concept lessons are the classic failure mode of beginner courses — the learner cannot tell which new idea caused which effect.
- **Reason:** A 1:1 story→concept mapping means one thing to notice, one rule to extract, and one clean translation into code. Attention is undivided; the mapping between story-behaviour and code-behaviour stays clean.
- **Trade-off:** Breadth is sacrificed. Each story covers less material, so the trio of stories cannot replace a curriculum — only open the door to one.
- **Current status:** Governing decision, enforced by [STORY_AUTHORING.md](STORY_AUTHORING.md) ("exactly one concept per story").

## 3. Story hidden during questions

- **Decision:** The Thinking Challenge page does not display the story text alongside the questions.
- **Context:** If the story page remained visible, questions would become a text-search exercise.
- **Reason:** Hiding the story forces **recall and reconstruction** — the learner must have *internalised* the behavioural rule rather than pointed at it. That internalised rule is exactly what transfers to reading code.
- **Trade-off:** The questions are strictly harder, and a learner who skimmed the story will struggle (designed: the reader warns "the questions will test your understanding, not your memory").
- **Current status:** Governing decision — the challenge is optional to reach by direct URL, but by flow design the story is always consumed first.

## 4. Questions focus on reasoning rather than Python terminology

- **Decision:** Challenge questions test Observation, Pattern recognition, Reasoning, and Prediction (+ one Fill-in-the-Blank), all phrased in story language with **no Python terms**.
- **Context:** Recall questions ("what colour was the pitcher?") train nothing that transfers to programming; vocabulary-laden questions would expose the concept before the reveal.
- **Reason:** The four tested skills are the same cognitive operations used to read and debug code. Testing them through the story gives the learner practice in the *real* skill — understanding what a behaviour depends on — before they ever meet a line of Python.
- **Trade-off:** The questions can feel indirect ("what sign returned again and again?"), and nothing here validates Python knowledge yet.
- **Current status:** Governing decision; each story ships exactly one of each skill question (see [STORY_AUTHORING.md](STORY_AUTHORING.md)).

## 5. Pattern and logic revealed before syntax

- **Decision:** The reveal (`/reveal/:id`) exposes the concept in four escalating steps: story moment → pattern → logic → Python code.
- **Context:** Showing code at the start would short-circuit the reasoning exercise the challenge just performed.
- **Reason:** The learner already built the intuition during the challenge. The reveal walks story → pattern → logic → code so each step is a strict generalisation of the previous one; the Python felt like a *translation of what the learner already understood*, not new machinery.
- **Trade-off:** Slower pacing than a syntax reference; a learner could impatiently skip the reveal steps. (Mitigated: it is only a few clicks/Enter presses.)
- **Current status:** Governing decision. `code.js` data model (`storyMoment`, `pattern`, `logic`, `code`) exists purely to enforce it.

## 6. Option-based practice instead of free-form code typing

- **Decision:** The Practice page fills a `______` blank from four selectable option chips; there is no free-text input.
- **Context:** The target learner is a total beginner; an open text input would fail at the typo/escape level, not the concept level, and would require fragile matching.
- **Reason:** Selectable chips remove spelling and case problems while still forcing the learner to **choose the concept** — the retrieval effort stays high, the friction stays low. The same rationale drives the challenge's fill-in-the-blank chips.
- **Trade-off:** No actual typing practice and no free-form syntax skill; the learner cannot *produce* code from scratch, only reconstruct it.
- **Current status:** Governing decision for the MVP. Free-form typing is a plausible future layer, but the option model is the deliberate foundation.

## 7. Short, focused learning journey

- **Decision:** Each story is one focused sitting: read → think → discover → practise → reflect. No chapters-within-chapters, no branching, no side content.
- **Context:** Learners, especially beginners, lose attention quickly; unfocused products dilute the single "aha" moment.
- **Reason:** A short journey guarantees the concept is met while attention and motivation are high, and keeps the whole product deterministic and reviewable.
- **Trade-off:** Depth per story is low; PyKatha cannot be a full course.
- **Current status:** Governing decision. The three stories are deliberately short (5–6 min reading each).

## 8. Three concepts for the MVP

- **Decision:** The MVP ships exactly three stories, one per fundamental control flow: `if` (`rabbit-if`), `while` (`crow-while`), `for` (`turtle-for`).
- **Context:** Ten stories with five good ones would be worse than three great ones; every word is hand-written and quality-checked.
- **Reason:** Three stories form a **minimal complete set** covering the three fundamental control flows, are exhaustively testable (content correctness is the app's real asset), and are sequenced as a coherent micro-curriculum (Chapters One → Two → Three).
- **Trade-off:** Only three concepts are covered; learners wanting `elif`, functions, or data structures must wait. Expansion is deliberately mechanical via [STORY_AUTHORING.md](STORY_AUTHORING.md).
- **Current status:** Governing decision for v1; not a commitment that only three will ever exist.

## 9. No AI mentor in current MVP

- **Decision:** There is no AI mentor, chatbot, or generated explanation anywhere in the product.
- **Context:** An AI mentor (chatbot, per-answer explanation generation, hints) is a large, unpredictable, hard-to-audit system.
- **Reason:** In v1 the content — questions, explanations, hints, morals — is **hand-authored and deterministic**. This guarantees correct Python, consistent pedagogy, reproducible UX, zero latency, zero cost, and full testability. AI can be layered on later *without changing the architecture*; the current content model is a deliberate, reviewable foundation.
- **Trade-off:** No personalised hints or adaptive difficulty; a struggling learner gets the same gentle hint as everyone else.
- **Current status:** Governing decision for v1. The data model keeps open the option of generating future story content, but no AI is wired in.

## 10. No database / progress persistence in current MVP

- **Decision:** The app is a client-only SPA with no backend, no database, no authentication, and no persisted progress. Refreshing restarts the journey; any stage is reachable by direct URL.
- **Context:** Persistence, accounts, and a dashboard all add infrastructure (auth), distraction (leaderboard), or implied stakes (scores) that contradict the calm, no-pressure design ("No scores. Just thinking.").
- **Reason:** None of them serve the core learning moment: **one learner, one story, one concept, no surveillance.** A deterministic, stateless app is also trivially testable, reviewable, and cheap to host.
- **Trade-off:** A learner who closes the tab loses their place; there is no per-learner data product and no way to measure retention.
- **Current status:** Governing decision for v1. A lightweight progress tracker that requires *no accounts* is listed as future scope in the README, but nothing is implemented.

---

## Non-decisions (explicitly rejected)

- **A management-style dashboard** — a *management* surface adds chrome and cognitive load before any learning happens. PyKatha's job is not to manage learning; it is to produce a *first moment of understanding*. The product *is* the journey.
- **A generic "Python learning platform"** — that framing would have produced a different app. PyKatha stays a focused storybook.

## How to Change a Decision

If you disagree with any of the above, propose the change as a **documented trade-off**: name the decision, the reason it existed, the new reason, and which of the app's principles it preserves or drops. The journey structure — read → think → discover → practise → reflect — is the one invariant worth protecting; individual features are negotiable, the flow is not.