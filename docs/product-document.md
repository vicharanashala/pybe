# Product Document — Story-Based Discovery Learning Framework

## Vision

This contribution introduces a reusable framework for teaching Python
concepts through story-based discovery rather than syntax. It is built
around one guiding philosophy: Think First → Discover Next → Code Last.
Instead of opening with a construct's name or its syntax, each lesson
opens with a situation the learner can reason about, and lets them
discover the underlying pattern for themselves before Python is
introduced as a way of expressing what they have already understood. The
sections that follow explain the problem this addresses, the philosophy
behind it, and how the framework itself is structured and demonstrated.

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

This framework is built around one guiding principle:

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

These goals are what the framework's structure exists to satisfy — the
sequence described next is a direct answer to them, not a separate design
decision.

## Framework Overview

Every lesson built on this framework passes through the same fixed
sequence of stages, regardless of which Python concept it teaches:

```
Story → Observation Questions → Discovery → Python Translation
      → Interactive Simulation → Reflection
```

A lesson is added by supplying content for each stage — the story, the
questions, the discovered pattern, the translation, the simulation, and
the reflection prompts — not by designing a new sequence of stages. The
sequence itself is the reusable part of the framework; the content is
what changes from one lesson to the next.

## Learning Flow

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
Observation Questions. This ordering is the actual mechanism of the
philosophy — it is enforced by the sequence, not asserted as a value
statement layered on top of the lessons.

## Case Studies as Examples

Three lessons currently instantiate this flow, each chosen to exercise it
differently rather than to simply cover three topics:

**Thirsty Crow (loops).** A crow drops stones into a pot to raise the
water level. The learner identifies the repeated action and the stopping
condition before meeting `while`. This lesson established the baseline
shape the flow is built around: something repeats until a condition is
met.

**Crane and Fish (conditional statements).** A crane must decide which
fish to strike at as they swim past. This lesson reuses the same
repetition shape as Thirsty Crow but adds a decision made *inside* the
repeated action, rather than only controlling when it stops — motivating
`if` as a distinct idea from the loop itself.

**Adder (functions).** A character can be called on to add two numbers
and return their sum, without needing to know anything about where the
numbers come from or what happens to the result. This lesson does not
involve repetition at all; the learner instead discovers the idea of a
bounded, callable task with a returned result — a different shape
entirely from the first two lessons.

Together, these three lessons demonstrate that the flow accommodates both
lessons sharing a shape and lessons introducing a new one — which is the
property the framework depends on to be worth extending further.

## Why the Framework Scales

A new lesson's cost depends on whether its concept shares an existing
shape or introduces a new one:

- Lessons that share a shape already in use can be added as pure
  content — a new story, new questions, and a new translation — with no
  change to the underlying flow. Crane and Fish is evidence of this: it
  reuses the same repetition shape established by Thirsty Crow, adding
  only the one new idea of a decision inside the repeated action,
  without requiring any change to the flow itself.
- Lessons whose concept has a genuinely different shape require the flow
  to be extended with a new capability, as Adder did to support a
  bounded call-and-return interaction in place of repetition. Once added,
  that capability becomes available to any future lesson that needs the
  same shape — it does not need to be rebuilt per lesson.

In both cases, lessons already built on the framework continue to work
unchanged. Extending the framework for a new shape does not require
revisiting the lessons that don't need it.

## Future Extensions

The framework is intended to grow beyond its current three lessons.
Likely next concepts, and the shape each is expected to need:

| Concept | Expected shape |
|---|---|
| Recursion | New — likely requires a capability for representing a call stack, distinct from both repetition and single call-and-return. |
| Lists | Existing — a collection discovered through a situation requiring many related values, expressed with the current flow. |
| Dictionaries | Existing — a lookup or mapping situation, expressed with the current flow. |
| Classes | New — likely requires a capability for representing an object with both state and behavior. |

The framework's value is measured by whether a new lesson, whatever
concept it teaches, can still be walked through Story → Observation
Questions → Discovery → Python Translation → Interactive Simulation →
Reflection without breaking that order. That is the standard any future
contribution to this framework should be held to.
