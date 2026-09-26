# Story Bridge

Most of us heard the Panchatantra long before we wrote a line of code. The thirsty crow,
the blue jackal, the monkey who stole the caps. We know those stories without trying.

Story Bridge starts from there. Each lesson takes a story you already know, then shows you
the one place where its logic and a Python idea turn out to be the same thing. The crow drops
pebbles until the water is high enough to drink, and that is a while loop. The jackal falls
into a vat of dye and everyone treats him as a king until he howls. That is a value that looks
like one type and behaves like another.

The point is simple. When the story is already familiar, you are not learning two new things
at once. All of your attention can go to the Python.

## What's here

There are two ways in.

**The app** (`story-bridge/`) is the main thing. It is a small React and Express app with two
collections:

- **Folk tales.** 25 stories covering 19 Python concepts, mostly from the Panchatantra, with a
  few from Aesop and one Greek myth. Six concepts have two different stories, so if you don't
  know the first one there is another way in.
- **Real world.** 24 stories covering 24 concepts, added after my mentor suggested I focus on
  real examples. These are things that actually happened, or systems you use every week. The
  gate on your boarding pass that no longer matches the board. The OpenSSH bug that came down
  to one character, `>` where it needed `>=`. The Mars lander that trusted a sensor at the
  wrong moment. Every fact in these is checked against a source, and the sources are listed
  under the story.

**The case studies** (`case-studies/`) are the 25 folk tales written out as markdown, so you
can read them here on GitHub without running anything. Start at
[`case-studies/index.md`](case-studies/index.md).

## How a lesson works

Every story goes through the same three screens.

1. **The story.** Four illustrated panels. There are no Python words on this screen at all,
   on purpose. You should just be reading a story.
2. **The bridge.** The story's parts are lined up against the Python, one row at a time. Then
   the same rule is shown as code you can run. Then a short note on where the comparison
   breaks down, because an analogy that is never questioned turns into a misconception of its
   own.
3. **Three questions.** The first asks you to find the idea inside the story. The second asks
   you to read it in Python. The third puts it in a situation the story never mentioned. That
   last one is the one I care about most. It tells you whether you learned the concept or just
   remembered the story.

The answers are checked on the server and never sent to the browser.

## Running it

You need Node 18 or newer.

```bash
cd story-bridge
npm run install:all
npm run dev
```

Then open http://localhost:5173. The API runs on port 5000.

If you finish a few quizzes, `npm run misconceptions` prints which wrong answers people chose
most often, per question. That tells you which parts of an explanation aren't landing.

## Adding a story

Each story is one entry in `story-bridge/server/src/data/stories.json` plus four panel images.
No code changes are needed.
[`story-bridge/docs/CONTENT_GUIDE.md`](story-bridge/docs/CONTENT_GUIDE.md) explains how to
write one, and most of it is about the part people skip: checking that the story really has
the same structure as the concept, and isn't just vaguely related to it. The Tortoise and the
Hare, for example, doesn't work. It has a moral, but no mechanism to map.

The panels are generated SVGs. To redraw them you need Python 3:

```bash
python story-bridge/tools/make_panels.py        # folk tales
python story-bridge/tools/make_real_panels.py   # real world
```

The thinking behind the design, with the research it leans on, is in
[`story-bridge/docs/product.md`](story-bridge/docs/product.md).

## Folder layout

| Path | What it is |
|---|---|
| `story-bridge/client/` | React app (Vite). The lesson screens are in `src/stories/` |
| `story-bridge/client/public/` | Panel art: `stories/` for folk tales, `real/` for real world |
| `story-bridge/server/` | Express API. Stories, grading and progress are in `src/data/storyStore.js` |
| `story-bridge/tools/` | Panel generators and the misconception report |
| `story-bridge/docs/` | Design notes and the guide for writing stories |
| `case-studies/` | The folk tales as readable markdown |

## A few honest limitations

- The illustrations are simple generated placeholders, not real artwork. The file paths are
  stable, so proper illustrations could replace them without touching anything else.
- Familiarity depends on who you are. These tales are well known in India, but less so
  elsewhere, and a real incident from 1999 is known by name, if at all. The stories are
  written to make sense on their own, but the idea works best when the story is already yours.
- I have no data yet on whether this actually helps people learn better. The misconception
  report is there to start collecting some.
- Progress is saved to a local JSON file, and there are no user accounts.

## About the stories

Every retelling is my own writing, based on public-domain tales. Modern translations of the
Panchatantra and of Aesop are still under copyright, and I didn't use any of them.

Built by Sartaj Singh for PyBe, Summership 2026. I first built Story Bridge as a mode inside
the PyBe app, and this folder packages it so it runs on its own.
