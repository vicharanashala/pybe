# PyBe Version History & Changelog

All notable changes, engineering optimizations, and architectural refactorings for **PyBe (CKLIS Intelligence Engine)** are documented in this file.

---

## [v2.0.0] — 2026-08-10

### 🚀 Major Architectural Refactoring
* **Balanced 4-Pass CKLIS Orchestration**:
  - Replaced single-shot consolidated LLM requests with a modular 4-pass pipeline optimized for Groq rate limits.
  - **Pass 1**: Educational Foundation (*Misconceptions + Mental Model + Scenario Engines*).
  - **Pass 2**: Narrative Design (*Pattern Mapping + Episode Engines*).
  - **Pass 3**: Production Studio Deliverables (*Short Comic / Long Comic / Video / Storybook / Podcast*).
  - **Pass 4**: Quality Engine Audit (*Constitution & Learning Science evaluation*).

* **Multi-Provider LLM & Dynamic Multi-Key Cooldown Mechanism**:
  - Implemented multi-provider support across Groq (`llama-3.3-70b-versatile`), Gemini 2.0 Flash, MiniMax (`MiniMax-M3`), and Kimi (`moonshotai/kimi-k3-free`) with automatic provider failover in `llmClient.ts`.
  - Implemented dynamic multi-key usage mechanism with sliding window cooldowns and 2s–4s pacing delays between pipeline passes to prevent rate limit errors (`429 Too Many Requests`).

* **Canonical Story Grounding Engine**:
  - Added `KnowledgeLoader.getCanonicalStoryGrounding()` grounded in authentic story sources (*KidsGen Betal Pachisi Tales, Mughal Court of Akbar & Birbal, Panchatantra / Aesop's Fables*).
  - Eliminates LLM story hallucinations and preserves authentic character personalities and real plot structures.

* **Realistic Story-to-Code Mapping & Code-at-the-End Staging**:
  - Removed generic pseudocode placeholders (`perform_story_action()` & `item_count = 0`).
  - Implemented `generateRealTopicCodeSnippet(...)` mapping authentic physical variables (*e.g., `water_level = 0.2`, `pebbles_dropped += 1`, `betaal_captured = True`*).
  - Enforced strict code staging: panels 1 to N-1 focus 100% on pure story narrative, while the final panel (Panel N) displays the executable Python code implementation.

* **UI Crash Protection & React ErrorBoundary**:
  - Added a top-level `ErrorBoundary` in `App.tsx` to catch rendering exceptions gracefully.
  - Wrapped all dynamic fields (`misconceptions`, `mentalModel`, `scenarios`, `patterns`, `episodes`, `characterEmotion`, `narrationBox`, `speechBubble`, `codeSnippet`) in `renderSafeText(...)` across `DeliverableViewer.tsx` and `InternalReasoningDrawer.tsx`.

---

## [v1.5.0] — 2026-08-05

### 💡 Core Enhancements
* **Dual Intake Pipeline Mode**:
  - Added Mode 1 (*Topic-First Intake*) and Mode 2 (*Experience-First Story Anchor Lock Intake*) in `LesForm.tsx`.
* **Full 131k Spec Extraction**:
  - Implemented `extractSection()` in `knowledgeLoader.ts` to extract rules, taxonomies, and principles from real specification markdown files (`01_Constitution.md`, `03`, `04`, `05`, `06`, `07`).
* **Interactive Panel Carousel**:
  - Added scene-by-scene panel carousel navigation in `DeliverableViewer.tsx` with dots stepper and copy buttons for full AI prompt packages.

---

## [v1.0.0] — 2026-07-28

### 🎉 Initial Release
* First working prototype of CKLIS runtime engine with Express backend and React frontend.
* Basic intake form and markdown deliverable viewer.
