# Pybe — Future Scope & Improvements

> This document tracks the stretch goals and future expansions for Pybe, building on top of the v1.0 release.

---

## 1. Advanced Gamification (The Harry Potter / Avengers Meta)

While the base pedagogical engine uses metaphors for case studies, the platform is designed to support deep, structural gamification anchored in popular lore.

### Horcruxes (Hidden Mastery Challenges)
- **Concept:** 7 hidden, long-form challenges spread across the rhizome graph.
- **Mechanic:** These do not appear in the normal curriculum order. They are discovered only when a user explores specific combinations of topics or solves problems in unconventional ways.
- **Goal:** To encourage deep, unbounded exploration rather than just chasing the next level threshold.

### The Sorting Hat (Classifier)
- **Concept:** An end-of-stage-1 classifier UI.
- **Mechanic:** Once a learner passes the foundational threshold (Level 1), the system asks a series of algorithmic dilemma questions (e.g., "Do you optimize for memory, or speed?"). It then "sorts" them into a learning house that slightly weights their future case study generation towards specific problem taxonomies (e.g., design vs. unstructured).

### Time Stones (Time-Complexity Visualizations)
- **Concept:** Advanced visualization for Level 4+ learners.
- **Mechanic:** When a user learns loops, recursion, or advanced data structures, they earn the "Time Stone" view, allowing them to step through the execution of their code and see a real-time `O(n)` graph mapping of their algorithm's performance.

---

## 2. Curriculum Expansion

### Firmware-Level Python Lessons
- **Concept:** Expanding beyond web and data into hardware/firmware using MicroPython.
- **Audience:** Level 5 (Mastery) learners.
- **Goal:** Sir's ultimate goal for Pybe is to have it used for firmware optimizations in university settings. This involves adding modules for hardware-software bridging, I/O pin management, and memory-constrained environments.

---

## 3. Platform & Accessibility Features

### Embed Mode for University LMS
- **Concept:** Allow Pybe's case-study player to be embedded directly into Canvas, Moodle, or Blackboard.
- **Mechanic:** LTI integration and iframe support so university professors can assign a "rhizomatic path" instead of a static quiz.

### Bilingual / Regional Language Support
- **Concept:** Generating case studies and hints in regional languages (e.g., Hindi, Marathi) alongside English syntax.
- **Mechanic:** Using the LLM backend to translate the `scenario` and `hints` while keeping the `starter_code` in valid Python.

### Server-Side Audio & Advanced Persistence
- **Current State:** V1 uses the browser's Web Speech API and local storage (with basic server mock).
- **Future State:** 
  - Real server-side transcription for privacy and better accuracy in noisy environments.
  - Robust user profiles allowing learners to switch devices without losing their rhizome traversal history.

---

## 4. AI & Content Generation Enhancements

- **Full RAG over the Textbook Corpus:** Expanding the LLM generator from simple keyword mapping to a full Retrieval-Augmented Generation pipeline over 10 open-source Python textbooks.
- **Dynamic Threat/Gaming Detection:** Implementing LLM guardrails to prevent users from "gaming" the reflection box with AI-generated answers, ensuring honest pedagogical engagement.
