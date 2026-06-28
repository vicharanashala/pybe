# PyBe Computational Thinking Framework

## Purpose of the Framework
This document defines the cognitive framework of the PyBe platform. While the `Educational Philosophy` defines *why* we teach, and the `Learning Architecture` defines the *structural containers* of learning, this document answers one specific question: **What exactly are we teaching when we teach computational thinking?**

This is a cognitive map. It identifies the fundamental thinking abilities learners must develop, how those abilities relate to one another, and how they collectively form what we call "computational thinking." It is designed to act as the target for curriculum designers, independent of any specific programming language or instructional tactic.

## Defining Computational Thinking
In PyBe, computational thinking is defined as the cognitive ability to perceive complex systems, deconstruct their constraints, synthesize logical solutions, and generalize those solutions for future reuse. It is an active, recursive process of meaning-making applied to systemic environments, transcending the mere act of typing syntax.

## Justifying the Framework: Beyond Traditional Models
Traditional computer science education often defines computational thinking using a standard four-pillar model: Decomposition, Pattern Recognition, Abstraction, and Algorithm Design. 

While useful in theory, this traditional model assumes that a problem is already perfectly defined on paper before the learner begins. In PyBe’s authentic, story-driven ecosystems, problems are deliberately messy. A learner cannot immediately decompose a problem if they do not yet understand the rules of the world they are in. Therefore, our framework introduces *Systemic Perception* (sense-making) as a mandatory precursor to decomposition, creating a model that reflects genuine, real-world problem-solving rather than exam-oriented logic puzzles.

## Framework Principles (The Nature of the Framework)
Before examining the individual cognitive components, it is critical to understand the governing properties of the framework itself:
- **Language and Domain Independence:** The cognitive abilities defined here are entirely independent of Python. A learner who masters this framework possesses computational thinking whether they are writing Python, configuring cloud infrastructure, or designing a physical machine.
- **Compositional Design:** Thinking abilities compose rather than exist independently. Higher-order skills cannot function without the foundation of lower-order skills.
- **Recursive Action:** Thinking is recursive, not strictly sequential. A learner will constantly loop backward to earlier cognitive phases when a hypothesis fails.
- **Mutual Reinforcement:** Abilities do not develop in isolation. Strengthening the ability to generalize (Abstraction) inherently improves the ability to break down future problems (Decomposition).

## The Cognitive Architecture (Overview)
Computational thinking in PyBe is modeled as a **Recursive Dependency Model**, rather than a strict linear stack. 

1. It begins with **Systemic Perception**, the foundation of all subsequent thought.
2. Perception feeds an iterative, looping cycle between **Structural Decomposition** and **Algorithmic Synthesis**. 
3. Only when that loop yields a successful resolution does the final layer, **Abstract Generalization**, emerge.

If an algorithm fails during synthesis, the learner cognitively loops backward—either to redefine their decomposition, or to re-evaluate their perception of the system's constraints.

## Component 1: Systemic Perception
**Definition:** The cognitive ability to observe a complex, messy environment, identify its systemic constraints, recognize cause-and-effect relationships, and distinguish relevant rules from narrative noise *before* any code is planned.
- **Why it is fundamental:** Sense-making must occur before problem-solving. A learner cannot break a problem apart if they do not accurately perceive its boundaries.
- **How it differs from Pattern Recognition:** Pattern recognition typically involves finding trends in data. Systemic Perception is the act of observing the *state and rules* of a living system.
- **Dependencies:** None. This is the foundational cognitive act.
- **Enables:** Structural Decomposition.
- **Recursion:** A learner must recurse back to Systemic Perception whenever an algorithm fails due to a misunderstood constraint.

## Component 2: Structural Decomposition
**Definition:** The cognitive ability to break a massive, overwhelming narrative problem into independent, manageable logical sub-problems. It includes the ability to identify discrete entities (objects, variables) and map their current states against their desired states.
- **Dependencies:** Relies entirely on the accurate boundaries and constraints defined in Component 1 (Systemic Perception).
- **Enables:** Algorithmic Synthesis.
- **Recursion:** A learner will recurse back to Structural Decomposition if their synthesized algorithm becomes too complex to manage, indicating the sub-problems were not broken down far enough.

## Component 3: Algorithmic Synthesis
**Definition:** The cognitive ability to formulate a logical sequence of operations designed to change the state of the entities identified during decomposition. This encompasses conditional reasoning (if X, then Y) and iterative reasoning (repeat until Z) to bridge the gap between the current state and the goal state.
- **Focus:** This is the *mental modeling* of control flow and logic, completely separated from the syntactic implementation (e.g., remembering where the colon goes in Python).
- **Dependencies:** Cannot occur without the clearly defined sub-problems from Component 2 (Structural Decomposition).
- **Enables:** Abstract Generalization.
- **Recursion:** This component loops iteratively as the learner tests their logic, observes feedback, and debugs their mental model.

## Component 4: Abstract Generalization
**Definition:** The ultimate goal of computational thinking: the cognitive ability to strip away the specific narrative context of a successful algorithm to recognize its underlying universal pattern. It is the ability to parameterize logic so that it solves entire *classes* of problems, rather than just a single instance.
- **Dependencies:** Relies on the successful completion and resolution of an algorithm in Component 3 (Algorithmic Synthesis).
- **Enables:** The seamless application of existing knowledge to novel problems. It allows the learner to re-enter Component 1 (Systemic Perception) in a new context with a vastly upgraded cognitive toolkit.
- **Recursion:** While this is the pinnacle of the framework, successful abstraction reinforces and refines how a learner will decompose systems in the future, creating a continuous upward spiral of cognitive maturity.
