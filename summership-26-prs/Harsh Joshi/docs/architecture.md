# System Architecture (`architecture.md`)

This document details the software architecture, design patterns, and structural boundaries of the PyBe "Antigravity" module.

---

## 1. Architectural Principles & Constraints

### 1.1 Open/Closed Principle (OCP)
We extend PyBe's educational capabilities **without modifying existing features or legacy code**.
- **Closed for Modification**: Existing scenario browsers, roadmap views, and legacy API endpoints (`/api/scenarios`, `/api/progress`) remain untouched.
- **Open for Extension**: We introduce a completely isolated frontend route (`/personalized-journey`) and a dedicated backend domain module (`/api/personalized`) that interlocks cleanly with the existing application shell.

### 1.2 Domain-Driven Design (DDD) & Clean Architecture
To prevent business logic from bleeding into HTTP controllers or file system utilities, the backend strictly adheres to a layered architecture:
1. **Controller Layer (`personalizedRoutes.js` & `learningJourneyRoutes.js`)**: Handles HTTP request parsing, input validation, and HTTP response formatting. Adheres to the Thin API pattern: controllers contain zero business logic and delegate 100% of orchestration to services and command handlers.
2. **Service Layer (`PersonalizedService.js`, `CommandHandlers.js` & `StoryOrchestratorService.js`)**: Encapsulates core pedagogical rules, dictionary interpolation, and command handling. The Service layer has been refactored into explicit Command Handlers (`CommandHandlers.js`) that process Intent-Driven requests (`StartJourney`, `SubmitPracticeAnswer`).
3. **Domain Layer (`LearnerAggregate.js` & Domain Events/Commands)**: Encapsulates domain primitives. `LearnerAggregate.js` acts as a strict consistency boundary for the Adaptive Pedagogical Engine, ensuring business rules (like the 95/5 adaptive scoring and level transitions) are safely mutated in one place before raising Domain Events (`ConceptMastered`, `ContradictionTriggered`) for the Message Bus.
4. **Repository Layer (`PersonalizedRepo.js`)**: Abstraction layer responsible for data persistence and retrieval, insulating the business logic from the underlying storage mechanism. Following our Phase 3.5 database decoupling refactor, `PersonalizedRepo.js` manages I/O for multiple distinct JSON files (`master_archetypes.json` and `thematic_dictionaries.json`), seamlessly merging them for the Service Layer. This proves the value of the Dependency Inversion Principle, as the Service Layer required zero changes during this data migration.

### 1.3 Storage Efficiency & Decoupling Metric
By decoupling story templates from vocabulary dictionaries, our architecture achieves unprecedented data compactness: **5 topics -> 5 templates of stories × 50 categories of 50 subcategories -> 250 stories with under 100 KB of storage!**

### 1.4 The Aggregate Pattern & Intent-Driven Learning
To prevent side-effect pollution and race conditions, the backend separates user intent from system side effects:
- **Commands (Intent)**: Objects like `StartJourney` and `SubmitPracticeAnswer` capture what the user wishes to do. Commands can fail or be rejected if validation or consistency rules fail.
- **Aggregates (Consistency Boundary)**: `LearnerAggregate.js` clusters user level, motivation score, and mastered concepts into an atomic transaction unit. When a command is processed, the aggregate mutates its state and queues Domain Events without executing external side effects directly.
- **Events (Facts)**: Once the Unit of Work (`UnitOfWork.js`) commits the aggregate's state changes atomically, queued events (like `ConceptMastered`) are extracted and dispatched to `MessageBus.js` to trigger side effects (such as the Contradiction Engine).

