# change.md — Computational Thinking Log

## Author: Pritam Patra
## Feature: Inheritance Discovery Engine

---

## Design Decision 1: Observation before Definition

**Problem:** Most apps teach the concept name first, then test if you remember it.

**Thinking:** If a learner can already describe "some things are shared by all animals, while some things are unique to one animal" — they have grasped inheritance without knowing the word. Our job is to surface that observation, not introduce the label.

**Decision:** Phase 1 and Phase 2 contain zero programming vocabulary. The word "Inheritance" does not appear until the learner has already described it in their own words.

---

## Design Decision 2: Adaptive Correction over Binary Pass/Fail

**Problem:** MCQs and right/wrong feedback shut down thinking. The learner guesses until correct.

**Thinking:** A wrong answer reveals something valuable — it shows specifically where the mental model is incomplete. The correct response is not "No, try again" but "Here is what you may have missed — now think about this specific aspect."

**Decision:** When the LLM determines understanding is incomplete, it returns a `followUpQuestion` grounded in the story. The learner is never told their answer is "wrong". They are asked a smarter question.

---

## Design Decision 3: LLM for Evaluation, Not Content Generation

**Problem:** Using an LLM to generate scenarios (like Khushi's generator) is powerful but makes the learning experience non-deterministic — the quality and pedagogical soundness of the content varies.

**Thinking:** The story and phases should be carefully hand-crafted for pedagogical depth. The LLM's strength is understanding natural language — which is exactly what's needed to evaluate free-text observations.

**Decision:** The LLM is used only for evaluation (`POST /api/journey/evaluate`). The scenario content is fixed in `db.json` and authored deliberately.

---

## Design Decision 4: Local Fallback for Zero External Dependencies

**Problem:** Requiring an API key creates a hard dependency that prevents the app from working at all if the key is missing.

**Thinking:** The rule-based fallback is less intelligent but sufficient for basic evaluation. It is better to have a working app with slightly less nuanced feedback than a broken app with perfect feedback.

**Decision:** `llmService.js` detects if `GEMINI_API_KEY` is unset and silently falls back to keyword-based local evaluation. The app functions fully either way.

---

## Design Decision 5: Phase 4 Uses Exact Match, Not LLM

**Problem:** For code evaluation, natural language flexibility is a weakness. `Eagle(Animal)` is either correct or it is not.

**Thinking:** The LLM is excellent at evaluating reasoning in natural language but is not needed for exact string matching. Using the LLM for the final code blank would add latency and potential error for a task a simple comparison handles perfectly.

**Decision:** Phase 4 uses `blankValue.trim() === correctAnswer` — a direct string comparison. The LLM is not called for this phase.

---

## Design Decision 6: Port 5001/5174 to Avoid Clash

**Problem:** The base PyBe app runs on port 5000/5173. Running both simultaneously would cause a port conflict.

**Decision:** This app runs the server on port 5001 and the Vite dev server on port 5174 so both applications can run simultaneously during development and demonstration.
