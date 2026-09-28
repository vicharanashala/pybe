# PyBe - Prasoon Lawania

PyBe is a scenario-driven, logic-first Python learning platform. This version features a custom **Cyberpunk Space-Dark Arcade Theme** and three original, gamified interactive playgrounds:

---

## 🚀 Key Features

### 1. 🦖 Python-Pet (Tamagotchi Autopilot)
* **Route:** `/pet`
* **File:** `client/src/pet/PythonPetPage.jsx`
* **Concept:** Students write Python conditionals (`if-elif-else`) to automate care for a virtual pixel-art dinosaur.
* **Mechanism:** 10-day simulation loop powered by in-browser Pyodide WebAssembly with state decay (hunger, energy, happiness) and dynamic SVG animations (eating, sleeping, playing, crying, collapsing).

### 2. 🎨 Pixel-Art Canvas (Generative Grid)
* **Route:** `/pixel`
* **File:** `client/src/pixel/PixelArtPage.jsx`
* **Concept:** Students write nested loops and conditional checks to paint designs on a 16x16 neon grid.
* **Mechanism:** Exposes `paint_pixel(x, y, color)` to Python. Includes built-in algorithmic challenges (Checkerboard, Outer Border Frame, Diagonal Cross X) with automated coordinate-validation and PNG image export.

### 3. 🛸 Code-Invaders (Retro Space Invaders Autopilot)
* **Route:** `/invaders`
* **File:** `client/src/invaders/CodeInvadersPage.jsx`
* **Concept:** Students write reactive algorithms to steer a spaceship shield and shoot lasers at falling aliens.
* **Mechanism:** Real-time 2D canvas game loop running at ~80ms ticks. Exposes live coordinate vectors (`ship.x`, `invader.x`, `invader.y`) and control methods (`ship.move_left()`, `ship.move_right()`, `ship.shoot()`) into Pyodide.

---

## 🎨 Global Theme: Cyberpunk Neon Arcade
* Pure space black (`#070a0e`) background with dark slate carbon panels.
* High-contrast neon cyan (`#00f3ff`), synthwave pink (`#ff007f`), and electric green (`#39ff14`).
* Styled meters, glowing code blocks, and custom retro typography.

---

## 💻 Setup & Run

1. **Install dependencies:**
   ```bash
   npm install
   npm run installAll
   ```

2. **Seed database:**
   ```bash
   npm run seed
   ```

3. **Run application:**
   ```bash
   npm run dev
   ```
   Open **http://localhost:5173/** to access the platform.
