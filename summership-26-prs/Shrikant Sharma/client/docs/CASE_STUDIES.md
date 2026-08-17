# Case Studies — PyKatha

Each story in PyKatha is a **case study** of one Python concept. Every case study walks the same 13-step chain — from the raw scenario (no Python) to the final Python code and the practice that reconstructs it. This makes the method explicit: if you can take any situation through this chain, you can decide *which* programming structure fits and *why*.

The three case studies are genuinely different patterns:

- **IF** — a condition controls *whether* an action happens.
- **WHILE** — an action *continues while* a condition remains true.
- **FOR** — an action *repeats once for each item* in a known set/sequence.

Each case study mirrors the real data in `src/stories/<id>/`, so the code shown here is the code the learner is revealed and practises.

---

## Case Study 1: Rabbit and the Moon → IF

### 1. Scenario

A young rabbit named Pip lives beside a wide river. Each evening the older rabbits see only water, but on certain nights a silver path appears across the surface. Pip's choice that night — to cross or not to cross — is his own.

### 2. Scenario Identification

The situation is a **decision point** at the riverbank: whether to step onto the water. Pip takes an action (crossing) only when a particular sign (the silver path) is present. The whole story is the story of that sign appearing, Pip choosing to trust it, and his crossing the river.

### 3. Observation

Across many nights, the same sign kept returning before Pip ever set paw to water: **a silver road stretched across the river**. When that sign was absent, Pip did not cross. The older rabbits dismissed the sign as "only a lamp" — proof that seeing the sign and *acting on it* were two different things.

### 4. Similarities

- Every time Pip trusted the river, the **silver path had already appeared** first.
- Every crossing followed the same order: *see the path → believe it is safe → cross*.
- The path itself was consistent: it always appeared at night, across the water, before he stepped.

### 5. Differences

- Some nights the moon was bright but **no path appeared** — on those nights Pip did not cross.
- Pip could have doubted and turned back (he considered it halfway), but the deciding sign was present.
- The older rabbits saw the same moon and never saw the path — the *interpretation*, not the sky, differed.

### 6. Pattern

The inferred rule:

> The crossing **depends on** a condition. The action happens **only when** the silver path is visible — and does not happen when it is not.

### 7. Reasoning

What caused Pip to act? Not the moon itself and not his desire alone — it was the **condition** of the path being visible. When the sign was present, the safe way existed and he crossed without fear; when the sign was missing, the safe way was gone and his own rule told him not to go.

### 8. Computational Thinking

Translate the observation into abstract logic:

> "The rabbit crosses only when the path is visible."

Abstract form:

```
IF condition is true
→ perform action
(otherwise, do nothing)
```

This is a **gate**: one condition decides whether a single action occurs. This is exactly what we later call a *conditional*.

### 9. Syntax Reasoning

Why is a conditional construct the right representation?

- The story has **one action** (crossing) and **one deciding condition** (path visible).
- The condition **controls whether** the action happens, and there is no repeat-and-check rhythm involved — the action happens *at most once* per decision.
- Nothing continues "while" anything, and nothing iterates over a list of items. The essence is a single **if-then** dependency.
- Therefore the appropriate structure is one that lets a condition decide whether an action runs — Python's `if` statement.

### 10. Python Concept

**The `if` statement** — a condition decides whether an action happens.

### 11. Python Representation

```python
if path_visible:
    cross()
```

### 12. Practice Mapping

The practice page shows `if ______:\n    cross()` with four option chips (`path_visible`, `sun_visible`, `water_high`, `rabbit_ready`). The learner must reconstruct the discovered logic: the condition that *gates* the crossing is the visibility of the path. Choosing `path_visible` produces the output **"Rabbit crosses the river."** — matching the story's rule.

### 13. Learning Outcome

> After this case study, the learner understands that an `if` represents a **decision controlled by a condition**: the action happens only when the condition is true. They can look at a new situation and recognise "this is a 'depends on' situation".

---

## Case Study 2: Crow and the Pitcher → WHILE

### 1. Scenario

A thirsty crow finds a clay pitcher whose mouth is too narrow to drink from. A little water sits at the bottom, out of reach. There are pebbles everywhere, and the crow has an idea: drop pebbles to raise the water.

### 2. Scenario Identification

The crow performs one action — **dropping a pebble** — over and over. That single action does not stop at a fixed count; it continues as long as the goal is unmet. The situation is a **repetition driven by an unmet condition**.

### 3. Observation

With **every** pebble, the water rose *a little*: one pebble in, the water crept a little higher. The crow checked his goal after each attempt and kept going. The story makes the rhythm visible: *Plink. Plink. Plink.*

### 4. Similarities

- Every repetition was the same unit of work: **one pebble dropped**, one small rise in the water.
- The condition that kept the crow working was always the same: **the water was still out of reach**.
- The crow applied the identical step until the stopping condition changed.

### 5. Differences

- The **state** changed each time: the water level rose with each pebble (what the story calls "the water shivered and crept higher").
- The **condition** eventually flipped: at first the water was out of reach; after enough pebbles it reached the brim — the crow then stopped, because the reason to continue was gone.

### 6. Pattern

The inferred rule:

> An action **keeps repeating while a condition remains true**, and stops the moment that condition becomes false.

### 7. Reasoning

