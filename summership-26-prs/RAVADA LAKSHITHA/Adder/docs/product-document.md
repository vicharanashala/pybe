# Product Document — Story-Based Discovery Learning

## Status of this contribution

This document describes the educational philosophy behind
story-based discovery learning and the design it implies. **This PR
implements that philosophy for one lesson — Adder (functions) —
integrated into the official PyBe repository.** The two other case
studies referenced below (Thirsty Crow, Crane and Fish) are standalone
external prototypes, not part of this contribution's codebase changes;
they're discussed here as evidence the philosophy generalizes, not as
something this PR merges. See `essential-docs.md`, "Scope of this
contribution," for the exact boundary, and
`docs/lessons/README.md` for what was actually built.

The six-stage flow described later in this document (Story →
Observation Questions → Discovery → Python Translation → Interactive
Simulation → Reflection) is the framework's target design, informed by
all three case studies. What Adder actually implements in this PR is a
five-screen version of it — Story → Questions → Discovery → Python
Translation → Summary — where the Discovery screen's keyword-checked
reflection prompt does the job the target design assigns to a
separate Reflection stage, and no standalone Interactive Simulation
stage was built (the educational point was judged already made by the
time the learner completes the Python Translation step). See
`docs/lessons/formal-specification.md` for the exact delivered
flow and the reasoning behind that scoping decision.

## Vision

This work is built around one guiding philosophy: Think First →
Discover Next → Code Last. Instead of opening with a construct's name
or its syntax, a lesson opens with a situation the learner can reason
about, and lets them discover the underlying pattern for themselves
before Python is introduced as a way of expressing what they have
already understood. The sections that follow explain the problem this
addresses, the philosophy behind it, and how a lesson built on it is
structured and demonstrated.

## Problem

Most introductions to a programming concept begin with its name and its
syntax, then work backward to an example that justifies it. A learner is
shown a construct, told what it's called, and given a problem it happens
to solve. The concept arrives before any need for it does, so the
learner has little to anchor it to besides memory. The result is a
learner who can often reproduce syntax without being able to explain, in
their own words, why it's shaped the way it is or when they'd reach for
it unprompted.

## Challenges with Syntax-First Learning

Syntax-first teaching is efficient at transmitting a construct's form,
but it separates the construct from the reasoning that would normally
produce it. A `while` loop, for instance, exists because something has to
repeat until a condition is met — but if the loop is introduced before
the learner has ever reasoned about a repeating, condition-bound
situation, that motivation has to be supplied afterward, as an example
retrofitted to the syntax rather than a problem the syntax grew out of.
Over time, this ordering trains learners to look for the concept a
problem "wants" rather than to notice the pattern in the problem itself —
which is the reverse of how the same idea would be reasoned about outside
of a classroom.

## Educational Philosophy

This work is built around one guiding principle:

```
Think First → Discover Next → Code Last
```

A learner should understand *why* an idea is needed, in a situation they
can already reason about, before they are told that idea's name — and
long before they see its Python syntax.

## Design Goals

Translating that philosophy into a lesson requires more than good intent;
it requires specific, checkable objectives that any lesson must satisfy:

- The learner must be able to state the underlying pattern — the
  repeated action, the condition, the relationship — in their own words
  before any Python appears.
- Every screen must require the learner to act (answer, choose, run a
  step) rather than simply read through to the next one.
- The concept must be reachable from a situation the learner can already
  reason about, without prior programming knowledge.
- Feedback on the learner's reasoning must be immediate, not deferred
  until a final answer.
- The lesson must end by asking the learner to apply the idea somewhere
  new, so understanding is checked for transfer rather than recall of
  the original story.

These goals are what a lesson's structure exists to satisfy — the
sequence described next is a direct answer to them, not a separate design
decision.

## Target Flow

The intended sequence for a lesson built on this philosophy, regardless
of which Python concept it teaches:

```
Story → Observation Questions → Discovery → Python Translation
      → Interactive Simulation → Reflection
```

A lesson is added by supplying content for each stage — the story, the
questions, the discovered pattern, the translation, the simulation, and
the reflection prompts — not by designing a new sequence of stages. As
noted in "Status of this contribution" above, Adder — the lesson this
PR actually delivers — implements a five-screen version of this target,
folding the Reflection stage's job into Discovery and omitting a
standalone Interactive Simulation stage for this first lesson.

## Learning Flow (target design)

| Stage | What happens | What is deliberately withheld |
|---|---|---|
| Story | A short, self-contained situation is presented. | No programming language of any kind. |
| Observation Questions | The learner answers what is happening and why, in plain terms, with immediate feedback. | Python is not revealed under any circumstance. |
| Discovery | The pattern the learner identified — the repeated action, the condition, the relationship — is shown back to them explicitly. | Code or syntax of any kind. |
| Python Translation | The Python construct is introduced, framed as a way of writing the already-discovered pattern down. | Nothing further — this is where Python first appears. |
| Interactive Simulation | The learner runs the logic themselves, step by step. | Passive playback; the learner must act to advance. |
| Reflection | The learner is asked to connect the idea to a different situation. | A closing summary that doesn't require a response. |

No stage may be skipped or reordered. A lesson cannot show Python before
Discovery, and Discovery cannot exist before the learner has answered the
Observation Questions.

## Case Studies

**Adder (functions) — implemented in this PR.** A character can be
called on to add two numbers and return their sum, without needing to
know anything about where the numbers come from or what happens to the
result. This lesson does not involve repetition at all; the learner
instead discovers the idea of a bounded, callable task with a returned
result.

**Thirsty Crow (loops) — external prototype, not part of this PR.** A
crow drops stones into a pot to raise the water level. The learner
identifies the repeated action and the stopping condition before
meeting `while`. This prototype established the baseline shape the
target flow is built around: something repeats until a condition is
met.

**Crane and Fish (conditional statements) — external prototype, not
part of this PR.** A crane must decide which fish to strike at as they
swim past. This prototype reuses the same repetition shape as Thirsty
Crow but adds a decision made *inside* the repeated action — motivating
`if` as a distinct idea from the loop itself.

Together, these three case studies (one implemented here, two external)
suggest the target flow can accommodate both a concept sharing an
existing shape and one introducing a new one — a property worth
validating further if this contribution leads to future lessons being
proposed for the official repository.

## Possible Future Directions

If this contribution is accepted and a second lesson is proposed for
PyBe, the shape of that lesson would determine the cost of adding it:

- A concept whose shape matches Adder's (a bounded call-and-return
  interaction) could likely be added as new content within the
  existing five-screen pattern, with no change to `AdderLesson.jsx`'s
  orchestration logic beyond adding a second lesson to choose between.
- A concept requiring a genuinely different shape — repetition (as in
  the external Thirsty Crow prototype), recursion, or something else —
  would require extending the screens/orchestrator with a new
  capability, the way this contribution's own scoping decisions
  (documented in `docs/lessons/version-history.md`) chose to
  defer a standalone Interactive Simulation stage for now.

This section is intentionally speculative — no second lesson exists in
this repository yet, and this contribution makes no commitment about
what comes next. It's included to show the reasoning holds up beyond
one example, not as a roadmap.