### 1.5 Frontend 4-Step Interactive Flow & Adaptive UI
The React frontend (`LearningSession.jsx` & `TopicSelection.jsx`) connects to our event-driven backend to deliver a problem-triggered learning sequence:
1. **Step 1: The Example Story & Gemini Visual Layer**: Displays the interpolated pure story alongside a dynamic visual illustration generated via the Gemini API (`fetchGeminiIllustration`), removing syntax intimidation.
2. **Step 2: Narrative Pseudo-code**: Frames algorithmic logic as rules of the story universe.
3. **Step 3: Side-by-Side Code Translation**: Presents a split-screen view mapping story rules directly to Python syntax.
4. **Step 4: Adaptive Practice & Dynamic Retry Loop**: Exercises escalate based on the learner's Motivation Tier from `LearnerAggregate`:
   - *Level 1 (Scaffolded Options)*: Blanks with dropdown selection.
   - *Level 2 & 3 (Free Typing & Minimal Blanks)*: Direct syntax recall without options.
   - *Level 4 (Full Mastery)*: Write full Python code blocks without scaffolding.
   - *Dynamic Retry & Contradiction Handling*: Incorrect answers trigger inline narrative explanations relating back to story mechanics. If a learner fails twice on the same exercise, the UI dynamically fetches a fresh Practice Story in a different universe (e.g. switching from Pets to Space) to ensure productive struggle without frustration. Once mastered, a full-screen celebration animation fires and state is persisted to localStorage and `/api/users/profile`.

---

## 2. Technology Stack & Component Map

```
+-----------------------------------------------------------------------+
|                         CLIENT (React + Vite)                         |
|                                                                       |
|  +---------------------+       +-----------------------------------+  |
|  | Legacy Routes       |       | 50-Category Grid Dashboard        |  |
|  | / (Scenario Browser)|       | /personalized-journey             |  |
|  +---------------------+       +-----------------------------------+  |
|                                  |                                    |
|                                  | (Tile Click -> InteractiveView)    |
+----------------------------------|------------------------------------+
                                   | HTTP POST /api/journey/start
                                   | HTTP POST /api/journey/evaluate
                                   v
+-----------------------------------------------------------------------+
|                      SERVER (Express + Node.js)                       |
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  | Controller: server/src/routes/learningJourneyRoutes.js (Thin API)| |
|  +-----------------------------------------------------------------+  |
|                                  |                                    |
|                                  v                                    |
|  +-----------------------------------------------------------------+  |
|  | Service Layer: StoryOrchestratorService.js & AdaptiveService.js |  |
|  |  - String Interpolation Engine & Message Processor              |  |
|  |  - Automated 4-Tier Difficulty State Machine                    |  |
|  +-----------------------------------------------------------------+  |
|                                  |                                    |
|                                  v                                    |
|  +-----------------------------------------------------------------+  |
|  | Repository Layer: server/src/repositories/PersonalizedRepo.js   |  |
|  +-----------------------------------------------------------------+  |
|                                  |                                    |
|                                  v                                    |
|  +-----------------------------------------------------------------+  |
|  | Storage: master_archetypes.json & thematic_dictionaries.json    |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------------------------------------------+
```

---

## 3. Future Scalability & Technology Mapping

While the current prototype operates 100% locally with JSON file storage and REST HTTP endpoints, the architecture is specifically designed for seamless upgrade paths:

### 3.1 Socket.IO Real-Time Mapping
To support future collaborative pair-programming and real-time mentor interventions:
- **Current State**: Synchronous HTTP POST requests to `/api/personalized/generate` and `/api/personalized/reflect`.
- **Future Upgrade**: The `PersonalizedService` can emit events via a `Socket.IO` server adapter without changing core interpolation logic.
  - Event `client:request_case_study` -> maps to `PersonalizedService.generateCaseStudy()`.
  - Event `server:case_study_generated` -> pushes the 4-layer view directly to the socket client.
  - Event `client:syntax_attempt` -> enables real-time syntax keystroke validation and live hint broadcasting.

### 3.2 Mongoose & MongoDB NoSQL Migration
When migrating from local JSON files to a distributed cloud database:
- Because data access is abstracted behind `PersonalizedRepo.js`, migrating to MongoDB requires **zero changes** to `PersonalizedService.js` or frontend code.
- We simply replace the JSON file-reading implementation inside `PersonalizedRepo.js` with Mongoose model queries:
  - `PersonalizedRepo.getTemplateById(id)` -> `TemplateModel.findById(id).exec()`.
  - `PersonalizedRepo.saveUserBelief(userId, belief)` -> `UserModel.findByIdAndUpdate(userId, { $push: { beliefs: belief } }).exec()`.
  - `ObjectId` relationships will link User profiles to completed Rhizome nodes and recorded Contradiction Logs.
