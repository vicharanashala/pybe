# PyBe API Architecture (The Communication Contract)

## Purpose of the API Architecture
Despite the filename, this document is **not** a protocol-specific API specification. It defines the *conceptual communication contract* of the PyBe platform rather than REST endpoints, GraphQL schemas, transport protocols, serialization formats, or implementation-specific APIs. 

It establishes the definitive guide to external communication boundaries. By defining input/output guarantees structurally, this document guarantees that the rules defined here survive any shift in underlying technology.

## Communication Principles (The Contract Rules)
To ensure that the backend architecture remains completely uncoupled from its clients, the communication layer is governed by the following non-negotiable principles:

* **Stateless Operations:** The API boundary itself holds no session state. Every request must contain all the context necessary for execution.
* **Agnosticism:** The API must not care whether the client is a web browser, a mobile application, a VR headset, or a terminal. It serves domain data, not UI components.

## Contract Invariants
The following architectural guarantees must be upheld by every implementation of the PyBe communication layer, regardless of the transport protocol or technology used:

* Every Query is side-effect free.
* Every Command produces an explicit outcome.
* Every request receives a deterministic response.
* Every response corresponds to exactly one operation.
* Every exposed entity has a stable identity.
* Failures are explicit and never silent.
* Internal implementation details (e.g., database keys, stack traces) are never exposed through the communication contract.

## The Operation Boundary (Queries vs. Commands)
The communication contract architecturally segregates read operations from write operations. This ensures predictable scaling and caching strategies:

* **Queries (Reads):** Operations that request data without modifying the state of the system (e.g., fetching a World definition, checking the current Learner State). Queries must be completely side-effect free and idempotent.
* **Commands (Writes/Executions):** Operations that intend to mutate state or trigger execution (e.g., submitting sandbox code, initializing a session). Commands drive the system forward.

## The Core Exchange Operations
To run PyBe, the communication layer must support the following mandatory conceptual operations and their input/output guarantees:

* **Session Initialization (Command):** The client requests to begin a session. The server guarantees to return the initial state and environmental constraints.
* **Content Retrieval (Query):** The client requests structural narrative data. The server guarantees to return the immutable content entity.
* **Interaction Submission (Command):** The client submits learner logic against a specific constraint. The server guarantees to return execution consequences and assessment decisions.
* **Progression Retrieval (Query):** The client requests the current Learner State. The server guarantees to return the available, locked, and completed pathways.

## The Communication Lifecycle
From the client's perspective, data exchange follows a conceptual choreography that sequences the operations defined above:

1. **Session Initialization:** The client announces the learner's presence and requests the active context.
2. **Content Retrieval:** The client fetches the necessary static World and Storyline assets to render the environment.
3. **Learner Interaction Submission:** The learner inputs logic into the sandbox, which the client transmits as a Command.
4. **Scenario Execution:** (Internal to the server, triggered by the Command).
5. **Assessment Result:** The server responds to the Command with the evaluated outcome of the execution.
6. **Learner State Update:** (Internal to the server, updating persistence based on the assessment).
7. **Next Available Interaction:** The client queries the new Learner State to determine what to render next.

## The Conceptual Error Contract
Failures must be explicitly categorized and communicated reliably across all clients. The server provides the following architectural guarantees regarding errors:

* Errors are machine interpretable (for automated client routing).
* Errors are human understandable (for developer debugging).
* Errors never expose internal implementation details (e.g., SQL syntax errors).
* Errors never leave the client in an ambiguous state.
* Every failure produces an explicit outcome.
* Error communication remains consistent across all operations.

Failures are conceptually categorized as:
* **Client Violations:** The client sent an invalid, malformed, or unauthorized command.
* **Domain Violations:** The command violates business rules (e.g., attempting a Locked Scenario).
* **Execution Faults:** The learner's code caused a timeout or sandbox failure (distinct from a pedagogical failure).
* **System Faults:** Internal engine failures (e.g., inability to reach the Assessment Engine).

## The Compatibility and Evolution Contract
To protect the platform from breaking as it grows over time, the API must adhere to strict evolutionary rules:

* **Stable Semantic Meaning:** The fundamental meaning of an operation cannot change over time.
* **Backward Compatibility:** Evolution should be handled via additive changes whenever possible. New fields can be added; existing fields cannot be removed or renamed without a new version contract.
* **Explicit Deprecation Lifecycle:** No field or operation can be removed without completing a predictable, explicit deprecation lifecycle.
* **Client Resilience:** Clients must gracefully ignore unrecognized fields in a payload, allowing them to remain resilient to future-compatible additions.

## Architectural Boundaries (What this API is NOT)
To prevent this document from leaking into the Technical Implementation layer, it is explicitly stated that this document does **not** define:

* Transport protocols (HTTP, WebSockets, gRPC).
* Serialization formats (JSON, Protobuf, XML).
* Authentication providers or security mechanisms (OAuth, JWT).
* Specific routing logic or endpoint paths.

Those decisions are delegated exclusively to the implementation roadmap, constrained by the immutable rules defined above.
