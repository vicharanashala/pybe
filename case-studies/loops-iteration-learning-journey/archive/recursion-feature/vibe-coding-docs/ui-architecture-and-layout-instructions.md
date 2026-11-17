# UI Architecture & Layout Instructions

## 1. Global Layout Rules
Create a persistent split-screen layout using Tailwind CSS. 
- **Left Section:** `w-[40vw] h-screen flex flex-col justify-center px-8`. Used for static/contextual content.
- **Right Section:** `w-[60vw] h-screen flex flex-col p-12 relative overflow-y-auto`. Used for interaction and navigation.
- **Constraints:** Do NOT hard-code content heights. Do NOT add navbars or sidebars. Use `h-screen` on the main wrapper and allow inner content to handle its own spacing.

---

## 2. App State Management
Use a simple `useState` setup in the main `App.jsx` to manage routing:
- `activeModule` (default: `null`): Tracks which module is open. If `null`, show the Landing Page.
- `currentBeat` (default: `1`): Tracks the current step inside a module.

---

## 3. Landing Page Component (`activeModule === null`)

**Left Section:**
- Render text: *"Understanding Recursion Through a Case Study"*
- Styling: `text-4xl font-bold italic text-center text-blue-400`. Must be perfectly centered vertically and horizontally.

**Right Section:**
- Render a vertical list of two modules.
- Center the list vertically within the 60vw section.
- Each row must contain the Module Title and a "Start" button.
- Clicking "Start" sets `activeModule` to that module's ID and sets `currentBeat` to `1`.

Conceptually:
┌──────────────────────┬──────────────────────────────────────────┐
│                      │                                          │
│                      │   Module 1: Case Study          [Start]  │
│   Understanding      │                                          │
│   Recursion Through  │   Module 2: Recursion           [Start]  │
│   a Case Study       │   Concepts                               │
│                      │                                          │
└──────────────────────┴──────────────────────────────────────────┘

---

## 4. Module View Component (`activeModule !== null`)

When a module is active, the screen is divided into discrete "Beats". Only render the content for the `currentBeat`.

**Left Section (40vw):**
- Dynamically render images, text, or headings based on the data for the `currentBeat`. No navigation controls go here.

**Right Section (60vw):**
Must contain exactly three vertical zones:

**Zone A: Top Header**
- A `flex justify-between items-center` container.
- **Left side:** A "Back to Modules" button. (Action: sets `activeModule` to `null`).
- **Right side:** A Beat Indicator (e.g., "Beat {currentBeat} of {totalBeats}"). Styling: `text-sm text-slate-400`.

**Zone B: Main Content (Flex-grow)**
- This is where the actual narrative, questions, and interactions for the `currentBeat` are rendered. 

**Zone C: Bottom Navigation**
- A `flex justify-between mt-auto pt-6 border-t border-slate-700` container.
- **Back Button:** Decrements `currentBeat`. Hidden or disabled if `currentBeat === 1`.
- **Next Button:** Increments `currentBeat`. Replaced by a "Finish Module" button on the final beat.
- **Finish Module Button:** Rendered only on the final beat, in place of Next. **Action:** sets `activeModule` to `null` AND resets `currentBeat` to `1` (so the module restarts from Beat 1 the next time it's opened, rather than resuming on its last beat). This returns the learner to the Landing Page.
