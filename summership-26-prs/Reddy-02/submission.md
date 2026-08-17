# Summership 2026 — Final Project Submission

## Section A — Artefacts

### College / Institution

Vignan's LARA Institute of Technology & Science

### Team GitHub commits

https://github.com/saisrinivas77/pybe/commit/431e8c979d59c3be84dc560759d0405c43d8a514

### Branch Name / PR Link(s) representing my individual contribution

Branch:
`feature/real-life-online-payment`

Pull Request:
https://github.com/saisrinivas77/pybe/pull/new/feature/real-life-online-payment

---

## Section B — What You Built

### Describe the specific feature or sub-part you owned and built

I built "The Payment That Didn't Go Through", a scenario-driven learning module for PyBe. The scenario teaches Python Exception Handling (`try / except`) by presenting a real-world online food order payment failure (order total ₹420 vs available balance ₹300). Instead of introducing syntax first, learners encounter the problem, reason about how to handle unexpected failures without crashing, map their reasoning to `try / except`, inspect generated Python code, and interact with the AI mentor.

### Feature Request mapping

Maps to PyBe's core scenario architecture and educational roadmap for Explorer-level Python concept mapping and AI mentor feedback.

---

## Section C — Process & Iteration

### What did you change between your first attempt and your final submission, and why?

Initially, I considered hardcoding fallback responses for the payment scenario. However, inspecting PyBe's learning engine revealed a pattern-matching architecture in `learningEngine.js`. I refactored my approach to register new exception handling keyword patterns (`fail`, `except`, `error`, `try`, `balance`) and code generation rules, allowing the scenario to seamlessly leverage existing AI mentor pipelines.

### What's one piece of feedback that changed your approach?

The project guidelines emphasized working within existing architecture without adding parallel mentor engines. This feedback led me to reuse `learningEngine.js` patterns directly rather than creating standalone components.

---

## Section D — Reflection on the Phase 2 Experience

### Hardest technical or conceptual thing

The hardest part was ensuring the natural language reasoning mapper seamlessly connected user explanations about payment failures to `try / except` without distorting existing concept rules for loops or conditionals.

### What did you understand only after building it?

I realized scenario-driven learning relies heavily on structural abstraction mapping. Learners grasp Python constructs much faster when code execution directly reflects their intuitive reasoning about real-world failure handling.

### What would you do differently if restarting?

If restarting, I would build automated tests for the learning engine keyword matcher first to evaluate edge-case reasoning prompts before integrating seed data.

---

## Section E — Zooming Out

### How did Phase 1 coursework show up in Phase 2?

Phase 1 Python error handling and MERN stack API fundamentals directly enabled me to extend Express REST endpoints, seed JSON data structures, and handle JavaScript engine logic.

### One specific change to your future approach

I will prioritize deep codebase inspection and pattern reuse before writing code, ensuring new features align with established project architectures.

---

## Section F — Declaration

I confirm the repository/PR links above are my own work and accurately represent my individual contribution.
