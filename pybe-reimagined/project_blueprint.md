# Pybe — Project Blueprint

> **A free, customisable, web-based tool that teaches Python through problem-first case studies, philosophical metaphors, and free exploration.**

---

## Table of Contents

1. [Vision & Goals](#1-vision--goals)
2. [Pedagogical Pillars](#2-pedagogical-pillars)
3. [Gamification Anchors](#3-gamification-anchors)
4. [Invariants (Non-Negotiable Truths)](#4-invariants-non-negotiable-truths)
5. [Architecture Overview](#5-architecture-overview)
6. [Design Patterns Applied](#6-design-patterns-applied)
7. [Content Schema](#7-content-schema)
8. [Python Curriculum (Levels 1-5)](#8-python-curriculum-levels-1-5)

---

## 1. Vision & Goals

**Pybe = Problem-Based Learning + Rhizomatic Exploration + Philosophical Storytelling + Light Gamification — for Python.**

A web tool where a learner is shown a **case scenario**, decides **what construct** in Python solves it, and gets **unblocked by the system only when stuck**. They never memorize syntax. They discover constructs through the lens of metaphors they care about (Avengers, Harry Potter, Panchatantra, biology, music).

- **Syntax is the LAST step, not the first.** 
- **No score ceiling.** There's always a higher construct to discover.
- **No fixed curriculum order.** All concept nodes reachable from all concept nodes.
- **Every contributor is credited.** Open source with feature-level attribution.

---

## 2. Pedagogical Pillars

| # | Pillar | What It Means in Pybe |
|---|---|---|
| **P1** | **Problem-Based Learning** | Case studies are the entry point. The user first meets a problem, then discovers the construct. |
| **P2** | **Piaget's Cognitive Development** | UI adapts to learner stage — concrete for early stages, abstract for formal. |
| **P3** | **Rhizomatic Learning** | Every learner has a unique trajectory. Multiple entry points. No fixed order. |
| **P4** | **Social Exchange Theory / Jonassen** | Case studies span dilemma, design-thinking, structured-inquiry, unstructured problems. |
| **P5** | **Philosophical Storytelling** | Any concept is explained through a metaphor the learner picks. |

---

## 3. Gamification Anchors

| Metaphor | Origin | What It Maps To in Pybe |
|---|---|---|
| **Horcruxes** (7 hidden) | Harry Potter | Seven hidden mastery challenges. Revealed gradually. |
| **Infinity Stones** | Avengers | Six mastery tokens (could be the 6 color-theory formulas). Time Stone → time complexity. |
| **Sorting Hat** | Harry Potter | Classifies learner into a "house" (level bracket) at the end of level 1. |
| **Avengers universe** | Marvel | Hero-themed learning paths. Each hero = a concept cluster. |
| **Jataka / Panchatantra** | Indian tradition | Storytelling for local-vs-global scope, mutability, etc. |

---

## 4. Invariants (Non-Negotiable Truths)

### Pedagogical
- **INV-P1:** Socratic Primacy — no answer before attempt.
- **INV-P2:** First Principles Before Syntax.
- **INV-P3:** Problem-Driven Motivation.
- **INV-P4:** Rhizomatic Freedom — no fixed order.
- **INV-P5:** Piaget-Stage Honesty.
- **INV-P6:** Failure Is Pedagogy.

### Architectural (SOLID)
- **INV-A1:** SRP — One Responsibility per Unit.
- **INV-A2:** OCP — Extension Without Modification.
- **INV-A3:** LSP — Substitutability.
- **INV-A4:** ISP — No Fat Interfaces.
- **INV-A5:** DIP — Dependency Inversion.

### Interface (UI/UX)
- **INV-I1:** Prompt Always First.
- **INV-I2:** Three-Region Layout (Scenario → Reasoning → Reveal).
- **INV-I3:** Free Navigation.
- **INV-I4:** Code is Always Runnable.

---

## 5. Architecture Overview

```
┌────────────────────────────────────────────────────┐
│  UI Layer (React/Vite)                             │
│   LessonPlayer · CaseStudyCard · CodeEditor        │
│   ConceptGraph · MetaphorSelector · Leaderboard    │
└──────────────────┬─────────────────────────────────┘
                   │ DIP-style abstractions only
┌──────────────────▼─────────────────────────────────┐
│  Pedagogical Engine                                │
│   - CaseStudyOrchestrator (Barrows PBL)            │
│   - MetaphorProjector (decorates any lesson)       │
│   - SocraticDialogueManager                        │
└──────────────────┬─────────────────────────────────┘
                   │ depends on abstractions
┌──────────────────▼─────────────────────────────────┐
│  Domain                                            │
│   CaseStudy · ConceptNode · Construct · Learner    │
│   PiagetStage · Metaphor · LevelThreshold          │
└──────────────────┬─────────────────────────────────┘
                   │ adapters
┌──────────────────▼─────────────────────────────────┐
│  Adapters                                          │
│   PythonRunner (Pyodide)                           │
│   CaseStudyRepository (LLM-backed)                 │
│   ProgressStore                                    │
└────────────────────────────────────────────────────┘
```

**Pedagogical Engine Flow:**
1. [Bootstrap] pick case study from learner's reach + metaphor
2. [Scenario] render scenario (text + optional image)
3. [Prompt] ask "what would you do?"
4. [Student input] text + audio + auto-complete
5. [Socratic nudges if stuck]
6. [Submit] student signals readiness
7. [REVEAL gate] show construct + minimal syntax
8. [Try-it editor] student may code to verify
9. [Score] +N points (no ceiling)
10. [Rhizome nav] offer next paths

---

## 6. Design Patterns Applied

| Pattern | Where |
|---|---|
| **Factory Method** | `CaseStudyFactory` |
| **Builder** | `CaseStudyBuilder` (constructs via hook-words template) |
| **Composite** | `ConceptNode` & `ConceptGroup` — the rhizome |
| **Decorator** | `MetaphorProjector` wraps any lesson |
| **Observer** | `LearnerState` subject → Leaderboard, ProgressGraph |
| **Template Method** | Lesson skeleton: anchor → prompt → reveal → feedback |
| **Command** | `RunCodeCommand`, `RevealConstructCommand` |
| **Adapter** | Pyodide runner, LLM adapter, audio transcriber |

---

## 7. Content Schema

```yaml
id: cs_001
hook_words: [scores, average, group_of_five]
scenario: |
  Five friends showed their math scores: 78, 92, 65, 88, 71.
  They want to find the class average. What Python construct helps?
piaget_stage: concrete
topic_tags: [loops, accumulator_pattern, arithmetic]
construct_hint: list, for, sum, len
metaphor_agnostic: true
metaphor_projected:
  avengers: "Five Avengers pooled their Infinity Stone energies..."
  harry_potter: "Five house-point totals at the end of term..."
jonassen_type: structured
level: 1
```

---

## 8. Python Curriculum (Levels 1-5)

Levels exist for organization; no level has a max score. Mastery is a journey.

- **Level 1 — Beginner:** `print`, `input`, vars, types, if/else, loops, slicing, lists, dicts. (Threshold: 50)
- **Level 2 — Practitioner:** functions, modules, files, error handling. (Threshold: 150)
- **Level 3 — Intermediate:** OOP, comprehensions, generators. (Threshold: 350)
- **Level 4 — Advanced:** regex, datetime, threading, async, type hinting. (Threshold: 700)
- **Level 5 — Mastery:** testing, data (pandas), web (apis), firmware. (Uncapped)
