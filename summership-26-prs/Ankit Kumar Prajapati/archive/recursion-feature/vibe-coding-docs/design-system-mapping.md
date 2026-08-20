# Design System & Tag Mapping Specification

## 1. Global Theming Rules
- **Theme:** Dark Mode ("Dark Theater" aesthetic).
- **Backgrounds:** `bg-slate-900` for the main app, `bg-slate-950` for the Left Section, `bg-slate-800` for cards/panels.
- **Text Colors:** `text-slate-200` for standard body text, `text-slate-400` for muted/secondary text.
- **Fonts:** Standard sans-serif for UI, monospaced for code.
- **Invalid Inline Styles:** If you encounter `style:"..."` in the content, DO NOT render it as inline CSS. Translate it into the equivalent Tailwind utility classes.
- **Standard HTML Tags:** 
  - `<h3>`: Render as `text-2xl font-bold text-blue-400 mb-4`.
  - `<h4>`: Render as `text-xl font-semibold text-slate-100 mb-3`.
  - `<ul>` & `<li>`: Render as `list-disc pl-6 space-y-2 text-slate-300`.
  - `<code>` / `<pre>`: Render as `bg-[#1e1e1e] text-slate-300 p-4 rounded-md font-mono text-sm overflow-x-auto border border-slate-700`.

---

## 2. Custom `<z-...>` Tag Mapping

Whenever you encounter the following pseudo-tags in the content, replace them with React functional components or HTML elements styled with these exact Tailwind classes and interactive behaviors.

### Narratives & Callouts

**`<z-announcement>`**
*   **Purpose:** A loud, public broadcast.
*   **Tailwind Classes:** `bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-md text-yellow-200 italic shadow-md my-4`
*   **Behavior:** Static render.

**`<z-thinking>`**
*   **Purpose:** A character's internal monologue.
*   **Tailwind Classes:** `text-slate-400 italic border-l-2 border-slate-600 pl-4 my-2`
*   **Behavior:** Static render.

**`<z-question>`**
*   **Purpose:** A direct question to the user or a core challenge in the story.
*   **Tailwind Classes:** `text-xl font-semibold text-blue-400 my-2`
*   **Behavior:** Static render.

**`<z-constraint>`**
*   **Purpose:** Explaining rules or physical limitations.
*   **Tailwind Classes:** `bg-red-900/20 border border-red-800 text-red-300 p-4 rounded-md my-4`
*   **Behavior:** Static render.

**`<z-reply>`**
*   **Purpose:** Direct spoken dialogue from a character.
*   **Tailwind Classes:** `bg-slate-800 text-slate-100 p-3 rounded-lg inline-block shadow-md border border-slate-700 my-2`
*   **Behavior:** Static render.

**`<z-click>`**
*   **Purpose:** An "Aha!" realization moment.
*   **Tailwind Classes:** `text-emerald-400 font-bold text-xl animate-pulse my-2`
*   **Behavior:** Static render.

---

### Interactive Elements

**`<z-ponder>`**
*   **Purpose:** A pause that requires the user to stop and think.
*   **Tailwind Classes:** `bg-indigo-900/30 border-l-4 border-indigo-500 text-indigo-200 p-4 rounded-md my-4 font-medium`
*   **Behavior:** Static render, but usually precedes an Answer that requires interaction.

**`<z-answer>`**
*   **Purpose:** The revealed answer to a Ponder or Question.
*   **Tailwind Classes:** `text-green-400 font-medium text-lg mt-4 animate-fade-in`
*   **Behavior (CRITICAL):** If `<z-answer>` is present in a Beat, wrap it in React state logic. Render a button that says `[Reveal Answer]` using classes `bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded`. Only show the actual `<z-answer>` content AFTER the user clicks this button. Disable the overall module "Next" button until this is clicked.

**`<z-explanation>`**
*   **Purpose:** Deep dive context shown after an answer.
*   **Tailwind Classes:** `text-slate-300 mt-4 p-4 bg-slate-800/50 rounded-md border border-slate-700 animate-fade-in`
*   **Behavior (CRITICAL — reveal trigger depends on context):**
    *   **Case A — inside a `z-question-card` that contains `z-options`** (i.e. an MCQ, as in Module 2): follow the MCQ reveal rule below. `z-explanation` is revealed only after the user clicks the `z-correct-answer` option — not before, and not on a wrong-option click.
    *   **Case B — anywhere else** (i.e. paired with a standalone `z-answer`, as in Module 1): follow the `z-answer` reveal rule above. `z-explanation` is revealed simultaneously with `z-answer`, on the same `[Reveal Answer]` button click.
    *   Never wire `z-explanation` to both triggers at once, and never render it on page load in either case.

---

### Multiple Choice Questions (Module 2)

**`<z-question-card>`**
*   **Purpose:** The wrapper for an MCQ or reflection block.
*   **Tailwind Classes:** `bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 w-full my-4`
*   **Behavior:** Static wrapper.

**`<z-options>`**
*   **Purpose:** Wrapper for multiple choice buttons. Contains standard `<li>` elements and `<z-correct-answer>` elements.
*   **Tailwind Classes:** `flex flex-col gap-3 mt-4`
*   **Behavior:** Convert every list item inside this tag into a clickable `<button>`.

**`<z-correct-answer>` (and standard wrong options)**
*   **Purpose:** MCQ interactive buttons.
*   **Behavior (CRITICAL):** 
    *   Default state for all options: `w-full text-left p-4 bg-slate-700 hover:bg-slate-600 rounded-md border border-slate-600 transition-colors`.
    *   When the user clicks a wrong option: Change that button's classes to `bg-red-900/50 border-red-500 text-red-200`.
    *   When the user clicks the `<z-correct-answer>`: Change that button's classes to `bg-green-900/50 border-green-500 text-green-200`.
    *   Only reveal the `<z-explanation>` block (see Case A above) and enable the module "Next" button AFTER the correct answer is clicked.
