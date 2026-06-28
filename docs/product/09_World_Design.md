# PyBe World Design

## Purpose of this Document
This document is the foundational architecture for the Product layer of PyBe. While previous documents defined the educational theories and structural maps of how learning occurs, this document defines the primary *experiential container* where that learning takes place. 

It answers one central question: **What is a "World" in PyBe, and how does it shape the learner’s experience?** This document bridges the gap between pedagogy and user experience, ensuring that all designers and content creators share a unified vision of the platform's core environment.

## Defining the "World" Concept
In PyBe, a **World** is a self-contained, thematic, and systemic ecosystem (e.g., a deep-sea research station, a medieval kingdom, a Martian colony). 

A World is not merely an aesthetic skin or a background image; it is a bounded set of logical rules and environmental constraints. When a learner enters a World, they are stepping into a simulation that operates according to its own consistent physical and logical laws. The learner must navigate and manipulate these laws to solve problems.

## The Product Hierarchy
To maintain clarity in product design, UI development, and content creation, the PyBe experience is strictly nested according to the following hierarchy:

1. **World:** The overarching thematic ecosystem (the macro container).
2. **Storylines:** Distinct narrative arcs operating within the rules of the World.
3. **Scenarios:** Individual learning interactions and plot points within a Storyline.
4. **Challenges:** The atomic problem-units (the specific logical constraints) within a Scenario.

This terminology is absolute. Product designers and curriculum writers must use this hierarchy to map the learner's journey.

## The Purpose of Worlds in the Learner Experience
Worlds exist to provide deep immersion, bound cognitive load, and contextualize logic. 

By placing a problem inside a systemic World, the constraints feel "real" and authentic to the learner. Instead of solving an abstract math puzzle on a blank screen, the learner is optimizing power distribution to save a failing life-support system. A well-designed World ensures that the learner's focus remains on observing the system and devising solutions, rather than questioning the arbitrary nature of the problem itself.

## Worlds vs. Traditional Curriculum Modules
Traditional educational platforms group content by *topic* (e.g., "Module 3: While Loops" or "Chapter 4: Lists"). This packaging signals to the learner that they are taking a course and preparing for a test.

PyBe rejects this approach. We group content by *environment* (e.g., "World 2: The Automaton Factory"). This product decision deliberately shifts the learner's mindset from "completing a syllabus" to "surviving and mastering an ecosystem." The pedagogical curriculum (topics) runs silently underneath the product experience (the World).

## Thematic and Systemic Coherence
A World must remain internally consistent to function as a valid learning environment. 

If a World is established as a "low-tech wilderness," the UI, the dialogue, and the logical constraints (e.g., inventory capacity, travel time) cannot suddenly behave like a modern cloud server. This strict coherence is critical; it is the only way a learner can effectively engage in *Systemic Perception* (observing the rules of the environment). If the rules arbitrarily break theme, the learner cannot trust the system enough to formulate logical hypotheses.

## The Boundaries of a World (Anti-Patterns)
To prevent feature creep and architectural blurring, we must explicitly define what a World does *not* contain:
- **No Global Progression:** Worlds do not contain global learner progression dashboards. Those sit at the platform level, entirely outside the World experience.
- **No Cross-Contamination:** Worlds do not bleed into one another. Leaving one World and entering another requires a clean, intentional transition.
- **No Unrelated Mini-Games:** A World does not host isolated puzzles that violate its systemic rules simply for the sake of teaching a quick concept.
