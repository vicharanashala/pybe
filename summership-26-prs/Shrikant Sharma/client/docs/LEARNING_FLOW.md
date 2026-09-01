# Learning Flow — PyKatha

This is the core methodology document. It explains **exactly** what a learner experiences, **why** each stage exists, and **what cognitive transition** happens at each step — from a story about a rabbit to the Python `if` statement.

---

## 0. The Discovery Pipeline (core design principle)

PyKatha is **not** "stories used to make Python fun." The story is the carrier of a deliberate, repeatable reasoning pipeline. Every story is authored so that, by the end of the journey, the learner can answer this chain of questions themselves:

```
Scenario
  ↓
What is happening?
  ↓
What changes?
  ↓
What remains the same?
  ↓
What repeats?
  ↓
What condition controls the action?
  ↓
What kind of programming structure represents this?
  ↓
What Python syntax expresses it?
```

These questions move the learner from **narrative understanding** to **computational thinking** to **Python competence**, without ever asking them to memorise grammar first. Every stage in the journey below is one step of this pipeline made visible.

## 1. Journey Overview

The complete journey has two layers. On the **application** level there are eight screens (the seven routes used for the flow):

```
Landing
  ↓
Story Selection
  ↓
Story Reader
  ↓
Thinking Challenge
  ↓
Challenge Complete
  ↓
Secret Behind the Story
  ↓
Practice
  ↓
Moral / Lesson
```

On the **cognitive** level, those screens implement seven pedagogical stages:

```
Story
  ↓
Thinking Challenge
  ↓
Pattern Discovery
  ↓
Logic Discovery
  ↓
Python Reveal
  ↓
Practice
  ↓
Lesson / Moral
```

The rest of this document walks the pedagogical stages in order. Each stage lists:

1. **What the learner sees**
2. **What the learner does**
3. **What the learner is expected to think**
4. **Why this stage exists**
5. **What learning transition happens**

---

## Stage 1 — Story

**Application screens:** `/` (Landing) → `/stories` (Story Selection) → `/story/:id` (Story Reader)

- **What the learner sees:** A calm storybook entry, three illustrated chapter cards, then a full narrative ("Rabbit and the Moon", "Crow and the Pitcher", "The Turtle's Journey") with a hero illustration and a reading-progress bar. No Python terminology appears anywhere in the narrative.
- **What the learner does:** Reads. A "Take a Moment" card reminds them the questions will test their understanding, so they read to *understand* rather than skim.
- **What the learner is expected to think:** Simply the story — that the rabbit only crosses when the silver path appears, that the crow keeps dropping pebbles until the water reaches its beak, that the turtle passes each milestone in order. Nothing about code.
- **Why this stage exists:** To build a **durable mental model**. The behavioural rule of the story *is* the programming concept, but the learner is not told this. The story supplies the emotional anchor and the "why" the behaviour exists.
- **Learning transition:** The learner encodes the rule ("X only happens when Y", "X keeps happening while Y", "X happens once for each item") as lived, concrete knowledge — the substrate every later stage will translate.

> **Important:** The story must stand independently as a story. If it needs Python knowledge to make sense, it is a bad story (see [STORY_AUTHORING.md](STORY_AUTHORING.md)).

## Stage 2 — Thinking Challenge

**Application screen:** `/challenge/:id` (Thinking Challenge)

- **What the learner sees:** The story is **not displayed**. Five questions appear — Observation, Pattern recognition, Reasoning, Prediction, and one Fill-in-the-Blank — under the banner "No scores. Just thinking." After answering each question, the learner gets immediate correct/incorrect feedback with an explanation.
- **What the learner does:** Answers each question from memory and reasoning; navigates Next / Previous / Submit / Finish.
- **What the learner is expected to think:** Recalls the story and reconstructs its rules: *What was the repeated sign? What order did events follow? What would happen if the condition was missing?* This is active reconstruction, not search.
- **Why this stage exists:** To test whether the learner actually **observed and understood** the story rather than searching the text for answers. With the story hidden, the questions can only be answered from an internalised model — which is exactly the skill a programmer uses to reason about code they cannot "search" for an explanation of.
- **Learning transition:** Passive reading becomes **active reasoning**. The learner consciously examines the story's structure: what repeats, what changes, what stays the same, what condition gates an action. This is the moment observation turns into analysis.

> **Note:** Python syntax is not exposed here. The questions are deliberately non-technical: "What sign returned before Pip ever stepped into the water?" — not "What was the if-condition?"

## Stage 3 — Pattern Discovery

**Application screen:** `/challenge/:id` completion → the *skill-tagged* questions (Observation / Pattern recognition / Reasoning / Prediction) do this work implicitly; the **Secret Behind the Story** makes the pattern explicit.

- **What the learner sees:** After finishing the challenge ("Wonderful Thinking!"), the learner enters the Secret Behind the Story. Its second step, *See the pattern*, states the abstract pattern of the story (e.g. "When something depends on a condition.").
- **What the learner does:** Advances the reveal steps (button or Enter key) at their own pace.
- **What the learner is expected to think:** About the structural questions — *What happened repeatedly? What was different? What condition caused the action? What behaviour continued? What sequence existed?* The challenge questions prepared this; the reveal confirms it.
- **Why this stage exists:** This is where the learner moves from narrative understanding toward **computational thinking**. A story event is no longer just an event; it is an instance of a structure: a gate, a repetition, an iteration over a set.
- **Learning transition:** The learner abstracts a specific story ("Pip saw the path and crossed") into a general pattern ("an action happens only when a condition is true").

## Stage 4 — Logic Discovery

**Application screen:** `/reveal/:id` step 3, *Shape the logic*

