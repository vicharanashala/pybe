# PyBe — Ankita Agrahari PR Submission

Features Added
1. Choice Launcher Gate
After the AI mentor returns abstraction mapping results, users now see a gate card:

"✍️ Try Solving It Myself" → enters the timed sandbox practice flow
"👁️ Display Solution Immediately" → reveals the AI mentor solution immediately (original behavior)
This preserves full backward compatibility while adding an entirely new active-learning path.

2. Configurable Practice Timer
When users choose to practice, they are presented with a timer configuration step before the sandbox opens:

Custom duration input (1–60 minutes)
Zen Mode toggle — disables the countdown entirely for pressure-free practice
Timer counts down live in the editor header with a critical pulse animation when < 60 seconds remain
When the countdown hits zero, the solution is automatically revealed with a "Challenge Ended" status banner
A "Give Up & Reveal" escape hatch is always available
3. Interactive Python IDE Sandbox
A full-featured code editor powered by Pyodide (v0.26.2) — running Python entirely in the browser:

Syntax-aware line-numbered gutter with dynamic row count
Run Code button executes user Python instantly in-browser via WebAssembly
Verify button runs scenario-specific assertions to check correctness
Live console output panel captures stdout and stderr
Progressive hint system — click "Need a Hint" to reveal contextual clues one at a time
Globals sandbox reset between runs to prevent state bleed
4. Live Branching Control Flow Visualizer
As the user types code in the sandbox editor, a live flowchart panel renders their logic structure
in real-time using a purpose-built parser:

Start / End terminal nodes bookend the diagram
Diamond decision nodes (❓ Is weight > 5?) for if/elif/else branches
Side-by-side YES / NO columns — traditional branching flowchart layout with labeled branch lanes
Loop nodes (🔁 For each:, 🔁 While:) for iteration blocks
Process nodes (📝 weight = 10) for assignments and function declarations
Output nodes (🖨️ Print: Heavy) for print statements
End node correctly exits all nested branch scopes and aligns centered at the bottom
5. Double-Hover Code–Flowchart Linking
A novel UX interaction that creates a bidirectional visual link between the code editor and
the live flowchart:

Each parsed node stores its lineNo — the source line index from the user's code
Hovering over any flowchart node card triggers onHoverLine(lineNo) which propagates up to
the workspace state
The matching line number in the editor's gutter turns highlighted (yellow-green accent,
bold weight, subtle glow)
The hovered flowchart card lifts and scales (transform: scale(1.03)) with a border
highlight animation
This creates a seamless cognitive link between abstract logic diagrams and raw Python syntax.

6. Dual Resizable Split Panels
Replaced all fixed-width CSS grid structures with custom drag-to-resize dividers:

Outer resizer: Drag the vertical bar between the reasoning form panel and the AI mentor
results panel (30%–80% bounds)
Inner resizer: Drag the bar between the code editor and the flowchart visualizer panel
(30%–80% bounds)
Both sliders support mouse drag (desktop) and touch drag (mobile/tablet)
Event listeners are cleanly removed on mouseup / touchend to prevent stale handlers
Panels collapse to stacked column layout on narrow viewports
7. Post-Challenge Comparison View
After the timer expires or the user gives up/solves the scenario:

Victory banner 🏆 — displayed when user solves before time is up
Timeout banner ⌛ — displayed when timer hits zero
Side-by-side comparison: User's draft code on the left, AI mentor model solution on the right
AI solution code explanation rendered below the comparison
"Try Challenge Again" button resets to the locked gate state