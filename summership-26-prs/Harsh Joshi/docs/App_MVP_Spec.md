# Application MVP Specifications (`App_MVP_Spec.md`)

This document is the Markdown representation and breakdown of the Minimum Viable Product (MVP) specifications originally derived from `App.pdf` and our foundational product philosophy.

---

## 1. Executive Summary & Objective

The PyBe "Antigravity" MVP is designed to prove that programming paradigms can be taught more effectively by removing machine-level syntax friction and replacing it with narrative-driven discovery and psychological adaptation—**without requiring external AI/LLM infrastructure**.
Through architectural decoupling, the MVP demonstrates remarkable efficiency: **5 topics -> 5 templates of stories × 50 categories of 50 subcategories -> 250 stories with under 100 KB of storage!**

The MVP delivers a fully functional, localized onboarding journey where learners customize their learning context and engage in a 4-layer interactive case study.

---

## 2. Target Audience & User Personas

- **The Overwhelmed Beginner (High Syntax Fatigue)**: Has tried traditional coding bootcamps or tutorials but gets bogged down by semicolons, indentation, and boilerplate setup.
- **The Domain Specialist**: Understands complex real-world logic (e.g., football tactics, business accounting, storytelling) but struggles to translate that intuition into code syntax.
- **The Self-Directed Explorer**: Thrives in non-linear, discovery-based environments where they can follow their personal passions rather than a rigid, standardized curriculum.

---

## 3. Core MVP Functional Requirements

### 3.1 Rhizomatic Onboarding Drill-Down
- **Requirement**: The system must provide a multi-stage selection interface allowing users to pick:
  1. Category (e.g., Hobbies, Movies, Mythology)
  2. Niche Topic (e.g., Football, Avengers, Panchatantra)
  3. Role/Entity (e.g., Striker, Time Stone, Fox)
- **Acceptance Criteria**: Selections must map strictly to backend dictionaries without generating dead ends or broken references.

### 3.2 Psychological Scaffolding ("Lazy vs. Motivated" Scale)
- **Requirement**: A UI slider ranging from 0 to 100 that adjusts the pedagogical difficulty and syntax scaffolding.
- **Acceptance Criteria**: 
  - Score `0-33` (Lazy): Reveals 98% of syntax.
  - Score `34-66` (Balanced): Reveals 95% of syntax (The 95/5 Rule).
  - Score `67-100` (Motivated): Reveals 90% of syntax.

### 3.3 Rule-Based Engine & 4-Layer Case Study Rendering
- **Requirement**: The backend must deterministically interpolate thematic vocabularies into Master Story Archetypes (supporting up to 500 words using very simple, easy-to-understand language across 5 core Python topics: Variables, Conditionals, Loops, Lists, and Functions) and return a structured JSON payload.
- **Acceptance Criteria**: The frontend must render the payload into four distinct visual layers:
  1. **Story Layer**: Narrative text supporting up to 500 words using simple, engaging language.
  2. **Discovery Layer**: Plain-English pseudocode and structural mapping representation.
  3. **Application Layer**: Interactive code block with target blanks corresponding to the 95/5 rule.
  4. **Reflection Layer**: Socratic multiple-choice verification prompt.

### 3.4 Contradiction Catching Prototype
- **Requirement**: The system must maintain an active array of learner beliefs in local session state. When a topic collides with an existing belief, a "Clash Archetype" must be served.
- **Acceptance Criteria**: Correctly solving a Clash Archetype must overwrite the outdated belief in state and log the resolution.

---

## 4. Technical Scope & Out-of-Scope (MVP Boundaries)

| Functional Area | In-Scope for MVP | Out-of-Scope (Post-MVP / Future) |
| :--- | :--- | :--- |
| **AI / LLMs** | 100% Deterministic Rule-Based String Interpolation | OpenAI, Anthropic, or TinyLLM API integration |
| **Database** | Local JSON file (`personalized_templates.json`) | MongoDB / Mongoose cloud persistence |
| **Authentication** | Guest / Local Session tracking | OAuth, JWT, or multi-user accounts |
| **Real-Time** | REST HTTP POST endpoints | Socket.IO live pair-programming |
| **Integration** | Isolated `/personalized-journey` React route | Modifying existing Scenario Browser code |
