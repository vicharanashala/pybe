# Product File: PyBe Iteration Learning Module

## Overview
The **Interactive Iteration Learning Module** is a frontend-only React application built via iterative vibe-coding. It guides learners through loop and iteration concepts using a narrative case study ("Finding Row Number in Dark Movie Theatre") and custom interactive components.


## 🌟 Pedagogical (Teaching) Features

*   **Narrative-Driven:** Introduces the core concept of iteration through a highly relatable case study ("Finding Row Number in Dark Movie Theatre").
*   **Natural Concept Flow:** Seamlessly introduces `for` and `while` loops naturally through the story, contrasting condition-dependent repetition with fixed-repetition.
*   **Incremental Code Building:** Breaks down Python loop syntax step-by-step (Starting State, Condition, Action, Update Step).
*   **Knowledge Checks:** Includes 4 interactive MCQs with immediate feedback to test learner understanding without breaking narrative immersion.


## ⚙️ Technical Architecture & Features

### 1. Dual-Pane "Dark Theater" Architecture
*   **Left Pane (`40vw`):** Contextual visual area that dynamically renders 16:9 widescreen images (`public/assets/`) with automatic fallback placeholder styling, or formatted header text.
*   **Right Pane (`60vw`):** Three-zone interactive container:
    *   **Zone A (Top Header):** Module title, navigation back-button, and beat counter (`Beat N of M`).
    *   **Zone B (Main Area):** Dynamic beat text, code blocks, speech bubbles, and interactive MCQs.
    *   **Zone C (Bottom Bar):** Navigation control with gated "Next" / "Finish Module" buttons.

### 2. Custom Markdown Beat Parser (`moduleParser.js`)
*   Parses raw markdown content divided into `# Beat N of M` blocks.
*   Separates content into `left-pane` configuration (text vs. image metadata) and `right-pane` HTML blocks.
*   Fault-tolerant parser that handles missing blank lines, unclosed code fences, and custom tags smoothly.

### 3. Interactive Custom Tag System (`<z-*>`)
*   **`<z-announcement>`:** High-visibility notification box styled with warning yellow borders for core definition highlights.
*   **`<z-question>`:** Formatted blue conceptual prompt.
*   **`<z-reply>`:** Block speech bubble for character dialogue.
*   **`<z-mcq>` & `<z-options>`:** Stateful multiple-choice quiz block.
    *   *Progression Gating:* Automatically disables the "Next" button until the correct option (`correct="true"`) is selected.
    *   *Immediate Feedback:* Provides immediate visual feedback for incorrect answers.
    *   *Optional Explanation:* Reveals a "Show Explanation" button upon solving the question.


## 🛠️ Tech Stack

- **Core Framework:** React 18
- **Build Tooling:** Vite
- **Styling:** Tailwind CSS (Vanilla CSS & utility classes for custom design tokens)
- **Icons:** Lucide React


## 🚀 Getting Started (Running Locally)

The active React application is located within the pybe-iteration-feature/client directory. To run it locally:

```bash
# 1. Navigate to the client directory
cd pybe-iteration-feature/client

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.



## 📝 How to Update Content & Assets

### 1. Modifying Text & Beat Content
The active module text is driven by `client/src/data/moduleContent.js` (which mirrors `docs/module.md`).

To edit narratives, speech bubbles, or MCQs:
- Edit the raw string inside `client/src/data/moduleContent.js`.
- Each beat is enclosed within a `# Beat N of M` section with `left-pane` and `right-pane` definitions:

````markdown
# Beat 3 of 12
left-pane : {
    type : "image",
    src: "/assets/image-3.png"
}

right-pane :
```html
<z-question>
"Raghav, in which row are you sitting?"
</z-question>
<z-reply>
"Tarun, I don't know my row number. I just know that I am sitting in 5th column from the aisle."
</z-reply>
```
````


### 2. Adding or Replacing Images
- Place 16:9 widescreen PNG or WebP images (`1280x720` or `1920x1080` recommended) into `client/public/assets/`.
- Name files to match the beat configuration (e.g. `image-1.png`, `image-2.png`, etc.).
- Refer to images in `left-pane` using root-relative paths: `/assets/image-1.png`.
- If an image file is missing, `ModuleView.jsx` will gracefully fall back to a styled dashed placeholder box.



## 📁 Repository Structure

```text
.
├── archive/                      # Archived planning and ideation logs (iteration & recursion)
├── development-log.md            # Chronological development log
├── principles.md                 # Required PR document: Design principles breakdown
├── product.md                    # Required PR document: Feature documentation (this file)
├── project-decisions.md          # Architectural and design decisions log
├── pybe-iteration-feature/       # Active feature workspace
│   └── client/                   # Frontend React app source code
│       ├── dist/                 # Compiled production build output
│       ├── public/assets/        # 16:9 narrative image assets
│       ├── src/                  # React components, custom parser, and raw markdown data
│       └── README.md             # Feature-specific client documentation
├── summary.md                    # Required PR document: Developer info and brief summary
└── vibe-coding-docs/             # Templates, agent instructions, and post-build evolution logs
```

## 🗄️ Archive
 There is another feature `pybe-recursion-feature` in `archive` docs. During the development phase, based on pedagogical feedback, the feature was officially pivoted from teaching "Recursion" to "Iteration". This `pybe-recursion-feature` feature remains strictly for historical logging and reference. 
