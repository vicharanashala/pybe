# Feature Breakdown (`FEATURES.md`)

The "Antigravity" module introduces an innovative, pedagogy-first learning environment to PyBe. This document outlines the core features and capabilities of the module.

---

## 1. Rhizomatic Onboarding & Thematic Exploration

Unlike linear programming courses, PyBe empowers learners to explore Python concepts through personalized, non-linear thematic pathways called **Rhizomes**.
- **Multi-Tier Drill-Down**: Learners start with broad categories (Hobbies, Movies, Mythology, Economics) and drill down into ultra-specific niches (e.g., *Hobbies -> Football -> Playing -> Striker* or *Movies -> MCU -> Infinity Stones -> Time Stone*).
- **Strict Coherence Mapping**: To prevent combinatorial explosion and maintain pedagogical rigor, every thematic niche is strictly mapped to allowed Master Story Archetypes in the backend data layer.

---

## 2. The 95/5 Rule & Minimal Typing Friction

A flagship pillar of the "Intuitive Way" philosophy is eliminating syntax fatigue. Traditional platforms force beginners to memorize boilerplate syntax before understanding logic.
- **95% Provided Syntax**: The application automatically generates and populates 95% of the code structure, variable declarations, and formatting.
- **5% Conceptual Realization**: The learner is required to type only the critical 5%—the exact operator, keyword, or loop condition that demonstrates true understanding of the underlying computational paradigm.
- **Dynamic Adaptation via "Lazy vs. Motivated" Scale**:
  - **Lazy Setting (Low Motivation/High Fatigue)**: The system reveals up to 98% of the syntax, leaving only a single choice or toggle to complete the logic.
  - **Motivated Setting (High Focus)**: The system reduces scaffolding to ~90%, requiring the learner to construct full conditional expressions or loop boundaries.

---

## 3. Narrative over Syntax (Up to 500-Word Immersive Stories)

Machine syntax is treated as a secondary byproduct of human narrative.
- **Immersive Cause-and-Effect**: Every programming concept is introduced via a rich narrative supporting up to 500 words using very simple, easy-to-understand language across 5 core Python topics (Variables, Conditionals, Loops, Lists, Functions).
- **Relatable Metaphors**: Instead of abstract mathematical examples (`i = i + 1`), concepts are taught using the learner's chosen rhizomic theme (e.g., a football striker depleting stamina over 90 minutes to teach `while` loops).

---

## 4. The Contradiction Engine & Productive Struggle

Learning breakthroughs occur when existing mental models are challenged and refined.
- **Belief State Tracking**: The frontend and backend track learner beliefs across sessions (e.g., recording whether the learner currently believes "a variable can only hold a single primitive number").
- **Automated Contradiction Catching**: When a learner encounters a concept that contradicts their recorded belief (e.g., introducing Python Lists or Re-assignment), the system detects the collision.
- **Productive Struggle Scenarios**: Instead of presenting a standard tutorial, the engine dynamically generates a specialized "Clash Archetype" narrative that forces the learner to actively resolve the paradox through interactive trial and error.

---

## 5. The 4-Layer Interactive Case Study View

Every generated learning session is rendered in a cohesive 4-layer interface designed to scaffold cognitive assimilation:
1. **Layer 1: Story Layer**: The engaging, personalized narrative (supporting up to 500 words in simple language) establishing the goal and constraints.
2. **Layer 2: Discovery Layer**: Plain-English pseudocode and structural breakdown bridging the narrative to logic.
3. **Layer 3: Application Layer**: The interactive code editor implementing the 95/5 rule with real-time feedback and hints.
4. **Layer 4: Reflection Layer**: Socratic verification questions and metacognitive prompts that solidify the concept and update the user's belief state.

---

## 6. The 50 Worlds Expansion (250 Kid-Friendly Scenarios)

To ensure maximum engagement and relatability for learners of all ages—especially younger learners (8-year-old reading level)—the PyBe database features a massive matrix of **50 Worlds mapped across 5 Core Programming Categories** (Variables, Conditionals, Loops, Lists, Functions), totaling **250 unique interactive scenarios**.
- **Relatable Universes**: Learners can master Python inside familiar, exciting domains such as Pets, Superheroes, Video Games, Space Exploration, Magic Schools, Food & Bakeries, Sports, Pirates, Dinosaurs, Robots, Ocean Life, Fairies, Ninjas, Spies, Vampires, Dragons, and Unicorns.
- **Decoupled Architecture**: By pairing 5 generic Master Story Archetypes with 250 specialized thematic vocabulary dictionaries, PyBe achieves infinite pedagogical variety without bloating the core engine logic or requiring external AI/LLM text generation.
- **Ultra-Lightweight Storage Efficiency**: 5 topics -> 5 templates of stories × 50 categories of 50 subcategories -> 250 stories with under 100 KB of storage!

---

## 7. Event-Driven Contradiction Engine & Unit of Work

PyBe's core pedagogical philosophy is **Contradiction as a Teacher**: learners master concepts most deeply through productive struggle when their existing mental models collide with new programming paradigms.
- **Event-Driven Architecture**: The backend utilizes an asynchronous `MessageBus.js` to decouple core teaching flows from side effects. When a user completes a lesson, a `ConceptMastered` domain event is broadcast across the bus.
- **Paradigm Conflict Detection**: The Contradiction Engine listens for `ConceptMastered` events and tracks the learner's evolving belief state. For example, when a learner who previously mastered `variables_identity` (internalizing the belief that "a variable box holds exactly ONE value") attempts `lists_inventory`, the engine detects the paradigm conflict and broadcasts a `ContradictionTriggered` event: *"Wait! You learned that a variable holds ONE value. How can this container hold MANY items? Your previous rule is breaking!"*
- **Productive Struggle Induction**: The `ContradictionTriggered` event interrupts standard progression, injecting a specialized "Dilemma" Case Study that guides the learner to resolve the paradox on their own.
- **Unit of Work (UoW)**: All state transitions and event emissions are wrapped in an atomic `UnitOfWork.js` transaction (begin, commit, rollback), guaranteeing data consistency across repositories without creating a distributed big ball of mud.
