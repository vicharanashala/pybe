# Context: The Pedagogy of Discovery Labs

## 1. Relationship to PyBe V0

PyBe V0 provides the core foundation for computational thinking and interactive programming concepts.

This contribution extends that foundation by introducing a dedicated Discovery Lab for **Python Exception Handling** (`try` / `except` / `else` / `finally` / `raise`). Rather than introducing error handling as syntactic rules or dry file-I/O edge cases, it grounds the architecture in the physical survival dilemmas of crossing the Himalayas on a motorcycle.

---

## 2. The Core Problem: Definition-First Teaching

Most traditional programming instruction introduces exception handling deductively:
1. Recite the formal keywords: `try`, `except`, `else`, `finally`.
2. Provide artificial examples (e.g. dividing by zero or opening non-existent files).
3. Ask learners to memorize error handling syntax rules.

### Why This Fails
When taught deductively, students experience two persistent misconceptions:
1. **The "Why Not Just `if`?" Fallacy:** Without experiencing unpredictable, environmental hazards beyond the program's control (such as glacial floods, severed drive chains, or corrupt inputs), exception handling appears to be redundant syntactic ceremony.
2. **The "Catch-All Anti-Pattern":** Because students do not develop a concrete mental model of specific, named hazards, they default to `except: pass` or `except Exception:`. This is the digital equivalent of riding a motorcycle with all warning gauges disconnected.

---

## 3. The PyBe Discovery Lab Solution

The **Discovery Lab framework** reverses this paradigm:

$$\text{Physical Dilemma} \longrightarrow \text{Intuitive Consequence} \longrightarrow \text{Felt Need} \longrightarrow \text{Syntax Morph}$$

### Pedagogical Pillars:
- **Zero Syntax During Discovery:** No Python keywords appear on screen before Scene 8 (Debring). The learner discovers and validates the 4-stage routine purely in physical mountain survival terms.
- **Action-First Gating:** The "Next Stage" button remains locked until the learner completes the physical action on the stage (packing tools, wrapping hazards, wiring handlers).
- **Visual Dominance ($\ge 55\%$ Viewport):** High-resolution photographic survey backdrops and responsive SVG stages replace passive text walls with interactive physical dilemmas.
- **In-Place Morphing:** Transforming natural language notebook sentences directly into Python syntax in the identical position and color bridges English thought to syntax without cognitive split-attention.
- **4-Lamp Mental Model Dashboard:** Four color-coded dashboard lamps (`Road`, `Fix`, `Chai`, `Camp`) light up incrementally as each mental construct is unlocked.
- **Fair, Transfer-Oriented Checkpoints:** All assessment questions present novel trail situations with balanced option lengths, believable distractors, and story-driven feedback.
