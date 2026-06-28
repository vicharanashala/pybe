# PyBe Scenario Engine (Interaction Model)

## Purpose of the Scenario Interaction Model
This document defines the core interaction model of the PyBe platform. It answers the fundamental product question: **What is a Scenario in PyBe, and how does it function as the atomic unit of learning interaction?**

This document establishes the *product experience* of interacting with a problem. It is written for product designers and UX developers, explicitly separating the user experience of a Scenario from the backend execution engines that power it, and the pedagogical theories that govern it.

## Defining the "Scenario" Concept
In PyBe, a **Scenario** is a self-contained, goal-driven interactive situation where a learner must reason about a system, act upon it, and observe the consequences. 

It is the atomic unit of active learning. It is the specific, bounded moment where the narrative pauses, the rules of the World crystallize into a concrete problem, and the user is required to intervene. If the learner is passively reading or watching, they are not in a Scenario.

## The Product Hierarchy: Storyline vs. Scenario
To prevent ambiguity at the boundaries of the product layers, we must strictly define where a Storyline ends and a Scenario begins.

If the World is the *Place*, and the Storyline is the *Plot*, the Scenario is the *Interactive Scene*. A Storyline delivers the narrative hook and establishes the context (e.g., "The airlock is jammed"), but the Scenario is the isolated interface where the user actually interacts with the airlock's control logic. A Storyline strings Scenarios together, but the Scenario is the atomic interaction itself.

## The Anatomy of an Interactive Scenario
To create a valid Scenario, a product designer must conceptualize and build the following UX components:

1. **The Initial State:** The default condition of the system when the learner arrives (e.g., power is failing, data is unformatted).
2. **The Constraint:** The specific systemic blockage or rule that prevents the learner from reaching the goal state using obvious, brute-force methods.
3. **The Interactive Sandbox:** The safe UX space where the learner inputs their logic and tests their hypotheses without permanently breaking the World.
4. **The Resolution Condition:** The specific state change that signals success and allows the overarching Storyline to proceed.

## The Experiential Lifecycle (The Interaction Loop)
Inside a Scenario, the user experiences a high-level, repeating interaction flow:

1. **Observation:** The learner views the Initial State and identifies the Constraint.
2. **Action:** The learner inputs logic into the Interactive Sandbox.
3. **Consequence:** The system reacts visually and logically to the learner's input.

If the Consequence does not meet the Resolution Condition, the learner loops back to Observation. This cycle continues until the constraints are successfully cleared. This describes the user flow conceptually, entirely independent of the technical state-machines evaluating the code.

## Scenarios as Feedback Containers
A Scenario is the primary product surface where system feedback is delivered to the learner. 

To accommodate PyBe's pedagogical requirement for "productive failure," the Scenario UX must conceptually pause and present consequences when a user takes an incorrect action. The Scenario acts as the physical container that displays these consequences. It dictates *where and how* the feedback manifests in the user interface, explicitly deferring the rules on *how to write the feedback* to Learning Strategies and *how to evaluate the failure* to Assessment Models.

## Scenario Boundaries and Anti-Patterns
To protect the integrity of this atomic unit from feature creep, we must define what a Scenario is *not*:

* **Not a Quiz:** A Scenario is never a static multiple-choice screen. It must involve systemic interaction.
* **Not an Open-World Sandbox:** A Scenario is tightly constrained to a specific problem. It is not a blank canvas for unstructured coding.
* **Not a Progression Tracker:** A Scenario provides the interaction, but it does not manage or display global mastery tracking, XP, or unlocking algorithms. Those belong to the platform's Progress System.