- **What the learner sees:** The pattern is now stated as logic: "If the condition is true, the action happens" / "While the condition is true, the action keeps happening" / "For every item in the set, the action happens once."
- **What the learner does:** Reads the logical statement and advances.
- **What the learner is expected to think:** That the abstract structure maps onto a **decision** (if), a **repetition while a condition holds** (while), or an **iteration over known items** (for). The story event is recognised as a control-flow situation.
- **Why this stage exists:** To make the bridge explicit:

  ```
  Story event  →  condition / pattern  →  decision / repetition / iteration  →  programming logic
  ```

  The learner now owns the *logic* in words before seeing it in code.
- **Learning transition:** The learner can now reason: "the rabbit only crosses when the path is visible — so there is a condition that *decides* whether to cross."

## Stage 5 — Python Reveal

**Application screen:** `/reveal/:id` step 4, *The secret appears*

- **What the learner sees:** The actual Python syntax in a code block:

  ```python
  if path_visible:
      cross()
  ```

  ```python
  while water_out_of_reach:
      drop_pebble()
  ```

  ```python
  for milestone in journey:
      reach(milestone)
  ```

- **What the learner does:** Reads the code as the final step of the reveal, then reaches "Now it's your turn."
- **What the learner is expected to think:** *Why* does this syntax represent the discovered logic? Not "because it's an if statement", but "a condition that controls whether an action happens needs a construct where the action runs only when the condition holds — Python's `if` does exactly that."
- **Why this stage exists:** Only now is the concept **named** and its syntax introduced. Syntax is introduced as a *translation* of a conclusion the learner already reached — the code feels earned, not foreign. By showing story-reveal-logic-syntax in four escalating steps, the reveal assembles the whole pipeline in one screen.
- **Learning transition:** The learner connects an idea they can already explain ("the crossing depends on the path") to a concrete expression in Python. This is where intuition becomes syntax.

> **Important:** The concept is named at the *end*, not the start. The learner never reads "today we will learn the if statement" first.

## Stage 6 — Practice

**Application screen:** `/practice/:id` (Practice)

- **What the learner sees:** "Try It Yourself", a prompt, a code template with a `______` blank, selectable option chips, a *See What Happens* button, and a story reminder ("Remember how the rabbit crossed only when the silver path appeared?").
- **What the learner does:** Picks the correct missing word. On the correct choice, the intended story outcome appears ("Rabbit crosses the river.") and *Continue* unlocks. On a wrong choice, a gentle hint appears instead — no output.
- **What the learner is expected to think:** Retrieval. "Which word makes this code behave like the story? The path must be visible before crossing — so `path_visible`." This is a deliberate **retrieval attempt**, not copying from the reveal.
- **Why this stage exists:** To confirm the concept is **owned, not recognised**. Because the reveal already happened, this stage tests whether the learner can *produce* the construct. Option chips are used deliberately: total beginners would fail on typo level, not concept level; selecting from options keeps the irreducible test — *choosing the concept* — without penalising spelling. Selecting, submitting, and reading the story outcome rewards the correct reconstruction immediately with behavioural feedback.
- **Learning transition:** The learner moves from recognising the construct to **producing** it — the stage where recognition becomes beginning competence.

> **Note:** The code is **not actually executed** in the MVP. The output shown on a correct answer is pre-written story text that simulates what the program would print.

## Stage 7 — Lesson / Moral

**Application screen:** `/moral/:id` (Moral)

- **What the learner sees:** "You discovered something powerful", the concept name in large type (`IF` / `WHILE` / `FOR`), a one-line definition, *In the story* and *In your life* reflections, a closing aphorism, and two CTAs: *Read Another Story* and *Back to Home*.
- **What the learner does:** Reads one page of consolidation, then may start the next story.
- **What the learner is expected to think:** The closing loop — *story → discovered logic → Python concept → the code I wrote* — all connected, plus a human meaning attached to the concept.
- **Why this stage exists:** The moral **names the concept explicitly** (so the intuition gets vocabulary), **reflects the story back** (consolidating that story and code behave the same), and **connects to real life** (so the concept is memorable and transferable).
- **Learning transition:** The experience converges: the learner leaves knowing not only **what** the syntax is, but **why** it makes sense — the exact outcome conventional tutorials rarely produce.

---

## 2. Stage → Concept Mapped

| Stage | The learner… | What it builds toward |
|---|---|---|
| Story | absorbs a behavioural rule | the *when/why* of the concept |
| Thinking Challenge | reconstructs the rule from memory | observation + recall skills |
| Pattern Discovery | abstracts the story into a pattern | computational thinking |
| Logic Discovery | shapes the pattern into logic | decision / repetition / iteration |
| Python Reveal | meets the syntax as a translation | the *abstraction* is coded |
| Practice | produces the construct, not just recognises it | beginning competence |
| Lesson / Moral | gets the formal name + meaning | vocabulary + retention |

## 3. The Micro-Pipeline Inside Each Case Study

Each of the three current stories is built from the same discovery machine. The full worked chain for each story lives in **[CASE_STUDIES.md](CASE_STUDIES.md)**, following identical steps:

1. Scenario (the situation, no Python)
2. Scenario identification (what the character does)
3. Observation (what the learner notices)
4. Similarities (what stays consistent)
5. Differences (what changes)
6. Pattern (the inferred rule)
7. Reasoning (why the character acts)
8. Computational thinking (the abstract form)
9. Syntax reasoning (why that construct fits)
10. Python concept (the name)
11. Python representation (the code)
12. Practice mapping (what the learner reconstructs)
13. Learning outcome (what the learner understands)