# Design Principles — Story-Based Discovery Learning

## Purpose

This document turns the philosophy behind story-based discovery
learning into rules a contributor can check a lesson against, and a
reviewer can check a submission against. The reasoning behind it — why
it's designed this way and how it was validated — lives in
`product-document.md`. This file does not re-argue that reasoning; it
applies it. Where this document mentions "the framework" or "the
six-stage sequence," see `product-document.md`'s "Status of this
contribution" — this PR implements these principles for one lesson
(Adder), as a five-screen flow, not the full six-stage target design.

## Core Principle

Every lesson must help learners discover a programming concept through
reasoning before introducing Python syntax.

This is the single rule every other principle in this document exists to
protect. Where any design decision conflicts with it — for convenience,
for brevity, or because a new concept seems hard to fit into the existing
flow — this principle takes precedence. A lesson that violates it is not
a variation of this approach; it is a different kind of lesson.

Adder, as implemented in this PR, follows this principle throughout:
`client/src/lessons/screens/StoryScreen.jsx` and `QuestionsScreen.jsx`
contain no Python at all; `PythonScreen.jsx` is the first (and only)
screen where code appears, and only after `DiscoveryScreen.jsx` has
already led the learner to state the underlying concept themselves.

## Principles Followed

| Principle | What it requires | How Adder satisfies it |
|---|---|---|
| Story before syntax | No Python or programming vocabulary appears before the Discovery stage. | `StoryScreen.jsx` and `QuestionsScreen.jsx` contain no code. |
| Observation before explanation | The learner states what is happening in the story, and why, before any concept is named. | `QuestionsScreen.jsx`'s five comprehension questions, answered before Discovery. |
| Guided discovery | The learner is led to the pattern through questions, never told the pattern directly. | `DiscoveryScreen.jsx`'s three prompts require a typed reflection before revealing the answer. |
| Concept before code | The discovered pattern is shown back to the learner in plain terms before it is translated into Python. | `PythonScreen.jsx`'s explainer (input/job/output/reusability) renders before its multiple-choice step. |
| Active participation | Every screen requires the learner to answer, choose, or act — none can be passed by reading alone. | Every screen in `client/src/lessons/screens/` requires a click, selection, or typed input to advance. |
| Immediate feedback | The learner learns whether their reasoning is correct at the point they give it, not at the end of the lesson. | `QuestionsScreen.jsx` and `PythonScreen.jsx` both show correct/incorrect feedback on selection, not deferred. |
| Reusable structure | A new lesson is written as content for the existing screens, not as a new sequence of screens. | `content/adderContent.js` is the only lesson-specific file among the five screens — see `AdderLesson.jsx`'s design in `system-design.md`. |
| Incremental complexity | Each lesson introduces exactly one new idea beyond what a learner already knows from a prior lesson. | Adder introduces exactly one concept (functions); not evaluated across multiple lessons yet, since only one exists in this repository. |

## Principles Intentionally Avoided

| Avoided | Why it's excluded here |
|---|---|
| Syntax-first teaching | Introducing Python before Discovery breaks the Core Principle directly. |
| Memorization-based checks | Checks are against the learner's reasoning about the situation, not recall of a definition. |
| Showing code immediately | Withholding Python until after Discovery is not a stylistic choice — it is the mechanism the Core Principle depends on. |
| Passive reading screens | A screen that can be advanced without an answer or action does not qualify as part of this approach. |
| Long theoretical explanation | Concepts are reached through a situation, not through a paragraph defining them. |
| Concepts taught without real-world grounding | A concept introduced with no situation behind it does not belong in this approach, regardless of how the syntax is presented. |

## How to Apply These Principles to a New Lesson

Before considering a new lesson complete, a contributor should be able to
answer yes to each of the following:

- [ ] Does Python appear only after the Discovery screen, with no
      exceptions?
- [ ] Can a learner state the pattern (the repeated action, the
      condition, the relationship, or equivalent) in their own words
      before Python is shown?
- [ ] Does every screen require the learner to act, rather than only
      read?
- [ ] Is the opening story understandable with no prior programming
      knowledge?
- [ ] Does the lesson end by asking the learner to apply or recap the
      idea, rather than simply stopping?
- [ ] Does the lesson introduce exactly one new concept, rather than
      several at once?

A lesson that fails any of these checks is not ready, regardless of how
polished its story or visuals are. All six checks were verified for
Adder during Versions 0.1–0.5 — see `version-history.md`'s
"Testing Performed" sections for how each screen was actually verified,
not just asserted.

## Extending Toward Additional Lessons

This PR implements one lesson. If a future contribution proposes a
second one, the same core principle applies regardless of how the
lesson is technically structured:

- A concept whose shape matches Adder's (a bounded call-and-return
  interaction) could likely reuse the existing screen types as-is,
  adding only new content.
- A concept requiring a genuinely different shape (e.g. repetition,
  as in the external Thirsty Crow prototype referenced in
  `product-document.md`) would require a new screen type or a new
  interaction pattern, added deliberately rather than by forcing the
  concept into a shape it doesn't fit.
- Whatever the shape, no stage may be skipped to make a new concept fit
  faster: a lesson that drops guided discovery, immediate feedback, or
  active participation to save effort has broken the Core Principle,
  not adapted it.

This section describes principles to apply *if* a future lesson is
proposed — it commits this contribution to nothing beyond Adder.
