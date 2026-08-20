# PyBe - Interactive Recursion & Iteration Learning Platform

An interactive, markdown-driven learning platform built with React, Vite, and Tailwind CSS. Featuring a split-pane "Dark Theater" aesthetic, the application guides learners step-by-step through programming concepts using a beat-based narrative delivery system, custom `<z-*>` interactive elements, and state-gated Multiple Choice Questions (MCQs).

---

## 🚀 Tech Stack

- **Core Framework:** React 18
- **Build Tooling:** Vite
- **Styling:** Tailwind CSS (Vanilla CSS & utility classes for custom dark theater design tokens)
- **Icons:** Lucide React
- **Content Engine:** Custom HTML & Tag DOM Parser

---

## ✨ Core Features

### 1. Dual-Pane "Dark Theater" Architecture
- **Left Pane (`40vw`):** Contextual visual area that dynamically renders 16:9 widescreen images (`public/assets/`) with automatic fallback placeholder styling, or formatted header text.
- **Right Pane (`60vw`):** Three-zone interactive container:
  - **Zone A (Top Header):** Module title, navigation back-button, and beat counter (`Beat N of M`).
  - **Zone B (Main Area):** Dynamic beat text, code blocks, speech bubbles, and interactive MCQs.
  - **Zone C (Bottom Bar):** Navigation control with gated "Next" / "Finish Module" buttons.

### 2. Custom Markdown Beat Parser (`moduleParser.js`)
- Parses raw markdown content divided into `# Beat N of M` blocks.
- Separates content into `left-pane` configuration (text vs. image metadata) and `right-pane` HTML blocks.
- Fault-tolerant parser that handles missing blank lines, unclosed code fences, and custom tags smoothly.

### 3. Interactive Custom Tag System (`<z-*>`)
- **`<z-announcement>`:** High-visibility notification box styled with warning yellow borders for core definition highlights.
- **`<z-question>`:** Formatted blue conceptual prompt.
- **`<z-reply>`:** Block speech bubble for character dialogue (e.g. Tarun & Raghav).
- **`<z-mcq>` & `<z-options>`:** Stateful multiple-choice quiz block.
  - **Wrong Answer Feedback:** Immediate visual feedback (`Incorrect, please try again.`).
  - **Progression Gating:** Automatically disables the "Next" button until the correct option (`correct="true"`) is selected.
  - **Optional Explanation (`<z-explanation>`):** Reveals a "Show Explanation" button upon solving the question.

---

## 📂 Project Structure

```text
client/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── public/
│   └── assets/             # Module image assets (image-1.png to image-5.png)
└── src/
    ├── App.jsx             # Shell & top-level view router
    ├── main.jsx
    ├── components/
    │   ├── ContentRenderer.jsx  # DOM parser for HTML and <z-*> tags
    │   ├── LandingPage.jsx      # Module selection interface
    │   └── ModuleView.jsx       # Beat navigation & split-pane layout
    ├── data/
    │   └── moduleContent.js     # Raw markdown content string
    └── utils/
        └── moduleParser.js      # Regex beat parsing engine
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Local Run

1. Navigate to the `client/` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   `http://localhost:5173/`

### Building for Production

To generate a static production build:
```bash
cd client
npm run build
```
The output bundle will be generated in `client/dist/`.

---

## 📝 How to Update Content & Assets

### 1. Modifying Text & Beat Content
The active module text is driven by `src/data/moduleContent.js` (which mirrors `docs/module.md`).

To edit narratives, speech bubbles, or MCQs:
- Edit the raw string inside `src/data/moduleContent.js`.
- Each beat is enclosed within a `# Beat N of M` section with `left-pane` and `right-pane` definitions:

```markdown
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
```

### 2. Adding or Replacing Images
- Place 16:9 widescreen PNG or WebP images (`1280x720` or `1920x1080` recommended) into `public/assets/`.
- Name files to match the beat configuration (e.g. `image-1.png`, `image-2.png`, etc.).
- Refer to images in `left-pane` using root-relative paths: `/assets/image-1.png`.
- If an image file is missing, `ModuleView.jsx` will gracefully fall back to a styled dashed placeholder box.
