# Design Principles — Story-Based Discovery Learning Framework

## Purpose

This document turns the framework's philosophy into rules a contributor
can check a lesson against, and a reviewer can check a submission
against. The reasoning behind the framework — why it's designed this way
and how it was validated — lives in `02_Product_Document.md`. This file
does not re-argue that reasoning; it applies it.

## Core Principle

Every lesson must help learners discover a programming concept through
reasoning before introducing Python syntax.

This is the single rule every other principle in this document exists to
protect. Where any design decision conflicts with it — for convenience,
for brevity, or because a new concept seems hard to fit into the existing
flow — this principle takes precedence. A lesson that violates it is not
a variation of the framework; it is a different kind of lesson.

## Principles Followed

| Principle | What it requires |
|---|---|
| Story before syntax | No Python or programming vocabulary appears before the Discovery stage. |
| Observation before explanation | The learner states what is happening in the story, and why, before any concept is named. |
| Guided discovery | The learner is led to the pattern through questions, never told the pattern directly. |
| Concept before code | The discovered pattern is shown back to the learner in plain terms before it is translated into Python. |
| Algorithm before syntax | The logic is expressed as a sequence of steps and decisions before it is expressed in Python. |
| Active participation | Every screen requires the learner to answer, choose, or act — none can be passed by reading alone. |
| Immediate feedback | The learner learns whether their reasoning is correct at the point they give it, not at the end of the lesson. |
| Reflection after implementation | Every lesson closes by asking the learner to apply the idea to a new situation. |
| Reusable structure | A new lesson is written as content for the existing stages, not as a new sequence of stages. |
| Incremental complexity | Each lesson introduces exactly one new idea beyond what a learner already knows from a prior lesson. |

## Principles Intentionally Avoided

| Avoided | Why it's excluded here |
|---|---|
| Syntax-first teaching | Introducing Python before Discovery breaks the Core Principle directly. |
| Memorization-based checks | Checks are against the learner's reasoning about the situation, not recall of a definition. |
| Showing code immediately | Withholding Python until after Discovery is not a stylistic choice — it is the mechanism the Core Principle depends on. |
| Passive reading screens | A screen that can be advanced without an answer or action does not qualify as part of this flow. |
| Long theoretical explanation | Concepts are reached through a situation, not through a paragraph defining them. |
| Concepts taught without real-world grounding | A concept introduced with no situation behind it does not belong in this framework, regardless of how the syntax is presented. |

## How to Apply These Principles to a New Lesson

Before considering a new lesson complete, a contributor should be able to
answer yes to each of the following:

- [ ] Does Python appear only after the Discovery stage, with no
      exceptions?
- [ ] Can a learner state the pattern (the repeated action, the
      condition, the relationship, or equivalent) in their own words
      before Python is shown?
- [ ] Does every screen require the learner to act, rather than only
      read?
- [ ] Is the opening story understandable with no prior programming
      knowledge?
- [ ] Does the lesson end by asking the learner to apply the idea to a
      situation other than the one in the story?
- [ ] Does the lesson introduce exactly one new concept, rather than
      several at once?

A lesson that fails any of these checks is not ready, regardless of how
polished its story or visuals are.

## Extending the Framework Without Breaking the Philosophy

Some concepts fit the existing flow directly. Others — as functions did —
require the flow to be extended with a new capability because the
concept's shape doesn't match repetition-and-condition. Both are
legitimate ways for the framework to grow. What is not legitimate is
using the need for a new capability as a reason to skip a stage of the
flow.

When a new concept doesn't fit cleanly:

- Add the capability the concept genuinely requires (for example, a
  multi-step story, or a different kind of interactive simulation).
- Keep the six-stage sequence intact around that capability — Story,
  Observation Questions, Discovery, Python Translation, Interactive
  Simulation, and Reflection still all apply, in order.
- Do not shorten or merge stages to make a new concept fit faster. If a
  concept genuinely cannot support one of the six stages, that is a sign
  the framework needs a documented exception, not a sign the contributor
  should quietly omit it.

A lesson that required a new capability to satisfy the Core Principle has
extended the framework. A lesson that dropped a stage to avoid building
that capability has broken it.