Why did the crow keep dropping pebbles? Because **the water was still out of reach** — the goal condition (water within drinking distance) had not been met. The moment the water reached the brim, the out-of-reach condition was no longer true, so the repetition ended. Not a fixed "drop ten pebbles" — a condition-driven continuation.

### 8. Computational Thinking

Translate the observation into abstract logic:

> "Keep dropping pebbles while the water is out of reach."

Abstract form:

```
WHILE condition is true
→ perform action
(stop when the condition becomes false)
```

### 9. Syntax Reasoning

Why is a "repeat-while-condition" construct the right representation?

- There is **no known set** of items to walk through (so iteration-over-set is wrong — the pebbles are unlimited).
- The repetition is **not fixed count**; it depends on the current state (the water level).
- The action and the condition are evaluated **repeatedly**: check the water, drop a pebble, check again.
- The crow checks *before or during each repetition* whether the reason to continue still holds — precisely the behaviour of Python's `while` loop, which evaluates the condition and repeats the body while it remains true.

### 10. Python Concept

**The `while` loop** — a step repeats while a condition stays true.

### 11. Python Representation

```python
while water_out_of_reach:
    drop_pebble()
```

### 12. Practice Mapping

The practice page shows `while ______:\n    drop_pebble()` with option chips (`water_out_of_reach`, `pebble_count`, `sun_is_up`, `wind_blows`). The learner must pick the condition that the story looped on: **the water being out of reach** (not a count, not the weather). Choosing it produces **"The crow drinks the water."** — the goal state the loop was waiting for.

### 13. Learning Outcome

> After this case study, the learner understands that a `while` loop represents a **repetition controlled by a condition**: keep doing the action while the condition stays true, and stop when it turns false. They can look at a new situation and recognise "this is a 'keeps happening while' situation".

---

## Case Study 3: The Turtle's Journey → FOR

### 1. Scenario

Turtle sets out for a far meadow. The road is known — past the old oak, across the stepping stones, through the pines to the meadow — and it is marked by milestones. Turtle is slow; the hares race past. But Turtle walks the road one milestone at a time.

### 2. Scenario Identification

Turtle performs one action — **reaching a milestone** — once for each place on a known road. The journey is a **known set of stages in a fixed order**: oak → pines → meadow. Every stage gets the same treatment, and there is nothing to wait for or "while" checking; the set is what it is.

### 3. Observation

The road was carved into clear stages, each marked by a **milestone post with a flag**. Turtle's rhythm repeated for every stage: arrive at a milestone, then aim for the next. He treated each milestone the same way — including one that wasn't foreseen (a fourth milestone "would just be reached like the others").

### 4. Similarities

- Every stage of the journey got the **same action**: Turtle walked to it, one careful step at a time.
- The milestones were all alike: "a small post with a red flag".
- The sequence was **known in advance** — the meadow did not move.

### 5. Differences

- The **items** themselves differed: oak, stepping stones, pines, meadow — each a different place.
- The **count** could even change (a hypothetical fourth milestone would just be added to the road).
- What the hares did differed (they raced), but Turtle's handling of each milestone stayed uniform.

### 6. Pattern

The inferred rule:

> An action happens **once for each item** in a known set, in the set's order.

### 7. Reasoning

Why did Turtle act the way he did? Because the road — the set of stages — was already known to him, and each stage's turn came by position in that set. He did not hurry (no condition to chase) and did not skip (every item gets a turn). "A journey is only one step long, and one step more, and one step more" — the iteration *is* the journey.

### 8. Computational Thinking

Translate the observation into abstract logic:

> "For each milestone in the journey, reach that milestone."

Abstract form:

```
FOR every item in the set
→ perform action on that item
(repeat once per item, in order)
```

### 9. Syntax Reasoning

Why is an iteration-over-a-set construct the right representation?

- The work repeats a **known, enumerable number of times** — once per item in a set/sequence (the milestones).
- There is **no condition** to keep checking while (unlike the crow) — the loop ends when the items run out.
- The action naturally varies per item (reach *the pines*, reach *the meadow*), so the construct should give each item a name — exactly what Python's `for ... in <collection>` does: it iterates over the collection and runs the body once per element, binding each element to the loop variable `milestone`.

### 10. Python Concept

**The `for` loop** — a step repeats once for each thing in a known set.

### 11. Python Representation

```python
for milestone in journey:
    reach(milestone)
```

### 12. Practice Mapping

The practice page shows `for step in ______:\n    take(step)` with option chips (`journey`, `rainfall`, `meadow`, `oak_tree`). The learner must pick the **whole known set** the loop iterates over — `journey` — rather than a single member of it (meadow, oak). Choosing it produces **"The turtle reaches the meadow."** — the final line of the story.

### 13. Learning Outcome

> After this case study, the learner understands that a `for` loop represents **one action repeated once per item of a known set/sequence**, in order. They can look at a new situation and recognise "this is a 'once for each item' situation" — and they can distinguish it from "while a condition holds".

---

## How the Three Case Studies Relate (and Don't Overlap)

| Situation shape | Story rule | Structure |
|---|---|---|
| "Y happens **only when** X" | gate by a condition | `if` |
| "Y keeps happening **while** X stays true" | repetition by condition | `while` |
| "Y happens **once for each** item in the set" | iteration over known items | `for` |

These three shapes are the three fundamental control flows. Recognising which shape a situation has is the skill PyKatha trains; the syntax is simply the expression of the recognised shape.