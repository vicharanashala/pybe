# PyBe Progress System (Learner Journey)

## Purpose of the Progress System
This document establishes the definitive guide to the user-facing experience of momentum, availability, and progression in the Product layer. It answers one core question: **How does progression work from the learner's perspective throughout the product?**

Progression in PyBe is defined as the *experiential signaling of forward momentum and state change*. It is how the product communicates to the user that their actions have permanently advanced their position in the universe. This document separates the *feeling* of progress from the narrative logic (Storylines) and the pedagogical value (Assessment).

## Principles of Progression UX (Anti-Gamification)
All progression interfaces in PyBe are governed by strict design rules designed to foster intrinsic motivation and prevent superficial engagement:
- **Narrative over Numeric:** Progress is shown through environmental change and expanded narrative context, not increasing numbers.
- **Consequential, not Arbitrary:** Rewards are intrinsic to the story (e.g., unlocking a new sector of the map, gaining access to a new diagnostic tool) rather than extrinsic (e.g., receiving a gold star).
- **No Artificial Gamification:** PyBe explicitly bans XP bars, leaderboards, badges, and arbitrary point systems. These mechanisms distract from systemic problem-solving.

## The Learner State Model (Conceptual Progression States)
To maintain a consistent UX across the platform, every learner-facing entity (Scenarios, Storylines, Worlds) must adhere to a universal conceptual lifecycle. From the user's perspective, content will always exist in one of the following states:
- **Locked:** The content is visible to create anticipation, but inaccessible.
- **Available:** The content is unlocked and ready to be initiated by the learner.
- **Active (In Progress):** The content is currently being engaged by the learner.
- **Completed:** The content has been successfully resolved and is visually distinct from Available content.
- **Revisited:** The content is optionally accessible for review or alternative solutions, distinct from a first-time playthrough.

This model dictates *whether the user is allowed to access content* and *what it looks like to them*, distinct from the backend algorithms that track these states.

## Experiencing Micro-Milestones (Scenario Transitions)
The smallest unit of forward momentum is the completion of a Scenario. 

When an individual Scenario moves from *Active* to *Completed*, the interface must signal micro-closure. This transition is immediate and seamless (e.g., the jammed door visually slides open, the terminal flashes a green "Online" status) before introducing the narrative hook of the next *Available* Scenario. It provides immediate satisfaction without breaking immersion.

## Experiencing Meso-Milestones (Storyline Culmination)
Completing a major narrative arc requires a heavier transition. 

When a sequence of Scenarios concludes and a Storyline moves to *Completed*, the interface must pause to let the user absorb the culmination of their efforts. This might involve a major visual change to the World or a narrative summary, providing a deep sense of closure before establishing a new set of *Available* Storylines.

## Experiencing Macro-Milestones (World Traversal)
The highest-level progression interface in the platform is the act of leaving one World and discovering another. 

This UX handles the "macro-map" or "travel" interface, allowing the user to see the scale of the universe. When a new World transitions to *Available*, the interface must emphasize the leap in complexity and setting, providing the ultimate sense of platform-wide progression.

## The Journey Record (Persistent World Transformation)
PyBe replaces the traditional "gradebook" or "skill tree" with an immersive product equivalent: The Journey Record.

Rather than providing a static dashboard of scores, the product persistently reflects a history of learner actions through **Persistent World Transformation**. The product proves the learner was there—environments remain visibly repaired, NPCs' dialogue is permanently altered to reflect past victories, and the learner builds a persistent logbook of collected systemic tools. The World itself becomes the record of their progress and competency.

## Architectural Boundaries (What Progression is NOT)
To protect the integrity of the Product layer, we must explicitly state what this system does *not* cover. 
This document does **not** define unlocking algorithms, telemetry tracking, backend database schemas, or the mathematical criteria for mastery. It only defines the *UX surface area* that reacts to those backend systems.
