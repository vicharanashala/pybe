# PyBe Learning Architecture

## Purpose of the Learning Architecture
This document is the definitive structural blueprint for learning within the PyBe platform. While the `Educational Philosophy` defines *why* we teach the way we do, and the `Technical Architecture` defines *how* the software is built, this document exists strictly to answer one question: **How is learning structurally organized inside PyBe?**

It acts as the bridge between educational theory and technical execution, establishing a timeless, implementation-independent map of how containers, concepts, feedback loops, and progression mechanisms fit together.

## Architectural Principles of Learning
Before defining the individual architectures, we must establish the immutable structural constraints that govern the entire system. These are not educational theories; they are strict design rules that every subsequent section must follow:
- **Learning is Scenario-Centric:** The system does not possess isolated "lessons." All learning occurs within the structural boundary of a Scenario.
- **Concepts Emerge from Constraints:** New concepts are only introduced structurally after the learner hits a logical constraint they cannot solve with their existing toolkit.
- **Progression is Mastery-Driven:** A learner cannot advance to node $N+1$ without satisfying the structural mastery requirements of node $N$.
- **Assessment is Embedded:** There is no separate "examination" module. Assessment occurs continuously through the successful resolution of standard scenarios.
- **Knowledge Transfer is Mandatory:** The curriculum structure must force concepts learned in one context to be reused in novel contexts.
- **Learning is Recursive:** The learner journey loops continuously through identical structural phases (Attempt $\rightarrow$ Feedback $\rightarrow$ Reflection $\rightarrow$ Mastery), regardless of the concept being taught.

## Learning Architecture Overview
The PyBe learning architecture operates as a dynamic interaction between static maps and active loops. 
- The **Static Curriculum Topology** (the Learning Dependency Model) maps out every concept and how they relate.
- The **Active Container** (the Scenario Architecture) provides the sandbox where learning happens.
- As the learner interacts with the active container, the **Feedback Architecture** responds to their attempts in real-time.
- The **Assessment Architecture** continuously evaluates those attempts.
- Once the assessment criteria are met, the **Progression Architecture** moves the learner to the next node in the static topology.

## Structural Organization of Learning (Macro, Meso, Micro)
To manage cognitive load and maintain narrative continuity, learning in PyBe is organized into three strictly nested tiers:
- **Macro Architecture (The Learner Journey):** The highest level of organization. This represents the overarching journey across the entire platform as a learner moves between distinct, self-contained ecosystems known as *Worlds*.
- **Meso Architecture (Worlds and Storylines):** The organization within a specific World. A World contains distinct *Storylines*, which group related scenarios and concepts together under a cohesive narrative arc.
- **Micro Architecture (The Scenario):** The internal, step-by-step phases of a single learning unit.

This hierarchy ensures that a learner is never exposed to the raw complexity of the entire platform at once; they are always grounded in a specific scenario, which belongs to a specific storyline, within a specific world.

## Scenario Architecture: The Atomic Unit of Learning
The **Scenario** is the foundational building block of PyBe. It is the active container where all learning occurs. Every scenario, regardless of the storyline or concept, must contain the following structural components:
- **Narrative Hook:** Contextualizes the impending problem.
- **Constraint Identification:** The systemic boundary that prevents the learner from succeeding with their current knowledge.
- **Logic Sandbox:** The space where hypotheses are formed and code is executed.
- **Resolution:** The state achieved when the constraint is successfully overcome.

Crucially, the Scenario is the host environment. The Concept Emergence, Feedback, and Assessment architectures all operate *inside* the boundaries of a single Scenario.

## Learning Dependency Model (Topology)
The Learning Dependency Model defines the *static* structure of the curriculum. PyBe does not organize concepts as a linear textbook chapter sequence (e.g., Chapter 1, Chapter 2). 

Instead, the curriculum is organized as a **prerequisite graph** or **dependency web**. Each concept is a node. Nodes are connected by strict structural dependencies (e.g., a learner must traverse the `variable` and `boolean logic` nodes before they can access the `while loop` node). This topology dictates the systemic rules of how any concept relates to another, entirely decoupled from how a user actually travels through it.

## Concept Emergence Architecture
This architecture defines exactly *where and when* a completely new tool is structurally delivered to the learner. Operationalizing our "Emergent Learning" philosophy, the introduction of a new concept node must follow a strict structural sequence within a scenario:
1. **The Trigger:** The learner encounters a systemic constraint.
2. **The Precedent:** The learner attempts to solve the constraint with their existing knowledge and fails.
3. **The Emergence:** The system introduces the new concept node strictly as a tool to bypass the constraint.
4. **The Following Action:** The learner immediately applies the new tool to achieve resolution.

## Knowledge Transfer Architecture
To ensure long-term retention and abstraction, the platform structurally mandates knowledge transfer. This architecture dictates the reuse of concept nodes across different storylines.
If Concept Node A is introduced in World 1, the Knowledge Transfer Architecture requires that Concept Node A reappears in a structurally novel scenario in World 2. This forces the learner to generalize their understanding, preventing them from associating a concept exclusively with a single narrative context.

## Progression Architecture (Traversal)
While the Dependency Model maps the static nodes, the Progression Architecture defines how the learner dynamically *moves* through them. 
This architecture focuses strictly on traversal rules and learner state changes. It defines the mechanisms for unlocking subsequent scenarios based on the resolution of prerequisites. It manages the gates and locks of the platform, independent of how we determine if the learner is ready to pass through them (which is handled by Assessment).

## Feedback Architecture (Response Loop)
The Feedback Architecture defines how the system structurally responds to the learner in real-time. It governs the active loop of productive struggle within a scenario:
`Attempt` $\rightarrow$ `System Response (Progressive Hints)` $\rightarrow$ `Reflection` $\rightarrow$ `Revision` $\rightarrow$ `Retry`.

This architecture strictly defines the *loop*. It does not evaluate mastery, nor does it dictate the specific instructional text of the hints; it merely provides the structural triggers for when a hint or reflection prompt should be delivered based on a learner's input.

## Assessment Architecture (Evidence)
The Assessment Architecture defines how the system knows that learning has occurred. It is entirely embedded; there are no separate exams. 
This architecture focuses strictly on what counts as *evidence* of learning. Evidence is structurally defined as the successful resolution of a scenario's constraints without reliance on terminal hints. When the Assessment Architecture determines the evidence criteria are met, it sends a signal to the Progression Architecture to unlock the next node. 

## Relationship to Neighboring Documents
This document serves as the structural blueprint for learning, sitting precisely in the middle of our documentation tree. To prevent scope creep, its boundaries must be strictly maintained:
- **04_Educational_Philosophy:** Explains *why* we have these structures (e.g., why Concept Emergence is good for the human brain).
- **06_Computational_Thinking_Framework:** Explains the specific cognitive logic models we teach within these scenarios.
- **07_Learning_Strategies:** Explains the tactical instructional design methods (e.g., how to write an effective hint for the Feedback Architecture).
- **Technical Documentation:** Explains how these architectures are implemented in software (e.g., database schemas for the Dependency Model).
- **Product Documentation:** Explains the user interface and visual design of the Scenario Architecture and Progression locks.
