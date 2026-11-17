# 🧰 Magic Treasure Chest: The Goblin Heist

An interactive, story-driven educational web game that teaches **Hashmaps (Dictionaries)**, **$O(N)$ vs $O(1)$ Time Complexity**, and **Error Handling (`KeyError` vs `.get()`)** to beginners, kids, and non-coders.

> *"Psst, you! Help me out! I broke into the Wizard's castle, but his magic chest has 1,000 tiny drawers and a sleeping guard dog!"* — Sly the Goblin

---

## 🌐 Live Deployed Application

- **Live URL:** **[https://frontend-rouge-two-47n470mp71.vercel.app](https://frontend-rouge-two-47n470mp71.vercel.app)**
- **Play Chapter 1 Directly:** **[https://frontend-rouge-two-47n470mp71.vercel.app/story/1](https://frontend-rouge-two-47n470mp71.vercel.app/story/1)**

---

## 🌟 Key Features & Game Systems

1. **Persistent Dog Wake Meter:**
   - A persistent HUD bar at the top tracking the guard dog's alertness (0% to 100%).
   - Wrong quiz answers (+25%) and slow sequential searches raise it; correct answers (-15%) soothe the dog back to sleep.
   - If it reaches 100%, a humorous "Busted!" screen appears allowing a safe retry by tossing a sleepy biscuit.

2. **XP & Badges System:**
   - Persisted in `localStorage`.
   - Badges to collect:
     - 🐢 **Slow Poke**: Survive sequential list search in Chapter 1.
     - ⚡ **Hash Wizard**: Master $O(1)$ instant lookup in Chapter 2.
     - 📜 **Spellcaster**: Debug and format Python dictionaries in Chapter 3.
     - 🗝️ **Master Thief**: Execute the live API spell in Chapter 4.
     - 🛡️ **Trap Dodger**: Disarm the deadly `KeyError` booby trap in Chapter 5.
     - 🐱 **Curious Cat**: Test 5 custom words in the interactive Hash Visualizer.

3. **3-Step Hint Ladder & Strict Quiz Gating:**
   - Checkpoints prevent skipping until concepts are understood.
   - 3-tier hints: Gentle Nudge (-2 XP) ➡️ Bigger Clue (-5 XP) ➡️ Near-Answer (-10 XP).
   - Friendly, constructive feedback explaining *why* a choice is wrong.

4. **Simple Mode vs. Nerd Mode:**
   - **Simple Mode**: Intuitive metaphors and real-world analogies (contacts, library index, menus).
   - **Nerd Mode**: Formal computer science terms (hash function, buckets, collisions, chaining, amortized $O(1)$).

5. **Audio & Celebration System:**
   - Zero-dependency Web Audio API sound synthesizer (`useSoundFX.js`): retro chimes, buzzers, dog growls/barks, and chest opening fanfares.
   - Muted by default with quick toggle button.
   - Confetti bursts on victories using `canvas-confetti`.

---

## 🗺️ Chapter Roadmap

- **Chapter 1: The Heist Begins (Sequential Search, $O(N)$):**
  - Interactive "Open Drawers" simulation with speed slider (10, 100, 1,000 drawers).
  - Dog wake animation (eyes opening, snoring fading).
  - Live SVG line chart plotting $N$ drawers vs inspection steps, demonstrating linear growth.
- **Chapter 2: The Wizard's Secret (Hashmap, $O(1)$):**
  - Neon beam animation connecting key stickers to treasure drawers.
  - Race Mode: Side-by-side race between Sly the Searcher ($O(N)$) and Sly the Wizard ($O(1)$) across 10, 1,000, and 1,000,000 drawers.
  - Interactive Hash Visualizer: Word character breakdown, ASCII codes, hash formula, modulo 1,000 drawer targeting, and an "Oops, Collision!" bonus demo showing chaining.
- **Chapter 3: The Computer Spellbook (Python Dictionary Syntax):**
  - Interactive syntax code block with hover tooltips on `{ }`, `"star"`, `:`, and `"Golden Coin"`.
  - "Spot the Bug" 3-round mini-game fixing missing colons, wrong brackets, and unquoted strings.
- **Chapter 4: Execute the Spell (Live Execution):**
  - Live terminal input updating Python code preview in real-time.
  - Live query against backend Express API (`GET /treasure/:symbol`).
  - Suggested keys bar (`star`, `heart`, `skull`, `crown`) plus secret Easter eggs (`"goblin"`, `"bone"`).
- **Chapter 5: The Booby Trap (`KeyError` vs `.get()`):**
  - The missing `"dragon"` key scenario.
  - Vertical syntax options: `wizard_chest["dragon"]` (violent shake, `KeyError` breakdown) vs `wizard_chest.get("dragon")` (safe `None` fallback) vs `wizard_chest.get("dragon", "Empty hands!")` (custom default).
- **Grand Finale & Exam:**
  - 3-card learning recap ($O(N)$ vs $O(1)$, Key $\rightarrow$ Value, `KeyError` vs `.get()`).
  - 5-question Heist Exam with diagnostic weak-spot feedback.
  - Downloadable HTML5 Canvas Master Thief Certificate (PNG).

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, `react-router-dom`, `framer-motion`, `lucide-react`, `canvas-confetti`, Web Audio API synthesizer.
- **Styling:** Custom Vanilla CSS, animated gradient mesh, glassmorphism (`backdrop-filter`), neon glowing borders, responsive 2-column desktop / 1-column mobile layout.
- **Backend:** Node.js, Express, MongoDB (Mongoose) with automatic in-memory fallback if MongoDB is offline.
- **REST API Endpoints:**
  - `GET /health`: Health status and database connectivity.
  - `GET /treasure/:symbol`: Instant $O(1)$ lookup for key symbol with friendly hints.
  - `GET /quiz`: Randomized 3-choice questions for security checkpoints.
  - `POST /admin/treasure`: Inscribe new treasures with input validation.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- (Optional) Local MongoDB running on `mongodb://127.0.0.1:27017` (app includes auto-fallback if MongoDB is offline).

### 2. Running the Backend
```bash
cd backend
npm install
node server.js
```
The server will start on `http://localhost:5000`.

### 3. Running the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📄 License
MIT. Built for young learners, aspiring developers, and coding enthusiasts everywhere!
