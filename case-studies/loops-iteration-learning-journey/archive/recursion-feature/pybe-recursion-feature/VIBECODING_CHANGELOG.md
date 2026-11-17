# Vibecoding Changelog: Iterative Development Timeline

This document tracks the iterative design decisions, state refactorings, and UX polish milestones achieved during the development of the **Interactive Recursion Learning Module**.

---

### 1. Interactive State Implementation
- **Initial State:** Custom domain markup (`<z-answer>`, `<z-options>`, `<z-explanation>`) rendered statically on page load without user interactivity.
- **Resolution:** Built dedicated stateful React sub-components (`ReflectionCard.jsx` and `McqCard.jsx`) using standard `useState` hooks to manage click handlers, option states, and reveal triggers.

---

### 2. Fixing Progression Gating (The Narrative Bug)
- **Initial State:** The Zone C **Next** button was locked by default on every beat change, trapping learners on purely narrative beats (e.g. Beats 1, 2, 3) where no interactive components existed.
- **Resolution:** Updated `ModuleView.jsx` to conditionally evaluate `requiresInteraction` by checking if the beat HTML contains `<z-answer>` or `<z-options>`. Narrative beats without interactive tags now initialize `isBeatUnlocked = true`, allowing learners to navigate forward freely.

---

### 3. MCQ State Refinement
- **Initial State:** Selecting an option left multiple wrong options highlighted simultaneously in red/green, and explanation text appeared immediately upon option selection.
- **Resolution:** Refactored `McqCard.jsx` to track a single `selectedIdx` state. Selecting a new option resets previous selection styles. Added a dedicated, optional `[Show Explanation]` button so learners can choose when to read the explanation.

---

### 4. Unblocking Learner Progression
- **Initial State:** The Zone C **Next** button remained locked until the learner clicked `[Show Explanation]`, forcing them to view explanation text before advancing.
- **Resolution:** Moved the `onProceed(true)` trigger to fire **immediately** upon selecting the correct MCQ answer (`<z-correct-answer>`) or clicking `[Reveal Answer]` on reflection cards. Viewing explanations is now completely optional and non-blocking.

---

### 5. Layout Centering for Intro & Outro Beats
- **Initial State:** Content on welcome and completion beats (Module 1 Beats 1 & 10, Module 2 Beats 1 & 12) rendered top-left aligned because markdown pseudo-styles (`style:"justify-content:center; align-item:center"`) were stripped during rendering.
- **Resolution:** Added flexbox layout centering (`flex flex-col items-center justify-center h-full text-center`) in `ModuleView.jsx` and `CustomTagRenderer.jsx` specifically for first (`currentBeat === 1`) and final (`currentBeat === totalBeats`) beats.

---

### 6. UX Copy & Header Polish
- **Initial State:** Zone C footer displayed a generic lock message (`"Complete the interaction to proceed"`), and the top header lacked active module context.
- **Resolution:** Updated lock badge copy to be context-aware (`"Attempt the question to proceed."` for MCQs vs `"Click on Reveal Answer to proceed."` for Reflections). Added an active module title indicator (`Module 1` / `Module 2`) to the Zone A header between the back button and beat counter.

---

### 7. Dynamic Image Handling & Hot-Swapping
- **Initial State:** Image references (`/assets/image-1.png`) rendered as static dashed placeholder boxes.
- **Resolution:** Refactored `PlaceholderImage.jsx` to attempt loading real images from `public/assets/`. If the image file exists, it renders cleanly; if missing or errored, it gracefully falls back to the styled placeholder box.
