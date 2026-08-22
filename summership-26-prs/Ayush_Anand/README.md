# 🏺 The Royal Scribe's Secret

> An interactive, story-driven learning module that teaches **Python String Indexing and Slicing** through an original fictional tale set in the kingdom of Suryagarh.

---

## What it teaches

This module is a standalone contribution to PyBe. It follows the platform's story-first pedagogy: the learner reasons about a problem using an ancient inscription *before* any Python syntax is shown.

By the end, the learner has discovered and practiced:

- A string as an ordered sequence of characters
- Positive indexing — `message[4]`
- Slicing a range — `message[9:15]`
- Negative indexing — `message[-1]`
- Slicing from the end — `message[-6:]`
- Reverse slicing with a step — `message[::-1]`
- A small, story-motivated amount of string manipulation — `message.upper()`, `message.replace(...)`

Each syntax example is revealed only after the learner has already solved the corresponding problem by hand.

## How to run it

This is a fully standalone HTML/CSS/JS module — no build step, no server, no dependencies.

1. Open `index.html` directly in any modern browser, **or**
2. Serve the folder locally, e.g.:
   ```
   npx serve summership-26-prs/Shiv/Royal-Scribes-Secret
   ```
3. Work through the 8 stages using the **Back** / **Next** buttons at the bottom of the screen.

No API keys, no `.env` file, and no external network requests are required.

## Learning flow

| Stage | What happens |
|---|---|
| 1. The Inscription | Tap characters on a stone tablet to notice that a string is an ordered sequence. |
| 2. Every Character Has a Place | Discover indexing by finding the character at a given position. |
| 3. The Hidden Word | Select a range of characters to discover slicing, and why the stop index is excluded. |
| 4. The Scribe's Shortcut | Find the last character and the last word without counting from the start — negative indexing. |
| 5. The Reversed Inscription | Read a backward-carved warning and discover `[::-1]`. |
| 6. Repair the Royal Message | Choose the right string method to clean up a miscarved inscription. |
| 7. Codebreaker Training | Six short, varied practice rounds with immediate, explanatory feedback. |
| 8. The Final Cipher | An independent assessment — the learner decides which operation fits, without being told. |

## Project structure

```
Royal-Scribes-Secret/
├── index.html
├── css/
│   ├── base.css
│   ├── inscription.css
│   └── components.css
├── js/
│   ├── lessonData.js
│   ├── lessonEngine.js
│   ├── renderer.js
│   ├── interactions.js
│   └── navigation.js
├── README.md
├── product.md
├── context.md
└── change.md
```

## Design decisions

- **No frameworks** — vanilla HTML/CSS/JS, matching the simplest existing standalone contributions in `summership-26-prs/`.
- **Data-driven content** — all story text, tasks, and correct answers live in `js/lessonData.js`; the other JS modules are generic engines that read that data.
- **Concept before syntax** — every step's interactive challenge is solved *before* its Python code panel is revealed.
- **One shared tablet per stage** — rather than duplicating a stone-tablet visual for each sub-task, stages with two related tasks (e.g. Stage 4) reuse the same tablet across phases.

## Author

**Ayush Anand** — Designed and developed The Royal Scribe's Secret, including the Suryagarh story, the indexing/slicing learning journey, interactive tablet mechanics, and technical documentation.

Part of the **PyBe** platform.
