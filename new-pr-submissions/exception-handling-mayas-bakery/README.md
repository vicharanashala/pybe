# 🥐 Maya's Midnight Bakery: A Storybook Python Journey

> **An interactive, story-driven learning experience designed for absolute beginners with zero prior coding experience.**

---

## 🌟 Narrative Philosophy: Story First, Never Technical Upfront

1. **No Textbook Jargon Upfront**:
   Concepts are never announced beforehand (no *"Today we will learn Exception Handling"*). The learner steps directly into the cozy village of Whispering Pines at midnight, discovers what goes wrong inside Maya's bakery, and invents solutions alongside Maya using everyday logic.
2. **Slow, Conversational Pacing**:
   Each chapter moves gently through narrative scenes with warm character dialogue (Sammy the Squirrel, Oliver the Owl, Penelope the Panda) and custom vector illustrations.
3. **Python Words as Natural Tools**:
   `try:`, `except:`, `ValueError`, `ZeroDivisionError`, `else:`, and `finally:` are introduced as practical signboards, safety nets, and ledger promises Maya installs on her antique brass cash register.

---

## 📖 Chapter Guide & Concept Progression

| Stage | Chapter | The Story Problem | The Solution & Python Tool |
|---|---|---|---|
| **Stage 1** | **The Midnight Rush** | Sammy types `"two"` instead of `2`. The raw register crashes with red smoke, halting the line for all 6 customers outside in the cold. | Understand why math on words scrambled the machine's calculator. |
| **Stage 2** | **Putting Up a Guardrail** | Maya doesn't want typos to shut down the bakery for everyone. | `try:` ("Attempt this dangerous step") and `except:` ("If something stumbles, catch it and show a kind note"). |
| **Stage 3** | **Different Problems, Different Signs** | Oliver types `0` to split a cake. The generic sign falsely accuses him of typing letters. | Separate specific signs: `except ValueError:` (for words) vs `except ZeroDivisionError:` (for dividing by zero). |
| **Stage 4** | **Charging the Card Safely** | Penelope makes a typo, but the machine still charged her credit card! | `else:` ("The Safe Payment Gate" — ONLY runs when the attempt succeeded with zero errors). |
| **Stage 5** | **The Nightly Notebook** | Maya needs to log every visit in her brass ledger and greet the next guest, whether an order succeeded or failed. | `finally:` ("The Loyal Cleanup Step" — guaranteed to execute 100% of the time). |

---

## 🕹️ Interactive Features

- **Story-First Page Progression**: Narrative scenes are completely unobstructed by questions or quizzes. Learners absorb the story, character dialogues, and illustrations at their own pace with an unlocked `"Continue Story →"` button. The decision questions and capstone code challenge appear strictly on their own dedicated **Next Page** (indicated by a distinct `💡` or `🛠️` page dot) once the narrative unfolds.
- **Live Register Simulator (Stage 1 Exclusive)**: Featured exclusively alongside Maya's opening rush story scenes in Stage 1. Learners can type orders (`2`, `"two"`, `0`, `4`), hit *Ring Up*, and watch the unhandled antique register screen crash with red smoke. On the MCQs window and in Stages 2–5, the simulator is cleanly removed so learners can focus in a centered layout on story progression, question answering, and Python guardrails.
- **Story Decision Checkpoints (Stages 1–4)**: Intuitive decision checkpoints disguised as logic puzzles with warm, encouraging feedback and progression gates on the dedicated Decision Point page.
- **Stage 5 Three-Page Split**: Stage 5 is cleanly partitioned into three dedicated, uncluttered pages:
  1. **Page 1 (Story)**: Maya's Nightly Ledger & the superpower of `finally:`, reflecting on the journey as dawn breaks over Whispering Pines.
  2. **Page 2 (Master Map)**: Dedicated full-page view of the Master Journey Map mapping all 5 story dilemmas side-by-side to Python architecture.
  3. **Page 3 (Fill in the Blanks)**: Focused, full-width workbench where students assemble Maya's Master Register code with the Word Bank, 5 interactive blanks, hints, and a 1-click shortcut to review the map anytime.
- **Free Stage Navigation**: Move freely between any stages (Stages 1 through 5) at any time directly via the top Journey Progress Map pills or the bottom navigation buttons without being gated or forced to clear the MCQs first.
- **Master Baker of Code Certificate**: Official graduation celebration upon completing all 5 stages!

---

## 🚀 How to Run

### Option 1: Direct File Opening
Double-click `index.html` in your file explorer, or drag and drop `index.html` into any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local Python Server
Run the included lightweight server:
```bash
python server.py
```
Then open your browser to:
[http://localhost:8080](http://localhost:8080)
