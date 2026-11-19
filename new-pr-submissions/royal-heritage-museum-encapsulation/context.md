# Project Context — Royal Heritage Museum: Encapsulation Mission

## 1. Project Information

**Project Name:** Royal Heritage Museum — Encapsulation Mission

**Category:** Educational Application

**Subject:** Python / Object-Oriented Programming

**Core Concept:** Encapsulation

**Application Type:** Interactive web-based learning experience

**Frontend Framework:** React

**Programming Language:** TypeScript

**Build Tool:** Vite

## 2. Project Background

Encapsulation is one of the fundamental principles of Object-Oriented Programming (OOP).

It involves grouping data and the operations that work on that data within an object, while controlling how the object's internal state can be accessed or modified.

For beginners, understanding encapsulation can be difficult when it is explained only through definitions or code examples.

This project addresses that challenge by presenting encapsulation through a practical museum preservation scenario.

Learners take on the role of a museum assistant responsible for protecting valuable artifacts and maintaining their information correctly.

The application demonstrates how controlled access and validation help protect an object's data.

## 3. Educational Context

The application focuses on the following concepts:

### 3.1 Encapsulation

Encapsulation helps organize data and related operations within an object.

It supports controlled access to internal state and helps prevent unintended modifications.

### 3.2 Public Attributes

Public attributes can be accessed directly.

In the mission simulation, public attributes allow direct modification.

### 3.3 Private Attributes

Private attributes represent data that should not be accessed or modified directly through unauthorized operations.

In Python, double-underscore name mangling can make direct access more difficult, but it is important to understand that Python privacy is a convention and mechanism rather than strict access control.

The mission uses a simplified simulation to demonstrate the distinction between public and private access.

### 3.4 Data Validation

Validation ensures that data satisfies defined rules before it is accepted.

The museum artifact temperature example demonstrates how invalid values can be rejected to protect important information.

### 3.5 Controlled State Changes

An object's state should be changed through appropriate operations that enforce the required rules.

This helps preserve data consistency and makes application behavior more predictable.

## 4. Formal Logic and Model Description

The mission demonstrates a simplified object-protection model.

### 4.1 Artifact Model

The Blue Heron Vase is used as the museum artifact example.

The artifact metadata is checked against its expected specification through the mission logic and automated tests.

### 4.2 Temperature Constraint

Let `T` represent the artifact's recorded temperature.

The valid temperature condition is:

`18 <= T <= 22`

The condition is inclusive, meaning 18°C and 22°C are valid values.

Any value below 18°C or above 22°C is rejected.

### 4.3 Attribute Access Model

Let `A` represent an artifact attribute.

The mission distinguishes between two access classifications:

**Public:**
- Direct access is permitted in the simulation.
- Direct modification is permitted.

**Private:**
- Unauthorized direct access or modification is restricted by the simulation.
- The protected state should not be changed through an unauthorized operation.

### 4.4 Mission Progress Model

The mission consists of seven stages.

Stages 1–6 have completion conditions evaluated by the mission logic.

Stage 7 represents the final victory gate.

The final victory condition requires all six preceding stages to satisfy their completion requirements.

Conceptually:

`Victory = S1 ∧ S2 ∧ S3 ∧ S4 ∧ S5 ∧ S6`

Where each `Si` represents the completion state of its corresponding stage.

### 4.5 Persistence Model

The application uses browser local storage to save and restore mission progress.

The restored progress is checked so that tampered or invalid saved values cannot incorrectly grant the final victory state.

## 5. Application Architecture

The application is built using React and TypeScript.

The user interface and mission logic are organized into separate areas to support maintainability.

Important files:

- `src/main.tsx` — application entry point.
- `src/App.tsx` — main application component.
- `src/components/` — reusable interface components.
- `src/game/missionLogic.ts` — mission logic and validation rules.
- `src/game/missionLogic.test.ts` — automated tests.

The project uses Vite for local development and production builds.

## 6. Developer Information

**Developer Name:** [REPLACE WITH YOUR FULL NAME]

**Email ID:** [REPLACE WITH YOUR EMAIL ADDRESS]

**Project:** Royal Heritage Museum — Encapsulation Mission

**Repository:** https://github.com/vicharanashala/pybe

## 7. Development and Verification

The project is developed as a local React application.

The following commands are used during development:

Install dependencies:

`npm install`

Run locally:

`npm run dev`

Build the application:

`npm run build`

Run mission logic tests:

`npx tsx --test src/game/missionLogic.test.ts`

The observed verification results include:

- Successful production build.
- Five automated tests passed.
- Zero automated test failures.

## 8. Repository Integration Context

This project is intended as a new educational submission to the PyBe repository.

The submission should be placed inside:

`new-pr-submissions/royal-heritage-museum-encapsulation/`

The project should preserve its original implementation and author credits.

It should follow the repository's local-only policy and avoid introducing external LLM services, cloud-based generation utilities, or AI image-generation requests.

The submission is intended for review by the repository coordinators and instructors through the pull request process.

## 9. Expected Educational Impact

The project aims to make encapsulation easier to understand by connecting programming concepts to a familiar real-world scenario.

By completing the mission, learners can understand:

- Why object data needs protection.
- How public and private attributes differ.
- Why validation is important.
- How controlled access protects internal state.
- How mission conditions can be evaluated systematically.

## 10. Conclusion

Royal Heritage Museum — Encapsulation Mission combines an interactive educational scenario with testable mission logic to explain the importance of encapsulation.

The museum preservation theme gives learners a practical way to understand data protection, validation, and controlled access in Object-Oriented Programming.