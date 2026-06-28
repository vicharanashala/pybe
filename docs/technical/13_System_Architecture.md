# PyBe System Architecture

## Purpose of the System Architecture

This document translates the pedagogical philosophies and product designs of PyBe into a definitive, decoupled software architecture. It defines the major architectural boundaries, the specific responsibilities of each subsystem, and the flow of data between them.

The system architecture is strictly technology-independent. It focuses entirely on computational responsibilities, isolation boundaries, and coordination patterns. This document will not specify programming languages, web frameworks, database schemas, or deployment technologies. By defining the system abstractly, the architecture guarantees that PyBe can be implemented, refactored, or entirely rewritten without altering its fundamental structural integrity.

## Core Architectural Principles

To ensure long-term stability and maintainability, the PyBe system is governed by the following immutable principles:

* **Separation of Concerns:** Each subsystem must have a single, well-defined responsibility. Engines that evaluate logic must not concern themselves with narrative rendering, and engines that track progression must not execute code.
* **Data-Driven Content:** The execution environments and UI must remain completely agnostic to the content they host. Worlds, Storylines, and Scenarios are treated as static data definitions injected into the system, never as hardcoded logic.
* **Stateless Scenario Execution:** The computational sandbox where learner code is evaluated must remain entirely stateless. It receives inputs, runs logic, and returns outputs, but it never persists learner history, tracks narrative progression, or saves assessment scores.
* **Event-Driven Communication:** Subsystems communicate primarily through asynchronous events or through the central Orchestrator. No subsystem should tightly couple itself to the internal state of another.
* **Loose Coupling:** The system must be designed so that internal changes to one subsystem (e.g., swapping the execution sandbox technology) do not force cascading changes across the rest of the platform.
* **High Cohesion:** Data and logic that belong together must stay together. For example, all rules regarding the Learner State Model must reside exclusively within the Persistence Layer.
* **Technology Independence:** The core architectural boundaries must remain valid regardless of whether the system is deployed as a monolith, a set of microservices, or a serverless architecture.
* **Extensibility:** The system must easily accommodate new types of Scenarios, Assessment Heuristics, or World designs without requiring structural changes to the core engines.
* **Replaceable Components:** Because boundaries are strict and communication is orchestrated, any individual engine (such as the Assessment Engine) can be entirely rewritten and replaced as long as it adheres to the established input/output contracts.

These principles protect the architecture by ensuring that technical debt is quarantined and that the system scales logically as the platform's complexity grows.

## The Learning Session Orchestrator (The Coordination Layer)

The Learning Session Orchestrator serves as the central nervous system of the PyBe platform. It is the primary coordinator responsible for managing the flow of a learner's session across all other decoupled subsystems.

**Responsibilities:**
* **Creating learner sessions:** Initializing a session based on the learner's persistent state.
* **Loading content:** Requesting the appropriate narrative and scenario definitions from the Content Engine.
* **Coordinating subsystem interactions:** Acting as the mediator so that other engines do not communicate directly with one another.
* **Routing execution requests:** Forwarding learner interactions and constraints to the Scenario Execution Engine.
* **Routing assessment requests:** Taking the outputs from the Execution Engine and forwarding them to the Assessment Engine for evaluation.
* **Coordinating progression updates:** Receiving validation from the Assessment Engine and instructing the Persistence Layer to update the learner's history.
* **Determining the next learner-facing state:** Deciding which UI state or narrative hook the client should render next based on the progression update.

The Orchestrator is strictly a routing and coordination layer. It contains *orchestration logic* rather than *business logic*. It knows *when* to call an engine, but it does not know *how* that engine performs its internal work.

## The Content & Narrative Engine (The Static Layer)

The Content & Narrative Engine is the subsystem responsible for querying, packaging, and providing the static definitions of Worlds, Storylines, Scenarios, and all associated narrative assets.

This engine serves structured content payloads to the Orchestrator. It provides the initial state, the constraints, the dialogue, and the environmental rules required to hydrate the user interface. 

It is crucial to understand that this layer serves structured content *without executing it*. It acts as the definitive read-only repository of the PyBe universe. It is exclusively a provider of data and is entirely oblivious to learner behavior, execution logic, or assessment outcomes.

## The Scenario Execution Engine (The Active Layer)

The Scenario Execution Engine is the computational sandbox responsible for executing learner interactions. It is the subsystem that brings the atomic unit of learning to life.

**Responsibilities:**
* **Initializing execution environments:** Setting up the secure sandbox based on the constraints provided by the Orchestrator.
* **Running learner solutions:** Securely executing the logic or interactions provided by the user.
* **Managing execution lifecycle:** Handling timeouts, infinite loops, and resource constraints during execution.
* **Producing execution results:** Capturing the standard output, errors, and the final state of the environment.
* **Returning execution events:** Formatting the raw output and returning it to the Orchestrator.

This engine performs *execution only*. It does not know if the output is "correct" or "incorrect." It does not assess the pedagogical value of the code, nor does it update the learner's progression state. It simply states: "Given input X and constraint Y, the output was Z."

## The Assessment Engine (The Observer Layer)

The Assessment Engine is the subsystem responsible for computationally evaluating the outcomes of learner execution. 

When the Orchestrator receives raw execution results, it routes them to the Assessment Engine. This engine then applies the evaluation heuristics required to validate the pedagogical rules defined in Document 08 (Assessment Models). It analyzes the outputs to determine if the learner has successfully satisfied the Scenario's constraints and demonstrated the required computational thinking.

The Assessment Engine produces assessment decisions (e.g., "Constraint Met," "Productive Failure Detected"). However, it *does not modify learner state directly*. It returns its evaluation back to the Orchestrator, completely separating the logic of evaluation from the mechanics of database persistence.

## The Learner State & Progress Manager (The Persistence Layer)

The Learner State & Progress Manager is the subsystem responsible for maintaining persistent learner progression and historical data.

**Responsibilities:**
* **Tracking learner progression states:** Maintaining the precise UX state (Locked, Available, Active, Completed, Revisited) of every content node.
* **Maintaining completion history:** Recording when and how scenarios were resolved.
* **Recording world progression:** Tracking the permanent transformations of the World resulting from learner actions.
* **Recording storyline progression:** Managing the learner's current position within narrative arcs.
* **Recording scenario completion:** Logging the resolution of atomic interactions.
* **Maintaining persistent learner history:** Storing the "Journey Record" without relying on arbitrary points or XP.

This subsystem strictly *reacts* to assessment decisions routed through the Orchestrator. It does not evaluate code, nor does it decide if a learner is correct; it simply persists the validated truth of the learner's journey and calculates the newly unlocked pathways.

## The Rendering Boundary (Client-System Separation)

To ensure maximum flexibility and prevent architectural degradation, the platform enforces a strict Rendering Boundary that separates all backend systems from the presentation layer.

All communication between the backend subsystems (via the Orchestrator) and the user interface must pass through well-defined, standardized interfaces (such as an API gateway or an event stream). Backend systems must never generate UI components, inject presentation styling, or couple themselves to specific client behaviors.

Because of this strict boundary, the backend architecture remains completely independent of the presentation layer. The PyBe system architecture must remain perfectly valid regardless of whether the frontend client is a:
* Web Browser
* Mobile Application
* Desktop Client
* Terminal Interface
* Future Spatial or VR interface
