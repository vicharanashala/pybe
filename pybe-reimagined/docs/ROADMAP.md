# Roadmap

> Public list of where Pybe is going. **Anyone can edit this file** — the goal is to make priorities legible.

---

## v1 (shipped) — _Iterate live_

| Area | Status |
|---|---|
| Foundation (Phase 0) | ✅ shipped |
| Case Study Player (Phase 1) | ✅ shipped |
| Scoring & Levels (Phase 2) | ✅ shipped |
| Metaphor Engine (Phase 3) | ✅ shipped |
| Code Editor / Pyodide (Phase 4) | ✅ shipped |
| Audio + Auto-Complete (Phase 5) | ✅ shipped |
| Rhizome Concept Graph (Phase 6) | ✅ shipped |
| LLM-Backed Content (Phase 7) | ✅ shipped |
| Invariant Validation (Phase 8) | ✅ shipped |
| Pilot & Launch (Phase 9) | ✅ shipped |
| Iterate / v1.0 release (Phase 10) | ✅ shipped |

---

## v2 (planned, NOT shipped) — _4 weeks of pilot data required first_

Per Sir's mandate: **stretch features are deferred until we have at least 4 weeks of pilot data.** These are documented here for transparency, NOT commitment.

| Feature | Phase | Description | Trigger to start |
|---|---|---|---|
| **Horcruxes** (F-FUT-2) | v2.1 | Seven hidden mastery challenges scattered across the concept graph. Complete one to "save your soul". | After 4 weeks of pilot data |
| **Time Stone** (F-FUT-1) | v2.2 | Time-complexity visualization on each algorithm-shaped case study. Big-O inspector. | When ≥ 3 case studies involve loops/recursion |
| **Sorting Hat** (F-FUT-3) | v2.3 | End-of-Level-1 classifier — assigns a metaphor "house" based on the learner's first 5 cases. | After Level-1 completion hits 60% |
| **Firmware lessons** (F-FUT-4) | v2.4 | MicroPython / embedded Python — Sir's stated stretch goal. | Demand-driven |
| **Embed mode** (F-FUT-5) | v2.5 | Drop Pybe into a university LMS via iframe + LTI 1.3. | After pilot expansion |
| **Bilingual hints** (F-FUT-6) | v2.6 | Hindi + English parallel text in scenarios. | After a pilot signal |

---

## Backlog (lower priority)

- Audio privacy settings toggle (currently tooltip-only).
- Cross-device sync (server-side persistence).
- Accessibility audit — keyboard navigation, screen-reader, color-contrast.
- Leaderboard server-side (replace localStorage).
- More metaphor worlds: Lord of the Rings, music, biology.
- Editable case-study authoring UI (currently JSON-only).
- Real embeddings for the textbook retriever (Phase 7 currently ships a mock corpus).
- Stretch-feature scoring — when do Horcruxes / Time Stone unlock?

---

## How to read this file

| Term | Meaning |
|---|---|
| ✅ shipped | Live in production. Test coverage exists. |
| 📋 planned | In a future version. NOT commitment. |
| 🚫 blocked | Cannot start until X happens. |
| 💡 idea | Not yet triaged. |

## How to propose a change

1. Open an issue or a PR with a one-paragraph description.
2. Reference any invariant from `docs/InvariantTests.md` that the change would affect.
3. Sir triages on the next Friday review.

---

_Last updated: Phase 10 (Iterate) — v1.0 release cycle._