# PyBe Project Context

Welcome to the foundational document for PyBe. This document serves as the single source of truth for understanding the identity, goals, and boundaries of the project. If you are new to the team, read this first.

## Background and Problem Space
Traditional programming education frequently relies on a "syntax-first" approach. Learners are taught abstract language features—such as loops, arrays, and functions—in isolation, often memorizing syntax rules without understanding *why* these tools exist or *when* to use them. This disconnect leads to frustration, rote memorization, and a failure to develop actual problem-solving skills.

PyBe exists to address this failure. We believe that learning to code should not feel like reading a dictionary. Instead, programming should be taught as a natural set of tools required to solve authentic, engaging problems. 

## Core Values and Guiding Principles
Every design decision in PyBe is filtered through these core values:

- **Problem First, Python Second:** The challenge dictates the tool. We never introduce a programming concept until the learner has encountered a problem that specifically requires it.
- **Meaning over Memorization:** We prioritize algorithmic design and pattern recognition over the memorization of language-specific syntax.
- **Emergent Learning:** Python concepts must emerge naturally as the logical solution to a current scenario, not as forced curriculum checkpoints.
- **Story-Driven Immersion:** Learning should be contextualized within an engaging narrative to provide intrinsic motivation and real-world relevance.

## Vision and Mission
**Vision:** To fundamentally shift how programming is introduced to beginners globally, moving the standard away from isolated syntax exercises toward authentic, computational problem-solving.

**Mission:** To build an open-source, story-driven educational platform that teaches computational thinking and Python programming by guiding learners through interactive, real-world ecosystems.

## Target Audience
**Primary Users:**
- **Beginner Learners:** Individuals (middle school age and up) with zero prior programming experience who want to understand logic and coding in a meaningful context.

**Secondary Users:**
- **Educators and Mentors:** Teachers seeking a robust, structured platform that focuses on computational thinking rather than just grading syntax errors.

## Success Criteria
We define the success of PyBe through educational and product outcomes rather than purely technical metrics:
- **Educational Success:** Learners can independently decompose novel problems and identify the appropriate computational tools to solve them, demonstrating true understanding rather than rote recall.
- **Product Success:** High learner engagement and retention driven by the narrative and scenario structures. Learners should feel they are exploring a world, not taking a test.

## Project Scope and Boundaries
**In Scope:**
- Scenario-based, story-driven interactive learning environments.
- Teaching computational thinking, algorithmic logic, and fundamental Python programming.
- Providing educator tools for tracking progress in problem-solving.

**Out of Scope:**
- Serving as a competitive coding platform (e.g., LeetCode, HackerRank).
- Acting as a comprehensive technical reference for the entire Python language.
- Teaching advanced framework-specific skills (e.g., Django, Pandas, machine learning libraries) outside of core computational fundamentals.

## Key Assumptions
We build PyBe on the following assumptions:
- Users have access to a modern web browser and a stable internet connection.
- Users have no prior knowledge of programming or computer science theory.
- Educators using the platform may not be professional software engineers themselves, necessitating clear, supportive scaffolding.

## Major Design Decisions (Living Log)
This section serves as a living record of foundational product and educational decisions to prevent reopening resolved debates.

### Decision 1: World-Centric Organization
- **Decision:** Curriculum is mapped to real-world "Ecosystems" (e.g., a power grid, a forest) rather than technical chapters (e.g., "Variables", "Loops").
- **Reason:** To ensure concepts are grounded in authentic, tangible scenarios.
- **Impact:** Content creators must design entire environments rather than standalone coding exercises.

### Decision 2: Python as the Primary Language
- **Decision:** The platform will use Python as the singular teaching language for the foreseeable future.
- **Reason:** Python's highly readable syntax reduces cognitive load, allowing learners to focus purely on computational thinking and logic.
- **Impact:** System execution environments and assessment models will be specifically optimized for Python.

## Glossary of Terms
To ensure all contributors share a standardized vocabulary:
- **World / Ecosystem:** A broad, themed narrative environment (e.g., "The Automated Farm") containing multiple scenarios.
- **Scenario:** A specific, self-contained interactive challenge within a World that requires a computational solution.
- **Emergent Learning:** Our pedagogical strategy where the need for a concept arises naturally from the constraints of a problem.
- **Computational Thinking:** The process of breaking down a complex problem into steps that a computer can execute (encompassing decomposition, pattern recognition, abstraction, and algorithms).

## Relationship to Other Documents
This document defines the **"Why"** and the **"What"** of PyBe. 
- For the **"How we teach it,"** refer to the `pedagogy/` documentation.
- For the **"How it looks and feels,"** refer to the `product/` documentation.
- For the **"How we build it,"** refer to the `technical/` documentation.
