# PyBe Storyline Framework

## Purpose of the Storyline Framework
This document defines the narrative architecture within PyBe's Product layer. It exists to answer a single structural question: **How are Storylines structured inside a World, and how do they organize learning experiences over time?**

This document acts as the definitive guide for product and narrative designers. It defines product narrative structure, completely distinct from pedagogical learning theories, curriculum mapping, or technical engine implementation.

## The Product Hierarchy: World vs. Storyline vs. Scenario
To prevent ambiguity across PyBe's product architecture, the boundaries between the three primary experiential layers must be explicitly maintained:

*   **World (The Place):** The overarching physical, systemic, and thematic setting.
*   **Storyline (The Plot):** The narrative arc and chronological sequence of events that occur within the World.
*   **Scenario (The Scene):** A single, isolated interaction or problem to be solved within the Storyline.

A Storyline serves as the critical connective tissue that bridges the vast environment of a World with the atomic interactions of a Scenario.

## The Function of Storylines in the Learner Experience
Storylines are not optional narrative decoration; they are the mechanism that transforms isolated coding tasks into a cohesive journey. 

Traditional educational platforms expose their curriculum directly to the user (e.g., "Module 1: Variables"). PyBe uses Storylines to mask the syllabus. Instead of confronting a sterile curriculum checklist, the learner engages with a compelling narrative objective (e.g., "Restore the Colony's Power Grid"). This design choice provides intrinsic motivation, maintains narrative momentum, and ensures that the act of learning feels like an organic consequence of exploring the story.

## Conceptual Structure of a Storyline
From a product design perspective, a Storyline is assembled using a strict conceptual anatomy:

1.  **Inciting Incident:** A narrative hook that establishes the overarching goal for the storyline (e.g., "The oxygen scrubbers have failed").
2.  **Sequential Scenarios:** A series of logically dependent Scenarios that escalate the challenge. Each Scenario represents a necessary step toward the overarching goal.
3.  **Narrative Resolution:** The conclusion of the arc, where the learner achieves the storyline's primary objective, permanently altering the state of the World before the next storyline begins.

This structure dictates how Scenarios are *grouped* and sequenced, but it deliberately avoids defining how an individual Scenario operates internally.

## Orchestrating Narrative Continuity
A core product requirement of PyBe is that learning must feel consequential. Therefore, Storylines are responsible for orchestrating narrative continuity across multiple Scenarios.

The outcome of Scenario A must logically serve as the context or hook for Scenario B. If a learner successfully repairs a communications array in Scenario A, the transmission received from that array must be the inciting incident for Scenario B. This unbroken chain of cause-and-effect ensures that the learner feels their actions persistently shape the World, driving deep immersion.

## Storylines as Carriers of Progression
Storylines provide the *feeling* of progress and forward momentum for the user. 

Completing Scenarios and ultimately resolving a Storyline visually and narratively communicates to the learner that they are advancing through the platform. The story moves forward, the environment changes, and new narrative horizons open up. However, the Storyline simply acts as the *carrier* of this experience; the actual mechanical logic of tracking mastery, allocating experience points, or unlocking gates is explicitly deferred to the platform's Progress System.

## Storyline Boundaries and Anti-Patterns
To protect the integrity of the product architecture, we must define what a Storyline is *not*:

*   **Not a Folder of Puzzles:** A Storyline is a cohesive, chronological plot. It cannot be used merely as a thematic bucket to hold fifty unrelated coding puzzles.
*   **Not Cross-World:** A Storyline exists strictly within the boundaries of a single World. Narrative arcs do not bleed across World boundaries.
*   **Not a Gatekeeper:** Storylines do not manage backend mastery gates or assessment algorithms. They organize the *experience*, not the underlying telemetry.
