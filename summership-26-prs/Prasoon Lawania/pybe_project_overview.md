# PyBe Platform - Project Overview & Sharing Guide

This document summarizes the custom features, retro visual overhauls, and developer setup instructions implemented by **Prasoon Lawania** for the **PyBe** scenario-first learning platform.

---

## 🚀 Key Feature Highlights

### 1. "Python-Pet" (Tamagotchi Autopilot Playground)
*   **Gamified Pedagogy:** Learners write Python conditionals (`if-elif-else`) to automate care for a virtual pixel-art dinosaur pet.
*   **10-Day Survival Loop:** The engine executes the student's script using a local Pyodide WebAssembly runner, decaying stats dynamically (hunger, energy, happiness) at each day cycle.
*   **SVG Render Engine:** Renders dynamic animations matching the pet's state (sleeping, playing, eating, crying when sad, or collapsing when neglected).

### 2. "PyBe Pixel-Art Canvas" (Generative Grid Playground)
*   **16x16 Neon Grid Board:** Exposes a simple `paint_pixel(x, y, color)` function to Python context loops.
*   **Pattern Challenges:** Built-in algorithm challenges (Checkerboard pattern, Outer border frame, Diagonal Cross X) with an automatic validation check confirming if the code matches the grid target coordinates.
*   **Art PNG Exporter:** Allows learners to download their painted canvas grid as a `.png` image file.

### 3. "PyBe Code-Invaders" (Retro Space Invaders Autopilot)
*   **Real-time AI Shield Navigation:** Exposes live coordinate values of falling invaders (`invader.x`, `invader.y`) to Python conditionals to steer the spaceship (`ship.move_left()`, `ship.move_right()`) and shoot lasers (`ship.shoot()`) in a real-time game loop.
*   **Score Counter & Logs:** Tracks survival waves, shield integrity points, and scores.

---

## 🎨 Global Theme: Cyberpunk Neon Arcade
The entire application theme has been overhauled to a cohesive **Space Obsidian Dark Mode**:
*   **Backgrounds:** Space black (`#070a0e`) and dark slate carbon panels.
*   **Accents:** Cyberpunk neon cyan (`#00f3ff`), synthwave pink (`#ff007f`), and electric green (`#39ff14`).
*   **Progress Meters & Shadows:** Neon glow progress meters and drop shadows that light up active items.

---

## 💻 Local Setup & Execution Guide
To run this project locally, copy the folder to your system and run:

```bash
# 1. Install dependencies
npm install
npm run installAll

# 2. Seed database
npm run seed

# 3. Launch Development Servers
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** to access the platform.

---

## 🤖 Future Upgrade: Google AI Studio Integration
The project runs 100% offline-first. If you want to scale PyBe and swap out the local seed scenarios with dynamic, unlimited AI-generated scenarios, you can use **Google AI Studio**:

1.  **Get an API Key:** Log in to **[Google AI Studio (Click to Open)](https://aistudio.google.com/)** and create a free Gemini API Key.
2.  **Add to Environment:** Add the key to your backend `.env` file:
    ```env
    GEMINI_API_KEY=your_key_here
    ```
3.  **Code Integration Hook:** You can swap the local static mentor generator inside `server/src/services/learningEngine.js` with the Gemini REST API endpoint:
    ```javascript
    const { GoogleGenAI } = require("@google/generative-ai");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Call model.generateContent() to dynamically map student reasoning to Python code!
    ```
