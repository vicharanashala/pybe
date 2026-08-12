# Change Log: The Royal Scribe's Secret

## Files added

All files are new; nothing in the existing PyBe application (client, server, or other `summership-26-prs/` contributions) was modified.

```
summership-26-prs/Shiv/Royal-Scribes-Secret/
├── index.html
├── css/base.css
├── css/inscription.css
├── css/components.css
├── js/lessonData.js
├── js/lessonEngine.js
├── js/renderer.js
├── js/interactions.js
├── js/navigation.js
├── README.md
├── product.md
├── context.md
└── change.md
```

## Files changed

None outside this folder.

## Design decisions

- **Vanilla HTML/CSS/JS, no build step.** Matches the simplest already-accepted pattern in `summership-26-prs/` (e.g. the Akbar & Birbal dictionary module, the Rajgad Fort module) and keeps the module trivially runnable by any reviewer.
- **Data/engine/renderer/interactions/navigation split.** `lessonData.js` holds all story text and correct answers with zero DOM logic; `lessonEngine.js` is a pure state machine (current step, completion, saved responses); `renderer.js` turns the current step into HTML; `interactions.js` wires up click/submit handlers and validates answers; `navigation.js` owns the progress bar and Back/Next buttons and boots the app. This mirrors the architecture of the existing dictionary learning module in this repo, adapted for a smaller, self-contained scope.
- **8 macro stages, not more.** Some stages (4, 7) contain more than one sub-task, but they are presented within a single stage/progress-bar segment to avoid inflating the journey past the ~7–8 stages requested.
- **One shared tablet for multi-part stages.** Stage 4 (last character, then last word) reuses a single rendered tablet across both sub-tasks via a phase-aware click handler, instead of rendering a duplicate tablet — simpler DOM, and it reinforces that both sub-tasks concern the same underlying string.
- **Concept revealed only after the challenge is solved.** Every stage's Python code panel starts hidden (`class="hidden"` on `#reveal-panel`) and is only unhidden once `interactions.js` confirms a correct answer.
- **Distinct visual theme.** A separate CSS palette (sandstone/terracotta/gold "Suryagarh" theme) was used instead of reusing the existing Mughal-parchment palette from the dictionary module, so the two modules remain visually distinguishable inside the same platform. All visuals are CSS gradients/borders and inline SVG-free HTML shapes — no external images, no image-generation APIs.
- **No backend, no storage.** All state lives in memory for the duration of the page load, consistent with the "no database, no auth, no external APIs" constraint.

## Testing performed

Because this is a standalone static module with no existing test runner in its own folder, and the project constraints asked not to introduce a new testing framework unless necessary, testing was performed as follows:

1. **Syntax check** — `node --check` on every `.js` file.
2. **Automated headless walkthrough (jsdom)** — a temporary, local-only Node script loaded `index.html` in `jsdom` with scripts enabled and simulated a full click-through of all 8 stages, including:
   - The correct-answer path for every stage (character inspection, index click, range selection, negative-index sub-tasks, reverse-decode choice, string-repair method choices, all 6 practice rounds, and all 5 final-cipher tasks including the free-text "reversed ID" answer).
   - The incorrect-answer path for stages 3–8 (wrong slice range, wrong last-character guess, wrong reversed-inscription choice, wrong repair method, wrong practice-round answer, wrong final-cipher choice, and a wrong free-text answer), confirming that: the Next button stays disabled, an `.is-error` feedback panel appears with an explanatory message (not just "wrong"), and the learner can retry.
   - Back-navigation, confirming a completed step can be revisited without losing progress.
   - No uncaught JavaScript errors during the entire run.
   This script is not part of the module itself and was not committed; it lived outside the repository, under a scratch directory, purely to validate behavior before hand-off.
3. **Manual review of generated markup** for every step type to confirm indices/slices used in the content (e.g. `message[9:15]` for `"GOLDEN"`, `message[-6:]` for `"SUNSET"`, `message[::-1]`, and the `SURYA-1842-AR27` cipher breakdown) are all internally consistent and correct.
4. **Responsive check** — `components.css` includes a `max-width: 640px` breakpoint reducing padding and tile size; the layout uses flex-wrap throughout so it does not require JavaScript to reflow.
5. **No external dependency check** — `index.html` only references local `css/` and `js/` files; no CDN links, fonts, or APIs are required to run the module.

## Limitations

- The module tracks progress only in memory; refreshing the page restarts the journey from Stage 1. Persisting progress (e.g. via `localStorage`) was intentionally left out, in keeping with the "keep it simple, standalone" constraint.
- The Stage 8 "reversed ID" task is validated with a simple case-insensitive string comparison, so it will not recognize an answer that is correct but formatted unusually (e.g. with stray whitespace beyond a single trim).
- Automated testing was done via `jsdom`, not a real browser; a final manual open in an actual browser is recommended before merging, particularly to confirm animations/transitions feel right and that touch interactions behave as expected on a phone-sized viewport.

## Future improvements

- Optional persistence of progress across page reloads.
- A short "concept map" screen at the very end summarizing all six syntax forms covered, for quick reference.
- Additional optional rounds in Stage 7 for learners who want more practice before the final assessment.
