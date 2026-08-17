# Summership 2026 — Final Project Submission

Individual submission — Team members: kukkala.Tejupriya, Chinthakindi Ashritha, THATICHERLA HIRANMAYI, Sai Srinivas Reddy Dodda, Swastika Mitra.

---

## Section A — Artefacts

### College / Institution

Vignan's LARA Institute of Technology & Science

### Team GitHub commits

https://github.com/saisrinivas77/pybe/commit/431e8c979d59c3be84dc560759d0405c43d8a514

### Branch Name / PR Link(s) representing your individual contribution

Branch:
`feature/real-life-online-payment`

Pull Request:
https://github.com/saisrinivas77/pybe/pull/new/feature/real-life-online-payment

---

## Section B — What You Built

### Describe the specific feature or sub-part you owned and built

I owned and built "The Payment That Didn't Go Through", a scenario-driven learning module teaching Python Exception Handling (`try / except`). The feature introduces a real-world payment failure where an order of ₹420 fails due to an available balance of ₹300. Instead of starting with syntax definitions, learners encounter the problem, reason about how to handle unexpected failures without crashing, map their natural reasoning to `try / except`, and observe generated Python code. Specifically, I extended the seed dataset, updated `learningEngine.js` with pattern-matching rules for exception handling (`fail`, `except`, `error`, `try`, `balance`), and configured code generation logic to return a deterministic `try / except` block with user feedback.

### Feature Request mapping — which problem statement or Feature Request Document does this map to?

Maps to PyBe's scenario architecture for Explorer-level concept mapping, adding runtime error handling to the team's Python concept catalog alongside loops and conditionals.

---

## Section C — Process & Iteration

### What did you change between your first attempt and your final submission, and why?

In my first attempt, I considered hardcoding standalone fallback responses for the payment scenario. After inspecting PyBe's backend, I realized this would break architectural consistency. In my final submission, I integrated directly into `learningEngine.js` by adding concept rules for exception keywords and extending `generateCode()` to evaluate scenario concepts. This change ensured the new scenario seamlessly leverages existing AI mentor pipelines, abstraction mapping, and feedback evaluation without introducing duplicate logic.

### What's one piece of feedback (from CliqueMe, mentor, or peer) that changed your approach?

Peer feedback highlighted that learners often confuse `if/else` checks with true runtime exception handling. This led me to refine the scenario context to explicitly raise a `ValueError` during payment processing, showing how `try / except` catches unexpected runtime errors rather than just checking balance conditions.

---

## Section D — Reflection on the Phase 2 Experience

### What was the hardest technical or conceptual thing you had to work through, and how did you resolve it?

The hardest technical challenge was extending the natural language reasoning mapper in `learningEngine.js` without creating false positives for existing scenarios. Since reasoning about payments includes conditions like "if balance is low", the engine initially classified responses solely as `if / else`. I resolved this by adding targeted keyword patterns (`crash`, `fail`, `except`, `unexpected`, `handle`) and prioritizing exception handling when scenario metadata specifies error handling, ensuring accurate abstraction mapping for the AI mentor output.

### What's something you understood only after building it, that you couldn't have understood from instructions alone?

I understood that scenario-driven learning depends on tight coupling between learner intuition and structural abstraction. Before building, I viewed error handling as pure syntax (`try / except`). After implementing the learning engine pipeline, I saw how mapping natural problem-solving reasoning to code constructs transforms abstract error handling into an intuitive programming concept.

### What would you do differently if you restarted this project today?

If restarting today, I would create an automated unit test suite for `learningEngine.js` before adding seed data. Writing test cases for keyword extraction and code generation upfront would have sped up debugging edge-case reasoning inputs and ensured new concept rules never regressions on existing scenarios.

---

## Section E — Zooming Out (Full Internship)

### How did what you learned in Phase 1 (coursework) actually show up — or fail to show up — when you got to building in Phase 2?

Phase 1 coursework on Python data structures, error handling, and Express REST APIs showed up directly when implementing backend routing, seeding JSON data, and building evaluation rules. However, textbook Phase 1 examples showed error handling in isolation, whereas Phase 2 required integrating exception concepts into an interactive, full-stack MERN learning application.

### What's one specific way this changes how you'll approach coding, learning, or collaboration going forward?

Going forward, I will always perform deep codebase inspection before writing code. Rather than building isolated components, I will analyze existing design patterns, state flow, and backend engine hooks to ensure every new feature fits seamlessly into the project's established architecture.

---

## Section F — Declaration

I confirm the repository/PR links above are my own work and accurately represent my individual contribution.
