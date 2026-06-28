# PyBe Learning Strategies

## Purpose of the Instructional System
This document translates the platform’s `Educational Philosophy` and `Computational Thinking Framework` into actionable instructional practices. It answers one specific question: **How do we help learners develop computational thinking without just giving them the answer?**

This is the definitive instructional handbook for curriculum designers and scenario writers. It defines the specific pedagogical tactics used to guide a learner through PyBe’s architecture, ensuring that every scenario consistently embodies our philosophy of productive struggle and emergent learning.

## The Lifecycle of Instructional Support (Overview)
Instructional support in PyBe is modeled after the Cognitive Apprenticeship framework. We do not simply drop learners into an environment and hope they learn, nor do we hold their hand through every keystroke. Instead, instructional support follows a deliberate, chronological lifecycle:

**Framing $\rightarrow$ Guiding $\rightarrow$ Coaching $\rightarrow$ Solidifying $\rightarrow$ Orchestrating Transfer**

This lifecycle models how an expert human tutor behaves: setting the stage, providing logical guardrails, helping when the learner falls, stepping back when they succeed, and testing them later in a new context.

## Phase 1: Framing the Problem (Contextualization)
Before the learner writes any code or plans any logic, the instructional designer must properly frame the problem. The goal of this phase is to trigger *Systemic Perception*.
- **Narrative Hooks:** Use the story to create intrinsic motivation. The problem should matter to the characters or the world.
- **Authentic Constraints:** Present the limitations of the environment clearly (e.g., "The bridge is broken and we only have these three materials").
- **Questioning Strategies:** Prompt observation without revealing the underlying constraints. Ask questions like, *"What do you notice about how the system reacts when you do X?"* rather than *"Do you see that X causes Y?"*

## Phase 2: Guiding the Logic (Scaffolding)
During the learner's initial attempt to build a solution, they will engage in *Structural Decomposition* and *Algorithmic Synthesis*. The goal here is to provide support without doing the cognitive work for them.
- **Making Thinking Visible:** Ask learners to map out their logic conceptually (using pseudo-code, flowcharts, or plain English) before they touch Python syntax.
- **Logical Guardrails:** Use environmental constraints to naturally limit overwhelming choices, preventing the learner from going down an infinitely wrong path.
- **Scaffolded Complexity:** Break massive problems into smaller, testable sub-problems, allowing the learner to experience small wins and build momentum.

## Phase 3: Navigating the Struggle (Coaching)
This is the most critical instructional moment: what to do when the learner fails. In PyBe, failure is expected data collection. We must manage this *productive struggle* carefully to prevent it from degrading into frustration.
- **Progressive Hinting:** Hints must follow a strict progression. 
  1. *Level 1 (Nudge):* High-level reminder of the goal or constraint. 
  2. *Level 2 (Pointer):* Specific direction toward the logical flaw (e.g., "Look at how your loop terminates").
  3. *Level 3 (Intervention):* Explicit breakdown of the logic, but **never** providing the raw Python syntax to copy-paste.
- **Misconception Handling:** Feedback must address *why* a specific piece of logic failed based on the learner's actual input, rather than outputting a generic "Incorrect." It should target the flawed mental model.

## Phase 4: Solidifying the Abstraction (Fading & Reflection)
Immediately after a learner successfully resolves a scenario, the instructional designer must guide them toward *Abstract Generalization*.
- **Metacognitive Prompts:** Ask the learner to articulate *why* their solution worked. (e.g., "How did introducing that variable change the outcome?"). 
- **Fading:** Deliberately remove (fade) support mechanisms that were present during the struggle. If they relied on a logic map to solve the problem, they must now explain the solution without it.
- **Consolidation:** Summarize the core computational concept that emerged during the scenario, stripping away the specific narrative context so the learner sees the universal rule.

## Phase 5: Orchestrating Transfer (Long-Term Reinforcement)
To maintain knowledge over the long term, curriculum designers must orchestrate how a concept is revisited across multiple scenarios and worlds.
- **Spaced Reinforcement:** A concept (like a loop) should not be taught and then abandoned. It must reappear in later scenarios after the learner has had time to partially forget it, forcing retrieval practice.
- **Interleaving:** Mix different types of problems together. A scenario should eventually require the learner to combine a recently learned concept with one learned three storylines ago.
- **Structural Transfer:** Design subsequent scenarios that require the learner to transfer a concept into a fundamentally different narrative context, ensuring they have abstracted the logic away from its original story.

## The Arc of Learner Autonomy (Adaptive Guidance)
The instructional system must account for learner growth over time. The level of support provided in Phase 1 (Framing) and Phase 2 (Scaffolding) should dramatically change as a learner progresses from a complete novice to an advanced problem solver.
- **Early Stages:** Heavy scaffolding, explicit logic mapping, and narrative guardrails.
- **Intermediate Stages:** Fading of guardrails. The learner must independently identify constraints and formulate their own sub-problems.
- **Advanced Stages:** Intentional withholding of guidance. The learner is presented with a systemic problem and must independently perceive, decompose, synthesize, and resolve it. Autonomy is the ultimate goal.
