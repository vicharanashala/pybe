# PyBe - Interactive Case Studies Frontend

Welcome to the PyBe interactive case studies module! This project brings the philosophy of PyBe to life by allowing learners to naturally discover programming ideas through intuition and real-life scenarios—without feeling like they are reading a textbook.

## Project Philosophy

As guided by the core PyBe principles:
- **Intuition over syntax**: We teach the annoyance of a problem before the Python concept.
- **Playful interactions**: The learner makes tiny decisions at every step.
- **Relatable scenarios**: Case studies are heavily based on daily Indian life (e.g., UPI transactions, finding Sharma Ji's address, Mummy's checklist).
- **No punishment**: Wrong answers give playful feedback, not big red crosses.
- **The "Aha!" Moment**: Python syntax is only introduced at the very end as a label for what the learner just naturally did.

## Features

- **Minimalist & Playful UI**: Built with pure Vanilla CSS, avoiding generic dark themes and focusing on vibrant, pastel colors with micro-animations.
- **JSON-Driven Story Engine**: All case studies are managed entirely via `src/data.json`, making it extremely easy to add new stories without touching the UI logic.
- **Custom Illustrations**: Playful 2D cartoony illustrations bring each step of the scenarios to life.

## Case Studies Included

1. **The Smart Shortcut** (Short-Circuit Evaluation AND / OR)
   - *Context:* Papa asks you to find his wallet on the sofa OR the table. Once you find it on the sofa, you stop checking. Later, your phone dies outdoors. You need a socket AND a charger. Seeing no socket, you don't even check your bag for the charger. You naturally used short-circuit logic!
2. **The UPI Mistake** (Tuples & Immutability)
   - *Context:* You accidentally sent ₹500 to the tapri instead of ₹50. You can't just "edit" the past transaction because it's an immutable historical record. Tuples protect data the same way.
3. **Sharma Ji's Address** (Memoization & Caching)
   - *Context:* The shopkeeper is tired of explaining the confusing route to Sharma Ji's house multiple times a day. He writes it on a blackboard to serve answers instantly from "cache".

## How to Run

This project was intentionally built with zero backend dependencies, no databases, and no environment variables. 

1. Ensure you have Node.js installed.
2. Open your terminal and navigate to this folder:
   ```bash
   cd "summership-26-prs/Aryan Vaghasiya/pybe-app"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

## Contributing

To add a new case study:
1. Open `src/data.json`.
2. Add a new object following the existing structure.
3. Add any relevant images to `public/assets/`.
4. Ensure your story follows the "Intuition First, Code Last" PyBe philosophy!
