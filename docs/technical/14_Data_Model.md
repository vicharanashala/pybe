# PyBe Conceptual Data Model

## Purpose of the Conceptual Data Model
This document establishes the definitive Domain-Driven Design (DDD) guide for the PyBe platform. It defines the canonical domain entities, their ownership boundaries, and their lifecycles. 

This is a pure conceptual model. It is completely independent of databases, persistence technologies, API schemas, or deployment topologies. It explicitly bans the use of database terminology (such as SQL, primary keys, or tables) to ensure that the business rules and domain logic defined here survive any future infrastructure changes.

## Conceptual Domain Overview (The Entity Map)
Before defining specific entities, it is crucial to understand the conceptual topology of the business domain. The system data is structured hierarchically and associatively:

**Hierarchical Containment (Ownership):**
* A **World** contains **Storylines**.
* A **Storyline** contains **Scenarios**.
* A **Scenario** contains **Challenges** (and associated narrative assets).

**Associative Relationships (References):**
* A **Learning Session** references exactly one *Learner* and one *Scenario*.
* An **Assessment Result** references exactly one *Learning Session*.
* A **Learner State** references a specific *Content Entity* (e.g., a Scenario) and belongs to a *Learner*.

## Domain Identity and Ownership
To prevent structural degradation, the architecture enforces strict rules regarding identity and ownership:

* **Identity:** An entity possesses conceptual uniqueness over time (e.g., a *Learner* remains the same entity even if their name changes). If an object's uniqueness is defined purely by its properties (e.g., a specific set of x/y coordinates, or a string of dialogue), it is a *Value Object*, not an entity.
* **Entities vs. Value Objects:** "Narrative Text", "Dialogue", and "Initial State Constraints" are Value Objects owned by a Scenario or Storyline. They do not possess independent lifecycles.
* **Aggregate Roots:** The top-level entities (World, Storyline, Scenario, Learner) act as Aggregate Roots. This establishes a strict ownership boundary: you cannot logically retrieve, modify, or reference a nested *Challenge* without first passing through its owning *Scenario*.

## Domain Modeling Principles (Immutability & Lifecycle)
All domain entities are categorized into four strict lifecycle quadrants. This categorizes how an entity behaves over time and prevents engineers from inadvertently modifying data that should remain static:

1. **Immutable:** Content that can never change at runtime.
2. **Ephemeral:** Objects that exist only during an active interaction.
3. **Append-Only:** Historical ledgers of events and results.
4. **Persistent:** State that continuously evolves over time.

## The Immutable Content Domain
This domain defines the data structures that map directly to the Product layer experiences. These aggregates are strictly read-only during a learner session:

* **World:** The top-level container holding global environmental rules and the overarching thematic ecosystem.
* **Storyline:** An ordered sequence of scenario references and the overarching narrative context that binds them.
* **Scenario:** The atomic interaction container holding the Initial State, the Constraint, and the Resolution Condition.
* **Challenge:** The specific value object inside a Scenario defining the exact problem criteria that must be satisfied.

## The Ephemeral Session Domain
This domain defines the business concept of an active user attempt. It exists only in the present moment:

* **Learning Session:** The entity representing the conceptual linkage between a *Learner* and a *Scenario* occurring right now. 

*Note: This domain tracks the business reality that an attempt is occurring. It explicitly does NOT track technical execution context (e.g., memory limits, code AST snapshots), which belongs internally to the Scenario Execution Engine.*

## The Append-Only Evaluation Domain
This domain defines how the system records the immutable truth about learner actions and assessment outcomes:

* **Assessment Result:** The immutable business record of an evaluation (e.g., "Mastery Achieved", "Productive Failure"). It contains the evaluated decision based on the learner's interaction.
* **Telemetry Event:** Granular, immutable business records of specific interactions (e.g., "Hint Requested", "Sandbox Executed"). 

These entities form a permanent, chronological ledger that can never be modified or deleted once written.

## The Persistent Learner Domain
This domain defines the long-term, evolving profile of the user. These aggregates mutate continuously as the user interacts with the platform:

* **Learner:** The core identity, preferences, and profile of the user.
* **Learner State:** The current progression marker (Locked, Available, Active, Completed, Revisited) referencing specific Content Entities.
* **Journey Record:** The permanent aggregate representing the persistent transformation of the World resulting from the Learner's actions (e.g., environments repaired, tools unlocked).

## Domain Invariants (Business Rules)
Domain Invariants are the architectural laws of the PyBe universe. They must never be violated by any software implementation:

* Every **Scenario** must belong to exactly one **Storyline**. Scenarios cannot float independently.
* Every **Storyline** must belong to exactly one **World**.
* A **Challenge** cannot exist outside of a **Scenario**.
* A **Journey Record** cannot exist without a parent **Learner**.
* **Assessment Results** and **Telemetry Events** are strictly immutable; they can never be updated or deleted.
* A **Learner State** can only transition according to the strict directed graph defined by the Progress System (e.g., a state cannot move directly from *Locked* to *Completed* without passing through *Active*).
