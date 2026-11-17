# Design System & Tag Mapping Specification

## 1. Global Theming Rules
- **Theme:** Dark Mode ("Dark Theater" aesthetic).
- **Backgrounds:** `bg-slate-900` for the main app, `bg-slate-950` for the Left Section, `bg-slate-800` for cards/panels.
- **Text Colors:** `text-slate-200` for standard body text, `text-slate-400` for muted/secondary text.
- **Fonts:** Standard sans-serif for UI, monospaced for code.
- **Invalid Inline Styles:** If you encounter `style:"..."` or `style="..."` in the content, DO NOT render it as inline CSS. Translate it into the equivalent Tailwind utility classes.
- **Standard HTML Tags:** 
  - `<h3>`: Render as `text-2xl font-bold text-blue-400 mb-4`.
  - `<h4>`: Render as `text-xl font-semibold text-slate-100 mb-3`.
  - `<ul>` & `<ol>`: Render as `list-decimal pl-6 space-y-2 text-slate-300` (for ordered) and `list-disc` (for unordered).
  - `<code>` / `<pre>`: Render as `bg-[#1e1e1e] text-slate-300 p-4 rounded-md font-mono text-sm overflow-x-auto border border-slate-700`.

---

## 2. Custom `<z-...>` Tag Mapping

Whenever you encounter the following pseudo-tags in the content, replace them with React functional components or HTML elements styled with these exact Tailwind classes and interactive behaviors.

### Narratives & Callouts

**`<z-announcement>`**
*   **Purpose:** A loud, public broadcast.
*   **Tailwind Classes:** `bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-md text-yellow-200 italic shadow-md my-4 block`
*   **Behavior:** Static render.

**`<z-question>` (Outside of MCQ)**
*   **Purpose:** A character's question or dialogue.
*   **Tailwind Classes:** `text-xl font-semibold text-blue-400 my-2 block`
*   **Behavior:** Static render.

**`<z-reply>`**
*   **Purpose:** Direct spoken dialogue from a character.
*   **Tailwind Classes:** `bg-slate-800 text-slate-100 p-3 rounded-lg inline-block shadow-md border border-slate-700 my-2 block`
*   **Behavior:** Static render.

---

### Multiple Choice Questions (MCQ)

**`<z-mcq>`**
*   **Purpose:** The wrapper for an MCQ block.
*   **Tailwind Classes:** `bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 w-full my-4 block`
*   **Behavior:** Must wrap state logic for handling option selection and revealing the explanation.

**`<z-question>` (Inside MCQ)**
*   **Purpose:** The text of the question.
*   **Tailwind Classes:** `text-lg font-medium text-slate-100 mb-4 block`
*   **Behavior:** Static render.

**`<z-options>`**
*   **Purpose:** Wrapper for multiple choice buttons. 
*   **Tailwind Classes:** `flex flex-col gap-3 mt-4`

**`<z-option>`**
*   **Purpose:** Interactive buttons. Will have an attribute `correct="true"` or `correct="false"`.
*   **Behavior (CRITICAL):** 
    *   **Default state:** `w-full text-left p-4 bg-slate-700 hover:bg-slate-600 rounded-md border border-slate-600 transition-colors`.
    *   **On Click (If `correct="false"`):** Change classes to `bg-red-900/50 border-red-500 text-red-200`.
    *   **On Click (If `correct="true"`):** Change classes to `bg-green-900/50 border-green-500 text-green-200`. 
    *   Only reveal the `<z-explanation>` block and enable the module's "Next" button AFTER the correct option is clicked.

**`<z-explanation>`**
*   **Purpose:** Deep dive context shown after an answer.
*   **Tailwind Classes:** `text-slate-300 mt-4 p-4 bg-slate-800/50 rounded-md border border-slate-700 animate-fade-in block`
*   **Behavior (CRITICAL):** Hidden by default. Revealed ONLY when the user successfully clicks the `<z-option correct="true">` inside the same `<z-mcq>`.
