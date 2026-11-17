# Rahul's Kitchen Lab — Python File Handling Case Study

An interactive, story-driven case study that teaches Python file handling through a kitchen analogy. Rahul, a cook, learns why data disappears from RAM, how files persist on disk, and the smart ways to read files in Python.

Built with plain **HTML**, **CSS**, and vanilla **JavaScript** — no frameworks, no build step.

---

## How to Run

1. Clone or download this folder.
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).

No server, install, or dependencies required. An internet connection is only needed for Google Fonts.

---

## Project Structure

```
.
├── index.html       # Landing page — links to all chapters
├── chapter1.html    # Chapter 1: Primary & secondary storage
├── chapter2.html    # Chapter 2: Reading files in Python
├── quiz.html        # 8 MCQs with scoring and feedback
├── css/
│   └── styles.css   # Shared styles for all pages
└── README.md
```

---

## Chapters

### Chapter 1 — The Vanishing Spice
**Topic:** Primary & secondary storage

Rahul leaves a spice formula on the kitchen counter, but it vanishes every night. The chef explains the counter (RAM) vs the pantry (disk), and how labeled jars (files) survive after the program closes.

**Concepts covered:**
- RAM vs disk — speed, persistence, and capacity
- Files as named containers on disk
- `open()`, `read()`, `print()`, and `close()`
- Disk blocks and buffering (4096-byte blocks)

**Interactive elements:**
- Click-to-reveal analogy cards (kitchen → Python)
- Step-by-step code walkthrough

---

### Chapter 2 — Back to the Pantry
**Topic:** Reading files in Python

Weeks later, Rahul retrieves his saved spice from the pantry. Then he faces a 900-page log and learns that carrying everything at once crashes the counter — just like a `MemoryError` in Python.

**Concepts covered:**
- Read mode — file must already exist
- `f.read()` — entire file into memory
- `f.read(n)` — fixed number of characters
- `f.readline()` — one line at a time
- `for line in f:` — memory-efficient line-by-line reading

**Interactive elements:**
- Expandable method cards for each reading strategy
- Comparison table mapping kitchen strategies to Python methods

---

### Quiz — Pantry Knowledge
**Topic:** Review of Chapters 1 & 2

8 multiple-choice questions with instant feedback, a score tracker, streak counter, and a final rank (Head Chef → Kitchen Helper).

---

## Kitchen ↔ Python Analogy

| Kitchen              | Python / Computing        |
|----------------------|---------------------------|
| Kitchen counter      | RAM (primary storage)     |
| Pantry               | Disk (secondary storage)  |
| Labeled jar          | File                      |
| Moving jar to pantry | `open()` + `write()`      |
| Whole jar on counter | Disk block in RAM buffer  |
| 900-page log         | Large file / `MemoryError`|

---

## Tech Stack

- HTML5
- CSS3 (custom properties, grid, animations)
- Vanilla JavaScript (inline per page)
- [Google Fonts](https://fonts.google.com/) — DM Sans & Fraunces

---

## Author

**Swastika Mitra** — Summership '26 PR submission for PyBe.
