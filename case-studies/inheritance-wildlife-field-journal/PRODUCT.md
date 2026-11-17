# 🦅 PyBe — Inheritance Discovery Engine

**A feature of the PyBe platform.**

*An interactive, story-driven learning experience that teaches Object-Oriented Inheritance through the "Wildlife Observer's Field Journal" case study — the learner discovers the relationship first, and the Python syntax comes later.*

---

## 🌟 Overview

The **Inheritance Discovery Engine** is an interactive learning experience integrated into the PyBe platform.

The experience teaches **Object-Oriented Inheritance** through a wildlife investigation rather than beginning with a traditional programming definition.

The learner enters the role of a wildlife observer and investigates different animals, their shared characteristics, their specialized behaviors, and the relationships between them.

The learning experience gradually moves through:

```text
Story → Observation → Discovery → Concept → Python
```

The learner does not begin by being told:

> "Inheritance is the mechanism by which one class derives from another."

Instead, the learner first encounters a situation where the relationship can be observed naturally.

Only after the learner has explored and reasoned about the relationship is the concept formally introduced.

The final stage connects the discovered idea to Python syntax and coding.

---

# 👥 Team Members

| **Name** | **Contribution** |
|---|---|
| **Pritam Patra** | UI/content refinement, wildlife case-study design, saga/content integration, backend and frontend integration, learning-flow implementation |
| **Joydeep Roy** | Inheritance learning experience support,Core Inheritance Discovery Engine, story assets, application preview, documentation, README and product specification |

Together, the contribution focuses on creating a complete **story-driven discovery experience for Object-Oriented Inheritance** inside PyBe.

---

# 📖 Table of Contents

