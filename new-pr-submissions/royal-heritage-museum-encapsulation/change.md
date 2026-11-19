# Change Documentation — Royal Heritage Museum: Encapsulation Mission

## 1. Overview

This document describes the implementation, functionality, and technical changes included in the Royal Heritage Museum — Encapsulation Mission submission.

The project introduces an interactive museum-themed learning experience focused on the Object-Oriented Programming concept of encapsulation.

The implementation combines a React-based interface with TypeScript mission logic, validation rules, progress tracking, and automated tests.

## 2. Main Changes and Implementations

### 2.1 Interactive Encapsulation Learning Experience

Introduced a museum-themed mission in which learners explore how important artifact information can be protected through encapsulation.

The museum scenario provides a practical context for understanding data protection and controlled access.

### 2.2 Public and Private Attribute Simulation

Implemented logic to demonstrate public and private attribute access.

The simulation supports the following behavior:

- Public attributes allow direct modification.
- Private attributes prevent unauthorized direct modification.

This helps demonstrate why an object's internal data should be protected from uncontrolled changes.

### 2.3 Artifact Temperature Validation

Implemented temperature validation for the museum artifact scenario.

The accepted temperature range is:

- Minimum: 18°C
- Maximum: 22°C

Both boundary values are accepted.

Values below 18°C or above 22°C are rejected.

### 2.4 Artifact Metadata Validation

Added automated verification for the Blue Heron Vase artifact metadata against its expected specification.

This helps ensure that the artifact information used by the mission logic remains consistent.

### 2.5 Mission Stage Completion Logic

Implemented stage completion evaluation for the mission.

The logic evaluates completion conditions for stages 1 through 6 and separately gates the final victory state at Stage 7.

The final victory state must not be accepted unless the required earlier completion conditions have been satisfied.

### 2.6 Progress Persistence

Implemented local storage persistence for mission progress.

The persistence functionality supports:

- Saving learner progress.
- Restoring saved progress.
- Maintaining valid mission state.
- Preventing tampered saved data from incorrectly granting the final victory state.

### 2.7 Automated Tests

Added automated tests in:

`src/game/missionLogic.test.ts`

The tests cover:

1. Artifact metadata matching the Blue Heron Vase specification.
2. Temperature validation accepting values from 18°C to 22°C and rejecting values outside that range.
3. Public attribute modification and private attribute access protection.
4. Accurate completion evaluation for stages 1–6 and final victory gating for Stage 7.
5. Local storage progress round-tripping and protection against tampered victory state.

## 3. Formal Logic and Validation Rules

The following rules describe the expected behavior of the mission logic.

### 3.1 Temperature Validation

Let `T` represent the artifact's temperature.

The temperature is valid when:

`18 <= T <= 22`

Otherwise, it is invalid.

### 3.2 Attribute Access

Let `A` represent an attribute and `type(A)` represent its access classification.

The simulation follows these rules:

- If `type(A) = public`, direct modification is permitted.
- If `type(A) = private`, unauthorized direct modification is blocked.

### 3.3 Mission Completion

Let `S1` through `S6` represent the completion states of the first six mission stages.

The final victory state is permitted only when all required earlier stages have been completed.

Conceptually:

`Victory = S1 AND S2 AND S3 AND S4 AND S5 AND S6`

This is a description of the completion requirement, not a replacement for the implementation's actual stage-evaluation function.

### 3.4 Progress Persistence

Mission progress is stored using browser local storage.

When saved progress is restored, the application validates the restored state and prevents an invalid or tampered value from granting an unauthorized victory state.

## 4. Technical Structure

Important project files include:

| File / Directory | Responsibility |
|---|---|
| `src/main.tsx` | Application entry point |
| `src/App.tsx` | Main application component |
| `src/components/` | Reusable interface components |
| `src/game/missionLogic.ts` | Mission rules and validation logic |
| `src/game/missionLogic.test.ts` | Automated tests for mission logic |
| `package.json` | Project scripts and dependencies |
| `package-lock.json` | Dependency lockfile |
| `vite.config.ts` | Vite configuration |
| `metadata.json` | Application metadata |

## 5. Verification and Testing

The following commands are used to verify the project:

### Production Build

`npm run build`

**Observed result:** Production build completed successfully.

### Mission Logic Tests

`npx tsx --test src/game/missionLogic.test.ts`

**Observed result:** All five tests passed.

| Test Area | Result |
|---|---|
| Artifact metadata | Passed |
| Temperature validation | Passed |
| Public/private attribute access | Passed |
| Mission stage completion | Passed |
| Progress persistence and tamper protection | Passed |

**Test summary:** 5 passed, 0 failed.

## 6. Local Execution

Install dependencies:

`npm install`

Start the development server:

`npm run dev`

Create a production build:

`npm run build`

Run the mission logic tests:

`npx tsx --test src/game/missionLogic.test.ts`

## 7. Compatibility and Dependencies

The project uses React, TypeScript, and Vite.

Mission logic and automated tests execute locally. The submission is intended to follow the repository's local-only policy and should not introduce external LLM calls, cloud-generation utilities, or AI image-generation requests.

## 8. Summary of Changes

The submission provides:

- An interactive encapsulation learning scenario.
- Public and private attribute access simulation.
- Artifact temperature validation.
- Artifact metadata verification.
- Progressive mission completion logic.
- Final victory-state protection.
- Local storage progress persistence.
- Automated tests covering the main mission logic.

These changes support the goal of teaching encapsulation through practical examples while maintaining predictable and testable application behavior.