# Case Study: The Cricket Chase & The Note Counter

This module introduces Iteration (Loops) in Python by utilizing two relatable, real-world case studies instead of abstract mathematical examples.

---

## Case Study 1: The Cricket Chase (For vs. While Loops)

### Scenario
Imagine it's the final over of a thrilling T20 cricket match. The batting team needs 15 runs to win. 
There are two distinct repetitive actions happening on the field.

### The Bowler's Perspective (`for` loop)
A bowler is handed the ball. The rules of cricket dictate that they must bowl **exactly 6 legal deliveries** to complete an over. They know this count before they even start their run-up.

*   **Concept:** A `for` loop is used when you know the **exact number of repetitions** beforehand. It iterates over a known sequence.

### The Batsman's Perspective (`while` loop)
The batsmen are chasing a target. They don't know exactly how many balls they will need to hit to get those 15 runs. They might hit three sixes and finish it in 3 balls, or take singles and need all 6. They will keep running **while** their score is less than the target (and they haven't lost 10 wickets).

*   **Concept:** A `while` loop is used when repetition depends on a **condition** being true. It keeps looping until the condition becomes false.

---

## Case Study 2: The Note Counter (`break` vs. `continue`)

### Scenario
A high-speed bank cashier machine is rapidly counting a massive bundle of cash. Everything is going smoothly, but occasionally, the machine encounters problem notes.

### Scenario A: The Torn Note (`continue`)
A slightly torn note goes through the scanner. The machine recognizes it's valid, but damaged. It rejects the note into a separate bin. It doesn't stop counting the rest of the bundle; it simply **skips** that one torn note and continues with the next one.

*   **Concept:** The `continue` statement immediately stops the **current iteration** of the loop and jumps back to the top to process the next item.

### Scenario B: The Fake Note (`break`)
A counterfeit note is detected. This is a severe security issue! The machine sounds an alarm and **stops completely**. It will not process any more notes in that bundle until a manager overrides the system. The counting process is entirely halted.

*   **Concept:** The `break` statement completely terminates the **entire loop**, regardless of how many iterations are left.

---

## Summary and Reflection
By mapping programming constructs to physical events that the learner intuitively understands, we bypass the syntax barrier. The learner implicitly understands *why* a process stops early (a fake note) or why an action is skipped (a torn note) before writing a single line of Python code.
