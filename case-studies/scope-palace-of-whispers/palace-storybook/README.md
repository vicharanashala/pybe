# The Palace of Whispers

*A little adventure into the mystery of Python.*

An illustrated, animated storybook that teaches Python's **LEGB name-resolution rule** to
complete beginners. Tara and her parrot Mithu follow the mystery of one word, `gift`, through
a magical palace. Only at the end does the story reveal the small Python program it was
secretly describing.

**Live:** https://simranjitkaur543.github.io/palace-of-whispers/

## The story

| Page | Scene | What the learner discovers |
|---|---|---|
| Opening | The palace in the distance | The title, and "Enter the Palace" |
| 1 | The Palace That Whispers | The mystery: *What does this name mean?* |
| 2 | Tara's Room | **Local**: `gift = "Teddy Bear"` belongs to her room |
| 3 | The Nested Study | **Enclosing**: a little nook inside a bigger study borrows the study's `gift = "Book"` |
| 4 | The Grand Hall | **Global**: the palace noticeboard's `gift = "Bicycle"` belongs to everyone |
| 5 | The Enchanted Toolbox | **Built-in**: `print()`, `len()` and `range()` are already there |
| 6 | The Mystery of the Missing Gift | **L → E → G → B**: Python stops at the first match |
| 7 | The Real Python Reveal | One program, revealed a few lines at a time. It prints `Teddy Bear` |
| 8 | One Last Discovery | Remove one line, and it prints `Book` |

The learner should finish able to explain, in simple words, why the program prints
"Teddy Bear", and then "Book" once `inner()` has no `gift` of its own.

There are no points, timers or scores: one meaningful interaction at a time, with gentle
feedback on the two small questions.

## Run it locally

You need [Node.js](https://nodejs.org/) 18 or newer.

```bash
cd palace-storybook
npm install
npm run dev
```

Then open the address it prints (http://localhost:5176).

## Build and deploy

```bash
npm run build
```

The finished site is written to `dist/`. It uses relative paths and `#/page/…` addresses,
so it works on GitHub Pages from any sub-folder with no server setup.

## How the code is organised

```
palace-storybook/
├── index.html            page shell: small top bar (title, progress, sound) and the book
└── src/
    ├── main.js           the opening scene, page addresses, progress dots, sound toggle
    ├── scenes.js         the story: every page's words, interactions and code, as data
    ├── book.js           turns a scene into a page and plays its steps
    ├── art/
    │   ├── characters.js Tara and Mithu (inline SVG, with moods, walking and flapping)
    │   └── scenery.js    the palace, hallway, room, study, hall and workshop
    ├── sound.js          gentle sounds made in the browser (off by default)
    ├── util.js           small helpers, and the Python code display
    └── styles.css        palette, fonts, layout and animations
```

To change the story's words or code, edit `src/scenes.js`. The pages are built from it.

## Built with

Vite, HTML, CSS and vanilla JavaScript. Every illustration is inline SVG; there are no image
files and no runtime dependencies. The site is keyboard accessible, works from 375px phones
to desktop, and honours the reduced-motion setting.
