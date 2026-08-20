# PyBe — The Sealed Record

**An interactive story that teaches Python tuples without ever saying the word "tuple" until the reveal.**

---

## What It Is

A single-file HTML/CSS/JS micro-lesson (no dependencies, no build step) that teaches the **tuple** data structure through a royal-kingdom narrative. Instead of opening with "here's a data structure with fixed order and no mutability," the story makes the learner *discover* every property of a tuple as a plot beat — then names it in Chapter 12.

The concept is taught entirely through **show, don't tell**: a stone slab, a corrupt minister who fails to tamper with it, a traveler who wants the second law, an apprentice who wants to count "steps from the start." Six story clues map 1:1 onto six real tuple properties. Only after all six are collected does the sage reveal: *this is called a tuple.*

---

## The Concept Map

| Story beat | Python concept |
|---|---|
| Laws carved into stone, in order | Tuples are **ordered** |
| Minister's chisel fails at night | Tuples are **immutable** |
| Traveler asks for the "second" law, keeper points to it | **Indexing** — direct access by position |
| Apprentice counts "steps from the start," not "which number" | Indexing is **0-based** |
| King asks "how many laws?" without counting | `len()` |
| King wants a 4th law — a new slab is carved, old one untouched | Adding an item means **making a new tuple**, e.g. `edict + ("Dana",)` |

The lesson closes by contrasting a tuple against a list (`["Nyaya", "Kshama"]` vs `("Nyaya", "Kshama")`) so the immutability distinction sticks.

---

## Structure — 17 Chapters

1. **Welcome** – Doota the messenger sets up the problem
2. **The Problem** – scrolls keep drifting out of sync
3. **A Decision** – learner chooses "carve it in stone" (branching choice)
4. **The Carving** – three laws carved: *Ahimsa, Dharma, Nyaya*
5–10. **Six Clues** – interactive beats, each unlocked by an action (swap order, watch tampering fail, answer position/index/count questions, watch a new slab get carved)
11. **The Sage's Notebook** – all six clues recapped together
12. **The Naming** – the reveal: this is a `tuple`; slab becomes real Python code
13. **Test The Seal** – learner runs `edict[0] = "Kshama"` and sees the real `TypeError`
14. **Reverse Engineering** – multiple choice: pick the code that produces a given tuple (tests list-vs-tuple and ordering)
15. **Final Mission** – self-check completion checklist
16. **Lesson Summary** – five-point recap
17. **Achievement Unlocked** – completion badge + replay option

---

## Key Design Choices

- **Delayed naming.** The word "tuple" never appears before Chapter 12. This keeps the learner reasoning about *behavior* rather than pattern-matching a vocabulary word.
- **Real error, not simulated.** Chapter 13 shows the actual Python `TypeError: 'tuple' object does not support item assignment` — not a story-fied version — so the story maps cleanly onto real code.
- **Progress signals.** A 6-dot clue tracker (chapters 5–11) plus an overall chapter progress bar, so the learner always knows how much of the mystery is solved.
- **Gated progression.** `canContinue()` blocks the Next button until each chapter's interaction is genuinely completed (choice made, button clicked, correct answer picked) — no clicking through unread.
- **Consistent theming.** All law names stay in Sanskrit (*Ahimsa, Dharma, Nyaya*, later *Dana, Kshama*) instead of generic placeholders, keeping the kingdom setting coherent throughout.

---

## Tech Stack

- Single HTML file, vanilla JS (no framework, no build)
- State held in one `state` object; `render()` re-draws the whole panel on every change
- Fonts: Fraunces (headings) + Nunito Sans (body) + IBM Plex Mono (code blocks), loaded via Google Fonts
- Fully self-contained — can be opened directly in a browser or dropped into any static host

---

## Customization

Seven optional illustration slots are defined at the top of the script (`IMAGES` object). Each defaults to a dashed placeholder with a hint of what to draw; supplying a path/URL swaps in real art with no other code changes:

`welcome`, `carving`, `tampering`, `steps`, `sage`, `naming`, `achievement`

---

## Learning Outcome

By the end, a learner can:
- Explain what a tuple is and why it's immutable
- Correctly index into a tuple and explain why indexing starts at 0
- Use `len()` on a tuple
- Know that "modifying" a tuple always means creating a new one
- Distinguish tuple syntax `()` from list syntax `[]`