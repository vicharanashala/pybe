# 🍁 Maple Heights

**A Scenario-Driven Python Learning Prototype**

Maple Heights is a browser-based, interactive educational tool designed to teach beginners Python List Operations. Users play the role of an apartment Building Manager, solving tenant requests by physically interacting with the UI (drag-and-drop, clicking). Once a task is visually completed, the app reveals the exact Python code that automates that specific action.

## 🚀 Getting Started
This project is built with vanilla web technologies (no frameworks or build steps). 
Simply open `index.html` in any modern web browser to start the simulation.

## 📂 File Structure

```text
📁 epic-newton
├── 📄 index.html          # Main application layout and entry point
├── 📄 README.md           # Brief project overview and setup
├── 📄 product.md          # Detailed product methodology and feature breakdown
└── 📁 src                 # Source code directory
    ├── 📄 style.css       # Application styling, themes, and CSS animations
    ├── 📄 state.js        # Centralized state management for the Python list logic
    ├── 📄 main.js         # Core application loop and sequence controller
    ├── 📁 components      # Reusable UI modules
    │   ├── building.js    # Renders the apartment grid and speech bubbles
    │   ├── register.js    # Renders the active tenant roster side-panel
    │   ├── narrator.js    # Controls the story modals and dialogue prompts
    │   ├── inspector.js   # Logic for the live index-inspection tool
    │   └── reveal.js      # The "Manager's Digital Ledger" code/quiz overlay
    └── 📁 cases           # Individual scenario modules (Learning levels)
        ├── case1.js       # Level 1: append()
        ├── case2.js       # Level 2: [0] (Zero-based indexing)
        ├── case3.js       # Level 3: insert()
        ├── case4.js       # Level 4: remove() and ValueError
        ├── case5.js       # Level 5: sort()
        ├── case6.js       # Level 6: len()
        ├── case7.js       # Level 7: pop()
        └── case8.js       # Final Boss: Inspector's Checklist
```
