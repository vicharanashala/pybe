# PyBe: The  Learning Discovery Environment

PyBe is a scenario-driven Python learning prototype designed to revolutionize programming education through the **"Intuitive Way" Philosophy**. By stripping away syntax friction and emphasizing narrative-driven cause-and-effect relationships, PyBe creates an "antigravity" experience where learners discover programming paradigms naturally.

## 🌟 The "Intuitive Way" Philosophy

- **The 95/5 Rule**: Keep typing friction minimal. 95% of the syntax is provided to the learner; they only type the 5% that proves conceptual realization and mastery.
- **Narrative over Syntax**: Machine-level syntax is secondary. We teach core programming concepts through engaging 1–2 paragraph stories (max 100 words).
- **Rhizomatic Learning**: Learners choose their own thematic trajectory based on their personal passions (e.g., Harry Potter's Wizarding Hat, Avengers' Infinity Stones, Panchatantra tales, or the Gig Economy).
- **Contradiction Catching & Productive Struggle**: The system actively tracks learner beliefs (e.g., holding contradictory notions like "variables hold one value" vs. "lists hold many") and dynamically builds scenarios forcing them to resolve contradictions via productive struggle.
- **Deterministic Rule-Based Engine**: All personalization, story interpolation, and syntax adaptation operate 100% locally and deterministically without relying on external LLMs or AI API keys.
- **Ultra-Lightweight Storage Efficiency**: 5 topics -> 5 templates of stories × 50 categories of 50 subcategories -> 250 stories with under 100 KB of storage!

---

## 📚 Documentation Suite Index

The entire architecture, engineering plan, and technical specifications for the Antigravity module are documented in our unified living documentation suite:

1. [Master Context Ledger (context.md)](./docs/context.md) – Complete project context, chronological development logs, and resolved issues.
2. [Workflow & User Journey Chart (workflow_chart.md)](./docs/workflow_chart.md) – End-to-end user journey and system workflow represented as Mermaid.js flowcharts.
3. [Feature Breakdown (FEATURES.md)](./docs/FEATURES.md) – Detailed specifications of flagship features (Rhizomatic pathways, 95/5 rule, contradiction tracking).
4. [Setup Guide (setup_guide.md)](./docs/setup_guide.md) – Step-by-step installation, configuration, and startup instructions for local development.
5. [System Architecture (architecture.md)](./docs/architecture.md) – Technical architecture, clean domain-driven design, Repository/Service layers, and Open/Closed Principle adherence.
6. [System Representations & State Machines (representation.md)](./docs/representation.md) – Visual flowcharts and state machines for the Lazy/Motivated scale and contradiction engine.
7. [API Reference (api_docs.md)](./docs/api_docs.md) – REST API endpoints with exact JSON request/response payload schemas.
8. [Database & Storage Schema (database_schema.md)](./docs/database_schema.md) – Schema definitions for local JSON storage and future Mongoose/NoSQL migrations.
9. [App MVP Specifications (App_MVP_Spec.md)](./docs/App_MVP_Spec.md) – Minimum Viable Product requirements and philosophy breakdown.
10. [Complete Compiled Product File (COMPLETE_PRODUCT_FILE.md)](./docs/COMPLETE_PRODUCT_FILE.md) – A single concatenated document containing the entire documentation suite for easy reading and sharing.

---

## 🚀 Quickstart

1. **Install Dependencies**:
   ```bash
   npm run installAll
   ```
2. **Configure Environment**:
   ```bash
   cp server/.env.example server/.env
   ```
3. **Seed Sample Data**:
   ```bash
   npm run seed
   ```
4. **Start Development Servers**:
   ```bash
   npm run dev
   ```
   - **Frontend**: http://localhost:5173
   - **API Server**: http://localhost:5000/api

---

## 🛠️ Engineering Status & Fork Info

- **Upstream Repository**: `vicharanashala/pybe`
- **Current Fork**: `saksham1928/pybe` (working on feature branch `feature/personalized`)
- **Current Phase**: Documentation & Architectural Initialization (Pre-Phase 2)

**Contributed by Harsh Joshi**
