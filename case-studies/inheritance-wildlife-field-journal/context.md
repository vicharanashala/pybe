# context.md — The Problem This Feature Solves

## Author: Pritam Patra
## Feature: Inheritance Discovery Engine

---

## Why Traditional Learning Approaches Fail

Most programming tutorials — and even many "interactive" apps — teach concepts in one of two ways:

1. **Tell, then test:** "A parent class is a class that other classes inherit from. Now answer this MCQ."
2. **Drill syntax first:** Show `class Eagle(Animal):`, explain it, then ask the learner to reproduce it.

Both approaches share a critical flaw: **the concept is handed to the learner before they have any reason to care about it.**

The instructor said it clearly:

> *"We don't want to be concentrating more on the syntax. You give a case so that you keep exploring it and eventually you understand."*

And further:

> *"I don't want to see those traditional multiple choice this is correct this is wrong. Think something which could benefit."*

---

## The Core Insight: Discovery Before Definition

Humans understand abstract concepts most durably when they arrive at the concept themselves — through observation and analogy — before a formal label is applied.

A learner who notices that "every animal breathes, moves, and eats — and the Eagle does all of those AND also flies" has already grasped the structure of inheritance. The word "inheritance" is just a name for what they already understood.

This is called **concept-before-label learning**, and it is the pedagogical foundation of this feature.

---

## What We Mean by "Beginner", "Explorer", "Builder"

The instructor asked: *"Where do you draw the line? What do you mean by intermediate easy?"*

In the Inheritance Discovery Engine, we deliberately avoid attaching fixed difficulty labels to questions. Instead, we define progress as **depth of observation**:

| Level | What it looks like |
|---|---|
| Surface | "All animals have things in common." |
| Structural | "The Eagle has the same traits as all animals AND one extra." |
| Relational | "The Eagle's extra trait builds ON TOP of the shared animal foundation." |
| Transferable | "A smartphone is like an Eagle — it inherits phone features and adds a camera." |

The LLM evaluator uses these depth levels, not pass/fail labels, to determine when a learner is ready to move forward.

---

## Why Inheritance Was Chosen

Inheritance is:
- **Deeply intuitive in the real world** — biology, organizations, legal systems all use inheritance structures.
- **Often misunderstood in code** — learners see `class Eagle(Animal):` as syntax magic, not as a design decision.
- **A gateway concept** — understanding inheritance unlocks polymorphism, encapsulation, and the entire OOP paradigm.

By building Inheritance Discovery, this module directly addresses the "concept > syntax" philosophy that PyBe is founded on.
