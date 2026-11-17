# Interactive Recursion Learning Module

An interactive, frontend-only learning platform built with **React (Vite)** and **Tailwind CSS** that guides learners through computer science recursion concepts using a narrative case study ("Finding Row Number in Dark Movie Theatre") and interactive multiple-choice questions (MCQs).

---

## 🌟 Key Features

- **Split-Pane Layout Architecture:** 
  - **Left Section (`40vw`):** Contextual media, graphics, and concept headings.
  - **Right Section (`60vw`):** 3-zone interaction engine (Zone A Header, Zone B Main Content, Zone C Bottom Navigation).
- **Dynamic `<z-*>` Tag Parsing & Rendering:**
  - Converts custom domain markup into rich interactive React components: `<z-announcement>`, `<z-thinking>`, `<z-question>`, `<z-ponder>`, `<z-answer>`, `<z-explanation>`, `<z-reply>`, `<z-click>`, and `<z-options>`.
- **Conditional Progression Gating:**
  - Automatically unlocks purely narrative beats while locking interactive beats (Reflections & MCQs) until the user completes the required interaction.
  - Displays dynamic lock guidance badges in Zone C (`"Click on Reveal Answer to proceed."` vs `"Attempt the question to proceed."`).
- **Interactive Reflection & Ponder Cards:**
  - Two-stage reveal mechanism (`[Reveal Answer]` unlocks the beat and displays the answer; `[Show Explanation]` optionally reveals detailed explanations).
- **Stateful MCQ Engine:**
  - Single-selection tracking with immediate visual feedback (RED for incorrect, GREEN for correct).
  - Unlocks beat progression immediately upon selecting the correct answer with an optional `[Show Explanation]` button.
- **Smart Image Fallbacks:**
  - Seamlessly renders real image assets when available or falls back to styled placeholders displaying the target filename.

---

## 🛠️ Tech Stack

- **Core Framework:** React 19 (Vite)
- **Styling & Design System:** Tailwind CSS v3 & PostCSS
- **Icons:** Lucide React
- **State Management:** Standard React Hooks (`useState`, `useEffect`)

---

## 🚀 Getting Started (Running Locally)

Follow these steps to set up and run the application locally on your machine:

### 1. Navigate to the Client Directory
```bash
cd client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Local Development Server
```bash
npm run dev
```

### 4. Open in Browser
Once the dev server starts, open your browser and navigate to:
👉 **`http://localhost:5173`**

---

## 📁 Folder Structure

```text
pybe-recursion-feature/
├── client/                         # Frontend React Application
│   ├── public/
│   │   └── assets/                 # Place real image files here (image-1.png, etc.)
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomTagRenderer.jsx   # Dynamic markup parser & component builder
│   │   │   ├── LandingPage.jsx         # Module selection landing view
│   │   │   ├── McqCard.jsx             # Interactive MCQ component with option tracking
│   │   │   ├── ModuleView.jsx          # 3-Zone split-screen beat navigation shell
│   │   │   ├── PlaceholderImage.jsx    # Smart image loader with placeholder fallback
│   │   │   └── ReflectionCard.jsx      # Two-stage reveal reflection component
│   │   ├── data/
│   │   │   └── modulesData.js          # Parsed content data for Module 1 & Module 2
│   │   ├── App.jsx                     # Root application container & route state
│   │   ├── index.css                   # Tailwind directives & design system tokens
│   │   └── main.jsx                    # React application entry point
│   ├── package.json                    # Project dependencies & scripts
│   ├── tailwind.config.js              # Tailwind CSS configuration
│   └── vite.config.js                  # Vite configuration
├── docs/                           # Specification & content grammar documentation
├── AGENTS.md                       # Agent instructions & constraints
├── README.md                       # Project documentation
└── VIBECODING_CHANGELOG.md         # Development timeline changelog
```

---

## 🖼️ Asset Management

Image references in the module content (e.g. `/assets/image-1.png`, `/assets/image-2.png`, etc.) are resolved relative to the `client/public/` directory.

To replace the default placeholder boxes with your custom images:
1. Place your generated PNG files directly into the **`client/public/assets/`** folder:
   - `client/public/assets/image-1.png`
   - `client/public/assets/image-2.png`
   - `client/public/assets/image-3.png`
   - `client/public/assets/image-4.png`
2. Recommended image dimensions: **800 × 600 pixels (4:3 aspect ratio)**.
3. The `PlaceholderImage` component will **automatically detect and load** the real images without requiring code modifications or server restarts.
