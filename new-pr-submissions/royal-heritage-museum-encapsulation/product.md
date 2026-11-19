# Product Documentation — Royal Heritage Museum: Encapsulation Mission

## 1. Product Overview

**Royal Heritage Museum — Encapsulation Mission** is an interactive educational application designed to teach the Object-Oriented Programming (OOP) concept of **Encapsulation** through a museum-themed mission.

The application places learners in the role of a museum security and preservation assistant. Their responsibility is to protect valuable museum artifacts by understanding how data is stored, accessed, validated, and modified through controlled operations.

Instead of presenting encapsulation only as a theoretical programming concept, the application uses interactive challenges and simulated scenarios to help learners understand why data protection and controlled access are important.

## 2. Product Objectives

The main objectives are:

- Introduce the concept of encapsulation through an interactive learning experience.
- Explain the difference between public and private attributes.
- Demonstrate controlled access to object data.
- Teach the importance of data validation.
- Help learners understand how encapsulation protects important object information.
- Provide progressive challenges that reinforce learning.
- Preserve learner progress so that completed missions can be retained.

## 3. Target Audience

The application is intended for:

- Students learning Python and Object-Oriented Programming.
- Beginners who want to understand encapsulation.
- Learners who benefit from practical examples instead of theory alone.
- Educators demonstrating data protection and controlled access.

## 4. Core Features

### 4.1 Museum-Themed Learning Environment

The application uses a Royal Heritage Museum scenario to introduce encapsulation. Learners interact with museum-related challenges involving the protection and management of valuable artifacts.

### 4.2 Artifact Information and Metadata

The application uses the Blue Heron Vase as an artifact example. Its metadata is used in the mission logic and validation tests.

### 4.3 Public and Private Attribute Access

Learners explore the difference between public and private attributes.

- Public attributes can be accessed and modified directly in the simulation.
- Private attributes are protected from unauthorized direct modification.

This demonstrates the principle of controlling access to an object's internal data.

### 4.4 Temperature Validation

The application demonstrates how validation protects important artifact information.

For the Blue Heron Vase mission, the accepted temperature range is **18°C to 22°C**, inclusive.

Values outside this range are rejected by the validation logic.

### 4.5 Progressive Mission Stages

The mission includes multiple stages:

- Stages 1–6 evaluate mission completion.
- Stage 7 acts as the final victory gate.

Learners must satisfy the required completion conditions before the final victory state is accepted.

### 4.6 Progress Persistence

The application uses browser local storage to preserve learner progress.

The progress logic also protects against invalid or tampered victory states by clamping the saved state to valid completion conditions.

### 4.7 Local Execution

The application runs locally using the React and Vite development environment. Its mission logic and validation tests run locally without requiring a cloud-based AI service.

## 5. Learning Outcomes

After completing the mission, learners should be able to:

1. Explain the meaning of encapsulation.
2. Identify public and private attributes.
3. Understand why direct access to internal data may need to be restricted.
4. Explain how validation protects an object's data.
5. Understand how controlled operations help maintain valid object state.
6. Relate encapsulation to practical data protection scenarios.

## 6. Technology Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Application logic and type safety |
| Vite | Development server and build tooling |
| CSS / Tailwind CSS | User interface styling |
| Lucide React | Interface icons |
| Node.js and npm | Development environment and package management |

## 7. Application Entry Point

The main application entry point is:

`src/main.tsx`

The main application interface is implemented through the React application components.

The mission logic is maintained separately under:

`src/game/missionLogic.ts`

Automated mission logic tests are located at:

`src/game/missionLogic.test.ts`

## 8. Success Criteria

The product is considered functional when:

- The application builds successfully.
- Mission validation behaves as expected.
- Public and private access simulations work correctly.
- Mission stages are evaluated accurately.
- The final victory state is gated by the required conditions.
- Progress can be saved and restored.
- Invalid saved victory states are handled safely.

## 9. Future Improvements

Possible future improvements include:

- Additional museum artifacts and scenarios.
- More interactive challenges involving encapsulation.
- Additional examples of getters, setters, and controlled methods.
- More detailed learner feedback and explanations.
- Additional automated tests for edge cases.

## 10. Summary

Royal Heritage Museum — Encapsulation Mission transforms an abstract Object-Oriented Programming concept into a practical museum-themed learning experience. By combining controlled attribute access, validation, progressive stages, and persistence, it helps learners understand how encapsulation protects data and maintains consistency.