1. [Product Vision](#-1-product-vision)
2. [Pedagogical Framework & Methodology](#-2-pedagogical-framework--methodology)
3. [Learning Journey](#-3-learning-journey)
4. [Codebase Structure](#-4-codebase-structure)
5. [How the Experience Is Designed](#-5-how-the-experience-is-designed)
6. [Content Architecture](#-6-content-architecture)
7. [Content Coverage](#-7-content-coverage)
8. [Interactive Experience](#-8-interactive-experience)
9. [Technical Architecture](#-9-technical-architecture)
10. [Data Model](#-10-data-model)
11. [Learning Design Principles](#-11-learning-design-principles)
12. [Extending the Learning Experience](#-12-extending-the-learning-experience)
13. [Success Criteria](#-13-success-criteria)
14. [Future Roadmap](#-14-future-roadmap)
15. [Product Status](#-15-product-status)

---

# 🎯 1. Product Vision

The goal of the Inheritance Discovery Engine is to make Object-Oriented Inheritance easier to understand by allowing learners to **discover the underlying relationship before learning the formal terminology**.

Traditional learning often follows:

```text
Definition
    ↓
Explanation
    ↓
Example
    ↓
Exercise
```

The PyBe inheritance experience instead follows:

```text
Case Study
    ↓
Observation
    ↓
Comparison
    ↓
Pattern Recognition
    ↓
Concept Discovery
    ↓
Python Application
```

The central product principle is:

> **Do not give the learner the concept immediately. Give them a case worth exploring.**

The learner should finish the experience thinking:

> "I understand why these classes are related."

rather than:

> "I memorized the definition of inheritance."

---

## The Core Learning Loop

```text
┌──────────────────────────────────────────────┐
│                                              │
│             WILDLIFE CASE STUDY             │
│                                              │
│                    ↓                         │
│                                              │
│                OBSERVATION                   │
│                                              │
│                    ↓                         │
│                                              │
│                 COMPARISON                   │
│                                              │
│                    ↓                         │
│                                              │
│              PATTERN DISCOVERY               │
│                                              │
│                    ↓                         │
│                                              │
│                INHERITANCE                   │
│                                              │
│                    ↓                         │
│                                              │
│              PYTHON CLASSES                  │
│                                              │
│                    ↓                         │
│                                              │
│                CODE PRACTICE                 │
│                                              │
└──────────────────────────────────────────────┘
```

---

# 🧠 2. Pedagogical Framework & Methodology

The inheritance experience is based on several connected learning principles.

---

## 2.1 Narrative Learning — The Story Bridge

The central teaching device is the **Wildlife Observer's Field Journal**.

The learner encounters animals and situations before encountering programming terminology.

The story establishes a relationship between:

```text
General Entity
       │
       ├── Shared Characteristics
       │
       └── Specialized Entity
                │
                └── Additional Characteristics
```

This relationship becomes the conceptual foundation for inheritance.

The learner first understands the relationship in familiar terms.

Only afterward does the application introduce the programming representation:

```python
class Eagle(Animal):
    ...
```

The story therefore acts as a bridge between:

```text
Real-world reasoning
        ↓
Object-oriented thinking
        ↓
Python syntax
```

---

# 2.2 Constructivist Learning

The experience encourages the learner to **construct the concept** rather than simply receive it.

The learner observes:

- Similarities
- Differences
- Shared characteristics
- Specialized characteristics
- Relationships between entities

The learner then builds an explanation from those observations.

This produces a progression:

```text
"I noticed it."

        ↓

"I can describe it."

        ↓

"I can explain the relationship."

        ↓

"Now I understand the programming concept."

        ↓

"I can write it in Python."
```

---

# 2.3 Experiential Learning

The learning experience follows an experience → reflection → concept → application cycle.

```text
Concrete Experience
        ↓
Wildlife Story
        ↓
Observation
        ↓
Reflection
        ↓
Pattern Recognition
        ↓
Conceptual Understanding
        ↓
Python Application
        ↓
Practice
```

The learner is therefore not only reading about inheritance.

They experience the relationship, reason about it, and then implement it.

---

# 2.4 Scaffolding and Gradual Release

The experience provides more support at the beginning and gradually expects the learner to work independently.

### Early Stage

The story provides strong context.

The learner is guided by:

- Narrative
- Characters
- Visual scenes
- Questions
- Comparisons

### Middle Stage

The learner begins to reason independently.

Activities focus on:

- Discovery
- Transfer
- Concept connection
- Knowledge checks

### Final Stage

The learner works directly with programming.

The support shifts toward:

- Python syntax
- Code examples
- Code completion
- Code-writing activities

The overall progression is:

```text
High Support
     ↓
Guided Discovery
     ↓
Independent Reasoning
     ↓
Code Application
```

---

# 2.5 Cognitive Load Management

The experience separates the story from the programming syntax initially.

The learner is not required to process a story, programming terminology, and Python syntax simultaneously.

Instead:

```text
Story
  ↓
Meaning
  ↓
Relationship
  ↓
Concept
  ↓
Syntax
```

This allows the learner to focus on one conceptual step at a time.

---

# 2.6 Retrieval and Transfer

Understanding is reinforced through activities that require the learner to recall and apply the discovered relationship.

The experience includes:

- Multiple-choice checks
- Transfer scenarios
- Concept questions
- Code activities

The learner is therefore encouraged to move from:

```text
Recognition
     ↓
Explanation
     ↓
Application
     ↓
Transfer
```

---

# 🗺️ 3. Learning Journey

The inheritance case study follows four major phases.

---

## Phase 1 — Observe

The learner enters the wildlife investigation.

The application introduces the story and provides visual context.

The learner is encouraged to identify what the different animals have in common.

### Questions at this stage may focus on:

- What characteristics do you notice?
- What behaviors appear similar?
- What appears to be shared?
- What seems different?

### Objective

**Notice the pattern without being given the programming term.**

---

## Phase 2 — Discover

The learner investigates a more specialized example.

The learner compares it with the more general example.

The comparison focuses on:

| Observation | Learner Reasoning |
|---|---|
| Shared characteristics | What remains common? |
| Specialized characteristics | What is unique? |
| Shared behavior | What can be reused? |
| Additional behavior | What does the specialized entity add? |

### Objective

**Recognize the general-to-specialized relationship.**

---

## Phase 3 — Connect

After the relationship has been explored, the formal concept is introduced:

# Inheritance

The learner now connects the story to Object-Oriented Programming.

The relationship becomes:

```text
General Entity
      ↓
Parent Class
      ↓
Inheritance
      ↓
Child Class
      ↓
Specialized Behavior
```

### Objective

**Connect the observed relationship to the programming concept.**

---

## Phase 4 — Apply

The learner moves into Python.

A simplified example is:

```python
class Animal:
    pass


class Eagle(Animal):
    pass
```

The learner is expected to understand that `Eagle` is a specialized class related to `Animal`.

The experience then provides opportunities to complete or write inheritance-related code.

### Objective

**Demonstrate conceptual understanding through Python.**

---

# 🗂️ 4. Codebase Structure

The contribution is organized inside the `Pritam_Patra` directory of the PyBe repository.

The feature combines:

- React frontend
- Express backend
- JSON-based saga data
- Story assets
- Learning-state management
- Evaluation support

---

## Project Tree

```text
Pritam_Patra/
│
├── README.md
├── PRODUCT.md
├── ANSWER_KEY.md
├── context.md
├── spec.md
├── change.md
├── package.json
├── pybe-preview.png
│
├── client/
│   │
│   ├── public/
│   │   └── without_dialog/
│   │       ├── act1.png
│   │       ├── act2.png
│   │       ├── act3.png
│   │       ├── act4.png
│   │       ├── act5.png
│   │       ├── act6.png
│   │       ├── act7.png
│   │       └── act8.png
│   │
│   └── src/
│       ├── main.jsx
│       └── ...
│
└── server/
    │
    ├── .env.example
    │
    └── src/
        ├── index.js
        │
        ├── routes/
        │   └── sagas.js
        │
        └── data/
            ├── db.json
            │
            └── sagas/
                └── inheritance.json
```

---

# 🖥️ Frontend

The frontend is responsible for the interactive learning experience.

The main React application manages different stages of the learning journey.

The experience includes states such as:

```text
intro
narrating
observation
transfer
mcq
summary
story-bridge
slide-teach
code
code-write
success
```

Each state represents a different learning activity or transition.

---

# ⚙️ Backend

The backend is implemented using:

- Node.js
- Express
- REST API

The backend provides the learning data required by the frontend and supports learning-related operations.

The API is responsible for handling concepts such as:

```text
Saga retrieval
Act retrieval
Evaluation
Session handling
Health checking
```

---

# 🗃️ 5. How the Experience Is Designed

The application combines narrative content with interactive learning states.

A simplified experience flow is:

```text
┌───────────────────────────────────────────────────────┐
│                    INTRODUCTION                       │
│                                                       │
│        Choose the Wildlife Observer case             │
└───────────────────────┬───────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────────┐
│                     NARRATIVE                         │
│                                                       │
│              Explore the wildlife story               │
└───────────────────────┬───────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────────┐
│                    OBSERVATION                        │
│                                                       │
│          Identify shared characteristics              │
└───────────────────────┬───────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────────┐
│                     DISCOVERY                         │
│                                                       │
│          Compare general and specialized              │
│                    examples                            │
└───────────────────────┬───────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────────┐
│                      TRANSFER                         │
│                                                       │
│          Apply the relationship elsewhere             │
└───────────────────────┬───────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────────┐
│                   CONCEPT BRIDGE                      │
│                                                       │
│                  INHERITANCE                           │
└───────────────────────┬───────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────────┐
│                    CODE TEACHING                      │
│                                                       │
│              Connect story → Python                   │
└───────────────────────┬───────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────────┐
│                    CODE PRACTICE                      │
│                                                       │
│             Complete / write Python code              │
└───────────────────────┬───────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────────┐
│                       SUCCESS                         │
│                                                       │
│               Demonstrated understanding              │
└───────────────────────────────────────────────────────┘
```

---

# 🧩 6. Content Architecture

The learning content is organized hierarchically.

```text
Saga
│
├── Arc
│   │
│   ├── Act
│   ├── Act
│   └── Act
│
├── Arc
│   │
│   ├── Act
│   └── Act
│
└── Arc
    │
    ├── Act
    └── Act
```

The current inheritance saga is:

```text
Wildlife Observer's Field Journal
```

It contains:

```text
3 Arcs
8 Acts
```

---

## The Three Arcs

### Arc 1 — Foundations

The learner begins the investigation and develops the initial observations needed to recognize the pattern.

### Arc 2 — Behavior

The learner explores characteristics and behaviors and begins comparing general and specialized examples.

### Arc 3 — Family Trees

The learner connects the relationships discovered during the investigation to the idea of inheritance and class hierarchies.

---

# 📊 7. Content Coverage

The current case study covers the following progression:

| **Learning Area** | **Purpose** |
|---|---|
| Wildlife Story | Establish context |
| Observation | Identify common patterns |
| Comparison | Identify similarities and differences |
| Discovery | Recognize general/specialized relationships |
| Transfer | Apply the pattern to another situation |
| Concept Connection | Introduce Inheritance |
| Teaching | Explain the formal programming model |
| Story Bridge | Connect story to code |
| Code Example | Show Python inheritance |
| Code Practice | Apply the concept |
| Summary | Consolidate understanding |
| Success | Confirm completion |

---

# 🦅 The Core Inheritance Pattern

The central conceptual model is:

```text
             Animal
                │
       ┌────────┼────────┐
       │        │        │
       ▼        ▼        ▼
     Eagle     Lion    Dolphin
       │
       │
       └── Specialized characteristics
```

The learner first encounters this relationship conceptually.

The same relationship is later represented in Python:

```python
class Animal:
    pass


class Eagle(Animal):
    pass
```

The important learning connection is:

```text
Animal
  ↓
General characteristics
  ↓
Eagle
  ↓
Specialized characteristics
```

becomes:

```text
Animal
  ↓
Parent Class
  ↓
Inheritance
  ↓
Eagle
  ↓
Child Class
```

---

# 🎮 8. Interactive Experience

The product uses multiple interaction types.

---

## Story

The learner progresses through a wildlife narrative supported by visual scenes.

The story provides the context required for discovery.

---

## Observation

Learners are asked to identify what they notice.

The objective is to encourage reasoning before terminology.

---

## Transfer

The learner encounters another situation and is asked to apply the same relationship.

This helps verify conceptual understanding.

---

## MCQ

Multiple-choice activities provide quick checks of understanding.

They can test:

- Relationships
- Characteristics
- Inheritance concepts
- Python representations

---

## Story Bridge

The Story Bridge connects:

```text
Wildlife Story
      ↓
Observed Relationship
      ↓
Inheritance
      ↓
Python
```

This is an important transition in the learning experience.

---

## Slide-Based Teaching

The application can present structured teaching material after the discovery phase.

This allows the learner to move from an intuitive understanding to a more formal explanation.

---

## Code Practice

The learner works with Python inheritance examples.

The objective is to ensure that the learner can move from:

```text
"I understand it."
```

to:

```text
"I can implement it."
```

---

## Summary

The experience provides a consolidation stage where the learner can review the journey and reinforce the main idea.

---

## Field Journal

The field-journal interface provides a thematic way of displaying learner progress.

The experience can include:

- Arcs
- Acts
- XP
- Notes
- Progress

---

# 🏗️ 9. Technical Architecture

The feature follows a client-server architecture.

```text
                    ┌──────────────────┐
                    │     Browser      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ React + Vite     │
                    │    Frontend      │
                    └────────┬─────────┘
                             │
                         REST API
                             │
                             ▼
                    ┌──────────────────┐
                    │ Node + Express   │
                    │     Backend      │
                    └────────┬─────────┘
                             │
                 ┌───────────┴───────────┐
                 ▼                       ▼
        ┌─────────────────┐     ┌─────────────────┐
        │ JSON Saga Data  │     │ AI Evaluation   │
        │                 │     │ Integration     │
        └─────────────────┘     └─────────────────┘
```

---

## Frontend Responsibilities

The frontend handles:

- User interface
- Story rendering
- Learning-state transitions
- User input
- Questions
- Transfer activities
- Code activities
- Progress
- Summary
- Field Journal

---

## Backend Responsibilities

The backend handles:

- Saga data
- Act data
- API requests
- Evaluation requests
- Session-related operations
- Health checking

---

## Data Responsibilities

The current prototype uses JSON-based storage.

Inheritance saga content is stored in:

```text
server/src/data/sagas/inheritance.json
```

This makes the content easy to inspect, edit, and extend.

---

# 🗄️ 10. Data Model

The learning experience is represented using structured saga data.

The high-level model is:

```text
Saga
├── id
├── title
├── subtitle
├── icon
├── accent
├── arcs
└── acts
```

An act can contain different types of learning information depending on the activity.

Conceptually:

```text
Act
├── Narrative
├── Observation
├── Transfer
├── MCQ
├── Summary
├── Story Bridge
├── Teaching
└── Code
```

This allows the frontend to render different learning experiences while keeping the content separate from the UI implementation.

---

# 🎨 11. Learning Design Principles

## 1. Story Before Syntax

The learner encounters the story before Python syntax.

---

## 2. Discovery Before Definition

The learner explores the relationship before receiving the formal term.

---

## 3. Active Participation

The learner should answer, compare, observe, and apply rather than only read.

---

## 4. Concept Before Code

Python syntax is introduced after the learner has developed an understanding of the underlying relationship.

---

## 5. Progressive Difficulty

The experience moves from:

```text
Easy observation
      ↓
Guided discovery
      ↓
Conceptual understanding
      ↓
Application
      ↓
Code
```

---

## 6. Transfer

The learner should be able to recognize inheritance outside the original wildlife example.

---

## 7. Immediate Feedback

Interactive activities should provide feedback so that learners can understand mistakes rather than simply receiving a score.

---

## 8. Reflection

The learner should be encouraged to think about the relationship beyond the exact example shown in the story.

---

# 🧪 12. Extending the Learning Experience

The saga-based architecture makes it possible to expand the experience by adding new content.

A new act can introduce:

- Another story scene
- An observation activity
- A comparison
- A transfer scenario
- A knowledge check
- A teaching section
- A coding activity

The general process is:

```text
1. Define the learning objective
          ↓
2. Create the story/context
          ↓
3. Create the learner activity
          ↓
4. Connect the activity to the inheritance concept
          ↓
5. Add the required content to the saga data
          ↓
6. Render the activity through the frontend
          ↓
7. Test the complete learning flow
```

---

# 📐 Content Design Rules

When creating additional inheritance content:

| **Rule** | **Purpose** |
|---|---|
| Start with a situation | Give the learner something concrete |
| Avoid terminology too early | Preserve discovery |
| Ask observation questions | Encourage reasoning |
| Compare general and specialized examples | Reveal the relationship |
| Introduce terminology after discovery | Connect intuition to formal knowledge |
| Use Python only after conceptual grounding | Reduce cognitive overload |
| Include application | Verify actual understanding |
| Include transfer | Prevent simple memorization |

---

# 🧑‍💻 Adding a New Story Scene

New story scenes can be stored alongside the existing visual assets.

Current story assets follow the pattern:

```text
client/public/without_dialog/
├── act1.png
├── act2.png
├── act3.png
├── act4.png
├── act5.png
├── act6.png
├── act7.png
└── act8.png
```

A new scene should correspond to a meaningful moment in the learning journey rather than being added only for decoration.

---

# 🔗 Story → Concept → Code Mapping

Every important story moment should have a conceptual purpose.

For inheritance, the mapping can be represented as:

| **Story Observation** | **Programming Idea** |
|---|---|
| Animals share characteristics | Common parent structure |
| One animal has additional characteristics | Specialized child class |
| Common behavior can be reused | Inherited behavior |
| Specialized behavior exists | Child-specific behavior |
| General → specialized relationship | Class inheritance |

This mapping is what turns the story into a programming lesson.

---

# 📈 13. Success Criteria

The experience should be considered successful when a learner can move beyond memorizing the word "Inheritance."

A successful learner should be able to:

### Explain

Describe inheritance using their own words.

### Identify

Recognize a parent-child class relationship.

### Compare

Distinguish shared characteristics from specialized characteristics.

### Understand

Explain why inheritance can be useful in Object-Oriented Programming.

### Recognize

Understand Python inheritance syntax.

### Implement

Write a basic child class that inherits from a parent class.

### Transfer

Recognize inheritance relationships in a new example.

---

# 🧭 Completion Model

The learner's progress can be viewed as:

```text
        STORY
          ↓
     OBSERVATION
          ↓
      DISCOVERY
          ↓
      EXPLANATION
          ↓
      INHERITANCE
          ↓
      PYTHON CODE
          ↓
       PRACTICE
          ↓
      APPLICATION
```

The goal is not merely to reach the final screen.

The goal is to ensure that the learner understands the relationship represented by the final code.

---

# 🔮 14. Future Roadmap

## More Inheritance Scenarios

Introduce additional examples beyond wildlife.

Possible domains include:

```text
Vehicles
Employees
Shapes
Devices
Animals
Educational Systems
```

---

## Adaptive Feedback

Increase the use of learner responses to identify misconceptions and provide more targeted guidance.

---

## More Coding Challenges

Add progressively harder Python inheritance problems.

For example:

```text
Basic inheritance
        ↓
Inherited methods
        ↓
Additional child behavior
        ↓
Method overriding
        ↓
Multi-level relationships
```

---

## Deeper Progress Tracking

Future versions could track:

- Concept mastery
- Question performance
- Coding performance
- Repeated misconceptions
- Completion progress

---

## More Story Assets

Additional visual scenes can make longer learning journeys more immersive.

---

## Expanded Transfer Activities

Learners could be asked to identify inheritance relationships from everyday systems and then translate them into Python.

---

# 🔐 Current Product Scope

The current contribution is focused on:

## Object-Oriented Inheritance

The implemented experience contains:

- Wildlife Observer's Field Journal
- 3 learning arcs
- 8 acts
- Story-driven learning
- Visual story scenes
- Observation activities
- Discovery activities
- Transfer scenarios
- Multiple-choice checks
- Summary activities
- Story-to-code bridge
- Structured teaching
- Python code examples
- Code-writing activities
- Field Journal/progress experience
- JSON-based saga content
- Backend API support
- AI-assisted evaluation support

---

# 🛠️ Technology Stack

| **Layer** | **Technology** |
|---|---|
| Frontend | React |
| Build Tool | Vite |
| Backend | Node.js |
| API Framework | Express.js |
| Language | JavaScript |
| Styling | CSS |
| Content/Data | JSON |
| AI Integration | Gemini |
| Package Manager | npm |

---

# 🌐 Development Configuration

The current development setup uses:

| **Service** | **Address** |
|---|---|
| Frontend | `http://localhost:5174` |
| Backend | `http://localhost:5001` |

The backend environment configuration includes:

```env
PORT=5001
CLIENT_ORIGIN=http://localhost:5174
GEMINI_API_KEY=your_gemini_api_key_here
```

---

# 👥 Contribution Breakdown

## Pritam Patra

Pritam's contribution focuses on the core inheritance learning experience.

Major areas include:

- Wildlife Observer's Field Journal concept
- Inheritance saga/content structure
- Learning-flow implementation
- Frontend integration
- Backend integration
- Saga data integration
- Learning activities
- Inheritance-focused case-study implementation
- Application functionality

---

## Joydeep Roy

Joydeep's contribution focuses on supporting and refining the inheritance experience and its presentation.

Major areas include:

- Inheritance learning-flow support
- Story visual assets
- Application preview
- Documentation
- README refinement
- Product specification
- Presentation of the learning experience
- Supporting the final inheritance-focused project structure

---

# 📋 Product Documentation Map

| **Document** | **Purpose** |
|---|---|
| [`README.md`](./README.md) | Project overview, features, setup, and application preview |
| [`PRODUCT.md`](./PRODUCT.md) | Detailed product vision, pedagogy, architecture, and content design |
| [`ANSWER_KEY.md`](./ANSWER_KEY.md) | Expected answers and learning checkpoints |
| [`context.md`](./context.md) | Project context |
| [`spec.md`](./spec.md) | Feature specification |
| [`change.md`](./change.md) | Implementation changes |

---

# 📌 15. Product Status

| **Property** | **Current Status** |
|---|---|
| Product | PyBe Inheritance Discovery Engine |
| Case Study | Wildlife Observer's Field Journal |
| Primary Concept | Object-Oriented Inheritance |
| Learning Arcs | 3 |
| Learning Acts | 8 |
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Data | JSON |
| AI | Gemini integration |
| Status | Working Prototype |

---

# 🌱 Final Product Philosophy

The Inheritance Discovery Engine is built around one simple idea:

> **The learner should discover the shape of the concept before being given its name.**

The learner begins with a story.

The story creates observations.

The observations create a pattern.

The pattern becomes a programming concept.

The programming concept becomes code.

```text
┌──────────────┐
│    STORY     │
└──────┬───────┘
       ↓
┌──────────────┐
│  OBSERVE     │
└──────┬───────┘
       ↓
┌──────────────┐
│  DISCOVER    │
└──────┬───────┘
       ↓
┌──────────────┐
│  CONNECT     │
│ INHERITANCE  │
└──────┬───────┘
       ↓
┌──────────────┐
│    APPLY     │
│    PYTHON    │
└──────────────┘
```

The final goal is not for the learner to remember:

```text
class Child(Parent)
```

as an isolated syntax rule.

The goal is for the learner to understand **why that relationship exists**, and then recognize how Python expresses it.

---

## 🦅 Wildlife Observer's Field Journal

**3 Arcs · 8 Acts · 1 Discovery Journey**

**Observe → Discover → Connect → Apply**

---

**Part of the PyBe platform — Python, By Experience.**